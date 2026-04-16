// src/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
const token =
  localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
          setErrorMsg("No auth token found. Please login.");
          logout?.();
          navigate("/login", { replace: true });
          return;
        }

        // ✅ الطلب الصحيح باستخدام api.js (بدون axios)
const res = await api.get("/admin/stats", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

        setStats(res.data || {});
      } catch (err) {
        const status = err?.response?.status;

        if (status === 401 || status === 403) {
          setErrorMsg("Session expired. Please login again.");
          logout?.();
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        } else {
          const serverMsg = err?.response?.data?.message;
          setErrorMsg(serverMsg || "Failed to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [logout, navigate]);

  if (loading) {
    return <p className="text-center mt-20 text-neutral-500">Loading dashboard...</p>;
  }

  if (errorMsg) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-600 mb-4">{errorMsg}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!stats) {
    return <p className="text-center mt-20 text-neutral-500">No dashboard data available.</p>;
  }

  // ✅ التعامل الآمن مع القيم
  const totalUsers = stats.totalUsers ?? stats.usersCount ?? 0;
  const totalOrders = stats.totalOrders ?? stats.ordersCount ?? 0;
  const revenue =
    typeof stats.revenue === "number" ? stats.revenue : stats.revenue30d ?? 0;
  const topProduct = stats.topProduct?.name ?? stats.topProduct ?? "—";
  const recentOrders = Array.isArray(stats.recentOrders) ? stats.recentOrders : [];
  const topProducts = Array.isArray(stats.topProducts) ? stats.topProducts : [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-neutral-800 mb-6">Admin Dashboard</h1>

      {/* 🔹 الإحصائيات العلوية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard title="Revenue (30d)" value={`${revenue.toFixed(2)} ₪`} />
        <StatCard title="Top Product" value={topProduct} />
      </div>

      {/* 🔹 الطلبات الأخيرة وأفضل المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Recent Orders"
          items={recentOrders}
          renderItem={(order) => (
            <li
              key={order._id || order.id}
              className="flex justify-between border-b border-neutral-100 pb-2"
            >
              <span className="truncate w-2/3">
                {order.orderNumber ?? order._id ?? "—"} —{" "}
                {order.customerInfo?.name ?? order.customer ?? "—"}
              </span>
              <span className="text-sm text-neutral-500">
                {order.status ?? "—"}
              </span>
            </li>
          )}
        />

        <Card
          title="Top Products"
          items={topProducts}
          renderItem={(p, idx) => (
            <li
              key={p._id ?? p.name ?? idx}
              className="flex justify-between border-b border-neutral-100 pb-2"
            >
              <span className="truncate w-2/3">{p.name ?? "—"}</span>
              <span className="text-sm text-neutral-500">
                {p.sales ?? p.count ?? "—"}
              </span>
            </li>
          )}
        />
      </div>
    </div>
  );
}

// ✅ بطاقة الإحصائيات
function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
      <p className="text-sm text-neutral-500">{title}</p>
      <p className="text-2xl font-semibold text-neutral-800 mt-2">{value}</p>
    </div>
  );
}

// ✅ مكون عام لقوائم (طلبات أو منتجات)
function Card({ title, items, renderItem }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
      <h2 className="font-semibold text-lg mb-4">{title}</h2>
      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="text-neutral-500">No {title.toLowerCase()}</li>
        ) : (
          items.map(renderItem)
        )}
      </ul>
    </div>
  );
}
