// routes/productRoutes.js
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
const { addProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");

const router = express.Router();

router.post("/", protect, adminOnly, addProduct);
router.get("/", protect, getProducts);
router.get("/:id", protect, getProductById);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
