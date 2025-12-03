// src/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import api from "./api";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

const fmt = v =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(v);

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [mode, setMode] = useState("guest"); // "guest" | "user"

  useEffect(() => {
    const load = async () => {
      if (user && user._id) {
        // ✅ مستخدم مسجّل دخول: اجلب من السيرفر
        setMode("user");
        try {
          const res = await api.get(`/orders/user/${user._id}`);
          setOrders(res.data || []);
        } catch (e) {
          setOrders([]);
        }
      } else {
        // ✅ ضيف: اجلب من localStorage
        setMode("guest");
        try {
          const list = JSON.parse(localStorage.getItem("guestOrders") || "[]");
          setOrders(Array.isArray(list) ? list : []);
        } catch {
          setOrders([]);
        }
      }
    };
    load();
  }, [user]);

  if (!user && orders.length === 0) {
    return (
      <div className="min-h-screen bg-[] p-6">
        <h1 className="text-3xl text-center text-[] font-bold mb-6">My Orders</h1>
        <p className="text-center text-[]">
          لا توجد طلبات بعد. <Link to="/shop" className="text-blue-600 underline">تسوّق الآن</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[] p-6">
      <h1 className="text-3xl text-center text-[] font-bold mb-10">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-lg text-[]">No previous orders found.</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {orders.map((order, idx) => {
            const idShort =
              (order._id && String(order._id).slice(-6)) ||
              (order.id && String(order.id).slice(-6)) ||
              String(idx + 1).padStart(6, "0");

            const created =
              order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : new Date().toLocaleString();

            const items = order.items || order.cartItems || [];

          // 🟤 Subtotal (سعر المنتجات فقط)
const subtotal = items.reduce(
  (s, it) => s + (Number(it.price) || 0) * (it.qty || 1),
  0
);

// 🟤 Shipping – من الطلب نفسه
const shipping = order.shippingFee || 0;

// 🟤 Final total
const finalTotal = subtotal + shipping;


            return (
<div
  key={order._id || order.id || idx}
  className="bg-white border p-5 rounded-xl shadow text-[#594539]"
>
  <div className="flex justify-between mb-3">
    <p className="font-bold text-[#594539]">Order #{idShort}</p>
    <p className="text-sm text-[#594539]">{created}</p>
  </div>

  {items.map((it, i) => (
    <div
      key={i}
      className="flex justify-between py-1 border-b text-[#594539]"
    >
      <span>{it.name} × {it.qty || 1}</span>
      <span>{fmt((Number(it.price) || 0) * (it.qty || 1))}</span>
    </div>
  ))}

  <p className="mt-3 text-right text-lg font-bold text-[#594539]">
    Total: {fmt(finalTotal)}
  </p>

  <div className="text-right font-semibold text-[#594539]">
    {order.status || "Delivered Successfully"}
  </div>
</div>

            );
          })}
        </div>
      )}
    </div>
  );
}
