// src/pages/UsersPage.jsx
import React, { useState } from "react";
import { Edit, Trash } from "lucide-react";

const initialUsers = [
  { id: 1, name: "John Doe", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", role: "Manager", status: "Active" },
  { id: 3, name: "Mike Johnson", role: "Staff", status: "Inactive" },
  { id: 4, name: "Alice Brown", role: "Staff", status: "Active" },
  { id: 5, name: "Bob White", role: "Manager", status: "Inactive" },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">User Management</h1>

      {/* Desktop Table */}
      <div className="hidden md:block bg-neutral-900 border border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-white/5 hover:bg-neutral-800"
              >
                <td className="px-4 py-2 text-white">{user.name}</td>
                <td className="px-4 py-2 text-neutral-300">{user.role}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm text-white flex items-center gap-1">
                    <Edit className="h-4 w-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-sm text-white flex items-center gap-1"
                  >
                    <Trash className="h-4 w-4" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-neutral-900 border border-white/10 rounded-xl flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">{user.name}</span>
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${
                  user.status === "Active"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {user.status}
              </span>
            </div>
            <div className="text-neutral-300">{user.role}</div>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-1">
                <Edit className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="flex-1 px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-1"
              >
                <Trash className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
