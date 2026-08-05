/**
 * Presentation · Page · BannersPage
 * Gestión de banners promocionales del sitio: alta, edición, activar/desactivar,
 * reordenar y eliminar. Misma tabla (DataTable) que Vehículos e Inventario.
 */

"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useToast } from "@core/toast/ToastProvider";
import { Button } from "@ui/atoms/Button";
import { Skeleton } from "@ui/atoms/Skeleton";
import { DataTable, type Column } from "@ui/organisms/DataTable";
import { useBannerStore } from "../store/useBannerStore";
import { BannerFormModal } from "../components/BannerFormModal";
import type { Banner, NewBanner } from "../../domain/entities/Banner";

export function BannersPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const { banners, loading, loadAll, create, update, remove, toggleActive, moveUp, moveDown } = useBannerStore();
  const [modalBanner, setModalBanner] = useState<Banner | "new" | null>(null);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  async function handleSubmit(input: NewBanner) {
    if (modalBanner === "new") return create(input);
    if (modalBanner) return update(modalBanner.id, input);
    return false;
  }

  async function handleDelete(banner: Banner) {
    if (!window.confirm(t("admin.bannerDeleteConfirm"))) return;
    await remove(banner.id);
    toast.success(t("admin.bannerDeleteSuccess"));
  }

  if (loading && banners.length === 0) return <Skeleton height={320} />;

  const ordered = [...banners].sort((a, b) => a.order - b.order);

  const columns: Column<Banner>[] = [
    {
      key: "banner",
      header: t("admin.banners"),
      render: (b) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- URL arbitraria capturada por el admin */}
          <img
            className="admin-thumb"
            src={b.imageUrl}
            alt=""
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
          />
          <div style={{ minWidth: 0 }}>
            <strong>{b.title}</strong>
            <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{b.href}</div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: t("admin.colStatus"),
      render: (b) => (
        <label className="admin-toggle">
          <input type="checkbox" checked={b.active} onChange={(e) => toggleActive(b.id, e.target.checked)} />
          {b.active ? t("common.active") : t("common.inactive")}
        </label>
      ),
    },
    {
      key: "order",
      header: t("admin.bannerOrder"),
      render: (b) => {
        const index = ordered.findIndex((o) => o.id === b.id);
        return (
          <div className="admin-row-actions" style={{ justifyContent: "flex-start" }}>
            <button
              type="button"
              className="admin-iconBtn"
              disabled={index === 0}
              onClick={() => moveUp(b.id)}
              aria-label={t("common.moveUp")}
            >
              <ArrowUp size={15} strokeWidth={1.75} aria-hidden />
            </button>
            <button
              type="button"
              className="admin-iconBtn"
              disabled={index === ordered.length - 1}
              onClick={() => moveDown(b.id)}
              aria-label={t("common.moveDown")}
            >
              <ArrowDown size={15} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (b) => (
        <div className="admin-row-actions">
          <button type="button" className="admin-iconBtn" onClick={() => setModalBanner(b)} aria-label={t("common.edit")}>
            <Pencil size={15} strokeWidth={1.75} aria-hidden />
          </button>
          <button
            type="button"
            className="admin-iconBtn admin-iconBtn--danger"
            onClick={() => handleDelete(b)}
            aria-label={t("common.delete")}
          >
            <Trash2 size={15} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{t("admin.banners")}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
            {t("admin.bannersSubtitle")}
          </p>
        </div>
        <Button size="sm" onClick={() => setModalBanner("new")}>
          <Plus size={15} strokeWidth={2.25} aria-hidden /> {t("admin.bannerAdd")}
        </Button>
      </div>

      {ordered.length === 0 ? (
        <p style={{ color: "var(--text-muted)", padding: "24px 0" }}>{t("admin.bannersEmpty")}</p>
      ) : (
        <DataTable columns={columns} rows={ordered} rowKey={(b) => b.id} />
      )}

      {modalBanner && (
        <BannerFormModal
          banner={modalBanner === "new" ? undefined : modalBanner}
          onClose={() => setModalBanner(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
