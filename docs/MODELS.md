## Data Models

All models use Mongoose and live under `backend/models`.

### Donor (`Donor`)

Fields:
- `name: String!`
- `email: String! unique`
- `password: String!`
- `phone: String! unique`
- `address: String!`
- `isVerified: Boolean = false`
- `otp: String?`
- `otpExpires: Date?`
- `resetPasswordOTP: String?`
- `resetPasswordOTPExpires: Date?`

### NGO (`NGO`)

Fields:
- `name: String!`
- `email: String! unique`
- `password: String!`
- `address: String!`
- `documentProof: String!` (Supabase public URL)
- `isVerified: Boolean = false`
- `isApproved: Boolean = false`
- `city: String!`
- `state: String!`
- `phone: String! unique`
- `otp: String?`
- `otpExpires: Date?`
- `registrationDate: Date = now`
- `resetPasswordOTP: String?`
- `resetPasswordOTPExpires: Date?`

### Donation (`Donation`)

Fields:
- `donor: ObjectId<Donor>!`
- `donorName: String!`
- `phone: String!`
- `city: String!`
- `state: String!`
- `address: String!`
- `foodItems: String!`
- `quantity: Number!`
- `createdAt: Date = now`
- `ngo: ObjectId<NGO>?`
- `foodImage: String?` (Supabase public URL)
- `additionalNotes: String?`
- `requestId: String unique`
- `status: Enum("Pending","Accepted","In Progress","Completed","Rejected","Cancelled") = "Pending"`
- `pickupDate: Date!`

### RejectedNGO (`RejectedNGO`)

Fields:
- `name: String!`
- `email: String! unique`
- `address: String!`
- `city: String!`
- `state: String!`
- `phone: String! unique`
- `documentProof: String!`
- `reasonForRejection: String?`
- `createdAt: Date = now`

### Admin (`Admin`)

Fields (inferred):
- `email: String! unique`
- `password: String!`
- `isAdmin: Boolean = true` (consumed by middleware/logic)

### SupportRequestDonor (`SupportRequestDonor`)

Fields:
- `donor: ObjectId<Donor>!`
- `requestId: String!`
- `issue: String!`
- `phone: String!`
- `email: String!`
- `description: String!`
- `isCompleted: Boolean = false`
- `createdAt: Date = now` (via timestamps if enabled)

### SupportRequestNgo (`SupportRequestNgo`)

Fields:
- `ngo: ObjectId<NGO>!`
- `requestId: String!`
- `issue: String!`
- `phone: String!`
- `email: String!`
- `description: String!`
- `isCompleted: Boolean = false`
- `createdAt: Date = now`


