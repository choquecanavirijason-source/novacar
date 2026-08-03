/**
 * Presentation · Component · BannerFormModal
 * Popup para crear/editar un banner promocional del sitio.
 */

"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useToast } from "@core/toast/ToastProvider";
import { Input } from "@ui/atoms/Input";
import { Button } from "@ui/atoms/Button";
import { useModalA11y } from "@ui/hooks/useModalA11y";
import type { Banner, NewBanner } from "../../domain/entities/Banner";

export function BannerFormModal({
  banner,
  onClose,
  onSubmit,
}: {
  banner?: Banner;
  onClose: () => void;
  onSubmit: (input: NewBanner) => Promise<boolean>;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const [title, setTitle] = useState(banner?.title ?? "");
  const [subtitle, setSubtitle] = useState(banner?.subtitle ?? "");
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl ?? "");
  const [ctaLabel, setCtaLabel] = useState(banner?.ctaLabel ?? "");
  const [href, setHref] = useState(banner?.href ?? "");
  const [accentFrom, setAccentFrom] = useState(banner?.accentFrom ?? "#005f8f");
  const [accentTo, setAccentTo] = useState(banner?.accentTo ?? "#00aaff");
  const [active, setActive] = useState(banner?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useModalA11y<HTMLDivElement>(onClose);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const ok = await onSubmit({
      title: title.trim(),
      subtitle: subtitle.trim(),
      imageUrl: imageUrl.trim(),
      ctaLabel: ctaLabel.trim() || t("admin.bannerDefaultCta"),
      href: href.trim(),
      accentFrom,
      accentTo,
      active,
    });
    setSaving(false);
    if (ok) {
      toast.success(banner ? t("admin.bannerUpdateSuccess") : t("admin.bannerCreateSuccess"));
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
      aria-label={banner ? t("admin.bannerEditTitle") : t("admin.bannerAddTitle")}
      onClick={onClose}
    >
      <div ref={panelRef} tabIndex={-1} className="addpart-panel glass-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="addpart-close" onClick={onClose} aria-label={t("admin.cancel")}>
          <X size={18} strokeWidth={1.75} aria-hidden />
        </button>

        <h2 className="addpart-title">{banner ? t("admin.bannerEditTitle") : t("admin.bannerAddTitle")}</h2>
        <p className="addpart-subtitle">{t("admin.bannerAddSubtitle")}</p>

        <form className="addpart-form" onSubmit={handleSubmit}>
          <label className="addpart-field">
            <span>{t("admin.bannerFieldTitle")}</span>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>

          <label className="addpart-field">
            <span>{t("admin.bannerFieldSubtitle")}</span>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </label>

          <label className="addpart-field">
            <span>{t("admin.bannerFieldImage")}</span>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/car-azul-hero.png"
              required
            />
          </label>

          <div className="addpart-row">
            <label className="addpart-field">
              <span>{t("admin.bannerFieldCta")}</span>
              <Input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder={t("admin.bannerDefaultCta")} />
            </label>
            <label className="addpart-field">
              <span>{t("admin.bannerFieldHref")}</span>
              <Input value={href} onChange={(e) => setHref(e.target.value)} placeholder="/catalogo" required />
            </label>
          </div>

          <div className="addpart-row">
            <label className="addpart-field">
              <span>{t("admin.bannerFieldAccentFrom")}</span>
              <Input type="color" value={accentFrom} onChange={(e) => setAccentFrom(e.target.value)} />
            </label>
            <label className="addpart-field">
              <span>{t("admin.bannerFieldAccentTo")}</span>
              <Input type="color" value={accentTo} onChange={(e) => setAccentTo(e.target.value)} />
            </label>
            <label className="addpart-field addpart-field--checkbox">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
              <span>{t("admin.bannerFieldActive")}</span>
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
              {saving ? t("common.loading") : t("admin.bannerSubmit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
