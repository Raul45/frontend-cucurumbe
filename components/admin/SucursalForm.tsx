"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminData } from "./AdminDataProvider";
import PageHeader from "./PageHeader";
import { CampoTexto } from "./FormControls";
import { BackIcon } from "./icons";
import type { Sucursal } from "../../lib/admin/types";

export const NUEVO_ID = "nueva";

export default function SucursalForm({ id }: { id: string }) {
  const router = useRouter();
  const { sucursales, guardarSucursal } = useAdminData();
  const existente =
    id === NUEVO_ID ? undefined : sucursales.find((sucursal) => sucursal.id === id);

  const [nombre, setNombre] = useState(existente?.nombre ?? "");
  const [direccion, setDireccion] = useState(existente?.direccion ?? "");
  const [telefono, setTelefono] = useState(existente?.telefono ?? "");
  const [horario, setHorario] = useState(existente?.horario ?? "");
  const [imagen, setImagen] = useState(existente?.imagen ?? "/images.jpg");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nombre.trim() || !direccion.trim()) {
      setError("El nombre y la dirección son obligatorios.");
      return;
    }

    const sucursal: Sucursal = {
      id: existente?.id ?? `suc-${Date.now().toString(36)}`,
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      telefono: telefono.trim(),
      horario: horario.trim(),
      imagen: imagen.trim() || "/images.jpg",
    };

    guardarSucursal(sucursal);
    router.push("/admin-panel/sucursales");
  }

  if (!existente && id !== NUEVO_ID) {
    return (
      <div>
        <PageHeader
          titulo="Sucursal no encontrada"
          volverHref="/admin-panel/sucursales"
        />
        <p className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-gris-pizarra shadow-sm">
          La sucursal <strong>{id}</strong> ya no existe. Vuelve al listado para
          elegir otra.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        titulo={existente ? "Editar sucursal" : "Nueva sucursal"}
        descripcion={
          existente
            ? "Los cambios se guardan solo en este navegador (demo)."
            : "Registra una sucursal de Cucurumbe Café."
        }
        volverHref="/admin-panel/sucursales"
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
      >
        <CampoTexto
          label="Nombre"
          name="nombre"
          value={nombre}
          onChange={setNombre}
          required
          placeholder="Sucursal Centro Histórico"
        />

        <CampoTexto
          label="Dirección"
          name="direccion"
          value={direccion}
          onChange={setDireccion}
          required
          placeholder="Calle, número, colonia, CP, ciudad"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <CampoTexto
            label="Teléfono"
            name="telefono"
            value={telefono}
            onChange={setTelefono}
            placeholder="618 000 0000"
          />
          <CampoTexto
            label="Horario"
            name="horario"
            value={horario}
            onChange={setHorario}
            placeholder="Lun a Sáb · 7:00 a 22:00"
          />
        </div>

        <CampoTexto
          label="Imagen (ruta)"
          name="imagen"
          value={imagen}
          onChange={setImagen}
          hint="Ruta en /public, por ejemplo /images1.jpg"
        />

        {error ? (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="rounded-full bg-azabache px-5 py-2 text-sm font-medium text-white transition hover:bg-azabache/90"
          >
            Guardar cambios
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin-panel/sucursales")}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2 text-sm font-medium text-azabache transition hover:border-latte hover:text-latte"
          >
            <BackIcon />
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}