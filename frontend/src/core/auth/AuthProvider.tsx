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
import { createUser, emailIsTaken, findUserByCredentials } from "./mockUsersStore";
import type { AuthUser } from "./types";

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Devuelve el usuario autenticado (null si las credenciales no son válidas). */
  login: (email: string, password: string) => Promise<AuthUser | null>;
  /** Devuelve el usuario creado, o "email-taken" si el correo ya está registrado. */
  register: (input: RegisterInput) => Promise<AuthUser | "email-taken">;
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
    if (!email.trim() || !password) return null;

    if (!useApi) {
      const found = findUserByCredentials(email, password);
      if (!found) return null;
      setUser(found);
      persistUser(found);
      setAuthToken("mock-token");
      return found;
    }

    try {
      const res = await createApiClient().post<AuthResponse, { email: string; password: string }>(
        "/auth/login",
        { email: email.trim(), password },
      );
      setUser(res.user);
      persistUser(res.user);
      setAuthToken(res.token);
      return res.user;
    } catch {
      return null;
    }
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    if (!useApi) {
      if (emailIsTaken(input.email)) return "email-taken" as const;
      const created = createUser(input);
      setUser(created);
      persistUser(created);
      setAuthToken("mock-token");
      return created;
    }

    try {
      const res = await createApiClient().post<AuthResponse, RegisterInput>("/auth/register", input);
      setUser(res.user);
      persistUser(res.user);
      setAuthToken(res.token);
      return res.user;
    } catch {
      return "email-taken" as const;
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
      register,
      logout,
    }),
    [user, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>.");
  return ctx;
}