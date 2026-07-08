# Formularios UI/UX

## Layout estándar de campo

```tsx
<div className="field">
  <label htmlFor="email">{t("form.email")}</label>
  <Input
    id="email"
    type="email"
    value={email}
    onChange={e => setEmail(e.target.value)}
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? "email-error" : undefined}
  />
  {errors.email && (
    <p id="email-error" className="field-error" role="alert">
      {errors.email}
    </p>
  )}
</div>
```

### Espaciado

```
label
  ↓ gap-2
input
  ↓ gap-1 (si hay error)
error message
  ↓ gap-4 (entre campos)
siguiente campo
```

---

## Reglas de validación

| Momento | Cuándo usar |
|---------|-------------|
| onBlur | Campos individuales (email, teléfono) |
| onSubmit | Validación completa del formulario |
| onChange (debounced) | Búsqueda, username availability |

**No validar en cada keystroke** salvo casos específicos (password strength meter).

### Mensajes de error

| Mal | Bien |
|-----|------|
| "Invalid input" | "Introduce un email válido (ejemplo@dominio.com)" |
| "Required" | "El nombre es obligatorio" |
| "Error 422" | "Este email ya está registrado. ¿Quieres iniciar sesión?" |

- Específico, accionable, en lenguaje del usuario
- Asociado al campo con `aria-describedby`

---

## Tipos de campo

| Tipo | Componente | Notas |
|------|------------|-------|
| Texto corto | `Input` | `autoComplete` apropiado |
| Búsqueda | `SearchInput` | `type="search"`, icono lupa |
| Selección múltiple | `Chip` group | `aria-pressed` en cada chip |
| Select nativo | `<select>` estilizado | Mejor a11y que custom sin esfuerzo |
| Checkbox / radio | Input nativo + label | Nunca ocultar sin alternativa accesible |
| Textarea | `Input` o textarea con tokens | `rows` mínimo 4, resize vertical |

---

## Formulario multi-paso (wizard)

Solo si > 8 campos o lógica condicional compleja:

```
[Paso 1 de 3] ████░░░░░░ 33%
Título del paso actual
Campos del paso
[Anterior]  [Siguiente →]
```

- Indicador de progreso visible
- Conservar datos entre pasos
- Permitir volver atrás sin perder datos
- Resumen final antes de enviar

---

## Submit y estados del botón

```tsx
<Button
  variant="primary"
  type="submit"
  disabled={isSubmitting || !isValid}
>
  {isSubmitting ? t("form.sending") : t("form.submit")}
</Button>
```

- Loading: texto cambia o spinner inline en el botón
- No deshabilitar sin indicar por qué (helper text si `!isValid`)
- Tras éxito: deshabilitar re-submit o mostrar confirmación

---

## Formularios en modales

- Max 5–6 campos por modal; más → página dedicada
- Primer campo recibe focus al abrir
- Submit con Enter (comportamiento nativo del form)
- Escape cierra solo si no hay cambios sin guardar

---

## Accesibilidad de formularios

- [ ] Todo input tiene `<label htmlFor>` asociado
- [ ] Grupos de radio/checkbox con `<fieldset>` + `<legend>`
- [ ] Errores con `role="alert"` y `aria-invalid="true"`
- [ ] Campos requeridos: `required` + indicador visual (asterisco + texto)
- [ ] `autocomplete` en campos estándar (name, email, tel, address)
- [ ] Contraste AA en labels, placeholders, errores

---

## AutoDrive: i18n

Todo string en `src/core/i18n/dictionaries.ts`:

```ts
// es
"form.email": "Correo electrónico",
"form.emailError": "Introduce un email válido",
// en
"form.email": "Email address",
"form.emailError": "Please enter a valid email",
```

Nunca hardcodear labels ni mensajes de error.