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

Este mod no cambia ni requiere `affix-forge` o `arpg-equipments`.
