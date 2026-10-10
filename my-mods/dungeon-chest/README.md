# Cofres de dungeon

El mod agrega un cofre interactivo a cada mapa de dungeon con spawns normales
registrados en el índice del servidor: 179 mapas en total. Los mapas se agrupan
por la dificultad aproximada de sus monstruos y cada Tier entrega una comida
distinta para facilitar las pruebas.

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
| 5 | 120–149 | 38 | Lutie Lady's Pancake (ID `12045`) |
| 6 | 150 o más | 6 | Shiny Marinade Beef (ID `12071`) |

La lista parte de los mapas de dungeon de
[RateMyServer](https://ratemyserver.net/dungeonmap.php) y usa los spawns de
Renewal de `mods/navigation-server-monsters/mob-index.tsv` en este repositorio.
Se dejan fuera por ahora los 17 mapas de la lista que no tienen spawns normales
en ese índice: `alb2trea`, `clock_01`, `ice_dun04`, `izlu2dun`, `moc_prydb1`,
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

## Guía: agregar un cofre a otro mapa

Cada mapa tiene una definición `script` en `npc/dungeon-chests.txt`; todas
reutilizan las tres funciones globales del inicio del archivo. Antes de
agregar una:

1. **Confirma que el mapa es válido para el servidor.** Debe estar cargado por
   rAthena y aparecer en la lista de mapas del mundo. Para mantener el alcance
   del mod, confirma también que sea un mapa de dungeon y que tenga spawns
   normales en el índice de monstruos; no lo agregues solo porque su nombre
   parezca un dungeon.
2. **Asigna el Tier según el criterio documentado.** La tabla anterior usa el
   nivel promedio ponderado por cantidad de spawn, no un nivel oficial del
   mapa. Si el mapa no aparece en el índice o requiere otro criterio, deja la
   estimación clara y actualiza la tabla de Tier y su cantidad de mapas.
3. **Elige una recompensa existente y compatible.** Usa el ID del item del
   Tier en la tabla. Antes de introducir un item distinto, confirma que exista
   en la era soportada y que el personaje pueda recibirlo; `checkweight` solo
   evita exceder capacidad, no valida que el ID tenga una definición útil.
   Armas o equipo mejorado no son la recompensa prevista: `affix-forge` y
   `arpg-equipments` ya cubren ese tipo de loot.
4. **Agrega una definición siguiendo esta forma** y sustituyendo mapa, Tier e
   item:

   ```txt
   pay_dunXX,0,0,4	script	Cofre T1#dcp_pay_dunXX	3075,{
       .@opened = callfunc("F_DungeonChest_Open", strnpcinfo(3), 1, 12041);
       if (.@opened) {
           stopnpctimer;
           initnpctimer;
       }
       close;

   OnInit:
       .opened = 0;
       .relocated = 0;
       callfunc("F_DungeonChest_Move", strnpcinfo(3), "pay_dunXX");
       initnpctimer;
       end;

   OnTimer600000:
       callfunc("F_DungeonChest_Tick", strnpcinfo(3), "pay_dunXX");
       initnpctimer;
       end;
   }
   ```

   El nombre interno después de `#` debe ser único. Conserva los tabuladores
   entre los campos de una declaración `function script` al editar las
   funciones globales: rAthena los necesita para reconocer esa sintaxis.
5. **Conserva el ciclo y las protecciones existentes.** `F_DungeonChest_Open`
   comprueba si ya se abrió, vuelve a comprobarlo después del diálogo y valida
   el peso antes de marcarlo abierto y entregar el item. No quites estas
   comprobaciones: así solo el primer jugador recibe el botín. `OnTimer600000`
   son 600 000 ms (10 minutos); sin abrir, el cofre se reubica una vez, y al
   abrirse se repone en otra ubicación tras ese intervalo. Un reinicio del
   servidor reinicia su estado y temporizador.
6. **Ten en cuenta los límites de colocación.** `F_DungeonChest_Move` intenta
   hasta 500 coordenadas aleatorias entre 20 y 280 y usa `checkcell` para
   elegir una celda transitable antes de `movenpc`. En mapas pequeños, mapas
   cuya geometría no cubre ese rango u otros mapas con pocas celdas válidas,
   esos intentos podrían fallar; revisa el `debugmes` del map-server y no
   declares el cofre probado hasta confirmar su posición en el juego.
7. **Valida la carga, no solo el archivo.** Comprueba que haya una sola
   definición para el mapa, que mapa/Tier/item coincidan y que el total de
   cofres y las cantidades por Tier en este README estén actualizados.
   Reinicia o recarga los scripts del servidor y revisa
   `ragnarok-stack logs map 100`. Un `Unknown syntax` al principio del archivo
   puede impedir que se carguen todos sus cofres; que el archivo esté listado
   en `map_conf.txt` no prueba que rAthena lo haya parseado. Finalmente,
   encuentra el cofre en el mapa, ábrelo con espacio en inventario y vuelve a
   hablar con el para comprobar que ya no entregue otro objeto.

Este mod no cambia ni requiere `affix-forge` o `arpg-equipments`.
