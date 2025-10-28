const { z } = require('zod');

const customerSchema = z.object({ name: z.string().min(1, 'name is required'), email: z.string().email('invalid email') });

const checkoutSchema = z.object({ sessionId: z.string().min(1, 'sessionId is required'), customer: customerSchema });

function validateCheckout(payload) {
  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    const msgs = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    const err = new Error(msgs.join('; '));
    err.status = 400;
    throw err;
  }
  return parsed.data;
}

module.exports = { validateCheckout };
