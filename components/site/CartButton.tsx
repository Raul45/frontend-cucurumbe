"use client";

import Link from "next/link";
import { useCart } from "./cart-context";

export default function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/perfil?tab=carrito"
      aria-label={`Carrito de compras, ${count} artículo${count === 1 ? "" : "s"}`}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M7 18a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2ZM7.16 14.26 7.2 14H19a1 1 0 0 0 .95-.68l2.5-8A1 1 0 0 0 21.5 4H6.21l-.66-2.37A1 1 0 0 0 4.58 1H1a1 1 0 0 0 0 2h2.78l2.7 9.68A2 2 0 0 0 8.4 16H20a1 1 0 0 0 0-2H8.4a.2.2 0 0 1-.2-.16l-.04-.58Z" />
      </svg>

      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-latte px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
