const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation.js");
const foodUploads = require("../utils/foodUploads.js");
const authMiddleware = require("../middlewares/authMiddleware.js"); // Import authMiddleware

// Request Pickup Route
router.post(
  "/request-pickup",
  authMiddleware, // ✅ Apply authentication middleware
  foodUploads.single("foodImage"),
  async (req, res) => {
    try {
      console.log("Authenticated User:", req.user); // ✅ Debugging step

      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      // Check if image was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Food image is required",
        });
      }

      // Required fields validation
      const requiredFields = [
        "donorName",
        "phone",
        "address",
        "foodItems",
        "quantity",
        "pickupDate",
      ];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`,
          });
        }
      }

      // Generate request ID
      const generateRequestId = () => {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8);
        return `REQ-${timestamp.slice(-6)}-${random.toUpperCase()}`;
      };

      // Create new donation request
      const requestId = generateRequestId();
      const donation = new Donation({
        donor: req.user._id, // ✅ Now req.user is available
        donorName: req.body.donorName,
        phone: req.body.phone,
        address: req.body.address,
        foodItems: req.body.foodItems,
        quantity: req.body.quantity,
        pickupDate: new Date(req.body.pickupDate),
        foodImage: req.file.path,
        additionalNotes: req.body.additionalNotes,
        requestId: requestId,
      });

      await donation.save();

      res.status(201).json({
        success: true,
        message: "Pickup request submitted successfully",
        requestId: requestId,
      });
    } catch (error) {
      console.error("Error submitting pickup request:", error);
      res.status(500).json({
        success: false,
        message: "Error submitting pickup request",
      });
    }
  }
);

module.exports = router;
