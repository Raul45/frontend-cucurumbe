"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoneda, formatNumero } from "../../lib/admin/format";
import type { Producto, VentaCategoria, VentaMes } from "../../lib/admin/types";

const PALETA = ["#1a1a1a", "#a88c74", "#6c6f73", "#c9b49c"];

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.08)",
  fontSize: 12,
  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
};

const ejeStyle = { fontSize: 12, fill: "#6c6f73" };

/** Los tipos de recharts widened (ValueType/NameType admiten listas y undefined). */
type ValorTooltip = number | string | readonly (number | string)[] | undefined;

function formatearVentas(value: ValorTooltip, name: ValorTooltip): [string, string] {
  const monto = Number(value ?? 0);
  return String(name) === "ventas"
    ? [formatMoneda(monto), "Ventas"]
    : [formatNumero(monto), "Pedidos"];
}

function formatearStock(value: ValorTooltip): [string, string] {
  return [`${formatNumero(Number(value ?? 0))} unidades`, "Stock"];
}

export function VentasPorMesChart({ datos }: { datos: VentaMes[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis dataKey="mes" tick={ejeStyle} axisLine={false} tickLine={false} />
          <YAxis
            tick={ejeStyle}
            axisLine={false}
            tickLine={false}
            width={72}
            tickFormatter={(value: number) => `$${formatNumero(value / 1000)}k`}
          />
          <Tooltip contentStyle={tooltipStyle} formatter={formatearVentas} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "#6c6f73" }}
            formatter={(value: string) => (value === "ventas" ? "Ventas" : "Pedidos")}
          />
          <Bar dataKey="ventas" fill="#1a1a1a" radius={[6, 6, 0, 0]} maxBarSize={28} />
          <Line
            type="monotone"
            dataKey="pedidos"
            stroke="#a88c74"
            strokeWidth={2}
            dot={{ r: 2, fill: "#a88c74" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function VentasPorCategoriaChart({
  datos,
}: {
  datos: VentaCategoria[];
}) {
  const total = datos.reduce((acc, item) => acc + item.ventas, 0);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={datos}
            dataKey="ventas"
            nameKey="categoria"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {datos.map((item, index) => (
              <Cell key={item.categoria} fill={PALETA[index % PALETA.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: ValorTooltip, name: ValorTooltip) => [
              `${formatMoneda(Number(value ?? 0))} · ${Math.round(
                (Number(value ?? 0) / total) * 100,
              )}%`,
              String(name),
            ]}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#6c6f73" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StockPorProductoChart({ productos }: { productos: Producto[] }) {
  const datos = [...productos]
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6)
    .map((producto) => ({ nombre: producto.nombre, stock: producto.stock }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={datos}
          layout="vertical"
          margin={{ top: 8, right: 16, bottom: 0, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
          <XAxis type="number" tick={ejeStyle} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="nombre"
            tick={ejeStyle}
            axisLine={false}
            tickLine={false}
            width={130}
          />
          <Tooltip contentStyle={tooltipStyle} formatter={formatearStock} />
          <Bar dataKey="stock" fill="#a88c74" radius={[0, 6, 6, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}