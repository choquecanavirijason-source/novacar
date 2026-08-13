/**
 * Molecule · LanguageSwitcher
 * Selector de idioma en dropdown: el botón muestra la bandera + código del
 * idioma activo; al abrir, lista ambos idiomas con bandera + nombre completo.
 * Cierra con click afuera, Escape, o al seleccionar una opción.
 */

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { LOCALES, type Locale } from "@core/i18n/dictionaries";

/**
 * Banderas como SVG (bandas de color planas) en vez de fotos JPG/PNG
 * escaladas: a 18–20px una foto de bandera pierde nitidez (moiré/ruido por
 * el downscale); un vector con bloques de color sólido se ve nítido a
 * cualquier tamaño.
 */
function FlagMX() {
  return (
    <svg viewBox="0 0 3 2" aria-hidden focusable="false">
      <rect width="1" height="2" x="0" fill="#006341" />
      <rect width="1" height="2" x="1" fill="#fff" />
      <rect width="1" height="2" x="2" fill="#ce1126" />
      <circle cx="1.5" cy="1" r="0.32" fill="#8a5a2e" />
    </svg>
  );
}

function FlagUS() {
  return (
    <svg viewBox="0 0 19 13" aria-hidden focusable="false">
      <rect width="19" height="13" fill="#b22234" />
      <g fill="#fff">
        <rect y="1" width="19" height="1" />
        <rect y="3" width="19" height="1" />
        <rect y="5" width="19" height="1" />
        <rect y="7" width="19" height="1" />
        <rect y="9" width="19" height="1" />
        <rect y="11" width="19" height="1" />
      </g>
      <rect width="8" height="7" fill="#3c3b6e" />
    </svg>
  );
}

const FLAG: Record<Locale, ReactNode> = { es: <FlagMX />, en: <FlagUS /> };
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
        <span className="lang-switch__flag">{FLAG[locale]}</span>
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
                <span className="lang-switch__flag">{FLAG[l]}</span>
                {NAME[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
