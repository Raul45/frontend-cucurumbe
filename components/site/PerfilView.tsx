"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./auth-context";
import { useCart } from "./cart-context";
import ProfileSidebar from "./ProfileSidebar";
import CartSection from "./CartSection";
import AddressSection from "./AddressSection";

export type PerfilTab = "carrito" | "direcciones";

export default function PerfilView({
  initialTab,
}: {
  initialTab: PerfilTab;
}) {
  const { user, loading, openLogin, logout } = useAuth();
  const { count } = useCart();
  const [tab, setTab] = useState<PerfilTab>(initialTab);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="flex items-center gap-3 text-sm text-gris-pizarra">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-latte" />
          Verificando sesión…
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-md rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-azabache/5 text-azabache">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5Zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Zm0 2c2.52 0 6.26 1.12 7.42 2H4.58c1.16-.88 4.9-2 7.42-2Z" />
            </svg>
          </div>

          <h1 className="mt-4 text-xl font-bold tracking-tight text-azabache">
            Inicia sesión
          </h1>
          <p className="mt-2 text-sm text-gris-pizarra">
            Necesitas una cuenta para ver tu carrito y administrar tus
            direcciones.
          </p>

          <button
            type="button"
            onClick={openLogin}
            className="mt-6 w-full rounded-full bg-azabache px-5 py-2.5 text-sm font-medium text-white transition hover:bg-azabache/90"
          >
            Iniciar sesión
          </button>

          <Link
            href="/registro"
            className="mt-3 inline-block text-sm font-medium text-latte transition hover:text-latte/80"
          >
            Crear una cuenta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-azabache sm:text-3xl">
          Mi perfil
        </h1>
        <p className="mt-2 text-sm text-gris-pizarra">{user.email}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <ProfileSidebar
          active={tab}
          count={count}
          onChange={setTab}
          onLogout={logout}
        />

        <section>
          {tab === "carrito" ? <CartSection /> : <AddressSection />}
        </section>
      </div>
    </div>
  );
}
