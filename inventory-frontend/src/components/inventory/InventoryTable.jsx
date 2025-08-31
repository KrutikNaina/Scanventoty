// InventoryTable.jsx
import React, { useState } from "react";
import { ArrowUpDown, PencilLine, QrCode, Printer, CheckCircle2, AlertTriangle } from "lucide-react";
import InlineEditNumber from "./InlineEditNumber";

function thBtn(label, onClick, active) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1 ${active ? "text-white" : "text-neutral-300"} hover:text-white`} title={`Sort by ${label}`}>
      {label} <ArrowUpDown className="h-3.5 w-3.5" />
    </button>
  );
}

function StockBadge({ stock }) {
  const state = stock === 0 ? "Out" : stock <= 15 ? "Low" : "In Stock";
  const cls = state === "Out" ? "text-red-300 bg-red-500/10 border-red-500/20" : state === "Low" ? "text-amber-300 bg-amber-500/10 border-amber-500/20" : "text-emerald-300 bg-emerald-500/10 border-emerald-500/20";
  const Icon = state === "Out" ? AlertTriangle : CheckCircle2;
  return <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg border ${cls}`}><Icon className="h-3.5 w-3.5" />{state}</span>;
}

export default function InventoryTable({ rows, sortBy, onSort, onEdit, onShowQR }) {
  const [editing, setEditing] = useState({});

  function startEdit(id, field) { setEditing(e => ({ ...e, [id]: { ...(e[id] || {}), [field]: true } })); }
  function stopEdit(id, field) { setEditing(e => ({ ...e, [id]: { ...(e[id] || {}), [field]: false } })); }

  return (
    <div className="overflow-x-auto bg-neutral-950 rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-900 border-b border-white/10">
          <tr className="text-neutral-300">
            <th className="text-left px-5 py-3 w-[140px]">{thBtn("SKU", () => onSort("sku"), sortBy.key === "sku")}</th>
            <th className="text-left px-5 py-3 min-w-[220px]">{thBtn("Name", () => onSort("name"), sortBy.key === "name")}</th>
            <th className="text-left px-5 py-3 w-[140px]">{thBtn("Category", () => onSort("category"), sortBy.key === "category")}</th>
            <th className="text-right px-5 py-3 w-[120px]">{thBtn("Price", () => onSort("price"), sortBy.key === "price")}</th>
            <th className="text-right px-5 py-3 w-[120px]">{thBtn("Stock", () => onSort("stock"), sortBy.key === "stock")}</th>
            <th className="text-left px-5 py-3 w-[140px]">{thBtn("Updated", () => onSort("updatedAt"), sortBy.key === "updatedAt")}</th>
            <th className="text-right px-5 py-3 w-[160px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-neutral-400">No items found.</td></tr>}
          {rows.map((r) => {
            const id = r.id;
            return (
              <tr key={id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-5 py-3 font-mono text-neutral-200">{r.sku}</td>
                <td className="px-5 py-3 text-white">{r.name}</td>
                <td className="px-5 py-3 text-neutral-300">{r.category}</td>

                <td className="px-5 py-3 text-right">
                  {editing[id]?.price ? (
                    <InlineEditNumber value={r.price} min={0} step={0.01} suffix="$" onCancel={() => stopEdit(id, "price")} onSave={(val) => { stopEdit(id, "price"); onEdit(id, { price: val }); }} />
                  ) : (
                    <div className="inline-flex items-center gap-2 justify-end">
                      <span className="text-white font-medium">${r.price?.toFixed(2)}</span>
                      <button className="text-neutral-400 hover:text-white" onClick={() => startEdit(id, "price")} title="Edit price"><PencilLine className="h-4 w-4" /></button>
                    </div>
                  )}
                </td>

                <td className="px-5 py-3 text-right">
                  {editing[id]?.stock ? (
                    <InlineEditNumber value={r.stock} min={0} step={1} onCancel={() => stopEdit(id, "stock")} onSave={(val) => { stopEdit(id, "stock"); onEdit(id, { stock: val }); }} />
                  ) : (
                    <div className="inline-flex items-center gap-2 justify-end">
                      <span className="text-white font-medium">{r.stock}</span>
                      <button className="text-neutral-400 hover:text-white" onClick={() => startEdit(id, "stock")} title="Edit stock"><PencilLine className="h-4 w-4" /></button>
                    </div>
                  )}
                </td>

                <td className="px-5 py-3 text-neutral-400">{new Date(r.updatedAt).toLocaleString()}</td>

                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <StockBadge stock={r.stock} />
                    <button onClick={() => onShowQR({ ...r })} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5" title="View QR">
                      <QrCode className="h-4 w-4" /> QR
                    </button>
                    <button onClick={() => onShowQR({ ...r }, "print")} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5" title="Print QR">
                      <Printer className="h-4 w-4" /> Print
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
