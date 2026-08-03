/**
 * Presentation · Page · AnalyticsPage
 * Resumen ejecutivo del panel: agrega datos reales de los 4 módulos
 * (Vehículos, Inventario, Autopartes, Banners) — nada de cifras inventadas.
 */

"use client";

import { useEffect, useMemo } from "react";
import {
  AlertTriangle,
  BatteryCharging,
  Car,
  FileDown,
  Image as ImageIcon,
  PackagePlus,
  Plus,
  Wallet,
} from "lucide-react";
import { useAdminDashboardStore } from "../store/useAdminDashboardStore";
import { BarChart } from "../components/BarChart";
import { DonutChart } from "../components/DonutChart";
import { useTranslation } from "@core/i18n/I18nProvider";
import { StatCard } from "@ui/molecules/StatCard";
import { Badge } from "@ui/atoms/Badge";
import { Button } from "@ui/atoms/Button";
import { Skeleton } from "@ui/atoms/Skeleton";
import { formatCurrency } from "@core/format/formatters";
import { prettifySlug } from "@core/format/prettifySlug";
import { isLowStock } from "../../domain/entities/InventoryItem";
import { useVehicleAdminStore } from "@features/vehicles_catalog/presentation/store/useVehicleAdminStore";
import { useMarketplacePartAdminStore } from "@features/parts_marketplace/presentation/store/useMarketplacePartAdminStore";
import { resolveCategoryLabel } from "@features/parts_marketplace/presentation/partPresentation";
import { useBannerStore } from "@features/site_banners/presentation/store/useBannerStore";

