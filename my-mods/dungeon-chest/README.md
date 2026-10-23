# Cofres de dungeon

El mod agrega un cofre interactivo a cada mapa de dungeon de
[`world-atlas`](../world-atlas/README.md) (las filas `kind=dungeon` de su
CSV): 183 mapas en total. Los mapas se agrupan por la dificultad aproximada de
sus monstruos y cada Tier entrega una comida distinta para facilitar las
pruebas.

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.3.0 (la de `mod.json`): `npc/dungeon-chests.txt` se genera
  desde el CSV del atlas con `registry/tools/dungeon-chest/build_chests.cjs`.
  Los 179 cofres de antes salen idénticos; se suman los 4 retos que añadió
  `world-atlas` 0.2.0: `iz_d04_i` (T5), `iz_d05_i` (T6), `prt_mz03_i` (T6) y
  `prt_prison` (T5)
- **Probado en el juego:** sin registro detallado; anota aquí lo que se compruebe
- **Sin probar:** los 4 cofres nuevos (que encuentren celda y entreguen su
  comida). Comprobado sin el juego: el generado coincide con el anterior en los
  179 mapas, 183 nombres internos únicos, llaves y comillas equilibradas
- **Actualizado:** 2026-10-17

- **Cantidad:** un cofre por mapa.
- **Ubicación:** aleatoria dentro de cada mapa; solo se eligen celdas
  transitables.
- **Apariencia:** sprite `WA_TREASURE` (ID 3075), disponible en el cliente.
- **Cambio de posición para pruebas:** si nadie abre un cofre durante 10
  minutos, se teleporta una vez a otra ubicación aleatoria.
- **Botín:** solo el primer jugador que lo abra y pueda cargar el objeto recibe
  una unidad de su comida de Tier. Después de abrirlo, el cofre reaparece en
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
   Armas o equipo mejorado no son la recompensa prevista: `affix-forge` y
   `arpg-equipments` ya cubren ese tipo de loot.
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

Este mod no cambia ni requiere `affix-forge` o `arpg-equipments`.

## Próximos cambios propuestos (revisión 2026-10-17)

Sin implementar.

- **Botín por bioma además de por Tier:** equipo de abrigo en mazmorras de
  hielo, ropa fresca y protección de calor en las de desierto, objetos de
  `clima` y `temperature`. Las comidas por Tier son de prueba.
- **Dos jugadores:** cada miembro del grupo cerca del cofre recibe su propio
  botín, no solo quien lo abre.
- **Cofres con trampa** que un Rogue o un Hunter puede desarmar.
- **Cofre de un aventurero caído:** algunos cofres con una nota corta (lore,
  ver `remnants` en `PLAN.md`).
- **Experiencias:** primer cofre de un mapa, `chest:<mapa>` (Menor); primer
  cofre de un Tier, `chesttier:<n>` (Mayor). Ver
  [`ADVENTURE.md`](../ADVENTURE.md).
