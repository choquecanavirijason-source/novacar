/**
 * Molecule · LanguageSwitcher
 * Conmutador de idioma ES / EN. Consume el contexto de i18n.
 */

"use client";

import { useTranslation } from "@core/i18n/I18nProvider";
import { LOCALES, type Locale } from "@core/i18n/dictionaries";

const FLAG: Record<Locale, string> = { es: "🇪🇸", en: "🇬🇧" };

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          className={`lang-switch__btn ${locale === l ? "lang-switch__btn--active" : ""}`}
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
        >
          <span aria-hidden>{FLAG[l]}</span>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
