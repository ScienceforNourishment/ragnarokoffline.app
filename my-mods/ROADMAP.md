# Hoja de ruta

Qué se hace, en qué orden y cómo se sabe que está terminado. Lo decidido está
en [`DECISIONS.md`](./DECISIONS.md); el diseño de cada sistema, en
[`PLAN.md`](./PLAN.md). Revisada el 2026-10-17.

## La visión en una página

Ragnarok Online **Renewal** para una o dos personas, donde subir de nivel es
vivir una aventura y no repetir una rutina:

- **Avanzar paga más que repetir.** Lo vivido por primera vez da EXP
  ([`ADVENTURE.md`](./ADVENTURE.md)); los monstruos siguen a 1x.
- **Salir exige prepararse.** Hambre, sed, temperatura, clima y heridas
  presionan más cuanto más alto es el Tier, y premian al que va preparado
  ([`BALANCE.md`](./BALANCE.md)).
- **Volver tiene sentido.** Se descansa y se cuentan los relatos en la posada,
  la taberna o un refugio restaurado; las ciudades tienen identidad propia.
- **El mundo entero, durante la subida.** Todas las ciudades y regiones,
  islas incluidas, con todo el contenido vivido antes del nivel máximo.
- **La historia sale del juego**: diario, cicatrices, némesis, restos y
  rumores, con un misterio de fondo.

## Cómo se avanza

**Porción vertical primero** (D19): una región, una banda de nivel y todos los
sistemas, jugable de principio a fin. Solo cuando funciona se expande, región
por región. Hasta ahora se avanzaba en horizontal (cada sistema a las 7
ciudades y 179 mazmorras antes de probarlo en una), y por eso hay mucho escrito
y casi nada comprobado.

## Hitos

### H0. Cimientos estables

Que lo que ya existe funcione y no se rompa.

- [x] Confirmado en el juego (2026-10-17) el arreglo de `player's event queue is full`
      (D22, detalle abajo). Diagnóstico `[qdebug]` quitado.
- [ ] Probar en el juego, con `scripts/rotest`, en este orden: `world-atlas`
      → `survival` → `clima` → `temperature` → `wounds` → `travel-journal` →
      `expedition-board`. Anotar el resultado en el README de cada uno.
- [ ] Aplicar [`CONVENTIONS.md`](./CONVENTIONS.md): rangos de IDs,
      prefijos y eventos públicos registrados.
- [ ] Definir el modpack de pruebas y sus Settings ([`MODPACK.md`](./MODPACK.md)).
- [ ] Aplicar las reglas de rendimiento de [`CONVENTIONS.md`](./CONVENTIONS.md)
      a los mods existentes: los relojes ya cumplen D22 (`survival`,
      `temperature`, `wounds`, `travel-journal`); falta `OnNPCKillEvent` con salida temprana.
- [ ] Revisar las piezas con carpeta `pre-renewal/` o datos de una sola era a
      la luz de D1: el balance se hace solo para Renewal.

**Terminado cuando:** el log del map-server sale limpio tras una sesión de una
hora con todos los mods del modpack, y cada README dice qué se probó.

### H1. Porción vertical: Prontera e Izlude, Tier 1 y 2

**Por qué ahí:** ya tiene el tablero probado, el Sastre, el vendedor de
cantimploras y los campos con clima. Es la región más avanzada.

Contenido:

- [ ] Atlas completo de la región. Ya están `prt_fild01`–`11` (Tier 1, el 11
      Tier 2), las Alcantarillas (Tier 1), el Laberinto (1–2) y la Cueva Marina
      de Izlude (1–2; el piso 5 es Tier 4 y queda como reto). Faltan los
      campos que no están (`prt_fild00` y los que haya) y los interiores
      (posada, iglesia) como `interior`.
- [ ] Rebalanceo de presión ([`BALANCE.md`](./BALANCE.md)): tope `@pr_*`,
      escalones por eje en `survival`, Bien alimentado e Hidratado.
- [ ] Pronóstico del clima, aunque sea un NPC simple en Prontera.
- [ ] `adventure` 0.1, con el diario integrado y su NPC de descanso en la
      posada.
- [ ] Servicios en interiores reales: Posadero y Sacerdote de `wounds`.
- [ ] `dungeon-chest` generado desde el atlas.

