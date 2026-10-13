import { getProducts, Product } from "@/services/product.service";
import Image from "next/image";
import Link from "next/link";
import ProductImageSlider from "@/components/ProductSlider";
import AddToCartButton from "@/components/site/AddToCartButton";
import { getImageUrl } from "@/lib/admin/getImage";

export default async function ProductosPage() {
  let products:Product[] = []
  try {
    products = await getProducts();
  } catch(e) {
    console.error("Error al cargar los productos:", e);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-azabache sm:text-4xl">
          Productos
        </h1>
        <p className="mt-2 text-sm text-gris-pizarra sm:text-base">
          Lista de productos al azar
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article
            key={product._id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
          >
            <Link href={`/productos/${product._id}`} className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={getImageUrl(product.images[0].url)}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain p-3"
                unoptimized
              />
            </Link>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div>
                <Link href={`/productos/${product._id}`}>
                  <h2 className="text-lg font-semibold text-azabache transition hover:text-latte">
                    {product.name}
                  </h2>
                </Link>
                <p className="mt-1 text-sm text-gris-pizarra line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-base font-bold text-latte">
                  ${product.price.toLocaleString("es-MX")} MXN
                </span>
                <Link href={`/productos/${product._id}`} >
                 <span className="rounded-full bg-azabache/5 px-3 py-1.5 text-xs font-medium text-azabache transition group-hover:bg-latte/10 group-hover:text-latte">
                        Ver detalle
                      </span>
                  </Link>
                
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
