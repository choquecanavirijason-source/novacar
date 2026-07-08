/**
 * Presentation · Component · VehicleCard (organism del feature)
 * Tarjeta de auto moderna estilo rental: "foto" por gradiente, fila de specs con
 * iconos (combustible, transmisión, plazas), precio y botón. Traducida.
 */

"use client";

import Link from "next/link";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import {
  bodyTypeIcon,
  fuelIcon,
  fuelKey,
} from "../vehiclePresentation";

export function VehicleCard({ vehicle, index = 0 }: { vehicle: CatalogVehicle; index?: number }) {
  const { t } = useTranslation();

  return (
    <Link
      href={`/catalogo/${vehicle.id}`}
      className="vehicle-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className="vehicle-card__photo"
        style={{ background: `linear-gradient(140deg, ${vehicle.accentFrom}, ${vehicle.accentTo})` }}
      >
        <div className="vehicle-card__tags">
          <span className="tag-pill">{vehicle.condition === "nuevo" ? t("common.new") : t("common.used")}</span>
          <span className="tag-pill">{vehicle.year}</span>
        </div>
        <span className="vehicle-card__icon">{bodyTypeIcon[vehicle.bodyType]}</span>
      </div>

      <div className="vehicle-card__body">
        <div>
          <div className="vehicle-card__brand">{vehicle.brand}</div>
          <div className="vehicle-card__model">{vehicle.model}</div>
        </div>

        {/* Fila de specs con iconos (estilo rental) */}
        <div className="vehicle-card__iconrow">
          <span className="vehicle-card__icspec" title={t(fuelKey[vehicle.fuelType])}>
            {fuelIcon[vehicle.fuelType]} {t(fuelKey[vehicle.fuelType])}
          </span>
          <span className="vehicle-card__icspec">⚙️ {vehicle.horsepower} hp</span>
          <span className="vehicle-card__icspec">👤 {vehicle.seats}</span>
        </div>

        <div className="vehicle-card__footer">
          <div>
            <div className="vehicle-card__price text-gradient">{formatCurrency(vehicle.price)}</div>
          </div>
          <span className="btn btn--primary" style={{ padding: "9px 16px", fontSize: "0.84rem" }}>
            {t("common.view")} →
          </span>
        </div>
      </div>
    </Link>
  );
}
