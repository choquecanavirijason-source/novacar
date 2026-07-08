/**
 * Presentation · Component · DiscountBanners
 * Fila de banners promocionales (envío gratis / hasta -50% / garantía), estilo e-commerce.
 */

"use client";

import Link from "next/link";
import { useTranslation } from "@core/i18n/I18nProvider";
import "../styles/home.css";

export function DiscountBanners() {
  const { t } = useTranslation();

  const banners = [
    { icon: "🚚", title: t("promo.shipTitle"), desc: t("promo.shipDesc"), from: "#3d6bff", to: "#22e0ff" },
    { icon: "🔥", title: t("promo.offTitle"), desc: t("promo.offDesc"), from: "#ff5d73", to: "#ff9b3d" },
    { icon: "🛡️", title: t("promo.warrantyTitle"), desc: t("promo.warrantyDesc"), from: "#2ee6a6", to: "#22e0ff" },
  ];

  return (
    <div className="promo-row">
      {banners.map((b) => (
        <Link
          key={b.title}
          href="/autopartes"
          className="promo-card"
          style={{ background: `linear-gradient(130deg, ${b.from}, ${b.to})` }}
        >
          <span className="promo-card__icon">{b.icon}</span>
          <div>
            <div className="promo-card__title">{b.title}</div>
            <div className="promo-card__desc">{b.desc}</div>
            <span className="promo-card__cta">{t("promo.shop")} →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
