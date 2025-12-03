import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[] text-[]">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "block" : "hidden md:flex"
        } w-full md:w-64 bg-[] border-r border-[] flex flex-col`}
      >
        <div className="p-6 text-2xl font-bold">Decart Admin</div>
        <nav className="flex-1 px-4 space-y-2">
          {[
            ["dashboard", "Dashboard"],
            ["products", "Products"],
            ["users", "Users"],
            ["orders", "Orders"],
            ["settings", "Settings"],
            ["discounts", "Discounts"],
          ].map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className="block px-3 py-2 rounded-lg hover:bg-[] transition"
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between bg-[] p-4 shadow-sm">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Main content */}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 p-6 md:p-10"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
