import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find(); // fetch from database
    res.json(orders);
  } catch (err) {
    // Log the error internally (for example, to console or a logging system)
    console.error('Error fetching orders:', err);
    // Return a generic error message to the client
    res.status(500).json({ message: "An internal server error occurred." });
  }
});

// POST a new order (optional, for testing)
router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    // Log the error internally (for example, to console or a logging system)
    console.error('Error creating order:', err);
    // Return a generic error message to the client
    res.status(400).json({ message: "An error occurred while creating the order." });
  }
});

export default router;
