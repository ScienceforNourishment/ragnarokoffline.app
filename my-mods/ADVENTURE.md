# `adventure`: expediciones y experiencias

Diseño del mod que es la **columna vertebral** de la partida. **La 0.1
existe** (2026-10-17): lo que hace y su estado están en
[`adventure/README.md`](./adventure/README.md); este documento es el porqué y
el diseño de las fases siguientes. El balance de castigos y
recompensas que lo rodea está en [`BALANCE.md`](./BALANCE.md); lo decidido, en
[`DECISIONS.md`](./DECISIONS.md); el orden de trabajo, en
[`ROADMAP.md`](./ROADMAP.md).

Nombre: `adventure` y no `expedition`, porque `expedition-board` ya define las
funciones `F_Expedition_*`. Prefijos de este mod: `adv_` (variables),
`F_Adv_*` (funciones) y el NPC `Adventure` (eventos `Adventure::On…`).

**`adventure` absorbe a `travel-journal`** (decidido el 2026-10-17). El diario
del viajero pasa a ser la cara de este mod: ver «El diario dentro de
`adventure`».

## La idea

> No se sube de nivel por matar muchos monstruos y volver rápido. Se sube por
> **haber vivido algo por primera vez**.

Cada **experiencia** es algo que le pasa al personaje **una sola vez**: pisar
un mapa, entrar en un bioma, abrir el primer cofre de una mazmorra, abatir una
marca, resistir una ventisca con el equipo adecuado, ganarse una cicatriz.
Cada una da EXP de base y de trabajo. Como no se repite, la única forma de
seguir subiendo es **ir más allá**: otro mapa, otro bioma, un Tier más alto, un
piso más hondo.

Los monstruos siguen dando su EXP normal: los rates quedan a 1x (D8), que ya
era lento en iRO. Las experiencias **se suman** a esa EXP y aceleran a quien
avanza: quien explora sube más rápido que quien repite el mismo mapa. Si los
datos de la porción vertical muestran que repetir sigue siendo lo mejor, la
palanca es bajar los rates de monstruos (Settings lo permite), no subir los
porcentajes.

## Qué hay verificado (rAthena fijado, `402dd11`)

| Hecho | Dónde | Consecuencia |
|---|---|---|
| `getexp` multiplica por `quest_exp_rate` | `src/map/script.cpp`, `BUILDIN_FUNC(getexp)` | La EXP de experiencias y la de monstruos se regulan por separado en Settings |
| `NextBaseExp` y `NextJobExp` se leen desde script | `doc/script_commands.txt` | La EXP se da como **porcentaje del nivel actual**: vale lo mismo a nivel 10 que a nivel 90 |
| `skill "<Aegis>", <nv>, SKILL_PERM_GRANT` guarda la skill, **ignora el árbol** de la clase y sobrevive a un reset o un cambio de clase | `doc/script_commands.txt`, `src/map/pc.cpp` (`ADDSKILL_PERMANENT_GRANTED`) | Una experiencia puede enseñar una skill |
| `OnPCLoadMapEvent` solo corre en mapas con la mapflag `loadevent` | `doc/script_commands.txt` | Detectar mapas nuevos sin temporizador: el mod pone `loadevent` en los mapas del atlas |
| `OnPCDieEvent` trae `killerrid` | `doc/script_commands.txt`; ya lo usa `wounds` | Quién mató, para cicatrices y némesis |
| Settings acepta rates menores a 1x escritos en la casilla (el deslizador empieza en 1x; el mínimo es 0) | `src/settings.html`, `rateOf` | Se podría bajar la EXP de monstruos desde la app; hoy no se hace (D8) |
| En Renewal el nivel base máximo es 200 (275 en algunas clases) | `db/re/job_exp.yml` | La banda T6 (150 o más) cubre demasiado; ver «Factor de Tier» |

Sin probar en el juego: que `SKILL_PERM_GRANT` funcione para skills fuera del
árbol de la clase en todos los casos (algunas piden un arma o un estado).

