// src/admin/MessagesPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function MessagesPanel() {
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    api.get("/admin/messages").then(res => setMsgs(res.data)).catch(console.error);
  }, []);

  const archive = (id) => {
    api.put(`/admin/messages/${id}/archive`)
      .then(() => setMsgs(prev => prev.filter(m => m._id !== id)))
      .catch(console.error);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-[] mb-4">Messages</h2>
      <div className="bg-white rounded shadow p-4">
        {msgs.map(m => (
          <div key={m._id} className="border-b py-3">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">
                  {m.name} <span className="text-xs text-gray-500">({m.email})</span>
                </div>
                <div className="text-sm text-gray-700">{m.subject}</div>
              </div>
              <div className="text-sm text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
            </div>
            <div className="mt-2 text-gray-600">{m.message}</div>
            <div className="mt-2">
              <button
                onClick={() => archive(m._id)}
                className="px-3 py-1 bg-[] text-white rounded"
              >
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

