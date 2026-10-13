"use client";

import {
  getMyCart,
  saveMyCart,
  type CartItem,
} from "@/services/cart.service";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./auth-context";
import { CartContext, type CartContextValue } from "./cart-context";

const GUEST_CART_KEY = "cucurumbe_guest_cart";

function leerCarritoInvitado(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

function guardarCarritoInvitado(items: CartItem[]) {
  if (typeof window === "undefined") return;

  try {
    if (items.length === 0) {
      window.localStorage.removeItem(GUEST_CART_KEY);
    } else {
      window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    }
  } catch {
    // Almacenamiento no disponible: seguimos solo en memoria.
  }
}

function normalizarItems(items: CartItem[]): CartItem[] {
  return items.map((item) => ({
    ...item,
    variantId: item.variantId || item.productId,
  }));
}

function combinarItems(base: CartItem[], extra: CartItem[]): CartItem[] {
  const mapa = new Map<string, CartItem>();

  [...base, ...extra].forEach((item) => {
    const key = `${item.productId}::${item.variantId ?? ""}`;
    const previo = mapa.get(key);

    if (previo) {
      mapa.set(key, { ...previo, quantity: previo.quantity + item.quantity });
    } else {
      mapa.set(key, { ...item });
    }
  });

  return [...mapa.values()];
}

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Espejo sincrónico para evitar condiciones de carrera entre clics rápidos.
  const itemsRef = useRef<CartItem[]>([]);

  useEffect(() => {
    if (authLoading) return;

    let activo = true;

    async function cargar() {
      setLoading(true);

      if (user) {
        const invitado = normalizarItems(leerCarritoInvitado());
        let remoto: CartItem[] = [];

        try {
          const carritos = await getMyCart();
          remoto = normalizarItems(
            Array.isArray(carritos) ? carritos[0]?.items ?? [] : [],
          );
        } catch (error) {
          console.error("No se pudo cargar el carrito:", error);
        }

        const combinado = combinarItems(remoto, invitado);

        if (!activo) return;
        setItems(combinado);
        itemsRef.current = combinado;

        if (invitado.length > 0) {
          guardarCarritoInvitado([]);

          try {
            setSaving(true);
            await saveMyCart({ userId: user.userId, items: combinado });
          } catch (error) {
            console.error("No se pudo sincronizar el carrito:", error);
          } finally {
            if (activo) setSaving(false);
          }
        }
      } else {
        const local = normalizarItems(leerCarritoInvitado());
        if (!activo) return;
        setItems(local);
        itemsRef.current = local;
      }

      if (activo) setLoading(false);
    }

    cargar();

    return () => {
      activo = false;
    };
  }, [user, authLoading]);

  const persistir = useCallback(
    async (next: CartItem[]) => {
      if (!user) {
        guardarCarritoInvitado(next);
        return;
      }

      setSaving(true);

      try {
        await saveMyCart({ userId: user.userId, items: next });
      } catch (error) {
        console.error("No se pudo guardar el carrito:", error);
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [user],
  );

  const actualizar = useCallback(
    (next: CartItem[]) => {
      itemsRef.current = next;
      setItems(next);
      return persistir(next);
    },
    [persistir],
  );

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      const previo = itemsRef.current;
      const existente = previo.find((item) => item.productId === productId);

      const next = existente
        ? previo.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [...previo, { productId, variantId: productId, quantity }];

      await actualizar(next);
    },
    [actualizar],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) {
        const next = itemsRef.current.filter(
          (item) => item.productId !== productId,
        );
        await actualizar(next);
        return;
      }

      const next = itemsRef.current.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      );

      await actualizar(next);
    },
    [actualizar],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      const next = itemsRef.current.filter(
        (item) => item.productId !== productId,
      );
      await actualizar(next);
    },
    [actualizar],
  );

  const clear = useCallback(async () => {
    await actualizar([]);
  }, [actualizar]);

  const count = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      loading,
      saving,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    }),
    [items, count, loading, saving, addItem, updateQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
