const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Middleware to verify token (simplified)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  next();
};

// Create order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, deliveryAddress, deliveryCity, deliveryZipCode, phone, notes } = req.body;
    const userId = req.headers['x-user-id']; // In real app, extract from JWT

    const orderId = `ORD-${Date.now()}`;
    const order = new Order({
      orderId,
      userId,
      items,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      deliveryCity,
      deliveryZipCode,
      phone,
      notes,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get orders by user
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all orders (Admin)
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (Admin)
router.patch('/:orderId', verifyToken, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { orderStatus, paymentStatus },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
