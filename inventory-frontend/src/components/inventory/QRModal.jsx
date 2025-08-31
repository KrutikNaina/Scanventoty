// QRModal.jsx
import React, { useEffect, useState } from "react";
import { X, Download, Printer } from "lucide-react";
import QRCode from "qrcode";

export default function QRModal({ item, onClose }) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (!item) return;
    const payload = { sku: item.sku, name: item.name, category: item.category, price: item.price, stock: item.stock, ts: Date.now() };
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
    w.document.write(`
      <html>
      <head><title>${item.sku} - QR</title>
      <style>body{font-family:Inter,sans-serif;padding:20px}.card{border:1px solid #e5e7eb;border-radius:16px;padding:20px;text-align:center}img{width:260px;height:260px;image-rendering:pixelated}@media print{button{display:none}}</style>
      </head>
      <body>
      <div class="card"><h3>${item.name}</h3><div>${item.sku}</div><div>${item.category} • $${item.price.toFixed(2)} • Stock: ${item.stock}</div><img src="${qr}" /></div>
      <div style="text-align:center;margin-top:16px;"><button onclick="window.print()">Print</button></div>
      </body>
      </html>`);
    w.document.close();
    setTimeout(() => w.print(), 300);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[520px] max-w-[96vw] rounded-2xl border border-white/10 bg-neutral-950 p-6">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-lg border border-white/10 hover:bg-white/5"><X className="h-5 w-5" /></button>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600" />
          <div>
            <div className="text-white font-semibold">{item.name}</div>
            <div className="text-sm text-neutral-400">{item.sku}</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-5">
          <div className="rounded-xl bg-white p-3 flex items-center justify-center">
            {qr ? <img src={qr} alt="QR" className="w-[220px] h-[220px] [image-rendering:pixelated]" /> : <div className="text-neutral-400 text-sm">Generating QR…</div>}
          </div>

          <div className="text-sm">
            <div className="text-neutral-400">Category</div>
            <div className="text-white font-medium">{item.category}</div>
            <div className="mt-3 text-neutral-400">Price</div>
            <div className="text-white font-medium">${item.price.toFixed(2)}</div>
            <div className="mt-3 text-neutral-400">Stock</div>
            <div className="text-white font-medium">{item.stock}</div>

            <div className="mt-6 flex gap-2">
              <button onClick={printQR} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"><Printer className="h-4 w-4" />Print</button>
              <button onClick={downloadPNG} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5"><Download className="h-4 w-4" />Download PNG</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
