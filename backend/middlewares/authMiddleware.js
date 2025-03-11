// authMiddleware.js
const jwt = require("jsonwebtoken");
const Donor = require("../models/donor.js");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized: No token given" });
        }

        // Split 'Bearer <token>' and get the token part
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Invalid token format" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Donor.findById(decoded.id).select("-password -resetPasswordOTP -resetPasswordOTPExpires -__v");

        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = authMiddleware; // Ensure correct export
