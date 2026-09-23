/**
 * App Router · Inicio de sesión (/login)
 * Split-screen profesional: panel de marca (glow + confianza) + tarjeta glass
 * con el formulario. Full-bleed, fuera del `.container` del layout raíz.
 */

"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Gauge, BarChart3 } from "lucide-react";
import { useAuth } from "@core/auth/AuthProvider";
import type { AuthUser } from "@core/auth/types";
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

const destinationFor = (user: AuthUser) => (user.role === "customer" ? "/" : "/admin");

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) router.replace(destinationFor(user));
  }, [isAuthenticated, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const loggedIn = await login(email, password);
    setLoading(false);
    if (!loggedIn) {
      setError(t("auth.loginError"));
      return;
    }
    router.push(destinationFor(loggedIn));
  }

  return (
    <section className="login-page">
      <div className="login-page__brand">
        <div className="login-page__brand-inner">
          <Logo size="1.4rem" />
          <h1 className="login-page__brand-title">{t("auth.loginTitle")}</h1>
          <p className="login-page__brand-desc">{t("auth.loginSubtitle")}</p>

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
          <h2 className="login-page__title">{t("auth.signIn")}</h2>
          <p className="login-page__subtitle">{t("auth.loginSubtitle")}</p>

          <form onSubmit={handleSubmit} className="login-page__form">
            <label className="login-page__field">
              <span className="login-page__label">{t("auth.email")}</span>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="login-page__field">
              <span className="login-page__label">{t("auth.password")}</span>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && (
              <p className="login-page__error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" block disabled={loading}>
              {loading ? t("common.loading") : t("auth.signIn")}
            </Button>
          </form>

          <p className="login-page__switch">
            {t("auth.noAccount")} <Link href="/registro">{t("auth.createAccount")}</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
