# Registro de decisiones

Lo que ya está decidido, con fecha y el porqué. Es la fuente de verdad: si
otro documento dice algo distinto, manda esta página. Una decisión no se borra;
si cambia, se marca como **reemplazada** y se añade la nueva.

Documentos relacionados: [`ROADMAP.md`](./ROADMAP.md) (qué se hace y en qué
orden), [`PLAN.md`](./PLAN.md) (catálogo de diseño),
[`ADVENTURE.md`](./ADVENTURE.md), [`BALANCE.md`](./BALANCE.md),
[`CONVENTIONS.md`](./CONVENTIONS.md) y [`MODPACK.md`](./MODPACK.md).

## Visión y alcance

| # | Fecha | Decisión | Porqué |
|---|---|---|---|
| D1 | 2026-10-17 | **La partida es Renewal.** Pre-Renewal queda como compatibilidad cuando sale barata (carpetas `pre-renewal/` que ya existan), no como objetivo de diseño ni de balance. | Más mapas, más monstruos y más niveles: más futuro para el juego y los mods. Los cambios de atributos y las skills de 3.ª y 4.ª clase no convencen, pero pesa más el contenido. |
| D2 | 2026-10-17 | **Entran todas las ciudades**, también las difíciles de alcanzar, como las islas (Amatsu y otras). Se añaden **por regiones, de forma progresiva**. | El mundo entero es el contenido. |
| D3 | 2026-10-17 | **El nivel máximo es casi el final del camino.** Todo el contenido se vive durante la subida de nivel; no es un juego donde la partida de verdad empieza en el nivel máximo. Exige rebalancear zonas, monstruos y MVPs. | Visión del proyecto. |
| D4 | 2026-10-17 | Para jugar **1 o 2 personas**, con historia emergente: la historia sale de lo que pasa, no de muros de texto. | Visión del proyecto. |
| D5 | 2026-10-17 | **Hilo de la partida: Reconstrucción (B) con Misterio (A) de fondo.** El jugador recupera rutas, refugios y servicios; por debajo corre por qué el clima y la niebla se volvieron anormales. | El lore concreto llegará en un documento propio (`LORE.md`). |
| D6 | 2026-10-17 | `adventurers-chronicle` (registro) **no se usa**: es solo Pre-Renewal (D1). El misterio de fondo es lore propio. | Consecuencia de D1. |

## Progresión y rates