export function AnalyticsPage() {
  const { t, locale } = useTranslation();
  const { inventory, loading: invLoading, load: loadInventory } = useAdminDashboardStore();
  const { vehicles, loading: vehLoading, load: loadVehicles } = useVehicleAdminStore();
  const { parts, loading: partsLoading, load: loadParts } = useMarketplacePartAdminStore();
  const { banners, loading: bannersLoading, loadAll: loadBanners } = useBannerStore();

  useEffect(() => {
    void loadInventory();
    void loadVehicles();
    void loadParts();
    void loadBanners();
  }, [loadInventory, loadVehicles, loadParts, loadBanners]);

  const loading = invLoading || vehLoading || partsLoading || bannersLoading;

  const lowStockItems = useMemo(
    () =>
      [...inventory]
        .filter(isLowStock)
        .sort((a, b) => a.stock - a.reorderLevel - (b.stock - b.reorderLevel))
        .slice(0, 5),
    [inventory],
  );

  const inventoryByCategory = useMemo(() => {
    const knownLabel: Record<string, string> = {
      battery: t("admin.categoryBattery"),
      fuse: t("admin.categoryFuse"),
    };
    return [...new Set(inventory.map((i) => i.category))].map((c) => ({
      label: knownLabel[c] ?? prettifySlug(c),
      value: inventory.filter((i) => i.category === c).length,
    }));
  }, [inventory, t]);

  const partsByCategory = useMemo(
    () =>
      [...new Set(parts.map((p) => p.category))]
        .map((c) => ({ label: resolveCategoryLabel(c, t), value: parts.filter((p) => p.category === c).length }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6),
    [parts, t],
  );

  const inventoryValue = useMemo(
    () => inventory.reduce((sum, i) => sum + i.stock * i.price, 0),
    [inventory],
  );

  const catalogComposition = useMemo(
    () => [
      { label: t("admin.vehicles"), value: vehicles.length, color: "#3987e5" },
      { label: t("admin.kpiParts"), value: parts.length, color: "#d95926" },
      { label: t("admin.inventoryTabParts"), value: inventory.length, color: "#199e70" },
    ],
    [vehicles, parts, inventory, t],
  );

  if (loading && inventory.length === 0) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={110} />
        ))}
      </div>
    );
  }

  const highlightedCount = vehicles.filter((v) => v.highlighted).length;
  const freeShippingCount = parts.filter((p) => p.freeShipping).length;
  const activeBannersCount = banners.filter((b) => b.active).length;
  const alertsOn = lowStockItems.length > 0;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{t("admin.overview")}</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
          {t("admin.overviewSubtitle")}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <StatCard
          label={t("admin.kpiCars")}
          value={vehicles.length}
          icon={<Car size={20} strokeWidth={1.75} aria-hidden />}
          hint={t("admin.kpiCarsHint2", { n: highlightedCount })}
        />
        <StatCard
          label={t("admin.kpiParts")}
          value={parts.length}
          icon={<BatteryCharging size={20} strokeWidth={1.75} aria-hidden />}
          accent="neon"
          hint={t("admin.kpiPartsHint2", { n: freeShippingCount })}
        />
        <StatCard
          label={t("admin.kpiAlerts")}
          value={lowStockItems.length}
          icon={<AlertTriangle size={20} strokeWidth={1.75} aria-hidden />}
          accent={alertsOn ? "danger" : "success"}
          hint={alertsOn ? t("admin.kpiAlertsOn") : t("admin.kpiAlertsOff")}
        />
        <StatCard
          label={t("admin.kpiInventoryValue")}
          value={formatCurrency(inventoryValue, locale)}
          icon={<Wallet size={20} strokeWidth={1.75} aria-hidden />}
          accent="success"
          hint={t("admin.kpiInventoryValueHint")}
        />
        <StatCard
          label={t("admin.banners")}
          value={`${activeBannersCount}/${banners.length}`}
          icon={<ImageIcon size={20} strokeWidth={1.75} aria-hidden />}
          hint={t("admin.kpiBannersHint")}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 700, marginBottom: 18 }}>{t("admin.catalogComposition")}</h2>
          {catalogComposition.some((d) => d.value > 0) ? (
            <DonutChart data={catalogComposition} unit={t("admin.total")} />
          ) : (
            <p style={{ color: "var(--text-muted)" }}>{t("admin.noData")}</p>
          )}
        </div>

        <div className="card" style={{ padding: 24, display: "grid", gap: 12, alignContent: "start" }}>
          <h2 style={{ fontWeight: 700 }}>{t("admin.quickActions")}</h2>
          <Button href="/admin?tab=vehicles" block>
            <Plus size={15} strokeWidth={2.25} aria-hidden /> {t("admin.actionPublish")}
          </Button>
          <Button href="/admin?tab=inventory" block variant="ghost">
            <PackagePlus size={15} strokeWidth={2} aria-hidden /> {t("admin.actionStock")}
          </Button>
          <Button href="/admin?tab=banners" block variant="ghost">
            <ImageIcon size={15} strokeWidth={2} aria-hidden /> {t("admin.actionBanner")}
          </Button>
          <Button block variant="ghost">
            <FileDown size={15} strokeWidth={2} aria-hidden /> {t("admin.actionExport")}
          </Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 700, marginBottom: 18 }}>{t("admin.inventoryByCategory")}</h2>
          {inventoryByCategory.some((d) => d.value > 0) ? (
            <BarChart data={inventoryByCategory} unit={` ${t("admin.units")}`} />
          ) : (
            <p style={{ color: "var(--text-muted)" }}>{t("admin.noData")}</p>
          )}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 700, marginBottom: 18 }}>{t("admin.partsByCategory")}</h2>
          {partsByCategory.length > 0 ? (
            <BarChart data={partsByCategory} unit={` ${t("admin.units")}`} />
          ) : (
            <p style={{ color: "var(--text-muted)" }}>{t("admin.noData")}</p>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontWeight: 700, marginBottom: 18 }}>{t("admin.lowStockAlerts")}</h2>
        {lowStockItems.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>{t("admin.kpiAlertsOff")}</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {lowStockItems.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.name}
                  </strong>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{item.sku}</span>
                </div>
                <Badge tone={item.stock === 0 ? "out" : "low"}>
                  {item.stock} / {item.reorderLevel}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
