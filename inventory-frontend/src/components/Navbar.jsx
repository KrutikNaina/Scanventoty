import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./auth/LoginModal";

export default function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    navigate("/dashboard");
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-neutral-950/60">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white font-bold text-lg">
              S
            </div>
            <span className="text-white font-bold tracking-tight">
              Scanventory
            </span>
          </div>

          <button
            onClick={() => setLoginOpen(true)}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            Sign in
          </button>
        </nav>
      </header>

      {/* Login modal */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onContinue={handleLoginSuccess} 
      />
    </>
  );
}
