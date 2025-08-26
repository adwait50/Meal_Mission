// models/Image.js
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  url: String,
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: String, // optional
});

module.exports = mongoose.model("Image", ImageSchema);
