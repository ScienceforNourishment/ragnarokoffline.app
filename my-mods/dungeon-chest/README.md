# Cofres de dungeon

El mod agrega un cofre interactivo a cada mapa de dungeon de
[`world-atlas`](../world-atlas/README.md) (las filas `kind=dungeon` de su
CSV): 183 mapas en total. Los mapas se agrupan por la dificultad aproximada de
sus monstruos. Al abrirlo, lo normal es una **pieza de equipo sin identificar
con 1 a 4 afijos** del Tier del mapa; si no, una comida del Tier.

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.5.0 (la de `mod.json`): abrir un cofre publica dos
  **relatos de `adventure`** 0.2 (dependencia suave): `chest:<mapa>` (Menor,
  el primer cofre de cada mapa) y `chesttier:<n>` (Mayor, el primer cofre de
  cada Tier), compartidos con el grupo que esté en el mismo mapa.
  `F_DungeonChest_Open` devuelve ahora el Tier del cofre abierto (antes 1) y
  el cofre llama a `F_DungeonChest_Tale` tras `close2`. Generado con
  `build_chests.cjs` (183 cofres, `--check` al día). Sin probar en el juego
- La 0.4.1: el comando de GM **`@cofre`** para
  probar sin buscar el cofre (ver «Probarlo»); cada cofre apunta su nombre en
  `$@dc_npc_<mapa>$` al arrancar. Sin probar en el juego; comprobado sin el
  juego: los 183 cofres generados lo apuntan, llaves y comillas equilibradas.
  La 0.4.0: **botín de equipo** (D35, ver
  «Botín de equipo»). Las piezas salen de las listas de `arpg-equipments` y
  los afijos y su sorteo de `affix-forge`, importados a CSV propios. Un 5 %
  de las aperturas da un **disfraz** (D36). Trae el **Herrero de Afijos** en
  Prontera (D37) y la tabla de nombres de los afijos **en español** para el
  cliente. Declara `"era": "renewal"`. La 0.3.0: `npc/dungeon-chests.txt` se genera
  desde el CSV del atlas con `registry/tools/dungeon-chest/build_chests.cjs`.
  Los 179 cofres de antes salen idénticos; se suman los 4 retos que añadió
  `world-atlas` 0.2.0: `iz_d04_i` (T5), `iz_d05_i` (T6), `prt_mz03_i` (T6) y
  `prt_prison` (T5)
- **Probado en el juego (0.4.1, 2026-10-23),** con
  [`SESION-DE-PRUEBA.md`](../SESION-DE-PRUEBA.md): el botín de equipo entero.
  La pieza llega sin identificar; con la Lupa es de nivel bajo y trae de 1 a 4
  afijos con nombre en español; la mayoría son de tu clase; en una mazmorra
  de ruinas o de hielo el primer afijo suele ser una resistencia de su bioma;
  con la mochila llena dice «Dentro hay algo pesado…» y el cofre no se marca
  abierto; sale algún disfraz y cambia el aspecto. El **Herrero de Afijos**
  entero: solo lista piezas identificadas, los cuatro precios, quitar,
  volver a sortear, pasar uno y pasar todos sin perder el refinado, y «No te
  alcanza» sin cobrar. Los cofres de `prt_prison` (T5) y `prt_mz03_i` (T6)
  aparecen y se abren. La carga del 2026-10-23 a las 21:38 no tiene errores
  de ningún archivo del mod
- **Balance, más adelante:** la fuerza de las piezas del Tier 1 (`loot_tiers.csv`)
  vale por ahora; se ajusta al medir el balance de H1
- **Probado en el juego (0.5.0, 2026-10-24):** `@cofre prt_sewb1` deja en
  una celda libre al sur del cofre y dice sus coordenadas y si está abierto;
  `@cofre aqui`, `@cofre cerrar` (deja abrirlo otra vez) y `@cofre mover`;
  `@cofre prontera` dice «no tiene cofre». Los cofres de `iz_d04_i` (T5) e
  `iz_d05_i` (T6) aparecen y dan lo de su Tier
- **Sin probar:** que el log, tras una sesión abriendo cofres, no se queje de
  `getitem3` ni `getitem4` (se mira al final de la sesión de prueba)
- **Actualizado:** 2026-10-24

- **Cantidad:** un cofre por mapa.
- **Ubicación:** aleatoria dentro de cada mapa; solo se eligen celdas
  transitables.
