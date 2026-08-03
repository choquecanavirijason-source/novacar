/**
 * Presentation · Component · AdminDashboard
 * Layout orquestador: topbar fija arriba + contenido debajo. Carga datos al montar.
 */

"use client";

import { useEffect } from "react";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@core/auth/AuthProvider";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";
import { AdminTopbar, type AdminPage } from "./AdminTopbar";
import { AnalyticsPage } from "../pages/AnalyticsPage";
import { InventoryPage } from "../pages/InventoryPage";
import { useAdminDashboardStore } from "../store/useAdminDashboardStore";
import { BannersPage } from "@features/site_banners/presentation/pages/BannersPage";
import { VehiclesAdminPage } from "@features/vehicles_catalog/presentation/pages/VehiclesAdminPage";

const TABS: AdminPage[] = ["analytics", "vehicles", "inventory", "banners"];

export function AdminDashboard() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const load = useAdminDashboardStore((s) => s.load);

  const tabParam = searchParams.get("tab");
  const page: AdminPage = TABS.includes(tabParam as AdminPage) ? (tabParam as AdminPage) : "analytics";

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    void load();
  }, [isAuthenticated, load, router]);

  if (!isAuthenticated) {
    return (
      <div className="admin-guard">
        <p>{t("auth.required")}</p>
        <Button href="/login">{t("auth.signIn")}</Button>
      </div>
    );
  }

  function navigate(next: AdminPage) {
    const url = next === "analytics" ? "/admin" : `/admin?tab=${next}`;
    router.push(url as Route);
  }

  return (
    <div className="admin-layout">
      <AdminTopbar active={page} onNavigate={navigate} />
      <main className="admin-layout__main">
        {page === "analytics" && <AnalyticsPage />}
        {page === "vehicles" && <VehiclesAdminPage />}
        {page === "inventory" && <InventoryPage />}
        {page === "banners" && <BannersPage />}
      </main>
    </div>
  );
}