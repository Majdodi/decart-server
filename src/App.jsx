// src/App.jsx
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { useCart } from "./CartContext.jsx";
import { FaBars, FaTimes } from "react-icons/fa";
import ChatButton from "./ChatButton.jsx";
import CookieConsent from "react-cookie-consent";
import Footer from "./footer.jsx";
import { Toaster } from "react-hot-toast";
import LanguageSwitcher from "./LanguageSwitcher";

export default function App() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + (item.qty || 0), 0);
  

  const { user } = useAuth();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasGuestOrders, setHasGuestOrders] = useState(false); // ✅ جديد
  const isHome = location.pathname === "/";

  // ✅ افحص وجود طلبات ضيف في localStorage لتفعيل رابط Orders
  useEffect(() => {
    const checkGuestOrders = () => {
      try {
        const list = JSON.parse(localStorage.getItem("guestOrders") || "[]");
        setHasGuestOrders(Array.isArray(list) && list.length > 0);
      } catch {
        setHasGuestOrders(false);
      }
    };

    checkGuestOrders();
    // نسمع لأي تحديث مخصص من Checkout + تغيّر المسار
    const onCustom = () => checkGuestOrders();
    window.addEventListener("guest-orders-updated", onCustom);
    // ملاحظة: حدث storage لا يعمل بنفس التبويب دائماً، بس نضيفه احتياطياً
    window.addEventListener("storage", onCustom);

    return () => {
      window.removeEventListener("guest-orders-updated", onCustom);
      window.removeEventListener("storage", onCustom);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (isHome) {
      setScrolled(window.scrollY > 50);
      const handleScroll = () => setScrolled(window.scrollY > 50);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setScrolled(true);
    }
  }, [isHome]);


  // تغيير الثيم بناءً على المسار
useEffect(() => {
  if (location.pathname.startsWith("/admin")) {
    document.body.classList.add("admin-bg");
    document.body.classList.remove("site-bg");
  } else {
    document.body.classList.add("site-bg");
    document.body.classList.remove("admin-bg");
  }
}, [location.pathname]);


  return (
    
    <div className="min-h-screen bg-siteBg text-siteText">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-siteBg shadow" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center relative">
          {/* الشعار */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/images/logo.png" alt="Decart Logo" className="w-8 h-8 object-contain" />
            <span
              className="text-2xl font-serif font-semibold text-[] tracking-wide"
              style={{ letterSpacing: "1px" }}
            >
              DECÀRT
            </span>
          </Link>

          {/* روابط اللابتوب */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-siteText hover:text-sitePrice transition">Home</Link>
            <Link to="/shop" className="text-siteText hover:text-sitePrice transition">Shop</Link>

            <Link to="/cart" className="relative text-siteText hover:text-sitePrice transition">
              Cart
              {totalItems > 0 && (
      <span
  className="
    absolute -top-2 -right-3 bg-siteText text-siteBg 
    text-[11px] w-4 h-4 rounded-full flex items-center justify-center
    md:text-[10px] md:w-4.5 md:h-4.5
  "
>
  {totalItems}
</span>



              )}
            </Link>

            {/* ✅ يظهر إذا المستخدم مسجل دخول أو في طلبات ضيف */}
            {(user || hasGuestOrders) && (
              <Link to="/orders" className="text-siteText hover:text-sitePrice transition">
                Orders
              </Link>
            )}

            {user ? (
              <>
                {user?.role === "admin" && (
                  <Link to="/admin" className="text-siteText hover:text-sitePrice transition">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="text-siteText hover:text-sitePrice transition">
                  Profile
                </Link>
              </>
            ) : (
              <Link to="/login" className="text-siteText hover:text-sitePrice transition">
                Login
              </Link>
            )}
              <LanguageSwitcher />

          </div>
          {/* زر القائمة للهاتف + رقم السلة */}
          <div className="relative md:hidden">
       <button
  className="text-siteText text-2xl focus:outline-none z-50"
  onClick={() => setMenuOpen(true)}
>
  <FaBars />
</button>


            {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-siteText text-siteBg text-xs w-5 h-5 rounded-full flex items-center justify-center">
  {totalItems}
</span>

            )}
          </div>
        </div>

        {/* خلفية غباش عند فتح القائمة */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* القائمة الجانبية من اليمين */}
       <div
  className={`md:hidden fixed top-0 right-0 h-full w-3/4 bg-siteBg text-siteText shadow-xl z-40 transform transition-transform duration-300 ease-out ${
    menuOpen ? "translate-x-0" : "translate-x-full"
  }`}
>

<div className="flex flex-col p-6 space-y-6 text-siteText">
           <button
  className="self-end text-siteText text-2xl mb-4"
  onClick={() => setMenuOpen(false)}
>
  <FaTimes />
</button>


            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>

            <div className="relative inline-block">
              <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-siteText text-siteBg text-xs w-5 h-5 rounded-full flex items-center justify-center">
  {totalItems}
</span>

              )}
            </div>

            {(user || hasGuestOrders) && (
              <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
            )}

            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    to="/admin/products"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            )}
    <LanguageSwitcher />
 
          </div>
        </div>
      </nav>


      {/* المحتوى */}
      <main className={`${isHome ? "" : "pt-20"}`}>
        <Outlet />
      </main>

      {/* زر المحادثة والكوكيز */}
      <ChatButton />
      {location.pathname !== "/checkout" && <Footer />}

      <Toaster
  position="top-right"
  toastOptions={{
    style: {
      background: "",
      color: "",
      borderRadius: "10px",
      padding: "12px 16px",
      fontSize: "14px"
    },
    success: { duration: 2500 },
    error: { duration: 3000 },
  }}
/>

    </div>
  );
}


