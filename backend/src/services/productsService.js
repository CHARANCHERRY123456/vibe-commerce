const Product = require('../models/Product');
const ApiError = require('../errors/ApiError');

async function getAllProducts() {
  const products = await Product.find().sort('name').lean();
  return products.map(p => ({ id: p._id, name: p.name, price: p.price, description: p.description, image_url: p.image_url, stock: p.stock }));
}

async function createProduct(payload) {
  const { name, price, description = '', image_url = '', stock = 0 } = payload;
  if (!name || typeof price !== 'number') {
    throw new ApiError(400, 'Invalid product payload: `name` and numeric `price` are required');
  }

  const existing = await Product.findOne({ name });
  if (existing) {
    throw new ApiError(409, 'Product already exists');
  }

  const created = await Product.create({ name, price, description, image_url, stock });
  return { id: created._id, name: created.name, price: created.price, description: created.description, image_url: created.image_url, stock: created.stock };
}

module.exports = {
  getAllProducts,
  createProduct,
};
