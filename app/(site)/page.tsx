import Image from "next/image";
import Link from "next/link";
import Slider from "../../components/Slider";

const MOCK_PRODUCTS = [
  {
    slug: "cafe-tostado-claro",
    name: "Café Tostado Claro",
    price: 185,
    image: "/images.jpg",
  },
  {
    slug: "cafe-tostado-medio",
    name: "Café Tostado Medio",
    price: 195,
    image: "/images1.jpg",
  },
  {
    slug: "cafe-tostado-oscuro",
    name: "Café Tostado Oscuro",
    price: 205,
    image: "/images.jpg",
  },
  {
    slug: "cafe-molido-especial",
    name: "Café Molido Especial",
    price: 215,
    image: "/images1.jpg",
  },
  {
    slug: "cafe-colombiano",
    name: "Café Selección Premium",
    price: 235,
    image: "/images.jpg",
  },
  {
    slug: "cafe-espresso",
    name: "Café Espresso Blend",
    price: 245,
    image: "/images1.jpg",
  },
];

export default function Home() {
  const shuffled = [...MOCK_PRODUCTS].sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col">
      <section className="px-4 pt-8 sm:px-6 sm:pt-12">
        <Slider />
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
            className="inline-flex items-center gap-2 rounded-full bg-latte px-5 py-2.5 text-sm font-medium text-blanco-roto transition hover:bg-latte/90 focus:outline-none focus:ring-2 focus:ring-latte/40"
          >
            Ver todos los productos
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shuffled.slice(0, 6).map((product) => (
            <Link
              key={product.slug}
              href={`/productos/${product.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h4 className="text-lg font-semibold text-azabache">
                  {product.name}
                </h4>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-base font-bold text-latte">
                    ${product.price.toLocaleString("es-MX")} MXN
                  </span>
                  <div className="flex items-center gap-2 rounded-full bg-azabache/5 px-3 py-1.5 text-xs font-medium text-azabache transition group-hover:bg-latte/10 group-hover:text-latte">
                    Ver detalle
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
