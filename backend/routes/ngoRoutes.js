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

const generateOTP = () =>
  randomstring.generate({ length: 4, charset: "numeric" });
const router = express.Router();

//register NGO
router.post("/register", upload.single("documentProof"), async (req, res) => {
  try {
    const { name, email, password, address, city, state, phone } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Please upload ID proof document" });
    }

    // Check if NGO already exists
    let existingNGO = await NGOModel.findOne({ email });

    if (existingNGO) {
      if (!existingNGO.isVerified) {
        // ✅ Resend OTP for verification
        const otp = generateOTP();
        existingNGO.otp = otp;
        existingNGO.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
        await existingNGO.save();

        await sendEmail(email, "Your new OTP code", `Your OTP is: ${otp}`);

        return res.status(200).json({
          message: "New OTP sent to email. Verify to complete registration.",
        });
      }
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ FIX: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP for verification
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    // ✅ FIX: Ensure `documentProof` is properly stored
    const documentProofPath = req.file.path; // Modify this if using a cloud service (e.g., AWS S3)

    const newNGO = new NGOModel({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      documentProof: documentProofPath,
      otp,
      city: city.toLowerCase(),
      state: state.toLowerCase(),
      otpExpires,
      isApproved: false,
    });

    await newNGO.save();

    // ✅ Send OTP via email
    await sendEmail(email, "Your OTP code", `Your OTP is: ${otp}`);

    res.status(201).json({
      message: "OTP sent to email. Verify to complete registration.",
    });
  } catch (error) {
    console.error("NGO Registration Error:", error);
    res.status(500).json({
      message: "Error registering NGO",
      error: error.message, // This helps in debugging
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
// NGO Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const NGO = await NGOModel.findOne({ email });

    if (!NGO) {
      console.log("NGO not found for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("NGO found:", NGO);

    if (!NGO.isVerified)
      return res.status(400).json({ message: "Email not verified" });
    if (!NGO.isApproved)
      return res
        .status(400)
        .json({ message: "Account pending admin approval" });

    console.log("Stored hashed password:", NGO.password);
    console.log("Entered password:", password.trim());

    const isMatch = await bcrypt.compare(password.trim(), NGO.password);

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("Password matched successfully");

    const token = jwt.sign(
      { id: NGO._id.toString(), role: "NGO" }, // Add "role"
      process.env.JWT_SECRET
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

router.get("/dashboard", authNgoMiddleware, async (req, res) => {
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

router.post("/logout", authNgoMiddleware, async (req, res) => {
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

// Route to browse food pickup requests based on NGO's city
router.get("/food-pickup-requests", authNgoMiddleware, async (req, res) => {
  try {
    const ngo = await NGOModel.findById(req.user.id).select("city"); // Get the city of the NGO
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    const ngoCity = ngo.city.toLowerCase();

    // Fetch all pickup requests that match the NGO's city
    const requests = await Donation.find({ city: ngoCity }) // Filter by city
      .populate("donor", "name email")
      .select("-_id -phone -city -state -status -createdAt -__v -donor") // Exclude specified fields
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching pickup requests:", error);
    res.status(500).json({ message: "Error fetching pickup requests" });
  }
});

// Example route to update the status of a donation
router.put("/donation/:id/status", authNgoMiddleware, async (req, res) => {
  const { status } = req.body; // Expecting the new status in the request body

  // Validate the status
  const validStatuses = ["Pending", "Accepted", "In Progress", "Completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    // Find the donation by ID and update the status
    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({
      message: "success",
      status: updatedDonation.status,
    });
  } catch (error) {
    console.error("Error updating donation status:", error);
    res.status(500).json({ message: "Error updating donation status" });
  }
});

router.get("/donation-history", authNgoMiddleware, async (req, res) => {
  try {
    const ngoId = req.user._id;

    const [totalWeightData] = await Donation.aggregate([
      { $match: { ngo: ngoId } },
      { $group: { _id: null, totalWeight: { $sum: "$quantity" } } },
    ]);

    const totalWeight = totalWeightData ? totalWeightData.totalWeight : 0;

    // Total Donations
    const totalDonations = await Donation.countDocuments({ ngo: ngoId });

    // Times Donated
    const timesDonated = totalDonations;

    // Donation History
    const donationHistory = await Donation.find({ ngo: ngoId })
      .select("foodItem createdAt address status quantity requestId")
      .sort({ createdAt: -1 }); // Sort by date

    return res.status(200).json({
      totalWeight,
      totalDonations,
      timesDonated,
      donationHistory,
    });
  } catch (error) {
    console.error("Error fetching donation history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/support", authNgoMiddleware, async (req, res) => {
  const { requestId, issue, phone, email, description } = req.body;

  try {
    const supportRequestNgo = new SupportRequestNgo({
      requestId,
      issue,
      phone,
      email,
      description,
      isCompleted:false
    });

    await supportRequestNgo.save();

    res.status(201).json({ message: "Support request submitted successfully" });
  } catch (error) {
    console.error("Error submitting support request:", error);
    res.status(500).json({ message: "Error submitting support request" });
  }
});

module.exports = router;
