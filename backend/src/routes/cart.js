const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const asyncHandler = require('../middleware/asyncHandler');

// POST /api/cart  -> { productId, qty, sessionId }
router.post('/', asyncHandler(cartController.addToCart));

// GET /api/cart?sessionId=...
router.get('/', asyncHandler(cartController.getCart));

// DELETE /api/cart/:id
router.delete('/:id', asyncHandler(cartController.removeCartItem));

// PATCH /api/cart/:id -> update quantity
router.patch('/:id', asyncHandler(cartController.updateCartItem));

module.exports = router;
