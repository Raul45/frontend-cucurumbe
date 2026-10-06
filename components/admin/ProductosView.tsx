"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DeleteButton from "./DeleteButton";
import PageHeader from "./PageHeader";
import Table from "./Table";
import type { Columna } from "./Table";
import { EditIcon, PlusIcon } from "./icons";
import { formatMoneda, formatNumero } from "../../lib/admin/format";
import { deleteProduct, getProducts, type Product } from "../../services/product.service";

export default function ProductosView() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarProductos() {
      try {
        const data = await getProducts();
        setProductos(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los productos",
        );
      } finally {
        setLoading(false);
      }
    }

    cargarProductos();
  }, []);

  const categorias = useMemo(() => {
    return [...new Set(productos.map((producto) => producto.category))];
  }, [productos]);

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();

    return productos.filter((producto) => {
      const coincideTexto =
        term.length === 0 ||
        producto.name.toLowerCase().includes(term) ||
        producto.description.toLowerCase().includes(term);

      const coincideCategoria =
        categoria === "todas" || producto.category === categoria;

      return coincideTexto && coincideCategoria;
    });
  }, [productos, busqueda, categoria]);

  const columnas: Columna<Product>[] = [
    {
      clave: "name",
      titulo: "Producto",
      render: (producto) => (
        <div>
          <p className="font-medium text-azabache">{producto.name}</p>
          <p className="text-xs text-gris-pizarra">
            {producto.category}
          </p>
        </div>
      ),
    },
    {
      clave: "price",
      titulo: "Precio",
      render: (producto) =>
        formatMoneda(producto.price),
    },
    {
      clave: "brand",
      titulo: "Marca",
      render: (producto) =>
        producto.brand,
    },
    {
      clave: "stock",
      titulo: "Stock",
      render: (producto) => (
        <span
          className={
            producto.inventary.stock <= 10
              ? "font-medium text-red-600"
              : "text-gris-pizarra"
          }
        >
          {formatNumero(producto.inventary.stock)}
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
            href={`/admin/productos/${producto._id}/editar`}
            title={`Editar ${producto.name}`}
            aria-label={`Editar ${producto.name}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-gris-pizarra transition hover:border-latte hover:text-latte"
          >
            <EditIcon />
          </Link>

          <DeleteButton
            onDelete={async() => {
              await deleteProduct(producto._id)
              setProductos((prev) =>
                prev.filter((item) => item._id !== producto._id),
              );
            }}
            etiqueta={producto.name}
            confirmacion={`¿Eliminar “${producto.name}” del catálogo?`}
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader
          titulo="Productos"
          descripcion="Cargando productos..."
        />

        <div className="rounded-xl border border-black/10 bg-white p-6 text-sm text-gris-pizarra">
          Cargando catálogo...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          titulo="Productos"
          descripcion="Error al cargar el catálogo"
        />

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        titulo="Productos"
        descripcion={`${productos.length} productos en el catálogo`}
        accion={
          <Link
            href="/admin/productos/nuevo"
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

          {categorias.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <Table
        columnas={columnas}
        filas={filtrados}
        claveFila={(producto) => producto._id}
        mensajeVacio="No hay productos que coincidan con el filtro."
      />
    </div>
  );
}