const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  session_id: { type: String, required: true, index: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('CartItem', CartItemSchema);
