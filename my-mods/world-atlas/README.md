# Atlas del mundo

Tabla de datos por mapa que otros mods consultan desde sus scripts. **Por sí
solo no cambia nada en el juego**: no añade NPC visibles, objetos ni
comportamiento. Es la base de datos del mundo para todos los mods (D13 en
[`DECISIONS.md`](../DECISIONS.md)).

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.2.0 (la de `mod.json`); 230 mapas. La región de Prontera e
  Izlude está completa (ver «Región de Prontera e Izlude»)
- **Probado en el juego:** nada todavía
- **Sin probar:** la carga y todas las funciones; `F_Atlas_Name` en el diario;
  que los interiores nuevos detengan hambre, sed y temperatura
- **Cambio de comportamiento en 0.2.0:** `F_Atlas_IsSafe` también da 1 en los
  mapas `interior`, así que `survival`, `temperature` y `wounds` los tratan
  como ciudad (no bajan hambre ni sed, no hay temperatura, morir no deja herida)
- **Actualizado:** 2026-10-17

| Tipo | Mapas | Origen |
|---|---:|---|
| `city` | 7 | las siete ciudades principales (la misma lista de `survival`) |
| `field` | 25 | los campos que usan `clima` y `expedition-board`, más `xmas_fild01`, `cmd_fild01`, `um_fild01` y `mosk_fild02`, añadidos para que `clima` tenga mapas de nieve, costa, selva y pantano; y los 5 que completan Prontera e Izlude |
| `dungeon` | 183 | los 179 de `dungeon-chest`, con su Tier sin cambios, y 4 retos de Tier 5–6 de Prontera e Izlude |
| `interior` | 15 | los edificios de Prontera e Izlude |

## Funciones

Todas reciben el nombre de mapa en minúsculas; si se omite, usan el mapa
actual del personaje. Con el mapa dado **no necesitan un personaje adjunto**,
así que sirven desde un temporizador o un `OnInit` (si la tabla ya se llenó). **Un mapa desconocido devuelve un valor por defecto, no
un error.**

| Función | Devuelve | Por defecto |
|---|---|---|
| `F_Atlas_Has(map$)` | 1 si el atlas conoce el mapa | 0 |
| `F_Atlas_Kind(map$)` | `city`, `field`, `dungeon`, `interior` | `""` |
| `F_Atlas_Biome(map$)` | bioma (lista abajo) | `""` |
| `F_Atlas_Tier(map$)` | 0 en ciudades e interiores, 1–6 fuera | 0 |
| `F_Atlas_Temp(map$)` | -2 (frío) a 2 (calor); 0 es cómodo | 0 |
| `F_Atlas_Anchor(map$)` | mapa de la ciudad ancla | `""` |
| `F_Atlas_Water(map$)` | 1 si hay agua para llenar una botella | 0 |
| `F_Atlas_Rest(map$)` | 1 si hay refugio o campamento | 0 |
| `F_Atlas_Name(map$)` | nombre legible en español, p. ej. `Campo de Prontera 08` | `""` (usa el código de mapa como reserva) |
| `F_Atlas_IsSafe(map$)` | 1 en mapas `city` e `interior` | 0 |

Ejemplo, con valor de reserva por si el atlas no está activo:

```
.@safe = 0;
if (callfunc("F_Atlas_Has"))        // sin argumento: el mapa actual
	.@safe = callfunc("F_Atlas_IsSafe");
```

`callfunc` de una función que no existe falla, así que un mod que quiera
funcionar sin el atlas debe tener su propia lista de reserva (como la de
`survival`) y usar el atlas solo cuando esté. No hay `requires.mods`: la
dependencia es suave.

Consulta en tiempo de ejecución, no desde el `OnInit` de otro NPC: el atlas
llena su tabla en su propio `OnInit` y rAthena no garantiza el orden entre NPC.
Los mapas de instancia (`1@algo`) no están en la tabla y devuelven el valor por
defecto.

## Columnas y valores

La fuente de verdad es
[`registry/tools/world-atlas/atlas.csv`](../../registry/tools/world-atlas/atlas.csv).

| Columna | Valores |
|---|---|
| `map` | nombre interno en minúsculas, único |
| `kind` | `city`, `field`, `dungeon`, `interior` |
| `biome` | `ciudad`, `pradera`, `bosque`, `selva`, `desierto`, `nieve`, `pantano`, `costa`, `montana`, `volcan`, `cueva`, `ruinas` |
| `tier` | 0 solo en ciudades e interiores; 1–6 con el criterio de `dungeon-chest` |
| `temp` | -2 a 2 |
| `anchor` | mapa de una fila `city` |
| `water`, `rest` | 0 o 1 |
| `name` | nombre legible en español, obligatorio, sin `\|` ni `"`; los pisos de una mazmorra llevan su número (`Cueva de Hielo 2`) |
| `note` | texto libre, sin `|` ni `"` |

