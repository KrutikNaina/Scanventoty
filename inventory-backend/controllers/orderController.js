// controllers/orderController.js
const Product = require("../models/Product");
const Order = require("../models/Order");
const StockLog = require("../models/StockLog");

exports.createOrder = async (req, res) => {
  try {
    const { orderType, products, supplierOrBuyer } = req.body;

    // Basic validation
    if (!orderType || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Create new order document
    const order = new Order({
      orderType,
      products,
      supplierOrBuyer,
      handledBy: req.user.id, // assuming you have user auth middleware
    });

    // Update stock and create logs
    for (let item of products) {
      // Check if product exists
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }

      // Update stock quantity
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQty: orderType === "inward" ? item.quantity : -item.quantity },
      });

      // Create stock log
      await StockLog.create({
        productId: item.productId,
        action: orderType === "inward" ? "added" : "removed",
        quantity: item.quantity,
        userId: req.user.id,
        orderId: order._id,
      });
    }

    // Save order after updating all products
    await order.save();

    // Return order with populated product details (optional)
    const populatedOrder = await Order.findById(order._id).populate("products.productId", "name price");

    res.status(201).json(populatedOrder);
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ error: err.message });
  }
};
