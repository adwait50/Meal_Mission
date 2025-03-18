const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  issue: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
  type: { type: String, enum : ["Donor"], default: "Donor" },
});

const SupportRequestDonor = mongoose.model(
  "SupportRequestDonor",
  supportRequestSchema
);
module.exports = SupportRequestDonor;
