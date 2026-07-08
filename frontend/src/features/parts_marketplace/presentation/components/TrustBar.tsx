/**
 * Presentation · Component · TrustBar (estilo Brator)
 * Barra de confianza con 4 beneficios. Usa el template FeatureGrid.
 */

"use client";

import { useTranslation } from "@core/i18n/I18nProvider";
import { FeatureGrid, type FeatureItem } from "@ui";

export function TrustBar() {
  const { t } = useTranslation();

  const items: FeatureItem[] = [
    { icon: "🚚", title: t("trust.deliveryT"), description: t("trust.deliveryD") },
    { icon: "🏆", title: t("trust.qualityT"), description: t("trust.qualityD") },
    { icon: "💬", title: t("trust.supportT"), description: t("trust.supportD") },
    { icon: "↩️", title: t("trust.returnsT"), description: t("trust.returnsD") },
  ];

  return <FeatureGrid items={items} />;
}
