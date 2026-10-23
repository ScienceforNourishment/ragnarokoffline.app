# travel-journal

> **Sustituido por [`adventure`](../adventure/README.md) 0.1** (D12, 2026-10-17), que
> trae este diario con una pestaña de relatos. No actives los dos. Este mod
> queda como referencia hasta que `adventure` funcione en el juego, y
> entonces se retira. Se conservan Alt+J, `@diario`, los tipos de entrada y el evento
> `TravelJournal::OnLog`. Detalle y migración en
> [`ADVENTURE.md`](../ADVENTURE.md#el-diario-dentro-de-adventure).

Diario del viajero. Registra por personaje lo que le pasa y lo muestra en una
ventana. Es la primera versión: solo escribe dos tipos de entrada por sí mismo
y ofrece un punto de entrada para que otros mods añadan las suyas.

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.2.0 (la de `mod.json`): el `addtimer` de 5 s por personaje (`OnMapTick`) pasa a un solo reloj del NPC (`OnTimer5000`) que entra en cada jugador con `attachrid`. Las entradas propias (mapa nuevo, muerte) se escriben con `callsub`, sin `doevent`, porque `doevent` también pasa por la cola de 2 huecos del personaje. Arregla el error `event queue is full`, que cortaba `OnMapTick` y descartaba `OnLog`. `OnLog` sigue igual para los demás mods. Quitado el diagnóstico `[qdebug]`
- **Probado:** el cliente con `node --check` y sus funciones de lectura con Node
- **Probado en el juego (0.2.0, 2026-10-17):** la primera visita a un mapa (Geffen) se anota; las muertes se anotan; las notas de `wounds` y `expedition-board` llegan
- **Sin probar en el juego:** el resto de «Instalar y probar» (por ejemplo, que un mapa repetido no se anote dos veces)
- **Problemas abiertos:** las notas de otros mods siguen llegando por `doevent "TravelJournal::OnLog"`, que usa la cola del personaje; si se lanza durante un diálogo largo junto con otros eventos, puede perderse
- **Futuro:** se integrará en `adventure` (D12)
- **Actualizado:** 2026-10-17

## Qué hace ahora

- **Primera vez en un mapa:** al pisar un mapa por primera vez, escribe una
  entrada. El primer mapa de un personaje (su ciudad de inicio) también cuenta.
- **Muerte:** cada vez que el personaje muere, escribe una entrada con el mapa.
- Ventana "Diario del viajero" con las entradas de la más reciente a la más
  antigua, con fecha y hora reales. Se abre con el botón **Diario** (bajo el
  botón DB junto al minimapa), con **Alt+J** o con el comando `@diario`.
- Se guardan las últimas **300 entradas** por personaje. Las más antiguas se
  borran al escribir nuevas; el registro de mapas visitados no se borra.
- Los datos viven en el mod store (alcance de personaje), así que sobreviven
  reinicios y se borran con el personaje.

No registra todavía: contratos, heridas, hallazgos ni némesis. Esas entradas
las publicarán sus propios mods (ver abajo).

## Instalar y probar

1. Agrega la carpeta desde **Settings → Mods → Add mod from folder…**, actívala
   y pulsa **Apply**.
2. Cierra y vuelve a abrir la aplicación para cargar el plugin del cliente.
3. Entra con un personaje. En unos 5 segundos debe aparecer la entrada de su
   mapa actual. Abre el diario con Alt+J, el botón o `@diario`.
4. Cambia a un mapa nuevo y espera unos segundos: aparece otra entrada. Vuelve
   a uno ya visitado: no se repite.
5. Muere (por ejemplo con `@die` en un personaje de prueba) y comprueba la
   entrada de muerte con la ventana abierta: se actualiza sola.

Comprueba en `ragnarok-stack logs map 100` que `travel-journal.txt` cargó sin
errores: una línea mal escrita puede detener la carga del archivo entero.

Estado de las pruebas: el cliente se validó con `node --check` y se probaron
sus funciones de lectura con Node. El script del servidor **no se ha probado
en el juego**; está escrito siguiendo `docs/MODDING.md` y `docs/MOD_STORE.md`,
y estos puntos están sin comprobar contra el rAthena fijado:
`doevent` con el jugador conectado, `modstore_set "char", ...` con el alcance
como primer argumento, y la firma de `replacestr`.

## Añadir una entrada desde otro mod

Con el jugador conectado al script, otro mod escribe:

```c
@tj_type$ = "note";
@tj_text$ = "Lo que quieres que diga el diario.";
doevent "TravelJournal::OnLog";
```

- `@tj_type$` y `@tj_text$` son variables temporales del personaje. `OnLog` las
  limpia al terminar.
- Tipos con icono propio: `map`, `death` y `note`. Cualquier otro tipo se
  muestra como nota.
- El texto no debe contener `|` (se reemplaza por `/`).
- Si `travel-journal` no está activo, `doevent` solo deja una advertencia en el
  log y el mod que llama sigue funcionando. No hace falta `requires.mods`.
- El texto se guarda tal cual, en español. Para entradas de lugares, pasa el
  nombre legible (`callfunc("F_Atlas_Name", mapa$)`, con el código como reserva)
  o el código de mapa con tipo `map`, que el cliente traduce si puede.

## Guía: registrar un evento nuevo desde tu mod

Para que un mod deje constancia de algo ("Acepté en Prontera un contrato:
acabar con un Wolf") no hay que tocar `travel-journal`.

1. **Elige el momento.** Debe ser código que corre con el personaje adjunto:
   un diálogo de NPC, un evento de muerte de monstruo (`OnMarkDead` en
   `expedition-board`), `OnPCLoginEvent`, un temporizador de `addtimer`. Desde
   un `OnInit` o un temporizador de NPC (`OnTimerN`) no hay personaje: el
   evento no sabría de quién es la entrada.
2. **Escribe el texto en el momento en que ocurre**, con los datos que ya
   tienes a mano. Sí vale la pena incluir nombres (de monstruo con
   `getmonsterinfo(id, MOB_NAME)`, de lugar con `F_Atlas_Name` o el código de
   mapa, de objeto con `getitemname`). Una frase corta, en pasado y en primera
   persona o neutra, como el resto del diario.
3. **Asigna las dos variables y lanza el evento**, siempre juntas:

   ```c
   @tj_type$ = "note";
   @tj_text$ = "Acepte en Prontera un contrato: acabar con " + getmonsterinfo(.@mob, MOB_NAME) + ".";
   doevent "TravelJournal::OnLog";
   ```

   `doevent` corre `OnLog` de inmediato y con el mismo personaje; al terminar
   las variables quedan vacías. Si `travel-journal` está apagado, solo deja una
   advertencia en el log del servidor y tu script sigue.
4. **Una entrada por acontecimiento.** Registra el hito (aceptar, abatir), no
   cada paso; el diario guarda 300 y las nuevas empujan a las viejas. Evita
   escribir desde sitios que puedan repetirse sin el jugador haciendo nada
   (cada login, cada tick).

Reglas del texto:

- Sin `|` (se cambia por `/`); sin saltos de línea.
- Cabe de sobra una frase de 100 a 150 caracteres. El almacén del personaje
  tiene 64 KiB para todo el mod.
- Con tildes y eñes: la ventana es HTML y las muestra (el atlas las usa), pero
  lo que escribe el script del servidor con ellas **no se ha comprobado**. Los
  mods que pasan por el diálogo del juego usan texto sin tildes; haz igual si
  dudas.

**Tipos.** El tipo decide el icono y cómo se muestra el texto:

| Tipo | Icono | El texto es |
|---|---|---|
| `map` | 🧭 | un código de mapa; el cliente escribe "Primera vez en …" |
| `death` | 💀 | un código de mapa; el cliente escribe "Caíste en …" |
| `note` o cualquier otro | 📝 | una frase, mostrada tal cual |

No uses `map` ni `death` para otra cosa: el cliente reescribe su texto. Para
una entrada normal basta `note`; es lo que usa `expedition-board`. Para dar un
**icono propio** a un tipo nuevo (por ejemplo `contract`), edita `describe` en
`client/index.js` y añade una línea, p. ej.
`if (entry.type === 'contract') return { glyph: '📜', text: entry.text };`;
para un fondo distinto, una regla CSS `.entry.contract { … }` en `STYLE`.
Un cambio en `client/` pide reiniciar la aplicación. Una entrada con un tipo
que el cliente aún no conoce se ve como nota, así que el script del servidor
puede adelantarse al cliente sin romper nada. El tipo son letras minúsculas y
`_`, hasta 24.

**Ejemplo: aceptar un contrato** (en `expedition-board`, al aceptar):

```c
@tj_type$ = "note";
@tj_text$ = "Acepte en " + .@city$ + " el contrato: " + getvariableofnpc(.name$[.@id], "ExpeditionData") + ".";
doevent "TravelJournal::OnLog";
```

Cómo comprobarlo: con el personaje de prueba, provoca el evento y abre el
diario (Alt+J, o espera: la ventana abierta se actualiza sola). Si no aparece,
mira `ragnarok-stack logs map 100`: el aviso `event does not exist` indica que
`travel-journal` no está cargado, y un error de sintaxis en tu archivo impide
que cargue todo.

## Datos que guarda

| Clave (alcance `char`) | Contenido |
|---|---|
| `client.n` | cuántas entradas se han escrito, sin límite |
| `client.e.<n>` | `<unix>\|<tipo>\|<texto>` |
| `visited.<mapa>` | `1` si el personaje ya estuvo en ese mapa |

Solo lo que está bajo `client` lo lee la ventana. El límite del mod store por
personaje es 64 KiB; 300 entradas caben con margen.

Para borrar los datos: **Settings → Mods → travel-journal → Reset data…**.

## Nombres de lugares

Las entradas nuevas de tipo `map` y `death` guardan el **nombre legible** del
mapa ("Campo de Prontera 08"), que el servidor toma de
[`world-atlas`](../world-atlas/README.md) con `F_Atlas_Name`. La dependencia es
suave: si el atlas no está activo o no conoce el mapa, se guarda el código
(`prt_fild08`).

Las entradas anteriores a este cambio y las que quedan con código se traducen en
la ventana con la tabla corta de prefijos de `client/index.js` (`REGIONS`); lo
que no aparece allí se muestra con su código. Los nombres se editan en la
columna `name` del CSV del atlas, no aquí.

## Estructura

```text
travel-journal/
├── mod.json
├── README.md
├── client/
│   └── index.js
└── npc/
    └── travel-journal.txt
```

## Ideas siguientes

- Que `expedition-board` publique también "Contrato cobrado" (hoy escribe "Acepté" y "Marca abatida").
- Que las heridas con nombre se registren al recibirse.
- Entrada del némesis cuando un monstruo mata al jugador.
- Filtros por tipo y notas escritas por el jugador.
- **Resúmenes de expedición** (revisión 2026-10-17): `adventure` escribirá al
  cerrar cada expedición (al descansar y contar) una entrada de tipo `expedition` con duración,
  lugares, relatos y lo que pasó ([`ADVENTURE.md`](../ADVENTURE.md#expedición-y-diario)).
  El cliente necesita un icono y un formato para ese tipo, y para `exp`
  (experiencia nueva).
- **Sin temporizador:** cambiar el reloj de 5 s (`OnTimer5000`) por
  `OnPCLoadMapEvent` con la mapflag `loadevent` en los mapas del atlas. Los
  mapas fuera del atlas dejarían de registrarse; decidir si importa. Desde la
  0.2.0 el reloj ya no sufre el error `event queue is full`, así que no corre
  prisa.
