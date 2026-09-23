# AutoDrive · Worklog

> Bitácora cronológica del proyecto. Más reciente arriba.
> Gestionada con el skill `autodrive-worklog`.

## Estado del proyecto

Plataforma de venta de **autos y autopartes** (baterías/fusibles) en **Next.js 16 (App
Router) + TypeScript**, con **Clean Architecture + Feature-Driven** y un **sistema de
diseño Atomic Design** (`src/ui`). Estado con Zustand. **Multilenguaje ES/EN** sin
dependencias (contexto i18n en `src/core/i18n`). Datos vía **datasources mock in-memory**
(lista para conectar API REST/FastAPI cambiando 1 línea en cada `di.ts`). Compila y
buildea sin errores. **Dev/Prod corren en el puerto 3001** (`npm run dev`).

**Módulos:**
- `vehicles_catalog` — landing moderna + catálogo con filtros + detalle de auto.
- `parts_marketplace` — **marketplace de autopartes** estilo e-commerce con filtros largos
  (12 categorías: motores, llantas, asientos, baterías, fusibles, frenos, suspensión,
  aceites, luces, filtros, carrocería, audio), orden, búsqueda y detalle de producto.
- `search_vehicle_parts` — buscador guiado por pasos (Marca→Modelo→Año→Categoría).
- `admin_dashboard` — panel con KPIs, gráfico de barras e inventario editable.

**Rutas:** `/` · `/catalogo` · `/catalogo/[id]` · `/autopartes` · `/autopartes/[id]` ·
`/buscador` · `/admin`.

## Pendientes / Backlog

Roadmap de "catálogo conectado" → "plataforma de comercio completa" (pedido del usuario,
2026-09-23), en 7 fases. **Fase 1 completada** (ver entrada de hoy). Nota: el backend real
es **Laravel** (no FastAPI; el contrato del skill `autodrive-architecture` quedó desactualizado
en ese punto), ya con Sanctum + controllers de Auth/Catalog/Marketplace/Search/Admin/Banner.

- [x] Roles y seguridad básica del panel admin (Fase 1).
- [x] CRUD administrativo real de `MarketplacePart` (autopartes/marketplace) con
      validaciones (Fase 2). **Nota:** `CompatiblePart`/`SearchController` (rutas
      `/vehicles/*`, `/parts/compatible`) parecen legacy — `search_vehicle_parts` ya no
      los usa, filtra `MarketplacePart` en cliente (ver entrada de hoy). No se tocaron.
- [x] Backend de cotizaciones (Fase 3) — banners ya tiene backend real (`BannerController`
      /`SiteBanner`, avanzado en sesión paralela).
- [ ] Carrito, registro de clientes, dirección de entrega, órdenes con estados
      (pendiente/pagada/enviada/entregada/cancelada) y descuento automático de inventario.
- [ ] Integración de pagos con **Mercado Pago** (decisión del usuario, 2026-09-23).
- [ ] Historial de compras del cliente.
- [ ] Imágenes reales vía Laravel Storage local (decisión del usuario, 2026-09-23 — migrar a
      S3/Cloudinary después es solo cambiar el driver).
- [ ] Recuperación de contraseña, verificación de correo.
- [ ] Tests backend (PHPUnit) y frontend (Playwright): login, catálogo, carrito, órdenes,
      inventario. **Bloqueado localmente:** el host tiene PHP 8.2.12 y el backend requiere
      PHP >= 8.4.1 — `artisan`/PHPUnit deben correr vía Docker (`docker-compose.yml`), no
      en el host directamente.
- [ ] Backups automáticos de MySQL, dominio real + HTTPS, correos de confirmación,
      páginas de términos/privacidad/devoluciones.

### 2026-09-23 — Fix: click en una marca no navegaba (pointer capture robaba el click)

- **Qué:** tras agregar el click-to-navigate, el usuario reportó que hacer click en una
  marca no redirigía a `/catalogo?brand=X`. Causa: `onPointerDown` llamaba
  `track.setPointerCapture(e.pointerId)` en **cada** interacción, incluso un tap sin
  arrastre — con el puntero capturado, el spec de Pointer Events redirige no solo los
  eventos `pointer*` sino también los eventos de mouse sintetizados (`mouseup`, `click`) al
  elemento que capturó (`track`, un `<div>`), no al `<a>` que el usuario tocó realmente. El
  `click` nunca llegaba a dispatchearse sobre el `<Link>`, así que el navegador jamás
  ejecutaba su navegación por defecto — pasaba siempre, no solo tras arrastrar.
  - Fix: `setPointerCapture` ya no se llama en `onPointerDown`. Se mueve a
    `onPointerMove`, y solo se activa una vez que `dragDistance` supera el umbral de 6px
    (confirmado arrastre real) — un tap simple nunca llega a capturar el puntero, así que
    el `click` sintetizado sigue apuntando al `<a>` normalmente y navega. `onPointerUp`
    ajustado para solo liberar la captura si de verdad se adquirió (`hasPointerCapture`).
- **Dónde:** `vehicles_catalog/presentation/components/BrandTicker.tsx`.
- **Capa:** presentation.
- **Verificado:** `tsc --noEmit` limpio; `/` responde 200; el HTML sigue exponiendo
  `href="/catalogo?brand=Toyota"` etc. **No verificado en navegador real** (sin
  herramienta de interacción de puntero en esta sesión) — el mecanismo del bug (retargeting
  de `click` bajo pointer capture) es comportamiento de spec documentado, no una suposición,
  pero vale la pena que el usuario confirme que ahora sí navega.

### 2026-09-23 — Carrusel de marcas se pausa al pasar el mouse

- **Qué:** pedido de seguimiento tras conectar el click de cada marca — el ticker se movía
  solo todo el tiempo, incluso con el mouse encima, dificultando apuntar y hacer click en
  una marca puntual antes de que se corriera. Agregado `state.hovering`, con
  `mouseenter`/`mouseleave` en el track (no `pointerenter`/`pointerleave`: pausar por hover
  es un gesto de mouse/desktop — en touch ya se pausa al tocar/arrastrar, vía el mecanismo
  de drag existente). Mismo resorte de easing que ya usaba el retorno a velocidad base tras
  soltar un arrastre (`velocity += (target - velocity) * min(dt*3, 1)`), ahora con
  `target = hovering ? 0 : -autoSpeed` — se frena suave, no en seco, y retoma igual de
  suave al sacar el mouse.
- **Dónde:** `vehicles_catalog/presentation/components/BrandTicker.tsx`.
- **Capa:** presentation.
- **Verificado:** `tsc --noEmit` limpio; `/` responde 200.

### 2026-09-23 — Corrección: usuario revirtió el velo del hero a propósito (no fue colisión)

- **Qué:** la entrada anterior asumió que la desaparición de `--hero-video-wash` de
  `globals.css` fue otra colisión con las sesiones paralelas. Era incorrecto — el usuario
  lo revirtió **a propósito** (no le gustó el velo claro sobre el video) y pidió mantener
  solo el carrusel de marcas clickeable, sin el cambio de fondo del hero.
  - Efecto colateral encontrado: `hero-showcase.css` seguía referenciando
    `var(--hero-video-wash)` en el `background` (multi-capa) de `.hero-scrub__scrim`
    (desktop + mobile) — con la variable ya no declarada en `globals.css`, esa
    `custom-property` inválida invalida el **`background` completo** (no solo esa capa,
    toda la propiedad shorthand), así que el scrim de contraste para el texto se había
    quedado sin renderizar nada. Quitada la referencia — el scrim vuelve a sus 2 gradientes
    oscuros originales, sin el velo, exactamente como estaba antes de esa fase.
  - Confirmado que el carrusel de marcas (`BrandTicker.tsx`) **no fue tocado** por el
    revert del usuario — la navegación por click a `/catalogo?brand=<Marca>` seguía intacta
    y funcional; no hizo falta rehacerla, solo limpiar la referencia rota.
- **Dónde:** `vehicles_catalog/presentation/styles/hero-showcase.css`.
- **Capa:** theme.
- **Verificado:** `tsc --noEmit` limpio; sin más referencias a `hero-video-wash` en todo
  `frontend/src`; confirmado en el HTML que las 11 marcas del ticker siguen generando su
  `href` correcto.
- **Aprendizaje:** no asumir colisión entre sesiones sin confirmar — un revert intencional
  del propio usuario se ve exactamente igual en `git status`/`git diff` que un
  `checkout`/`reset` accidental de otra sesión.

## Entradas

### 2026-09-23 — Carrusel de marcas del home ahora navega al catálogo filtrado

- **Qué:** el usuario pidió que el carrusel de marcas (`BrandTicker`, franja debajo de
  "Explora miles de refacciones por categoría" en `/`) fuera clickeable — cada marca debía
  llevar a una vista con todos los autos de esa marca. Antes era decorativo (`<span>`, sin
  navegación); `/catalogo` ya soportaba `?brand=` para pre-filtrar (mismo patrón que
  `CategoriesBento` usa con `?cat=` para autopartes), así que solo hizo falta conectar:
  1. Cada ítem pasa de `<span>` a `<Link href="/catalogo?brand=<Marca>">`.
  2. El ticker es arrastrable (drag-to-scroll) — sin cuidado, soltar tras arrastrar hubiera
     disparado también el `click` del link y navegado sin querer. Agregado tracking de
     distancia de arrastre (`dragDistance` en el `state` del `useEffect` existente,
     comparado contra un umbral de 6px) + un `didDragRef` que el `onClick` del link revisa
     y cancela (`preventDefault`) si el gesto fue arrastre, no tap.
  3. De paso, mismo bug de fondo negro hardcodeado que las entradas anteriores:
     `.brand-ticker { background: #141414; }` → `var(--bg-surface)`. Agregado
     `text-decoration: none` al item (antes era un `<span>`, ahora es un `<a>`).
- **Dónde:**
  `vehicles_catalog/presentation/components/BrandTicker.tsx`,
  `vehicles_catalog/presentation/styles/brand-ticker.css`.
- **Capa:** presentation + theme.
- **Verificado:** `tsc --noEmit` limpio; confirmado en el HTML servido que las 11 marcas
  generan `href="/catalogo?brand=<Marca>"` correctos; las marcas del ticker coinciden
  exactamente con `v.brand` en los datos reales (comparación estricta en
  `FilterVehiclesUseCase`) — incluye los 4 vehículos Copart-style sembrados antes
  (Honda/Ford/Chevrolet/Kia), que ahora son alcanzables desde el ticker.

