const jwt = require("jsonwebtoken");
const Donor = require("../models/donor.js");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: No token given" });
    }

    // Extract token from 'Bearer <token>'
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid token format" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Donor.findById(decoded.id).select(
        "-password -resetPasswordOTP -resetPasswordOTPExpires -__v"
      );

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

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

module.exports = authMiddleware;
