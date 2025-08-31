import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  ScanLine,
  ShoppingCart,
  Database,
  Zap,
  ShieldCheck,
  ArrowRight,
  Box,
  BarChart3,
  Clock,
} from "lucide-react";
import QRCode from "qrcode";



// ---------- HERO WITH QR SCANNER PORTAL ----------
function ScanPortal() {
  // purely visual: sweeping beam animation using framer-motion
  return (
    <div className="relative w-full h-[380px] md:h-[440px] rounded-3xl border border-white/10 overflow-hidden bg-gradient-to-b from-neutral-900 to-black">
      {/* gate frame */}
      <div className="absolute inset-x-8 top-6 h-3 rounded-full bg-white/10" />
      {/* vertical posts */}
      <div className="absolute left-8 top-6 bottom-6 w-2 rounded-full bg-white/10" />
      <div className="absolute right-8 top-6 bottom-6 w-2 rounded-full bg-white/10" />

      {/* repeating QR tiles moving towards viewer */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 -translate-x-1/2 w-40 h-40 md:w-44 md:h-44 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm flex items-center justify-center"
          initial={{ y: 260, opacity: 0.0, scale: 0.8 }}
          animate={{ y: -120, opacity: 1, scale: 1 }}
          transition={{ duration: 6, repeat: Infinity, delay: i * 0.9, ease: "easeInOut" }}
        >
          <QrCode className="h-16 w-16 text-white/80" />
        </motion.div>
      ))}

      {/* sweeping beam */}
      <motion.div
        className="absolute inset-x-16 h-16 rounded-2xl"
        style={{ background: "radial-gradient(100% 100% at 50% 50%, rgba(34,197,94,0.35) 0%, rgba(34,197,94,0.12) 55%, transparent 70%)" }}
        initial={{ top: 40 }}
        animate={{ top: [40, 340, 40] }}
        transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* bottom glow */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-emerald-500/20 to-transparent" />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 pt-20 pb-10 md:pt-28 md:pb-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 text-xs text-neutral-300">
            <ScanLine className="h-3.5 w-3.5" /> Live QR Scanning Demo
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Scan. Track. Simplify.
          </h1>
          <p className="mt-5 text-neutral-300 text-lg">
            Your staff scans QR codes; we handle real‑time product data, stock updates, and instant billing. Built on a blazing MERN stack.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-lg shadow-emerald-600/20">Get started free</button>
            <button className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/5">View API Docs</button>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm text-neutral-400">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Secure by default</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Sub‑second scans</div>
            <div className="flex items-center gap-2"><Database className="h-4 w-4" /> Mongo‑backed</div>
          </div>
        </div>
        <ScanPortal />
      </div>
    </section>
  );
}

// ---------- PAGE ----------
export default function SmartInventoryLanding() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <Hero />
      {/* <Features /> */}
      {/* <HowItWorks /> */}
      {/* <LiveDemo /> */}
      {/* <KPIBar /> */}
      {/* <Footer /> */}
    </main>
  );
}
