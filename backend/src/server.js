const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

function createApp() {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Routes
  app.use('/api/products', productsRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/checkout', checkoutRouter);

  // Simple health check
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  return app;
}

module.exports = createApp;
