/**
 * App Router · Mi cuenta (/cuenta)
 * Página mínima para usuarios normales (rol "customer"): datos básicos +
 * cerrar sesión. El staff (admin/operador) usa el panel (/admin) en su lugar.
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, User as UserIcon } from "lucide-react";
import { useAuth } from "@core/auth/AuthProvider";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";

export default function AccountPage() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const isStaff = user?.role === "admin" || user?.role === "operator";

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (isStaff) router.replace("/admin");
  }, [isAuthenticated, isStaff, router]);

  if (!isAuthenticated || !user || isStaff) return null;

  return (
    <section className="container" style={{ padding: "48px 0 80px", maxWidth: 560, marginInline: "auto" }}>
      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <span
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background: "var(--gradient-brand)",
              color: "var(--on-brand)",
              fontWeight: 800,
              fontSize: "1.3rem",
              flexShrink: 0,
            }}
            aria-hidden
          >
            {user.name.charAt(0)}
          </span>
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>{user.name}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.86rem" }}>{t(`auth.role.${user.role}`)}</p>
          </div>
        </div>

        <div style={{ display: "grid", gap: 16, marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Mail size={17} strokeWidth={1.75} color="var(--text-muted)" aria-hidden />
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Phone size={17} strokeWidth={1.75} color="var(--text-muted)" aria-hidden />
              <span>{user.phone}</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <UserIcon size={17} strokeWidth={1.75} color="var(--text-muted)" aria-hidden />
            <span>{t("auth.accountId", { id: user.id })}</span>
          </div>
        </div>

        <Button variant="ghost" onClick={logout}>
          {t("userPanel.logout")}
        </Button>
      </div>
    </section>
  );
}
