import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useQRCodeCanvas } from "./useQRCodeCanvas";
import StockBar from "./StockBar";

export default function LiveDemo() {
    const [sku, setSku] = useState("INV-QR-0001");
    const [price, setPrice] = useState(2.49);
    const [stock, setStock] = useState(78);
    const canvasRef = useQRCodeCanvas(sku);

    function randomize() {
        const n = Math.floor(100000 + Math.random() * 900000);
        setSku(`SKU-${n}`);
        setPrice((Math.random() * 50 + 1).toFixed(2));
        setStock(Math.floor(Math.random() * 100));
    }

    return (
        <section className="bg-neutral-950 text-white border-t border-white/10">
        
            <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
                {/* Left Side */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold">
                        Try it in your browser
                    </h2>
                    <p className="mt-3 text-neutral-300 max-w-xl">
                        Enter a SKU and we generate a QR you can scan with any device. The
                        mock card on the right updates live with price and stock.
                    </p>

                    {/* Inputs */}
                    <div className="mt-8 grid sm:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-2">
                            <span className="text-sm text-neutral-400">Product / SKU</span>
                            <input
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                className="px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm text-neutral-400">Price ($)</span>
                            <input
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm text-neutral-400">Stock (%)</span>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) =>
                                    setStock(Math.max(0, Math.min(100, Number(e.target.value))))
                                }
                                className="px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <div className="flex items-end">
                            <button
                                onClick={randomize}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15"
                            >
                                Randomize
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-sm text-neutral-400">
                        PS: This generates client-side only—no server needed.
                    </div>
                </div>

                {/* Right Side - QR & Info Card */}
                <div className="rounded-3xl border border-white/10 p-6 bg-gradient-to-b from-white/5 to-transparent">
                    <div className="grid sm:grid-cols-[200px,1fr] gap-6 items-center">
                        <div className="rounded-2xl bg-white p-3 flex items-center justify-center">
                            <canvas ref={canvasRef} className="[image-rendering:pixelated]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                                <ShieldCheck className="h-3.5 w-3.5" /> Verified SKU
                            </div>
                            <h3 className="mt-2 text-xl font-semibold text-white">{sku}</h3>
                            <div className="mt-1 text-neutral-300">
                                Grocery • Packaged • Ambient
                            </div>

                            {/* Price / Stock / Status */}
                            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                                    <div className="text-neutral-400">Price</div>
                                    <div className="text-white font-semibold mt-1">
                                        ${Number(price).toFixed(2)}
                                    </div>
                                </div>
                                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                                    <div className="text-neutral-400">Stock</div>
                                    <div className="text-white font-semibold mt-1">
                                        {stock}%
                                    </div>
                                </div>
                                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                                    <div className="text-neutral-400">Status</div>
                                    <div className="text-white font-semibold mt-1">
                                        {stock > 15 ? "In Stock" : "Low"}
                                    </div>
                                </div>
                            </div>

                            {/* Stock Bar */}
                            <div className="mt-5">
                                <StockBar value={stock} />
                            </div>

                            {/* Buttons */}
                            <div className="mt-6 flex gap-3">
                                <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                                    Add to Cart
                                </button>
                                <button className="px-4 py-2 rounded-xl border border-white/15 hover:bg-white/5">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
