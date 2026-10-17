# Plan de mods de `my-mods/`

Plan de trabajo derivado de [`conceptsForMods.md`](./conceptsForMods.md) y del
contexto de [`README.md`](./README.md). Es una guía de diseño y orden de
trabajo, no una descripción del comportamiento actual: cada mod documenta lo
que ya hace en su propio README.

Las referencias a comandos de rAthena marcadas como *(verificar)* salen de
conocimiento general y deben comprobarse contra el rAthena fijado en
`config/VENDOR_PINS` antes de implementarlas.

## Decisiones tomadas

1. **Atlas del mundo como mod aparte** (`world-atlas`): solo datos y funciones
   de consulta, sin comportamiento propio.
2. **`bounty-hunt` y `expedition-board` se fusionan** en `expedition-board`,
   con dos tipos de contrato: caza de monstruo concreto y expedición a un
   punto. `bounty-hunt` (del registro) queda solo como referencia.
3. **Las heridas debilitan, no impiden jugar.** Se curan en posada (zeny) o
   templo (donación). Nunca bloquean el movimiento, el combate ni el acceso a
   una ciudad.
4. **Rates de EXP y drop: pendiente.** Se ajustan en Settings; no pueden
   cambiarse desde un mod. Se retoma si hace falta confirmar el mínimo
   permitido.
5. **Hilo de la partida: Reconstrucción (B) con Misterio (A) de fondo.** El
   jugador recupera rutas, refugios y servicios perdidos; por debajo corre la
   pregunta de por qué el clima y la niebla se volvieron anormales. El lore
   concreto se añade después sin cambiar las mecánicas.
6. **Las necesidades se pausan o se ralentizan en ciudad y posadas.** La
   presión existe cuando el jugador sale. Cambia el ritmo actual de `survival`.
7. **Diario del viajero como mod propio.**
8. **Némesis ligero:** un monstruo que mata al jugador vuelve con nombre y más
   fuerte en ese lugar, y deja un trofeo al vencerlo.

## Dirección de diseño: historia emergente para 1 o 2 jugadores

Objetivo: aprovechar que el juego es offline para que una o dos personas vivan
una aventura propia y la historia salga de lo que les pasa, no de largos
textos.

**Regla guía:** cada sistema debe provocar una decisión, no una obligación.
Evitar que hambre, sed, temperatura y heridas se vuelvan barras que vigilar.

- Premiar además de castigar: "bien alimentado" y "bien abrigado" dan un bono
  pequeño.
- Estados con nombre y umbrales en vez de números que bajan siempre.
- Nada de lo que debilite puede impedir jugar (decisión 3).

**Bucle central:** Rumor → Preparación → Salida → Presión → Decisión (seguir o
volver) → Regreso → Consecuencia que queda en el mundo.

**Cadena narrativa común** (un solo motor con distintos contenidos):

> Rumor (taberna) → Pista (mapa o cartógrafo) → Hallazgo (punto de interés,
> reliquia) → Consecuencia (reputación, ruta o servicio desbloqueado)

El tablero de contratos, la cartografía, los puntos de interés y las cadenas
de misiones comparten esta cadena.

**Lo que solo ofrece el modo offline:**

1. **Diario del viajero:** registro automático de hitos (primera vez en un
   bioma, heridas, marcas abatidas, descubrimientos, muertes) en el mod store,
   con ventana de cliente.
2. **Heridas con nombre** ("Cicatriz del lobo de Payon"), no solo un
   porcentaje.
3. **Némesis ligero** *(verificar si el evento de muerte de rAthena expone al
   asesino)*.
4. **El mundo recuerda:** NPC con saludos condicionales según el estado del
   personaje (herido, reputación, reliquias).
5. **Muerte con significado:** tumba con provisiones o zeny en el lugar de la
   muerte. Empezar sin equipo para no arriesgar pérdidas por errores.

**Dos jugadores:**

- Clases con utilidad real: Rogue desarma trampas, Hunter detecta, Priest
  purifica maldiciones, Mage identifica reliquias, Merchant regatea.
