// inventory-backend/models/StockLog.models.js
const mongoose = require("mongoose");

const StockLogSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    action: { type: String, enum: ["added", "removed"], required: true },
    quantity: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StockLog", StockLogSchema);
