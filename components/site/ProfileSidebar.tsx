"use client";

import { useRouter } from "next/navigation";
import type { PerfilTab } from "./PerfilView";

type Props = {
  active: PerfilTab;
  count: number;
  onChange: (tab: PerfilTab) => void;
  onLogout: () => Promise<void>;
};

export default function ProfileSidebar({
  active,
  count,
  onChange,
  onLogout,
}: Props) {
  const router = useRouter();

  async function handleLogout() {
    await onLogout();
    router.push("/");
  }

  const itemBase =
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition";

  return (
    <aside className="flex flex-col gap-2 lg:sticky lg:top-6 lg:self-start">
      <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-black/5 bg-white p-2 shadow-sm lg:flex-col">
        <button
          type="button"
          onClick={() => onChange("carrito")}
          aria-current={active === "carrito" ? "page" : undefined}
          className={`${itemBase} ${
            active === "carrito"
              ? "bg-azabache text-white"
              : "text-gris-pizarra hover:bg-black/5 hover:text-azabache"
          }`}
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
          <span className="flex-1 text-left">Carrito</span>
          {count > 0 ? (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                active === "carrito"
                  ? "bg-white/20 text-white"
                  : "bg-latte/10 text-latte"
              }`}
            >
              {count}
            </span>
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => onChange("direcciones")}
          aria-current={active === "direcciones" ? "page" : undefined}
          className={`${itemBase} ${
            active === "direcciones"
              ? "bg-azabache text-white"
              : "text-gris-pizarra hover:bg-black/5 hover:text-azabache"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z" />
          </svg>
          <span className="flex-1 text-left">Direcciones</span>
        </button>
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-xl border border-black/5 bg-white px-3 py-2.5 text-left text-sm text-gris-pizarra shadow-sm transition hover:border-red-200 hover:text-red-600"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}
