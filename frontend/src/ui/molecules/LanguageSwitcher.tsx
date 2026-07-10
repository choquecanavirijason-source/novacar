/**
 * Molecule · LanguageSwitcher
 * Selector de idioma en dropdown: el botón muestra la bandera + código del
 * idioma activo; al abrir, lista ambos idiomas con bandera + nombre completo.
 * Cierra con click afuera, Escape, o al seleccionar una opción.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { LOCALES, type Locale } from "@core/i18n/dictionaries";

const FLAG: Record<Locale, string> = { es: "🇪🇸", en: "🇬🇧" };
const NAME: Record<Locale, string> = { es: "Español", en: "English" };

export function LanguageSwitcher() {
  const { t, locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="lang-switch" ref={rootRef}>
      <button
        type="button"
        className="lang-switch__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("nav.language")}
      >
        <span aria-hidden>{FLAG[locale]}</span>
        <span>{locale.toUpperCase()}</span>
        <ChevronDown
          size={13}
          strokeWidth={2.5}
          className={`lang-switch__chevron ${open ? "lang-switch__chevron--open" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <ul className="lang-switch__menu" role="listbox">
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={locale === l}
                className={`lang-switch__option ${locale === l ? "lang-switch__option--active" : ""}`}
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
              >
                <span aria-hidden>{FLAG[l]}</span>
                {NAME[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
