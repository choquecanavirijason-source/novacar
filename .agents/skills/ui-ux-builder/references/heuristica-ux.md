# Heurísticas UX

## Las 10 heurísticas de Nielsen (aplicadas a web)

| # | Heurística | En la práctica |
|---|------------|----------------|
| 1 | Visibilidad del estado | Loading spinners/skeletons, badges de estado, toasts |
| 2 | Coincidencia sistema-mundo real | Lenguaje del usuario, iconos reconocibles, orden lógico |
| 3 | Control y libertad | Botón cancelar, deshacer, cerrar modal, limpiar filtros |
| 4 | Consistencia | Mismos patrones en toda la app (@ui, tokens, copy) |
| 5 | Prevención de errores | Validación inline, confirmación en acciones destructivas |
| 6 | Reconocer antes que recordar | Labels visibles, breadcrumbs, contexto persistente |
| 7 | Flexibilidad y eficiencia | Atajos para usuarios avanzados (búsqueda, filtros guardados) |
| 8 | Diseño estético y minimalista | Cada elemento compite por atención; elimina ruido |
| 9 | Ayuda con errores | Mensaje claro + cómo corregir, no códigos técnicos |
| 10 | Documentación | Tooltips, helper text, empty states educativos |

---

## Decisión: ¿qué va primero?

Prioriza por frecuencia de uso × importancia para la tarea:

```
Alta frecuencia + Alta importancia → Above the fold, sin scroll
Alta frecuencia + Baja importancia  → Accesible pero no protagonista
Baja frecuencia + Alta importancia  → Visible pero no invasivo (settings, perfil)
Baja frecuencia + Baja importancia  → Menú secundario, footer, "más opciones"
```

---

## Jerarquía de información

### Títulos

| Nivel | Uso | AutoDrive |
|-------|-----|-----------|
| H1 | Una vez por página, la promesa principal | Hero o PageShell title |
| H2 | Secciones principales | SectionHeader title |
| H3 | Subsecciones, cards destacadas | Dentro de cards |
| Body | Contenido, descripciones | `--text-secondary` |
| Caption | Metadatos, hints | `--text-muted`, texto pequeño |

### Agrupación (Ley de Proximidad)

- Elementos relacionados → menos gap (8–12px)
- Secciones distintas → más gap (32–64px vertical)
- Cards en colección → gap uniforme (14–20px)

---

## Flujos de usuario comunes

### Explorar → Filtrar → Ver detalle → Acción

```
1. Grilla con datos (skeleton mientras carga)
2. Filtros visibles o sidebar sticky
3. Conteo de resultados actualizado en tiempo real
4. Card clickeable → página detalle
5. CTA primario en detalle (contactar, reservar, comprar)
```

### Buscar → Resultados → Refinar

```
1. SearchInput prominente
2. Resultados con highlight del término (opcional)
3. Empty state si 0 resultados + sugerencias
4. Chips de filtros activos removibles
```

### Formulario → Validar → Enviar → Confirmar

```
1. Campos agrupados por tema (datos personales, mensaje)
2. Validación on blur o on submit (no on every keystroke)
3. Errores inline bajo cada campo
4. Submit con loading state en el botón
5. Success: toast + redirect o mensaje de confirmación
```

---

## Anti-patrones UX

| Mal | Bien |
|-----|------|
| Modal que no se puede cerrar | X, Escape, click fuera (si no es crítico) |
| Eliminar sin confirmar | ConfirmDialog con consecuencia clara |
| Error genérico "Algo salió mal" | Mensaje específico + acción sugerida |
| 5 CTAs del mismo peso visual | 1 primary + 1–2 secondary max |
| Paginación sin indicar total | "Página 2 de 8" o "Mostrando 20 de 156" |
| Filtros que no muestran estado activo | Chips/badges con filtros aplicados |
| Formulario que resetea tras error | Conservar datos del usuario |
| Scroll infinito sin indicador | Skeleton al cargar más o botón "Cargar más" |

---

## Pregunta única de clarificación

Solo si el UX Read diverge genuinamente:

- *"¿El usuario principal busca explorar o ya sabe qué quiere?"*
- *"¿Esta pantalla es para uso frecuente (eficiencia) o primera visita (orientación)?"*

Si puedes inferir, no preguntes.