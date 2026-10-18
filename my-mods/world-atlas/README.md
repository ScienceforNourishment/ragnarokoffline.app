# Atlas del mundo

Tabla de datos por mapa que otros mods consultan desde sus scripts. **Por sí
solo no cambia nada en el juego**: no añade NPC visibles, objetos ni
comportamiento. Es la base de datos del mundo para todos los mods (D13 en
[`DECISIONS.md`](../DECISIONS.md)).

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.1.0 (la de `mod.json`); 206 mapas
- **Probado en el juego:** nada todavía
- **Sin probar:** la carga y todas las funciones; `F_Atlas_Name` en el diario
- **Actualizado:** 2026-10-17

| Tipo | Mapas | Origen |
|---|---:|---|
| `city` | 7 | las siete ciudades principales (la misma lista de `survival`) |
| `field` | 20 | los campos que usan `clima` y `expedition-board`, más `xmas_fild01`, `cmd_fild01`, `um_fild01` y `mosk_fild02`, añadidos para que `clima` tenga mapas de nieve, costa, selva y pantano |
| `dungeon` | 179 | los mismos de `dungeon-chest`, con su Tier sin cambios |

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
| `F_Atlas_Tier(map$)` | 0 en ciudades, 1–6 fuera | 0 |
| `F_Atlas_Temp(map$)` | -2 (frío) a 2 (calor); 0 es cómodo | 0 |
| `F_Atlas_Anchor(map$)` | mapa de la ciudad ancla | `""` |
| `F_Atlas_Water(map$)` | 1 si hay agua para llenar una botella | 0 |
| `F_Atlas_Rest(map$)` | 1 si hay refugio o campamento | 0 |
| `F_Atlas_Name(map$)` | nombre legible en español, p. ej. `Campo de Prontera 08` | `""` (usa el código de mapa como reserva) |
| `F_Atlas_IsSafe(map$)` | 1 en mapas `city` | 0 |

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
| `tier` | 0 solo en ciudades; 1–6 con el criterio de `dungeon-chest` |
| `temp` | -2 a 2 |
| `anchor` | mapa de una fila `city` |
| `water`, `rest` | 0 o 1 |
| `name` | nombre legible en español, obligatorio, sin `\|` ni `"`; los pisos de una mazmorra llevan su número (`Cueva de Hielo 2`) |
| `note` | texto libre, sin `|` ni `"` |

## Cambiar o añadir un mapa

Ahora el atlas cubre 206 mapas; hay unos 274 más con spawns normales (campos,
ciudades menores, dungeons que `dungeon-chest` no incluye). Añadirlos es
editar el CSV, no tocar scripts.

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

Añadir un mapa al atlas **no** le pone un cofre ni un contrato: eso lo decide
cada mod. Para un cofre nuevo sigue la guía de `dungeon-chest`; si el Tier del
atlas y el del cofre difieren, manda el del atlas cuando está cargado (el
nombre del NPC, `Cofre T4`, conserva el escrito en el script).

### Cómo categorizar

| Columna | Criterio |
|---|---|
| `kind` | `city`: asentamiento seguro (hoy solo las siete principales; añadir una la hace segura para `survival` al migrarlo). `field`: exterior abierto. `dungeon`: mazmorra, torre, ruina o laberinto. `interior`: edificio dentro de una ciudad, sin spawns. |
| `tier` | 0 solo para `city`. Fuera: el que sugiere `tier_of.cjs`, que usa el criterio de `dungeon-chest` (promedio ponderado por spawn del nivel de monstruos normales Renewal, sin MVP ni spawns estacionales): 1 <40, 2 40–59, 3 60–89, 4 90–119, 5 120–149, 6 ≥150. Es una estimación para ordenar mapas, no un nivel oficial. Si un mapa tiene casi un solo spawn o mezcla zonas muy distintas, el promedio engaña: revísalo y anota la razón en `note`. |
| `biome` | Lo que se ve y se siente al estar allí, no el nombre del mapa. Es una lista cerrada (la valida el build); si falta un bioma, añádelo a `BIOMES` en `build_atlas.cjs` y a la tabla de arriba. |
| `temp` | -2 frío extremo, -1 fresco, 0 cómodo, 1 cálido, 2 calor extremo. Partida habitual: nieve -2, montaña -1, selva y pantano 1, desierto y volcán 2, el resto 0; sube o baja uno por razones de lugar (pirámides y esfinge 1). |
| `anchor` | La ciudad principal desde la que se llega más naturalmente (la que será su tablero y su servicio). Debe ser una fila `city`. Para mapas de ultramar, la ciudad portuaria (hoy Alberta). |
| `water` | 1 solo si hay agua de la que llenar una botella. Lo ideal es comprobarlo con `checkcell ... cell_chkwater` en el mapa real, no por el nombre. |
| `rest` | 1 solo cuando exista un refugio o campamento allí. |

## Qué es provisional

- **Tier:** los 179 de dungeon son los de `dungeon-chest`, verificados contra
  sus cofres. Los 20 campos usan el mismo criterio (promedio ponderado de
  niveles de spawn Renewal) y salen casi todos en Tier 1.
- **Biomas, temperatura, ancla y agua** son una primera asignación por el
  nombre del mapa, sin revisar mapa por mapa. `ruinas` (101) y `cueva` (42)
  son los grupos más gruesos. Las anclas fuera de las siete ciudades son una
  estimación geográfica. Corrígelos en el CSV.
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
  respeta su propia lista `.safe_maps$`. Sin cambio de comportamiento.

- `dungeon-chest`: `F_DungeonChest_Open` toma el Tier (y con él la comida) del
  atlas y usa el escrito en el cofre como reserva. Los 179 coinciden, así que no
  hay cambio visible.

- `clima`: el bioma de cada mapa (`F_Atlas_Biome`) decide qué combinaciones
  climáticas pueden ocurrir allí. Es una dependencia obligatoria
  (`requires.mods`); sin el atlas `clima` no sortea ningún evento.

- `travel-journal`: las entradas de primera visita y de muerte guardan el
  nombre del mapa (`F_Atlas_Name`), con el código como reserva si el atlas no
  está.

## Probarlo

No está probado en el juego. Tras cargar, revisa que no haya errores en
`ragnarok-stack logs map 100` y, con un personaje de prueba, consulta por
ejemplo `callfunc("F_Atlas_Tier", "ice_dun02")` (debe dar 4) y
`F_Atlas_Tier("desconocido")` (debe dar 0) desde un NPC de prueba.

## Próximos cambios propuestos (revisión 2026-10-17)

Sin implementar.

- **Ampliar a campos y ciudades menores.** Con `adventure`, cada mapa del
  atlas es una experiencia: el atlas pasa a ser el contenido. Hoy los Tier 1 y
  2 se quedan cortos (meta: 30 o más experiencias por banda de nivel, ver
  [`ADVENTURE.md`](../ADVENTURE.md#rates-recomendados)). `tier_of.cjs
  --unlisted` lista los candidatos.
- **Interiores y posadas** (`kind=interior`, seguros) para los servicios de
  ciudad.
- **Mapflag `loadevent`** en todos los mapas del atlas, generada por el script
  de build, para `adventure` y `travel-journal`.
- **Columnas candidatas:** la mazmorra a la que pertenece un piso y su
  profundidad (para la experiencia del piso más hondo); los servicios de cada
  ciudad (identidad de ciudad).
- **Origen de los cofres:** `dungeon-chest` generado desde este CSV.
