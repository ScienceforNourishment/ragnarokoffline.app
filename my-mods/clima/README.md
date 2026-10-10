# Clima

Prueba de combinaciones climáticas reutilizables en 14 mapas. Cada mapa usa un
ID de combinación que determina su efecto visual, estado de servidor y
protección compatible. Las combinaciones se repiten en dos mapas para probar
que la protección dependa de la combinación, no del mapa.

## Objeto personalizado de prueba

El mod añade **Manto de Lluvia**, ID `50824`, basado en el objeto
original `2524` (Valkyrian Manteau). Es una prenda equipable en la ubicación
`Garment`, tiene una ranura y permite equiparla a todas las clases, sin
restricción de nivel ni requisitos de atributos. Conserva la defensa y los
efectos del original según la era. Mientras está equipado, evita que la
combinación `lluvia_toxica` aplique Poison en cualquiera de los mapas que
tengan esa combinación.

La protección solo afecta a ese Poison climático: no da inmunidad global,
no elimina un Poison que ya estuviera activo al equipar el manto y no afecta
Poison de otras fuentes ni una combinación distinta que comparta lluvia como
efecto visual.

Los datos Renewal y Pre-Renewal están separados para respetar las diferencias
del objeto original entre eras. El nombre y la descripción del cliente están en
`System/itemInfo.lua`; el icono reutiliza el recurso genérico de manto y no
incluye arte nuevo.

Para probarlo, entrega el objeto con una herramienta GM, por ejemplo
`@item 50824`, y equípalo en la ranura de prenda. En `prt_fild01` y
`prt_fild02`, ambos asignados a `lluvia_toxica`, no debe aplicarse el Poison
climático. En `prt_fild09` y `prt_fild10`, la combinación es `terreno_fangoso`:
el manto no debe bloquear Decrease Agi aunque ambos climas usen lluvia visual.
También comprueba que Poison obtenido de otra fuente no desaparece al llevar
el manto. Los cambios de `db/` y `npc/` requieren reiniciar el servidor; los
cambios de `System/` requieren reiniciar la aplicación para recargar los datos
del cliente.

## Catálogo de combinaciones climáticas

Cada combinación tiene un ID compartido por los mapas y las protecciones. La
tabla es la fuente de configuración del prototipo en `npc/clima.txt`; el clima
visual equivalente también está asignado a cada mapa en `mod.json`.

| ID estable | Combinación | Componentes | Protección o ajuste |
|---|---|---|---|
| `lluvia_toxica` | Lluvia tóxica | Lluvia (`rain`) + Poison | Manto de Lluvia; bloquea Poison climático. |
| `ventisca` | Ventisca | Nieve (`snow`) + Freeze | Freeze dura 4 segundos por aplicación en esta prueba. |
| `neblina_densa` | Neblina densa | Nubes (`cloud`) + Blind | Sin protección asignada todavía. |
| `vapores_asfixiantes` | Vapores asfixiantes | Nubes (`cloud6`) + Stun | Stun dura 4 segundos por aplicación en esta prueba. |
| `terreno_fangoso` | Terreno fangoso | Lluvia (`rain`) + Decrease Agi | Duración efectiva de 12 segundos para jugadores. |
| `tierra_maldita` | Tierra maldita | Nubes (`cloud8`) + Curse | Sin protección asignada todavía. |
| `polen_somnifero` | Polen somnífero | Sakura (`sakura`) + Sleep | Sin protección asignada todavía. |
| `hojas_petrificantes` | Hojas Petrificantes | Hojas (`leaves`) + Stone Curse | Sin protección asignada; Stone Curse dura 4 segundos por aplicación. Aún no está asignada a ningún mapa. |
| `calor_intenso` | Calor intenso | Sin efecto visual + aumento del consumo de sed | Pendiente; requiere integración con `survival`. |
| `frio_extremo` | Frío extremo | Sin efecto visual + aumento del consumo de hambre | Pendiente; requiere integración con `survival`. |

