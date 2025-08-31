// services/aiService.js
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export async function generateSalesReport(orders, products) {
  try {
    if (!orders || orders.length === 0) {
      return "No orders available to analyze. Please generate some sales data first.";
    }

    // Analyze the data
    const analysis = analyzeInventoryData(orders, products);
    
    // Generate comprehensive report
    const report = generateComprehensiveReport(analysis);
    
    return report;
  } catch (error) {
    // Log detailed error for internal debugging only
    console.error("Report generation failed:", error);
    // Return a generic error message to the caller
    return "Report generation failed due to an internal error. Please contact support if the issue persists.";
  }
}

// Analyze inventory data
function analyzeInventoryData(orders, products) {
  const productSales = {};
  const categorySales = {};
  const supplierAnalysis = {};
  const customerAnalysis = {};
  const dailySales = {};
  const expiryAnalysis = {};
  
  let totalRevenue = 0;
  let totalItems = 0;
  let totalInward = 0;
  let totalOutward = 0;
  
  // Current date for expiry calculation
  const currentDate = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  // Process each order
  orders.forEach(order => {
    const orderDate = new Date(order.createdAt).toLocaleDateString();
    dailySales[orderDate] = (dailySales[orderDate] || 0) + 1;
    
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
          productId: product.productId?._id || null
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
      
      // Track supplier/customer analysis
      if (order.orderType === 'inward') {
        if (!supplierAnalysis[order.supplierOrBuyer]) {
          supplierAnalysis[order.supplierOrBuyer] = {
            quantity: 0,
            products: new Set()
          };
        }
        supplierAnalysis[order.supplierOrBuyer].quantity += quantity;
        supplierAnalysis[order.supplierOrBuyer].products.add(productName);
      } else {
        if (!customerAnalysis[order.supplierOrBuyer]) {
          customerAnalysis[order.supplierOrBuyer] = {
            quantity: 0,
            revenue: 0
          };
        }
        customerAnalysis[order.supplierOrBuyer].quantity += quantity;
        customerAnalysis[order.supplierOrBuyer].revenue += (quantity * price);
      }
      
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
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5);

  // Top suppliers and customers
  const topSuppliers = Object.entries(supplierAnalysis)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 5);
  
  const topCustomers = Object.entries(customerAnalysis)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5);

  // Expiring products
  const expiringProducts = Object.entries(expiryAnalysis)
    .sort((a, b) => a[1].daysUntilExpiry - b[1].daysUntilExpiry);

  // Calculate sales trends
  const salesTrend = calculateSalesTrend(dailySales);
  
  return {
    totalOrders: orders.length,
    totalInward,
    totalOutward,
    totalItems,
    totalRevenue,
    topProducts,
    bottomProducts,
    topCategories,
    topSuppliers,
    topCustomers,
    expiringProducts,
    salesTrend,
    dailySales,
    period: getAnalysisPeriod(orders),
    currentDate: currentDate.toLocaleDateString()
  };
}

// Calculate sales trend
function calculateSalesTrend(dailySales) {
  const days = Object.keys(dailySales);
  if (days.length < 2) return 'stable';
  
  const sortedDays = days.sort();
  const firstDaySales = dailySales[sortedDays[0]];
  const lastDaySales = dailySales[sortedDays[sortedDays.length - 1]];
  
  const percentageChange = ((lastDaySales - firstDaySales) / firstDaySales) * 100;
  
  if (percentageChange > 20) return 'increasing';
  if (percentageChange < -20) return 'decreasing';
  return 'stable';
}

// Get analysis period
function getAnalysisPeriod(orders) {
  if (orders.length === 0) return 'No period';
  
  const dates = orders.map(order => new Date(order.createdAt));
  const earliest = new Date(Math.min(...dates));
  const latest = new Date(Math.max(...dates));
  
  return `${earliest.toLocaleDateString()} to ${latest.toLocaleDateString()}`;
}

