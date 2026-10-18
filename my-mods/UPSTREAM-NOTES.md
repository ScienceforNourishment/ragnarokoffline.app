# Novedades del proyecto original útiles para nuestros mods

Revisión del merge de `upstream/main` (hasta la 1.6.4, 2026-10-17). Solo lo
que afecta a cómo hacemos mods; el resto (autoactualización, compañeros,
instaladores) no se trata aquí.

## Cambios en las reglas de los mods

- **Límite de ajustes: de 20 a 40** por mod (`settings` en `mod.json`). Aplica
  también a las páginas de ajustes propias (`settingsPage`). Útil para
  `expedition-board` y `world-atlas`, que ya iban justos.
- **Una carpeta de era reemplaza solo la copia del propio mod** en `db/`
  (#538). Antes, una tabla `pre-renewal/db/...` podía borrar las entradas que
  otros mods ya habían fusionado en ese archivo. Si algún mod nuestro tenía un
  rodeo para esto, ya no hace falta. Detalle en `docs/MODDING_INTERNALS.md`.

## Hooks de Lua nuevos para habilidades

`skill("<AegisName>", { ... })` admite además tres funciones:

| Hook | Cuándo | Devuelve |
|---|---|---|
| `level(c, stock)` | la fórmula lee el nivel base del jugador | el nivel a usar |
| `job_level(c, stock)` | la fórmula lee el nivel de trabajo | el nivel de trabajo a usar |
| `heal(c, stock)` | Heal, Highness Heal o Coluceo Heal restauran HP | la cantidad |

Solo se consultan para jugadores y solo en las habilidades cuya fórmula lee el
nivel fuera del porcentaje de daño (lista completa en `docs/MODDING.md`, sección
de hooks de habilidad). En renewal, para cambiar una curación usa `heal`, no
`level`.

## Ejemplo nuevo: `examples/mods/skill-tuning`

Referencia completa para tocar habilidades vanilla: números en `db/skill_db.yml`
(cast, delay, duración, área, SP) y fórmulas en `lua/` (daño, precisión,
elemento). Muestra un archivo por era (`pre-renewal/` y `renewal/`) y partes
activables con un ajuste (`db/when/<ajuste>/`, `lua/when/<ajuste>/`). Su README
lista lo que no se puede cambiar todavía. Léelo antes de hacer cualquier mod de
habilidades (por ejemplo el sistema de afijos de `affix-forge`).

## Ventana del estilista (`openstylist`)

Un NPC puede mostrar precios y forma de pago con una línea
`@@event stylist pay=<comando> head=<zeny>:<item> ...` justo antes de abrir la
ventana. El cobro lo hace la extensión del servidor `stylist_script_costs`
(se activa en `db/extension_db.yml`), con `setstylistcost`, `getstylistcost` y
`setstylistpayment`. Hay un ejemplo completo en `docs/MODDING.md`. Sirve para
cualquier mod de tiendas de apariencia.

## Mods nuevos del registro como referencia

- **`registry/mods/renewal-world`** (+ `registry/tools/renewal-world/`): abre en
  pre-renewal los mapas de renewal. Los datos están en CSV (`gates.csv`,
  `maps.csv`) y `build.py` genera los NPC (warps, mapflags, puertas). Es el
  patrón que pide el proyecto para datos editables, y el más cercano a lo que
  hacemos con `registry/tools/expedition-board/` y `world-atlas`. Su ajuste de
  "áreas de quests" muestra cómo activar un archivo de NPC entero con un ajuste.
- **`prontera-vendors`**: reescrito con `build_vendors.py` ampliado y archivos de
  datos por era (`pre-re/`). Buen ejemplo de un mod grande con datos generados.
- Nuevos en el registro, con `mod.json` e iconos como modelo de publicación:
  `mega-booster`, `city-unity`, `eden-rework-2021`, `path-of-ragnarok`,
  `adventurer-guide`, `adventurers-chronicle`, `companion-party-overhaul`,
  `solo-community-goals`.

## Otros cambios menores

- `docs/MODDING.md` y `docs/AGENT_TESTING.md` recibieron ajustes; vale la pena
  releer la parte de pruebas con `scripts/rotest` antes de la próxima ronda de
  pruebas de `expedition-board`.
- Hay pestaña de favoritos en la lista de mods (capturas en `docs/assets/`).
- Pins nuevos de rAthena (Druid/Karnos/Alitea, ítems regionales, opciones
  aleatorias 255 y 256) y RemoteClient v1.0.6: confirma que `renewal-world` y
  los mapas de `world-atlas` sigan resolviendo bien tras el cambio.
