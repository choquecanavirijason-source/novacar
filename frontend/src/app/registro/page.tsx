/**
 * App Router · Crear cuenta (/registro)
 * Mismo layout split-screen que /login (marca + tarjeta glass), pero para
 * usuarios normales: nombre, correo, teléfono y contraseña. Al registrarse
 * queda logueado de una vez (rol "customer") y va al inicio, no al panel.
 */

"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Gauge, BarChart3 } from "lucide-react";
import { useAuth } from "@core/auth/AuthProvider";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";
import { Input } from "@ui/atoms/Input";
import { PasswordInput } from "@ui/atoms/PasswordInput";
import { Logo } from "@ui/atoms/Logo";

const TRUST_ITEMS = [
  { Icon: ShieldCheck, key: "auth.trust1" },
  { Icon: Gauge, key: "auth.trust2" },
  { Icon: BarChart3, key: "auth.trust3" },
] as const;

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }

    setLoading(true);
    const result = await register({ name, email, phone, password });
    setLoading(false);

    if (result === "email-taken") {
      setError(t("auth.emailTaken"));
      return;
    }
    router.push("/");
  }

  return (
    <section className="login-page">
      <div className="login-page__brand">
        <div className="login-page__brand-inner">
          <Logo size="1.4rem" />
          <h1 className="login-page__brand-title">{t("auth.registerTitle")}</h1>
          <p className="login-page__brand-desc">{t("auth.registerSubtitle")}</p>

          <ul className="login-page__trust">
            {TRUST_ITEMS.map(({ Icon, key }) => (
              <li key={key}>
                <span className="login-page__trust-icon">
                  <Icon size={17} strokeWidth={1.75} aria-hidden />
                </span>
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="login-page__panel">
        <div className="login-page__card glass-panel">
          <h2 className="login-page__title">{t("auth.createAccount")}</h2>
          <p className="login-page__subtitle">{t("auth.registerSubtitle")}</p>

          <form onSubmit={handleSubmit} className="login-page__form">
            <label className="login-page__field">
              <span className="login-page__label">{t("auth.name")}</span>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label className="login-page__field">
              <span className="login-page__label">{t("auth.email")}</span>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className="login-page__field">
              <span className="login-page__label">{t("auth.phone")}</span>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </label>
            <label className="login-page__field">
              <span className="login-page__label">{t("auth.password")}</span>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={4}
                required
              />
            </label>
            <label className="login-page__field">
              <span className="login-page__label">{t("auth.confirmPassword")}</span>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={4}
                required
              />
            </label>
            {error && (
              <p className="login-page__error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" block disabled={loading}>
              {loading ? t("common.loading") : t("auth.createAccount")}
            </Button>
          </form>

          <p className="login-page__switch">
            {t("auth.alreadyHaveAccount")} <Link href="/login">{t("auth.signIn")}</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