### 2026-09-23 — ⚠️ `globals.css` perdió cambios sin commitear por 2ª vez (mismo patrón)

- **Qué:** al ir a agregar el fix de arriba, encontré que **tanto** el velo del hero
  (`--hero-video-wash`, entrada de abajo) **como** el estilo del hint de "Precio final"
  (`.addpart-hint`, entrada más abajo) habían desaparecido de `globals.css` — de nuevo, el
  mismo patrón que ya se documentó antes: alguna de las 2 sesiones paralelas del usuario
  corrió algo tipo `git checkout`/`reset` sobre ese archivo compartido sin commitear antes,
  descartando ediciones ajenas junto con las propias. Repuestos ambos.
- **Dónde:** `theme/globals.css`.
- **Capa:** theme.
- **Nota para el usuario, en serio esta vez:** esto ya pasó 2 veces con el mismo archivo en
  la misma sesión de trabajo. Si sigue pasando, cada vez que alguna sesión revierta
  `globals.css` sin commitear, **se pierden los cambios de las otras 2 sesiones sin aviso**
  — no hay forma de que ninguna sesión se entere de que pasó hasta que alguien nota que
  "algo se ve raro" (como pasó con el hint sin estilo). Recomendación concreta: commitear
  seguido (aunque sea en commits chicos) en vez de dejar cambios grandes sin guardar por
  horas en archivos que las 3 sesiones tocan.

### 2026-09-23 — Velo claro sobre el video del hero en modo claro (con captura del usuario)

- **Qué:** el fix anterior (entrada de abajo) no alcanzaba — el usuario mandó una captura
  de `/` en modo claro mostrando el hero todavía negro. Causa real: ese "negro" no es un
  `background-color` (ya arreglado), es **el video en sí** (`hero-part-1.mp4`/`-2.mp4`,
  metraje cinematográfico oscuro tipo reveal de producto) — tapa por completo cualquier
  color de fondo detrás. Antes de tocar nada le pregunté al usuario cómo lo quería, porque
  el hero fue diseñado a propósito como franja cinematográfica oscura sin importar el tema
  (ver entrada 2026-09-08); eligió: **velo claro translúcido encima del video en modo
  claro**, video intacto.
  - Nueva variable `--hero-video-wash` en `globals.css`: gradiente translúcido color
    `--bg-base` claro (`rgba(245,246,248,...)`, mismo tono que el fondo del resto del
    sitio) en `:root`; `transparent` en `:root[data-theme="dark"]` — mismo patrón que ya
    usa el Navbar para el problema análogo (`--nav-bg-idle`, comentario existente:
    *"idle = siempre con panel claro legible, no depende de que la página tenga un hero
    oscuro debajo"*).
  - Agregada como primera capa (más cercana al espectador) del `background` multi-capa de
    `.hero-scrub__scrim` — ya tenía 2 gradientes oscuros ahí para legibilidad del texto,
    que se mantienen intactos (siguen haciendo falta en ambos temas, el video sigue oscuro).
    Replicado también en el override de `.hero-scrub__scrim` dentro del `@media
    (max-width: 720px)` — reemplazaba el `background` completo y se hubiera perdido el velo
    en mobile si no se actualizaba ahí también.
- **Dónde:** `theme/globals.css` (`--hero-video-wash`, `:root` + `:root[data-theme="dark"]`),
  `vehicles_catalog/presentation/styles/hero-showcase.css` (`.hero-scrub__scrim`,
  desktop + mobile).
- **Por qué:** pedido explícito del usuario tras ver que el fix de fondo no alcanzaba,
  eligiendo la opción "velo" entre 3 alternativas (velo / quitar video en claro / dejarlo
  oscuro a propósito).
- **Capa:** theme + presentation.
- **Verificado:** `tsc --noEmit` limpio (CSS-only, sin impacto TS); `/` responde 200;
  variable definida exactamente 2 veces (claro/oscuro) y consumida en ambos overrides del
  scrim. **No verificado visualmente en navegador** — el usuario ya mandó una captura una
  vez para el problema anterior; convendría que confirme con otra si el velo se ve bien
  (ni muy tenue que no se note, ni tan fuerte que tape el auto).

### 2026-09-23 — Fondo del hero de inicio ya no queda negro en modo claro

- **Qué:** el usuario reportó que en `/` (inicio), el hero principal (`HeroShowcase` — el
  scrollytelling de video con GSAP, `.hero-scrub`) mostraba fondo negro aun en modo claro.
  Causa: `hero-showcase.css` tenía dos fondos **hardcodeados** en vez de tokens:
  - `.hero-scrub { background: #0d0d0d; }` — de fondo, visible mientras el video carga o en
    los bordes de letterbox. El comentario del propio archivo lo delataba: *"funde el borde
    inferior con el negro base del sitio"* — escrito cuando el sitio era 100% oscuro, antes
    del modo claro (ver entrada 2026-09-08, "Modo claro/oscuro sitewide"); nunca se
    actualizó para este hero en particular.
  - `.hero-scrub__loader { background: rgba(5, 5, 5, 0.95); }` — la pantalla de carga
    (tacómetro + bandera a cuadros) que se ve mientras el video no terminó de bufferizar.
    Bug adicional que esto causaba: su texto (`.hero-scrub__loader-title`) ya usa
    `var(--text-primary)` (oscuro en modo claro) — contra un fondo negro hardcodeado
    siempre quedaba oscuro-sobre-oscuro, casi ilegible en modo claro.
  - Cambiados ambos a `var(--bg-base)` (mismo token que ya usa el resto del sitio: claro en
    modo claro, `#0d0d0d` en modo oscuro — el valor hardcodeado coincidía exacto con el
    dark-mode de ese token, confirmando que era ese caso sin migrar).
  - **No tocado a propósito:** el scrim sobre el video (`.hero-scrub__scrim`, gradientes
    `rgba(0,0,0,...)`) y la bandera del loader (rayas blancas) — esos oscurecen el video
    para que el texto blanco se lea encima, no son "fondo de página" y el video en sí sigue
    siendo oscuro sin importar el tema (igual que Tesla/Apple con hero de producto).
- **Dónde:** `vehicles_catalog/presentation/styles/hero-showcase.css`.
- **Capa:** theme.
- **Verificado:** `/` responde 200; sin más fondos hardcodeados (`#`/`rgba(0`/`rgba(5`) en
  ese archivo tras el cambio. No probado visualmente en navegador (sin herramienta de
  screenshot en esta sesión) — recomendable confirmar en modo claro.

### 2026-09-23 — Fix: specs mal formadas rompían el guardado ("specs.0.value field is required")

- **Qué:** el usuario preguntó por qué salía "The specs.0.value field is required when
  specs is present." al guardar. Causa: el campo "Specs" es un solo input de texto libre
  (`etiqueta: valor, etiqueta: valor`) que `parseSpecs()` divide por comas y luego por
  `:` — si un fragmento no tenía `:` (o lo tenía sin nada después, ej. escribir solo
  "Medida" o "Medida:" en vez de "Medida: 205/55 R16"), quedaba una spec con `value: ""`,
  y el backend la rechaza (`specs.*.value` es `required_with:specs`) — mensaje técnico de
  Laravel, no algo que el admin supiera interpretar. Fix: `parseSpecs()` ahora descarta los
  fragmentos incompletos (sin label o sin value) en vez de mandarlos a medias — un typo de
  formato en una spec ya no tumba el guardado completo de la autoparte.
- **Dónde:**
  `parts_marketplace/presentation/components/MarketplacePartFormModal.tsx`.
- **Capa:** presentation.
- **Verificado:** `tsc --noEmit` limpio; probado en Node el parser con 4 casos (bien
  formado, sin ":", con ":" sin valor, vacío) — todos dan el resultado esperado; confirmado
  contra la API real que una spec bien formada guarda 201.

### 2026-09-23 — Fix: "Precio final" se trababa al tipear (bug real) + CSS perdido por sesión paralela

- **Qué:** el usuario reportó que agregar el campo editable "Precio final" (entrada
  anterior) "arruinó todo" en el formulario de autopartes. Dos causas distintas:
  1. **Bug real de mi cambio anterior:** el campo tenía `value={finalPrice(price,
     discountPercent)}` calculado en vivo y el `onChange` recalculaba `discountPercent` en
     cada tecla — al escribir, por ejemplo, "850" dígito por dígito, cada dígito parcial
     (8, 85, 850) se redondeaba a un `%` distinto y el campo **saltaba a otro número a
     mitad de tipeo**, haciendo prácticamente imposible escribir un monto. Fix: patrón
     "escribir libre + confirmar al salir" — estado propio `finalPriceDraft` que se escribe
     sin restricciones, y el `%` de descuento recién se recalcula en `onBlur` (un solo
     ajuste al terminar, no uno por tecla). Sincronizado de vuelta con `useEffect` cuando
     `price`/`discountPercent` cambian desde SUS PROPIOS campos.
  2. **`frontend/src/theme/globals.css` volvió a su versión del último commit** — la regla
     `.addpart-hint` que había agregado en la entrada anterior había desaparecido por
     completo (confirmado: `git diff` de ese archivo estaba vacío antes de este fix, pese a
     haberlo editado yo). No fue una edición mía — lo más probable es que una de las 2
     sesiones paralelas del usuario haya corrido algo tipo `git checkout` sobre ese archivo
     compartido, descartando cualquier cambio sin commitear ahí, el mío incluido. Sin esa
     regla, el texto de ayuda bajo "Precio final" se renderizaba sin estilo (negro, sin
     `var(--text-muted)`, con los márgenes por defecto del navegador) — visualmente
     descuadrado en un panel oscuro, que es probablemente lo que se vio como "todo
     desacomodado". Re-agregada la regla; movido el `<p>` del hint a fila propia de ancho
     completo (antes vivía dentro de la celda de un solo campo en la grilla de 3 columnas,
     lo que también podía desalinear esa fila contra las otras dos).
- **Dónde:**
  `parts_marketplace/presentation/components/MarketplacePartFormModal.tsx`,
  `theme/globals.css`.
- **Capa:** presentation + theme.
- **Verificado:** `tsc --noEmit` limpio; `/admin?tab=inventory` responde 200 sin marcas de
  error de Next.js en el HTML.
- **Riesgo de coordinación (para tener presente, no solo hoy):** `globals.css` es un
  archivo global compartido por TODO el panel admin — cualquier sesión que corra un
  `git checkout`/`reset` sobre él sin commitear antes descarta los cambios de las otras
  sesiones en curso. Vale la pena, cuando haya una pausa natural, commitear seguido en vez
  de dejar cambios grandes sin guardar por mucho tiempo en archivos que varias sesiones
  tocan (`globals.css`, `dictionaries.ts`, `routes/api.php`).

### 2026-09-23 — "Precio final" editable en el formulario de autopartes

- **Qué:** el usuario no podía escribir en el campo "Precio final (con descuento)" del
  formulario de autopartes — era intencionalmente `readOnly`/`disabled`, una vista previa
  calculada de `Precio × (1 − %Descuento)`, no un campo de captura. Cambiado a editable:
  al escribir un monto ahí, se mantiene el precio base fijo y se recalcula el `%Descuento`
  necesario para llegar a ese monto (redondeado al entero más cercano — el dominio solo
  guarda `discountPercent` 0–100 entero, no un monto de descuento propio, así que el precio
  final exacto puede ajustarse levemente al tipear). Si no hay precio base cargado todavía
  (0), el monto escrito pasa a ser el precio de lista, sin descuento.
  - Agregado hint debajo del campo (`admin.partFieldFinalPriceHint`, ES/EN) aclarando que
    es editable y cómo funciona el redondeo.
- **Dónde:**
  `parts_marketplace/presentation/components/MarketplacePartFormModal.tsx`,
  `core/i18n/dictionaries.ts`, `theme/globals.css` (`.addpart-hint`, nuevo).
- **Por qué:** pedido explícito del usuario tras confirmar (con pregunta de por medio) que
  se refería exactamente a ese campo.
- **Capa:** presentation + i18n + theme.
- **Verificado:** `tsc --noEmit` limpio; matemática de ida y vuelta confirmada con Node
  (precio 1000 + final deseado 850 → 15% descuento → final real 850; sin precio base +
  final 500 → precio 500, 0% descuento).

### 2026-09-23 — Fix #3: categoría/condición custom de autopartes rechazadas + errores reales visibles en el form

- **Qué:** tras los fixes #1 (`image_url` TEXT→LONGTEXT) y #2 (`post_max_size`), el usuario
  reportó que **seguía** sin poder guardar. `laravel.log` no tenía nada nuevo — indicio de
  que ahora el fallo era un **422 de validación** (Laravel no loguea `ValidationException`
  por defecto). Reproduje a propósito los usos típicos del formulario y encontré 2 bugs:
  1. **Categoría/condición personalizadas rechazadas.** `MarketplacePartFormModal` usa
     `SelectWithAdd` para `category` y `condition` — el admin puede tocar
     "+ Agregar opción" y escribir una categoría nueva (ej. "Espejos"). El propio
     `partPresentation.ts` ya tiene soporte explícito para esto
     (`resolveCategoryIcon`/`resolveCategoryLabel` con respaldo genérico — comentario:
     *"categorías que el admin agregó desde el '+' del formulario"*). Pero mi validación
     del backend (Fase 2) restringía `category`/`condition` a una lista fija (`in:`),
     rechazando cualquier valor agregado así con 422 — inconsistente con
     `CatalogController` (vehículos), donde `body_type`/`fuel_type`/`condition` **ya son
     string libre** a propósito, mismo patrón de extensibilidad. Bug propio, no del
     usuario: relajé `category`/`condition` en `MarketplaceController::validated()` a
     `string|max:100` sin whitelist, alineado con vehículos.
  2. **El formulario nunca mostraba el error real.** Aun con la causa real corregida, el
     UX seguía siendo malo: `MarketplacePartFormModal` mostraba siempre
     `t("common.saveError")` ("No se pudo guardar. Intenta de nuevo.") sin importar el
     motivo — el mensaje real de Laravel (`HttpError` en `core/http/HttpClient.ts` ya lo
     extrae bien: `"The selected category is invalid."`, etc.) quedaba guardado en
     `useMarketplacePartAdminStore().error` pero nadie lo leía. `VehiclesAdminPage`/
     `VehicleFormModal` ya tenían el patrón correcto (`onSubmit` devuelve `true | string`,
     el store expone el motivo real vía `getState().error`) — llevado a
     `MarketplacePartsAdminPage`/`MarketplacePartFormModal` para que ahora el admin vea el
     mensaje real (ej. "El precio debe ser al menos 1") en vez de un genérico sin pistas.
- **Dónde:** `backend/app/Http/Controllers/Api/MarketplaceController.php`,
  `frontend/src/features/parts_marketplace/presentation/pages/MarketplacePartsAdminPage.tsx`,
  `frontend/src/features/parts_marketplace/presentation/components/MarketplacePartFormModal.tsx`.
- **Por qué:** el patrón `true | string` en vez de `boolean` para `onSubmit` no es solo
  cosmético — es lo que permitió diagnosticar remotamente (vía API directa) qué fallaba
  sin acceso al navegador del usuario; vale la pena mantenerlo en cualquier form nuevo.
- **Capa:** presentation + backend validation.
- **Verificado en runtime real:** reproduits ambos 422 exactos con curl antes del fix
  (categoría "espejos" → 422, condición "para-refaccion" → 422); después del fix, mismos
  payloads → 201. `tsc --noEmit` limpio. Datos y admin de prueba borrados al terminar.
- **Pendiente (mencionado, no confirmado con el usuario):** ¿la config de PHP del fix #2
  (rebuild + recreate de `backend-api-1`) sigue viva tras esto? Sí — no se tocó Docker en
  esta entrada, solo código de la app.

### 2026-09-23 — Fix #2: "sigue sin dejarme guardar" — límite `post_max_size` de PHP (8M)

- **Qué:** tras el fix de `image_url` (entrada de abajo), el usuario reportó que **seguía**
  sin poder guardar una autoparte nueva. `storage/logs/laravel.log` no tenía ninguna
  excepción nueva — pista de que el fallo ocurría **antes** de que Laravel llegara a
  procesar el request. Reproducido a propósito con payloads cada vez más grandes:
  - ~5 MB (foto de celular normal en base64) → guardaba bien.
  - ~9 MB (foto de buena calidad) → PHP cortaba la petición con
    `PHP Request Startup: POST Content-Length of 9333747 bytes exceeds the limit of
    8388608 bytes` y devolvía **HTTP 200 con HTML del warning en vez de JSON** — el
    `fetch` del frontend truena al parsear eso como JSON, y como
    `MarketplacePartFormModal`/`useMarketplacePartAdminStore` capturan cualquier error
    genérico, el usuario solo ve "No se pudo guardar. Intenta de nuevo." sin pista real.
  - Causa: el contenedor (`php:8.4-fpm` base, sin `php.ini` propio) usaba el default de PHP
    `post_max_size=8M` — insuficiente porque las fotos se mandan como data URL base64
    (infla el tamaño ~33%) dentro del mismo JSON del formulario, no como upload
    multipart con su propio límite.
  - **Fix:** `backend/docker/php/uploads.ini` (nuevo) con `post_max_size=32M`,
    `upload_max_filesize=32M`, `memory_limit=256M` (128M por defecto se quedaba corto para
    procesar JSON de varios MB). Copiado a `/usr/local/etc/php/conf.d/` en el `Dockerfile`.
    Imagen reconstruida (`docker compose build api`) y contenedor recreado
    (`docker compose up -d --force-recreate api`) para que el fix quedara activo ya, no
    solo en el próximo deploy.
- **Dónde:** `backend/docker/php/uploads.ini` (nuevo), `backend/Dockerfile`.
- **Capa:** infra (PHP/Docker).
- **Verificado en runtime real:** el mismo payload de ~9 MB que antes rompía con el warning
  de PHP ahora responde `201` normal, tras rebuild + recreate del contenedor. Confirmado
  `php -i` dentro del contenedor recreado con los 3 valores nuevos. Datos y usuarios de
  prueba borrados al terminar.
- **Nota de arquitectura (no resuelta hoy, ítem ya en el Backlog):** esto es un parche real
  pero sigue siendo base64-en-JSON-en-BD — el fix correcto de fondo es la fase "Imágenes y
  contenido" del roadmap (subir a Laravel Storage/S3/Cloudinary como archivo real, servir
  por URL, no guardar el blob completo en cada fila de `marketplace_parts`/`catalog_vehicles`).
  `VehicleFormModal`/`CatalogController` tienen exactamente el mismo patrón y se benefician
  del mismo fix de `post_max_size`, pero también heredan la misma deuda de fondo.

