/**
 * Presentation · Component · PartsHero (estilo Brator)
 * Hero de la tienda de autopartes: headline a 3 líneas con palabra acentuada,
 * CTA "Comprar ahora" y visual. Usa el template HeroSplit del design system.
 */

"use client";

import { useTranslation } from "@core/i18n/I18nProvider";
import { HeroSplit, HeroVisualShell, Button } from "@ui";

export function PartsHero() {
  const { t } = useTranslation();

  return (
    <HeroSplit
      eyebrow={`⚙️ ${t("market.eyebrow")}`}
      title={
        <>
          {t("market.heroTitleA")}
          <br />
          {t("market.heroTitleB")} <span className="text-gradient">{t("market.heroAccent")}</span>
        </>
      }
      subtitle={t("market.subtitle")}
      actions={
        <>
          <Button href="/autopartes">{t("market.heroCta")} →</Button>
          <Button href="/buscador" variant="ghost">{t("nav.finder")}</Button>
        </>
      }
      stats={[
        { value: "8,500+", label: t("hero.statParts") },
        { value: "12", label: t("market.category") },
        { value: "100%", label: t("hero.statCompat") },
      ]}
      visual={
        <HeroVisualShell>
          <span style={{ fontSize: "6.5rem" }} aria-hidden>🏍️</span>
        </HeroVisualShell>
      }
    />
  );
}
