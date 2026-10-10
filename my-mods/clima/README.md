# Clima

Prototipo de eventos de clima del lado del servidor en Prontera y Prontera
Field 08 (`prt_fild08`).

## Prueba actual

- El primer chequeo ocurre 30 segundos después de iniciar o recargar el
  servidor.
- El controlador revisa cada mapa cada 60 segundos si debe comenzar un evento.
  Los mapas mantienen temporizadores y estados independientes, así que los dos
  eventos pueden estar activos al mismo tiempo.
- En ambos mapas, la probabilidad está al 100% para facilitar las pruebas y
  cada evento dura 30 segundos.
- Prontera aplica Poison; Prontera Field 08 aplica Curse como prueba visual
  temporal. Curse debería teñir el personaje de rojo oscuro; Blind queda
  pendiente de verificar.
- Quienes ya están en el mapa reciben el estado al comenzar el evento. Quien
  entre mientras siga activo recibe el estado.
- El NPC revisa cada 10 segundos a los personajes que siguen en el mapa
  afectado, y aplica el estado con una duración de 12 segundos solo si no está
  activo. No reinicia un estado que ya está activo: eso evita reiniciar los
  ticks de Poison y reduce la frecuencia del sonido de aplicación. Por eso,
  normalmente el estado termina a los 12 segundos y el personaje tiene unos
  segundos de respiro antes de la siguiente revisión y aplicación. Esa pausa
  entre aplicaciones es intencional. rAthena guarda los estados en el
  personaje; al salir del mapa, Poison o Curse puede tardar hasta 12 segundos
  en expirar, y ya no se vuelve a aplicar fuera del mapa.
- Si el personaje permanece en el mapa durante el evento, el NPC vuelve a
  aplicar el estado si se cura o expira. Si el personaje ya tenía ese estado
  por otra fuente, el NPC no lo reemplaza ni cambia su duración. Al terminar el
  evento deja de aplicarlo.
- El map-server registra mensajes `[clima]` al cargar el NPC, revisar/iniciar/
  terminar eventos y aplicar el estado a quienes entran durante uno.

Los valores de prueba están juntos en `npc/clima.txt`: `.first_check_delay`,
`.check_interval`, `.effect_refresh_interval`, `.effect_lease`, `.chance[]` y
`.duration[]`. Los tiempos se indican en segundos y la probabilidad en
porcentaje (0 a 100); los valores de cada mapa están agrupados junto a su
estado y mensajes. Un temporizador interno se activa cada segundo para iniciar
y terminar los eventos; revisa si debe reaplicar cada estado cada 10 segundos.
Como el lease es de 12 segundos y un estado activo no se reinicia, una revisión
puede encontrarlo todavía activo; la siguiente lo aplicará después de que
expire, dejando una pausa sin efecto. La lluvia o nieve visual y la conexión
con el mod `survival` todavía no están incluidas.

## Instalación de prueba

Copia la carpeta completa `clima` a
`%APPDATA%\Ragnarok Offline\state\mods\clima` y actívala en **Settings →
Mods**. Reinicia el servidor para cargar el NPC. Al entrar en Prontera,
espera hasta 30 segundos para el primer chequeo y Poison. Luego visita
Prontera Field 08 para probar Curse y comprobar si el estado se ve en el
personaje. El primer evento de cada mapa comienza en el mismo primer chequeo;
como ambos duran 30 segundos, puedes recorrer los dos mapas para comprobar
cada estado. Después se revisan de forma independiente.

Para confirmar que el script cargó, revisa el log del map-server. Un error de
sintaxis puede impedir que se lea el archivo completo. Debes ver
`[clima] NPC cargado` al iniciar, y luego `[clima] Evento iniciado en
prontera` o `[clima] Evento iniciado en prt_fild08`; ese mensaje también indica
el estado y cuántos personajes encontró. Al entrar a un mapa durante un evento,
el log confirma si el estado está activo en el personaje. Para verificar la salida, espera a recibir
Poison en Prontera y luego camina a un mapa sin evento: Poison puede seguir
visible brevemente, pero debe desaparecer en un máximo de 12 segundos aunque
el evento de Prontera siga activo. Curarlo mientras continúas en un mapa con
un evento activo solo lo quita hasta la siguiente revisión (máximo 10
segundos). También es normal que el estado expire y el personaje tenga unos
segundos sin efecto antes de reaplicarse; Poison no se reinicia mientras siga
activo. El anuncio amarillo en el mapa confirma el comienzo del evento.
El log debería mostrar `Curse al entrar a prt_fild08; activo: 1`. Curse se
debería ver como un tinte rojo oscuro en el personaje. Si Curse sí se ve,
confirmamos que el mod aplica y el cliente presenta otros estados; el problema
sería específico a la presentación de Blind. Si tampoco se ve Curse, aunque el
log confirme que está activo, revisaremos la presentación general de estados
del cliente.

La línea del mapflag debe separar sus campos con tabuladores, como los demás
mapflags de rAthena: `prontera<TAB>mapflag<TAB>loadevent`. Con espacios, el
parser detiene la lectura del archivo en la primera línea y no registra el
controlador del clima.
