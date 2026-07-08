/**
 * Presentation · Component · FeaturedVehicles
 * Carrusel de autos destacados con un bloque lateral de autopartes populares.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { catalogUseCases } from "../../di";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Eyebrow } from "@ui/atoms/Eyebrow";
import { Skeleton } from "@ui/atoms/Skeleton";
import type { MarketplacePart } from "../../../parts_marketplace/domain/entities/MarketplacePart";
import { emptyFilters } from "../../../parts_marketplace/domain/entities/PartFilters";
import { marketplaceUseCases } from "../../../parts_marketplace/di";
import { vehiclePhotoUrl } from "../vehiclePresentation";
import "../styles/catalog.css";

const currencyFormatter = (value: number, locale: string) =>
  new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);

export function FeaturedVehicles() {
  const { t, locale } = useTranslation();
  const [vehicles, setVehicles] = useState<CatalogVehicle[] | null>(null);
  const [parts, setParts] = useState<MarketplacePart[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    void Promise.all([
      catalogUseCases.getFeaturedVehicles.execute(),
      marketplaceUseCases.searchParts.execute(emptyFilters()),
    ]).then(([featuredVehicles, marketplaceParts]) => {
      setVehicles(featuredVehicles);
      setParts(marketplaceParts);
    });
  }, []);

  useEffect(() => {
    if (!vehicles || vehicles.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % vehicles.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [vehicles]);

  const currentVehicle = vehicles?.[activeIndex];
  const currentParts = useMemo(() => {
    if (!parts || parts.length === 0) return [];
    const start = activeIndex % parts.length;
    return parts.slice(start, start + 3);
  }, [activeIndex, parts]);

  return (
    <section style={{ padding: "16px 0 64px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 22 }}>
        <div>
          <Eyebrow>{t("featured.eyebrow")}</Eyebrow>
          <h2 style={{ fontSize: "1.7rem", fontWeight: 800, marginTop: 10 }}>{t("featured.title")}</h2>
        </div>
        <Link href="/catalogo" style={{ color: "var(--accent-neon)", fontWeight: 700, fontSize: "0.92rem" }}>
          {t("common.seeAll")} →
        </Link>
      </div>

      {vehicles === null || parts === null ? (
        <div className="featured-carousel featured-carousel--loading">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={220} radius="var(--radius-lg)" />
          ))}
        </div>
      ) : currentVehicle ? (
        <div className="featured-carousel">
          <div className="featured-carousel__slide">
            <img
              className="featured-carousel__image"
              src={vehiclePhotoUrl(currentVehicle.id, currentVehicle.brand, currentVehicle.bodyType, {
                w: 1600,
                h: 1000,
              })}
              alt={`${currentVehicle.brand} ${currentVehicle.model}`}
            />

            <div className="featured-carousel__content">
              <div className="featured-carousel__vehicle">
                <span className="featured-carousel__tag">{t("featured.eyebrow")}</span>
                <h3 className="featured-carousel__title">
                  {currentVehicle.brand} {currentVehicle.model}
                </h3>
                <p className="featured-carousel__subtitle">
                  {currentVehicle.year} · {currentVehicle.condition === "nuevo" ? t("common.new") : t("common.used")}
                </p>
                <p className="featured-carousel__desc">{currentVehicle.tagline}</p>
                <Link href={`/catalogo/${currentVehicle.id}`} className="featured-carousel__cta">
                  {t("showcase.readMore")}
                </Link>
              </div>

              <div className="featured-carousel__parts">
                <div className="featured-carousel__parts-head">
                  <h4>{t("featured.popularParts")}</h4>
                  <Link href="/autopartes">{t("common.seeAll")} →</Link>
                </div>

                <ul className="featured-carousel__parts-list">
                  {currentParts.map((part) => (
                    <li key={part.id} className="featured-carousel__part-item">
                      <Link href="/autopartes" className="featured-carousel__part-link">
                        <span className="featured-carousel__part-name">{part.name}</span>
                        <span className="featured-carousel__part-price">
                          {currencyFormatter(part.price, locale)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="featured-carousel__controls" role="tablist" aria-label={t("featured.eyebrow")}>
            {vehicles.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`featured-carousel__dot ${index === activeIndex ? "featured-carousel__dot--active" : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`${t("featured.eyebrow")} ${index + 1}`}
                aria-selected={index === activeIndex}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
