// SalesReport.jsx - Updated version
import axios from "axios";
import { useEffect, useState } from "react";
import { AlertTriangle, Clock, TrendingUp, TrendingDown, Package, RefreshCw } from "lucide-react";

export default function SalesReport() {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderCount, setOrderCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [inwardOrders, setInwardOrders] = useState(0);
  const [outwardOrders, setOutwardOrders] = useState(0);
  const [generatedAt, setGeneratedAt] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication required. Please log in first.");
        setLoading(false);
        return;
      }

      console.log("Fetching AI report from backend...");
      
      const res = await axios.get("http://localhost:5000/api/reports", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      });
      
      if (res.data && res.data.success) {
        setReport(res.data.report);
        setOrderCount(res.data.orderCount || 0);
        setProductCount(res.data.productCount || 0);
        setInwardOrders(res.data.inwardOrders || 0);
        setOutwardOrders(res.data.outwardOrders || 0);
        setGeneratedAt(res.data.generatedAt || "");
        console.log("✅ Report generated successfully!");
      } else {
        setError(res.data.message || "Invalid response from server");
      }
    } catch (err) {
      console.error("Report fetch error:", err);
      
      if (err.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
        localStorage.removeItem("token");
      } else if (err.response?.status === 404) {
        setError("Reports endpoint not found. Please check backend configuration.");
      } else if (err.code === 'ERR_NETWORK') {
        setError("Cannot connect to server. Make sure backend is running on port 5000.");
      } else {
        setError(err.message || "Failed to generate AI report");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AI Inventory Intelligence Report</h1>
              <p className="text-gray-600 mt-1">Powered by real database analytics</p>
            </div>
            
            <button
              onClick={fetchReport}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Package className="h-4 w-4" />
              )}
              {loading ? "Generating..." : "Refresh Report"}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 text-red-800 mb-3">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-semibold">Error</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchReport}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800">Generating AI Report</h3>
            <p className="text-gray-600 mt-1">Analyzing your inventory data...</p>
          </div>
        )}

        {/* Report Display */}
        {report && !loading && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 bg-blue-600 text-white">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8" />
                <div>
                  <h2 className="text-xl font-bold">Inventory Intelligence Report</h2>
                  <p className="opacity-90">AI-powered analysis</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                {report}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Generated: {formatDate(generatedAt)}
                  </div>
                  <div>Orders analyzed: {orderCount}</div>
                  <div>Products analyzed: {productCount}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !report && !error && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Ready to Generate Report</h3>
            <p className="text-gray-600 mt-1">Get AI-powered insights into your inventory</p>
            <button
              onClick={fetchReport}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}