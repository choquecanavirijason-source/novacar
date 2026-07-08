# Referencia Visual · Brator (Pinterest)

Auditoría del pin: [921760248718718563](https://www.pinterest.com/pin/921760248718718563/)
Demo live: [brator-main.smartdemowp.com](https://brator-main.smartdemowp.com/)

---

## Resumen ejecutivo

Brator es un tema WooCommerce **dark automotive e-commerce** con acento naranja/rojo,
tipografía bold sans-serif, fotografía de producto de alta calidad y estructura
orientada a conversión. Para AutoDrive lo adaptamos a **venta de automóviles**
manteniendo la jerarquía visual pero usando tokens cobalto + cyan.

---

## Paleta Brator (original)

| Rol | Valor Brator | Token AutoDrive equivalente |
|-----|--------------|----------------------------|
| Fondo principal | `#000000` / `#0a0a0a` | `--bg-base` |
| Fondo secciones | `#1a1a1a` / `#222` | `--bg-surface` |
| Fondo cards | `#111` / `#1e1e1e` | `--bg-elevated` |
| Texto principal | `#FFFFFF` | `--text-primary` |
| Texto secundario | `#999` / `#aaa` | `--text-secondary` / `--text-muted` |
| Acento headline | `#FF3D00` / `#E53935` (naranja-rojo) | `--accent-neon` o `--danger` (promos) |
| Acento logo | Naranja cuadrado | `--primary-glow` |
| Bordes | `#333` sutil | `--border` |
| CTA primario | Negro con texto blanco + línea roja | `Button variant="primary"` |
| Badge descuento | Rojo/naranja | `Badge tone="danger"` |

**Regla:** Nunca copiar hex de Brator. Usar tabla de `adaptacion-tokens.md`.

---

## Tipografía

| Elemento | Brator | AutoDrive |
|----------|--------|-----------|
| Nav links | Uppercase, 12–13px, letter-spacing amplio | `text-xs uppercase tracking-widest` |
| Hero H1 | 48–64px, bold, 3 líneas | `text-4xl md:text-5xl font-bold leading-tight` |
| Palabra acento | Color naranja, misma font | `text-gradient` o `text-[var(--accent-neon)]` |
| Section titles | 24–28px, bold, blanco | `SectionHeader` title |
| Product name | 14–16px, medium | `font-medium text-sm` |
| Category label | 11–12px, gris, uppercase | `text-xs text-[var(--text-muted)] uppercase` |
| Precio | 16–18px, bold, blanco | `font-bold text-[var(--text-primary)]` |
| Precio tachado | Gris, line-through | `text-[var(--text-muted)] line-through` |

---

## Header (2 niveles)

### Nivel 1: Promo strip
- Altura ~36px, fondo negro
- Texto: "BLACK FRIDAY | Discount up to 50% use code Brator50"
- Link "Shop Now" en azul/accent
- **AutoDrive:** `t("promo.blackFriday")` + código dinámico

### Nivel 2: Main header
- Logo izquierda (icono cuadrado + wordmark)
- Nav centro: HOME, ABOUT, SHOP, PAGES, CONTACT (uppercase)
- Derecha: search bar ancha, teléfono, user, wishlist, cart "My Vehicle"
- Fondo negro sólido, altura ~70–80px
- **AutoDrive:** extender `Navbar` — no reemplazar desde cero

---

## Hero

- **Layout:** Texto izquierda 35% / Imagen derecha 65%
- **Imagen:** Foto cinematográfica close-up de vehículo (moto en Brator → auto en AutoDrive)
- **Eyebrow:** Label pequeño encima del H1 ("Name Here" → marca o campaña)
- **Headline:** 3 líneas:
  - Línea 1–2: blanco ("Original Parts" → "Encuentra el")
  - Línea 3: acento color ("Motorcycle" → "Auto Perfecto")
- **CTA:** Botón negro "SHOP NOW" + línea roja decorativa debajo
- **Sin scroll** para ver CTA completo

---

## Trust Bar

4 columnas iguales, fondo gris oscuro (`--bg-surface`):

| # | Icono | Texto Brator | AutoDrive i18n key sugerida |
|---|-------|--------------|----------------------------|
| 1 | Truck | Free Home Delivery | `trust.delivery` |
| 2 | Gear | Quality Products | `trust.quality` |
| 3 | Headset | Online Support | `trust.support` |
| 4 | Refresh | 30 Days Returns | `trust.returns` |

Iconos pequeños (~24px), texto 12–13px, centrado.

---

## Featured Products

- Título "Featured Product" izquierda
- Tabs derecha: All | Body Parts | Electronic | Lighting | Repair Parts
- Grid **5 columnas** desktop, 2 tablet, 1 mobile
- Card: imagen cuadrada, categoría, nombre, estrellas + reviews, precio
- Algunos con badge "% Off" esquina superior

**Adaptación autos:** tabs = Todos | SUV | Sedán | Pickup | Eléctricos

---

## Secciones adicionales (demo live)

Del demo [brator-main.smartdemowp.com](https://brator-main.smartdemowp.com/):

1. **Search by Vehicle** — 5 dropdowns (Year, Brand, Model, Engine, Fuel) + Search
2. **Shop by Categories** — 12+ tiles con icono PNG + nombre + subtítulo
3. **What's Hot** — 4 promo banners bento (aceites, llantas, shocks, super saver)
4. **Featured Makes / Models** — tabs + grid de logos/nombres de marcas
5. **Essential Items** — grid productos "para auto nuevo"
6. **Best Seller** — countdown timer + tabs Top 10 / categorías
7. **New Arrivals** — grid similar a featured

---

## Fotografía

- Fondo de producto: blanco o transparente en cards
- Hero: foto editorial con profundidad de campo
- Iluminación dramática, detalles mecánicos visibles
- **AutoDrive:** usar imágenes reales de vehículos, nunca placeholders grises

---

## Densidad y espaciado

| Zona | Padding vertical Brator | AutoDrive |
|------|------------------------|-----------|
| Hero | 0 (full bleed) | `py-0` hero, contenido con padding |
| Trust bar | ~40px | `py-10` |
| Secciones producto | ~60–80px | `Section` default |
| Entre cards | 16–20px gap | gap 18–20 |

---

## Sensación general

- **Masculina, premium, industrial**
- Dark mode nativo (no light mode)
- Alta conversión: CTAs claros, trust signals, urgencia (countdown, % off)
- E-commerce denso pero organizado
- Nada de glassmorphism excesivo — superficies sólidas oscuras