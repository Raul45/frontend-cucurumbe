"use client";

import type { LeadStatus } from "@/services/leads.service";

interface StatusBadgeProps {
  status: LeadStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Verificamos tolerando mayúsculas o minúsculas
  const isPendiente = status === "PENDIENTE" || (status as string) === "pendiente";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isPendiente
          ? "bg-yellow-100 text-yellow-800"
          : "bg-green-100 text-green-800"
      }`}
    >
      {isPendiente ? "Pendiente" : "Atendido"}
    </span>
  );
}