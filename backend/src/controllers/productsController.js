const productsService = require('../services/productsService');
const { validateCreateProduct } = require('../validators/productValidator');
const ApiError = require('../errors/ApiError');

async function listProducts(req, res) {
  const products = await productsService.getAllProducts();
  res.json(products);
}

async function createProduct(req, res) {
  try {
    const data = validateCreateProduct(req.body);
    const created = await productsService.createProduct(data);
    res.status(201).json(created);
  } catch (err) {
    if (err && err.status === 400) throw new ApiError(400, err.message);
    throw err;
  }
}

module.exports = {
  listProducts,
  createProduct,
};
