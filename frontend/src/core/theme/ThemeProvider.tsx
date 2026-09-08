/**
 * Core · Theme · ThemeProvider
 * Contexto de modo claro/oscuro (client). Persiste la preferencia en
 * localStorage y refleja el tema activo como `data-theme` en <html>, que es
 * lo que consumen los tokens de @theme/globals.css. Default: claro.
 * El script inline en app/layout.tsx aplica el tema guardado antes del
 * primer paint (evita el flash de tema incorrecto al recargar).
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

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "autodrive.theme";

function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    // Claro es el default de :root — sin atributo alcanza, pero se deja
    // explícito por si un toggle previo dejó data-theme="dark" puesto.
    document.documentElement.setAttribute("data-theme", "light");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  // Restaurar preferencia al montar (evita mismatch de hidratación: solo en
  // cliente, igual que I18nProvider). El script inline del <head> ya aplicó
  // el atributo antes del paint; esto sincroniza el estado de React con él.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme = saved === "dark" ? "dark" : "light";
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>.");
  return ctx;
}

/** Script inline (ver app/layout.tsx <head>): aplica el tema guardado antes
 *  del primer paint para no flashear claro→oscuro en cada recarga. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)});if(t==="dark")document.documentElement.setAttribute("data-theme","dark");}catch(e){}})();`;
