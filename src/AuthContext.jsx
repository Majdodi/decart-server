// ✅ src/AuthContext.jsx (FINAL FIXED ✅)
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Helper لضمان وجود _id دائمًا
  const normalizeUser = (u) => {
    if (!u) return null;
    return {
      ...u,
      _id: u._id || u.id, // ✅ توحيد الـ ID بأي اسم يجي من السيرفر
    };
  };

  // ✅ Load stored user (local/session)
useEffect(() => {
  try {
    const rawUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      const normalized = normalizeUser(parsed);
      setUser(normalized);
      console.log("🔄 Loaded stored user:", normalized);
    }

    if (storedToken) {
      console.log("🔑 Loaded stored token:", storedToken);
    }
  } catch (err) {
    console.error("❌ Failed to parse stored user:", err);
  }

  setLoading(false);
}, []);


  // ✅ Login
const login = (userData, token, remember = false) => {
  console.log("✅ Login user:", userData);

  setUser(userData);

  if (remember) {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  } else {
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", token);
  }

  console.log("📝 Token saved:", token);
};


  // ✅ Logout
  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    console.log("🚪 User logged out ✅");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
