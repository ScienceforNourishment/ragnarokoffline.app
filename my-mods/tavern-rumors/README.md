# tavern-rumors

La **taberna** de Prontera. Por una ronda, el Tabernero cuenta lo que se dice
de un tema: qué tiempo hace donde vas, qué le duele al monstruo de tu contrato
o dónde te espera tu némesis. Y es un lugar de descanso: sentarse junto al
fuego cuenta los relatos de [`adventure`](../adventure/README.md) y cierra la
expedición, como el Cronista.

Es el quinto de «Mods nuevos propuestos» en [`PLAN.md`](../PLAN.md) y el
«Rumor» con el que empieza el bucle de H2 ([`ROADMAP.md`](../ROADMAP.md)).
Desde la 0.2.0 también vende el **rumor de un alijo** escondido en los
campos (provisional, D41). Desde la 0.3.0, el **Viejo Trotamundos** convierte
los relatos que cuentas en **cadenas de rumores** que llevan a una mazmorra y
dejan algo cambiado en el mundo (D42–D44, [`RUMORES.md`](../RUMORES.md)).

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.4.0 (la de `mod.json`), escrita el 2026-10-26. Añade la
  segunda cadena, **«La madre de la manada»** (ver «Las cadenas de
  rumores»), y lo que pedía al motor: el disparador por **talismán de
  némesis** (se entrega al Trotamundos y se gasta, D44), el final en **otro
  mapa** que el rastro (`final_map`), los textos de la puerta por cadena
  (`door_action`, `door_open`) y una consecuencia nueva, el **servicio**: un
  NPC generado que aparece para todos al terminar la cadena, con su tienda
  e historias. Trae el **Ungüento del Cazador** (51450), que solo vende ese
  servicio, desde `registry/tools/tavern-rumors/wares.csv`. «La puerta
  tapiada» no cambia, salvo dos textos: el guardián se anuncia con «Algo
  se acerca: …» y quien no es el dueño de la puerta lee «Puerta Tapiada. No
  es asunto tuyo.». **Sin probar en el juego**; solo comprobaciones
  estáticas (llaves y comillas, cabeceras, `mod.json`,
  `build_chains.cjs --check`). Comprobado contra el rAthena fijado
  (`8aea17a`, descargando los archivos): la entrada del Laberinto
  (`prt_fild01 136,373` → `prt_maze01 99,31`; se sale a `prt_fild01
  136,368`), los sprites (`4_SKULL_MUD` 471, `4_WOODPILE` 10026,
  `4_M_EINOLD` y `4_M_JOB_HUNTER` exportados), el Wolf (1013, nivel 45,
  1091 HP), `delitemidx`, `callshop`, que `explode` parte por un carácter y
  que `bonus_script` con `BSF_FORCE_REPLACE` renueva la duración en vez de
  sumarla. Por ver en el juego: los sprites 471 y 10026, el sitio del
  Cazador Viejo (`prontera 145,187`) y del Cazador del Laberinto
  (`prt_fild01 139,366`, junto a la salida), y el icono del ungüento
  (`이속증가포션`, el de una poción). También en la 0.4.0, el **alijo pasa a
  tierras lejanas** (D45, ver «Lejos o cerca»), con el ajuste
  `find_nearby` encendido para las pruebas; necesita `world-atlas` 0.2.2
  para ir lejos. Sin probar; la elección del campo por banda se simuló con
  los datos del atlas
