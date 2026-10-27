# Rumores

Diseño de los rumores que llevan a algo: la cadena «Rumor → Pista → Hallazgo
→ Consecuencia» de [`PLAN.md`](./PLAN.md). Lo decidido está en
[`DECISIONS.md`](./DECISIONS.md) (D41–D44); lo demás es propuesta hasta que
exista. Escrito el 2026-10-26.

**Estado:** la primera cadena, «La puerta tapiada», está escrita en
`tavern-rumors` 0.3.0 con `adventure` 0.5.0 (sin probar en el juego). Lo que
hace y cómo se prueba está en la
[sección «Las cadenas de rumores» de su README](./tavern-rumors/README.md#las-cadenas-de-rumores).
Faltan la segunda cadena («La madre de la manada», con el talismán) y los
rumores de clima. El **alijo** de `tavern-rumors` 0.2.0 (D41) sigue ahí y
es **provisional**: comprar botín le quita sentido a la mazmorra.

## La idea

Un rumor **no es un premio, es un motivo y un camino.** Te dice adónde ir y
qué buscar; lo que encuentras allí no es botín sino el siguiente paso de una
historia, y al final de la historia **algo cambia en el mundo**. El botín
sigue saliendo de los cofres de las mazmorras (D35), y el rumor te mete en
una mazmorra en vez de ahorrártela (D42).

Y un rumor **nace de lo que has vivido** (D43): cuentas que aguantaste el
calor intenso y alguien te habla de un oasis escondido en esa zona
caliente. Cada relato concreto puede abrir un rumor concreto. Así los
relatos de [`ADVENTURE.md`](./ADVENTURE.md) no solo dan EXP: también abren
el mundo.

## La cadena

| Paso | Qué pasa | Paso del bucle ([`FLUJO.md`](./FLUJO.md)) | Qué decisión añade |
|---|---|---|---|
| 1. **Disparador** | cuentas un relato concreto (o entregas un talismán de némesis, opción) | contar | qué contar y dónde |
| 2. **Rumor** | quien te escucha te habla de algo en una mazmorra de la región | ciudad | si ir ahora o prepararse |
| 3. **Rastro** | en esa mazmorra, en una zona que dice el rumor, hay un rastro: un cadáver con una nota, una llave, un objeto raro. Te lo llevas | fuera | seguir bajando o volver |
| 4. **Análisis** | el rastro se lleva a alguien que sabe leerlo, **en otra ciudad** | volver, viajar | a qué ciudad ir |
| 5. **Final** | la expedición final: un guardián con nombre o una sala que solo se abre para ti, en esa mazmorra | fuera | ir preparado para eso concreto |
| 6. **Consecuencia** | algo queda cambiado **para el mundo** (como los refugios, D32): un pasadizo, un refugio, un mercader, un oasis | gastar, siguiente expedición | usarlo |

Los pasos 3 y 5 pasan **dentro de la mazmorra**, así que se hacen junto con
sus cofres, sus marcas y su presión, en vez de en su lugar. El paso 4 da
razones para viajar entre ciudades («hacer funcionales las ciudades»).

### Qué da

- **Relatos:** el rastro, uno Menor; el final, Mayor; una cadena completa,
  **Hito** («terminar una cadena de contratos» ya está en la tabla de
  `ADVENTURE.md`).
- **La consecuencia**, que es el premio de verdad (ver abajo).
- Si se quiere algo para llevar puesto: un **disfraz propio** de la cadena
  (D36 deja la lista para otras actividades). Nada de equipo con afijos: eso
  es de los cofres.

### Consecuencias posibles

Todas son del mundo (estado global en el mod store, como `refuges`), así que
las ve el compañero y no dependen de `cloakonnpc`, que se pierde al cambiar
de mapa.

| Consecuencia | Qué es | Con qué mod |
|---|---|---|
| **Pasadizo** | un atajo oculto que se abre **desde el lado profundo** de la mazmorra hacia la entrada (`PLAN.md`, «Atajos de regreso») | propio (`HIDDEN_WARP_NPC`, sprite 139, comprobado) |
| **Refugio nuevo** | un refugio en ruinas que aparece y se restaura como los de `refuges` | `refuges` (pide una función pública para dar de alta un sitio) |
| **Servicio** | alguien se instala: un mercader, un guía, un cazador que vende lo que sirve contra esa raza | propio |
| **Lugar** | un oasis, un manantial, un santuario: agua para la cantimplora, sombra que da Cómodo, un sitio donde contar | `survival`, `temperature`, `adventure` |
| **Saber** | el lugar de un `remnant` o un fragmento del misterio (D5) | `remnants`, cuando exista `LORE.md` |

## Disparadores

### Relatos contados (el principal)

Al **contar** los relatos (con el Cronista, en la taberna o en un refugio),
algunos tienen un rumor detrás. El rumor no se da al vivirlo, sino al
contarlo: es la respuesta de quien te escucha.

Una tabla de datos dice qué relato abre qué rumor (`rumors.csv`, ver «Cómo
se hace»). Ejemplos con claves que ya existen:

| Si cuentas… | Clave | Te hablan de… |
|---|---|---|
| que aguantaste el Calor intenso sin protección | `weatherlived:<combinación>` | un oasis oculto en una zona caliente de la región |
| que llegaste al piso más hondo de las Cloacas | `map:prt_sewb4` | una puerta tapiada en el fondo, con el escudo de la guardia antigua |
| tu primera herida de un bioma | `wound:<id>` | un curandero retirado que vive en una cueva y sabe tratar esa herida |
| que restauraste un refugio | `refuge:<id>` | otro refugio en ruinas más adentro |
| tu primer bioma de nieve | `biome:nieve` | una expedición perdida en la nieve |

Reglas propuestas:

- **Un rumor activo por personaje**, como el alijo. Los que se abren
  mientras tienes uno esperan en una lista corta y se ofrecen al terminar.
- **Cada rumor, una vez por personaje.** Su consecuencia es del mundo: si ya
  la desbloqueó el compañero, el rumor lo dice y no se ofrece.
- **Cuántos relatos tienen rumor:** pocos y escogidos. Si todo abre un
  rumor, ninguno es especial.

### Trofeos (opción): lo que separa la marca del némesis

Los trofeos de caza (D40) tienen hoy cuatro usos, y la marca y el némesis
se diferencian solo en números. Los rumores pueden separarlos de verdad:

| Trofeo | Va a… | Abre |
|---|---|---|
| **Trofeo de marca** (51600 + raza) | el **tablero**: prueba para el Intendente | una **marca de élite** (como hoy) |
| **Talismán de némesis** (51200 + raza) | la **taberna**: cuentas la historia de quien te mató | un **rumor sobre esa raza**: su guarida o su origen en la región, con una cadena cuyo final es el alfa de esa raza |

El trofeo de marca es la prueba de una cacería (va al tablero, que es de
cacerías). El talismán es una historia personal (va a donde se cuentan
historias). Así cada uno tiene un destino propio, y el talismán gana un
quinto uso sin que lo tenga el trofeo de marca.

El talismán **se entrega** y se gasta, como en sus demás usos (D44).

### Zeny

Las rondas del Tabernero siguen siendo **información** (el tiempo, el
contrato y el némesis), no el disparador de una cadena. El alijo por zeny
(D41) se retira cuando exista la primera cadena.

## Rumores de clima

El ejemplo del oasis y los rumores que solo se cumplen **durante** un evento
(«cuando haya niebla en el Campo 05 se ve el camino») necesitan que el clima
**se vea** empezar y terminar. Hoy el visual es fijo por mapa
([`ARCHITECTURE.md`](./ARCHITECTURE.md#clima-eventual)): el servidor puede
encender la lluvia pero no apagarla, porque roBrowser no procesa
`ZC_REMOVE_EFFECT`. Así que **el clima eventual va antes** que estos rumores
(ver [`ROADMAP.md`](./ROADMAP.md)). Mientras tanto, los rumores que nacen de
un relato de clima sí se pueden hacer: el disparador es el relato, no el
cielo.

## Para la porción vertical (Prontera e Izlude)

Dos cadenas bastan para probar la idea. Las mazmorras de la región son las
Cloacas (`prt_sewb1`–`4`), el Laberinto (`prt_maze01`–`03`) y la mazmorra submarina de Izlude (`iz_dun00`–`05`).

**«La puerta tapiada»** (relato → pasadizo)

1. Cuentas `map:prt_sewb4`, el piso más hondo de las Cloacas.
2. «Los alcantarilleros dicen que allá abajo hay una puerta tapiada con el
   escudo de la guardia antigua.»
3. En `prt_sewb4`, en una zona, el cadáver de un guardia con una **llave
   oxidada** (objeto con lore en `itemInfo.lua`).
4. En **Izlude**, el capitán reconoce la llave: es de una salida que la
   guardia cerró hace años.
5. De vuelta, la puerta: detrás, el guardián que la cerró, con nombre.
6. **Pasadizo** de `prt_sewb4` a la entrada de las Cloacas, para siempre.
   Hito al completar la cadena.

**«La madre de la manada»** (talismán → servicio)

1. Entregas el talismán de un némesis bestia (un Wolf, por ejemplo).
2. «Los lobos de esa camada vienen del Laberinto. Algo los cría allí.»
3. En `prt_maze02`, huesos marcados y pelo de un lobo enorme.
4. En **Prontera**, un cazador viejo lee las marcas: es una loba alfa.
5. La loba alfa, con nombre, en `prt_maze03`.
6. **Un cazador se instala** a la entrada del Laberinto: vende lo que sirve
   contra bestias y cuenta los relatos de la caza.

## Cómo se hace

Todo dentro de los mods, sin tocar la plataforma
([`CLAUDE.md`](../CLAUDE.md), «Where a change belongs»):

- **Datos en un CSV** (`registry/tools/tavern-rumors/rumors.csv`): id,
  disparador (clave de relato o raza de talismán), mazmorra, zona del
  rastro, objeto del rastro, ciudad y NPC del análisis, final (monstruo,
  nombre, fuerza), consecuencia y textos. Un script de Node genera los NPC y
  los datos, como `build_contracts.cjs` de `expedition-board`.
- **Rastro:** lo que ya hace el alijo: una copia de una plantilla
  (`duplicate`) en una celda transitable, colocada al entrar en el mapa
  (`OnPCLoadMapEvent`), que solo abre su dueño. Objetos de rastro en el
  rango de `tavern-rumors` (51400–51499).
- **Guardián:** un monstruo con nombre que aparece al entrar en el mapa,
  como las marcas de `expedition-board` y el némesis. Sin temporizadores.
- **Consecuencia:** estado global en el mod store (`w.<id>.*`; `refuges`
  usa `r.<id>.*`) y NPC que se muestran u ocultan según ese estado.
- **Hook nuevo en `adventure`: qué relatos contaste.** El mod store de
  `adventure` es solo suyo, así que otro mod no ve qué relatos se contaron.
  Hecho en `adventure` 0.5.0: al contar, añade cada clave contada a una variable
  de personaje `adv_told$[]` (las últimas 64), y quien quiera la lee y
  recuerda en su mod store hasta dónde leyó. Es general: cualquier mod puede
  reaccionar a lo contado. Registrado en
  [`CONVENTIONS.md`](./CONVENTIONS.md#datos-compartidos-entre-mods).
- **Dónde vive:** todo en **`tavern-rumors`** (D44): el NPC que escucha, el
  rumor, el rastro, el análisis, el final y la consecuencia. Reutiliza el
  código del alijo.

## Decidido con el autor (2026-10-26, D44)

- **Quién da los rumores:** un **NPC propio en la taberna**, un viajero
  veterano junto al Tabernero, que escucha los relatos, da los rumores y
  recibe los talismanes. El menú del Tabernero no crece. Si cuentas con el
  Cronista o en un refugio, el rumor te espera en la taberna («ya se sabe lo
  que contaste»).
- **El talismán de némesis se entrega:** se gasta, como en sus otros usos
  (D40, «de un solo destino»).
- **Las cadenas viven en `tavern-rumors`**, no en un mod nuevo.
- **Clima eventual por la vía C** (arreglo en el fork de roBrowser más el
  plugin de `clima`), antes de los rumores de clima.

## Preguntas abiertas

1. **Grupo:** el rumor es de quien lo contó. ¿El compañero puede seguirlo?
   Propuesta: el rastro lo recoge el dueño, y el final y la consecuencia dan
   crédito al grupo en el mapa (regla de grupo de `CONVENTIONS.md`).
2. **El alijo actual:** ¿se retira del todo al llegar la primera cadena, o
   queda como rumor menor sin equipo?
