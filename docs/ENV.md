## Environment & Setup

Create a `.env` file in `backend/` with:

```
PORT=5000

# Mongo
MONGO_URI=mongodb://localhost:27017/mm

# JWT
JWT_SECRET=replace-with-strong-secret

# Supabase (Storage)
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_ANON_KEY=<public-anon-or-service-key>
SUPABASE_BUCKET=<bucket-name>

# Email (used by backend/utils/sendEmail.js)
# Option A: Generic SMTP (recommended for production)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-user
SMTP_PASS=your-pass
SMTP_FROM="MM App <no-reply@example.com>"

# Option B: Gmail with App Password (simple)
# Requires 2-Step Verification enabled on the Gmail account
# and generating an App Password (16 characters).
# Uncomment to use:
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password

# Option C: Gmail OAuth2 (advanced)
# If you prefer OAuth2, provide these values. Useful for service
# accounts with refresh tokens. REDIRECT URI defaults to Google OAuth Playground.
# EMAIL_USER=your-email@gmail.com
# GMAIL_CLIENT_ID=...
# GMAIL_CLIENT_SECRET=...
# GMAIL_REFRESH_TOKEN=...
# GMAIL_REDIRECT_URI=https://developers.google.com/oauthplayground
```

### Install & Run

```
cd backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.

### CORS

Backend CORS is configured for `http://localhost:5173`. Update in `backend/server.js` if needed.


