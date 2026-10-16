/**
 * Presentation · Component · ImportAuctionsSection
 * Bloque de Importaciones: subastas de EE. UU. donde se compra (logos) y el
 * proceso de compra en subasta en 4 pasos. Copart y ACV usan su logo real
 * (public/auctions); el resto se muestra como wordmark tipográfico hasta
 * tener su archivo oficial — basta con agregar `logo` en AUCTIONS.
 */

"use client";

import Image from "next/image";
import { Gavel, Search, Ship, KeyRound, type LucideIcon } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { ScrollReveal } from "@ui/atoms/ScrollReveal";

interface Auction {
  readonly name: string;
  readonly logo?: { src: string; width: number; height: number };
}

const AUCTIONS: readonly Auction[] = [
  { name: "Copart", logo: { src: "/auctions/copart.svg", width: 160, height: 40 } },
  { name: "IAA" },
  { name: "Manheim" },
  { name: "ACV Auctions", logo: { src: "/auctions/acv.png", width: 91, height: 40 } },
  { name: "ADESA" },
];

const STEPS: readonly { key: string; Icon: LucideIcon }[] = [
  { key: "search", Icon: Search },
  { key: "bid", Icon: Gavel },
  { key: "ship", Icon: Ship },
  { key: "deliver", Icon: KeyRound },
];

export function ImportAuctionsSection() {
  const { t } = useTranslation();

  return (
    <section className="import-auctions" aria-labelledby="import-auctions-title">
      <div className="import-auctions__head">
        <h2 id="import-auctions-title" className="import-auctions__title">
          {t("imports.auctionsTitle")}
        </h2>
        <p className="import-auctions__subtitle">{t("imports.auctionsSubtitle")}</p>
      </div>

      <div className="import-auctions__logos" role="list">
        {AUCTIONS.map((a, i) => (
          <ScrollReveal key={a.name} delay={i * 70}>
            <div role="listitem" className="import-auctions__logo" title={a.name}>
              {a.logo ? (
                <Image src={a.logo.src} alt={a.name} width={a.logo.width} height={a.logo.height} unoptimized />
              ) : (
                <span className="import-auctions__wordmark">{a.name}</span>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="import-auctions__steps" role="list">
        {STEPS.map(({ key, Icon }, i) => (
          <ScrollReveal key={key} delay={i * 90}>
            <div role="listitem" className="import-auctions__step">
              <span className="import-auctions__step-num" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="import-auctions__step-icon" aria-hidden>
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <h3 className="import-auctions__step-title">{t(`imports.auctionsStep_${key}`)}</h3>
              <p className="import-auctions__step-desc">{t(`imports.auctionsStep_${key}Desc`)}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <p className="import-auctions__legal">{t("imports.auctionsLegal")}</p>
    </section>
  );
}
