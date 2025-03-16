const mongoose = require("mongoose");

const rejectedNGOSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    reasonForRejection: { type: String },
    phone: { type: String, required: true, unique: true},
    createdAt: { type: Date, default: Date.now },
    documentProof: { type: String, required: true }
});

const RejectedNGO = mongoose.model("RejectedNGO", rejectedNGOSchema);
module.exports = RejectedNGO;
