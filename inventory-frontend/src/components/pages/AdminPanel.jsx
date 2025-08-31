// src/pages/AdminPanel.jsx
import React from "react";
import { PlusCircle, Users, FileText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add New Item",
      description: "Quickly add a new product to inventory",
      icon: <PlusCircle className="h-6 w-6 text-emerald-400" />,
      route: "/add-item", // 👈 route for navigation
    },
    {
      title: "Manage Users",
      description: "Add, update, or remove user accounts",
      icon: <Users className="h-6 w-6 text-blue-400" />,
      route: "/manage-users",
    },
    {
      title: "View Logs",
      description: "Review activity logs & audit trails",
      icon: <FileText className="h-6 w-6 text-yellow-400" />,
      route: "/logs",
    },
    {
      title: "System Settings",
      description: "Update preferences & configurations",
      icon: <Settings className="h-6 w-6 text-purple-400" />,
      route: "/settings",
    },
  ];



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white tracking-tight">
        Admin Panel
      </h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => (
          <div
            key={idx}
            onClick={() => navigate(action.route)} // 👈 navigation here
            className="p-5 bg-neutral-900 border border-white/10 rounded-xl hover:bg-neutral-800 cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-neutral-800 rounded-lg">{action.icon}</div>
              <div>
                <h3 className="text-white font-semibold">{action.title}</h3>
                <p className="text-neutral-400 text-sm">{action.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
