/**
 * Presentation · Component · AdminDashboard
 * Layout orquestador: contenido izquierda + sidebar derecha. Carga datos al montar.
 */

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@core/auth/AuthProvider";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";
import { AdminSidebar } from "./AdminSidebar";
import { AnalyticsPage } from "../pages/AnalyticsPage";
import { InventoryPage } from "../pages/InventoryPage";
import { useAdminDashboardStore } from "../store/useAdminDashboardStore";

export function AdminDashboard() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const load = useAdminDashboardStore((s) => s.load);

  const page = searchParams.get("tab") === "inventory" ? "inventory" : "analytics";

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

  function navigate(next: "inventory" | "analytics") {
    const url = next === "inventory" ? "/admin?tab=inventory" : "/admin";
    router.push(url);
  }

  return (
    <div className="admin-layout">
      <main className="admin-layout__main">
        {page === "analytics" ? <AnalyticsPage /> : <InventoryPage />}
      </main>
      <AdminSidebar active={page} onNavigate={navigate} />
    </div>
  );
}