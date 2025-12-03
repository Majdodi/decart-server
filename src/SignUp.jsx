// src/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import axios from "axios";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();
  const { cartItems, setCartItems, setUserId } = useCart();

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("🚀 SUBMIT REGISTER");
  console.log("📩 Sending:", { name, email, password });

  try {
    const res = await fetch("https://decart-server.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    console.log("📥 RAW RESPONSE OBJECT:", res);

    const data = await res.json();

    console.log("🔍 REGISTER RESPONSE JSON:", data);

    // ===========================================================
    //  🔥 Debug مهم جداً: هل التوكن فعلاً موجود؟
    // ===========================================================
    console.log("🧪 data.success =", data.success);
    console.log("🧪 data.user =", data.user);
    console.log("🧪 data.token =", data.token);

    if (!data.success) {
      console.log("❌ SERVER REJECTED:", data.error);
      return alert(data.error || "Registration failed");
    }

    if (!data.token) {
      console.log("🔥 ERROR: Backend did NOT return token!");
      return alert("Server error: Token missing");
    }

    // 🔐 حفظ التوكن
    localStorage.setItem("token", data.token);
    console.log("📝 Token saved:", data.token);

    // تسجيل الدخول
    login({
      _id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      token: data.token,
    });

    localStorage.setItem("userId", data.user._id);

    console.log("✅ LOGIN DONE");

    alert("Registered successfully");
    navigate("/");

  } catch (err) {
    console.error("❌ Register Error:", err);
    alert("Server error");
  }
};




  return (
    <div className="min-h-screen bg-[] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <h2 className="text-center text-2xl font-semibold mb-10 text-[]">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[] text-[] p-3 border border-[] rounded focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[] text-[] p-3 border border-[] rounded focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[] text-[] p-3 border border-[] rounded focus:outline-none"
          />

          <button type="submit" className="btn-brown-full">
  Sign Up
</button>


          <div className="flex justify-between text-sm text-[] pt-2">
            <Link to="/login" className="hover:underline">
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
