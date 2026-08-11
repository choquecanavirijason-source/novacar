/**
 * Presentation · Component · FeaturedVehicles
 * Sección "Destacados": layout split 50/50 por vehículo (Tailwind). Columna
 * izquierda con ficha técnica (grid de specs) y CTA; columna derecha con el
 * auto (PNG transparente, position:absolute rompiendo la cuadrícula, empujado
 * hacia el borde) y una tarjeta flotante glassmorphism con el precio. Marca
 * de agua "EXCLUSIVE" de fondo, opacidad casi nula, puramente decorativa.
 * El CTA sigue el sistema global de botones sesgados/glossy (ver globals.css).
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { catalogUseCases } from "../../di";
import { useTranslation } from "@core/i18n/I18nProvider";
import { formatCurrency } from "@core/format/formatters";
import { CountUp } from "@ui/atoms/CountUp";
import { Eyebrow } from "@ui/atoms/Eyebrow";
import { Parallax } from "@ui/atoms/Parallax";
import { Skeleton } from "@ui/atoms/Skeleton";
import { fuelKey, transmissionKey, vehiclePhotoUrl } from "../vehiclePresentation";
import "../styles/catalog.css";

/** PNG transparente por marca: `public/vehicles/{Marca}.png` (subir manualmente). */
const vehicleCutoutUrl = (brand: string) => `/vehicles/${brand}.png`;

