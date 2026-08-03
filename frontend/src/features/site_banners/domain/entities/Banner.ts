/**
 * Domain · Entity · Banner
 * Banner promocional gestionable desde el panel admin y mostrado en el sitio.
 */

export interface Banner {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly ctaLabel: string;
  readonly href: string;
  readonly accentFrom: string;
  readonly accentTo: string;
  readonly active: boolean;
  readonly order: number;
}

/** Datos que el administrador captura al crear un banner nuevo. */
export type NewBanner = Omit<Banner, "id" | "order">;
