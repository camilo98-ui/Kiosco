import { useState, useCallback } from "react";

let globalCart = [];
let globalListeners = new Set();

function notify() {
  globalListeners.forEach((fn) => fn([...globalCart]));
}

export function useCart() {
  const [cart, setCart] = useState(globalCart);

  useState(() => {
    const listener = (newCart) => setCart(newCart);
    globalListeners.add(listener);
    return () => globalListeners.delete(listener);
  });

  const addItem = useCallback((product) => {
    const existing = globalCart.find((i) => i.product_id === product.id && !i.notes);
    if (existing) {
      existing.quantity += 1;
      globalCart = [...globalCart];
    } else {
      globalCart = [
        ...globalCart,
        {
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          quantity: 1,
          notes: "",
        },
      ];
    }
    notify();
  }, []);

  const removeItem = useCallback((index) => {
    globalCart = globalCart.filter((_, i) => i !== index);
    notify();
  }, []);

  const updateQuantity = useCallback((index, quantity) => {
    if (quantity <= 0) {
      globalCart = globalCart.filter((_, i) => i !== index);
    } else {
      globalCart[index] = { ...globalCart[index], quantity };
      globalCart = [...globalCart];
    }
    notify();
  }, []);

  const updateNotes = useCallback((index, notes) => {
    globalCart[index] = { ...globalCart[index], notes };
    globalCart = [...globalCart];
    notify();
  }, []);

  const clearCart = useCallback(() => {
    globalCart = [];
    notify();
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return { cart, addItem, removeItem, updateQuantity, updateNotes, clearCart, total, itemCount };
}