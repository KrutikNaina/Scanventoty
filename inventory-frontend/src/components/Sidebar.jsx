import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes, // Inventory
  FileText, // Reports
  ClipboardList, // Orders
  Shield, // Admin Panel
  LogOut,
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user")) || { role: "Guest" };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 p-2 rounded-lg transition-colors ${
      isActive
        ? "bg-emerald-500/20 text-emerald-400 font-medium"
        : "hover:bg-white/10 text-neutral-300"
    }`;

  return (
    <>
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-neutral-900 border-r border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="hidden md:flex p-6 items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white font-bold text-lg">
            S
          </div>
          <span className="text-white font-bold tracking-tight">
            Scanventory
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink to="/dashboard" className={navLinkClasses} onClick={() => setIsOpen(false)}>
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </NavLink>
          <NavLink to="/inventory" className={navLinkClasses} onClick={() => setIsOpen(false)}>
            <Boxes className="h-5 w-5" /> Inventory
          </NavLink>
          <NavLink to="/reports" className={navLinkClasses} onClick={() => setIsOpen(false)}>
            <FileText className="h-5 w-5" /> Reports
          </NavLink>
          <NavLink to="/orders" className={navLinkClasses} onClick={() => setIsOpen(false)}>
            <ClipboardList className="h-5 w-5" /> Orders
          </NavLink>
          {/* Admin Panel visible only for Admin */}
          {currentUser.role === "admin" && (
            <NavLink to="/admin-panel" className={navLinkClasses} onClick={() => setIsOpen(false)}>
              <Shield className="h-5 w-5" /> Admin Panel
            </NavLink>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/10 text-red-400"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-neutral-900 p-6 rounded-xl border border-white/10 w-80">
            <h2 className="text-white text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
