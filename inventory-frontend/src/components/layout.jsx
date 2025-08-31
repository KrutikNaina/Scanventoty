// src/components/Layout.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <div className="flex h-screen bg-neutral-950 text-white">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar (mobile + sticky header) */}
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Page Content */}
        <main className="flex-1 relative overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
