// ✅ src/OrderSuccess.jsx
import { useNavigate } from "react-router-dom";
import { saveOrder } from "./OrdersLocal";
import { useCart } from "./CartContext";
import React, { useEffect } from "react";

export default function OrderSuccess() {
  const navigate = useNavigate();
const { cartItems, clearCart } = useCart();

  const orderId = Math.floor(100000 + Math.random() * 900000);

  // حفظ الطلب للضيوف فقط
useEffect(() => {
  // 🧹 حذف السلة
  if (clearCart) clearCart();

  // 📝 حفظ الطلب للضيف فقط
  saveOrder({
    id: orderId,
    items: cartItems,
    date: new Date().toISOString(),
    total: cartItems.reduce((sum, i) => sum + i.price * i.qty, 0),
    status: "Delivered",
  });
}, []);



  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#F5E5D3] px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md w-full border border-[#594539]/20">
        
        <h1 className="text-3xl font-bold text-[#594539] mb-4">
          🎉 تم إتمام طلبك بنجاح!
        </h1>

        <p className="text-[#594539] font-semibold text-lg mb-6">
          رقم الطلب: <span className="font-bold">#{orderId}</span>
        </p>

        <button
          onClick={() => navigate("/orders")}
          className="mt-4 px-6 py-3 w-full rounded-lg font-semibold 
                     bg-[#594539] text-white hover:bg-[#46362d] transition"
        >
          عرض طلباتي
        </button>

        <button
          onClick={() => navigate("/shop")}
          className="mt-3 px-6 py-3 w-full rounded-lg font-semibold 
                     border border-[#594539] text-[#594539] 
                     hover:bg-[#594539]/10 transition"
        >
          متابعة التسوق
        </button>

      </div>
    </div>
  );
}
