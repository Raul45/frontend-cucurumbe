"use client";

import Link from "next/link";
import {
  StockPorProductoChart,
  VentasPorCategoriaChart,
  VentasPorMesChart,
} from "./Charts";
import { useAdminData } from "./AdminDataProvider";
import PageHeader from "./PageHeader";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";
import { BoxIcon, MailIcon, StoreIcon } from "./icons";
import { VENTAS_POR_CATEGORIA, VENTAS_POR_MES } from "../../lib/admin/mock-data";
import { formatFecha, formatMoneda, formatNumero } from "../../lib/admin/format";

export default function DashboardView() {
  const { productos, sucursales, leads, restaurarDatos } = useAdminData();

  const leadsPendientes = leads.filter((lead) => lead.status === "pendiente");
  const unidades = productos.reduce((acc, p) => acc + p.stock, 0);
  const inventario = productos.reduce((acc, p) => acc + p.stock * p.precio, 0);
  const ventaActual = VENTAS_POR_MES[VENTAS_POR_MES.length - 1];
  const ventaPrevia = VENTAS_POR_MES[VENTAS_POR_MES.length - 2];
  const variacion = ((ventaActual.ventas - ventaPrevia.ventas) / ventaPrevia.ventas) * 100;

  return (
    <div>
      <PageHeader
        titulo="Dashboard"
        descripcion="Resumen de ventas, inventario y leads del mes."
        accion={
          <button
            type="button"
            onClick={restaurarDatos}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-azabache transition hover:border-latte hover:text-latte"
          >
            Restaurar datos demo
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          etiqueta={`Ventas ${ventaActual.mes}`}
          valor={formatMoneda(ventaActual.ventas)}
          detalle={`${variacion >= 0 ? "+" : ""}${variacion.toFixed(1)}% vs ${ventaPrevia.mes}`}
          icono={<BoxIcon />}
        />
        <StatCard
          etiqueta="Pedidos del mes"
          valor={formatNumero(ventaActual.pedidos)}
          detalle="Datos de demostración"
          icono={<BoxIcon />}
        />
        <StatCard
          etiqueta="Leads pendientes"
          valor={formatNumero(leadsPendientes.length)}
          detalle={`${leads.length} leads en total`}
          icono={<MailIcon />}
        />
        <StatCard
          etiqueta="Sucursales"
          valor={formatNumero(sucursales.length)}
          detalle={`Valor de inventario ${formatMoneda(inventario)}`}
          icono={<StoreIcon />}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-azabache">
            Ventas y pedidos por mes
          </h2>
          <VentasPorMesChart datos={VENTAS_POR_MES} />
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-azabache">
            Ventas por categoría
          </h2>
          <VentasPorCategoriaChart datos={VENTAS_POR_CATEGORIA} />
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-azabache">
            Productos con menor stock
          </h2>
          <StockPorProductoChart productos={productos} />
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-azabache">Leads recientes</h2>
            <Link
              href="/admin/leads"
              className="text-xs font-medium text-latte transition hover:text-azabache"
            >
              Ver todos
            </Link>
          </div>
          <ul className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <li key={lead.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-azabache">
                    {lead.nombre}
                  </p>
                  <p className="truncate text-xs text-gris-pizarra">
                    {formatFecha(lead.fecha)} · {lead.correo}
                  </p>
                </div>
                <StatusBadge status={lead.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="mt-6 text-xs text-gris-pizarra">
        {productos.length} productos · {formatNumero(unidades)} unidades en inventario ·
        datos de demostración.
      </p>
    </div>
  );
}