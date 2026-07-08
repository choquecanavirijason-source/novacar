/**
 * Organism · UserTopPanel
 * Barra superior para usuarios autenticados: acceso rápido al panel y sesión.
 */

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@core/auth/AuthProvider";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "../atoms/Button";

const PANEL_LINKS = [
  { href: "/admin", key: "userPanel.analytics", tab: null },
  { href: "/admin?tab=inventory", key: "userPanel.inventory", tab: "inventory" },
] as const;

export function UserTopPanel() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!isAuthenticated || !user) return null;

  const inAdmin = pathname.startsWith("/admin");
  const activeTab = searchParams.get("tab");

  return (
    <div className="user-top-panel" role="region" aria-label={t("userPanel.aria")}>
      <div className="container user-top-panel__inner">
        <div className="user-top-panel__identity">
          <span className="user-top-panel__avatar" aria-hidden="true">
            {user.name.charAt(0)}
          </span>
          <div className="user-top-panel__meta">
            <span className="user-top-panel__greeting">{t("userPanel.greeting", { name: user.name })}</span>
            <span className="user-top-panel__role">{t(`userPanel.role.${user.role}`)}</span>
          </div>
        </div>

        <nav className="user-top-panel__nav" aria-label={t("userPanel.navAria")}>
          {PANEL_LINKS.map((link) => {
            const active =
              inAdmin && (link.tab === null ? activeTab !== "inventory" : activeTab === link.tab);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`user-top-panel__link ${active ? "user-top-panel__link--active" : ""}`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="user-top-panel__actions">
          {!inAdmin && (
            <Button href="/admin" size="sm">
              {t("userPanel.openAdmin")}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={logout}>
            {t("userPanel.logout")}
          </Button>
        </div>
      </div>
    </div>
  );
}