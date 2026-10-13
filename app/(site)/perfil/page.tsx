import PerfilView, {
  type PerfilTab,
} from "@/components/site/PerfilView";

export default async function PerfilPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab: PerfilTab =
    tab === "direcciones" ? "direcciones" : "carrito";

  return <PerfilView initialTab={initialTab} />;
}
