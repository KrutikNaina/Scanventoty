// services/reportService.js
import Order from "../models/Order.js"; // your order model

export async function generateSalesReport() {
  try {
    const orders = await Order.find(); // fetch all orders

    if (!orders || orders.length === 0) return "No orders to analyze.";

    // 1. Total sales per product
    const salesSummary = {};
    orders.forEach(order => {
      const pid = order.productId;
      salesSummary[pid] = (salesSummary[pid] || 0) + order.quantity;
    });

    // 2. Best-selling product
    const bestSelling = Object.entries(salesSummary).sort((a, b) => b[1] - a[1])[0];

    // 3. Low-stock alert (if quantity < threshold)
    const lowStockProducts = [];
    for (const pid in salesSummary) {
      if (salesSummary[pid] < 5) { // threshold example
        lowStockProducts.push(pid);
      }
    }

    return {
      totalOrders: orders.length,
      bestSellingProduct: bestSelling[0],
      totalSold: bestSelling[1],
      lowStockProducts
    };

  } catch (error) {
    console.error(error);
    return "Report generation failed.";
  }
}
