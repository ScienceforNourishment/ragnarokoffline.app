# Curva de progresión

Cuántas zonas tiene el juego, de qué nivel es cada una, por qué ruta se sube y
cuánto dura: la base para ordenar las regiones de H3 y para saber si las
experiencias pesan lo justo frente a la EXP de monstruos a 1x. Versiones del
2026-10-26 y del 2026-10-27, con los datos del rAthena fijado (`8aea17a`). Lo
decidido está en [`DECISIONS.md`](./DECISIONS.md) (D46–D58) y aquí se cita por
número; lo que no lleva número es **propuesta**.

## El encargo

Primera ronda (2026-10-26):

- **Ritmo:** lo da el contenido que ya existe; se cuentan las zonas de cada
  nivel para saber cuánto dura la partida. No repetir zonas constantemente,
  aunque repetir es válido si se quiere (D47).
- **Alcance:** hasta la **2.ª clase trascendente nivel 99**; la 3.ª y la 4.ª
  quedan fuera (D46).
- **Fuentes:** el mapa del mundo de
  [ratemyserver](https://ratemyserver.net/worldmap.php) y la tabla de EXP de
  [iRO Wiki](https://irowiki.org/wiki/Base_EXP_Chart). Las cifras salen del
  rAthena fijado; el mapa del mundo sirvió para asignar cada mapa a su región.

Segunda ronda (2026-10-27): la duración cuenta también los relatos (D47);
rutas por clase, tres, luego dos, luego una (D48); el renacimiento es otra
ruta, con acciones de élite en zonas ya vividas (D49); Tiers por etapa de
clase, con Tiers S para el renacido (D50); hacen falta relatos nuevos.

Tercera ronda (2026-10-27), las decisiones sobre la segunda versión:

- Los Tiers se cortan en **1–19, 20–49, 50–69, 70–84 y 85–99** (D51).
- La **S es de la actividad** y depende de si eres renacido: los mismos NPC,
  cofres y tableros cambian lo que dicen y lo que dan. Botín para renacidos y
  más presión: un modo difícil, no «hacerlo todo otra vez» (D52).
- Las **rutas guían, no limitan**. Se llaman **Corona**, **Cetro** y
  **Orbe**; luego **Celes** y **Avernum**; la del 80 al 99, **Crisol** (D58).
  El **Merchant** elige ruta. Las **clases expandidas** quedan fuera (D53).
- Primero se construye **Corona → Celes → Crisol** (D54).
- Se aceptan las ideas de relatos nuevos **salvo las quests oficiales** (D55).
- **No llegar al 99 con relatos y contenido del Tier máximo sin tocar** (D56).
- Los **retos de nivel 150 o más** se quedan, como retos y para pruebas; se
  añaden los biomas **industrial**, que se extiende desde Einbroch, e
  **inframundo** (D57).

## En resumen

1. **Hay 313 mapas con monstruos para subir del 1 al 99**, contando todo el
   mundo. Otros 16 son mazmorras de gremio y 119 quedan fuera del alcance de
   las rutas: 113 de nivel 150 o más, casi todos de la 3.ª y la 4.ª clase, y 6
   de nivel 123–143 sin región clara (`ba_*`, `sp_rudus`).
2. **Cinco Tiers por etapa de clase** (D50, D51): T1 1–19, T2 20–49, T3
   50–69, T4 70–84 y T5 85–99, y sus versiones S para el renacido (D52). No
   hacen falta ni el Tier 6 ni el 7.
3. **Tres rutas, luego dos, luego una** (D48, D53): Corona (Swordman,
   Acolyte), Cetro (Mage) y Orbe (Archer, Thief) hasta el 59, con el Merchant
   libre; Celes y Avernum del 60 al 79; Crisol del 80 al 99. La primera
   vida usa unos 190 mapas, y cada jugador ve entre 111 y 123.
4. **El renacido** es otra ruta (D49), con detalles pendientes. Lo que ya se
   sabe: los NPC pueden saber si eres renacido (`Upper`), hay 232 piezas de
   equipo solo para trascendentes de nivel 50–99, y lo que no vivió en su
   primera vida le da relatos nuevos sin cambiar `adventure`.
5. **Duración de la primera vida:** unas 12.000 muertes a 1x sin relatos; con
   los relatos de mapas, cofres, Tiers y MVP de su ruta, unas **8.500**
   (~34 horas a 250 muertes por hora, un supuesto que H1 tiene que medir).
   Contratos, climas, heridas, némesis, refugios, rumores y los relatos nuevos
   la acortan más.
6. **Los relatos pesan poco abajo y mucho arriba:** un 8–10 % de la EXP del 1
   al 59 de una ruta, un 13–15 % del 60 al 79 y un 42 % del 80 al 99. Abajo
   es donde más falta hacen relatos nuevos (D55).
7. **El atlas tiene trabajo:** 136 de los 313 mapas no están, 18 tienen otro
   Tier con los spawns de Renewal, y `tier_of.cjs` mezcla spawns de
   Pre-Renewal y de eventos.

## Cómo se calculó

| Dato | De dónde | Cómo |
|---|---|---|
| Qué monstruos hay en cada mapa | `mods/navigation-server-monsters/mob-index.tsv` | Solo los scripts que Renewal carga (`load renewal`). Fuera: eventos, `custom/etc`, quests, jobs, campeones, cárcel, PvP y ciudades. Sin MVP ni monstruos de temporada, como `tier_of.cjs` |
| EXP y nivel de cada monstruo | `db/re/mob_db_world.yml` y `db/re/mob_db.yml` del fork en `8aea17a` | En el orden de importación de `db/mob_db.yml`: `mob_db_world.yml` trae los 458 monstruos de los mapas nuevos |
| EXP de cada nivel, base y de trabajo | `db/re/job_exp.yml` | 1.ª y 2.ª clase, y trascendente; todas llegan a 99 de base |
| Penalización por diferencia de nivel | `db/re/level_penalty.yml` | Monstruo 10 niveles por encima: 140 %; 16 o más: 40 %; 6 por debajo: 95 %, y baja hasta el 10 % a 31 por debajo |
| Dónde está cada gremio | `npc/jobs/` del fork | El mapa de los NPC del cambio de clase |
| Equipo solo para renacidos | `db/re/item_db_equip.yml` | Piezas con `Classes` `Upper` o `All_Upper` y sin `Normal` ni `All`, de nivel 99 o menos |
| Nivel de un mapa | — | Media de los niveles de sus spawns, ponderada por cantidad (el criterio de `dungeon-chest`) |
| Muertes por nivel | — | `NextBaseExp` del nivel entre la mediana de EXP por muerte de los mapas cuyo nivel está entre 3 por debajo y 12 por encima, con la penalización aplicada |
| Cambio de clase | — | Se simula base y job a la vez, matando en esos mismos mapas |
| Región | mapa del mundo de ratemyserver | Por el prefijo del mapa y la ciudad desde la que se llega. No es el `anchor` del atlas, que solo usa las 7 ciudades |
| Relatos | [`ADVENTURE.md`](./ADVENTURE.md#cuánta-exp-da-una-experiencia) | Mapas y cofres (Menor, 4 %), primer mapa y primer cofre de cada Tier (Hito y Mayor) y MVP (Mayor, 25 %), con factor de Tier 1 y una racha media de ×1,25. Sin contratos, climas, heridas, némesis, refugios, rumores ni relatos nuevos |

Límites: el nivel medio no dice cómo de duro es un mapa; los MVP que solo
aparecen en su propio mapa (`pay_fild11`, el de Eddga) no cuentan como mapa;
las muertes por hora son un supuesto; y el reparto de relatos supone que se
hace cada mapa de la ruta una vez. Los scripts del cálculo no están en el
repositorio; si la curva se va a rehacer al mover el pin, conviene llevarlos a
`registry/tools/world-atlas/`.

## Las etapas de una clase y los Tiers

**Cuándo cambia de clase un personaje** que sube matando en mapas de su nivel
(simulación con las tablas de Renewal):

| | Vida 1 | Renacido |
|---|---|---|
| Novice job 10 | base 3 | base 3 |
| 1.ª clase job 20 | base 18 | base 19 |
| 1.ª clase job 40 | base 47 | base 43 |
| Cambio a 2.ª | base 47 (a job 40) o 63 (a job 50) | base 53 (a job 50) |
| 2.ª clase job 30 | base 71–77 | job 30 en base 65 |
| 2.ª clase job 50 | base 90–91 | job 50 en base 83; job 68 en base 99 |

Las cifras de base cuentan solo monstruos: con los relatos, la base sube algo
más rápido que el trabajo (los relatos también dan EXP de trabajo, con el
mismo porcentaje).

**Los Tiers** (D50, cortes en D51):

| Tier | Nivel | Etapa | Mapas | EXP de la banda (vida 1) |
|---|---|---|---:|---:|
| T1 | 1–19 | Novice y primeros niveles de 1.ª clase | 27 | 94.614 |
| T2 | 20–49 | últimos niveles de 1.ª clase | 54 | 678.722 |
| T3 | 50–69 | primeros niveles de 2.ª clase | 38 | 1.181.151 |
| T4 | 70–84 | 2.ª clase con la build hecha | 49 | 2.599.816 |
| T5 | 85–99 | alto nivel | 87 (nivel medio 85–114) | 9.751.466 |
| T1S–T5S | los mismos | lo mismo, para el renacido (D52) | | |
| T5S | 99 | solo el renacido | 58 (nivel medio 115–149) | — |

Por qué esos cortes: en el **20**, la 1.ª clase llega a job 20 y ya tiene sus
skills básicas; el **50** sigue a quien cambia pronto a 2.ª (base 47; el
renacido, hacia el 53); en el **70**, la 2.ª llega a job 30 y la build ya se
nota; el **85** es donde la EXP por nivel se dispara: del 80 al 98 se
multiplica por 6 y la de los monstruos solo por 1,7. Del 85 al 99 está el
68 % de la EXP de una vida.

**No hacen falta ni el Tier 6 ni el 7.** Con el máximo en 99 (D46), lo que hay
por encima del 115 es el final del renacido (T5S) y lo que hay por encima del
150 son retos (D57).

**Lo que cambia al aplicarlos,** sin tocarlo todavía: la tabla de bandas de
`adventure` (factor de Tier), los Tiers del atlas y de `tier_of.cjs`, las
tablas por Tier de `dungeon-chest` (`loot_tiers.csv`) y de
`expedition-board`, la presión por Tier de `survival`, `temperature` y
`clima`, y la tabla de [`BALANCE.md`](./BALANCE.md#cómo-ajustarlo). Con Tiers
más estrechos, un mapa deja de pagar antes: a nivel 70 (T4), un relato de un
mapa de T2 vale ×0,1.

## Los Tiers S: el modo difícil del renacido

**Qué es** (D52): la S no es un Tier de nivel ni una marca del mapa, es de la
**actividad**, y solo existe para un renacido. El atlas guarda el Tier por
nivel (1–5); los mismos NPC, cofres y tableros miran si el personaje es
renacido y, si lo es, hablan y dan otra cosa. Así se reciclan NPC y lugares
para contenido nuevo, incluso historias nuevas.

**Se puede hacer** (rAthena fijado):

- **Saber si es renacido:** la variable de personaje `Upper` vale 1 en un
  trascendente (`doc/script_commands.txt`), y `eaclass() & EAJL_UPPER` lo
  dice también desde la clase. Un NPC escribe `if (Upper == 1)` y cambia de
  diálogo, de contrato o de botín.
- **Equipo solo para renacidos:** 232 piezas de `db/re/item_db_equip.yml`
  solo las puede llevar un trascendente y piden nivel 50–99 (95 armas y 137
  armaduras: Krishna, Bloody Eater, Berdysz, Drill Katar…). Es el botín
  natural de un cofre S, y el cliente ya sabe mostrarlas.

**Qué da la S:**

- **Botín para renacidos:** el de antes, pero sobre todo esas piezas, con
  afijos del Tier como hoy (D35).
- **Más presión:** monstruos de la zona reforzados, marcas más duras y los
  sistemas de supervivencia más exigentes que en el mismo Tier normal. Es la
  misma zona vivida de otra forma, no volver a hacerla.
- **Relatos propios:** `tier:<n>S`, `chesttier:<n>S`, `elite:<mapa>`; claves
  nuevas, así que el renacido las gana aunque haya pasado por el mapa.
- **Lo que cuentan los NPC:** el Cronista, el Tabernero o el Intendente
  pueden reconocer al renacido y contarle otra cara de la historia.

**Pendiente:** cómo se refuerzan los monstruos de una zona solo para el
renacido sin cambiar la zona para un compañero que no lo es (1 o 2 jugadores,
D4). Probablemente con monstruos propios que solo aparecen para él (marcas,
guardianes, cofres con guardia), no tocando los spawns del mapa.

## Las rutas

### Qué clase va por qué ruta

Las rutas **guían, no limitan** (D53): el tablero, los rumores y los NPC de
cada ruta llevan a sus zonas, pero se puede ir a cualquier sitio, y lo que no
se vive en una vida queda nuevo para el renacido.

| Ruta, 1–59 | Ciudades | 1.ª clase (dónde) | 2.ª clase (gremio) | Sigue, 60–79 |
|---|---|---|---|---|
| **Corona** | Prontera, Izlude | Swordman (Izlude), Acolyte (Prontera) | Knight y Crusader (Prontera), Priest (Prontera), Monk (Abadía de Santa Capitolina) | Celes |
| **Cetro** | Geffen, Aldebaran, Lutie | Mage (Geffen) | Wizard (Geffen), Sage (Juno) | Celes |
| **Orbe** | Payon, Morocc, Alberta, Comodo | Archer (Payon), Thief (Morocc) | Hunter (Hugel), Assassin (Morocc), Rogue, Bard y Dancer (Comodo) | Avernum |
| *libre* | Alberta | Merchant | Alchemist (Aldebaran), Blacksmith (Einbroch) | la que elija |

Del 80 en adelante, todas siguen por **Crisol** (D58):
Einbroch, Lighthalzen, Hugel, Juno, Glast Heim, la Isla Tortuga y Geffenia.

- **Merchant** queda entre rutas (D53): nace en Alberta, del Orbe, y sus dos
  2.ª clases están al norte. Elige.
- **Hunter** cambia de clase en Hugel, una región de Crisol, igual que
  el Blacksmith en Einbroch y el Sage en Juno: el viaje al gremio es un
  adelanto de la ruta donde todos convergen. Puede ser un relato (`job:`).
- **Las clases expandidas** (Taekwon, Ninja, Gunslinger, Super Novice, Doram)
  quedan fuera por ahora (D53): sus niveles máximos no son los de las demás.

**El nombre, Crisol** (D58): donde todo se funde. Einbroch es una ciudad de
fundiciones, y ahí se juntan las tres rutas. Corona, Cetro y Orbe son las
insignias reales; Celes y Avernum, el cielo y el inframundo.

### Cuánto da cada ruta

| Ruta | Niveles | Mapas | Campos / mazmorras | MVP | Muertes a 1x | Relatos | Muertes netas | Por mapa |
|---|---|---:|---|---:|---:|---:|---:|---:|
| Corona | 1–59 | 24 | 12 / 12 | 2 | 3.040 | ~4,5 niveles (8 %) | ~2.810 | 117 |
| Cetro | 1–59 | 27 | 18 / 9 | 5 | 3.040 | ~5,3 niveles (9 %) | ~2.770 | 103 |
| Orbe | 1–59 | 42 | 25 / 17 | 3 | 3.040 | ~6,0 niveles (10 %) | ~2.730 | 65 |
| Celes | 60–79 | 19 | 12 / 7 | 2 | 2.040 | ~2,5 niveles (13 %) | ~1.780 | 94 |
| Avernum | 60–79 | 13 | 6 / 7 | 5 | 2.040 | ~3,0 niveles (15 %) | ~1.730 | 133 |
| Crisol | 80–99 | 68 | 19 / 49 | 4 | 6.890 | ~8,3 niveles (42 %) | ~4.010 | 59 |

«Muertes netas» resta lo que dan los relatos de la ruta. Con unas 100 muertes
por visita (25 minutos), el Orbe y Crisol se hacen sin repetir; la
Corona, Celes y Avernum piden volver a algún mapa una vez, lo que D47 permite.
Los relatos nuevos (D55) recortan esas cifras.

**La primera vida, de principio a fin:** una ruta baja, una media y la alta,
unas 8.500 muertes netas (entre 8.480 y 8.600 según la ruta): **~34 horas** a
250 muertes por hora, frente a las ~48 sin relatos.

### Cada ruta, por dentro

**Qué preparar** sale de los biomas, con lo que ya existe en `clima` y
`temperature`. Siempre: comida, agua y cantimplora (`survival`).

| Bioma | Clima posible | Protección (`clima`) | Temperatura | Ropa (`temperature`) |
|---|---|---|---|---|
| pradera | lluvia tóxica o terreno fangoso | Manto de Lluvia o Botas de Estabilidad | 0 | — |
| bosque | hojas petrificantes | Scriptum Petreum | 0 | — |
| costa | neblina densa | Gafas de Claridad | 0 | — |
| selva | vapores asfixiantes | Máscara de Gas Etéreo | +1 | Túnica Fresca |
| pantano | tierra maldita | Manto Bendecido | +1 | Túnica Fresca |
| cueva | vapores asfixiantes | Máscara de Gas Etéreo | 0 | — |
| ruinas | tierra maldita | Manto Bendecido | 0 | — |
| desierto | calor intenso | Sombrero del Desierto | +2 | Manto de Lino y Túnica Fresca |
| volcán | vapores asfixiantes | Máscara de Gas Etéreo | +2 | Manto de Lino y Túnica Fresca |
| montaña | frío extremo | Abrigo Polar | −1 | Chaleco de Lana |
| nieve | ventisca | Armadura Horno | −2 | Capa de Piel y Chaleco de Lana |
| industrial (D57) | *esmog* (propuesta, ver «Biomas nuevos») | *Respirador* (propuesta) | +1 | Túnica Fresca |
| inframundo (D57) | *susurros* (propuesta) | *Amuleto del Vigía* (propuesta) | −1 | Chaleco de Lana |

El Manto de Lluvia, la Armadura Horno, el Manto Bendecido, el Abrigo Polar,
la Capa de Piel y el Manto de Lino son **todos de la ranura Garment**: en la
nieve no se llevan a la vez la Armadura Horno y la Capa de Piel. Es una
decisión de preparación, que es lo que se busca, pero hay que revisarla en
cada bioma extremo. Los biomas marcados *(propuesta)* son de regiones que el
atlas no tiene todavía.

| | Corona, 1–59 | Cetro, 1–59 | Orbe, 1–59 |
|---|---|---|---|
| Regiones | campos de Prontera, cloacas, laberinto del bosque, cueva de Byalan 1–5 (Izlude) | campos de Geffen, torre de Geffen, cueva de los orcos, Mjolnir y su mina, Lutie | campos de Payon y su cueva, campos de Morocc, hormiguero, pirámides 1–5, esfinge 1, Barco hundido (Alberta), campos y playa de Comodo |
| Tiers | 7 T1, 12 T2, 5 T3 | 5 T1, 18 T2, 4 T3 | 11 T1, 22 T2, 9 T3 |
| Biomas | pradera, cueva, bosque, costa | pradera y bosque, cueva, montaña, nieve | bosque, cueva, desierto, ruinas, costa |
| Qué preparar | protección de lluvia; Máscara de Gas en las cloacas; Gafas de Claridad en Byalan | Scriptum Petreum en los bosques; Abrigo Polar en Mjolnir (−1); Armadura Horno y Chaleco de Lana en Lutie (−2) | Sombrero del Desierto y ropa fresca en Morocc (+2); Manto Bendecido en las pirámides |
| MVP | Golden Thief Bug, Baphomet (nivel 81: para volver) | Orc Hero, Orc Lord, Dracula, Stormy Knight y Hatii (estos tres, para volver) | Maya, Osiris, Drake |
| Perspectiva *(idea para `LORE.md`)* | las instituciones: la Corona, la Iglesia, la guardia | el saber: magos y sabios, por qué el clima se volvió anormal | la gente: ladrones, cazadores, bardos, lo que se cuenta en el camino |

| | Celes, 60–79 | Avernum, 60–79 | Crisol, 80–99 |
|---|---|---|---|
| Regiones | campos de Juno, Mjolnir alto, Torre del Reloj, Glast Heim (cloaca 1, iglesia, escalera), torre de Geffen 3–4 | esfinge 2–5, pirámide 6, campos altos de Morocc, cueva de Payon 5, Umbala, playa de Comodo 2 | Einbroch (campos y mina), Lighthalzen (campos y Biolab 1), Hugel (campos, Thanatos 1–6, Odin 1, Abyss Lake 1), Juno (Magma, Kiel, Juperos), Glast Heim, Isla Tortuga, Geffenia, Byalan 6 |
| Tiers | 5 T3, 14 T4 | 8 T3, 5 T4 | 19 T4, 49 T5 |
| Biomas | montaña, pradera *(propuesta: Juno)*, ruinas | desierto, ruinas, selva | industrial (Einbroch y su entorno), ruinas, volcán, cueva, selva, pradera |
| Qué preparar | Abrigo Polar; contra no-muertos (Glast Heim), arma de fuego o sagrada | lo del desierto; Máscara de Gas y Túnica Fresca en Umbala | Respirador en la zona industrial; Máscara de Gas y ropa fresca en Magma; propiedad de arma contra fantasmas en Thanatos |
| MVP | Doppelganger, Mistress | Eddga, Moonlight Flower, Amon Ra, Phreeoni, Pharaoh | Dark Lord, RSX-0806, Tao Gunka, Turtle General |
| Perspectiva | Corona y Cetro se encuentran: lo que vio la Corona y lo que sabe el Cetro | el Orbe baja solo, más lejos y más hondo | la conclusión de la primera historia, la vea quien la vea |

### La ruta del renacido

Es otra ruta (D49), con los detalles pendientes. Lo que dan los datos para
diseñarla:

| Niveles | Qué tiene a mano | Relatos |
|---|---|---|
| 1–59 | las dos rutas bajas que no hizo (entre 51 y 69 mapas), Lasagna y Ayothaya, y su propia ruta en S | normales en lo nuevo; S en lo suyo |
| 60–79 | la ruta media que no hizo y las islas: Brasilis, Louyang, Moscovia, Gonryun, Amatsu, Malangdo, Dewata, Ayothaya (14 mapas) | normales y S |
| 80–99 | las islas altas, Rachel (cueva de hielo, abadía), Veins, Niflheim, Malaya, Rockridge y el Nuevo Mundo (41 mapas de nivel 80–114), y Crisol en S | normales y S |
| hacia el 99 | los 58 mapas de nivel 115–149 (T5S): Thanatos alto, Odin 2–3, el santuario de Rachel, la abadía 2–3, Thor, Biolab 2–4, la pirámide de pesadilla, El Dicastes, Eclage, Manuk y Mora | T5S, con factor ×1,5 |

#### Los mapas que ninguna ruta de la primera vida usa

Son **120 mapas** con monstruos, más 29 retos de nivel 150–199 y 6 mapas de
nivel 123–143 sin región clara. Casi todos están arriba: por Tier (D51), 4 de T1, 2 de T2, 7
de T3, 11 de T4, 38 de T5 y 58 de nivel 115–149.

**Lo que eso significa:** del 1 al 69 solo hay 13 mapas libres. El renacido no
puede subir esos niveles solo con mapas sin usar; ahí tiene que tirar de la
élite en las zonas ya vividas (D52) o de las rutas que su personaje no hizo.
Del 70 en adelante le sobran.

| Región | Mapas | Nivel | Tier | Qué hay | Bioma *(propuesta salvo los del atlas)* |
|---|---:|---|---|---|---|
| Lasagna | 4 + 2 | 4–19; 141–149 | T1; T5S | campos y mazmorra de los Doram (inicio en Renewal); dos pisos de reto arriba | pradera, cueva |
| Ayothaya | 4 | 35–69 | T2–T3 | dos campos, el templo antiguo (2 pisos); MVP Lady Tanee | selva, ruinas |
| Hugel | 1 | 48 | T2 | `hu_fild06` | pradera |
| Brasilis | 3 | 64–71 | T3–T4 | campo y la cascada (2 pisos); MVP Boitata | selva |
| Gonryun | 4 | 64–95 | T3–T5 | campo y la torre (3 pisos); MVP Evil Snake Lord | montaña, cueva |
| Amatsu | 4 | 69–94 | T3–T5 | campo y el castillo (3 pisos); MVP Samurai Specter | bosque, cueva |
| Moscovia | 4 | 71–86 | T4–T5 | campo y el bosque encantado (3 pisos); MVP Gopinich | pantano |
| Louyang | 4 | 75–85 | T4–T5 | campo y la tumba real (3 pisos); MVP White Lady | bosque, cueva |
| Malangdo | 1 | 78 | T4 | la cueva de la isla | costa |
| Dewata | 3 | 78–86 | T4–T5 | campo y el volcán Krakatau (2 pisos); MVP Leak | selva |
| Rachel | 12 + 8 | 88–111; 122–130 | T5; T5S | campos de Arunafeltz, cueva de hielo (3 pisos), isla sin nombre y abadía maldita 1; arriba, el santuario (5 pisos), la abadía 2–3 y la ilusión helada; MVP Atroce, Falling Bishop, Gloom Under Night | estepa *(¿bioma nuevo?)*, nieve, ruinas |
| Rockridge | 3 + 1 | 92–98; 136 | T5; T5S | el puerto y las minas del oeste | desierto, cueva |
| Veins | 5 + 3 | 98–108; 122–136 | T5; T5S | campos del cañón; arriba, el volcán de Thor (3 pisos); MVP Ifrit | desierto, volcán |
| Niflheim | 3 | 102–106 | T5 | la ciudad de los muertos y sus dos campos | inframundo (D57) |
| Malaya | 3 | 107–115 | T5 | dos campos y el hospital de Bangungot | selva, ruinas |
| Nuevo Mundo | 3 + 6 | 106–115; 116–133 | T5; T5S | Splendide (campos), el nido de Nidhoggr; arriba, Manuk y Mora (Bifrost) | bosque, montaña |
| El Dicastes | 5 | 125–135 | T5S | dos campos y la cueva de las Scaraba (3 pisos); MVP las reinas Scaraba | desierto, cueva |
| Eclage | 4 | 142–149 | T5S | campo y el interior del árbol (3 pisos) | bosque |
| T5S de regiones de la primera vida | 27 | 116–149 | T5S | Thanatos 7–12, Abyss Lake 2–3, Odin 2–3 (Hugel); Biolab 2–4 (Lighthalzen); la pirámide de pesadilla, el volcán de Morocc y los campos de la Morocc en ruinas; Geffenia 2 y su ilusión; Juperos (núcleo); los Glast Heim de reto 1; `prt_q` y la prisión de Prontera; la ilusión de Byalan | según su región |
| Verus | 1 | 147 | T5S | el búnker (`un_bunker`); el resto de Verus es reto de nivel 150 o más | ruinas |
| Sin región clara | 2 + 6 | 100–143 | T5–T5S | `slabw01` (MVP Venomous Chimera) y `sp_os`; fuera de las rutas, `sp_rudus` y cinco `ba_*` | por mirar en el juego |

**Retos de nivel 150–199** (D57), para un renacido 99 bien equipado: las
ilusiones (`ein_d02_i`, `tur_d03_i`, `tur_d04_i`, `ant_d02_i`, `prt_mz03_i`),
la Torre del Reloj y Glast Heim de reto (`c_tower2_`, `c_tower3_`,
`gl_cas01_`), Verus (`verus01`–`03`, `ver_eju`, `ver_tunn`), Magma 3, la mina
3 de Einbroch, Biolab de pesadilla, `ra_fild10`–`11` y otros sin región clara.

**Mapas de la primera vida que podrían pasar al renacido,** si se quiere darle
más mapas propios del 1 al 59 sin quitar mucho a las rutas: Lutie (3 mapas,
del Cetro), los campos y la playa de Comodo (9, del Orbe), el Barco hundido de
los novatos (`treasure_n1`–`n2`, del Orbe) y Umbala (4, de Avernum).

**El final, sin que sobre (D56).** Del 80 al 99 el renacido tiene unos 99
mapas con relatos, y los del T5S pagan ×1,5: con todo hecho, los relatos solos
le subirían la banda entera, y llegaría al 99 con mucho por tocar. Formas de
evitarlo, a combinar:

- **Medirlo, no suponerlo:** sumar el contenido del T5S y ajustarlo para que
  quien lo hace todo llegue al 99 cerca del final.
- **Abrir el T5S más tarde**, hacia el 95, para que no se solape con el resto
  de la banda.
- **Que los relatos del T5S paguen en otra cosa**, no solo en nivel: EXP de
  trabajo (el renacido llega al 99 con job 68 de 70), logros, botín S o la
  historia. Así, llegar al 99 con relatos pendientes no deja nada a medias.
- **Menos factor:** que el T5S no tenga el ×1,5 de un Tier por encima.

## Relatos nuevos

Con las rutas, cada jugador ve entre 111 y 123 mapas en su primera vida, y del
1 al 59 sus relatos solo dan el 8–10 % de la EXP. Ahí es donde hacen falta
más. Se aceptan estas ideas para diseñar (D55); el orden, de más barata a más
cara, es propuesta:

| Idea | Clave | Tamaño | Por qué sirve | Coste |
|---|---|---|---|---|
| Cambio de clase | `job:<clase>` | Hito | marca las etapas de D50; cae justo en 1.ª y 2.ª clase | bajo: `adventure` compara la clase al cambiar de mapa |
| Tiers S | `tier:<n>S`, `chesttier:<n>S` | Hito, Mayor | relatos nuevos para el renacido | bajo, con D52 |
| Descansar por primera vez en cada ciudad | `rest:<ciudad>` | Media | da una razón para cada posada y taberna de H3 | bajo |
| Enemigo nuevo por Tier | `foe:<raza>:<tier>` | Menor | crece con los Tiers (10 razas × 5 Tiers, y otra vez en S) y premia ir a zonas distintas | bajo |
| Jefes que no son MVP | `boss:<mob>` | Media | hay muchos en Renewal y salen a todos los niveles | medio: lista de monstruos |
| El piso más hondo de una mazmorra | `deep:<mazmorra>` | Mayor | ya está en la tabla de tamaños de ADVENTURE y no tiene clave | medio: el atlas tiene que agrupar pisos |
| Capítulos de cada ruta | `ruta:<ruta>:<n>` | Hito | la historia de cada ruta (D48), con lo que escriba `LORE.md` | alto: es contenido escrito |
| Élite en una zona vivida | `elite:<mapa>` | Mayor | el núcleo del renacido (D49, D52) | alto |
| Lugares notables | `vista:<id>` | Menor | un mirador o un resto en cada mapa: más relatos sin mapas nuevos | alto: puntos a mano en un CSV |
| Oficios | `oficio:<tipo>:<bioma>` | Menor | cuando existan la pesca y la minería | alto |

Descartado (D55): contar las **quests oficiales** como relato.

## Biomas nuevos

Decididos en D57; lo de abajo es la propuesta de diseño. Se añadirán a
`BIOMES` de `build_atlas.cjs` y a `clima` al hacer sus regiones en H3.

**Industrial.** La contaminación de Einbroch se extiende por la región: no es
el bioma de una ciudad, sino una mancha que sale de ella.

- **Mapas:** los campos de Einbroch y Einbech (`ein_fild*`) como núcleo; los
  campos vecinos de Lighthalzen, Juno y Hugel que toquen Einbroch, como borde
  (a confirmar con el mapa del mundo). La mina (`ein_dun*`) sigue siendo
  `cueva`.
- **Clima:** *esmog*, una niebla visual con **Silence**: la tos no deja
  lanzar conjuros. No repite ningún estado de los climas de hoy.
- **Protección:** un *Respirador*, objeto nuevo de `clima` (Lower Head, para
  no chocar con la ranura Garment).
- **Temperatura:** +1, el calor de las fundiciones.
- **Para la historia:** el borde puede crecer o retroceder con lo que haga el
  jugador (una cadena de rumores, un refugio), una consecuencia que queda en el
  mundo (D42).

**Inframundo.** Niflheim y lo que se le parezca.

- **Mapas:** `niflheim`, `nif_fild01`–`02` y, si encaja, partes del
  Avernum.
- **Clima:** *susurros*, nubes oscuras con **Confusion**: los muertos te
  hablan y te pierdes. Tampoco repite ningún estado de hoy.
- **Protección:** un amuleto (accesorio), nombre por decidir; en la tabla de
  arriba, *Amuleto del Vigía*.
- **Temperatura:** −1, el frío de los muertos.

## Orden de las regiones de H3

Decidido (D54): primero **Corona → Celes → Crisol**, así un Swordman o
un Acolyte puede jugar del 1 al 99 y ver la conclusión de la primera historia
antes de abrir lo demás (D19). Después, propuesta:

| Ola | Ruta | Regiones |
|---|---|---|
| H1 | Corona, 1–59 | Prontera e Izlude |
| 1 | Celes, 60–79 | Juno, Aldebaran (Mjolnir y la Torre del Reloj), Glast Heim, la torre de Geffen |
| 2 | Crisol, 80–99 | Einbroch (con el bioma industrial), Lighthalzen, Hugel, Juno alto, Alberta (Isla Tortuga), Geffenia |
| 3 | Cetro, 1–59 | Geffen y Lutie (Aldebaran ya está) |
| 4 | Orbe y Avernum, 1–79 | Payon, Morocc, Alberta, Comodo, Umbala |
| 5 y siguientes | Renacido | por diseñar (D49) |

## Lo que hay que corregir

No se toca nada ahora (es planificación); queda para H3.

- **`tier_of.cjs` mezcla eras.** Suma los spawns de todos los scripts del
  índice, también los de `npc/pre-re/` y los de eventos que Renewal no carga.
  Debería filtrar por las líneas `load renewal`. Es la causa más probable de
  las diferencias de abajo. Con D51 cambia además su tabla de Tiers.
- **18 mapas con otro Tier** (con la tabla de hoy) según los spawns de
  Renewal: `treasure01`, `iz_dun00`, `iz_dun01`, `pay_dun01` y `gef_dun00`
  (1 → 2, nivel 40–43); `prt_fild09` (1 → 2, 54); `mjolnir_12`, `pay_dun04`,
  `um_fild01` y `mosk_fild02` (2 → 3, 63–71); `gef_dun03` (1 → 3, 77);
  `gon_dun01`, `gon_dun02` y `gon_dun03` (3 → 4, 92–95); `glast_01`
  (1 → 4, 104); `odin_tem01` (3 → 4, 114); `odin_tem02` y `odin_tem03` (4 y
  3 → 5, 126–127). `glast_01` y `gef_dun03` son los que más importan: hoy un
  personaje de nivel 10 encuentra allí un cofre de Tier 1 entre monstruos de
  nivel 77 o 104.
- **Mapas del atlas sin monstruos en Renewal:** `bossnia_01`–`04` (solo los
  pone un script de evento que no se carga) y `um_dun01`–`02`. Tienen cofre y
  nadie con quien pelear.
- **136 de los 313 mapas no están en el atlas** (marcados con `*` en el
  apéndice), y con ellos sus relatos de mapa.
- **Los retos de nivel 150 o más** (D57) se quedan: los ocho que ya están en
  el atlas como Tier 6 (`prt_mz03_i`, `iz_d05_i`, `abyss_04`, `c_tower2_`,
  `c_tower3_`, `gl_cas01_`, `mag_dun03`, `ein_dun03`) pasan a marcarse como
  retos al aplicar D51, porque el Tier 6 desaparece.

## Para decidir

Lo que se decida va a [`DECISIONS.md`](./DECISIONS.md):

1. **La ruta del renacido** (D49): por dónde empieza y cómo sigue, con los
   mapas de «Los mapas que ninguna ruta de la primera vida usa».
2. **Cómo se refuerza una zona S** solo para el renacido, con un compañero que
   no lo es.
3. **El final sin que sobre** (D56): qué combinación de las cuatro formas.
4. **Qué relatos nuevos siguen** (D55). El cambio de clase ya está hecho
   (D59, `adventure` 0.6.0); quedan, de los baratos, los Tiers S, el primer
   descanso en cada ciudad y el enemigo nuevo por Tier.
5. **Los biomas nuevos** (D57): qué mapas forman el borde industrial, y el
   clima y la protección de cada uno.
6. **Cómo se marcan los retos** de nivel 150 o más en el atlas al quitar el
   Tier 6.

## Apéndice: los mapas de cada ruta

Cada mapa con su nivel medio y su Tier (D51). `·m` es mazmorra (sin marca,
campo) y `*`, que no está en el atlas. Un mapa va a la ruta por su región y
por su nivel medio (corte en 60 y en 80); en la del renacido van los de
regiones que ninguna ruta de la primera vida usa y todos los de nivel 115 o
más.

### Corona, 1–59

- **Prontera**: `prt_fild08` 3 T1, `prt_fild01` 3 T1, `prt_fild06` 5 T1, `prt_fild05` 14 T1, `prt_fild00` 15 T1, `prt_fild07` 15 T1, `prt_fild04` 18 T1, `prt_sewb1` 21·m T2, `prt_sewb2` 22·m T2, `prt_fild02` 23 T2, `prt_sewb3` 27·m T2, `prt_sewb4` 32·m T2, `prt_maze02` 33·m T2, `prt_maze01` 34·m T2, `prt_fild10` 34 T2, `prt_fild03` 35 T2, `prt_fild09` 54 T3, `prt_fild11` 54 T3, `prt_maze03` 57·m T3
- **Izlude**: `iz_dun00` 41·m T2, `iz_dun01` 42·m T2, `iz_dun02` 46·m T2, `iz_dun03` 51·m T3, `iz_dun04` 57·m T3

### Cetro, 1–59

- **Geffen**: `gef_fild07` 4 T1, `gef_fild00` 5 T1*, `gef_fild04` 10 T1*, `gef_fild01` 14 T1*, `gef_fild05` 23 T2*, `gef_fild09` 33 T2*, `gef_fild02` 36 T2*, `gef_dun00` 43·m T2, `gef_fild10` 44 T2*, `gef_fild03` 45 T2*, `gef_fild11` 46 T2*, `orcsdun01` 47·m T2, `orcsdun02` 53·m T3, `gef_dun01` 54·m T3
- **Aldebaran**: `mjolnir_09` 13 T1*, `mjolnir_01` 25 T2*, `mjo_dun01` 26·m T2, `mjolnir_06` 27 T2*, `mjolnir_02` 34 T2*, `mjo_dun02` 42·m T2, `mjo_dun03` 46·m T2, `mjolnir_10` 50 T2*, `mjolnir_08` 56 T3*, `mjolnir_07` 58 T3*
- **Lutie**: `xmas_dun01` 31·m T2, `xmas_dun02` 39·m T2, `xmas_fild01` 42 T2

### Orbe, 1–59

- **Morocc**: `moc_fild07` 4 T1*, `moc_fild12` 8 T1*, `moc_fild11` 13 T1, `moc_fild18` 15 T1*, `moc_fild01` 22 T2*, `moc_fild02` 24 T2*, `moc_pryd01` 26·m T2, `anthell01` 30·m T2, `anthell02` 32·m T2, `moc_pryd02` 45·m T2, `moc_fild03` 46 T2*, `moc_fild13` 49 T2*, `moc_pryd03` 54·m T3, `moc_pryd05` 55·m T3, `in_sphinx1` 59·m T3, `moc_pryd04` 59·m T3
- **Payon**: `pay_fild03` 5 T1, `pay_fild01` 7 T1*, `pay_fild06` 17 T1*, `pay_fild02` 18 T1*, `pay_fild08` 18 T1, `pay_dun00` 23·m T2, `pay_fild04` 27 T2*, `pay_fild07` 27 T2*, `pay_fild09` 33 T2*, `pay_dun01` 42·m T2, `pay_dun02` 45·m T2, `pay_dun03` 54·m T3, `pay_fild10` 56 T3*
- **Comodo**: `cmd_fild08` 32 T2*, `beach_dun3` 41·m T2, `cmd_fild02` 47 T2*, `cmd_fild04` 47 T2*, `cmd_fild07` 48 T2*, `cmd_fild09` 49 T2*, `cmd_fild01` 56 T3, `cmd_fild03` 58 T3*, `cmd_fild06` 60 T3*
- **Alberta**: `treasure_n1` 14·m T1*, `treasure_n2` 17·m T1*, `treasure01` 40·m T2, `treasure02` 45·m T2

### Celes, 60–79

- **Aldebaran**: `mjolnir_12` 63 T3, `mjolnir_04` 66 T3*, `mjolnir_11` 67 T3*, `mjolnir_03` 68 T3*, `mjolnir_05` 72 T4*, `alde_dun03` 73·m T4, `c_tower1` 78·m T4
- **Juno**: `yuno_fild01` 67 T3*, `yuno_fild12` 70 T4*, `yuno_fild08` 75 T4*, `yuno_fild09` 76 T4*, `yuno_fild11` 78 T4*, `yuno_fild06` 79 T4*
- **Glast Heim**: `gl_sew01` 74·m T4, `gl_church` 77·m T4, `gl_step` 79·m T4
- **Geffen**: `gef_fild08` 74 T4*, `gef_dun03` 77·m T4, `gef_dun02` 77·m T4

### Avernum, 60–79

- **Morocc**: `moc_fild16` 61 T3*, `moc_fild17` 62 T3*, `in_sphinx2` 66·m T3, `in_sphinx3` 70·m T4, `in_sphinx4` 70·m T4, `moc_pryd06` 76·m T4, `in_sphinx5` 77·m T4
- **Umbala**: `um_fild02` 65 T3*, `um_fild01` 67 T3, `um_fild04` 68 T3*, `um_fild03` 72 T4*
- **Comodo**: `beach_dun2` 65·m T3
- **Payon**: `pay_dun04` 66·m T3

### Crisol, 80–99

- **Glast Heim**: `gl_in01` 80·m T4, `gl_cas01` 85·m T4, `gl_chyard` 88·m T5, `gl_prison` 89·m T5, `gl_prison1` 91·m T5, `gl_sew02` 96·m T5, `gl_cas02` 101·m T5, `gl_sew03` 103·m T5, `gl_sew04` 103·m T5, `glast_01` 104·m T5, `gl_dun02` 105·m T5, `gl_dun01` 106·m T5, `gl_knt01` 107·m T5, `gl_knt02` 110·m T5
- **Hugel**: `tha_t01` 86·m T5, `hu_fild04` 87 T5*, `hu_fild05` 89 T5*, `hu_fild01` 89 T5*, `hu_fild02` 90 T5*, `tha_t04` 97·m T5, `tha_t02` 99·m T5, `tha_t03` 102·m T5, `tha_t05` 106·m T5, `abyss_01` 108·m T5, `tha_t06` 109·m T5, `odin_tem01` 114·m T5
- **Juno**: `yuno_fild07` 80 T4*, `yuno_fild02` 80 T4*, `yuno_fild04` 81 T4*, `yuno_fild03` 82 T4*, `mag_dun01` 97·m T5, `mag_dun02` 105·m T5, `kh_dun01` 108·m T5, `kh_dun02` 112·m T5, `kh_kiehl01` 113·m T5*, `juperos_01` 113·m T5, `juperos_02` 115·m T5
- **Einbroch**: `ein_fild08` 82 T4*, `ein_fild07` 82 T4*, `ein_fild09` 84 T4*, `ein_fild06` 84 T4*, `ein_fild04` 88 T5*, `ein_fild05` 88 T5*, `ein_dun01` 88·m T5, `ein_fild03` 90 T5*, `ein_dun02` 94·m T5
- **Aldebaran**: `c_tower2` 80·m T4, `alde_dun01` 80·m T4, `alde_dun04` 81·m T4, `c_tower4` 81·m T4, `alde_dun02` 83·m T4, `c_tower3` 85·m T4
- **Alberta**: `tur_dun01` 82·m T4, `tur_dun02` 91·m T5, `tur_dun05` 93·m T5*, `tur_dun03` 96·m T5, `tur_dun04` 98·m T5
- **Geffen**: `gef_fild06` 80 T4*, `gefenia01` 113·m T5, `gefenia03` 115·m T5, `gefenia04` 115·m T5
- **Lighthalzen**: `lhz_fild01` 85 T4*, `lhz_fild02` 86 T5*, `lhz_fild03` 89 T5*, `lhz_dun01` 111·m T5
- **Comodo**: `beach_dun` 97·m T5
- **Payon**: `pay_d03_i` 109·m T5*
- **Izlude**: `iz_dun05` 113·m T5

### Renacido

- **Rachel**: `ra_fild12` 88 T5*, `ra_fild01` 92 T5*, `ra_fild08` 94 T5*, `nameless_n` 98·m T5, `ice_dun01` 98·m T5, `ra_fild03` 99 T5*, `ra_fild04` 100 T5*, `ice_dun02` 102·m T5, `ra_fild05` 103 T5*, `ra_fild06` 105 T5*, `ice_dun03` 106·m T5, `abbey01` 111·m T5, `ra_san03` 122·m T5S+, `ra_san01` 123·m T5S+, `ra_san02` 123·m T5S+, `abbey02` 124·m T5S+, `ra_san04` 126·m T5S+, `ra_san05` 126·m T5S+, `abbey03` 130·m T5S+, `ice_d03_i` 130·m T5S+*
- **Hugel**: `hu_fild06` 48 T2*, `tha_t08` 120·m T5S+, `abyss_02` 120·m T5S+, `tha_t07` 120·m T5S+, `abyss_03` 121·m T5S+, `tha_t10` 122·m T5S+, `tha_t09` 123·m T5S+, `tha_t11` 124·m T5S+, `tha_t12` 124·m T5S+, `odin_tem02` 126·m T5S+, `odin_tem03` 127·m T5S+
- **Nuevo Mundo (Splendide, Manuk, Mora)**: `spl_fild02` 106 T5*, `spl_fild03` 115 T5*, `nyd_dun01` 115·m T5, `man_fild01` 116 T5S+*, `spl_fild01` 116 T5S+*, `man_fild03` 125 T5S+*, `man_fild02` 129 T5S+*, `bif_fild01` 132 T5S+*, `bif_fild02` 133 T5S+*
- **Veins**: `ve_fild07` 98 T5*, `ve_fild01` 100 T5*, `ve_fild02` 101 T5*, `ve_fild04` 103 T5*, `ve_fild03` 108 T5*, `thor_v02` 122·m T5S+, `thor_v01` 131·m T5S+, `thor_v03` 136·m T5S+
- **Lasagna**: `lasa_fild01` 4 T1*, `lasa_fild02` 14 T1*, `lasa_dun01` 19·m T1*, `lasa_dun_q` 19·m T1*, `lasa_dun02` 141·m T5S+*, `lasa_dun03` 149·m T5S+*
- **Morocc**: `moc_prydn1` 118·m T5S+, `moro_vol` 120·m T5S+*, `moc_prydn2` 131·m T5S+, `moc_fild22` 133 T5S+*, `moc_fild21` 133 T5S+*, `moc_fild20` 133 T5S+*
- **El Dicastes**: `dic_fild01` 125 T5S+*, `dic_fild02` 129 T5S+*, `dic_dun01` 130·m T5S+, `dic_dun03` 133·m T5S+, `dic_dun02` 135·m T5S+
- **Ayothaya**: `ayo_fild01` 35 T2*, `ayo_fild02` 51 T3*, `ayo_dun01` 62·m T3, `ayo_dun02` 69·m T3
- **Gonryun**: `gon_fild01` 64 T3*, `gon_dun02` 92·m T5, `gon_dun01` 92·m T5, `gon_dun03` 95·m T5
- **Amatsu**: `ama_fild01` 69 T3*, `ama_dun02` 85·m T4, `ama_dun01` 86·m T5, `ama_dun03` 94·m T5
- **Moscovia**: `mosk_fild02` 71 T4, `mosk_dun01` 72·m T4, `mosk_dun02` 83·m T4, `mosk_dun03` 86·m T5
- **Louyang**: `lou_dun02` 75·m T4, `lou_dun01` 76·m T4, `lou_fild01` 76 T4*, `lou_dun03` 85·m T5
- **Rockridge**: `harboro2` 92·m T5*, `rockrdg1` 96·m T5*, `rockrdg2` 98·m T5*, `rockmi1` 136·m T5S+*
- **Eclage**: `ecl_fild01` 142 T5S+*, `ecl_tdun01` 147·m T5S+*, `ecl_tdun02` 147·m T5S+*, `ecl_tdun03` 149·m T5S+*
- **Brasilis**: `bra_dun01` 64·m T3, `bra_dun02` 69·m T3, `bra_fild01` 71 T4*
- **Dewata**: `dew_fild01` 78 T4*, `dew_dun01` 81·m T4, `dew_dun02` 86·m T5
- **Niflheim**: `niflheim` 102 T5*, `nif_fild01` 103 T5*, `nif_fild02` 106 T5*
- **Malaya**: `ma_dun01` 107·m T5*, `ma_fild01` 108 T5*, `ma_fild02` 115 T5*
- **Lighthalzen**: `lhz_dun02` 133·m T5S+, `lhz_dun03` 141·m T5S+, `lhz_dun04` 141·m T5S+
- **?**: `slabw01` 100·m T5*, `sp_os` 120·m T5S+*
- **Geffen**: `gefenia02` 116·m T5S+, `gef_d01_i` 139·m T5S+*
- **Glast Heim**: `gl_chyard_` 121·m T5S+, `gl_cas02_` 146·m T5S+
- **Prontera**: `prt_q` 134 T5S+, `prt_prison` 144·m T5S+
- **Malangdo**: `mal_dun01` 78·m T4
- **Juno**: `jupe_core` 116·m T5S+
- **Verus**: `un_bunker` 147·m T5S+*
- **Izlude**: `iz_d04_i` 149·m T5S+
