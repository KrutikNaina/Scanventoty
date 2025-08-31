import React, { useState } from "react";
import { motion } from "framer-motion";
import GoogleLoginButton from "./GoogleLoginButton";
import AuthDivider from "./AuthDivider";

export default function LoginCard({ onGoogle = () => {} }) {
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    try {
      // design-only: plug your OAuth here (eg. firebase, next-auth, passport)
      await onGoogle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full max-w-md rounded-3xl border border-white/10
        bg-gradient-to-b from-white/5 to-transparent backdrop-blur
        p-6 sm:p-8 text-white"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white font-bold text-lg">
            S
          </div>
        </div>

        <div>
          <h2 className="font-semibold leading-tight">Scanventory</h2>
          <p className="text-xs text-neutral-400">Log in to your dashboard</p>
        </div>
      </div>

      <h1 className="mt-6 text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Scan, track, and manage inventory in real time.
      </p>

      <div className="mt-6">
        <GoogleLoginButton onClick={handleGoogle} loading={loading} />
      </div>

      <AuthDivider text="or" />

      {/* optional email fields (design only) */}
      <form className="space-y-3">
        <label className="block">
          <span className="text-xs text-neutral-400">Email</span>
          <input
            type="email"
            className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 outline-none focus:border-emerald-500"
            placeholder="you@company.com"
          />
        </label>
        <label className="block">
          <span className="text-xs text-neutral-400">Password</span>
          <input
            type="password"
            className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 outline-none focus:border-emerald-500"
            placeholder="••••••••"
          />
        </label>
        <button
          type="button"
          className="w-full mt-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-600/20"
        >
          Continue
        </button>
      </form>

      <p className="mt-4 text-xs text-neutral-500">
        By continuing, you agree to our Terms and Privacy Policy.
      </p>
    </motion.div>
  );
}
