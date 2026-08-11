/**
 * Molecule · ImageUrlField
 * Campo de imagen "hero" para formularios admin: dropzone grande y centrada
 * (arrastra y suelta, o clic para elegir desde el equipo/galería — no hay
 * backend de subida en el proyecto, así que el archivo se lee con
 * FileReader y se guarda como Data URL embebida en el campo `imageUrl` que
 * ya usan Vehículos, Piezas y Banners). Sin input de URL: es 100% subida.
 */

"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { ImagePlus, RefreshCw } from "lucide-react";

export function ImageUrlField({
  label,
  value,
  onChange,
  uploadLabel,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  uploadLabel: string;
  required?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  function readFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result ?? ""));
    reader.onerror = () => setError("No se pudo leer la imagen.");
    reader.readAsDataURL(file);
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    readFile(e.target.files?.[0]);
    e.target.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    readFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="addpart-field image-field">
      <span>{label}</span>

      <div
        className={`image-field__drop ${value ? "image-field__drop--filled" : ""} ${dragOver ? "image-field__drop--drag" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
      >
        {value ? (
          <>
            <img src={value} alt="" className="image-field__preview" />
            <div className="image-field__overlay">
              <RefreshCw size={20} strokeWidth={2} aria-hidden />
              <span>{uploadLabel}</span>
            </div>
          </>
        ) : (
          <div className="image-field__empty">
            <ImagePlus size={32} strokeWidth={1.5} aria-hidden />
            <strong>{uploadLabel}</strong>
            <span>o arrastra la imagen aquí</span>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFile} />
        {/* Sombra invisible que participa de la validación nativa del <form> sin mostrar un input visible. */}
        <input
          className="image-field__required-shadow"
          type="text"
          value={value}
          onChange={() => {}}
          required={required}
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {error && <span className="image-url-field__error">{error}</span>}
    </div>
  );
}
