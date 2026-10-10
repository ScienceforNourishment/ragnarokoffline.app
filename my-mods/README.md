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

## Dirección de diseño

Las ideas para estos mods buscan que el mundo se sienta más activo, aventurero
y personal. Al proponer una función nueva, úsala como guía de diseño, no como
requisito para forzarla dentro de cada mod:

- **Dar más uso a los mapas.** Crear motivos para explorar y permanecer en
  distintos lugares, más allá de llegar para farmear monstruos. Cada zona puede
  ofrecer actividades y riesgos propios; por ejemplo, una región nevada y una
  selva deberían plantear desafíos diferentes y hacer que el jugador considere
  adónde ir y qué llevar.
- **Aumentar la sensación de aventura.** Hacer que un viaje exigente pueda
  ofrecer recompensas acordes a su riesgo. La preparación, los recursos
  limitados y las decisiones difíciles importan: continuar o volver, y cómo
  responder cuando un evento inesperado cambia el plan.
- **Hacer funcionales las ciudades.** Repartir NPC, tableros y actividades en
  lugares concretos, en vez de concentrarlo todo en el centro de Prontera.
  Crear razones para regresar a la ciudad, especialmente cuando los riesgos o
  desafíos de una expedición superen lo que el jugador puede afrontar todavía.
- **Dar vida al mundo con narrativa.** Aprovechar que la partida es offline
  para añadir detalles narrativos personales en los momentos adecuados y
  reforzar la inmersión sin depender de largos bloques de texto.

### Influencias

Son referencias de diseño para orientar ideas; toma los principios que encajen
con Ragnarok Online, no hace falta reproducir mecánicas de estos juegos:

- **Outward:** preparación, recursos limitados, rutas peligrosas, campamentos y
  decisiones sobre cuándo continuar o regresar.
- **Dragon's Dogma:** exploración, monstruos peligrosos, preparación,
  compañeros y encuentros inesperados capaces de cambiar el rumbo de una
  expedición.
- **Ultima Online:** actividades secundarias, libertad para experimentar y un
  mundo con más posibilidades sandbox.
- **Dark Souls:** narrativa ambiental e historias sugeridas por objetos y
  detalles del mundo, sin tener que explicarlo todo con texto extenso.

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

## Relación entre los mods de `my-mods/`

Estos mods forman parte de un espacio de trabajo compartido, pero no todos son
contenido propio ni todas sus interacciones están implementadas. Al crear o
modificar uno, conserva clara la diferencia entre el comportamiento actual y
las ideas para futuras iteraciones:

- **`affix-forge` y `arpg-equipments`** son mods externos que trajimos como
  referencia para estudiar ideas de mejora del botín. Sirven para consulta y
  para una futura extracción de datos; no los trates como código propio ni
  asumas que `dungeon-chest` ya entrega sus objetos.
- **`clima`** genera eventos climáticos en mapas específicos. Cada evento tiene
  un efecto visual y un efecto de estado; ciertos objetos personalizados,
  definidos dentro del propio mod, permiten bloquear esos efectos. Esos
  objetos podrían convertirse en recompensas de `dungeon-chest` más adelante.
  Algunos eventos también interactúan con `survival` y aceleran la pérdida de
  sed o hambre.
- **`dungeon-chest`** añade cofres a mapas de dungeon. Sus cofres están
  categorizados para entregar distintos tipos de recompensa. A futuro, el
  botín podría incluir objetos de `clima` o equipo inspirado en los mods de
  referencia `arpg-equipments` y `affix-forge`; no des por hecha esa integración
  ni cambies el botín sin que lo pida el alcance del trabajo. Las comidas
  distintas por Tier son recompensas temporales de prueba.
- **`survival`** añade barras de hambre y sed a la interfaz, además de alimentos
  y bebidas que las restauran. Ambos valores disminuyen con el tiempo, y los
  eventos de `clima` pueden acelerar esa reducción.

Una relación funcional no significa necesariamente que exista una dependencia
de carga entre mods. Antes de añadir o cambiar `requires.mods` o `after`, revisa
los `mod.json` y el cargador descrito en [`docs/MODDING.md`](../docs/MODDING.md).
Mantén cada función en el mod que la posee y coordina los cambios entre mods
solo cuando el comportamiento solicitado requiera esa integración.

## Notas operativas de `dungeon-chest`

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
- Para añadir un mapa a los cofres, valida primero que el servidor lo cargue,
  que cumpla el alcance de dungeon y que tenga spawns normales en el índice;
  asigna el Tier con el criterio existente, usa un ID interno de NPC único,
  conserva el flujo de temporizador y reclamación del primer jugador y
  actualiza los totales. La receta completa, incluida la forma de validar el
  spawn aleatorio y la carga del script, está en
  [`my-mods/dungeon-chest/README.md`](./dungeon-chest/README.md#guia-agregar-un-cofre-a-otro-mapa).

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
