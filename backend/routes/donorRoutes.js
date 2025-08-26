const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Donor = require("../models/donor.js");
const sendEmail = require("../utils/sendEmail.js");
const randomstring = require("randomstring");
const authDonorMiddleware = require("../middlewares/authDonorMiddleware.js");
const Donation = require("../models/Donation.js");
const SupportRequestDonor = require("../models/SupportRequestDonor.js");

const router = express.Router();

const generateOTP = () =>
  randomstring.generate({ length: 4, charset: "numeric" });

//registering the donor(otp sending)
router.post("/register", async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  try {
    const existingUser = await Donor.findOne({ email });
    if (existingUser) {
      // Check if the user is not verified
      if (!existingUser.isVerified) {
        // Generate a new OTP and update the existing donor
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

        existingUser.otp = otp;
        existingUser.otpExpires = otpExpires;
        await existingUser.save();

        await sendEmail(email, "Your new OTP code", `Your OTP is: ${otp}`);

        return res.status(200).json({
          message: "New OTP sent to email. Verify to complete registration.",
        });
      }
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //otp
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    //creating and saving new donor
    const donor = new Donor({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      otp,
      otpExpires,
    });

    await donor.save();

    await sendEmail(email, "Your OTP code", `Your OTP is: ${otp}`);

    res.status(201).json({
      message: "OTP sent to email. Verify to complete registration.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering donor" });
  }
});

