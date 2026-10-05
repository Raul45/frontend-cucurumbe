import Image from "next/image";
import Link from "next/link";

const MOCK_PRODUCTS = [
  {
    slug: "cafe-tostado-claro",
    name: "Café Tostado Claro",
    price: 185,
    image: "/images.jpg",
    description: "Café con tostado claro, notas florales y acidez brillante.",
  },
  {
    slug: "cafe-tostado-medio",
    name: "Café Tostado Medio",
    price: 195,
    image: "/images1.jpg",
    description: "Balance perfecto entre acidez y dulzura, ideal para diario.",
  },
  {
    slug: "cafe-tostado-oscuro",
    name: "Café Tostado Oscuro",
    price: 205,
    image: "/images.jpg",
    description: "Cuerpo intenso con notas a cacao y nuez.",
  },
  {
    slug: "cafe-molido-especial",
    name: "Café Molido Especial",
    price: 215,
    image: "/images1.jpg",
    description: "Mezcla especial molida lista para preparar.",
  },
  {
    slug: "cafe-granos-premium",
    name: "Granos Premium",
    price: 235,
    image: "/images.jpg",
    description: "Granos seleccionados de alta calidad.",
  },
  {
    slug: "cafe-espresso-blend",
    name: "Espresso Blend",
    price: 245,
    image: "/images1.jpg",
    description: "Blend pensado especialmente para espresso.",
  },
];

export default function ProductosPage() {
  const products = [...MOCK_PRODUCTS].sort(() => Math.random() - 0.5);

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
            key={product.slug}
            className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
          >
            <Link href={`/productos/${product.slug}`} className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </Link>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div>
                <Link href={`/productos/${product.slug}`}>
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
                <a
                  href="https://www.mercadopago.com.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-azabache transition hover:border-latte hover:text-latte"
                  aria-label="Comprar con MercadoPago"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
          </article>
        ))}
      </div>
    </div>
  );
}