### 2026-09-23 — Fix: "No se pudo guardar" al crear autoparte con foto (columna `image_url` muy chica)

- **Qué:** el usuario reportó que guardar una autoparte nueva fallaba con el mensaje
  genérico "No se pudo guardar. Intenta de nuevo." Revisé `storage/logs/laravel.log` del
  contenedor (no el navegador, ahí el error real queda oculto por el mensaje genérico de
  `MarketplacePartFormModal`) y encontré la causa real: `PDOException ... SQLSTATE[22001]:
  String data, right truncated ... Data too long for column 'image_url'`.
  - **Bug propio, introducido en la Fase 2** (`2026_09_23_000002_add_admin_crud_fields_...`):
    la columna `marketplace_parts.image_url` se creó como `TEXT` (límite ~64 KB de MySQL).
    Pero `ImageUrlField` (mismo componente que usa `VehicleFormModal`) guarda la foto que
    sube el admin como **data URL en base64** — una foto de celular normal supera 64 KB
    fácilmente, así que cualquier autoparte con foto subida fallaba al guardar. Las que no
    llevaban foto (`image_url: null`) sí guardaban bien, por eso no se detectó en las
    pruebas de la Fase 2 (probé el CRUD pero sin subir imagen).
  - `catalog_vehicles.image_url` (vehículos) ya usaba `LONGTEXT` desde su creación — por
    eso ese formulario nunca tuvo este problema.
  - **Fix:** migración nueva `2026_09_23_000004_widen_marketplace_parts_image_url_column`
    — `ALTER TABLE ... MODIFY image_url LONGTEXT NULL` (SQL crudo: `Blueprint::change()`
    pide `doctrine/dbal`, no instalado en el proyecto). Aplicada en el contenedor real.
