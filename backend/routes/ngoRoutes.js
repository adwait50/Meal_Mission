const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const NGOModel = require("../models/ngoModel.js");
const randomstring = require("randomstring");
const sendEmail = require("../utils/sendEmail.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const upload = require("../utils/multerConfig.js");

const generateOTP = () =>
  randomstring.generate({ length: 4, charset: "numeric" });
const router = express.Router();

//register NGO
router.post("/register", upload.single("documentProof"), async (req, res) => {
  const { name, email, password, address } = req.body;

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Please upload ID proof document" });
    }

    const existingNGO = await NGOModel.findOne({ email });
    if (existingNGO) {
      if (!existingNGO.isVerified) {
        // Generate a new OTP and update the existing donor
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

        existingNGO.otp = otp;
        existingNGO.otpExpires = otpExpires;
        await existingNGO.save();

        await sendEmail(email, "Your new OTP code", `Your OTP is: ${otp}`);

        return res.status(200).json({
          message: "New OTP sent to email. Verify to complete registration.",
        });
      }
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const ngo = new NGOModel({
      name,
      email,
      password: hashedPassword,
      address,
      documentProof: req.file.path, // Save the file path
      otp,
      otpExpires,
      isApproved: false,
    });

    await ngo.save();
    await sendEmail(email, "Your OTP code", `Your OTP is: ${otp}`);

    res.status(201).json({
      message: "OTP sent to email. Verify to complete registration.",
    });
  } catch (error) {
    console.error("NGO Registration Error:", error);
    res.status(500).json({
      message: "Error registering NGO",
      error: error.message, // Add this line to see the specific error
    });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  console.log("Request body:", req.body); // Log the request body
  const { email, otp } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });

    if (!NGO) return res.status(400).json({ message: "Invalid Email" });
    if (NGO.isVerified)
      return res.status(400).json({ message: "Email already verified" });
    if (NGO.otp !== otp || NGO.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    NGO.isVerified = true;
    NGO.otp = null;
    NGO.otpExpires = null;
    await NGO.save();

    res.json({
      message: "Email verified successfully. Please wait for admin approval.",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error); // Log the error
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

// NGO Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });

    if (!NGO)
      return res.status(400).json({ message: "Invalid email or password" });
    if (!NGO.isVerified)
      return res.status(400).json({ message: "Email not verified" });
    if (!NGO.isApproved)
      return res
        .status(400)
        .json({ message: "Account pending admin approval" });

    const isMatch = await bcrypt.compare(password, NGO.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      {
        id: NGO._id,
        type: "NGO", // Added to distinguish between donor and NGO
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const NGO = await NGOModel.findById(req.user.id).select("-password");
    if (!NGO) {
      return res.status(404).json({ message: "NGO not found" });
    }
    res.json(NGO);
  } catch (error) {
    res.status(500).json({ message: "Error fetching NGO profile" });
  }
});

router.post("/logout", authMiddleware, async (req, res) => {
  res.json({ message: "Logged out successfully" });
});

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

module.exports = router;
