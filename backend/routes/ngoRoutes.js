const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const NGOModel = require("../models/ngoModel.js");
const randomstring = require("randomstring");
const sendEmail = require("../utils/sendEmail.js");
const authNgoMiddleware = require("../middlewares/authNgoMiddleware.js");
const upload = require("../utils/multerConfig.js");
const SupportRequestNgo = require("../models/SupportRequestNgo.js");
const Donation = require("../models/Donation.js");
const supabase = require("../config/supabaseClient.js");
const rateLimit = require("express-rate-limit");
const validate = require("../middlewares/validate.js");
const redis = require("../config/redisClient.js");
const { ngoRegisterSchema, ngoLoginSchema, ngoForgotPasswordSchema, ngoResetPasswordSchema } = require("../validators/ngoValidator.js");

const generateOTP = () =>
  randomstring.generate({ length: 6, charset: "numeric" });

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many attempts, please try again after 15 minutes" }
});

const uploadNgoDocumentToSupabase = async (file) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `ngo-docs/${timestamp}-${randomString}.${fileExtension}`;

  const BUCKET = process.env.SUPABASE_BUCKET;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "3600"
    });

  if (error) throw new Error(`Supabase upload error: ${error.message}`);

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return publicUrl;
};

const router = express.Router();

router.post("/register", validate(ngoRegisterSchema), upload.single("documentProof"), async (req, res, next) => {
  try {
    const { name, email, password, address, city, state, phone } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload ID proof document" });
    }

    let existingNGO = await NGOModel.findOne({ email });

    if (existingNGO) {
      if (!existingNGO.isVerified) {
        const otp = generateOTP();
        existingNGO.otp = otp;
        existingNGO.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        await existingNGO.save();
        await sendEmail(email, "Your new OTP code", `Your OTP is: ${otp}`);
        return res.status(200).json({ message: "New OTP sent to email. Verify to complete registration." });
      }
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    let documentProofUrl = null;
    try {
      documentProofUrl = await uploadNgoDocumentToSupabase(req.file);
    } catch (uploadError) {
      return next(uploadError);
    }

    const newNGO = new NGOModel({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      documentProof: documentProofUrl,
      otp,
      city: city.toLowerCase(),
      state: state.toLowerCase(),
      otpExpires,
      isApproved: false,
    });

    await newNGO.save();
    await sendEmail(email, "Your OTP code", `Your OTP is: ${otp}`);

    res.status(201).json({ message: "OTP sent to email. Verify to complete registration." });
  } catch (error) {
    next(error);
  }
});

router.post("/verify-otp", authLimiter, async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });

    if (!NGO) return res.status(400).json({ message: "Invalid Email" });
    if (NGO.isVerified) return res.status(400).json({ message: "Email already verified" });
    if (NGO.otp !== otp || NGO.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    NGO.isVerified = true;
    NGO.otp = null;
    NGO.otpExpires = null;
    await NGO.save();

    res.json({ message: "Email verified successfully. Please wait for admin approval." });
  } catch (error) {
    next(error);
  }
});