| # | Fecha | Decisión | Porqué |
|---|---|---|---|
| D7 | 2026-10-17 | ~~Rates de EXP de monstruos a 0,25x y quest a 1x.~~ **Reemplazada por D8.** | — |
| D8 | 2026-10-17 | **Rates de EXP y drop a 1x** (`base_exp_rate`, `job_exp_rate`, `quest_exp_rate` e `item_rate_*`), al menos por ahora. | 1x ya era lento en iRO: deja margen para que las experiencias sumen sin que el nivel se dispare. Se revisa con datos de la porción vertical. |
| D9 | 2026-10-17 | **Las experiencias son la columna vertebral** (`adventure`): lo vivido por primera vez da EXP como porcentaje del nivel, y algunas enseñan skills. | Premiar avanzar sobre repetir. [`ADVENTURE.md`](./ADVENTURE.md). |
| D10 | 2026-10-17 | **Los relatos se cuentan al descansar**: en la posada o la taberna de una ciudad, o junto a la fogata de un refugio restaurado (`refuges`). Una fogata en el campo no sirve. | Da a las ciudades y a los refugios una razón concreta. |
| D11 | 2026-10-17 | **La expedición termina al descansar y contar**, no al pisar la ciudad. Pasar por la ciudad sin descansar sigue siendo la misma expedición. | Pisar la ciudad va de la mano, pero no basta. |
| D12 | 2026-10-17 | **`adventure` absorbe a `travel-journal`.** Se conserva `TravelJournal::OnLog`. | Una sola lista de mapas visitados, una sola ventana y un temporizador menos. [`ADVENTURE.md`](./ADVENTURE.md#el-diario-dentro-de-adventure). |
| D25 | 2026-10-17 | **En el juego se llaman «relatos»**: lo vivido fuera queda como relato sin contar hasta contarlo. | Encaja con «contar los relatos» al descansar y es el término de todos los documentos. |
| D26 | 2026-10-17 | **En `adventure` 0.1 solo cuenta el Cronista**, un NPC propio junto al tablero de las 7 ciudades (D23), y **contar es gratis**. El Posadero de `wounds` no llama a `Adventure::OnRest`. | Un solo sitio claro para cerrar la expedición mientras se prueba; lo que cuesta es volver, no contar. La taberna y los refugios llamarán a `OnRest` cuando existan. |
| D27 | 2026-10-17 | **Al ganar un relato solo se anuncia su nombre**; cuánto vale se ve en la pestaña Relatos del diario. | Que contar tenga algo de sorpresa, sin esconder el dato a quien lo busque. |

## Sistemas

| # | Fecha | Decisión | Porqué |
|---|---|---|---|
| D13 | antes de 2026-10 | **`world-atlas` es un mod aparte**: solo datos y funciones de consulta. | Una fuente de datos por mapa para todos los mods. |
| D14 | antes de 2026-10 | **`bounty-hunt` se fusiona en `expedition-board`**: marcas y cacerías en el mismo tablero. `bounty-hunt` queda como referencia. | Evitar dos tableros. |
| D15 | antes de 2026-10 | **Las heridas debilitan, no impiden jugar.** Se curan en la posada (zeny) o el templo (donación); nunca bloquean movimiento, combate ni ciudades. | Una decisión, no un castigo que saca del juego. |
| D16 | antes de 2026-10 | **Las necesidades se pausan en ciudad.** La presión existe al salir. | Hecho en `survival`. |
| D17 | antes de 2026-10 | **Némesis ligero**: el monstruo que te mató vuelve con nombre y más fuerte, y deja un trofeo. | Historia emergente. Desbloqueado: `killerrid` existe. |
| D18 | 2026-10-17 | **La presión tiene ejes, escalones, tope y recompensa espejo**, y crece con el Tier del mapa. Sin controlador único: cada mod con su `bonus_script` y un tope común con `@pr_*`. | Que los sistemas importen sin ser un impuesto. [`BALANCE.md`](./BALANCE.md). |

## Forma de trabajar

| # | Fecha | Decisión | Porqué |
|---|---|---|---|
| D19 | 2026-10-17 | **Porción vertical antes que expansión**: una región, una banda de nivel, todos los sistemas, jugable de principio a fin. | Hay mucho escrito y poco probado. [`ROADMAP.md`](./ROADMAP.md). |
| D20 | 2026-10-17 | **El tutorial se diseña cuando la experiencia esté completa**, no antes. | Enseñar sistemas que todavía cambian es trabajo perdido. |
| D21 | 2026-10-17 | Documentación en cuatro piezas: decisiones (esta página), hoja de ruta, catálogo de diseño y convenciones. | El PLAN mezclaba todo y era difícil de seguir. |
| D22 | 2026-10-17 | **Lo periódico va en un reloj del NPC por mod** (`initnpctimer` + `OnTimerN`), que recorre los jugadores conectados con `attachrid`; nada de cadenas de `addtimer` por personaje. Hecho en `survival`, `temperature`, `wounds` y `travel-journal`. | Las cadenas pasan por la cola de eventos del personaje (2 huecos): un diálogo la llena, la cadena descartada muere y con ella hambre, sed, heridas, temperatura y diario. `attachrid` no pasa por esa cola. Reemplaza las reglas 2 y 3 de «Temporizadores» de [`CONVENTIONS.md`](./CONVENTIONS.md#temporizadores). |
| D23 | 2026-10-17 | **Mientras duren las pruebas, el entorno se queda como está**: `common-npcs` encendido, `free_kafra_warp` activado (el valor de la app) y el Posadero y el Sacerdote de `wounds` junto al tablero. Lo que no coincide con la visión se apaga o se mueve más adelante, al cerrar la porción vertical. La población (Population Engine) no se enciende hasta que los mods propios funcionen y estén completos. | Moverse rápido y curarse rápido hace más cortas las sesiones de prueba. [`MODPACK.md`](./MODPACK.md) sigue describiendo la partida final. |
| D24 | 2026-10-17 | **Ajustes de la partida final:** `free_kafra_warp` desactivado, `mob_count_rate` a 1x (por ahora), `zeny_from_mobs` desactivado y `unlimited_arrows` desactivado. Los mods «contrarios a la visión» no se activan; se revisarán por si algún NPC se puede rescatar. `ingame-database` no entra en la partida; se puede encender durante las pruebas cuando haga falta. | El zeny directo de los monstruos se abusa fácil y le quita sentido al botín que hay que cargar y llevar de vuelta a la ciudad. Viajar gratis y las flechas infinitas restan peso a la preparación. [`MODPACK.md`](./MODPACK.md). |

## Abiertas

Sin decidir; cada una enlaza a donde se discute.

- **Qué cuesta morir** en `adventure`. Postura de partida: no quitar la
  recompensa ganada, sí penalizar el descuido
  ([`ADVENTURE.md`](./ADVENTURE.md#morir-y-las-cicatrices)).
- **Economía**: fuentes y sumideros de zeny. Sin respuesta todavía.
- **Curva de progresión**: bandas de nivel por región, y si hace falta un Tier
  7 para el nivel 175 en adelante (Renewal llega a 200, y a 275 en algunas
  clases). Pendiente de datos ([`ROADMAP.md`](./ROADMAP.md#frentes-abiertos)).
- **Composición del modpack** ([`MODPACK.md`](./MODPACK.md)).
- **Qué skills** enseñan los saberes
  ([`ADVENTURE.md`](./ADVENTURE.md#decisiones-abiertas)). El nombre ya está
  decidido: relatos (D25).
- **Renacimiento (rebirth)** y clases expandidas: si entran en el alcance.
- **Clima eventual:** vía A (arreglo en el fork de roBrowser), B (solo
  plugin) o C (las dos; recomendada)
  ([`ARCHITECTURE.md`](./ARCHITECTURE.md#clima-eventual)).
- **Día y noche:** dónde vive (`clima` ampliado o un mod nuevo), la duración
  del ciclo y qué hacer con el «Warm sunlight» de `graphics-plus`
  ([`ARCHITECTURE.md`](./ARCHITECTURE.md#día-y-noche)).
