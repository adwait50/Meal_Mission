const express = require("express");
const NGOModel = require("../models/ngoModel.js");
const authAdminMiddleware = require("../middlewares/authAdminMiddleware.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/Admin.js"); // Import the Admin model
const router = express.Router();
const RejectedNGO = require("../models/RejectedNGO.js");
const SupportRequestNgo = require("../models/SupportRequestNgo.js");
const SupportRequestDonor = require("../models/SupportRequestDonor.js");

//Admin approves NGO
router.put("/approve-ngo/:id", authAdminMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const updatedNgo = await NGOModel.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!updatedNgo) {
      return res.status(404).json({ message: "NGO not found" });
    }
    res.status(200).json(updatedNgo);
  } catch (error) {
    res.status(500).json({ message: "Error approving NGO", error });
  }
});

// Admin rejects an NGO
router.put("/reject-ngo/:id", authAdminMiddleware, async (req, res) => {
  const { id } = req.params; // Get the NGO ID from the URL
  const { reasonForRejection } = req.body; // Optional reason for rejection

  try {
    // Find the NGO by ID
    const ngo = await NGOModel.findById(id);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    // Create a new Rejected NGO document
    const rejectedNGO = new RejectedNGO({
      name: ngo.name,
      email: ngo.email,
      address: ngo.address,
      city: ngo.city,
      phone: ngo.phone,
      state: ngo.state,
      documentProof: ngo.documentProof,
      isApproved: false, // Mark the NGO as rejected
      reasonForRejection,
    });

    // Save the rejected NGO to the RejectedNGO collection
    await rejectedNGO.save();

    // Remove the NGO from the pending list
    await NGOModel.findByIdAndDelete(id);

    res.status(200).json({ message: "NGO rejected successfully" });
  } catch (error) {
    console.error("Error rejecting NGO:", error);
    res.status(500).json({ message: "Error rejecting NGO" });
  }
});

router.get("/pending", authAdminMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const pendingNgos = await NGOModel.find({ isApproved: false });
    res.status(200).json(pendingNgos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending NGOs", error });
  }
});

// Route to get NGO information by ID
router.get("/ngo-info/:id", async (req, res) => {
  console.log("Fetching NGO with ID:", req.params.id); // Debug log
  try {
    const ngo = await NGOModel.findById(req.params.id).select(
      "-password -otp -otpExpires -registrationDate -__v"
    );
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }
    res.status(200).json(ngo);
  } catch (error) {
    console.error("Error fetching NGO:", error);
    res.status(500).json({ message: "Error fetching NGO" });
  }
});

// Admin Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: admin._id.toString(), role: "Admin" },
      process.env.JWT_SECRET
    );

    // Send the token back to the client
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

router.get("/rejected-ngos", authAdminMiddleware, async (req, res) => {
  try {
    // Fetch all rejected NGOs
    const rejectedNGOs = await RejectedNGO.find().sort({ createdAt: -1 });

    res.status(200).json(rejectedNGOs); //
  } catch (error) {
    console.error("Error fetching rejected NGOs:", error);
    res.status(500).json({ message: "Error fetching rejected NGOs" });
  }
});
// Route to get NGO information by ID
// router.get("/:id", async (req, res) => {
//   console.log("Fetching NGO with ID:", req.params.id); // Debug log
//   try {
//     const ngo = await NGOModel.findById(req.params.id).select(
//       "-password -otp -otpExpires -registrationDate -__v"
//     );
//     if (!ngo) {
//       return res.status(404).json({ message: "NGO not found" });
//     }
//     res.status(200).json(ngo);
//   } catch (error) {
//     console.error("Error fetching NGO:", error);
//     res.status(500).json({ message: "Error fetching NGO" });
//   }
// });

router.get("/:type-support", authAdminMiddleware, async (req, res) => {
  const { type } = req.params;
  const { isCompleted } = req.query;

  try {
    let supportRequests = [];
    let query = {};

    if (isCompleted === "true") {
      query.isCompleted = true;
    } else if (isCompleted === "false") {
      query.isCompleted = false;
    } else if (isCompleted === "all") {
      query = {};
    } else {
      return res.status(400).json({
        message:
          "Invalid isCompleted parameter. Use 'true', 'false', or 'all'.",
      });
    }

    // Determine which model to use based on the type parameter
    if (type === "ngo") {
      supportRequests = await SupportRequestNgo.find(query).sort({
        createdAt: -1,
      });
    } else if (type === "donor") {
      supportRequests = await SupportRequestDonor.find(query).sort({
        createdAt: -1,
      });
    } else if (type === "all") {
      const donorRequests = await SupportRequestDonor.find(query).sort({
        createdAt: -1,
      });
      const ngoRequests = await SupportRequestNgo.find(query).sort({
        createdAt: -1,
      });
      supportRequests = [...donorRequests, ...ngoRequests];
    } else {
      return res.status(400).json({
        message: "Invalid type parameter. Use 'ngo', 'donor', or 'all'.",
      });
    }

    res.status(200).json(supportRequests);
  } catch (error) {
    console.error("Error fetching support requests:", error);
    res.status(500).json({ message: "Error fetching support requests" });
  }
});

router.patch(
  "/complete-request/:type/:id",
  authAdminMiddleware,
  async (req, res) => {
    const { type, id } = req.params; // Extract type and request ID from the URL
    try {
      let updatedRequest;

      // Determine which model to use based on the type parameter
      if (type === "NGO") {
        updatedRequest = await SupportRequestNgo.findByIdAndUpdate(
          id,
          { isCompleted: true },
          { new: true } // Return the updated document
        );
      } else if (type === "Donor") {
        updatedRequest = await SupportRequestDonor.findByIdAndUpdate(
          id,
          { isCompleted: true },
          { new: true } // Return the updated document
        );
      } else {
        return res.status(400).json({
          message: "Invalid type parameter. Use 'ngo' or 'donor'.",
        });
      }

      if (!updatedRequest) {
        return res.status(404).json({ message: "Support request not found." });
      }

      res.status(200).json(updatedRequest);
    } catch (error) {
      console.error("Error completing support request:", error);
      res.status(500).json({ message: "Error completing support request" });
    }
  }
);

// Route to get all NGOs (admin dashboard)
router.get("/dashboard", authAdminMiddleware, async (req, res) => {
  try {
    const ngos = await NGOModel.find({ isApproved: true }).select("-password"); // only approved NGOs
    res.status(200).json(ngos);
  } catch (error) {
    console.error("Error fetching NGOs:", error);
    res.status(500).json({ message: "Error fetching NGO list" });
  }
});

// Get details of a specific NGO by _id
router.get("/ngo/:id", authAdminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const ngo = await NGOModel.findById(id).select("-password"); // exclude password
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }
    res.status(200).json(ngo);
  } catch (error) {
    console.error("Error fetching NGO details:", error);
    res.status(500).json({ message: "Error fetching NGO details" });
  }
});

// Delete a specific NGO by _id
router.delete("/ngo/:id", authAdminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNGO = await NGOModel.findByIdAndDelete(id);

    if (!deletedNGO) {
      return res.status(404).json({ message: "NGO not found" });
    }

    res.status(200).json({
      message: "NGO deleted successfully",
      deletedNGO, // optional: returns deleted NGO info
    });
  } catch (error) {
    console.error("Error deleting NGO:", error);
    res.status(500).json({ message: "Error deleting NGO" });
  }
});

module.exports = router;
