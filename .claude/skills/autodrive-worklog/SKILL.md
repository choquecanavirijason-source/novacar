---
name: autodrive-worklog
description: Bitácora de trabajo de AutoDrive. Úsalo para registrar y consultar TODO lo que se va construyendo en el proyecto. Invócalo al TERMINAR cualquier tarea significativa (nuevo feature, componente, endpoint, refactor, fix, decisión de arquitectura) para anexar una entrada fechada a docs/WORKLOG.md, y al EMPEZAR una sesión para leer qué se hizo antes. Mantiene el historial, las decisiones y los pendientes en un solo lugar.
---

# Worklog de AutoDrive

Fuente única de verdad de "qué se ha hecho y por qué". Vive en `docs/WORKLOG.md`.

## Cuándo escribir

Al **terminar** algo que importe: feature nuevo, componente relevante, endpoint, refactor, decisión de arquitectura, fix no trivial, o cambio de dependencias. No registres ediciones triviales (typos, formato).

## Cómo escribir una entrada

Anexa (no reescribas el historial) al **inicio de la sección de entradas** (más reciente arriba), con esta plantilla:

```markdown
### YYYY-MM-DD — <título corto>

- **Qué:** descripción concisa de lo construido/cambiado.
- **Dónde:** rutas de archivos clave (`src/features/...`).
- **Por qué:** motivo o decisión de diseño (si aplica).
- **Capa:** domain | data | presentation | core | theme | skills | infra.
- **Pendientes:** lo que quedó abierto (si hay).
```

Usa la fecha real del sistema. Mantén las entradas escaneables (viñetas, no párrafos largos).

## Estructura de docs/WORKLOG.md

```markdown
# AutoDrive · Worklog

> Bitácora cronológica. Más reciente arriba.

## Estado del proyecto
- Resumen de 2-3 líneas del estado actual y módulos existentes.

## Pendientes / Backlog
- [ ] item
- [ ] item

## Entradas
### YYYY-MM-DD — ...
...
```

## Reglas

1. **Nunca borres** entradas pasadas; corrige con una entrada nueva.
2. Mantén **Estado del proyecto** y **Backlog** actualizados al cerrar cada tarea grande.
3. Enlaza archivos con rutas relativas para que sean navegables.
4. Si una entrada toma una decisión de arquitectura, refléjala también donde corresponda (skill `autodrive-architecture`).
5. Una entrada por tarea lógica; agrupa cambios pequeños relacionados.

## Al iniciar sesión

Lee `docs/WORKLOG.md` (Estado + Backlog + últimas 3-5 entradas) antes de proponer trabajo nuevo, para no duplicar ni contradecir lo hecho.
