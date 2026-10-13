"use client";

import { useState } from "react";
import { useCart } from "./cart-context";

type Props = {
  productId: string;
  className?: string;
  compact?: boolean;
};

export default function AddToCartButton({
  productId,
  className,
  compact = false,
}: Props) {
  const { addItem } = useCart();
  const [estado, setEstado] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );

  async function handleClick() {
    setEstado("saving");

    try {
      await addItem(productId, 1);
      setEstado("done");
      window.setTimeout(() => setEstado("idle"), 1500);
    } catch {
      setEstado("error");
    }
  }

  const etiqueta =
    estado === "saving"
      ? "Agregando..."
      : estado === "done"
        ? "Agregado ✓"
        : estado === "error"
          ? "Reintentar"
          : compact
            ? "Añadir"
            : "Añadir al carrito";

  const base = compact
    ? "inline-flex items-center gap-1.5 rounded-full border border-azabache/10 px-3 py-1.5 text-xs font-medium text-azabache transition hover:border-latte hover:bg-latte/10 hover:text-latte disabled:opacity-60"
    : "inline-flex items-center gap-2 rounded-full border border-azabache/15 px-5 py-2.5 text-sm font-medium text-azabache transition hover:border-latte hover:bg-latte/10 hover:text-latte disabled:opacity-60";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={estado === "saving"}
      className={className ?? base}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={compact ? 14 : 18}
        height={compact ? 14 : 18}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M7 18a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2ZM7.16 14.26 7.2 14H19a1 1 0 0 0 .95-.68l2.5-8A1 1 0 0 0 21.5 4H6.21l-.66-2.37A1 1 0 0 0 4.58 1H1a1 1 0 0 0 0 2h2.78l2.7 9.68A2 2 0 0 0 8.4 16H20a1 1 0 0 0 0-2H8.4a.2.2 0 0 1-.2-.16l-.04-.58Z" />
      </svg>
      {etiqueta}
    </button>
  );
}
