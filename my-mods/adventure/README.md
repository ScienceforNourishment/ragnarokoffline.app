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

- **Versión:** 0.5.0 (la de `mod.json`), del 2026-10-26: publica **qué
  relatos se contaron**, para que otros mods reaccionen (las cadenas de
  rumores de `tavern-rumors` 0.3.0, D43). Cada relato guarda su clave
  (`pk.<n>` en el mod store) y, al contarlo, `F_Adv_Told` la añade a las
  variables de personaje `adv_told$[]` y `adv_told_n` (ver «Para otros
  mods»). Los relatos ganados antes de la 0.5.0 no tienen clave y no se
  publican. Sin probar en el juego; comprobadas las llaves del script.
- La 0.4.1, del 2026-10-26: `mod.json` declara
  `"renewalFolder": "renewal"`. Sin él, el cargador no leía `renewal/` y los
  logros no llegaban al servidor: en la prueba del 2026-10-26,
  `db/import/achievement_db.yml` cargó sin entradas y cada relato Mayor dio
  `Achievement '9010xx' doesn't exist`. Sin probar en el juego.
- La 0.4.0, del 2026-10-24: **logros** (D39,
  ver «Logros»). Los relatos Mayores e Hitos completan un logro de la ventana
  Alt+K al contarlos, con un disfraz por correo. Pide la app **1.6.7** o
  más. Solo Renewal. Sin probar en el juego; comprobado sin el juego: llaves
  y cabeceras del script, que los 16 ids y sus recompensas coinciden entre
  `renewal/db/achievement_db.yml` y `System/achievement_list.lub`, que los
  AegisName existen en las tablas Renewal del rAthena fijado y que el `.lub`
  es ASCII. Un personaje que ya contó esos relatos antes de la 0.4.0 no
  recibe sus logros.
- La 0.3.1, del 2026-10-24: solo el diario.
  Con `streak_step` o `streak_max` a 0, la cabecera de la pestaña Relatos
  seguía diciendo «racha» (el cliente tomaba el 0 por «sin valor» y usaba
  10 y 50); el servidor ya hacía bien la cuenta. Hallado al revisar el
  código, sin probar en el juego.
- La 0.3.0, escrita el 2026-10-23 y **sin probar en el juego**. Trae los **rasgos** (ver «Rasgos»), con su pestaña
  en el diario, y los valores de la EXP, la racha y los rasgos como
  **Settings** (ver «Ajustes»), con los mismos valores por defecto. Los
  rasgos los leen `temperature` 0.5.0, `wounds` 0.7.0 y `survival` 1.3.0.
  Además: los relatos propios **expedición larga** (`long.30`, `long.60`,
  `long.120`), **por los pelos** (`close.return`) y **primer MVP de cada
  especie** (`mvp.<id>`, de grupo), y **`F_Adv_Note`**, una nota en el diario
  que no se pierde en la cola (la usan ya `wounds` 0.7.0, `nemesis` 0.2.0 y
  `expedition-board` 0.7.0).
  Los **saberes** (skills) de la fase 0.3 de `ADVENTURE.md` siguen sin hacer:
  falta decidir qué skills. Comprobado sin el juego: `node --check` del
  cliente y `streakBonus`, `traitRows` y `describe` con Node; el script,
  llaves, cabeceras con tabuladores y destinos de `callsub` y `callfunc`
- La 0.2.0, también sin probar en el juego. Trae la **racha** (+10 % por cada relato ya ganado en
  la expedición, hasta +50 %), el **crédito en grupo** (último argumento de
  `F_Adv_Experience`, o `@adv_party`), la pestaña **Expediciones** del diario
  (pedida el 2026-10-23) y los relatos de otros mods: cofres (`dungeon-chest`
  0.5.0), marcas y cacerías (`expedition-board` 0.7.0), clima (`clima`
  0.5.0) y temperatura (`temperature` 0.5.0). `refuges` 0.1.1 ya usa el
  crédito en grupo. Comprobado sin el juego: `node --check` del cliente y
  `streakBonus` con Node; el script, llaves y cabeceras con tabuladores
