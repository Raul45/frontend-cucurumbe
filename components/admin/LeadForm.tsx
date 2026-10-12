"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageHeader from "./PageHeader";
import StatusBadge from "./StatusBadge";
import { CampoSelect } from "./FormControls";
import { BackIcon } from "./icons";
import {
  getLead,
  updateLeadStatus,
  type Lead,
  type LeadStatus,
} from "@/services/leads.service";

// Opciones del select usando directamente el tipo LeadStatus del servicio
const OPCIONES_ESTADO: { value: LeadStatus; label: string }[] = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "ATENDIDO", label: "Atendido" },
];

export default function LeadForm({ id }: { id: string }) {
  const router = useRouter();

  const [lead, setLead] = useState<Lead | null>(null);
  const [status, setStatus] = useState<LeadStatus>("PENDIENTE");
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarLead() {
      try {
        const data = await getLead(id);
        setLead(data);
        if (data.status) {
          setStatus(data.status);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo obtener la información del lead",
        );
      } finally {
        setLoading(false);
      }
    }

    cargarLead();
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGuardando(true);
    setError(null);

    try {
      await updateLeadStatus(id, {status});
      router.push("/admin/leads");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al actualizar el estado",
      );
    } finally {
      setGuardando(false);
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader titulo="Cargando lead..." volverHref="/admin/leads" />
        <div className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-gris-pizarra shadow-sm">
          Cargando detalles del lead...
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div>
        <PageHeader titulo="Lead no encontrado" volverHref="/admin/leads" />
        <p className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-gris-pizarra shadow-sm">
          {error ?? `El lead con identificador ${id} no existe.`} Vuelve al listado para elegir otro.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        titulo={`Lead · ${lead.fullname}`}
        descripcion="Los datos del contacto son de solo lectura; puedes cambiar su estado."
        volverHref="/admin/leads"
      />

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-azabache">Datos recibidos</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-gris-pizarra">
                Correo
              </dt>
              <dd className="mt-0.5 break-all text-azabache">{lead.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gris-pizarra">
                Celular
              </dt>
              <dd className="mt-0.5 text-azabache">{lead.cellphone}</dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wide text-gris-pizarra">
                Comentario
              </dt>
              <dd className="mt-0.5 text-azabache">{lead.comment}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gris-pizarra">
                Estado actual
              </dt>
              <dd className="mt-1">
                <StatusBadge status={lead.status ?? "PENDIENTE"} />
              </dd>
            </div>
          </dl>
        </section>

        <form
          onSubmit={handleSubmit}
          className="h-fit space-y-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-azabache">Actualizar estado</h2>
          <CampoSelect
            label="Estado"
            name="status"
            value={status}
            onChange={(value) => setStatus(value as LeadStatus)}
            opciones={OPCIONES_ESTADO}
            hint="El único campo editable del lead."
          />

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="submit"
              disabled={guardando}
              className="rounded-full bg-azabache px-5 py-2 text-sm font-medium text-white transition hover:bg-azabache/90 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar estado"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/leads")}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2 text-sm font-medium text-azabache transition hover:border-latte hover:text-latte"
            >
              <BackIcon />
              Volver a leads
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}