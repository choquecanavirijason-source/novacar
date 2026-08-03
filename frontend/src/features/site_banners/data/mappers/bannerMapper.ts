/**
 * Data · Mapper · bannerMapper
 * DTO (snake_case, red) <-> Entity (camelCase, dominio).
 */

import type { Banner, NewBanner } from "../../domain/entities/Banner";
import type { BannerDTO } from "../models/BannerDTO";

export function mapBanner(dto: BannerDTO): Banner {
  return {
    id: dto.id,
    title: dto.title,
    subtitle: dto.subtitle,
    imageUrl: dto.image_url,
    ctaLabel: dto.cta_label,
    href: dto.href,
    accentFrom: dto.accent_from,
    accentTo: dto.accent_to,
    active: dto.active,
    order: dto.order,
  };
}

export function toBannerPayload(input: NewBanner) {
  return {
    title: input.title,
    subtitle: input.subtitle,
    image_url: input.imageUrl,
    cta_label: input.ctaLabel,
    href: input.href,
    accent_from: input.accentFrom,
    accent_to: input.accentTo,
    active: input.active,
  };
}
