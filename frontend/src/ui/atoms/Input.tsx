/**
 * Atom · Input
 * Campo de texto base. `pill` redondea por completo (búsquedas).
 */

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  pill?: boolean;
}

export function Input({ pill, className = "", style, ...rest }: InputProps) {
  return (
    <input
      className={`ui-input ${pill ? "ui-input--pill" : ""} ${className}`}
      style={style}
      {...rest}
    />
  );
}
