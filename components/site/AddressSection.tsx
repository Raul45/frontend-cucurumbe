"use client";

import { useEffect, useState } from "react";
import {
  getMyShipmentsAddress,
  removeShipmentAddress,
  type ShipmentAddress,
} from "@/services/shipmentAddress.service";
import AddressFormModal from "./AddressFormModal";

export default function AddressSection() {
  const [addresses, setAddresses] = useState<ShipmentAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ShipmentAddress | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const data = await getMyShipmentsAddress();
        if (!activo) return;
        setAddresses(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        if (!activo) return;
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar tus direcciones.",
        );
      } finally {
        if (activo) setLoading(false);
      }
    }

    cargar();

    return () => {
      activo = false;
    };
  }, [reloadKey]);

  function recargar() {
    setLoading(true);
    setReloadKey((key) => key + 1);
  }

  function handleSaved() {
    setModalOpen(false);
    setEditing(null);
    recargar();
  }

  function handleCreate() {
    setEditing(null);
    setActionError(null);
    setModalOpen(true);
  }

  function handleEdit(address: ShipmentAddress) {
    setEditing(address);
    setActionError(null);
    setModalOpen(true);
  }

  async function handleRemove(id: string) {
    setActionError(null);
    setRemovingId(id);

    try {
      await removeShipmentAddress(id);
      setConfirmingId(null);
      recargar();
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar la dirección.",
      );
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-azabache">
              Mis direcciones
            </h2>
            <p className="mt-1 text-sm text-gris-pizarra">
              Administra tus direcciones de envío.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-full bg-azabache px-5 py-2 text-sm font-medium text-white transition hover:bg-azabache/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
            </svg>
            Agregar dirección
          </button>
        </div>

        {actionError ? (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {actionError}
          </p>
        ) : null}

        {loading ? (
          <div className="mt-6 flex items-center gap-3 text-sm text-gris-pizarra">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-latte" />
            Cargando direcciones…
          </div>
        ) : error ? (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {error}
          </p>
        ) : addresses.length === 0 ? (
          <div className="mt-6 rounded-xl bg-blanco-roto p-6 text-center">
            <p className="text-sm font-medium text-azabache">
              Aún no tienes direcciones guardadas
            </p>
            <p className="mt-1 text-sm text-gris-pizarra">
              Agrega una dirección para tus envíos.
            </p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {addresses.map((dir, index) => {
              const puedeEditar = Boolean(dir._id);

              return (
                <li
                  key={dir._id ?? `${dir.addressName}-${dir.address}-${index}`}
                  className="flex flex-col rounded-xl border border-black/5 p-4"
                >
                  <p className="text-sm font-semibold text-azabache">
                    {dir.addressName || "Dirección"}
                  </p>
                  <p className="mt-1 text-sm text-gris-pizarra">
                    {dir.fullName}
                  </p>
                  <p className="text-sm text-gris-pizarra">
                    {dir.address} {dir.externalNumber}
                    {dir.internalNumber ? `, ${dir.internalNumber}` : ""}
                  </p>
                  <p className="text-sm text-gris-pizarra">
                    {dir.city}, {dir.state}, C.P. {dir.postalcode}
                  </p>
                  <p className="mt-1 text-sm text-gris-pizarra">
                    Tel: {dir.cellphone}
                  </p>
                  {dir.references ? (
                    <p className="mt-1 text-xs text-gris-pizarra/80">
                      Referencias: {dir.references}
                    </p>
                  ) : null}

                  {puedeEditar ? (
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/5 pt-3">
                      {confirmingId === dir._id ? (
                        <>
                          <span className="text-sm text-gris-pizarra">
                            ¿Eliminar esta dirección?
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemove(dir._id as string)}
                            disabled={removingId === dir._id}
                            className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {removingId === dir._id
                              ? "Eliminando..."
                              : "Confirmar"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingId(null)}
                            disabled={removingId === dir._id}
                            className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-azabache transition hover:border-latte hover:text-latte disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleEdit(dir)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-azabache transition hover:border-latte hover:text-latte"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" />
                            </svg>
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingId(dir._id as string)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-gris-pizarra transition hover:border-red-200 hover:text-red-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9Zm2 5h2v9h-2V8Zm-4 0h2v9H7V8Z" />
                            </svg>
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {modalOpen ? (
        <AddressFormModal
          address={editing}
          onSaved={handleSaved}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      ) : null}
    </div>
  );
}
