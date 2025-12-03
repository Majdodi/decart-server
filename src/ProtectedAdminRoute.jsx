// src/ProtectedAdminRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedAdminRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{textAlign:'center', marginTop:50}}>Loading...</div>;

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // ← هذا هو الأسلوب القياسي مع الراوت المتداخل
}
