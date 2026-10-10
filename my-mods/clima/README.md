# Clima

Prototipo de combinaciones climáticas reutilizables en 14 mapas. Cada mapa usa
un ID que determina su efecto de servidor y, cuando corresponde, su efecto
visual y protección compatible. Las combinaciones con estados alterados se
repiten en dos mapas para probar que la protección dependa de la combinación,
no del mapa; Calor intenso y Frío extremo se asignan a un mapa cada una para
probar su integración opcional con Survival.

## Equipo de protección por combinación

Cada objeto protege una combinación por su ID estable, no por mapa ni solo
por el estado alterado. Funciona en cualquier mapa que use esa combinación,
incluidos los que se asignen más adelante. Los nueve objetos nuevos usan IDs
custom del rango 50000–99999; todos permiten cualquier trabajo y clase, no
tienen nivel mínimo ni requisitos de atributos.

| ID custom | Combinación protegida | Objeto | Basado en ID | Ranura equipada |
|---:|---|---|---:|---|
| 50824 | `lluvia_toxica` | Manto de Lluvia | 2524 | Garment |
| 50825 | `ventisca` | Armadura Horno | 2344 | Garment |
| 50826 | `neblina_densa` | Gafas de Claridad | 2276 | Middle Head |
| 50827 | `vapores_asfixiantes` | Máscara de Gas Etéreo | 5005 | Middle o Lower Head |
| 50828 | `terreno_fangoso` | Botas de Estabilidad | 2447 | Footgear |
| 50829 | `tierra_maldita` | Manto Bendecido | 2356 | Garment |
| 50830 | `polen_somnifero` | Máscara de Hierba Neutralizante | 5004 | Lower Head |
| 50831 | `hojas_petrificantes` | Scriptum Petreum | 2656 | Cualquiera de los dos Accessory |
| 50832 | `calor_intenso` | Sombrero del Desierto | 5591 | Upper Head |
| 50833 | `frio_extremo` | Abrigo Polar | 2309 | Garment |

Las propiedades base del objeto de referencia se conservan cuando aplican,
incluidas sus diferencias de defensa y bonificaciones por era; las
restricciones de clase y nivel se eliminan. Esas bonificaciones propias
permanecen independientes de la protección climática y pueden seguir afectando
estados de cualquier fuente (por ejemplo, la resistencia a Poison de las
máscaras). El ID 5591 no existe en la base Pre-Renewal fijada, así que el
Sombrero del Desierto usa allí sus datos base de Renewal. Los nombres y
descripciones están en `System/itemInfo.lua`; se reutilizan recursos visuales
del cliente, sin añadir arte. Los cuatro objetos de cabeza también declaran en
ambas eras el `View` de su referencia, necesario para que su aspecto aparezca
al equiparlos.

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
| `terreno_fangoso` | Terreno fangoso | Lluvia (`rain`) + Decrease Agi | Botas de Estabilidad; duración efectiva de 12 segundos para jugadores. Aún sin mapa asignado. |
| `tierra_maldita` | Tierra maldita | Nubes (`cloud8`) + Curse | Manto Bendecido; bloquea Curse climático. |
| `polen_somnifero` | Polen somnífero | Sakura (`sakura`) + Sleep | Máscara de Hierba Neutralizante; bloquea Sleep climático. |
| `hojas_petrificantes` | Hojas Petrificantes | Hojas (`leaves`) + Stone Curse | Scriptum Petreum; bloquea Stone Curse (4 segundos por aplicación). Aún sin mapa asignado. |
| `calor_intenso` | Calor intenso | Sin efecto visual + aumento del consumo de sed | Sombrero del Desierto bloquea la pérdida extra. Sin protección, `survival` consume 2 puntos de sed por tick de 15 segundos durante el evento. |
| `frio_extremo` | Frío extremo | Sin efecto visual + aumento del consumo de hambre | Abrigo Polar bloquea la pérdida extra. Sin protección, `survival` consume 2 puntos de hambre por tick de 15 segundos durante el evento. |

Un mapa referencia la combinación completa, no una pareja independiente de
clima y estado. Por eso el Manto de Lluvia protege en los dos mapas asignados
a `lluvia_toxica`, pero no bloquea `terreno_fangoso`, aunque también tenga
lluvia visual. Freeze y Stun son efectos cortos de prueba, de 4 segundos por
aplicación. Calor intenso y Frío extremo no tienen estado alterado ni efecto
visual propio; aumentan el consumo de una necesidad si ambos mods están activos.

`hojas_petrificantes` ya está definida en el NPC y tiene objeto de protección,
pero no se activa hasta asignarla a uno o más mapas; su visual tampoco se
declara en `mod.json` por ahora.

