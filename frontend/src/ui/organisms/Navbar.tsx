/**
 * Organism · Navbar
 * Barra fija, transparente, texto blanco, tipografía uppercase/bold/tracked.
 * 3 columnas (Flexbox): logo | enlaces centrales (absolutos al centro) | utilidades.
 * "MENU" (texto y hamburguesa) abren el mismo drawer con la navegación real.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu as MenuIcon, Search, X } from "lucide-react";
import { useAuth } from "@core/auth/AuthProvider";
import { useTranslation } from "@core/i18n/I18nProvider";
import { LOCALES } from "@core/i18n/dictionaries";
import { Logo } from "../atoms/Logo";

const DRAWER_LINKS = [
  { href: "/catalogo", key: "nav.catalog" },
  { href: "/autopartes", key: "nav.parts" },
  { href: "/buscador", key: "nav.finder" },
] as const;

export function Navbar() {
  const { t, locale, setLocale } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const cycleLocale = () => {
    const idx = LOCALES.indexOf(locale);
    setLocale(LOCALES[(idx + 1) % LOCALES.length]);
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__logo">
          <Logo />
        </div>

        <nav className="nav__center" aria-label={t("nav.catalog")}>
          {isAuthenticated ? (
            <button type="button" className="nav__link" onClick={logout}>
              {t("nav.logout")}
            </button>
          ) : (
            <Link href="/login" className="nav__link">
              {t("nav.login")}
            </Link>
          )}
          <Link href="/admin" className="nav__link">
            {t("nav.account")}
          </Link>
          <button
            type="button"
            className="nav__link"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
          >
            {t("nav.menu")}
          </button>
          <Link href="/buscador" className="nav__link">
            {t("nav.search")}
          </Link>
        </nav>

        <div className="nav__right">
          <button
            type="button"
            className="nav__lang"
            onClick={cycleLocale}
            aria-label={t("nav.language")}
          >
            <span>{locale.toUpperCase()}</span>
            <ChevronDown size={13} strokeWidth={2.5} aria-hidden />
          </button>

          <Link href="/buscador" className="nav__icon-btn" aria-label={t("nav.search")}>
            <Search size={17} strokeWidth={1.5} aria-hidden />
          </Link>

          <button
            type="button"
            className="nav__icon-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={t("nav.menu")}
          >
            {menuOpen ? (
              <X size={19} strokeWidth={1.5} aria-hidden />
            ) : (
              <MenuIcon size={19} strokeWidth={1.5} aria-hidden />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="nav__drawer" aria-label={t("nav.menu")}>
          {DRAWER_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav__drawer-link ${active ? "nav__drawer-link--active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