- **Mismo riesgo, no tocado:** `site_banners.image_url` (migración de la sesión paralela,
  `BannerController`) también es `TEXT`, no `LONGTEXT` — mismo bug esperable si se sube una
  imagen de banner grande. No lo cambié porque ese archivo es de la otra sesión; avisado al
  usuario para que lo pida ahí o acá explícitamente.
- **Dónde:** `backend/database/migrations/2026_09_23_000004_...php` (nueva).
- **Capa:** infra (esquema de BD).
- **Verificado en runtime real:** reproducido el error exacto primero (payload con imagen
  base64 de ~130 KB → antes de la migración habría fallado, después de aplicarla → 201
  creado correctamente). Admin y registro de prueba borrados al terminar.

### 2026-09-23 — Botón "Autopartes" propio en el nav del panel (junto a Usuarios)

- **Qué:** el usuario pidió explícitamente un botón "Autopartes" separado en el nav del
  panel, al lado de "Usuarios" — no le alcanzaba con que viviera embebido dentro del tab
  "Inventario" (ver corrección en la entrada de Fase 2, más abajo). Como `InventoryPage.tsx`
  ya era 100% la pantalla de autopartes (nada más ahí desde la unificación a
  `MarketplacePart`), no hizo falta un componente nuevo: **renombrado + reordenado**, no
  duplicado.
  1. `AdminTopbar.tsx`: reordenado el array `items` — el tab `inventory` (id interno sin
     cambios, para no romper los links existentes con `?tab=inventory` en `UserTopPanel.tsx`
     y `AnalyticsPage.tsx`) pasa a ir justo antes de `users`. Ícono cambiado de `Package` a
     `Wrench` (más asociado a autopartes).
  2. `dictionaries.ts`: `admin.inventory`/`userPanel.inventory` ("Inventario"/"Inventory")
     → "Autopartes"/"Auto Parts" (ES/EN) — mismo label en el botón del nav, el dropdown de
     `UserTopPanel` y el `<h1>` de la página. `admin.inventorySubtitle` corregido de paso
     (decía "Stock físico en bodega — no es contenido público", texto viejo de la época de
     `InventoryItem`; ahora dice que es el catálogo de autopartes visible en `/autopartes`).
- **Dónde:** `admin_dashboard/presentation/components/AdminTopbar.tsx`,
  `core/i18n/dictionaries.ts`.
- **Capa:** presentation + i18n.
- **Verificado:** `tsc --noEmit` limpio.
- **No renombrado:** el id interno `"inventory"` (`AdminPage`, query param `?tab=inventory`,
  nombre de archivo `InventoryPage.tsx`) — cambiarlo tocaba 3 archivos más sin beneficio
  visible para el usuario; el label sí quedó como "Autopartes" en todos lados.

### 2026-09-23 — Rechazado: scraping de copart.com; fix real: fallback de fotos poco confiable

- **Qué:** el usuario pidió "hacer scraping" de copart.com para traer fotos/datos reales de
  lotes a la app. **Rechazado** — no es un caso de seguridad ofensiva autorizada ni research:
  es extraer contenido con copyright (fotos de aseguradoras/consignantes, no de Copart) de un
  sitio de terceros cuyos ToS prohíben scraping, para republicarlo como si fuera inventario
  propio de un negocio real (`novacar.mx`, visto en `.env`). Explicado al usuario; ofrecidas
  alternativas (fotos de stock libres, fotos propias, o solo más datos de ejemplo). Eligió
  fotos de stock libres de derechos.
- **Bug real encontrado al implementarlo:** el fallback de fotos que ya usaba `/importaciones`
  desde antes de esta sesión (`vehiclePhotoUrl` → `loremflickr.com`, keyword marca+carrocería)
  le devuelve a `curl` una página de **verificación anti-bot** (challenge JS) en vez de la
  imagen — HTTP 401 con HTML de "Bot check", no la foto. Como un `<img src>` de navegador
  tampoco ejecuta JS, había riesgo real de que las fotos de `/importaciones` no cargaran nunca
  para un visitante real (no solo para mis pruebas). No introducido por mí — ya estaba así.
  Confirmado el fallback curado existente (`catalogPresentation.ts`, `images.unsplash.com`)
  sí responde 200 normal.
  1. **`vehiclePhotoUrl`** (`vehiclePresentation.ts`): reemplazado el fallback de loremflickr
     por 5 fotos de stock de Unsplash (Unsplash License — uso comercial permitido, sin
     atribución obligatoria), una por `BodyType` (sedan/suv/hatchback/pickup/motocicleta),
     cada URL verificada con `curl` (200 + `image/jpeg`) antes de usarla. Trade-off explícito
     aceptado por el usuario: menos variedad (una foto por tipo de carrocería, no una única
     por vehículo) a cambio de confiabilidad real.
  2. **`catalogPresentation.ts`** (fix de la sesión anterior, mismo día): en vez del
     "imagen por defecto" única para todas las marcas sin foto curada, ahora delega en
     `vehiclePhotoUrl` — así Honda/Ford/Chevrolet/Kia (agregados hoy) obtienen foto acorde a
     su tipo de carrocería en `/catalogo` también, no solo en `/importaciones`.
- **Dónde:** `vehicles_catalog/presentation/vehiclePresentation.ts`,
  `vehicles_catalog/presentation/catalogPresentation.ts`.
- **Capa:** presentation.
- **Verificado:** `tsc --noEmit` limpio; contra el dev server real, los 4 vehículos nuevos
  (Honda/Ford/Chevrolet/Kia) resuelven a URLs `images.unsplash.com` distintas según
  carrocería (sedan comparte con sedan, pickup y suv tienen la suya); la URL final
  confirmada con `curl` → `200 image/jpeg`. **No verificado visualmente en navegador.**
- **Pendiente:** `HERO_CAR_PHOTO_URL` en el mismo archivo sigue apuntando a loremflickr,
  pero no tiene ningún import/uso en el código actual (dead export) — no se tocó por estar
  fuera de alcance; si en algún momento se usa, tiene el mismo riesgo y debería migrarse
  igual que `vehiclePhotoUrl`.

### 2026-09-23 — UI estilo Copart en tarjetas de vehículo + 4 lotes de subasta reales

- **Qué:** pedido del usuario, fuera del roadmap de 7 fases: "traer algunos autos con sus
  detalles y algo parecido al estilo de copart.com/es, sin cambiar los colores/estilos del
  sitio". Investigación primero: `CatalogVehicle` (dominio + backend) **ya tenía** todos los
  campos tipo lote de subasta (`titleCode`, `damageType/Severity/Description`, `saleDate/
  Time/Location`, `hasKeys`, `runAndDrive`, `highlights`, `notes`) y `VehicleDetail.tsx` (la
  página `/catalogo/[id]`) **ya tenía construida** la sección completa "ficha de lote"
  (`vdetail-additional-info`: título, daño con badge de color por severidad, llaves,
  destacados, info de venta) — pero estaba invisible en la práctica porque (a) ningún
  vehículo real traía esos datos poblados y (b) las tarjetas de listado (grid/lista) no
  mostraban ningún adelanto de esa info, solo se veía si el usuario ya había entrado al
  detalle. El trabajo fue cerrar ambos huecos, no rediseñar nada:
  1. **`AuctionLotBadges`** (nuevo, `vehicles_catalog/presentation/components/`): pill row
     reutilizable (título/daño con color por severidad/run&drive), con prop `only` para
     elegir subconjunto según espacio de la tarjeta. Reutiliza helpers nuevos en
     `vehiclePresentation.ts` (`damageBadgeClass`, `damageSeverityKey`, `hasAuctionInfo`) —
     **mismo esquema de color** que ya usaba `VehicleDetail` (verde/amarillo/naranja/rojo
     por severidad, clases Tailwind ya establecidas ahí, no colores nuevos). Solo se
     renderiza si el vehículo trae datos reales (`hasAuctionInfo`); en autos sin esos campos
     no aparece nada (sin romper las tarjetas existentes de Mazda/Nissan/Tesla/etc.).
  2. **Refactor sin duplicación:** `VehicleDetail.tsx` tenía su propia copia de la lógica
     severidad→color/label (`getDamageBadgeStyles`, `getSeverityLabel`) — reemplazada por
     los mismos helpers de `vehiclePresentation.ts` que ahora usa `AuctionLotBadges`, para
     no mantener el mapeo en dos sitios.
  3. **Integrado en 4 tarjetas** (mismo `CatalogVehicle`, se comparte entre `/catalogo` e
     `/importaciones`): `VehicleGridCard` y `VehicleShowcaseSlide` (grid/lista de
     `/catalogo`) con la fila completa; `ImportVehicleGridCard` (via `photoTopSlot` de
     `ProductCard`, solo el pill de título por espacio) e `ImportVehicleCard` (fila
     completa, tiene espacio) en `/importaciones`.
  4. **CSS nuevo** en `catalog.css` (`.auction-lot-badges*`): tokens (`var(--bg-elevated)`,
     `var(--border)`, `var(--accent-soft)`, `var(--radius-pill)`), cero hex nuevos.
  5. **4 vehículos reales** creados vía la API admin (Fase 2/CatalogController, ya
     funcionando) con ficha de lote completa y variada: Honda Civic 2019 (Salvage, daño
     frontal moderado, enciende y circula), Ford F-150 2020 (Rebuilt, daño por inundación
     severo, no enciende), Chevrolet Camaro 2021 (Clean, sin daños, destacado), Kia
     Sportage 2018 (Salvage, daño lateral moderado). Sin tocar `AutoDriveSeeder.php`
     (editado por sesión paralela) — se insertaron directo contra la BD real por API.
- **No se tocó:** paleta de colores, tokens `:root`, ni el layout general de las páginas —
  solo se agregó la fila de badges dentro de tarjetas ya existentes, con los mismos colores
  de severidad que `VehicleDetail` ya usaba.
- **Dónde:** `vehicles_catalog/presentation/components/AuctionLotBadges.tsx` (nuevo),
  `vehicles_catalog/presentation/vehiclePresentation.ts`,
  `vehicles_catalog/presentation/pages/VehicleDetail.tsx`,
  `vehicles_catalog/presentation/components/{VehicleGridCard,VehicleShowcaseSlide,
  ImportVehicleGridCard,ImportVehicleCard}.tsx`, `vehicles_catalog/presentation/styles/
  catalog.css`. Sin cambios de i18n — las claves (`detail.titleCode`, `detail.primaryDamage`,
  `detail.runAndDrive`, `detail.damageNone/Minor/Moderate/Severe`, etc.) ya existían.
