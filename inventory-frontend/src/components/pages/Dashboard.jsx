import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Package,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../Sidebar";

export default function Dashboard() {
  const [kpis, setKpis] = useState([
    { icon: <Package className="h-5 w-5" />, label: "Total Products", value: "0" },
    { icon: <ShoppingCart className="h-5 w-5" />, label: "Orders Today", value: "0" },
    { icon: <AlertTriangle className="h-5 w-5 text-amber-400" />, label: "Low Stock", value: "0" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "Stock Accuracy", value: "0%" },
  ]);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch products
    fetch("http://localhost:5000/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then(products => {
        const totalProducts = products.length;
        const lowStock = products.filter(p => p.stockQty <= 5).length;
        const accurateCount = products.filter(p => p.stockQty >= 0).length;
        const accuracy = products.length > 0 ? ((accurateCount / products.length) * 100).toFixed(1) + "%" : "0%";

        setKpis(prev => [
          { ...prev[0], value: totalProducts },
          prev[1], // orders will be updated later
          { ...prev[2], value: lowStock },
          { ...prev[3], value: accuracy },
        ]);

        // Prepare stock chart for first 7 items
        const data = products.slice(0, 7).map((p, i) => ({
          name: `Item ${i + 1}`,
          stock: p.stockQty,
        }));
        setChartData(data);
      })
      .catch(err => console.error("Error fetching products:", err));

    // Fetch orders
    fetch("http://localhost:5000/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then(orders => {
        const today = new Date().toDateString();
        const todayOrders = orders.filter(order => new Date(order.createdAt).toDateString() === today);
        setKpis(prev => [
          prev[0],
          { ...prev[1], value: todayOrders.length },
          prev[2],
          prev[3],
        ]);
      })
      .catch(err => console.error("Error fetching orders:", err));

  }, []);

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* <Sidebar /> */}

      <main className="flex-1 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/3 left-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="relative px-4 md:px-6 py-6 md:py-10 max-w-7xl mx-auto">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((k, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-neutral-400 text-xs">
                  {k.icon} {k.label}
                </div>
                <div className="text-xl font-bold">{k.value}</div>
              </div>
            ))}
          </div>

          {/* Stock Chart */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
                <Line type="monotone" dataKey="stock" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
