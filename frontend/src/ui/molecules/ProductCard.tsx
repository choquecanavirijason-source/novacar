/**
 * Molecule · ProductCard
 * Common reutilizable para tarjetas de producto (autos, autopartes, ...).
 * Estructura fija: foto arriba (100% ancho, tilt 3D + pop-out + CornerFrame),
 * cuerpo en columna (título, subtítulo, 3 features cortas alineadas a la
 * izquierda) y un CTA de ancho completo siempre anclado abajo (margin-top:auto),
 * sin importar cuánto texto tenga el cuerpo. Pensada para vivir dentro de un
 * grid responsivo (1 col móvil / 2 tablet / 3 desktop, ver .product-grid).
 */

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Route } from "next";
import { CornerFrame } from "../atoms/CornerFrame";

interface ProductCardProps {
  /** Navega al hacer click en el CTA (ignorado si se pasa `onCtaClick`). */
  href?: Route | string;
  /** Si se pasa, el CTA abre algo (ej. popup) en vez de navegar. */
  onCtaClick?: () => void;
  index?: number;
  /** Gradiente de fondo de la foto (mientras no haya imagen real definitiva). */
  accentFrom: string;
  accentTo: string;
  /** Foto real (placeholder o asset final). Si no se pasa, se usa photoIcon. */
  imageUrl?: string;
  imageAlt?: string;
  /** Icono de respaldo cuando no hay imagen (p.ej. lucide-react). */
  photoIcon?: ReactNode;
  /** Overlay superior de la foto (badges/tags). */
  photoTopSlot?: ReactNode;
  /** Overlay adicional de la foto (p.ej. badge de descuento, esquina opuesta). */
  photoCornerSlot?: ReactNode;
  /** Alto de la zona de foto. */
  photoHeight?: number;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Exactamente 3 características cortas, alineadas a la izquierda. */
  features: [ReactNode, ReactNode, ReactNode];
  ctaLabel: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function ProductCard({
  href,
  onCtaClick,
  index = 0,
  accentFrom,
  accentTo,
  imageUrl,
  imageAlt = "",
  photoIcon,
  photoTopSlot,
  photoCornerSlot,
  photoHeight = 168,
  title,
  subtitle,
  features,
  ctaLabel,
  className = "",
  style,
}: ProductCardProps) {
  const photo = (
    <div
      className="product-card__photo corner-frame"
      style={{
        background: `linear-gradient(140deg, ${accentFrom}, ${accentTo})`,
        height: photoHeight,
      }}
    >
      {photoTopSlot}

      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- placeholder, se reemplaza por asset real
        <img className="product-card__real-img" src={imageUrl} alt={imageAlt} loading="lazy" />
      ) : (
        photoIcon && <span className="product-card__icon">{photoIcon}</span>
      )}

      {photoCornerSlot}
      <CornerFrame />
    </div>
  );

  const body = (
    <div className="product-card__body">
      <div className="product-card__body-main">
        <h3 className="product-card__title">{title}</h3>
        {subtitle && <p className="product-card__subtitle">{subtitle}</p>}
        <ul className="product-card__features">
          {features.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
      </div>

      <div className="product-card__cta-wrap">
        <span className="product-card__cta">{ctaLabel}</span>
      </div>
    </div>
  );

  const cardStyle = { animationDelay: `${index * 50}ms`, ...style };

  if (onCtaClick) {
    return (
      <button type="button" className={`product-card ${className}`.trim()} style={cardStyle} onClick={onCtaClick}>
        {photo}
        {body}
      </button>
    );
  }

  return (
    <Link href={(href ?? "#") as Route} className={`product-card ${className}`.trim()} style={cardStyle}>
      {photo}
      {body}
    </Link>
  );
}
