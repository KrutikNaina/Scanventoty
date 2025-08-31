import React, { useState, useEffect, useMemo } from "react";
import { ArrowUpDown, PencilLine, QrCode, Printer, CheckCircle2, AlertTriangle, X, Download, Search, Filter } from "lucide-react";
import QRCode from "qrcode";
import axios from "axios";

// ----- InlineEditNumber Component -----
function InlineEditNumber({ value, onSave, onCancel, min = 0, step = 1 }) {
  const [val, setVal] = useState(value);
  return (
    <div className="inline-flex items-center gap-2">
      <input
        type="number"
        className="w-20 bg-neutral-900 text-white text-sm px-2 py-1 rounded-lg border border-white/10"
        value={val}
        min={min}
        step={step}
        onChange={e => setVal(e.target.value)}
        autoFocus
      />
      <button onClick={() => onSave(Number(val))} className="px-2 py-1 bg-emerald-600 rounded-lg text-white text-sm hover:bg-emerald-700">Save</button>
      <button onClick={onCancel} className="px-2 py-1 bg-red-600 rounded-lg text-white text-sm hover:bg-red-700">Cancel</button>
    </div>
  );
}

// ----- StockBadge Component -----
function StockBadge({ stock }) {
  const state = stock === 0 ? "Out" : stock <= 15 ? "Low" : "In Stock";
  const cls =
    state === "Out"
      ? "text-red-300 bg-red-500/10 border-red-500/20"
      : state === "Low"
      ? "text-amber-300 bg-amber-500/10 border-amber-500/20"
      : "text-emerald-300 bg-emerald-500/10 border-emerald-500/20";
  const Icon = state === "Out" ? AlertTriangle : CheckCircle2;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg border ${cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {state}
    </span>
  );
}

