const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const AdminModel = require("../models/Admin.js"); // Adjust the path as necessary
require("dotenv").config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if the admin already exists
    const existingAdmin = await AdminModel.findOne({
      email: "adwait@admin.com",
    });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    // Create a new admin user
    const adminUser = new AdminModel({
      username: "Adwait",
      email: "adwait@admin.com",
      password: await bcrypt.hash("adminpassword", 10), // Hash the password
    });

    // Save the admin user to the database
    await adminUser.save();
    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Call the function to create the admin user
createAdminUser();