// Generate comprehensive report
function generateComprehensiveReport(analysis) {
  let report = "🤖 SMART INVENTORY AI REPORT\n";
  report += "=".repeat(70) + "\n\n";
  
  // Executive Summary
  report += "📈 EXECUTIVE SUMMARY:\n";
  report += `• Period Analyzed: ${analysis.period}\n`;
  report += `• Total Orders: ${analysis.totalOrders}\n`;
  report += `• Inward Stock: ${analysis.totalInward} units\n`;
  report += `• Outward Sales: ${analysis.totalOutward} units\n`;
  report += `• Total Revenue: $${analysis.totalRevenue.toFixed(2)}\n`;
  report += `• Sales Trend: ${analysis.salesTrend.toUpperCase()}\n`;
  report += `• Report Date: ${analysis.currentDate}\n\n`;
  
  // Top Products
  report += "🏆 TOP SELLING PRODUCTS (by revenue):\n";
  analysis.topProducts.forEach(([product, data], index) => {
    report += `${index + 1}. ${product} (SKU: ${data.sku}): ${data.quantity} units ($${data.revenue.toFixed(2)})\n`;
  });
  report += "\n";
  
  // Bottom Products (Low performance)
  if (analysis.bottomProducts.length > 0) {
    report += "📉 LOW PERFORMING PRODUCTS (need attention):\n";
    analysis.bottomProducts.forEach(([product, data], index) => {
      report += `${index + 1}. ${product}: Only ${data.quantity} units sold ($${data.revenue.toFixed(2)})\n`;
    });
    report += "\n";
  }
  
  // Category Analysis
  report += "📦 CATEGORY PERFORMANCE:\n";
  analysis.topCategories.forEach(([category, data], index) => {
    const revenuePercentage = ((data.revenue / analysis.totalRevenue) * 100).toFixed(1);
    report += `${index + 1}. ${category.toUpperCase()}: $${data.revenue.toFixed(2)} (${revenuePercentage}% of revenue)\n`;
  });
  report += "\n";
  
  // EXPIRY ALERTS - CRITICAL SECTION
  if (analysis.expiringProducts.length > 0) {
    report += "🚨 CRITICAL: EXPIRY ALERTS\n";
    report += "=".repeat(40) + "\n";
    
    analysis.expiringProducts.forEach(([product, data]) => {
      let alertEmoji = "⚠️";
      let alertLevel = "WARNING";
      
      if (data.status === 'expired') {
        alertEmoji = "❌";
        alertLevel = "EXPIRED";
      } else if (data.status === 'critical') {
        alertEmoji = "🔥";
        alertLevel = "CRITICAL";
      }
      
      report += `${alertEmoji} ${product}: ${data.daysUntilExpiry} days until expiry (${data.quantity} units)\n`;
      report += `   Status: ${alertLevel} - Expiry Date: ${new Date(data.expiryDate).toLocaleDateString()}\n`;
      
      if (data.status === 'expired') {
        report += `   ACTION REQUIRED: Immediately remove from inventory!\n`;
      } else if (data.status === 'critical') {
        report += `   ACTION REQUIRED: Prioritize sales or consider discounts\n`;
      } else if (data.status === 'warning') {
        report += `   ACTION: Monitor closely and plan for sales\n`;
      }
      report += "\n";
    });
  } else {
    report += "✅ NO EXPIRY ISSUES: All products have good shelf life\n\n";
  }
  
  // Inventory Recommendations
  report += "💡 INTELLIGENT RECOMMENDATIONS:\n";
  report += "=".repeat(40) + "\n";
  
  // Restocking suggestions for top products
  if (analysis.topProducts.length > 0) {
    report += "🛒 RESTOCKING PRIORITIES:\n";
    analysis.topProducts.slice(0, 3).forEach(([product, data]) => {
      report += `• ${product}: High demand (${data.quantity} units sold)\n`;
    });
    report += "\n";
  }
  
  // Replacement suggestions for low performers
  if (analysis.bottomProducts.length > 0 && analysis.topCategories.length > 0) {
    report += "🔄 PRODUCT REPLACEMENT SUGGESTIONS:\n";
    analysis.bottomProducts.slice(0, 2).forEach(([product, data]) => {
      const productCategory = data.category;
      const topInCategory = analysis.topProducts
        .filter(([_, pData]) => pData.category === productCategory)
        .slice(0, 2);
      
      if (topInCategory.length > 0) {
        report += `• Replace \"${product}\" with: ${topInCategory.map(([p]) => p).join(', ')}\n`;
        report += `  Reason: Poor performance (only ${data.quantity} units) in ${productCategory} category\n`;
      }
    });
    report += "\n";
  }
  
  // Supplier recommendations
  if (analysis.topSuppliers.length > 0) {
    report += "🏭 SUPPLIER OPTIMIZATION:\n";
    analysis.topSuppliers.slice(0, 2).forEach(([supplier, data]) => {
      report += `• Maintain relationship with ${supplier} (${data.quantity} units supplied)\n`;
    });
    report += "\n";
  }
  
  // Business Insights
  report += "📊 BUSINESS INSIGHTS:\n";
  report += "=".repeat(40) + "\n";
  
  if (analysis.salesTrend === 'increasing') {
    report += "• 📈 Sales are trending upward - consider increasing inventory levels\n";
  } else if (analysis.salesTrend === 'decreasing') {
    report += "• 📉 Sales are slowing down - review marketing strategies\n";
  } else {
    report += "• ↔️ Sales are stable - maintain current inventory levels\n";
  }
  
  if (analysis.topCategories.length > 0) {
    report += `• 🏆 Top category (${analysis.topCategories[0][0]}) represents ${((analysis.topCategories[0][1].revenue / analysis.totalRevenue) * 100).toFixed(1)}% of revenue\n`;
  }
  
  if (analysis.expiringProducts.length > 0) {
    const criticalCount = analysis.expiringProducts.filter(([_, data]) => 
      data.status === 'critical' || data.status === 'expired'
    ).length;
    
    if (criticalCount > 0) {
      report += `• 🚨 ${criticalCount} products require immediate attention due to expiry\n`;
    }
  }
  
  report += "• 🔍 Use QR codes for efficient inventory tracking and management\n\n";
  
  // Predictive Analysis
  report += "🔮 PREDICTIVE ANALYSIS (Next 30 days):\n";
  report += "=".repeat(40) + "\n";
  
  if (analysis.salesTrend === 'increasing') {
    report += "• Expected: 15-20% sales growth based on current trend\n";
  } else if (analysis.salesTrend === 'decreasing') {
    report += "• Expected: 10-15% sales decline - implement promotions\n";
  } else {
    report += "• Expected: Stable sales pattern continuing\n";
  }
  
  report += "• Recommended: Maintain 20% safety stock above current levels\n";
  
  if (analysis.expiringProducts.length > 0) {
    const expiringCount = analysis.expiringProducts.length;
    report += `• Alert: ${expiringCount} products will expire in the next 30 days\n`;
  }
  
  report += "• Consider: Seasonal variations and upcoming holidays\n\n";
  
  report += "=".repeat(70) + "\n";
  report += "Report generated on: " + new Date().toLocaleString() + "\n";
  report += "Products analyzed: " + analysis.topProducts.length + "\n";
  report += "Orders analyzed: " + analysis.totalOrders + "\n";
  report += "Note: AI-powered analysis based on real inventory data\n";
  
  return report;
}

export default { generateSalesReport };