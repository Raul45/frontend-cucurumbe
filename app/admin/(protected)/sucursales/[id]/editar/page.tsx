import type { Metadata } from "next";
import SucursalForm from "../../../../../../components/admin/SucursalForm";

export const metadata: Metadata = {
  title: "Sucursal · Panel Cucurumbe Café",
};

export default async function EditarSucursalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SucursalForm id={id} key={id} />;
}