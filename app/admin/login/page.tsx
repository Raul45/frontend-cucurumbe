import type { Metadata } from "next";
import LoginForm from "../../../components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión · Panel Cucurumbe Café",
};

export default function LoginPage() {
  return <LoginForm />;
}