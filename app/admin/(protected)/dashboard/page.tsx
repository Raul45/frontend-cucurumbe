import type { Metadata } from "next";
import DashboardView from "../../../../components/admin/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard · Panel Cucurumbe Café",
};

export default function DashboardPage() {
  return <DashboardView />;
}