- Campamento compartido y recursos divisibles.
- Revisar `docs/COMPANIONS.md` para jugar solo con un compañero.

**Preparación como conocimiento:** un bestiario que se desbloquea cazando y con
pistas de cazadores en la taberna, como versión limitada de `ingame-database`.

**Atajos de regreso:** los pasadizos se abren como atajos solo desde el lado
profundo de la mazmorra, para que volver y seguir cambien de costo.

**Simplificaciones acordadas:**

| Ideas separadas | Se tratan como |
|---|---|
| Camping, campamentos permanentes, campamentos humanos, refugios | **Campamento** con niveles, mejorable con reputación y recursos |
| Trampas, pasadizos, puertas selladas, llaves, lámparas, cuerdas | **Obstáculo con requisito** (objeto, clase o conocimiento) |
| Reputación, descubrimientos, contratos | **Reconstrucción** de rutas y servicios |
| Servicios por ciudad | **Identidad de ciudad**: una especialidad y una debilidad por ciudad |

Identidad de ciudad, como ejemplo inicial: Payon caza y pieles; Morocc calor,
agua y ruinas; Geffen análisis de reliquias; Alberta mar, pesca y viajes. Cada
ciudad carece de algo que otra sí ofrece.

**Fuera de este ciclo:** durabilidad del equipo, cartografía con ventana propia
y mapas custom. Oficios: empezar solo con pesca y minería.

**Palanca de progresión:** los rates son tres ajustes (`base_exp_rate`,
`job_exp_rate`, `quest_exp_rate`). Si el EXP entregado por script se rige por
`quest_exp_rate` *(verificar)*, se puede bajar el EXP de combate y mantener
alta la recompensa de contratos y descubrimientos.

## Restricciones técnicas que condicionan el plan

| Hallazgo | Consecuencia |
|---|---|
| Los rates son ajustes de la app. `conf/` solo permite `char_conf.txt`, `groups.yml` y `atcommands.yml`. | Un mod no puede bajar los rates. La compensación (oficios, trofeos, cofres) sí vive en mods. |
| `bonus_script` no apila duplicados. | Un único controlador de penalización (el de `survival`) suma hambre, sed, temperatura y heridas. Los demás mods le publican variables de exposición, como `clima` con `@clima_*`. |
| Las funciones de NPC (`callfunc`) son globales entre mods. | El atlas se consulta con `callfunc` sin dependencia de carga fuerte. Hay que dar un valor por defecto si la función no existe. |
| Mod store (`modstore_*`) con alcance global, cuenta y personaje. Experimental desde 1.5.2. | Útil para oficios, reputación y descubrimientos. Aislado por mod: no sirve para compartir datos entre mods. |
| Lua solo engancha `skill()` e `item()`. | No hay durabilidad por objeto ni IA de monstruos vía Lua. |
| Mapas custom necesitan `.gat/.gnd/.rsw` (hay editor en la app). | Los pasadizos empiezan reutilizando mapas existentes; los mapas nuevos van tarde. |
| Un sprite de NPC mal escrito queda invisible sin error. | Validar cada sprite nuevo en el juego. |
| Los datos tabulares se generan desde CSV con un script en `registry/tools/<mod>/`; el mod entrega solo lo generado. | Aplica al atlas, tiers, recetas y servicios. |
| Los cambios de `db/` y `npc/` piden recargar mods; los de `client/` y `System/`, reiniciar la app. | Considerarlo al probar. |

## Mod `world-atlas` (Fase 0)

Tabla por mapa, generada desde un CSV:

| Campo | Uso |
|---|---|
| bioma | Riesgos, recursos, clima, temperatura |
| tier de peligro | Hoy vive en `dungeon-chest` |
| temperatura base | Temperatura, camping, comida |
| ciudad ancla | Tableros, servicios, reputación |
| recursos disponibles | Pesca, minería, leña, caza |
| agua cercana | Cantimplora |
| refugio / campamento | Camping permanente |

Expone funciones tipo `F_Atlas_Biome(map$)`, `F_Atlas_Tier(map$)`. Los mods que
la usen deben tener un valor de reserva si el atlas no está activo.

