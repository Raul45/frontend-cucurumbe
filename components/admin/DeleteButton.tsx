"use client";

import { TrashIcon } from "./icons";

type DeleteButtonProps = {
  onDelete: () => void;
  etiqueta: string;
  confirmacion?: string;
};

export default function DeleteButton({
  onDelete,
  etiqueta,
  confirmacion,
}: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm(confirmacion ?? `¿Eliminar ${etiqueta}?`)) {
          onDelete();
        }
      }}
      title={`Eliminar ${etiqueta}`}
      aria-label={`Eliminar ${etiqueta}`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-gris-pizarra transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
    >
      <TrashIcon />
    </button>
  );
}