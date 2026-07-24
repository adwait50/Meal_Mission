const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Donor = require("../models/donor.js");
const sendEmail = require("../utils/sendEmail.js");
const randomstring = require("randomstring");
const authDonorMiddleware = require("../middlewares/authDonorMiddleware.js");
const Donation = require("../models/Donation.js");
const SupportRequestDonor = require("../models/SupportRequestDonor.js");
const rateLimit = require("express-rate-limit");
const validate = require("../middlewares/validate.js");
const redis = require("../config/redisClient.js");
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require("../validators/donorValidator.js");

const router = express.Router();

const generateOTP = () =>
  randomstring.generate({ length: 6, charset: "numeric" });

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many attempts, please try again after 15 minutes" }
});

/**
 * @swagger
 * /api/donors/register:
 *   post:
 *     summary: Register a new donor
 *     tags: [Donors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, phone, address]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: OTP sent to email
 *       400:
 *         description: Email already exists
 */
router.post("/register", validate(registerSchema), async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;

  try {
    const existingUser = await Donor.findOne({ email });
    if (existingUser) {
      if (!existingUser.isVerified) {
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        existingUser.otp = otp;
        existingUser.otpExpires = otpExpires;
        await existingUser.save();
        await sendEmail(email, "Your new OTP code", `Your OTP is: ${otp}`);
        return res.status(200).json({ message: "New OTP sent to email. Verify to complete registration." });
      }
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const donor = new Donor({ name, email, password: hashedPassword, phone, address, otp, otpExpires });
    await donor.save();
    await sendEmail(email, "Your OTP code", `Your OTP is: ${otp}`);

    res.status(201).json({ message: "OTP sent to email. Verify to complete registration." });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/donors/verify-otp:
 *   post:
 *     summary: Verify donor email OTP
 *     tags: [Donors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verify-otp", authLimiter, async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const donor = await Donor.findOne({ email });
    if (!donor) return res.status(400).json({ message: "Invalid Email" });
    if (donor.isVerified) return res.status(400).json({ message: "Email already verified" });
    if (donor.otp !== otp || donor.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    donor.isVerified = true;
    donor.otp = null;
    donor.otpExpires = null;
    await donor.save();

    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/donors/login:
 *   post:
 *     summary: Donor login
 *     tags: [Donors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns access token
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", authLimiter, validate(loginSchema), async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const donor = await Donor.findOne({ email });
    if (!donor) return res.status(400).json({ message: "Invalid email or password" });
    if (!donor.isVerified) return res.status(400).json({ message: "Email not verified" });

    const isMatch = await bcrypt.compare(password.trim(), donor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = jwt.sign({ id: donor._id, role: "Donor" }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: donor._id, role: "Donor" }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ token: accessToken });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/donors/refresh-token:
 *   post:
 *     summary: Get new access token using refresh token cookie
 *     tags: [Donors]
 *     responses:
 *       200:
 *         description: Returns new access token
 *       401:
 *         description: No or revoked refresh token
 */
router.post("/refresh-token", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

    const isBlacklisted = await redis.get(`bl_${refreshToken}`);
    if (isBlacklisted) return res.status(401).json({ message: "Refresh token revoked" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: decoded.id, role: "Donor" }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.status(200).json({ token: accessToken });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/donors/logout:
 *   post:
 *     summary: Donor logout — blacklists refresh token
 *     tags: [Donors]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await redis.set(`bl_${refreshToken}`, "true", "EX", 7 * 24 * 60 * 60);
    }
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/donors/forgot-password:
 *   post:
 *     summary: Send password reset OTP
 *     tags: [Donors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 *       400:
 *         description: Email not found
 */
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), async (req, res, next) => {
  const { email } = req.body;
  try {
    const donor = await Donor.findOne({ email });
    if (!donor) return res.status(400).json({ message: "Email not found" });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    donor.resetPasswordOTP = otp;
    donor.resetPasswordOTPExpires = otpExpires;
    await donor.save();

    await sendEmail(email, "Password Reset OTP", `Your password reset OTP is: ${otp}`);
    res.status(200).json({ message: "Password reset OTP sent to email" });
  } catch (error) {
    next(error);
  }
});

router.post("/verify-reset-otp", async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const donor = await Donor.findOne({ email });
    if (!donor) return res.status(400).json({ message: "Email not found" });
    if (donor.resetPasswordOTP !== otp || donor.resetPasswordOTPExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", validate(resetPasswordSchema), async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  try {
    const donor = await Donor.findOne({ email });
    if (!donor) return res.status(400).json({ message: "Email not found" });
    if (donor.resetPasswordOTP !== otp || donor.resetPasswordOTPExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    donor.password = hashedPassword;
    donor.resetPasswordOTP = null;
    donor.resetPasswordOTPExpires = null;
    await donor.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/resend-otp", authLimiter, async (req, res, next) => {
  const { email } = req.body;
  try {
    const donor = await Donor.findOne({ email });
    if (!donor) return res.status(400).json({ message: "Email not found" });
    if (donor.isVerified) return res.status(400).json({ message: "Email already verified" });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    donor.otp = otp;
    donor.otpExpires = otpExpires;
    await donor.save();

    await sendEmail(email, "Your New OTP Code", `Your OTP is: ${otp}`);
    res.status(200).json({ message: "New OTP sent to email" });
  } catch (error) {
    next(error);
  }
});

router.post("/resend-reset-otp", async (req, res, next) => {
  const { email } = req.body;
  try {
    const donor = await Donor.findOne({ email });
    if (!donor) return res.status(400).json({ message: "Email not found" });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    donor.resetPasswordOTP = otp;
    donor.resetPasswordOTPExpires = otpExpires;
    await donor.save();

    await sendEmail(email, "Your New Password Reset OTP", `Your password reset OTP is: ${otp}`);
    res.status(200).json({ message: "New password reset OTP sent to email" });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/donors/dashboard:
 *   get:
 *     summary: Get donor profile
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Donor profile data
 *       401:
 *         description: Unauthorized
 */
router.get("/dashboard", authDonorMiddleware, async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.user._id).select("-password");
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.status(200).json(donor);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/donors/active-requests:
 *   get:
 *     summary: Get donor's active donation requests
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Active requests with pagination
 *       404:
 *         description: No active requests found
 */
router.get("/active-requests", authDonorMiddleware, async (req, res, next) => {
  try {
    const donorId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await Donation.countDocuments({ donor: donorId, status: { $in: ["Pending", "In Progress"] } });

    const activeRequests = await Donation.find(
      { donor: donorId, status: { $in: ["Pending", "In Progress"] } },
      { requestId: 1, status: 1, foodItems: 1, quantity: 1, createdAt: 1, donorName: 1, foodImage: 1 }
    ).sort({ createdAt: -1 }).skip(skip).limit(limit);

    if (!activeRequests.length) return res.status(404).json({ message: "No active requests found." });

    return res.status(200).json({
      activeRequests,
      pagination: { totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/donors/donation-history:
 *   get:
 *     summary: Get donor donation history
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Donation history with pagination
 */
router.get("/donation-history", authDonorMiddleware, async (req, res, next) => {
  try {
    const donorId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await Donation.countDocuments({ donor: donorId, status: { $in: ["Completed", "Rejected", "Cancelled"] } });

    const donationHistory = await Donation.find({ donor: donorId, status: { $in: ["Completed", "Rejected", "Cancelled"] } })
      .select("foodItem createdAt pickupDate address status quantity requestId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalWeight = donationHistory.filter((d) => d.status === "Completed").reduce((acc, d) => acc + (d.quantity || 0), 0);
    const totalDonations = donationHistory.length;
    const timesDonated = donationHistory.filter((d) => d.status === "Completed").length;

    return res.status(200).json({
      totalWeight, totalDonations, timesDonated, donationHistory,
      pagination: { totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/donors/donation/{id}:
 *   get:
 *     summary: Get single donation detail
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Donation details
 *       404:
 *         description: Donation not found
 */
router.get("/donation/:id", authDonorMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const donorId = req.user._id;
  try {
    const donation = await Donation.findOne({ _id: id, donor: donorId }).populate("ngo", "name email phone").select("-__v");
    if (!donation) return res.status(404).json({ message: "Donation not found or you don't have access to it" });
    res.status(200).json(donation);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/donors/donation/{id}/cancel:
 *   put:
 *     summary: Cancel a donation request
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Donation cancelled
 *       400:
 *         description: Cannot cancel
 *       404:
 *         description: Donation not found
 */
router.put("/donation/:id/cancel", authDonorMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const donorId = req.user._id;
  try {
    const existingDonation = await Donation.findOne({ _id: id, donor: donorId });
    if (!existingDonation) return res.status(404).json({ message: "Donation not found or you don't have access to it" });
    if (existingDonation.status === "Completed" || existingDonation.status === "Cancelled") {
      return res.status(400).json({ message: `Cannot cancel donation with status: ${existingDonation.status}` });
    }

    const donation = await Donation.findByIdAndUpdate(id, { status: "Cancelled" }, { new: true, runValidators: true });
    if (!donation) return res.status(500).json({ message: "Failed to update donation status" });

    res.status(200).json({ message: "Donation status updated successfully", donation });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/donors/support:
 *   post:
 *     summary: Submit a support request
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Support request submitted
 */
router.post("/support", authDonorMiddleware, async (req, res, next) => {
  const { requestId, issue, phone, email, description } = req.body;
  try {
    const supportRequestDonor = new SupportRequestDonor({ donor: req.user._id, requestId, issue, phone, email, description, isCompleted: false });
    await supportRequestDonor.save();
    res.status(201).json({ message: "Support request submitted successfully" });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/donors/support-requests:
 *   get:
 *     summary: Get donor's support requests
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of support requests
 */
router.get("/support-requests", authDonorMiddleware, async (req, res, next) => {
  try {
    const donorId = req.user._id;
    const supportRequests = await SupportRequestDonor.find({ donor: donorId }).select("-__v").sort({ createdAt: -1 });
    res.status(200).json(supportRequests);
  } catch (error) {
    next(error);
  }
});

module.exports = router;