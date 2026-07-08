/**
 * App Router · Inicio de sesión (/login)
 */

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@core/auth/AuthProvider";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";
import { Input } from "@ui/atoms/Input";
import { Card } from "@ui/atoms/Card";

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("admin@autodrive.com");
  const [password, setPassword] = useState("demo");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.replace("/admin");
  }, [isAuthenticated, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await login(email, password);
    if (!ok) {
      setError(t("auth.loginError"));
      return;
    }
    router.push("/admin");
  }

  return (
    <section className="login-page">
      <Card className="login-page__card">
        <h1 className="login-page__title">{t("auth.loginTitle")}</h1>
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
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="login-page__error">{error}</p>}
          <Button type="submit" block>
            {t("auth.signIn")}
          </Button>
        </form>
      </Card>
    </section>
  );
}