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
const supabase = require("../config/supabaseClient.js"); // Import Supabase client

const generateOTP = () =>
  randomstring.generate({ length: 4, charset: "numeric" });

// Function to upload NGO document to Supabase
const uploadNgoDocumentToSupabase = async (file) => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `ngo-docs/${timestamp}-${randomString}.${fileExtension}`;

    const BUCKET = process.env.SUPABASE_BUCKET;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: "3600"
      });

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('NGO document upload error:', error);
    throw new Error('Failed to upload NGO document');
  }
};

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

    // Upload NGO document to Supabase
    let documentProofUrl = null;
    try {
      documentProofUrl = await uploadNgoDocumentToSupabase(req.file);
    } catch (uploadError) {
      return res.status(500).json({ message: "Failed to upload document" });
    }

    const newNGO = new NGOModel({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      documentProof: documentProofUrl, // Store Supabase URL instead of local path
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
        .json({ message: "Your account is under review. " });

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
    const NGO = await NGOModel.findById(req.user._id).select("-password");
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
    const ngo = await NGOModel.findById(req.user._id).select("city");
    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    const ngoCity = ngo.city.toLowerCase();

    // Log the current time when NGO requests the data
    const currentTime = new Date();
    console.log("NGO requested food pickups at:", currentTime);

    // Calculate 4 hours ago from current time
    const fourHoursAgo = new Date(currentTime.getTime() - 4 * 60 * 60 * 1000);

    // Fetch only pending requests created in the last 4 hours from now
    const requests = await Donation.find({
      city: ngoCity,
      status: "Pending",
      createdAt: { $gte: fourHoursAgo } // filter by last 4 hours from current click
    })
      .populate("donor", "name email")
      .select("-phone -city -state -status -createdAt -__v -donor")
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

// Route to get donation details by ID
router.get("/donation/:id", authNgoMiddleware, async (req, res) => {
  const { id } = req.params; 
  console.log("Fetching donation with ID:", id); // Debug log

  try {
      // Find the donation by ID and populate donor information
      const donation = await Donation.findById(id)
          .populate("donor", "name email phone") // Populate donor details
          .select("-__v"); // Exclude version key

      if (!donation) {
          return res.status(404).json({ message: "Donation not found" });
      }

      // Return the donation details
      res.status(200).json(donation);
  } catch (error) {
      console.error("Error fetching donation details:", error);
      res.status(500).json({ message: "Error fetching donation details" });
  }
});

// Route to accept a donation request

// Route to accept a donation request
router.put("/donation/:id/accept", authNgoMiddleware, async (req, res) => {

  const { id } = req.params; // Get the donation ID from the URL
  const ngoId = req.user._id; // Get the NGO's ID from the authenticated user

  try {
      // Find the donation by ID and update the status and NGO ID
      const updatedDonation = await Donation.findByIdAndUpdate(
          id,
          { 
              status: "In Progress",
              ngo: ngoId // Store the NGO's ID in the donation
          },
          { new: true } // Return the updated document
      );

      if (!updatedDonation) {
          return res.status(404).json({ message: "Donation not found" });
      }

      // Return success response
      res.status(200).json({
          message: "Donation accepted and marked as In Progress",
          donation: updatedDonation
      });
  } catch (error) {
      console.error("Error accepting donation:", error);
      res.status(500).json({ message: "Error accepting donation" });
  }
});

/*
// Route to reject a donation request
router.put("/donation/:id/reject", authNgoMiddleware, async (req, res) => {
  const { id } = req.params; // Get the donation ID from the URL

  try {
      // Find the donation by ID and update the status to "Rejected"
      const updatedDonation = await Donation.findByIdAndUpdate(
          id,
          { status: "Rejected" },
          { new: true } // Return the updated document
      );

      if (!updatedDonation) {
          return res.status(404).json({ message: "Donation not found" });
      }

      // Return success response
      res.status(200).json({
          message: "Donation rejected successfully",
          donation: updatedDonation
      });
  } catch (error) {
      console.error("Error rejecting donation:", error);
      res.status(500).json({ message: "Error rejecting donation" });
  }
});
*/

router.put("/donation/:id/completed", authNgoMiddleware, async (req, res) => {
  const { id } = req.params; // Get the donation ID from the URL

  try {
      // Find the donation by ID and update the status to "Completed"
      const updatedDonation = await Donation.findByIdAndUpdate(
          id,
          { status: "Completed" },
          { new: true } // Return the updated document
      );

      if (!updatedDonation) {
          return res.status(404).json({ message: "Donation not found" });
      }

      // Return success response
      res.status(200).json({
          message: "Donation accepted successfully",
          donation: updatedDonation
      });
  } catch (error) {
      console.error("Error accepting donation:", error);
      res.status(500).json({ message: "Error accepting donation" });
  }
});

router.put("/donation/:id/reject", authNgoMiddleware, async (req, res) => {
  const { id } = req.params; // Get the donation ID from the URL

  try {
      // Find the donation by ID and update the status to "Completed"
      const updatedDonation = await Donation.findByIdAndUpdate(
          id,
          { status: "Rejected" },
          { new: true } // Return the updated document
      );

      if (!updatedDonation) {
          return res.status(404).json({ message: "Donation not found" });
      }

      // Return success response
      res.status(200).json({
          message: "Donation accepted successfully",
          donation: updatedDonation
      });
  } catch (error) {
      console.error("Error accepting donation:", error);
      res.status(500).json({ message: "Error accepting donation" });
  }
});

router.get("/donation-history", authNgoMiddleware, async (req, res) => {
  try {
    const ngoId = req.user._id;

    // Total donations (all, regardless of status)
    const totalDonations = await Donation.countDocuments({ ngo: ngoId });

    // Completed donations
    const completedDonations = await Donation.countDocuments({
      ngo: ngoId,
      status: "Completed",
    });

    // Rejected donations
    const rejectedDonations = await Donation.countDocuments({
      ngo: ngoId,
      status: "Rejected",
    });

    // Total weight excluding rejected
    const [totalWeightData] = await Donation.aggregate([
      { $match: { ngo: ngoId, status: { $ne: "Rejected" } } },
      { $group: { _id: null, totalWeight: { $sum: "$quantity" } } },
    ]);

    const totalWeight = totalWeightData ? totalWeightData.totalWeight : 0;

    // Times donated = all except rejected
    const timesDonated = totalDonations - rejectedDonations;

    // Donation history → Completed + Rejected (with pickupDate)
    const donationHistory = await Donation.find({
      ngo: ngoId,
      status: { $in: ["Completed", "Rejected"] },
    })
      .select("foodItems pickupDate address status quantity requestId")
      .sort({ pickupDate: -1 });

    return res.status(200).json({
      totalDonations,
      completedDonations,
      rejectedDonations,
      totalWeight,
      timesDonated,
      donationHistory,
    });
  } catch (error) {
    console.error("Error fetching donation history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get all accepted donations by an NGO
router.get("/accepted-donations", authNgoMiddleware, async (req, res) => {
  try {
      const ngoId = req.user._id; 

      
      const acceptedDonations = await Donation.find({ 
          ngo: ngoId, 
          status: "In Progress"
      })
      .populate("donor", "name email phone") // Populate donor details
      .select("-__v") // Exclude version key
      .sort({ createdAt: -1 }); // Sort by creation date, most recent first

      // Return the accepted donations
      res.status(200).json(acceptedDonations);
  } catch (error) {
      console.error("Error fetching accepted donations:", error);
      res.status(500).json({ message: "Error fetching accepted donations" });
  }
});

// Route to post a support request for the authenticated NGO
router.post("/support", authNgoMiddleware, async (req, res) => {
  const { requestId, issue, phone, email, description } = req.body;
  const ngoId = req.user._id; // Get the NGO ID from the authenticated user

  try {
    const supportRequestNgo = new SupportRequestNgo({
      ngo: ngoId, // Add the NGO ID
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
    console.error("Error submitting support request:", error);
    res.status(500).json({ message: "Error submitting support request" });
  }
});

// Route to get all support requests for the authenticated NGO
router.get("/support-requests", authNgoMiddleware, async (req, res) => {
  try {
      const ngoId = req.user._id; 
      console.log("NGO ID from token:", ngoId);
      console.log("NGO user object:", req.user);
      
      const supportRequests = await SupportRequestNgo.find({ ngo: ngoId });
      console.log("Found support requests:", supportRequests);
      console.log("Number of support requests:", supportRequests.length);

      res.status(200).json(supportRequests);
  } catch (error) {
      console.error("Error fetching support requests:", error);
      res.status(500).json({ message: "Error fetching support requests" });
  }
});

module.exports = router;
