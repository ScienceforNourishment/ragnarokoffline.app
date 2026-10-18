# Catálogo de diseño de `my-mods/`

Qué sistemas queremos y cómo deberían funcionar. No dice en qué orden se hacen
ni qué está decidido; para eso:

| Documento | Contiene |
|---|---|
| [`DECISIONS.md`](./DECISIONS.md) | lo decidido, con fecha (manda sobre este) |
| [`ROADMAP.md`](./ROADMAP.md) | hitos, orden, estado de los mods y errores abiertos |
| [`CONVENTIONS.md`](./CONVENTIONS.md) | IDs, nombres, eventos, regla de grupo y restricciones técnicas |
| [`MODPACK.md`](./MODPACK.md) | qué mods y Settings forman la partida |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | límites de la plataforma: clima eventual, día y noche, rendimiento |
| [`ADVENTURE.md`](./ADVENTURE.md) | expediciones y experiencias: la columna vertebral |
| [`BALANCE.md`](./BALANCE.md) | presión y alivio de los sistemas de supervivencia |

Las ideas originales siguen en [`conceptsForMods.md`](./conceptsForMods.md).
Cada mod documenta en su README lo que ya hace. Las referencias marcadas como
*(verificar)* deben comprobarse contra el rAthena fijado en
`config/VENDOR_PINS` antes de implementarlas.

## Dirección de diseño: historia emergente para 1 o 2 jugadores

Objetivo: aprovechar que el juego es offline para que una o dos personas vivan
una aventura propia y la historia salga de lo que les pasa, no de largos
textos. Todo ocurre **durante la subida de nivel** (D3): no hay un «juego de
verdad» reservado al nivel máximo.

**Regla guía:** cada sistema debe provocar una decisión, no una obligación.
Evitar que hambre, sed, temperatura y heridas se vuelvan barras que vigilar.

