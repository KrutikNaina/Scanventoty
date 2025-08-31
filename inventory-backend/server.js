// server.js (or app.js)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import passport from "./config/passport.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Initialize passport
app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/reports", reportRoutes);

// Health check endpoint - ADD THIS
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "Server is running!",
    timestamp: new Date().toISOString(),
    status: "OK",
    routes: {
      products: "/api/products",
      orders: "/api/orders", 
      reports: "/api/reports",
      stock: "/api/stock"
    }
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Smart Inventory Management Backend Running ✅");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ API Documentation:`);
  console.log(`   - Products: http://localhost:${PORT}/api/products`);
  console.log(`   - Orders: http://localhost:${PORT}/api/orders`);
  console.log(`   - Reports: http://localhost:${PORT}/api/reports`);
  console.log(`   - Stock: http://localhost:${PORT}/api/stock`);
});