Un mapa referencia la combinación completa, no una pareja independiente de
clima y estado. Por eso el Manto de Lluvia protege en los dos mapas asignados
a `lluvia_toxica`, pero no bloquea `terreno_fangoso`, aunque también tenga
lluvia visual. Freeze y Stun son efectos cortos de prueba, de 4 segundos por
aplicación. Las combinaciones de calor y frío no están asignadas a mapas ni
activas hasta su integración con `survival`.

`hojas_petrificantes` ya está definida en el NPC, pero no se activa hasta
asignarla a uno o más mapas; su visual tampoco se declara en `mod.json` por
ahora.

## Asignación de prueba por mapa

Cada una de las siete combinaciones actualmente asignadas se usa en dos mapas.
Esta distribución facilita comprobar que un mismo ID produce los mismos
efectos en distintos mapas y que las protecciones funcionan allí sin
configuración adicional.

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
| 9 | `prt_fild09` | `terreno_fangoso` | Lluvia (`rain`) | Decrease Agi |
| 10 | `prt_fild10` | `terreno_fangoso` | Lluvia (`rain`) | Decrease Agi |
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
  sesión. Los eventos de todos los mapas empiezan en el mismo primer chequeo.
- Durante un evento, el NPC revisa cada 10 segundos a los personajes del mapa y
  aplica el estado de la combinación solo si no está activo. No reinicia
  estados activos. Freeze y Stun duran 4 segundos por aplicación; las otras
  combinaciones duran 12 segundos para el jugador. rAthena reduce a la mitad
  la duración de Decrease Agi para jugadores, así que el script solicita 24
  segundos para que dure los mismos 12.
- Al expirar un estado, puede haber unos segundos de respiro antes de la
  siguiente aplicación. Esa pausa es intencional y reduce la frecuencia del
  sonido de Poison.
- En todos los mapas de `lluvia_toxica`, llevar equipado el Manto de Lluvia
  impide las aplicaciones nuevas de Poison. No se revisan ni eliminan los
  Poison de otras fuentes.
- Si se sale del mapa, el estado aplicado por el clima puede tardar hasta 12
  segundos en expirar (4 segundos para Freeze y Stun) y ya no se vuelve a
  aplicar fuera de ese mapa.
- Freeze, Stun y Sleep pueden impedir temporalmente actuar o moverse. Usa una
  cuenta de prueba y el warp de GM para continuar el recorrido.
- Al iniciar o terminar cada evento, el mapa recibe un mensaje narrativo
  dirigido al jugador y adecuado al clima y su efecto. Hojas Petrificantes ya
  tiene textos definidos, pero no se mostrarán hasta asignar esa combinación
  a un mapa.

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

La configuración del cliente está en `mod.json`; la del scheduler y los
estados está en `npc/clima.txt`.

## Instalación y pruebas

Activa `clima` en **Settings → Mods**. Los cambios de `mod.json` requieren
recargar la configuración del cliente (reinicia la app si Settings lo solicita);
los cambios de `npc/` requieren reiniciar el servidor.

Después de iniciar el servidor, espera al primer anuncio y visita los mapas en
el orden de la tabla. Compara los dos mapas asignados a cada ID y prueba su
estado. El efecto visual se configura estáticamente por mapa en `mod.json` y
permanece visible mientras estés allí; no comienza ni termina junto con el
evento del estado. Por eso puede seguir viéndose después de que termina dicho
evento. Esa limitación del cliente sigue pendiente de una mejora futura.

## Resultados visuales de la exploración anterior

En las pruebas visuales anteriores se observó que `cloud` parece niebla,
`cloud3` parece contaminación en el aire y `cloud6` parece vapor. `cloud8`
produce un gas naranja en Izlude, pero solo se alcanza a ver sobre el agua. No
se observó una señal visible de `cloud2`, `cloud4`, `cloud5` ni `cloud7` en
aquellos mapas. Esos resultados pertenecen a la exploración previa: algunos de
esos efectos ya no forman parte de las combinaciones asignadas. La visibilidad
puede depender de superficies de agua u otras condiciones del mapa, así que
conviene observar de nuevo las combinaciones actuales.

