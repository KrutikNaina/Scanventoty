const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderType: { 
    type: String, 
    enum: ["inward", "outward"], 
    required: true 
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number },             // optional: useful for revenue reports
      category: { type: String },          // optional: AI can analyze trends per category
      expiryDate: { type: Date }           // optional: helps AI recommend stock rotation
    }
  ],
  supplierOrBuyer: { type: String, required: true }, // supplier name or customer
  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "fulfilled", "cancelled"], default: "pending" },
  totalAmount: { type: Number },           // optional: helps with KPI calculation
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
