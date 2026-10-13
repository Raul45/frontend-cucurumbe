import { getImageUrl } from "@/lib/admin/getImage";
import { getProduct } from "@/services/product.service";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImageSlider from "@/components/ProductSlider";
import AddToCartButton from "@/components/site/AddToCartButton";

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/productos"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gris-pizarra transition hover:text-azabache"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
        Volver a productos
      </Link>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/5 shadow-sm">
          <ProductImageSlider
            images={product.images ?? []}
            productName={product.name}
          />
        </div>
        <div className="flex flex-col">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            {product.brand ? (
              <p className="text-xs font-medium uppercase tracking-wide text-gris-pizarra">
                {product.brand}
              </p>
            ) : null}

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-azabache sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 text-base text-gris-pizarra">
              {product.description}
            </p>

            <span className="mt-6 block text-2xl font-bold text-latte">
              ${product.price.toLocaleString("es-MX")} MXN
            </span>

            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-black/5 pt-5 text-sm">
              {product.category ? (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gris-pizarra">
                    Categoría
                  </dt>
                  <dd className="mt-0.5 font-medium text-azabache">
                    {product.category}
                  </dd>
                </div>
              ) : null}

              <div>
                <dt className="text-xs uppercase tracking-wide text-gris-pizarra">
                  Disponibilidad
                </dt>
                <dd className="mt-0.5">
                  {product.inventary?.disponible ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Disponible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Agotado
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <AddToCartButton productId={product._id} />
            <a
              href="https://www.mercadopago.com.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-latte px-5 py-2.5 text-sm font-medium text-blanco-roto shadow-sm transition hover:bg-latte/90 focus:outline-none focus:ring-2 focus:ring-latte/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2 4 7v10l8 5 8-5V7zm0 2.18 6 3.64v7.36l-6 3.64-6-3.64V7.82z" />
                <path d="M12 6.82 8 9.27v5.46l4 2.45 4-2.45V9.27z" />
              </svg>
              Comprar con MercadoPago
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
