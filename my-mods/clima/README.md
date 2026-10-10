# Clima

Prueba temporal de los efectos visuales de clima del cliente y estados del
servidor en 14 mapas. Los primeros 13 mapas prueban los 13 efectos visuales
disponibles; Geffen queda como control sin efecto visual.

## Asignaciones de prueba

Los efectos visuales se activan al estar en el mapa. Los eventos de estado son
independientes y empiezan 30 segundos después de iniciar el servidor.

| # | Mapa | Efecto visual | Resultado visual observado | Estado de prueba |
|---:|---|---|---|---|
| 1 | `prt_fild01` | Lluvia (`rain`) | Pendiente de documentar | Poison |
| 2 | `prt_fild02` | Nieve (`snow`) | Pendiente de documentar | Curse |
| 3 | `prt_fild03` | Fuegos artificiales (`fireworks`) | Pendiente de documentar | Blind |
| 4 | `prt_fild04` | Hojas (`leaves`) | Pendiente de documentar | Freeze |
| 5 | `prt_fild05` | Sakura (`sakura`) | Pendiente de documentar | Stone Curse |
| 6 | `prt_fild06` | Nubes (`cloud`) | Se ve como niebla | Stun |
| 7 | `prt_fild07` | Nubes (`cloud2`) | No se observó | Sleep |
| 8 | `prt_fild08` | Nubes (`cloud3`) | Se ve como contaminación en el aire | Bleeding |
| 9 | `prt_fild09` | Nubes (`cloud4`) | No se observó | Burning |
| 10 | `prt_fild10` | Nubes (`cloud5`) | No se observó | Decrease Agi |
| 11 | `prt_fild11` | Nubes (`cloud6`) | Se ve como vapor | Poison |
| 12 | `prontera` | Nubes (`cloud7`) | No se observó | Curse |
| 13 | `izlude` | Nubes (`cloud8`) | Gas naranja; solo se ve sobre el agua | Blind |
| 14 | `geffen` | Sin efecto visual (control) | Control sin clima visual | Freeze |

Los primeros diez estados siguen el orden de la lista de candidatos; Poison,
Curse, Blind y Freeze se repiten en los mapas 11–14 porque hay más efectos
visuales que estados candidatos. Los estados elegidos solo son para comparar
su presentación y no son todavía la combinación final de cada clima.

## Evaluación de los estados para el diseño

Esta valoración sirve como guía para elegir futuras combinaciones de clima y
no cambia la configuración de prueba de arriba.

| Estado | Valoración | Criterio de uso |
|---|---|---|
| Poison | Buen candidato | Mantiene presión constante y reduce los recursos del jugador sin impedirle explorar o actuar. |
| Curse | Usar con mucha cautela o evitar | La reducción de velocidad de movimiento resulta demasiado molesta para un efecto frecuente; reservar para situaciones muy específicas si se conserva. |
| Blind | Buen candidato | Reduce la precisión y ejerce una presión leve sin bloquear el acceso al mapa. Su presentación visual en el cliente sigue pendiente de revisión. |
| Freeze | Situacional | Inmoviliza y deja al jugador expuesto. Si se usa, limitar cada aplicación a unos 3–5 segundos y reservarla para situaciones puntuales. |
| Stone Curse | Evitar | Es más restrictivo que Freeze y su presentación visual no resulta atractiva para este mod. |
| Stun | Situacional | Como Freeze, impide actuar y puede dejar al jugador expuesto; usar solo en aplicaciones breves. |
| Sleep | Situacional | Puede impedir actuar hasta que termine o el personaje reciba un golpe. Es molesto, pero podría encajar en situaciones concretas. |
| Bleeding | Solo para presión alta | El daño es demasiado intenso para uso común; considerar únicamente en contenido de nivel muy alto y con duración/balance cuidadosos. |
| Burning | Solo para presión alta | Similar a Bleeding: su daño sostenido puede ser excesivo salvo en contenido de nivel muy alto. |
| Decrease Agi | Buen candidato | Reduce la velocidad de movimiento de forma más leve y puede generar presión sin bloquear por completo al jugador. |

Los efectos de estado configurados actualmente usan un lease de 12 segundos
para esta prueba. Ese valor no es una recomendación de balance: si Freeze se
elige más adelante, habrá que darle una duración específica de 3–5 segundos
por aplicación, en lugar de reutilizar el lease general. Lo mismo aplica a
Stun, Sleep, Bleeding y Burning, que requieren decidir sus duraciones y
frecuencias antes de usarse en eventos reales.

## Comportamiento del scheduler

- El primer chequeo de cada mapa ocurre 30 segundos después de iniciar el
  servidor. La probabilidad está al 100% para esta prueba.
- Cada evento dura 5 minutos para dar tiempo de visitar los 14 mapas en una
  sesión. Los eventos de todos los mapas empiezan en el mismo primer chequeo.
- Durante un evento, el NPC revisa cada 10 segundos a los personajes del mapa y
  aplica el estado asignado con una duración de 12 segundos solo si no está
  activo. No reinicia estados activos. Al expirar, puede haber unos segundos
  de respiro antes de la siguiente aplicación; esa pausa es intencional y
  reduce la frecuencia del sonido de Poison.
- Si se sale del mapa, el estado aplicado por el clima puede tardar hasta 12
  segundos en expirar y ya no se vuelve a aplicar fuera de ese mapa.
- Freeze, Stone Curse, Stun y Sleep pueden impedir temporalmente actuar o
  moverse. Usa una cuenta de prueba y el warp de GM para continuar el recorrido.

La configuración del cliente está en `mod.json`; la del scheduler y los
estados está en `npc/clima.txt`.

## Instalación y pruebas

