
"use client";

import { useCallback, useEffect, useState } from "react";
import DeleteButton from "./DeleteButton";
import PageHeader from "./PageHeader";
import Table from "./Table";
import type { Columna } from "./Table";
import { addToSlider, deleteSlide, getSlider } from "@/services/page-content.sevice";
import type { slidesContent } from "@/services/page-content.sevice"
import { getProducts, type Product } from "@/services/product.service";
import { getImageUrl } from "@/lib/admin/getImage";



export default function SliderView() {
  const [slides, setSlides] = useState<slidesContent[]>([]);
  const [productos, setProductos] = useState<Product[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [eliminando, setEliminando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargarDatos = useCallback(async () => {
    try {
      setError(null);

      const [sliderData, productosData] = await Promise.all([
        getSlider(),
        getProducts(),
      ]);

      setSlides(
        [...(sliderData.slides ?? [])].sort(
          (a, b) => a.order - b.order,
        ),
      );

      setProductos(productosData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar el contenido del slider.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  async function handleCrear(data: {
    title: string;
    subtitle: string;
    order: number;
    isActive: boolean;
    productId: string | null;
    file: File;
  }) {
    try {
      setSaving(true);
      setError(null);
      setMensaje(null);

      await addToSlider(data as slidesContent);

      setModalAbierto(false);
      setMensaje("El elemento se agregó correctamente al slider.");

      await cargarDatos();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo agregar el elemento al slider.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleEliminar(slide: slidesContent) {
    try {
      setEliminando(slide._id);
      setError(null);
      setMensaje(null);

      await deleteSlide(slide._id);

      setSlides((actuales) =>
        actuales.filter((item) => item._id !== slide._id),
      );

      setMensaje("El elemento se eliminó correctamente.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar el elemento.",
      );
    } finally {
      setEliminando(null);
    }
  }

  const columnas: Columna<slidesContent>[] = [
    {
      clave: "imageUrl",
      titulo: "Imagen",
      render: (slide) => (
        <img
          src={getImageUrl(slide.imageUrl)}
          alt={slide.title}
          className="h-16 w-28 rounded-lg border border-black/5 object-cover"
        />
      ),
    },
    {
      clave: "title",
      titulo: "Contenido",
      render: (slide) => (
        <div className="min-w-40">
          <p className="font-medium text-azabache">
            {slide.title}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-gris-pizarra">
            {slide.subtitle}
          </p>
        </div>
      ),
    },
    {
      clave: "productId",
      titulo: "Producto",
      render: (slide) => {
        const producto = productos.find(
          (item) => item._id === slide.productId,
        );

        return (
          <span className="text-sm text-gris-pizarra">
            {producto?.name ?? (
              slide.productId ? "Producto no encontrado" : "Sin producto"
            )}
          </span>
        );
      },
    },
    {
      clave: "order",
      titulo: "Orden",
      render: (slide) => (
        <span className="text-sm text-gris-pizarra">
          {slide.order}
        </span>
      ),
    },
    {
      clave: "isActive",
      titulo: "Estado",
      render: (slide) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            slide.isActive
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {slide.isActive ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      clave: "acciones",
      titulo: "Acciones",
      className: "text-right",
      render: (slide) => (
        <div className="flex justify-end">
          <DeleteButton
            onDelete={() => handleEliminar(slide)}
            etiqueta={slide.title}
            confirmacion={`¿Eliminar "${slide.title}" del slider principal? Esta acción no se puede deshacer.`}
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <main>
        <PageHeader
          titulo="Slider principal"
          descripcion="Cargando contenido..."
        />
        <div className="rounded-xl border border-black/10 bg-white p-6 text-sm text-gris-pizarra">
          Cargando slider...
        </div>
      </main>
    );
  }

  return (
    <main>
      <PageHeader
        titulo="Slider principal"
        descripcion={`${slides.length} elementos configurados`}
        accion={
          <button
            type="button"
            onClick={() => {
              setError(null);
              setMensaje(null);
              setModalAbierto(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-azabache px-4 py-2 text-sm font-medium text-white transition hover:bg-azabache/90"
          >
            <span className="text-lg leading-none">+</span>
            Agregar elemento
          </button>
        }
      />

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {mensaje && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {mensaje}
        </div>
      )}

      <section className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-6">
        <p className="mb-4 text-sm text-gris-pizarra">
          Administra las imágenes y los mensajes que aparecen en la portada de Cucurumbe.
        </p>

        <Table
          columnas={columnas}
          filas={slides}
          claveFila={(slide) => slide._id}
          mensajeVacio="Todavía no hay elementos en el slider principal."
        />
      </section>

      {modalAbierto && (
        <SliderModal
          productos={productos}
          saving={saving}
          onClose={() => {
            if (!saving) setModalAbierto(false);
          }}
          onSubmit={handleCrear}
        />
      )}

      {eliminando && (
        <p className="mt-3 text-xs text-gris-pizarra" role="status">
          Eliminando elemento...
        </p>
      )}
    </main>
  );
}

type SliderModalProps = {
  productos: Product[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    subtitle: string;
    order: number;
    isActive: boolean;
    productId: string | null;
    file: File;
  }) => Promise<void>;
};

function SliderModal({
  productos,
  saving,
  onClose,
  onSubmit,
}: SliderModalProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [order, setOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [productId, setProductId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    if (!subtitle.trim()) {
      setError("El subtítulo es obligatorio.");
      return;
    }

    if (!file) {
      setError("Selecciona una imagen para el slider.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("El archivo seleccionado debe ser una imagen.");
      return;
    }

    const orderNumber = Number(order);


    console.log("PRODUCTID:",productId);

    if (!Number.isInteger(orderNumber) || orderNumber < 0) {
      setError("El orden debe ser un entero mayor o igual a cero.");
      return;
    }

    await onSubmit({
      title: title.trim(),
      subtitle: subtitle.trim(),
      order: orderNumber,
      isActive,
      productId: productId || null,
      file,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="slider-modal-title"
        className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-start justify-between border-b border-black/5 px-6 py-5">
          <div>
            <h2
              id="slider-modal-title"
              className="text-lg font-semibold text-azabache"
            >
              Nuevo elemento del slider
            </h2>
            <p className="mt-1 text-sm text-gris-pizarra">
              Configura el mensaje, la imagen y el producto asociado.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Cerrar modal"
            className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-gris-pizarra hover:bg-gray-100 disabled:opacity-50"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="slide-title"
                className="mb-1.5 block text-sm font-medium text-azabache"
              >
                Título
              </label>
              <input
                id="slide-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                maxLength={120}
                placeholder="Nuevo café"
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-latte focus:ring-2 focus:ring-latte/30"
              />
            </div>

            <div>
              <label
                htmlFor="slide-order"
                className="mb-1.5 block text-sm font-medium text-azabache"
              >
                Orden de aparición
              </label>
              <input
                id="slide-order"
                type="number"
                min={0}
                step={1}
                value={order}
                onChange={(event) => setOrder(event.target.value)}
                required
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-latte focus:ring-2 focus:ring-latte/30"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="slide-subtitle"
              className="mb-1.5 block text-sm font-medium text-azabache"
            >
              Subtítulo
            </label>
            <textarea
              id="slide-subtitle"
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              required
              maxLength={300}
              rows={3}
              placeholder="Conoce nuestros nuevos cafés..."
              className="w-full resize-y rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-latte focus:ring-2 focus:ring-latte/30"
            />
          </div>

          <div>
            <label
              htmlFor="slide-product"
              className="mb-1.5 block text-sm font-medium text-azabache"
            >
              Producto asociado (opcional)
            </label>
            <select
              id="slide-product"
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-latte focus:ring-2 focus:ring-latte/30"
            >
              <option value="">Sin producto asociado</option>
              {productos.map((producto) => (
                <option key={producto._id} value={producto._id}>
                  {producto.name} — {producto.sku} — $
                  {producto.price.toFixed(2)} {producto.currency}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gris-pizarra">
              Si seleccionas un producto, se enviará su ID al backend.
            </p>
          </div>

          <div>
            <label
              htmlFor="slide-image"
              className="mb-2 block text-sm font-medium text-azabache"
            >
              Imagen del slider
            </label>
            <label
              htmlFor="slide-image"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-black/20 p-4 transition hover:border-latte"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Vista previa de la imagen"
                  className="max-h-52 w-full rounded-lg object-contain"
                />
              ) : (
                <div className="py-6 text-center">
                  <span className="text-3xl">↑</span>
                  <p className="mt-2 text-sm font-medium text-azabache">
                    Seleccionar imagen
                  </p>
                  <p className="mt-1 text-xs text-gris-pizarra">
                    PNG, JPG o WebP
                  </p>
                </div>
              )}
              <span className="mt-3 text-xs text-gris-pizarra">
                {file ? file.name : "Haz clic para elegir un archivo"}
              </span>
            </label>
  
            <input
              id="slide-image"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0] ?? null;

                setFile(selectedFile);
              }}
              className="sr-only"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <footer className="flex flex-wrap justify-end gap-3 border-t border-black/5 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium text-azabache hover:border-latte disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-azabache px-5 py-2 text-sm font-medium text-white hover:bg-azabache/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Agregar al slider"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
