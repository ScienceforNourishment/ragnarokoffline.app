# Contexto para crear mods de Ragnarok Offline

Comparte este archivo al pedir ayuda para crear o modificar un mod. Resume el
contexto habitual del proyecto; el pedido concreto debe explicar qué quieres
que haga el mod y cómo debe comportarse.

## Proyecto

Estoy creando mods para **Ragnarok Offline**, una aplicación de escritorio
para jugar Ragnarok Online en un mundo local. El juego usa:

- **rAthena** para login, personajes, mapas, NPC, objetos, scripts y reglas del
  servidor.
- **roBrowserLegacy** para el cliente del juego que se ejecuta en Chromium.
- **Mods de Ragnarok Offline** para añadir contenido al servidor o al cliente
  sin reconstruir la aplicación.

La arquitectura completa está en el apartado **Architecture** de
[`README.md`](../README.md). La referencia vigente para el formato y
comportamiento de los mods es [`docs/MODDING.md`](../docs/MODDING.md); hay que
consultarla cuando la implementación dependa de detalles del cargador o de las
API.

## Dónde van los cambios

- Esta carpeta, `my-mods/`, contiene mis mods de trabajo y pruebas.
- `mods/` contiene los mods que se distribuyen con el proyecto.
- Un mod suele ser una carpeta con `mod.json` y los directorios de las partes
  que necesite: `db/`, `npc/`, `lua/`, `conf/`, `client/`, `data/`, `System/`,
  entre otros. No agregues carpetas o archivos vacíos para componentes que no
  usa.
- La carpeta del mod es su identidad; debe coincidir con `name` en `mod.json`.
  Respeta la ubicación solicitada; no promociones automáticamente un prototipo
  de `my-mods/` a `mods/`.
- Implementa una función propia del mod dentro de sus archivos y datos siempre
  que sea posible. No cambies rAthena, roBrowserLegacy, el supervisor, Electron
  ni scripts de construcción por una necesidad de un solo mod. Un cambio a la
  plataforma requiere una razón clara y debe consultarse antes si no forma
  parte explícita del pedido.
- No añadas dependencias, acceso a archivos en tiempo de ejecución ni
  capacidades nuevas a rAthena para resolver una necesidad que puede vivir en
  el mod.

## Comportamiento del cargador

- Los mods se aplican en orden alfabético por nombre, salvo que `mod.json`
  indique precedencia con `"after": ["otro-mod"]`. `requires.mods` significa
  dependencia obligatoria; no es un sustituto de `after`.
- Las tablas del servidor se combinan por entrada. Si dos mods definen la
  misma entrada, gana el que se aplica después. Tenlo en cuenta al compartir
  tablas como `db/item_db.yml`: una redefinición debe conservar los efectos
  que deban coexistir.
- Los cambios a `db/` y `npc/` necesitan que el servidor vuelva a cargar los
  mods; los cambios a `client/` requieren reiniciar la aplicación para volver
  a cargar los plugins.
- Evita activar simultáneamente un mod nuevo y el mod antiguo que reemplaza:
  pueden duplicarse NPC controladores, temporizadores, eventos o efectos.

## Servidor y cliente

- Los scripts y tablas del servidor se escriben para **rAthena**, no para otro
  emulador. Sigue sus comandos y convenciones. Usa eventos y scripts dentro de
  `npc/` y tablas dentro de `db/` cuando sean suficientes.
- En rAthena, una funcion global de NPC se declara como
  `function<TAB>script<TAB>Nombre<TAB>{` (con tabuladores reales entre los
  campos), no como `function script Nombre {`. Una sintaxis incorrecta puede
  hacer que rAthena detenga la lectura de todo ese archivo; confirma la carga
  en `ragnarok-stack logs map 100`, no solo que el archivo aparezca en la
  configuracion.
- Los plugins de `client/` son módulos ES con una exportación `default` que
  recibe `(parameters, api)`. Comprueba `api.version` y usa las API soportadas
  en `docs/MODDING.md`; registra recursos con `api.cleanup()` y no dependas de
  objetos internos o APIs no documentadas de roBrowser.
- Un script de servidor puede enviar una actualización a los plugins con
  `dispbottom "@@event <comando> <texto>";`. El cliente la recibe como
  `api.on('server:event', ({ command, text }) => ...)`. Usa un comando propio
  del mod y valida el formato del mensaje.
- Mantén aislados los nombres de variables, eventos, selectores CSS, elementos
  DOM y temporizadores para evitar conflictos con otros mods.

## Aprendizajes: equipo y cofres de dungeon

- `affix-forge` y `arpg-equipments` ya ofrecen equipo con entre 1 y 4 opciones.
  Los cofres no deberían duplicar esa recompensa con más armas o equipo
  mejorado; su botín distintivo aún está por decidir. Las comidas distintas
  por Tier del mod `dungeon-chest` son recompensas temporales para probarlo.
