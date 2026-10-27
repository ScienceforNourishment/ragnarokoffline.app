# Contratos de expediciones

Tableros en las ciudades principales. Cada tablero publica los contratos de su
ciudad, de dos tipos:

- **Marca (expedición):** al aceptar aparece una **marca** (un monstruo con
  nombre propio) en un punto concreto de un mapa cercano. Hay que acabar con
  ella.
- **Caza:** hay que abatir **N monstruos de una especie** dentro de un mapa
  concreto. No aparece nada: cuentan los monstruos que ya viven allí.

En ambos casos hay que **volver a la ciudad que emitió el contrato** para cobrar,
pero no con el mismo NPC: las **cacerías se entregan en el tablero** y las
**marcas con el Intendente**, un NPC aparte junto a cada tablero (ver «Dónde
se entrega»).

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.8.0 (la de `mod.json`), del 2026-10-24: **trofeos de caza y marcas de élite** (D40, ver «Trofeos y marcas de élite»). Toda marca abatida da un trofeo de su raza (dos las de élite), que se lleva puesto, sirve de prueba para una marca de élite, se engarza con el Herrero de `dungeon-chest` 0.7.0 o se cuelga con el nuevo **Coleccionista** (Payon, y en Prontera para las pruebas) por defensa permanente contra su raza. Siete contratos de élite, uno por ciudad (ids 101–107). Sin probar en el juego; comprobado sin el juego: llaves y cabeceras, `--check` del build de contratos, que todos los `callfunc` tienen su función, que el sprite `4_M_JOB_HUNTER` existe en el rAthena fijado y que las celdas de las élites y del Coleccionista son transitables en su map cache.
- La 0.7.0, escrita el 2026-10-23. Las notas del diario van con `F_Adv_Note` de `adventure` 0.3 (`F_Expedition_Log`), que no se pierden en la cola; con un `adventure` anterior darían error, así que actualiza los dos juntos. El zeny y el refuerzo de las marcas pasan a **Settings** (ver «Ajustes»), con los mismos valores por defecto; pide la app 1.5.2 o posterior (`F_ModSetting`). También publica **relatos de `adventure`** 0.2 (dependencia suave). Abatir una marca da `mark:<id>` (Media) a su dueño y a su grupo en el mapa; completar una cacería da `hunt:<id>` (Menor) a quien la completa (cada compañero completa la suya). El `<id>` es el del CSV, así que cada contrato da su relato una sola vez. Tier: el del mapa del contrato. Sin probar en el juego. La 0.6.2: una cacería cuenta **todas las variantes con el mismo nombre** que el monstruo del contrato (los cinco «Goblin» 1122–1126), pero no las de nombre parecido (Goblin Archer). La comparación de nombres solo corre en el mapa de la cacería y cuando el id no coincide, así que una muerte de un bot o de alguien sin cacería cuesta lo mismo que antes. Sin probar en el juego; las cacerías aceptadas con la 0.6.1 siguen valiendo y ya cuentan las variantes. La 0.6.1: `OnNPCKillEvent` sale en su primera línea si nadie del servidor tiene una cacería (`$@eb_hunters`), antes de leer el mapa; importa con la población encendida, porque corre con cada monstruo que matan los bots. La 0.6.0 añadió el crédito compartido en grupo y contratos de Tier 2. La 0.5.0 añadió el Intendente y marcas de nivel acorde al mapa, la 0.4.0 las cacerías, la 0.3.0 la dificultad según el atlas y la 0.2.0 fue una reescritura de la primera versión, que no cargaba
- **Probado en el juego:** el flujo completo de una marca en Prontera, y que la marca reforzada aguanta claramente más que una normal. El error de carga original (`abs()`) quedó resuelto
- **Probado en el juego (0.6.0, 2026-10-17):** una cacería de Fabre en Prontera: cuenta solo los Fabre de su mapa (`prt_fild08`; en `prt_fild06` no cuenta, ni otros monstruos), avisa al completarla y se cobra en el tablero (el Intendente no la acepta: es lo esperado, él solo cobra marcas). Una marca de Prontera: aviso de objetivo abatido y cobro con el Intendente. El diario anota el contrato aceptado y la marca abatida
- **Probado en el juego (0.6.1, 2026-10-23):** la cacería de Tier 2 «Goblins del camino este» (12 en `prt_fild11`) se cobra con **3125 zeny**, el +25 % de `F_Expedition_Zeny`; el tablero y el Intendente de Geffen, Payon, Morocc, Alberta y Aldebaran se ven y responden (en Payon también, aunque el mapa marca sus celdas como no caminables); la marca «Rastro en el campo sur» de Prontera deja *Marca de la presa* al matarte (ver [`wounds`](../wounds/README.md#estado))
- **Visto en esa prueba, arreglado en 0.6.2:** la cacería contaba un solo id (`.mob[15] = 1126`) y no las otras variantes que el cliente también llama «Goblin» (1122–1126)
- **Probado en el juego (0.7.0, 2026-10-24):** en «Goblins del camino este» suman **todas** las variantes de Goblin, lleven el arma que lleven, con el aviso «Caceria: N/12 Goblin»; el Goblin Archer no suma; el log tras un rato cazando no tiene errores de `expedition-board.txt`
- **Probado en el juego (0.8.0, 2026-10-26),** con `adventure` 0.4.0: los relatos «Abatí la marca: …» y «Completé la cacería: …» (repetir el mismo contrato no da relato) y la nota «Acepte…» en la pestaña Diario (`F_Adv_Note`). Los trofeos, las marcas de élite y el Coleccionista siguen sin probar
- **Sin probar:** el crédito en grupo (necesita dos personajes), las marcas de nivel acorde al mapa, las otras cacerías de Tier 2 (ids 16 a 21), las marcas de las otras seis ciudades y los casos límite de «Probarlo»
- **Actualizado:** 2026-10-26

## Ajustes

En Settings → Mods → `expedition-board`; cambian al pulsar **Apply** (reinicia el
servidor). Los marcados «de prueba» son los valores de las sesiones de prueba.

| Ajuste | Por defecto | Qué cambia |
|---|---:|---|
| `zeny_pct` | 100 | de prueba: escala el zeny del CSV (el objeto no cambia) |
| `zeny_tier_pct` | 25 | de prueba: % de zeny extra por Tier por encima del 1 |
| `mark_strength` | sí | reforzar la marca según el Tier |
| `mark_hp_tier` | 50 | de prueba: % de HP extra por Tier (sobre +50 % en Tier 1) |
| `mark_atk_tier` | 15 | de prueba: % de ATK extra por Tier |
| `trophy_hours` | 12 | de prueba: horas entre trofeos del mismo contrato, por personaje (0 = siempre) |
| `elite_trophies` | 2 | de prueba: trofeos de una marca de élite (una normal da 1) |
| `elite_hp` | 100 | de prueba: % de HP extra de una marca de élite, encima del refuerzo por Tier |
| `elite_atk` | 30 | de prueba: % de ATK extra de una marca de élite |
| `collector_mark` | 1 | de prueba: % de defensa por un trofeo de marca colgado |
| `collector_nemesis` | 2 | de prueba: % de defensa por un talismán de `nemesis` colgado |
| `collector_cap` | 10 | de prueba: tope de defensa por raza |

## Qué hace

- Un tablero (`4_BOARD3`) en Prontera, Izlude, Geffen, Payon, Morocc, Alberta y
  Aldebaran. El nombre flotante es `Expedicion` (límite de 24 caracteres de
  rAthena); el diálogo usa el título completo.
- Hoy hay **dos contratos por ciudad**: una marca y una caza. Son repetibles.
  Un solo contrato activo por personaje: hay que entregarlo o abandonarlo antes
  de tomar otro. El menú los distingue con `[Marca]` y `[Caza]`.
- La entrega solo se acepta en la ciudad que publicó el contrato. Cualquier
  tablero puede mostrar el estado y dejar abandonarlo.
- Un contrato que se quite del CSV se retira solo del personaje la próxima vez
  que hable con un tablero.
- Escribe notas en el diario del viajero (`adventure`) al aceptar, al
  abatir la marca y al completar una caza. La integración es suave: si el
  diario no está activo, `doevent` solo deja una advertencia en el log y el
  contrato funciona igual.

No hay objetos ni monstruos custom: se reutilizan especies y recompensas de
ambas eras. No requiere ningún otro mod.

### Crédito compartido en grupo

Pensado para jugar de a dos. Solo aplica **dentro de un grupo** (party) de rAthena;
fuera de uno cuenta lo propio, como antes.

- **Marca.** Si la abate un miembro del grupo del dueño, el contrato se acredita al
  dueño, que debe estar **conectado y en el mismo mapa**. Si no lo cumple, o la mata
  alguien fuera del grupo, nadie la cobra y el tablero ofrece **Volver a colocar la
  marca**. El diario y el aviso son los del dueño.
- **Caza.** Cada muerte suma a **todos los miembros del grupo (conectados, en el
  mapa del contrato) que tengan esa misma caza en curso**. Cada uno necesita haber
  aceptado el contrato por su cuenta; quien no lo tiene no suma ni se le cuenta nada.
  El progreso es individual y se guarda en cada personaje.
- **Rendimiento.** Sale barato por diseño: sin cazadores en el servidor
  (`$@eb_hunters`, el número de personajes conectados con una caza en curso) la
  muerte de un monstruo cuesta dos comparaciones. Solo mientras alguien caza, y solo
  para quien mata teniendo grupo, se repasa a sus compañeros (un grupo son pocos
  miembros). Ese contador se vuelve a llenar al conectarse y se vacía al reiniciar;
  si se desajustara por un cierre brusco, el efecto es mirar el grupo de más, no
  contar de menos.
- **Límites.** Cuenta solo si el compañero está conectado en el mapa: no hay crédito
  diferido. No se reparte la recompensa: cada quien cobra su propio contrato.

### Dónde se entrega

| Tipo | Se entrega con | Dónde |
|---|---|---|
| Marca | **Intendente de Expediciones** (`4_M_02`) | junto al tablero, 2 celdas al este |
| Caza | el **tablero** | el propio tablero |

Es una prueba de que la entrega puede estar en otro NPC. Todo el cobro (peso,
estado, zeny y objeto) es `F_Expedition_Pay`: el tablero y el Intendente solo la
llaman, y `F_Expedition_AtBoard(tipo)` decide quién recibe cada tipo. Para
llevar la entrega de un tipo a otro NPC u otra ciudad hay que poner el NPC que
llame a `F_Expedition_Pay` y cambiar esa función. Si en el tablero el contrato
es de otra ciudad, el Intendente (o el tablero) dice con quién entregarlo. Las
posiciones de los Intendentes son las del tablero más 2 en x, **sin comprobar en
el juego**.

### Marcas

- La marca lleva el evento de muerte de *ese* spawn: un Poring normal en el
  campo sur no completa el contrato de Prontera. Solo cuenta si la mata el
  dueño del contrato (o su mascota/homúnculo).
- Si la marca desaparece (reinicio del servidor, o la mató otra persona), el
  contrato sigue activo: al entrar con el personaje la marca se vuelve a poner,
  y el tablero ofrece **Volver a colocar la marca**.
- Si la celda del contrato no es transitable, la marca se coloca en una celda
  cercana.

### Cacerías

- Cuentan **solo las muertes en el mapa del contrato** y solo de la especie
  pedida; matar el mismo monstruo en otro mapa no suma. Cada muerte avisa
  «Caceria: 7/15 Fabre».
- **La especie es el nombre del monstruo.** Cuenta cualquier id que se llame
  exactamente igual que el del contrato: en «Goblins del camino este»
  (`mob` 1126) valen los cinco «Goblin» (1122–1126), pero no el Goblin
  Archer. El nombre es el de `getmonsterinfo(id, MOB_NAME)`, el mismo que
  enseña el cliente.
- Se cuenta **desde que se acepta**: lo abatido antes no vale. El progreso se
  guarda en el personaje y sobrevive a un relog y a un reinicio del servidor.
- Abandonar la caza pierde el progreso.
- Al llegar al número, el contrato queda listo para entregar en su tablero.

**Cómo se cuenta sin gastar rendimiento.** rAthena avisa al script de *cada*
monstruo que mata cualquier jugador (`OnNPCKillEvent`). Para que eso casi no
cueste, lo primero que hace el evento es una sola comparación con
`eb_hunt_mob`, una variable del personaje que vale 0 salvo mientras tiene una
caza en curso; con 0 el evento termina al instante. Con una caza, primero se
mira el mapa; solo en el mapa del contrato, y si el id no es el mismo, se
comparan los nombres, y solo cuando la muerte cuenta se lee la tabla de
contratos. Un personaje sin caza no ejecuta nada más. No hay temporizadores
ni bucles.

## Trofeos y marcas de élite

Desde la 0.8.0 (D40). La inspiración: los trofeos de The Witcher 3 (uno puesto,
y la prueba para cobrar), las almas de Dark Souls (gastarlo en una cosa o en
otra) y las runas de Shadow of Mordor (el talismán de `nemesis`).

**Trofeos de marca** (51600 + raza del monstruo, `db/item_db.yml`). Al abatir
una marca, su dueño recibe uno de la raza del monstruo; una de élite da
`elite_trophies` (2). Cada contrato da trofeos como mucho una vez cada
`trophy_hours` (12) horas por personaje, para que no se saquen repitiendo la
marca más fácil. Si no caben, los guarda el Intendente y los da al cobrar o
al hablarle.

| Id | Raza | Trofeo |
|---|---|---|
| 51600 | Amorfo | Esquirla de marca |
| 51601 | No muerto | Hueso de marca |
| 51602 | Bestia | Colmillo de marca |
| 51603 | Planta | Raíz de marca |
| 51604 | Insecto | Antena de marca |
| 51605 | Pez | Aleta de marca |
| 51606 | Demonio | Cuerno de marca |
| 51607 | Semihumano | Insignia de marca |
| 51608 | Ángel | Pluma de marca |
| 51609 | Dragón | Escama de marca |

Un trofeo se usa de una de estas cuatro maneras:

| Uso | Dónde | Qué da | ¿Se gasta? |
|---|---|---|---|
| Llevarlo puesto | es un accesorio | +10 % de daño físico y mágico contra su raza | no |
| Prueba | el Intendente de la ciudad | una marca de élite de esa raza | sí |
| Engarzarlo | Herrero de Afijos (`dungeon-chest`) | +5 % de ATK, MATK o resistencia contra su raza en una pieza | sí |
| Colgarlo | el Coleccionista | +1 % de defensa permanente contra su raza, hasta 10 % | sí |

Los **talismanes de `nemesis`** (51200–51209) también se llevan puestos, se
engarzan (+8 %) y se cuelgan (+2 %), pero no sirven de prueba.

**El Coleccionista de Trofeos** está en `payon 180,104`, para que haya otra
razón de ir a Payon; mientras duren las pruebas hay una copia en `prontera
157,187`, junto al Herrero (D23). «Colgar un trofeo» lo gasta y sube
`eb_def[raza]`; «Ver mi pared» lista la defensa de cada raza. La defensa es un
`bonus_script` de texto fijo que lee `eb_def[]` y se pone al entrar al juego;
no se pierde al morir.

**Marcas de élite** (`type` `elite` en `contracts.csv`). Una por ciudad, de la
misma raza que la marca normal de esa ciudad y en un mapa de un Tier más. No
salen en el tablero: las da el **Intendente** a cambio de un trofeo de marca de
la raza del monstruo, que se cobra solo si la marca quedó puesta. La marca se
llama «Marca de elite», tiene `elite_hp` (+100 %) de HP y `elite_atk` (+30 %)
de ATK encima del refuerzo por Tier, se cobra con el Intendente como una marca
y da su relato `mark:<id>` como Mayor.

| Id | Ciudad | Contrato | Monstruo | Mapa (Tier) | Prueba |
|---|---|---|---|---|---|
| 101 | Prontera | La flor del laberinto | Flora | `prt_maze03` (2) | planta |
| 102 | Izlude | La sirena de la cueva marina | Obeaune | `iz_dun02` (2) | pez |
| 103 | Geffen | La hidra del pozo | Hydra | `gef_dun01` (2) | planta |
| 104 | Payon | El tirador de piedras | Stone Shooter | `pay_dun02` (2) | planta |
| 105 | Morocc | La flor de la pirámide | Flora | `moc_pryd02` (2) | planta |
| 106 | Alberta | La marina de Comodo | Marina | `cmd_fild01` (2) | planta |
| 107 | Aldebaran | La luz bajo el reloj | Brilight | `alde_dun02` (3) | insecto |

Las celdas de las marcas de élite son el centro transitable del mapa, sacado
del map cache; `F_Expedition_Spawn` busca otra si no lo es.

## Qué cambió respecto a la primera versión

- **Causa del error de carga:** el log decía `unmatched ')'` en la línea de
  `abs(...)`. No encontré `abs` como comando en ningún script del repo ni en la
  documentación; lo más probable es que ese rAthena no lo tenga y lo lea como
  una variable. La búsqueda de celda ya no lo usa. El log actual ya no muestra
  el error.
- **El GID de la marca ya no se guarda en el personaje** (`eb_gid`). Tras un
  reinicio ese número puede ser el de otro monstruo, y retirar la marca habría
  matado a un desconocido. Ahora vive en `$@eb_mark[char_id]`, una variable
  temporal que se vacía al reiniciar. `eb_gid` queda en 0.
- Se usa `$@mobid[0]` para leer el GID tras `monster`, como documenta
  `docs/mods/MONSTER_LOOKS.md`.
- El evento de muerte comprueba que haya un jugador adjunto (retirar la marca
  por script la mata sin jugador) y que la marca sea la suya.
- Los contratos salen de un CSV (ver abajo) y se identifican por un `id`
  estable, que es lo que guarda el personaje.
- **Corrección en la 0.4.0:** el contrato 6 (Alberta) usaba el id de monstruo
  1109, que es un Deviruchi de nivel 93, y no un Vadon. Ahora usa 1066 (Vadon,
  nivel 45), como dice su texto. Si ya tenías ese contrato aceptado, la marca
  que está en pie sigue siendo la anterior hasta que la abandones o la mates.

## Contratos actuales

Las coordenadas de las marcas son un punto de prueba, no un diseño de
encuentro definitivo. El nivel es el del índice de monstruos del repo
(`mods/navigation-server-monsters/mob-index.tsv`, Renewal).

**Marcas**

| id | Ciudad | Contrato | Marca (nivel) | Mapa | Recompensa de prueba |
|---|---|---|---|---|---|
| 1 | Prontera | Rastro en el campo sur | Boiled Rice 1520 (15) | `prt_fild08` 180, 240 | 2 000 zeny y 10 Red Potion |
| 2 | Izlude | Amenaza en Byalan | Vadon 1066 (45) | `iz_dun00` 120, 90 | 3 000 zeny y 10 Orange Potion |
| 3 | Geffen | Mandragora marcada | Mandragora 1020 (13) | `gef_fild07` 180, 150 | 4 000 zeny y 10 Yellow Potion |
| 4 | Payon | Sauce inquieto | Elder Willow 1033 (34) | `pay_fild08` 80, 100 | 2 500 zeny y 10 Red Potion |
| 5 | Morocc | Muka del desierto | Muka 1055 (23) | `moc_fild11` 180, 200 | 5 000 zeny y 5 White Potion |
| 6 | Alberta | Gusano del camino | Wormtail 1024 (17) | `pay_fild03` 140, 160 | 3 500 zeny y 10 Orange Potion |
| 7 | Aldebaran | Mantis del paso | Mantis 1139 (65) | `mjolnir_12` 170, 170 | 4 500 zeny y 5 White Potion |

**Criterio de las marcas (0.5.0).** Antes eran monstruos muy por encima de su
mapa (un Desert Wolf de nivel 103 en un mapa de Tier 1, un Wolf de 45 entre
Porings de nivel 1–6). Ahora cada marca es de un nivel de **entre una y dos veces
el de los monstruos habituales del mapa**, y el refuerzo por Tier (×1,5 de HP en
Tier 1) la deja notable pero abatible: Prontera, Geffen y Alberta (campos de
nivel 1–8) llevan marcas de 13 a 17; Payon (monstruos hasta 18), un Elder Willow
de 34; Morocc (12–23), un Muka de 23; Izlude (40–45), un Vadon de 45; Aldebaran
(Tier 2, casi todo de 62), una Mantis de 65. Sale de un criterio, no de pruebas:
ajusta el `mob` en el CSV. El monstruo debe existir también en Pre-Renewal; el
índice del repo solo es Renewal, así que ese caso no lo comprueba el build.

**Cacerías** (monstruos locales; el build comprueba que cada uno aparezca en su
mapa)

| id | Ciudad | Contrato | Monstruo (nivel) | Cantidad | Mapa | Recompensa de prueba |
|---|---|---|---|---|---|---|
| 8 | Prontera | Fabres del camino sur | Fabre 1007 (6) | 15 | `prt_fild08` | 600 zeny y 5 Red Potion |
| 9 | Izlude | Kukres de Byalan | Kukre 1070 (42) | 12 | `iz_dun00` | 1 500 zeny y 5 Orange Potion |
| 10 | Geffen | Chonchones del oeste | Chonchon 1011 (5) | 15 | `gef_fild07` | 900 zeny y 3 Yellow Potion |
| 11 | Payon | Esporas del sur | Spore 1014 (18) | 15 | `pay_fild08` | 1 200 zeny y 5 Red Potion |
| 12 | Morocc | Crías de lobo | Baby Desert Wolf 1107 (14) | 15 | `moc_fild11` | 1 500 zeny y 3 White Potion |
| 13 | Alberta | Sauces del camino | Willow 1010 (8) | 15 | `pay_fild03` | 1 000 zeny y 5 Orange Potion |
| 14 | Aldebaran | Polvorientos del paso | Dustiness 1114 (62) | 12 | `mjolnir_12` | 2 200 zeny y 3 White Potion |

**Cacerías de Tier 2** (todas en mapas de Tier 2 del atlas, con monstruos que
aparecen en ellos; el generador lo comprueba). Pagan ×1,25 de zeny por el Tier.

| id | Ciudad | Contrato | Monstruo (nivel) | Cantidad | Mapa | Recompensa base |
|---|---|---|---|---|---|---|
| 15 | Prontera | Goblins del camino este | Goblin 1126 (56) | 12 | `prt_fild11` | 2 500 zeny y 10 Red Potion |
| 16 | Izlude | Cornutus de la cueva marina | Cornutus 1067 (48) | 12 | `iz_dun02` | 3 000 zeny y 10 Orange Potion |
| 17 | Geffen | Espectros de la mazmorra | Ghoul 1036 (61) | 10 | `gef_dun01` | 3 500 zeny y 5 Yellow Potion |
| 18 | Payon | Orcos que no descansan | Orc Zombie 1153 (51) | 12 | `orcsdun01` | 3 000 zeny y 10 Orange Potion |
| 19 | Morocc | Momias de la piramide | Mummy 1041 (55) | 10 | `moc_pryd03` | 3 500 zeny y 3 White Potion |
| 20 | Alberta | Ranas de la cueva | Thara Frog 1034 (40) | 12 | `beach_dun3` | 3 000 zeny y 10 Orange Potion |
| 21 | Aldebaran | Martins de la mina | Martin 1145 (39) | 12 | `mjo_dun02` | 3 200 zeny y 3 White Potion |

Son todas cacerías porque una marca necesita una celda concreta en un mapa de
dungeon y no hay datos de mapa aquí para elegirla con seguridad; una marca en un
mapa de Tier 2 o más se puede añadir con una coordenada comprobada con `@warp`.

Las recompensas, de marcas y de cacerías, son una primera estimación, sin
balancear.

En Izlude y Morocc las plazas cambiaron entre Pre-Renewal y Renewal; si un
tablero queda en una celda rara, hay que ajustar su `map,x,y` en
`expedition-board.txt`.

## Añadir más contratos a una ciudad

Un tablero lista **todos** los contratos cuya `city` es la de su ciudad, así que
tener varios por ciudad es solo añadir filas; el script no cambia. La fuente de
verdad es
[`registry/tools/expedition-board/contracts.csv`](../../registry/tools/expedition-board/contracts.csv).

1. **Añade una fila al final** de `contracts.csv` con un `id` nuevo (el mayor
   más uno). **Nunca renumeres ni reutilices un id**: los personajes guardan el
   de su contrato activo, y borrar una fila retira ese contrato a quien lo
   tenga.
2. **Rellena las columnas:**

   | Columna | Qué poner |
   |---|---|
   | `id` | entero positivo, único |
   | `city` | `prontera`, `izlude`, `geffen`, `payon`, `morocc`, `alberta` o `aldebaran`. Es el tablero que lo publica **y** donde se cobra |
   | `type` | `expedition` (una marca) o `hunt` (cazar N de una especie) |
   | `name` | título en el menú del tablero, hasta 40 caracteres |
   | `mob` | id del monstruo en `mob_db` (debe existir en Pre-Renewal y Renewal). En `hunt`, el que hay que cazar |
   | `map` | en `expedition`, donde aparece la marca; en `hunt`, el único mapa donde cuentan las muertes |
   | `x`, `y` | `expedition`: celda de la marca (si no es transitable se busca otra cercana; compruébala con `@warp`). `hunt`: **0 y 0** |
   | `count` | `expedition`: **1**. `hunt`: cuántos hay que abatir (2 a 200) |
   | `zeny`, `item`, `amt` | recompensa: zeny, id de objeto y cantidad |
   | `place` | nombre del lugar, para el diálogo y el diario |
   | `blurb` | una frase de ambiente |

   Ejemplos, una marca y una caza más para Prontera:

   ```text
   15,prontera,expedition,Poring dorado,1002,prt_fild08,120,200,1,1500,501,5,Campo de Prontera 08,Un Poring demasiado brillante para ser un Poring.
   16,prontera,hunt,Lunaticos del campo,1063,prt_fild08,0,0,20,700,501,5,Campo de Prontera 08,Los Lunaticos saltan por todo el camino.
   ```

   Los textos van en ASCII (sin tildes ni eñes) y sin comas, porque el CSV se
   separa por ellas; tampoco pueden llevar `"`, `:`, `;`, `|`, `^` ni `\`.
3. **Regenera:** `node registry/tools/expedition-board/build_contracts.cjs`.
   Valida ids, ciudades, tipos, números y textos, y reescribe
   `npc/expedition-contracts.txt` (no lo edites a mano). En una caza comprueba
   además que el monstruo aparezca en ese mapa (con el índice de monstruos del
   repo); si el índice no está, avisa y sigue. `--check` falla si el generado
   está desactualizado.
4. **Instala:** reemplaza la carpeta del mod (no copies encima) y recarga los
   mods. Un personaje con un contrato a medias lo conserva.

Cosas a tener en cuenta:

- **Cuántos por ciudad.** El menú se arma como un solo texto con las entradas
  separadas por `:`; mantén cada ciudad en pocos contratos (unos 5 o 6) y los
  títulos cortos. Con muchos más habría que paginar, y no está probado dónde
  rAthena corta el menú.
- **Un contrato activo por personaje**, de cualquier ciudad y de cualquier
  tipo.
- **Todos los contratos de una ciudad se cobran en su tablero**, también los
  de mapas lejanos. Elige una ciudad que quede razonablemente cerca del mapa.
- **No hay orden ni requisito de nivel**: se listan por `id`.
- Una caza en un mapa donde el monstruo es muy escaso se vuelve interminable:
  prefiere especies con muchos spawns.
- En `mob` basta **un** id de la especie: cuentan todos los que se llamen
  igual (ver «Cacerías»). Si quieres que una variante no cuente, tiene que
  llamarse distinto en `mob_db`.
- La dificultad la fija el **Tier del mapa** del contrato en el atlas (ver
  «Dificultad según el atlas»). Para que se note hay que poner contratos en
  mapas de Tier 2 o más.

## Dificultad según el atlas

Cada contrato toma el **Tier** (1–6) de su `map` en
[`world-atlas`](../world-atlas/README.md). El tablero lo muestra: «Peligro:
Tier N de 6». **No bloquea nada por nivel**: el jugador decide si está listo.
Se usa de dos maneras:

| Tier | Zeny que paga (marcas y cacerías) | HP de la marca | ATK de la marca |
|---|---|---|---|
| 1 | el del CSV | ×1,5 | ×1,00 |
| 2 | ×1,25 | ×2,0 | ×1,15 |
| 3 | ×1,50 | ×2,5 | ×1,30 |
| 4 | ×1,75 | ×3,0 | ×1,45 |
| 5 | ×2,00 | ×3,5 | ×1,60 |
| 6 | ×2,25 | ×4,0 | ×1,75 |

- Solo escala el **zeny**; el objeto y su cantidad son los del CSV.
- El refuerzo de HP y ATK es **solo de las marcas**: en una caza los monstruos
  son los normales del mapa.
- Sin `world-atlas` activo, o si no conoce el mapa, el Tier es 0: no se muestra
  nada, el zeny es el del CSV y la marca es un monstruo normal. El atlas es una
  dependencia suave (`$@wa_ready`), sin `requires.mods`.
- Las fórmulas están en `F_Expedition_Zeny` (`expedition-board.txt`) y
  `F_Expedition_Strengthen` (`expedition-strength.txt`).
- Hoy la diferencia es pequeña: solo `mjolnir_12` es Tier 2; los demás mapas
  del mod son Tier 1.
- **Los números son una propuesta, sin balancear en el juego.**
- **El refuerzo funciona** (probado en el juego con la marca de Prontera, Tier
  1: con y sin él, la diferencia en lo que aguanta se nota claramente). Usa
  `setunitdata` con `UMOB_MAXHP`, `UMOB_HP`, `UMOB_ATKMIN` y `UMOB_ATKMAX`. No
  se midió cuánto HP o ATK ganan; las fórmulas de la tabla son las del código.
  Para apagarlo pon `.@enabled = 0` en `F_Expedition_Strengthen`.

## Qué no hace (aún)

Contratos de varios objetivos, límites de tiempo, bloqueo por nivel del
personaje, botín ligado a otros mods (`dungeon-chest`, `clima`, `survival`),
marcas en el minimapa, ni entregar en una ciudad distinta de la que publicó el
contrato (la entrega es siempre en su ciudad, con el tablero o el Intendente). Fuera de un grupo,
una marca abatida por otro jugador no se acredita al dueño del contrato y una caza solo
cuenta las muertes del propio personaje (y de su mascota). Las de Tier 3 o más
(los demás mapas del atlas) aún no tienen contratos.

## Probarlo

1. Reemplaza `expedition-board` en la carpeta de mods de la aplicación (o
   agrégala desde **Settings → Mods → Add mod from folder**), actívala y aplica
   los cambios.
2. `ragnarok-stack logs map 100`: no debe haber errores de `expedition-board`.
3. **Marca.** En Prontera, habla con el tablero junto a la fuente (`160, 193`)
   y acepta `[Marca] Rastro en el campo sur`. Ve a `prt_fild08` cerca de
   `180, 240` y mata al **Boiled Rice** llamado **Marca de expedición**. El chat debe
   avisar que el objetivo cayó y el diario (Alt+J) debe mostrar una nota
   «Marca abatida». Ve con el **Intendente** (2 celdas al este del tablero) y
   entrega: comprueba zeny y pociones. El tablero **no** debe ofrecer entregar
   esa marca, y el Intendente debe negarse si el contrato es de otra ciudad o si
   es una caza.
4. **Caza.** Acepta `[Caza] Fabres del camino sur`. Mata Fabres en `prt_fild08`:
   cada uno debe avisar `Caceria: n/15 Fabre`. Mata un Fabre en otro mapa y un
   Lunatic en `prt_fild08`: **no** deben sumar. Al llegar a 15 avisa que la
   caza está completa y el diario escribe la nota. Entrega en el tablero.
5. Un contrato de Tier 2 o más debe pagar más zeny: el de marca de Aldebaran
   (`mjolnir_12`, id 7) y la caza id 14 pagan ×1,25 de su zeny base. En Tier 2 la
   marca además debe notarse más fuerte (HP ×2).
6. Casos límite: relog con la caza a medias (el progreso debe seguir ahí);
   reinicio del servidor con una caza o una marca en curso; abandonar una caza
   (el progreso se pierde y el siguiente contrato empieza en 0); matar la marca
   con otro personaje y usar **Volver a colocar la marca**; entregar en otra
   ciudad (debe negarse); entregar con el inventario lleno.
7. **Grupo (necesita dos personajes).** Forma un grupo con dos personajes en el
   mismo mapa. Marca: que el compañero la abata; el dueño debe recibir el aviso y
   poder entregarla con el Intendente. Caza: ambos aceptan la misma caza; la que
   mata uno debe sumar a los dos. Fuera del grupo, o con el compañero en otro mapa
   o desconectado, no suma.
8. **Tier 2.** Acepta una caza de las ids 15 a 21: el tablero debe mostrar «Tier 2»
   y el cobro debe ser ×1,25 del zeny base.
   **Variantes:** en «Goblins del camino este» (`prt_fild11`) suma cualquier
   Goblin, lleve el arma que lleve; el Goblin Archer no suma.
9. Con una caza en curso, mata monstruos de otra especie durante un rato y
   comprueba en `ragnarok-stack logs map 100` que no aparece ningún error ni
   advertencia nueva.
10. **Cada ciudad.** Para las siete (Prontera, Izlude, Geffen, Payon, Morocc,
    Alberta, Aldebaran), con `@warp`: ¿el tablero y el Intendente están visibles
    y se pueden pulsar?; ¿el menú lista sus tres contratos (una marca y dos
    cacerías) con `[Marca]` y `[Caza]`?; ¿la marca aparece en su punto y se
    puede alcanzar?; ¿se cobra bien? Anota las celdas que no sirven: los tableros
    están en `expedition-board.txt`, los Intendentes 2 celdas al este, y las
    marcas en `contracts.csv`.
11. **Alberta, contrato 6.** Si lo tenías aceptado de antes de la 0.4.0, la marca en
    pie es la vieja (Deviruchi): abandónalo o mátala y acepta uno nuevo.
12. **Diario.** Tras aceptar una marca, una caza, y completar cada una, revisa
    Alt+J: debe haber notas de aceptar, de marca abatida y de caza completada.
    Si falta alguna, mira en el log `event does not exist`.
13. **Era.** Repite lo básico (aceptar, abatir, cobrar) también en Pre-Renewal, si
    la usas: los ids de monstruo del CSV se comprobaron solo contra Renewal.
14. **Diagnóstico de la cola de eventos.** No es de este mod, pero se mide en la
    misma sesión: busca `qdebug` en el log al terminar (ver [`ROADMAP.md`](../ROADMAP.md#error-abierto-players-event-queue-is-full)) y pásalo para analizarlo.

## Variables

| Variable | Alcance | Uso |
|---|---|---|
| `eb_qid` | personaje, permanente | id del contrato activo |
| `eb_state` | personaje, permanente | 0 libre, 1 en curso, 2 listo para entregar |
| `eb_prog` | personaje, permanente | caza: monstruos abatidos hasta ahora |
| `eb_hunt_mob` | personaje, permanente | caza en curso: id del monstruo a contar (y cualquier otro de su mismo nombre); 0 si no hay |
| `eb_hunt_map$` | personaje, permanente | caza en curso: mapa donde cuenta |
| `eb_gid` | personaje, permanente | en desuso; se pone a 0 al entrar |
| `$@eb_mark[char_id]` | servidor, temporal | GID de la marca viva de ese personaje |
| `$@eb_markowner[gid]` | servidor, temporal | char_id del dueño de esa marca (para acreditarlo en grupo) |
| `$@eb_hunters` | servidor, temporal | cuántos personajes conectados tienen una caza en curso |
| `eb_trt[id]` | personaje, permanente | última vez (unix) que el contrato `id` dio trofeos |
| `eb_tr_item`, `eb_tr_n` | personaje, permanente | trofeo que no cupo y cuántos; los entrega el Intendente |
| `eb_def[raza]` | personaje, permanente | defensa del Coleccionista contra esa raza, en % |

## Estructura

```text
expedition-board/
├── mod.json
├── README.md
├── db/item_db.yml                 trofeos de marca (51600–51609)
├── System/itemInfo.lua            sus nombres y textos en el cliente
└── npc/
    ├── expedition-board.txt       tableros, Intendentes, marcas, élites, cacerías y estado (a mano)
    ├── expedition-strength.txt    refuerzo de la marca por Tier y de élite (a mano)
    ├── expedition-trophies.txt    trofeos, el Coleccionista y su defensa (a mano)
    └── expedition-contracts.txt   datos de los contratos (generado)
```

## Próximos cambios propuestos (revisión 2026-10-17)

Sin implementar.

- **Recompensas reales:** ~~las marcas sueltan un trofeo~~ hecho en la 0.8.0
  (D40); el zeny y las pociones siguen siendo de prueba.
- **Contratos que llevan a algo:** una marca o caza que apunta a un punto de
  interés, la cadena «Rumor → Pista → Hallazgo» del plan. Los rumores vendrían
  de `tavern-rumors`.
- **Contratos de dos roles** para jugar de a dos.
- **Pistas del bestiario:** el contrato dice a qué elemento es débil la marca.
- **Experiencias:** primera vez que se abate cada marca, `mark:<contrato>`
  (Media); primera vez que se completa cada caza, `hunt:<contrato>` (Menor). Con
  `@adv_party = 1` para el crédito en grupo. Ver
  [`ADVENTURE.md`](../ADVENTURE.md).
- **Tier 3 o más:** solo la élite de Aldebaran (0.8.0); con `adventure`, son donde más
  pagan las experiencias.
