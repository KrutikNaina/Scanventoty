import React from "react";
import {
  QrCode,
  Database,
  ShoppingCart,
  Zap,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

export default function Features() {
  const items = [
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "QR-Code Powered",
      desc: "Each item gets a unique QR code with embedded metadata — scan to view, update, or track instantly.",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Live Inventory Sync",
      desc: "MongoDB change streams ensure stock counts update in real time across all user devices.",
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "One-Tap Billing",
      desc: "Generate invoices instantly from scanned items. POS-ready exports for smooth checkout.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-Time Alerts",
      desc: "Low stock? Expiry near? Get instant notifications via web & mobile push.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Role-Based Access",
      desc: "Secure login with staff, admin, and auditor roles. Activity logs for full accountability.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Smart Analytics",
      desc: "Visual dashboards with sales trends, stock movement heatmaps, and predictive restocking.",
    },
  ];

  return (
    <section className="top-0 z-40 backdrop-blur border-b border-white/10 bg-neutral-950/60 text-white py-16">
        
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/10 bg-neutral-900/70 hover:bg-neutral-800/80 transition-colors"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-600/10 text-emerald-400 mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
