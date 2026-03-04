// load environment variables from the utils folder where the .env actually lives
require("dotenv").config({
  path: require("path").join(__dirname, "utils", ".env"),
});

const express = require("express");
const connectDB = require("./config/db.js");
const donorRoutes = require("./routes/donorRoutes.js");
const ngoRoutes = require("./routes/ngoRoutes.js");
const requestPickupRoutes = require("./routes/requestPickup.js");
const adminRoutes = require("./routes/adminRoutes.js");
const path = require("path");
const cors = require("cors");

const app = express();

// connect database
connectDB();

// request logger
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        origin.includes("vercel.app") || 
        origin === "http://localhost:5173"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/donors", donorRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/pickup", requestPickupRoutes);
app.use("/api/admin", adminRoutes);

// test route (optional but useful)
app.get("/", (req, res) => {
  res.send("Meal Mission API running 🚀");
});

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});