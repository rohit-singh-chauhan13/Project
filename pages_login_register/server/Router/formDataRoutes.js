const express = require('express');
const router = express.Router();
const EmployeeModel = require('../models/Employee'); // Adjust the path as needed

// PATCH request to update an item
router.patch('/api/formdata/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isDeleted } = req.body;

    // Find the item and update it
    const result = await EmployeeModel.findByIdAndUpdate(id, { isDeleted }, { new: true });
    if (!result) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/formdata', async (req, res) => {
  try {
    const { email } = req.query;
    
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find form data associated with the user
    const formData = await FormData.find({ userId: user._id });
    res.json(formData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