- **0.3.0:** añade las
  **cadenas de rumores** (ver «Las cadenas de rumores»): el Viejo
  Trotamundos, `npc/tavern-chains.txt` (el motor), `npc/tavern-chains-data.txt`,
  `db/item_db.yml` y `System/itemInfo.lua` (generados desde
  `registry/tools/tavern-rumors/chains.csv`), el comando GM `@rumor` y la
  primera cadena, **«La puerta tapiada»**. Necesita `adventure` 0.5.0, que
  publica los relatos contados (`adv_told$`). **Sin probar en el juego**;
  solo comprobaciones estáticas (llaves y comillas, cabeceras, `mod.json`,
  `build_chains.cjs --check`). Comprobado contra el rAthena fijado
  (`8aea17a`, descargando los archivos): la firma de `duplicate` con área de
  contacto (`xs`, `ys`), que `movenpc` **no** mueve el área de contacto (por
  eso el pasadizo es un `duplicate`), que una celda fuera del mapa no es
  transitable, los sprites (`4_SOLDIER_SKEL` 10016, `4_4JOB_SEALSTONE`
  10371, `WARPNPC` 45, `8W_SOLDIER`), los 23 bytes de un nombre de monstruo
  y la entrada de las Cloacas (`prt_sewb1 131,247`). Por ver en el juego:
  que se vean los sprites 10016 y 10371, el sitio del Trotamundos
  (`prt_in 175,27`) y del Capitán (`izlude 129,121`), y el icono de la llave
  (`나무조각`, el de un trozo de madera, a falta de uno de llave)
- **0.2.0:** añade el
  **rumor de un alijo** (ver «El rumor de un alijo»): `npc/tavern-finds.txt`,
  la opción «Preguntar por algo escondido» del Tabernero y el ajuste
  `find_rounds`. **Sin probar en el juego**; solo comprobaciones estáticas
  (llaves equilibradas, cabeceras con tabuladores, `mod.json` válido). El
  `vendor/rathena` no estaba en esta copia, así que no se comprobó contra el
  rAthena fijado: usa solo comandos que ya usan otros mods probados
  (`duplicate`, `hideonnpc` y `unloadnpc` de `campfire`, `checkcell` de
  `dungeon-chest`, `OnPCLoadMapEvent` de `adventure`). Decidido con el autor
  (2026-10-26): el botín es el de los cofres, la pista es una zona y no una
  celda, y hay un rumor por personaje sin caducidad
- **0.1.0:** la primera. Solo Prontera (D19)
- **Decidido con el autor (2026-10-23):** una ronda por tema, cobrada solo
  si hay algo que contar; los rumores se eligen en un menú por tema, no al
  azar; solo la taberna de Prontera hasta cerrar la porción vertical
- **Probado:** solo comprobaciones estáticas: llaves y comillas equilibradas,
  cabeceras con tabuladores, `mod.json` válido. Comprobados contra el
  rAthena fijado (`402dd11`): que `select` oculta una opción vacía, que
  `getmonsterinfo` da `MOB_ELEMENT`, `MOB_ELEMENTLV` y `MOB_SIZE`, que
  `strnpcinfo(4)` es el mapa del NPC, y la tabla de elementos de Renewal
  (`db/re/attr_fix.yml`)
- **Probado en el juego (0.1.0, 2026-10-23):** «Probarlo» completo, sin
  fallos según el autor, y el log de la sesión sin errores del mod. El
  Tabernero se ve en `prt_in 180,23` (sprite `4_M_MANAGER`) y se le habla
  desde fuera de la barra. Hubo un fallo en la primera prueba: «Preguntar por
  el tiempo», sin contrato ni némesis, **se colgó** con la ventana abierta.
  `F_Tavern_Gossip` pregunta por `prt_fild00`, que no tiene clima, y
  `F_Clima_Now` de `clima` 0.4.0 fallaba con un mapa así (log:
  `getelementofarray: index out of range (-1)`). Se arregló en `clima` 0.4.1
  y la repetición fue bien
- **Actualizado:** 2026-10-26

## Instalar

Settings → Mods → **Add mod from folder…** → `my-mods/tavern-rumors`, y
recarga los mods del servidor. Desde la 0.3.0 trae `System/` (la llave de
la cadena): **reinicia la aplicación** al instalarlo. Es Renewal (`"era": "renewal"`), porque la tabla de
elementos es la de Renewal (D1).

## Qué hace

