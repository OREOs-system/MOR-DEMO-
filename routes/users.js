const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  // For now, we'll assume the token contains role info
  // In a real app, you'd verify the JWT and check role
  // For simplicity, we'll skip auth for now
  next();
};

// Get all users
router.get('/', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by ID
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { firstName, lastName, contact, address, city, zipCode, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, contact, address, city, zipCode, role },
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;