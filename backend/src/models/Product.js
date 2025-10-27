const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  image_url: { type: String, default: '' },
  stock: { type: Number, default: 999 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
