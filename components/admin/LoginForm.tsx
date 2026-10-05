"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ADMIN_USUARIOS,
  guardarSesion,
  leerSesion,
  validarCredenciales,
} from "../../lib/admin/auth";

export default function LoginForm() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Si ya hay sesión abierta, no tiene sentido quedarse aquí.
  useEffect(() => {
    if (leerSesion()) router.replace("/admin-panel/dashboard");
  }, [router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const sesion = validarCredenciales(usuario, password);

    if (!sesion) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }

    setError(null);
    guardarSesion(sesion);
    router.replace("/admin-panel/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/logo.jpg"
            alt="Cucurumbe Café"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
            priority
          />
          <h1 className="mt-3 text-xl font-bold tracking-tight text-azabache">
            Panel de administración
          </h1>
          <p className="mt-1 text-sm text-gris-pizarra">Cucurumbe Café</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-azabache">
              Usuario
            </span>
            <input
              type="text"
              name="usuario"
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              autoComplete="username"
              required
              placeholder="admin"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-gris-pizarra/60 focus:border-latte focus:ring-2 focus:ring-latte/30"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-azabache">
              Contraseña
            </span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-gris-pizarra/60 focus:border-latte focus:ring-2 focus:ring-latte/30"
            />
          </label>

          {error ? (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-azabache px-4 py-2.5 text-sm font-medium text-white transition hover:bg-azabache/90"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4 rounded-xl border border-dashed border-black/10 px-3 py-2 text-center text-xs text-gris-pizarra">
          <p className="font-medium text-azabache">Cuentas de demostración</p>
          <ul className="mt-1 space-y-1">
            {ADMIN_USUARIOS.map((cuenta) => (
              <li key={cuenta.usuario}>
                <button
                  type="button"
                  onClick={() => {
                    setUsuario(cuenta.usuario);
                    setPassword(cuenta.password);
                    setError(null);
                  }}
                  className="rounded-lg px-2 py-1 transition hover:bg-blanco-roto"
                >
                  {cuenta.temporal ? (
                    <span className="mr-1 rounded-full bg-latte/15 px-2 py-0.5 font-medium text-latte">
                      temporal
                    </span>
                  ) : null}
                  <strong>{cuenta.usuario}</strong> · <strong>{cuenta.password}</strong>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-1">Toca una cuenta para rellenar el formulario.</p>
        </div>
      </div>
    </div>
  );
}