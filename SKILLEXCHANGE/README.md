# SKILLEXCHANGE

Marketplace for buying and selling skills. React + Vite + TypeScript, Node/Express, Socket.IO, Stripe Checkout.

## Frontend

```bash
cd /workspace/SKILLEXCHANGE
cp .env.example .env
npm install
npm run dev
```

- VITE_API_URL: URL of the backend (default http://localhost:4000)
- VITE_STRIPE_PUBLISHABLE_KEY: Your Stripe publishable key (optional for Checkout redirect flow)

## Backend

```bash
cd /workspace/SKILLEXCHANGE/server
cp .env.example .env
# set STRIPE_SECRET_KEY to your test secret key
npm install
npm run dev
```

- PORT: Backend port (default 4000)
- CORS_ORIGIN: Allowed origins (comma separated)
- STRIPE_SECRET_KEY: Stripe secret key for creating Checkout sessions

## Features
- Routing: Home, Browse, Sell, Chat, Checkout
- Real-time chat: Socket.IO rooms via `?room=roomId&user=name`
- Payments: Stripe Checkout session creation and redirect