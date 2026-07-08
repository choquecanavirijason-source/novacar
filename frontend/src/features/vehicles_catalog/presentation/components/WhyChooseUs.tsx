/**
 * Presentation · Component · WhyChooseUs
 * Sección de razones/beneficios con iconos (estilo "¿Por qué elegirnos?").
 */

"use client";

import { useTranslation } from "@core/i18n/I18nProvider";
import { SectionHeader } from "@ui/molecules/SectionHeader";
import "../styles/home.css";

export function WhyChooseUs() {
  const { t } = useTranslation();

  const items = [
    { icon: "🏆", title: t("why.qualityTitle"), desc: t("why.qualityDesc") },
    { icon: "🚀", title: t("why.shippingTitle"), desc: t("why.shippingDesc") },
    { icon: "🎯", title: t("why.compatTitle"), desc: t("why.compatDesc") },
    { icon: "💬", title: t("why.supportTitle"), desc: t("why.supportDesc") },
  ];

  return (
    <section style={{ padding: "32px 0 64px" }}>
      <SectionHeader eyebrow="AutoDrive" title={t("home.whyTitle")} subtitle={t("home.whySub")} align="center" />
      <div className="why-grid">
        {items.map((it, i) => (
          <div key={it.title} className="why-card animate-in" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="why-card__icon">{it.icon}</span>
            <div className="why-card__title">{it.title}</div>
            <div className="why-card__desc">{it.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