export function FeaturedVehicles() {
  const { t, locale } = useTranslation();
  const [vehicles, setVehicles] = useState<CatalogVehicle[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cutoutFailed, setCutoutFailed] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void catalogUseCases.getFeaturedVehicles.execute().then(setVehicles);
  }, []);

  useEffect(() => {
    setCutoutFailed(false);
  }, [activeIndex]);

  const vehicle = vehicles?.[activeIndex];

  // Al cambiar de auto (autoplay o click en los puntos), el auto "entra"
  // deslizándose desde el costado (derecha, como si llegara manejando) y la
  // ficha técnica entra desde la izquierda — animación de entrada, no del
  // scroll de página, por eso vive en su propio div (nunca comparte
  // elemento con el <Parallax> que ya anima yPercent por scroll).
  useEffect(() => {
    if (!vehicle) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -36 },
        { opacity: 1, x: 0, duration: 1.1, ease: "power2.out", clearProps: "transform" },
      );
    }
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: 90 },
        { opacity: 1, x: 0, duration: 1.3, ease: "power2.out", clearProps: "transform" },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle?.id]);

  useEffect(() => {
    if (!vehicles || vehicles.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % vehicles.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [vehicles]);

  const specs = vehicle
    ? [
        {
          label: t("featured.specPower"),
          value: (
            <>
              <CountUp value={vehicle.horsepower} /> HP
            </>
          ),
        },
        { label: t("featured.specFuel"), value: t(fuelKey[vehicle.fuelType]) },
        { label: t("featured.specTransmission"), value: t(transmissionKey[vehicle.transmission]) },
        {
          label: t("featured.specMileage"),
          value: vehicle.mileageKm === 0 ? t("common.new") : `${vehicle.mileageKm.toLocaleString(locale)} km`,
        },
      ]
    : [];

  return (
    <section className="py-4 pb-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <Eyebrow>{t("featured.eyebrow")}</Eyebrow>
          <h2 className="mt-2.5 text-[1.7rem] font-extrabold">{t("featured.title")}</h2>
        </div>
        <Link href="/catalogo" className="text-[0.92rem] font-bold text-(--accent-neon)">
          {t("common.seeAll")} →
        </Link>
      </div>

      {vehicles === null ? (
        <Skeleton height={480} radius="var(--radius-lg)" />
      ) : vehicle ? (
        <>
          <div className="relative flex flex-col overflow-hidden rounded-[28px] border border-(--border) bg-(--bg-base) p-8 transition-colors duration-300 hover:border-(--accent-neon) lg:flex-row lg:p-16">
            {/* Marca de agua decorativa: capa de fondo, se mueve más lento (profundidad) */}
            <Parallax
              speed={-0.12}
              className="pointer-events-none absolute -top-4 right-2 z-0 select-none text-[5rem] font-black uppercase leading-none text-white/5 sm:text-[7rem] lg:-top-8 lg:right-6 lg:text-[9rem]"
            >
              <span aria-hidden>{t("featured.watermark")}</span>
            </Parallax>

            {/* Columna izquierda: ficha técnica */}
            <div
              ref={textRef}
              className="relative z-10 flex w-full flex-col justify-center space-y-10 text-left lg:w-1/2 lg:space-y-12"
            >
              <div>
                <h3 className="text-3xl font-bold text-white sm:text-4xl">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="mt-2 text-(--text-secondary)">
                  {vehicle.year} · {vehicle.condition === "nuevo" ? t("common.new") : t("common.used")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex flex-col gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-(--accent-neon)" aria-hidden />
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      {spec.label}
                    </span>
                    <span className="font-semibold text-white">{spec.value}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/catalogo/${vehicle.id}`}
                className="relative inline-flex w-fit items-center overflow-hidden rounded-(--radius-btn) border border-(--accent-neon)/40 px-6 py-3 text-sm font-semibold text-white transform-[skewX(-12deg)] transition-colors duration-300 hover:border-(--accent-neon) hover:bg-(--accent-soft)"
              >
                <span
                  className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/15 via-white/0 to-black/15"
                  aria-hidden
                />
                <span className="relative inline-flex items-center gap-2 transform-[skewX(12deg)]">
                  {t("showcase.readMore")}
                  <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden />
                </span>
              </Link>
            </div>

            {/* Columna derecha: auto (capa en primer plano, se mueve un poco más rápido) */}
            <div className="relative z-10 mt-12 min-h-[280px] w-full lg:mt-0 lg:min-h-0 lg:w-1/2">
              <Parallax speed={0.1} className="pointer-events-none absolute inset-0">
                <div ref={imageRef} className="absolute inset-0">
                <Image
                  key={vehicle.id}
                  className="absolute top-1/2 right-0 w-[120%] max-w-none -translate-y-1/2 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)] lg:-right-10 lg:drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
                  src={
                    cutoutFailed
                      ? vehiclePhotoUrl(vehicle.id, vehicle.brand, vehicle.bodyType, { w: 900, h: 900 }, vehicle.imageUrl)
                      : vehicleCutoutUrl(vehicle.brand)
                  }
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  width={900}
                  height={900}
                  unoptimized={cutoutFailed}
                  loading="lazy"
                  onError={() => setCutoutFailed(true)}
                />
                </div>
              </Parallax>
            </div>

            {/* Tarjeta flotante de precio: esquina inferior derecha de la tarjeta general */}
            <div className="absolute bottom-5 right-5 z-20 max-w-[170px] rounded-xl border border-white/10 bg-(--bg-elevated)/30 px-4 py-3 backdrop-blur-(--glass-blur)">
              <span className="text-[0.65rem] uppercase tracking-wide text-gray-400">
                {t("featured.priceCaption")}
              </span>
              <p className="mt-0.5 text-lg font-bold text-white">
                {formatCurrency(vehicle.price, locale)}
              </p>
              <div className="my-2 h-px bg-white/10" />
              <p className="line-clamp-2 text-[0.7rem] leading-relaxed text-gray-300">{vehicle.tagline}</p>
            </div>
          </div>

          {vehicles.length > 1 && (
            <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label={t("featured.eyebrow")}>
              {vehicles.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "w-6 bg-(--accent-neon)" : "w-2 bg-(--border)"
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${t("featured.eyebrow")} ${index + 1}`}
                  aria-selected={index === activeIndex}
                />
              ))}
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}
