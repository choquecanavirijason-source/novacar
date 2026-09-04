/**
 * Presentation · Component · VehicleDetail (client)
 * "Ver más" de un auto: galería clásica (foto grande + tira de miniaturas
 * scrollable debajo, clic para cambiar) en vez del tríptico anterior fijo a
 * 3 encuadres — así escala igual con 3 fotos que con 10 cuando el catálogo
 * tenga más de una foto real por vehículo. Seguida de la tarjeta de precio
 * de lista y el grid de especificaciones técnicas. Tailwind + tokens del
 * proyecto vía sintaxis `bg-(--token)`. Recibe la entidad ya resuelta
 * (server) y la traduce.
 * 
 * Versión mejorada con información detallada del vehículo similar a catálogos
 * de subastas: título, odómetro, daños, llaves, fecha de venta, etc.
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
  User,
  Cog,
  Car,
  Shield,
  AlertTriangle,
  Key,
  Clock,
  MapPin,
  FileText,
  DoorClosed
} from "lucide-react";
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
 * Imágenes reales del Nissan Versa. La foto principal del catálogo sigue
 * viniendo de vehiclePhotoUrl; esta lista controla únicamente el detalle.
 */
const GALLERY_SHOTS = [
  { key: "prf", label: "01 / PERFIL", src: "/vehicles/2.jpg", position: "50% 50%" },
  { key: "ext", label: "02 / EXTERIOR", src: "/vehicles/1.jpg", position: "50% 50%" },
  { key: "tra", label: "03 / TRASERA", src: "/vehicles/3.jpg", position: "50% 50%" },
  { key: "int", label: "04 / INTERIOR", src: "/vehicles/4.jpg", position: "50% 50%" },
  { key: "det", label: "05 / DETALLE", src: "/vehicles/5.jpg", position: "50% 50%" },
  { key: "mot", label: "06 / MOTOR", src: "/vehicles/6.jpg", position: "50% 50%" },
  { key: "six", label: "07 / VISTA", src: "/vehicles/7.jpg", position: "50% 50%" },
  { key: "sev", label: "08 / VISTA", src: "/vehicles/8.jpg", position: "50% 50%" },
] as const;

