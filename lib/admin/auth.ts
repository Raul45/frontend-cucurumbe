export type AdminSession = {
  usuario: string;
  nombre: string;
  /** Cuenta de prueba para revisar el panel; se puede quitar de ADMIN_USUARIOS. */
  temporal: boolean;
  iniciadaEn: string;
};

export type AdminCredenciales = {
  usuario: string;
  password: string;
  nombre: string;
  temporal?: boolean;
};

/**
 * Cuentas fijas del panel (solo front-end: cualquiera puede abrir el panel
 * escribiendo en sessionStorage). En producción esto se valida en el backend.
 * Para quitar el acceso temporal, borra la entrada `temporal` de la lista.
 */
export const ADMIN_USUARIOS: AdminCredenciales[] = [
  { usuario: "admin", password: "cucurumbe", nombre: "Administración" },
  {
    usuario: "invitado",
    password: "temporal",
    nombre: "Invitado temporal",
    temporal: true,
  },
];

export const SESSION_STORAGE_KEY = "cucurumbe_admin_session";

export function validarCredenciales(
  usuario: string,
  password: string,
): AdminSession | null {
  const credencial = ADMIN_USUARIOS.find(
    (cuenta) =>
      cuenta.usuario === usuario.trim().toLowerCase() && cuenta.password === password,
  );

  if (!credencial) return null;

  return {
    usuario: credencial.usuario,
    nombre: credencial.nombre,
    temporal: credencial.temporal ?? false,
    iniciadaEn: new Date().toISOString(),
  };
}

/** Solo se puede leer en el navegador: el layout se renderiza en servidor. */
export function leerSesion(): AdminSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function guardarSesion(sesion: AdminSession) {
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sesion));
}

export function cerrarSesion() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
}