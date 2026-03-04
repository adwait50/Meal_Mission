## SpecStory

## Password Reset Feature for Donors (2/15/2025, 7:10:32 PM)

_**User**_

i want to add reset password thing to my donor 

---

_**Assistant**_

I'll help you add password reset functionality for donors. However, I'll need some more information to provide specific guidance:

1. What framework/language are you using? (Laravel, Django, Express.js, etc.)
2. Do you already have a donor model/table set up?
3. Do you want to implement:
   - Password reset via email link
   - Security questions
   - Or another method?

Please share these details and any existing code you're working with, so I can provide more targeted assistance.

---

_**User**_

im using express, also i want that when user clicks on reset password theyll be sent an otp and then they enter the otp and then can set new password, do you want me to share my donor routes file?

---

_**Assistant**_



Yes, please share your donor routes file! I can help you implement a password reset flow with the following steps:

1. Create an endpoint to initiate password reset (sends OTP)
2. Create an endpoint to verify OTP
3. Create an endpoint to set the new password

We'll need to:
- Generate and store OTP (temporarily)
- Send OTP via email
- Verify the OTP
- Update the password

Please share your current donor routes file, and I'll help you add these features. Also, let me know if you already have email sending functionality set up (like nodemailer).

---

_**User**_

yes i have email setup

---

_**Assistant**_



I'll help you add password reset functionality. We'll need to add three new routes: one to initiate the reset (send OTP), one to verify the OTP, and one to set the new password. Here are the additions to your donor routes:

```javascript:backend/routes/donorRoutes.js
// ... existing code ...

// Initiate password reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(400).json({ message: "Email not found" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    donor.resetPasswordOTP = otp;
    donor.resetPasswordOTPExpires = otpExpires;
    await donor.save();

    await sendEmail(
      email,
      "Password Reset OTP",
      `Your password reset OTP is: ${otp}`
    );

    res.status(200).json({ message: "Password reset OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error initiating password reset" });
  }
});

// Verify reset password OTP
router.post("/verify-reset-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(400).json({ message: "Email not found" });
    }

    if (
      donor.resetPasswordOTP !== otp ||
      donor.resetPasswordOTPExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(400).json({ message: "Email not found" });
    }

    if (
      donor.resetPasswordOTP !== otp ||
      donor.resetPasswordOTPExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    donor.password = hashedPassword;
    donor.resetPasswordOTP = null;
    donor.resetPasswordOTPExpires = null;
    await donor.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
});

module.exports = router;
```

You'll also need to update your Donor model to include the new fields. Add these fields to your donor schema:

```javascript:backend/models/donor.js
// Add these fields to your schema
resetPasswordOTP: {
  type: String,
},
resetPasswordOTPExpires: {
  type: Date,
}
```

This implementation:
1. Adds a `/forgot-password` route that sends an OTP
2. Adds a `/verify-reset-otp` route to verify the OTP before allowing password reset
3. Adds a `/reset-password` route to set the new password

The flow will be:
1. User requests password reset (provides email)
2. System sends OTP to email
3. User verifies OTP
4. User sets new password with OTP and email

Each OTP expires after 5 minutes for security. Let me know if you need any clarification or have questions!

---

_**User**_

lets do this same for ngoRoutes

---

_**Assistant**_

I'll help you add the same password reset functionality to your NGO routes. Could you share your current ngoRoutes.js file so I can make sure the additions integrate well with your existing code? 

However, if your NGO routes are structured similarly to your donor routes, we can adapt the same logic. The main changes would be:
1. Replacing `Donor` with `NGO` in the model references
2. Adjusting any NGO-specific validation if needed

Would you please share your current ngoRoutes.js file?

---

_**User**_

this is the file

---

_**Assistant**_



I'll help you add the password reset functionality to your NGO routes. Here are the additions:

