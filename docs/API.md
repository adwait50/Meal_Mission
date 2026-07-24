## API Reference

Base URL: `http://localhost:5000/api`

Auth: JWT via `Authorization: Bearer <token>` header for protected routes.

> Interactive docs available at `http://localhost:5000/api-docs` (Swagger UI)

### Health

- GET `/health` → `{ status: "ok" }`

---

## Donors (`/donors`)

- POST `/register`
  - body: `{ name, email, password, phone, address }`
  - Validated with Zod — all fields required, phone must be 10 digits, password min 6 chars
  - 201: `{"message":"OTP sent..."}` or 200 if resending OTP for unverified existing user

- POST `/verify-otp`
  - body: `{ email, otp }`
  - OTP is 6 digits, expires in 5 minutes
  - Rate limited: 5 requests per 15 minutes
  - 200: `{"message":"Email verified successfully..."}`

- POST `/login`
  - body: `{ email, password }`
  - Validated with Zod
  - Rate limited: 5 requests per 15 minutes
  - 200: `{ token }` (access token, 15min) + sets `refreshToken` httpOnly cookie (7d)

- POST `/refresh-token`
  - No body required — reads `refreshToken` from cookie
  - Checks Redis blacklist before issuing new token
  - 200: `{ token }` (new 15min access token)

- POST `/logout`
  - Blacklists refresh token in Redis (TTL 7d)
  - Clears `refreshToken` cookie
  - 200: `{"message":"Logged out successfully"}`

- POST `/forgot-password`
  - body: `{ email }`
  - Validated with Zod
  - Rate limited: 5 requests per 15 minutes
  - 200: `{"message":"Password reset OTP sent..."}`

- POST `/verify-reset-otp`
  - body: `{ email, otp }`
  - 200: `{"message":"OTP verified successfully"}`

- POST `/reset-password`
  - body: `{ email, otp, newPassword }`
  - Validated with Zod — otp must be 6 chars, newPassword min 6 chars
  - 200: `{"message":"Password reset successfully"}`

- POST `/resend-otp`
  - body: `{ email }`
  - Rate limited: 5 requests per 15 minutes
  - 200: `{"message":"New OTP sent..."}`

- POST `/resend-reset-otp`
  - body: `{ email }`
  - 200: `{"message":"New password reset OTP sent..."}`

- GET `/dashboard` (auth: Donor)
  - 200: donor profile (without password)

- GET `/active-requests` (auth: Donor)
  - Query params: `?page=1&limit=10`
  - 200: `{ activeRequests, pagination: { totalCount, page, limit, totalPages } }`

- GET `/donation-history` (auth: Donor)
  - Query params: `?page=1&limit=10`
  - 200: `{ totalWeight, totalDonations, timesDonated, donationHistory, pagination }`

- GET `/donation/:id` (auth: Donor)
  - 200: donation details (ensures it belongs to donor, populates NGO name/email/phone)

- PUT `/donation/:id/cancel` (auth: Donor)
  - 200: marks donation as `Cancelled` if not Completed/Cancelled

- POST `/support` (auth: Donor)
  - body: `{ requestId, issue, phone, email, description }`
  - 201: created support request

- GET `/support-requests` (auth: Donor)
  - 200: list of donor's support requests

---

## NGOs (`/ngo`)

- POST `/register` (multipart)
  - form fields: `name, email, password, address, city, state, phone` — all validated with Zod
  - file: `documentProof` (stored in Supabase Storage)
  - 201: `{"message":"OTP sent..."}`

- POST `/verify-otp`
  - body: `{ email, otp }`
  - Rate limited: 5 requests per 15 minutes
  - 200: `{"message":"Email verified... Please wait for admin approval."}`

- POST `/login`
  - body: `{ email, password }` — validated with Zod
  - Rate limited: 5 requests per 15 minutes
  - Requires `isVerified` and `isApproved`
  - 200: `{ token }` (access token, 15min) + sets `refreshToken` httpOnly cookie (7d)

- POST `/refresh-token`
  - Reads `refreshToken` from cookie, checks Redis blacklist
  - 200: `{ token }` (new 15min access token)

