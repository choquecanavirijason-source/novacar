/**
 * Presentation · Component · AddPartModal
 * Popup para dar de alta o editar un conteo de bodega (batería/fusible):
 * nombre, categoría, precio, stock y umbral de reorden. No es contenido
 * público — para eso están Vehículos y Autopartes.
 */

"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useToast } from "@core/toast/ToastProvider";
import { Input } from "@ui/atoms/Input";
import { Button } from "@ui/atoms/Button";
import { SelectWithAdd } from "@ui/molecules/SelectWithAdd";
import { ModalPortal } from "@ui/atoms/ModalPortal";
import { useModalA11y } from "@ui/hooks/useModalA11y";
import type { InventoryItem, NewInventoryItem } from "../../domain/entities/InventoryItem";

type Category = InventoryItem["category"];

export function AddPartModal({
  item,
  onClose,
  onSubmit,
}: {
  item?: InventoryItem;
  onClose: () => void;
  onSubmit: (input: NewInventoryItem) => Promise<boolean>;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState<Category>(item?.category ?? "battery");
  const [price, setPrice] = useState(String(item?.price ?? ""));
  const [stock, setStock] = useState(String(item?.stock ?? ""));
  const [reorderLevel, setReorderLevel] = useState(String(item?.reorderLevel ?? 5));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useModalA11y<HTMLDivElement>(onClose);

  const categoryBuiltin = [
    { value: "battery", label: t("admin.categoryBattery") },
    { value: "fuse", label: t("admin.categoryFuse") },
  ];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const ok = await onSubmit({
      name: name.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      reorderLevel: Number(reorderLevel),
    });
    setSaving(false);
    if (ok) {
      toast.success(item ? t("admin.itemUpdateSuccess") : t("admin.addSuccess"));
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
        aria-label={item ? t("admin.itemEditTitle") : t("admin.addPartTitle")}
        onClick={onClose}
      >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="addpart-panel glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="addpart-close" onClick={onClose} aria-label={t("admin.cancel")}>
          <X size={18} strokeWidth={1.75} aria-hidden />
        </button>

        <h2 className="addpart-title">{item ? t("admin.itemEditTitle") : t("admin.addPartTitle")}</h2>
        <p className="addpart-subtitle">{t("admin.addPartSubtitle")}</p>

        <form className="addpart-form" onSubmit={handleSubmit}>
          <label className="addpart-field">
            <span>{t("admin.fieldName")}</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label className="addpart-field">
            <span>{t("admin.fieldCategory")}</span>
            <SelectWithAdd
              storageKey="novacar.options.inventory.category"
              builtin={categoryBuiltin}
              value={category}
              onChange={(v) => setCategory(v as Category)}
              addLabel={t("admin.addOption")}
              addPlaceholder={t("admin.addOptionPlaceholder")}
            />
          </label>

          <div className="addpart-row">
            <label className="addpart-field">
              <span>{t("admin.fieldPrice")}</span>
              <Input type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} required />
            </label>
            <label className="addpart-field">
              <span>{t("admin.fieldStock")}</span>
              <Input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} required />
            </label>
            <label className="addpart-field">
              <span>{t("admin.fieldReorder")}</span>
              <Input type="number" min={0} value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} required />
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
              {saving ? t("common.loading") : t("admin.submit")}
            </Button>
          </div>
        </form>
      </div>
      </div>
    </ModalPortal>
  );
}
