import type { Metadata } from "next";
import SucursalForm, { NUEVO_ID } from "../../../../../components/admin/SucursalForm";

export const metadata: Metadata = {
  title: "Nueva sucursal · Panel Cucurumbe Café",
};

export default function NuevaSucursalPage() {
  return <SucursalForm id={NUEVO_ID} />;
}