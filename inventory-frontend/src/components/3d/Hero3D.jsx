import React from "react";
import { motion } from "framer-motion";
import Scene from "./Scene";

export default function Hero3D() {
  return (
    <section className="w-full min-h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-2 items-center gap-10 px-6 sm:px-10 lg:px-16">
      {/* LEFT: Copy */}
      <div className="order-2 lg:order-1">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Scan. Track. <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">Simplify.</span>
        </motion.h2>

        <motion.p
          className="mt-5 text-lg text-gray-700 dark:text-gray-300 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          QR-powered inventory that’s fast, accurate, and effortless. Scan items, auto-update stock, and breeze through billing — all in real time.
        </motion.p>

        {/* Rotating keywords (simple, no extra lib) */}
        <RotatingWords
          words={["Scan Faster", "Track Smarter", "Bill Instantly"]}
          className="mt-6 text-xl font-semibold text-blue-600 dark:text-blue-400"
        />

        <motion.div
          className="mt-8 flex items-center gap-3"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            🚀 Start Scanning
          </button>
          <button className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100/60 dark:hover:bg-gray-800/50">
            🎬 See Demo
          </button>
        </motion.div>
      </div>

      {/* RIGHT: 3D Canvas */}
      <div className="order-1 lg:order-2 h-[55vh] md:h-[65vh] lg:h-[75vh] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <Scene />
      </div>
    </section>
  );
}

function RotatingWords({ words = [], className = "" }) {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % words.length), 1600);
    return () => clearInterval(t);
  }, [words.length]);

  return (
    <motion.div
      key={idx}
      className={className}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {words[idx]}
    </motion.div>
  );
}