- `my-mods/dungeon-chest/` es la identidad actual del mod: el nombre de la
  carpeta debe coincidir con `name` en `mod.json`. Al renombrar un mod, actualiza
  también referencias internas y la copia instalada; cambiar la identidad no
  elimina por sí solo los archivos de la carpeta con el nombre anterior.
- Al actualizar una instalación, reemplaza la carpeta del mod completa. Copiar
  encima no quita scripts `.txt` obsoletos, que pueden seguir cargándose como
  NPC duplicados aunque ya no existan en la versión del proyecto.
- `dungeon-chest` coloca un cofre por mapa en una celda transitable aleatoria.
  Su lista actual cubre 179 mapas clasificados provisionalmente por Tier con
  un promedio ponderado de los niveles de sus spawns normales Renewal; es una
  estimación para ordenar el contenido, no un nivel recomendado oficial.
  Quedan fuera 17 mapas de la lista de RateMyServer sin spawns normales en el
  índice consultado.
- Los intervalos actuales de 10 minutos para reubicar un cofre no abierto y
  para reponer uno abierto son valores de prueba, no el balance definitivo.
  Para diagnosticar cofres ausentes, revisa el log del map-server: que el
  archivo esté incluido en `map_conf.txt` no demuestra que rAthena lo haya
  parseado; un error de sintaxis puede detener la carga del archivo entero.

## Reglas de implementación

- Antes de editar, revisa el mod y su estado actual; no descartes cambios
  pendientes ni archivos sin seguimiento. Haz cambios precisos y relacionados
  con lo pedido.
- Busca un patrón existente en [`examples/mods/`](../examples/mods) o en un
  mod parecido antes de inventar una API o una estructura nueva.
- Conserva los efectos originales de un objeto salvo que el pedido indique
  explícitamente cambiarlos. Al redefinir una entrada existente, verifica qué
  mod gana y si se deben combinar efectos.
- Mantén el comportamiento consistente entre servidor y cliente, los dos
  modos de juego (Renewal y Pre-Renewal) cuando corresponda, y los personajes
  que ya tengan datos guardados. No reinicies estado existente sin indicarlo.
- Si dos penalizaciones o efectos deben acumularse, comprueba cómo los
  implementa realmente rAthena; no asumas que dos llamadas de una misma función
  se apilan. Calcula el resultado combinado si rAthena reemplaza efectos
  duplicados.
- No agregues ni retires NPC, objetos, penalizaciones, dependencias, opciones o
  cambios de balance que no haya pedido.
- Si el resultado depende de una decisión de diseño con varias alternativas
  razonables, pregúntame antes de elegir. Para los detalles pequeños, sigue el
  patrón del mod y explícame las suposiciones importantes.
- Actualiza el README del mod cuando cambien instalación, contenido o
  comportamiento.

## Validación

Usa las herramientas adecuadas para el cambio, sin ejecutar una suite grande
innecesariamente:

- `node --check <archivo>` para JavaScript.
- `node --test <prueba>` para las pruebas de Node pertinentes.
- `cd stack && cargo test` para cambios del supervisor (no es una prueba de
  scripts de mod).
- `git diff --check` para detectar errores de formato.
- Para tablas y scripts, comprueba directamente los requisitos funcionales:
  IDs sin duplicar, objetos correctos, valores limitados, variables y eventos
  consistentes, y que no se hayan perdido efectos previos. Cuando sea posible,
  prueba el cambio en el juego con un personaje de prueba.

Indica qué pruebas se ejecutaron y cuáles no se pudieron hacer dentro del
juego. No presentes una comprobación estática como si fuera una prueba en
ejecución.

## Qué incluir en cada pedido

Al compartir este contexto, añade lo específico del nuevo mod:

1. **Nombre o propósito** del mod, si ya lo tienes.
2. **Qué debe hacer**, desde la perspectiva del jugador.
3. **Cuándo y para quién** ocurre (por personaje, cuenta, sesión, mapa, al usar
   un objeto, al entrar al juego, etc.).
4. **Reglas concretas**: cantidades, límites, tiempos, costos, penalizaciones,
   compatibilidad y qué debe pasar en los casos límite.
5. **Dónde debe vivir**: prototipo en `my-mods/` o mod distribuido en `mods/`.
6. **Si es una modificación de otro mod**, cuál es la fuente de verdad y qué
   datos o comportamiento existente se deben conservar.
7. **Cómo quieres probarlo** o qué resultado observable confirmaría que funciona.

Si falta una decisión importante, pregunta antes de asumirla. Si no pido solo
un plan o una explicación, implementa el cambio en el repositorio, valida lo
que sea posible y termina con un resumen breve de los archivos y pruebas.
