// routes/reportRoutes.js
import express from "express";
import { generateReportController } from "../controllers/reportController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/reports - Generate AI-powered inventory report
router.get("/", protect, generateReportController);

export default router;