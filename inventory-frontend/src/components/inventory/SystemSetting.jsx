// src/pages/SystemSettings.jsx
import React, { useState } from "react";
import { Save, Bell, Key, User } from "lucide-react";

export default function SystemSetting() {
  const [settings, setSettings] = useState({
    siteName: "SmartInventory",
    timezone: "Asia/Kolkata",
    notifications: true,
    theme: "light",
    password: "",
  });

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white">System Settings</h1>

      {/* General Settings */}
      <section className="bg-neutral-900 border border-white/10 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <User className="h-5 w-5 text-emerald-400" /> General Settings
        </h2>

        <div className="flex flex-col sm:flex-row sm:gap-4 gap-3">
          <div className="flex-1 flex flex-col">
            <label className="text-sm text-neutral-400 mb-1">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleChange("siteName", e.target.value)}
              className="px-3 py-2 rounded-lg bg-neutral-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="text-sm text-neutral-400 mb-1">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
              className="px-3 py-2 rounded-lg bg-neutral-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-neutral-900 border border-white/10 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-400" /> Notifications
        </h2>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => handleChange("notifications", e.target.checked)}
            className="w-5 h-5 rounded bg-neutral-800 border border-white/10 focus:ring-emerald-400"
          />
          <span className="text-white text-sm">Enable notifications</span>
        </label>
      </section>

      {/* Account / Security */}
      <section className="bg-neutral-900 border border-white/10 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Key className="h-5 w-5 text-yellow-400" /> Security
        </h2>

        <div className="flex flex-col sm:flex-row sm:gap-4 gap-3">
          <div className="flex-1 flex flex-col">
            <label className="text-sm text-neutral-400 mb-1">New Password</label>
            <input
              type="password"
              value={settings.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="••••••••"
              className="px-3 py-2 rounded-lg bg-neutral-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-medium transition"
        >
          <Save className="h-4 w-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
