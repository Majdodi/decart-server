// ✅ CartContext DEBUG FULL LOG VERSION
import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import api from "./api";
import { useAuth } from "./AuthContext";
import fixImage from "./utils/fixImage";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const firstLoad = useRef(true);

  console.log("👁️ CART PROVIDER RENDER — User:", user);

  // ✅ Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      console.log("📌 RAW localStorage:", saved);

      if (!saved || saved === "null") return;

      const parsed = JSON.parse(saved);
      console.log("📌 parsed localStorage:", parsed);

      if (Array.isArray(parsed)) {
        // ✅ Normalize images when loading from localStorage
        const normalized = parsed.map(item => ({
          ...item,
    images: Array.isArray(item.images)
  ? item.images.map(x => fixImage(x))
  : typeof item.images === "string"
  ? [fixImage(item.images)]
  : [fixImage(item.image)]

        }));
parsed.forEach(item => {
  console.log("🟨 NORMALIZED LOCALSTORAGE ITEM =", {
    id: item._id,
    raw: item.images,
  });
});


        console.log("📥 SET CART from LS:", normalized);
        setCartItems(normalized);
      }
    } catch (err) {
      console.error("❌ LocalStorage parse error:", err);
    }
  }, []);

  // ✅ Save to LocalStorage (after first load)
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    console.log("💾 Saving cart → LS:", cartItems);
    if (!user?._id) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // ✅ Sync with server on login
  useEffect(() => {
    if (!user?._id) return;

    const syncCart = async () => {
      console.log("🔄 SYNC START — user logged:", user._id);

      try {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        console.log("⬆️ LOCAL CART → SERVER:", localCart);

        for (const item of localCart) {
          if (!item._id) {
            console.warn("⚠️ SKIPPED — Missing ID:", item);
            continue;
          }
          if (!item.qty || item.qty < 1) {
            console.warn("⚠️ SKIPPED — Invalid qty:", item);
            continue;
          }

          console.log("📡 POST → /cart/add | Data:", {
            userId: user._id,
            productId: item._id,
            qty: item.qty,
          });
          await api.post("/cart/add", {
            userId: user._id,
            productId: item._id,
            qty: item.qty,
          });
        }

        console.log("📥 Fetching final cart from server...");
        const res = await api.get(`/cart/${user._id}`);
        console.log("✅ SERVER CART:", res.data);

        const serverItems = (res.data?.items || []).map(item => ({
          ...item,
         images: Array.isArray(item.images)
  ? item.images.map(x => fixImage(x))
  : typeof item.images === "string"
  ? [fixImage(item.images)]
  : [fixImage(item.image)]

        }));
        
        setCartItems(serverItems);
        localStorage.setItem("cart", JSON.stringify(serverItems));

        console.log("✅ SYNC DONE ✅");
        // ✅ Clear local copy after syncing to avoid duplicate syncing
        localStorage.removeItem("cart");
        sessionStorage.removeItem("cart");
        setCartItems(serverItems);
        localStorage.removeItem("cart");

      } catch (err) {
        console.error("❌ SYNC ERROR:", err);
      }
    };

    syncCart();
  }, [user?._id]);

  // ✅ Add item
const addToCart = async (product, qty = 1) => {
  console.log("➕ ADD:", product, "Qty:", qty);

  if (!product?._id) {
    console.error("❌ Cannot add product — Missing _id:", product);
    alert("Product missing ID, Backend issue!");
    return;
  }

  const normalizedProduct = {
    ...product,
    images: Array.isArray(product.images)
      ? product.images.map(x => fixImage(x))
      : typeof product.images === "string"
      ? [fixImage(product.images)]
      : []
  };

  setCartItems(prev => {
    const exists = prev.find(p => p._id === normalizedProduct._id);
    const updated = exists
      ? prev.map(p => p._id === normalizedProduct._id ? { ...p, qty: p.qty + qty } : p)
      : [...prev, { ...normalizedProduct, qty }];

    console.log("📝 CART AFTER ADD:", updated);
    return updated;
  });

  if (user?._id) {
    try {
      await api.post("/cart/add", {
        userId: user._id,
        productId: normalizedProduct._id,
        qty,
      });
    } catch (err) {
      console.error("❌ ADD API ERROR:", err);
    }
  }
};


  // ✅ Update Qty
  const updateQty = async (productId, newQty) => {
    setCartItems(prev =>
      prev.map(p =>
        p._id === productId ? { ...p, qty: newQty } : p
      )
    );

    if (user?._id) {
      try {
        await api.put(`/cart/update`, {
          userId: user._id,
          productId,
          qty: newQty,
        });
      } catch (err) {
        console.error("❌ UPDATE API ERROR:", err);
      }
    }
  };

  // ✅ Remove Item
  const removeFromCart = async (productId) => {
    setCartItems(prev => prev.filter(p => p._id !== productId));

    if (user?._id) {
      try {
        await api.delete(`/cart/remove/${user._id}/${productId}`);
      } catch (err) {
        console.error("❌ REMOVE API ERROR:", err);
      }
    }
  };

  // ✅ Clear Cart (Used after order success)
const clearCart = () => {
  setCartItems([]);
  localStorage.removeItem("cart");
  sessionStorage.removeItem("cart");
  console.log("🗑️ CART CLEARED!");
};

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQty,
      removeFromCart,
       clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}