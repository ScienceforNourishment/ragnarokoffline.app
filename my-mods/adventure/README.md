# adventure

Expediciones y **relatos**: lo que el personaje vive por primera vez (un mapa,
un bioma, un Tier, una herida) se anota como relato sin contar y se cobra en
EXP al **contarlo con el Cronista** de una ciudad. Contar cierra la expedición
y escribe su resumen en el diario. Incluye el **diario del viajero**, que antes
era `travel-journal`.

El porqué y el diseño completo están en [`ADVENTURE.md`](../ADVENTURE.md); lo
decidido, en [`DECISIONS.md`](../DECISIONS.md) (D9–D12, D25–D27).

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.1.0 (la de `mod.json`), la primera. Expedición (salida, tiempo fuera, muertes, cierre al contar), relatos de mapa, bioma y Tier, relatos que publiquen otros mods (`wounds` 0.4.1 ya lo hace), el Cronista en las 7 ciudades, `@relatos` y el diario con las pestañas Diario y Relatos. Sin temporizadores
- **Probado:** el cliente con `node --check` y sus funciones de lectura (`parseTale`, `duration`, `timeOutside`, `parseEntry`) con Node; el script, solo con comprobaciones estáticas (llaves, cabeceras con tabuladores); `build_mapflags.cjs --check`
- **Sin probar en el juego:** todo. Ver «Probarlo»
- **Suposiciones que hay que comprobar en el juego:**
  - que las mapflags `loadevent` de `adventure-maps.txt` conviven con las de `clima`, que pone la misma en sus campos (no debería importar);
  - que las celdas del Cronista (dos a la izquierda del tablero en cada ciudad) son transitables y que el sprite `1_M_BARD` se ve;
  - las tildes de los textos escritos por el script («la montaña», «Expedición», «·», «→») en el chat y en la ventana.
- **Problemas abiertos:** las notas que otros mods envían con `doevent "TravelJournal::OnLog"` todavía pasan por la cola de 2 huecos del personaje (igual que en `travel-journal`); los relatos no tienen ese problema
- **Actualizado:** 2026-10-17

## Instalar

1. **Desactiva `travel-journal`** y activa `adventure` en el mismo Apply.
   Nunca los dos: los dos definen el NPC `TravelJournal` y el comando
   `@diario`. Las entradas que guardó `travel-journal` no pasan al diario
   nuevo (su mod store es del otro mod); se acepta perderlas (ADVENTURE.md).
2. Necesita `world-atlas` activo (`requires.mods`).
3. Reinicia la aplicación para cargar el plugin del cliente.
4. Comprueba en `ragnarok-stack logs map 100` que `adventure.txt` y
   `adventure-maps.txt` cargaron sin errores.

## Qué hace

**Expedición.** Empieza al pisar un mapa del atlas que no es seguro (campo o
mazmorra) y termina **solo** al contar los relatos (D11). Volver a la ciudad
sin contar sigue siendo la misma expedición. Cuenta el **tiempo fuera** (solo
en mapas no seguros y conectado), las caídas, el primer mapa y el de Tier más
alto. Sobrevive a salir del juego.

**Relatos que detecta él mismo.** Una vez por personaje:

| Clave | Cuándo | Tamaño |
|---|---|---|
| `map.<mapa>` | primera vez en un mapa no seguro del atlas | Menor (4 %) |
| `biome.<bioma>` | primera vez en un bioma | Media (10 %) |
| `tier.<n>` | primer mapa de un Tier | Hito (50 %) |