## El bucle

```
Salir de la ciudad ─► Expedición en curso ─► Experiencias (relatos sin contar)
        ▲                                         │
        │                         ¿seguir? ◄──────┤ racha: cada experiencia nueva
        │                                         │ sube el multiplicador
        │                                         ▼
        │                     Volver a la ciudad (necesario, no suficiente)
        │                                         │
        └──── Descansar (posada, taberna, fogata de refugio): contar los
              relatos, cobrar la EXP, resumen en el diario. FIN de la expedición
```

1. **Expedición.** Empieza al salir de un mapa seguro (`F_Atlas_IsSafe`) y
   **termina al descansar** (decidido el 2026-10-17): ir a la posada o la
   taberna, o a la fogata de un refugio, y contar el relato. Pisar la ciudad no
   basta, aunque va de la mano: es donde se descansa. Si pasas por la ciudad a
   comprar y vuelves a salir sin descansar, sigue siendo la **misma**
   expedición, con su racha y sus relatos pendientes. No usa temporizadores:
   guarda la hora de salida (`gettimetick(2)`) y suma solo el **tiempo pasado
   fuera** de los mapas seguros, calculado al cambiar de mapa. Al terminar, el
   diario escribe el **resumen de la expedición**.
2. **Relatos sin contar.** Lo que se vive fuera no da EXP en el momento: se
   anota como relato pendiente. Mientras estás fuera, **no subes de nivel por
   experiencias**. Subir de nivel es un acto de volver.
3. **Contar los relatos al descansar** (decidido el 2026-10-17). La EXP se
   cobra **al descansar**, no al pisar la ciudad:
   - en la **posada** o la **taberna** de una ciudad;
   - junto a la **fogata de un refugio**, entendido como los lugares que el
     jugador restaura con recursos en el futuro mod `refuges`. Una fogata
     cualquiera de `campfire` en medio del campo **no** cuenta.

   Contar es lo que cierra la expedición: hasta entonces, los relatos siguen
   en juego. Así la ciudad tiene una razón concreta (descansar y contar) y los
   refugios restaurados valen más: son el único sitio fuera de la ciudad donde
   se cobra, y por tanto donde una expedición larga puede cerrarse sin volver.
4. **Racha.** Cada experiencia nueva dentro de la misma expedición sube un
   multiplicador. Seguir un poco más vale más.

**Quién llama a «contar».** `adventure` expone `Adventure::OnRest`, que cobra
todos los relatos pendientes del personaje adjunto. Lo llaman los lugares de
descanso, cada uno desde su mod y con dependencia suave:

| Lugar | Mod | Estado |
|---|---|---|
| Cronista | `adventure` | hecho en 0.1 (D26) |
| Posadero, al dormir | `wounds` | **no** en 0.1 (D26); se puede reconsiderar |
| Tabernero | `tavern-rumors` | hecho en 0.1, solo en Prontera; gratis (D26) |
| Fogata de un refugio restaurado | `refuges` | hecho en 0.1 (la Abadía y `prt_fild11`); gratis |

`adventure` 0.1 lleva su propio NPC, el **Cronista**, junto al tablero de las
7 ciudades mientras duren las pruebas (D23), y contar es gratis (D26). Se
retira cuando la taberna exista, o se queda si suma identidad.

El riesgo está en el medio: cuanto más lejos, más relatos llevas encima y más
pierdes si caes.

## Cuánta EXP da una experiencia

Un porcentaje del nivel, no un número fijo:

```
EXP base = NextBaseExp × tamaño × factor_de_tier × racha
EXP job  = NextJobExp  × tamaño × factor_de_tier × racha
```

`getexp` aplica además `quest_exp_rate`, que se deja en 1x: los porcentajes de
abajo son el ajuste.

**Tamaño** (valores iniciales, para ajustar):

