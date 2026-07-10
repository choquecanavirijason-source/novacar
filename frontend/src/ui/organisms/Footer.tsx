/**
 * Organism · Footer
 * Pie global traducido, 4 columnas: marca, enlaces rápidos, contacto, newsletter.
 */

"use client";

import Link from "next/link";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Logo } from "../atoms/Logo";

const QUICK_LINKS = [
  { href: "/", key: "nav.home" },
  { href: "/catalogo", key: "nav.catalog" },
  { href: "/autopartes", key: "nav.parts" },
  { href: "/buscador", key: "nav.finder" },
  { href: "/admin", key: "nav.admin" },
] as const;

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__col">
          <Logo />
          <p className="footer__desc">{t("footer.tagline")}</p>
        </div>

        <div className="footer__col">
          <span className="footer__title">{t("footer.explore")}</span>
          {QUICK_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="footer__link">
              {t(link.key)}
            </Link>
          ))}
        </div>

        <div className="footer__col">
          <span className="footer__title">{t("footer.contact")}</span>
          <span className="footer__text">{t("footer.contactAddress")}</span>
          <span className="footer__text">{t("footer.contactPhone")}</span>
          <span className="footer__text">{t("footer.contactEmail")}</span>
        </div>

        <div className="footer__col">
          <span className="footer__title">{t("footer.newsletterTitle")}</span>
          <p className="footer__text">{t("footer.newsletterDesc")}</p>
        </div>
      </div>

      <div className="footer__bottom">
        © {2026} NOVACAR · {t("footer.rights")}
      </div>
    </footer>
  );
}
