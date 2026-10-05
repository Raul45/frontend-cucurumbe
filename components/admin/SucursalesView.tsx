"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdminData } from "./AdminDataProvider";
import DeleteButton from "./DeleteButton";
import PageHeader from "./PageHeader";
import Table from "./Table";
import type { Columna } from "./Table";
import { EditIcon, PlusIcon } from "./icons";
import type { Sucursal } from "../../lib/admin/types";

export default function SucursalesView() {
  const { sucursales, eliminarSucursal } = useAdminData();
  const [busqueda, setBusqueda] = useState("");

  const filtradas = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    if (term.length === 0) return sucursales;
    return sucursales.filter((sucursal) =>
      [sucursal.nombre, sucursal.direccion, sucursal.telefono].some((campo) =>
        campo.toLowerCase().includes(term),
      ),
    );
  }, [sucursales, busqueda]);

  const columnas: Columna<Sucursal>[] = [
    {
      clave: "nombre",
      titulo: "Sucursal",
      render: (sucursal) => (
        <div>
          <p className="font-medium text-azabache">{sucursal.nombre}</p>
          <p className="max-w-xs truncate text-xs text-gris-pizarra">
            {sucursal.direccion}
          </p>
        </div>
      ),
    },
    { clave: "telefono", titulo: "Teléfono", render: (sucursal) => sucursal.telefono },
    { clave: "horario", titulo: "Horario", render: (sucursal) => sucursal.horario },
    {
      clave: "acciones",
      titulo: "Acciones",
      className: "text-right",
      render: (sucursal) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin-panel/sucursales/${sucursal.id}/editar`}
            title={`Editar ${sucursal.nombre}`}
            aria-label={`Editar ${sucursal.nombre}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-gris-pizarra transition hover:border-latte hover:text-latte"
          >
            <EditIcon />
          </Link>
          <DeleteButton
            onDelete={() => eliminarSucursal(sucursal.id)}
            etiqueta={sucursal.nombre}
            confirmacion={`¿Eliminar la sucursal “${sucursal.nombre}”?`}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        titulo="Sucursales"
        descripcion={`${sucursales.length} sucursales registradas`}
        accion={
          <Link
            href="/admin-panel/sucursales/nueva"
            className="inline-flex items-center gap-2 rounded-full bg-azabache px-4 py-2 text-sm font-medium text-white transition hover:bg-azabache/90"
          >
            <PlusIcon />
            Nueva sucursal
          </Link>
        }
      />

      <div className="mb-4">
        <input
          type="search"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar por nombre, dirección o teléfono"
          aria-label="Buscar sucursales"
          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-gris-pizarra/60 focus:border-latte focus:ring-2 focus:ring-latte/30 sm:max-w-sm"
        />
      </div>

      <Table
        columnas={columnas}
        filas={filtradas}
        claveFila={(sucursal) => sucursal.id}
        mensajeVacio="No hay sucursales que coincidan con la búsqueda."
      />
    </div>
  );
}