Primer trabajo: migrar el Tier de los 179 mapas de `dungeon-chest` al CSV del
atlas sin cambiar su comportamiento.

### Especificación inicial (versión 1 escrita en `my-mods/world-atlas/`, sin probar en el juego)

Migrados: `survival` (zonas seguras), `dungeon-chest` (Tier y recompensa),
`clima` (bioma → eventos) y `travel-journal` (nombre legible del mapa, columna
`name` del CSV y `F_Atlas_Name`; este último sin probar en el juego). Estado: el mod, el CSV (`registry/tools/world-atlas/atlas.csv`, 202 mapas) y el
script de build (Node) existen. Falta probarlo en el juego y la migración de
los demás mods. Lo que sigue es el borrador original; donde difiere, manda el
[README del mod](./world-atlas/README.md).

Es un borrador para arrancar la sesión del atlas; las decisiones marcadas como
abiertas se confirman al empezar.

**Punto de partida real.** Hoy no existe ningún CSV: el Tier de cada mapa está
escrito a mano dentro de las definiciones de cofres en
`my-mods/dungeon-chest/npc/dungeon-chests.txt`, y la tabla resumen y el
criterio (promedio ponderado de niveles de spawns Renewal, datos de
RateMyServer) están en `my-mods/dungeon-chest/README.md`. El primer paso es
extraer esos 179 mapas y sus Tiers a un CSV sin cambiar ningún valor.

**Alcance de la versión 1:**

- Las 7 ciudades principales (la misma lista de `survival`).
- Los mapas de campo y dungeon que ya usan `dungeon-chest`, `expedition-board`
  y `clima`.
- Los demás mapas devuelven un valor por defecto, no un error.

**Columnas del CSV (propuestas):**

| Columna | Valores |
|---|---|
| `map` | nombre interno del mapa, en minúsculas |
| `kind` | `city`, `field`, `dungeon`, `interior` |
| `biome` | `ciudad`, `pradera`, `bosque`, `selva`, `desierto`, `nieve`, `pantano`, `costa`, `montana`, `volcan`, `cueva`, `ruinas` (lista abierta) |
| `tier` | 0 para ciudades, 1 en adelante según el criterio de `dungeon-chest` |
| `temp` | temperatura base, escala por definir con el sistema de temperatura |
| `anchor` | ciudad ancla (mapa de la ciudad) |
| `water` | 0 o 1 |
| `rest` | 0 o 1, si hay refugio o campamento |
| `note` | texto libre |

**Funciones a exponer** (valor por defecto si el mapa no está): `F_Atlas_Kind`,
`F_Atlas_Biome`, `F_Atlas_Tier`, `F_Atlas_Temp`, `F_Atlas_Anchor` y
`F_Atlas_IsSafe(map$)`, que devuelve 1 para mapas `city` y sustituirá la lista
`.safe_maps$` de `survival`. Precedente en el repo: `dungeon-chest` ya declara
funciones globales `F_DungeonChest_*` y lee variables de otro NPC con
`getvariableofnpc`.

**Migración, en este orden y de a un mod por vez:**

1. `survival`: `.safe_maps$` pasa a `F_Atlas_IsSafe`.
2. `dungeon-chest`: el Tier sale del atlas. Comprobar que los 179 cofres
   conservan el mismo Tier y que los totales del README no cambian.
3. `clima`: bioma como entrada para elegir eventos.
4. `travel-journal`: nombres de lugares. La tabla `REGIONS` es del cliente y
   el atlas está en el servidor; resolver si el servidor manda el nombre en la
   entrada o si el script de build genera también un archivo para el cliente.

**Decisiones abiertas:**

- Dónde viven el CSV y el script de build. La convención del repo es
  `registry/tools/<mod>/`; en esta máquina no hay Python, pero sí Node, así que
  el script debería ser de Node.
- Cómo implementar la búsqueda en el script de rAthena (arrays por NPC,
  `setd`/`getd` o un NPC por mapa) sin que la lectura sea lenta con cientos de
  mapas.
