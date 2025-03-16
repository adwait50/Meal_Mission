const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    documentProof: {
        type: String,  // This will store the file path or URL of the uploaded document
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    city:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
      },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    resetPasswordOTP: {
        type: String,
    },
    resetPasswordOTPExpires: {
        type: Date,
    }
});

const NGOModel = mongoose.model("NGO", ngoSchema);
module.exports = NGOModel;