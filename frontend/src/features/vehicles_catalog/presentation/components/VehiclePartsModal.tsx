/**
 * Presentation · Component · VehiclePartsModal
 * Popup que se abre al hacer click en el auto del Hero: lista las autopartes
 * del vehículo con su estado (grid), y al hacer click en una pieza muestra
 * su detalle (descripción + estado + acceso a la tienda real de autopartes).
 * Datos mock locales — pendiente de conectar a compatibilidad real por vehículo.
 */

"use client";

import { useState } from "react";
import {
  X,
  Cog,
  Disc2,
  ArrowUpDown,
  BatteryCharging,
  Disc,
  Lightbulb,
  Volume2,
  Filter,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Badge } from "@ui/atoms/Badge";
import { Button } from "@ui/atoms/Button";
import { useModalA11y } from "@ui/hooks/useModalA11y";
import "../styles/vehicle-parts-modal.css";

type PartStatus = "good" | "warning" | "critical";

interface MockPart {
  id: string;
  icon: LucideIcon;
  status: PartStatus;
}

const MOCK_PARTS: MockPart[] = [
  { id: "engine", icon: Cog, status: "good" },
  { id: "brakes", icon: Disc2, status: "warning" },
  { id: "suspension", icon: ArrowUpDown, status: "good" },
  { id: "battery", icon: BatteryCharging, status: "good" },
  { id: "tires", icon: Disc, status: "warning" },
  { id: "lights", icon: Lightbulb, status: "critical" },
  { id: "audio", icon: Volume2, status: "good" },
  { id: "filters", icon: Filter, status: "critical" },
];

const STATUS_TONE: Record<PartStatus, "in" | "low" | "out"> = {
  good: "in",
  warning: "low",
  critical: "out",
};

const STATUS_KEY: Record<PartStatus, string> = {
  good: "vehicleParts.statusGood",
  warning: "vehicleParts.statusWarning",
  critical: "vehicleParts.statusCritical",
};

export function VehiclePartsModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = MOCK_PARTS.find((p) => p.id === selectedId) ?? null;
  const panelRef = useModalA11y<HTMLDivElement>(onClose);

  return (
    <div
      className="vparts-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t("vehicleParts.title")}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="vparts-panel glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="vparts-close"
          onClick={onClose}
          aria-label={t("vehicleParts.close")}
        >
          <X size={18} strokeWidth={1.75} aria-hidden />
        </button>

        {!selected ? (
          <>
            <h2 className="vparts-title">{t("vehicleParts.title")}</h2>
            <p className="vparts-subtitle">{t("vehicleParts.subtitle")}</p>

            <div className="vparts-grid">
              {MOCK_PARTS.map((part) => {
                const Icon = part.icon;
                return (
                  <button
                    key={part.id}
                    type="button"
                    className="vparts-item"
                    onClick={() => setSelectedId(part.id)}
                  >
                    <span className="vparts-item__icon">
                      <Icon size={26} strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="vparts-item__name">{t(`vehicleParts.part.${part.id}`)}</span>
                    <Badge tone={STATUS_TONE[part.status]}>{t(STATUS_KEY[part.status])}</Badge>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="vparts-detail">
            <button type="button" className="vparts-back" onClick={() => setSelectedId(null)}>
              ← {t("vehicleParts.back")}
            </button>

            <DetailIcon icon={selected.icon} />
            <h3 className="vparts-detail__name">{t(`vehicleParts.part.${selected.id}`)}</h3>
            <Badge tone={STATUS_TONE[selected.status]}>{t(STATUS_KEY[selected.status])}</Badge>
            <p className="vparts-detail__desc">{t(`vehicleParts.partDesc.${selected.id}`)}</p>

            <Button href="/autopartes" size="sm">
              {t("vehicleParts.viewInStore")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="vparts-detail__icon">
      <Icon size={44} strokeWidth={1.25} aria-hidden />
    </span>
  );
}