## Asignación de prueba por mapa

Las seis combinaciones con estados alterados actualmente asignadas se usan en
dos mapas cada una. Calor intenso y Frío extremo se asignan a un mapa cada una
para probar su integración opcional con `survival`. `terreno_fangoso` y
`hojas_petrificantes` están definidas, pero todavía no se asignan a mapas.

| # | Mapa | ID de combinación | Efecto visual | Estado |
|---:|---|---|---|---|
| 1 | `prt_fild01` | `lluvia_toxica` | Lluvia (`rain`) | Poison |
| 2 | `prt_fild02` | `lluvia_toxica` | Lluvia (`rain`) | Poison |
| 3 | `prt_fild03` | `ventisca` | Nieve (`snow`) | Freeze (4 s) |
| 4 | `prt_fild04` | `ventisca` | Nieve (`snow`) | Freeze (4 s) |
| 5 | `prt_fild05` | `neblina_densa` | Nubes (`cloud`) | Blind |
| 6 | `prt_fild06` | `neblina_densa` | Nubes (`cloud`) | Blind |
| 7 | `prt_fild07` | `vapores_asfixiantes` | Nubes (`cloud6`) | Stun (4 s) |
| 8 | `prt_fild08` | `vapores_asfixiantes` | Nubes (`cloud6`) | Stun (4 s) |
| 9 | `prt_fild09` | `calor_intenso` | Sin efecto visual | Sed: 2 puntos por tick (requiere `survival`) |
| 10 | `prt_fild10` | `frio_extremo` | Sin efecto visual | Hambre: 2 puntos por tick (requiere `survival`) |
| 11 | `prt_fild11` | `tierra_maldita` | Nubes (`cloud8`) | Curse |
| 12 | `prontera` | `tierra_maldita` | Nubes (`cloud8`) | Curse |
| 13 | `izlude` | `polen_somnifero` | Sakura (`sakura`) | Sleep |
| 14 | `geffen` | `polen_somnifero` | Sakura (`sakura`) | Sleep |

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
- Cada evento dura 5 minutos para dar tiempo de visitar los 14 mapas en una
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
  Petrificantes tienen textos definidos, pero no se mostrarán hasta asignar
  esas combinaciones a un mapa.
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
los cambios de `npc/` requieren reiniciar el servidor.

Después de iniciar el servidor, espera los anuncios y visita los mapas en el
orden de la tabla. En cada clima asignado prueba primero sin protección y luego
con el objeto indicado en la tabla de equipo: debe bloquear solo la aplicación
del controlador para esa combinación. `terreno_fangoso` y
`hojas_petrificantes` todavía no tienen mapas asignados. Activa también
`survival` para probar Calor intenso y Frío
extremo. Sin protección, en `prt_fild09` la sed baja 2 puntos cada 15 segundos
y en `prt_fild10` ocurre lo mismo con el hambre; con el sombrero o el abrigo,
respectivamente, ambos medidores deben bajar a su ritmo normal de 1 punto cada
15 segundos. Al acabar el evento o salir del mapa, el consumo también vuelve
al ritmo normal.
El efecto visual se configura estáticamente por mapa en `mod.json` y
permanece visible mientras estés allí; no comienza ni termina junto con el
evento climático. Por eso puede seguir viéndose después de que termina dicho
evento. `prt_fild09` y `prt_fild10` no tienen un efecto visual de clima asignado
por este mod. Esa limitación del cliente sigue pendiente de una mejora futura.

## Observaciones visuales

En las pruebas anteriores, `cloud` se percibió como niebla y `cloud6` como
vapor. `cloud8` produjo un gas naranja en Izlude, visible solo sobre el agua.
La apariencia puede variar según el mapa y la superficie. Las combinaciones de
calor y frío no tienen efecto visual asignado; `terreno_fangoso` y
`hojas_petrificantes` tampoco se asignan actualmente a mapas.

Para confirmar la carga del NPC, revisa el log del map-server: debe mostrar
`[clima] <mapa> asignado a <combinación>...` y luego
`[clima] Evento <combinación> iniciado en <mapa>`. Al entrar a un mapa durante
el evento, el log registra el estado (si esa combinación aplica uno) y si el
equipo protege al personaje.

Los efectos visuales admitidos se documentan en
[`CUSTOM_MAPS.md`](../../docs/mods/CUSTOM_MAPS.md).

## Integración con Survival

Con ambos mods activos, el evento de **Calor intenso** en `prt_fild09` añade
una pérdida de sed por tick de Survival; **Frío extremo** en `prt_fild10` hace
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
