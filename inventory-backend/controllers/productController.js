// controllers/productController.js
const Product = require("../models/Product");
const QRCode = require("qrcode");

// Add product
exports.addProduct = async (req, res) => {
    try {
        const { name, category, description, quantity, status, location } = req.body;

        // Optional: Generate SKU if not provided
        const sku = `SKU-${Date.now()}`;

        const product = new Product({
            name,
            category,
            description,
            sku,
            stockQty: Number(quantity),
            status: status || "Available",
            location,
        });

        // Generate QR code for SKU
        product.qrCode = await QRCode.toDataURL(sku);

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error("Add Product Error:", err);
        res.status(500).json({ error: err.message });
    }
};
// Get all products
exports.getProducts = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

// Get single product
exports.getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
};

// Update product
exports.updateProduct = async (req, res) => {
    // Whitelist allowed fields for update
    const allowedFields = ["name", "category", "description", "quantity", "status", "location"];
    const updateData = {};
    for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
            if (field === "quantity") {
                updateData["stockQty"] = Number(req.body[field]);
            } else {
                updateData[field] = req.body[field];
            }
        }
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(product);
};

// Delete product
exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
};
