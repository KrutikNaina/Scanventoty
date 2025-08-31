import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginCard from "./LoginCard";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ open, onClose }) {
  const navigate = useNavigate();

  // Use the secure Google OAuth login flow
  const handleGoogleLogin = async () => {
    // Open the OAuth popup (same as in Login.jsx)
    const popup = window.open(
      "http://localhost:5000/auth/google",
      "GoogleAuth",
      "width=500,height=600"
    );

    // Listen for the OAuth token from the popup
    const listener = (event) => {
      const allowedOrigins = ["http://localhost:5000", "http://localhost:5173"];
      if (!allowedOrigins.includes(event.origin)) return;
      if (event.data?.type === "oauth-success") {
        const token = event.data.token;
        if (token) {
          localStorage.setItem("token", token);
          // Optionally decode and use payload if needed
          // const payload = JSON.parse(atob(token.split(".")[1]));
          onClose();
          navigate("/dashboard");
        }
        window.removeEventListener("message", listener);
        if (popup) popup.close();
      }
    };
    window.addEventListener("message", listener);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* click outside to close */}
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10"
          >
            <LoginCard onGoogle={handleGoogleLogin} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
