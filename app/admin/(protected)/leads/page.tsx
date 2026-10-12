import type { Metadata } from "next";
import LeadsView from "../../../../components/admin/LeadsView";

export const metadata: Metadata = {
  title: "Leads · Panel Cucurumbe Café",
};

export default function LeadsPage() {
  return <LeadsView />;
}