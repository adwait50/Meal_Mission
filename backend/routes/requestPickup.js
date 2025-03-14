const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation.js");
const foodUploads = require("../utils/foodUploads.js");
const authDonorMiddleware = require("../middlewares/authDonorMiddleware.js"); // Import authMiddleware
const moment = require("moment");

// Function to format the date
const formatDate = (date) => {
  const today = moment().startOf('day'); // Get today's date at midnight
  const tomorrow = moment().add(1, 'days').startOf('day'); // Get tomorrow's date at midnight
  const yesterday = moment().subtract(1, 'days').startOf('day'); // Get yesterday's date at midnight

  const inputDate = moment(date); // Convert the input date to a moment object

  if (inputDate.isSame(today)) {
      return "Today"; // If the date is today
  } else if (inputDate.isSame(tomorrow)) {
      return "Tomorrow"; // If the date is tomorrow
  } else if (inputDate.isSame(yesterday)) {
      return "Yesterday"; // If the date is yesterday
  } else {
      return inputDate.format("DD-MM-YYYY hh:mm A"); // Format the date if it's not today, tomorrow, or yesterday
  }
};
// Request Pickup Route
router.post(
  "/request-pickup",
  authDonorMiddleware, // ✅ Apply authentication middleware
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
        createdAt: moment().format("DD-MM-YYYY hh:mm A")
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

const displayDate = formatDate(Donation.createdAt);


module.exports = router;
