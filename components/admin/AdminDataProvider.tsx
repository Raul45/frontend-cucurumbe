"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LEADS_INICIALES,
  PRODUCTOS_INICIALES,
  SUCURSALES_INICIALES,
} from "../../lib/admin/mock-data";
import type { Lead, LeadStatus, Producto, Sucursal } from "../../lib/admin/types";

export const DATA_STORAGE_KEY = "cucurumbe_admin_data";

type Datos = {
  productos: Producto[];
  sucursales: Sucursal[];
  leads: Lead[];
};

type AdminDataContextValue = Datos & {
  guardarProducto: (producto: Producto) => void;
  eliminarProducto: (id: string) => void;
  guardarSucursal: (sucursal: Sucursal) => void;
  eliminarSucursal: (id: string) => void;
  actualizarLeadStatus: (id: string, status: LeadStatus) => void;
  eliminarLead: (id: string) => void;
  restaurarDatos: () => void;
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

const DATOS_INICIALES: Datos = {
  productos: PRODUCTOS_INICIALES,
  sucursales: SUCURSALES_INICIALES,
  leads: LEADS_INICIALES,
};

/** Lectura perezosa: en el servidor devuelve el seed, en el navegador lo guardado. */
function leerDatosGuardados(): Datos {
  if (typeof window === "undefined") return DATOS_INICIALES;

  try {
    const raw = window.localStorage.getItem(DATA_STORAGE_KEY);
    if (!raw) return DATOS_INICIALES;

    const guardados = JSON.parse(raw) as Partial<Datos>;
    return {
      productos: guardados.productos ?? DATOS_INICIALES.productos,
      sucursales: guardados.sucursales ?? DATOS_INICIALES.sucursales,
      leads: guardados.leads ?? DATOS_INICIALES.leads,
    };
  } catch {
    // Datos corruptos: seguimos con el seed (y el siguiente guardado los pisa).
    return DATOS_INICIALES;
  }
}

/**
 * Estado en cliente + persistencia en localStorage.
 * Todo el panel vive detrás de <AuthGuard>, que no renderiza contenido durante
 * la hidratación: por eso leer localStorage en el inicializador perezoso no
 * genera desajustes y el HTML del servidor siempre es el seed.
 */
export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [datos, setDatos] = useState<Datos>(leerDatosGuardados);

  useEffect(() => {
    try {
      window.localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(datos));
    } catch {
      // Cuota llena o almacenamiento deshabilitado: el estado vive en memoria.
    }
  }, [datos]);

  const guardarProducto = useCallback((producto: Producto) => {
    setDatos((prev) => ({
      ...prev,
      productos: prev.productos.some((p) => p.id === producto.id)
        ? prev.productos.map((p) => (p.id === producto.id ? producto : p))
        : [producto, ...prev.productos],
    }));
  }, []);

  const eliminarProducto = useCallback((id: string) => {
    setDatos((prev) => ({
      ...prev,
      productos: prev.productos.filter((p) => p.id !== id),
    }));
  }, []);

  const guardarSucursal = useCallback((sucursal: Sucursal) => {
    setDatos((prev) => ({
      ...prev,
      sucursales: prev.sucursales.some((s) => s.id === sucursal.id)
        ? prev.sucursales.map((s) => (s.id === sucursal.id ? sucursal : s))
        : [sucursal, ...prev.sucursales],
    }));
  }, []);

  const eliminarSucursal = useCallback((id: string) => {
    setDatos((prev) => ({
      ...prev,
      sucursales: prev.sucursales.filter((s) => s.id !== id),
    }));
  }, []);

  const actualizarLeadStatus = useCallback((id: string, status: LeadStatus) => {
    setDatos((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
    }));
  }, []);

  const eliminarLead = useCallback((id: string) => {
    setDatos((prev) => ({
      ...prev,
      leads: prev.leads.filter((lead) => lead.id !== id),
    }));
  }, []);

  const restaurarDatos = useCallback(() => setDatos(DATOS_INICIALES), []);

  const value = useMemo<AdminDataContextValue>(
    () => ({
      ...datos,
      guardarProducto,
      eliminarProducto,
      guardarSucursal,
      eliminarSucursal,
      actualizarLeadStatus,
      eliminarLead,
      restaurarDatos,
    }),
    [
      datos,
      guardarProducto,
      eliminarProducto,
      guardarSucursal,
      eliminarSucursal,
      actualizarLeadStatus,
      eliminarLead,
      restaurarDatos,
    ],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error("useAdminData debe usarse dentro de <AdminDataProvider>");
  }
  return ctx;
}