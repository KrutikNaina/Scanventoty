// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import LiveDemo from "./components/LiveDemo";
import KPIBar from "./components/KPIBar";
import Footer from "./components/Footer";

import Login from "./components/Login";
import Layout from "./components/layout"; // 👈 import Layout
import Dashboard from "./components/pages/Dashboard";
import InventoryPage from "./components/inventory/InventoryPage";
import Orders from "./components/pages/Orders";
import AdminSettings from "./components/pages/AdminSettings";
import SalesReport from "./components/pages/SalesReport";
import AdminPanel from "./components/pages/AdminPanel";
import AddItem from "./components/inventory/AddItem";
import Manageuser from "./components/inventory/Manageuser";
import SystemSetting from "./components/inventory/SystemSetting";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-950 text-white">
        <Routes>
          {/* Public Landing Page */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Hero />
                <Features />
                <HowItWorks />
                <LiveDemo />
                <KPIBar />
                <Footer />
              </>
            }
          />

          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Protected / Internal Pages with Layout */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/inventory"
            element={
              <Layout>
                <InventoryPage />
              </Layout>
            }
          />
          <Route
            path="/orders"
            element={
              <Layout>
                <Orders />
              </Layout>
            }
          />
          <Route
            path="/SalesReport"
            element={
              <Layout>
                <SalesReport />
              </Layout>
            }
          />
          <Route
            path="/admin-panel"
            element={
              <Layout>
                <AdminPanel />
              </Layout>
            }
          />
          <Route
            path="/add-item"
            element={
              <Layout>
                <AddItem />
              </Layout>
            }
          />
          <Route
            path="/manage-users"
            element={
              <Layout>
                <Manageuser />
              </Layout>
            }
          /> <Route
            path="/settings"
            element={
              <Layout>
                <SystemSetting />
              </Layout>
            }
          />

        </Routes>
      </div>
    </BrowserRouter>
  );
}