- La 0.1.0, la primera. Expedición (salida, tiempo fuera, muertes, cierre al contar), relatos de mapa, bioma y Tier, relatos que publiquen otros mods (`wounds` 0.4.1 ya lo hace), el Cronista en las 7 ciudades, `@relatos` y el diario con las pestañas Diario y Relatos. Sin temporizadores
- **Probado:** el cliente con `node --check` y sus funciones de lectura (`parseTale`, `duration`, `timeOutside`, `parseEntry`) con Node; el script, solo con comprobaciones estáticas (llaves, cabeceras con tabuladores); `build_mapflags.cjs --check`
- **Probado en el juego (0.1.0, 2026-10-23),** toda la Parte 3 de
  [`SESION-DE-PRUEBA.md`](../SESION-DE-PRUEBA.md) con un personaje nuevo:
  diario y pestaña Relatos al entrar; el Cronista en Izlude (`126,121`) se ve
  y responde; empezar la expedición con sus tres relatos en orden y sin
  mostrar la EXP (D27); 63 % con tres relatos a nivel 1 (esperado ~64 %); un
  solo relato al pisar otro campo de la misma pradera; volver sin contar no
  cierra nada y en la ciudad no corre el tiempo; morir da el relato de la
  herida de `wounds` 0.4.1 y una caída; salir del juego conserva la
  expedición sin contar el tiempo desconectado; contar paga la EXP, escribe
  el resumen 🏕️ y vacía la pestaña; una expedición sin nada nuevo; el factor
  de Tier (21 % frente a ~22 % esperado). Las mapflags conviven con las de
  `clima` y las tildes se ven bien
- **Ojo con los rates:** `getexp` multiplica por `quest_exp_rate`. En la
  prueba estaba a 4x y el personaje subió dos niveles con un 77 %; ya está
  a 1x (D8)
- **Probado en el juego (0.1.0, 2026-10-23):** el Cronista de Geffen, Payon,
  Morocc, Alberta y Aldebaran se ve y responde
- **Probado en el juego (0.4.0, 2026-10-26),** con un personaje nuevo, lo
  de la 0.2 y la 0.3 de un jugador. Los ajustes se ven en Settings → Mods.
  La primera salida a `prt_fild08` dice «racha +30 %» y un total de unos
  +75 %; contar con el Cronista quita la racha; la pestaña **Expediciones**
  lista los resúmenes 🏕️ con el más reciente arriba; la pestaña **Rasgos**
  lista los cuatro con su progreso. Los relatos de otros mods: cofre, marca,
  cacería (sin repetir), clima protegido y sin protección, temperatura y el
  del refugio de `refuges`. Los propios: expedición larga y «Volví por los
  pelos» (morir y reaparecer no lo da). Las notas de `F_Adv_Note` salen en
  la pestaña Diario. Los cuatro rasgos, con `trait_minutes` a 1: Hecho al
  frío, Hecho al calor, Buscavidas y Curtido por las heridas, cada uno con
  su efecto
- **Falla en el juego (0.4.0, 2026-10-26):** los logros no cargaron (ver la
  0.4.1, arriba)
