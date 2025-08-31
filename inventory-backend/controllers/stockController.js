// backend/controllers/stockController.js
const StockLog = require("../models/StockLog");
const Product = require("../models/Product");
const User = require("../models/User");

// Create a new stock log
const addStockLog = async (req, res) => {
  try {
    const { productId, action, quantity, userId, orderId } = req.body;

    const stockLog = await StockLog.create({
      productId,
      action,
      quantity,
      userId,
      orderId,
    });

    res.status(201).json(stockLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all stock logs
const getStockLogs = async (req, res) => {
  try {
    const logs = await StockLog.find()
      .populate("productId", "name")
      .populate("userId", "name email")
      .populate("orderId");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a stock log by ID
const getStockLogById = async (req, res) => {
  try {
    const log = await StockLog.findById(req.params.id)
      .populate("productId", "name")
      .populate("userId", "name email")
      .populate("orderId");

    if (!log) return res.status(404).json({ error: "Stock log not found" });

    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a stock log
const deleteStockLog = async (req, res) => {
  try {
    const log = await StockLog.findById(req.params.id);
    if (!log) return res.status(404).json({ error: "Stock log not found" });

    await log.remove();
    res.json({ message: "Stock log deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addStockLog, getStockLogs, getStockLogById, deleteStockLog };