| Tamaño | % del nivel | Ejemplos |
|---|---:|---|
| Menor | 4 % | mapa nuevo, primer cofre de un mapa, un fragmento de lore |
| Media | 10 % | bioma nuevo, una marca abatida, una cicatriz nueva, resistir un clima |
| Mayor | 25 % | primer cofre de un Tier, el piso más hondo de una mazmorra, un némesis, un refugio restaurado |
| Hito | 50 % | pisar por primera vez un Tier nuevo, terminar una cadena de contratos |

**Factor de Tier.** Cada experiencia tiene el Tier de su mapa (`F_Atlas_Tier`).
El personaje tiene una banda por su nivel, con la tabla de `dungeon-chest`
(T1 menos de 40, T2 40–59, T3 60–89, T4 90–119, T5 120–149, T6 150 o más):

| Tier de la experiencia − banda del personaje | Factor |
|---|---:|
| −2 o menos | 0,1 |
| −1 | 0,4 |
| 0 | 1,0 |
| +1 | 1,5 |
| +2 o más | 2,0 |

Esto es lo que empuja hacia adelante: lo fácil deja de pagar en cuanto lo
superas, y lo que está por encima de tu nivel paga el doble. En Renewal se suma
la penalización de EXP de rAthena por diferencia de nivel con el monstruo, que
empuja en la misma dirección (por eso `exprate-penalty-remover` está fuera del
modpack).

**Pendiente de la curva de progresión:** las bandas vienen de `dungeon-chest`
y se calcularon con monstruos de nivel 1 a ~175. Con el nivel máximo de 200
(D1, D3), T6 probablemente se parte (T6 150–174, T7 175 o más), y las bandas
se recalculan cuando la curva esté hecha.

**Racha:** +10 % por cada experiencia distinta en la misma expedición, hasta
+50 %. Vuelve a 0 al terminar la expedición. Qué le pasa al morir está por
decidir (ver «Morir y las cicatrices»); en 0.2 morir no la toca. El tope del
60 % se aplica con la racha incluida.

**Topes:** un solo relato no da más del 60 % de un nivel. Los relatos se cobran
uno a uno, en orden, así que se puede subir varios niveles al descansar, pero
cada uno se calcula con el `NextBaseExp` del momento en que se ganó (se guarda
la EXP ya calculada, no el porcentaje).

## Catálogo inicial

Clave única por personaje; una vez ganada no vuelve a dar nada. Las que
detecta `adventure` salen solas del atlas: **añadir un mapa al atlas es añadir
experiencias**.

| Clave | Cuándo | Tamaño | La detecta |
|---|---|---|---|
| `map:<mapa>` | primera vez en un mapa no seguro | Menor | `adventure` (`loadevent`) |
| `biome:<bioma>` | primera vez en un bioma | Media | `adventure` |
| `tier:<n>` | primer mapa de un Tier | Hito | `adventure` |
| `long:<min>` | una expedición de 30, 60 y 120 minutos | Media | `adventure` (al cambiar de mapa) |
| `close:return` | volver con menos del 20 % de HP o con una necesidad a 0 ("por los pelos") | Media | `adventure` |
| `mvp:<mob>` | primer MVP de cada especie | Mayor | `adventure` (`OnNPCKillEvent`, con `MOB_MODE & MD_MVP` como `nemesis`) |
| `chest:<mapa>` | primer cofre abierto en ese mapa | Menor | `dungeon-chest` |
| `chesttier:<n>` | primer cofre de un Tier | Mayor | `dungeon-chest` |
| `mark:<contrato>` | primera vez que abates esa marca | Media | `expedition-board` |
| `hunt:<contrato>` | primera vez que completas esa caza | Menor | `expedition-board` |
| `weather:<combo>` | primera vez que tu equipo bloquea ese clima | Media | `clima` |
| `weatherlived:<combo>` | primera vez que aguantas ese clima sin protección hasta que termina | Menor | `clima` |
| `temp:extreme` | Cómodo en un mapa de temperatura ±2 gracias a la ropa | Media | `temperature` |
| `wound:<id>` | primera vez que recibes esa herida o maldición | Media | `wounds` |
| `nemesis:<clase>` | vencer a tu némesis (una vez por clase de monstruo) | Mayor; Hito si era de rango 3 | `nemesis` 0.1 |
| `refuge:<id>` | terminar la etapa 1 de un refugio (techo y fogata) | Mayor | `refuges` 0.1 |
| `rumor:<mapa>` | encontrar el alijo de un rumor de la taberna en ese mapa | Menor | `tavern-rumors` 0.2 (D41) |
| `rastro:<cadena>` | encontrar el rastro de una cadena de rumores | Menor | `tavern-rumors` 0.3 (D42) |
| `final:<cadena>` | vencer al guardián de una cadena | Mayor | `tavern-rumors` 0.3 |
| `cadena:<cadena>` | terminar una cadena de rumores | Hito | `tavern-rumors` 0.3 |
| `lore:<id>` | encontrar un resto con historia | Menor | `remnants` (planeado) |

