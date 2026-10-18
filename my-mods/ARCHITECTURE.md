# Arquitectura y límites

Qué permite la plataforma, dónde están sus límites y cómo diseñar alrededor de
ellos: el clima eventual, el ciclo de día y noche, y el presupuesto de
rendimiento. Las reglas que salen de aquí están en
[`CONVENTIONS.md`](./CONVENTIONS.md); lo decidido, en
[`DECISIONS.md`](./DECISIONS.md).

Analizado el 2026-10-17 contra el código fijado en `config/VENDOR_PINS`:
rAthena `402dd11` y roBrowserLegacy `775f884`, ambos de nuestros forks. Nada de
esto se ha probado en el juego; cada afirmación dice de dónde sale.

## Las piezas

```
 Servidor (rAthena, en la VM)                Cliente (roBrowser, en Chromium)
 ─────────────────────────────               ───────────────────────────────
 npc/ scripts de cada mod  ──dispbottom "@@event <cmd> <txt>"──►  plugin client/index.js
   OnPCLoginEvent, OnNPCKillEvent…             api.on('server:event')
   addtimer por jugador                        api.server.request ◄──► bindatcmd
   mod store (en memoria)                      api.graphics.registerPass / hook
 db/ tablas (item_db, mob_db…)               Tablas generadas al arrancar
                                               (Config.local.js: customMaps,
 specialeffect2 EF_* ─────paquete de efecto──►  WeatherEffect.js, plugins)
```

- El **servidor** decide las reglas; el **cliente** solo dibuja.
- Un mod habla con su plugin con `@@event` (servidor → cliente) y con
  `api.server.request` (cliente → servidor). Ver «Windows and server requests»
  en `docs/MODDING.md`.
- Lo que la app genera **al arrancar** (cielo, clima y música por mapa en
  `mod.json`) es fijo durante la partida.

## Clima eventual

### Por qué hoy es fijo

`"maps": { "<mapa>": { "weather": "rain" } }` en `mod.json` se convierte en una
entrada de la tabla de roBrowser `src/DB/Effects/WeatherEffect.js`
(`addCustomMapWeather` en `src/Renderer/MapRenderer.js`), que el cliente lee
al cargar el mapa. No hay forma de cambiarla durante la partida, y por eso
`clima` hoy solo sortea combinaciones con el mismo visual en cada bioma.

### Lo que existe y lo que falta

| Pieza | Estado | Dónde |
|---|---|---|
| El clima de roBrowser son **efectos**: `EF_RAIN` (161), `EF_SNOW` (162), `EF_SAKURA` (163), `EF_MAPLE` (hojas), `EF_CLOUD*` (niebla y nubes), `EF_POKJUK` (fuegos artificiales) | existe | `src/DB/Effects/EffectTable.js`: cada uno llama a `<Clima>WeatherEffect.startOrRestart` |
| La lluvia tiene charcos, salpicaduras, viento, truenos y sonido | existe | `src/Renderer/Effects/RainWeather.js` |
| **Encender** el clima desde el servidor: `specialeffect2 EF_RAIN` al jugador | funciona | rAthena lo usa para sus mapflags de clima (`clif_weather_check` en `src/map/clif.cpp`) |
| La lluvia y la nieve tienen `stop()` con fundido de salida | existe | `RainWeather.js`, `SnowWeather.js` |
| **Apagar** desde el servidor: `removespecialeffect2 <efecto>` envía `ZC_REMOVE_EFFECT` (paquete `0x0b0d`, cliente 2018-10-02 o posterior; el nuestro es 20221005) | el servidor **sí** lo envía | `BUILDIN_FUNC(removespecialeffect)` en `script.cpp`, `clif_specialeffect_remove` en `clif.cpp` |
| Que roBrowser procese `ZC_REMOVE_EFFECT` y llame al `stop()` del clima | **falta** | `src/Network/PacketRegister.js` no lo registra y `src/Engine/MapEngine/Entity.js` no lo escucha |

Es decir: el servidor ya puede empezar a llover cuando quiera; lo único que no
puede es parar la lluvia.

### Vías

**A. Arreglo en el fork de roBrowser.** Registrar `ZC_REMOVE_EFFECT` y, para
los efectos de clima, llamar a su `stop()`. Es un commit en
`Flux159/roBrowserLegacy`, rama `ragnarokoffline`, seguido de
`scripts/vendor-bump.sh roBrowserLegacy` ([`docs/FORKS.md`](../docs/FORKS.md);
el PR va contra `ragnarokoffline`, no contra `master`). Encaja con las reglas
del proyecto para el fork: es un fallo general (el cliente ignora un paquete
que el servidor envía y que el cliente oficial respeta), toca un solo lugar y
se puede devolver a upstream. Hay que comprobar qué clases de clima tienen
`stop()` además de lluvia y nieve (`CloudWeatherEffect`,
`SakuraWeatherEffect`, `PokJukWeatherEffect`).

**B. Solo el plugin de `clima`.** El plugin dibuja su propio clima con
`api.graphics.registerPass`: lluvia y nieve en pantalla, niebla con la
profundidad de la escena (`linearDepth`), oscurecer en tormenta, relámpagos.
Vive entero en el mod. A cambio, el arte y la calidad son nuestros, y la
lluvia nativa ya es buena.