// ----- InventoryTable Component -----
function InventoryTable({ rows, sortBy, onSort, onEdit, onShowQR }) {
  const [editing, setEditing] = useState({});

  const startEdit = (id, field) => setEditing(e => ({ ...e, [id]: { ...(e[id] || {}), [field]: true } }));
  const stopEdit = (id, field) => setEditing(e => ({ ...e, [id]: { ...(e[id] || {}), [field]: false } }));

  const thBtn = (label, key) => {
    const active = sortBy.key === key;
    return (
      <button onClick={() => onSort(key)} className={`inline-flex items-center gap-1 ${active ? "text-white" : "text-neutral-300"} hover:text-white`}>
        {label}
        <ArrowUpDown className="h-3.5 w-3.5" />
      </button>
    );
  };

  return (
    <div className="overflow-x-auto bg-neutral-950 rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-900 border-b border-white/10">
          <tr className="text-neutral-300">
            <th className="text-left px-5 py-3 w-[140px]">{thBtn("SKU", "sku")}</th>
            <th className="text-left px-5 py-3 min-w-[220px]">{thBtn("Name", "name")}</th>
            <th className="text-left px-5 py-3 w-[140px]">{thBtn("Category", "category")}</th>
            <th className="text-right px-5 py-3 w-[120px]">{thBtn("Price", "price")}</th>
            <th className="text-right px-5 py-3 w-[120px]">{thBtn("Stock", "stock")}</th>
            <th className="text-left px-5 py-3 w-[140px]">{thBtn("Updated", "updatedAt")}</th>
            <th className="text-right px-5 py-3 w-[160px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-neutral-400">No items found.</td>
            </tr>
          ) : (
            rows.map(r => {
              const id = r._id;
              return (
                <tr key={id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-5 py-3 font-mono text-neutral-200">{r.sku}</td>
                  <td className="px-5 py-3 text-white">{r.name}</td>
                  <td className="px-5 py-3 text-neutral-300">{r.category}</td>

                  {/* Price Inline Edit */}
                  <td className="px-5 py-3 text-right">
                    {editing[id]?.price ? (
                      <InlineEditNumber
                        value={r.price}
                        min={0}
                        step={0.01}
                        onCancel={() => stopEdit(id, "price")}
                        onSave={val => { stopEdit(id, "price"); onEdit(id, { price: val }); }}
                      />
                    ) : (
                      <div className="inline-flex items-center gap-2 justify-end">
                        <span className="text-white font-medium">${r.price?.toFixed(2) ?? 0}</span>
                        <button className="text-neutral-400 hover:text-white" onClick={() => startEdit(id, "price")}>
                          <PencilLine className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Stock Inline Edit */}
                  <td className="px-5 py-3 text-right">
                    {editing[id]?.stock ? (
                      <InlineEditNumber
                        value={r.stock}
                        min={0}
                        step={1}
                        onCancel={() => stopEdit(id, "stock")}
                        onSave={val => { stopEdit(id, "stock"); onEdit(id, { stock: val }); }}
                      />
                    ) : (
                      <div className="inline-flex items-center gap-2 justify-end">
                        <span className="text-white font-medium">{r.stock}</span>
                        <button className="text-neutral-400 hover:text-white" onClick={() => startEdit(id, "stock")}>
                          <PencilLine className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-3 text-neutral-400">{new Date(r.updatedAt).toLocaleString()}</td>

                  <td className="px-5 py-3 flex items-center justify-end gap-2">
                    <StockBadge stock={r.stock} />
                    <button onClick={() => onShowQR(r)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5">
                      <QrCode className="h-4 w-4" /> QR
                    </button>
                    <button onClick={() => onShowQR(r, "print")} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5">
                      <Printer className="h-4 w-4" /> Print
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// ----- QRModal Component -----
function QRModal({ item, onClose }) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    const payload = { ...item, ts: Date.now() };
    QRCode.toDataURL(JSON.stringify(payload), { width: 320, margin: 1 }).then(setQr);
  }, [item]);

  function downloadPNG() {
    const a = document.createElement("a");
    a.href = qr;
    a.download = `${item.sku}.png`;
    a.click();
  }

  function printQR() {
    const w = window.open("", "_blank", "width=420,height=560");
    if (!w) return;
    w.document.write(`<html><body><img src="${qr}" /><script>window.print()</script></body></html>`);
    w.document.close();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[520px] max-w-[96vw] rounded-2xl border border-white/10 bg-neutral-950 p-6">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-lg border border-white/10 hover:bg-white/5"><X className="h-5 w-5" /></button>
        <div className="text-white text-lg font-semibold">{item.name}</div>
        <img src={qr} alt="QR" className="mt-4 w-[220px] h-[220px] mx-auto" />
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={downloadPNG} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white">Download</button>
          <button onClick={printQR} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">Print</button>
        </div>
      </div>
    </div>
  );
}

// ----- Main InventoryPage Component -----
export default function InventoryPage() {
  const [rows, setRows] = useState([]);
  const [qrItem, setQrItem] = useState(null);
  const [sortBy, setSortBy] = useState({ key: "updatedAt", dir: "desc" });
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  const categories = ["All", "Electronics", "Food", "Clothing"];
  const stockFilters = ["All", "In Stock", "Low", "Out"];

  // Fetch real backend data
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRows(res.data);
      } catch (err) {
        console.error("AxiosError", err);
      }
    };
    fetchInventory();
  }, []);

  const filtered = useMemo(() => {
    return rows
      .filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase()) || r.sku.toLowerCase().includes(q.toLowerCase()))
      .filter(r => categoryFilter === "All" || r.category === categoryFilter)
      .filter(r => {
        if (stockFilter === "All") return true;
        if (stockFilter === "In Stock") return r.stock > 15;
        if (stockFilter === "Low") return r.stock > 0 && r.stock <= 15;
        if (stockFilter === "Out") return r.stock === 0;
        return true;
      })
      .sort((a, b) => {
        const dir = sortBy.dir === "asc" ? 1 : -1;
        const k = sortBy.key;
        if (k === "price" || k === "stock") return (a[k] - b[k]) * dir;
        if (k === "updatedAt") return (new Date(a[k]) - new Date(b[k])) * dir;
        return String(a[k]).localeCompare(String(b[k])) * dir;
      });
  }, [rows, q, categoryFilter, stockFilter, sortBy]);

  const toggleSort = key => setSortBy(prev => prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });

  const handleEdit = (id, patch) => setRows(prev => prev.map(r => r._id === id ? { ...r, ...patch, updatedAt: new Date() } : r));

  return (
    <div className="min-h-screen p-6 bg-neutral-900 text-white flex flex-col gap-6">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-neutral-400" />
          <input placeholder="Search SKU or name" value={q} onChange={e => setQ(e.target.value)}
            className="px-3 py-2 rounded-lg bg-neutral-800 text-white text-sm outline-none" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-400" />
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-neutral-800 text-white text-sm">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-400" />
          <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-neutral-800 text-white text-sm">
            {stockFilters.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <InventoryTable rows={filtered} sortBy={sortBy} onSort={toggleSort} onEdit={handleEdit} onShowQR={setQrItem} />
      {qrItem && <QRModal item={qrItem} onClose={() => setQrItem(null)} />}
    </div>
  );
}
