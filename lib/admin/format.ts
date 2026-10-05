const moneda = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
});

const numero = new Intl.NumberFormat("es-MX");

export function formatMoneda(valor: number) {
  return moneda.format(valor);
}

export function formatNumero(valor: number) {
  return numero.format(valor);
}

export function formatFecha(iso: string) {
  const [anio, mes, dia] = iso.split("-").map(Number);
  if (!anio || !mes || !dia) return iso;
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(anio, mes - 1, dia));
}