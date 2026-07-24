# Meal Mission 🍱

A full-stack food donation platform that connects food donors with NGOs in the same city. Donors post food pickup requests, NGOs accept and fulfill them, and an admin manages NGO approvals and support tickets.

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), Redis (ioredis), JWT, Nodemailer, Multer, Supabase Storage, Zod, Swagger

**Frontend:** React, Vite

**DevOps:** Docker, Docker Compose

---

## Features

### Donor
- Register with email OTP verification
- Post food pickup requests with optional image upload
- Track active requests and donation history
- Cancel pending requests
- Submit support tickets

### NGO
- Register with document proof upload (stored on Supabase)
- Await admin approval before login
- Browse pending pickup requests in their city (last 4 hours)
- Accept, complete, or reject donation requests

### Admin
- Approve or reject NGO registrations with reason
- View and manage support tickets (donor + NGO)
- Delete NGOs from the platform

---

## Advanced Backend Features

| Feature | Details |
|---|---|
| **JWT Refresh Tokens** | Short-lived access tokens (15min) + long-lived refresh tokens (7d) in httpOnly cookies |
| **Redis** | OTP blacklisting, refresh token revocation on logout |
| **Rate Limiting** | `express-rate-limit` on all auth and pickup routes |
| **Zod Validation** | Schema validation on all request bodies |
| **Global Error Handler** | Centralised error middleware with consistent responses |
| **MongoDB Indexes** | Compound index on Donation(city, status, createdAt), email indexes on Donor and NGO |
| **Pagination** | `page` and `limit` query params on all list endpoints |
| **Swagger Docs** | Interactive API docs at `/api-docs` |
| **Docker** | Containerised backend + Redis via Docker Compose |

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Supabase account (for storage)
- Redis Cloud account (or run locally via Docker)

### Local Setup

```bash
# Clone the repo
git clone https://github.com/adwait50/Meal_Mission.git
cd Meal_Mission

# Install backend dependencies
cd backend
npm install

# Add environment variables
# Create backend/utils/.env with the variables listed below

# Start the backend
npm run dev

# Install frontend dependencies
cd ../frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file at `backend/utils/.env`:

```env
MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=
REDIS_URL=
RESEND_API_KEY=
NODE_ENV=development
```

---

### Run with Docker

```bash
# From the project root
docker-compose up --build
```

This starts the backend on port 5000 and a local Redis instance. MongoDB and Supabase still use cloud connections from your `.env`.

---

## API Documentation

Once the server is running, visit:

```
http://localhost:5000/api-docs
```

Interactive Swagger UI with all endpoints documented including request bodies, parameters, and responses.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/donors/register` | Register donor |
| POST | `/api/donors/login` | Donor login |
| POST | `/api/donors/refresh-token` | Get new access token |
| GET | `/api/donors/dashboard` | Donor profile |
| GET | `/api/donors/active-requests` | Active donations (paginated) |
| GET | `/api/donors/donation-history` | Donation history (paginated) |
| POST | `/api/pickup/request-pickup` | Submit food pickup request |
| POST | `/api/ngo/register` | Register NGO with document |
| POST | `/api/ngo/login` | NGO login |
| GET | `/api/ngo/food-pickup-requests` | Browse requests in city (paginated) |
| PUT | `/api/ngo/donation/:id/accept` | Accept a donation |
| PUT | `/api/ngo/donation/:id/completed` | Mark donation completed |
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/pending` | Pending NGO approvals |
| PUT | `/api/admin/approve-ngo/:id` | Approve NGO |
| PUT | `/api/admin/reject-ngo/:id` | Reject NGO |

---

## Project Structure

```
Meal_Mission/
├── backend/
│   ├── config/          # DB, Supabase, Redis clients
│   ├── middlewares/     # Auth middlewares, error handler, Zod validator
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # Email, multer config
│   ├── validators/      # Zod schemas
│   ├── Dockerfile
│   └── server.js
├── frontend/
│   └── src/
├── docker-compose.yml
└── README.md
```

---

## Author

**Adwait** — [github.com/adwait50](https://github.com/adwait50)