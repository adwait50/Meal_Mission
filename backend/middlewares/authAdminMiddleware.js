const Admin = require("../models/Admin.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authAdmin = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized: Admin not found" });
        }
        req.user = admin;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = authAdmin;