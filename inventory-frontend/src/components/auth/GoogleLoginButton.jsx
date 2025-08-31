import React from "react";
import { motion } from "framer-motion";
import GoogleIcon from "./GoogleIcon";

export default function GoogleLoginButton({
  label = "Continue with Google",
  onClick = () => {},
  loading = false,
  className = "",
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      disabled={loading}
      className={`w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-xl 
        border border-white/15 bg-white text-neutral-900 
        hover:bg-neutral-50 active:bg-neutral-100
        dark:bg-neutral-900 dark:text-white dark:border-white/10
        dark:hover:bg-neutral-850/80 dark:active:bg-neutral-900
        transition disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      <GoogleIcon className="h-5 w-5" />
      <span className="text-sm font-medium">
        {loading ? "Connecting..." : label}
      </span>
    </motion.button>
  );
}
