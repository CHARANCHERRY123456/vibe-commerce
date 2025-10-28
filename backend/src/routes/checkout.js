const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const asyncHandler = require('../middleware/asyncHandler');

// POST /api/checkout
router.post('/', asyncHandler(checkoutController.doCheckout));

module.exports = router;
