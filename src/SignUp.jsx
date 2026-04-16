// src/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import api from "./api";
import toast from "react-hot-toast";

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
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const data = res.data;

      if (!data.success) {
        toast.error(data.error || "Registration could not be completed. Please try again.");
        return;
      }

      if (!data.token) {
        toast.error("A technical error occurred. Please try again later.");
        return;
      }

      localStorage.setItem("token", data.token);

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

      localStorage.setItem("userId", data.user._id);

      toast.success("Your account has been created successfully.");
      navigate("/");

    } catch (err) {
      toast.error(err?.response?.data?.error || "A technical error occurred. Please try again.");
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
