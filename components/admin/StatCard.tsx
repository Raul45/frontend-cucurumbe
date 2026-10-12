type StatCardProps = {
  etiqueta: string;
  valor: string;
  detalle?: string;
  icono?: React.ReactNode;
};

export default function StatCard({
  etiqueta,
  valor,
  detalle,
  icono,
}: StatCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      {icono ? (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blanco-roto text-latte">
          {icono}
        </div>
      ) : null}
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-gris-pizarra">
          {etiqueta}
        </p>
        <p className="mt-1 truncate text-2xl font-bold text-azabache">{valor}</p>
        {detalle ? (
          <p className="mt-1 text-xs text-gris-pizarra">{detalle}</p>
        ) : null}
      </div>
    </div>
  );
}