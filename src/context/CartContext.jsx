import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";
import "./Css/CartContext.css";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user, loading } = useAuth();
  const ownerId = user?._id || user?.id || "guest";
  const storageKey = `vew_cart:${ownerId}`;
  const [items, setItems] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const prevOwnerRef = useRef(null);

  // Sync / Load cart when auth state or user identity changes
  useEffect(() => {
    if (loading) return;

    const currentOwner = user?._id || user?.id || "guest";
    prevOwnerRef.current = currentOwner;

    if (user) {
      // 1. Check guest items that were added before logging in
      let guestItems = [];
      try {
        guestItems = JSON.parse(localStorage.getItem("vew_cart:guest") || "[]");
      } catch {}

      // 2. Check user's saved items in localStorage
      let localUserItems = [];
      try {
        localUserItems = JSON.parse(localStorage.getItem(`vew_cart:${currentOwner}`) || "[]");
      } catch {}

      // 3. User's cart from backend MongoDB
      const serverItems = Array.isArray(user.cart) ? user.cart : [];

      // Combine / prioritize: start with whichever has items (server or local)
      const baseItems = serverItems.length > 0 ? serverItems : localUserItems;

      // Merge guest items if any existed
      const mergedMap = new Map();
      baseItems.forEach((it) => {
        if (it && (it._id || it.product)) {
          const key = String(it._id || it.product);
          mergedMap.set(key, { ...it, _id: key });
        }
      });

      if (guestItems.length > 0) {
        guestItems.forEach((g) => {
          if (!g || !g._id) return;
          const key = String(g._id);
          if (mergedMap.has(key)) {
            const existing = mergedMap.get(key);
            mergedMap.set(key, { ...existing, quantity: (existing.quantity || 1) + (g.quantity || 1) });
          } else {
            mergedMap.set(key, { ...g });
          }
        });
        // Clear guest cart once merged into user account
        localStorage.removeItem("vew_cart:guest");
      }

      const finalCart = Array.from(mergedMap.values());
      setItems(finalCart);
      localStorage.setItem(`vew_cart:${currentOwner}`, JSON.stringify(finalCart));
      setInitialized(true);

      // Sync to backend if guest items were merged or local items existed
      if (guestItems.length > 0 || (serverItems.length === 0 && localUserItems.length > 0)) {
        api.put("/auth/cart", { cart: finalCart }).catch(() => {});
      }
    } else {
      // Guest user
      try {
        const guestItems = JSON.parse(localStorage.getItem("vew_cart:guest") || "[]");
        setItems(Array.isArray(guestItems) ? guestItems : []);
      } catch {
        setItems([]);
      }
      setInitialized(true);
    }
  }, [loading, user]);

  // Save changes to localStorage and backend
  useEffect(() => {
    if (!initialized || loading) return;

    localStorage.setItem(storageKey, JSON.stringify(items));

    // If user is logged in, sync to backend MongoDB
    if (user && ownerId !== "guest") {
      const timer = setTimeout(() => {
        api.put("/auth/cart", { cart: items }).catch((err) => {
          console.warn("Failed to sync cart to server:", err.message);
        });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [items, storageKey, user, ownerId, initialized, loading]);

  const add = (product, qty = 1) =>
    setItems((old) => {
      const quantityToAdd = Math.max(1, Number(qty) || 1);
      const prodId = product._id || product.id;
      const found = old.find((item) => (item._id || item.id) === prodId);
      return found
        ? old.map((item) =>
            (item._id || item.id) === prodId
              ? { ...item, ...product, _id: prodId, quantity: (item.quantity || 1) + quantityToAdd }
              : item,
          )
        : [...old, { ...product, _id: prodId, quantity: quantityToAdd }];
    });

  const change = (id, quantity) =>
    setItems((old) =>
      old.map((item) =>
        (item._id || item.id) === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );

  const remove = (id) =>
    setItems((old) => old.filter((item) => (item._id || item.id) !== id));

  const clear = () => {
    setItems([]);
    if (user && ownerId !== "guest") {
      api.put("/auth/cart", { cart: [] }).catch(() => {});
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        change,
        remove,
        clear,
        count: items.reduce((s, i) => s + (Number(i.quantity) || 1), 0),
        total: items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
