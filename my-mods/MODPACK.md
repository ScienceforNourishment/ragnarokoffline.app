# Modpack: qué es «la partida»

Un **modpack** es la lista exacta de mods activos, con sus versiones y opciones,
más los Settings de la app (era, rates, cliente) que juntos forman el juego que
diseñamos. La app no tiene modpacks ni perfiles de mods: es este documento, y
se aplica a mano en Settings → Mods y Settings → General.

## Para qué sirve

- **Probar siempre lo mismo.** Un error o un dato de balance solo vale si se
  sabe con qué mods y rates salió. Hoy hay mods del registro activos
  (`common-npcs`, `mobile-ui`, `wasd-movement`…) que nadie anotó, y uno de
  ellos podría ser la causa del error de la cola de eventos.
- **Evitar choques.** Dos mods que redefinen el mismo objeto, ponen NPC en las
  mismas celdas o usan los mismos IDs se notan aquí antes que en el juego.
- **Proteger la visión.** Algunos mods del registro deshacen lo que
  construimos: un warper gratis en cada ciudad mata la preparación de los
  viajes, la caza automática mata las expediciones, una tienda de cash regala
  lo que debería ganarse.
- **Compartir la partida.** Para jugar de a dos, o para que otra persona la
  pruebe, basta con esta página.

## Settings de la app

| Ajuste | Valor | Estado |
|---|---|---|
| Era | Renewal | decidido (D1) |
| Versión de cliente (`packetver`) | la predeterminada (20221005) | sin motivo para cambiarla |
| `base_exp_rate`, `job_exp_rate`, `quest_exp_rate` | 1x | decidido (D8) |
| `item_rate_common`, `item_rate_equip`, `item_rate_card` | 1x | decidido (D8) |
| `mob_count_rate` | 1x | propuesta |
| `zeny_from_mobs` | desactivado | propuesta: es el valor por defecto; la economía está abierta |
| `free_kafra_warp` | **desactivado** | propuesta, por decidir: la app lo trae activado, y viajar gratis resta peso a la preparación y a los atajos que se ganan |
| `unlimited_arrows` | desactivado | propuesta: las flechas son un recurso que se prepara |
| `max_aspd`, `max_parameter`, `view_distance` | los de rAthena | sin motivo para cambiarlos |

## Mods

### Núcleo (los nuestros)

Todos los de `my-mods/` salvo los de referencia. El estado de cada uno, en la
sección «Estado» de su README.

`world-atlas`, `survival`, `clima`, `temperature`, `wounds`,
`travel-journal` (hasta la fusión con `adventure`), `expedition-board`,
`dungeon-chest`. **No se activan:** `affix-forge` y `arpg-equipments`
(referencia), `world-atlas-test` (solo pruebas).

### Del proyecto y del registro: clasificación propuesta

Sin decidir. Criterio: ¿refuerza la preparación, el viaje y la historia, o los
salta?

**Compatibles** (comodidad que no cambia el juego):

| Mod | Nota |
|---|---|
| `autologin`, `ui-scale`, `wasd-movement`, `mobile-ui`, `graphics-plus`, `quick-move` | interfaz y control |
| `player-commands` | `@autoloot`, `@showexp`; comandos de información |
| `navigation-server-monsters`, `-npcs`, `-warps`, `navigation-english-tables` | ayudan a planificar la ruta. Revisar si chocan con la cartografía futura |
| `autoloot`, `whosell` | comodidad |

**A evaluar** (pueden encajar; probarlos con el núcleo):

| Mod | Por qué |
|---|---|
| `companion-party-overhaul` | compañeros para jugar solo, estilo Dragon's Dogma; comprobar la regla de grupo |
| `waypoint-system` | «viajes que se ganan»: encaja si `free_kafra_warp` se desactiva |
| `solo-community-goals` | objetivos de servidor a escala de 1 o 2 personas |
| `prontera-vendors` | un mercado vivo; afecta a la economía |
| `eden-rework-2021`, `city-unity` | contenido Renewal de quests y equipo; ver si se solapan con contratos y la progresión |
| `ingame-database` | choca con la idea del bestiario que se desbloquea; quizá solo para pruebas |
| `friendlier-refine`, `card-remover`, `steal-cards`, `refine-matk`, `blaze-shield`, `no-seed-cost` | ajustes de reglas; uno por uno |
| `royal-nightmare` | reto para nivel 230 o más; choca con D3 si es contenido solo de nivel máximo |
| `map-spawn-rate` | útil para el rebalanceo por región |

**Contrarios a la visión** (propuesta: no activar):

| Mod | Por qué |
|---|---|
| `common-npcs`, `standart-npc` | warper, curandero y buffer en cada ciudad: anulan los viajes y la identidad de ciudad |
| `auto-hunt` | caza automática |
| `exp-card`, `mega-booster`, `cash-shop-extended`, `random-headgear-box` | EXP y objetos regalados o por grindeo |
| `exprate-penalty-remover`, `droprate-penalty-remover` | quitan la penalización de Renewal por diferencia de nivel, que empuja a ir a zonas acordes, como el factor de Tier de `adventure` |
| `path-of-ragnarok` | balanceado para Pre-Renewal |
| `adventurers-chronicle`, `renewal-world` | solo Pre-Renewal (D1, D6) |
| `bounty-hunt` | fusionado en `expedition-board` (D14) |

## Cómo se mantiene

- Al activar o probar un mod nuevo, se anota aquí con su versión.
- Antes de una sesión de pruebas de balance, se comprueba que lo activo
  coincide con esta página.
- Cuando una propuesta se decide, pasa a [`DECISIONS.md`](./DECISIONS.md).

## Pendiente

- Anotar qué mods del registro están activos **hoy** en la instalación de
  pruebas (empezando por `common-npcs`, `mobile-ui` y `wasd-movement`, citados
  en el error de la cola de eventos).
- Decidir `free_kafra_warp` y la clasificación de los mods «a evaluar».
- Revisar los rangos de IDs de los mods del registro que se activen contra
  [`CONVENTIONS.md`](./CONVENTIONS.md#rangos-de-ids-de-objetos).
