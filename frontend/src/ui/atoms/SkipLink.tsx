/**
 * Atom · SkipLink
 * Enlace de accesibilidad: invisible hasta recibir foco (tab), permite saltar
 * el Navbar e ir directo al contenido principal. Primer elemento del body.
 */

"use client";

import { useTranslation } from "@core/i18n/I18nProvider";

export function SkipLink() {
  const { t } = useTranslation();

  return (
    <a href="#main-content" className="skip-link">
      {t("common.skipToContent")}
    </a>
  );
}
