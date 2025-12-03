// src/admin/OrdersPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { token } = useAuth();

  // ✅ تحميل الطلبات
  useEffect(() => {
    api
      .get("/admin/orders")
      .then((res) => setOrders(res.data))
      .catch(console.error);
  }, [token]);

  // ✅ تحديث الحالة
  const updateStatus = (id, status) => {
    api
      .put(`/admin/orders/${id}/status`, { status })
      .then(() =>
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status } : o))
        )
      )
      .catch(console.error);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-[] mb-4">Orders</h2>
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full">
          <thead className="bg-[] text-white">
            <tr>
              <th className="p-3">Order#</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b">
                <td className="p-3">{o.orderNumber}</td>
                <td className="p-3">
                  {o.customerInfo?.name}
                  <div className="text-xs text-gray-500">
                    {o.customerInfo?.email}
                  </div>
                </td>
                <td className="p-3 font-semibold">{o.totalAmount} ₪</td>
                <td className="p-3 capitalize">{o.status}</td>
                <td className="p-3 flex gap-2 items-center">
                  <select
                    defaultValue={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="border p-1 text-sm"
                  >
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="text-blue-600 underline text-sm hover:text-blue-800"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ نافذة تفاصيل الطلب */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold mb-4 text-[]">
              Order Details
            </h3>

            {/* 🔹 بيانات العميل */}
            <div className="mb-4">
              <h4 className="font-semibold text-lg mb-2">Customer Info</h4>
              <p><strong>Name:</strong> {selectedOrder.customerInfo?.name}</p>
              <p><strong>Email:</strong> {selectedOrder.customerInfo?.email}</p>
              <p><strong>Phone:</strong> {selectedOrder.customerInfo?.phone}</p>
              <p><strong>Address:</strong> {selectedOrder.customerInfo?.address}</p>
              <p>
                <strong>City:</strong> {selectedOrder.customerInfo?.city},{" "}
                {selectedOrder.customerInfo?.country}
              </p>
              <p><strong>Postal Code:</strong> {selectedOrder.customerInfo?.postalCode}</p>
            </div>

            {/* 🔹 المنتجات */}
            <div className="mb-4">
              <h4 className="font-semibold text-lg mb-2">Items</h4>
              <table className="min-w-full border">
                <thead className="bg-[]">
                  <tr>
                    <th className="p-2 border">Image</th>
                    <th className="p-2 border">Product</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2 border">
                        <img
                          src={item.image}
alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
<td className="p-2 border">{item.name}</td>
                      <td className="p-2 border">{item.price} ₪</td>
                      <td className="p-2 border">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 🔹 ملخص الطلب */}
            <div className="mb-4">
              <h4 className="font-semibold text-lg mb-2">Summary</h4>
              <p><strong>Total:</strong> {selectedOrder.totalAmount} ₪</p>
              <p><strong>Shipping:</strong> {selectedOrder.shippingFee} ₪</p>
              <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>

            {/* 🔹 أزرار التحكم */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
