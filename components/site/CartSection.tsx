"use client";

import { getImageUrl } from "@/lib/admin/getImage";
import { getProducts, type Product } from "@/services/product.service";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "./cart-context";

export default function CartSection() {
  const { items, loading, saving, updateQuantity, removeItem, clear } =
    useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  async function ejecutar(accion: () => Promise<void>) {
    setActionError(null);

    try {
      await accion();
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el carrito.",
      );
    }
  }

  useEffect(() => {
    let activo = true;

    async function cargarProductos() {
      try {
        const data = await getProducts();
        if (activo) setProducts(data);
      } catch (error) {
        console.error("No se pudieron cargar los productos:", error);
      } finally {
        if (activo) setCargandoProductos(false);
      }
    }

    cargarProductos();

    return () => {
      activo = false;
    };
  }, []);

  const productosPorId = useMemo(
    () => new Map(products.map((product) => [product._id, product])),
    [products],
  );

  const total = useMemo(
    () =>
      items.reduce((acumulado, item) => {
        const producto = productosPorId.get(item.productId);
        return acumulado + (producto?.price ?? 0) * item.quantity;
      }, 0),
    [items, productosPorId],
  );

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-azabache">
          Tu carrito
        </h2>
        {saving ? (
          <span className="text-xs text-gris-pizarra">Guardando…</span>
        ) : null}
      </div>

      {actionError ? (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {actionError}
        </p>
      ) : null}

      {loading || cargandoProductos ? (
        <div className="mt-6 flex items-center gap-3 text-sm text-gris-pizarra">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-latte" />
          Cargando carrito…
        </div>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-xl bg-blanco-roto p-6 text-center">
          <p className="text-sm font-medium text-azabache">
            Tu carrito está vacío
          </p>
          <p className="mt-1 text-sm text-gris-pizarra">
            Explora el catálogo y añade tus productos favoritos.
          </p>
          <Link
            href="/productos"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-azabache px-5 py-2.5 text-sm font-medium text-white transition hover:bg-azabache/90"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6 divide-y divide-black/5">
            {items.map((item) => {
              const producto = productosPorId.get(item.productId);
              const imagen = producto?.images?.[0]?.url;
              const precio = producto?.price ?? 0;

              return (
                <li
                  key={`${item.productId}-${item.variantId}`}
                  className="flex flex-wrap items-center gap-4 py-4"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-white">
                    {imagen ? (
                      <Image
                        src={getImageUrl(imagen)}
                        alt={producto?.name ?? "Producto"}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                        unoptimized
                      />
                    ) : null}
                  </div>

                  <div className="min-w-[140px] flex-1">
                    <p className="text-sm font-medium text-azabache">
                      {producto?.name ?? "Producto no disponible"}
                    </p>
                    <p className="mt-0.5 text-sm text-latte">
                      ${precio.toLocaleString("es-MX")} MXN
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        ejecutar(() =>
                          updateQuantity(item.productId, item.quantity - 1),
                        )
                      }
                      aria-label="Disminuir cantidad"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-azabache transition hover:border-latte hover:text-latte"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-azabache">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        ejecutar(() =>
                          updateQuantity(item.productId, item.quantity + 1),
                        )
                      }
                      aria-label="Aumentar cantidad"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-azabache transition hover:border-latte hover:text-latte"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-24 text-right text-sm font-semibold text-azabache">
                    ${(precio * item.quantity).toLocaleString("es-MX")}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      ejecutar(() => removeItem(item.productId))
                    }
                    aria-label="Eliminar del carrito"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gris-pizarra transition hover:bg-red-50 hover:text-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9Zm2 5h2v9h-2V8Zm-4 0h2v9H7V8Z" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/5 pt-6">
            <button
              type="button"
              onClick={() => ejecutar(clear)}
              className="text-sm text-gris-pizarra transition hover:text-red-600"
            >
              Vaciar carrito
            </button>

            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-gris-pizarra">
                Total
              </p>
              <p className="text-xl font-bold text-azabache">
                ${total.toLocaleString("es-MX")} MXN
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
