"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/services/auth.service";

import {
  BoxIcon,
  DashboardIcon,
  LogoutIcon,
  MailIcon,
  MenuIcon,
  SliderIcon,
  StoreIcon,
} from "./icons";

const ENLACES = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
  },
  {
    href: "/admin/productos",
    label: "Productos",
    icon: BoxIcon,
  },
  {
    href: "/admin/sucursales",
    label: "Sucursales",
    icon: StoreIcon,
  },
  {
    href: "/admin/leads",
    label: "Leads",
    icon: MailIcon,
  },
  {
    href: "/admin/slider",
    label: "Slider",
    icon: SliderIcon
  }
];

function esActivo(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      router.replace("/admin/login");
    }
  }

  return (
    <>
      {/* Sidebar fijo en escritorio */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-black/10 bg-azabache text-white lg:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <Image
            src="/logo.jpg"
            alt="Cucurumbe Café"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />

          <div className="leading-tight">
            <p className="text-sm font-semibold">Cucurumbe Café</p>
            <p className="text-xs text-white/50">
              Panel de administración
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {ENLACES.map(({ href, label, icon: Icono }) => {
            const activo = esActivo(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={activo ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  activo
                    ? "bg-white/15 font-medium text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icono />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Ver tienda
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogoutIcon />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Navegación móvil */}
      <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-azabache px-4 py-3 text-white lg:hidden">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2"
        >
          <Image
            src="/logo.jpg"
            alt="Cucurumbe Café"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />

          <span className="text-sm font-semibold">
            Cucurumbe
          </span>
        </Link>

        <details className="relative">
          <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-white/20 transition hover:bg-white/10">
            <MenuIcon />

            <span className="sr-only">
              Menú de administración
            </span>
          </summary>

          <div className="absolute right-0 z-20 mt-2 flex w-56 flex-col rounded-xl border border-black/10 bg-azabache p-2 shadow-lg">
            {ENLACES.map(({ href, label, icon: Icono }) => {
              const activo = esActivo(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    activo
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icono className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}

            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Ver tienda
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <LogoutIcon />
              Cerrar sesión
            </button>
          </div>
        </details>
      </div>
    </>
  );
}