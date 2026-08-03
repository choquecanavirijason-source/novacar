/**
 * Presentation · Component · MarketplacePartFormModal
 * Popup para crear/editar una autoparte del marketplace (panel admin).
 */

"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useToast } from "@core/toast/ToastProvider";
import { Input } from "@ui/atoms/Input";
import { Button } from "@ui/atoms/Button";
import { SelectWithAdd } from "@ui/molecules/SelectWithAdd";
import { useModalA11y } from "@ui/hooks/useModalA11y";
import {
  PART_CATEGORIES,
  type MarketplacePart,
  type NewMarketplacePart,
  type PartCategory,
  type PartCondition,
} from "../../domain/entities/MarketplacePart";

const CONDITIONS: PartCondition[] = ["nuevo", "usado", "reconstruido"];

function parseSpecs(text: string) {
  return text
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [label, value] = chunk.split(":").map((s) => s.trim());
      return { label: label ?? chunk, value: value ?? "" };
    });
}

export function MarketplacePartFormModal({
  part,
  onClose,
  onSubmit,
}: {
  part?: MarketplacePart;
  onClose: () => void;
  onSubmit: (input: NewMarketplacePart) => Promise<boolean>;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const [sku, setSku] = useState(part?.sku ?? "");
  const [name, setName] = useState(part?.name ?? "");
  const [brand, setBrand] = useState(part?.brand ?? "");
  const [category, setCategory] = useState<PartCategory>(part?.category ?? "engine");
  const [condition, setCondition] = useState<PartCondition>(part?.condition ?? "nuevo");
  const [price, setPrice] = useState(String(part?.price ?? ""));
  const [originalPrice, setOriginalPrice] = useState(part?.originalPrice ? String(part.originalPrice) : "");
  const [stock, setStock] = useState(String(part?.stock ?? ""));
  const [rating, setRating] = useState(String(part?.rating ?? 4.5));
  const [warrantyMonths, setWarrantyMonths] = useState(String(part?.warrantyMonths ?? 12));
  const [freeShipping, setFreeShipping] = useState(part?.freeShipping ?? true);
  const [compatibleBrands, setCompatibleBrands] = useState(part?.compatibleBrands.join(", ") ?? "");
  const [specs, setSpecs] = useState(part?.specs.map((s) => `${s.label}: ${s.value}`).join(", ") ?? "");
  const [accentFrom, setAccentFrom] = useState(part?.accentFrom ?? "#005f8f");
  const [accentTo, setAccentTo] = useState(part?.accentTo ?? "#00aaff");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useModalA11y<HTMLDivElement>(onClose);

  const categoryBuiltin = PART_CATEGORIES.map((c) => ({ value: c, label: t(`partCat.${c}`) }));
  const conditionBuiltin = CONDITIONS.map((c) => ({ value: c, label: t(`cond.${c}`) }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const ok = await onSubmit({
      sku: sku.trim() || `${category.toUpperCase()}-${Date.now()}`,
      name: name.trim(),
      brand: brand.trim(),
      category,
      condition,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock),
      rating: Number(rating),
      reviews: part?.reviews ?? 0,
      seller: part?.seller ?? "NOVACAR Oficial",
      freeShipping,
      warrantyMonths: Number(warrantyMonths),
      compatibleBrands: compatibleBrands.split(",").map((b) => b.trim()).filter(Boolean),
      yearFrom: part?.yearFrom ?? 2012,
      yearTo: part?.yearTo ?? new Date().getFullYear(),
      specs: parseSpecs(specs),
      accentFrom,
      accentTo,
    });
    setSaving(false);
    if (ok) {
      toast.success(part ? t("admin.partUpdateSuccess") : t("admin.partCreateSuccess"));
      onClose();
    } else {
      setError(t("common.saveError"));
    }
  }

  return (
    <div
      className="addpart-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={part ? t("admin.partEditTitle") : t("admin.partAddTitle")}
      onClick={onClose}
    >
      <div ref={panelRef} tabIndex={-1} className="addpart-panel glass-panel addpart-panel--wide" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="addpart-close" onClick={onClose} aria-label={t("admin.cancel")}>
          <X size={18} strokeWidth={1.75} aria-hidden />
        </button>

        <h2 className="addpart-title">{part ? t("admin.partEditTitle") : t("admin.partAddTitle")}</h2>
        <p className="addpart-subtitle">{t("admin.partAddSubtitle")}</p>

        <form className="addpart-form" onSubmit={handleSubmit}>
          <div className="addpart-row">
            <label className="addpart-field">
              <span>{t("admin.fieldName")}</span>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label className="addpart-field">
              <span>{t("admin.partFieldBrand")}</span>
              <Input value={brand} onChange={(e) => setBrand(e.target.value)} required />
            </label>
            <label className="addpart-field">
              <span>{t("admin.colSku")}</span>
              <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder={t("admin.partSkuPlaceholder")} />
            </label>
          </div>

          <div className="addpart-row">
            <label className="addpart-field">
              <span>{t("admin.partFieldCategory")}</span>
              <SelectWithAdd
                storageKey="novacar.options.part.category"
                builtin={categoryBuiltin}
                value={category}
                onChange={(v) => setCategory(v as PartCategory)}
                addLabel={t("admin.addOption")}
                addPlaceholder={t("admin.addOptionPlaceholder")}
              />
            </label>
            <label className="addpart-field">
              <span>{t("admin.vehicleFieldCondition")}</span>
              <SelectWithAdd
                storageKey="novacar.options.part.condition"
                builtin={conditionBuiltin}
                value={condition}
                onChange={(v) => setCondition(v as PartCondition)}
                addLabel={t("admin.addOption")}
                addPlaceholder={t("admin.addOptionPlaceholder")}
              />
            </label>
            <label className="addpart-field addpart-field--checkbox">
              <input type="checkbox" checked={freeShipping} onChange={(e) => setFreeShipping(e.target.checked)} />
              <span>{t("admin.partFieldFreeShipping")}</span>
            </label>
          </div>

          <div className="addpart-row">
            <label className="addpart-field">
              <span>{t("admin.fieldPrice")}</span>
              <Input type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} required />
            </label>
            <label className="addpart-field">
              <span>{t("admin.partFieldOriginalPrice")}</span>
              <Input type="number" min={0} value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder={t("admin.partOriginalPricePlaceholder")} />
            </label>
            <label className="addpart-field">
              <span>{t("admin.fieldStock")}</span>
              <Input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} required />
            </label>
          </div>

          <div className="addpart-row">
            <label className="addpart-field">
              <span>{t("admin.partFieldRating")}</span>
              <Input type="number" min={0} max={5} step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} />
            </label>
            <label className="addpart-field">
              <span>{t("admin.partFieldWarranty")}</span>
              <Input type="number" min={0} value={warrantyMonths} onChange={(e) => setWarrantyMonths(e.target.value)} />
            </label>
          </div>

          <label className="addpart-field">
            <span>{t("admin.partFieldCompatibleBrands")}</span>
            <Input value={compatibleBrands} onChange={(e) => setCompatibleBrands(e.target.value)} placeholder={t("admin.partCompatiblePlaceholder")} />
          </label>

          <label className="addpart-field">
            <span>{t("admin.partFieldSpecs")}</span>
            <Input value={specs} onChange={(e) => setSpecs(e.target.value)} placeholder={t("admin.partSpecsPlaceholder")} />
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
              {saving ? t("common.loading") : t("admin.partSubmit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
