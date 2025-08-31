// src/components/KPIBar.jsx
import React from "react";

export default function KPIBar() {
  const kpis = [
    { label: "Avg. scan → cart", value: "0.8s" },
    { label: "Stock accuracy", value: "99.4%" },
    { label: "SKU coverage", value: "100%" },
    { label: "Downtime", value: "< 0.01%" },
  ];
  return (
    <section className="bg-neutral-950 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {kpis.map((k, i) => (
          <div key={i} className="rounded-2xl border border-white/10 p-4 bg-white/5">
            <div className="text-neutral-400 text-xs">{k.label}</div>
            <div className="text-xl font-bold mt-1">{k.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
    