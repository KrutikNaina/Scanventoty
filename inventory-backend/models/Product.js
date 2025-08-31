const mongoose = require("mongoose");
const QRCode = require("qrcode"); // npm install qrcode

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  sku: { type: String, unique: true }, // unique stock keeping unit
  qrCode: { type: String }, // will store QR code data URL
  stockQty: { type: Number, default: 0 },
  unit: { type: String, default: "pcs" },
  location: { type: String },
  expiryDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to generate QR code automatically
ProductSchema.pre("save", async function (next) {
  try {
    if (!this.qrCode) {
      // You can encode SKU, ID, or a URL
      const qrData = this.sku || this._id.toString();
      this.qrCode = await QRCode.toDataURL(qrData); // generate QR as base64
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Product", ProductSchema);
