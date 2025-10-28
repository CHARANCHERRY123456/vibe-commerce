const CartItem = require('../models/CartItem');
const Order = require('../models/Order');
const ApiError = require('../errors/ApiError');

async function checkout({ sessionId, customer }) {
  if (!sessionId || !customer || !customer.name || !customer.email) {
    throw new ApiError(400, 'sessionId and customer { name, email } are required');
  }

  const items = await CartItem.find({ session_id: sessionId }).populate('product').lean();
  if (!items || items.length === 0) throw new ApiError(400, 'Cart is empty');

  const orderItems = items.map(i => ({
    product_id: i.product._id,
    name: i.product.name,
    price: i.product.price,
    quantity: i.quantity,
    subtotal: i.product.price * i.quantity
  }));

  const total = orderItems.reduce((s, it) => s + it.subtotal, 0);

  const order = await Order.create({
    customer_name: customer.name,
    customer_email: customer.email,
    total,
    items: orderItems
  });

  // Clear cart for session
  await CartItem.deleteMany({ session_id: sessionId });

  return { orderId: order._id, total, timestamp: order.createdAt, items: orderItems };
}

module.exports = { checkout };
