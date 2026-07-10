/**
 * Presentation · Component · WhyChooseUs
 * Sección "¿Por qué elegir NOVACAR?", estilo "Nodos Conectados": círculos
 * dorados con ícono lineal en negro, unidos por una línea con paradas.
 */

"use client";

import { Trophy, Rocket, Target, MessageCircle } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { SectionHeader } from "@ui/molecules/SectionHeader";
import { ConnectedNodes, type NodeItem } from "@ui";

const ICON_SIZE = { size: 26, strokeWidth: 1.75 } as const;

export function WhyChooseUs() {
  const { t } = useTranslation();

  const items: NodeItem[] = [
    { icon: <Trophy {...ICON_SIZE} aria-hidden />, title: t("why.qualityTitle"), description: t("why.qualityDesc") },
    { icon: <Rocket {...ICON_SIZE} aria-hidden />, title: t("why.shippingTitle"), description: t("why.shippingDesc") },
    { icon: <Target {...ICON_SIZE} aria-hidden />, title: t("why.compatTitle"), description: t("why.compatDesc") },
    { icon: <MessageCircle {...ICON_SIZE} aria-hidden />, title: t("why.supportTitle"), description: t("why.supportDesc") },
  ];

  return (
    <section style={{ padding: "32px 0 64px" }}>
      <SectionHeader eyebrow="NOVACAR" title={t("home.whyTitle")} subtitle={t("home.whySub")} align="center" />
      <ConnectedNodes items={items} />
    </section>
  );
}
