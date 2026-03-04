## Architecture Overview

### Backend

- Express server (`backend/server.js`) with:
  - CORS for `http://localhost:5173`
  - JSON/urlencoded parsing
  - Static `/uploads` (legacy; files now stored in Supabase)
  - Route mounts:
    - `/api/donors` → `routes/donorRoutes.js`
    - `/api/ngo` → `routes/ngoRoutes.js`
    - `/api/pickup` → `routes/requestPickup.js`
    - `/api/admin` → `routes/adminRoutes.js`
    - Health: `/api/health`

- Persistence: MongoDB via Mongoose (see `backend/config/db.js`)
- Auth: JWT with role-specific middlewares:
  - `authDonorMiddleware` (Donor routes)
  - `authNgoMiddleware` (NGO routes)
  - `authAdminMiddleware` (Admin routes)

- Storage: Supabase Storage for NGO documents and food images
- Email: Utility `utils/sendEmail.js` to send OTP and notifications
- Uploads: `utils/multerConfig.js` for multipart handling; files streamed to Supabase

### Frontend

- React + Vite SPA
- Route composition in `frontend/src/App.jsx`
  - Donor: register, login, dashboard (active requests, history, request pickup), profile, support
  - NGO: register, login, dashboard (browse pickup, active requests, donation detail/history), profile, support
  - Admin: login, dashboard (approved NGOs), pending NGOs (list/detail), support views
- Protected wrappers:
  - `DonorProtectedWrapper`, `NgoProtectedWrapper`, `AdminProtectedWrapper`
  - Uses localStorage token presence for basic gating
- Global state: `context/DonorContext.jsx`, `context/NgoContext.jsx`

### Roles & Flows

1) Donor
   - Register → OTP verify → Login → Create pickup request (optional image) → Track status (Pending/In Progress/Completed/Rejected/Cancelled)
   - View active requests, view history, cancel pending/in-progress, create support ticket

2) NGO
   - Register with document → OTP verify → Admin approval → Login
   - Browse pending donor requests in city (last 4 hours), accept → mark completed/reject
   - View accepted requests (In Progress), history, create support ticket

3) Admin
   - Login → Approve/reject NGOs, view pending/approved/rejected
   - View and complete support requests (NGO/Donor)

### Environments

See `docs/ENV.md` for required environment variables (MongoDB URI, JWT secret, Supabase, email credentials).


