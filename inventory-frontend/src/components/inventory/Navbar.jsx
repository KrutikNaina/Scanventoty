  // src/Navbar.jsx
  import React, { useState } from "react";
  import { Menu, X, Bell, User } from "lucide-react";

  export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
      <nav className="w-full border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="text-lg font-bold text-emerald-400">
            SmartInventory
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-white/10">
              <Bell size={18} />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10">
              <User size={18} />
            </button>

            {/* Mobile Menu Toggle (optional, can be linked with Sidebar) */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-white/10"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>
    );
  }
