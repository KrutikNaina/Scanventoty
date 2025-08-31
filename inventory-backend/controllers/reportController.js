// controllers/reportController.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const generateReportController = async (req, res) => {
  try {
    const userId = req.user._id;
    
    console.log("Generating AI report for user:", userId);
    
    // Get orders with populated product data from database
    const orders = await Order.find({ handledBy: userId })
      .populate({
        path: 'products.productId',
        model: 'Product',
        select: 'name category sku price expiryDate stockQty'
      })
      .sort({ createdAt: -1 });

    // Get all products for expiry analysis
    const products = await Product.find({});
    
    console.log(`Analyzing ${orders.length} orders and ${products.length} products`);

    // Generate report using local analysis
    const report = generateLocalSalesReport(orders, products);
    
    res.json({ 
      success: true,
      report,
      orderCount: orders.length,
      productCount: products.length,
      inwardOrders: orders.filter(o => o.orderType === 'inward').length,
      outwardOrders: orders.filter(o => o.orderType === 'outward').length,
      generatedAt: new Date().toISOString(),
      source: "ai-analysis"
    });
  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to generate report",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Local report generation function
function generateLocalSalesReport(orders, products) {
  if (!orders || orders.length === 0) {
    return "No orders available to analyze. Please generate some sales data first.";
  }

  // Analyze the data
  const analysis = analyzeInventoryData(orders, products);
  
  // Generate comprehensive report
  const report = generateComprehensiveReport(analysis);
  
  return report;
}

// Analyze inventory data
function analyzeInventoryData(orders, products) {
  const productSales = {};
  const categorySales = {};
  const expiryAnalysis = {};
  
  let totalRevenue = 0;
  let totalItems = 0;
  let totalInward = 0;
  let totalOutward = 0;
  
  // Current date for expiry calculation
  const currentDate = new Date();
  
  // Process each order
  orders.forEach(order => {
    if (order.orderType === 'inward') {
      totalInward += order.products.reduce((sum, p) => sum + p.quantity, 0);
    } else {
      totalOutward += order.products.reduce((sum, p) => sum + p.quantity, 0);
    }
    
    order.products.forEach(product => {
      const productName = product.productId?.name || "Unknown Product";
      const quantity = product.quantity || 1;
      const price = product.price || product.productId?.price || 0;
      
      // Track product sales
      if (!productSales[productName]) {
        productSales[productName] = {
          quantity: 0,
          revenue: 0,
          sku: product.productId?.sku || "No SKU",
          category: product.category || product.productId?.category || "Uncategorized",
        };
      }
      
      productSales[productName].quantity += quantity;
      productSales[productName].revenue += (quantity * price);
      
      // Track category sales
      const category = product.category || product.productId?.category || "Uncategorized";
      if (!categorySales[category]) {
        categorySales[category] = {
          quantity: 0,
          revenue: 0
        };
      }
      categorySales[category].quantity += quantity;
      categorySales[category].revenue += (quantity * price);
      
      totalItems += quantity;
      totalRevenue += quantity * price;
    });
  });

  // Analyze product expiry dates
  products.forEach(product => {
    if (product.expiryDate) {
      const expiryDate = new Date(product.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= 30) {
        const status = daysUntilExpiry <= 0 ? 'expired' : 
                      daysUntilExpiry <= 7 ? 'critical' : 
                      daysUntilExpiry <= 30 ? 'warning' : 'ok';
        
        expiryAnalysis[product.name] = {
          daysUntilExpiry,
          status,
          quantity: product.stockQty,
          expiryDate: product.expiryDate
        };
      }
    }
  });

  // Find top and bottom products
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 10);
  
  const bottomProducts = Object.entries(productSales)
    .sort((a, b) => a[1].revenue - b[1].revenue)
    .slice(0, 5);

  const topCategories = Object.entries(categorySales)
    .sort((a, b) => b[1].revenue - b[1].revenue)
    .slice(0, 5);

  // Expiring products
  const expiringProducts = Object.entries(expiryAnalysis)
    .sort((a, b) => a[1].daysUntilExpiry - b[1].daysUntilExpiry);
  
  return {
    totalOrders: orders.length,
    totalInward,
    totalOutward,
    totalItems,
    totalRevenue,
    topProducts,
    bottomProducts,
    topCategories,
    expiringProducts,
    currentDate: currentDate.toLocaleDateString()
  };
}

// Generate comprehensive report
function generateComprehensiveReport(analysis) {
  let report = "🤖 SMART INVENTORY AI REPORT\n";
  report += "=".repeat(70) + "\n\n";
  
  // Executive Summary
  report += "📈 EXECUTIVE SUMMARY:\n";
  report += `• Total Orders: ${analysis.totalOrders}\n`;
  report += `• Inward Stock: ${analysis.totalInward} units\n`;
  report += `• Outward Sales: ${analysis.totalOutward} units\n`;
  report += `• Total Revenue: $${analysis.totalRevenue.toFixed(2)}\n`;
  report += `• Report Date: ${analysis.currentDate}\n\n`;
  
  // Top Products
  report += "🏆 TOP SELLING PRODUCTS:\n";
  analysis.topProducts.forEach(([product, data], index) => {
    report += `${index + 1}. ${product}: ${data.quantity} units ($${data.revenue.toFixed(2)})\n`;
  });
  report += "\n";
  
  // EXPIRY ALERTS
  if (analysis.expiringProducts.length > 0) {
    report += "🚨 EXPIRY ALERTS:\n";
    analysis.expiringProducts.forEach(([product, data]) => {
      let alertEmoji = "⚠️";
      if (data.status === 'expired') alertEmoji = "❌";
      if (data.status === 'critical') alertEmoji = "🔥";
      
      report += `${alertEmoji} ${product}: ${data.daysUntilExpiry} days until expiry (${data.quantity} units)\n`;
    });
    report += "\n";
  }
  
  report += "💡 RECOMMENDATIONS:\n";
  report += "• Monitor expiry dates closely\n";
  report += "• Restock top-selling products\n";
  report += "• Review low-performing items\n";
  report += "• Use QR codes for inventory tracking\n\n";
  
  report += "=".repeat(70) + "\n";
  report += "Report generated on: " + new Date().toLocaleString() + "\n";
  
  return report;
}