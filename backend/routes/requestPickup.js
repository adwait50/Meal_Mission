const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const foodUploads = require("../utils/foodUploads");

// Generate unique request ID
const generateRequestId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `REQ-${timestamp.slice(-6)}-${random.toUpperCase()}`;
};

// Request Pickup Route
router.post(
  "/request-pickup",
  foodUploads.single("foodImage"),
  async (req, res) => {
    try {
      // Check if image was foodUploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Food image is required",
        });
      }

      // Updated required fields
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

      // Create new donation request
      const requestId = generateRequestId();
      const donation = new Donation({
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
