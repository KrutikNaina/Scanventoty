import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find(); // fetch from database
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new order (optional, for testing)
router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
