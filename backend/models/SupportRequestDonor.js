const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  issue: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SupportRequestDonor = mongoose.model(
  "SupportRequestDonor",
  supportRequestSchema
);
module.exports = SupportRequestDonor;
