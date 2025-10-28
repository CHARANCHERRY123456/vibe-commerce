const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vibe-commerce';

async function connectDB() {
  return mongoose.connect(MONGO_URI);
}

module.exports = {
  connectDB,
  mongoose,
};
