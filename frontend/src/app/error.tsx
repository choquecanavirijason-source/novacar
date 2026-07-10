/**
 * App Router · error.tsx
 * Error boundary de segmento (obligatoriamente Client Component). Sustituye
 * la pantalla de error genérica de Next.js por la identidad Premium Dark UI,
 * con opción de reintentar (`reset`) o volver al inicio.
 */

"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-(--border-strong) bg-(--glass-bg) text-(--accent-neon) backdrop-blur-(--glass-blur)">
        <AlertTriangle size={32} strokeWidth={1.5} aria-hidden />
      </div>

      <span className="text-xs font-bold uppercase tracking-[0.3em] text-(--accent-neon)">
        {t("errorPage.eyebrow")}
      </span>

      <h1 className="max-w-lg text-3xl font-black uppercase text-white sm:text-4xl">
        {t("errorPage.title")}
      </h1>

      <p className="max-w-md text-(--text-secondary)">{t("errorPage.message")}</p>

      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>{t("errorPage.retry")}</Button>
        <Button href="/" variant="ghost">
          {t("nav.home")}
        </Button>
      </div>
    </div>
  );
}
