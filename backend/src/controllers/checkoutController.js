const checkoutService = require('../services/checkoutService');
const { validateCheckout } = require('../validators/checkoutValidator');
const ApiError = require('../errors/ApiError');

async function doCheckout(req, res) {
  try {
    const data = validateCheckout(req.body);
    const out = await checkoutService.checkout(data);
    res.json(out);
  } catch (err) {
    if (err && err.status === 400) throw new ApiError(400, err.message);
    throw err;
  }
}

module.exports = {
  doCheckout,
};
