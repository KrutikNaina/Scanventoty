import React, { useEffect, useState } from "react";
import { products } from "../data/reportsData.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Simple Card component fallback if you don't have your custom one
const Card = ({ children, className }) => (
  <div className={`rounded-lg shadow p-4 ${className}`}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={className}>{children}</div>
);

export default function Reports() {
  const [summary, setSummary] = useState("");
  const [lowStock, setLowStock] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // 1️⃣ Low stock
    const lowStockItems = products.filter((p) => p.stockQty <= 5);
    setLowStock(lowStockItems);

    // 2️⃣ Top-selling
    const topSellingItems = [...products]
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 3);
    setTopSelling(topSellingItems);

    // 3️⃣ Chart data
    const chart = products.map((p) => ({ name: p.name, stock: p.stockQty }));
    setChartData(chart);

    // 4️⃣ Fetch AI report
    const fetchAIReport = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ai-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products }),
        });

        const data = await response.json();
        setSummary(data.report);
      } catch (err) {
        console.error("Error fetching AI report:", err);
        setSummary(
          `You have ${lowStockItems.length} products low in stock: ${lowStockItems
            .map((p) => p.name)
            .join(", ")}. Top-selling products are ${topSellingItems
            .map((p) => p.name)
            .join(", ")}.`
        );
      }
    };

    fetchAIReport();
  }, []);

  return (
    <div className="p-6 text-white bg-neutral-950 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 AI-Based Inventory Report</h1>

      {/* Summary Card */}
      <Card className="bg-neutral-900 border-white/10 mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-3 text-emerald-400">
            AI Summary
          </h2>
          <p className="text-neutral-300 leading-relaxed">{summary}</p>
        </CardContent>
      </Card>

      {/* Two-column grid for lists */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Low Stock */}
        <Card className="bg-neutral-900 border-white/10">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-3 text-red-400">
              ⚠️ Low Stock Items
            </h2>
            {lowStock.length > 0 ? (
              <ul className="space-y-2 text-neutral-300">
                {lowStock.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between border-b border-white/5 pb-1"
                  >
                    <span>{item.name}</span>
                    <span className="text-sm text-red-400">{item.stockQty} left</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-neutral-400">No items low in stock 🎉</p>
            )}
          </CardContent>
        </Card>

        {/* Top Selling */}
        <Card className="bg-neutral-900 border-white/10">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-3 text-blue-400">
              ⭐ Top Selling Items
            </h2>
            <ul className="space-y-2 text-neutral-300">
              {topSelling.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between border-b border-white/5 pb-1"
                >
                  <span>{item.name}</span>
                  <span className="text-sm text-emerald-400">{item.sold} sold</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Stock Chart */}
      <Card className="bg-neutral-900 border-white/10 mt-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-3 text-purple-400">📦 Stock Levels</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                />
                <Line type="monotone" dataKey="stock" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
