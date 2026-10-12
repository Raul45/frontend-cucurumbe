import ProductImageSlider from "@/components/ProductSlider";
import { getBranch } from "@/services/branch.service";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";


export default async function SucursalDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sucursal = await getBranch(slug);

  if (!sucursal) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/sucursales"
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
        Volver a sucursales
      </Link>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/5 shadow-sm">
          <ProductImageSlider
            images={sucursal.images}
            productName={sucursal.name}
          />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-azabache sm:text-4xl">
              {sucursal.name}
            </h1>
            <p className="mt-4 text-base text-gris-pizarra">
                {`${sucursal.address.street} ${sucursal.address.exteriorNumber}, ${sucursal.address.neighborhood} `}
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 text-sm sm:text-base">
              <p>
                <span className="font-semibold text-azabache">Teléfono:</span>{" "}
                {sucursal.contact?.phone}
              </p>
              <p>
                <span className="font-semibold text-azabache">Dirección:</span>{" "}
                {`${sucursal.address.street} ${sucursal.address.exteriorNumber}, ${sucursal.address.neighborhood} `}
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