Activa `clima` en **Settings → Mods**. Los cambios de `mod.json` requieren
recargar la configuración del cliente (reinicia la app si Settings lo solicita);
los cambios de `npc/` requieren reiniciar el servidor.

Después de iniciar el servidor, espera al primer anuncio de clima y visita los
mapas en el orden de la tabla. En cada uno, observa el efecto visual y anota si
se distingue bien; prueba también el estado asignado. Geffen sirve para
comparar el aspecto normal del cliente frente a los mapas con efecto visual.
Los efectos visuales permanecen asignados a su mapa mientras el personaje
esté allí; no comienzan ni terminan junto con el evento de estado. Por eso,
que un efecto siga visible al terminar el evento es el comportamiento actual.

## Resultados visuales y preguntas pendientes

En la primera sesión se observó que `cloud` parece niebla, `cloud3` parece
contaminación en el aire y `cloud6` parece vapor. `cloud8` produce un gas
naranja en Izlude, pero solo se alcanza a ver sobre el agua. No se observó una
señal visible de `cloud2`, `cloud4`, `cloud5` ni `cloud7` en los mapas de esta
prueba. Esto no demuestra que esos efectos no funcionen: como `cloud8`, podrían
depender de superficies de agua u otras condiciones del mapa; hace falta
probarlos en otros lugares.

Para confirmar la carga del NPC, revisa el log del map-server: debe mostrar
`[clima] Controlador cargado para ...` y luego
`[clima] Evento iniciado en <mapa>; estado <estado>`. Al entrar a un mapa
durante el evento, el log registra el estado activo del personaje.

Los efectos visuales admitidos se documentan en
[`CUSTOM_MAPS.md`](../../docs/mods/CUSTOM_MAPS.md).

## Enfoque futuro: equipo e interacción con Survival

La dirección propuesta para el mod es que el clima tenga consecuencias
jugables y contramedidas, no solo un estado negativo:

- **Equipo de protección climática.** Por ejemplo, una capa impermeable podría
  impedir que la lluvia aplique el Poison definido por el evento. La protección
  debe bloquear solo el efecto causado por ese evento climático; no debería
  dar inmunidad global a Poison ni quitar un Poison legítimo aplicado por un
  monstruo, habilidad u otra fuente. Lo más seguro es comprobar el equipo antes
  de aplicar el efecto del clima y dejar que los estados ya activos expiren
  normalmente.
- **Interacción con `survival`.** Un clima activo podría acelerar el descenso
  de hambre o sed según el tipo de exposición. Por ejemplo, calor intenso
  podría aumentar la sed y el frío aumentar el hambre. El clima debe modificar
  los ritmos que ya administra `survival`, sin crear medidores ni temporizadores
  paralelos.

### Recomendación de organización

Como el clima cambiaría directamente hambre y sed, recomiendo integrar la
lógica jugable del clima en `survival` cuando se implemente: allí ya viven los
valores, temporizadores, penalizaciones y consumibles de esas necesidades.
Puede conservarse separada en archivos y secciones propios —scheduler,
protecciones y configuración por mapa—, pero un solo controlador debería ser
responsable de ajustar las tasas. Así se evita que `clima` y `survival`
mantengan copias de la misma lógica o dependan de variables internas frágiles
entre mods.

El mod `clima` actual puede seguir sirviendo como prototipo de efectos
visuales y resultados. Al convertir el prototipo en una función jugable se
puede decidir si sus archivos se trasladan a `survival` o si se conserva un
mod climático independiente con una interfaz de integración explícita. No
conviene hacer que un mod escriba directamente en los temporizadores internos
del otro.

### Reglas de diseño recomendadas

1. Aplicar protección únicamente contra el efecto climático correspondiente;
   revisar el equipo al aplicar o renovar el efecto y no usar inmunidad global
   al estado.
2. Calcular el hambre y la sed con un multiplicador de exposición asociado al
   clima activo del mapa. Al terminar el evento, salir del mapa o desconectarse,
   restaurar el ritmo normal sin dejar modificadores pegados.
3. Mostrar claramente qué equipo protege de qué clima y, si se ajustan las
   tasas de `survival`, comunicar al jugador cuándo está expuesto y cuál
   necesidad se consume más rápido.
4. Mantener inicialmente los efectos separados y explícitos: un equipo contra
   la lluvia no tiene por qué proteger contra frío, calor, contaminación u
   otros climas.

### Decisiones que faltan antes de implementarlo

- Qué eventos climáticos y estados sobreviven a la prueba actual, y qué mapas
  pueden tener cada evento.
- Qué equipo protege contra cada clima, si la protección es binaria o parcial,
  y cómo se obtiene y equipa.
- Cuánto aumenta cada clima el consumo de hambre o sed, si hay límites y cómo
  interactúa con otras penalizaciones de `survival`.
- Si los efectos visuales siguen siendo permanentes por mapa o si en otra
  etapa se conectan al inicio y fin de cada evento; el cliente hoy no recibe
  ese ciclo de vida desde el scheduler.
- Cómo tratar estados que ya estén activos al equipar protección, cambiar de
  mapa durante un evento, reaparecer, desconectarse o tener más de una fuente
  de exposición.

Estos puntos son propuestas para la próxima etapa, no reglas ya acordadas. La
tabla de mapas y el scheduler de esta carpeta continúan siendo una prueba; no
se han convertido aún en el diseño definitivo ni se ha modificado `survival`.

## Efecto visual durante el evento: posible trabajo futuro

Hoy los efectos visuales de esta prueba están declarados en `mod.json`. El
cliente los activa al cargar el mapa y los mantiene mientras el personaje
permanece allí; el scheduler de `npc/clima.txt` no puede detenerlos al acabar
el evento. Esta separación es intencional en la prueba actual: el clima visual
sirve para comparar los efectos disponibles, independientemente de los eventos
de estado.

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
