const checkoutService = require('../services/checkoutService');

async function doCheckout(req, res) {
  const { sessionId, customer } = req.body;
  const out = await checkoutService.checkout({ sessionId, customer });
  res.json(out);
}

module.exports = {
  doCheckout,
};
