const jwt = require("jsonwebtoken");
const Donor = require("../models/donor.js");
const Admin = require("../models/Admin.js");
const NGO = require("../models/ngoModel.js"); // Add NGO model

const authAdminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: No token given" });
    }

    // Extract token from 'Bearer <token>'
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the user is an Admin, Donor, or NGO
      let user = await Admin.findById(decoded.id).select("-password -__v");
     // if (!user) {
     //   user = await Donor.findById(decoded.id).select("-password -resetPasswordOTP -resetPasswordOTPExpires -__v");
     // }
     // if (!user) {
     //   user = await NGO.findById(decoded.id).select("-password -otp -otpExpires -__v"); // Check for NGO
     // }

      if (!user) {
        return res.status(404).json({ message: "Admin not found" });
      }

      req.user = user;
      next(); // ✅ Move to the next middleware
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = authAdminMiddleware;