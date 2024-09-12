const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userId: { type: String, unique: true, default: () => uuidv4() }, // Use a function to generate a unique ID
}, {
  timestamps: true,
});

const User = mongoose.model('User', UserSchema);
module.exports = User;