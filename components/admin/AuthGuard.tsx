"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { leerSesion } from "../../lib/admin/auth";

/**
 * El guard vive solo en el cliente: sessionStorage no existe en el servidor.
 * `useSyncExternalStore` con snapshot de servidor `false` hace que el HTML
 * generado sea siempre el estado de carga y React aplique el valor real del
 * navegador al hidratar, sin setState en efecto ni desajuste de hidratación.
 */
const suscribir = () => () => {};

const haySesionEnServidor = () => false;
const haySesionEnNavegador = () => leerSesion() !== null;

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const autenticado = useSyncExternalStore(
    suscribir,
    haySesionEnNavegador,
    haySesionEnServidor,
  );

  useEffect(() => {
    // Se lee la sesión directamente (y no `autenticado`) porque en el primer
    // render tras una carga completa `autenticado` todavía es el snapshot de
    // servidor; el valor real llega en un render posterior.
    if (!leerSesion()) router.replace("/admin-panel/login");
  }, [router]);

  if (!autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="flex items-center gap-3 text-sm text-gris-pizarra">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-latte" />
          Verificando sesión…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}