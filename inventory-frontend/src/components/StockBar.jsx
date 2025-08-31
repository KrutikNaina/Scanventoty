import React from "react";

export default function StockBar({ value }) {
  return (
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          value > 15 ? "bg-emerald-500" : "bg-red-500"
        }`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
