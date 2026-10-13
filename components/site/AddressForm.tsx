"use client";

import { useState } from "react";
import {
  saveShipmentAddress,
  updateShipmentAddress,
  type ShipmentAddress,
} from "@/services/shipmentAddress.service";
import { CampoSelect, CampoTexto } from "@/components/admin/FormControls";
import estadosData from "@/lib/admin/estados.json";

const estados = estadosData as Record<string, string[]>;

type Props = {
  initialData?: ShipmentAddress;
  onSaved: () => void;
  onCancel: () => void;
};

export default function AddressForm({
  initialData,
  onSaved,
  onCancel,
}: Props) {
  const editando = Boolean(initialData?._id);

  const [addressName, setAddressName] = useState(
    initialData?.addressName ?? "",
  );
  const [fullName, setFullName] = useState(initialData?.fullName ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [internalNumber, setInternalNumber] = useState(
    initialData?.internalNumber ?? "",
  );
  const [externalNumber, setExternalNumber] = useState(
    initialData?.externalNumber ?? "",
  );
  const [references, setReferences] = useState(
    initialData?.references ?? "",
  );
  const [postalcode, setPostalcode] = useState(
    initialData?.postalcode != null ? String(initialData.postalcode) : "",
  );
  const [state, setState] = useState(initialData?.state ?? "");
  const [city, setCity] = useState(initialData?.city ?? "");
  const [cellphone, setCellphone] = useState(initialData?.cellphone ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const municipios = state ? estados[state] ?? [] : [];
  const nombresEstados = Object.keys(estados);

  function handleStateChange(value: string) {
    setState(value);
    setCity("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (!addressName.trim()) {
      setError("El nombre de la dirección es obligatorio.");
      return;
    }

    if (!fullName.trim()) {
      setError("El nombre completo es obligatorio.");
      return;
    }

    if (!address.trim()) {
      setError("La calle es obligatoria.");
      return;
    }

    if (!externalNumber.trim()) {
      setError("El número exterior es obligatorio.");
      return;
    }

    if (!state) {
      setError("Selecciona un estado.");
      return;
    }

    if (!city) {
      setError("Selecciona un municipio.");
      return;
    }

    if (!postalcode.trim() || !Number.isFinite(Number(postalcode))) {
      setError("El código postal debe ser un número válido.");
      return;
    }

    if (!cellphone.trim()) {
      setError("El celular es obligatorio.");
      return;
    }

    const payload: ShipmentAddress = {
      addressName: addressName.trim(),
      fullName: fullName.trim(),
      address: address.trim(),
      internalNumber: internalNumber.trim() || undefined,
      externalNumber: externalNumber.trim(),
      references: references.trim() || undefined,
      postalcode: Number(postalcode),
      city,
      state,
      cellphone: cellphone.trim(),
    };

    try {
      setSaving(true);

      if (initialData?._id) {
        await updateShipmentAddress(initialData._id, payload);
      } else {
        await saveShipmentAddress(payload);
      }

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la dirección.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-base font-semibold text-azabache">
        {editando ? "Editar dirección" : "Nueva dirección"}
      </h3>
      <p className="mt-1 text-sm text-gris-pizarra">
        {editando
          ? "Actualiza los datos de tu dirección."
          : "Completa los datos de envío."}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <CampoTexto
            label="Nombre de la dirección"
            name="addressName"
            value={addressName}
            onChange={setAddressName}
            required
            placeholder="Casa, Oficina…"
          />
        </div>

        <CampoTexto
          label="Nombre completo"
          name="fullName"
          value={fullName}
          onChange={setFullName}
          required
          placeholder="Juan Pérez"
        />

        <CampoTexto
          label="Celular"
          name="cellphone"
          type="tel"
          value={cellphone}
          onChange={setCellphone}
          maxLength={10}
          required
          placeholder="6180000000"
        />

        <div className="sm:col-span-2">
          <CampoTexto
            label="Calle"
            name="address"
            value={address}
            onChange={setAddress}
            required
            placeholder="Av. Principal"
          />
        </div>

        <CampoTexto
          label="Número exterior"
          name="externalNumber"
          value={externalNumber}
          onChange={setExternalNumber}
          required
          placeholder="123"
        />

        <CampoTexto
          label="Número interior"
          name="internalNumber"
          value={internalNumber}
          onChange={setInternalNumber}
          placeholder="Depto 4"
        />

        <CampoSelect
          label="Estado"
          name="state"
          value={state}
          onChange={handleStateChange}
          opciones={[
            { value: "", label: "Selecciona un estado" },
            ...nombresEstados.map((nombre) => ({
              value: nombre,
              label: nombre,
            })),
          ]}
        />

        <CampoSelect
          label="Municipio"
          name="city"
          value={city}
          onChange={setCity}
          hint={
            state
              ? undefined
              : "Primero selecciona un estado."
          }
          opciones={
            municipios.length > 0
              ? [
                  { value: "", label: "Selecciona un municipio" },
                  ...municipios.map((nombre) => ({
                    value: nombre,
                    label: nombre,
                  })),
                ]
              : [{ value: "", label: "Sin municipios" }]
          }
        />

        <CampoTexto
          label="Código postal"
          name="postalcode"
          value={postalcode}
          onChange={setPostalcode}
          required
          placeholder="34000"
        />

        <div className="sm:col-span-2">
          <CampoTexto
            label="Referencias"
            name="references"
            value={references}
            onChange={setReferences}
            placeholder="Frente a la plaza principal"
          />
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-azabache px-5 py-2 text-sm font-medium text-white transition hover:bg-azabache/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Guardando..."
            : editando
              ? "Guardar cambios"
              : "Guardar dirección"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium text-azabache transition hover:border-latte hover:text-latte disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
