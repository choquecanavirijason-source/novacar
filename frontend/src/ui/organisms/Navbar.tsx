/**
 * Organism · Navbar
 * Barra fija, transparente, texto blanco, tipografía uppercase/bold/tracked.
 * 3 columnas (Flexbox): logo | enlaces centrales (absolutos al centro) | utilidades.
 * Enlaces centrales (Catálogo / Autopartes / Buscador) navegan directo, sin
 * abrir nada. La hamburguesa solo aparece en mobile (<860px) para mostrar
 * esos mismos enlaces en un drawer, ya que el bloque central se oculta ahí.
 * El círculo de perfil (junto al selector de idioma) navega directo a
 * /login o /admin — sin dropdown, actúa como acceso único.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CircleUserRound, Menu as MenuIcon, Search, X } from "lucide-react";
import { useAuth } from "@core/auth/AuthProvider";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Logo } from "../atoms/Logo";
import { LanguageSwitcher } from "../molecules/LanguageSwitcher";

const DRAWER_LINKS = [
  { href: "/catalogo", key: "nav.catalog" },
  { href: "/autopartes", key: "nav.parts" },
  { href: "/buscador", key: "nav.finder" },
  { href: "/importaciones", key: "nav.imports" },
] as const;

export function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner container">
        <div className="nav__logo">
          <Logo />
        </div>

        <nav className="nav__center" aria-label={t("nav.menu")}>
          {DRAWER_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav__link ${active ? "nav__link--active" : ""}`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="nav__right">
          <LanguageSwitcher />

          <Link
            href={isAuthenticated ? "/admin" : "/login"}
            className="nav__avatar"
            aria-label={isAuthenticated ? t("nav.account") : t("nav.login")}
          >
            {isAuthenticated && user ? (
              <span className="nav__avatar-initial">{user.name.charAt(0)}</span>
            ) : (
              <CircleUserRound size={19} strokeWidth={1.5} aria-hidden />
            )}
          </Link>

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
        </div>
      </div>
    </header>
  );
}
