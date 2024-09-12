require('dotenv').config(); // Ensure this is at the top
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const EmployeeModel = require('./models/Employee');
const FormData = require('./models/FormData');
const formDataRoutes = require('./Router/formDataRoutes');

// Import config
const config = require('./config');

const app = express();
app.use(express.json());
app.use(cors({
  origin: config.frontendOrigin,
}));

// Directory path
const uploadDir = path.join(__dirname, 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Retry logic for MongoDB connection
const connectWithRetry = () => {
  console.log('Attempting to connect to MongoDB...');
  mongoose.connect(config.mongodbUri)
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    });
};

connectWithRetry();

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadDir));

// Use routes
app.use('/api/formdata', formDataRoutes);

// Test route for debugging
app.get('/api/formdata/test', (req, res) => {
  res.send('Form data test route is working!');
});

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, config.accessTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Protected route for fetching user details
app.get('/api/user-details', authenticateToken, async (req, res) => {
  try {
    const user = await EmployeeModel.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ email: user.email, userId: user.userId });
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for uploading user form data
app.post('/api/upload-user', upload.single('certificate'), async (req, res) => {
  try {
    const { email, websiteURL, publicIP, hasLBIP, lbip, privateIP, applicationManager, hod, hog } = req.body;
    const certificate = req.file ? req.file.filename : null;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await EmployeeModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const formData = new FormData({
      userId: user.userId,
      websiteURL,
      publicIP,
      hasLBIP,
      lbip,
      privateIP,
      certificate,
      applicationManager,
      hod,
      hog,
    });

    const data = await formData.save();
    res.json({ message: 'Form data saved successfully', data });
  } catch (err) {
    console.error('Error saving form data:', err);
    res.status(500).json({ error: 'Error saving form data', details: err });
  }
});

// Route for fetching form data by email
app.get('/api/formdata', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await EmployeeModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const formData = await FormData.find({ userId: user.userId });
    if (!formData || formData.length === 0) {
      return res.status(404).json({ error: 'Form data not found for this user' });
    }

    res.json(formData);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new EmployeeModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal server error");
  }
});

// Login Route
const LOCK_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_FAILED_ATTEMPTS = 5;

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await EmployeeModel.findOne({ email });

    if (!user) {
      return res.status(401).json("No record existed");
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json("Incorrect login attempts exceeded. Try again later.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      user.failedLoginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ email: user.email, userId: user.userId }, config.accessTokenSecret, { expiresIn: '1h' });
      return res.json({ token });

    } else {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
      }

      await user.save();
      return res.status(401).json("Password is incorrect");
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal server error");
  }
});

app.put('/api/formdata/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const formData = await FormData.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!formData) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Status updated successfully', formData });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Admin Login Route
app.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;

  if (username === config.adminUsername && password === config.adminPassword) {
    const token = jwt.sign({ username, role: 'admin' }, config.accessTokenSecret, { expiresIn: '1h' });
    return res.json({ token });
  } else {
    return res.status(401).json("Invalid admin credentials");
  }
});

// Route for deleting form data
app.delete('/api/formdata/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await FormData.findByIdAndDelete(id);
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('Error deleting form data:', err);
    res.status(500).json('Internal server error');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.get('/api/formdata1', async (req, res) => {
  try {
    const data = await FormData.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching form data:', error);
    res.status(400).json({ message: 'Bad Request' });
  }
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});