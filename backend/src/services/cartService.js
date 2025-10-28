const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const ApiError = require('../errors/ApiError');

async function addToCart({ productId, qty = 1, sessionId }) {
  if (!productId || !sessionId) throw new ApiError(400, 'productId and sessionId are required');
  if (!mongoose.Types.ObjectId.isValid(productId)) throw new ApiError(400, 'Invalid productId');

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  let item = await CartItem.findOne({ session_id: sessionId, product: productId });
  if (item) {
    item.quantity = item.quantity + qty;
    await item.save();
  } else {
    item = await CartItem.create({ session_id: sessionId, product: productId, quantity: qty });
  }

  const populated = await CartItem.findById(item._id).populate('product').lean();
  return { id: populated._id, product_id: populated.product._id, quantity: populated.quantity, product: { name: populated.product.name, price: populated.product.price, image_url: populated.product.image_url } };
}

async function getCart(sessionId) {
  if (!sessionId) throw new ApiError(400, 'sessionId is required');
  const items = await CartItem.find({ session_id: sessionId }).populate('product').lean();
  const mapped = items.map(i => ({ id: i._id, product_id: i.product._id, quantity: i.quantity, products: { name: i.product.name, price: i.product.price, image_url: i.product.image_url } }));
  const total = mapped.reduce((sum, it) => sum + (it.products.price * it.quantity), 0);
  return { items: mapped, total };
}

async function removeCartItem(id) {
  if (!id) throw new ApiError(400, 'id is required');
  await CartItem.findByIdAndDelete(id);
  return { success: true };
}

async function updateCartItem(id, qty) {
  if (!id) throw new ApiError(400, 'id is required');
  if (!qty || qty < 1) throw new ApiError(400, 'qty must be >= 1');
  const item = await CartItem.findById(id);
  if (!item) throw new ApiError(404, 'Cart item not found');
  item.quantity = qty;
  await item.save();
  const populated = await CartItem.findById(item._id).populate('product').lean();
  return { id: populated._id, product_id: populated.product._id, quantity: populated.quantity, products: { name: populated.product.name, price: populated.product.price, image_url: populated.product.image_url } };
}

module.exports = {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
};