Los hitos escritos a mano (cadenas, lugares especiales) van en un CSV,
`registry/tools/adventure/milestones.csv` (clave, título, texto, tamaño,
recompensa), que un script de Node convierte en la tabla del mod, como el
atlas.

### Morir y las cicatrices

Morir **enseña, pero solo una vez cada lección**. La primera vez que recibes
cada herida (`wound:<id>`) ganas una experiencia Media; la segunda vez, nada.
Así morir a propósito para ganar EXP no sale a cuenta.

**Qué cuesta morir: idea para pensar, sin decidir.** La postura de partida
(2026-10-17): **no quitarle al jugador la recompensa que ya ganó**, pero sí
penalizar el juego descuidado. Hoy morir ya cuesta una herida (`wounds`) y
la EXP de rAthena. Opciones para evaluar, que se pueden combinar:

| Opción | Qué pasa al morir | Castiga el descuido | Quita recompensa |
|---|---|---|---|
| A. Solo la racha | se pierde el multiplicador de la expedición; los relatos quedan intactos | poco | no, solo lo que aún no ganaste |
| B. Relatos nublados | los relatos no se pierden, pero no se pueden contar hasta curar la herida de esa muerte | sí: obliga a volver y pagar la cura | no, la retrasa |
| C. Descuido medido | el costo depende de la presión al morir: muerto **preparado** (presión baja, comida, protección del clima) no pierde nada; muerto con presión alta pierde la racha y deja los relatos nublados | sí, y solo al descuidado | no |
| D. Muertes seguidas | la primera muerte de una expedición es gratis; la segunda nubla los relatos; la tercera pierde la racha | sí: insistir a ciegas | no |
| E. Tumba | los relatos se quedan en el lugar de la muerte (`remnants`) y se recuperan volviendo allí; si mueres antes de recuperarlos, se pierden | sí | sí, a veces (estilo Dark Souls) |

C es la que mejor encaja con la postura de partida: castiga exactamente lo que
se quiere castigar (salir sin prepararse) y premia la preparación, en la línea
de [`BALANCE.md`](./BALANCE.md). Necesita el tope de presión (`@pr_*`) antes
de poder medirla. E es la más dura y choca con «no quitar recompensa»; queda
anotada por si la partida resulta demasiado blanda.

## Saberes: skills que se desbloquean viviendo

Algunas experiencias, además de EXP, enseñan una **skill** con
`SKILL_PERM_GRANT` (se queda con el personaje aunque cambie de clase o se
resetee). Usar las skills de quest y "platino" que ya existen evita arte y
código nuevos.

Propuesta inicial *(verificar que cada una funciona fuera del árbol de su
clase)*:

| Experiencia | Skill (Aegis) | Por qué |
|---|---|---|
| Primera cicatriz | `NV_FIRSTAID` (Primeros auxilios) | aprendes a vendarte |
| Volver "por los pelos" | `TF_BACKSLIDING` (Retroceso) | aprendes a escapar |
| 2 horas de expedición acumuladas | `SM_MOVINGRECOVERY` (Recuperar HP en movimiento) | el cuerpo se acostumbra al camino |
| Conocer a tu primer némesis | `NV_TRICKDEAD` (Hacerse el muerto) | aprendes a no ser visto |
| Pisar 6 biomas | `MC_LOUD` (Grito) | confianza del viajero |

## Rasgos: maestrías propias de los mods

Otras experiencias dan un **rasgo**: una variable permanente del personaje
(`adv_trait_<nombre>`) que el mod dueño del sistema lee para suavizar su
castigo. Las variables de personaje se ven desde cualquier NPC, así que no hace
falta el mod store ni `requires.mods`. Un rasgo **reduce** una presión, nunca
la anula: es maestría, no inmunidad.

| Rasgo | Se gana con | Lo lee | Efecto |
|---|---|---|---|
| `adv_trait_cold` | 30 min acumulados en nieve | `temperature` | la sensación de frío cuenta 1 menos |
| `adv_trait_heat` | 30 min acumulados en desierto o volcán | `temperature` | la de calor, 1 menos |
| `adv_trait_tough` | curar 3 heridas distintas | `wounds` | las heridas restan 1 punto menos |
| `adv_trait_forager` | 5 biomas distintos | `survival` | hambre y sed bajan un 20 % más lento |

