const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vibe-commerce';

const products = [
  { name: 'Vibe Headphones', price: 59.99, description: 'Comfortable over-ear headphones', image_url: '/images/headphones.jpg' },
  { name: 'Vibe Wireless Charger', price: 29.99, description: 'Fast wireless charging pad', image_url: '/images/charger.jpg' },
  { name: 'Vibe Smartwatch', price: 199.99, description: 'Fitness tracking smartwatch', image_url: '/images/smartwatch.jpg' },
  { name: 'Vibe Backpack', price: 79.99, description: 'Waterproof travel backpack', image_url: '/images/backpack.jpg' },
  { name: 'Vibe Sunglasses', price: 24.99, description: 'Stylish polarized sunglasses', image_url: '/images/sunglasses.jpg' },
  { name: 'Vibe Phone Case', price: 14.99, description: 'Slim protective case', image_url: '/images/phone-case.jpg' },
  { name: 'Vibe Laptop Sleeve', price: 34.99, description: 'Protective laptop sleeve', image_url: '/images/laptop-sleeve.jpg' },
  { name: 'Vibe Water Bottle', price: 19.99, description: 'Insulated stainless bottle', image_url: '/images/water-bottle.jpg' }
];

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  for (const p of products) {
    const exists = await Product.findOne({ name: p.name });
    if (!exists) {
      await Product.create(p);
      console.log('Inserted', p.name);
    } else {
      console.log('Already exists', p.name);
    }
  }

  console.log('Seeding complete');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
