/**
 * Presentation · Component · Testimonials
 * Sección de reseñas de clientes con calificación (prueba social).
 * Carrusel 3D "Coverflow" (Swiper.js): tarjetas HUD con esquinas recortadas
 * (clip-path), la reseña activa queda de frente al centro y las adyacentes
 * se inclinan en perspectiva — mismo lenguaje visual y tokens del sitio.
 */

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
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

      <Swiper
        className="testi-swiper"
        modules={[EffectCoverflow, Pagination]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        loop
        coverflowEffect={{ rotate: 40, stretch: 0, depth: 220, modifier: 1, slideShadows: true }}
        pagination={{ el: ".testi-swiper__pagination", clickable: true }}
      >
        {reviews.map((rv) => (
          <SwiperSlide key={rv.n} className="testi-hud-slide">
            <div className="testi-hud-card group">
              <div className="testi-hud-card__border" aria-hidden />

              <span className="testi-hud-card__quote" aria-hidden>
                &ldquo;
              </span>
              <blockquote className="testi-hud-card__text">{rv.q}</blockquote>

              <div className="testi-hud-card__footer">
                <span className="testi-hud-card__avatar" style={{ background: rv.gradient }}>
                  {rv.n.charAt(0)}
                </span>
                <span className="testi-hud-card__identity">
                  <span className="testi-hud-card__name">{rv.n}</span>
                  <span className="testi-hud-card__role">{rv.r}</span>
                </span>
                <span className="testi-hud-card__rating">
                  <RatingStars value={rv.rating} />
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="testi-swiper__pagination" />
    </section>
  );
}
