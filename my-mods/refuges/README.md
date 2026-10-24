# refuges

**Refugios en ruinas** en los campos que se restauran entregando drops de
monstruos y zeny. Restaurados, quedan **para todo el mundo**: una fogata donde
se descansa y se cuentan los relatos de `adventure`, una despensa con su
intendente y, al final, una caravana que los une con la ciudad.

Es el cuarto de «Mods nuevos propuestos» en [`PLAN.md`](../PLAN.md) y entra en
H2 ([`ROADMAP.md`](../ROADMAP.md)): la «Consecuencia que queda en el mundo» del
bucle central, y el hilo de Reconstrucción (D5). Su fogata es el único sitio
fuera de una ciudad donde se cuentan los relatos (D10).

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.1.2 (la de `mod.json`), del 2026-10-24: arregla el refugio que no abría diálogo (ver «Falla en el juego (0.1.1)», abajo). `F_Refuge_Self` lee el id del nombre único (`strnpcinfo(3)`) en vez del oculto. Sin probar en el juego. La 0.1.1: el relato `refuge:<id>` se comparte con el grupo mediante el último argumento de `F_Adv_Experience`, que trae `adventure` 0.2; ya no recorre el grupo a mano. Con `adventure` 0.1 solo lo gana quien termina la etapa. Sin probar en el juego. La 0.1.0 fue la primera
- **Decidido con el autor (2026-10-23):** lo restaurado es del mundo, no del
  personaje (D32); se restaura en tres etapas con drops de la región y zeny,
  y más adelante también con materiales propios de oficios como la minería y
  la peletería (D33); la etapa 1 da la fogata (descanso y relatos), la 2 el
  Intendente y la 3 la caravana (D34). Dos refugios en la porción vertical:
  la Abadía (`prt_monk`) y `prt_fild11`
- **Probado:** solo comprobaciones estáticas: llaves y comillas
  equilibradas, cabeceras con tabuladores, etiquetas de `callsub` que
  existen, `mod.json` válido. El build valida que los objetos existen en las
  tablas Renewal y que todas las celdas donde hay un NPC o llega la caravana
  son transitables en el map cache (de una copia local de rAthena Renewal,
  no del commit fijado). Comprobado contra el rAthena fijado (`402dd11`):
  `setnpcdisplay` (nombre y sprite a la vez), `npcshopadditem`,
  `enablenpc`/`disablenpc`, `strnpcinfo(2)` y `strnpcinfo(4)`, los
  argumentos de `modstore_*`, que el mod store está listo antes de los
  `OnInit`, que una copia de una plantilla usa el mod store de su mod, y
  `JT_4_WOODPILE` = 10026 y `JT_4_BONFIRE` = 10252
- **Falla en el juego (0.1.1, 2026-10-24): al hablar con el Refugio en
  ruinas no pasa nada**; el personaje se queda un momento como cargando. Sin
  errores en el log. **Causa:** `F_Refuge_Show` hace `setnpcdisplay` al
  cargar, y eso reemplaza el nombre del NPC entero (`npc_setdisplayname`)
  por «Refugio en ruinas» o el del refugio, sin `#rf_<id>`. `strnpcinfo(2)`
  quedaba vacío, `F_Refuge_Self` devolvía −1 y el script terminaba sin
  diálogo. El nombre único (`strnpcinfo(3)`) no cambia. Arreglado en 0.1.2
- **Probado en el juego (0.1.1, 2026-10-24):** `@refugios` dice los dos «en
  ruinas»; el montón de leña (`4_WOODPILE`) se ve en `prt_monk 90,238` con
  el nombre «Refugio en ruinas» y nadie a sus lados; la Caravana de Prontera
  cuenta las dos ruinas y que ningún refugio tiene cobertizo
- **Sin probar en el juego:** el resto. Lo que más dudas tiene: que el sprite
  `4_BONFIRE` se vea en roBrowser, que el cambio de nombre y
  sprite al restaurar se vea sin salir del mapa, y que el Intendente y el
  Caravanero aparezcan al terminar su etapa
- **Actualizado:** 2026-10-24

## Instalar

