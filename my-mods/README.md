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

## Plan de trabajo

La planificación está repartida en estos documentos; léelos en este orden:

| Documento | Contiene |
|---|---|
| [`DECISIONS.md`](./DECISIONS.md) | lo decidido, con fecha y porqué. **Manda sobre los demás** |
| [`ROADMAP.md`](./ROADMAP.md) | la visión, los hitos, el estado de cada mod y los errores abiertos |
| [`PLAN.md`](./PLAN.md) | el catálogo de diseño: qué sistemas queremos y cómo |
| [`CONVENTIONS.md`](./CONVENTIONS.md) | rangos de IDs, prefijos, eventos públicos, regla de grupo y restricciones técnicas |
| [`MODPACK.md`](./MODPACK.md) | qué mods y Settings forman la partida |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | límites de la plataforma: clima eventual, día y noche y presupuesto de rendimiento |
| [`NOVEDADES.md`](./NOVEDADES.md) | funciones nuevas de la plataforma por aprovechar, con lo investigado: iconos de estado propios, logros, música |
| [`SESION-DE-PRUEBA.md`](./SESION-DE-PRUEBA.md) | el guion de la próxima sesión de prueba larga en el juego, con su tabla de resultados |

La partida es **Renewal** (D1). Las ideas originales siguen en
[`conceptsForMods.md`](./conceptsForMods.md). Al empezar un mod nuevo,
regístralo en `CONVENTIONS.md` y lee su sección en `PLAN.md`; lo que dice allí
es una propuesta hasta que el mod exista.

### Por dónde empezar

Al retomar el trabajo en una sesión nueva: este README, luego
[`ROADMAP.md`](./ROADMAP.md) (en qué hito estamos y qué sigue) y
[`DECISIONS.md`](./DECISIONS.md) (qué ya no se discute). Después, según la
tarea:

| Tarea | Lee además |
|---|---|
| Arreglar o probar un mod existente | su README; el error abierto y los pendientes en `ROADMAP.md` |
| Preparar o hacer una sesión de prueba en el juego | `SESION-DE-PRUEBA.md`; al acabar, sus resultados pasan a «Estado» de cada README |
| Crear un mod nuevo | su entrada en `PLAN.md` («Mods nuevos propuestos»); `CONVENTIONS.md` (IDs, prefijo, eventos, reglas de rendimiento) |
| Cualquier cosa de EXP, expediciones, relatos o el diario | `ADVENTURE.md` |
| Castigos, recompensas o valores de balance | `BALANCE.md` |
| Algo que la plataforma quizá no permite (clima, luz, cliente, rendimiento) | `ARCHITECTURE.md` y la tabla de restricciones de `CONVENTIONS.md` |
| Activar o recomendar un mod del registro, o cambiar Settings | `MODPACK.md` |
| Una decisión de diseño nueva | `DECISIONS.md` (añadirla ahí con fecha) |

**Dónde va cada cosa al documentar,** para que no se contradigan:

- Lo que **hace** un mod y su **estado** (versión, qué se probó, problemas
  abiertos): solo en su README, en la sección «Estado». Este README dice qué
  es cada mod y `ROADMAP.md` en qué hito entra, sin repetir el estado: enlazan
  a esa sección.
- Lo **decidido**: en `DECISIONS.md`, con número (D1, D2…). Los demás
  documentos citan el número en vez de repetir la decisión.
- Lo **pendiente o el orden**: en `ROADMAP.md`. El diseño de algo que no
  existe: en `PLAN.md`, o en su documento propio si es grande (`ADVENTURE.md`).
- Una regla que debe cumplir **todo** mod: en `CONVENTIONS.md`.

Dos documentos de diseño mandan sobre todos los mods:

- [`ADVENTURE.md`](./ADVENTURE.md): la **columna vertebral**. La EXP sale de
  las experiencias (lo que el personaje vive por primera vez), cobradas al
  descansar en una posada, una taberna o la fogata de un refugio restaurado,
  no de matar monstruos. Un mod que produce algo
  digno de contarse debe publicarlo como experiencia.
- [`BALANCE.md`](./BALANCE.md): cómo castigan y premian los sistemas de
  supervivencia: ejes distintos, escalones con aviso, tope de presión total y
  un estado positivo por cada castigo.

Lo que trajo el proyecto original y ayuda a hacer mods (límite de 40 ajustes,
hooks de habilidades, ejemplo `skill-tuning`, ventana del estilista) está
resumido en [`UPSTREAM-NOTES.md`](./UPSTREAM-NOTES.md).

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
- **Progresar por avanzar, no por repetir.** La EXP viene de lo nuevo: un
  mapa, un bioma, un cofre, una marca, una cicatriz. Lo repetido paga poco.
- **Cada castigo con su recompensa.** Un sistema que castiga debe tener un
  estado positivo que premie la preparación, y la presión crece con el Tier del
  mapa. Ver [`BALANCE.md`](./BALANCE.md).
- **Una decisión, no una obligación.** Si un sistema solo pide vigilar una
  barra, sobra o hay que rediseñarlo.

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

