# Clima

Prototipo de combinaciones climáticas reutilizables en 20 mapas. **El bioma del
mapa, tomado del mod `world-atlas`, decide qué combinaciones pueden ocurrir
allí**; cada vez que empieza un evento se sortea una de las de ese bioma. Cada
combinación tiene un ID que determina su efecto de servidor y, cuando
corresponde, su efecto visual y protección compatible. Requiere `world-atlas`
(`requires.mods`): sin él no se sortea ningún evento.

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.4.0 (la de `mod.json`): **pronóstico**. El siguiente evento de cada mapa se sortea al empezar el actual (`.next_combo[]`), en vez de al empezar él; el Pronosticador de Prontera lo dice, y las funciones `F_Clima_*` lo publican para otros mods. Ver «Pronóstico». La 0.3.0 publica `@pr_clima` (1 si el personaje está en un evento sin su protección) y `@pr_clima_map$` (el mapa del evento), para el tope de presión de [`BALANCE.md`](../BALANCE.md#tope-de-presión). Quien lo lee solo lo cuenta si `@pr_clima_map$` es el mapa actual: salir a un mapa sin `loadevent` no lo borra. El estado alterado del clima no se reduce con el tope. La 0.2.1: solo Renewal (`"era": "renewal"`, D1). Quitada la carpeta `pre-renewal/` y `prerenewalFolder`; en un mundo Pre-Renewal la app rechaza el mod en vez de cargarlo sin sus objetos de protección. La 0.2.0 pasó los eventos de por mapa a por bioma
- **Probado en el juego:** la versión anterior, con eventos por mapa
- **Probado en el juego (0.2.0, 2026-10-17):** los eventos por bioma arrancan (log `[clima] Evento … iniciado`); el Poison de Lluvia tóxica afecta en los campos de Prontera
- **Observado (sin decidir):** el veneno se siente flojo. `S_ApplyWeatherStatus` lo pone 12 s (`.effect_lease`), revisa cada 10 s (`.effect_refresh_interval`) y solo lo vuelve a poner si ya no está (`!getstatus`): queda activo unos 12 s de cada 20 y en el hueco vuelve la regeneración. Mientras dura, rAthena bloquea la regeneración natural y quita 2 + 1,5 % del HP máximo por segundo, pero para al 25 % de HP (regla oficial). Se arregla con una revisión más corta que la duración; afecta a todos los estados del clima, no solo al veneno
- **Sin probar:** el resto desde el paso a eventos por bioma (0.2.0), y todo el pronóstico (0.4.0): el NPC, que el evento anunciado sea el que empieza y los minutos. Comprobado sin el juego: llaves y comillas equilibradas, tabuladores en las declaraciones `function script`
- **Limitación:** el visual es fijo por mapa; ver «Limitación conocida»
- **Actualizado:** 2026-10-17

## Pronóstico

Para que el clima sea preparación y no mala suerte (ver
[`BALANCE.md`](../BALANCE.md#lo-positivo)): el **Pronosticador**
(`Pronosticador#clima_prt`, `prontera 168,193`, junto al tablero mientras
duren las pruebas, D23) dice, para cada mapa con clima:

- **Ahora:** el evento activo y los minutos que le quedan, con el objeto que
  protege de él.
- **Después:** el próximo evento y en cuántos minutos puede empezar, con su
  protección. Es exacto: ese evento ya está sorteado y es el que empezará.
  Si la probabilidad de inicio del mapa baja de 100 %, lo dice («quizá»).

El menú lista primero los mapas cuya ciudad ancla en el atlas es Prontera o
Izlude, con una opción «Toda la región» que los resume en una línea cada uno;
los demás mapas con clima están en «Otras tierras». El pronóstico es gratis.

**Cómo funciona.** Cada mapa guarda en `.next_combo[]` la combinación del
próximo evento. Se sortea en la primera revisión tras arrancar el servidor y,
luego, cada vez que empieza un evento (el siguiente queda decidido mientras
dura el actual). Al empezar, el evento usa la combinación guardada. En los
primeros 30 s tras un reinicio aún no hay pronóstico («todavía no lo sé»).

**Funciones públicas** para `tavern-rumors` y otros mods: `F_Clima_Now`,
`F_Clima_EndsIn`, `F_Clima_Next`, `F_Clima_NextIn`, `F_Clima_Chance`,
`F_Clima_Name` y `F_Clima_Gear`, al final de `npc/clima.txt`; la tabla está
en [`CONVENTIONS.md`](../CONVENTIONS.md#eventos-públicos). Leen las
variables de `Clima#clima` con `getvariableofnpc`, así que el orden de los
mapas y los índices de combinación siguen siendo internos de este mod.

## Equipo de protección por combinación

Cada objeto protege una combinación por su ID estable, no por mapa ni solo
por el estado alterado. Funciona en cualquier mapa que use esa combinación,
incluidos los que se asignen más adelante. Los diez objetos nuevos usan IDs
custom del rango 50000–99999; todos permiten cualquier trabajo y clase, no
tienen nivel mínimo ni requisitos de atributos.

| ID custom | Combinación protegida | Objeto | Basado en ID | Ranura equipada | `View` |
|---:|---|---|---:|---|---:|
| 50824 | `lluvia_toxica` | Manto de Lluvia | 2524 | Garment | — |
| 50825 | `ventisca` | Armadura Horno | 2344 | Garment | — |
| 50826 | `neblina_densa` | Gafas de Claridad | 2276 | Middle Head | 63 |
| 50827 | `vapores_asfixiantes` | Máscara de Gas Etéreo | 5005 | Middle o Lower Head | 91 |
| 50828 | `terreno_fangoso` | Botas de Estabilidad | 2447 | Footgear | — |
| 50829 | `tierra_maldita` | Manto Bendecido | 2356 | Garment | — |
| 50830 | `polen_somnifero` | Máscara de Hierba Neutralizante | 5004 | Lower Head | 90 |
| 50831 | `hojas_petrificantes` | Scriptum Petreum | 2656 | Cualquiera de los dos Accessory | — |
| 50832 | `calor_intenso` | Sombrero del Desierto | 5591 | Upper Head | 567 |
| 50833 | `frio_extremo` | Abrigo Polar | 2309 | Garment | — |

Las propiedades base del objeto de referencia en Renewal se conservan cuando
aplican; las restricciones de clase y nivel se eliminan. Esas bonificaciones
propias permanecen independientes de la protección climática y pueden seguir
afectando estados de cualquier fuente (por ejemplo, la resistencia a Poison de
las máscaras). Los objetos están en `renewal/db/item_db.yml`: el mod es solo
Renewal (`"era": "renewal"`, D1) desde la 0.2.1, que quitó la carpeta
`pre-renewal/`. Los nombres y descripciones están en `System/itemInfo.lua`; se
reutilizan recursos visuales del cliente, sin añadir arte. Los cuatro objetos
de cabeza también declaran el `View` de su referencia, necesario para que su
aspecto aparezca al equiparlos.

En la tabla, `View` es la apariencia que el servidor comunica al cliente al
equipar el objeto; para los cuatro objetos de cabeza coincide con `ClassNum` y
con el aspecto stock del objeto de referencia. Tener el recurso correcto en
`itemInfo.lua` permite mostrar su icono e imagen, pero no sustituye ese `View`.
En este mod, los únicos objetos custom cuyo aspecto equipado debe aparecer en
el personaje son los cuatro objetos de cabeza de la tabla. Los demás usan
ranuras de manto, calzado o accesorio.

En rAthena los objetos equipables usan `Type: Armor`; la ranura real se
configura con `Locations` (`Garment`, `Head_Mid`, `Shoes`, etc.). Por eso los
objetos cuyo destino difiere del objeto de referencia mantienen el tipo de
servidor Armor y cambian su ubicación equipable.

La protección del controlador omite solo las aplicaciones y penalizaciones de
esa combinación. No elimina estados ya activos ni bloquea por sí misma el mismo
estado de otras fuentes o combinaciones. Para probarlos, entrega cada objeto
con `@item <ID custom>` y equípalo en la ranura indicada. En calor y frío, el
objeto bloquea la pérdida extra de Survival, pero no la pérdida normal.
Reinicia el servidor tras cambios en `db/` o `npc/`; reinicia la aplicación
tras cambios en `System/`.

## Guía: añadir un objeto de protección

Usa estos pasos al sumar otro objeto para una combinación existente. La
protección se vincula a la combinación y al objeto equipado, no a un mapa
concreto ni únicamente al estado alterado.

1. **Elige la combinación y el espacio de equipo.** Reutiliza la combinación
   existente si el objeto debe bloquear ese mismo evento en todos sus mapas.
   Anota el slot real de rAthena (`Head_Top`, `Head_Mid`, `Head_Low`,
   `Garment`, `Shoes` o `Both_Accessory`). Si puede equiparse en más de un
   slot, decide cuál será el principal y cuál el alternativo que comprobará el
   controlador.
2. **Reserva un ID custom libre.** Los objetos de este mod están en el rango
   `50000–99999`; confirma que el ID no esté usado por otro objeto del mod o
   por otro mod que se instale junto a él (rangos en
   [`CONVENTIONS.md`](../CONVENTIONS.md#rangos-de-ids-de-objetos)).
3. **Crea la entrada de servidor.** Añade el objeto a
   `renewal/db/item_db.yml` (el mod es solo Renewal, D1). Los equipables
   usan `Type: Armor`; el slot efectivo se define en `Locations`. Conserva
   únicamente las estadísticas y efectos Renewal del objeto base que
   correspondan, y define expresamente `Jobs: All: true` y
   `Classes: All: true`. No añadas requisitos de nivel o atributos.
4. **Copia los recursos de cliente del objeto fuente.** En
   `System/itemInfo.lua`, añade el nuevo ID con el nombre y la descripción
   propios. Copia literalmente del objeto original los campos
   `unidentifiedResourceName` e `identifiedResourceName`, y conserva su
   `ClassNum` cuando se reutilice ese aspecto. Los nombres de recursos deben
   corresponder a la traducción fijada del cliente; no los deduzcas del nombre
   mostrado ni los traduzcas. Conserva `slotCount` según las ranuras para
   cartas del objeto fuente y haz que la descripción indique la combinación
   protegida, el slot de equipo y las estadísticas relevantes.
5. **Configura la apariencia equipada cuando corresponda.** Que el icono y la
   imagen de descripción se vean no garantiza que el objeto se dibuje sobre el
   personaje. Para un headgear que reutiliza una apariencia stock, añade
   `View:` a la entrada de servidor con el `View` del headgear
   fuente y usa el mismo número como `ClassNum` en `itemInfo.lua`. Este mod
   confirmó ese requisito con los cuatro objetos de cabeza existentes:
   `50826` → `63`, `50827` → `91`, `50830` → `90` y `50832` → `567`.
   Verifica que el `View` pertenezca al headgear deseado; no uses el ID custom
   como `View`. Los iconos, `View` y apariencia del personaje son datos
   distintos. No asumas que un objeto de manto, calzado o accesorio tendrá un
   sprite visible en el personaje por copiar recursos de otro tipo de equipo.
6. **Vincula el objeto al controlador.** En `npc/clima.txt`, asigna su ID a
   `.combo_protection_item[<combinación>]` y su slot a
   `.combo_protection_slot[<combinación>]`. Para aceptar otro slot, asigna
   también `.combo_protection_slot_alt[<combinación>]`; inicialízalo como
   `-1` si no se usa. La comprobación busca el ID exacto en esos slots. Si se
   quiere que dos objetos distintos protejan la misma combinación, el
   controlador actual no tiene una lista de IDs: extiende esa comprobación de
   forma explícita en vez de sustituir silenciosamente el objeto existente.
7. **Mantén la descripción y el alcance correctos.** El equipo evita nuevas
   aplicaciones del estado o la penalización del controlador para esa
   combinación. No quita un estado que ya estaba activo, no protege contra
   otras combinaciones y no debe purgar estados procedentes de otras fuentes.
   Bonificaciones propias del objeto, como resistencia genérica a Poison,
   siguen funcionando por separado y pueden afectar a estados de cualquier
   fuente.
8. **Prueba las capas por separado.** Entrega el objeto con
   `@item <ID custom>`. Comprueba que el nombre, icono e imagen sean correctos;
   equípalo en el slot documentado y confirma su apariencia en el personaje
   cuando sea headgear. Durante el evento, prueba sin el objeto y luego con
   él, y verifica además que no borre estados activos ni altere otros climas.
   Reinicia el servidor después de cambios en `db/` o `npc/`; reinicia la
   aplicación después de cambios en `System/`.

Antes de declarar el trabajo terminado, compara la entrada de servidor,
el ID/slot que consulta el NPC y los datos visuales del objeto fuente. Un
`View` debe verificarse en la base del servidor fijada y los recursos y
`ClassNum` en la tabla del cliente fijada que usa la aplicación.

## Catálogo de combinaciones climáticas

Cada combinación tiene un ID compartido por los mapas y las protecciones. La
tabla es la fuente de configuración del prototipo en `npc/clima.txt`; cuando
una combinación tiene efecto visual, este también se asigna al mapa en
`mod.json`.

| ID estable | Combinación | Componentes | Protección o ajuste |
|---|---|---|---|
| `lluvia_toxica` | Lluvia tóxica | Lluvia (`rain`) + Poison | Manto de Lluvia; bloquea Poison climático. |
| `ventisca` | Ventisca | Nieve (`snow`) + Freeze | Armadura Horno; bloquea Freeze climático, que dura 4 segundos por aplicación. |
| `neblina_densa` | Neblina densa | Nubes (`cloud`) + Blind | Gafas de Claridad; bloquean Blind climático. |
| `vapores_asfixiantes` | Vapores asfixiantes | Nubes (`cloud6`) + Stun | Máscara de Gas Etéreo; bloquea Stun climático, que dura 4 segundos por aplicación. |
| `terreno_fangoso` | Terreno fangoso | Lluvia (`rain`) + Decrease Agi | Botas de Estabilidad; duración efectiva de 12 segundos para jugadores. |
| `tierra_maldita` | Tierra maldita | Nubes (`cloud8`) + Curse | Manto Bendecido; bloquea Curse climático. |
| `polen_somnifero` | Polen somnífero | Sakura (`sakura`) + Sleep | Máscara de Hierba Neutralizante; bloquea Sleep climático. |
| `hojas_petrificantes` | Hojas Petrificantes | Hojas (`leaves`) + Stone Curse | Scriptum Petreum; bloquea Stone Curse (4 segundos por aplicación). |
| `calor_intenso` | Calor intenso | Sin efecto visual + aumento del consumo de sed | Sombrero del Desierto bloquea la pérdida extra. Sin protección, `survival` consume 2 puntos de sed por tick de 15 segundos durante el evento. |
| `frio_extremo` | Frío extremo | Sin efecto visual + aumento del consumo de hambre | Abrigo Polar bloquea la pérdida extra. Sin protección, `survival` consume 2 puntos de hambre por tick de 15 segundos durante el evento. |

Un mapa referencia la combinación completa, no una pareja independiente de
clima y estado. Por eso el Manto de Lluvia protege en los dos mapas asignados
a `lluvia_toxica`, pero no bloquea `terreno_fangoso`, aunque también tenga
lluvia visual. Freeze y Stun son efectos cortos de prueba, de 4 segundos por
aplicación. Calor intenso y Frío extremo no tienen estado alterado ni efecto
visual propio; aumentan el consumo de una necesidad si ambos mods están activos.

`hojas_petrificantes` y `terreno_fangoso` ya se activan: la primera en los
mapas de bioma `bosque`, la segunda como una de las dos combinaciones de
`pradera`.

## Combinaciones por bioma

El bioma de cada mapa sale de `F_Atlas_Biome` (ver
[`world-atlas`](../world-atlas/README.md)). La tabla vive en `OnInit` de
`npc/clima.txt` (`.biome$[]` y `.biome_combos$[]`). **Regla:** todas las
combinaciones de un bioma comparten el efecto visual que `mod.json` fija a sus
mapas, porque ese visual es estático (ver «Limitación conocida»). Por eso el
sorteo solo existe donde dos combinaciones comparten visual.

| Bioma | Visual del mapa | Combinaciones posibles |
|---|---|---|
| `ciudad` | — | ninguna: las ciudades no tienen eventos y no están en la lista de mapas |
| `pradera` | Lluvia (`rain`) | `lluvia_toxica` o `terreno_fangoso` (al azar) |
| `bosque` | Hojas (`leaves`) | `hojas_petrificantes` |
| `selva` | Nubes (`cloud6`) | `vapores_asfixiantes` |
| `desierto` | ninguno | `calor_intenso` |
| `nieve` | Nieve (`snow`) | `ventisca` |
| `pantano` | Nubes (`cloud8`) | `tierra_maldita` |
| `costa` | Nubes (`cloud`) | `neblina_densa` |
| `montana` | ninguno | `frio_extremo` |
| `volcan` | Nubes (`cloud6`) | `vapores_asfixiantes` |
| `cueva` | Nubes (`cloud6`) | `vapores_asfixiantes` |
| `ruinas` | Nubes (`cloud8`) | `tierra_maldita` |

Es una primera asignación de diseño, no un balance: cámbiala en el NPC y en
`mod.json` a la vez. `volcan`, `cueva` y `ruinas` no tienen mapas de clima
todavía (el atlas no tiene campos de esos biomas).

## Mapas de prueba

Son 20 campos. Los 11 campos de Prontera son `pradera`, así que todos usan lluvia
y sortean `lluvia_toxica` o `terreno_fangoso`. Las ciudades (`prontera`,
`izlude`, `geffen`) se quitaron: no tienen eventos ni efecto visual de clima.

| Mapa | Bioma | Visual |
|---|---|---|
| `prt_fild01`–`prt_fild11` (11 mapas) | `pradera` | `rain` |
| `gef_fild07`, `pay_fild08`, `pay_fild03` | `bosque` | `leaves` |
| `moc_fild11` | `desierto` | ninguno |
| `mjolnir_12` | `montana` | ninguno |
| `xmas_fild01` | `nieve` | `snow` |
| `cmd_fild01` | `costa` | `cloud` |
| `um_fild01` | `selva` | `cloud6` |
| `mosk_fild02` | `pantano` | `cloud8` |

Con esto cada combinación, salvo `polen_somnifero` (que solo tenían las
ciudades), tiene al menos un mapa de prueba.
Para probar Calor intenso con `survival` ve a `moc_fild11`; Frío extremo, a
`mjolnir_12`. (Antes eran `prt_fild09` y `prt_fild10`.)

## Limitación conocida: el visual no sigue al evento

El efecto visual de cada mapa (lluvia, nieve, nubes…) lo fija `mod.json` y el
cliente lo mantiene siempre que se esté en el mapa; el servidor no puede
cambiarlo por evento ni apagarlo al terminar. Por eso hoy un bioma solo sortea
combinaciones con **su mismo visual**: así lo que se ve coincide con lo que
ocurre. La consecuencia es poca variedad por bioma.

**Investigado el 2026-10-17** (código fijado, sin probar en el juego; detalle en
[`ARCHITECTURE.md`](../ARCHITECTURE.md#clima-eventual)):

- En roBrowser la lluvia, la nieve, las hojas y la niebla son **efectos**
  (`EF_RAIN`, `EF_SNOW`, `EF_MAPLE`, `EF_CLOUD*`). El servidor puede
  **encenderlos** en cualquier momento con `specialeffect2`.
- **Apagarlos** desde el servidor no funciona todavía: rAthena envía
  `ZC_REMOVE_EFFECT` con `removespecialeffect2`, pero roBrowser no procesa ese
  paquete. Hace falta un arreglo pequeño en el fork de roBrowser (vía A), o que
  el plugin dibuje el clima él mismo (vía B). La recomendada es combinar las
  dos (vía C): partículas nativas y un pase del plugin para la atmósfera.
- Con el clima eventual, el `"weather"` fijo de `mod.json` se quita de esos
  mapas, y cada bioma puede sortear combinaciones con visuales distintos.

Sin decisión ni código todavía.

## Guía: añadir una combinación climática

Una combinación es la unidad reusable del sistema: reúne un nombre/ID estable,
una visual opcional, un estado de servidor opcional, protección opcional,
mensajes y uno o más mapas. No copies la lógica de aplicación por mapa. Añade
la combinación una vez y haz que los mapas apunten a su índice.

1. **Elige un ID estable y un índice nuevo.** Los IDs legibles como
   `tormenta_electrica` se usan en documentación y objetos; el NPC identifica
   internamente las combinaciones con índices numéricos. Añádela al final de
   `OnInit` y aumenta `.combo_count`. No renumeres ni reutilices índices
   existentes: las referencias de mapas y la integración con Survival usan
   esos índices.
2. **Completa todos los datos de la combinación** en `npc/clima.txt`:

   ```text
   .combo_name$[N] = "Nombre visible";
   .combo_weather$[N] = "rain";
   .combo_status[N] = SC_POISON;
   .combo_status_name$[N] = "Poison";
   .combo_status_duration[N] = .effect_lease;
   .combo_protection_item[N] = ID_OBJETO;
   .combo_protection_slot[N] = EQI_GARMENT;
   .combo_protection_slot_alt[N] = -1;
   .combo_start_message$[N] = "Texto narrativo al comenzar.";
   .combo_end_message$[N] = "Texto narrativo al terminar.";
   ```

   Sustituye los valores de ejemplo. Si no lleva estado, asigna
   `.combo_status[N] = 0`, un nombre como `"ninguno"` y duración `0`; el
   controlador solo llama `sc_start` si hay estado. Si todavía no tiene objeto,
   deja `.combo_protection_item[N] = 0`, slot principal `-1` y alternativo
   `-1`. Para una protección en dos ranuras, configura el slot alternativo.
   El NPC compara el ID exacto del objeto en esos slots. La guía anterior
   explica cómo crear el objeto y enlazarlo.
3. **Decide la duración con cuidado.** Los estados se revisan cada 10 segundos
   y suelen tener una duración de 12 segundos, que deja una pausa antes de la
   siguiente aplicación. Freeze, Stun y Stone Curse están limitados a 4
   segundos por aplicación. rAthena reduce a la mitad la duración de
   `SC_DECREASEAGI` en jugadores; para obtener 12 segundos, el script solicita
   24. Comprueba la semántica del estado en la versión fijada de rAthena y
   evita duraciones que bloqueen el control del personaje durante mucho tiempo.
4. **Asigna la combinación a un bioma**, no a un mapa: añade su índice a la
   lista `.biome_combos$[i]` de los biomas donde pueda ocurrir (separados por
   comas). Debe compartir el visual de ese bioma (ver «Limitación conocida»).
   Si el bioma es nuevo, añade `.biome$[i]`, `.biome_combos$[i]` e incrementa
   `.biome_count`. Actualiza la tabla «Combinaciones por bioma».
   Para ofrecer la combinación en un mapa nuevo, añádelo al atlas, a la lista de
   `mapflag loadevent` al inicio del archivo, incrementa `.map_count` y agrega
   `.map$[i]` y `.map_name$[i]` con índices de mapa nuevos y consecutivos
   (`.combination[i]` ya no se asigna a mano: se sortea al empezar el evento).
   El índice del mapa no es el ID de combinación. Añade también el mapa a
   `mod.json` con el visual de su bioma, y a la tabla «Mapas de prueba».
5. **Configura la visual de cliente, si aplica.** Para las combinaciones con
   un efecto visual soportado, asigna ese nombre a `.combo_weather$[N]` y
   agrega `"<mapa>": { "weather": "<visual>" }` por cada mapa asignado en
   `mod.json`. Usa únicamente valores admitidos por
   [`CUSTOM_MAPS.md`](../../docs/mods/CUSTOM_MAPS.md). Los efectos de `mod.json`
   son estáticos: permanecen visibles mientras se está en el mapa, aunque el
   evento de servidor haya terminado. Si la combinación no tiene visual, no
   agregues `weather` para esos mapas. No declares la misma combinación con
   visuales distintos según el mapa.
6. **Si cambia hambre o sed**, no añadas otro temporizador. Survival es dueño
   de los ticks; amplía la integración explícita entre `clima/npc/clima.txt` y
   `survival/npc/survival.txt` para activar el modificador solo durante el
   evento, limpiarlo al finalizar/salir/desconectarse y comprobar el mapa de
   exposición. Actualmente esa lógica identifica Calor intenso y Frío extremo
   por sus índices 9 y 10 en `S_ApplyWeatherStatus` y
   `OnPCLoadMapEvent`; si sus índices o los de otras combinaciones cambian,
   actualiza conjuntamente ambos sitios y conserva los IDs de objetos
   configurados. El objeto protector debe bloquear solo la pérdida extra de
   esa combinación, no la pérdida normal de Survival.
7. **Escribe y documenta los mensajes.** Define un texto de inicio y otro de
   término en primera persona o enfocado en lo que percibe el personaje.
   Actualiza la tabla «Los mensajes actuales» y la fila del catálogo con el
   ID, visual, estado, duración y objeto protector. Si aún no se asigna a un
   mapa, deja claro que los textos y la visual no se mostrarán en juego. Si se
   agrega un objeto protector, actualiza también la tabla de equipo y sigue la
   guía «añadir un objeto de protección».
8. **Prueba todas las rutas afectadas.** Comprueba con y sin protección: que el
   anuncio corresponda a la combinación, que el estado o modificador se
   aplique durante el evento, que no se renueve un estado todavía activo, que
   la protección no borre estados de otras fuentes y que al terminar o cambiar
   de mapa no quede una exposición de Survival activa. Verifica también la
   entrada a un mapa con un evento ya activo. Si cambia una visual, recarga la
   configuración del cliente; cambios de NPC requieren reiniciar el servidor.

El scheduler actual tiene una probabilidad de inicio de 100%, espera 30
segundos antes del primer chequeo, ejecuta chequeos cada 60 segundos y deja
cada evento activo durante 5 minutos. Se inicializan por mapa en el bucle
posterior a las asignaciones; evita modificar esos valores globales al añadir
una combinación salvo que quieras cambiar el comportamiento de todos los
mapas.

## Criterios para los estados

La selección de estos estados prioriza presionar al jugador sin impedirle
continuamente jugar. Poison, Blind y Decrease Agi son candidatos adecuados para
un uso frecuente y moderado. Curse es muy molesto por la reducción de
movimiento y conviene reservarlo para situaciones específicas. Freeze y Stun
deben durar poco por aplicación (3–5 segundos como máximo); Sleep también es
molesto y debería usarse de forma situacional. Stone Curse tiene un impacto
alto y se recomienda mantenerlo fuera de la asignación habitual; la nueva
combinación `hojas_petrificantes` queda definida para una posible prueba futura
y limita cada aplicación a 4 segundos. Bleeding y Burning causan mucha presión
y se reservarían para contenido de nivel alto.

## Comportamiento del scheduler

- El primer chequeo de cada mapa ocurre 30 segundos después de iniciar el
  servidor. La probabilidad está al 100% para esta prueba.
- Cada evento dura 5 minutos para dar tiempo de visitar los 20 mapas en una
  sesión. Los eventos de todos los mapas empiezan en el mismo primer chequeo;
  al terminar, esperan un minuto antes del siguiente chequeo.
- Durante un evento, el NPC revisa cada 10 segundos a los personajes del mapa y
  aplica el estado de la combinación solo si no está activo. No reinicia
  estados activos. Freeze, Stun y Stone Curse duran 4 segundos por aplicación;
  Poison, Blind, Curse y Sleep duran 12 segundos. Decrease Agi también dura
  12 segundos para jugadores: rAthena reduce a la mitad su duración, así que el
  script solicita 24 segundos. Calor intenso y Frío extremo no aplican estados:
  con `survival` activo, aumentan a 2 puntos la pérdida de sed o hambre en cada
  tick de 15 segundos mientras dure el evento.
- Al expirar un estado, puede haber unos segundos de respiro antes de la
  siguiente aplicación. Esa pausa es intencional y reduce la frecuencia del
  sonido de Poison.
- Llevar equipado el objeto de protección correspondiente impide las
  aplicaciones nuevas y la penalización de su combinación. La protección no
  elimina estados activos ni afecta a estados de otras fuentes o combinaciones.
- Si se sale del mapa, el estado aplicado por el clima puede tardar hasta 12
  segundos en expirar (4 segundos para Freeze, Stun y Stone Curse) y ya no se
  vuelve a aplicar fuera de ese mapa.
- Freeze, Stun, Sleep y Stone Curse pueden impedir temporalmente actuar o
  moverse. Usa una cuenta de prueba y el warp de GM para continuar el recorrido.
- Al iniciar o terminar cada evento, el mapa recibe un mensaje narrativo
  dirigido al jugador y adecuado al clima y su efecto. Terreno fangoso y Hojas
  Petrificantes se muestran en los mapas de bioma `pradera` y `bosque`.
- El modificador de hambre o sed se activa al iniciar el evento, se limpia al
  terminarlo o al cambiar de mapa, y no queda guardado entre sesiones.

Los mensajes actuales son:

| Combinación | Inicio | Fin |
|---|---|---|
| Lluvia tóxica | Sientes como la lluvia comienza a irritarte la piel; hasta los animales parecen evitarla. | La lluvia parece amainar y ya no sientes que te afecte. |
| Ventisca | Una ventisca helada te golpea; el frío entumece tus miembros y apenas puedes moverte. | La ventisca pierde fuerza y recuperas poco a poco la movilidad. |
| Neblina densa | Una neblina espesa te envuelve; distingues cada vez menos lo que tienes delante. | La neblina se disipa y vuelves a ver con claridad. |
| Vapores asfixiantes | Una nube de vapores asfixiantes te cubre; te falta el aire y pierdes el equilibrio. | Los vapores se dispersan y consigues respirar con más facilidad. |
| Terreno fangoso | La lluvia empapa el terreno y el barro vuelve cada paso más pesado. | El terreno comienza a secarse y vuelves a moverte con más soltura. |
| Tierra maldita | Un gas extraño se eleva del suelo; una sensación sombría debilita tu cuerpo. | El gas se disipa y la opresión que sentías comienza a desaparecer. |
| Polen somnífero | El polen flota en el aire; tus párpados pesan y el sueño empieza a vencerte. | El polen se aleja y consigues despejarte del sopor. |
| Hojas Petrificantes | Hojas extrañas giran a tu alrededor; sientes cómo tu cuerpo empieza a endurecerse. | Las hojas se dispersan y la rigidez abandona poco a poco tu cuerpo. |
| Calor intenso | El calor se vuelve sofocante; sientes la garganta seca y la sed aumenta con rapidez. | El calor cede y la sed deja de apremiarte con tanta fuerza. |
| Frío extremo | Un frío intenso cala hasta los huesos; tu cuerpo consume sus reservas para mantenerse caliente. | El frío extremo se retira y tu cuerpo deja de gastar sus reservas tan deprisa. |

La configuración del cliente está en `mod.json`; la del scheduler y los
estados está en `npc/clima.txt`.

## Instalación y pruebas

Activa `clima` en **Settings → Mods**. Los cambios de `mod.json` requieren
recargar la configuración del cliente (reinicia la app si Settings lo solicita);
los cambios de `db/` o `npc/` requieren reiniciar el servidor, y los de
`System/` requieren reiniciar la aplicación.

Después de iniciar el servidor, espera los anuncios y visita los mapas en el
orden de la tabla. En cada clima asignado prueba primero sin protección y luego
con el objeto indicado en la tabla de equipo: debe bloquear solo la aplicación
del controlador para esa combinación. En `pradera` el evento puede ser
`lluvia_toxica` o `terreno_fangoso`; el anuncio dice cuál salió. Activa
también `survival` para probar Calor intenso y Frío
extremo. Sin protección, en `moc_fild11` la sed baja 2 puntos cada 15 segundos
y en `mjolnir_12` ocurre lo mismo con el hambre; con el sombrero o el abrigo,
respectivamente, ambos medidores deben bajar a su ritmo normal de 1 punto cada
15 segundos. Al acabar el evento o salir del mapa, el consumo también vuelve
al ritmo normal.
El efecto visual se configura estáticamente por mapa en `mod.json` y
permanece visible mientras estés allí; no comienza ni termina junto con el
evento climático. Por eso puede seguir viéndose después de que termina dicho
evento. `moc_fild11` y `mjolnir_12` (desierto y montaña) no tienen un efecto
visual de clima asignado por este mod. Esa limitación del cliente sigue pendiente de una mejora futura.

## Observaciones visuales

En las pruebas anteriores, `cloud` se percibió como niebla y `cloud6` como
vapor. `cloud8` se observó como un gas naranja, visible solo sobre el agua,
durante una prueba anterior en Izlude. Esa ya no es su asignación actual:
Izlude usa `sakura` y `cloud8` está asignado a `mosk_fild02` (pantano). La
apariencia puede variar según el mapa y la superficie. Las combinaciones de
calor y frío no tienen efecto visual asignado. Estas observaciones son de
pruebas anteriores a la asignación por bioma.

Para confirmar la carga del NPC, revisa el log del map-server: debe mostrar
`[clima] <mapa> registrado; el evento se sortea por su bioma...` y luego
`[clima] Evento <combinación> iniciado en <mapa>`. Al entrar a un mapa durante
el evento, el log registra el estado (si esa combinación aplica uno) y si el
equipo protege al personaje.

Los efectos visuales admitidos se documentan en
[`CUSTOM_MAPS.md`](../../docs/mods/CUSTOM_MAPS.md).

## Integración con Survival

Con ambos mods activos, el evento de **Calor intenso** en `moc_fild11` añade
una pérdida de sed por tick de Survival; **Frío extremo** en `mjolnir_12` hace
lo mismo con el hambre. El resultado de prueba es 2 puntos cada 15 segundos
(el punto normal más uno adicional). Survival conserva el control de sus
medidores y temporizadores; clima solo comunica la exposición mediante las
variables de jugador `@clima_thirst_extra_loss`,
`@clima_hunger_extra_loss` y `@clima_exposure_map$`, que limita el efecto al
mapa de exposición.

La exposición comienza con el evento y se limpia al terminar, al cambiar de
mapa y al desconectarse. Survival también comprueba que el personaje siga en el
mapa asociado antes de sumar la pérdida extra, para no aplicar exposición
residual después de salir. Si Survival está desactivado, los eventos siguen
mostrando sus mensajes, pero no alteran hambre ni sed. Por ahora estas dos
combinaciones no tienen efecto visual propio.

Los efectos visuales asignados siguen declarándose estáticamente por mapa en
`mod.json`. Conectar su ciclo de vida al inicio y fin del evento sigue
pendiente; ver la propuesta técnica más abajo.

Cada objeto protege solo contra su combinación, no contra otros climas. Para
Calor intenso y Frío extremo, clima deja en cero la pérdida extra al detectar
el sombrero o el abrigo; Survival sigue a cargo de los ticks normales de hambre
y sed, sin crear temporizadores paralelos.

Los mapas y multiplicadores actuales son de prueba. Aún queda decidir la
distribución definitiva y cómo acumular varias fuentes simultáneas de
modificadores.

## Efecto visual durante el evento: posible trabajo futuro

Es también la vía para superar la limitación de biomas descrita arriba («Limitación
conocida»): con un visual dinámico, un bioma podría sortear combinaciones de
visuales distintos.

Hoy los efectos visuales asignados están declarados por mapa en `mod.json`. El
cliente los activa al cargar el mapa y los mantiene mientras el personaje
permanece allí; el scheduler de `npc/clima.txt` no puede detenerlos al acabar
el evento. La duración visual sigue siendo independiente del evento de estado.

Si en el futuro se decide que el efecto visual dure únicamente durante el
evento, hará falta conectar el servidor y el cliente sin hacer que el mod
dependa de detalles internos de roBrowser:

1. Añadir al API de plugins del cliente una operación **general y documentada**
   para iniciar y detener, por nombre, los efectos de pantalla ya admitidos
   (`rain`, `snow`, `cloud`, etc.). El API debe encargarse de su ciclo de vida;
   el plugin del mod no debería llamar directamente a internals de
   `ScreenEffectManager`.
2. Hacer que el NPC del clima envíe eventos privados del mod al cliente cuando
   el clima empieza y termina. El API existente `server:event` ya transporta
   mensajes `@@event`; por ejemplo, el protocolo del mod podría comunicar
   `start prt_fild01 rain` y `stop prt_fild01`. Al entrar a un mapa durante un
   evento activo, el servidor también tendría que enviar el evento de inicio a
   ese personaje.
3. Añadir `client/index.js` al mod `clima`: escuchar `server:event`, validar
   mapa, nombre de efecto y transición, e invocar la operación general del
   cliente. También debe limpiar el efecto al salir del mapa, perder conexión
   o descargar el plugin, para que no quede un clima visual obsoleto.
4. Para los mapas que pasen a clima dinámico, retirar su `weather` estático de
   `mod.json`; de otro modo, el cliente lo iniciaría por su cuenta al cargar el
   mapa, aunque el evento aún no haya comenzado.

El control actual es por mapa, así que el inicio y fin del efecto deben
notificarse a los personajes que estén en ese mapa. La solución futura debe
probar también entradas durante un evento, salidas antes de que termine,
reconexiones, cambios rápidos de mapa y fin del evento con el efecto activo.

Para cuidar las actualizaciones del cliente, primero conviene proponer la
pequeña operación general del API y su lugar en el fork. Si el cambio pertenece
a roBrowserLegacy y puede mantenerse genérico, debe ir como un commit pequeño
en la rama `ragnarokoffline` del fork y, si es viable, proponerse también a
upstream. El código específico de clima y su protocolo deben quedarse en este
mod; evitar parches al motor interno de efectos solo para `clima`. Consultar
[`FORKS.md`](../../docs/FORKS.md) antes de realizar cambios al fork. Por ahora
no se añade plugin de cliente ni se modifica el fork.

## Próximos cambios propuestos (revisión 2026-10-17)

Sin implementar. El porqué está en [`BALANCE.md`](../BALANCE.md).

- **Pronóstico en cada ciudad** o en la taberna (`tavern-rumors`), con las
  funciones `F_Clima_*`; hoy solo hay un Pronosticador, en Prontera.
- **Niebla con monstruos** como evento raro que dé **más** recompensa (un
  monstruo especial con botín o experiencia), no solo más riesgo.
- **Visual por evento:** un plugin de cliente que reciba el visual por
  `server:event` (ver «Limitación conocida»).
- **Experiencias:** la primera vez que el equipo bloquea un clima,
  `weather:<combo>` (Media); la primera vez que se aguanta sin protección hasta
  que termina, `weatherlived:<combo>` (Menor). Ver
  [`ADVENTURE.md`](../ADVENTURE.md).
- **Los objetos de protección como botín** de `dungeon-chest`, por bioma.