//verifying otp

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const donor = await Donor.findOne({ email });

    if (!donor)
      return res.json(400).json({
        message: "Invalid Email",
      });

    if (donor.isVerified)
      return res.status(400).json({
        message: "Email already verified",
      });

    if (donor.otp !== otp || donor.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    donor.isVerified = true;
    donor.otp = null;
    donor.otpExpires = null;
    await donor.save();

    res.json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

//login of donor

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const donor = await Donor.findOne({ email });

    if (!donor) {
      console.log("Donor not found for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("Donor found:", donor);

    if (!donor.isVerified) {
      console.log("Email not verified for:", email);
      return res.status(400).json({ message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password.trim(), donor.password);

    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("Password matched successfully");

    const token = jwt.sign(
      { id: donor._id, role: "Donor" },
      process.env.JWT_SECRET
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Donor Login Error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

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
router.get("/logout", async (req, res) => {
  res.clearCookie("token", { sameSite: "None", secure: true });
  res.status(200).json({ message: "logged out successfully" });
});

router.get("/dashboard", authDonorMiddleware, async (req, res) => {
  try {
    const donor = await Donor.findById(req.user._id).select("-password"); // Exclude password
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.status(200).json(donor);
  } catch (error) {
    console.error("Error fetching donor dashboard data:", error);
    res.status(500).json({ message: "Error fetching donor dashboard data" });
  }
});
// Fetch Active Requests
router.get("/active-requests", authDonorMiddleware, async (req, res) => {
  try {
    const donorId = req.user._id;
    console.log("Donor ID:", donorId);

    const activeRequests = await Donation.find(
      {
        donor: donorId,
        status: { $in: ["Pending", "In Progress"] }, // only pending + in progress
      },
      {
        requestId: 1,
        status: 1,
        foodItems: 1,
        quantity: 1,
        createdAt: 1,
        donorName: 1,
        foodImage:1,
      }
    ).sort({ createdAt: -1 }); // Sort by newest first

    if (!activeRequests.length) {
      return res.status(404).json({ message: "No active requests found." });
    }

    return res.status(200).json(activeRequests);
  } catch (error) {
    console.error("Error fetching active requests:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
});


// Fetch Donation History
// routes/donor.js

router.get("/donation-history", authDonorMiddleware, async (req, res) => {
  try {
    const donorId = req.user._id;

    // Completed + Rejected only
    const donationHistory = await Donation.find({
      donor: donorId,
      status: { $in: ["Completed", "Rejected","Cancelled"] },
    })
      .select("foodItem createdAt pickupDate address status quantity requestId")
      .sort({ createdAt: -1 });

    // Calculate stats
    const totalWeight = donationHistory
  .filter((d) => d.status === "Completed")
  .reduce((acc, d) => acc + (d.quantity || 0), 0);

    const totalDonations = donationHistory.length;
    const timesDonated = donationHistory.filter(
      (d) => d.status === "Completed"
    ).length;

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



// Route to get donation details by ID for a donor
router.get("/donation/:id", authDonorMiddleware, async (req, res) => {
  const { id } = req.params; // Get the donation ID from the URL
  const donorId = req.user._id; // Get the donor's ID from the authenticated user
  console.log("Fetching donation with ID:", id); // Debug log
  console.log("Donor ID:", donorId); // Debug log

  try {
      // Find the donation by ID and ensure it belongs to the authenticated donor
      const donation = await Donation.findOne({ 
          _id: id,
          donor: donorId // Ensure the donation belongs to this donor
      })
      .populate("ngo", "name email phone") // Populate NGO details if the donation is accepted
      .select("-__v"); // Exclude version key

      if (!donation) {
          return res.status(404).json({ message: "Donation not found or you don't have access to it" });
      }

      // Return the donation details
      res.status(200).json(donation);
  } catch (error) {
      console.error("Error fetching donation details:", error);
      res.status(500).json({ message: "Error fetching donation details" });
  }
});

//delete pending request

router.put("/donation/:id/cancel", authDonorMiddleware, async (req, res) => {
  const { id } = req.params; // Get the donation ID from the URL
  const donorId = req.user._id; // Get the donor's ID from the authenticated user
  
  console.log("=== CANCEL DONATION ROUTE CALLED ===");
  console.log("Updating donation with ID:", id); // Debug log
  console.log("Donor ID:", donorId); // Debug log
  console.log("Request method:", req.method); // Debug log
  console.log("Request URL:", req.originalUrl); // Debug log

  try {
      // First, find the donation to check if it exists and belongs to the donor
      const existingDonation = await Donation.findOne({ 
          _id: id,
          donor: donorId
      });

      if (!existingDonation) {
          console.log("Donation not found or access denied");
          return res.status(404).json({ message: "Donation not found or you don't have access to it" });
      }

      // Check if donation can be cancelled
      if (existingDonation.status === "Completed" || existingDonation.status === "Cancelled") {
          return res.status(400).json({ 
              message: `Cannot cancel donation with status: ${existingDonation.status}` 
          });
      }

      console.log("Current donation status:", existingDonation.status);
      console.log("Current donation donor:", existingDonation.donor);

      // Update the donation status
      const donation = await Donation.findByIdAndUpdate(
          id,
          { 
              status: "Cancelled" // Update the status
          },
          { 
              new: true, // Return the updated document
              runValidators: true // Re-enable validation now that schema is fixed
          }
      );

      if (!donation) {
          console.log("Failed to update donation");
          return res.status(500).json({ message: "Failed to update donation status" });
      }

      console.log("Donation cancelled successfully:", donation._id);
      console.log("New status:", donation.status);
      
      // Return the updated donation details
      res.status(200).json({ 
          message: "Donation status updated successfully",
          donation: donation 
      });
  } catch (error) {
      console.error("Error updating donation status:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      
      // Provide more specific error messages
      if (error.name === 'ValidationError') {
          return res.status(400).json({ 
              message: "Validation error: " + error.message,
              details: error.errors 
          });
      } else if (error.name === 'CastError') {
          return res.status(400).json({ 
              message: "Invalid donation ID format" 
          });
      } else {
          return res.status(500).json({ 
              message: "Error updating donation status: " + error.message 
          });
      }
  }
});

router.post("/support", authDonorMiddleware, async (req, res) => {
  const { requestId, issue, phone, email, description } = req.body;
  console.log(req.body);
  try {
    const supportRequestDonor = new SupportRequestDonor({
      donor: req.user._id,
      requestId,
      issue,
      phone,
      email,
      description,
      isCompleted:false
    });

    await supportRequestDonor.save();

    res.status(201).json({ message: "Support request submitted successfully" });
  } catch (error) {
    console.error("Error submitting support request:", error);
    res.status(500).json({ message: "Error submitting support request" });
  }
});

module.exports = router;

router.get("/support-requests", authDonorMiddleware, async (req, res) => {
  try {
      const donorId = req.user._id; // Get the donor's ID from the authenticated user

      // Fetch all support requests that belong to this donor
      const supportRequests = await SupportRequestDonor.find({ 
          donor: donorId // Match the donor ID
      })
      .select("-__v") // Exclude version key
      .sort({ createdAt: -1 }); // Sort by creation date, most recent first

      // Return the support requests
      res.status(200).json(supportRequests);
  } catch (error) {
      console.error("Error fetching support requests:", error);
      res.status(500).json({ message: "Error fetching support requests" });
  }
});