**C. Combinadas (recomendada).** Las partículas nativas (vía A) para lluvia,
nieve, hojas y niebla, y un pase del plugin para la **atmósfera**, que lo
nativo no tiene: oscurecer el cielo de tormenta, niebla densa que esconde
monstruos, tinte de calor, destellos de relámpago.

### Cómo funcionaría (vía C)

1. `clima` deja de declarar `"weather"` en `mod.json` para los mapas con clima
   eventual (se queda el `sky` si lo tiene).
2. Al empezar un evento, el script ya recorre a los jugadores del mapa: a cada
   uno le manda `specialeffect2 EF_RAIN` (u otro) y
   `dispbottom "@@event clima start <combo>"`.
3. Al terminar: `removespecialeffect2` y `@@event clima stop`.
4. Al entrar en un mapa con un evento en curso (`OnPCLoadMapEvent`, que
   `clima` ya usa), se le manda el estado al que llega. El efecto nativo no
   sobrevive a un cambio de mapa, así que siempre hay que reenviarlo.
5. El plugin escucha `server:event` con el comando `clima` y ajusta su pase de
   atmósfera.

**Pendiente de verificar:** que `specialeffect2` con `EF_RAIN` en un mapa sin
clima de tabla muestre la lluvia en roBrowser, y cómo se comporta un segundo
`startOrRestart` sobre un clima que ya está activo.

## Día y noche

### El de rAthena no sirve

rAthena tiene un ciclo propio (`map_day_timer` y `map_night_timer` en
`src/map/pc.cpp`), pero:

- es binario: de día o de noche, sin transición;
- se configura en `battle_conf` (`day_duration`, `night_duration`), que un mod
  no puede tocar;
- se envía como un estado del personaje (`EFST_SKE`) solo en mapas con la
  mapflag `nightenabled`, y no se ha comprobado cómo lo dibuja roBrowser.

### Propuesta: reloj en el servidor, luz en el cliente

- **Reloj en el servidor.** Una función `F_<Mod>_Phase()` calcula la fase con
  `gettimetick(2)` y un ciclo fijo (por ejemplo, 2 horas reales = 1 día). Es la
  fuente de verdad para lo que afecta al juego: marcas nocturnas, más frío en
  `temperature`, encuentros, rumores, NPC que cierran de noche.
- **Luz en el cliente.** El plugin pide la fase con `api.server.request` al
  entrar en un mapa y la hace avanzar solo con el mismo ciclo.
  - `api.graphics.hook({ light })` reemplaza el sol (`diffuse`) y el ambiente
    (`ambient`) en cada fotograma: amanecer, día, atardecer y noche con
    transición suave.
  - Un pase oscurece y enfría la imagen de noche. El pase recibe las
    lámparas y antorchas del mapa (`uLights`, hasta 32 en pantalla): de noche
    las ciudades se iluminan con sus propias luces.
- **Dónde no hay ciclo:** mazmorras e interiores (`F_Atlas_Kind`). El cliente
  lo sabe con la misma tabla, que el servidor le manda junto con la fase.
- **Dónde vive:** junto al clima, porque los dos comparten pase, reloj y
  plugin. Puede ser `clima` ampliado o un mod nuevo que absorba la parte
  visual (decisión abierta).

### A resolver

- **Choque con `graphics-plus`:** su «Warm sunlight» también usa `light()`.
  Hay que verificar cómo combina el cliente dos `light()` (está dentro del
  fork, no en `patches/client/`), y decidir si el día y noche lo sustituye o
  lo modula.
- **Jugar de a dos:** si el compañero entra por la red de amigos, su reloj
  local se sincroniza con el servidor en cada mapa, así que la diferencia
  queda acotada a un cambio de mapa.
- Si hace falta en el futuro algo que la API no tiene (por ejemplo, oscurecer
  también los sprites y no solo la imagen), sería un pedido pequeño y general
  a la API del cliente, no algo propio de nuestro mod.

## Rendimiento

### La escala real

Con 1 o 2 jugadores, la CPU que gastan los scripts es despreciable:

| Qué | Costo hoy |
|---|---|
| Consultar el atlas | una lectura de variable (`getd "$@wa_<mapa>$"`) |
| Cofres | 179 NPC, cada uno con un temporizador de 10 min |
| `clima` | un temporizador global cada segundo y `OnPCLoadMapEvent` |
| Cadenas por jugador | `survival` 3 (15 s, 15 s, 4 s), `temperature` 1 (4 s), `wounds` 1 (4 s, solo con heridas), `travel-journal` 1 (5 s) |

Lo que limita no es la cantidad de mods, sino cuatro cosas concretas.

### 1. La cola de eventos del personaje: 2 huecos

`MAX_EVENTQUEUE` vale 2 (`src/map/map.hpp`). En `npc_event` y `npc_event_sub`
(`src/map/npc.cpp`), si el personaje está ocupado con un NPC
(`sd->npc_id != 0`: un diálogo abierto o un script adjunto), el evento espera
en la cola; con 2 en espera, el siguiente se descarta con el aviso
`player's event queue is full`. No confundir con `MAX_EVENTTIMER` (32), el
número de temporizadores por personaje.

