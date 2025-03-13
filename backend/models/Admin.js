const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: true, // All users created with this model are admins
    },
});

const AdminModel = mongoose.model("Admin", adminSchema);
module.exports = AdminModel; 