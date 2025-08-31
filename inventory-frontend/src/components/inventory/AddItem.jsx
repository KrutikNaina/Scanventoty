import React, { useState } from "react";
import { PlusCircle } from "lucide-react";

export default function AddItem() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    status: "Available",
    location: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token"); // JWT token from login
      if (!token) throw new Error("You are not logged in.");

      // Prepare payload for backend
      const payload = {
        ...form,
        quantity: Number(form.quantity), // ensure number type
      };

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setMessage("✅ Item Added Successfully!");
        setForm({
          name: "",
          category: "",
          quantity: "",
          status: "Available",
          location: "",
          description: "",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <PlusCircle className="h-7 w-7 text-emerald-400" />
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Add New Item
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 border border-white/10 rounded-xl p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter item name"
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              required
            >
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Stationery">Stationery</option>
              <option value="Kitchen Supplies">Kitchen Supplies</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Networking">Networking</option>
              <option value="Software">Software</option>
              <option value="Safety Equipment">Safety Equipment</option>
              <option value="Cleaning Supplies">Cleaning Supplies</option>
              <option value="Miscellaneous">Miscellaneous</option>
              <option value="Other">Other</option>

            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              <option value="Available">Available</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Low Stock">Low Stock</option>
            </select>
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter item location"
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter item description"
              rows="4"
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end items-center gap-4">
          <span className="text-green-400">{message}</span>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition"
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  );
}
