import Image from "next/image";
import Link from "next/link";
import Slider from "../../components/Slider";
import { getProducts, Product } from "@/services/product.service";
import { getImageUrl } from "@/lib/admin/getImage";
import { getSlider, pageContent, slidesContent } from "@/services/page-content.sevice";

export default async function Home() {

  let products:Product[] = []
  let pageContet:pageContent;
  let slides:slidesContent[] = [];
  try {
    products = await getProducts();
    pageContet = await getSlider();
    console.log('======');
    console.log(pageContet);
    slides = pageContet?.slides ?? [];  
  } catch(e) {
    console.error("Error al cargar los productos:", e);
  }

  const shuffled = [...products]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);
  return (
    <div className="flex flex-col">
      <section className="px-4 pt-8 sm:px-6 sm:pt-12">
        <Slider slides={slides} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-azabache sm:text-3xl">
              Nuestros Productos
            </h3>
            <p className="mt-2 text-sm text-gris-pizarra sm:text-base">
              Una selección al azar para ti
            </p>
          </div>

          <Link
            href="/productos"
            className="inline-flex items-center gap-2 rounded-full bg-latte px-5 py-2.5 text-sm font-medium text-blanco-roto transition hover:bg-latte/90"
          >
            Ver todos los productos
          </Link>
        </div>

        {shuffled.length === 0 ? (
          <p className="py-10 text-center text-gris-pizarra">
            No hay productos disponibles por el momento.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shuffled.map((product) => {
              const image =
                product.images?.[0].url || "/images.jpg";

              return (
                <Link
                  key={product._id}
                  href={`/productos/${product._id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={getImageUrl(image)}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h4 className="text-lg font-semibold text-azabache">
                      {product.name}
                    </h4>

                    <div className="mt-auto flex items-center justify-between gap-3">
                      <span className="text-base font-bold text-latte">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: product.currency || "MXN",
                        }).format(product.price)}
                      </span>

                      <span className="rounded-full bg-azabache/5 px-3 py-1.5 text-xs font-medium text-azabache transition group-hover:bg-latte/10 group-hover:text-latte">
                        Ver detalle
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
