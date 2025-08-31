// src/pages/AdminSettings.jsx
import React, { useState } from "react";
import { Plus, Trash2, Edit, Shield, LogOut } from "lucide-react";

export default function AdminSettings() {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Sarah Lee", email: "sarah@example.com", role: "Staff" },
    { id: 3, name: "Mike Ross", email: "mike@example.com", role: "Auditor" },
  ]);

  const [logs] = useState([
    { time: "2025-08-15 09:45", action: "User Login", user: "John Doe" },
    { time: "2025-08-15 09:50", action: "Added New User", user: "Sarah Lee" },
    { time: "2025-08-15 10:00", action: "Changed Role", user: "Mike Ross" },
  ]);

  const roles = ["Admin", "Staff", "Auditor"];

  const updateRole = (id, newRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const removeUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (

      
    <main className="relative min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/3 left-1/2 w-[600px] h-[600px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-neutral-950/60">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="text-white font-bold tracking-tight">Admin Settings</span>
          </div>
          <button className="flex items-center gap-2 text-sm bg-red-500/20 px-3 py-1 rounded-lg border border-red-500/40 hover:bg-red-500/30">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </nav>
      </header>

      <div className="relative max-w-7xl mx-auto px-6 py-10 space-y-10">
        
        {/* User Management */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">User Management</h2>
            <button className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-500/40 hover:bg-emerald-500/30">
              <Plus className="h-4 w-4" /> Add User
            </button>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
            <table className="min-w-full text-sm">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t border-white/10 hover:bg-white/5 transition">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="bg-transparent border border-white/20 rounded-lg px-2 py-1 text-sm"
                      >
                        {roles.map(r => (
                          <option key={r} value={r} className="bg-neutral-900">
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="p-1 hover:bg-white/10 rounded-lg">
                        <Edit className="h-4 w-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => removeUser(user.id)}
                        className="p-1 hover:bg-white/10 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* System Logs */}
        <section>
          <h2 className="text-lg font-semibold mb-4">System Logs</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
            <table className="min-w-full text-sm">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">User</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i} className="border-t border-white/10 hover:bg-white/5 transition">
                    <td className="px-4 py-3">{log.time}</td>
                    <td className="px-4 py-3">{log.action}</td>
                    <td className="px-4 py-3">{log.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
