import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import { AuthProvider } from "./AuthContext.jsx";
import { CartProvider } from "./CartContext.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import ProtectedAdminRoute from "./ProtectedAdminRoute.jsx";

import App from "./App.jsx";
import Home from "./Home.jsx";
import Shop from "./Shop.jsx";
import ProductDetails from "./ProductDetails.jsx";
import Cart from "./Cart.jsx";
import Checkout from "./Checkout.jsx";
import Profile from "./Profile.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import ResetPassword from "./ResetPassword.jsx";
import AdminProductsPage from "./AdminProductsPage.jsx";
import Unauthorized from "./Unauthorized.jsx";
import OrderSuccess from './OrderSuccess.jsx';
import OrdersPage from "./OrdersPage.jsx";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import ProductsPanel from "./admin/ProductsPanel";
import OrdersPanel from "./admin/OrdersPanel";
import UsersPanel from "./admin/UsersPanel";
import MessagesPanel from "./admin/MessagesPanel";
import SettingsPanel from "./admin/SettingsPanel";
import DiscountsPanel from "./admin/DiscountsPanel";
ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              {/* صفحات عامة */}
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success" element={<OrderSuccess />} />
<Route path="/orders" element={<OrdersPage />} />

              {/* تسجيل */}
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />

              {/* مستخدم */}
              <Route element={<PrivateRoute />}>
                <Route path="profile" element={<Profile />} />
              </Route>



{/* لوحة الأدمن الجديدة (الصحيح) */}
<Route path="admin" element={<ProtectedAdminRoute />}>
  <Route element={<AdminLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="products" element={<ProductsPanel />} />
    <Route path="orders" element={<OrdersPanel />} />
    <Route path="users" element={<UsersPanel />} />
    <Route path="messages" element={<MessagesPanel />} />
    <Route path="settings" element={<SettingsPanel />} />
<Route path="discounts" element={<DiscountsPanel />} />

  </Route>
</Route>




              {/* غير مصرح */}
              <Route path="unauthorized" element={<Unauthorized />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
);
