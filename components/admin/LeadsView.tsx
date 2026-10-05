"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdminData } from "./AdminDataProvider";
import DeleteButton from "./DeleteButton";
import PageHeader from "./PageHeader";
import StatusBadge from "./StatusBadge";
import Table from "./Table";
import type { Columna } from "./Table";
import { EditIcon } from "./icons";
import { formatFecha } from "../../lib/admin/format";
import { LEAD_STATUS_LABELS } from "../../lib/admin/types";
import type { Lead, LeadStatus } from "../../lib/admin/types";

const FILTROS: { value: LeadStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: LEAD_STATUS_LABELS.pendiente },
  { value: "atendido", label: LEAD_STATUS_LABELS.atendido },
];

export default function LeadsView() {
  const { leads, actualizarLeadStatus, eliminarLead } = useAdminData();
  const [filtro, setFiltro] = useState<LeadStatus | "todos">("todos");
  const [busqueda, setBusqueda] = useState("");

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    return leads
      .filter((lead) => filtro === "todos" || lead.status === filtro)
      .filter((lead) => {
        if (term.length === 0) return true;
        return [lead.nombre, lead.correo, lead.celular, lead.comentario].some((campo) =>
          campo.toLowerCase().includes(term),
        );
      });
  }, [leads, filtro, busqueda]);

  const pendientes = leads.filter((lead) => lead.status === "pendiente").length;

  const columnas: Columna<Lead>[] = [
    {
      clave: "nombre",
      titulo: "Contacto",
      render: (lead) => (
        <div>
          <p className="font-medium text-azabache">{lead.nombre}</p>
          <p className="text-xs text-gris-pizarra">{lead.correo}</p>
        </div>
      ),
    },
    { clave: "celular", titulo: "Celular", render: (lead) => lead.celular },
    {
      clave: "comentario",
      titulo: "Comentario",
      render: (lead) => (
        <p className="max-w-sm text-gris-pizarra">{lead.comentario}</p>
      ),
    },
    { clave: "fecha", titulo: "Fecha", render: (lead) => formatFecha(lead.fecha) },
    {
      clave: "status",
      titulo: "Estado",
      render: (lead) => (
        <div className="space-y-2">
          <StatusBadge status={lead.status} />
          <select
            value={lead.status}
            aria-label={`Cambiar estado de ${lead.nombre}`}
            onChange={(event) =>
              actualizarLeadStatus(lead.id, event.target.value as LeadStatus)
            }
            className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-xs outline-none transition focus:border-latte focus:ring-2 focus:ring-latte/30"
          >
            {FILTROS.slice(1).map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>
      ),
    },
    {
      clave: "acciones",
      titulo: "Acciones",
      className: "text-right",
      render: (lead) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin-panel/leads/${lead.id}/editar`}
            title={`Ver ${lead.nombre}`}
            aria-label={`Ver ${lead.nombre}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-gris-pizarra transition hover:border-latte hover:text-latte"
          >
            <EditIcon />
          </Link>
          <DeleteButton
            onDelete={() => eliminarLead(lead.id)}
            etiqueta={lead.nombre}
            confirmacion={`¿Eliminar el lead de “${lead.nombre}”?`}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        titulo="Leads"
        descripcion={`${leads.length} leads · ${pendientes} pendientes de atender`}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar por nombre, correo o comentario"
          aria-label="Buscar leads"
          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-gris-pizarra/60 focus:border-latte focus:ring-2 focus:ring-latte/30 sm:max-w-xs"
        />
        <div className="flex gap-2">
          {FILTROS.map((opcion) => (
            <button
              key={opcion.value}
              type="button"
              onClick={() => setFiltro(opcion.value)}
              aria-pressed={filtro === opcion.value}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                filtro === opcion.value
                  ? "border-azabache bg-azabache text-white"
                  : "border-black/10 bg-white text-gris-pizarra hover:border-latte hover:text-latte"
              }`}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>

      <Table
        columnas={columnas}
        filas={filtrados}
        claveFila={(lead) => lead.id}
        mensajeVacio="No hay leads que coincidan con el filtro."
      />
    </div>
  );
}