/**
 * Atom · PasswordInput
 * Input de contraseña con botón de mostrar/ocultar (ícono de ojo). Envuelve
 * a Input — mismos props, sin `type` (siempre parte oculto).
 */

"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Input } from "./Input";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  pill?: boolean;
}

export function PasswordInput({ className = "", ...rest }: PasswordInputProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-input">
      <Input type={visible ? "text" : "password"} className={`password-input__field ${className}`} {...rest} />
      <button
        type="button"
        className="password-input__toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t("auth.hidePassword") : t("auth.showPassword")}
        aria-pressed={visible}
        tabIndex={-1}
      >
        {visible ? <EyeOff size={17} strokeWidth={1.75} aria-hidden /> : <Eye size={17} strokeWidth={1.75} aria-hidden />}
      </button>
    </div>
  );
}
