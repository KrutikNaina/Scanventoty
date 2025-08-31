import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { QrCode } from "lucide-react";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// --------- 3D HOLOGRAPHIC SCAN PORTAL ---------
export default function ScanPortal3D() {
  const wrapRef = useRef(null);
  const [xy, setXY] = useState({ x: 0, y: 0 });

  // mouse relative to the portal
  const onMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;  // 0..1
    const ry = (e.clientY - rect.top) / rect.height;  // 0..1
    // map to -1..1 (center is 0)
    setXY({ x: (rx - 0.5) * 2, y: (ry - 0.5) * 2 });
  };

  const onLeave = () => setXY({ x: 0, y: 0 });

  // rotations
  const rotY = clamp(xy.x * 10, -12, 12); // left/right tilt
  const rotX = clamp(-xy.y * 10, -12, 12); // up/down tilt

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative w-full h-[420px] md:h-[500px]"
      style={{ perspective: 1200 }}
    >
      {/* 3D card */}
      <motion.div
        className="relative w-full h-full rounded-3xl border border-emerald-500/25 overflow-hidden bg-gradient-to-b from-neutral-900 via-black to-black shadow-[0_0_80px_rgba(16,185,129,0.25)]"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateX: rotX, rotateY: rotY }}
        transition={{ type: "spring", stiffness: 120, damping: 14, mass: 0.7 }}
      >
        {/* subtle animated grid (background layer) */}
        <motion.div
          className="absolute inset-0 opacity-25"
          style={{
            transform: "translateZ(-80px)", // push behind
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
          animate={{ backgroundPositionY: ["0px", "46px"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* scanner gate rails */}
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

        {/* floating spark particles */}
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

        {/* QR tiles flying towards you (multiple depth planes) */}
        {[...Array(6)].map((_, i) => {
          const z = 40 + i * 22; // spacing in Z
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
              {/* QR tile gloss */}
              <div className="absolute inset-0 rounded-xl pointer-events-none"
                   style={{
                     background:
                       "linear-gradient(110deg, rgba(255,255,255,0.0) 20%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.0) 70%)",
                     mixBlendMode: "screen",
                   }}/>
            </motion.div>
          );
        })}

        {/* sweeping scan beam (sits in front) */}
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

        {/* specular rim light that follows cursor */}
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

        {/* bottom glow */}
        <div
          className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-emerald-500/25 to-transparent"
          style={{ transform: "translateZ(10px)" }}
        />
      </motion.div>
    </div>
  );
}
