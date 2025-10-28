const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/products
router.get('/', asyncHandler(productsController.listProducts));

// POST /api/products (dev/admin)
router.post('/', asyncHandler(productsController.createProduct));

module.exports = router;