- **Apariencia:** sprite `WA_TREASURE` (ID 3075), disponible en el cliente.
- **Cambio de posición para pruebas:** si nadie abre un cofre durante 10
  minutos, se teleporta una vez a otra ubicación aleatoria.
- **Botín:** solo el primer jugador que lo abra y pueda cargar el objeto recibe
  algo: equipo con afijos (80 %) o una unidad de la comida de su Tier. Después de abrirlo, el cofre reaparece en
  una nueva ubicación aleatoria 10 minutos más tarde. Mientras tanto, no
  entrega más botín.
- **Reinicio del servidor:** vuelve a colocar los cofres y reinicia sus ciclos;
  el estado de apertura y los temporizadores no persisten entre reinicios.

## Tiers y recompensas de prueba

**El Tier lo decide `world-atlas` cuando está cargado.** Al abrir un cofre,
`F_DungeonChest_Open` pregunta por el mapa del cofre a `F_Atlas_Tier` y toma
la comida de ese Tier (`F_DungeonChest_Item`). Si el atlas no está cargado, no
conoce el mapa o devuelve un Tier sin recompensa, se usan el Tier y el item
escritos en la definición del cofre. Como las definiciones se generan desde
el mismo CSV, coinciden siempre con el atlas mientras se regenere tras
cambiarlo; el nombre del NPC (`Cofre T4`) también sale del atlas al generar.

La dificultad se calcula como promedio ponderado por cantidad de spawn de los
monstruos normales en cada mapa. Se excluyen los MVP y estos spawns estacionales:
Golden Poring, Delightful Lude, Sock/Gift Stealing Raccoon y Organic/Inorganic
Pumpkin. Los niveles son una estimación para ordenar mapas, no un nivel oficial
recomendado.

| Tier | Nivel promedio del mapa | Mapas | Recompensa |
|---|---:|---:|---|
| 1 | menor de 40 | 20 | Fried Grasshopper Legs (ID `12041`) |
| 2 | 40–59 | 20 | Seasoned Sticky Webfoot (ID `12042`) |
| 3 | 60–89 | 46 | Bomber Steak (ID `12043`) |
| 4 | 90–119 | 49 | Herb Marinade Beef (ID `12044`) |
| 5 | 120–149 | 40 | Lutie Lady's Pancake (ID `12045`) |
| 6 | 150 o más | 8 | Shiny Marinade Beef (ID `12071`) |

La tabla de recompensas vive en `REWARDS` de `build_chests.cjs`; de ella salen
`F_DungeonChest_Item` y la recompensa de reserva de cada cofre.

