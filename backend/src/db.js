const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vibe-commerce';

async function connectDB() {
  // Return the mongoose connection promise so callers can await it
  return mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

module.exports = {
  connectDB,
  mongoose,
};
