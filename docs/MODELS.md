## Data Models

All models use Mongoose and live under `backend/models`.

---

### Donor (`donor.js`)

| Field | Type | Notes |
|---|---|---|
| `name` | String | required |
| `email` | String | required, unique, indexed |
| `password` | String | required, bcrypt hashed |
| `phone` | String | required, unique |
| `address` | String | required |
| `isVerified` | Boolean | default false |
| `otp` | String | 6-digit, null after verification |
| `otpExpires` | Date | 5 minute TTL |
| `resetPasswordOTP` | String | 6-digit, null after reset |
| `resetPasswordOTPExpires` | Date | 5 minute TTL |

---

### NGO (`ngoModel.js`)

| Field | Type | Notes |
|---|---|---|
| `name` | String | required |
| `email` | String | required, unique, indexed |
| `password` | String | required, bcrypt hashed |
| `address` | String | required |
| `documentProof` | String | required, Supabase public URL |
| `isVerified` | Boolean | default false |
| `isApproved` | Boolean | default false, set by admin |
| `city` | String | required, stored lowercase |
| `state` | String | required, stored lowercase |
| `phone` | String | required, unique |
| `otp` | String | 6-digit, null after verification |
| `otpExpires` | Date | 5 minute TTL |
| `registrationDate` | Date | default now |
| `resetPasswordOTP` | String | 6-digit, null after reset |
| `resetPasswordOTPExpires` | Date | 5 minute TTL |

---

### Donation (`Donation.js`)

| Field | Type | Notes |
|---|---|---|
| `donor` | ObjectId → Donor | required |
| `donorName` | String | required |
| `phone` | String | required |
| `city` | String | required, stored lowercase, indexed |
| `state` | String | required, stored lowercase |
| `address` | String | required |
| `foodItems` | String | required |
| `quantity` | Number | required |
| `createdAt` | Date | default now, indexed |
| `ngo` | ObjectId → NGO | assigned on accept |
| `foodImage` | String | optional, Supabase public URL |
| `additionalNotes` | String | optional |
| `requestId` | String | unique, format `REQ-XXXXXX-XXXXXX` |
| `status` | Enum | `Pending`, `Accepted`, `In Progress`, `Completed`, `Rejected`, `Cancelled` — default `Pending`, indexed |
| `pickupDate` | Date | required |

**Indexes:**
- Compound index: `{ city: 1, status: 1, createdAt: -1 }` — used by NGO food pickup query

---

### RejectedNGO (`RejectedNGO.js`)

Snapshot of NGO data copied on rejection.

| Field | Type | Notes |
|---|---|---|
| `name` | String | required |
| `email` | String | required, unique |
| `address` | String | required |
| `city` | String | required |
| `state` | String | required |
| `phone` | String | required, unique |
| `documentProof` | String | required, Supabase URL |
| `reasonForRejection` | String | optional |
| `createdAt` | Date | default now |

---

### Admin (`Admin.js`)

| Field | Type | Notes |
|---|---|---|
| `email` | String | required, unique |
| `password` | String | required, bcrypt hashed |
| `isAdmin` | Boolean | default true |

---

### SupportRequestDonor (`SupportRequestDonor.js`)

| Field | Type | Notes |
|---|---|---|
| `donor` | ObjectId → Donor | required |
| `requestId` | String | required |
| `issue` | String | required |
| `phone` | String | required |
| `email` | String | required |
| `description` | String | required |
| `isCompleted` | Boolean | default false |
| `createdAt` | Date | via timestamps |

---

### SupportRequestNgo (`SupportRequestNgo.js`)

| Field | Type | Notes |
|---|---|---|
| `ngo` | ObjectId → NGO | required |
| `requestId` | String | required |
| `issue` | String | required |
| `phone` | String | required |
| `email` | String | required |
| `description` | String | required |
| `isCompleted` | Boolean | default false |
| `createdAt` | Date | via timestamps |