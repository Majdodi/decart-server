// src/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import api from "./api";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();
  const { cartItems, setCartItems, setUserId } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("=====================================");
    console.log("🚀 SIGNUP SUBMIT");
    console.log("📤 Sending:", { name, email, password });
    console.log("=====================================");

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      console.log("📥 RAW REGISTER RESPONSE:", res);
      const data = res.data;

      console.log("🔍 PARSED RESPONSE:", data);
      console.log("🧪 data.success =", data.success);
      console.log("🧪 data.user =", data.user);
      console.log("🧪 data.token =", data.token);

      if (!data.success) {
        console.log("❌ ERROR from backend:", data.error);
        return alert(data.error || "Registration failed");
      }

      if (!data.token) {
        console.log("❌ ERROR: token is MISSING from backend!");
        return alert("Server error: token missing");
      }

      console.log("💾 Saving token...");
      localStorage.setItem("token", data.token);
      console.log("📝 Token saved:", localStorage.getItem("token"));

      console.log("🔐 Calling login() from AuthContext...");
      console.log("👤 User passed to login():", data.user);

      login(
        {
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        },
        data.token,
        true
      );

      console.log("✅ login() CALLED SUCCESSFULLY");

      localStorage.setItem("userId", data.user._id);
      console.log("💾 userId saved:", data.user._id);

      alert("Registered successfully");
      navigate("/");

    } catch (err) {
      console.log("🔥 ================================");
      console.log("❌ CATCH ERROR IN REGISTER");
      console.log("💥 err.response:", err.response);
      console.log("💥 err.message:", err.message);
      console.log("💥 FULL ERROR:", err);
      console.log("🔥 ================================");

      alert(err?.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <h2 className="text-center text-2xl font-semibold mb-10">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded"
          />

          <button type="submit" className="btn-brown-full">
            Sign Up
          </button>

          <div className="flex justify-between text-sm pt-2">
            <Link to="/login" className="hover:underline">
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
