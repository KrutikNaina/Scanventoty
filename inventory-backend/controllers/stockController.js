// backend/controllers/stockController.js
const StockLog = require("../models/StockLog");
const Product = require("../models/Product");
const User = require("../models/User");

// Create a new stock log
const addStockLog = async (req, res) => {
  try {
    // Ensure user is authenticated and authorized (must be admin or manager)
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'manager')) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }

    const { productId, action, quantity, userId, orderId } = req.body;

    // Basic input validation
    if (!productId || !action || typeof quantity !== 'number' || !userId) {
      return res.status(400).json({ error: "Invalid input: productId, action, quantity, and userId are required." });
    }

    const stockLog = await StockLog.create({
      productId,
      action,
      quantity,
      userId,
      orderId,
    });

    res.status(201).json(stockLog);
  } catch (err) {
    // Sanitize error message
    res.status(500).json({ error: "An error occurred while creating the stock log." });
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
    res.status(500).json({ error: "An error occurred while retrieving stock logs." });
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
    res.status(500).json({ error: "An error occurred while retrieving the stock log." });
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
    res.status(500).json({ error: "An error occurred while deleting the stock log." });
  }
};

module.exports = { addStockLog, getStockLogs, getStockLogById, deleteStockLog };
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addStockLog, getStockLogs, getStockLogById, deleteStockLog };
