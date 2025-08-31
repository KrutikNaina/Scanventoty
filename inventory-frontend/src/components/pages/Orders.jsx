// src/pages/Orders.jsx
import React, { useState, useEffect } from "react";
import { Search, Filter, QrCode, ArrowUpDown, Package, Truck } from "lucide-react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import axios from "axios";
  
export default function Orders() {
  const [scanOpen, setScanOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Format order data for display
  const formatOrders = (orders) => {
    return orders.map(order => ({
      _id: order._id,
      id: order._id.toString().substring(0, 8), // Short ID for display
      orderType: order.orderType,
      customer: order.supplierOrBuyer,
      items: order.products.reduce((total, product) => total + product.quantity, 0),
      total: order.totalAmount ? `$${order.totalAmount.toFixed(2)}` : 'N/A',
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      date: new Date(order.createdAt).toLocaleDateString(),
      products: order.products,
      fullData: order // Keep full data for details
    }));
  };

  // Filter orders based on search query
  const filteredOrders = formatOrders(orders).filter(
    (order) =>
      (order.id || "").toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.status || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status, orderType) => {
    const baseStyles = "px-2 py-1 rounded-full text-xs font-medium ";
    
    switch (status.toLowerCase()) {
      case "fulfilled":
        return baseStyles + "bg-emerald-500/20 text-emerald-400";
      case "pending":
        return baseStyles + "bg-amber-500/20 text-amber-400";
      case "cancelled":
        return baseStyles + "bg-red-500/20 text-red-400";
      default:
        return baseStyles + "bg-neutral-500/20 text-neutral-400";
    }
  };

  const getOrderTypeIcon = (orderType) => {
    return orderType === 'inward' 
      ? <Package className="h-4 w-4 text-blue-400" /> 
      : <Truck className="h-4 w-4 text-green-400" />;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-neutral-950 text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-neutral-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-neutral-950 text-white items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">Error</div>
          <p className="text-neutral-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg hover:bg-emerald-500/30 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      <main className="relative flex-1 min-h-screen overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/3 left-1/2 w-[600px] h-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Inventory Orders</h1>
              <p className="text-neutral-400 text-sm mt-1">
                {orders.length} orders found • {orders.filter(o => o.orderType === 'inward').length} inward • {orders.filter(o => o.orderType === 'outward').length} outward
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-1 text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition">
                <Filter className="h-4 w-4" /> Filter
              </button>
              <button
                onClick={() => setScanOpen(true)}
                className="flex items-center gap-1 text-sm bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/40 hover:bg-emerald-500/30 transition"
              >
                <QrCode className="h-4 w-4" /> Scan QR
              </button>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 w-full sm:w-64">
                <Search className="h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm flex-1 px-2"
                />
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 shadow-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-white/10 text-left text-neutral-300">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">{orders[0]?.orderType === 'inward' ? 'Supplier' : 'Customer'}</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-neutral-400">
                      {searchQuery ? 'No orders match your search.' : 'No orders found.'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, idx) => (
                    <tr
                      key={order._id}
                      className={`${idx % 2 === 0 ? "bg-white/5" : "bg-transparent"
                        } border-t border-white/10 hover:bg-white/10 transition cursor-pointer`}
                      onClick={() => console.log('Order details:', order.fullData)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getOrderTypeIcon(order.orderType)}
                          <span className="text-xs uppercase text-neutral-400">
                            {order.orderType}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-neutral-300">
                        {order.id}
                      </td>
                      <td className="px-4 py-3 max-w-[150px] truncate">
                        {order.customer}
                      </td>
                      <td className="px-4 py-3">
                        {order.items} items
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {order.total}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={getStatusBadge(order.status, order.orderType)}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-400">
                        {order.date}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Stats Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold">Inward Orders</h3>
              </div>
              <p className="text-2xl font-bold mt-2">
                {orders.filter(o => o.orderType === 'inward').length}
              </p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-400" />
                <h3 className="font-semibold">Outward Orders</h3>
              </div>
              <p className="text-2xl font-bold mt-2">
                {orders.filter(o => o.orderType === 'outward').length}
              </p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-emerald-400" />
                <h3 className="font-semibold">Total Items</h3>
              </div>
              <p className="text-2xl font-bold mt-2">
                {orders.reduce((total, order) => total + order.products.reduce((sum, p) => sum + p.quantity, 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* QR Scanner Modal */}
        {scanOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-6">
            <div className="bg-neutral-900 rounded-2xl border border-white/10 p-4 sm:p-6 relative w-full max-w-md sm:max-w-lg shadow-xl">
              {/* Close Button */}
              <button
                onClick={() => setScanOpen(false)}
                className="absolute top-3 right-3 text-neutral-400 hover:text-white text-xl sm:text-2xl"
              >
                ✕
              </button>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
                Scan Order QR/Barcode
              </h2>

              {/* QR Scanner */}
              <div className="overflow-hidden rounded-xl border border-white/10">
                <BarcodeScannerComponent
                  width={"100%"}
                  height={250}
                  onUpdate={(err, result) => {
                    if (result) setScannedCode(result.text);
                  }}
                />
              </div>

              {/* Scanned Result */}
              {scannedCode && (
                <div className="mt-4 p-3 sm:p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-sm sm:text-base text-center flex flex-col items-center gap-1 break-all">
                  <span className="text-emerald-400 font-semibold">✅ Scanned Code</span>
                  <span className="font-mono text-white bg-neutral-900 px-2 py-1 rounded text-sm sm:text-base break-all">
                    {scannedCode}
                  </span>
                  <button 
                    onClick={() => {
                      // Look up the scanned order
                      const scannedOrder = orders.find(o => o._id.toString() === scannedCode);
                      if (scannedOrder) {
                        console.log('Scanned order:', scannedOrder);
                        alert(`Order found: ${scannedOrder.supplierOrBuyer}`);
                      } else {
                        alert('Order not found with this ID');
                      }
                    }}
                    className="mt-2 px-3 py-1 bg-emerald-500/30 border border-emerald-500/50 rounded text-xs hover:bg-emerald-500/40 transition"
                  >
                    Lookup Order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}