## Cambiar o añadir un mapa

Ahora el atlas cubre 230 mapas; hay unos 274 más con spawns normales (campos,
ciudades menores, dungeons). Añadirlos es editar el CSV, no tocar scripts.

1. **Encuentra candidatos.** `node registry/tools/world-atlas/tier_of.cjs --unlisted`
   lista los mapas con spawns que aún no están en el CSV, con su Tier
   sugerido, nivel promedio y cantidad de spawns. `tier_of.cjs <mapa> ...`
   consulta mapas concretos. Un mapa sin spawns no sale; añádelo a mano (una
   ciudad, un interior) con el Tier que corresponda al `kind`.
2. **Añade una fila** al final de `registry/tools/world-atlas/atlas.csv`
   decidiendo cada columna con la tabla de abajo.
3. **Regenera:** `node registry/tools/world-atlas/build_atlas.cjs`. Valida
   mapas duplicados, valores fuera de rango y anclas inexistentes, y reescribe
   `npc/world-atlas.txt` (no lo edites a mano). `--check` falla si el
   generado está desactualizado.
4. Reemplaza la carpeta del mod en la instalación (no copies encima) y
   recarga los mods. Comprueba `ragnarok-stack logs map 100`.

Añadir un mapa al atlas no le pone un contrato: eso lo decide cada mod. **Una
fila `kind=dungeon` sí recibe un cofre** de `dungeon-chest` al regenerarlo con
`node registry/tools/dungeon-chest/build_chests.cjs` (ver su guía); córrelo
también al cambiar el Tier de una mazmorra, para que el nombre del cofre y su
recompensa de reserva sigan al atlas.

### Cómo categorizar

| Columna | Criterio |
|---|---|
| `kind` | `city`: asentamiento seguro (hoy solo las siete principales; añadir una la hace segura para `survival` al migrarlo). `field`: exterior abierto. `dungeon`: mazmorra, torre, ruina o laberinto. `interior`: edificio de una ciudad (o de un asentamiento sin `city`, como la abadía), seguro como la ciudad; biome `ciudad`, temp 0. Puede tener monstruos de práctica o de misión (`iz_ac01`, `prt_cas`): anótalo. |
| `tier` | 0 solo para `city` e `interior`. Fuera: el que sugiere `tier_of.cjs`, que usa el criterio de `dungeon-chest` (promedio ponderado por spawn del nivel de monstruos normales Renewal, sin MVP ni spawns estacionales): 1 <40, 2 40–59, 3 60–89, 4 90–119, 5 120–149, 6 ≥150. Es una estimación para ordenar mapas, no un nivel oficial. Si un mapa tiene casi un solo spawn o mezcla zonas muy distintas, el promedio engaña: revísalo y anota la razón en `note`. |
| `biome` | Lo que se ve y se siente al estar allí, no el nombre del mapa. Es una lista cerrada (la valida el build); si falta un bioma, añádelo a `BIOMES` en `build_atlas.cjs` y a la tabla de arriba. |
| `temp` | -2 frío extremo, -1 fresco, 0 cómodo, 1 cálido, 2 calor extremo. Partida habitual: nieve -2, montaña -1, selva y pantano 1, desierto y volcán 2, el resto 0; sube o baja uno por razones de lugar (pirámides y esfinge 1). |
| `anchor` | La ciudad principal desde la que se llega más naturalmente (la que será su tablero y su servicio). Debe ser una fila `city`. Para mapas de ultramar, la ciudad portuaria (hoy Alberta). |
| `water` | 1 solo si hay agua de la que llenar una botella. Lo ideal es comprobarlo con `checkcell ... cell_chkwater` en el mapa real, no por el nombre. |
| `rest` | 1 solo cuando exista un refugio o campamento allí. |

## Región de Prontera e Izlude

