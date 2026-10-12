"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import StatusBadge from "./StatusBadge";
import Table from "./Table";
import type { Columna } from "./Table";
import { EditIcon } from "./icons";
import {
  getLeads,
  updateLeadStatus,
  type Lead,
  type LeadStatus,
} from "@/services/leads.service";

// Etiquetas legibles para la interfaz basadas directamente en LeadStatus
const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  PENDIENTE: "PENDIENTE",
  ATENDIDO: "ATENDIDO",
};

const FILTROS: { value: LeadStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "PENDIENTE", label: LEAD_STATUS_LABELS.PENDIENTE },
  { value: "ATENDIDO", label: LEAD_STATUS_LABELS.ATENDIDO },
];

export default function LeadsView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtro, setFiltro] = useState<LeadStatus | "todos">("todos");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarLeads() {
      try {
        const data = await getLeads();
        setLeads(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar los leads",
        );
      } finally {
        setLoading(false);
      }
    }

    cargarLeads();
  }, []);

  const actualizarEstado = async (id: string, nuevoEstado: LeadStatus) => {
    try {
      await updateLeadStatus(id, {status: nuevoEstado});
      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === id ? { ...lead, status: nuevoEstado } : lead,
        ),
      );
    } catch (err) {
      console.error("Error al actualizar estado del lead:", err);
    }
  };

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    return leads
      .filter((lead) => filtro === "todos" || lead.status === filtro)
      .filter((lead) => {
        if (term.length === 0) return true;
        return [
          lead.fullname,
          lead.email,
          lead.cellphone,
          lead.comment,
        ].some((campo) => campo?.toLowerCase().includes(term));
      });
  }, [leads, filtro, busqueda]);

  const pendientes = leads.filter((lead) => lead.status === "PENDIENTE").length;

  const columnas: Columna<Lead>[] = [
    {
      clave: "nombre",
      titulo: "Contacto",
      render: (lead) => (
        <div>
          <p className="font-medium text-azabache">{lead.fullname}</p>
          <p className="text-xs text-gris-pizarra">{lead.email}</p>
        </div>
      ),
    },
    { clave: "celular", titulo: "Celular", render: (lead) => lead.cellphone },
    {
      clave: "comentario",
      titulo: "Comentario",
      render: (lead) => (
        <p className="max-w-sm text-gris-pizarra">{lead.comment}</p>
      ),
    },
    {
      clave: "status",
      titulo: "Estado",
      render: (lead) => (
        <div className="space-y-2">
          <StatusBadge status={lead.status ?? "PENDIENTE"} />
          <select
            value={lead.status}
            aria-label={`Cambiar estado de ${lead.fullname}`}
            onChange={(event) => {
              if (lead._id) {
                actualizarEstado(lead._id, event.target.value as LeadStatus);
              }
            }}
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

  ];

  if (loading) {
    return (
      <div>
        <PageHeader titulo="Leads" descripcion="Cargando leads..." />
        <div className="rounded-xl border border-black/10 bg-white p-6 text-sm text-gris-pizarra">
          Cargando leads...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader titulo="Leads" descripcion="Error al cargar la información" />
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

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
        claveFila={(lead) => lead._id ?? Math.random().toString()}
        mensajeVacio="No hay leads que coincidan con el filtro."
      />
    </div>
  );
}