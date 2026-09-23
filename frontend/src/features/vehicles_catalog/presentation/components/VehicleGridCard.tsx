// src/features/vehicles_catalog/presentation/components/VehicleGridCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Gauge, Fuel, Car, Star } from "lucide-react";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { getVehicleImageUrl } from "../catalogPresentation";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { bodyTypeKey, transmissionKey, mileageText } from "../vehiclePresentation";
import { AuctionLotBadges } from "./AuctionLotBadges";

export function VehicleGridCard({ vehicle, index = 0 }: { vehicle: CatalogVehicle; index?: number }) {
  const { t, locale } = useTranslation();
  const [imageError, setImageError] = useState(false);
  
  const imageUrl = getVehicleImageUrl(vehicle);

  return (
    <Link 
      href={`/catalogo/${vehicle.id}`}
      className="vehicle-grid-card group"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="vehicle-grid-card__image-wrapper">
        <div className="vehicle-grid-card__image">
          {!imageError ? (
            <Image
              src={imageUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 4}
            />
          ) : (
            <div className="vehicle-grid-card__placeholder">
              <Car className="w-12 h-12" />
              <span className="text-sm mt-2">{vehicle.brand}</span>
              <span className="text-xs">{vehicle.model}</span>
            </div>
          )}
        </div>
        
        <span className={`vehicle-grid-card__badge ${
          vehicle.condition === 'nuevo' ? 'vehicle-grid-card__badge--new' : 'vehicle-grid-card__badge--used'
        }`}>
          {vehicle.condition === 'nuevo' ? t('common.new') : t('common.used')}
        </span>
        
        {vehicle.highlighted && (
          <span className="vehicle-grid-card__featured">
            <Star className="w-3 h-3 fill-current" />
          </span>
        )}
      </div>

      <div className="vehicle-grid-card__content">
        <div className="vehicle-grid-card__header">
          <span className="vehicle-grid-card__brand">{vehicle.brand}</span>
          <h3 className="vehicle-grid-card__title">{vehicle.model}</h3>
        </div>

        <div className="vehicle-grid-card__price">
          {formatCurrency(vehicle.price, locale)}
        </div>

        <div className="vehicle-grid-card__specs">
          <span className="vehicle-grid-card__spec">
            <Calendar className="w-3.5 h-3.5" />
            {vehicle.year}
          </span>
          <span className="vehicle-grid-card__spec">
            <Gauge className="w-3.5 h-3.5" />
            {mileageText(vehicle.mileageKm, t)}
          </span>
          <span className="vehicle-grid-card__spec">
            <Fuel className="w-3.5 h-3.5" />
            {t(`fuel.${vehicle.fuelType}`)}
          </span>
          <span className="vehicle-grid-card__spec">
            <Car className="w-3.5 h-3.5" />
            {t(bodyTypeKey[vehicle.bodyType])}
          </span>
        </div>

        <AuctionLotBadges vehicle={vehicle} compact />

        <div className="vehicle-grid-card__tagline">
          {vehicle.tagline}
        </div>

        <div className="vehicle-grid-card__footer">
          <span className="vehicle-grid-card__view">
            {t('catalog.viewDetails')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}