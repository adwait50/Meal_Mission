## Environment & Setup

Create a `.env` file at `backend/utils/.env`:

```
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# JWT
JWT_SECRET=replace-with-strong-secret
JWT_REFRESH_SECRET=replace-with-different-strong-secret

# Supabase (Storage)
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_BUCKET=<bucket-name>

# Email (Gmail with App Password)
# Requires 2-Step Verification enabled on Gmail account
# Generate App Password: Google Account → Security → App Passwords
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx

# Redis
REDIS_URL=redis://default:<password>@<host>:<port>

# Resend (alternative email provider)
RESEND_API_KEY=re_xxxxxxxxxx

# Environment
NODE_ENV=development
```

> Note: When running with Docker, `REDIS_URL` is automatically overridden to `redis://redis:6379` by `docker-compose.yml`. You do not need to change it manually.

---

### Install & Run (Local)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.

---

### Run with Docker

```bash
# From project root
docker-compose up --build
```

This starts:
- Backend on port `5000`
- Redis on port `6379`

MongoDB and Supabase still use cloud connections from your `.env`.

To stop:
```bash
docker-compose down
```

---

### CORS

Backend CORS is configured for `http://localhost:5173`. Update `backend/server.js` if deploying to a different origin.