La EXP se calcula **al ganar el relato**, como porcentaje del nivel de ese
momento por el factor de Tier (×0,1 a ×2 según la diferencia entre el Tier del
mapa y la banda del personaje), con un tope del 60 % de un nivel por relato. Se
cobra al contar, relato a relato. `getexp` le aplica además `quest_exp_rate`
(1x, D8). La fórmula está en [`ADVENTURE.md`](../ADVENTURE.md#cuánta-exp-da-una-experiencia).

Al ganar uno, el chat dice solo el nombre («Nuevo relato: Primera vez en la
nieve.», D27) y el diario anota la entrada ✨. Cuánto vale se ve en la
pestaña Relatos.

**Contar.** El **Cronista**, junto al tablero de cada una de las 7 ciudades
(D23, D26). Es gratis. Cobra todos los relatos, escribe el resumen 🏕️ en el
diario y cierra la expedición:

> Expedición 3 · 42 min fuera · Campo de Prontera 08 → Cueva de Payon 2 ·
> 5 relatos (+61 % de nivel) · 1 caída

**Morir** cuesta lo de siempre (`wounds` y la EXP de rAthena): los relatos se
conservan y reaparecer en la ciudad no cierra la expedición. El diario anota
la caída 💀.

**El diario** (Alt+J, el botón Diario o `@diario`):

| Pestaña | Muestra |
|---|---|
| Diario | primera vez en una ciudad 🧭, relatos ✨, caídas 💀, resúmenes de expedición 🏕️ y notas de otros mods 📝 |
| Relatos | la expedición en curso (número, tiempo fuera, caídas) y los relatos sin contar, con el total aproximado en % de nivel |

`@relatos` dice lo mismo en el chat.

## Para otros mods

**Publicar una experiencia** (con el jugador adjunto):

```c
if (getnpcid(0, "Adventure"))
	callfunc "F_Adv_Experience", "chest:" + .@map$, 1, .@tier, "Abri el cofre de " + .@name$;
```

- `key$`: única por personaje; `tipo:id` o `tipo.id`, con letras, dígitos y
  `_`. Una clave ya ganada no da nada.
- `size`: 1 Menor, 2 Media, 3 Mayor, 4 Hito. `tier`: el del mapa
  (`F_Atlas_Tier`); 0 cuenta como la banda del personaje.
- `text$`: una frase corta, sin punto final; sin `|`.
- **Por qué una función y no solo `doevent`:** el mod store es del mod del NPC
  que corre el script, así que la función no escribe nada: deja la experiencia
  en una cola temporal del personaje (`@adv_q*`) y lanza
  `Adventure::OnQueue`. Si rAthena descarta ese evento (cola de 2 huecos, D22),
  la experiencia espera y se procesa en el siguiente cambio de mapa, al contar
  o con `@relatos`. Solo se pierde si el personaje sale del juego antes.
- `getnpcid(0, "Adventure")` evita llamar a una función que no existe cuando
  `adventure` está apagado (`callfunc` fallaría y cortaría tu script).
- La forma antigua, `@adv_key$`/`@adv_size`/`@adv_tier`/`@adv_text$` +
  `doevent "Adventure::OnExperience"`, también funciona, pero si el evento se
  descarta, el siguiente llamador pisa las variables.

**Contar desde otro lugar de descanso** (taberna, refugio):
`doevent "Adventure::OnRest";` con el jugador adjunto.

**Escribir en el diario:** igual que con `travel-journal`
(`@tj_type$`, `@tj_text$`, `doevent "TravelJournal::OnLog"`); ver su
[README](../travel-journal/README.md#añadir-una-entrada-desde-otro-mod). Tipos
con icono: `map`, `death`, `exp`, `expedition`, `note`.

## Datos que guarda

Mod store, alcance `char`:

| Clave | Contenido |
|---|---|
| `x.<tipo>.<id>` | 1 cuando ya ganó esa experiencia. `x.map.<mapa>` es también «mapa visitado» (también para los seguros, sin relato) |
| `client.n`, `client.e.<n>` | el diario: `<unix>\|<tipo>\|<texto>`, las últimas 300 |
| `client.p.<n>` | relato sin contar: `<base>\|<job>\|<‰ de nivel>\|<tier>\|<texto>` |
| `client.x.*` | la expedición: `on`, `no`, `start`, `out`, `since`, `deaths`, `top`, `from`, `deep`, `pn` |

Para borrar los datos: **Settings → Mods → adventure → Reset data…**.

## Archivos

```text
adventure/
├── mod.json
├── README.md
├── client/index.js            ventana del diario
└── npc/
    ├── adventure.txt          funciones, Adventure, TravelJournal y el Cronista
    └── adventure-maps.txt     GENERADO: loadevent en cada mapa del atlas
```

`adventure-maps.txt` se genera desde `registry/tools/world-atlas/atlas.csv`:

```sh
node registry/tools/adventure/build_mapflags.cjs           # escribir
node registry/tools/adventure/build_mapflags.cjs --check   # ¿está al día?
```

**Al añadir un mapa al atlas, regenera también este archivo**: sin la mapflag,
`adventure` no ve ese mapa.

## Probarlo

**El guion completo, paso a paso, con los textos exactos que deben salir y
una tabla de resultados, es la Parte 3 de
[`SESION-DE-PRUEBA.md`](../SESION-DE-PRUEBA.md#parte-3-adventure-con-un-personaje-nuevo).**
Antes, sigue su «Antes de entrar» (instalar, desactivar `travel-journal`,
reiniciar la aplicación y revisar el log). Lo que sigue es el resumen.

Con un personaje **nuevo** (la cuenta `tester`), `adventure` y `world-atlas`
activos y `travel-journal` apagado:

1. **Carga.** `ragnarok-stack logs map 100`: sin errores en `adventure.txt`;
   el Cronista aparece a la izquierda del tablero de Prontera (158,193).
2. **Ciudad.** Al entrar, el diario (Alt+J) tiene «🧭 Primera vez en
   Prontera». La pestaña Relatos dice «No estás de expedición».
3. **Salir.** Sal a `prt_fild08`. El chat dice «Empieza la expedicion 1.» y
   tres relatos: el mapa, la pradera y el Tier 1. La pestaña Relatos los
   lista, y el tiempo fuera avanza (se refresca cada 30 s).
4. **Repetir.** Vuelve a Prontera y sal otra vez a `prt_fild08`: ningún
   relato nuevo y la misma expedición (sin «Empieza…»). En la ciudad, el
   tiempo fuera no avanza.
5. **Herida** (`wounds` 0.4.1). Muere en un campo (`@die`): diario 💀,
   «Has quedado marcado: …» y «Nuevo relato: Primera vez con …». Cúrala y
   muere hasta que vuelva a salir esa misma herida (`@herida <id>` no sirve:
   no pasa por la muerte): esa vez, sin relato.
6. **Contar.** Habla con el Cronista → «Contar lo vivido». La EXP sube más o
   menos lo que decía la pestaña Relatos (a nivel 1 los números son pequeños
   y se redondean mucho); el diario tiene el
   resumen 🏕️; Relatos dice «No estás de expedición». Salir de nuevo empieza
   la expedición 2.
7. **Sesiones.** Sal a un campo, sal del juego, espera un minuto y vuelve a
   entrar: la expedición sigue y ese minuto no se cuenta como tiempo fuera.
8. **Factor de Tier.** Con `@blvl 69` (nivel 70), un mapa nuevo de Tier 1
   paga ×0,1: el total de la pestaña Relatos apenas sube (0,4 %, que se ve
   como +0 %). `prt_fild11` (Tier 2) suma unos +22 %: el mapa y el Hito de
   Tier 2, los dos a ×0,4.
9. En `ragnarok-stack logs map 2000` no debe salir `event queue is full` para
   `Adventure` ni `experience key refused`.
