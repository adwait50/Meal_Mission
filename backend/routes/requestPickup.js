const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation.js");
const foodUploads = require("../utils/multerConfig.js");
const supabase = require("../config/supabaseClient.js"); // Import Supabase client
const authDonorMiddleware = require("../middlewares/authDonorMiddleware.js"); 
const moment = require("moment");

// Function to format the date
const formatDate = (date) => {
  const today = moment().startOf("day"); 
  const tomorrow = moment().add(1, "days").startOf("day"); 
  const yesterday = moment().subtract(1, "days").startOf("day"); 

  const inputDate = moment(date); 

  if (inputDate.isSame(today)) {
    return "Today"; 
  } else if (inputDate.isSame(tomorrow)) {
    return "Tomorrow"; 
  } else if (inputDate.isSame(yesterday)) {
    return "Yesterday"; 
  } else {
    return inputDate.format("DD-MM-YYYY hh:mm A"); 
  }
};

// Generate a human-friendly unique request ID like REQ-851998-J1146S
const generateRequestId = () => {
  const numeric = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  const alnum = (() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let s = "";
    for (let i = 0; i < 6; i += 1) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  })();
  return `REQ-${numeric}-${alnum}`;
};

// Function to upload image to Supabase
const uploadImageToSupabase = async (file) => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `food-images/${timestamp}-${randomString}.${fileExtension}`; // folder inside your bucket

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
  } catch (err) {
    console.error("Image upload error:", err);
    throw new Error("Failed to upload image");
  }
};

// Request Pickup Route
router.post("/request-pickup", authDonorMiddleware, foodUploads.single('foodImage'), async (req, res) => {
  try {
      const { donorName, phone, address, city, state, foodItems, quantity, pickupDate, additionalNotes } = req.body;
      // Debug: surface what arrived
      console.log("/request-pickup body:", req.body);
      console.log("/request-pickup has file:", !!req.file, req.file?.mimetype);
      const donorId = req.user._id;

      // Validate required fields with explicit feedback
      const missing = [];
      if (!donorName || String(donorName).trim() === "") missing.push("donorName");
      if (!phone || String(phone).trim() === "") missing.push("phone");
      if (!quantity || String(quantity).trim() === "") missing.push("quantity");
      if (!address || String(address).trim() === "") missing.push("address");
      if (!city || String(city).trim() === "") missing.push("city");
      if (!state || String(state).trim() === "") missing.push("state");
      if (!foodItems || String(foodItems).trim() === "") missing.push("foodItems");
      if (!pickupDate || String(pickupDate).trim() === "") missing.push("pickupDate");
      if (missing.length) {
          return res.status(400).json({ message: "Missing required fields", missing });
      }

      let imageUrl = null;
      
      // Upload image to Supabase if provided
      if (req.file) {
          try {
              imageUrl = await uploadImageToSupabase(req.file);
          } catch (uploadError) {
              return res.status(500).json({ message: "Failed to upload image" });
          }
      }

      // Create new donation request
      const newDonation = new Donation({
          donor: donorId,
          donorName,
          phone,
          city: String(city).toLowerCase(),
          state: String(state).toLowerCase(),
          quantity,
          address,
          foodItems,
          pickupDate: new Date(pickupDate),
          foodImage: imageUrl, // Store the Supabase URL instead of local path
          additionalNotes,
          requestId: generateRequestId(),
          status: "Pending",
          createdAt: new Date()
      });

      await newDonation.save();

      res.status(201).json({
          message: "Pickup request submitted successfully",
          donation: newDonation
      });
  } catch (error) {
      console.error("Error submitting pickup request:", error);
      res.status(500).json({ message: "Error submitting pickup request" });
  }
});

module.exports = router;