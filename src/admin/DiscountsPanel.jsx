import React, { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

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
  api.get("/admin/discounts")
    .then((res) => {
      setDiscounts(res.data);
    })
    .catch(() => {});
}, []);




const createDiscount = async () => {
  try {
    const res = await api.post("/admin/discounts", form);

    toast.success("تم إنشاء الكوبون بنجاح.");

    setDiscounts([res.data.discount, ...discounts]);
  } catch (error) {
    toast.error(error.response?.data?.error || "تعذر إنشاء الكوبون. يرجى المحاولة مرة أخرى.");
  }
};


const [editing, setEditing] = useState(null);
useEffect(() => {
  if (editing) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [editing]);


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
className="mt-4 bg-[#594539] hover:bg-[#4a372e] text-white py-2 px-6 rounded"
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
      <th>تاريخ الانتهاء</th>
      <th>فعال؟</th>
      <th>تعديل</th>
    </tr>
  </thead>

  <tbody>
    {discounts.map((d) => (
      <tr key={d._id} className="border-b hover:bg-gray-50">
        <td className="p-3">{d.code}</td>
        <td>{d.type}</td>
        <td>{d.value}</td>
        <td>{d.minOrderAmount}</td>
        <td>
          {d.usedCount}/{d.usageLimit}
        </td>
        <td>
          {d.expiryDate
            ? new Date(d.expiryDate).toLocaleDateString("en-GB")
            : "—"}
        </td>
        <td className="text-center">
          {d.isActive ? "✔️" : "❌"}
        </td>
        <td>
          <button
            className="text-[#594539] hover:underline"
            onClick={() => setEditing(d)}
          >
            تعديل
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>



{editing && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white w-full max-w-xl rounded-lg p-6 relative">

      <h2 className="text-xl font-bold mb-4">تعديل كود الخصم</h2>

      <div className="grid grid-cols-2 gap-4">

        <input
          className="p-2 border rounded"
          value={editing.code}
          onChange={e => setEditing({ ...editing, code: e.target.value })}
          placeholder="CODE"
        />

        <select
          className="p-2 border rounded"
          value={editing.type}
          onChange={e => setEditing({ ...editing, type: e.target.value })}
        >
          <option value="percentage">نسبة %</option>
          <option value="fixed">قيمة ثابتة</option>
        </select>

        <input
          type="number"
          className="p-2 border rounded"
          value={editing.value}
          onChange={e => setEditing({ ...editing, value: e.target.value })}
          placeholder="القيمة"
        />

        <input
          type="number"
          className="p-2 border rounded"
          value={editing.minOrderAmount}
          onChange={e =>
            setEditing({ ...editing, minOrderAmount: e.target.value })
          }
          placeholder="الحد الأدنى"
        />

        <input
          type="date"
          className="p-2 border rounded"
          value={editing.expiryDate?.slice(0, 10) || ""}
          onChange={e =>
            setEditing({ ...editing, expiryDate: e.target.value })
          }
        />

        <input
          type="number"
          className="p-2 border rounded"
          value={editing.usageLimit}
          onChange={e =>
            setEditing({ ...editing, usageLimit: e.target.value })
          }
          placeholder="عدد مرات الاستخدام"
        />

        <label className="col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={editing.isActive}
            onChange={e =>
              setEditing({ ...editing, isActive: e.target.checked })
            }
          />
          الكود فعال
        </label>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
className="bg-[#9c8b7e] hover:bg-[#857468] text-white px-4 py-2 rounded"
          onClick={() => setEditing(null)}
        >
          إلغاء
        </button>

        <button
className="bg-[#594539] hover:bg-[#4a372e] text-white px-4 py-2 rounded"
          onClick={async () => {
            await api.put(`/admin/discounts/${editing._id}`, editing);

            const res = await api.get("/admin/discounts");
            setDiscounts(res.data);
            setEditing(null);
          }}
        >
          حفظ التعديلات
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  );
}
