const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// POST /api/cart  -> { productId, qty, sessionId }
router.post('/', async (req, res) => {
  try {
    const { productId, qty = 1, sessionId } = req.body;
    if (!productId || !sessionId) return res.status(400).json({ error: 'productId and sessionId are required' });
    if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).json({ error: 'Invalid productId' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let item = await CartItem.findOne({ session_id: sessionId, product: productId });
    if (item) {
      item.quantity = item.quantity + qty;
      await item.save();
    } else {
      item = await CartItem.create({ session_id: sessionId, product: productId, quantity: qty });
    }

    const populated = await CartItem.findById(item._id).populate('product').lean();
    res.json({ id: populated._id, product_id: populated.product._id, quantity: populated.quantity, product: { name: populated.product.name, price: populated.product.price, image_url: populated.product.image_url } });
  } catch (err) {
    console.error('Error adding to cart', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// GET /api/cart?sessionId=...
router.get('/', async (req, res) => {
  try {
    const sessionId = req.query.sessionId;
    if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });
    const items = await CartItem.find({ session_id: sessionId }).populate('product').lean();
    const mapped = items.map(i => ({ id: i._id, product_id: i.product._id, quantity: i.quantity, products: { name: i.product.name, price: i.product.price, image_url: i.product.image_url } }));
    const total = mapped.reduce((sum, it) => sum + (it.products.price * it.quantity), 0);
    res.json({ items: mapped, total });
  } catch (err) {
    console.error('Error fetching cart', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// DELETE /api/cart/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'id is required' });
    await CartItem.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting cart item', err);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
});

module.exports = router;