Esta sección dice qué es cada mod y cómo se relaciona con los demás. **Su
versión y qué se probó están solo en la sección «Estado» de su propio
README.**

Estos mods forman parte de un espacio de trabajo compartido, pero no todos son
contenido propio ni todas sus interacciones están implementadas. Al crear o
modificar uno, conserva clara la diferencia entre el comportamiento actual y
las ideas para futuras iteraciones:

- **`affix-forge` y `arpg-equipments`** son mods externos (MIT) que trajimos
  como referencia. **No se activan.** Sus listas de equipo y sus afijos ya se
  importaron a `dungeon-chest` 0.4.0, con los disfraces y el Herrero de
  Afijos (D35–D37); lo que queda por rescatar (las Esencias y el pilar de
  luz) está en «Otros pendientes» de `ROADMAP.md`. No los trates como código
  propio.
- **`clima`** genera eventos climáticos en mapas específicos. Cada evento tiene
  un efecto visual y un efecto de estado; ciertos objetos personalizados,
  definidos dentro del propio mod, permiten bloquear esos efectos. Esos
  objetos podrían convertirse en recompensas de `dungeon-chest` más adelante.
  Algunos eventos también interactúan con `survival` y aceleran la pérdida de
  sed o hambre. El **Pronosticador** de Prontera dice el evento de cada mapa y
  el siguiente, ya sorteado; otros mods pueden leer lo mismo con `F_Clima_*`.
- **`dungeon-chest`** añade cofres a mapas de dungeon, por Tier. Desde la
  0.4.0 (D35) dan casi siempre una pieza de equipo **sin identificar con 1 a
  4 afijos** del Tier, con más probabilidad de tu clase y un afijo según el
  bioma; un 5 % de las veces, un disfraz (D36); si no, una comida del Tier
  (de prueba). En Prontera, su **Herrero de Afijos** pasa, quita o vuelve a
  sortear afijos por zeny (D37). Los datos son CSV propios importados de
  `arpg-equipments` y `affix-forge`. Los objetos de `clima` y la ropa de
  `temperature` como botín siguen pendientes.
- **`survival`** añade barras de hambre y sed a la interfaz, además de alimentos
  y bebidas que las restauran. Ambos valores disminuyen con el tiempo, y los
  eventos de `clima` pueden acelerar esa reducción. En los mapas exteriores
  de las siete ciudades principales no bajan; la lista se edita según la guía
  "Zonas seguras" de [`survival/README.md`](./survival/README.md).
- **`travel-journal`**, el diario del viajero, **se retiró el 2026-10-23**
  (D12): el diario vive ahora en `adventure`, que conserva
  `TravelJournal::OnLog`, así que los mods que escriben en él no cambian. Su
  código queda en el historial de git.
- **`expedition-board`** coloca un tablero de contratos en cada ciudad principal, con dos tipos: *marca* (aparece un monstruo con nombre en un mapa cercano) y *caza* (abatir N monstruos de una especie dentro de un mapa; el progreso lo cuenta el mod). En ambos hay que volver a la ciudad que lo publicó: las cacerías se cobran en el tablero y las marcas con el Intendente, un NPC junto al tablero. Escribe notas en el diario de `adventure` (`TravelJournal::OnLog`, dependencia suave, sin `requires.mods`) y toma el Tier del mapa de `world-atlas` (también suave) para escalar la recompensa y reforzar las marcas; por lo demás es independiente de los demás mods de esta carpeta y de `bounty-hunt`. Las recompensas actuales son zeny y pociones de prueba; no asumas botín de `dungeon-chest` ni de `clima`.

- **`wounds`** da heridas y maldiciones con nombre al morir fuera de una ciudad; se curan con el Posadero (zeny, solo heridas) o el Sacerdote del Templo (donación, también maldiciones) de las siete ciudades. El nombre de la herida sale de quién te mató, del bioma, del clima activo o de tu marca de `expedition-board`. Penaliza con su propio `bonus_script`, sin tocar `survival`. Usa `world-atlas` (bioma) y `travel-journal` (notas) como dependencias suaves. Ver [`wounds/README.md`](./wounds/README.md).

- **`temperature`** calcula cada 4 s una sensación a partir de la temperatura del mapa (`world-atlas`), la exposición de `clima` y la ropa puesta, y la muestra como estado con nombre e icono (Helado, Fresco, Cómodo, Acalorado...). Penaliza con su propio `bonus_script` y premia con un bono pequeño si la ropa compensa. Sin temperatura en ciudades. Ropa propia (ids 50840–50843, Sastre en Prontera). Requiere `world-atlas`. Ver [`temperature/README.md`](./temperature/README.md).

- **`world-atlas`** es una tabla de datos por mapa (tipo, bioma, Tier,
  temperatura, ciudad ancla) con funciones `F_Atlas_*` que otros mods pueden
  consultar con `callfunc`. No hace nada por sí solo y **lo usan `survival` (qué
  mapas son ciudad, con su lista propia como reserva) y `dungeon-chest` (sus
  cofres se generan desde las mazmorras del atlas, y en el juego toma de él el Tier) y `clima` (el bioma
  decide qué eventos ocurren; sin el atlas no hay eventos) y `adventure`
  (el nombre legible del mapa, con el código como reserva)**. Se genera desde un CSV; ver
  [`world-atlas/README.md`](./world-atlas/README.md).

