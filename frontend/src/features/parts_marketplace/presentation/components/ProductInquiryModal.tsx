/**
 * Presentation · Component · ProductInquiryModal
 * Popup de "solicitar información" que se abre al hacer click en "Ver producto"
 * de una ProductCard: columna izquierda con texto + formulario en línea
 * (input + submit pegados), columna derecha con imagen/video + botón Play
 * centrado. Envío simulado (sin backend real todavía).
 */

"use client";

import { useState, type FormEvent } from "react";
import { Play, Send, X } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useToast } from "@core/toast/ToastProvider";
import { useModalA11y } from "@ui/hooks/useModalA11y";
import "../styles/product-inquiry-modal.css";

const INQUIRY_MEDIA_URL = "https://loremflickr.com/900/900/car,workshop?lock=21";

export function ProductInquiryModal({
  productName,
  onClose,
}: {
  productName: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const panelRef = useModalA11y<HTMLDivElement>(onClose);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    toast.success(t("productInquiry.success"));
  };

  return (
    <div
      className="pinquiry-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t("productInquiry.title")}
      onClick={onClose}
    >
      <div ref={panelRef} tabIndex={-1} className="pinquiry" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="pinquiry__close"
          onClick={onClose}
          aria-label={t("productInquiry.close")}
        >
          <X size={18} strokeWidth={1.75} aria-hidden />
        </button>

        <div className="pinquiry__grid">
          <div className="pinquiry__text">
            <h2 className="pinquiry__title">{t("productInquiry.title")}</h2>
            <p className="pinquiry__desc">{t("productInquiry.desc", { name: productName })}</p>

            {sent ? (
              <p className="pinquiry__success" role="status">
                {t("productInquiry.success")}
              </p>
            ) : (
              <form className="pinquiry__form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  required
                  className="pinquiry__input"
                  placeholder={t("productInquiry.placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label={t("productInquiry.placeholder")}
                />
                <button type="submit" className="pinquiry__submit" aria-label={t("productInquiry.submit")}>
                  <Send size={16} strokeWidth={2} aria-hidden />
                </button>
              </form>
            )}
          </div>

          <div className="pinquiry__media">
            {/* eslint-disable-next-line @next/next/no-img-element -- placeholder, se reemplaza por asset real */}
            <img
              className="pinquiry__media-img"
              src={INQUIRY_MEDIA_URL}
              alt=""
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <button type="button" className="pinquiry__play" aria-label={t("productInquiry.play")}>
              <Play size={20} strokeWidth={0} fill="currentColor" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
