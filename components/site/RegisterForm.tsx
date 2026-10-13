"use client";

import { createUser } from "@/services/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./auth-context";

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-azabache outline-none transition placeholder:text-gris-pizarra/60 focus:border-latte focus:ring-2 focus:ring-latte/30 disabled:cursor-not-allowed disabled:opacity-60";

function Campo({
  label,
  name,
  type = "text",
  value,
  onChange,
  autoComplete,
  placeholder,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-azabache">
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        required
        className={inputClass}
      />
    </label>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const { login, openLogin } = useAuth();

  const [name, setName] = useState("");
  const [firstLastName, setFirstLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (!name.trim() || !firstLastName.trim()) {
      setError("El nombre y el primer apellido son obligatorios.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);

      await createUser({
        name: name.trim(),
        firstLastName: firstLastName.trim(),
        secondLastName: secondLastName.trim(),
        email: email.trim(),
        password,
        role: "USER",
      });

      // Intentamos iniciar sesión automáticamente tras el registro.
      try {
        await login({ email: email.trim(), password });
      } catch {
        // Si el registro no deja sesión activa, se pedirá iniciar sesión.
      }

      router.push("/perfil");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo crear la cuenta.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-azabache">
          Crear cuenta
        </h1>
        <p className="mt-2 text-sm text-gris-pizarra">
          Regístrate para comprar y administrar tus direcciones.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
      >
        <Campo
          label="Nombre"
          name="name"
          value={name}
          onChange={setName}
          autoComplete="given-name"
          placeholder="Juan"
          disabled={loading}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            label="Primer apellido"
            name="firstLastName"
            value={firstLastName}
            onChange={setFirstLastName}
            autoComplete="family-name"
            placeholder="Pérez"
            disabled={loading}
          />

          <Campo
            label="Segundo apellido"
            name="secondLastName"
            value={secondLastName}
            onChange={setSecondLastName}
            placeholder="García"
            disabled={loading}
          />
        </div>

        <Campo
          label="Correo electrónico"
          name="email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder="correo@ejemplo.com"
          disabled={loading}
        />

        <Campo
          label="Contraseña"
          name="password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          placeholder="••••••••"
          disabled={loading}
        />

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
              Creando cuenta...
            </>
          ) : (
            "Crear cuenta"
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gris-pizarra">
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          onClick={openLogin}
          className="font-medium text-latte transition hover:text-latte/80"
        >
          Inicia sesión
        </button>
      </p>

      <p className="mt-2 text-center text-sm">
        <Link
          href="/"
          className="text-gris-pizarra transition hover:text-azabache"
        >
          Volver al inicio
        </Link>
      </p>
    </div>
  );
}
