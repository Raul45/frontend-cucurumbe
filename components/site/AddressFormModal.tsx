"use client";

import { useEffect } from "react";
import type { ShipmentAddress } from "@/services/shipmentAddress.service";
import AddressForm from "./AddressForm";

type Props = {
  address?: ShipmentAddress | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function AddressFormModal({
  address,
  onClose,
  onSaved,
}: Props) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-azabache/60 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label={address ? "Editar dirección" : "Nueva dirección"}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-black/5 bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold tracking-tight text-azabache">
            {address ? "Editar dirección" : "Agregar dirección"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gris-pizarra transition hover:bg-black/5 hover:text-azabache"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.88 18.3 9.17 12 2.88 5.71 4.3 4.29l6.29 6.3 6.3-6.3z" />
            </svg>
          </button>
        </div>

        <AddressForm
          initialData={address ?? undefined}
          onSaved={onSaved}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