- La lista final de biomas y la escala de temperatura.
- Si el atlas lleva nombres legibles de lugar además del código de mapa.

**Criterio de terminado de la versión 1:** el mod carga sin errores en el log
del map-server, las funciones devuelven los valores del CSV para los mapas
incluidos y un valor por defecto para uno desconocido, y `survival` y
`dungeon-chest` se comportan igual que antes de migrar.

## Fases

### Fase 0: cimientos

1. `world-atlas` con biomas y temperatura base.
2. Convención de variables compartidas: tabla en este directorio con el
   prefijo de cada mod y las variables que publica.
3. Preset de rates recomendado (pendiente, ver decisiones).
4. **`travel-journal` (diario del viajero):** mod propio. *Primera versión
   escrita en `my-mods/travel-journal/`, sin probar en el juego.* Guarda
   eventos en el mod store y los muestra en una ventana (Alt+J, botón o
   `@diario`). Los demás mods le publican entradas con
   `doevent "TravelJournal::OnLog"`; no depende de ellos.
5. **Pausa de necesidades en ciudad:** *hecho en `survival`* para los mapas
   exteriores de las siete ciudades principales, con lista editable
   (`.safe_maps$`). Los interiores se añaden cuando hagan falta. Pasará a leer
   la lista del atlas cuando exista.

### Fase 1: supervivencia completa

Sobre `survival` y `clima`, que ya existen.

- **Cantimplora en venta:** NPC que vende cantimploras (ya pendiente).
- **Temperatura:** tercer medidor con zona cómoda y dos extremos (frío y
  calor). Base por bioma, modificada por clima. Objetos que refrescan o
  calientan; ropa de abrigo como equipo. Evitar un cuarto medidor en pantalla:
  integrarla en los existentes o en un icono de estado.
- **Heridas y maldiciones:** `bonus_script` persistente *(verificar banderas
  de persistencia entre sesiones y de borrado al morir)*. Reducen HP/SP máximo
  o un atributo según el tipo. Origen: morir, trampas, monstruos concretos,
  clima extremo. Las pociones no las curan. Salen del controlador único.
- **Camping consumable:** estado "Descansando" con regeneración por ticks, que
  se rompe al moverse o atacar. No se crea un NPC temporal desde un objeto.
  Con temperatura, descansar junto al fuego da calor.
- **Objetos valiosos de un uso:** scrolls de teletransporte, invisibilidad, etc.
  Preferible como recompensa de cofres y contratos, no en venta.
- **Servicios por ciudad:** tabla ciudad × servicio en el atlas.

### Fase 2: recursos y economía

Compensa los rates bajos.

- **Oficios** (pesca, leñador, minería, peletero): no se pueden añadir a la
  ventana de habilidades sin tocar el cliente. Se implementan con herramientas
  (objetos), nodos de recurso (NPC fijos con recarga temporal) y nivel de
  oficio en el mod store, que sube por uso. Cada bioma tiene sus recursos.
- **Pesca primero:** reutiliza `checkcell cell_chkwater` como la cantimplora, y
  alimenta el sistema de saciedad.
- **Sumideros obligatorios** antes de poner nodos: herramientas que se
  gastan, comida, reparación, recetas. Sin ellos los recursos sobran.
- **Trofeos de caza:** drops en `db/mob_db.yml` y artesanos que los usan.
- **Preparación contra monstruos:** ajustar elemento y resistencias solo en
  monstruos de zonas de expedición. Estados vía habilidades de monstruo
  *(verificar si `mob_skill_db` es una tabla que un mod puede sobrescribir)*.

### Fase 3: ciudades y expediciones

- **Fusión de `bounty-hunt` en `expedition-board`:** dos tipos de contrato en
  el mismo tablero. Los tableros pueden pasar a tabernas.
- Dificultad por nivel, marcas con reglas propias (nocturnas, solo con niebla).
- **Contratos en cadena:** pista → zona → objeto que se analiza en ciudad →
  expedición final. Estado en el mod store.
- **Reputación regional** por personaje y ciudad: descuentos, guías, refugios,
  rutas seguras.