- **`adventure`** es la columna vertebral ([`ADVENTURE.md`](./ADVENTURE.md)):
  expediciones y **relatos**. Lo vivido por primera vez (mapa, bioma, Tier,
  herida) queda como relato sin contar y se cobra en EXP al contarlo con el
  **Cronista** de una ciudad, lo que cierra la expedición. Trae el diario de
  `travel-journal` con una pestaña Relatos. Requiere `world-atlas`; `wounds`
  le publica la primera vez de cada herida. Los demás mods publican
  experiencias con `callfunc "F_Adv_Experience"` tras comprobar
  `getnpcid(0, "Adventure")`. Ver [`adventure/README.md`](./adventure/README.md).

- **`nemesis`** convierte en némesis al monstruo que te mató fuera de una
  ciudad (uno a la vez): te espera con nombre donde caíste, sube de rango si
  vuelve a matarte y, al vencerlo, da trofeos firmados, un relato de
  `adventure` y cura las heridas que te dejó (`wounds` 0.5.0,
  `F_Wounds_CureFrom`). Todo con dependencias suaves; sin temporizadores. Ver
  [`nemesis/README.md`](./nemesis/README.md).

- **`tavern-rumors`** es la taberna de Prontera (`prt_in`): por una ronda de
  zeny, el Tabernero cuenta qué tiempo hace donde vas (`clima`), qué le duele
  al monstruo de tu contrato (`expedition-board`) y dónde te espera tu
  némesis (`nemesis`); y allí se cuentan gratis los relatos de `adventure`
  (`Adventure::OnRest`). Todo con dependencias suaves. Ver
  [`tavern-rumors/README.md`](./tavern-rumors/README.md).

- **`campfire`** pone fogatas en el campo: la leña o un kit encienden una
  fogata visible (un NPC, D28) donde se descansa (Descansado: más
  regeneración y la primera muerte no deja herida de `wounds`), se cocinan
  drops de monstruos en platos con buff (recetas en un CSV, D30) y se venda
  una herida a la mitad (D29). Junto al fuego, `temperature` da Cómodo. No
  cuenta los relatos de `adventure` (D10). Todo con dependencias suaves. Ver
  [`campfire/README.md`](./campfire/README.md).

- **`refuges`** pone refugios en ruinas en los campos (la Abadía y
  `prt_fild11`) que se restauran en tres etapas con drops y zeny, para todo
  el mundo (D32–D34): una fogata donde se descansa (Descansado de
  `campfire`) y se cuentan los relatos de `adventure`, un intendente con
  provisiones y una caravana a Prontera. Todo con dependencias suaves. Ver
  [`refuges/README.md`](./refuges/README.md).

**Planeado, sin código todavía** (ver «Mods nuevos propuestos» en
[`PLAN.md`](./PLAN.md)): `remnants`, que espera a `LORE.md`.

**Datos compartidos entre mods.** El mod store está aislado por mod, así que
lo que un mod deba leer de otro va en variables de personaje con el prefijo del
mod que las escribe: `@clima_*` (exposición), `@pr_*` (presión, ver
[`BALANCE.md`](./BALANCE.md#tope-de-presión)) y `adv_trait_*` (rasgos).

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
  Su `npc/dungeon-chests.txt` **se genera** desde las filas `kind=dungeon` del
  atlas (183 mapas) con `registry/tools/dungeon-chest/build_chests.cjs`; no se
  edita a mano. El Tier es el del atlas: un promedio ponderado de los niveles
  de los spawns normales Renewal, una estimación para ordenar el contenido, no
  un nivel recomendado oficial.
- Los intervalos actuales de 10 minutos para reubicar un cofre no abierto y
  para reponer uno abierto son valores de prueba, no el balance definitivo.
  Para diagnosticar cofres ausentes, revisa el log del map-server: que el
  archivo esté incluido en `map_conf.txt` no demuestra que rAthena lo haya
  parseado; un error de sintaxis puede detener la carga del archivo entero.
- Para añadir un mapa a los cofres, valida primero que el servidor lo cargue,
  que cumpla el alcance de dungeon y que tenga spawns normales en el índice;
  añádelo al atlas como `kind=dungeon`, regenera el atlas y los cofres y
  actualiza los totales. La receta completa, incluida la forma de validar el
  spawn aleatorio y la carga del script, está en
  [`my-mods/dungeon-chest/README.md`](./dungeon-chest/README.md#guía-agregar-un-cofre-a-otro-mapa).

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
  modos de juego cuando corresponda (el diseño y el balance son para Renewal;
  Pre-Renewal solo si sale barato, ver `CONVENTIONS.md`), y los personajes
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
  comportamiento, y su sección «Estado» (versión, qué se probó, problemas
  abiertos y fecha) al cambiarlo o probarlo.

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
