const jwt = require("jsonwebtoken");
const Donor = require("../models/donor.js");
const dotenv = require("dotenv");
dotenv.config();

const authDonor = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        const donor = await Donor.findById(decoded.id);
        if (!donor) {
            return res.status(401).json({ message: "Unauthorized: Donor not found" });
        }
        req.user = donor;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = authDonor;