// src/features/vehicles_catalog/presentation/pages/VehicleDetail.tsx
// (Reemplaza todo el contenido con esto)

/**
 * Presentation · Component · VehicleDetail (client)
 * Muestra la galería de fotos, precio, especificaciones e información adicional.
 * Diseño centrado, responsive, con lightbox al hacer clic en la imagen principal.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Maximize2,
  X,
  CalendarDays,
  Gauge,
  Fuel,
  Cog,
  Car,
  Shield,
  AlertTriangle,
  Key,
  Clock,
  MapPin,
  FileText
} from "lucide-react";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { getVehicleImageUrl } from "../catalogPresentation";
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
  damageBadgeClass,
  damageSeverityKey,
} from "../vehiclePresentation";
import { TestDriveModal } from "../components/TestDriveModal";
import "../styles/catalog.css";

const GALLERY_SHOTS = [
  { key: "ext", label: "01 / EXTERIOR", position: "12% 35%" },
  { key: "prf", label: "02 / PERFIL", position: "50% 45%" },
  { key: "tra", label: "03 / TRASERA", position: "85% 40%" },
  { key: "int", label: "04 / INTERIOR", position: "35% 60%" },
  { key: "det", label: "05 / DETALLE", position: "88% 30%" },
] as const;

const getDamageIcon = (severity: string) =>
  severity !== "none" && severity !== "" ? (
    <AlertTriangle size={14} />
  ) : (
    <Shield size={14} />
  );

export function VehicleDetail({ vehicle }: { vehicle: CatalogVehicle }) {
  const { t, locale } = useTranslation();
  const [photoFailed, setPhotoFailed] = useState(false);
  const [activeShot, setActiveShot] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [testDriveOpen, setTestDriveOpen] = useState(false);
  const lightboxPanelRef = useModalA11y<HTMLDivElement>(() => setLightboxOpen(false));

  const imageUrl = getVehicleImageUrl(vehicle);

  const getValueOrDefault = (value: any, defaultValue: any = "—") => {
    return value !== undefined && value !== null && value !== "" ? value : defaultValue;
  };

  // Especificaciones agrupadas para grid
  const specGroups = [
    {
      title: t("detail.specMotor"),
      icon: <Cog size={16} className="text-(--accent-neon)" />,
      items: [
        { label: t("detail.horsepower"), value: `${vehicle.horsepower} HP`, isTech: false },
        { label: t("detail.cylinders"), value: getValueOrDefault(vehicle.cylinders), isTech: false },
        { label: t("detail.displacement"), value: getValueOrDefault(vehicle.displacement), isTech: false },
        { label: t("detail.fuel"), value: t(fuelKey[vehicle.fuelType]), isTech: false },
      ],
    },
    {
      title: t("detail.specPerformance"),
      icon: <Car size={16} className="text-(--accent-neon)" />,
      items: [
        { label: t("detail.transmission"), value: t(transmissionKey[vehicle.transmission]), isTech: false },
        { label: t("detail.driveType"), value: getValueOrDefault(vehicle.driveType), isTech: false },
        {
          label: t("detail.topSpeed"),
          value: vehicle.topSpeedKmh ? `${vehicle.topSpeedKmh} km/h` : "—",
          isTech: false,
        },
        {
          label: t("detail.acceleration"),
          value: vehicle.zeroToHundredSec ? `${vehicle.zeroToHundredSec}s (0-100 km/h)` : "—",
          isTech: false,
        },
        {
          label: t("detail.availability"),
          value: vehicle.availability ? t(`availability.${vehicle.availability}`) : "—",
          isTech: false,
        },
      ],
    },
    {
      title: t("detail.specDimensions"),
      icon: <Gauge size={16} className="text-(--accent-neon)" />,
      items: [
        { label: t("detail.bodyType"), value: t(bodyTypeKey[vehicle.bodyType]), isTech: false },
        { label: t("detail.color"), value: getValueOrDefault(vehicle.color), isTech: false },
        { label: t("detail.seats"), value: `${vehicle.seats} ${t("detail.seatsLabel").toLowerCase()}`, isTech: false },
        { label: t("detail.doors"), value: getValueOrDefault(vehicle.doors), isTech: false },
      ],
    },
    {
      title: t("detail.specTech"),
      icon: null,
      items: vehicle.features.map((f) => ({ label: "", value: f, isTech: true })),
    },
  ];

  const hasExtraInfo = vehicle.titleCode || vehicle.saleDate || vehicle.damageType || vehicle.hasKeys !== undefined;

  return (
    <>
      {/* Sección: Galería */}
      <section className="vdetail-gallery-section">
        <div className="container mx-auto px-4">
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
              {!photoFailed ? (
                <Image
                  src={imageUrl}
                  alt={`${vehicle.brand} ${vehicle.model} — ${GALLERY_SHOTS[activeShot].label}`}
                  fill
                  unoptimized={imageUrl.startsWith("http")}
                  sizes="(max-width: 720px) 100vw, 900px"
                  style={{ objectPosition: GALLERY_SHOTS[activeShot].position }}
                  loading="eager"
                  onError={() => setPhotoFailed(true)}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-(--bg-elevated) text-(--text-muted)">
                  <Car className="w-16 h-16" />
                  <span className="ml-2">Sin imagen</span>
                </div>
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
                      src={imageUrl}
                      alt=""
                      fill
                      unoptimized={imageUrl.startsWith("http")}
                      sizes="120px"
                      style={{ objectPosition: shot.position }}
                    />
                    <span className="vdetail-gallery__thumb-label">{shot.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
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
                  src={imageUrl}
                  alt={`${vehicle.brand} ${vehicle.model} — ${GALLERY_SHOTS[activeShot].label}`}
                  fill
                  unoptimized={imageUrl.startsWith("http")}
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
                      src={imageUrl}
                      alt=""
                      fill
                      unoptimized={imageUrl.startsWith("http")}
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

      {/* Sección: Precio y especificaciones */}
      <section className="vdetail-pricecard-wrap">
        <div className="container mx-auto px-4">
          <div className="vdetail-pricecard">
            {/* Precio */}
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

            {/* Especificaciones: grid 4 columnas */}
            <div className="vdetail-specs-grid">
              {specGroups.map((group, idx) => (
                <div key={group.title} className="vdetail-specs-group">
                  <h3 className="vdetail-specs-group__title">
                    {group.icon}
                    {group.title}
                  </h3>
                  <ul className="vdetail-specs-group__list">
                    {group.items.map((item, i) => (
                      <li key={i} className="vdetail-specs-group__item">
                        {item.isTech ? (
                          <>
                            <CheckCircle2 size={14} className="shrink-0 text-(--accent-neon)" />
                            <span>{item.value}</span>
                          </>
                        ) : (
                          <>
                            <span className="vdetail-specs-group__item-label">{item.label}</span>
                            <span className="vdetail-specs-group__item-value">{item.value}</span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Información adicional */}
            {hasExtraInfo && (
              <>
                <div className="vdetail-pricecard__divider" />
                <div className="vdetail-additional-info">
                  {/* Columna: Vehículo */}
                  <div className="vdetail-additional-info__col">
                    <h4 className="vdetail-additional-info__title">
                      <FileText size={16} />
                      {t("detail.vehicleInfo")}
                    </h4>

                    {vehicle.titleCode && (
                      <div className="vdetail-additional-info__item">
                        <span className="vdetail-additional-info__item-label">{t("detail.titleCode")}</span>
                        <p className="vdetail-additional-info__item-value">{vehicle.titleCode}</p>
                      </div>
                    )}

                    <div className="vdetail-additional-info__item">
                      <span className="vdetail-additional-info__item-label">{t("detail.odometer")}</span>
                      <p className="vdetail-additional-info__item-value">
                        {mileageText(vehicle.mileageKm, t)}{" "}
                        <span className="text-xs text-(--text-muted)">{t("detail.current")}</span>
                      </p>
                    </div>

                    {vehicle.damageType && (
                      <div className="vdetail-additional-info__item">
                        <span className="vdetail-additional-info__item-label">{t("detail.primaryDamage")}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${damageBadgeClass(
                              vehicle.damageSeverity
                            )}`}
                          >
                            {getDamageIcon(vehicle.damageSeverity || "none")}
                            {vehicle.damageType}
                            {vehicle.damageSeverity && vehicle.damageSeverity !== "none" && (
                              <span className="opacity-50">· {t(damageSeverityKey(vehicle.damageSeverity))}</span>
                            )}
                          </span>
                        </div>
                        {vehicle.damageDescription && (
                          <p className="text-xs text-(--text-muted) mt-1">{vehicle.damageDescription}</p>
                        )}
                      </div>
                    )}

                    {vehicle.hasKeys !== undefined && (
                      <div className="vdetail-additional-info__item">
                        <span className="vdetail-additional-info__item-label">{t("detail.hasKeys")}</span>
                        <p className="vdetail-additional-info__item-value">{vehicle.hasKeys ? "✓ Sí" : "✗ No"}</p>
                      </div>
                    )}

                    {vehicle.highlights && vehicle.highlights.length > 0 && (
                      <div className="vdetail-additional-info__item">
                        <span className="vdetail-additional-info__item-label">{t("detail.highlights")}</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {vehicle.highlights.map((h, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-(--accent-neon)/10 text-(--accent-neon) rounded-full"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Columna: Venta */}
                  <div className="vdetail-additional-info__col">
                    <h4 className="vdetail-additional-info__title">
                      <CalendarDays size={16} />
                      {t("detail.saleInfo")}
                    </h4>

                    {vehicle.saleDate && (
                      <div className="vdetail-additional-info__item">
                        <span className="vdetail-additional-info__item-label">{t("detail.saleDate")}</span>
                        <p className="vdetail-additional-info__item-value">
                          {vehicle.saleDate}
                          {vehicle.saleTime && (
                            <span className="block text-xs text-(--text-muted)">
                              <Clock size={12} className="inline mr-1" />
                              {vehicle.saleTime}
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {vehicle.saleLocation && (
                      <div className="vdetail-additional-info__item">
                        <span className="vdetail-additional-info__item-label">{t("detail.location")}</span>
                        <p className="vdetail-additional-info__item-value">{vehicle.saleLocation}</p>
                      </div>
                    )}

                    {vehicle.notes && (
                      <div className="vdetail-additional-info__item">
                        <span className="vdetail-additional-info__item-label">{t("detail.notes")}</span>
                        <p className="vdetail-additional-info__item-value italic text-(--text-muted)">{vehicle.notes}</p>
                      </div>
                    )}

                    <div className="mt-4 text-4xl opacity-10 select-none">🚗</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {testDriveOpen && <TestDriveModal vehicle={vehicle} onClose={() => setTestDriveOpen(false)} />}
    </>
  );
}