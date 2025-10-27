const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort('name').lean();
    // normalize id
    const out = products.map(p => ({ id: p._id, name: p.name, price: p.price, description: p.description, image_url: p.image_url, stock: p.stock }));
    res.json(out);
  } catch (err) {
    console.error('Error fetching products', err);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

module.exports = router;
