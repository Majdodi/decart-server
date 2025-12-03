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

  try {
    const res = await fetch("https://decart-server.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    console.log("🔍 REGISTER RESPONSE:", data);

    // ----------------------------
    //  🔥 الشرط الصحيح
    // ----------------------------
    if (res.ok && data.success && data.user) {

      // حفظ التوكن
      localStorage.setItem("token", data.token);

      // تسجيل الدخول في AuthContext
      login({
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        token: data.token
      });

      // حفظ userId لمنظومة السلة
      localStorage.setItem("userId", data.user._id);
      setUserId(data.user._id);

      // لو في سلة محلية → نرفعها للسيرفر
      if (cartItems.length > 0) {
        for (const item of cartItems) {
          await axios.post("https://decart-server.onrender.com/api/cart/add", {
            userId: data.user._id,
            productId: item._id || item.id,
            qty: item.qty,
          });
        }

        localStorage.removeItem("cart");
        setCartItems([]);
      }

      alert("Registered successfully");
      navigate("/");

    } else {
      alert(data.error || "Registration failed");
    }
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
