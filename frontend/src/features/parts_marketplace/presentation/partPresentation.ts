/**
 * Presentation · helpers del marketplace.
 * Mapea valores del dominio a iconos (lucide-react) y a CLAVES de traducción (i18n).
 */

import type { LucideIcon } from "lucide-react";
import {
  Cog,
  Disc,
  Armchair,
  BatteryCharging,
  Zap,
  Disc2,
  ArrowUpDown,
  Droplet,
  Lightbulb,
  Filter,
  DoorOpen,
  Volume2,
  Wrench,
} from "lucide-react";
import { PART_CATEGORIES, type PartCategory, type PartCondition } from "../domain/entities/MarketplacePart";
import { prettifySlug } from "@core/format/prettifySlug";

export const categoryIcon: Record<PartCategory, LucideIcon> = {
  engine: Cog,
  tires: Disc,
  seats: Armchair,
  battery: BatteryCharging,
  fuse: Zap,
  brakes: Disc2,
  suspension: ArrowUpDown,
  oil: Droplet,
  lights: Lightbulb,
  filters: Filter,
  body: DoorOpen,
  audio: Volume2,
};

export const categoryKey = (c: PartCategory): string => `partCat.${c}`;
export const conditionKey = (c: PartCondition): string => `cond.${c}`;

const KNOWN_CATEGORIES: readonly string[] = PART_CATEGORIES;

/**
 * Ícono por categoría, con respaldo genérico (llave inglesa) para
 * categorías que el admin agregó desde el "+" del formulario y no tienen
 * ícono propio — sin esto, una categoría custom tira la tarjeta/filtro
 * abajo (`undefined` no es un componente React válido).
 */
export function resolveCategoryIcon(value: string): LucideIcon {
  return (categoryIcon as Record<string, LucideIcon>)[value] ?? Wrench;
}

/** Etiqueta traducida para categorías fijas; slug legible para las custom. */
export function resolveCategoryLabel(value: string, t: (key: string) => string): string {
  return KNOWN_CATEGORIES.includes(value) ? t(`partCat.${value}`) : prettifySlug(value);
}

const categoryPhotoKeyword: Record<PartCategory, string> = {
  engine: "engine",
  tires: "tire",
  seats: "car-seat",
  battery: "battery",
  fuse: "fusebox",
  brakes: "brakedisc",
  suspension: "suspension",
  oil: "motoroil",
  lights: "headlight",
  filters: "airfilter",
  body: "cardoor",
  audio: "carspeaker",
};

/**
 * URL de foto de la pieza: prioriza la imagen real cargada por el admin
 * (`imageUrl`); si falta, cae al placeholder externo por categoría, con
 * semilla estable por id para que la misma tarjeta muestre siempre la misma
 * imagen. Da a las tarjetas de autopartes el mismo tratamiento visual
 * (pop-out de imagen real) que las tarjetas de autos.
 */
export const partPhotoUrl = (
  id: string,
  category: PartCategory,
  size: { w: number; h: number } = { w: 480, h: 360 },
  imageUrl?: string,
): string => {
  if (imageUrl) return imageUrl;

  const seed = Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const keyword = (categoryPhotoKeyword as Record<string, string>)[category] ?? "autopart";
  const keywords = encodeURIComponent(`autoparts,${keyword}`);
  return `https://loremflickr.com/${size.w}/${size.h}/${keywords}?lock=${seed}`;
};