- **Capa:** presentation + theme (reutiliza tokens existentes).
- **Verificado:** `tsc --noEmit` limpio; contra el dev server real (puerto 3001, ya
  corriendo): `/catalogo`, `/importaciones` y el detalle de los 4 lotes nuevos → 200;
  confirmado en el HTML real del detalle de Honda Civic que el badge de daño renderiza con
  la clase de color naranja (`moderate`) y el texto "Salvage"/daño correctos. **No
  verificado visualmente en navegador** (sin herramienta de screenshot en esta sesión) —
  recomendable una revisión visual rápida de `/catalogo` e `/importaciones` en ambos temas
  antes de darlo por cerrado del todo.
- **Pendientes:** ver Backlog — el roadmap de 7 fases sigue en Fase 4 (carrito/órdenes).

### 2026-09-23 — Fase 3 del roadmap: backend de cotizaciones (`quote-requests`)

- **Qué:** tercera fase. Igual que en Fase 2, el frontend (`features/quote_requests`) ya
  tenía toda la Clean Architecture lista (use cases, `QuoteRequestHttpDataSource` con las
  rutas exactas, `QuoteRequestsAdminPage`) — solo faltaba el backend:
  1. **Migración** `create_quote_requests_table`: `id` uuid PK, `source`, `customer_email`,
     `subject`, `details` (text), `amount` (nullable), `status` (default `new`), timestamps.
  2. **Modelo** `QuoteRequest` (Eloquent, PK string no incrementable, cast `amount` a int).
  3. **`QuoteRequestController`:**
     - `store` — **público, sin auth** (cualquier visitante del sitio puede enviar una
       cotización/consulta de importación o de autoparte). Validado: `source` limitado a
       `import|inquiry|test_drive`, `customer_email` con formato válido, `subject`/`details`
       requeridos, `amount` opcional. Siempre crea con `status: new`.
     - `adminIndex`/`updateStatus`/`destroy` — dentro del grupo `role:admin,operator` de la
       Fase 1. `updateStatus` valida `status` contra `new|contacted|closed`.
  4. **Rutas:** `POST /quote-requests` (pública, con `throttle:10,1` — es un endpoint
     público tipo formulario de contacto, expuesto a spam/abuso sin ese límite) y
     `GET /admin/quote-requests`, `PATCH /admin/quote-requests/{id}/status`,
     `DELETE /admin/quote-requests/{id}` (staff).
- **Dónde:** `backend/database/migrations/2026_09_23_000003_...php` (nueva),
  `backend/app/Models/QuoteRequest.php` (nuevo),
  `backend/app/Http/Controllers/Api/QuoteRequestController.php` (nuevo),
  `backend/routes/api.php`.
- **Por qué:** pedido explícito del usuario, ítem "Sistema de cotizaciones" (Backend
  completo del roadmap).
- **Capa:** data/infra (backend). Frontend no se tocó, ya estaba listo.
- **Verificado en runtime real** (Docker, `backend-api-1`/`backend-db-1`): migración
  aplicada, admin de prueba creado y logueado, `POST /quote-requests` público sin token
  (201), validación de `source` inválido (422), `GET /admin/quote-requests` sin token
  (401) y con admin (200), `PATCH .../status` con valor válido (200) e inválido (422),
  `DELETE` (204). Usuario y registro de prueba borrados al terminar.
- **Nota de config, no de código (para la Fase 5 de Seguridad):** `APP_DEBUG=true` en el
  backend — correcto para `APP_ENV=local`, pero confirmar que quede en `false` al
  desplegar a producción; con `true` las respuestas de error (404/405/500) incluyen el
  stack trace completo en el JSON, visto durante las pruebas de esta fase y la anterior.
- **Pendientes:** ver Backlog — siguiente fase (4) es carrito + registro de clientes +
  dirección de entrega + órdenes con estados + descuento automático de inventario.

### 2026-09-23 — Fase 2 del roadmap: CRUD administrativo real de autopartes + fix de seguridad en auth

- **Qué:** segunda fase del roadmap. El frontend (`features/parts_marketplace`) ya tenía
  **toda** la Clean Architecture lista para CRUD real (`CreatePartUseCase`,
  `UpdatePartUseCase`, `DeletePartUseCase`, `MarketplaceHttpDataSource`,
  `MarketplacePartFormModal`, `MarketplacePartsAdminPage`) apuntando a
  `POST/PUT/DELETE /admin/marketplace/parts` — pero esas rutas no existían en el backend
  (`MarketplaceController` solo tenía `index`/`show`). El DTO del frontend también ya
  esperaba `discount_percent`/`reorder_level`/`image_url` (comentario en el dominio:
  "Único modelo para 'Piezas' y 'Autopartes' — antes eran dos entidades separadas"),
  campos que el modelo/tabla de Laravel no tenía (tenía `original_price`, sin usar en
  ningún sitio del backend salvo el propio payload de salida).
  1. **Migración** `2026_09_23_000002_...`: agrega `discount_percent` (0–100),
     `reorder_level`, `image_url` a `marketplace_parts`; quita `original_price`
     (confirmado sin uso: ni el seeder ni otro controller la referenciaban). Aplicada con
     `docker exec backend-api-1 php artisan migrate --force` (el contenedor Docker sí
     corre PHP 8.4; el host sigue en 8.2.12, ver Fase 1).
  2. **`MarketplacePart` (modelo):** `$fillable` actualizado a los campos nuevos.
  3. **`MarketplaceController`:** `store`/`update`/`destroy` nuevos, con validación
     completa espejo de `NewMarketplacePart` (categoría limitada a las 12 reales,
     condición a `nuevo|usado|reconstruido`, `sku` único —ignorando el propio registro en
     `update`—, `year_to >= year_from`, `specs.*.label/value`, etc.) y payload de
     respuesta con los campos nuevos. ID autogenerado como slug `categoría-nombre` con
     sufijo si colisiona (mismo patrón que `CatalogController::uniqueSlug`).
  4. **Rutas:** `POST/PUT/DELETE /admin/marketplace/parts{,/{id}}` dentro del grupo
     `role:admin,operator` de la Fase 1.
  5. **Bug de seguridad encontrado y arreglado (no introducido por esta fase, preexistente):**
     cualquier request **sin** header `Accept: application/json` a una ruta
     `auth:sanctum` sin sesión iniciada producía un **500 con stack trace completo
     filtrado al cliente**, en vez de un 401 limpio — `Authenticate::redirectTo()`
     intentaba `route('login')`, ruta que no existe (esta API es 100% stateless/JSON, sin
     login por sesión). Fix: `$middleware->redirectGuestsTo(fn () => null)` en
     `bootstrap/app.php` — con eso Laravel nunca intenta armar la URL de redirect y
     responde `401 {"message":"Unauthenticated."}` siempre. Relevante para la fase de
     Seguridad del roadmap ("protección contra ataques comunes" / no filtrar stack traces).
- **Dónde:** `backend/database/migrations/2026_09_23_000002_...php` (nueva),
  `backend/app/Models/MarketplacePart.php`,
  `backend/app/Http/Controllers/Api/MarketplaceController.php`, `backend/routes/api.php`,
  `backend/bootstrap/app.php`.
- **Por qué:** pedido explícito del usuario, ítem "CRUD administrativo de autopartes" +
  "validaciones, respuestas de error y logs" (Fase de Backend completo del roadmap).
- **Capa:** data/infra (backend) — el frontend no se tocó, ya estaba listo.
- **Verificado en runtime real** (no solo `php -l`): usando los contenedores Docker ya
  corriendo (`backend-api-1` en :8002, `backend-db-1` mysql) — `admin:create` para crear
  un admin de prueba, login, `POST/PUT/DELETE /admin/marketplace/parts` con curl (201,
  200, 204), validación de `category` inválida y `sku` duplicado → 422 con mensajes
  claros, request sin token → 401 limpio (antes 500), `customer` contra `/admin/inventory`
  → 403. Usuarios y datos de prueba borrados al terminar (`qa-phase2@novacar.test`,
  `qa-customer@novacar.test`, pieza `engine-pieza-de-prueba-qa`).
