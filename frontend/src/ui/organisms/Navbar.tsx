/**
 * Organism · Navbar
 * Cabecera global: logo + navegación (traducida) + sesión + conmutador de idioma.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@core/auth/AuthProvider";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Logo } from "../atoms/Logo";
import { LanguageSwitcher } from "../molecules/LanguageSwitcher";
import { Button } from "../atoms/Button";

const PUBLIC_LINKS = [
  { href: "/catalogo", key: "nav.catalog" },
  { href: "/autopartes", key: "nav.parts" },
  { href: "/buscador", key: "nav.finder" },
] as const;

export function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Logo />
        <nav className="navbar__nav">
          {PUBLIC_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar__link ${active ? "navbar__link--active" : ""}`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>
        <div className="navbar__actions">
          {!isAuthenticated && (
            <Button href="/login" variant="ghost" size="sm">
              {t("auth.signIn")}
            </Button>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}