El **Tabernero** está en la taberna de Prontera (`prt_in 180,23`, detrás de
la barra, junto al Bartender de siempre). Su menú:

| Opción | Qué dice | Cobra |
|---|---|---|
| Preguntar por el tiempo | el tiempo en el mapa de tu contrato y en el de tu némesis: lo que hay ahora, cuánto dura, lo que viene y qué protege. Si no tienes ninguno de los dos, lo que se comenta de los campos de Prontera: hasta tres eventos en curso o, si no hay, el próximo que llega | una ronda |
| Preguntar por mi contrato | dónde anda tu marca o cuántos te faltan de tu cacería, y qué le duele al monstruo | una ronda |
| Preguntar por mi némesis | dónde te espera y cerca de qué celda, cuánto ha crecido y qué le duele | una ronda |
| Preguntar por algo escondido | el rumor de un alijo: en qué campo y cerca de qué punto (ver abajo). Si ya tienes uno, lo repite | `find_rounds` rondas (3); repetirlo, gratis |
| Sentarme a contar lo vivido | cuenta los relatos y cierra la expedición (`Adventure::OnRest`) | gratis (D26) |

**Una ronda por tema.** Antes de cobrar, el Tabernero prepara el rumor; si no
hay nada que contar (sin contrato, sin némesis, sin `clima`), lo dice gratis.
Si lo hay, pregunta si pides la ronda. Precio, con `round_price` (por
defecto 200) en la banda 1:

| Nivel base | 1–39 | 40–59 | 60–89 | 90–119 | 120–149 | 150+ |
|---|---:|---:|---:|---:|---:|---:|
| Ronda (zeny) | 200 | 400 | 700 | 1000 | 1500 | 2000 |

