const jwt = require("jsonwebtoken");
const Donor = require("../models/donor.js");
const Admin = require("../models/Admin.js");
const NGO = require("../models/ngoModel.js");

const userRoles = { admin: Admin, donor: Donor, ngo: NGO };

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token structure" });
    }

    console.log("Decoded Token:", decoded); // Debugging

    // Check user across all roles
    for (const [role, model] of Object.entries(userRoles)) {
      const user = await model.findById(decoded.id).select("-password -__v");
      if (user) {
        req.user = { ...user.toObject(), role };
        console.log("User authenticated:", req.user); // Debugging
        return next();
      }
    }

    return res.status(404).json({ message: "User not found. Please check your token or login again." });
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

// Role-based access control
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "Forbidden: User not authenticated" });
  }

  if (roles.includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({ message: "Forbidden: Access denied for this role" });
};

module.exports = { authMiddleware, authorizeRoles };
