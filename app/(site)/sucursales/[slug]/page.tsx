import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const SUCURSALES: Record<
  string,
  {
    slug: string;
    nombre: string;
    direccion: string;
    telefono: string;
    horario: string;
    image: string;
    mapaUrl: string;
  }
> = {
  "francisco-villa": {
    slug: "francisco-villa",
    nombre: "Sucursal Blvd. Francisco Villa",
    direccion: "Blvd. Francisco Villa 1014, Jardines de Durango, 34200 Durango, Dgo.",
    telefono: "618 827 8158",
    horario: "Abierto · Cierra a las 10 p.m.",
    image: "/images.jpg",
    mapaUrl:
      "https://maps.google.com/maps?q=Blvd.+Francisco+Villa+1014+Jardines+de+Durango+34200+Durango+Dgo.&t=&z=17&ie=UTF8&iwloc=&output=embed",
  },
  "20-noviembre": {
    slug: "20-noviembre",
    nombre: "Sucursal Av. 20 de Noviembre",
    direccion: "Av. 20 de Noviembre 1902, Nueva Vizcaya, 34270 Durango, Dgo.",
    telefono: "618 810 0153",
    horario: "Abierto · Cierra a las 11 p.m.",
    image: "/images1.jpg",
    mapaUrl:
      "https://maps.google.com/maps?q=Av.+20+de+Noviembre+1902+Nueva+Vizcaya+34270+Durango+Dgo.&t=&z=17&ie=UTF8&iwloc=&output=embed",
  },
};

export default async function SucursalDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sucursal = SUCURSALES[slug];

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
          <Image
            src={sucursal.image}
            alt={sucursal.nombre}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-azabache sm:text-4xl">
              {sucursal.nombre}
            </h1>
            <p className="mt-4 text-base text-gris-pizarra">
              {sucursal.direccion}
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 text-sm sm:text-base">
              <p>
                <span className="font-semibold text-azabache">Teléfono:</span>{" "}
                {sucursal.telefono}
              </p>
              <p>
                <span className="font-semibold text-azabache">Horario:</span>{" "}
                {sucursal.horario}
              </p>
              <p>
                <span className="font-semibold text-azabache">Dirección:</span>{" "}
                {sucursal.direccion}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-azabache sm:text-xl">
          Mapa
        </h2>
        <div className="overflow-hidden rounded-2xl border border-black/5 shadow-sm">
          <iframe
            src={sucursal.mapaUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Mapa de ${sucursal.nombre}`}
          />
        </div>
      </div>
    </div>
  );
}
