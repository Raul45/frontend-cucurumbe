"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdminData } from "./AdminDataProvider";
import DeleteButton from "./DeleteButton";
import PageHeader from "./PageHeader";
import Table from "./Table";
import type { Columna } from "./Table";
import { EditIcon, PlusIcon } from "./icons";
import { formatMoneda, formatNumero } from "../../lib/admin/format";
import { CATEGORIAS } from "../../lib/admin/mock-data";
import type { Producto } from "../../lib/admin/types";

export default function ProductosView() {
  const { productos, eliminarProducto } = useAdminData();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    return productos.filter((producto) => {
      const coincideTexto =
        term.length === 0 ||
        producto.nombre.toLowerCase().includes(term) ||
        producto.descripcion.toLowerCase().includes(term);
      const coincideCategoria =
        categoria === "todas" || producto.categoria === categoria;
      return coincideTexto && coincideCategoria;
    });
  }, [productos, busqueda, categoria]);

  const columnas: Columna<Producto>[] = [
    {
      clave: "nombre",
      titulo: "Producto",
      render: (producto) => (
        <div>
          <p className="font-medium text-azabache">{producto.nombre}</p>
          <p className="text-xs text-gris-pizarra">{producto.categoria}</p>
        </div>
      ),
    },
    {
      clave: "precio",
      titulo: "Precio",
      render: (producto) => formatMoneda(producto.precio),
    },
    {
      clave: "stock",
      titulo: "Stock",
      render: (producto) => (
        <span
          className={
            producto.stock <= 10 ? "font-medium text-red-600" : "text-gris-pizarra"
          }
        >
          {formatNumero(producto.stock)}
        </span>
      ),
    },
    {
      clave: "acciones",
      titulo: "Acciones",
      className: "text-right",
      render: (producto) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin-panel/productos/${producto.id}/editar`}
            title={`Editar ${producto.nombre}`}
            aria-label={`Editar ${producto.nombre}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-gris-pizarra transition hover:border-latte hover:text-latte"
          >
            <EditIcon />
          </Link>
          <DeleteButton
            onDelete={() => eliminarProducto(producto.id)}
            etiqueta={producto.nombre}
            confirmacion={`¿Eliminar “${producto.nombre}” del catálogo?`}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        titulo="Productos"
        descripcion={`${productos.length} productos en el catálogo`}
        accion={
          <Link
            href="/admin-panel/productos/nuevo"
            className="inline-flex items-center gap-2 rounded-full bg-azabache px-4 py-2 text-sm font-medium text-white transition hover:bg-azabache/90"
          >
            <PlusIcon />
            Nuevo producto
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar por nombre o descripción"
          aria-label="Buscar productos"
          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-gris-pizarra/60 focus:border-latte focus:ring-2 focus:ring-latte/30 sm:max-w-xs"
        />
        <select
          value={categoria}
          onChange={(event) => setCategoria(event.target.value)}
          aria-label="Filtrar por categoría"
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-latte focus:ring-2 focus:ring-latte/30"
        >
          <option value="todas">Todas las categorías</option>
          {CATEGORIAS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <Table
        columnas={columnas}
        filas={filtrados}
        claveFila={(producto) => producto.id}
        mensajeVacio="No hay productos que coincidan con el filtro."
      />
    </div>
  );
}