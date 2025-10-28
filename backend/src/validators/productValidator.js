const { z } = require('zod');
const productSchema = z.object({
  name: z.string().min(1, 'name is required'),
  price: z.number().nonnegative('price must be >= 0'),
  description: z.string().optional().or(z.literal('')),
  image_url: z.string().optional().or(z.literal('')),
  stock: z.number().int().nonnegative().optional()
});

function validateCreateProduct(payload) {
  const parsed = productSchema.safeParse(payload);
  if (!parsed.success) {
    const msgs = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    const err = new Error(msgs.join('; '));
    err.status = 400;
    throw err;
  }
  return parsed.data;
}

module.exports = { validateCreateProduct };
