/**
 * Presentation · Component · AuctionLotBadges
 * Adelanto tipo "ficha de lote" (Copart/IAAI) para tarjetas de vehículo:
 * título, daño principal y run&drive. Solo se muestra cuando el vehículo
 * trae datos reales capturados por el admin (`hasAuctionInfo`); el detalle
 * completo vive en VehicleDetail (`vdetail-additional-info`), esto es solo
 * el adelanto en la tarjeta para que el usuario sepa qué esperar antes de
 * entrar. Reutilizable entre /catalogo e /importaciones (mismo CatalogVehicle).
 */

import { FileText, Shield, AlertTriangle, Zap } from "lucide-react";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { useTranslation } from "@core/i18n/I18nProvider";
import { damageBadgeClass, damageSeverityKey, hasAuctionInfo } from "../vehiclePresentation";

type LotField = "title" | "damage" | "run";
const ALL_FIELDS: LotField[] = ["title", "damage", "run"];

export function AuctionLotBadges({
  vehicle,
  compact = false,
  only = ALL_FIELDS,
}: {
  vehicle: CatalogVehicle;
  compact?: boolean;
  /** Subconjunto de pills a mostrar (por defecto las 3) — útil en tarjetas chicas. */
  only?: LotField[];
}) {
  const { t } = useTranslation();

  if (!hasAuctionInfo(vehicle)) return null;

  return (
    <div className={`auction-lot-badges ${compact ? "auction-lot-badges--compact" : ""}`}>
      {only.includes("title") && vehicle.titleCode && (
        <span className="auction-lot-badges__pill auction-lot-badges__pill--title">
          <FileText size={12} strokeWidth={2} aria-hidden />
          {vehicle.titleCode}
        </span>
      )}

      {only.includes("damage") && vehicle.damageType && (
        <span className={`auction-lot-badges__pill ${damageBadgeClass(vehicle.damageSeverity)}`}>
          {vehicle.damageSeverity && vehicle.damageSeverity !== "none" ? (
            <AlertTriangle size={12} aria-hidden />
          ) : (
            <Shield size={12} aria-hidden />
          )}
          {vehicle.damageType}
          {vehicle.damageSeverity && (
            <span className="auction-lot-badges__severity">· {t(damageSeverityKey(vehicle.damageSeverity))}</span>
          )}
        </span>
      )}

      {only.includes("run") && vehicle.runAndDrive && (
        <span className="auction-lot-badges__pill auction-lot-badges__pill--run">
          <Zap size={12} strokeWidth={2} aria-hidden />
          {t("detail.runAndDrive")}
        </span>
      )}
    </div>
  );
}
