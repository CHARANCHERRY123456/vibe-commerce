const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');
const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /api/checkout
// body: { sessionId, customer: { name, email } }
router.post('/', async (req, res) => {
  try {
    const { sessionId, customer } = req.body;
    if (!sessionId || !customer || !customer.name || !customer.email) {
      return res.status(400).json({ error: 'sessionId and customer { name, email } are required' });
    }

    const items = await CartItem.find({ session_id: sessionId }).populate('product').lean();
    if (!items || items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    const orderItems = items.map(i => ({
      product_id: i.product._id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      subtotal: i.product.price * i.quantity
    }));

    const total = orderItems.reduce((s, it) => s + it.subtotal, 0);

    const order = await Order.create({
      customer_name: customer.name,
      customer_email: customer.email,
      total,
      items: orderItems
    });

    // Clear cart for session
    await CartItem.deleteMany({ session_id: sessionId });

    res.json({ orderId: order._id, total, timestamp: order.createdAt, items: orderItems });
  } catch (err) {
    console.error('Checkout error', err);
    res.status(500).json({ error: 'Failed to complete checkout' });
  }
});

module.exports = router;
