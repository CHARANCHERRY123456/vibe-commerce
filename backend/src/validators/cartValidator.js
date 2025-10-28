const { z } = require('zod');
const mongoose = require('mongoose');

const addToCartSchema = z.object({
  productId: z.string().min(1, 'productId is required'),
  qty: z.number().int().min(1).optional(),
  sessionId: z.string().min(1, 'sessionId is required')
});

function validateAddToCart(payload) {
  const parsed = addToCartSchema.safeParse(payload);
  if (!parsed.success) {
    const msgs = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    const err = new Error(msgs.join('; '));
    err.status = 400;
    throw err;
  }
  // basic ObjectId check
  if (!mongoose.Types.ObjectId.isValid(parsed.data.productId)) {
    const err = new Error('productId is not a valid id');
    err.status = 400;
    throw err;
  }
  return parsed.data;
}

const updateQtySchema = z.object({ qty: z.number().int().min(1) });
function validateUpdateQty(payload) {
  const parsed = updateQtySchema.safeParse(payload);
  if (!parsed.success) {
    const msgs = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    const err = new Error(msgs.join('; '));
    err.status = 400;
    throw err;
  }
  return parsed.data;
}

module.exports = { validateAddToCart, validateUpdateQty };
