const express = require("express");
const NGOModel = require("../models/ngoModel.js");
const authAdminMiddleware = require("../middlewares/authAdminMiddleware.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/Admin.js");
const router = express.Router();
const RejectedNGO = require("../models/RejectedNGO.js");
const SupportRequestNgo = require("../models/SupportRequestNgo.js");
const SupportRequestDonor = require("../models/SupportRequestDonor.js");

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns JWT token
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const admin = await AdminModel.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: admin._id.toString(), role: "Admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/pending:
 *   get:
 *     summary: Get all pending NGO registrations
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending NGOs
 */
router.get("/pending", authAdminMiddleware, async (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });
  try {
    const pendingNgos = await NGOModel.find({ isApproved: false });
    res.status(200).json(pendingNgos);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/approve-ngo/{id}:
 *   put:
 *     summary: Approve an NGO registration
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: NGO approved
 *       404:
 *         description: NGO not found
 */
router.put("/approve-ngo/:id", authAdminMiddleware, async (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });
  try {
    const updatedNgo = await NGOModel.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!updatedNgo) return res.status(404).json({ message: "NGO not found" });
    res.status(200).json(updatedNgo);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/reject-ngo/{id}:
 *   put:
 *     summary: Reject an NGO registration
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reasonForRejection:
 *                 type: string
 *     responses:
 *       200:
 *         description: NGO rejected successfully
 *       404:
 *         description: NGO not found
 */
router.put("/reject-ngo/:id", authAdminMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const { reasonForRejection } = req.body;
  try {
    const ngo = await NGOModel.findById(id);
    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    const rejectedNGO = new RejectedNGO({
      name: ngo.name,
      email: ngo.email,
      address: ngo.address,
      city: ngo.city,
      phone: ngo.phone,
      state: ngo.state,
      documentProof: ngo.documentProof,
      isApproved: false,
      reasonForRejection,
    });

    await rejectedNGO.save();
    await NGOModel.findByIdAndDelete(id);

    res.status(200).json({ message: "NGO rejected successfully" });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/ngo-info/{id}:
 *   get:
 *     summary: Get NGO info by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: NGO details
 *       404:
 *         description: NGO not found
 */
router.get("/ngo-info/:id", authAdminMiddleware, async (req, res, next) => {
  try {
    const ngo = await NGOModel.findById(req.params.id).select("-password -otp -otpExpires -registrationDate -__v");
    if (!ngo) return res.status(404).json({ message: "NGO not found" });
    res.status(200).json(ngo);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/rejected-ngos:
 *   get:
 *     summary: Get all rejected NGOs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rejected NGOs
 */
router.get("/rejected-ngos", authAdminMiddleware, async (req, res, next) => {
  try {
    const rejectedNGOs = await RejectedNGO.find().sort({ createdAt: -1 });
    res.status(200).json(rejectedNGOs);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/{type}-support:
 *   get:
 *     summary: Get support requests by type (ngo/donor/all)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ngo, donor, all]
 *       - in: query
 *         name: isCompleted
 *         required: true
 *         schema:
 *           type: string
 *           enum: ['true', 'false', 'all']
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Support requests with pagination
 */
router.get("/:type-support", authAdminMiddleware, async (req, res, next) => {
  const { type } = req.params;
  const { isCompleted } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    let supportRequests = [];
    let query = {};

    if (isCompleted === "true") query.isCompleted = true;
    else if (isCompleted === "false") query.isCompleted = false;
    else if (isCompleted === "all") query = {};
    else return res.status(400).json({ message: "Invalid isCompleted parameter. Use 'true', 'false', or 'all'." });

    if (type === "ngo") {
      supportRequests = await SupportRequestNgo.find(query).sort({ createdAt: -1 });
    } else if (type === "donor") {
      supportRequests = await SupportRequestDonor.find(query).sort({ createdAt: -1 });
    } else if (type === "all") {
      const donorRequests = await SupportRequestDonor.find(query).sort({ createdAt: -1 });
      const ngoRequests = await SupportRequestNgo.find(query).sort({ createdAt: -1 });
      supportRequests = [...donorRequests, ...ngoRequests];
    } else {
      return res.status(400).json({ message: "Invalid type parameter. Use 'ngo', 'donor', or 'all'." });
    }

    const totalCount = supportRequests.length;
    const paginated = supportRequests.slice(skip, skip + limit);

    res.status(200).json({
      supportRequests: paginated,
      pagination: { totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/complete-request/{type}/{id}:
 *   patch:
 *     summary: Mark a support request as completed
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [NGO, Donor]
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Support request marked as completed
 *       404:
 *         description: Support request not found
 */
router.patch("/complete-request/:type/:id", authAdminMiddleware, async (req, res, next) => {
  const { type, id } = req.params;
  try {
    let updatedRequest;
    if (type === "NGO") {
      updatedRequest = await SupportRequestNgo.findByIdAndUpdate(id, { isCompleted: true }, { new: true });
    } else if (type === "Donor") {
      updatedRequest = await SupportRequestDonor.findByIdAndUpdate(id, { isCompleted: true }, { new: true });
    } else {
      return res.status(400).json({ message: "Invalid type parameter. Use 'NGO' or 'Donor'." });
    }

    if (!updatedRequest) return res.status(404).json({ message: "Support request not found." });
    res.status(200).json(updatedRequest);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get all approved NGOs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of approved NGOs with pagination
 */
router.get("/dashboard", authAdminMiddleware, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await NGOModel.countDocuments({ isApproved: true });
    const ngos = await NGOModel.find({ isApproved: true }).select("-password").skip(skip).limit(limit);

    res.status(200).json({ ngos, pagination: { totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) } });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/ngo/{id}:
 *   get:
 *     summary: Get specific NGO details
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: NGO details
 *       404:
 *         description: NGO not found
 *   delete:
 *     summary: Delete an NGO
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: NGO deleted successfully
 *       404:
 *         description: NGO not found
 */
router.get("/ngo/:id", authAdminMiddleware, async (req, res, next) => {
  const { id } = req.params;
  try {
    const ngo = await NGOModel.findById(id).select("-password");
    if (!ngo) return res.status(404).json({ message: "NGO not found" });
    res.status(200).json(ngo);
  } catch (error) {
    next(error);
  }
});

router.delete("/ngo/:id", authAdminMiddleware, async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedNGO = await NGOModel.findByIdAndDelete(id);
    if (!deletedNGO) return res.status(404).json({ message: "NGO not found" });
    res.status(200).json({ message: "NGO deleted successfully", deletedNGO });
  } catch (error) {
    next(error);
  }
});

module.exports = router;