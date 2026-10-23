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
- [ ] Probar en el juego, en este orden: `world-atlas` → `survival` → `clima`
      → `temperature` → `wounds` → `travel-journal` → `expedition-board`.
      Anotar el resultado en el README de cada uno. **Hecho el 2026-10-17**
      en una sesión larga, salvo lo que cada README marca «Sin probar». Lo
      más importante pendiente: los **iconos de `temperature` 0.2.1**
      (frío en `xmas_fild01` sin ropa, que siga al pasar a Congelado y se
      apague al volver a la ciudad).
- [x] Aplicar [`CONVENTIONS.md`](./CONVENTIONS.md): rangos de IDs,
      prefijos y eventos públicos registrados (revisado el 2026-10-17: se cumplen; completadas las tablas).
- [x] Definir el modpack de pruebas y sus Settings ([`MODPACK.md`](./MODPACK.md)):
      el de hoy, a propósito (D23). La partida final se decide al cerrar H1.
- [x] Aplicar las reglas de rendimiento de [`CONVENTIONS.md`](./CONVENTIONS.md)
      a los mods existentes: los relojes ya cumplen D22 (`survival`,
      `temperature`, `wounds`, `travel-journal`) y `OnNPCKillEvent` de
      `expedition-board` sale en su primera línea (0.6.1).
- [x] Revisar las piezas con carpeta `pre-renewal/` o datos de una sola era a
      la luz de D1: el balance se hace solo para Renewal. Hecho el 2026-10-17: la única
      carpeta de una sola era, `clima/pre-renewal/`, ya borrada; `clima` declara `"era": "renewal"`.

**Terminado cuando:** el log del map-server sale limpio tras una sesión de una
hora con todos los mods del modpack, y cada README dice qué se probó.

**Próxima sesión larga:** el guion completo, paso a paso y con tabla de
resultados, está en [`SESION-DE-PRUEBA.md`](./SESION-DE-PRUEBA.md). Cubre
`world-atlas` 0.2.0 (región de Prontera e Izlude, interiores seguros) y el
rebalanceo de presión (`survival` 1.2.0, `temperature` 0.3.0, `wounds`
0.4.0, `clima` 0.3.0), el pronóstico del clima (`clima` 0.4.0) y los cofres
generados desde el atlas (`dungeon-chest` 0.3.0) y, en su Parte 3, `adventure` 0.1 con
el relato de herida de `wounds` 0.4.1. Si sobra tiempo, lo pendiente de antes: los iconos de
`temperature` (ver arriba).

### H1. Porción vertical: Prontera e Izlude, Tier 1 y 2

**Por qué ahí:** ya tiene el tablero probado, el Sastre, el vendedor de
cantimploras y los campos con clima. Es la región más avanzada.

Contenido:

- [x] Atlas completo de la región (`world-atlas` 0.2.0, 2026-10-17): 14
      campos, 12 mazmorras de Tier 1–2, 6 retos de Tier 4–6 y 15 interiores
      seguros. Lista y exclusiones en
      [su README](./world-atlas/README.md#región-de-prontera-e-izlude). Falta
      probarlo en el juego.
- [x] Rebalanceo de presión ([`BALANCE.md`](./BALANCE.md)): tope `@pr_*`,
      escalones por eje en `survival`, Bien alimentado e Hidratado. Hecho
      el 2026-10-17 (`survival` 1.2.0, `temperature` 0.3.0, `wounds` 0.4.0,
      `clima` 0.3.0); falta probarlo con el guion de
      [`survival`](./survival/README.md#probarlo-en-una-sesión-larga).
- [x] Pronóstico del clima, aunque sea un NPC simple en Prontera. Hecho el
      2026-10-17 (`clima` 0.4.0): el Pronosticador junto al tablero y las
      funciones `F_Clima_*`. Falta probarlo en el juego.
- [x] `adventure` 0.1, con el diario integrado y su Cronista (D25–D27).
      Escrito el 2026-10-17; **falta probarlo en el juego** con
      [«Probarlo»](./adventure/README.md#probarlo).
- [ ] Servicios en interiores reales: Posadero y Sacerdote de `wounds`.
      **Se quedan junto al tablero mientras duren las pruebas** (D23): así
      se llega a ellos rápido. Se mueven al cerrar la porción vertical.
- [x] `dungeon-chest` generado desde el atlas. Hecho el 2026-10-17
      (`dungeon-chest` 0.3.0, `registry/tools/dungeon-chest/build_chests.cjs`):
      183 cofres, los 179 de antes iguales y 4 retos nuevos. Falta probar
      los nuevos en el juego.

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
| `clima` | [README](./clima/README.md#estado) | H0; probar el pronóstico |
| `temperature` | [README](./temperature/README.md#estado) | H0 |
| `wounds` | [README](./wounds/README.md#estado) | H0; interiores en H1 |
| `travel-journal` | [README](./travel-journal/README.md#estado) | sustituido por `adventure`; se retira cuando este funcione en el juego |
| `adventure` | [README](./adventure/README.md#estado) | probar la 0.1; 0.2 en H2 |
| `expedition-board` | [README](./expedition-board/README.md#estado) | H0 |
| `dungeon-chest` | [README](./dungeon-chest/README.md#estado) | probar los 4 cofres nuevos; botín por bioma en H2 |
| `affix-forge`, `arpg-equipments` | referencia externa, no se activan | extraer datos para botín |
| `nemesis`, `campfire`, `refuges`, `tavern-rumors`, `remnants` | diseño, sin código | H2 |

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
- **`clima`: los estados tienen huecos** (visto el 2026-10-17 con el veneno).
  Duran 12 s, se revisan cada 10 s y solo se reponen al acabarse: activos unos
  12 s de cada 20. Decidirlo con el balance ([`BALANCE.md`](./BALANCE.md));
  detalle en la sección «Estado» de [`clima/README.md`](./clima/README.md).
- **Iconos prestados.** `temperature` usa `EFST_COLD` (el cliente lo llama
  «Crystallization») y `EFST_OVERHEAT` (el sobrecalentamiento del Mado Gear del
  Mechanic): el nombre y la descripción que enseña el cliente no son los
  nuestros. Elegir otros iconos o textos propios.
- Pasar los valores de prueba de cada mod a `settings` en `mod.json`.
- Verificar los puntos marcados *(verificar)* en `PLAN.md` contra el rAthena
  fijado.
- Probar `companion-party-overhaul` con estos mods.
