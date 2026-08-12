/**
 * Presentation · Component · VehicleDetail (client)
 * "Ver más" de un auto: galería clásica (foto grande + tira de miniaturas
 * scrollable debajo, clic para cambiar) en vez del tríptico anterior fijo a
 * 3 encuadres — así escala igual con 3 fotos que con 10 cuando el catálogo
 * tenga más de una foto real por vehículo. Seguida de la tarjeta de precio
 * de lista y el grid de especificaciones técnicas. Tailwind + tokens del
 * proyecto vía sintaxis `bg-(--token)`. Recibe la entidad ya resuelta
 * (server) y la traduce.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Maximize2, X } from "lucide-react";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";
import { CountUp } from "@ui/atoms/CountUp";
import { ModalPortal } from "@ui/atoms/ModalPortal";
import { useModalA11y } from "@ui/hooks/useModalA11y";
import { Breadcrumbs } from "@ui/molecules/Breadcrumbs";
import {
  bodyTypeKey,
  fuelKey,
  transmissionKey,
  mileageText,
  vehiclePhotoUrl,
} from "../vehiclePresentation";
import { TestDriveModal } from "../components/TestDriveModal";
import "../styles/catalog.css";

/**
 * Encuadres de la galería: hoy son crops de la misma foto (todavía no hay
 * varias fotos reales por vehículo), pero el componente ya soporta
 * cualquier cantidad — el día que el admin suba fotos reales, esto se
 * reemplaza por `vehicle.photos.map(...)` sin tocar el layout.
 */
const GALLERY_SHOTS = [
  { key: "ext", label: "01 / EXTERIOR", position: "12% 35%" },
  { key: "prf", label: "02 / PERFIL", position: "50% 45%" },
  { key: "tra", label: "03 / TRASERA", position: "85% 40%" },
  { key: "int", label: "04 / INTERIOR", position: "35% 60%" },
  { key: "det", label: "05 / DETALLE", position: "88% 30%" },
] as const;

