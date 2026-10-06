import type { Metadata } from "next";
import SucursalesView from "../../../../components/admin/SucursalesView";

export const metadata: Metadata = {
  title: "Sucursales · Panel Cucurumbe Café",
};

export default function SucursalesPage() {
  return <SucursalesView />;
}