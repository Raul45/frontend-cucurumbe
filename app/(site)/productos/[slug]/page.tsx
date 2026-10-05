import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const MOCK_PRODUCTS: Record<
  string,
  {
    slug: string;
    name: string;
    price: number;
    image: string;
    description: string;
  }
> = {
  "cafe-tostado-claro": {
    slug: "cafe-tostado-claro",
    name: "Café Tostado Claro",
    price: 185,
    image: "/images.jpg",
    description:
      "Café con tostado claro, notas florales y cítricas, acidez brillante y cuerpo ligero.",
  },
  "cafe-tostado-medio": {
    slug: "cafe-tostado-medio",
    name: "Café Tostado Medio",
    price: 195,
    image: "/images1.jpg",
    description:
      "Balance perfecto entre acidez y dulzura, con notas a caramelo. Ideal para consumo diario.",
  },
  "cafe-tostado-oscuro": {
    slug: "cafe-tostado-oscuro",
    name: "Café Tostado Oscuro",
    price: 205,
    image: "/images.jpg",
    description:
      "Cuerpo intenso, con notas a cacao, nuez tostada y final prolongado.",
  },
  "cafe-molido-especial": {
    slug: "cafe-molido-especial",
    name: "Café Molido Especial",
    price: 215,
    image: "/images1.jpg",
    description: "Mezcla especial molida lista para preparar en tu método favorito.",
  },
  "cafe-granos-premium": {
    slug: "cafe-granos-premium",
    name: "Granos Premium",
    price: 235,
    image: "/images.jpg",
    description: "Granos enteros seleccionados de alta calidad para mayor frescura.",
  },
  "cafe-espresso-blend": {
    slug: "cafe-espresso-blend",
    name: "Espresso Blend",
    price: 245,
    image: "/images1.jpg",
    description: "Blend diseñado para espresso con crema densa y sabor equilibrado.",
  },
};

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS[slug];

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
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-azabache sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-base text-gris-pizarra">
            {product.description}
          </p>
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <span className="text-2xl font-bold text-latte">
              ${product.price.toLocaleString("es-MX")} MXN
            </span>
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
