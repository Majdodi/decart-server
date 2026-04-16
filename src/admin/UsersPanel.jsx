// src/admin/UsersPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";
import { useConfirm } from "../contexts/ConfirmContext";

export default function UsersPanel() {
  const { showConfirm } = useConfirm();
  const [users, setUsers] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    api
      .get("/admin/user")
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, [token]);

  const changeRole = (id, role) => {
    api
      .put(`/admin/user/${id}/role`, { role })
      .then(() =>
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role } : u))
        )
      )
      .catch(console.error);
  };

  const deleteUser = (id) => {
    showConfirm({
      title: "Delete User",
      message: "Are you sure you want to delete this user? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => {
        api
          .delete(`/admin/user/${id}`)
          .then(() => setUsers((prev) => prev.filter((u) => u._id !== id)))
          .catch(console.error);
      },
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-[] mb-4">Users</h2>
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full">
          <thead className="bg-[] text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">
                  <select
                    defaultValue={u.role}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    className="border p-1 mr-2"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