- **Corrección (2026-09-23, más tarde):** la nota de abajo era incorrecta —
  `MarketplacePartsAdminPage` **sí estaba enlazada**, no como tab propio sino embebida
  dentro del tab existente **"Inventario"** vía `admin_dashboard/presentation/pages/
  InventoryPage.tsx` (que ya renderiza `MarketplacePartsAdminPage` + botón "+ Nueva
  autoparte" en su header). No lo detecté porque solo grepeé el nombre del componente en
  `AdminDashboard.tsx`/`index.ts` directamente. Verificado ahora de punta a punta (form →
  store → repo → `MarketplaceHttpDataSource` → los endpoints reales de esta fase) — el
  admin ya puede crear/editar/borrar autopartes manualmente desde `/admin?tab=inventory`,
  sin trabajo pendiente. Las 37 claves i18n que usa el formulario (`admin.part*`, etc.) ya
  existían completas en ES/EN.
- ~~Pendiente de UI: falta agregar el tab~~ (obsoleto, ver corrección arriba).
- **Pendientes:** ver Backlog — siguiente fase (3) es cotizaciones (backend) — banners ya
  tiene backend real, en progreso en sesión paralela.

### 2026-09-23 — Fase 1 del roadmap "plataforma de comercio": roles y seguridad del panel admin

- **Qué:** primera fase del roadmap de 7 fases pedido por el usuario para convertir
  AutoDrive de catálogo conectado a plataforma de comercio completa. Esta fase cierra el
  hueco de que `/admin` (backend) solo exigía `auth:sanctum` (cualquier usuario logueado,
  incluido un `customer` recién registrado) sin verificar rol — la protección real era
  únicamente client-side (`AdminDashboard.tsx`, fácil de saltar llamando la API directo):
  1. **Middleware de rol** `EnsureUserHasRole` (`role:admin,operator`, parametrizable por
     roles) — reemplaza un `EnsureUserIsAdmin` inicial de rol único, ajustado tras revisar
     que el frontend ya trata `admin`+`operator` como "staff" con acceso al panel
     (`isStaff` en `AdminDashboard.tsx`, `cuenta/page.tsx`, `UsersPage.tsx`). Registrado
     como alias `role` en `bootstrap/app.php`. Aplicado a todo el grupo `/api/admin/*`.
  2. **Rate limiting de login/registro:** `throttle:6,1` (6 intentos/min por IP) en
     `POST /auth/login` y `POST /auth/register` — antes no tenían límite (fuerza bruta).
  3. **Comando artisan `admin:create {email} {--name=} {--password=}`** — crea o promueve
     un usuario a `admin` de forma interactiva (pide password con `secret()` si no se pasa
     por flag). Reemplaza la alternativa de sembrar un admin con contraseña fija en un
     seeder, que quedaría en el repo.
  4. **Quitadas credenciales demo precargadas** en `/login`
     (`admin@autodrive.com` / `demo` aparecían ya escritas en los inputs al cargar la
     página) — campos ahora vacíos.
- **Decisiones del usuario (2026-09-23):** pasarela de pago → **Mercado Pago**
  (se integra en la fase de Pagos, no en esta); storage de imágenes → **Laravel Storage
  local** para empezar (se integra en la fase de Imágenes, no en esta).
- **Nota de coordinación:** durante esta sesión se detectaron 2 sesiones paralelas de
  Claude Code (mismo usuario, mismo pedido) editando `routes/api.php`, `AutoDriveSeeder`,
  `BannerController`/`SiteBanner`, `UsersPage`/`UserFormModal` y `VehiclesAdminPage` al
  mismo tiempo — confirmado por el usuario. Esta sesión evitó tocar esos archivos
  (salvo el grupo de rutas `/api/admin` en `routes/api.php`, que sí requería el middleware
  de rol) para no pisar ese trabajo en curso.
- **Dónde:** `backend/app/Http/Middleware/EnsureUserHasRole.php` (nuevo),
  `backend/app/Console/Commands/CreateAdminUser.php` (nuevo), `backend/bootstrap/app.php`,
  `backend/routes/api.php`, `frontend/src/app/login/page.tsx`.
- **Por qué:** pedido explícito del usuario, ítem "Roles y permisos: solo admin puede
  entrar al panel" — implementado como "solo staff (admin/operator)" para no romper el
  modelo de roles ya construido en el frontend; y "no dejar credenciales demo en
  producción".
- **Capa:** infra (middleware/routing) + core (comando artisan) + presentation (login).
- **Verificado:** `php -l` limpio en los 4 archivos PHP tocados/nuevos. **No verificado
  en runtime:** el host corre PHP 8.2.12 y el backend requiere PHP >= 8.4.1 (`artisan`
  falla por `platform_check.php`) — hay que correr `artisan route:list` / probar los
  endpoints vía el `docker-compose.yml` del backend, no se hizo en esta sesión.
- **Pendientes:** ver Backlog — siguiente fase (2) es CRUD real de autopartes.

### 2026-09-08 — Colores de texto/fondo "quemados" en modo claro (post modo claro/oscuro)

- **Qué:** tras el modo claro/oscuro, varias pantallas fuera de `/catalogo` seguían con
  colores Tailwind crudos (`text-white`, `text-gray-400/500/600`, `bg-gray-800`,
  `bg-white/5`, etc.) o gradientes hex fijos, en vez de los tokens de `theme/globals.css` —
  en claro quedaban ilegibles (texto claro sobre fondo claro) o con cajas negras sólidas.
  Pedido por el usuario: "que sean el mismo tema que los colores, como ejemplo de
  catálogo". Arreglado archivo por archivo:
  - `app/not-found.tsx`, `app/error.tsx`: `h1` con `text-white` → `text-(--text-primary)`.
  - `app/ubicaciones/page.tsx`: reescrita casi por completo a tokens (`bg-(--bg-surface)`,
    `bg-(--bg-elevated)`, `text-(--text-secondary)`, `text-(--text-muted)`,
    `border-(--border)`, etc.). De paso corregido `bg-(--bg-card)` — variable que **nunca
    existió** en `globals.css`, la tarjeta llevaba meses sin fondo real (transparente,
    disimulado por el fondo oscuro de antes). Se dejaron intactos el texto/badges que van
    **sobre foto** (overlay con scrim oscuro) — esos sí deben seguir blancos en ambos temas.
  - `features/parts_marketplace/presentation/pages/PartsMarketplace.tsx`: título
    "NUESTROS PRODUCTOS" (`text-white` directo sobre el fondo de página) →
    `text-(--text-primary)` (namespace i18n `market.productsTitle`).
  - `features/parts_marketplace/presentation/components/PartCard.tsx`,
    `features/vehicles_catalog/presentation/components/ImportVehicleGridCard.tsx`: el
    fondo de la foto de cada tarjeta (`ProductCard` → prop `accentFrom/accentTo`) estaba
    **hardcodeado** a grises casi negros (`#252525`, `#1c1c1c`/`#0a0a0a`) sin importar el
    tema — por eso en `/autopartes` y `/importaciones` las fotos de producto se veían como
    cajas negras sólidas en claro. Cambiado a `var(--bg-elevated)`/`var(--bg-surface)`
    (funciona en gradiente inline porque `var()` se resuelve igual en `style` que en CSS).
  - `features/vehicles_catalog/presentation/components/{FeaturedVehicles,ImportVehicleCard}.tsx`:
    tarjeta destacada/importación con `bg-(--bg-base)` (ya temeada) pero título/precio/specs
    en `text-white` y labels en `text-gray-400` → tokens; el watermark decorativo
    `text-white/5` → `text-(--text-primary)/5` (para que siga visible, tenue, en claro).
  - `features/vehicles_catalog/presentation/components/VehicleFinderBar.tsx` (buscador bajo
    el Hero): `<select>` con `bg-(--bg-base)` pero `text-white` — el texto del dropdown era
    invisible en claro. `border-white/10` → `border-(--border)`.
  - `features/vehicles_catalog/presentation/{pages/VehicleDetail,components/VehicleGridCard,components/VehicleShowcaseSlide}.tsx`:
    placeholders de "sin imagen" con `text-gray-500/600`/`bg-gray-800` sueltos, pisando el
    `color: var(--text-muted)` ya puesto en el contenedor (`.vehicle-grid-card__placeholder`
    / `.vehicle-showcase-slide__placeholder` en `catalog.css`) — quitados para que hereden.
  - `theme/globals.css`: `.nav__avatar` (círculo de perfil/login) tenía `color: #fff`
    hardcodeado — el ícono quedaba invisible sobre el círculo de vidrio claro del navbar
    en modo claro. → `var(--nav-text)` (mismo token que el resto del nav).
- **Bug de entorno (no de código) encontrado al verificar:** después de este fix el navegador
  seguía sirviendo el chunk CSS **viejo** de Turbopack (`.nav__avatar{color:#fff}` literal en
  vez de la var) — mismo patrón que el panic de Turbopack del inicio de esta sesión. Se
  resolvió matando el proceso de `next dev` y borrando `.next` antes de reiniciar. Si algo
  similar vuelve a pasar (un cambio de CSS que "no se ve" pese a estar en el archivo):
  matar el proceso en el puerto 3001 y `rm -rf .next` antes de `npm run dev`.
- **Dónde:** ver lista de archivos arriba.
- **Capa:** presentation + theme.
- **Verificado:** `tsc --noEmit` limpio; Playwright (Chromium) — barrido de screenshots en
  `/`, `/catalogo`, `/autopartes`, `/buscador`, `/importaciones`, `/ubicaciones`, `/login`,
  `/registro` en modo claro; color computado del ícono del avatar confirmado
  `rgb(20, 22, 26)` (antes `rgb(255, 255, 255)`); los 5 links del navbar + ThemeSwitch +
  LanguageSwitcher siguen funcionando tras el reinicio limpio.

### 2026-09-08 — Fix: `.nav__right` tapaba Ubicaciones/Importaciones (regresión de la entrada anterior)

- **Qué:** el fix de `z-index:3` en `.nav__right` de la entrada de abajo (para que el
  `ThemeSwitch` no quedara tapado por `.nav__center`) tenía un efecto secundario: como
  `.nav__right` seguía siendo `flex:1`, su caja invisible ocupaba **la mitad derecha de
  toda la navbar** — con `z-index:3` esa mitad ahora tapaba los clics de los links de
  `.nav__center` que caen ahí (Ubicaciones, Importaciones). Reportado por el usuario
  ("catálogo y ubicación no entran"); reproducido con Playwright (Chromium + Firefox,
  `elementFromPoint` resolvía a `.nav__right`, no al `<a>`).
- **Fix real:** `.nav__right` pasa de `flex: 1` a `flex: none; margin-left: auto`. Sigue
  pegado al borde derecho, pero su caja ahora se ajusta a su contenido real (los íconos)
  en vez de inflarse a medio navbar. `.nav__logo` (el otro lado, ya en `flex:1`) absorbe
  el espacio sobrante sin problema porque nunca tuvo z-index (no tapa nada).
- **Dónde:** `frontend/src/theme/globals.css` (`.nav__right`).
- **Capa:** theme.
- **Verificado:** Playwright en Chromium y Firefox — los 5 links de `.nav__center`
  (Catálogo/Autopartes/Buscador/Importaciones/Ubicaciones) + `ThemeSwitch` +
  `LanguageSwitcher` navegan/click-ean correctamente; `elementFromPoint` confirma que
  cada click cae en el `<a>` correcto, no en una caja invisible.

### 2026-09-08 — Modo claro/oscuro sitewide + switch en Navbar

- **Qué:** el sitio pasó de ser 100% dark-only a tener modo **claro por defecto** con
  toggle a **oscuro**, persistente:
  - `:root` de `theme/globals.css` reescrito como paleta clara nueva; el look "Premium
    Dark UI" original se preservó **intacto y sin tocar** bajo `:root[data-theme="dark"]`.
  - `ThemeProvider` (contexto + `localStorage["autodrive.theme"]`, mismo patrón que
    `I18nProvider`) + script inline en `<head>` que aplica `data-theme` antes del primer
    paint (evita flash), con `suppressHydrationWarning` en `<html>`.
  - `ThemeSwitch` (pill sol/luna) integrado en `Navbar` junto al `LanguageSwitcher`.
  - Tokens nuevos: `--nav-bg-idle/--nav-bg-scrolled/--nav-text/--nav-text-shadow/--nav-icon-shadow`
    (en claro el nav siempre lleva panel translúcido legible, ya no depende de que la
    página tenga un hero oscuro debajo como en oscuro) y `--product-card-bg/--product-card-border`
    (glass de `.product-card` en `ui/templates/templates.css`, reusado en catálogo y marketplace).
  - `body` background y `.landing-bg` (textura fibra de carbono) ahora theme-aware.
  - A propósito **sin tocar**: `hero-showcase.css` / `vehicle-showcase.css` /
    `brand-ticker.css` — franjas cinematográficas full-bleed, se quedan oscuras en ambos
    temas (patrón intencional tipo Tesla/Apple, no un fondo de página).
- **Bug real encontrado y corregido:** `.nav__center` (`position:absolute; z-index:2`)
  tapaba los clics de `.nav__right` en desktop (~1440px) — el `ThemeSwitch` nuevo quedaba
  bajo esa capa. Fix: `.nav__right` → `z-index: 3`.
- **Fix adicional (pedido por el usuario):** faltaba la key i18n `catalog.viewDetails`
  (se veía el literal `catalog.viewDetails` en las tarjetas del catálogo) — agregada en
  `dictionaries.ts` (ES: "Ver detalles", EN: "View details").
- **Dónde:** `src/theme/globals.css`, `src/core/theme/ThemeProvider.tsx` (nuevo),
  `src/ui/molecules/ThemeSwitch.tsx` (nuevo), `src/ui/organisms/Navbar.tsx`,
  `src/app/layout.tsx`, `src/ui/templates/templates.css`,
  `src/features/parts_marketplace/presentation/styles/marketplace.css`,
  `src/core/i18n/dictionaries.ts` (namespace `nav`: `theme/themeToLight/themeToDark`;
  namespace `catalog`: `viewDetails`).
- **Por qué:** pedido explícito del usuario — sitio quedó fijo en oscuro, pidió claro por
  defecto + switch en el navbar para alternar.
- **Capa:** theme + core + presentation (ui) + i18n.
- **Verificado:** `tsc --noEmit` limpio; Playwright (chromium headless) — toggle
  funcional, persiste tras reload, sin errores de consola, capturas de navbar/home/catálogo
  en ambos temas y en una página sin hero (`/catalogo`) para confirmar legibilidad.
- **Pendientes:** no se retemizaron manualmente los "shine"/gloss decorativos
  (`rgba(255,255,255,0.x)` sobre botones/cards en `templates.css` y demás CSS de
  features) — son translúcidos sutiles, no rompen legibilidad en claro, pero podrían
  refinarse más adelante si se quiere fidelidad pixel-perfect.

### 2026-09-03 — Corrección del formulario de vehículos

- **Qué:** completado el payload de `VehicleFormModal` con los metadatos requeridos por `NewCatalogVehicle`, usando valores existentes al editar y defaults para altas nuevas.
- **Dónde:** `frontend/src/features/vehicles_catalog/presentation/components/VehicleFormModal.tsx`.
- **Por qué:** el formulario no compilaba porque enviaba un objeto incompleto al caso de uso.
- **Capa:** presentation.
- **Pendientes:** tests del backend bloqueados localmente por PHP 8.2.12; las dependencias requieren PHP >= 8.4.1.

### 2026-06-22 — Reorganización a monorepo (frontend/ + backend/)

- **Qué:** Movida toda la app Next.js a `frontend/` para separar frontend y backend con
  claridad. La raíz queda como monorepo:
  ```
  /frontend  (Next.js: src, config, package.json, node_modules)
  /backend   (ya existía)
  /docs /.claude /.agents /CLAUDE.md /skills-lock.json  (tooling a nivel proyecto)
  ```
- **Movidos a `frontend/`:** `src`, `.next`, `node_modules`, `package.json`,
  `package-lock.json`, `tsconfig.json`, `next.config.mjs`, `next-env.d.ts`, `.env.local(.example)`,
  `.gitignore`, `README.md`.
- **Sin cambios en alias:** `@ui/@core/@features/@theme` resuelven vía `./src/*` relativo al
  `tsconfig.json` (ahora en `frontend/`), así que no hubo que tocar imports.
- **Actualizado:** `CLAUDE.md` (rutas `src/` → `frontend/src/`, nota de estructura y comando
  `cd frontend && npm run dev`); nuevo `README.md` raíz describiendo el monorepo.
- **Cómo correr ahora:** `cd frontend && npm run dev` (puerto 3001).
- **Verificado:** `next build` OK (9 rutas) y dev server → 200 desde la nueva ubicación.
- **Nota:** algunos SKILL.md aún citan rutas `src/...`; léanse como `frontend/src/...`.

### 2026-06-22 — Interfaz de venta estilo Brator (/autopartes)

- **Qué:** Rediseño de la tienda de autopartes siguiendo `autodrive-ui` → `venta-autos-brator`:
  - `PartsHero` (template `HeroSplit`): headline "Refacciones originales / para tu **vehículo**"
    con acento cyan, CTA "Comprar ahora", stats y visual.
  - `TrustBar` (template `FeatureGrid`): 4 beneficios (envío, calidad, soporte, devoluciones).
  - `CategoryTabs`: tabs horizontales (Todos + 12 categorías con conteo), selección única
    sincronizada con el filtro de categoría (estilo "Featured Product" de Brator).
  - `PartCard` pulida: etiqueta de categoría en cyan arriba del nombre + rating bajo el título.
  - `PartsMarketplace` recompuesto: Hero → TrustBar → guía compat. → promos → Tabs → grid+sidebar.
- **Fix:** añadido alias bare `@ui` en `tsconfig.json` (`./src/ui/index.ts`); los templates
  documentan `import { … } from "@ui"` pero solo existía `@ui/*` → Turbopack no resolvía.
- **Dónde:** `src/features/parts_marketplace/presentation/components/{PartsHero,TrustBar,CategoryTabs,PartsMarketplace,PartCard}.tsx`,
  `…/styles/marketplace.css`, `src/core/i18n/dictionaries.ts` (market hero/all + namespace `trust`), `tsconfig.json`.
- **i18n:** `market.heroTitleA/heroTitleB/heroAccent/heroCta/all`, namespace `trust` (ES/EN).
- **Capa:** presentation + ui (templates) + i18n. `next build` OK (8 rutas); `/autopartes` → 200.

### 2026-06-22 — Stack UI para Claude: skills + templates + orquestador

- **Qué:**
  - Skill maestro `autodrive-ui` en `.claude/skills/` (orquesta todo el stack UI).
  - `CLAUDE.md` en raíz: instrucciones para que Claude lea skills antes de codear UI.
  - Templates premium en `src/ui/templates/` (`HeroSplit`, `CollectionView`, `CatalogLayout`,
    `CTABand`, `FeatureGrid`, etc.) + `templates.css` global.
  - Skills locales: `ui-ux-builder`, `ui-templates`, `interfaces-espectaculares`.
  - Molecules: `EmptyState`, `ErrorState`. Barrel `@ui` actualizado.
- **Uso:** `/autodrive-ui` o pedir "interfaz moderna" → Claude lee design-system +
  ui-ux-builder + ui-templates (y premium si aplica).
- **Dónde:** `CLAUDE.md`, `.claude/skills/autodrive-ui/`, `src/ui/templates/`, `skills-lock.json`.
- **Capa:** skills + presentation (@ui templates).

### 2026-06-08 — Skills de frontend/diseño (skills.sh, 3ª tanda)

- **Qué:** Instaladas 4 skills:
  - `vercel-react-best-practices` — performance React/Next.js (Vercel Eng). (Safe)
  - `vercel-composition-patterns` — patrones de composición React 19 (compound, render
    props, context) para APIs reutilizables. (Safe)
  - `design-taste-frontend` (leonxlnx) — "anti-slop": infiere la dirección de diseño y
    entrega UIs no plantilladas; audit-first en rediseños. (Safe)
  - `extract-design-system` (arvindrk) — extrae primitivas de diseño de un sitio público y
    genera tokens de arranque.
- **Seguridad:** `extract-design-system` salió **Med Risk / 1 alert**. Revisada: solo 3
  markdown (SKILL.md + references), sin scripts/binarios. El riesgo es de USO: su workflow
  corre `npx extract-design-system <url>` + `npx playwright install chromium` (paquete de
  terceros + navegador headless para scrapear). Se conserva como referencia; **NO ejecutar
  ese workflow sin OK explícito del usuario**.
- **Dónde:** `.agents/skills/<skill>/` con symlink en `.claude/skills/`.
- **Estado del arsenal UI/UX:** 11 skills (1 propia + 10 externas). Set considerado completo;
  el siguiente paso recomendado es APLICARLAS, no seguir añadiendo.
- **Capa:** skills.

### 2026-06-08 — Más skills de diseño UI/UX (skills.sh, 2ª tanda)

- **Qué:** Instaladas 3 skills de diseño para elevar el look de la plataforma:
  - `high-end-visual-design` (leonxlnx/taste-skill) — diseñar "como agencia premium":
    fuentes, espaciado, sombras, estructura de cards y animaciones que se sienten caras;
    bloquea defaults genéricos. (Safe / 0 alerts / Low Risk)
  - `emil-design-eng` (emilkowalski/skill) — design engineering: craft de micro-interacciones
    y animación. (Safe / 0 alerts / Low Risk)
  - `ui-ux-pro-max` (nextlevelbuilder) — inteligencia UI/UX (50+ estilos, 161 paletas, 57
    pares tipográficos, 99 guías UX, charts) multi-stack.
- **Seguridad:** `ui-ux-pro-max` salió **High Risk** en el análisis heurístico de contenido
  (Socket 0 alerts, Snyk Low Risk). **Revisada manualmente**: SKILL.md (658 líneas) es guía
  de diseño benigna, sin `curl`/`fetch`/`eval`/exfiltración/secretos. Los archivos `data` y
  `scripts` son punteros relativos a recursos del repo (no presentes, inofensivos). Se
  conserva; el flag se considera falso positivo por sus verbos de acción amplios.
- **Dónde:** `.agents/skills/<skill>/` con symlink en `.claude/skills/`.
- **Prioridad:** ante conflicto de criterio, manda `autodrive-design-system` (tokens/Atomic
  Design/layout del proyecto); estas aportan "ojo" visual y craft.
- **Capa:** skills.

### 2026-06-08 — Skills externas de UI/UX instaladas (skills.sh)

- **Qué:** Instaladas 3 skills públicas de UI/UX/Next.js vía el CLI oficial `npx skills add`
  (todas pasaron la evaluación de seguridad: Safe / 0 alerts / Low Risk):
  - `frontend-design` (anthropics/skills) — interfaces frontend distintivas, evita estética
    genérica de IA; tipografía, theming por variables CSS, motion, composición.
  - `web-design-guidelines` (vercel-labs/agent-skills) — revisión de UI contra Web Interface
    Guidelines (accesibilidad, UX, best practices).
  - `next-best-practices` (vercel-labs/next-skills) — buenas prácticas Next.js (RSC, data
    patterns, async APIs, metadata, imágenes/fuentes, bundling).
- **Dónde:** instaladas en `.agents/skills/<skill>/` y symlinkeadas en `.claude/skills/`.
- **Cómo usarlas:** son complementarias a `autodrive-design-system` (que manda en tokens,
  Atomic Design y layout del proyecto). Usar `frontend-design` para pulido visual,
  `web-design-guidelines` para auditar UI/accesibilidad, `next-best-practices` para dudas de
  Next.js. Ante conflicto, prevalecen las convenciones de `autodrive-design-system`.
- **Capa:** skills.

### 2026-06-08 — Skill UI/UX ampliado (guía de layout y composición)

- **Qué:** Expandido `autodrive-design-system` a una guía UI/UX completa para "colocar bien"
  cualquier elemento: sistema de layout y escala de espaciado, grids `auto-fill`, tabla de
  breakpoints reales del código, catálogo `@ui` (atoms→molecules→organisms→templates) con
  cuándo usar cada componente, recetas de layout por tipo de página (hero, categorías,
  grilla de productos, sidebar de filtros, fila de KPIs), estados obligatorios
  (loading/vacío/error), reglas de i18n, animación, accesibilidad, anti-patrones y checklist.
- **Dónde:** `.claude/skills/autodrive-design-system/SKILL.md`.
- **Por qué:** que el trabajo visual futuro sea consistente y bien estructurado por defecto.
- **Capa:** skills.

### 2026-06-08 — Rediseño visual landing + marketplace (referencias e-commerce)

- **Qué:** Rediseño inspirado en referencias de tiendas de autopartes/rental:
  1. **Hero pro** (`LandingHero`): layout 2 columnas — texto/CTAs + visual con tarjeta de
     gradiente, auto flotante y chips (🔋12V, 🛞R16, ⚙️2.0L, 🛡️12m).
  2. **Categorías populares** (`PopularCategories`): grilla de tiles con icono, nombre y
     conteo de artículos; cada tile enlaza a `/autopartes?cat=<categoria>` (pre-filtra).
  3. **Banners promocionales** (`DiscountBanners`): envío gratis / hasta -50% / garantía,
     usados en landing y en el marketplace.
  4. **¿Por qué elegirnos?** (`WhyChooseUs`): grid de beneficios con iconos circulares.
  5. **Tarjeta de auto** rediseñada con fila de specs e iconos (⛽/⚙️/👤) y botón primario.
  6. Pre-filtrado del marketplace vía `?cat=` (lectura de query sin Suspense) + `init(preset)`.
  7. i18n: namespaces `home`, `promo`, `why` (ES/EN). Estilos `home.css`.
- **Dónde:** `src/features/vehicles_catalog/presentation/components/{LandingHero,DiscountBanners,WhyChooseUs,VehicleCard}.tsx`,
  `src/features/vehicles_catalog/presentation/styles/home.css`,
  `src/features/parts_marketplace/presentation/components/{PopularCategories,PartsMarketplace}.tsx`,
  `src/app/page.tsx`, `src/core/i18n/dictionaries.ts`.
- **Por qué:** acercar la UI a un look e-commerce premium según las referencias del usuario.
- **Capa:** presentation + ui + i18n. Composición cross-feature vía el `di` público del módulo.
- **Verificado:** `next build` OK (8 rutas); landing con `hero-pro/cat-tiles/promo-row/why-grid`;
  `/autopartes?cat=engine` → 200.

### 2026-06-08 — Marketplace de autopartes (estilo e-commerce, filtros largos)

- **Qué:** Nuevo feature `parts_marketplace` (Clean Architecture completa) con UX tipo
  Mercado Libre/Amazon:
  1. **Dominio:** `MarketplacePart` (precio/descuento, condición, rating, envío, garantía,
     compatibilidad, specs), `PartFilters`/`PartFacets`, use cases `SearchParts`
     (filtro + orden), `GetPartFacets`, `GetPartById`.
  2. **Datos:** DTO + mapper + datasource (HTTP + Mock con 24 piezas en 12 categorías:
     motores, llantas, asientos, baterías, fusibles, frenos, suspensión, aceites, luces,
     filtros, carrocería, audio) + repoImpl + `di.ts`.
  3. **Presentación:** store Zustand (toggles, rango, compatibilidad, orden, búsqueda),
     `PartsFilters` (sidebar largo con checkboxes, selects, switches), `PartCard`
     (descuento, precio tachado, envío, garantía, rating), `PartsMarketplace`
     (toolbar + orden + grid + banner a la búsqueda guiada), `PartDetail`.
  4. Atom nuevo `RatingStars` en `@ui`. Estilos `marketplace.css`.
  5. Rutas `/autopartes` y `/autopartes/[id]`; nav "Autopartes" añadido.
  6. i18n: namespaces `market`, `partCat`, `cond` (ES/EN).
- **Dónde:** `src/features/parts_marketplace/*`, `src/app/autopartes/*`,
  `src/ui/atoms/RatingStars.tsx`, `src/core/i18n/dictionaries.ts`, `src/ui/organisms/Navbar.tsx`.
- **Por qué:** la búsqueda de partes debía sentirse como un marketplace intuitivo con
  filtros amplios; el wizard de compatibilidad se conserva y se enlaza desde el banner.
- **Capa:** domain + data + presentation + ui + i18n.
- **Verificado:** `next build` OK (8 rutas); `/autopartes` y `/autopartes/[id]` → 200.

### 2026-06-08 — Atomic Design + i18n ES/EN + UI pulida + puerto 3001

- **Qué:**
  1. **Atomic Design** en `src/ui/`: atoms (Button, Badge, Chip, Card, Input, Skeleton,
     Logo, Eyebrow), molecules (StatCard, SearchInput, SpecBadge, SectionHeader,
     LanguageSwitcher), organisms (Navbar, Footer), template (PageShell), barrel `@ui`
     y README. Alias `@ui/*` en tsconfig.
  2. **Multilenguaje ES/EN** sin dependencias: `src/core/i18n` (dictionaries, I18nProvider
     con persistencia en localStorage, hook `useTranslation`). Conmutador en el Navbar.
  3. Refactor de toda la UI a client + `useTranslation` + atoms: landing, catálogo,
     filtros, tarjetas, detalle, buscador por pasos y panel admin completamente traducidos.
  4. Navbar/Footer globales movidos al layout; header con backdrop-blur y link activo.
  5. Puerto cambiado a **3001** en scripts `dev`/`start`.
  6. Eliminado `StockAlertCard` (reemplazado por el `StatCard` atómico de `@ui`).
- **Dónde:** `src/ui/*`, `src/core/i18n/*`, `src/app/layout.tsx`, `src/features/*/presentation/*`,
  `src/theme/globals.css`, `tsconfig.json`, `package.json`.
- **Por qué:** componibilidad y consistencia visual (Atomic Design) + alcance bilingüe.
  i18n por contexto cliente evita reestructurar rutas bajo `[locale]`.
- **Capa:** presentation + core (i18n) + ui (design system) + theme.
- **Verificado:** `next build` OK (6 rutas) y servidor en `http://localhost:3001`
  respondiendo 200 en `/`, `/catalogo`, `/buscador`, `/admin`, `/catalogo/[id]`.
- **Pendientes:** ver Backlog.

### 2026-06-08 — Skills del proyecto + página de autos moderna + admin pulido

- **Qué:**
  1. Creados 4 skills de proyecto en `.claude/skills/`: `autodrive-architecture`
     (Clean Architecture front+back y contrato de API), `autodrive-design-system`
     (tokens UI/UX y recetas), `autodrive-admin-panel` (patrones del panel),
     `autodrive-worklog` (esta bitácora).
  2. Catálogo de autos moderno: entidad `CatalogVehicle` enriquecida, use cases
     `FilterVehiclesUseCase` y `GetVehicleByIdUseCase`, dataset de 9 autos, explorador
     con filtros reactivos (marca/carrocería/combustible/precio + búsqueda), tarjetas
     con "foto" por gradiente y página de detalle.
  3. Landing renovada: hero con stats y animaciones de entrada; featured con `VehicleCard`.
  4. Panel admin pulido: `StockAlertCard` con icono/acento/glow, `MiniBarChart` (CSS puro),
     `AnalyticsPage` con KPIs, gráfico de más vendidos y acciones rápidas; skeletons de carga.
  5. Tema ampliado: animaciones (`fadeInUp`, `shimmer`, `pulse-glow`, `float`), utilidades
     (`.text-gradient`, `.section-eyebrow`, `.skeleton`, `.animate-in`).
- **Dónde:** `.claude/skills/*`, `src/features/vehicles_catalog/*`,
  `src/features/admin_dashboard/presentation/*`, `src/app/catalogo/*`, `src/theme/globals.css`.
- **Por qué:** elevar la plataforma a nivel "premium" manteniendo la separación estricta
  de capas; los skills fijan las convenciones para trabajo futuro consistente.
- **Capa:** presentation + domain + data + theme + skills.
- **Pendientes:** ver Backlog (backend real, auth, checkout, imágenes).

### 2026-06-08 — Scaffolding inicial (Clean Architecture)

- **Qué:** Proyecto Next.js + TypeScript con 3 módulos (search_vehicle_parts,
  admin_dashboard, vehicles_catalog), capa `core` (HttpClient, formatters, Result),
  tema `:root` (dark + cobalto + cyan), buscador de autopartes end-to-end y panel admin.
- **Dónde:** `src/core`, `src/theme`, `src/features/*`, `src/app/*`.
- **Por qué:** base desacoplada y escalable; datasources mock para correr sin backend.
- **Capa:** todas. Build verificado (4 rutas estáticas).
