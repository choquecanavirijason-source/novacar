/**
 * Presentation · Component · UserFormModal
 * Popup para dar de alta una cuenta directamente desde el panel admin
 * (mismo directorio local que usa el login/registro — ver mockUsersStore).
 */

"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Input } from "@ui/atoms/Input";
import { PasswordInput } from "@ui/atoms/PasswordInput";
import { Button } from "@ui/atoms/Button";
import { ModalPortal } from "@ui/atoms/ModalPortal";
import { useModalA11y } from "@ui/hooks/useModalA11y";
import type { UserRole } from "@core/auth/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UserFormModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  /** `true` si guardó bien; si falló, el mensaje de error a mostrar. */
  onSubmit: (input: { name: string; email: string; phone: string; password: string; role: UserRole }) => true | string;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const panelRef = useModalA11y<HTMLDivElement>(onClose);

  function validate(): string[] {
    const problems: string[] = [];
    if (!name.trim()) problems.push(t("admin.validationNameRequired"));
    if (!email.trim() || !EMAIL_RE.test(email.trim())) problems.push(t("admin.validationEmailInvalid"));
    if (!password || password.length < 6) problems.push(t("admin.validationPasswordInvalid"));
    return problems;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    setSaving(true);
    const result = onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim(), password, role });
    setSaving(false);
    if (result === true) {
      onClose();
    } else {
      setErrors([result]);
    }
  }

  return (
    <ModalPortal>
      <div
        className="addpart-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={t("admin.userAddTitle")}
        onClick={onClose}
      >
        <div ref={panelRef} tabIndex={-1} className="addpart-panel glass-panel" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="addpart-close" onClick={onClose} aria-label={t("admin.cancel")}>
            <X size={25} strokeWidth={1.75} aria-hidden />
          </button>

          <h2 className="addpart-title">{t("admin.userAddTitle")}</h2>
          <p className="addpart-subtitle">{t("admin.userAddSubtitle")}</p>

          <form className="addpart-form" onSubmit={handleSubmit}>
            <label className="addpart-field">
              <span>{t("admin.userFieldName")}</span>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>

            <label className="addpart-field">
              <span>{t("admin.userFieldEmail")}</span>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>

            <div className="addpart-row">
              <label className="addpart-field">
                <span>{t("admin.userFieldPhone")}</span>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label className="addpart-field">
                <span>{t("admin.userFieldPassword")}</span>
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
              </label>
              <label className="addpart-field">
                <span>{t("admin.userColRole")}</span>
                <select
                  className="ui-input addpart-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="admin">{t("auth.role.admin")}</option>
                  <option value="operator">{t("auth.role.operator")}</option>
                  <option value="customer">{t("auth.role.customer")}</option>
                </select>
              </label>
            </div>

            {errors.length > 0 && (
              <ul className="login-page__error" role="alert" style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
                {errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            )}

            <div className="addpart-actions">
              <Button type="button" variant="ghost" onClick={onClose}>
                {t("admin.cancel")}
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? t("common.loading") : t("admin.userSubmit")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
