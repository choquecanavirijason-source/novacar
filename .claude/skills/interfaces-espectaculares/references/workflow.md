# Workflow · Interfaces Espectaculares

## Modos de trabajo

### Greenfield
Sitio nuevo o overhaul aprobado. Libertad total en estética.
- Baseline diales: `8 / 7 / 4`
- Declara Design Read y procede sin auditoría previa

### Redesign — Preserve
Modernizar sin romper marca. Auditoría primero:
1. Extraer tokens existentes (color, tipo, radii, logo)
2. Documentar IA (nav, rutas, secciones clave)
3. Inferir diales del sitio actual como punto de partida
4. Aplicar palancas en orden: tipografía → espaciado → color → motion → hero

### Redesign — Overhaul
Nueva identidad visual, contenido preservado.
- Tratar como greenfield para visuales
- No cambiar slugs, nav labels ni form field names sin aprobación

---

## Inferencia de diales desde el brief

| Señal del usuario | VARIANCE | MOTION | DENSITY |
|-------------------|----------|--------|---------|
| minimalista / Linear / calm | 5-6 | 3-4 | 2-3 |
| premium / Apple / luxury | 7-8 | 5-7 | 3-4 |
| Awwwards / experimental / agency | 9-10 | 8-10 | 3-4 |
| landing / portfolio (default) | 7-9 | 6-8 | 3-5 |
| trust-first / sector público | 3-4 | 2-3 | 4-5 |
| AutoDrive / automotriz / tech dark | 7-8 | 6-7 | 4-5 |

---

## Secuencia por tipo de entregable

### Landing page completa (~8 secciones)

```
1. Hero (asymmetric split o kinetic type)
2. Social proof (logo wall bajo el hero, NO dentro)
3. Features (bento grid, N celdas = N items)
4. Showcase (editorial split o horizontal pan)
5. Testimonials (max 3 líneas por quote)
6. Pricing o CTA intermedio (layout diferente a features)
7. FAQ o specs (accordion, NO tabla de 20 filas)
8. Footer CTA + links
```

**Regla:** mínimo 4 familias de layout distintas en 8 secciones.
Máximo 2 zigzags image+text consecutivos. Máximo 1 marquee por página.

### Componente aislado (card, nav, modal)

```
1. Identificar rol (jerarquía, interacción, frecuencia de uso)
2. Aplicar Double-Bezel si es contenedor elevado
3. Estados completos: default, hover, active, focus, loading, disabled
4. Motion proporcional a frecuencia (emil-design-eng framework)
5. Dark mode + reduced motion
```

### Página AutoDrive (novacar)

```
1. Cargar autodrive-design-system PRIMERO
2. Usar @ui atoms/molecules/organisms existentes
3. Todo texto via t("namespace.key") — ES + EN
4. Tokens :root — cero colores hardcodeados
5. Aplicar patrones espectaculares DENTRO del sistema:
   - Glows con --glow-primary / --glow-accent
   - Cards con --bg-elevated + --border
   - Motion con --transition-smooth
```

---

## Assets visuales (prioridad)

1. **Image gen tool** si está disponible → hero, product shots, texturas
2. **Picsum con seed descriptivo** → `https://picsum.photos/seed/{seed}/{w}/{h}`
3. **Placeholder etiquetado** → `<!-- TODO: hero photo 1600x1200 -->` + avisar al usuario

Nunca: div-based fake screenshots, SVG decorativos dibujados a mano, páginas solo texto.

---

## Preguntas de clarificación (máximo 1)

Solo si el Design Read genuinamente diverge:

- *"¿Linear-clean o Awwwards-experimental?"*
- *"¿Preservar la marca actual o empezar visualmente de cero?"*
- *"¿Modo claro, oscuro, o ambos?"*

Si puedes inferir del contexto, no preguntes. Declara el Design Read y avanza.