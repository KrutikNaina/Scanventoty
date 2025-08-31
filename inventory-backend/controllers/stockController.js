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
    // Log error internally for debugging
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
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
    // Log error internally for debugging
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
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

    // Authorization check: Only allow access if the user is the owner or is an admin
    // Assumes req.user is set by authentication middleware
    if (!req.user || (String(log.userId._id) !== String(req.user._id) && req.user.role !== 'admin')) {
      return res.status(403).json({ error: "Forbidden: You do not have access to this stock log" });
    }

    res.json(log);
  } catch (err) {
    // Log error internally for debugging
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
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
    // Log error internally for debugging
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addStockLog, getStockLogs, getStockLogById, deleteStockLog };

    await log.remove();
    res.json({ message: "Stock log deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addStockLog, getStockLogs, getStockLogById, deleteStockLog };
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