export function VehicleDetail({ vehicle }: { vehicle: CatalogVehicle }) {
  const { t, locale } = useTranslation();
  const [photoFailed, setPhotoFailed] = useState(false);
  const [activeShot, setActiveShot] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [testDriveOpen, setTestDriveOpen] = useState(false);
  const lightboxPanelRef = useModalA11y<HTMLDivElement>(() => setLightboxOpen(false));

  const specColumns = [
    {
      title: t("detail.specMotor"),
      items: [t(fuelKey[vehicle.fuelType]), `${vehicle.horsepower} HP`],
      isTech: false,
    },
    {
      title: t("detail.specPerformance"),
      items: [t(transmissionKey[vehicle.transmission])],
      isTech: false,
    },
    {
      title: t("detail.specDimensions"),
      items: [
        t(bodyTypeKey[vehicle.bodyType]),
        `${vehicle.seats} ${t("detail.seats").toLowerCase()}`,
        `${vehicle.year}`,
        mileageText(vehicle.mileageKm, t),
      ],
      isTech: false,
    },
    {
      title: t("detail.specTech"),
      items: vehicle.features,
      isTech: true,
    },
  ];

  const photoUrl = vehiclePhotoUrl(vehicle.id, vehicle.brand, vehicle.bodyType, { w: 1920, h: 1080 }, vehicle.imageUrl);

  return (
    <>
      {/* Bloque 1: encabezado + galería clásica (foto grande + miniaturas) */}
      <section className="vdetail-gallery-section">
        <Breadcrumbs
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("nav.catalog"), href: "/catalogo" },
            { label: `${vehicle.brand} ${vehicle.model}` },
          ]}
        />

        <div className="vdetail-heading">
          <span className="vdetail-hero__brand">{vehicle.brand}</span>
          <h1 className="vdetail-hero__title">{vehicle.model}</h1>
        </div>

        <div className="vdetail-gallery">
          <button
            type="button"
            className="vdetail-gallery__main"
            onClick={() => setLightboxOpen(true)}
            aria-label={t("detail.expandPhoto")}
          >
            {!photoFailed && (
              <Image
                src={photoUrl}
                alt={`${vehicle.brand} ${vehicle.model} — ${GALLERY_SHOTS[activeShot].label}`}
                fill
                unoptimized={photoUrl.startsWith("http")}
                sizes="(max-width: 720px) 100vw, 900px"
                style={{ objectPosition: GALLERY_SHOTS[activeShot].position }}
                loading="eager"
                onError={() => setPhotoFailed(true)}
              />
            )}
            <span className="vdetail-gallery__badge">
              {vehicle.condition === "nuevo" ? t("common.new") : t("common.used")}
            </span>
            <span className="vdetail-gallery__expand">
              <Maximize2 size={15} strokeWidth={2} aria-hidden />
              {t("detail.expandPhoto")}
            </span>
          </button>

          {!photoFailed && (
            <div className="vdetail-gallery__thumbs" role="tablist" aria-label={t("detail.gallery")}>
              {GALLERY_SHOTS.map((shot, i) => (
                <button
                  key={shot.key}
                  type="button"
                  role="tab"
                  aria-selected={i === activeShot}
                  className={`vdetail-gallery__thumb ${i === activeShot ? "vdetail-gallery__thumb--active" : ""}`}
                  onClick={() => setActiveShot(i)}
                >
                  <Image
                    src={photoUrl}
                    alt=""
                    fill
                    unoptimized={photoUrl.startsWith("http")}
                    sizes="120px"
                    style={{ objectPosition: shot.position }}
                  />
                  <span className="vdetail-gallery__thumb-label">{shot.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxOpen && !photoFailed && (
        <ModalPortal>
          <div
            className="vdetail-lightbox-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={t("detail.expandPhoto")}
            onClick={() => setLightboxOpen(false)}
          >
            <div
              ref={lightboxPanelRef}
              tabIndex={-1}
              className="vdetail-lightbox-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="vdetail-lightbox__close"
                onClick={() => setLightboxOpen(false)}
                aria-label={t("productInquiry.close")}
              >
                <X size={20} strokeWidth={1.75} aria-hidden />
              </button>

              <div className="vdetail-lightbox__img">
                <Image
                  src={photoUrl}
                  alt={`${vehicle.brand} ${vehicle.model} — ${GALLERY_SHOTS[activeShot].label}`}
                  fill
                  unoptimized={photoUrl.startsWith("http")}
                  sizes="90vw"
                  style={{ objectPosition: GALLERY_SHOTS[activeShot].position }}
                />
              </div>

              <div className="vdetail-gallery__thumbs vdetail-lightbox__thumbs" role="tablist" aria-label={t("detail.gallery")}>
                {GALLERY_SHOTS.map((shot, i) => (
                  <button
                    key={shot.key}
                    type="button"
                    role="tab"
                    aria-selected={i === activeShot}
                    className={`vdetail-gallery__thumb ${i === activeShot ? "vdetail-gallery__thumb--active" : ""}`}
                    onClick={() => setActiveShot(i)}
                  >
                    <Image
                      src={photoUrl}
                      alt=""
                      fill
                      unoptimized={photoUrl.startsWith("http")}
                      sizes="120px"
                      style={{ objectPosition: shot.position }}
                    />
                    <span className="vdetail-gallery__thumb-label">{shot.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Tarjeta única: precio de lista + especificaciones */}
      <section className="relative ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] w-screen bg-(--bg-base)">
        <div className="vdetail-pricecard-wrap">
          <div className="vdetail-pricecard">
            <div className="vdetail-pricecard__top">
              <span className="vdetail-pricecard__label">{t("detail.listPrice")}</span>
              <span className="vdetail-pricecard__badge">
                {vehicle.condition === "nuevo" ? t("common.new") : t("common.used")}
              </span>
            </div>

            <CountUp
              value={vehicle.price}
              format={(n) => formatCurrency(Math.round(n), locale)}
              className="vdetail-pricecard__value"
            />

            <p className="vdetail-pricecard__tagline">{vehicle.tagline}</p>

            <div className="vdetail-pricecard__divider" />

            <div className="vdetail-pricecard__meta">
              <span>{vehicle.year}</span>
              <span>{mileageText(vehicle.mileageKm, t)}</span>
              <span>{t(fuelKey[vehicle.fuelType])}</span>
            </div>

            <div className="vdetail-pricecard__actions">
              <Button onClick={() => setTestDriveOpen(true)}>{t("detail.testDrive")}</Button>
              <Button href="/buscador" variant="ghost">
                {t("detail.findParts")}
              </Button>
            </div>

            <div className="vdetail-pricecard__divider" />

            <div className="vdetail-specs grid grid-cols-1 md:grid-cols-4">
              {specColumns.map((col) => (
                <div key={col.title} className="vdetail-specs__col py-6 first:pt-0 last:pb-0 md:px-7 md:py-0 md:first:pl-0 md:last:pr-0">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
                    {col.title}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {col.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                        {col.isTech && (
                          <CheckCircle2 size={14} strokeWidth={2} className="shrink-0 text-(--accent-neon)" aria-hidden />
                        )}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {testDriveOpen && <TestDriveModal vehicle={vehicle} onClose={() => setTestDriveOpen(false)} />}
    </>
  );
}
