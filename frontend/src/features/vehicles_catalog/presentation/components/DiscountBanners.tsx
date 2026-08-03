/**
 * Presentation · Component · DiscountBanners
 * Franja de banners promocionales gestionados desde el panel admin
 * (módulo `site_banners`). No renderiza nada si no hay banners activos.
 */

"use client";

import { useEffect } from "react";
import { useBannerStore } from "@features/site_banners/presentation/store/useBannerStore";
import { Button } from "@ui/atoms/Button";

export function DiscountBanners() {
  const { banners, loadActive } = useBannerStore();

  useEffect(() => {
    void loadActive();
  }, [loadActive]);

  if (banners.length === 0) return null;

  return (
    <div className="promo-banners">
      {banners.map((banner) => (
        <div key={banner.id} className="promo-banner">
          <span
            className="promo-banner__bg"
            aria-hidden
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
          />
          <span
            className="promo-banner__scrim"
            aria-hidden
            style={{
              background: `linear-gradient(180deg, ${banner.accentFrom}00 0%, ${banner.accentFrom}cc 100%)`,
            }}
          />
          <span>
            <span className="promo-banner__title">{banner.title}</span>
            {banner.subtitle && <span className="promo-banner__subtitle">{banner.subtitle}</span>}
            <span className="promo-banner__cta">
              <Button size="sm" href={banner.href}>
                {banner.ctaLabel}
              </Button>
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
