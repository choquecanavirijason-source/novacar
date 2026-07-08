/**
 * Organism · Footer
 * Pie global traducido.
 */

"use client";

import Link from "next/link";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Logo } from "../atoms/Logo";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div style={{ maxWidth: 280 }}>
          <Logo />
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 10 }}>
            {t("footer.tagline")}
          </p>
        </div>

        <div className="footer__col">
          <span className="footer__title">{t("footer.explore")}</span>
          <Link href="/catalogo" className="footer__link">{t("nav.catalog")}</Link>
          <Link href="/buscador" className="footer__link">{t("nav.finder")}</Link>
          <Link href="/admin" className="footer__link">{t("nav.admin")}</Link>
        </div>

        <div className="footer__col">
          <span className="footer__title">{t("footer.company")}</span>
          <span className="footer__link">{t("footer.about")}</span>
          <span className="footer__link">{t("footer.contact")}</span>
          <span className="footer__link">{t("footer.careers")}</span>
        </div>
      </div>

      <div className="footer__bottom">
        © {2026} AutoDrive · {t("footer.rights")}
      </div>
    </footer>
  );
}