- POST `/logout`
  - Blacklists refresh token in Redis, clears cookie
  - 200: `{"message":"Logged out successfully"}`

- GET `/dashboard` (auth: NGO)
  - 200: NGO profile (without password)

- POST `/forgot-password`, `/verify-reset-otp`, `/reset-password`, `/resend-otp`, `/resend-reset-otp`
  - Same flows as donor — Zod validated, rate limited where applicable

- GET `/food-pickup-requests` (auth: NGO)
  - Query params: `?page=1&limit=10`
  - Returns pending donor requests in NGO's city created within last 4 hours
  - Uses compound MongoDB index on `(city, status, createdAt)` for fast lookup
  - 200: `{ requests, pagination }`

- PUT `/donation/:id/status` (auth: NGO)
  - body: `{ status }` where `status in ["Pending","Accepted","In Progress","Completed"]`
  - Ownership check: verifies donation belongs to this NGO

- GET `/donation/:id` (auth: NGO)
  - 200: donation details with donor populated

- PUT `/donation/:id/accept` (auth: NGO)
  - Sets `status = In Progress` and assigns `ngo` field

- PUT `/donation/:id/completed` (auth: NGO)
  - Sets `status = Completed`

- PUT `/donation/:id/reject` (auth: NGO)
  - Sets `status = Rejected`

- GET `/donation-history` (auth: NGO)
  - Query params: `?page=1&limit=10`
  - 200: `{ totalDonations, completedDonations, rejectedDonations, totalWeight, timesDonated, donationHistory, pagination }`

- GET `/accepted-donations` (auth: NGO)
  - 200: all `In Progress` donations assigned to this NGO

- POST `/support` (auth: NGO)
  - body: `{ requestId, issue, phone, email, description }`
  - 201: created support request

- GET `/support-requests` (auth: NGO)
  - 200: list of NGO's support requests

---

## Admin (`/admin`)

- POST `/login`
  - body: `{ email, password }`
  - 200: `{ token }` (7d, no refresh token flow for admin)

- GET `/pending` (auth: Admin)
  - 200: list of NGOs where `isApproved = false`

- PUT `/approve-ngo/:id` (auth: Admin)
  - 200: updated NGO with `isApproved: true`

- PUT `/reject-ngo/:id` (auth: Admin)
  - body: `{ reasonForRejection? }`
  - Copies NGO into `RejectedNGO` collection then deletes original
  - 200: `{"message":"NGO rejected successfully"}`

- GET `/ngo-info/:id` (auth: Admin)
  - 200: NGO info (no password/OTP fields)

- GET `/rejected-ngos` (auth: Admin)
  - 200: list of rejected NGOs

- GET `/:type-support?isCompleted=<all|true|false>` (auth: Admin)
  - `type in [ngo, donor, all]`
  - Query params: `?page=1&limit=10`
  - 200: `{ supportRequests, pagination }`

- PATCH `/complete-request/:type/:id` (auth: Admin)
  - `type in [NGO, Donor]` — marks support request `isCompleted: true`

- GET `/dashboard` (auth: Admin)
  - Query params: `?page=1&limit=10`
  - 200: `{ ngos, pagination }` — approved NGOs only

- GET `/ngo/:id` (auth: Admin)
  - 200: NGO details (no password)

- DELETE `/ngo/:id` (auth: Admin)
  - 200: deletes NGO

---

## Pickup (`/pickup`)

- POST `/request-pickup` (auth: Donor, multipart)
  - Rate limited: 5 requests per 30 minutes
  - form fields: `donorName, phone, address, city, state, foodItems, quantity, pickupDate, additionalNotes?`
  - file: `foodImage?` (stored in Supabase Storage)
  - 201: `{ message, donation }` with generated `requestId` (format: `REQ-XXXXXX-XXXXXX`)

---

## Auth & Headers

- Include `Authorization: Bearer <token>` for all protected routes
- Access tokens expire in 15 minutes — use `/refresh-token` to get a new one
- Content-Type: `application/json` for JSON; `multipart/form-data` when uploading files
- Refresh token is sent automatically via httpOnly cookie — no manual handling needed