- **Descubrimientos permanentes:** un puente reparado o servicio desbloqueado
  es un warp o NPC que se activa por una marca en el mod store.
- **Reliquias únicas:** objetos que abren una interacción o ruta, no solo más
  ataque. Se diseñan junto con los pasadizos.

### Fase 4: exploración y mundo

- **Pasadizos:** NPC con área de contacto en celdas transitables junto a una
  pared y warp oculto *(verificar `HIDDEN_WARP_NPC` y `cloakonnpc` por
  personaje)*. Empezar con mapas existentes poco usados.
- **Trampas:** zonas de contacto con daño o estado, ligadas al tier de la
  mazmorra. Detección o desarme según clase (Rogue, Hunter, Assassin).
- **Objetos de mazmorreo:** lámparas (pase gráfico por mapa con
  `api.graphics.registerPass`), cuerdas, llaves de salas de jefe.
- **Cartografía:** versión mínima con objetos de mapa que descubren puntos de
  interés; versión completa con ventana propia (`api.ui.window`) y
  descubrimientos en el mod store.
- **Campamentos permanentes y humanos:** NPC fijos con servicios básicos,
  generados desde una plantilla y la tabla de servicios del atlas.
- **Puntos de interés y eventos únicos:** cadáveres con pistas, caravanas
  atacadas, criaturas guardianas. Narrativa en descripciones de objeto
  (`System/itemInfo.lua`) y NPC mudos, sin muros de texto.
- **Niebla con monstruos:** extensión pequeña de `clima`.
- **Rework de rutas:** variar lo que hay en cada ruta (monstruos, clima, hora)
  con `db/` y NPC, sin modificar la geometría. Cambiar mapas queda para el
  final.

### Fase 5: pulido

- **Botín real en `dungeon-chest`:** objetos de `clima` y equipo con afijos,
  extrayendo datos de `affix-forge` y `arpg-equipments`. Cuidado con
  conflictos de `item_db`: gana el último mod aplicado.
- **Némesis ligero:** si un monstruo mata al jugador, reaparece en ese lugar
  como versión con nombre y más fuerte, y deja un trofeo. Registrar el
  encuentro en el diario. Depende de poder identificar al asesino.
- **Durabilidad:** fuera de este ciclo. rAthena no la tiene por objeto; la
  opción sería un contador de desgaste por ranura con `breakequip`
  *(verificar)*. Rinde poco para su costo.
- **Compañeros:** revisar `docs/COMPANIONS.md` antes de inventar algo propio.

## Dependencias

```
world-atlas ──► clima ──► temperatura ──► survival (controlador único)
     │            │                           ▲
     │            └──► niebla + monstruos     │
     ├──► dungeon-chest ──► botín real        │ heridas
     ├──► expedition-board ──► reputación ──► reliquias
     └──► recursos ──► trofeos ──► artesanía ──► servicios por ciudad
```

## Orden de arranque recomendado

1. Pausa de necesidades en ciudad (cambio pequeño en `survival`).
2. `travel-journal`, primera versión.
3. `world-atlas`.
4. NPC que vende cantimploras.
5. Temperatura con ropa de abrigo.
6. Heridas con nombre, registradas en el diario.
7. Pesca.
8. Botín real en `dungeon-chest`.
9. Némesis ligero.

Resultado: un ciclo completo de preparar, salir, afrontar un riesgo, volver a
la ciudad por una razón y salir con algo mejor.

## Pendientes abiertos

- **`clima`: visual fijo por mapa.** El efecto visual lo fija `mod.json` y no
  sigue al evento, así que cada bioma solo sortea combinaciones con su mismo
  visual. Investigar cómo superarlo (plugin de cliente vía `server:event` o
  mapflags de rAthena, ninguno verificado). Ver «Limitación conocida» en el
  README de `clima`.
