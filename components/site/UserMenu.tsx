"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./auth-context";

function iniciales(email: string) {
  const nombre = email.split("@")[0] ?? "";
  return nombre.slice(0, 2).toUpperCase();
}

export default function UserMenu() {
  const { user, loading, openLogin, logout } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        contenedor.current &&
        !contenedor.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleClick() {
    if (loading) return;

    if (!user) {
      openLogin();
      return;
    }

    setOpen((value) => !value);
  }

  async function handleLogout() {
    await logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <div className="relative" ref={contenedor}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={user ? "Mi cuenta" : "Iniciar sesión"}
        aria-haspopup={user ? "menu" : undefined}
        aria-expanded={user ? open : undefined}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
      >
        {user ? (
          <span className="text-xs font-bold">
            {iniciales(user.email)}
          </span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5Zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Zm0 2c2.52 0 6.26 1.12 7.42 2H4.58c1.16-.88 4.9-2 7.42-2Z" />
          </svg>
        )}
      </button>

      {user && open ? (
        <div className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-azabache shadow-lg">
          <div className="border-b border-white/10 px-3 py-2.5">
            <p className="truncate text-xs text-white/50">Sesión iniciada</p>
            <p className="truncate text-sm font-medium text-white">
              {user.email}
            </p>
          </div>

          <Link
            href="/perfil"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            Mi perfil
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="block w-full px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  );
}
