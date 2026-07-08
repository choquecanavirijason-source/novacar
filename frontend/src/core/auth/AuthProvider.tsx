/**
 * Core · Auth · AuthProvider
 * Sesión contra API Laravel (Sanctum). Fallback mock sin API.
 */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createApiClient } from "@core/http/createApiClient";
import { getAuthToken, setAuthToken } from "./token";
import type { AuthUser } from "./types";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "autodrive.session";
const useApi = process.env.NEXT_PUBLIC_USE_API === "true";

interface AuthResponse {
  user: AuthUser;
  token: string;
}

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredUser();
    const token = getAuthToken();
    if (stored && token) {
      setUser(stored);
    } else {
      persistUser(null);
      setAuthToken(null);
    }
    setReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim()) return false;

    if (!useApi) {
      const session: AuthUser = {
        id: "1",
        name: "Admin AutoDrive",
        email: email.trim(),
        role: "admin",
      };
      setUser(session);
      persistUser(session);
      setAuthToken("mock-token");
      return true;
    }

    try {
      const res = await createApiClient().post<AuthResponse, { email: string; password: string }>(
        "/auth/login",
        { email: email.trim(), password },
      );
      setUser(res.user);
      persistUser(res.user);
      setAuthToken(res.token);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    if (useApi && getAuthToken()) {
      void createApiClient(getAuthToken()).post("/auth/logout", {});
    }
    setUser(null);
    persistUser(null);
    setAuthToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: ready ? user : null,
      isAuthenticated: ready && user !== null,
      login,
      logout,
    }),
    [user, ready, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>.");
  return ctx;
}