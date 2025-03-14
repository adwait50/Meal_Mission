const express = require('express');
const NGOModel = require('../models/ngoModel.js');
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/Admin.js"); // Import the Admin model
const router = express.Router();


//Admin approves NGO
router.put("/approve-ngo/:id", authMiddleware,authorizeRoles("admin"), async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const updatedNgo = await NGOModel.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!updatedNgo) {
            return res.status(404).json({ message: "NGO not found" });
        }
        res.status(200).json(updatedNgo);
    } catch (error) {
        res.status(500).json({ message: "Error approving NGO", error });
    }
});

   // Admin rejects an NGO
   router.put("/reject-ngo/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const updatedNgo = await NGOModel.findByIdAndUpdate(req.params.id, { isApproved: false }, { new: true });
        if (!updatedNgo) {
            return res.status(404).json({ message: "NGO not found" });
        }
        res.status(200).json(updatedNgo);
    } catch (error) {
        res.status(500).json({ message: "Error rejecting NGO", error });
    }
});

router.get("/pending", authMiddleware,authorizeRoles("admin"), async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const pendingNgos = await NGOModel.find({ isApproved: false });
        res.status(200).json(pendingNgos);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending NGOs", error });
    }
});

// Admin Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the admin by email
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: Admin._id, role: "Admin" }, 
            process.env.JWT_SECRET
          );

        // Send the token back to the client
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ message: "Error logging in" });
    }
});

module.exports = router;