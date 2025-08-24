const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema({
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", required: true },
  requestId: { type: String, required: true },
  issue: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
  type: { type: String, enum: ["NGO"], default: "NGO" },
});

const SupportRequestNgo = mongoose.model(
  "SupportRequestNgo",
  supportRequestSchema
);
module.exports = SupportRequestNgo;