Hecho en 0.3 con estos valores, que son ajustes del mod. «Curar 3 heridas
distintas» cuenta también las maldiciones, y el frío o el calor solo se
rebajan desde Helado o Acalorado, para que un rasgo no dé nunca Cómodo ni su
bono. Detalle en el [README del mod](./adventure/README.md#qué-hace).

Opcional *(verificar)*: un Hito puede dar además **un punto de habilidad**
(`SkillPoint += 1`).

## Expedición y diario

Al descansar y contar, `adventure` escribe en su diario una entrada de tipo
`expedition`:

> **Expedición 7** · 1 h 42 min · Bosque de Payon → Cueva de Payon 3
> 6 relatos (+38 % de nivel), 41 monstruos, 1 cofre T2, volviste con *Cicatriz
> del lobo*.

Cada experiencia nueva deja además una nota corta en el momento ("Primera vez
en la selva"), para que el diario cuente la aventura sin muros de texto. Los
datos del resumen (duración, muertes, Tier más alto, relatos) son también la
**herramienta de balance**: ver [`BALANCE.md`](./BALANCE.md#cómo-ajustarlo).

## El diario dentro de `adventure`

`travel-journal` deja de ser un mod aparte. Razones:

- **Una sola lista de mapas visitados.** El mod store está aislado por mod:
  separados, `adventure` no podría leer los mapas que registró el diario y
  llevaría su propia copia.
- **Una sola detección de cambio de mapa,** con `OnPCLoadMapEvent` y la
  mapflag `loadevent`. Desaparece el temporizador de 5 s del diario
  (`OnMapTick`), uno de los sospechosos del error `event queue is full`.
- **La ventana del diario es la cara natural del sistema.** Pestañas
  propuestas:

  | Pestaña | Muestra |
  |---|---|
  | Diario | las entradas de siempre (mapas, muertes, notas de otros mods), resúmenes de expedición y experiencias nuevas |
  | Relatos | la expedición en curso: tiempo fuera, racha y relatos sin contar |
  | Saberes | las skills ganadas y cómo se ganaron |
  | Rasgos | las maestrías y qué suavizan |

**Qué se conserva del diario actual:** Alt+J, el botón Diario y `@diario`; el
límite de 300 entradas; los tipos `map`, `death` y `note`; y la entrada para
otros mods. **El evento `TravelJournal::OnLog` sigue existiendo** (un NPC con
ese nombre dentro de `adventure`), así que `expedition-board` y `wounds`
siguen escribiendo en el diario sin cambiar nada.

**Migración:**

- Activar `adventure` y desactivar `travel-journal` a la vez; nunca los dos
  activos, o habría dos NPC `TravelJournal` y dos registros de mapas.
- Las entradas que ya guardó `travel-journal` no pasan solas: su mod store es
  del mod `travel-journal`. Como el diario no se probó en el juego, se acepta
  perderlas.
- `adventure` requiere `world-atlas` (`requires.mods`), así que el diario
  también pasa a requerirlo. Los mapas fuera del atlas dejan de registrarse
  como visitados; la entrada de muerte sigue funcionando en cualquier mapa.
- `my-mods/travel-journal/` se retiró el 2026-10-23, tras probar `adventure`
  en el juego; su código queda en el historial de git.

## Cómo lo usan los demás mods

Con el jugador adjunto (hecho en 0.1; detalle en el
[README del mod](./adventure/README.md#para-otros-mods)):

```c
if (getnpcid(0, "Adventure"))
	callfunc "F_Adv_Experience", "chest:" + .@map$, 1,   // 1 Menor, 2 Media, 3 Mayor, 4 Hito
		callfunc("F_Atlas_Tier", .@map$), "Abri el cofre de " + callfunc("F_Atlas_Name", .@map$);
```

- **Una función, no solo `doevent`.** El mod store pertenece al mod del NPC
  que corre el script (`mod_of_npc`, en el fork de rAthena), así que la
  función no puede escribirlo desde otro mod: deja la experiencia en una cola
  temporal del personaje y lanza `Adventure::OnQueue`. Si rAthena descarta el
  evento (D22), la experiencia espera al siguiente cambio de mapa o a contar.
  La forma con `@adv_key$` … `doevent "Adventure::OnExperience"` sigue
  funcionando, pero se puede perder.
- Dependencia suave: `getnpcid` devuelve 0 si `adventure` no está, y la
  llamada no se hace.
- Crédito en grupo (0.2): un quinto argumento `1` en `F_Adv_Experience`,
  o `@adv_party = 1` en la forma con `doevent`.
- `adventure` deduplica por clave (mod store, alcance `char`; una clave ocupa
  unos 30 bytes, el límite es 64 KiB por personaje).
- **Dos jugadores:** con `@adv_party = 1`, los miembros del grupo conectados en
  el mismo mapa ganan la misma experiencia (cada uno la suya, una vez), con el
  patrón de `F_Expedition_PartyAid`.
- El llamador no calcula EXP: solo dice qué pasó, de qué tamaño y en qué Tier.

## Rates recomendados

Decidido (D8): **todo a 1x**: `base_exp_rate`, `job_exp_rate`,
`quest_exp_rate` y drops. Antes se propuso bajar la EXP de monstruos a 0,25x;
se descartó porque 1x ya es lento y deja margen para sumar experiencias.
`quest_exp_rate` a 1x hace que los porcentajes de este documento sean el
único ajuste de la EXP de experiencias.

**Qué medir en la porción vertical:** qué parte de la EXP de un personaje sale
de experiencias, y si un jugador que avanza sube claramente más rápido que uno
que repite. Sin cifra objetivo todavía; la anterior (60–70 %) suponía
monstruos a 0,25x. Si las experiencias disparan el nivel, se bajan los
porcentajes; si pesan poco frente al grindeo, se bajan los rates de monstruos.

**Presupuesto de contenido.** Para que esto funcione, cada banda de nivel
necesita bastantes experiencias. Meta inicial: **30 o más por banda**. Hoy el
atlas tiene 25 campos (casi todos T1) y 183 mazmorras; los Tier 1 y 2 se quedan
cortos sin añadir campos y ciudades menores al atlas
(`tier_of.cjs --unlisted` lista unos 274 candidatos).

## Por fases

1. **0.1:** mapas, biomas y Tiers nuevos; expedición (salida, vuelta,
   duración); relatos cobrados al descansar (`Adventure::OnRest` y su propio
   NPC de posada); experiencias de `wounds`. **Incluye el diario**: se
   trasladan el script y el plugin de cliente de `travel-journal`, con
   `TravelJournal::OnLog` y las pestañas Diario y Relatos. Sin temporizadores. Morir solo cuesta lo que ya cuesta hoy hasta decidir.
2. **0.2:** integración con `dungeon-chest`, `expedition-board`, `clima` y
   `temperature`; racha; crédito en grupo. **Escrita el 2026-10-23**, sin
   probar en el juego, con la pestaña Expediciones del diario; ver el
   [README del mod](./adventure/README.md#estado).
3. **0.3:** saberes (skills) y rasgos, con sus pestañas en el diario. **Los
   rasgos están escritos** (2026-10-23, `adventure` 0.3.0, sin probar en el
   juego), con su pestaña; los **saberes** esperan a decidir qué skills
   («Decisiones abiertas»).
4. **0.4:** hitos del CSV; `nemesis`, `refuges` y `remnants` cuando existan.

## Decisiones abiertas

**Decidido el 2026-10-17** (D8, D10, D11, D12 en [`DECISIONS.md`](./DECISIONS.md)):

- Rates a 1x; las experiencias se suman.
- Los relatos se cuentan al descansar en la posada o la taberna, o junto a la
  fogata de un refugio restaurado.
- La expedición termina al descansar y contar, no al pisar la ciudad.

También decidido el 2026-10-17: se llaman **relatos** (D25); en 0.1 solo
cuenta el Cronista y es gratis (D26); al ganar un relato solo se anuncia su
nombre (D27).

Abiertas:

1. **Qué cuesta morir:** idea para pensar; opciones en «Morir y las
   cicatrices». No quitar la recompensa ganada; sí penalizar el descuido.
2. **Saberes:** qué skills, y si se enseñan solas o con un NPC maestro en una
   ciudad concreta (más trabajo, más identidad de ciudad).

## Riesgos

- **Capacidad del mod store:** 64 KiB por personaje, compartidos con el diario
  que absorbe (D12). Con todo el mundo de Renewal se pasa si no se cuida:
  claves cortas, la experiencia `map:<mapa>` sirve también como «mapa
  visitado» (no guardarlo dos veces) y un tope de entradas del diario. Ver
  [`ARCHITECTURE.md`](./ARCHITECTURE.md#3-la-capacidad-del-mod-store).
- **Bots y muertes:** si `adventure` usa `OnNPCKillEvent` (MVPs, contadores),
  debe descartar rápido a los bots del Population Engine y lo que no le
  interesa ([`CONVENTIONS.md`](./CONVENTIONS.md#muertes-de-monstruos)).
- **Mapas sin contenido:** si un jugador agota las experiencias de su banda,
  solo le queda grindear. Con rates a 1x no se queda atascado, pero pierde el
  incentivo de avanzar. Es la razón del presupuesto de contenido.
- **Experiencias demasiado generosas:** sumadas a la EXP de 1x, un Hito del
  50 % puede saltarse contenido. Medirlo en la porción vertical antes de
  ampliar el catálogo.
- **Mapas de instancia y warps de quest:** `1@algo` no está en el atlas y no da
  experiencia de mapa. Es lo esperado.
- **`loadevent` compartida:** otros mods pueden poner la misma mapflag; no
  pasa nada, cada NPC con `OnPCLoadMapEvent` recibe el evento.
- **Personajes existentes:** al activar el mod, un personaje ya avanzado no
  tiene historial. Opción: la primera vez que entra con `adventure`, marcar
  como vistos sin EXP todos los mapas por debajo de su banda de nivel. (Los
  mapas registrados por `travel-journal` no sirven para esto: su mod store no
  se puede leer desde `adventure`.)