- **`clima` sin probar en el juego** tras pasar a asignación por bioma.
- **`expedition-board` 0.6.0 (marcas, cacerías, Intendente, crédito en grupo y cacerías de Tier 2), probado a medias.** Funciona en Prontera con la
  marca (aceptar, abatir, cobrar en el tablero) y el refuerzo por Tier se nota. Sin probar: las cacerías, el crédito compartido en grupo (necesita dos personajes), las cacerías de Tier 2 (ids 15 a 21), el
  Intendente (las marcas ahora se entregan con él, no en el tablero), las marcas nuevas (nivel acorde al mapa
  desde la 0.5.0) y la nota de «contrato aceptado» del diario. Falta probar las otras seis
  ciudades (posiciones de tableros y marcas), los casos límite del README y
  el escalado de zeny en Tier 2 o más. El error de carga original (`abs()`) quedó
  resuelto: el log ya no lo muestra.
- **`player's event queue is full`** (afecta a `survival` y a `travel-journal`;
  sin resolver, investigar en otra sesión). Log del map-server, 2026-10-17:
  `npc_event: player's event queue is full, can't add event
  'TravelJournal::OnMapTick'` y lo mismo para `survival_mgr::OnPenaltyTick`
  (antes, en otra sesión, para `OnHungerTick` y `OnThirstTick`).
  - **Cuándo:** justo después de `'Karsa' logged in`, al entrar al mapa
    `mjolnir_12` (un campo, no una ciudad), antes de cualquier otro evento.
    El personaje ya traía la cola llena al iniciar sesión.
  - **Descartado:** que sea por las zonas seguras. `OnHungerTick` y
    `OnThirstTick` vuelven a llamar a `addtimer` siempre; `F_Survival_IsSafe`
    solo decide si baja el valor. Tampoco los demás mods activos de `my-mods/`
    (`clima`, `dungeon-chest`, `expedition-board`, `world-atlas`) usan `addtimer`.
  - **Contexto:** `survival` pone 3 temporizadores por jugador (hambre, sed,
    penalización) y `travel-journal` 1; la cola de rAthena guarda unos 32
    (`MAX_EVENTTIMER`, sin verificar contra el fork). Cuatro no llenan 32, así
    que algo los está acumulando.
  - **Hipótesis sin comprobar:** `OnPCLoginEvent` corre varias veces por
    sesión, o `deltimer` no borra el temporizador anterior, o hay otro mod
    (`common-npcs`, `mobile-ui`, `wasd-movement`, del registro) que programe
    eventos al entrar.
  - **Diagnóstico temporal ya puesto** (2026-10-17), todo marcado `[qdebug]` y
    con un comentario «TEMPORAL … Quitar» en `survival/npc/survival.txt` y
    `travel-journal/npc/travel-journal.txt`: cada login y logout deja una línea
    con el número de veces que corrió y el personaje, y cada tick avisa
    `… tick DUPLICATE` si el mismo tick llega antes de lo debido (señal de
    temporizadores duplicados; máximo 20 avisos por personaje y sesión). Tras la
    sesión de pruebas: `ragnarok-stack logs map 20000 | grep qdebug`.
    - Si `login #` sube de 1 en una misma sesión: `OnPCLoginEvent` corre más de
      una vez.
    - Si hay `DUPLICATE`: `deltimer` no borra el temporizador previo (o se
      programa de más).
    - Si no sale ni lo uno ni lo otro, la cola se llena por otra causa (otro mod
      del registro, que habrá que buscar).
    - Al terminar, **borrar** las líneas `[qdebug]` (buscar `qdebug` en ambos
      archivos). Si `deltimer` falla, cambiar a un solo temporizador que
      reprograme el resto.
  - **Efecto:** a ese personaje le dejan de llegar entradas del diario y los
    ticks de hambre, sed y penalización. Las notas de `expedition-board`
    (`doevent`) no pasan por esa cola.
- Mínimo permitido de rates en Settings y preset recomendado.
- Verificar los puntos marcados *(verificar)* contra el rAthena fijado.
- Verificar si el evento de muerte de rAthena identifica al asesino (némesis).
- Verificar si `getexp` desde script se rige por `quest_exp_rate`.
- Lore del misterio de fondo: se añade después; las mecánicas no dependen de él.
- Decidir dónde viven los CSV y scripts de build (`registry/tools/<mod>/`).