Settings → Mods → **Add mod from folder…** → `my-mods/refuges` y recarga los
mods del servidor. No trae objetos ni archivos de cliente. Funciona solo,
pero rinde con `campfire` **0.2.0** (Descansado en la fogata, y Leña y Venda
en el Intendente), `adventure` (contar los relatos y el relato del refugio),
`survival` (la Cantimplora del Intendente) y `world-atlas` (Tier y nombres de
los mapas). Todas son dependencias suaves.

## Qué hace

### Los refugios

| Refugio | Dónde | Tier |
|---|---|---|
| Refugio de la Abadía | `prt_monk 90,238`, el patio de la Abadía de Santa Capitolina | 1 |
| Refugio del Paso Goblin | `prt_fild11 300,190`, camino de Geffen | 2 |

En ruinas son un montón de leña (`4_WOODPILE`) llamado «Refugio en ruinas».
Al terminar la etapa 1 pasan a ser una hoguera (`4_BONFIRE`) con el nombre
del refugio.

### Restaurar

Al hablar con las ruinas o con la fogata:

- **Siguiente etapa** dice qué hace falta, cuánto se ha entregado ya y
  cuánto llevas.
- **Entregar materiales** da lo que falte de cada objeto, hasta lo que
  lleves, y ofrece pagar el zeny de la etapa (de una vez). Se puede entregar
  en varios viajes y entre varios personajes: lo entregado se guarda.
- Al completarla, la etapa queda terminada **para todo el mundo** y se avisa
  en el mapa.

| Etapa | Qué construye | Abadía | Paso Goblin |
|---|---|---|---|
| 1. Techo y fogata | descansar y contar los relatos | 20 Stem, 10 Animal Skin, 20 Fluff, 3000 z | 20 Stem, 15 Animal Skin, 10 Scell, 5000 z |
| 2. Despensa | el Intendente del Refugio | 15 Sticky Mucus, 15 Shell, 30 Jellopy, 8000 z | 20 Sticky Mucus, 20 Shell, 15 Garlet, 12000 z |
| 3. Caravana | el Caravanero y su viaje a Prontera | 15 Scell, 3 Iron Ore, 20 Feather, 15000 z | 3 Iron, 10 Cyfar, 5 Iron Ore, 20000 z |

Todos los materiales los sueltan monstruos de los campos de Prontera en
Renewal (D19). Cantidades y precios son valores de prueba. Quien termina la
etapa 1 gana el relato Mayor «Restauré el …» (`refuge:<id>`), y también los
miembros de su grupo que estén en el mismo mapa (regla de grupo). El refugio
recuerda quién lo levantó.

**Más adelante** (D33): materiales propios (ids 51300–51399) que saldrán de
oficios como la minería y la peletería, cuando existan.

### Restaurado

| Etapa | NPC | Qué ofrece |
|---|---|---|
| 1 | la fogata | **Descansar junto al fuego:** Descansado de `campfire` (20 min, más regeneración y la próxima muerte fuera de una ciudad no deja herida) y cuenta los relatos de `adventure`, lo que cierra la expedición (D10, D11) |
| 2 | Intendente del Refugio, a 2 celdas al este | Red Potion 60, Apple 20, Meat 60, Milk 30; con `campfire`, Leña 400 y Venda 500; con `survival`, Cantimplora 650. Algo más caro que en la ciudad |
| 3 | Caravanero, a 2 celdas al oeste | lleva a Prontera por `caravan_price` zeny (300) |

En Prontera, la **Caravana de los Refugios** (`153,187`, junto al Proveedor
de Campamento) lleva a los refugios con caravana por el mismo precio, y de
los demás cuenta dónde quedan ruinas o que aún no tienen sitio para el carro.

La fogata del refugio no calienta: `temperature` solo mira las fogatas de
`campfire`. En estos dos mapas da igual (temperatura 0); hará falta para un
refugio en un mapa frío o caluroso (H3).

### Comandos

| Comando | Qué hace |
|---|---|
| `@refugios` | cada refugio, su mapa y hasta qué etapa está restaurado |
| `@refugio <id> <0-3>` | (GM 99) pone un refugio en esa etapa y borra lo entregado; para las pruebas |

## Cómo funciona

- **Sin temporizadores ni variables de personaje.** El estado está en el mod
  store global (`r.<id>.st`, `.by`, `.g.<item>`, `.z`; ver la cabecera de
  `npc/refuges-core.txt`). Sobrevive a reinicios y recargas.
