const ApiError = require('../errors/ApiError');

module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof ApiError) {
    const payload = { error: err.message };
    if (err.details) payload.details = err.details;
    return res.status(err.statusCode).json(payload);
  }

  // For validation errors thrown by mongoose or similar
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error', details: err.errors });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
};
