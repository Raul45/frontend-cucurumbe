import type { Metadata } from "next";
import ProductoForm from "../../../../../../components/admin/ProductoForm";

export const metadata: Metadata = {
  title: "Producto · Panel Cucurumbe Café",
};

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProductoForm id={id} key={id} />;
}