- **Cada NPC es una copia** de una plantilla flotante de
  `refuges-core.txt` (`Refugio#rf`, `Caravanero#rf`, `Caravana#rf`); el
  Intendente es una `shop`. Las copias se reconocen por su nombre oculto
  (`rf_<id>`, `rf_<id>_s`, `rf_<id>_c`, `rf_<ciudad>`).
- **Cómo se ve cada refugio** lo decide `F_Refuge_Show` al cargar y al
  terminar una etapa: `setnpcdisplay` cambia el nombre y el sprite, y
  `enablenpc`/`disablenpc` muestran el Intendente y el Caravanero.
- **Los objetos de otros mods** del Intendente se añaden al cargar con
  `npcshopadditem`, solo si su mod está: así la línea de la `shop` no nombra
  objetos que quizá no existan.
- `refuges-core.txt` se carga antes que `refuges-places.txt` (orden de
  nombre), porque las copias necesitan su plantilla.

### Cambiar los refugios

Refugios y etapas están en
[`registry/tools/refuges/refuges.csv`](../../registry/tools/refuges/refuges.csv)
y [`stages.csv`](../../registry/tools/refuges/stages.csv). Se regenera con:

```
node registry/tools/refuges/build_refuges.cjs [carpeta db/re de rAthena]
```

Genera `npc/refuges-places.txt` (no se edita a mano). Comprueba que el mapa
sea un campo del atlas y la ciudad una ciudad, que cada refugio tenga las
etapas 1, 2 y 3 y que la caravana de una ciudad esté en un solo sitio. Si
encuentra las tablas de rAthena (por defecto `vendor/rathena/db/re`),
comprueba que existan los objetos, y con su map cache, que la fogata, el
Intendente (x+2), el Caravanero (x−2), la llegada de la caravana (y−2) y la
Caravana de la ciudad estén en celdas transitables. `--check` falla si el
archivo generado no está al día.

Un refugio nuevo en otro mapa debería llevar además `rest=1` en el atlas; hoy
ningún mod lee esa columna y sigue a 0.

## Para otros mods

Nada público todavía. Usa `F_Campfire_Rest` de `campfire` y
`Adventure::OnRest` y `F_Adv_Experience` de `adventure`.

## Probarlo

Con `world-atlas`, `campfire` 0.2.0, `adventure` y `survival` activos.

1. **Carga:** `ragnarok-stack logs map 100` sin errores de
   `refuges-core.txt` ni `refuges-places.txt`, ni `Duplicate unique name`.
2. **Ruinas:** `@refugios` dice los dos «en ruinas». En `prt_monk 90,238`
   hay un montón de leña «Refugio en ruinas»; el Intendente y el Caravanero
   no se ven.
3. **Caravana en la ciudad:** en Prontera `153,187`, la Caravana de los
   Refugios cuenta que hay ruinas en la Abadía y en el campo 11, y que
   ningún refugio tiene cobertizo.
4. **Entregar en dos viajes:** `@item 905 10`, «Entregar materiales»:
   entrega 10 Stem; «Siguiente etapa» dice 10 / 20. `@item 905 10`,
   `@item 919 10`, `@item 914 20` y `@zeny 3000`, entregar y pagar: «Techo y
   fogata terminado» en el mapa, las ruinas pasan a ser una hoguera llamada
   «Refugio de la Abadía» y sale el relato «Restauré el Refugio de la
   Abadía» (`@relatos`).
5. **Descansar:** con un relato sin contar, «Descansar junto al fuego»:
   Descansado 20 min (`@fogata`) y «Cuentas N relatos». `@relatos` sin
   expedición.
6. **Despensa:** `@refugio monk 2`: aparece el Intendente con sus objetos,
   también Leña, Venda y Cantimplora.
7. **Caravana:** `@refugio monk 3`: aparece el Caravanero; viajar a Prontera
   cobra 300 zeny y deja junto a la Caravana. Desde la Caravana, el Refugio
   de la Abadía sale en el menú y lleva junto a la fogata.
8. **Persistencia:** reinicia el servidor (o recarga los mods): el refugio
   sigue restaurado, con su nombre, sprite e Intendente.
9. **Volver a empezar:** `@refugio monk 0` y `@refugio f11 0`.
10. **Grupo:** con un segundo personaje en grupo y en el mismo mapa, al
    terminar la etapa 1 los dos ganan el relato.
