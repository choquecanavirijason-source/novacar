/**
 * Presentation · Component · AdminSidebar
 * Navegación del panel — posición derecha en desktop, tabs horizontales en mobile.
 */

"use client";

import { useTranslation } from "@core/i18n/I18nProvider";
import { Logo } from "@ui/atoms/Logo";

interface AdminSidebarProps {
  active: "inventory" | "analytics";
  onNavigate: (page: "inventory" | "analytics") => void;
}

export function AdminSidebar({ active, onNavigate }: AdminSidebarProps) {
  const { t } = useTranslation();

  const items: { id: "inventory" | "analytics"; icon: string; label: string }[] = [
    { id: "analytics", icon: "📊", label: t("admin.analytics") },
    { id: "inventory", icon: "📦", label: t("admin.inventory") },
  ];

  return (
    <aside className="admin-sidebar card" aria-label={t("admin.navAria")}>
      <div className="admin-sidebar__brand">
        <Logo size="1.1rem" suffix={t("admin.brand")} />
      </div>
      <nav className="admin-sidebar__nav">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`admin-sidebar__item ${active === item.id ? "admin-sidebar__item--active" : ""}`}
            aria-current={active === item.id ? "page" : undefined}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}