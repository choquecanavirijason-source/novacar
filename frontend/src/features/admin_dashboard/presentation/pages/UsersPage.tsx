/**
 * Presentation · Page · UsersPage
 * Directorio de cuentas registradas (mock local vía `mockUsersStore`,
 * mismo directorio que usa el login). Permite cambiar el rol y eliminar
 * cuentas — protegida contra que un admin se quite permisos o se borre a
 * sí mismo por accidente.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { useAuth } from "@core/auth/AuthProvider";
import { createUser, deleteUser, emailIsTaken, listUsers, updateUserRole } from "@core/auth/mockUsersStore";
import type { AuthUser, UserRole } from "@core/auth/types";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useToast } from "@core/toast/ToastProvider";
import { Badge } from "@ui/atoms/Badge";
import { Button } from "@ui/atoms/Button";
import { DataTable, type Column } from "@ui/organisms/DataTable";
import { UserFormModal } from "../components/UserFormModal";

const ROLE_TONE: Record<UserRole, "neon" | "low" | "in"> = {
  admin: "neon",
  operator: "low",
  customer: "in",
};

export function UsersPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setUsers(listUsers());
  }, []);

  const sorted = useMemo(() => [...users].sort((a, b) => a.name.localeCompare(b.name)), [users]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q));
  }, [sorted, query]);

  function handleCreate(input: { name: string; email: string; phone: string; password: string; role: UserRole }): true | string {
    if (emailIsTaken(input.email)) return t("auth.emailTaken");
    const created = createUser(input);
    setUsers((current) => [...current, created]);
    toast.success(t("admin.userCreateSuccess"));
    return true;
  }

  function handleRoleChange(target: AuthUser, role: UserRole) {
    if (target.id === currentUser?.id) {
      toast.error(t("admin.userSelfRoleError"));
      return;
    }
    const updated = updateUserRole(target.id, role);
    if (!updated) return;
    setUsers((current) => current.map((u) => (u.id === updated.id ? updated : u)));
    toast.success(t("admin.userRoleUpdateSuccess"));
  }

  function handleDelete(target: AuthUser) {
    if (target.id === currentUser?.id) {
      toast.error(t("admin.userSelfDeleteError"));
      return;
    }
    if (!window.confirm(t("admin.userDeleteConfirm"))) return;
    deleteUser(target.id);
    setUsers((current) => current.filter((u) => u.id !== target.id));
    toast.success(t("admin.userDeleteSuccess"));
  }

  const columns: Column<AuthUser>[] = [
    {
      key: "name",
      header: t("admin.userColName"),
      render: (u) => (
        <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <strong>{u.name}</strong>
          {u.id === currentUser?.id && <Badge tone="neon">{t("admin.userYou")}</Badge>}
        </div>
      ),
    },
    {
      key: "email",
      header: t("admin.userColEmail"),
      render: (u) => <span style={{ color: "var(--text-secondary)" }}>{u.email}</span>,
    },
    {
      key: "phone",
      header: t("admin.userColPhone"),
      render: (u) => <span style={{ color: "var(--text-secondary)" }}>{u.phone || "—"}</span>,
    },
    {
      key: "role",
      header: t("admin.userColRole"),
      render: (u) => (
        <label style={{ display: "inline-flex" }}>
          <Badge tone={ROLE_TONE[u.role]}>
            <select
              value={u.role}
              onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
              aria-label={t("admin.userColRole")}
              disabled={u.id === currentUser?.id}
              style={{
                background: "transparent",
                border: "none",
                color: "inherit",
                fontWeight: 700,
                fontSize: "inherit",
              }}
            >
              <option value="admin">{t("auth.role.admin")}</option>
              <option value="operator">{t("auth.role.operator")}</option>
              <option value="customer">{t("auth.role.customer")}</option>
            </select>
          </Badge>
        </label>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (u) => (
        <div className="admin-row-actions">
          <button
            type="button"
            className="admin-iconBtn admin-iconBtn--danger"
            onClick={() => handleDelete(u)}
            aria-label={t("common.delete")}
            disabled={u.id === currentUser?.id}
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
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{t("admin.users")}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>{t("admin.usersSubtitle")}</p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus size={15} strokeWidth={2.25} aria-hidden /> {t("admin.userAdd")}
        </Button>
      </div>

      <label className="admin-search">
        <Search size={16} strokeWidth={1.75} aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("admin.userSearch")}
          aria-label={t("admin.userSearch")}
        />
      </label>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--text-muted)", padding: "24px 0" }}>
          {sorted.length === 0 ? t("admin.usersEmpty") : t("admin.userSearchEmpty")}
        </p>
      ) : (
        <DataTable columns={columns} rows={filtered} rowKey={(u) => u.id} />
      )}

      {showAddModal && <UserFormModal onClose={() => setShowAddModal(false)} onSubmit={handleCreate} />}
    </div>
  );
}
