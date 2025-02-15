const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
    
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

  phone: { 
    type: String, 
    required: true,
    unique: true
    },

  address: { 
    type: String, 
    required: true 
    },

  isVerified: { 
    type: Boolean, 
    default: false 
    },

  otp: { 
    type: String 
    },

  otpExpires: { 
    type: Date 
    },
})

module.exports = mongoose.model("Donor", donorSchema);
