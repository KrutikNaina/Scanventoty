// src/components/Footer.jsx
import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        {/* Branding */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white font-bold text-lg shadow-md">
              S
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Scanventory
            </span>
          </div>
          <p className="text-sm text-neutral-400">
            QR-powered inventory for modern retail. Built with MERN stack for
            seamless performance.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-3 mt-2">
            <button className="p-2 rounded-full hover:bg-white/10 transition">
              <Facebook size={18} />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition">
              <Twitter size={18} />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition">
              <Instagram size={18} />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition">
              <Linkedin size={18} />
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <div className="text-white font-semibold mb-3">Product</div>
            <ul className="space-y-2">
              <li className="hover:text-emerald-400 cursor-pointer transition">
                Features
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition">
                Docs
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition">
                Changelog
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition">
                Status
              </li>
            </ul>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">Company</div>
            <ul className="space-y-2">
              <li className="hover:text-emerald-400 cursor-pointer transition">
                About
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition">
                Careers
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition">
                Contact
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="md:text-right text-sm text-neutral-500 flex flex-col justify-between">
          <span>© {new Date().getFullYear()} Scanventory Inc.</span>
          <span className="mt-2 text-neutral-400">
            All rights reserved. Made with Synapse 5❤️
          </span>
        </div>
      </div>
    </footer>
  );
}
