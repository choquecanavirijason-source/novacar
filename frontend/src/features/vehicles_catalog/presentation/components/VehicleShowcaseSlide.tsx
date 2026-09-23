// src/features/vehicles_catalog/presentation/components/VehicleShowcaseSlide.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Gauge,
  Fuel,
  Car,
  Star,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { getVehicleImageUrl } from "../catalogPresentation";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { bodyTypeKey, mileageText } from "../vehiclePresentation";
import { AuctionLotBadges } from "./AuctionLotBadges";

// Miniaturas decorativas (usamos la misma imagen con diferentes posiciones)
const GALLERY_SHOTS = [
  { key: "ext", label: "EXTERIOR", position: "12% 35%" },
  { key: "prf", label: "PERFIL", position: "50% 45%" },
  { key: "tra", label: "TRASERA", position: "85% 40%" },
  { key: "int", label: "INTERIOR", position: "35% 60%" },
  { key: "det", label: "DETALLE", position: "88% 30%" },
];

export function VehicleShowcaseSlide({
  vehicle,
  index = 0,
}: {
  vehicle: CatalogVehicle;
  index?: number;
}) {
  const { t, locale } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);

  const imageUrl = getVehicleImageUrl(vehicle);

  return (
    <div
      className="vehicle-showcase-slide"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <Link href={`/catalogo/${vehicle.id}`} className="vehicle-showcase-slide__link">
        {/* Bloque izquierdo: imagen principal + miniaturas */}
        <div className="vehicle-showcase-slide__left">
          <div className="vehicle-showcase-slide__main-image">
            {!imageError ? (
              <Image
                src={imageUrl}
                alt={`${vehicle.brand} ${vehicle.model}`}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index < 2}
              />
            ) : (
              <div className="vehicle-showcase-slide__placeholder">
                <Car className="w-16 h-16" />
                <span className="text-sm mt-2">
                  {vehicle.brand} {vehicle.model}
                </span>
              </div>
            )}

            {/* Badge de condición */}
            <span
              className={`vehicle-showcase-slide__badge ${
                vehicle.condition === "nuevo"
                  ? "vehicle-showcase-slide__badge--new"
                  : "vehicle-showcase-slide__badge--used"
              }`}
            >
              {vehicle.condition === "nuevo" ? t("common.new") : t("common.used")}
            </span>

            {/* Badge de destacado */}
            {vehicle.highlighted && (
              <span className="vehicle-showcase-slide__featured">
                <Star className="w-3 h-3 fill-current" />
              </span>
            )}

            {/* Botón expandir (como en la segunda imagen) */}
            <span className="vehicle-showcase-slide__expand">
              <Maximize2 size={15} strokeWidth={2} aria-hidden />
              {t("detail.expandPhoto")}
            </span>
          </div>

          {/* Miniaturas (como en la segunda imagen) */}
          <div className="vehicle-showcase-slide__thumbs">
            {GALLERY_SHOTS.map((shot, i) => (
              <button
                key={shot.key}
                type="button"
                className={`vehicle-showcase-slide__thumb ${
                  i === activeThumb ? "vehicle-showcase-slide__thumb--active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveThumb(i);
                }}
                aria-label={`Ver ${shot.label}`}
              >
                {!imageError ? (
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    style={{ objectPosition: shot.position }}
                    sizes="80px"
                  />
                ) : (
                  <div className="vehicle-showcase-slide__thumb-placeholder" />
                )}
                <span className="vehicle-showcase-slide__thumb-label">
                  {shot.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bloque derecho: información del vehículo (como en la segunda imagen) */}
        <div className="vehicle-showcase-slide__right">
          <div className="vehicle-showcase-slide__content">
            <div className="vehicle-showcase-slide__header">
              <div>
                <span className="vehicle-showcase-slide__brand">
                  {vehicle.brand}
                </span>
                <h3 className="vehicle-showcase-slide__title">{vehicle.model}</h3>
              </div>
              <div className="vehicle-showcase-slide__price">
                {formatCurrency(vehicle.price, locale)}
              </div>
            </div>

            <p className="vehicle-showcase-slide__tagline">{vehicle.tagline}</p>

            {/* Especificaciones en grid (como en la segunda imagen) */}
            <div className="vehicle-showcase-slide__specs-grid">
              <div className="vehicle-showcase-slide__spec-item">
                <span className="vehicle-showcase-slide__spec-label">Año</span>
                <span className="vehicle-showcase-slide__spec-value">
                  {vehicle.year}
                </span>
              </div>
              <div className="vehicle-showcase-slide__spec-item">
                <span className="vehicle-showcase-slide__spec-label">Kilometraje</span>
                <span className="vehicle-showcase-slide__spec-value">
                  {mileageText(vehicle.mileageKm, t)}
                </span>
              </div>
              <div className="vehicle-showcase-slide__spec-item">
                <span className="vehicle-showcase-slide__spec-label">Combustible</span>
                <span className="vehicle-showcase-slide__spec-value">
                  {t(`fuel.${vehicle.fuelType}`)}
                </span>
              </div>
              <div className="vehicle-showcase-slide__spec-item">
                <span className="vehicle-showcase-slide__spec-label">Carrocería</span>
                <span className="vehicle-showcase-slide__spec-value">
                  {t(bodyTypeKey[vehicle.bodyType])}
                </span>
              </div>
              <div className="vehicle-showcase-slide__spec-item">
                <span className="vehicle-showcase-slide__spec-label">Potencia</span>
                <span className="vehicle-showcase-slide__spec-value">
                  {vehicle.horsepower} HP
                </span>
              </div>
              <div className="vehicle-showcase-slide__spec-item">
                <span className="vehicle-showcase-slide__spec-label">Asientos</span>
                <span className="vehicle-showcase-slide__spec-value">
                  {vehicle.seats}
                </span>
              </div>
            </div>

            <AuctionLotBadges vehicle={vehicle} />

            {/* Características destacadas */}
            {vehicle.features.length > 0 && (
              <div className="vehicle-showcase-slide__features">
                {vehicle.features.slice(0, 4).map((feature, idx) => (
                  <span key={idx} className="vehicle-showcase-slide__feature">
                    <Star className="w-3 h-3 fill-current text-(--accent-neon)" />
                    {feature}
                  </span>
                ))}
                {vehicle.features.length > 4 && (
                  <span className="vehicle-showcase-slide__feature-more">
                    +{vehicle.features.length - 4} más asdadadad
                  </span>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="vehicle-showcase-slide__actions">
              <span className="vehicle-showcase-slide__view">
                {t("catalog.viewDetails")}
                <ChevronRight className="w-4 h-4" />
              </span>
              <span className="vehicle-showcase-slide__testdrive">
                {t("detail.testDrive")}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}