// SmartInventoryLanding.jsx
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  ScanLine,
  ShieldCheck,
  Clock,
  Database,
} from "lucide-react";

// Helper for clamping values
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// --------- 3D HOLOGRAPHIC SCAN PORTAL ---------
function ScanPortal3D() {
  const wrapRef = useRef(null);
  const [xy, setXY] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    setXY({ x: (rx - 0.5) * 2, y: (ry - 0.5) * 2 });
  };

  const onLeave = () => setXY({ x: 0, y: 0 });

  const rotY = clamp(xy.x * 10, -12, 12);
  const rotX = clamp(-xy.y * 10, -12, 12);

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative w-full h-[420px] md:h-[500px]"
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative w-full h-full rounded-3xl border border-emerald-500/25 overflow-hidden bg-gradient-to-b from-neutral-900 via-black to-black shadow-[0_0_80px_rgba(16,185,129,0.25)]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: rotX, rotateY: rotY }}
        transition={{ type: "spring", stiffness: 120, damping: 14, mass: 0.7 }}
      >
        {/* Grid background */}
        <motion.div
          className="absolute inset-0 opacity-25"
          style={{
            transform: "translateZ(-80px)",
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
          animate={{ backgroundPositionY: ["0px", "46px"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Frame rails */}
        <div
          className="absolute inset-x-8 top-6 h-3 rounded-full bg-white/10"
          style={{ transform: "translateZ(20px)" }}
        />
        <div
          className="absolute left-8 top-6 bottom-6 w-2 rounded-full bg-white/10"
          style={{ transform: "translateZ(20px)" }}
        />
        <div
          className="absolute right-8 top-6 bottom-6 w-2 rounded-full bg-white/10"
          style={{ transform: "translateZ(20px)" }}
        />

        {/* Floating particles */}
        {[...Array(26)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-emerald-400/50"
            style={{
              width: 2 + Math.random() * 4,
              height: 2 + Math.random() * 4,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: "blur(0.2px)",
              transform: `translateZ(${Math.random() * 140 - 40}px)`,
            }}
            animate={{
              y: [0, -10, 0],
              x: [0, 6, 0],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{
              duration: 2.5 + Math.random() * 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* QR tiles */}
        {[...Array(6)].map((_, i) => {
          const z = 40 + i * 22;
          return (
            <motion.div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 w-40 h-40 md:w-44 md:h-44 rounded-xl border border-emerald-400/35 bg-white/5 backdrop-blur-sm flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.35)]"
              style={{ transform: `translateZ(${z}px)` }}
              initial={{ y: 300, opacity: 0, rotateY: 0 }}
              animate={{ y: -130, opacity: 1, rotateY: 360 }}
              transition={{
                duration: 7.2,
                repeat: Infinity,
                delay: i * 1.05,
                ease: "easeInOut",
              }}
            >
              <QrCode className="h-16 w-16 text-emerald-400/85" />
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(110deg, rgba(255,255,255,0.0) 20%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.0) 70%)",
                  mixBlendMode: "screen",
                }}
              />
            </motion.div>
          );
        })}

        {/* Scan beam */}
        <motion.div
          className="absolute inset-x-16 h-20 rounded-full blur-3xl"
          style={{
            transform: "translateZ(110px)",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.55) 0%, rgba(16,185,129,0.16) 60%, transparent 80%)",
          }}
          animate={{ top: [60, 380, 60] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Cursor light */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            transform: "translateZ(140px)",
            background: `radial-gradient(400px 240px at ${50 + xy.x * 30}% ${
              50 + xy.y * 30
            }%, rgba(16,185,129,0.18), transparent 60%)`,
            mixBlendMode: "screen",
          }}
        />

        {/* Bottom glow */}
        <div
          className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-emerald-500/25 to-transparent"
          style={{ transform: "translateZ(10px)" }}
        />
      </motion.div>
    </div>
  );
}

// ----------------- Hero Section -----------------
function Hero() {
  return (
    <section className="relative bg-neutral-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 pt-20 pb-10 md:pt-28 md:pb-16 items-center">
        {/* Left text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 text-xs text-emerald-300 bg-emerald-500/10">
            <ScanLine className="h-3.5 w-3.5" /> Live QR Scanning Demo
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-emerald-400 via-emerald-200 to-emerald-500 bg-clip-text text-transparent">
            Scan. Track. Simplify.
          </h1>
          <p className="mt-5 text-neutral-300 text-lg leading-relaxed">
            Your staff scans QR codes; we handle real-time product data, stock updates, and instant billing — all powered by a blazing MERN stack.
          </p>
          {/* <div className="mt-8 flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-lg shadow-emerald-500/30 transition"
            >
              Get started free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-5 py-3 rounded-xl border border-emerald-400/30 hover:bg-emerald-500/5 transition"
            >
              View API Docs
            </motion.button>
          </div> */}
          <div className="mt-6 flex items-center gap-6 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Secure by default
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" /> Sub-second scans
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-400" /> Mongo-backed
            </div>
          </div>
        </motion.div>

        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ScanPortal3D />
        </motion.div>
      </div>
    </section>
  );
}

// ----------------- Page Wrapper -----------------
export default function SmartInventoryLanding() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <Hero />
    </main>
  );
}
