/**
 * Presentation · Page · AnalyticsPage
 */

"use client";

import { Car, BatteryCharging, AlertTriangle, TrendingUp, Plus, PackagePlus, FileDown } from "lucide-react";
import { useAdminDashboardStore } from "../store/useAdminDashboardStore";
import { MiniBarChart } from "../components/MiniBarChart";
import { useTranslation } from "@core/i18n/I18nProvider";
import { StatCard } from "@ui/molecules/StatCard";
import { Button } from "@ui/atoms/Button";
import { Skeleton } from "@ui/atoms/Skeleton";
import { formatCurrency } from "@core/format/formatters";

export function AnalyticsPage() {
  const { t, locale } = useTranslation();
  const { summary, loading } = useAdminDashboardStore();

  if (loading || !summary) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={110} />
        ))}
      </div>
    );
  }

  const { stats, topSellingParts } = summary;
  const alertsOn = stats.lowStockCount > 0;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{t("admin.overview")}</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
          {t("admin.overviewSubtitle")}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard
          label={t("admin.kpiCars")}
          value={stats.totalVehicles}
          icon={<Car size={20} strokeWidth={1.75} aria-hidden />}
          hint={t("admin.kpiCarsHint")}
        />
        <StatCard
          label={t("admin.kpiParts")}
          value={stats.totalParts}
          icon={<BatteryCharging size={20} strokeWidth={1.75} aria-hidden />}
          accent="neon"
          hint={t("admin.kpiPartsHint")}
        />
        <StatCard
          label={t("admin.kpiAlerts")}
          value={stats.lowStockCount}
          icon={<AlertTriangle size={20} strokeWidth={1.75} aria-hidden />}
          accent={alertsOn ? "danger" : "success"}
          hint={alertsOn ? t("admin.kpiAlertsOn") : t("admin.kpiAlertsOff")}
        />
        <StatCard
          label={t("admin.kpiRevenue")}
          value={formatCurrency(stats.monthlyRevenue, locale)}
          icon={<TrendingUp size={20} strokeWidth={1.75} aria-hidden />}
          accent="success"
          hint={t("admin.kpiRevenueHint")}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 700, marginBottom: 18 }}>{t("admin.bestSellers")}</h2>
          <MiniBarChart data={topSellingParts.map((p) => ({ label: p.name, value: p.units }))} unit=" u" />
        </div>

        <div className="card" style={{ padding: 24, display: "grid", gap: 12, alignContent: "start" }}>
          <h2 style={{ fontWeight: 700 }}>{t("admin.quickActions")}</h2>
          <Button href="/admin?tab=inventory" block>
            <Plus size={15} strokeWidth={2.25} aria-hidden /> {t("admin.actionPublish")}
          </Button>
          <Button href="/admin?tab=inventory" block variant="ghost">
            <PackagePlus size={15} strokeWidth={2} aria-hidden /> {t("admin.actionStock")}
          </Button>
          <Button block variant="ghost">
            <FileDown size={15} strokeWidth={2} aria-hidden /> {t("admin.actionExport")}
          </Button>
        </div>
      </div>
    </div>
  );
}
