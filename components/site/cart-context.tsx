"use client";

import type { CartItem } from "@/services/cart.service";
import { createContext, useContext } from "react";

export interface CartContextValue {
  items: CartItem[];
  count: number;
  loading: boolean;
  saving: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }

  return context;
}
