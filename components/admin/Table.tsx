export type Columna<T> = {
  clave: string;
  titulo: string;
  render: (fila: T) => React.ReactNode;
  className?: string;
};

type TableProps<T> = {
  columnas: Columna<T>[];
  filas: T[];
  claveFila: (fila: T) => string;
  mensajeVacio?: string;
};

/** Tabla genérica para los listados del panel. */
export default function Table<T>({
  columnas,
  filas,
  claveFila,
  mensajeVacio = "Sin registros",
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-black/5 bg-blanco-roto text-xs uppercase tracking-wide text-gris-pizarra">
            {columnas.map((columna) => (
              <th
                key={columna.clave}
                scope="col"
                className={`px-4 py-3 font-medium ${columna.className ?? ""}`}
              >
                {columna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 ? (
            <tr>
              <td
                colSpan={columnas.length}
                className="px-4 py-10 text-center text-gris-pizarra"
              >
                {mensajeVacio}
              </td>
            </tr>
          ) : (
            filas.map((fila) => (
              <tr
                key={claveFila(fila)}
                className="border-b border-black/5 last:border-0 hover:bg-blanco-roto/60"
              >
                {columnas.map((columna) => (
                  <td
                    key={columna.clave}
                    className={`px-4 py-3 align-middle text-azabache ${columna.className ?? ""}`}
                  >
                    {columna.render(fila)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}