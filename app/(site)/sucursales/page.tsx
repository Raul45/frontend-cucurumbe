import { getImageUrl } from "@/lib/admin/getImage";
import { Branch, getBranches } from "@/services/branch.service";
import Image from "next/image";
import Link from "next/link";

export default async function SucursalesPage() {
  let sucursales:Branch[] = [];
  try {
    sucursales = await getBranches();
  } catch(e) {
    console.log('Error en la obtencion de sucursales', e);
  }
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-azabache sm:text-4xl">
          Sucursales
        </h1>
        <p className="mt-2 text-sm text-gris-pizarra sm:text-base">
          Conoce nuestras sucursales
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {sucursales.map((sucursal) => (
          <Link
            key={sucursal._id}
            href={`/sucursales/${sucursal._id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={getImageUrl(sucursal.images[0].url)}
                alt={sucursal.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <h2 className="text-lg font-semibold text-azabache transition group-hover:text-latte">
                {sucursal.name}
              </h2>
              <p className="text-sm text-gris-pizarra">
                {`${sucursal.address.street} ${sucursal.address.exteriorNumber}, ${sucursal.address.neighborhood} `}
              </p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-gris-pizarra">
                  Tel: {sucursal.contact?.phone}
                </span>
                <span className="rounded-full bg-azabache/5 px-3 py-1.5 text-xs font-medium text-azabache transition group-hover:bg-latte/10 group-hover:text-latte">
                        Ver detalle
                      </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
