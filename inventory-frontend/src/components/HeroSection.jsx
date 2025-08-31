import React from "react";
import { QrCode } from "lucide-react";
import { motion } from "framer-motion";

export default function QRScannerHero() {
  return (
    <section className="flex flex-col items-center text-center px-6 py-16 bg-gradient-to-b from-neutral-950 to-neutral-900 min-h-screen">
      {/* Heading with custom visual in the middle */}
      <h1 className="text-[8rem] font-extrabold leading-none flex items-center gap-4">
        QR
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl shadow-lg flex items-center justify-center"
        >
          <QrCode className="text-white w-16 h-16" />
        </motion.div>
        SCAN
      </h1>

      {/* Tag / Label */}
      <span className="mt-4 px-4 py-1 bg-neutral-800 rounded-lg border border-gray-600 text-gray-300 font-semibold">
        Instant Inventory Check
      </span>

      {/* Subtitle */}
      <p className="mt-6 text-gray-400 max-w-2xl">
        Point your camera, scan the code, and get instant access to product details and stock levels. Fast, secure, and built for your smart inventory.
      </p>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-10 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
      >
        Start Scanning
      </motion.button>
    </section>
  );
}