```javascript:backend/routes/ngoRoutes.js
// ... existing code ...

// Initiate password reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });
    if (!NGO) {
      return res.status(400).json({ message: "Email not found" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    NGO.resetPasswordOTP = otp;
    NGO.resetPasswordOTPExpires = otpExpires;
    await NGO.save();

    await sendEmail(
      email,
      "Password Reset OTP",
      `Your password reset OTP is: ${otp}`
    );

    res.status(200).json({ message: "Password reset OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error initiating password reset" });
  }
});

// Verify reset password OTP
router.post("/verify-reset-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });
    if (!NGO) {
      return res.status(400).json({ message: "Email not found" });
    }

    if (
      NGO.resetPasswordOTP !== otp ||
      NGO.resetPasswordOTPExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });
    if (!NGO) {
      return res.status(400).json({ message: "Email not found" });
    }

    if (
      NGO.resetPasswordOTP !== otp ||
      NGO.resetPasswordOTPExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    NGO.password = hashedPassword;
    NGO.resetPasswordOTP = null;
    NGO.resetPasswordOTPExpires = null;
    await NGO.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
});

module.exports = router;
```

And you'll need to add these fields to your NGO model:

```javascript:backend/models/ngoModel.js
// Add these fields to your schema
resetPasswordOTP: {
  type: String,
},
resetPasswordOTPExpires: {
  type: Date,
}
```

The functionality is identical to the donor routes, but adapted for the NGO model. The flow remains the same:
1. NGO requests password reset with their email
2. System sends OTP to their email
3. NGO verifies the OTP
4. NGO sets new password using the OTP and email

The OTP expires after 5 minutes for security. Let me know if you need any clarification!

---

_**User**_

great, now lets add resend otp thing too

---

_**Assistant**_



I'll help you add resend OTP functionality for both registration and password reset. Let's add these routes to both donor and NGO routes.

First, for donorRoutes.js:

```javascript:backend/routes/donorRoutes.js
// ... existing code ...

// Resend registration OTP
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(400).json({ message: "Email not found" });
    }

    if (donor.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    donor.otp = otp;
    donor.otpExpires = otpExpires;
    await donor.save();

    await sendEmail(email, "Your New OTP Code", `Your OTP is: ${otp}`);

    res.status(200).json({ message: "New OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error resending OTP" });
  }
});

// Resend password reset OTP
router.post("/resend-reset-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(400).json({ message: "Email not found" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    donor.resetPasswordOTP = otp;
    donor.resetPasswordOTPExpires = otpExpires;
    await donor.save();

    await sendEmail(
      email,
      "Your New Password Reset OTP",
      `Your password reset OTP is: ${otp}`
    );

    res.status(200).json({ message: "New password reset OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error resending OTP" });
  }
});
```

And for ngoRoutes.js:

```javascript:backend/routes/ngoRoutes.js
// ... existing code ...

// Resend registration OTP
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });
    if (!NGO) {
      return res.status(400).json({ message: "Email not found" });
    }

    if (NGO.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    NGO.otp = otp;
    NGO.otpExpires = otpExpires;
    await NGO.save();

    await sendEmail(email, "Your New OTP Code", `Your OTP is: ${otp}`);

    res.status(200).json({ message: "New OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error resending OTP" });
  }
});

// Resend password reset OTP
router.post("/resend-reset-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });
    if (!NGO) {
      return res.status(400).json({ message: "Email not found" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    NGO.resetPasswordOTP = otp;
    NGO.resetPasswordOTPExpires = otpExpires;
    await NGO.save();

    await sendEmail(
      email,
      "Your New Password Reset OTP",
      `Your password reset OTP is: ${otp}`
    );

    res.status(200).json({ message: "New password reset OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error resending OTP" });
  }
});
```

These additions provide two new endpoints for each route:
1. `/resend-otp` - For resending registration OTP
2. `/resend-reset-otp` - For resending password reset OTP

Both endpoints:
- Verify the email exists
- Generate a new OTP
- Update the OTP and expiry time
- Send the new OTP via email

For registration OTP resend, it also checks if the email is already verified to prevent unnecessary resends.

---



---

