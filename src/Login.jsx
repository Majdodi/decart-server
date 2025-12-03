// ✅ src/Login.jsx (MATCHING SIGNUP STYLE)
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { useTranslation } from "react-i18next";
import api from "./api";
import toast from "react-hot-toast";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      login(data.user, data.token, remember);
     toast.success("Login Successful");

      navigate(data.user.role === "admin" ? "/admin" : from, { replace: true });

    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed. Please try again.";
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <h2 className="text-center text-2xl font-semibold mb-10 text-[]">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">

          <input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[] p-3 border border-[] rounded text-[] focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[] p-3 border border-[] rounded text-[] focus:outline-none"
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="mr-2 accent-[]"
            />
            <label className="text-sm text-[]">Remember me</label>
          </div>

          <button type="submit" className="btn-brown-full">
  Log in
</button>


          <div className="flex justify-between text-sm text-[] pt-2">
            <Link to="/forgot-password" className="hover:underline">
              Lost your password?
            </Link>
            <Link to="/signup" className="hover:underline">
              Sign Up ➤
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
