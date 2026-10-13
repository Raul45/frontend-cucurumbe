"use client";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  type CurrentUser,
  type LoginRequest,
} from "@/services/auth.service";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext, type AuthContextValue } from "./auth-context";
import LoginModal from "./LoginModal";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const current = await getCurrentUser();
      setUser(current);
      return current;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let activo = true;

    async function cargarSesion() {
      await refresh();
      if (activo) setLoading(false);
    }

    cargarSesion();

    return () => {
      activo = false;
    };
  }, [refresh]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      await loginRequest(credentials);
      await refresh();
      setLoginOpen(false);
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      loginOpen,
      openLogin: () => setLoginOpen(true),
      closeLogin: () => setLoginOpen(false),
      refresh,
      login,
      logout,
    }),
    [user, loading, loginOpen, refresh, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal />
    </AuthContext.Provider>
  );
}
