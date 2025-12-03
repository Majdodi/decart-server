// src/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * PrivateRoute Component
 * - يحمي المسارات التي تتطلب تسجيل دخول
 * - يدعم خيار adminOnly للتأكد من أن المستخدم إدمن
 */
export default function PrivateRoute({ adminOnly = false }) {
  const { user } = useAuth();
  const location = useLocation();

  // إذا لم يكن المستخدم مسجل دخول
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }} // يرجعه لنفس الصفحة بعد تسجيل الدخول
        replace
      />
    );
  }

  // إذا المسار مخصص للإدمن فقط والمستخدم ليس إدمن
  if (adminOnly && user.role?.toLowerCase() !== "admin") {
    return <Navigate to="/unauthorized" replace />; 
    // يفضل تعمل صفحة Unauthorized بدل ما ترجع للـ /
  }

  // إذا كل شيء تمام
  return <Outlet />;
}
