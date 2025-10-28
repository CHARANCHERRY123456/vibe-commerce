const cartService = require('../services/cartService');
const { validateAddToCart, validateUpdateQty } = require('../validators/cartValidator');
const ApiError = require('../errors/ApiError');

async function addToCart(req, res) {
  try {
    const data = validateAddToCart(req.body);
    const out = await cartService.addToCart(data);
    res.json(out);
  } catch (err) {
    if (err && err.status === 400) throw new ApiError(400, err.message);
    throw err;
  }
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
  try {
    const id = req.params.id;
    const data = validateUpdateQty(req.body);
    const out = await cartService.updateCartItem(id, data.qty);
    res.json(out);
  } catch (err) {
    if (err && err.status === 400) throw new ApiError(400, err.message);
    throw err;
  }
}

module.exports = {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
};
