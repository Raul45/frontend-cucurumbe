"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./auth-context";

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-azabache outline-none transition placeholder:text-gris-pizarra/60 focus:border-latte focus:ring-2 focus:ring-latte/30 disabled:cursor-not-allowed disabled:opacity-60";

export default function LoginModal() {
  const { loginOpen, closeLogin, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    setError(null);
    setPassword("");
    setLoading(false);
    closeLogin();
  }, [closeLogin]);

  useEffect(() => {
    if (!loginOpen) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loginOpen, handleClose]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      setEmail("");
      setPassword("");
      router.push("/perfil");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Correo o contraseña incorrectos.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!loginOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-azabache/60 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="Iniciar sesión"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-azabache">
              Iniciar sesión
            </h2>
            <p className="mt-1 text-sm text-gris-pizarra">
              Accede para ver tu carrito y tus direcciones.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gris-pizarra transition hover:bg-black/5 hover:text-azabache"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.88 18.3 9.17 12 2.88 5.71 4.3 4.29l6.29 6.3 6.3-6.3z" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-azabache">
              Correo electrónico
            </span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              disabled={loading}
              placeholder="correo@ejemplo.com"
              className={inputClass}
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
              disabled={loading}
              placeholder="••••••••"
              className={inputClass}
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
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-azabache px-4 py-2.5 text-sm font-medium text-white transition hover:bg-azabache/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Iniciando sesión...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gris-pizarra">
          ¿No tienes cuenta?{" "}
          <Link
            href="/registro"
            onClick={handleClose}
            className="font-medium text-latte transition hover:text-latte/80"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