Completa desde 0.2.0: es la porción vertical de H1
([`ROADMAP.md`](../ROADMAP.md#h1-porción-vertical-prontera-e-izlude-tier-1-y-2)).
La lista sale de los warps y NPC del rAthena fijado
(`mods/navigation-server-warps/warp-index.tsv`,
`mods/navigation-server-npcs/npc-index.tsv`) y los Tiers de `tier_of.cjs`.

| Tipo | Mapas |
|---|---|
| ciudades | `prontera`, `izlude` |
| campos, Tier 1 | `prt_fild00`–`10`, `prt_gld`, `prt_monk`, `izlu2dun` |
| campos, Tier 2 | `prt_fild11` |
| mazmorras, Tier 1–2 | `prt_sewb1`–`4`, `prt_maze01`–`03`, `iz_dun00`–`04` |
| retos, Tier 4–6 | `iz_dun05` (4), `prt_prison` (5), `prt_q` (5, campo), `iz_d04_i` (5), `iz_d05_i` (6), `prt_mz03_i` (6) |
| interiores | `prt_in`, `prt_church`, `prt_castle`, `prt_cas`, `prt_pri00`, `prt_are_in`, `monk_in`, `izlude_in`, `iz_ac01`, `iz_ac02`, `iz_int`, `iz_int01`–`04` |

**Servicios para H1.** La columna `note` de los interiores guarda dónde están
los NPC que interesan para mover servicios (D23): la posada de `prt_in` (Inn
Employee en 244,135 y 61,141), su taberna (Bartender en 180,20), la iglesia
(`prt_church`) y el Master Tailor de `izlude_in` (123,175). Son las
coordenadas del índice de NPC, no comprobadas en el juego.

**Fuera a propósito:**

- Las copias de canal `izlude_a`–`d`, `prt_fild08a`–`d`, `iz_ac01_a`–`d` y
  `iz_ac02_a`–`d`: ningún warp normal lleva a ellas y, con `adventure`, cada
  copia daría otra vez la experiencia de su mapa. Si un personaje llega, no
  es seguro (hambre y sed bajan) ni tiene temperatura.
- Mapas de prueba de oficio y de misión cerrada: `job_monk`, `monk_test`,
  `prt_cas_q`, `prt_lib_q`.
- Castillos de gremio (`prtg_cas01`–`05`) y la arena (`arena_room`):
  fuera del juego de esta partida.

**Cambios de 0.2.0 en filas existentes:** `prt_maze01`–`03` pasan de
`cueva` a `bosque` (el Laberinto es un bosque al aire libre). Solo lo nota
`wounds` al nombrar una herida; `clima` no tiene el Laberinto en su lista.

## Qué es provisional

- **Tier:** 179 de los 183 de dungeon venían de `dungeon-chest`, verificados
  contra sus cofres; los 4 retos, de `tier_of.cjs`. Hoy los cofres se generan
  desde aquí. Los 25 campos usan el mismo criterio (promedio ponderado de
  niveles de spawn Renewal) y salen casi todos en Tier 1.
- **Biomas, temperatura, ancla y agua** son una primera asignación por el
  nombre del mapa, sin revisar mapa por mapa. `ruinas` (101) y `cueva` (42)
  son los grupos más gruesos. Las anclas fuera de las siete ciudades son una
  estimación geográfica. Corrígelos en el CSV.
- **Prontera e Izlude:** `prt_q` («Prontera Asediada») y las ilusiones llevan
  nombres provisionales; `prt_gld`, `prt_monk` e `izlu2dun` no tienen
  monstruos y su Tier 1 es por la región, no por `tier_of.cjs`.
- **`water`:** 1 solo en biomas `costa` y `pantano`; no se comprobó con las
  celdas reales del mapa. `rest` es 0 en todos hasta que existan campamentos.
- **`name`:** los nombres se escribieron a mano por prefijo de mapa. Los de
  `arug_dun`, `bossnia`, `schg_dun`, `gld_dun` y `gld2_*` son los menos
  seguros; los sufijos `_`/`_2` de variantes se muestran como `(alterno)` o
  `(2)`. Corrígelos en el CSV.
- **`temp`:** escala -2..2 propuesta; se confirma al implementar la
  temperatura.

## Quién lo usa

- `survival`: `F_Survival_IsSafe` pregunta a `F_Atlas_IsSafe` y además
  respeta su propia lista `.safe_maps$`. Desde 0.2.0, los interiores del
  atlas también son seguros.

- `temperature` y `wounds`: usan `F_Atlas_IsSafe` para no dar temperatura ni
  heridas en ciudad; ahora tampoco en interiores. `temperature` toma además
  `F_Atlas_Temp`, y `wounds`, el bioma.

- `expedition-board`: el Tier del mapa de cada contrato.

- `dungeon-chest`: sus cofres **se generan** desde las filas `kind=dungeon`
  (`registry/tools/dungeon-chest/build_chests.cjs`, desde 0.3.0). En el juego,
  `F_DungeonChest_Open` además toma el Tier (y con él la comida) del atlas y
  usa el escrito en el cofre como reserva.

- `clima`: el bioma de cada mapa (`F_Atlas_Biome`) decide qué combinaciones
  climáticas pueden ocurrir allí. Es una dependencia obligatoria
  (`requires.mods`); sin el atlas `clima` no sortea ningún evento.

- `travel-journal`: las entradas de primera visita y de muerte guardan el
  nombre del mapa (`F_Atlas_Name`), con el código como reserva si el atlas no
  está.

## Probarlo

No está probado en el juego. Guion para una sesión larga; cabe en la misma
sesión que las pruebas de `survival`, `temperature` y `wounds`, porque los
interiores cambian lo que hacen los tres.

**Preparación.** Activa `world-atlas` y `world-atlas-test` (un NPC,
`AtlasTest`, en `prontera 150,180`, que muestra lo que devuelve el atlas
para un mapa: al preguntarle, deja el campo vacío para el mapa actual).
Reemplaza la carpeta del mod instalada en vez de copiar encima. Con
`survival`, `temperature` y `wounds` activos se prueba también el efecto de
los interiores. Usa un personaje con GM (`tester`) para `@warp`.

**1. Carga.** Tras recargar los mods, `ragnarok-stack logs map 200` no debe
dar errores de `world-atlas.txt`. Pregunta a `AtlasTest` por `prontera`:
`has=1 safe=1 kind=city`.

**2. Datos, desde `AtlasTest`** (escribe el mapa sin moverte):

| Mapa | Debe dar |
|---|---|
| `prt_in` | `kind=interior safe=1 tier=0 biome=ciudad`, nombre «Interiores de Prontera» |
| `iz_int` | `kind=interior safe=1 tier=0 anchor=izlude` |
| `prt_fild00` | `kind=field safe=0 tier=1 biome=pradera` |
| `izlu2dun` | `kind=field tier=1 biome=costa water=1 anchor=izlude` |
| `prt_maze01` | `biome=bosque` (antes `cueva`) |
| `prt_mz03_i` | `kind=dungeon tier=6` |
| `izlude_a` | `has=0 safe=0` (copia de canal, fuera a propósito) |
| `ice_dun02` | `tier=4` (fila antigua, sin cambios) |

**3. Interiores seguros, en el juego.** Entra en `prt_in` (cualquier puerta
de Prontera, o `@warp prt_in 244 135`, la posada) y espera 1 minuto:

- Los medidores de hambre y sed **no bajan** (`survival`).
- `@temperatura` dice «en la ciudad estás a gusto» (`temperature`). Prueba
  con el Abrigo Polar puesto: no debe aparecer ningún estado de frío.
- Repite en `prt_church`, `izlude_in` e `iz_ac01`. En `iz_ac01` hay 4
  monstruos de práctica: morir ahí **no** debe dejar herida (`@heridas`).

**4. Campos nuevos, no seguros.** `@warp prt_fild00`, `@warp prt_monk` y
`@warp izlu2dun`: hambre y sed vuelven a bajar y `@temperatura` da un estado
(Cómodo sin ropa). En `izlu2dun`, la cantimplora vacía cerca de la orilla
comprueba si `water=1` es cierto (si no llena, corrige la fila).

**5. Coordenadas de servicios.** Comprueba que el Inn Employee de `prt_in`
está en 244,135 y 61,141, el Bartender en 180,20 y el Master Tailor de
`izlude_in` en 123,175 (`/where` junto a ellos). Corrige la columna
`note` si no.

**6. Diario.** Con `travel-journal`, la primera visita a `prt_fild00` debe
escribir «Campo de Prontera 00», no el código del mapa.

**Al acabar:** anota el resultado en «Estado», arriba, desactiva
`world-atlas-test` y revisa `ragnarok-stack logs map 2000` en busca de
errores de `F_Atlas_*`.

## Próximos cambios propuestos (revisión 2026-10-17)

Sin implementar.

- **Ampliar a campos y ciudades menores.** Con `adventure`, cada mapa del
  atlas es una experiencia: el atlas pasa a ser el contenido. Hoy los Tier 1 y
  2 se quedan cortos (meta: 30 o más experiencias por banda de nivel, ver
  [`ADVENTURE.md`](../ADVENTURE.md#rates-recomendados)). `tier_of.cjs
  --unlisted` lista los candidatos.
- **Interiores de las demás ciudades** (`kind=interior`), al llegar cada
  región (H3). Prontera e Izlude ya los tienen.
- **Mapflag `loadevent`** en todos los mapas del atlas, generada por el script
  de build, para `adventure` y `travel-journal`.
- **Columnas candidatas:** la mazmorra a la que pertenece un piso y su
  profundidad (para la experiencia del piso más hondo); los servicios de cada
  ciudad (identidad de ciudad).
