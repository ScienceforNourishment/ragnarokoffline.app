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
| D28 | 2026-10-23 | **La fogata de `campfire` es un NPC en el mapa**: la leña o el kit colocan una fogata visible en tu celda durante unos minutos (`duplicate`), y se le habla para descansar, cocinar o vendar. Cualquiera puede usarla, también el compañero. | Compartir el fuego en grupo sin código de grupo, y que la fogata se vea en el mundo. |
| D29 | 2026-10-23 | **La venda alivia, no cura**: junto a una fogata, deja a la mitad el castigo de una herida (no de una maldición) hasta curarla en la posada o el templo. | La posada y el templo siguen siendo necesarios (D15); la venda es preparación, no un atajo. |
| D30 | 2026-10-23 | **Se cocina con drops estándar de monstruos**, con las recetas en un CSV de `registry/tools/campfire/` que genera el script. Cada plato da un estado de comida de rAthena (`SC_STRFOOD`…) y sacia más que el ingrediente crudo. | Da uso al botín de la región y cumple la regla de datos en CSV de [`CONVENTIONS.md`](./CONVENTIONS.md#datos-y-scripts-de-build). |
| D32 | 2026-10-23 | **Un refugio restaurado lo queda para el mundo**, no para el personaje: el estado de `refuges` es global (mod store) y lo ven todos los personajes, también el compañero. El relato `refuge:<id>` sí es por personaje, con la regla de grupo. | Es la «Consecuencia que queda en el mundo», encaja con 1 o 2 jugadores (D4) y evita mostrar ruinas o refugio por personaje con `cloakonnpc`, que se pierde al cambiar de mapa. |
| D33 | 2026-10-23 | **Los refugios se restauran en tres etapas con drops de la región y zeny**, con los costes en un CSV de `registry/tools/refuges/`. Más adelante usarán también **materiales propios** (51300–51399), que saldrán de oficios como la minería y la peletería. | Da uso al botín de la región y es un sumidero de zeny; los oficios todavía no existen (PLAN, «Recursos y economía»). |
| D34 | 2026-10-23 | **Lo que da cada etapa:** 1, la fogata (descansar con Descansado y contar los relatos, D10); 2, un intendente con provisiones; 3, la **caravana** a la ciudad ancla y de vuelta, de pago. | El atajo es el premio de la restauración completa, no de la primera. |
| D35 | 2026-10-23 | **Los cofres de `dungeon-chest` dan equipo con afijos.** Las piezas son las listas de `arpg-equipments`, reordenadas por nuestros Tiers; los afijos, la lista y el sorteo de `affix-forge` (1–4 por rareza), escalados por el Tier del mapa y con un afijo según el bioma. Cada apertura da equipo con probabilidad alta (80 % de prueba) o, si no, la comida del Tier. La pieza llega **sin identificar** y tiende a ser de la clase de quien abre, sin excluir las demás. Los dos mods de referencia no se activan: sus datos pasan a CSV propios. | Recompensas reales para H2 con datos ya hechos y libres (MIT). Sin identificar, el botín se lleva de vuelta y se descubre (D24, D27); el sesgo de clase hace útil el botín con 1 o 2 jugadores sin quitar el comercio. |
| D36 | 2026-10-23 | **Los disfraces son botín raro**: un 5 % de las aperturas de cofre da uno de los 51 disfraces de `arpg-equipments`, sin afijos. La lista queda **disponible para otras actividades** (contratos, refugios, oficios), para que cada una tenga algo propio. | Más variedad sin tocar el balance: un disfraz solo cambia el aspecto. Que no salgan solo de los cofres da razones para hacer cosas distintas. |
| D37 | 2026-10-23 | **El Herrero de Afijos de `affix-forge` vive en `dungeon-chest`**, en Prontera: pasar todos los afijos o uno, quitar uno o volver a sortearlos, por zeny. Solo trabaja piezas identificadas. | Un sumidero de zeny (economía abierta, D24) que da un uso a las piezas repetidas, junto a los datos de los afijos que usa. |
| D38 | 2026-10-24 | **Los cofres dan objetos de `clima` y `temperature` según el bioma**: un 10 % de las aperturas (`biome_item_pct` de `loot_tiers.csv`; se sortea tras el disfraz, así que en la práctica ~9,5 %) da una protección contra el clima del bioma o ropa para su frío o su calor, sin identificar. La lista por bioma está en `loot_biomes.csv`. Sin esos mods cargados, sus objetos no salen. | Cierra «objetos de `clima` y `temperature` como botín» de H2: la preparación también se encuentra, no solo se compra. |
| D39 | 2026-10-24 | **Los relatos Mayores e Hitos dan logros** (Alt+K) en `adventure`, que se completan **al contarlos**, como su EXP. Uno por Tier para el primer paso y el primer cofre; uno para el primer MVP, el primer némesis, un némesis de rango 3 y el primer refugio. La recompensa, por ahora, es un **disfraz** por correo, de la lista de `costumes.csv` (los mismos que pueden salir de un cofre, D36). Solo Renewal. | Que lo difícil deje una marca visible además de la EXP, sin tocar el balance. |
| D40 | 2026-10-24 | **Trofeos de caza por raza, con cuatro usos y de un solo destino.** Las marcas de `expedition-board` dan un trofeo de su raza (51600 + raza; dos las de élite), y el némesis vencido un **talismán** firmado (51200 + raza) cuyos afijos salen de su historia: daño contra su raza por rango (12/14/16 %) y el atributo de la herida que te dejó. Un trofeo se **lleva puesto** (accesorio; +10 % de daño contra su raza el de marca), se entrega como **prueba** al Intendente para una **marca de élite** de esa raza, un Tier más arriba (solo los de marca), se **engarza** con el Herrero de Afijos (+5 % o +8 % de ATK, MATK o resistencia contra su raza; se gasta) o se **cuelga** con el **Coleccionista** de Payon (+1 % o +2 % de defensa permanente contra su raza, tope 10 % por raza; se gasta). Llevarlo da daño y colgarlo da defensa, para que no se acumulen en el mismo eje. Un contrato da trofeos una vez cada 12 horas por personaje. | Que la caza deje algo con peso y obligue a elegir, sin grindear (The Witcher 3, Dark Souls, Shadow of Mordor). El Coleccionista está en Payon para dar otra razón de viajar; durante las pruebas hay copia en Prontera (D23). |

| D41 | 2026-10-26 | **Provisional: se reemplaza por D42 al existir la primera cadena.** El autor lo da por bueno para una etapa inicial, pero comprar botín le quita sentido a ir a una mazmorra. **El rumor de un alijo** (`tavern-rumors` 0.2.0) es la primera cadena «Rumor → Pista → Hallazgo». El Tabernero lo vende por unas rondas; la pista es una **zona** (el campo y un punto, con el alijo a 8 celdas o menos), no la celda exacta. El alijo da el **botín de un cofre** de `dungeon-chest` (equipo sin identificar con afijos del Tier del mapa, D35) y un relato. **Un rumor por personaje, sin caducidad**: comprar otro descarta el anterior. | Cierra el «principio (rumor)» de H2 con piezas que ya existen. Buscar en una zona hace que la pista importe sin volverse una caza a ciegas; sin caducidad no hacen falta relojes ni castiga a quien juega poco. |
| D42 | 2026-10-26 | **Un rumor lleva a una mazmorra y no da botín.** Es una cadena: rumor → rastro dentro de una mazmorra → análisis en otra ciudad → expedición final (guardián o sala) → **consecuencia que queda en el mundo** (pasadizo, refugio, servicio, lugar). El botín sigue siendo de los cofres. Diseño en [`RUMORES.md`](./RUMORES.md). | Que el rumor incite a ir a la mazmorra en vez de ahorrársela, y cierre la cadena «Rumor → Pista → Hallazgo → Consecuencia» de `PLAN.md`. |
| D43 | 2026-10-26 | **Los rumores nacen de lo vivido:** contar un relato concreto desencadena un rumor concreto (contar que aguantaste el calor → un oasis oculto en una zona caliente). **Como opción**, también los dispara un trofeo, lo que puede separar los trofeos de marca (al tablero) de los talismanes de némesis (a la taberna); por diseñar. Los rumores que dependen del clima **esperan al clima eventual**, que hay que resolver antes. | Conecta los rumores con los relatos (D9, D25) y da un destino propio al talismán de némesis (D40). |
| D44 | 2026-10-26 | **Cómo se montan los rumores de D42–D43:** los da un **NPC propio en la taberna** (un viajero veterano), no el Tabernero; si cuentas en otro sitio, el rumor te espera allí. El **talismán de némesis se entrega** (se gasta, D40). Las cadenas viven **en `tavern-rumors`**. El **clima eventual va por la vía C** (fork de roBrowser más plugin, [`ARCHITECTURE.md`](./ARCHITECTURE.md#clima-eventual)). | El menú del Tabernero no crece; el talismán sigue siendo de un solo destino; reutiliza el código del alijo; la vía C era la recomendada. |

## Forma de trabajar

| # | Fecha | Decisión | Porqué |
|---|---|---|---|
| D19 | 2026-10-17 | **Porción vertical antes que expansión**: una región, una banda de nivel, todos los sistemas, jugable de principio a fin. | Hay mucho escrito y poco probado. [`ROADMAP.md`](./ROADMAP.md). |
| D20 | 2026-10-17 | **El tutorial se diseña cuando la experiencia esté completa**, no antes. | Enseñar sistemas que todavía cambian es trabajo perdido. |
| D21 | 2026-10-17 | Documentación en cuatro piezas: decisiones (esta página), hoja de ruta, catálogo de diseño y convenciones. | El PLAN mezclaba todo y era difícil de seguir. |
| D22 | 2026-10-17 | **Lo periódico va en un reloj del NPC por mod** (`initnpctimer` + `OnTimerN`), que recorre los jugadores conectados con `attachrid`; nada de cadenas de `addtimer` por personaje. Hecho en `survival`, `temperature`, `wounds` y `travel-journal`. | Las cadenas pasan por la cola de eventos del personaje (2 huecos): un diálogo la llena, la cadena descartada muere y con ella hambre, sed, heridas, temperatura y diario. `attachrid` no pasa por esa cola. Reemplaza las reglas 2 y 3 de «Temporizadores» de [`CONVENTIONS.md`](./CONVENTIONS.md#temporizadores). |
| D23 | 2026-10-17 | **Mientras duren las pruebas, el entorno se queda como está**: `common-npcs` encendido, `free_kafra_warp` activado (el valor de la app) y el Posadero y el Sacerdote de `wounds` junto al tablero. Lo que no coincide con la visión se apaga o se mueve más adelante, al cerrar la porción vertical. La población (Population Engine) no se enciende hasta que los mods propios funcionen y estén completos. | Moverse rápido y curarse rápido hace más cortas las sesiones de prueba. [`MODPACK.md`](./MODPACK.md) sigue describiendo la partida final. |
| D24 | 2026-10-17 | **Ajustes de la partida final:** `free_kafra_warp` desactivado, `mob_count_rate` a 1x (por ahora), `zeny_from_mobs` desactivado y `unlimited_arrows` desactivado. Los mods «contrarios a la visión» no se activan; se revisarán por si algún NPC se puede rescatar. `ingame-database` no entra en la partida; se puede encender durante las pruebas cuando haga falta. | El zeny directo de los monstruos se abusa fácil y le quita sentido al botín que hay que cargar y llevar de vuelta a la ciudad. Viajar gratis y las flechas infinitas restan peso a la preparación. [`MODPACK.md`](./MODPACK.md). |
| D31 | 2026-10-23 | **No se fusionan mods por ahora.** El único grupo candidato es `survival` + `temperature` + `wounds` (tres relojes de 4 s, tres copias de `S_CapScale` y de la lista de jugadores). Se revisa al hacer el panel de estado del viajero, tras cerrar H1. Hasta entonces, los mods nuevos hablan con ellos por variables y funciones públicas, como `campfire`. | Los tres se probaron en el juego el 2026-10-23 y fusionarlos invalida esas pruebas (D19). Con 1 o 2 jugadores el rendimiento no lo pide, y sus variables guardadas (`hm_*`, `thirst_*`, `wd_*`) son de personaje, así que sobrevivirán a una fusión posterior. |

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
- **Rumores** ([`RUMORES.md`](./RUMORES.md#preguntas-abiertas)): el grupo
  y qué pasa con el alijo.
- ~~**Clima eventual**~~: decidida la vía C (D44). Antes: vía A (arreglo en el fork de roBrowser), B (solo
  plugin) o C (las dos; recomendada)
  ([`ARCHITECTURE.md`](./ARCHITECTURE.md#clima-eventual)).
- **Día y noche:** dónde vive (`clima` ampliado o un mod nuevo), la duración
  del ciclo y qué hacer con el «Warm sunlight» de `graphics-plus`
  ([`ARCHITECTURE.md`](./ARCHITECTURE.md#día-y-noche)).