// Helper para badge de severidad de daño
const getDamageBadgeStyles = (severity: string) => {
  const styles = {
    none: "bg-green-500/10 text-green-400 border-green-500/20",
    minor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    moderate: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    severe: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return styles[severity as keyof typeof styles] || styles.none;
};

const getDamageIcon = (severity: string) => {
  const icons = {
    none: <Shield size={14} className="text-green-400" />,
    minor: <AlertTriangle size={14} className="text-yellow-400" />,
    moderate: <AlertTriangle size={14} className="text-orange-400" />,
    severe: <AlertTriangle size={14} className="text-red-400" />,
  };
  return icons[severity as keyof typeof icons] || icons.none;
};

const getSeverityLabel = (severity: string, t: any) => {
  const labels = {
    none: t("detail.damageNone"),
    minor: t("detail.damageMinor"),
    moderate: t("detail.damageModerate"),
    severe: t("detail.damageSevere"),
  };
  return labels[severity as keyof typeof labels] || severity;
};

export function VehicleDetail({ vehicle }: { vehicle: CatalogVehicle }) {
  const { t, locale } = useTranslation();
  const [photoFailed, setPhotoFailed] = useState(false);
  const [activeShot, setActiveShot] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [testDriveOpen, setTestDriveOpen] = useState(false);
  const lightboxPanelRef = useModalA11y<HTMLDivElement>(() => setLightboxOpen(false));

  // Helper para valores por defecto (campos opcionales)
  const getValueOrDefault = (value: any, defaultValue: any = "—") => {
    return value !== undefined && value !== null && value !== "" ? value : defaultValue;
  };

  // Especificaciones técnicas mejoradas
  const specColumns = [
    {
      title: t("detail.specMotor"),
      icon: <Cog size={16} className="text-(--accent-neon)" />,
      items: [
        { label: t("detail.horsepower"), value: `${vehicle.horsepower} HP` },
        { label: t("detail.cylinders"), value: getValueOrDefault(vehicle.cylinders, "—") },
        { label: t("detail.displacement"), value: getValueOrDefault(vehicle.displacement, "—") },
        { label: t("detail.fuel"), value: t(fuelKey[vehicle.fuelType]) },
      ],
      isTech: false,
    },
    {
      title: t("detail.specPerformance"),
      icon: <Car size={16} className="text-(--accent-neon)" />,
      items: [
        { label: t("detail.transmission"), value: t(transmissionKey[vehicle.transmission]) },
        { label: t("detail.driveType"), value: getValueOrDefault(vehicle.driveType, "—") },
      ],
      isTech: false,
    },
    {
      title: t("detail.specDimensions"),
      icon: <Gauge size={16} className="text-(--accent-neon)" />,
      items: [
        { label: t("detail.bodyType"), value: t(bodyTypeKey[vehicle.bodyType]) },
        { label: t("detail.color"), value: getValueOrDefault(vehicle.color, "—") },
        { label: t("detail.seats"), value: `${vehicle.seats} ${t("detail.seatsLabel").toLowerCase()}` },
        { label: t("detail.doors"), value: getValueOrDefault(vehicle.doors, "—") },
      ],
      isTech: false,
    },
    {
      title: t("detail.specTech"),
      icon: null,
      items: vehicle.features.map((feature) => ({ label: "", value: feature, isFeature: true })),
      isTech: true,
    },
  ];

  const photoUrl = vehiclePhotoUrl(vehicle.id, vehicle.brand, vehicle.bodyType, { w: 1920, h: 1080 }, vehicle.imageUrl);
  const galleryShots = vehicle.id === "nissan-versa-2021"
    ? GALLERY_SHOTS
    : GALLERY_SHOTS.map((shot) => ({ ...shot, src: photoUrl }));

  // Determinar si mostrar información adicional (campos extra)
  const hasExtraInfo = vehicle.color || vehicle.doors || vehicle.cylinders || vehicle.driveType;

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
                src={galleryShots[activeShot].src}
                alt={`${vehicle.brand} ${vehicle.model} — ${galleryShots[activeShot].label}`}
                fill
                unoptimized={galleryShots[activeShot].src.startsWith("http")}
                sizes="(max-width: 720px) 100vw, 900px"
                style={{ objectPosition: galleryShots[activeShot].position }}
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
              {galleryShots.map((shot, i) => (
                <button
                  key={shot.key}
                  type="button"
                  role="tab"
                  aria-selected={i === activeShot}
                  className={`vdetail-gallery__thumb ${i === activeShot ? "vdetail-gallery__thumb--active" : ""}`}
                  onClick={() => setActiveShot(i)}
                >
                  <Image
                    src={shot.src}
                    alt=""
                    fill
                    unoptimized={shot.src.startsWith("http")}
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
                  src={galleryShots[activeShot].src}
                  alt={`${vehicle.brand} ${vehicle.model} — ${galleryShots[activeShot].label}`}
                  fill
                  unoptimized={galleryShots[activeShot].src.startsWith("http")}
                  sizes="90vw"
                  style={{ objectPosition: galleryShots[activeShot].position }}
                />
              </div>

              <div className="vdetail-gallery__thumbs vdetail-lightbox__thumbs" role="tablist" aria-label={t("detail.gallery")}>
                {galleryShots.map((shot, i) => (
                  <button
                    key={shot.key}
                    type="button"
                    role="tab"
                    aria-selected={i === activeShot}
                    className={`vdetail-gallery__thumb ${i === activeShot ? "vdetail-gallery__thumb--active" : ""}`}
                    onClick={() => setActiveShot(i)}
                  >
                    <Image
                      src={shot.src}
                      alt=""
                      fill
                      unoptimized={shot.src.startsWith("http")}
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
            {/* Precio y estado */}
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

            {/* Meta información rápida */}
            <div className="vdetail-pricecard__meta">
              <span>{vehicle.year}</span>
              <span>{mileageText(vehicle.mileageKm, t)}</span>
              <span>{t(fuelKey[vehicle.fuelType])}</span>
            </div>

            {/* Acciones */}
            <div className="vdetail-pricecard__actions">
              <Button onClick={() => setTestDriveOpen(true)}>{t("detail.testDrive")}</Button>
              <Button href="/buscador" variant="ghost">
                {t("detail.findParts")}
              </Button>
            </div>

            <div className="vdetail-pricecard__divider" />

            {/* Especificaciones técnicas - Grid 4 columnas mejorado */}
            <div className="vdetail-specs grid grid-cols-1 md:grid-cols-4">
              {specColumns.map((col, colIndex) => (
                <div 
                  key={col.title} 
                  className={`
                    vdetail-specs__col py-6 
                    first:pt-0 last:pb-0 
                    md:px-7 md:py-0 
                    md:first:pl-0 md:last:pr-0
                    ${colIndex > 0 && colIndex < 3 ? 'md:border-l md:border-white/5' : ''}
                  `}
                >
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                    {col.icon}
                    {col.title}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {col.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-400">
                        {col.isTech ? (
                          <>
                            <CheckCircle2 size={14} strokeWidth={2} className="shrink-0 text-(--accent-neon)" aria-hidden />
                            <span>{item.value}</span>
                          </>
                        ) : (
                          <>
                            {item.label && (
                              <span className="text-xs text-gray-500 min-w-[4.5rem]">{item.label}:</span>
                            )}
                            <span>{item.value}</span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Información adicional expandida (similar a captura) */}
            {(vehicle.titleCode || vehicle.saleDate || vehicle.damageType || vehicle.hasKeys !== undefined) && (
              <>
                <div className="vdetail-pricecard__divider" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {/* Columna izquierda: Información del vehículo */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      {t("detail.vehicleInfo")}
                    </h4>
                    
                    {/* Código de título */}
                    {vehicle.titleCode && (
                      <div className="flex items-start gap-3">
                        <FileText size={16} className="shrink-0 mt-0.5 text-gray-400" />
                        <div>
                          <span className="text-xs text-gray-500">{t("detail.titleCode")}</span>
                          <p className="text-sm text-gray-300">{vehicle.titleCode}</p>
                        </div>
                      </div>
                    )}

                    {/* Odómetro actual */}
                    <div className="flex items-start gap-3">
                      <Gauge size={16} className="shrink-0 mt-0.5 text-gray-400" />
                      <div>
                        <span className="text-xs text-gray-500">{t("detail.odometer")}</span>
                        <p className="text-sm text-gray-300">
                          {mileageText(vehicle.mileageKm, t)} <span className="text-xs text-gray-500">{t("detail.current")}</span>
                        </p>
                      </div>
                    </div>

                    {/* Daños */}
                    {vehicle.damageType && (
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5 text-gray-400" />
                        <div>
                          <span className="text-xs text-gray-500">{t("detail.primaryDamage")}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`
                              inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border
                              ${getDamageBadgeStyles(vehicle.damageSeverity || 'none')}
                            `}>
                              {getDamageIcon(vehicle.damageSeverity || 'none')}
                              {vehicle.damageType}
                              {vehicle.damageSeverity && vehicle.damageSeverity !== 'none' && (
                                <span className="opacity-50">· {getSeverityLabel(vehicle.damageSeverity, t)}</span>
                              )}
                            </span>
                          </div>
                          {vehicle.damageDescription && (
                            <p className="text-xs text-gray-500 mt-1">{vehicle.damageDescription}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tiene llave */}
                    {vehicle.hasKeys !== undefined && (
                      <div className="flex items-start gap-3">
                        <Key size={16} className="shrink-0 mt-0.5 text-gray-400" />
                        <div>
                          <span className="text-xs text-gray-500">{t("detail.hasKeys")}</span>
                          <p className="text-sm text-gray-300">
                            {vehicle.hasKeys ? "✓ Sí" : "✗ No"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Destacados */}
                    {vehicle.highlights && vehicle.highlights.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Shield size={16} className="shrink-0 mt-0.5 text-gray-400" />
                        <div>
                          <span className="text-xs text-gray-500">{t("detail.highlights")}</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {vehicle.highlights.map((highlight, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 bg-(--accent-neon)/10 text-(--accent-neon) rounded-full">
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Columna derecha: Información de venta */}
                  <div className="space-y-4 md:border-l md:border-white/5 md:pl-6">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                      <CalendarDays size={16} className="text-gray-400" />
                      {t("detail.saleInfo")}
                    </h4>

                    {/* Fecha de venta */}
                    {vehicle.saleDate && (
                      <div className="flex items-start gap-3">
                        <CalendarDays size={16} className="shrink-0 mt-0.5 text-gray-400" />
                        <div>
                          <span className="text-xs text-gray-500">{t("detail.saleDate")}</span>
                          <p className="text-sm text-gray-300">
                            {vehicle.saleDate}
                            {vehicle.saleTime && (
                              <span className="text-xs text-gray-500 block">
                                <Clock size={12} className="inline mr-1" />
                                {vehicle.saleTime}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Ubicación */}
                    {vehicle.saleLocation && (
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="shrink-0 mt-0.5 text-gray-400" />
                        <div>
                          <span className="text-xs text-gray-500">{t("detail.location")}</span>
                          <p className="text-sm text-gray-300">{vehicle.saleLocation}</p>
                        </div>
                      </div>
                    )}

                    {/* Notas */}
                    {vehicle.notes && (
                      <div className="flex items-start gap-3">
                        <FileText size={16} className="shrink-0 mt-0.5 text-gray-400" />
                        <div>
                          <span className="text-xs text-gray-500">{t("detail.notes")}</span>
                          <p className="text-sm text-gray-400 italic">{vehicle.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Emoji decorativo */}
                    <div className="mt-4 text-4xl opacity-10 select-none">
                      🚗
                    </div>
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