**Terminado cuando:** un personaje nuevo juega unas 3 horas en la región, hace
al menos 5 expediciones, el diario cuenta una historia que se entiende al
leerla, y los resúmenes de expedición dan los datos para comprobar la tabla de
[`BALANCE.md`](./BALANCE.md#cómo-ajustarlo). Con esos datos se decide si las
experiencias pesan lo justo frente a la EXP de monstruos a 1x.

### H2. El bucle completo en la porción

Cerrar los dos extremos del bucle: el Rumor y la Consecuencia que queda en el
mundo.

- [ ] `nemesis`.
- [ ] `campfire`: Descansando, cocinar, venda.
- [ ] `refuges`: al menos un refugio restaurable en la región.
- [ ] `tavern-rumors`: la taberna de Prontera, con pronóstico y pistas.
- [ ] `remnants`: unos pocos restos con lore, cuando exista `LORE.md`.
- [ ] Recompensas reales: trofeos de marcas y botín de cofre por bioma.
- [ ] Integraciones de `adventure` 0.2: cofres, contratos, clima,
      temperatura, racha y crédito en grupo.
- [ ] Prueba de dos jugadores: crédito en grupo en todos los mods.

**Terminado cuando:** una partida en la región tiene un principio (rumor), un
riesgo, una vuelta y algo que queda cambiado en el mundo, solo o de a dos.

### H3. Expansión por regiones

Se repite por cada región, en el orden de la curva de progresión. Lista de
cada región:

- [ ] Filas del atlas (todos los mapas, con bioma, Tier, temperatura,
      interiores).
- [ ] Identidad de la ciudad: qué ofrece y qué le falta; posada, taberna y
      templo en interiores.
- [ ] Combinaciones de clima de sus biomas y su ropa o protección.
- [ ] Contratos, cofres, refugios y restos de la región.
- [ ] Rebalanceo de sus monstruos y MVPs para su banda de nivel (D3).
- [ ] Lore de la región: qué parte del misterio se revela ahí.

**Orden tentativo** (se confirma con la curva de progresión):

| Ola | Regiones |
|---|---|
| 1 | Prontera e Izlude (H1), Payon, Geffen, Morocc, Alberta, Aldebaran |
| 2 | Juno, Einbroch, Lighthalzen, Hugel, Rachel, Veins |
| 3 | Islas y tierras lejanas: Amatsu, Gonryun, Louyang, Ayothaya, Moscovia, Lutie, Comodo, Umbala, Niflheim, Brasilis, Dewata, Malaya, Malangdo |
| 4 | El Nuevo Mundo y las tierras de Renewal: Splendide, Manuk, Mora, Eclage, El Dicastes, Rockridge y las siguientes |

### Después

**Mundo vivo:** clima eventual y ciclo de día y noche
([`ARCHITECTURE.md`](./ARCHITECTURE.md)). Puede adelantarse a H2 si se elige
la vía A del clima: es un arreglo pequeño en el fork de roBrowser.

Sin orden todavía: tutorial (D20), oficios (pesca y minería primero),
pasadizos y trampas, cartografía, encuentros en el camino, economía completa.

## Estado de los mods

Qué hace cada mod, su versión y qué se probó están **solo** en la sección
«Estado» de su README. Esta tabla dice en qué hito entra cada uno.

| Mod | Estado | Siguiente paso |
|---|---|---|
| `world-atlas` | [README](./world-atlas/README.md#estado) | H0; ampliar en H1 |
| `survival` | [README](./survival/README.md#estado) | H0; rebalanceo en H1 |
| `clima` | [README](./clima/README.md#estado) | H0; pronóstico en H1 |
| `temperature` | [README](./temperature/README.md#estado) | H0 |
| `wounds` | [README](./wounds/README.md#estado) | H0; interiores en H1 |
| `travel-journal` | [README](./travel-journal/README.md#estado) | H0; fusión con `adventure` en H1 |
| `expedition-board` | [README](./expedition-board/README.md#estado) | H0 |
| `dungeon-chest` | [README](./dungeon-chest/README.md#estado) | generar desde el atlas en H1 |
| `affix-forge`, `arpg-equipments` | referencia externa, no se activan | extraer datos para botín |
| `adventure`, `nemesis`, `campfire`, `refuges`, `tavern-rumors`, `remnants` | diseño, sin código | H1 y H2 |

## Frentes abiertos

Trabajo de planificación que no es código y que hay que hacer en paralelo:

- **Curva de progresión.** Tabla de banda de nivel × región × ciudad base ×
  biomas × qué preparar × experiencias disponibles. Hay que procesar muchos
  datos: buscar si alguien ya publicó cálculos de EXP por hora y niveles por
  zona en Renewal; si no, hacerlos juntos. Datos ya disponibles en el repo:
  `mods/navigation-server-monsters/mob-index.tsv` (spawns con niveles por
  mapa) y `registry/tools/world-atlas/tier_of.cjs`. Tiene que decidir también
  si el Tier 6 (150 o más) se parte en un Tier 7, porque Renewal llega a 200.
- **Lore** (`LORE.md`): lo escribe el autor; se transforma en contenido
  (restos, rumores, descripciones, nombres) por región.
- **Economía**: fuentes y sumideros de zeny, precios que crecen con el nivel.
  Sin respuestas todavía; los datos de H1 ayudarán.
- **Modpack** ([`MODPACK.md`](./MODPACK.md)): qué mods y Settings forman la
  partida.
- **Interfaz**: un panel de estado del viajero en vez de un widget por mod
  (necesidades, temperatura, heridas, presión, relatos).

## Riesgos

- **Alcance contra capacidad.** El mundo entero, todos los sistemas y el
  rebalanceo de monstruos son mucho trabajo. La porción vertical es la defensa:
  algo terminado y jugable en cada hito.
- **Sin pruebas repetibles,** cada mod nuevo puede romper otro sin aviso. Cada
  mod debe tener su escenario de `rotest`.
- **Renewal trae su propio balance** (penalización de EXP por diferencia de
  nivel, 3.ª y 4.ª clase): hay que medirlo, no suponerlo.

## Error abierto: `player's event queue is full`

**Arreglado el 2026-10-17 y confirmado en el juego el mismo día** (tras un diálogo largo, hambre, sed, temperatura y heridas siguen).
Afectaba a `survival`, `travel-journal`, `temperature` y `wounds`: tras el
aviso, el personaje dejaba de recibir ticks de hambre, sed, penalización,
temperatura, heridas y entradas del diario hasta volver a entrar.

- **Causa (confirmada en el código del rAthena fijado y en el log).**
  `npc_event_sub` (`src/map/npc.cpp`) mete en una cola de **2 huecos**
  (`MAX_EVENTQUEUE`) todo evento que llega mientras el personaje tiene un
  script en marcha (`sd->npc_id != 0`, que pone `script_attach_state` en cuanto
  corre cualquier script y mantiene mientras hay un diálogo abierto), y
  descarta el tercero. La cola se vacía de uno en uno, al terminar cada script.
  Cada mod reprogramaba su `addtimer` dentro del propio evento: el descartado
  mataba la cadena para toda la sesión. En el log del 2026-10-17, los ticks de
  `wounds` y `temperature` corrieron al entrar y se perdieron los siguientes
  justo mientras el jugador hablaba con el Posadero y el Sacerdote; los de
  `survival` y el diario, poco después. No hacía falta nada raro en
  `OnPCLoginEvent`: bastaba un diálogo normal.
- **Arreglo (D22).** Cada mod tiene un solo reloj del NPC (`initnpctimer` +
  `OnTimer4000`/`OnTimer5000`) que recorre a los jugadores conectados con
  `attachrid`, y `attachrid` no pasa por la cola. `travel-journal` escribe sus
  propias entradas con `callsub`. La receta está en
  [`CONVENTIONS.md`](./CONVENTIONS.md#temporizadores). Quitado el diagnóstico
  `[qdebug]`.
- **Cómo confirmarlo:** entra, habla un minuto con un NPC (el Posadero, sin
  cerrar el diálogo), ciérralo y comprueba en un campo que hambre y sed bajan,
  que `@temperatura` cambia con la ropa y que una herida sigue restando. En
  `ragnarok-stack logs map 2000` no debe salir `event queue is full` para
  `survival_mgr`, `temp_mgr`, `wounds_mgr` ni `TravelJournal::OnMapTick`.
- **Queda:** `doevent "TravelJournal::OnLog"` desde otros mods (`wounds`,
  `expedition-board`) sigue usando la cola. Con menos cadenas ya casi no hay
  competencia, pero una nota lanzada durante un diálogo largo junto con otros
  eventos todavía podría perderse.

## Otros pendientes de los mods existentes

Lo que falta probar de cada mod está en la sección «Estado» de su README;
aquí solo lo que cruza varios mods o no es de ninguno.

- **`clima`: visual fijo por mapa.** Vías para superarlo en
  [`ARCHITECTURE.md`](./ARCHITECTURE.md#clima-eventual).
- Pasar los valores de prueba de cada mod a `settings` en `mod.json`.
- Verificar los puntos marcados *(verificar)* en `PLAN.md` contra el rAthena
  fijado.
- Probar `companion-party-overhaul` con estos mods.
