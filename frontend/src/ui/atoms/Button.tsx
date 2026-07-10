/**
 * Atom · Button
 * Botón base del sistema. Polimórfico: si recibe `href` renderiza un <Link>,
 * de lo contrario un <button>. Variantes: primary | ghost. Tamaños: sm | md.
 * Forma sesgada (paralelogramo): `.btn` lleva el skewX real y `.btn__label`
 * (el span interno) lleva el contra-skew, así el texto/ícono queda recto.
 */

import Link from "next/link";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import type { Route } from "next";

type Variant = "primary" | "ghost";
type Size = "sm" | "md";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children: ReactNode;
  className?: string;
}

const sizeStyle: Record<Size, CSSProperties> = {
  sm: { padding: "8px 14px", fontSize: "0.82rem" },
  md: {},
};

function classes(variant: Variant, block?: boolean, extra?: string) {
  return ["btn", `btn--${variant}`, block ? "btn--block" : "", extra ?? ""]
    .filter(Boolean)
    .join(" ");
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = BaseProps & { href: Route | string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", block, children, className, ...rest } = props;
  const merged = classes(variant, block, className);

  if ("href" in props && props.href) {
    const { href } = props as ButtonAsLink;
    return (
      <Link href={href as Route} className={merged} style={sizeStyle[size]}>
        <span className="btn__label">{children}</span>
      </Link>
    );
  }

  return (
    <button
      className={merged}
      style={sizeStyle[size]}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <span className="btn__label">{children}</span>
    </button>
  );
}
