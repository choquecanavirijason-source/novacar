/**
 * Presentation · Page · VehiclesAdminPage
 * CRUD de autos del catálogo público (panel admin): marca, modelo, precio,
 * specs, features y si aparece destacado en el home.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useToast } from "@core/toast/ToastProvider";
import { Button } from "@ui/atoms/Button";
import { Badge } from "@ui/atoms/Badge";
import { Skeleton } from "@ui/atoms/Skeleton";
import { formatCurrency } from "@core/format/formatters";
import { DataTable, type Column } from "@ui/organisms/DataTable";
import { useVehicleAdminStore } from "../store/useVehicleAdminStore";
import { VehicleFormModal } from "../components/VehicleFormModal";
import type { CatalogVehicle, NewCatalogVehicle } from "../../domain/entities/CatalogVehicle";

export function VehiclesAdminPage() {
  const { t, locale } = useTranslation();
  const toast = useToast();
  const { vehicles, loading, load, create, update, remove } = useVehicleAdminStore();
  const [modalVehicle, setModalVehicle] = useState<CatalogVehicle | "new" | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) => `${v.brand} ${v.model}`.toLowerCase().includes(q));
  }, [vehicles, query]);

  async function handleSubmit(input: NewCatalogVehicle) {
    if (modalVehicle === "new") return create(input);
    if (modalVehicle) return update(modalVehicle.id, input);
    return false;
  }

  async function handleDelete(vehicle: CatalogVehicle) {
    if (!window.confirm(t("admin.vehicleDeleteConfirm"))) return;
    await remove(vehicle.id);
    toast.success(t("admin.vehicleDeleteSuccess"));
  }

  if (loading && vehicles.length === 0) return <Skeleton height={320} />;

  const columns: Column<CatalogVehicle>[] = [
    {
      key: "vehicle",
      header: t("admin.vehicleFieldModel"),
      render: (v) => (
        <div>
          <strong>
            {v.brand} {v.model}
          </strong>
          <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{v.year}</div>
        </div>
      ),
    },
    {
      key: "bodyType",
      header: t("admin.vehicleFieldBodyType"),
      render: (v) => <span style={{ color: "var(--text-secondary)" }}>{t(`body.${v.bodyType}`)}</span>,
    },
    { key: "price", header: t("admin.colPrice"), align: "right", render: (v) => formatCurrency(v.price, locale) },
    {
      key: "highlighted",
      header: t("admin.vehicleFieldHighlighted"),
      render: (v) =>
        v.highlighted ? (
          <Badge tone="neon">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Star size={11} strokeWidth={2} aria-hidden /> {t("common.active")}
            </span>
          </Badge>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>—</span>
        ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (v) => (
        <div className="admin-row-actions">
          <button type="button" className="admin-iconBtn" onClick={() => setModalVehicle(v)} aria-label={t("common.edit")}>
            <Pencil size={15} strokeWidth={1.75} aria-hidden />
          </button>
          <button
            type="button"
            className="admin-iconBtn admin-iconBtn--danger"
            onClick={() => handleDelete(v)}
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
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{t("admin.vehicles")}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
            {t("admin.vehiclesSubtitle")}
          </p>
        </div>
        <Button size="sm" onClick={() => setModalVehicle("new")}>
          <Plus size={15} strokeWidth={2.25} aria-hidden /> {t("admin.vehicleAdd")}
        </Button>
      </div>

      <label className="admin-search">
        <Search size={16} strokeWidth={1.75} aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("admin.vehicleSearch")}
          aria-label={t("admin.vehicleSearch")}
        />
      </label>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--text-muted)", padding: "24px 0" }}>{t("admin.vehiclesEmpty")}</p>
      ) : (
        <DataTable columns={columns} rows={filtered} rowKey={(v) => v.id} />
      )}

      {modalVehicle && (
        <VehicleFormModal
          vehicle={modalVehicle === "new" ? undefined : modalVehicle}
          onClose={() => setModalVehicle(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