router.post("/login", validate(ngoLoginSchema), authLimiter, async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });

    if (!NGO) return res.status(400).json({ message: "Invalid email or password" });
    if (!NGO.isVerified) return res.status(400).json({ message: "Email not verified" });
    if (!NGO.isApproved) return res.status(400).json({ message: "Your account is under review." });

    const isMatch = await bcrypt.compare(password.trim(), NGO.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = jwt.sign(
      { id: NGO._id.toString(), role: "NGO" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: NGO._id.toString(), role: "NGO" },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

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

router.post("/refresh-token", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const isBlacklisted = await redis.get(`bl_${refreshToken}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const accessToken = jwt.sign(
      { id: decoded.id, role: "NGO" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ token: accessToken });
  } catch (error) {
    next(error);
  }
});

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

router.get("/dashboard", authNgoMiddleware, async (req, res, next) => {
  try {
    const NGO = await NGOModel.findById(req.user._id).select("-password");
    if (!NGO) return res.status(404).json({ message: "NGO not found" });
    res.json(NGO);
  } catch (error) {
    next(error);
  }
});

router.post("/forgot-password", authLimiter, validate(ngoForgotPasswordSchema), async (req, res, next) => {
  const { email } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });
    if (!NGO) return res.status(400).json({ message: "Email not found" });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    NGO.resetPasswordOTP = otp;
    NGO.resetPasswordOTPExpires = otpExpires;
    await NGO.save();

    await sendEmail(email, "Password Reset OTP", `Your password reset OTP is: ${otp}`);

    res.status(200).json({ message: "Password reset OTP sent to email" });
  } catch (error) {
    next(error);
  }
});

router.post("/verify-reset-otp", async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });
    if (!NGO) return res.status(400).json({ message: "Email not found" });

    if (NGO.resetPasswordOTP !== otp || NGO.resetPasswordOTPExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", validate(ngoResetPasswordSchema), async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });
    if (!NGO) return res.status(400).json({ message: "Email not found" });

    if (NGO.resetPasswordOTP !== otp || NGO.resetPasswordOTPExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    NGO.password = hashedPassword;
    NGO.resetPasswordOTP = null;
    NGO.resetPasswordOTPExpires = null;
    await NGO.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/resend-otp", authLimiter, async (req, res, next) => {
  const { email } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });
    if (!NGO) return res.status(400).json({ message: "Email not found" });
    if (NGO.isVerified) return res.status(400).json({ message: "Email already verified" });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    NGO.otp = otp;
    NGO.otpExpires = otpExpires;
    await NGO.save();

    await sendEmail(email, "Your New OTP Code", `Your OTP is: ${otp}`);

    res.status(200).json({ message: "New OTP sent to email" });
  } catch (error) {
    next(error);
  }
});

router.post("/resend-reset-otp", async (req, res, next) => {
  const { email } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });
    if (!NGO) return res.status(400).json({ message: "Email not found" });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    NGO.resetPasswordOTP = otp;
    NGO.resetPasswordOTPExpires = otpExpires;
    await NGO.save();

    await sendEmail(email, "Your New Password Reset OTP", `Your password reset OTP is: ${otp}`);

    res.status(200).json({ message: "New password reset OTP sent to email" });
  } catch (error) {
    next(error);
  }
});

router.get("/food-pickup-requests", authNgoMiddleware, async (req, res, next) => {
  try {
    const ngo = await NGOModel.findById(req.user._id).select("city");
    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    const ngoCity = ngo.city.toLowerCase();
    const currentTime = new Date();
    const fourHoursAgo = new Date(currentTime.getTime() - 4 * 60 * 60 * 1000);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await Donation.countDocuments({
      city: ngoCity,
      status: "Pending",
      createdAt: { $gte: fourHoursAgo },
    });

    const requests = await Donation.find({
      city: ngoCity,
      status: "Pending",
      createdAt: { $gte: fourHoursAgo },
    })
      .populate("donor", "name email")
      .select("-phone -city -state -status -createdAt -__v -donor")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      requests,
      pagination: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/donation/:id/status", authNgoMiddleware, async (req, res, next) => {
  const { status } = req.body;

  const validStatuses = ["Pending", "Accepted", "In Progress", "Completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) return res.status(404).json({ message: "Donation not found" });

    if (donation.ngo && donation.ngo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    donation.status = status;
    await donation.save();

    res.status(200).json({ message: "success", status: donation.status });
  } catch (error) {
    next(error);
  }
});

router.get("/donation/:id", authNgoMiddleware, async (req, res, next) => {
  const { id } = req.params;

  try {
    const donation = await Donation.findById(id)
      .populate("donor", "name email phone")
      .select("-__v");

    if (!donation) return res.status(404).json({ message: "Donation not found" });

    res.status(200).json(donation);
  } catch (error) {
    next(error);
  }
});

router.put("/donation/:id/accept", authNgoMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const ngoId = req.user._id;

  try {
    const updatedDonation = await Donation.findByIdAndUpdate(
      id,
      { status: "In Progress", ngo: ngoId },
      { new: true }
    );

    if (!updatedDonation) return res.status(404).json({ message: "Donation not found" });

    res.status(200).json({ message: "Donation accepted and marked as In Progress", donation: updatedDonation });
  } catch (error) {
    next(error);
  }
});

router.put("/donation/:id/completed", authNgoMiddleware, async (req, res, next) => {
  const { id } = req.params;

  try {
    const updatedDonation = await Donation.findByIdAndUpdate(
      id,
      { status: "Completed" },
      { new: true }
    );

    if (!updatedDonation) return res.status(404).json({ message: "Donation not found" });

    res.status(200).json({ message: "Donation completed successfully", donation: updatedDonation });
  } catch (error) {
    next(error);
  }
});

router.put("/donation/:id/reject", authNgoMiddleware, async (req, res, next) => {
  const { id } = req.params;

  try {
    const updatedDonation = await Donation.findByIdAndUpdate(
      id,
      { status: "Rejected" },
      { new: true }
    );

    if (!updatedDonation) return res.status(404).json({ message: "Donation not found" });

    res.status(200).json({ message: "Donation rejected successfully", donation: updatedDonation });
  } catch (error) {
    next(error);
  }
});

router.get("/donation-history", authNgoMiddleware, async (req, res, next) => {
  try {
    const ngoId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalDonations = await Donation.countDocuments({ ngo: ngoId });
    const completedDonations = await Donation.countDocuments({ ngo: ngoId, status: "Completed" });
    const rejectedDonations = await Donation.countDocuments({ ngo: ngoId, status: "Rejected" });

    const [totalWeightData] = await Donation.aggregate([
      { $match: { ngo: ngoId, status: { $ne: "Rejected" } } },
      { $group: { _id: null, totalWeight: { $sum: "$quantity" } } },
    ]);

    const totalWeight = totalWeightData ? totalWeightData.totalWeight : 0;
    const timesDonated = totalDonations - rejectedDonations;

    const totalCount = await Donation.countDocuments({
      ngo: ngoId,
      status: { $in: ["Completed", "Rejected"] },
    });

    const donationHistory = await Donation.find({
      ngo: ngoId,
      status: { $in: ["Completed", "Rejected"] },
    })
      .select("foodItems pickupDate address status quantity requestId")
      .sort({ pickupDate: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      totalDonations,
      completedDonations,
      rejectedDonations,
      totalWeight,
      timesDonated,
      donationHistory,
      pagination: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/accepted-donations", authNgoMiddleware, async (req, res, next) => {
  try {
    const ngoId = req.user._id;

    const acceptedDonations = await Donation.find({ ngo: ngoId, status: "In Progress" })
      .populate("donor", "name email phone")
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json(acceptedDonations);
  } catch (error) {
    next(error);
  }
});

router.post("/support", authNgoMiddleware, async (req, res, next) => {
  const { requestId, issue, phone, email, description } = req.body;
  const ngoId = req.user._id;

  try {
    const supportRequestNgo = new SupportRequestNgo({
      ngo: ngoId,
      requestId,
      issue,
      phone,
      email,
      description,
      isCompleted: false
    });

    await supportRequestNgo.save();
    res.status(201).json({ message: "Support request submitted successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/support-requests", authNgoMiddleware, async (req, res, next) => {
  try {
    const ngoId = req.user._id;
    const supportRequests = await SupportRequestNgo.find({ ngo: ngoId });
    res.status(200).json(supportRequests);
  } catch (error) {
    next(error);
  }
});

module.exports = router;