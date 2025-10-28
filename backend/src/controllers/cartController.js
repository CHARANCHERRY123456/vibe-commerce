const cartService = require('../services/cartService');

async function addToCart(req, res) {
  const { productId, qty, sessionId } = req.body;
  const out = await cartService.addToCart({ productId, qty, sessionId });
  res.json(out);
}

async function getCart(req, res) {
  const sessionId = req.query.sessionId;
  const out = await cartService.getCart(sessionId);
  res.json(out);
}

async function removeCartItem(req, res) {
  const id = req.params.id;
  const out = await cartService.removeCartItem(id);
  res.json(out);
}

async function updateCartItem(req, res) {
  const id = req.params.id;
  const { qty } = req.body;
  const out = await cartService.updateCartItem(id, qty);
  res.json(out);
}

module.exports = {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
};