- Premiar además de castigar: "bien alimentado" y "bien abrigado" dan un bono
  pequeño; estar "En forma" sube la EXP de la expedición
  ([`BALANCE.md`](./BALANCE.md#lo-positivo)).
- Estados con nombre y umbrales en vez de números que bajan siempre.
- Nada de lo que debilite puede impedir jugar (D15).
- Revisión de 2026-10-17: hoy los mods castigan mucho más de lo que premian, y
  sus castigos se suman sin tope. Corregirlo va antes que añadir sistemas.

**Bucle central:** Rumor → Preparación → Salida → Presión → Decisión (seguir o
volver) → Regreso → Descanso (contar los relatos) → Consecuencia que queda en
el mundo.

Hoy faltan los dos extremos del bucle: el **Rumor** (no hay tabernas ni
pronóstico, así que la preparación es a ciegas) y la **Consecuencia que queda
en el mundo** (nada de lo que hace el jugador cambia el mundo). `adventure` da
el porqué de salir y volver; `tavern-rumors` y `refuges` cierran los extremos.

**Cadena narrativa común** (un solo motor con distintos contenidos):

> Rumor (taberna) → Pista (mapa o cartógrafo) → Hallazgo (punto de interés,
> reliquia) → Consecuencia (reputación, ruta o servicio desbloqueado)

El tablero de contratos, la cartografía, los puntos de interés y las cadenas
de misiones comparten esta cadena.

**Lo que solo ofrece el modo offline:**

1. **Diario del viajero:** registro automático de hitos, resúmenes de
   expedición y relatos, dentro de `adventure` (D12).
2. **Heridas con nombre** ("Cicatriz del lobo de Payon"), no solo un
   porcentaje.
3. **Némesis ligero** (D17): `OnPCDieEvent` expone al asesino en `killerrid`.
4. **El mundo recuerda:** NPC con saludos condicionales según el estado del
   personaje (herido, reputación, reliquias, relatos contados).
5. **Muerte con significado:** tumba con provisiones o zeny en el lugar de la
   muerte. Ver también qué cuesta morir en
   [`ADVENTURE.md`](./ADVENTURE.md#morir-y-las-cicatrices).

**Dos jugadores** (regla común en
[`CONVENTIONS.md`](./CONVENTIONS.md#regla-común-de-grupo)):

- Clases con utilidad real: Rogue desarma trampas, Hunter detecta, Priest
  purifica maldiciones, Mage identifica reliquias, Merchant regatea.
- Campamento compartido y recursos divisibles.
- Botín de cofre para cada miembro del grupo cercano, no solo para quien abre.
- Curarse entre compañeros: un Acólito o Priest del grupo cura maldiciones.
- Experiencias compartidas: `adventure` las da a los del grupo en el mismo
  mapa.
- Contratos que piden **dos roles** (uno distrae, otro desarma o recoge).
- Para jugar solo: `companion-party-overhaul` del registro, a evaluar
  ([`MODPACK.md`](./MODPACK.md)). Referencia: `docs/COMPANIONS.md`.

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

**Identidad de ciudad**, como ejemplo inicial: Payon caza y pieles; Morocc
calor, agua y ruinas; Geffen análisis de reliquias; Alberta mar, pesca y
viajes. Cada ciudad carece de algo que otra sí ofrece. Con D2 entran todas las
ciudades, islas incluidas; cada una recibe su identidad al llegar su región
([`ROADMAP.md`](./ROADMAP.md#h3-expansión-por-regiones)).

Primeras aplicaciones concretas, con lo que ya existe:

- **Ropa de `temperature` repartida:** capas de piel en Payon, túnicas frescas
  en Morocc, abrigo de lana en Aldebaran (frente a Lutie). Hoy el único Sastre
  está en Prontera.
- **Servicios en interiores reales:** el Posadero de `wounds` en la posada de
  cada ciudad (`prt_in` y equivalentes), el Sacerdote en su iglesia
  (`prt_church`…), la futura taberna en un interior. Hoy están todos a unas
  celdas del tablero de `expedition-board`, lo que contradice «no todo junto».
  Las de Prontera e Izlude, sacadas del índice de NPC, están en la columna
  `note` del atlas; comprobarlas en el juego.

**Fuera de este ciclo:** durabilidad del equipo, cartografía con ventana propia
y mapas custom. Oficios: empezar solo con pesca y minería.

## Áreas de diseño

Agrupadas por tema, sin orden de trabajo (el orden está en
[`ROADMAP.md`](./ROADMAP.md)).

### Progresión

- **Experiencias y expediciones** (`adventure`): ver
  [`ADVENTURE.md`](./ADVENTURE.md). Rates a 1x (D8): las experiencias se suman
  a la EXP de monstruos; su peso se mide en la porción vertical.
- **Curva de progresión:** banda de nivel × región × ciudad base × biomas ×
  preparación × experiencias. Frente abierto en
  [`ROADMAP.md`](./ROADMAP.md#frentes-abiertos).
- **Rebalanceo del mundo** (D3): monstruos y MVPs de cada región ajustados a
  su banda, para que todo el contenido se viva durante la subida. Vive en mods
  (`db/mob_db.yml` y relacionados), generado desde datos por región, no a
  mano. Incluye decidir qué hacer con el contenido de nivel máximo (MVPs y
  mazmorras de 175 o más).
- **Saberes y rasgos:** skills y maestrías que se ganan viviendo
  ([`ADVENTURE.md`](./ADVENTURE.md#saberes-skills-que-se-desbloquean-viviendo)).

### Supervivencia

Sobre `survival`, `clima`, `temperature` y `wounds`, que ya existen.

- **Rebalanceo de presión** ([`BALANCE.md`](./BALANCE.md)): ejes distintos por
  sistema, escalones con aviso, tope con `@pr_*`, estados positivos (Bien
  alimentado, Hidratado, En forma, Descansado) y presión que crece con el Tier.
- **Pronóstico del clima:** saber qué viene antes de salir, para que el clima
  sea preparación y no mala suerte.
- **Temperatura:** existe en `temperature/`. Faltan los
  consumibles que abrigan o refrescan.
- **Heridas y maldiciones:** existe en `wounds/` (origen: morir).
  Más adelante: casi morir, trampas, monstruos concretos y clima extremo. Las
  pociones no las curan.
- **`campfire`:** ver «Mods nuevos propuestos».
- **Niebla con monstruos:** extensión pequeña de `clima`; evento raro con más
  recompensa, no solo más riesgo.
- **Objetos valiosos de un uso:** scrolls de teletransporte, invisibilidad,
  etc. Como recompensa de cofres y contratos, no en venta.

### Recursos y economía

La economía está abierta ([`DECISIONS.md`](./DECISIONS.md#abiertas)). No
añadir pesca ni minería antes de tener sumideros: cocinar en `campfire` y los
materiales de `refuges` lo son.

- **Recompensas reales para contratos y cofres:** trofeos con nombre de las
  marcas, botín de cofre por **bioma** (equipo de abrigo en mazmorras de hielo,
  ropa fresca en las de desierto), además de por Tier.
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

### Ciudades y expediciones

- **Contratos** (`expedition-board`, D14): marcas y cacerías. Los tableros
  pueden pasar a tabernas.
- Dificultad por nivel, marcas con reglas propias (nocturnas, solo con niebla).
- **Contratos en cadena:** pista → zona → objeto que se analiza en ciudad →
  expedición final. Estado en el mod store.
- **Reputación regional** por personaje y ciudad: descuentos, guías, refugios,
  rutas seguras.
- **Descubrimientos permanentes:** un puente reparado o servicio desbloqueado
  es un warp o NPC que se activa por una marca en el mod store.
- **Reliquias únicas:** objetos que abren una interacción o ruta, no solo más
  ataque. Se diseñan junto con los pasadizos.
- **Servicios por ciudad:** tabla ciudad × servicio en el atlas.

### Exploración y mundo

- **Pasadizos:** NPC con área de contacto en celdas transitables junto a una
  pared y warp oculto *(verificar `HIDDEN_WARP_NPC` y `cloakonnpc` por
  personaje)*. Empezar con mapas existentes poco usados.
- **Trampas:** zonas de contacto con daño o estado, ligadas al Tier de la
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
- **Rework de rutas:** variar lo que hay en cada ruta (monstruos, clima, hora)
  con `db/` y NPC, sin modificar la geometría. Cambiar mapas queda para el
  final.

### Botín y equipo

- **Botín real en `dungeon-chest`:** objetos de `clima` y `temperature` por
  bioma, y equipo con afijos extrayendo datos de `affix-forge` y
  `arpg-equipments`. Cuidado con conflictos de `item_db`: gana el último mod
  aplicado.
- **Durabilidad:** fuera de este ciclo. rAthena no la tiene por objeto; la
  opción sería un contador de desgaste por ranura con `breakequip`
  *(verificar)*. Rinde poco para su costo.

### Clima y luz

- **Clima eventual:** que el visual empiece y termine con el evento de `clima`.
- **Día y noche:** reloj en el servidor (efectos de juego) y luz en el cliente
  (transición suave, lámparas encendidas de noche).

Diseño y límites en [`ARCHITECTURE.md`](./ARCHITECTURE.md).

### Interfaz

- **Un panel de estado del viajero** en vez de un widget por mod: necesidades,
  temperatura, heridas, presión y expedición en curso. Qué se ve siempre, qué
  solo al cambiar y qué en el diario.
- **Ventana del diario con pestañas** (Diario, Relatos, Saberes, Rasgos),
  dentro de `adventure`.
- **Tutorial:** cuando la experiencia esté completa (D20).

## Mods nuevos propuestos

Por orden de impacto. Ninguno existe todavía. Rangos de IDs y prefijos en
[`CONVENTIONS.md`](./CONVENTIONS.md).

1. **`adventure`**: expediciones y experiencias; la EXP sale de vivir cosas por
   primera vez. Absorbe a `travel-journal` (D12). Diseño en
   [`ADVENTURE.md`](./ADVENTURE.md).
2. **`nemesis`**: el monstruo que te mató vuelve con nombre ("Wolf, el que mató
   a Karsa"), más fuerte, en ese mapa, y deja un trofeo. Vencerlo cura su
   cicatriz y es una experiencia Mayor. Usa `killerrid` como `wounds`.
3. **`campfire`**: leña o un kit de un uso dan el estado Descansando
   (regeneración, temperatura a Cómodo); junto al fuego se **cocinan** trofeos
   y alimentos para obtener comida con buff, y una venda mejora una herida. Con
   el compañero al lado, el efecto es compartido. En mapas con `rest=1` del
   atlas, un campamento mejor. Una fogata de `campfire` en el campo **no**
   sirve para contar relatos (D10).
4. **`refuges`** (Reconstrucción, el hilo B): refugios en ruinas en los campos
   que se restauran entregando materiales y trofeos. Restaurados quedan para
   siempre: descanso, un vendedor, a veces un atajo. Estado en el mod store;
   el NPC visible por personaje con `cloakonnpc` *(verificar el alcance por
   personaje)*. Es la «Consecuencia que queda en el mundo». Su fogata es el
   único lugar fuera de la ciudad donde se cuentan los relatos (llama a
   `Adventure::OnRest`).
5. **`tavern-rumors`**: una taberna por ciudad, en un interior. Rumores que
   alimentan el pronóstico del clima, pistas del bestiario (qué elemento usar
   contra la próxima marca) y dónde hay puntos de interés o un némesis. Es
   también lugar de descanso para contar los relatos. Barato: solo publica
   datos de otros mods.
6. **`remnants`** (restos y lore), generados desde un CSV: cadáveres de
   aventureros con una nota de una o dos líneas, objetos cuya descripción en
   `itemInfo.lua` cuenta el misterio de la niebla, NPC mudos. Incluye la
   tumba con tus provisiones en el lugar de la muerte *(verificar
   `duplicatenpc` en el rAthena fijado)*. Depende de `LORE.md`.
7. **Encuentros en el camino**: al entrar en un campo (`loadevent`), un sorteo
   según el bioma: caravana atacada, mercader errante, emboscada. Sin
   temporizadores.

## Dependencias

```
world-atlas ──► clima ──► temperature ─┐
     │            │                     ├─► @pr_* (tope de presión, sin controlador único)
     │            └──► niebla           │
     ├──► survival ────────────────────┤
     ├──► wounds ──────────────────────┘
     │
     ├──► adventure ◄── doevent "Adventure::OnExperience" ── dungeon-chest,
     │       │                expedition-board, clima, temperature, wounds,
     │       │                nemesis, refuges, remnants
     │       │        ◄── doevent "Adventure::OnRest" ── wounds (posada),
     │       │                tavern-rumors, refuges
     │       ├──► diario (antes travel-journal): entradas, resúmenes, relatos
     │       │       ◄── doevent "TravelJournal::OnLog" ── expedition-board, wounds
     │       └──► rasgos adv_trait_* ──► temperature, wounds, survival
     │
     ├──► dungeon-chest ──► botín por bioma
     ├──► expedition-board ──► trofeos ──► campfire (cocinar) ──► refuges
     └──► tavern-rumors ◄── clima (pronóstico), expedition-board, nemesis
```

## Historia: `world-atlas`

El atlas empezó como la Fase 0 de este plan: extraer a un CSV los Tiers de los
179 mapas de `dungeon-chest` sin cambiar su comportamiento, y exponer funciones
`F_Atlas_*` con valor por defecto. Está hecho (su estado, en su README):
CSV en `registry/tools/world-atlas/atlas.csv` con 206 mapas, script de build en
Node, y `survival`, `dungeon-chest`, `clima` y `travel-journal` ya migrados.
Lo vigente está en su [README](./world-atlas/README.md); el borrador original,
en el historial de git de este archivo.
