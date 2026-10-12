"use client";

import { getCurrentUser } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const data = await getCurrentUser();
        console.log(data);
        setAutenticado(true);
      } catch {
        console.log('no cookie');
        setAutenticado(false);
        router.replace("/admin/login");
      } finally {
        console.log('no cookie finally');
        setLoading(false);
      }
    }

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="flex items-center gap-3 text-sm text-gris-pizarra">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-latte" />
          Verificando sesión…
        </div>
      </div>
    );
  }

  if (!autenticado) {
    return null;
  }

  return <>{children}</>;
}