Las bandas son las de `adventure` y `dungeon-chest`. Es un valor de prueba: la
economía está abierta ([`DECISIONS.md`](../DECISIONS.md#abiertas)).

**Qué le duele a un monstruo.** Sale de su elemento y nivel de elemento
(`getmonsterinfo`) y de la tabla de Renewal de rAthena. Dice su elemento y
tamaño, los elementos que más daño le hacen (si alguno pasa del 100 %), los
que no le hacen nada y los que hacen un 50 % o menos. Un monstruo neutro no
tiene elemento que le duela más; un fantasma de nivel 4 no recibe daño de los
ataques neutros, y lo dice.

### El rumor de un alijo

Desde la 0.2.0. Es la cadena «Rumor → Pista → Hallazgo» de
[`PLAN.md`](../PLAN.md): el Tabernero vende el rumor, el rumor es la pista y
el alijo es el hallazgo.

1. **Rumor.** «Preguntar por algo escondido» cuesta `find_rounds` rondas (3
   por defecto: 600 zeny a nivel 1–39). Antes de cobrar, el Tabernero elige
   un campo (ver «Lejos o cerca») y una celda transitable al azar; si no
   encuentra ninguna, lo dice y no cobra. El diario de `adventure` lo anota.
2. **Pista.** Dice el campo, la ciudad de referencia del atlas y un punto:
   el alijo está a **8 celdas o menos** de ese punto, en cada eje. Hay que
   buscarlo; `/where` da tu celda.
3. **Hallazgo.** Al entrar en ese campo aparece el alijo (sprite de cofre,
   `WA_TREASURE`). Solo lo abre quien compró el rumor; a otro le dice que no
   es suyo. Dentro, con `dungeon-chest` cargado, una **pieza de equipo sin
   identificar con afijos** del Tier del campo (la misma tirada que un
   cofre, D35); sin él, el doble de zeny de lo que costó el rumor. Da el
   relato `rumor:<mapa>` (Menor, una vez por campo, también para el grupo
   en el mapa) y una nota en el diario.

**Un rumor a la vez, sin caducidad.** Mientras no lo encuentres, preguntar
otra vez lo repite gratis. Al encontrarlo puedes comprar otro; comprar uno
nuevo descarga el alijo anterior. El estado está en variables de personaje
(`tr_hm$`, `tr_hx`, `tr_hy`, `tr_px`, `tr_py`), así que sobrevive a cerrar
sesión y a reiniciar el servidor: el alijo se vuelve a colocar al entrar en
su campo (`OnPCLoadMapEvent`; `tavern-finds.txt` pone `loadevent` en los
campos). Sin temporizadores.

El Tier del botín es el del campo, no el del personaje, como en los cofres.
El precio sí sube con su banda de nivel.

**Lejos o cerca** (desde la 0.4.0, D45). El alijo es la recompensa de un
viaje largo, así que va a **tierras lejanas**: un campo del atlas
(`$@wa_field$` de `world-atlas` 0.2.2) cuya ciudad ancla es de **otra
región** (`F_Tavern_Region`: Prontera e Izlude son una), con el **Tier de tu
banda de nivel + 1**. Si no hay ninguno de ese Tier, el más cercano; ante un
empate, el más bajo. Mientras el atlas solo tenga la región de Prontera,
fuera de ella hay campos de Tier 1 y 2, y siempre sale uno de los cinco de
Tier 2 (Mjolnir 12, Lutie 01, Comodo 01, Umbala 01, Mosk 02); con cada
región de H3 la elección crece sola.

Para las pruebas, el ajuste **`find_nearby`** (encendido por defecto, D23)
lo deja en los campos de la ciudad de la taberna (`F_Tavern_Fields`), como
en la 0.2.0. Sin `world-atlas` también va cerca, porque no se sabe qué es
lejos. Se apaga al cerrar la porción vertical.

**Con las cadenas.** El alijo y las cadenas del Trotamundos no se estorban:
variables distintas (`tr_h*` y `tr_c*`) y NPC distintos. Puedes llevar un
alijo pendiente y una cadena en curso a la vez, y terminar cualquiera de
los dos primero.

### Las cadenas de rumores

Desde la 0.3.0. El diseño completo está en [`RUMORES.md`](../RUMORES.md);
aquí, lo que hace el mod.

El **Viejo Trotamundos** está en la taberna (`prt_in 175,27`), junto al
Tabernero. Una cadena se abre de dos formas:

- **Un relato contado.** Cuando cuentas un relato que tiene una cadena
  detrás (con el Cronista, el Tabernero o en un refugio), la próxima vez que
  le hables te ofrece su rumor.
- **Un talismán de némesis** (desde la 0.4.0). Si llevas en la mochila el
  talismán que abre una cadena, te lo pide; si se lo das, **se lo queda**
  (D44) y te cuenta el rumor. Si lo llevas puesto, te pide que te lo
  quites. No lo pide si ya empezaste esa cadena o si el mundo ya tiene su
  consecuencia.

Una cadena a la vez; las demás esperan.

| Etapa | Qué haces | Qué pasa |
|---|---|---|
| Rumor | hablas con el Trotamundos y aceptas | te dice el mapa y un punto: el rastro está a 8 celdas o menos |
| Rastro | entras en ese mapa y lo buscas | aparece el rastro (solo para ti); al tomarlo recibes su objeto y el relato `rastro:<id>` (Menor) |
| Análisis | llevas el objeto a quien sabe leerlo, en otra ciudad | te cuenta qué es y adónde ir: el mismo mapa del rastro o, si la cadena termina en otro, una celda de ese mapa |
| Puerta | vas a esa celda | hay una puerta (o lo que haga de puerta); la abres con el objeto |
| Guardián | lo vences | se gasta el objeto; relatos `final:<id>` (Mayor, también para el grupo en el mapa) y `cadena:<id>` (Hito) |
| Consecuencia | — | la primera vez, algo cambia **para el mundo**: un **pasadizo** en la puerta o un **servicio** (alguien se instala) |

Al Trotamundos también se le puede pedir que **olvide** el rumor en curso:
vuelve a esperar y se pierde lo hecho. Si la consecuencia de una cadena ya
la consiguió otro personaje, el rumor no se ofrece: lo dice y la da por
cerrada.

**«La puerta tapiada»** (`puerta`), la primera:

- **Disparador:** contar el relato `map:prt_sewb4` («Primera vez en» el
  fondo de las Cloacas).
- **Rastro:** los restos de un guardia en `prt_sewb4`, con la **Llave
  Oxidada** (51400; no se puede soltar, comerciar ni guardar).
- **Análisis:** el **Capitán de la Guardia** de Izlude (`izlude 129,121`).
- **Guardián:** el **Carcelero de la Cloaca**, un Thief Bug Male con el
  300 % de HP y el 150 % de ATK.
- **Consecuencia:** un **pasadizo** en la puerta que sube a la entrada de
  las Cloacas (`prt_sewb1 131,247`), para todos.

**«La madre de la manada»** (`manada`), desde la 0.4.0:

- **Disparador:** entregar el **Colmillo del Némesis** (51202, el talismán
  de un némesis bruto) al Trotamundos.
- **Rastro:** unos **huesos roídos** en `prt_maze02` (Tier 1), con el
  **Hueso Marcado** (51401; no se puede soltar, comerciar ni guardar).
- **Análisis:** el **Cazador Viejo** de Prontera (`prontera 145,187`, junto
  al tablero mientras duren las pruebas, D23). Elige la madriguera: una
  celda al azar de `prt_maze03`.
- **Puerta:** la **Madriguera**; «Dejar el hueso como cebo».
- **Guardián:** la **Madre de la Manada**, un Wolf con el 400 % de HP y el
  150 % de ATK, en `prt_maze03` (Tier 2).
- **Consecuencia:** un **servicio**. El **Cazador del Laberinto** se
  instala a la salida del Laberinto (`prt_fild01 139,366`), para todos.
  Vende el **Ungüento del Cazador** (51450, 1500 zeny: +10 % de daño físico
  y mágico contra brutos durante 10 minutos; se pierde al morir y otro lo
  renueva, no lo suma), flechas, flechas de fuego, trampas y pociones
  naranjas al precio de siempre, y cuenta historias de caza. **No** se
  cuentan allí los relatos de `adventure` (D10).

El ungüento suma con el trofeo de marca de bruto puesto (+10 %, D40): son
dos `bonus_script` y textos distintos.

**Los datos** salen de `registry/tools/tavern-rumors/chains.csv` (las
cadenas) y `wares.csv` (lo que venden los servicios); no edites los archivos
generados:

```
node registry/tools/tavern-rumors/build_chains.cjs
node registry/tools/tavern-rumors/build_chains.cjs --check
```

Cada fila es una cadena. Los textos van entre comillas si llevan comas, y
`|` empieza una línea nueva. El `id` se guarda en el personaje y en el mundo:
no lo cambies. El script comprueba los ids (12 caracteres como mucho), los
objetos (rastros 51400–51449, mercancías 51450–51499), los mapas, los
números y el largo de los nombres (23 bytes el del guardián).

Columnas que no son evidentes:

| Columna | Qué es |
|---|---|
| `trigger` | `told:<clave del relato>` (con `.` en vez de `:`, como `told:map.prt_sewb4`) o `talisman:<objeto>` (51200–51209) |
| `final_map` | dónde están la puerta y el guardián; si es el mismo que `map`, en la celda del rastro |
| `door_action`, `door_open` | la opción del menú de la puerta (sin `:`) y lo que pasa al elegirla |
| `reward` | `pasadizo` (portal en la puerta hacia `reward_map,x,y`) o `servicio` (NPC en `reward_map,x,y`) |
| `reward_sprite`, `reward_shop`, `reward_tales` | solo para `servicio`: su sprite; su tienda, `id:precio` separados por `\|` (sin precio, el de siempre; los de `wares.csv` lo llevan siempre); sus historias, separadas por `\|\|` |

En `wares.csv`, `bonus` es lo que va dentro de `bonus_script "{ … }"`
durante `seconds` segundos.

**`@rumor`** (GM): sin nada, el estado de tus cadenas; `@rumor <id>` pone
esa cadena en espera, como si hubieras contado su relato o entregado su
talismán (sirve para un personaje que ya contó el relato antes de la
0.3.0); `@rumor <id> reset` la borra del personaje y del mundo, y quita el
pasadizo u oculta el servicio.

Las variables y las claves del mod store están en la cabecera de
`tavern-chains.txt` y en «Nombres» de [`CONVENTIONS.md`](../CONVENTIONS.md#nombres).

### La tabla de elementos (generada)

`npc/tavern-elements.txt` **se genera**; no se edita a mano:

```
node registry/tools/tavern-rumors/build_elements.cjs [ruta/a/attr_fix.yml]
node registry/tools/tavern-rumors/build_elements.cjs [ruta] --check
```

Por defecto lee `vendor/rathena/db/re/attr_fix.yml`. Rehazla cuando se mueva
el pin de rAthena.

## Con otros mods

Todas son dependencias suaves: sin el mod, su tema dice que no se sabe nada y
no cobra. No hay `requires.mods`.

| Mod | Qué lee | Cómo |
|---|---|---|
| `clima` | el tiempo de cada mapa | `F_Clima_*`, tras `getnpcid(0, "Clima#clima")` |
| `expedition-board` | tu contrato | `eb_qid`, `eb_state`, `eb_prog` y `ExpeditionData` |
| `nemesis` | tu némesis | `nm_mob`, `nm_map$`, `nm_x`, `nm_y`, `nm_rank` y `F_Nemesis_Name` |
| `world-atlas` | el nombre de los lugares, la ciudad de la taberna y el Tier del alijo | `F_Atlas_Name`, `F_Atlas_Anchor`, `F_Atlas_Tier` |
| `adventure` | contar los relatos; las notas y los relatos del alijo y de las cadenas; qué relatos contaste (desde `adventure` 0.5.0) | `doevent "Adventure::OnRest"`, `F_Adv_Note`, `F_Adv_Experience`, `adv_told$[]` y `adv_told_n` |
| `dungeon-chest` | el botín del alijo | `F_DungeonChest_PickGear` y `F_DungeonChest_GiveGear`, tras `$@dc_ready` |

Las variables de `expedition-board` y `nemesis` son suyas: este mod solo las
lee. Si cambian de nombre, hay que tocar aquí. El Tabernero no ve cuántos
relatos llevas (el mod store de `adventure` es solo suyo); lo dice
`adventure` en el chat al contarlos.

**El Cronista sigue.** La taberna es otro sitio donde contar, no lo
sustituye; si el Cronista se retira se decide aparte
([`ADVENTURE.md`](../ADVENTURE.md#el-diario-dentro-de-adventure)).

## Otra ciudad

Para abrir otra taberna (H3): duplica al Tabernero en un interior de esa
ciudad que esté en el atlas con su `anchor`, y añade sus campos a
`F_Tavern_Fields` y una línea `<campo>	mapflag	loadevent` por campo al
principio de `tavern-finds.txt` (sin ella, el alijo no aparece). La ciudad
sale del atlas, por el mapa donde está el NPC.

## Probarlo

Con `world-atlas`, `clima`, `expedition-board`, `nemesis` y `adventure`
activos, y zeny en el personaje.

1. **Carga:** `ragnarok-stack logs map 100` sin errores de
   `tavern-rumors.txt` ni `tavern-elements.txt`.
2. **Está:** `@warp prt_in 177 22`. El Tabernero se ve detrás de la barra,
   en `180,23`, y responde con el precio de la ronda (200 a nivel 1–39).
3. **Gratis cuando no hay nada:** sin contrato, «Preguntar por mi contrato»
   dice que mires el tablero y no cobra. Lo mismo el némesis.
4. **El tiempo, sin destino:** «Preguntar por el tiempo» pide la ronda; tras
   pagar, nombra eventos de los campos de Prontera. Compáralo con el
   Pronosticador (`prontera 168,193`): mismos eventos y minutos.
5. **No alcanza:** con menos zeny que la ronda, dice que no llega y no cobra.
6. **Contrato:** acepta en el tablero «Rastro en el campo sur» y pregunta.
   Debe nombrar la marca, `Campo de Prontera 08` y su elemento. Pregunta por
   el tiempo: ahora habla de `prt_fild08`.
7. **Némesis:** con un némesis (muere fuera de la ciudad), pregunta. Debe
   dar el lugar y la celda de `@nemesis`, y su elemento.
8. **Contar:** con relatos sin contar, «Sentarme a contar lo vivido». Al
   cerrar el diálogo, el chat dice «Cuentas N relatos.», sube la EXP, el
   diario escribe el resumen de la expedición y `@relatos` dice que no estás
   de expedición.
9. **Sin `adventure`:** la opción de contar no aparece.

**El rumor de un alijo** (0.2.0), con `dungeon-chest` también activo:

10. **Carga:** sin errores de `tavern-finds.txt` en el log.
11. **Comprar:** «Preguntar por algo escondido» pide 600 zeny (nivel
    1–39). Tras pagar, nombra un Campo de Prontera y un punto; el diario
    (`@diario`) tiene la nota.
12. **Repetir:** preguntar otra vez repite lo mismo y no cobra.
13. **Encontrar:** ve a ese campo. A 8 celdas o menos del punto hay un
    cofre llamado «Alijo». Ábrelo: una pieza sin identificar, el chat
    anuncia el relato y el alijo desaparece. Preguntar otra vez ofrece un
    rumor nuevo, con cobro.
14. **Persistir:** compra otro, sal del juego y vuelve a entrar (o reinicia
    el servidor) antes de ir; al entrar en el campo, el alijo está.
15. **No es tuyo:** con otro personaje, hablar con el alijo dice que no es
    suyo y no da nada.
16. **Mochila llena:** con peso al límite, el alijo no da nada y sigue ahí.

**Las cadenas de rumores** (0.3.0 y 0.4.0), con `adventure` 0.5.0 y la
aplicación reiniciada. El guion detallado está en las secciones 6 y 7 de
[`SESION-DE-PRUEBA.md`](../SESION-DE-PRUEBA.md).

17. **Carga:** sin errores de `tavern-chains.txt` ni de
    `tavern-chains-data.txt`, y el `item_db` de `tavern-rumors` con 3
    entradas (dos rastros y el ungüento).
18. **Disparador:** cuenta el relato `map:prt_sewb4` (o `@rumor puerta`).
    El Trotamundos ofrece «La puerta tapiada».
19. **La cadena entera:** rastro, Capitán de Izlude, puerta, guardián,
    pasadizo. Cada paso, con su nota en el diario.
20. **Persistir:** a mitad de cadena, sal y vuelve a entrar, o reinicia el
    servidor: lo que toca vuelve a estar en su sitio. El pasadizo sigue
    tras reiniciar.
21. **El talismán** (0.4.0): con un Colmillo del Némesis en la mochila, el
    Trotamundos lo pide; «Dárselo» lo gasta y ofrece «La madre de la
    manada». Puesto, pide que te lo quites.
22. **Otro mapa y el servicio:** el Cazador Viejo de Prontera manda a
    `prt_maze03`; allí, la Madriguera y la Madre de la Manada. Al vencerla,
    el Cazador del Laberinto aparece en `prt_fild01` y vende el ungüento,
    que da +10 % contra brutos (compara el daño a un Wolf antes y
    después). Sigue tras reiniciar el servidor.

Anota el resultado en «Estado».
