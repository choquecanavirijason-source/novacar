/**
 * Atom · Button
 * Botón base del sistema. Polimórfico: si recibe `href` renderiza un <Link>,
 * de lo contrario un <button>. Variantes: primary | ghost. Tamaños: sm | md.
 * Forma sesgada (paralelogramo): `.btn` lleva el skewX real y `.btn__label`
 * (el span interno) lleva el contra-skew, así el texto/ícono queda recto.
 * Efecto magnético (desktop, puntero fino, sin reduced-motion): un wrapper
 * externo sin transform propio absorbe el "tirón" hacia el cursor (GSAP
 * quickTo) para no pisar el transform de skew del propio .btn.
 */

"use client";

import Link from "next/link";
import { useEffect, useRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from "react";
import type { Route } from "next";
import gsap from "gsap";

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

const MAGNET_RADIUS = 90;
const MAGNET_PULL = 0.4;

/** Tirón magnético hacia el cursor dentro de un radio; nulo en touch/reduced-motion. */
function useMagnetic(disabled: boolean) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist < MAGNET_RADIUS) {
        const pull = 1 - dist / MAGNET_RADIUS;
        xTo(dx * pull * MAGNET_PULL);
        yTo(dy * pull * MAGNET_PULL);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      xTo(0);
      yTo(0);
    };
  }, [disabled]);

  return ref;
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = BaseProps & { href: Route | string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", block, children, className, ...rest } = props;
  const merged = classes(variant, block, className);
  const magnetRef = useMagnetic(Boolean(block));
  const magnetClass = `btn__magnet${block ? " btn__magnet--block" : ""}`;

  if ("href" in props && props.href) {
    const { href } = props as ButtonAsLink;
    return (
      <span ref={magnetRef} className={magnetClass}>
        <Link href={href as Route} className={merged} style={sizeStyle[size]}>
          <span className="btn__label">{children}</span>
        </Link>
      </span>
    );
  }

  return (
    <span ref={magnetRef} className={magnetClass}>
      <button
        className={merged}
        style={sizeStyle[size]}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        <span className="btn__label">{children}</span>
      </button>
    </span>
  );
}
