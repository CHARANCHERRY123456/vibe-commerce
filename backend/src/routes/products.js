const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const asyncHandler = require('../middleware/asyncHandler');

router.get('/', asyncHandler(productsController.listProducts));

router.post('/', asyncHandler(productsController.createProduct));

module.exports = router;
