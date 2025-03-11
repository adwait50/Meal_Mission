const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  // donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  donorName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  foodItems: { type: String, required: true },
  quantity: { type: Number, required: true },
  pickupDate: { type: Date, required: true },
  foodImage: { type: String, required: true },
  additionalNotes: String,
  requestId: { type: String, unique: true }, // For tracking
  status: { type: String, enum: ["In Progress", "Scheduled", "Pending", "Completed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

// Check if the model already exists
const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);

module.exports = Donation;
