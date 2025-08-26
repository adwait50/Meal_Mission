const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation.js");
const foodUploads = require("../utils/foodUploads.js");
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
    return "Tomorrow"; 
  } else {
    return inputDate.format("DD-MM-YYYY hh:mm A"); 
  }
};

// Function to upload image to Supabase
const uploadImageToSupabase = async (file) => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `food-images/${timestamp}-${randomString}.${fileExtension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('food-images') // Your bucket name
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600'
      });

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('food-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to upload image');
  }
};

// Request Pickup Route
router.post("/request-pickup", authDonorMiddleware, foodUploads.single('foodImage'), async (req, res) => {
  try {
    const { foodItem, quantity, address, city, state } = req.body;
    const donorId = req.user._id;

    // Validate required fields
    if (!foodItem || !quantity || !address || !city || !state) {
      return res.status(400).json({ message: "All fields are required" });
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
      foodItem,
      quantity,
      address,
      city: city.toLowerCase(),
      state: state.toLowerCase(),
      foodImage: imageUrl, // Store the Supabase URL instead of local path
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