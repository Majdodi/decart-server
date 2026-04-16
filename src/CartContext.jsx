// ✅ CartContext DEBUG FULL LOG VERSION
import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import api from "./api";
import { useAuth } from "./AuthContext";
import fixImage from "./utils/fixImage";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const firstLoad = useRef(true);

  // ✅ Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");

      if (!saved || saved === "null") return;

      const parsed = JSON.parse(saved);

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
        setCartItems(normalized);
      }
    } catch {
    }
  }, []);

  // ✅ Save to LocalStorage (after first load)
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    if (!user?._id) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // ✅ Sync with server on login
  useEffect(() => {
    if (!user?._id) return;

    const syncCart = async () => {
      try {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];

        for (const item of localCart) {
          if (!item._id) {
            continue;
          }
          if (!item.qty || item.qty < 1) {
            continue;
          }

          await api.post("/cart/add", {
            userId: user._id,
            productId: item._id,
            qty: item.qty,
          });
        }

        const res = await api.get(`/cart/${user._id}`);

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
        // ✅ Clear local copy after syncing to avoid duplicate syncing
        localStorage.removeItem("cart");
        sessionStorage.removeItem("cart");
        setCartItems(serverItems);
        localStorage.removeItem("cart");

      } catch {}
    };

    syncCart();
  }, [user?._id]);

  // ✅ Add item
const addToCart = async (product, qty = 1) => {
  if (!product?._id) {
    toast.error("This item could not be added. Please try again later.");
    return;
  }

  const normalizedProduct = {
    ...product,
   name_ar: product.name_ar || product.product?.name_ar || product.name || "",
  name_en: product.name_en || product.product?.name_en || product.name || "",
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
    return updated;
  });

  if (user?._id) {
    try {
      await api.post("/cart/add", {
        userId: user._id,
        productId: normalizedProduct._id,
        qty,
      });
    } catch {}
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
      } catch {}
    }
  };

  // ✅ Remove Item
  const removeFromCart = async (productId) => {
    setCartItems(prev => prev.filter(p => p._id !== productId));

    if (user?._id) {
      try {
        await api.delete(`/cart/remove/${user._id}/${productId}`);
      } catch {}
    }
  };

  // ✅ Clear Cart (Used after order success)
const clearCart = () => {
  setCartItems([]);
  localStorage.removeItem("cart");
  sessionStorage.removeItem("cart");
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