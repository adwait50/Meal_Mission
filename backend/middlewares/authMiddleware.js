// authMiddleware.js
const jwt = require("jsonwebtoken");
const Donor = require("../models/donor.js");
// module.exports.authMiddleware = async function (req, res, next) {
//   const token =
//     (req.cookies && req.cookies.token) ||
//     (req.headers.authorization
//       ? req.headers.authorization.split(" ")[1]
//       : null);
//   if (!token) return res.status(401).json({ error: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await userModel.findById(decoded._id);
//     if (!req.user) return res.status(401).json({ error: "User not found" });
//     next();
//   } catch (error) {
//     res.status(401).json({ error: "Token is not valid" });
//   }
// };

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: No token given" });
    }

    // Split 'Bearer <token>' and get the token part
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid token format" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Donor.findOne(decoded._id).select(
        "-password -resetPasswordOTP -resetPasswordOTPExpires -__v"
      );
      if (!req.user) response.status(404).json({ message: "User not found" });
      res.send(req.user);
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = authMiddleware; // Ensure correct export
