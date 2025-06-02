const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
  username: { // ✅ Added name field
    type: String,
    required: true,
    trim: true // Removes whitespace from both ends of a string
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true // Stores emails in lowercase
  },
  password: { // This will store the HASHED password
    type: String,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Create and export the User model
module.exports = mongoose.model('User', userSchema);