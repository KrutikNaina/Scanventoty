// backend/routes/stockRoutes.js
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { addStockLog, getStockLogs, getStockLogById, deleteStockLog } = require("../controllers/stockController");

const router = express.Router();

router.post("/", protect, addStockLog); // Add new stock log
router.get("/", protect, getStockLogs);  // Get all logs
router.get("/:id", protect, getStockLogById); // Get log by ID
router.delete("/:id", protect, deleteStockLog); // Delete log

module.exports = router;
