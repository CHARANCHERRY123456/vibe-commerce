# Backend (Express + MongoDB)

This folder contains a minimal Node/Express backend that uses MongoDB via Mongoose.

Setup

1. Copy `.env.example` to `.env` and update `MONGO_URI` if needed.

2. Install dependencies and seed:

```bash
cd backend
npm install
npm run seed
npm run dev
```

By default the server listens on port `4000` and exposes the required endpoints under `/api`:

- `GET /api/products` — list products
- `POST /api/cart` — add/update cart item
- `GET /api/cart?sessionId=...` — get cart and total
- `DELETE /api/cart/:id` — remove cart item
- `POST /api/checkout` — create order and clear cart
