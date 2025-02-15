require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.js");
const donorRoutes = require("./routes/donorRoutes.js");

const app = express();
connectDB();

app.use(express.json());
app.use("/api/donors", donorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
