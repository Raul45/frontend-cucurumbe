"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DeleteButton from "./DeleteButton";
import PageHeader from "./PageHeader";
import Table from "./Table";
import type { Columna } from "./Table";
import { EditIcon, PlusIcon } from "./icons";
import { deleteBranch, getBranches, type Branch } from "../../services/branch.service";

export default function SucursalesView() {
  const [sucursales, setSucursales] = useState<Branch[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarSucursales() {
      try {
        const data = await getBranches();
        setSucursales(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las sucursales",
        );
      } finally {
        setLoading(false);
      }
    }

    cargarSucursales();
  }, []);

  const filtradas = useMemo(() => {
    const term = busqueda.trim().toLowerCase();

    if (term.length === 0) {
      return sucursales;
    }

    return sucursales.filter((sucursal) => {
      const direccion = [
        sucursal.address.street,
        sucursal.address.exteriorNumber,
        sucursal.address.interiorNumber,
        sucursal.address.neighborhood,
        sucursal.address.city,
        sucursal.address.state,
        sucursal.address.postalCode,
      ]
        .filter(Boolean)
        .join(" ");

      const telefono = sucursal.contact?.phone ?? "";

      return [
        sucursal.name,
        sucursal.code,
        direccion,
        telefono,
      ].some((campo) =>
        campo.toLowerCase().includes(term),
      );
    });
  }, [sucursales, busqueda]);

  const columnas: Columna<Branch>[] = [
    {
      clave: "name",
      titulo: "Sucursal",
      render: (sucursal) => (
        <div>
          <p className="font-medium text-azabache">
            {sucursal.name}
          </p>

          <p className="text-xs text-gris-pizarra">
            {sucursal.code}
          </p>

          <p className="max-w-xs truncate text-xs text-gris-pizarra">
            {formatearDireccion(sucursal)}
          </p>
        </div>
      ),
    },

    {
      clave: "telefono",
      titulo: "Teléfono",
      render: (sucursal) =>
        sucursal.contact?.phone ?? "Sin teléfono",
    },

    {
      clave: "horario",
      titulo: "Horario",
      render: (sucursal) =>
        obtenerHorario(sucursal),
    },

    {
      clave: "status",
      titulo: "Estado",
      render: (sucursal) => (
        <span
          className={
            sucursal.status === "active"
              ? "font-medium text-green-600"
              : sucursal.status === "temporarily_closed"
                ? "font-medium text-orange-600"
                : "font-medium text-red-600"
          }
        >
          {obtenerTextoEstado(sucursal.status)}
        </span>
      ),
    },

    {
      clave: "acciones",
      titulo: "Acciones",
      className: "text-right",
      render: (sucursal) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/sucursales/${sucursal._id}/editar`}
            title={`Editar ${sucursal.name}`}
            aria-label={`Editar ${sucursal.name}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-gris-pizarra transition hover:border-latte hover:text-latte"
          >
            <EditIcon />
          </Link>

          <DeleteButton
            onDelete={async() => {
              await deleteBranch(sucursal._id);
              setSucursales((prev) =>
                prev.filter((item) => item._id !== sucursal._id),
              );
              console.log("Eliminar:", sucursal._id);
            }}
            etiqueta={sucursal.name}
            confirmacion={`¿Eliminar la sucursal “${sucursal.name}”?`}
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader
          titulo="Sucursales"
          descripcion="Cargando sucursales..."
        />

        <div className="rounded-xl border border-black/10 bg-white p-6 text-sm text-gris-pizarra">
          Cargando sucursales...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          titulo="Sucursales"
          descripcion="Error al cargar el catálogo"
        />

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        titulo="Sucursales"
        descripcion={`${sucursales.length} sucursales registradas`}
        accion={
          <Link
            href="/admin/sucursales/nueva"
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
          onChange={(event) =>
            setBusqueda(event.target.value)
          }
          placeholder="Buscar por nombre, código, dirección o teléfono"
          aria-label="Buscar sucursales"
          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-gris-pizarra/60 focus:border-latte focus:ring-2 focus:ring-latte/30 sm:max-w-sm"
        />
      </div>

      <Table
        columnas={columnas}
        filas={filtradas}
        claveFila={(sucursal) => sucursal._id}
        mensajeVacio="No hay sucursales que coincidan con la búsqueda."
      />
    </div>
  );
}

function formatearDireccion(sucursal: Branch): string {
  const { address } = sucursal;

  return [
    address.street,
    address.exteriorNumber,
    address.interiorNumber,
    address.neighborhood,
    address.city,
    address.state,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}

function obtenerHorario(sucursal: Branch): string {
  const monday = sucursal.schedule?.monday;

  if (!monday?.open || !monday?.close) {
    return "Sin horario";
  }

  return `${monday.open} - ${monday.close}`;
}

function obtenerTextoEstado(
  status: Branch["status"],
): string {
  switch (status) {
    case "active":
      return "Activa";

    case "inactive":
      return "Inactiva";

    case "temporarily_closed":
      return "Cerrada temporalmente";

    default:
      return "Sin estado";
  }
}