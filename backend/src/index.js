const dotenv = require('dotenv');
const { connectDB } = require('./db');
const createApp = require('./server');

dotenv.config();

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const app = createApp();
    const notFound = require('./middleware/notFound');
    const errorHandler = require('./middleware/errorHandler');

  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
