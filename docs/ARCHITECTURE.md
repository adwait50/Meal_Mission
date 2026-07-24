## Architecture Overview

### Backend

- Express server (`backend/server.js`) with:
  - CORS for `http://localhost:5173`
  - JSON/urlencoded parsing
  - Cookie parser (for refresh token cookie)
  - Global error handler middleware
  - Swagger UI at `/api-docs`
  - Route mounts:
    - `/api/donors` → `routes/donorRoutes.js`
    - `/api/ngo` → `routes/ngoRoutes.js`
    - `/api/pickup` → `routes/requestPickup.js`
    - `/api/admin` → `routes/adminRoutes.js`
    - Health: `/api/health`

- Persistence: MongoDB via Mongoose (`backend/config/db.js`)
  - Compound index on `Donation(city, status, createdAt)` for fast city-based queries
  - Email indexes on `Donor` and `NGO` for fast login lookups

- Auth: JWT with role-specific middlewares
  - `authDonorMiddleware` — verifies Donor JWT
  - `authNgoMiddleware` — verifies NGO JWT
  - `authAdminMiddleware` — verifies Admin JWT
  - Access tokens: 15 minute expiry
  - Refresh tokens: 7 day expiry, stored in httpOnly cookie
  - Logout blacklists refresh token in Redis

- Caching / Fast storage: Redis (`backend/config/redisClient.js`)
  - Refresh token blacklist on logout (TTL matches token expiry)
  - Rate limit state storage (persistent across server restarts)

- Validation: Zod schemas (`backend/validators/`)
  - `donorValidator.js` — register, login, forgot password, reset password
  - `ngoValidator.js` — register, login, forgot password, reset password
  - Applied via `middlewares/validate.js`

- Error handling: Global error handler (`backend/middlewares/errorHandler.js`)
  - All route catch blocks call `next(error)`
  - Consistent `{ success: false, message }` response shape

- Storage: Supabase Storage for NGO documents and food images
- Email: `utils/sendEmail.js` using Nodemailer (Gmail SMTP with App Password)
- Uploads: `utils/multerConfig.js` — files stored in memory buffer, streamed to Supabase

### Frontend

- React + Vite SPA
- Route composition in `frontend/src/App.jsx`
  - Donor: register, verify OTP, login, dashboard (active requests, history, request pickup), profile, support
  - NGO: register, verify OTP, login, dashboard (browse pickup, accepted requests, donation detail/history), profile, support
  - Admin: login, dashboard (approved NGOs), pending NGOs (list/detail), support views
- Protected wrappers:
  - `DonorProtectedWrapper`, `NgoProtectedWrapper`, `AdminProtectedWrapper`
  - Uses localStorage token presence for route gating
- Global state: `context/DonorContext.jsx`, `context/NgoContext.jsx`
- HTTP: Axios with interceptor (`src/api/axiosInstance.js`)
  - Attaches access token from localStorage to every request
  - On 401, automatically calls `/refresh-token` and retries original request
  - On refresh failure, clears token and redirects to login

### Roles & Flows

1. **Donor**
   - Register → OTP verify (6 digit, 5min expiry) → Login → Create pickup request (optional image)
   - Track status: Pending → In Progress → Completed / Rejected / Cancelled
   - View active requests (paginated), donation history (paginated), cancel pending requests, submit support tickets

2. **NGO**
   - Register with document proof → OTP verify → Await admin approval → Login
   - Browse pending donor requests in city (last 4 hours, paginated), accept → mark completed or reject
   - View accepted requests, donation history (paginated), submit support tickets

3. **Admin**
   - Login → Approve or reject NGO registrations (with optional rejection reason)
   - View pending/approved/rejected NGOs, manage support requests (paginated)

### Containerisation

- `backend/Dockerfile` — Node 20 Alpine image
- `docker-compose.yml` — orchestrates backend + Redis
  - Backend reads env vars from `backend/utils/.env` via `env_file`
  - Redis URL overridden to `redis://redis:6379` inside Docker network
  - MongoDB and Supabase remain cloud-hosted

### Environments

See `docs/ENV.md` for required environment variables.