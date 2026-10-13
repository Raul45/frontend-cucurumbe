"use client";

import type { CurrentUser, LoginRequest } from "@/services/auth.service";
import { createContext, useContext } from "react";

export interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  refresh: () => Promise<CurrentUser | null>;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
}
