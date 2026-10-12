import Link from "next/link";

type PageHeaderProps = {
  titulo: string;
  descripcion?: string;
  accion?: React.ReactNode;
  volverHref?: string;
  volverLabel?: string;
};

export default function PageHeader({
  titulo,
  descripcion,
  accion,
  volverHref,
  volverLabel = "Volver",
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {volverHref ? (
          <Link
            href={volverHref}
            className="mb-2 inline-flex items-center gap-1 text-sm text-gris-pizarra transition hover:text-latte"
          >
            <span aria-hidden="true">&larr;</span> {volverLabel}
          </Link>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight text-azabache sm:text-3xl">
          {titulo}
        </h1>
        {descripcion ? (
          <p className="mt-1 text-sm text-gris-pizarra">{descripcion}</p>
        ) : null}
      </div>
      {accion ? <div className="shrink-0">{accion}</div> : null}
    </div>
  );
}