const jwt = require("jsonwebtoken");
const Donor = require("../models/donor.js");
const Admin = require("../models/Admin.js");
const NGO = require("../models/ngoModel.js");

const userRoles = { admin: Admin, donor: Donor, ngo: NGO };

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    for (const [role, model] of Object.entries(userRoles)) {
      const user = await model.findById(decoded.id).select("-password -__v");
      if (user) {
        req.user = { ...user.toObject(), role };
        return next();
      }
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

const authorizeRoles = (...roles) => (req, res, next) =>
  roles.includes(req.user.role)
    ? next()
    : res.status(403).json({ message: "Forbidden: Access denied" });

module.exports = { authMiddleware, authorizeRoles };
