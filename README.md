## MM Monorepo Documentation

This repository contains a full-stack application for coordinating food donations between donors and NGOs, with an admin interface for approvals and support. It includes:

- Backend: Node.js/Express API with MongoDB (Mongoose), JWT auth, file uploads via Supabase Storage
- Frontend: React (Vite) SPA with role-based protected routes for Donor, NGO, and Admin

### Quick Links

- Backend setup: `docs/ENV.md`
- API reference: `docs/API.md`
- Data models: `docs/MODELS.md`
- Architecture: `docs/ARCHITECTURE.md`
- Frontend overview: `frontend/README.md`

### Getting Started

1) Clone and install dependencies

```
git clone <repo-url>
cd backend && npm install
cd ../frontend && npm install
```

2) Configure environment variables

See `docs/ENV.md` for required `.env` variables for backend (MongoDB, JWT, Supabase, email).

3) Run locally

```
# terminal 1
cd backend
npm run dev

# terminal 2
cd frontend
npm run dev
```

Default backend base URL: `http://localhost:5000`  
Default frontend URL (Vite): `http://localhost:5173`

### Monorepo Structure

```
backend/          # Express API, Mongoose models, routes, middlewares, utils
frontend/         # React app (Vite), pages, components, contexts
docs/             # Architecture, API, models, and env documentation
```

### Scripts

See `backend/package.json` and `frontend/package.json` for available scripts (dev, build, etc.).


