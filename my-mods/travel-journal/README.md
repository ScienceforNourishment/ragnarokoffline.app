# travel-journal

Diario del viajero. Registra por personaje lo que le pasa y lo muestra en una
ventana. Es la primera versión: solo escribe dos tipos de entrada por sí mismo
y ofrece un punto de entrada para que otros mods añadan las suyas.

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

- Que `expedition-board` publique "Contrato aceptado / cobrado".
- Que las heridas con nombre se registren al recibirse.
- Entrada del némesis cuando un monstruo mata al jugador.
- Filtros por tipo y notas escritas por el jugador.
