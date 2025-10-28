const productsService = require('../services/productsService');

async function listProducts(req, res) {
  const products = await productsService.getAllProducts();
  res.json(products);
}

async function createProduct(req, res) {
  const created = await productsService.createProduct(req.body);
  res.status(201).json(created);
}

module.exports = {
  listProducts,
  createProduct,
};
