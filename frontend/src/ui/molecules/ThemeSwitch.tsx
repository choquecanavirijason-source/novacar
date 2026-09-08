/**
 * Molecule · ThemeSwitch
 * Switch claro/oscuro para el Navbar: pastilla con thumb deslizante que
 * lleva el ícono del modo activo (sol = claro, luna = oscuro).
 */

"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useTheme } from "@core/theme/ThemeProvider";

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-switch ${isDark ? "theme-switch--dark" : ""}`}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? t("nav.themeToLight") : t("nav.themeToDark")}
      title={isDark ? t("nav.themeToLight") : t("nav.themeToDark")}
      onClick={toggleTheme}
    >
      <span className="theme-switch__track">
        <Sun className="theme-switch__icon theme-switch__icon--sun" size={11} strokeWidth={2} aria-hidden />
        <Moon className="theme-switch__icon theme-switch__icon--moon" size={11} strokeWidth={2} aria-hidden />
        <span className="theme-switch__thumb">
          {isDark ? (
            <Moon size={11} strokeWidth={2} aria-hidden />
          ) : (
            <Sun size={11} strokeWidth={2} aria-hidden />
          )}
        </span>
      </span>
    </button>
  );
}
