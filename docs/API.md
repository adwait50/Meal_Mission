## API Reference

Base URL: `http://localhost:5000/api`

Auth: JWT via `Authorization: Bearer <token>` header for protected routes.

### Health

- GET `/health` → `{ status: "ok" }`

---

## Donors (`/donors`)

- POST `/register`
  - body: `{ name, email, password, phone, address }`
  - 201: `{"message":"OTP sent..."}` or 200 if resending OTP for unverified existing user

- POST `/verify-otp`
  - body: `{ email, otp }`
  - 200: `{"message":"Email verified successfully..."}`

- POST `/login`
  - body: `{ email, password }`
  - 200: `{ token }`

- POST `/forgot-password`
  - body: `{ email }`
  - 200: `{"message":"Password reset OTP sent..."}`

- POST `/verify-reset-otp`
  - body: `{ email, otp }`
  - 200: `{"message":"OTP verified successfully"}`

- POST `/reset-password`
  - body: `{ email, otp, newPassword }`
  - 200: `{"message":"Password reset successfully"}`

- POST `/resend-otp`
  - body: `{ email }`
  - 200: `{"message":"New OTP sent..."}`

- POST `/resend-reset-otp`
  - body: `{ email }`
  - 200: `{"message":"New password reset OTP sent..."}`

- GET `/logout`
  - clears cookie (compat) and returns message

- GET `/dashboard` (auth: Donor)
  - 200: donor profile (without password)

- GET `/active-requests` (auth: Donor)
  - 200: list of donations for donor with `status in ["Pending","In Progress"]`

- GET `/donation-history` (auth: Donor)
  - 200: `{ totalWeight, totalDonations, timesDonated, donationHistory }`

- GET `/donation/:id` (auth: Donor)
  - 200: donation details (ensures it belongs to donor)

- PUT `/donation/:id/cancel` (auth: Donor)
  - 200: marks donation as `Cancelled` if not Completed/Cancelled

- POST `/support` (auth: Donor)
  - body: `{ requestId, issue, phone, email, description }`
  - 201: created support request

- GET `/support-requests` (auth: Donor)
  - 200: list of donor’s support requests

---

## NGOs (`/ngo`)

- POST `/register` (multipart)
  - form fields: `name, email, password, address, city, state, phone`
  - file: `documentProof`
  - 201: `{"message":"OTP sent..."}` (document stored in Supabase Storage)

- POST `/verify-otp`
  - body: `{ email, otp }`
  - 200: `{"message":"Email verified... Please wait for admin approval."}`

- POST `/login`
  - body: `{ email, password }`
  - requires `isVerified` and `isApproved`
  - 200: `{ token }`

- GET `/dashboard` (auth: NGO)
  - 200: NGO profile (without password)

- POST `/logout` (auth: NGO)
  - 200: message

- POST `/forgot-password`, `/verify-reset-otp`, `/reset-password`, `/resend-otp`, `/resend-reset-otp`
  - semantics identical to donor flows

- GET `/food-pickup-requests` (auth: NGO)
  - Returns donor pickup requests in NGO’s city created within last 4 hours and still `Pending`

- PUT `/donation/:id/status` (auth: NGO)
  - body: `{ status }` where `status in ["Pending","Accepted","In Progress","Completed"]`

- GET `/donation/:id` (auth: NGO)
  - 200: donation details with donor populated

- PUT `/donation/:id/accept` (auth: NGO)
  - Sets donation `status = In Progress` and assigns `ngo`

- PUT `/donation/:id/completed` (auth: NGO)
  - Sets donation `status = Completed`

- PUT `/donation/:id/reject` (auth: NGO)
  - Sets donation `status = Rejected`

- GET `/donation-history` (auth: NGO)
  - 200: stats and history `{ totalDonations, completedDonations, rejectedDonations, totalWeight, timesDonated, donationHistory }`

- GET `/accepted-donations` (auth: NGO)
  - 200: all `In Progress` donations assigned to NGO

- POST `/support` (auth: NGO)
  - body: `{ requestId, issue, phone, email, description }`
  - 201: created support request

- GET `/support-requests` (auth: NGO)
  - 200: list of NGO’s support requests

---

## Admin (`/admin`)

- POST `/login`
  - body: `{ email, password }`
  - 200: `{ token }`

- PUT `/approve-ngo/:id` (auth: Admin)
  - 200: updated NGO with `isApproved: true`

- PUT `/reject-ngo/:id` (auth: Admin)
  - body: `{ reasonForRejection? }`
  - Copies NGO into `RejectedNGO` collection then deletes original; 200 on success

- GET `/pending` (auth: Admin)
  - 200: list of NGOs where `isApproved = false`

- GET `/ngo-info/:id`
  - 200: NGO public info (no password/OTP fields)

- GET `/rejected-ngos` (auth: Admin)
  - 200: list of rejected NGOs

- GET `/:type-support?isCompleted=<all|true|false>` (auth: Admin)
  - `type in [ngo, donor, all]`
  - 200: list of support requests

- PATCH `/complete-request/:type/:id` (auth: Admin)
  - `type in [NGO, Donor]` – marks support request `isCompleted: true`

- GET `/dashboard` (auth: Admin)
  - 200: list of approved NGOs

- GET `/ngo/:id` (auth: Admin)
  - 200: NGO details (no password)

- DELETE `/ngo/:id` (auth: Admin)
  - 200: deletes NGO

---

## Pickup (`/pickup`)

- POST `/request-pickup` (auth: Donor, multipart)
  - form fields: `donorName, phone, address, city, state, foodItems, quantity, pickupDate, additionalNotes?`
  - file: `foodImage?`
  - 201: `{ message, donation }` with generated `requestId`

---

## Auth & Headers

- Include `Authorization: Bearer <token>` for all protected routes.
- Content-Type: `application/json` for JSON; `multipart/form-data` when uploading files.


