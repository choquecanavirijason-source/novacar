/**
 * Presentation · Component · AdminSidebar
 * Navegación del panel — posición derecha en desktop, tabs horizontales en mobile.
 */

"use client";

import { LayoutDashboard, Package, type LucideIcon } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Logo } from "@ui/atoms/Logo";

interface AdminSidebarProps {
  active: "inventory" | "analytics";
  onNavigate: (page: "inventory" | "analytics") => void;
}

export function AdminSidebar({ active, onNavigate }: AdminSidebarProps) {
  const { t } = useTranslation();

  const items: { id: "inventory" | "analytics"; Icon: LucideIcon; label: string }[] = [
    { id: "analytics", Icon: LayoutDashboard, label: t("admin.analytics") },
    { id: "inventory", Icon: Package, label: t("admin.inventory") },
  ];

  return (
    <aside className="admin-sidebar card" aria-label={t("admin.navAria")}>
      <div className="admin-sidebar__brand">
        <Logo size="1.1rem" suffix={t("admin.brand")} />
      </div>
      <nav className="admin-sidebar__nav">
        {items.map(({ id, Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            className={`admin-sidebar__item ${active === id ? "admin-sidebar__item--active" : ""}`}
            aria-current={active === id ? "page" : undefined}
          >
            <Icon size={17} strokeWidth={1.75} aria-hidden />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}