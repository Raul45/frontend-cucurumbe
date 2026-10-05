"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminData } from "./AdminDataProvider";
import PageHeader from "./PageHeader";
import { CampoArea, CampoSelect, CampoTexto } from "./FormControls";
import { BackIcon } from "./icons";
import { CATEGORIAS } from "../../lib/admin/mock-data";
import type { Producto } from "../../lib/admin/types";

export const NUEVO_ID = "nuevo";

type Props = {
  id: string;
};

export default function ProductoForm({ id }: Props) {
  const router = useRouter();
  const { productos, guardarProducto } = useAdminData();
  const existente = id === NUEVO_ID ? undefined : productos.find((p) => p.id === id);

  const [nombre, setNombre] = useState(existente?.nombre ?? "");
  const [categoria, setCategoria] = useState(
    existente?.categoria ?? CATEGORIAS[0],
  );
  const [precio, setPrecio] = useState(existente ? String(existente.precio) : "");
  const [stock, setStock] = useState(existente ? String(existente.stock) : "");
  const [imagen, setImagen] = useState(existente?.imagen ?? "/images.jpg");
  const [descripcion, setDescripcion] = useState(existente?.descripcion ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const precioNum = Number(precio);
    const stockNum = Number(stock);

    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!Number.isFinite(precioNum) || precioNum <= 0) {
      setError("El precio debe ser un número mayor a cero.");
      return;
    }
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      setError("El stock debe ser un entero mayor o igual a cero.");
      return;
    }

    const producto: Producto = {
      id: existente?.id ?? `prd-${Date.now().toString(36)}`,
      nombre: nombre.trim(),
      categoria,
      precio: precioNum,
      stock: stockNum,
      imagen: imagen.trim() || "/images.jpg",
      descripcion: descripcion.trim(),
    };

    guardarProducto(producto);
    router.push("/admin-panel/productos");
  }

  if (!existente && id !== NUEVO_ID) {
    return (
      <div>
        <PageHeader
          titulo="Producto no encontrado"
          volverHref="/admin-panel/productos"
        />
        <p className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-gris-pizarra shadow-sm">
          El producto <strong>{id}</strong> ya no existe en el catálogo. Vuelve al
          listado para elegir otro.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        titulo={existente ? "Editar producto" : "Nuevo producto"}
        descripcion={
          existente
            ? "Los cambios se guardan solo en este navegador (demo)."
            : "Da de alta un producto en el catálogo."
        }
        volverHref="/admin-panel/productos"
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
          placeholder="Café Tostado Claro"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <CampoSelect
            label="Categoría"
            name="categoria"
            value={categoria}
            onChange={setCategoria}
            opciones={CATEGORIAS.map((item) => ({ value: item, label: item }))}
          />
          <CampoTexto
            label="Precio (MXN)"
            name="precio"
            type="number"
            min={1}
            value={precio}
            onChange={setPrecio}
            required
            placeholder="185"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <CampoTexto
            label="Stock"
            name="stock"
            type="number"
            min={0}
            value={stock}
            onChange={setStock}
            required
            placeholder="40"
          />
          <CampoTexto
            label="Imagen (ruta)"
            name="imagen"
            value={imagen}
            onChange={setImagen}
            hint="Ruta en /public, por ejemplo /images.jpg"
          />
        </div>

        <CampoArea
          label="Descripción"
          name="descripcion"
          value={descripcion}
          onChange={setDescripcion}
          placeholder="Notas de cata, presentación, gramaje…"
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
            onClick={() => router.push("/admin-panel/productos")}
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