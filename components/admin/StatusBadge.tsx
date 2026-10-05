import { LEAD_STATUS_LABELS } from "../../lib/admin/types";
import type { LeadStatus } from "../../lib/admin/types";

export default function StatusBadge({ status }: { status: LeadStatus }) {
  const esAtendido = status === "atendido";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        esAtendido
          ? "bg-latte/15 text-latte"
          : "bg-azabache/10 text-azabache"
      }`}
    >
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}