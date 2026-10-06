import type { Metadata } from "next";
import ProductosView from "../../../../components/admin/ProductosView";

export const metadata: Metadata = {
  title: "Productos · Panel Cucurumbe Café",
};

export default function ProductosPage() {
  return <ProductosView />;
}