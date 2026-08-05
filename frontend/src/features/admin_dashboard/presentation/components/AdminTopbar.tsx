/**
 * Presentation · Component · AdminTopbar
 * Navegación del panel admin — barra superior fija, full-bleed, hace de
 * navbar propio del panel (el sitio público no muestra su Navbar aquí).
 */

"use client";

import { ArrowLeft, Car, Image, LayoutDashboard, LogOut, MessageSquareText, Package, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@core/auth/AuthProvider";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Logo } from "@ui/atoms/Logo";

export type AdminPage = "analytics" | "vehicles" | "inventory" | "banners" | "quotes";

interface AdminTopbarProps {
  active: AdminPage;
  onNavigate: (page: AdminPage) => void;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "AD";
}

export function AdminTopbar({ active, onNavigate }: AdminTopbarProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const router = useRouter();

  const items: { id: AdminPage; Icon: LucideIcon; label: string }[] = [
    { id: "analytics", Icon: LayoutDashboard, label: t("admin.analytics") },
    { id: "vehicles", Icon: Car, label: t("admin.vehicles") },
    { id: "inventory", Icon: Package, label: t("admin.inventory") },
    { id: "banners", Icon: Image, label: t("admin.banners") },
    { id: "quotes", Icon: MessageSquareText, label: t("admin.quotes") },
  ];

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="admin-topbar" aria-label={t("admin.navAria")}>
      <div className="admin-topbar__inner">
        <div className="admin-topbar__brand">
          <Logo size="1.1rem" suffix={t("admin.brand")} />
        </div>
        <nav className="admin-topbar__nav">
          {items.map(({ id, Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={`admin-topbar__item ${active === id ? "admin-topbar__item--active" : ""}`}
              aria-current={active === id ? "page" : undefined}
            >
              <Icon size={17} strokeWidth={1.75} aria-hidden />
              {label}
            </button>
          ))}
        </nav>

        <div className="admin-topbar__actions">
          <a href="/" className="admin-topbar__back">
            <ArrowLeft size={15} strokeWidth={1.75} aria-hidden />
            {t("admin.backToSite")}
          </a>

          {user && (
            <div className="admin-topbar__user">
              <span className="admin-topbar__avatar" aria-hidden>
                {initials(user.name)}
              </span>
              <span className="admin-topbar__userInfo">
                <span className="admin-topbar__userName">{user.name}</span>
                <span className="admin-topbar__userRole">{t(`userPanel.role.${user.role}`)}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="admin-topbar__logout"
                aria-label={t("nav.logout")}
                title={t("nav.logout")}
              >
                <LogOut size={16} strokeWidth={1.75} aria-hidden />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
