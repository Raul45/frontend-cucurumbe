"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProduct,
  getProduct,
  updateProduct,
  type Product,
} from "../../services/product.service";
import PageHeader from "./PageHeader";
import { CampoArea, CampoSelect, CampoTexto } from "./FormControls";
import { BackIcon } from "./icons";
import { CATEGORIAS } from "../../lib/admin/mock-data";
import { useImageManager } from "@/hooks/useImageManager";
import ImageUploader from "./ImageUploader";

export const NUEVO_ID = "nuevo";

type Props = {
  id: string;
};

export default function ProductoForm({ id }: Props) {
   const {
    existingImages,
    newImages,
    previews,
    imagesToDelete,
    setInitialImages,
    handleFilesChange,
    removeExistingImage,
    removeNewImage,
  } = useImageManager();
  const router = useRouter();

  const [producto, setProducto] = useState<Product | null>(null);

  // Datos generales
  const [nombre, setNombre] = useState("");
  const [sku, setSku] = useState("");
  const [marca, setMarca] = useState("");
  const [category, setCategoria] = useState(CATEGORIAS[0]);
  const [descripcion, setDescripcion] = useState("");

  // Precio
  const [precio, setPrecio] = useState("");
  const [currency, setCurrency] = useState("MXN");

  // Inventario
  const [stock, setStock] = useState("");
  const [grams, setGrams] = useState("");

  // Origen
  const [pais, setPais] = useState("México");
  const [estado, setEstado] = useState("");


  
  const [loading, setLoading] = useState(id !== NUEVO_ID);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * Cargar producto cuando estamos editando
   */
  useEffect(() => {
    if (id === NUEVO_ID) {
      setLoading(false);
      return;
    }

    async function cargarProducto() {
      try {
        setLoading(true);
        setError(null);

        const data = await getProduct(id);

        setProducto(data);

        setNombre(data.name);
        setSku(data.sku);
        setMarca(data.brand);
        setCategoria(data.category);
        setPrecio(String(data.price));
        setCurrency(data.currency);
        setStock(String(data.inventary.stock));
        setGrams(String(data.inventary.grams));
        setDescripcion(data.description);

        setPais(data.origin?.pais ?? "");
        setEstado(data.origin?.estado ?? "");

        setInitialImages(
          [...(data.images ?? [])].sort(
            (a, b) => a.order - b.order,
          ),
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "No se pudo cargar el producto.",
        );
      } finally {
        setLoading(false);
      }
    }

    cargarProducto();
  }, [id]);

  /*
   * Liberar URLs de previews cuando el componente se desmonta
   */
  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

 
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    const precioNum = Number(precio);
    const stockNum = Number(stock);
    const gramsNum = Number(grams);

    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (!sku.trim()) {
      setError("El SKU es obligatorio.");
      return;
    }

    if (!marca.trim()) {
      setError("La marca es obligatoria.");
      return;
    }

    if (!Number.isFinite(precioNum) || precioNum <= 0) {
      setError("El precio debe ser un número mayor a cero.");
      return;
    }

    if (!Number.isInteger(stockNum) || stockNum < 0) {
      setError(
        "El stock debe ser un entero mayor o igual a cero.",
      );
      return;
    }

    if (!Number.isFinite(gramsNum) || gramsNum <= 0) {
      setError("El gramaje debe ser mayor a cero.");
      return;
    }

    if (!pais.trim()) {
      setError("El país de origen es obligatorio.");
      return;
    }

    if (
      id === NUEVO_ID &&
      newImages.length === 0
      ) {
      setError("Debes seleccionar al menos una imagen.");
      return;
      }

    try {
      setSaving(true);

      /*
       * CREAR
       */
      if (id === NUEVO_ID) {
        await createProduct({
          name: nombre.trim(),
          sku: sku.trim(),
          description: descripcion.trim(),
          brand: marca.trim(),
          price: precioNum,
          currency,
          category,
          inventary: {
            stock: stockNum,
            grams: gramsNum,
            disponible: stockNum > 0,
          },
          origin: {
            pais: pais.trim(),
            estado: estado.trim(),
          },
          images: newImages,
        });
      }

      /*
       * ACTUALIZAR
       */
      else {
        await updateProduct(id, {
          name: nombre.trim(),
          description: descripcion.trim(),
          price: precioNum,
          stock: stockNum,
          imagesToDelete,
          images: newImages,
        });
      }

      router.push("/admin/productos");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el producto.",
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <main>
        <PageHeader
          titulo="Editar producto"
          descripcion="Cargando información del producto..."
          volverHref="/admin/productos"
        />

        <section className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-gris-pizarra shadow-sm">
          Cargando producto...
        </section>
      </main>
    );
  }

  /*
   * Producto no encontrado
   */
  if (id !== NUEVO_ID && error && !producto) {
    return (
      <main>
        <PageHeader
          titulo="Producto no encontrado"
          volverHref="/admin/productos"
        />

        <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main>
      <PageHeader
        titulo={
          id === NUEVO_ID
            ? "Nuevo producto"
            : "Editar producto"
        }
        descripcion={
          id === NUEVO_ID
            ? "Da de alta un producto en el catálogo."
            : "Actualiza la información del producto."
        }
        volverHref="/admin/productos"
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
      >
        {/* Datos generales */}
        <section className="grid gap-4 sm:grid-cols-2">
          <CampoTexto
            label="Nombre"
            name="nombre"
            value={nombre}
            onChange={setNombre}
            required
            placeholder="Café Tostado Claro"
          />

          <CampoTexto
            label="SKU"
            name="sku"
            value={sku}
            onChange={setSku}
            required
            placeholder="CAF-CHI-001"
          />
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <CampoTexto
            label="Marca"
            name="marca"
            value={marca}
            onChange={setMarca}
            required
            placeholder="Cucurumbe"
          />

          <CampoSelect
            label="Categoría"
            name="category"
            value={category}
            onChange={setCategoria}
            opciones={CATEGORIAS.map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </section>

        {/* Descripción */}
        <CampoArea
          label="Descripción"
          name="descripcion"
          value={descripcion}
          onChange={setDescripcion}
          placeholder="Notas de cata, presentación, gramaje…"
        />

        {/* Precio */}
        <section className="grid gap-4 sm:grid-cols-2">
          <CampoTexto
            label="Precio"
            name="precio"
            type="number"
            min={0}
            step="0.01"
            value={precio}
            onChange={setPrecio}
            required
            placeholder="185"
          />

          <CampoSelect
            label="Moneda"
            name="currency"
            value={currency}
            onChange={setCurrency}
            opciones={[
              { value: "MXN", label: "MXN" },
              { value: "USD", label: "USD" },
            ]}
          />
        </section>

        {/* Inventario */}
        <section className="grid gap-4 sm:grid-cols-2">
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
            label="Gramos"
            name="grams"
            type="number"
            min={1}
            value={grams}
            onChange={setGrams}
            required
            placeholder="500"
          />
        </section>

        {/* Origen */}
        <section>
          <h3 className="mb-3 text-sm font-medium text-azabache">
            Origen
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <CampoTexto
              label="País"
              name="pais"
              value={pais}
              onChange={setPais}
              required
              placeholder="México"
            />

            <CampoTexto
              label="Estado"
              name="estado"
              value={estado}
              onChange={setEstado}
              placeholder="Chiapas"
            />
          </div>
        </section>

        {/* Imágenes */}
        <section>
          <h3 className="text-sm font-medium text-azabache">
            Imágenes
          </h3>

          <p className="mt-1 text-xs text-gris-pizarra">
            Puedes agregar varias imágenes al producto.
          </p>

         <ImageUploader
          existingImages={existingImages}
          previews={previews}
          onFilesChange={handleFilesChange}
          onRemoveExisting={removeExistingImage}
          onRemoveNew={removeNewImage}
        />
        </section>

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        {/* Acciones */}
        <section className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-azabache px-5 py-2 text-sm font-medium text-white transition hover:bg-azabache/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : id === NUEVO_ID
                ? "Crear producto"
                : "Guardar cambios"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/productos")}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2 text-sm font-medium text-azabache transition hover:border-latte hover:text-latte disabled:opacity-50"
          >
            <BackIcon />
            Cancelar
          </button>
        </section>
      </form>
    </main>
  );
}
