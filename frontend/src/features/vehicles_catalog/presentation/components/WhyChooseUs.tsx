/**
 * Presentation · Component · WhyChooseUs
 * Sección de razones/beneficios con iconos (estilo "¿Por qué elegirnos?").
 */

"use client";

import { Trophy, Rocket, Target, MessageCircle } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { SectionHeader } from "@ui/molecules/SectionHeader";
import "../styles/home.css";

export function WhyChooseUs() {
  const { t } = useTranslation();

  const items = [
    { Icon: Trophy, title: t("why.qualityTitle"), desc: t("why.qualityDesc") },
    { Icon: Rocket, title: t("why.shippingTitle"), desc: t("why.shippingDesc") },
    { Icon: Target, title: t("why.compatTitle"), desc: t("why.compatDesc") },
    { Icon: MessageCircle, title: t("why.supportTitle"), desc: t("why.supportDesc") },
  ];

  return (
    <section style={{ padding: "32px 0 64px" }}>
      <SectionHeader eyebrow="NOVACAR" title={t("home.whyTitle")} subtitle={t("home.whySub")} align="center" />
      <div className="why-grid">
        {items.map(({ Icon, title, desc }, i) => (
          <div key={title} className="why-card animate-in" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="why-card__icon">
              <Icon size={26} strokeWidth={2} aria-hidden />
            </span>
            <div className="why-card__title">{title}</div>
            <div className="why-card__desc">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
