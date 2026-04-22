const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// Get cart by user
router.get('/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [], totalPrice: 0 });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/:userId/add', async (req, res) => {
  try {
    const { productId, productName, price, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, productName, price, quantity });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
router.post('/:userId/remove', async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.post('/:userId/clear', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
