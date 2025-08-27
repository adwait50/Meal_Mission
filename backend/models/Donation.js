const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
  donorName: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  foodItems: { type: String, required: true },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, default: () => new Date() },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: "NGO" }, // Reference to the NGO
  foodImage: { type: String, required: false },
  additionalNotes: String,
  requestId: { type: String, unique: true }, 
  status: {
    type: String,
    enum: ["Pending", "Accepted", "In Progress", "Completed","Rejected","Cancelled"], // Define allowed statuses
    default: "Pending", // Set default status to "Pending"
  },
  pickupDate: { type: Date, required: true },
});

module.exports = mongoose.model("Donation", donationSchema);
