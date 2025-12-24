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

// ✅ القيم الصحيحة من السيرفر
const subtotal = order.subtotal || 0;
const shipping = order.shippingFee || 0;
const discount = order.discount;
const total = order.totalAmount || 0;



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
      <span>{it.name} × {it.quantity}</span>
<span>{fmt(it.price * it.quantity)}</span>

    </div>
  ))}

<div className="mt-4 text-right text-sm space-y-1">
  <p>
    Subtotal: <span className="font-medium">{fmt(subtotal)}</span>
  </p>

{discount?.amount > 0 && (
  <p className="text-red-600">
    Discount ({discount.code}
    {discount.type === "percentage" && ` - ${discount.value}%`}
    ): -{fmt(discount.amount)}
  </p>
)}



  <p>
    Shipping: <span className="font-medium">{fmt(shipping)}</span>
  </p>

  <p className="text-lg font-bold border-t pt-2">
    Total: {fmt(total)}
  </p>
</div>


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
