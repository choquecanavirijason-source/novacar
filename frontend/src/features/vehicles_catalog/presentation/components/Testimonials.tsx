/**
 * Presentation · Component · Testimonials
 * Sección de reseñas de clientes con calificación (prueba social).
 */

"use client";

import { useTranslation } from "@core/i18n/I18nProvider";
import { SectionHeader } from "@ui/molecules/SectionHeader";
import { RatingStars } from "@ui/atoms/RatingStars";
import "../styles/home.css";

export function Testimonials() {
  const { t } = useTranslation();

  const reviews = [
    { q: t("testimonials.q1"), n: t("testimonials.n1"), r: t("testimonials.r1"), rating: 5, gradient: "var(--gradient-brand)" },
    { q: t("testimonials.q2"), n: t("testimonials.n2"), r: t("testimonials.r2"), rating: 5, gradient: "var(--gradient-brand-deep)" },
    { q: t("testimonials.q3"), n: t("testimonials.n3"), r: t("testimonials.r3"), rating: 4.5, gradient: "var(--gradient-brand-cool)" },
  ];

  return (
    <section style={{ padding: "32px 0 64px" }}>
      <SectionHeader
        eyebrow={t("testimonials.eyebrow")}
        title={t("testimonials.title")}
        subtitle={t("testimonials.subtitle")}
        align="center"
      />
      <div className="testi-grid">
        {reviews.map((rv, i) => (
          <figure key={rv.n} className="testi-card animate-in" style={{ animationDelay: `${i * 70}ms` }}>
            <span className="testi-quote" aria-hidden>“</span>
            <blockquote className="testi-text">{rv.q}</blockquote>
            <figcaption className="testi-author">
              <span className="testi-avatar" style={{ background: rv.gradient }}>
                {rv.n.charAt(0)}
              </span>
              <span>
                <span className="testi-name">{rv.n}</span>
                <span className="testi-role">{rv.r}</span>
              </span>
              <span style={{ marginLeft: "auto" }}>
                <RatingStars value={rv.rating} />
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
