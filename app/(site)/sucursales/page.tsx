import Image from "next/image";
import Link from "next/link";

const SUCURSALES = [
  {
    slug: "francisco-villa",
    nombre: "Sucursal Blvd. Francisco Villa",
    direccion: "Blvd. Francisco Villa 1014, Jardines de Durango, 34200 Durango, Dgo.",
    telefono: "618 827 8158",
    horario: "Abierto · Cierra a las 10 p.m.",
    image: "/images.jpg",
  },
  {
    slug: "20-noviembre",
    nombre: "Sucursal Av. 20 de Noviembre",
    direccion: "Av. 20 de Noviembre 1902, Nueva Vizcaya, 34270 Durango, Dgo.",
    telefono: "618 810 0153",
    horario: "Abierto · Cierra a las 11 p.m.",
    image: "/images1.jpg",
  },
];

export default function SucursalesPage() {
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
        {SUCURSALES.map((sucursal) => (
          <Link
            key={sucursal.slug}
            href={`/sucursales/${sucursal.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={sucursal.image}
                alt={sucursal.nombre}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <h2 className="text-lg font-semibold text-azabache transition group-hover:text-latte">
                {sucursal.nombre}
              </h2>
              <p className="text-sm text-gris-pizarra">
                {sucursal.direccion}
              </p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-gris-pizarra">
                  Tel: {sucursal.telefono}
                </span>
                <span className="text-latte">{sucursal.horario}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
