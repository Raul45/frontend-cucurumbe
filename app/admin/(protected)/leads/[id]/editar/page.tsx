import type { Metadata } from "next";
import LeadForm from "../../../../../../components/admin/LeadForm";

export const metadata: Metadata = {
  title: "Lead · Panel Cucurumbe Café",
};

export default async function EditarLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <LeadForm id={id} key={id} />;
}