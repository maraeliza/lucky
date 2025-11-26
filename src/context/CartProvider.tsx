// context/CartProvider.tsx
"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { Item } from "@/interfaces/item";

interface CartItem {
  item: Item;
  quantity: number;
}

interface CartContextProps {
  cart: CartItem[];
  addItem: (item: Item) => void;
  removeItem: (item: Item) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps>({
  cart: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addItem = (item: Item) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci,
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeItem = (item: Item) => {
    setCart((prev) =>
      prev
        .map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity - 1 } : ci,
        )
        .filter((ci) => ci.quantity > 0),
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