Consecuencias:

- Una cadena que se vuelve a programar dentro de su propio evento **muere** si
  ese evento se descarta. Fue la causa del error de
  [`ROADMAP.md`](./ROADMAP.md#error-abierto-players-event-queue-is-full),
  confirmada en el log: los ticks se perdían durante un diálogo con un NPC.
- `script_attach_state` (`src/map/script.cpp`) pone `npc_id` en cuanto corre
  **cualquier** script del personaje, así que un `doevent` lanzado desde un
  script en marcha siempre va a la cola.
- `attachrid` (forzado por defecto) entra aunque haya un diálogo abierto y no
  pasa por la cola; `detachrid` devuelve el diálogo a su sitio.

Regla (D22): un reloj del NPC por mod que recorre a los jugadores con
`attachrid`, nada de cadenas de `addtimer` por personaje, y nada de diálogos
ni `sleep` en `OnPCLoginEvent` (ver
[`CONVENTIONS.md`](./CONVENTIONS.md#temporizadores)).

### 2. Los bots y `OnNPCKillEvent`

Los personajes del Population Engine (vendedores falsos, población,
compañeros) entran en modo `autotrade`. rAthena no dispara `OnPCLoginEvent` ni
`OnPCLoadMapEvent` en ese modo (`clif_parse_LoadEndAck` en `clif.cpp`), y el
motor además excluye para ellos la muerte, la desconexión y la muerte de
jugador (`patches/0001-population-engine-hooks.patch`). Así que **no arrancan
nuestros temporizadores**.

Pero **sí disparan `OnNPCKillEvent`** (`mob.cpp`, sin exclusión): cada
monstruo que matan ejecuta todos los manejadores de todos los mods. La
población viene apagada por defecto y puede llegar a 1500 personajes.

Regla: la primera línea de un `OnNPCKillEvent` descarta rápido. Patrón
existente en `expedition-board`: un contador global (`$@eb_hunters`) que
vale 0 cuando nadie tiene una cacería, y entonces el manejador termina en dos
comparaciones. Los bots usan cuentas a partir de
`POPULATION_ENGINE_ACCOUNT_ID_BASE`; falta averiguar ese valor para poder
descartarlos por `getcharid(3)` *(verificar)*.

### 3. La capacidad del mod store

64 KiB por personaje y **por mod** (`docs/MOD_STORE.md`); la app puede subirlo
en una versión futura. Al fusionar `travel-journal` en `adventure` (D12), los
dos comparten ese límite:

| Dato | Tamaño aproximado |
|---|---|
| 300 entradas del diario (`<unix>\|<tipo>\|<texto>`) | unos 30 KB |
| Mapas visitados (`visited.<mapa>`) | unos 30 bytes por mapa |
| Experiencias (`<tipo>:<clave>`) | unos 30 bytes cada una |

Con todo el mundo de Renewal (cientos de mapas y miles de experiencias), se
pasa. Medidas: claves cortas, un tope de entradas del diario más bajo, y no
guardar dos veces lo mismo (la experiencia `map:<mapa>` ya dice que el mapa
fue visitado). Ver [`ADVENTURE.md`](./ADVENTURE.md#riesgos).

### 4. El cliente

Es el presupuesto más ajustado, sobre todo en Steam Deck y móviles
(`mobile-ui`):

- Cada `registerPass` es una pasada a pantalla completa por fotograma.
- Cada `graphics.hook` dibuja dentro de la escena; los que vuelven a dibujar
  el mapa (`drawScene`) son los más caros, como los reflejos de
  `graphics-plus`.
- El clima nativo dibuja partículas; la lluvia, además, charcos y sonido.
- `uniforms()` se llama en cada fotograma: nada de crear objetos ni tocar el
  DOM ahí.
- Una ventana que se actualiza con cada tick del servidor rehace su HTML;
  hay que actualizar solo lo que cambió.

Regla: un solo pase por mod, que junte todo lo suyo (clima y noche en uno,
como `graphics-plus` junta varios efectos), con un interruptor en las
opciones del mod.

### Límites menores

- **Instrucciones por script:** `check_cmdcount` 655 360 y `check_gotocount`
  2048 (`conf/script_athena.conf`). Afecta a los `OnInit` que llenan tablas
  grandes; el atlas crecerá con el mundo entero. Generar los datos como
  asignaciones directas, no como bucles largos.
- **Arranque del servidor:** cada NPC generado (cofres, refugios, restos) se
  carga al arrancar y en cada Apply.

### Cómo medir

- **Servidor:** una sesión de una hora con el modpack completo y luego buscar
  avisos en `ragnarok-stack logs map 20000` (`queue is full`, `infinity
  loop`, errores de script).
- **Cliente:** los fotogramas por segundo en las herramientas de Chromium
  (rendimiento), en el equipo más débil donde se vaya a jugar, con y sin cada
  mod gráfico.
- **Población:** repetir la sesión con la población encendida al máximo que se
  vaya a usar.
