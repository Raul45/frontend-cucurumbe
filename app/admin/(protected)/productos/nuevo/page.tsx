import type { Metadata } from "next";
import ProductoForm, { NUEVO_ID } from "../../../../../components/admin/ProductoForm";

export const metadata: Metadata = {
  title: "Nuevo producto · Panel Cucurumbe Café",
};

export default function NuevoProductoPage() {
  return <ProductoForm id={NUEVO_ID} />;
}