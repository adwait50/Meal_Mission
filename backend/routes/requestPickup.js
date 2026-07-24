const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation.js");
const foodUploads = require("../utils/multerConfig.js");
const supabase = require("../config/supabaseClient.js");
const authDonorMiddleware = require("../middlewares/authDonorMiddleware.js");
const moment = require("moment");
const rateLimit = require("express-rate-limit");

const pickupLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  message: { message: "Too many pickup requests, please try again after 30 minutes" }
});

const formatDate = (date) => {
  const today = moment().startOf("day");
  const tomorrow = moment().add(1, "days").startOf("day");
  const yesterday = moment().subtract(1, "days").startOf("day");
  const inputDate = moment(date);

  if (inputDate.isSame(today)) return "Today";
  else if (inputDate.isSame(tomorrow)) return "Tomorrow";
  else if (inputDate.isSame(yesterday)) return "Yesterday";
  else return inputDate.format("DD-MM-YYYY hh:mm A");
};

const generateRequestId = () => {
  const numeric = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
  const alnum = (() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let s = "";
    for (let i = 0; i < 6; i += 1) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  })();
  return `REQ-${numeric}-${alnum}`;
};

const uploadImageToSupabase = async (file) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `food-images/${timestamp}-${randomString}.${fileExtension}`;
  const BUCKET = process.env.SUPABASE_BUCKET;

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file.buffer, {
    contentType: file.mimetype,
    cacheControl: "3600"
  });

  if (error) throw new Error(`Supabase upload error: ${error.message}`);

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return publicUrl;
};

/**
 * @swagger
 * /api/pickup/request-pickup:
 *   post:
 *     summary: Submit a food pickup request
 *     tags: [Pickup]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [donorName, phone, address, city, state, foodItems, quantity, pickupDate]
 *             properties:
 *               donorName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               foodItems:
 *                 type: string
 *               quantity:
 *                 type: string
 *               pickupDate:
 *                 type: string
 *               additionalNotes:
 *                 type: string
 *               foodImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Pickup request submitted successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/request-pickup", authDonorMiddleware, pickupLimiter, foodUploads.single('foodImage'), async (req, res, next) => {
  try {
    const { donorName, phone, address, city, state, foodItems, quantity, pickupDate, additionalNotes } = req.body;
    const donorId = req.user._id;

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
    if (req.file) {
      try {
        imageUrl = await uploadImageToSupabase(req.file);
      } catch (uploadError) {
        return next(uploadError);
      }
    }

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
      foodImage: imageUrl,
      additionalNotes,
      requestId: generateRequestId(),
      status: "Pending",
      createdAt: new Date()
    });

    await newDonation.save();

    res.status(201).json({ message: "Pickup request submitted successfully", donation: newDonation });
  } catch (error) {
    next(error);
  }
});

module.exports = router;