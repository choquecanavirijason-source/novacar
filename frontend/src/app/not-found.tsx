/**
 * App Router · not-found.tsx
 * Página 404 global (y de cualquier `notFound()` de una ruta hija) con la
 * identidad Premium Dark UI en vez del 404 genérico de Next.js.
 */

"use client";

import { SignpostBig } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-(--border-strong) bg-(--glass-bg) text-(--accent-neon) backdrop-blur-(--glass-blur)">
        <SignpostBig size={32} strokeWidth={1.5} aria-hidden />
      </div>

      <span className="text-xs font-bold uppercase tracking-[0.3em] text-(--accent-neon)">
        {t("notFoundPage.eyebrow")}
      </span>

      <h1 className="max-w-lg text-3xl font-black uppercase text-white sm:text-4xl">
        {t("notFoundPage.title")}
      </h1>

      <p className="max-w-md text-(--text-secondary)">{t("notFoundPage.message")}</p>

      <Button href="/">{t("nav.home")}</Button>
    </div>
  );
}
