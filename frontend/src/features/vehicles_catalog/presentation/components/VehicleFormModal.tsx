/**
 * Presentation · Component · VehicleFormModal
 * Popup para crear/editar un auto del catálogo (panel admin).
 */

"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useToast } from "@core/toast/ToastProvider";
import { Input } from "@ui/atoms/Input";
import { Button } from "@ui/atoms/Button";
import { SelectWithAdd } from "@ui/molecules/SelectWithAdd";
import { ImageUrlField } from "@ui/molecules/ImageUrlField";
import { ModalPortal } from "@ui/atoms/ModalPortal";
import { useModalA11y } from "@ui/hooks/useModalA11y";
import type {
  BodyType,
  CatalogVehicle,
  Condition,
  FuelType,
  NewCatalogVehicle,
  Transmission,
} from "../../domain/entities/CatalogVehicle";

const BODY_TYPES: BodyType[] = ["sedan", "suv", "hatchback", "pickup", "motocicleta"];
const FUEL_TYPES: FuelType[] = ["gasolina", "hibrido", "electrico", "diesel"];
const TRANSMISSIONS: Transmission[] = ["manual", "automatica"];
const CONDITIONS: Condition[] = ["nuevo", "seminuevo"];

export function VehicleFormModal({
  vehicle,
  onClose,
  onSubmit,
}: {
  vehicle?: CatalogVehicle;
  onClose: () => void;
  onSubmit: (input: NewCatalogVehicle) => Promise<boolean>;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const [brand, setBrand] = useState(vehicle?.brand ?? "");
  const [model, setModel] = useState(vehicle?.model ?? "");
  const [year, setYear] = useState(String(vehicle?.year ?? new Date().getFullYear()));
  const [price, setPrice] = useState(String(vehicle?.price ?? ""));
  const [tagline, setTagline] = useState(vehicle?.tagline ?? "");
  const [bodyType, setBodyType] = useState<BodyType>(vehicle?.bodyType ?? "sedan");
  const [fuelType, setFuelType] = useState<FuelType>(vehicle?.fuelType ?? "gasolina");
  const [transmission, setTransmission] = useState<Transmission>(vehicle?.transmission ?? "automatica");
  const [condition, setCondition] = useState<Condition>(vehicle?.condition ?? "nuevo");
  const [mileageKm, setMileageKm] = useState(String(vehicle?.mileageKm ?? 0));
  const [horsepower, setHorsepower] = useState(String(vehicle?.horsepower ?? ""));
  const [seats, setSeats] = useState(String(vehicle?.seats ?? 5));
  const [features, setFeatures] = useState(vehicle?.features.join(", ") ?? "");
  const [imageUrl, setImageUrl] = useState(vehicle?.imageUrl ?? "");
  const [accentFrom, setAccentFrom] = useState(vehicle?.accentFrom ?? "#005f8f");
  const [accentTo, setAccentTo] = useState(vehicle?.accentTo ?? "#00aaff");
  const [highlighted, setHighlighted] = useState(vehicle?.highlighted ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useModalA11y<HTMLDivElement>(onClose);

  const bodyTypeBuiltin = BODY_TYPES.map((b) => ({ value: b, label: t(`body.${b}`) }));
  const fuelTypeBuiltin = FUEL_TYPES.map((f) => ({ value: f, label: t(`fuel.${f}`) }));
  const transmissionBuiltin = TRANSMISSIONS.map((tr) => ({ value: tr, label: t(`transmission.${tr}`) }));
  const conditionBuiltin = CONDITIONS.map((c) => ({
    value: c,
    label: t(c === "nuevo" ? "common.new" : "common.used"),
  }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const ok = await onSubmit({
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year),
      price: Number(price),
      tagline: tagline.trim(),
      bodyType,
      fuelType,
      transmission,
      condition,
      mileageKm: Number(mileageKm),
      horsepower: Number(horsepower),
      seats: Number(seats),
      features: features.split(",").map((f) => f.trim()).filter(Boolean),
      imageUrl: imageUrl.trim() || undefined,
      accentFrom,
      accentTo,
      highlighted,
    });
    setSaving(false);
    if (ok) {
      toast.success(vehicle ? t("admin.vehicleUpdateSuccess") : t("admin.vehicleCreateSuccess"));
      onClose();
    } else {
      setError(t("common.saveError"));
    }
  }

  return (
    <ModalPortal>
      <div
        className="addpart-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={vehicle ? t("admin.vehicleEditTitle") : t("admin.vehicleAddTitle")}
        onClick={onClose}
      >
      <div ref={panelRef} tabIndex={-1} className="addpart-panel glass-panel addpart-panel--wide" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="addpart-close" onClick={onClose} aria-label={t("admin.cancel")}>
          <X size={18} strokeWidth={1.75} aria-hidden />
        </button>

        <h2 className="addpart-title">{vehicle ? t("admin.vehicleEditTitle") : t("admin.vehicleAddTitle")}</h2>
        <p className="addpart-subtitle">{t("admin.vehicleAddSubtitle")}</p>

        <form className="addpart-form" onSubmit={handleSubmit}>
          <ImageUrlField
            label={t("admin.vehicleFieldImage")}
            value={imageUrl}
            onChange={setImageUrl}
            uploadLabel={t("admin.uploadFromDevice")}
          />

          <div className="addpart-row">
            <label className="addpart-field">
              <span>{t("admin.vehicleFieldBrand")}</span>
              <Input value={brand} onChange={(e) => setBrand(e.target.value)} required />
            </label>
            <label className="addpart-field">
              <span>{t("admin.vehicleFieldModel")}</span>
              <Input value={model} onChange={(e) => setModel(e.target.value)} required />
            </label>
            <label className="addpart-field">
              <span>{t("admin.vehicleFieldYear")}</span>
              <Input type="number" min={1980} value={year} onChange={(e) => setYear(e.target.value)} required />
            </label>
          </div>

          <label className="addpart-field">
            <span>{t("admin.vehicleFieldTagline")}</span>
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </label>

          <div className="addpart-row">
            <label className="addpart-field">
              <span>{t("admin.vehicleFieldPrice")}</span>
              <Input type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} required />
            </label>
            <label className="addpart-field">
              <span>{t("admin.vehicleFieldMileage")}</span>
              <Input type="number" min={0} value={mileageKm} onChange={(e) => setMileageKm(e.target.value)} />
            </label>
            <label className="addpart-field">
              <span>{t("admin.vehicleFieldHorsepower")}</span>
              <Input type="number" min={0} value={horsepower} onChange={(e) => setHorsepower(e.target.value)} required />
            </label>
          </div>

          <div className="addpart-row">
            <label className="addpart-field">
              <span>{t("admin.vehicleFieldBodyType")}</span>
              <SelectWithAdd
                storageKey="novacar.options.vehicle.bodyType"
                builtin={bodyTypeBuiltin}
                value={bodyType}
                onChange={(v) => setBodyType(v as BodyType)}
                addLabel={t("admin.addOption")}
                addPlaceholder={t("admin.addOptionPlaceholder")}
              />
            </label>
            <label className="addpart-field">
              <span>{t("admin.vehicleFieldFuelType")}</span>
              <SelectWithAdd
                storageKey="novacar.options.vehicle.fuelType"
                builtin={fuelTypeBuiltin}
                value={fuelType}
                onChange={(v) => setFuelType(v as FuelType)}
                addLabel={t("admin.addOption")}
                addPlaceholder={t("admin.addOptionPlaceholder")}
              />
            </label>
            <label className="addpart-field">
              <span>{t("admin.vehicleFieldTransmission")}</span>
              <SelectWithAdd
                storageKey="novacar.options.vehicle.transmission"
                builtin={transmissionBuiltin}
                value={transmission}
                onChange={(v) => setTransmission(v as Transmission)}
                addLabel={t("admin.addOption")}
                addPlaceholder={t("admin.addOptionPlaceholder")}
              />
            </label>
          </div>

          <div className="addpart-row">
            <label className="addpart-field">
              <span>{t("admin.vehicleFieldCondition")}</span>
              <SelectWithAdd
                storageKey="novacar.options.vehicle.condition"
                builtin={conditionBuiltin}
                value={condition}
                onChange={(v) => setCondition(v as Condition)}
                addLabel={t("admin.addOption")}
                addPlaceholder={t("admin.addOptionPlaceholder")}
              />
            </label>
            <label className="addpart-field">
              <span>{t("admin.vehicleFieldSeats")}</span>
              <Input type="number" min={1} max={9} value={seats} onChange={(e) => setSeats(e.target.value)} />
            </label>
            <label className="addpart-field addpart-field--checkbox">
              <input type="checkbox" checked={highlighted} onChange={(e) => setHighlighted(e.target.checked)} />
              <span>{t("admin.vehicleFieldHighlighted")}</span>
            </label>
          </div>

          <label className="addpart-field">
            <span>{t("admin.vehicleFieldFeatures")}</span>
            <Input value={features} onChange={(e) => setFeatures(e.target.value)} placeholder={t("admin.vehicleFeaturesPlaceholder")} />
          </label>

          <div className="addpart-row">
            <label className="addpart-field">
              <span>{t("admin.bannerFieldAccentFrom")}</span>
              <Input type="color" value={accentFrom} onChange={(e) => setAccentFrom(e.target.value)} />
            </label>
            <label className="addpart-field">
              <span>{t("admin.bannerFieldAccentTo")}</span>
              <Input type="color" value={accentTo} onChange={(e) => setAccentTo(e.target.value)} />
            </label>
          </div>

          {error && (
            <p className="login-page__error" role="alert">
              {error}
            </p>
          )}

          <div className="addpart-actions">
            <Button type="button" variant="ghost" onClick={onClose}>
              {t("admin.cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t("common.loading") : t("admin.vehicleSubmit")}
            </Button>
          </div>
        </form>
      </div>
      </div>
    </ModalPortal>
  );
}
