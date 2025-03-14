const NGO = require("../models/ngoModel.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authNGO = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        const ngo = await NGO.findById(decoded.id);
        if (!ngo) {
            return res.status(401).json({ message: "Unauthorized: NGO not found" });
        }
        req.user = ngo;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = authNGO;