const jwt = require("jsonwebtoken");
const NGO = require("../models/ngoModel.js");

const authNgoMiddleware = async (req, res, next) => {
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

      // Check if the user is an NGO
      const user = await NGO.findById(decoded.id).select("-password -otp -otpExpires -__v");

      if (!user) {
        return res.status(404).json({ message: "NGO not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = authNgoMiddleware;