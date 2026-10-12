import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-azabache backdrop-blur supports-[backdrop-filter]:bg-azabache/95">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Cucurumbe Café"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            priority
          />
          <span className="text-sm font-semibold tracking-tight text-white sm:text-base">
            Cucurumbe Café
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden items-center gap-6 text-sm font-medium sm:flex">
  
            <Link
              href="/productos"
              className="text-gray-300 transition hover:text-white"
            >
              Productos
            </Link>
            <Link
              href="/sucursales"
              className="text-gray-300 transition hover:text-white"
            >
              Sucursales
            </Link>
            <Link
              href="/contacto"
              className="text-gray-300 transition hover:text-white"
            >
              Contacto
            </Link>
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
            aria-label="Icono de usuario"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5Zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Zm0 2c2.52 0 6.26 1.12 7.42 2H4.58c1.16-.88 4.9-2 7.42-2Z" />
            </svg>
          </button>
          <details className="relative sm:hidden">
            <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-2 flex w-40 flex-col rounded-lg border border-white/10 bg-azabache p-2 shadow-lg">
              <Link
                href="/productos"
                className="rounded-md px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Productos
              </Link>
              <Link
                href="/sucursales"
                className="rounded-md px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Sucursales
              </Link>
              <Link
                href="/contacto"
                className="rounded-md px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Contacto
              </Link>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