- **Sin probar:** el relato del primer MVP de cada especie; los ajustes
  `pct_minor` y `streak_step` (la 0.3.1); los logros, con la 0.4.1;
  `Adventure::OnRest` llamado desde otro mod (lo cubre
  [`tavern-rumors`](../tavern-rumors/README.md#probarlo)). Contar en la
  hoguera de `refuges` ya está probado
- **Pedido (2026-10-23):** una pestaña solo con las expediciones terminadas,
  para leer la historia del personaje. Hecha en la 0.2.0 y probada el
  2026-10-26
- **Cambia los números de la 0.1:** con la racha, los tres relatos de la
  primera salida a nivel 1 dan unos 75 % en vez de ~64 % (mapa 4 %, bioma
  10 × 1,1 = 11 %, Tier 50 × 1,2 = 60 %, justo el tope), y una expedición
  larga paga hasta un 50 % más por relato
- **Problemas abiertos:** ninguno conocido. Las notas que se envían con `doevent "TravelJournal::OnLog"` todavía pueden perderse en la cola de 2 huecos; desde la 0.3 nuestros mods usan `F_Adv_Note`, que no se pierde
- **Actualizado:** 2026-10-26

## Instalar

1. `travel-journal` se retiró el 2026-10-23 (D12). Si sigue instalado,
   **desinstálalo** en el mismo Apply: los dos definen el NPC
   `TravelJournal` y el comando `@diario`. Sus entradas no pasan al diario
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
| `long.30`, `long.60`, `long.120` | primera expedición con más de 30, 60 y 120 minutos fuera (desde la 0.3) | Media |
| `close.return` | volver a una ciudad con menos del 20 % de HP, o con hambre o sed a 0, sin haber muerto (desde la 0.3) | Media |
| `mvp.<id>` | primer MVP de cada especie (desde la 0.3; también para el grupo en el mapa) | Mayor |

**Relatos que publican otros mods** (desde la 0.2, todos con dependencia
suave; «grupo» quiere decir que también lo ganan los del grupo en el mismo
mapa):

| Clave | Cuándo | Tamaño | Mod |
|---|---|---|---|
| `chest.<mapa>` | primer cofre abierto en ese mapa | Menor, grupo | `dungeon-chest` |
| `chesttier.<n>` | primer cofre de un Tier | Mayor, grupo | `dungeon-chest` |
| `mark.<id>` | abatir la marca de ese contrato | Media, grupo | `expedition-board` |
| `hunt.<id>` | completar esa cacería | Menor | `expedition-board` |
| `weather.<n>` | primera vez que tu equipo te protege de esa combinación | Media | `clima` |
| `weatherlived.<n>` | aguantar esa combinación sin protección 2 min o más, hasta que termina | Menor | `clima` |
| `temp.extreme` | Cómodo gracias a la ropa en un mapa de temperatura ±2 | Media | `temperature` |
| `wound.<id>` | primera vez con esa herida o maldición | Media | `wounds` |
| `nemesis.<clase>` | vencer a tu némesis | Mayor; Hito si era de rango 3 | `nemesis` |
| `refuge.<id>` | terminar la etapa 1 de un refugio | Mayor, grupo | `refuges` |
| `camp.first`, `cook.first` | primera fogata, primer plato | Menor | `campfire` |

La EXP se calcula **al ganar el relato**, como porcentaje del nivel de ese
momento por el factor de Tier (×0,1 a ×2 según la diferencia entre el Tier del
mapa y la banda del personaje) y por la **racha**: cada relato nuevo de la
misma expedición suma un 10 % a los siguientes, hasta +50 %; vuelve a 0 al
contar. Morir no la toca (qué cuesta morir sigue abierto). Tope: el 60 % de un
nivel por relato, racha incluida. Se
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
| Relatos | la expedición en curso (número, racha, tiempo fuera, caídas) y los relatos sin contar, con el total aproximado en % de nivel |
| Expediciones | solo los resúmenes 🏕️ de las expediciones contadas, de la más reciente a la primera (salen de las últimas 300 entradas del diario) |
| Rasgos | los cuatro rasgos: ganados 🎖️ o cuánto falta |

`@relatos` dice lo mismo en el chat, con los rasgos ganados.

**Rasgos** (desde la 0.3, [`ADVENTURE.md`](../ADVENTURE.md#rasgos-maestrías-propias-de-los-mods)).
Maestrías permanentes del personaje que suavizan un castigo de otro mod,
sin anularlo nunca. Son variables de personaje (`adv_trait_*`), así que el
mod que castiga las lee sin depender de `adventure`. Al ganar uno, el chat
dice «Nuevo rasgo: …» y el diario lo anota 🎖️.

| Rasgo | Se gana con | Lo lee | Efecto |
|---|---|---|---|
| Hecho al frío (`adv_trait_cold`) | 30 min acumulados en mapas de nieve | `temperature` | Helado y Congelado cuentan un grado menos |
| Hecho al calor (`adv_trait_heat`) | 30 min acumulados en desierto o volcán | `temperature` | Acalorado y Sofocado, un grado menos |
| Buscavidas (`adv_trait_forager`) | relatos de 5 biomas distintos | `survival` | hambre y sed bajan un 20 % más lento |
| Curtido por las heridas (`adv_trait_tough`) | curar 3 heridas o maldiciones distintas | `wounds` | cada herida resta un punto menos (mínimo 1) |

- El tiempo en un mapa se suma **al salir de él** (o al escribir
  `@relatos`), sin reloj: entrar en la ciudad, salir del juego o pisar un
  mapa de otro bioma cierra la cuenta.
- Cuenta toda cura de verdad: el Posadero, el Sacerdote y vencer al némesis
  (`F_Wounds_CureFrom`). `@herida 0` (GM) no cuenta.
- Un personaje de antes de la 0.3 con 5 biomas ya vividos gana Buscavidas al
  entrar al juego. El tiempo en la nieve y las curas anteriores no constan.
- Que el frío y el calor solo se rebajen desde Helado o Acalorado (no desde
  Fresco o Cálido) es a propósito: así un rasgo nunca da Cómodo ni el bono
  de Bien abrigado.

## Para otros mods

**Publicar una experiencia** (con el jugador adjunto):

```c
if (getnpcid(0, "Adventure"))
	callfunc "F_Adv_Experience", "chest:" + .@map$, 1, .@tier, "Abri el cofre de " + .@name$, 1;
```

- `key$`: única por personaje; `tipo:id` o `tipo.id`, con letras, dígitos y
  `_`. Una clave ya ganada no da nada.
- `size`: 1 Menor, 2 Media, 3 Mayor, 4 Hito. `tier`: el del mapa
  (`F_Atlas_Tier`); 0 cuenta como la banda del personaje.
- `text$`: una frase corta, sin punto final; sin `|`.
- `party` (opcional, desde la 0.2): 1 para que lo ganen también los miembros
  del grupo conectados **en el mapa donde estás al llamar** (regla de grupo
  de [`CONVENTIONS.md`](../CONVENTIONS.md#regla-común-de-grupo)), cada uno con
  su nivel y su racha. El reparto lo hace `Adventure::OnQueue`, que adjunta a
  los demás; por eso, si llamas desde un diálogo, hazlo **después de
  `close2`**. Si el evento se descarta y la experiencia se toma al contar con
  el Cronista, solo la gana el que llamó. Con `adventure` 0.1 se ignora.
- **Por qué una función y no solo `doevent`:** el mod store es del mod del NPC
  que corre el script, así que la función no escribe nada: deja la experiencia
  en una cola temporal del personaje (`@adv_q*`) y lanza
  `Adventure::OnQueue`. Si rAthena descarta ese evento (cola de 2 huecos, D22),
  la experiencia espera y se procesa en el siguiente cambio de mapa, al contar
  o con `@relatos`. Solo se pierde si el personaje sale del juego antes.
- `getnpcid(0, "Adventure")` evita llamar a una función que no existe cuando
  `adventure` está apagado (`callfunc` fallaría y cortaría tu script).
- La forma antigua, `@adv_key$`/`@adv_size`/`@adv_tier`/`@adv_text$` (y
  `@adv_party`, desde la 0.2) + `doevent "Adventure::OnExperience"`, también
  funciona, pero si el evento se descarta, el siguiente llamador pisa las
  variables.

**Una cura para el rasgo Curtido por las heridas** (desde la 0.3, la usa
`wounds`): `callfunc "F_Adv_Cured", <id de la herida>;` con el jugador
adjunto, tras comprobar `getnpcid(0, "Adventure")`. Solo toca variables de
personaje, así que funciona desde cualquier mod y en un diálogo.

**Leer un rasgo:** `if (adv_trait_cold) …` desde cualquier NPC; no hace falta
comprobar que `adventure` esté activo (sin él vale 0).

**Reaccionar a lo contado** (desde la 0.5.0, lo usa `tavern-rumors`): al
contar, cada relato deja su clave, en la forma del mod store
(`map.prt_sewb4`, `wound.3`), en un anillo de 64 variables de personaje:
`adv_told$[k % 64]` es el relato número `k`, y `adv_told_n` cuántos se
publicaron. Guarda en tu mod store hasta qué `k` leíste y lee de
`max(leídos, adv_told_n - 64)` a `adv_told_n - 1`. Sin `adventure`, las dos
valen vacío y 0.

**Contar desde otro lugar de descanso** (taberna, refugio):
`doevent "Adventure::OnRest";` con el jugador adjunto.

**Escribir en el diario**, con el jugador adjunto (desde la 0.3):

```c
if (getnpcid(0, "Adventure"))
	callfunc "F_Adv_Note", "note", "Lo que quieres que diga el diario.";
```

- Como `F_Adv_Experience`, deja la nota en una cola del personaje y lanza
  `Adventure::OnQueue`: si rAthena descarta el evento, la nota se escribe en
  el siguiente cambio de mapa, al contar o con `@relatos`. Sirve en un
  diálogo.
- La forma heredada de `travel-journal` sigue funcionando, pero una nota
  lanzada durante un diálogo largo puede perderse: `@tj_type$` y
  `@tj_text$` + `doevent "TravelJournal::OnLog"`. Sin `adventure`, `doevent`
  solo deja un aviso en el log.
- Tipos con icono: `map`, `death`, `exp`, `expedition`, `trait` y `note`. Cualquier
  otro se muestra como nota.
- El texto no debe llevar `|` (se cambia por `/`). Se guarda tal cual, en
  español: para un lugar, pasa el nombre legible (`F_Atlas_Name`, con el
  código como reserva).
- No hace falta `requires.mods`: `getnpcid` evita la llamada sin `adventure`.

## Ajustes

En Settings → Mods → `adventure`; cambian al pulsar **Apply** (reinicia el
servidor). Los porcentajes son los valores iniciales de
[`ADVENTURE.md`](../ADVENTURE.md#cuánta-exp-da-una-experiencia), para
ajustarlos con los datos de la porción vertical.

| Ajuste | Por defecto | Qué cambia |
|---|---:|---|
| `show_button` | sí | el botón Diario en el juego |
| `pct_minor`, `pct_medium`, `pct_major`, `pct_milestone` | 4, 10, 25, 50 | % de un nivel de cada tamaño de relato |
| `relato_cap` | 60 | tope de un relato, racha incluida (% de nivel) |
| `streak_step` | 10 | % que suma a los siguientes cada relato de la expedición; 0 apaga la racha |
| `streak_max` | 50 | máximo de la racha (%) |
| `trait_minutes` | 30 | minutos en la nieve, o en desierto y volcán, para Hecho al frío o al calor |
| `forager_biomes` | 5 | biomas para Buscavidas |
| `tough_cures` | 3 | curas distintas para Curtido por las heridas |

Los efectos de los rasgos se ajustan en el mod que los lee (`forager_pct` en
`survival`).

## Datos que guarda

Variables de personaje (permanentes): `adv_trait_cold`, `adv_trait_heat`,
`adv_trait_forager`, `adv_trait_tough` (1 con el rasgo), `adv_t_cold` y
`adv_t_heat` (segundos acumulados) y `adv_cured` (un bit por herida curada).

Mod store, alcance `char`:

| Clave | Contenido |
|---|---|
| `x.<tipo>.<id>` | 1 cuando ya ganó esa experiencia. `x.map.<mapa>` es también «mapa visitado» (también para los seguros, sin relato) |
| `ach.<id>` | un logro que espera a que se cuente su relato (ver «Logros»); se borra al contar |
| `client.n`, `client.e.<n>` | el diario: `<unix>\|<tipo>\|<texto>`, las últimas 300 |
| `client.p.<n>` | relato sin contar: `<base>\|<job>\|<‰ de nivel>\|<tier>\|<texto>` |
| `client.t.*` | copia de los rasgos para el diario: `cold`, `heat`, `forager`, `tough` (1 si se tiene) y el progreso, `cold_s`, `heat_s`, `biomes`, `cures` |
| `client.x.*` | la expedición: `on`, `no`, `start`, `out`, `since`, `deaths`, `top`, `from`, `deep`, `pn`, `streak` (relatos ganados desde la última vez que contó, para la racha) |

Para borrar los datos: **Settings → Mods → adventure → Reset data…**.

## Archivos

```text
adventure/
├── mod.json
├── README.md
├── client/index.js            ventana del diario
├── npc/
│   ├── adventure.txt          funciones, Adventure, TravelJournal y el Cronista
│   └── adventure-maps.txt     GENERADO: loadevent en cada mapa del atlas
├── renewal/db/achievement_db.yml   los logros: id, recompensa y puntos (solo Renewal)
└── System/achievement_list.lub     lo que la ventana de logros dice de ellos
```

## Logros

Desde la 0.4.0 (D39). Un relato **Mayor o Hito** completa un logro de la
ventana de logros (**Alt+K**) cuando se **cuenta**, igual que da su EXP; el
del grupo lo gana cada compañero que ganó el relato. La recompensa es un
disfraz que se reclama en la ventana y llega por correo. Los disfraces son de
`registry/tools/dungeon-chest/costumes.csv`, así que alguno puede salir
también de un cofre (D36). Ids **901000–901999** (`CONVENTIONS.md`); nunca
reutilizar uno.

| Id | Relato | Pestaña | Disfraz | Puntos |
|---|---|---|---|---|
| 901001–901006 | Hito: primer paso en Tier 1 a 6 (`tier:<n>`) | Aventura → Rune Midgarts | Adventurer's Hat, Eremes Scarf, Kirin Wing, Valkyrie Wings, Brilliant Golden Wings, Archangel Wing | 20 |
| 901011–901016 | primer cofre de Tier 1 a 6 (`chesttier:<n>`, `dungeon-chest`) | Aventura → Mazmorra | Cookie Ribbon, Analyze Eye, Black Cat, Butterfly Charm, Imperial Glory, Lucifer's Wings | 10 |
| 901021 | el primer MVP (`mvp:<id>`) | Batalla → Entrenamiento | Great Devil Wings | 10 |
| 901031 | el primer némesis vencido (`nemesis:<clase>`) | Batalla → Duelo | Assassin Mask | 10 |
| 901032 | un némesis de rango 3 (el mismo relato, como Hito) | Batalla → Duelo | Crimson Wings | 20 |
| 901041 | el primer refugio restaurado (`refuge:<id>`, `refuges`) | Memorial → Midgard | Fire Muffler | 10 |

Cómo funciona: `F_Adv_Gain` apunta en el store `ach.<id>` al ganar el relato,
y `F_Adv_Rest` completa esos logros al contar (`achievementcomplete`) y los
borra. Los logros solo existen en Renewal (`renewal/db/`): varios de esos
disfraces no están en las tablas Pre-Renewal, y allí el script no los
completa (`checkre(0)`). Para añadir uno: su fila en los dos archivos, con el
mismo id, y su caso en `F_Adv_AchQueue`.

Al apagar el mod, rAthena borra estos logros de cada personaje al entrar
(`docs/mods/CUSTOM_ACHIEVEMENTS.md`).

`adventure-maps.txt` se genera desde `registry/tools/world-atlas/atlas.csv`:

```sh
node registry/tools/adventure/build_mapflags.cjs           # escribir
node registry/tools/adventure/build_mapflags.cjs --check   # ¿está al día?
```

**Al añadir un mapa al atlas, regenera también este archivo**: sin la mapflag,
`adventure` no ve ese mapa.

## Probarlo

El guion completo, con los textos exactos que deben salir, fue la Parte 3 de
`SESION-DE-PRUEBA.md` hasta el 2026-10-23 (ya probado; está en el historial de
git). Antes de probar, instala, reinicia la aplicación y revisa el log. Lo que
sigue es el resumen.

Con un personaje **nuevo** (la cuenta `tester`), `adventure` y `world-atlas`
activos y sin `travel-journal` instalado:

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

### Probar la 0.2

Con un personaje nuevo, `adventure` 0.2.0 y los mods de la tabla activos:

1. **Racha.** La primera salida a `prt_fild08` da los tres relatos de
   siempre; la cabecera de Relatos dice «racha +30 %» y el total es unos
   +75 % (no +64 %). Tras contar, la racha desaparece de la cabecera.
2. **Expediciones.** Tras contar dos expediciones, la pestaña Expediciones
   tiene los dos resúmenes 🏕️, el más reciente arriba, y nada más.
3. **Cofre** (`dungeon-chest` 0.5.0). Abre un cofre (`@cofre`): al cerrar el
   diálogo, «Nuevo relato: Abrí el cofre de …» y «Nuevo relato: Mi primer
   cofre de Tier …». Otro cofre del mismo Tier en otro mapa: solo el primero.
4. **Marca y cacería** (`expedition-board` 0.7.0). Abatir la marca de un
   contrato da «Abatí la marca: …»; completar una cacería, «Completé la
   cacería: …». Repetir el mismo contrato no da nada.
5. **Clima** (`clima` 0.5.0). Con la protección puesta durante un evento,
   «Mi equipo me protegió del clima: …» (hasta 10 s tras empezar o llegar).
   Sin protección, quédate en el mapa desde al menos 2 minutos antes del
   final del evento: al terminar, «Aguanté el clima sin protección: …» (el
   aviso puede salir al cambiar de mapa).
6. **Temperatura** (`temperature` 0.5.0). En un mapa de temperatura ±2
   (`xmas_fild01` con solo la Capa de Piel, `@temperatura` en 0; con la
   Ventisca, que suma −1, hace falta también el Chaleco de Lana):
   «Comodo en pleno frio gracias a mi ropa» (puede salir al cambiar de mapa).
7. **Grupo.** Con dos personajes en un grupo y en la misma mazmorra, uno abre
   el cofre: los dos ganan los dos relatos del cofre. Igual al abatir la
   marca del dueño y al terminar la etapa 1 de un refugio. Si el otro está en
   otro mapa, no gana nada.
8. En `ragnarok-stack logs map 2000`: sin errores de `adventure.txt`,
   `dungeon-chests.txt`, `expedition-board.txt`, `clima.txt` ni
   `temperature.txt`, y sin `experience key refused`.

### Probar la 0.3

Con `adventure` 0.3.0, `temperature` 0.5.0, `wounds` 0.7.0 y `survival`
1.3.0. Para no esperar media hora, pon `trait_minutes` a 1 y pulsa Apply.

1. **Pestaña Rasgos.** Con un personaje nuevo, los cuatro rasgos con «0/1 min
   en la nieve», «0/5 biomas», etc.
2. **Hecho al frío.** Quédate algo más de un minuto en `xmas_fild01` y vuelve
   a Prontera: «Nuevo rasgo: Hecho al frío…», 🎖️ en el diario y «Ganado» en la
   pestaña. Sin ropa, `@temperatura` en `xmas_fild01` da ahora Fresco (−1) en
   vez de Helado (−2), y no sale el icono de frío.
3. **Hecho al calor.** Igual en `moc_fild11`: Cálido en vez de Acalorado.
4. **Buscavidas.** Tras relatos de 5 biomas, «Nuevo rasgo: Buscavidas». Con
   `@presion` mira hambre y sed: bajan un punto cada 18 s en vez de 15 (15 × 100 / 80).
5. **Curtido por las heridas.** Cura 3 heridas distintas (Posadero o
   Sacerdote): a la tercera, «Nuevo rasgo: Curtido por las heridas». Con
   una herida de atributo, el atributo baja un punto menos que antes.
   `@herida 0` no cuenta como cura.
6. **Ajustes.** Con `pct_minor` a 8, un mapa nuevo vale el doble en la
   pestaña Relatos; con `streak_step` a 0, la cabecera ya no dice «racha».
7. En `ragnarok-stack logs map 2000`: sin errores de `adventure.txt`,
   `temperature.txt`, `wounds.txt` ni `survival.txt`.
8. **Expedición larga.** Pasa más de 30 minutos fuera (cuenta el tiempo de
   toda la expedición, no de un mapa): al cambiar de mapa, «Nuevo relato: Más
   de media hora fuera de las ciudades».
9. **Por los pelos.** Vuelve a Prontera con menos del 20 % de HP: «Volví por
   los pelos». Morir y reaparecer en la ciudad no lo da.
10. **MVP.** Abate un MVP (`@monster` como GM vale): «Abatí a …». Otro de la
    misma especie no da nada; un compañero de grupo en el mapa lo gana
    también.
11. **Notas.** Acepta un contrato del tablero y muere en un campo con un
    diálogo abierto si puedes: las notas («Acepté…», la herida) salen en el
    diario, como mucho al siguiente cambio de mapa. En el log no debe salir
    `event queue is full` para `TravelJournal::OnLog`.

### Probar la 0.4

Reinicia la aplicación (el `.lub` se carga con el cliente) y mira
`ragnarok-stack logs map 200`: `Loading '16' entries in
'db/import/achievement_db.yml'` (o más, si otro mod trae logros) y ningún
`Reward ... does not exist`.

1. **La ventana.** Alt+K: los logros salen en Aventura → Rune Midgarts y
   Mazmorra, Batalla → Entrenamiento y Duelo y Memorial → Midgard, con su
   disfraz como recompensa, y los logros de serie siguen ahí.
2. **Al contar, no antes.** Con un personaje nuevo, sal a `prt_fild08`: el
   relato del Tier 1 sale, pero el logro todavía no. Cuéntalo con el
   Cronista: el aviso «< Primer paso en Tier 1 > achieved.» y el logro
   completado en Alt+K.
3. **La recompensa.** Pulsa el botón de recompensa: el Adventurer's Hat
   llega por correo.
4. **Otros.** El primer cofre de un Tier (`@cofre`) y un MVP (`@monster`):
   sus logros al contarlos, no al ganar el relato. Un segundo MVP de otra
   especie no da otro logro.
5. En `ragnarok-stack logs map 2000`: sin errores de `achievementcomplete`
   ni de `F_Adv_AchTell`.
