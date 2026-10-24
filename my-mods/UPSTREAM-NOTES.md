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

---

# Revisión 1.6.5 → 1.7.0 (merge del 2026-10-23)

181 commits; el merge entró limpio, sin tocar nada de `my-mods/` ni de
`registry/tools/` nuestros. Lo que nos afecta, de más a menos urgente:

## Prefijo de comandos configurable (1.6.8) — revisar textos

Ajustes → Rates → *Command prefix* deja elegir `@`, `!`, `.` o `-`.
`bindatcmd` sigue funcionando con cualquiera (se enlaza por nombre, sin el
símbolo), pero **los textos que escriben `@` a mano quedan mal** si el jugador
cambia el prefijo:

- `dungeon-chest/npc/chest-command.txt` (`@cofre ...`, 4 líneas)
- `nemesis/npc/nemesis.txt:306` (`@nemesis`)
- `refuges/npc/refuges-core.txt:121` (`@refugio`, `@refugios`)

**Hecho.** `getbattleflag("atcommand_symbol")` no sirve: en rAthena el símbolo
es una variable aparte (`atcommand.cpp`), no un ajuste de batalla, y la app no
lo expone a scripts. Lo que sí funciona: dentro de un handler de `bindatcmd`,
`.@atcmd_command$` es el comando tal como se tecleó, con su símbolo, así que
`charat(.@atcmd_command$, 0)` es el prefijo. Los tres mods lo usan así;
`nemesis` lo guarda en `$@nm_sym$` para el aviso que sale tras una muerte
(`@` hasta que alguien escriba el comando). Patrón para mods nuevos: nunca
escribir `@` a mano en un texto. Ojo: `.@` no cruza un `callsub`, hay que
leerlo en el propio handler. Además, un `atcommand "@foo"` desde script deja de funcionar con otro prefijo
(hoy no usamos ninguno).

## Iconos de estado propios, 20000–22999 (1.6.9 / 1.7.0)

`temperature` reutiliza `EFST_COLD` y `EFST_OVERHEAT`; `EFST_COLD` es también
el de Cristalización y el cliente lo nombra así. Un mod ya puede tener iconos
propios (tablas en `data/luafiles514/lua files/stateicon/`, solo nuestras
filas). **Pero solo desde Lua `status()`**: comprobado en el rAthena fijado
(8aea17a), `bonus_script` descarta cualquier icono `>= EFST_MAX`, así que
desde un NPC script no se puede. Camino posible: un `status()` en Lua con
icono propio, que el script active/consulte a través del char store
(compartido entre NPC y Lua). Guía: `docs/mods/CUSTOM_SKILLS.md`, «A status
icon of your own». Aplica igual a `wounds`, `survival` (hambre/sed) y
`campfire`. Ojo: los iconos solo se dibujan para el propio personaje.

## Lua: estados, ítems y zeny

- `status("<NAME>", {...})` con `tick`, `duration`, `max_stacks`, `decay`,
  `persist = true` (sobrevive a logout/reinicio, guardado en el char store bajo
  `_statuses`; **no usar esa ruta** en nuestros stores). Encaja con heridas que
  sangran por tick o frío acumulado por stacks, sin bonus_script cada 5 s.
- `item("<AegisName>", { on_attack, on_hit_taken, on_use })`: hooks por ítem
  equipado o consumido. Útil para `survival` (comida/agua al usarse),
  `arpg-equipments` y `affix-forge` (efectos de equipo que hoy no se pueden
  expresar con `bonus`).
- `c:give_zeny(amount, who)` (1.6.9), junto a `c:give_item`.
- `stock_checks = false` en `skill()` ahora también salta las comprobaciones
  sobre el objetivo (1.7.0).
- Habilidades propias, pasivas y retrabajos sin perder puntos (1.6.7): ejemplos
  `examples/mods/custom-skills` y `third-class-sampler`.

## Para scripts de NPC

- **`F_ClientInfo`** (1.7.0): `callfunc("F_ClientInfo", "client" | "fallback"
  | "client_date" | "fallback_date")`. Sirve para ofrecer algo solo si el host
  tiene el arte (p. ej. NPCs o mapas de kRO en `world-atlas`/`refuges`).
- **`playBGM`** ya llega al cliente (1.6.7): música propia en `campfire`,
  `refuges` o una taberna de `tavern-rumors`. Ver «Playing a track from a
  script» en `docs/MODDING.md`.
- **Logros propios** (1.6.7): un mod añade filas a la tabla de logros sin
  reemplazarla. Candidato natural para `adventure` (expediciones, relatos) y
  `nemesis`. Guía `docs/mods/CUSTOM_ACHIEVEMENTS.md`, ejemplo
  `examples/mods/custom-achievement`.

## Fusiones entre mods

- Dos mods con `db/mob_skill_db.txt` ahora se **suman** en vez de pisarse
  (1.6.8). Relevante si `nemesis` da habilidades a monstruos.
- Un `quest_db` declarado por dos mods ya no duplica objetivos (1.6.9).

## Otros

- Ajustes → Rates → *Advanced*: cualquier ajuste de batalla de rAthena como
  `clave: valor`. Útil para pruebas sin tocar mods.
- Tasa de cartas MVP separada (1.6.9): tenlo en cuenta en el balance de
  `dungeon-chest` si mete cartas en los cofres.
- 105 mapas oficiales nuevos (Abyss, Biosphere, zonas seguras del capítulo 2,
  templo de Jormungandr) y 458 monstruos (1.6.6): candidatos para `world-atlas`,
  `loot_biomes.csv` y refugios. Y ya sueltan botín los 124 monstruos de mapas
  nuevos que no soltaban nada (1.6.9).
- Pins nuevos: rAthena 8aea17a, roBrowserLegacy ea3fdb6. `vendor/` no está
  descargado en este checkout; `scripts/vendor-fetch.sh` antes de probar.
