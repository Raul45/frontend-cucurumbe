"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminData } from "./AdminDataProvider";
import PageHeader from "./PageHeader";
import StatusBadge from "./StatusBadge";
import { CampoSelect } from "./FormControls";
import { BackIcon } from "./icons";
import { formatFecha } from "../../lib/admin/format";
import { LEAD_STATUS_LABELS } from "../../lib/admin/types";
import type { LeadStatus } from "../../lib/admin/types";

export default function LeadForm({ id }: { id: string }) {
  const router = useRouter();
  const { leads, actualizarLeadStatus } = useAdminData();
  const existente = leads.find((lead) => lead.id === id);

  const [status, setStatus] = useState<LeadStatus>(existente?.status ?? "pendiente");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    actualizarLeadStatus(id, status);
    router.push("/admin-panel/leads");
  }

  if (!existente) {
    return (
      <div>
        <PageHeader titulo="Lead no encontrado" volverHref="/admin-panel/leads" />
        <p className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-gris-pizarra shadow-sm">
          El lead <strong>{id}</strong> ya no existe. Vuelve al listado para elegir
          otro.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        titulo={`Lead · ${existente.nombre}`}
        descripcion="Los datos del contacto son de solo lectura; puedes cambiar su estado."
        volverHref="/admin-panel/leads"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-azabache">Datos recibidos</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-gris-pizarra">
                Correo
              </dt>
              <dd className="mt-0.5 break-all text-azabache">{existente.correo}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gris-pizarra">
                Celular
              </dt>
              <dd className="mt-0.5 text-azabache">{existente.celular}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gris-pizarra">
                Fecha
              </dt>
              <dd className="mt-0.5 text-azabache">{formatFecha(existente.fecha)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gris-pizarra">
                Comentario
              </dt>
              <dd className="mt-0.5 text-azabache">{existente.comentario}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gris-pizarra">
                Estado actual
              </dt>
              <dd className="mt-1">
                <StatusBadge status={existente.status} />
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
            opciones={[
              { value: "pendiente", label: LEAD_STATUS_LABELS.pendiente },
              { value: "atendido", label: LEAD_STATUS_LABELS.atendido },
            ]}
            hint="El único campo editable del lead."
          />

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="submit"
              className="rounded-full bg-azabache px-5 py-2 text-sm font-medium text-white transition hover:bg-azabache/90"
            >
              Guardar estado
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin-panel/leads")}
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