Para confirmar la carga del NPC, revisa el log del map-server: debe mostrar
`[clima] <mapa> asignado a <combinación>...` y luego
`[clima] Evento <combinación> iniciado en <mapa>`. Al entrar a un mapa durante
el evento, el log registra si el estado está activo y si el equipo protege al
personaje.

Los efectos visuales admitidos se documentan en
[`CUSTOM_MAPS.md`](../../docs/mods/CUSTOM_MAPS.md).

## Interacción futura con Survival

El equipo de protección contra la lluvia ya está implementado en este mod. Una
posible ampliación sería que el clima también afectara hambre o sed:

- **Interacción con `survival`.** Un clima activo podría acelerar el descenso
  de hambre o sed según el tipo de exposición. Por ejemplo, calor intenso
  podría aumentar la sed y el frío aumentar el hambre. El clima debe modificar
  los ritmos que ya administra `survival`, sin crear medidores ni temporizadores
  paralelos.

### Recomendación de organización

Como el clima cambiaría directamente hambre y sed, recomiendo integrar las
combinaciones `calor_intenso` y `frio_extremo` en `survival` cuando se
implementen: allí ya viven los
valores, temporizadores, penalizaciones y consumibles de esas necesidades.
Las definiciones de combinaciones y protecciones pueden permanecer organizadas
en este mod, pero un solo controlador debe ser responsable de ajustar las
tasas. Así se evita que `clima` y `survival` mantengan copias de la misma
lógica o dependan de variables internas frágiles entre mods.

El mod `clima` puede seguir gestionando el scheduler y las combinaciones
climáticas. La integración futura con `survival` debe usar una interfaz
explícita para comunicar la exposición, no escribir directamente en los
temporizadores internos de otro mod.

### Reglas para futuras ampliaciones

1. Calcular el hambre y la sed con un multiplicador de exposición asociado al
   clima activo del mapa. Al terminar el evento, salir del mapa o desconectarse,
   restaurar el ritmo normal sin dejar modificadores pegados.
2. Mostrar claramente qué equipo protege de qué clima y, si se ajustan las
   tasas de `survival`, comunicar al jugador cuándo está expuesto y cuál
   necesidad se consume más rápido.
3. Mantener separados los efectos por clima: el Manto de Lluvia no protege
   contra frío, calor, contaminación u otros climas.

### Decisiones que faltan antes de implementarlo

- Qué mapas tendrán cada combinación en el diseño definitivo; la tabla actual
  es una distribución de prueba.
- Cuánto aumenta cada clima el consumo de hambre o sed, si hay límites y cómo
  interactúa con otras penalizaciones de `survival`.
- Si los efectos visuales siguen siendo permanentes por mapa o si en otra
  etapa se conectan al inicio y fin de cada evento; el cliente hoy no recibe
  ese ciclo de vida desde el scheduler.
- Cómo tratar cambios de mapa durante un evento, reapariciones,
  desconexiones o más de una fuente de exposición para las futuras mecánicas
  de hambre y sed.

Estos puntos son propuestas para la próxima etapa, no reglas ya acordadas. Las
siete combinaciones de estado asignadas siguen implementadas como prueba en dos
mapas cada una. `hojas_petrificantes` está definida pero aún no tiene mapas
asignados. Calor intenso y frío extremo siguen sin asignación ni efectos hasta
la integración con `survival`; `survival` no se ha modificado.

## Efecto visual durante el evento: posible trabajo futuro

Hoy el efecto visual de cada combinación está declarado para cada mapa en
`mod.json`. El cliente lo activa al cargar el mapa y lo mantiene mientras el
personaje permanece allí; el scheduler de `npc/clima.txt` no puede detenerlo
al acabar el evento. Por ahora, las asignaciones visuales y las combinaciones
de servidor coinciden, pero la duración visual sigue siendo independiente del
evento de estado.

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
