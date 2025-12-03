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

    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (!data.success) {
        return alert(data.error || "Registration failed");
      }

      // حفظ التوكن
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);

      // تسجيل الدخول
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

      alert("Registered successfully");
      navigate("/");

    } catch (err) {
      console.error("❌ Register Error:", err);
      alert(err?.response?.data?.error || "Server error");
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
