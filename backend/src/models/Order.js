const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  customer_email: { type: String, required: true },
  total: { type: Number, required: true },
  items: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
      subtotal: Number
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
