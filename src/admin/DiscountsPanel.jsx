import React, { useEffect, useState } from "react";
import api from "../api";

export default function DiscountsPanel() {
  const [discounts, setDiscounts] = useState([]);
  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: 10,
    minOrderAmount: 0,
    expiryDate: "",
    usageLimit: 1,
    isActive: true,
  });
useEffect(() => {
  console.log("➡️ TRY FETCH DISCOUNTS…");

  api.get("/admin/discounts")
    .then((res) => {
      console.log("✅ DISCOUNTS RESPONSE:", res.data);
      setDiscounts(res.data);
    })
    .catch((err) => {
      console.log("❌ FETCH ERROR:", err);
      console.log("❌ ERROR RESPONSE:", err.response);
    });
}, []);




const createDiscount = async () => {
  try {
    console.log("📤 Creating discount:", form);

    const res = await api.post("/admin/discounts", form);

    console.log("✅ CREATED:", res.data.discount);

    alert("✔️ تم إنشاء الكوبون بنجاح");

    setDiscounts([res.data.discount, ...discounts]);
  } catch (error) {
    console.log("❌ ERROR CREATING:", error);
    alert(`حدث خطأ أثناء إنشاء الكوبون: ${error.response?.data?.error || ""}`);
  }
};



  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4 font-bold">إدارة أكواد الخصم</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">إضافة كوبون جديد</h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="p-2 border rounded"
            placeholder="CODE"
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />

          <select
            className="p-2 border rounded"
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="percentage">نسبة %</option>
            <option value="fixed">قيمة ثابتة</option>
          </select>

          <input
            type="number"
            className="p-2 border rounded"
            placeholder="القيمة"
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />

          <input
            type="number"
            className="p-2 border rounded"
            placeholder="الحد الأدنى للطلب"
            onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
          />

          <input
            type="date"
            className="p-2 border rounded"
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
          />

          <input
            type="number"
            className="p-2 border rounded"
            placeholder="عدد مرات الاستخدام"
            onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
          />
        </div>

        <button
          className="mt-4 bg-blue-600 text-white py-2 px-6 rounded"
          onClick={createDiscount}
        >
          إضافة كوبون
        </button>
      </div>

      {/* قائمة الكوبونات */}
      <h2 className="text-xl font-semibold mb-2">جميع الأكواد</h2>
      <table className="w-full text-right bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">الكود</th>
            <th>النوع</th>
            <th>القيمة</th>
            <th>الحد الأدنى</th>
            <th>الاستخدام</th>
            <th>فعال؟</th>
          </tr>
        </thead>

        <tbody>
          {discounts.map((d) => (
            <tr key={d._id} className="border-b">
              <td className="p-3">{d.code}</td>
              <td>{d.type}</td>
              <td>{d.value}</td>
              <td>{d.minOrderAmount}</td>
              <td>
                {d.usedCount}/{d.usageLimit}
              </td>
              <td>{d.isActive ? "✔️" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