La lista original (los 179 primeros) partió de los mapas de dungeon de
[RateMyServer](https://ratemyserver.net/dungeonmap.php) y usa los spawns de
Renewal de `mods/navigation-server-monsters/mob-index.tsv` en este repositorio.
Hoy la lista es el atlas. Quedaron fuera los 17 mapas de RateMyServer que no
tienen spawns normales en ese índice: `alb2trea`, `clock_01`, `ice_dun04`, `izlu2dun`, `moc_prydb1`,
`nameless_i`, `nameless_in`, `nyd_dun02`, `odin_past`, `que_lhz`, `que_thor`,
`ra_temin`, `ra_temple`, `tha_scene01`, `thana_boss`, `thana_step` y
`thor_camp`.

## Probarlo

1. Copia la carpeta `dungeon-chest` a la carpeta de mods de la
   aplicación, o agrégala desde **Settings → Mods → Add mod from folder**. Al
   actualizar una instalación anterior, reemplaza la carpeta completa en vez
   de copiar los archivos encima: los scripts `.txt` que ya no vienen en la
   versión nueva permanecerían activos si no se eliminan.
2. Activa el mod y aplica los cambios para recargar los scripts del servidor.
3. Entra a varios mapas, como `pay_dun00`, `pay_dun04` y `abyss_04`, y confirma
   que el cofre muestre el Tier y entregue la comida correspondiente.
4. Para los cofres nuevos de 0.3.0, entra a `prt_prison` (Tier 5) o
   `prt_mz03_i` (Tier 6) con `@warp`: el cofre debe llamarse `Cofre T5` o
   `Cofre T6` y no debe salir `could not find a passable cell` en el log.

**Comando de prueba `@cofre` (GM).** Los cofres están a propósito en sitios
aleatorios y a veces tras un muro; para probar el botín no hace falta
buscarlos (`npc/chest-command.txt`):

| Comando | Qué hace |
|---|---|
| `@cofre` | te lleva a una celda libre al sur del cofre del mapa actual y dice si está abierto |
| `@cofre <mapa>` | lo mismo con el cofre de otro mapa (`@cofre iz_d04_i`) |
| `@cofre aqui` | trae el cofre del mapa actual a la celda delante de ti; el temporizador no lo vuelve a mover mientras siga cerrado |
| `@cofre cerrar` | lo vuelve a cerrar sin moverlo, para abrirlo otra vez sin esperar los 10 minutos |
| `@cofre mover` | lo manda a otra celda aleatoria, como hace el temporizador |

Para abrir muchos seguidos: `@cofre aqui` una vez y luego, tras cada
apertura, `@cofre cerrar`.

## Guía: agregar un cofre a otro mapa

`npc/dungeon-chests.txt` es un archivo **generado**: no lo edites a mano. Un
cofre por cada fila `kind=dungeon` de
`registry/tools/world-atlas/atlas.csv`; añadir un cofre es añadir una fila.

1. **Confirma que el mapa es válido para el servidor.** Debe estar cargado por
   rAthena y aparecer en la lista de mapas del mundo. Para mantener el alcance
   del mod, confirma también que sea un mapa de dungeon y que tenga spawns
   normales en el índice de monstruos; no lo agregues solo porque su nombre
   parezca un dungeon.
2. **Añade el mapa al atlas** con `kind=dungeon` y su Tier, siguiendo la
   guía de [`world-atlas`](../world-atlas/README.md#cambiar-o-añadir-un-mapa)
   (`tier_of.cjs` sugiere el Tier con el criterio de la tabla de arriba), y
   regenera el atlas con `node registry/tools/world-atlas/build_atlas.cjs`.
   Toda fila `kind=dungeon` recibe un cofre: si un mapa de dungeon no debe
   tenerlo, hoy no hay forma de excluirlo; habría que añadirla al generador.
3. **Regenera los cofres:**
   `node registry/tools/dungeon-chest/build_chests.cjs`. Usa la validación del
   atlas (mapas duplicados, Tier fuera de rango) y escribe un cofre por mapa,
   ordenados por nombre, con el nombre interno `#dcp_<mapa>`, el Tier del
   atlas y la recompensa de ese Tier. `--check` falla si el archivo está
   desactualizado; córrelo también tras cambiar solo el atlas, porque un
   Tier nuevo cambia el nombre del cofre y su recompensa de reserva.
4. **Recompensas.** Una recompensa distinta por Tier se cambia en `REWARDS`
   del generador. Antes de introducir un item distinto, confirma que exista en
   la era soportada y que el personaje pueda recibirlo; `checkweight` solo
   evita exceder capacidad, no valida que el ID tenga una definición útil.
   El equipo no va aquí: está en los CSV del botín (ver «Botín de equipo»).
5. **Las funciones globales** (`F_DungeonChest_Move`, `_Item`, `_Open`,
   `_Tick`) también salen del generador. Para cambiarlas, edita la plantilla en
   `build_chests.cjs` y conserva los tabuladores entre los campos de
   `function script`: rAthena los necesita para reconocer esa sintaxis.
   `F_DungeonChest_Open` comprueba si ya se abrió, vuelve a comprobarlo
   después del diálogo y valida el peso antes de marcarlo abierto y entregar
   el item. No quites estas comprobaciones: así solo el primer jugador recibe
   el botín. `OnTimer600000` son 600 000 ms (10 minutos, `TICK_MS`); sin
   abrir, el cofre se reubica una vez, y al abrirse se repone en otra
   ubicación tras ese intervalo. Un reinicio del servidor reinicia su estado y
   temporizador.
6. **Ten en cuenta los límites de colocación.** `F_DungeonChest_Move` intenta
   hasta 500 coordenadas aleatorias entre 20 y 280 y usa `checkcell` para
   elegir una celda transitable antes de `movenpc`. En mapas pequeños, mapas
   cuya geometría no cubre ese rango u otros mapas con pocas celdas válidas,
   esos intentos podrían fallar; revisa el `debugmes` del map-server y no
   declares el cofre probado hasta confirmar su posición en el juego.
7. **Valida la carga, no solo el archivo.** Actualiza el total de cofres y
   las cantidades por Tier de este README. Reemplaza la carpeta instalada del
   mod, recarga los scripts del servidor y revisa
   `ragnarok-stack logs map 100`. Un `Unknown syntax` al principio del archivo
   puede impedir que se carguen todos sus cofres; que el archivo esté listado
   en `map_conf.txt` no prueba que rAthena lo haya parseado. Finalmente,
   encuentra el cofre en el mapa, ábrelo con espacio en inventario y vuelve a
   hablar con él para comprobar que ya no entregue otro objeto.

Este mod no requiere `affix-forge` ni `arpg-equipments`: tomó sus datos una
vez, y no deben activarse con él (serían dos sistemas de afijos a la vez).

## Botín de equipo

Decidido el 2026-10-23 (D35, D36). Al abrir un cofre:

0. Con la probabilidad `costume_pct` (5 %) sale un **disfraz** de
   `costumes.csv`: una pieza de las ranuras de disfraz (cabeza alta, media o
   baja, y capa), que solo cambia el aspecto. Llega sin identificar y sin
   afijos. Son los 51 disfraces de `arpg-equipments`, de cualquier Tier.
1. Si no, con la probabilidad `gear_pct` de su Tier (80 %) sale **equipo**;
   si tampoco, la comida del Tier, como antes.
2. **Qué pieza:** una de `loot.csv` de ese Tier. Con la probabilidad
   `class_pct` (70 %) se elige entre las que puede equipar quien lo abre, si
   hay alguna; si no, cualquiera del Tier, también de otra clase. La clase se
   compara con los `Jobs` del item_db (un Lord Knight o un Rune Knight
   cuentan como Knight); no mira las restricciones de clase alta o bebé.
3. **Sin identificar:** llega al inventario sin identificar, y el cofre solo
   dice si es un arma, una armadura o equipo de sombra. Una Lupa (611)
   enseña qué es y sus afijos.
4. **Afijos**, con el sorteo de `affix-forge`: cuántos (1 a 4, por
   `count_weights`), de qué rareza (común, poco común, rara o épica, por
   `rarity_weights`), una opción de esa rareza que valga para armas o
   armaduras, sin repetir opción ni familia (MaxHP y MaxHP %), y un valor que
   escala como el de un monstruo de nivel `level`. Los Tiers altos dan más
   afijos, más raros y más fuertes.
5. **Bioma:** con `world-atlas`, el primer afijo sale el 35 % de las veces de
   las opciones del bioma del mapa: resistir agua en la nieve y la costa,
   fuego en volcanes y desiertos, no muertos y sombra en las ruinas…

| Tier | Piezas | level | Nº de afijos 1/2/3/4 (%) | Rareza común/poco común/rara/épica (%) |
|---|---:|---:|---|---|
| 1 | 87 | 20 | 60/30/9/1 | 70/22/7/1 |
| 2 | 102 | 50 | 55/30/12/3 | 62/26/10/2 |
| 3 | 50 | 75 | 50/30/15/5 | 55/28/14/3 |
| 4 | 50 | 105 | 45/30/18/7 | 50/29/17/4 |
| 5 | 80 | 135 | 40/32/20/8 | 45/30/20/5 |
| 6 | 307 | 175 | 35/33/22/10 | 40/30/23/7 |

Todo son valores de prueba.

**Los datos** están en `registry/tools/dungeon-chest/`:

| Archivo | Qué tiene |
|---|---|
| `loot.csv` | pieza, Tier, clases que la equipan (`*` todas), nota |
| `costumes.csv` | los disfraces |
| `affixes.csv` | los 214 afijos: rareza, rango, tipo de valor, armas o armaduras, tope y familia |
| `affix_names.csv` | el nombre de cada afijo en español, como lo enseñan el cliente y el Herrero |
| `loot_tiers.csv` | lo de la tabla de arriba y `costume_pct`, por Tier |
| `loot_biomes.csv` | bioma, probabilidad y opciones del primer afijo |

Se regenera con `node registry/tools/dungeon-chest/build_loot.cjs [carpeta
db/re de rAthena]`, que escribe `npc/dungeon-loot-data.txt` y la tabla de
nombres del cliente (no se editan a mano). Comprueba que cada pieza y cada
disfraz sean equipo en las tablas Renewal, que las clases existan, que cada
afijo tenga nombre, que las opciones de cada bioma estén en `affixes.csv` y
que cada Tier tenga su fila. `--check` falla si alguno de los dos no está al
día. El código del sorteo está en `npc/dungeon-loot.txt`, escrito a mano.

`import_reference.cjs` hizo la importación desde los dos mods **una sola
vez**. El Tier de cada pieza es la banda de su nivel mínimo, pero nunca menor
del que sugiere su cofre de `arpg-equipments`; quedaron fuera los disfraces y
lo que no es equipo (121 objetos). Desde entonces los CSV son nuestros y se
editan a mano; el script no los pisa sin `--force`.

`import_reference.cjs --costumes` sacó, también una sola vez, los disfraces.

**Nombres de los afijos.** `data/luafiles514/lua files/datainfo/addrandomoptionnametable.lub`
sale de `affix_names.csv`, traducida de la tabla de `affix-forge`. Sin ella,
el cliente enseña las opciones con id mayor de 192 como «UNKNOWN RANDOM
OPTION». Va **sin acentos ni eñes** a propósito: el cliente (kRO) lee esa
tabla en su propia codificación, no en UTF-8, y un acento saldría roto
([`docs/MODDING.md`](../../docs/MODDING.md), «Signboards»). Los atributos
usan las abreviaturas en español de los demás mods (FUE, DES, SUE).

## Herrero de Afijos

En Prontera `155,187`, junto al Proveedor de Campamento (D37). Portado del de
`affix-forge`. Trabaja piezas **identificadas y sin equipar**: una pieza sin
identificar no sale en sus menús, porque el menú diría qué es y qué afijos
tiene.

| Servicio | Qué hace | Precio (ajuste) |
|---|---|---:|
| Pasar todos los afijos | los de una pieza (que se pierde) pasan a otra, que pierde los suyos | 100 000 (`smith_move_all`) |
| Pasar un afijo | uno elegido de una pieza (que se pierde) pasa a otra: sobre el mismo afijo si ya lo tiene, a un hueco libre o al que cedas si tiene cinco | 60 000 (`smith_move_one`) |
| Quitar un afijo | uno elegido; la pieza se queda | 30 000 (`smith_remove`) |
| Volver a sortear | mismos afijos en número, nuevos, con el sorteo de los cofres y el Tier de la pieza (el de `loot.csv`, o la banda de su nivel), sin bioma | 50 000 (`smith_reroll`) |

Cada servicio enseña antes qué se pierde y qué queda. Al rehacer la pieza
conserva refinado, cartas, atributo, grado y si está ligada. Los precios son
valores de prueba y se cambian en Settings → Mods; 0 lo hace gratis. Como en
`affix-forge`, pasar un afijo no comprueba la regla de una familia por pieza:
se puede acabar con MaxHP y MaxHP % en la misma.

### Créditos

- Las listas de equipo son de [ARPG Equipments Mod](https://github.com/igueradx/ARPG-Equipments-Mod)
  (MIT, Copyright 2026 Igor / Iguera).
- Los afijos, su sorteo, el Herrero y la tabla de nombres son de
  [Affix Forge](https://github.com/rhewid/affix-forge) (MIT, rhwski). La forma
  del Herrero de rehacer una pieza viene del Bonus Stat Crafter de ARPG
  Equipments Mod. Los nombres en inglés de los que se tradujo la tabla vienen
  de [ROenglishRE](https://github.com/llchrisll/ROenglishRE), de zackdreaver
  y llchrisll.

## Próximos cambios propuestos (revisión 2026-10-17)

Sin implementar.

- **Más botín por bioma:** además de los afijos del bioma (hecho en 0.4.0),
  ropa de `temperature` y objetos de `clima` en sus biomas. Las comidas por
  Tier son de prueba.
- **Dos jugadores:** cada miembro del grupo cerca del cofre recibe su propio
  botín, no solo quien lo abre.
- **Cofres con trampa** que un Rogue o un Hunter puede desarmar.
- **Cofre de un aventurero caído:** algunos cofres con una nota corta (lore,
  ver `remnants` en `PLAN.md`).
- **Experiencias:** primer cofre de un mapa, `chest:<mapa>` (Menor); primer
  cofre de un Tier, `chesttier:<n>` (Mayor). Ver
  [`ADVENTURE.md`](../ADVENTURE.md).
