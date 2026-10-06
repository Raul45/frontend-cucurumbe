const base =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-azabache outline-none transition placeholder:text-gris-pizarra/60 focus:border-latte focus:ring-2 focus:ring-latte/30";

type CampoProps = {
  label: string;
  name: string;
  hint?: string;
  step?:string|number;
  type?:string;
};

export function CampoTexto({
  label,
  name,
  hint,
  type = "text",
  value,
  onChange,
  step,
  maxLength,
  required,
  min,
  placeholder,
}: CampoProps & {
  type?: "text" | "number" | "email" | "url" | "time"| "tel";
  value: string;
  maxLength?:number,
  onChange: (value: string) => void;
  required?: boolean;
  min?: string | number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-azabache">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        min={min}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        step={step}
        className={base}
      />
      {hint ? <span className="mt-1 block text-xs text-gris-pizarra">{hint}</span> : null}
    </label>
  );
}

export function CampoArea({
  label,
  name,
  value,
  onChange,
  rows = 4,
  required,
  placeholder,
  hint,
}: CampoProps & {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-azabache">{label}</span>
      <textarea
        name={name}
        value={value}
        rows={rows}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`${base} resize-y`}
      />
      {hint ? <span className="mt-1 block text-xs text-gris-pizarra">{hint}</span> : null}
    </label>
  );
}

export function CampoSelect({
  label,
  name,
  value,
  onChange,
  opciones,
  hint,
}: CampoProps & {
  value: string;
  onChange: (value: string) => void;
  opciones: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-azabache">{label}</span>
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={base}
      >
        {opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
      {hint ? <span className="mt-1 block text-xs text-gris-pizarra">{hint}</span> : null}
    </label>
  );
}