# Sesión de prueba

Guion de lo que **queda por probar en el juego**, sacado de la sección «Estado»
de cada README (revisado el 2026-10-26). Lo ya probado no está aquí: está en el
«Estado» de cada mod, y los guiones anteriores siguen en el historial de git.

Si este guion y un README no coinciden, manda el README. Marca cada caso al
hacerlo, apunta lo que no coincida en la tabla del final y, al terminar, pasa
los resultados a «Estado» y borra los pasos hechos.

## Antes de entrar

La sesión del 2026-10-26 encontró dos fallos, arreglados en estas versiones
y **sin instalar todavía**:

| Mod | Versión | Qué trae |
|---|---|---|
| `dungeon-chest` | 0.7.1 | el cofre ya no se traba al dar un objeto del bioma (`rand(0, 0)` en `prt_sewb1`) |
| `adventure` | 0.6.0 | `mod.json` declara `renewalFolder` (0.4.1: sin él, los logros no llegaban al servidor); publica los relatos contados (`adv_told$`) para las cadenas (0.5.0); nuevo: el relato de cambio de clase (0.6.0, sección 2) |
| `tavern-rumors` | 0.4.0 | nuevo: el rumor de un alijo, cerca o lejos (sección 5), y las dos cadenas de rumores (secciones 6 y 7); trae `System/` |
| `world-atlas` | 0.2.2 | la lista de campos que usa el alijo lejano; sin cambios de datos |

Las demás versiones ya están instaladas: `temperature` 0.5.2, `refuges`
0.1.2, `expedition-board` 0.8.0, `nemesis` 0.3.0 y el resto.

- [ ] Reemplaza la carpeta entera de `adventure`, `dungeon-chest`, `world-atlas` y
      `tavern-rumors` (copiar
      encima no quita archivos viejos), recarga los mods, **reinicia la
      aplicación** y mira `ragnarok-stack logs map 200`: sin errores de
      nuestros mods ni `Duplicate unique name`, y **`Loading '16' entries in
      'db/import/achievement_db.yml'`** (el 2026-10-26 salió sin entradas).
      El único error esperado es `Companion Recruiter`, del Population
      Engine.

**Rates (D8):** `quest_exp_rate` ya está a 1x, pero `base_exp_rate`,
`job_exp_rate` y los drops siguen a **50x** en Settings. Para estas pruebas da
igual; para medir el balance de H1 tienen que estar a 1x.

**Personaje:** `tester` / `tester123`, con comandos de GM. No uses la cuenta
`ragnarok`: el cliente la dibuja siempre como GM. Para los logros (parte 3)
hace falta **otro personaje nuevo**: el del 2026-10-26 ya contó sus relatos
Mayores sin que los logros existieran, y no los recibe.

**Ruido conocido en el log:** pares de `itemdb_search: Item ID 55000 / 55001
/ 56000 does not exists` (objetos de `arpg-equipments`, apagado, que quedaron
en algún personaje) y los `[wddebug]` de `wounds` (diagnóstico a propósito).

| Comando | Qué hace |
|---|---|
| `@temperatura` | estado de temperatura y su desglose |
| `@presion` | presión de cada sistema, total y si actúa el tope |
| `@relatos` | expedición en curso y relatos sin contar |
| `@cofre [mapa]` | te lleva junto al cofre del mapa (GM); `aqui`, `cerrar`, `mover` |
| `@heridas` | heridas actuales |
| `@herida <id>` | da una herida (GM); `@herida 0` las quita |
| `@zeny <n>`, `@item <id> <n>` | dan zeny y objetos (GM) |

## 1. Iconos de frío y calor (`temperature` 0.5.2)

Con la 0.5.1 los dos iconos salían, pero **no se apagaban** al salir del
mapa: el cliente perdía el paquete que los quita mientras cargaba el mapa
nuevo. Ahora, con el mapa nuevo cargado, `temperature` vuelve a apagar el
icono del mapa anterior (puede parpadear 1 s antes de irse). Detalle en
«Estado» de [`temperature`](./temperature/README.md#estado). Sin ropa de
abrigo ni fresca, y con un personaje **sin** Hecho al frío ni Hecho al calor
(con ellos, Fresco y Cálido no sacan icono):

- [ ] En Prontera, `@warp moc_fild11`: `@temperatura` dice Acalorado (2) o
      Sofocado (3), y el icono de calor sale entre 4 y 8 s después de que el
      mapa se vea.
- [ ] Vuelve a Prontera: el icono de calor se va en unos 8 s o menos tras
      cargar el mapa.
- [ ] `@warp xmas_fild01`: sale el de frío; vuelve a Prontera: se va igual.
- [ ] De `xmas_fild01` a `moc_fild11` sin pasar por una ciudad: el de frío se
      apaga y el de calor sale en 8 s o menos tras cargar el mapa. Y al
      revés.
- [ ] Si alguno se queda, apunta de qué mapa a qué mapa y cuánto tardó en
      cargar.

## 2. Lo que quedó de `adventure` 0.3

Detalle en «Probar la 0.3» del
[README de `adventure`](./adventure/README.md#probar-la-03).

- [ ] **MVP** (necesita un personaje fuerte; se puede dejar para otra
      sesión): `@monster` un MVP y abátelo: «Abatí a …». Otro de la misma
      especie: nada.
- [ ] **Ajustes** (opcional; devuélvelos después): `adventure` →
      `pct_minor` a 8: un mapa nuevo vale el doble en la pestaña Relatos.
      `streak_step` a 0: la cabecera ya no dice «racha».
- [ ] `survival` → `need_seconds` a 5: hambre y sed bajan mucho más deprisa.
- [ ] **Cambio de clase** (`adventure` 0.6.0), con un personaje nuevo:
      en Novice, `@jobchange 1` (Swordman) y cambia de mapa: «Nuevo relato:
      Me convertí en Swordman». `@relatos` lo lista; el Cronista lo paga
      como Hito (pestaña Relatos, ~50 % de nivel). `@jobchange 0` y de nuevo
      `@jobchange 1`: nada (ya lo tenías), y volver a Novice tampoco da
      relato. `@jobchange 7` (Knight) **junto al Cronista**, sin cambiar de
      mapa: hablarle ya lo cuenta. Un personaje que ya era de 1.ª clase
      antes de instalar la 0.6.0 no gana nada al entrar.

## 3. Logros y objetos del bioma (`adventure` 0.4.1, `dungeon-chest` 0.7.1)

El detalle está en «Probar la 0.4» del
[README de `adventure`](./adventure/README.md#probar-la-04) y en «Botín de
equipo» del de [`dungeon-chest`](./dungeon-chest/README.md#botín-de-equipo).

**Logros** (con un personaje nuevo)

- [ ] Al cargar, el log dice `Loading '16' entries in
      'db/import/achievement_db.yml'` y ningún `Reward ... does not exist`.
- [ ] Alt+K: los logros nuevos en Aventura → Rune Midgarts y Mazmorra,
      Batalla → Entrenamiento y Duelo y Memorial → Midgard, cada uno con su
      disfraz, y los de serie siguen ahí.
- [ ] El relato del Tier 1 no completa el logro al ganarlo, sino al contarlo
      con el Cronista: sale «< Primer paso en Tier 1 > achieved.». Ningún
      `Achievement '9010xx' doesn't exist` en el log.
- [ ] El botón de recompensa manda el Adventurer's Hat por correo.
- [ ] El primer cofre de un Tier y un MVP: su logro al contarlos. Un segundo
      MVP de otra especie no da otro.

**Objetos del bioma** (10 % de las aperturas; con `@cofre`, abrir y
`@cofre cerrar` hasta que salga)

- [ ] En `prt_sewb1` (cueva, un solo objeto: es el caso que se trababa):
      abrir el cofre unas 20 veces sin que el diálogo se quede colgado, y
      ningún `buildin_rand` en el log. Cuando toque: «…encuentras ropa hecha
      para este lugar, sin identificar.»; con la Lupa, la Máscara de Gas
      Etéreo.
- [ ] En `xmas_dun01` (nieve, Tier 1): la Armadura Horno, la Capa de Piel o
      el Chaleco de Lana.

## 4. Trofeos de caza (`expedition-board` 0.8.0, `nemesis` 0.3.0, `dungeon-chest` 0.7.1)

Todo sin probar (D40). El detalle está en «Trofeos y marcas de élite» del
[README de `expedition-board`](./expedition-board/README.md#trofeos-y-marcas-de-élite).
Para no esperar 12 horas entre trofeos del mismo contrato, pon
`expedition-board` → `trophy_hours` a 0 y pulsa Apply; devuélvelo a 12 al
terminar.

**Trofeo de marca**

- [ ] Acepta «Rastro en el campo sur» en Prontera y abate la marca en
      `prt_fild08`: «Expedicion: te llevas 1 Raiz de marca.» (Boiled Rice es
      planta). Cóbrala con el Intendente.
- [ ] Equípala como accesorio: la descripción dice +10 % contra plantas, y
      a un Poring (planta) se le hace algo más de daño que sin ella.
- [ ] Con `trophy_hours` en 12, repite el contrato: al abatirla, «ya te dio
      su trofeo hace poco» y sin trofeo.
- [ ] Con el peso casi lleno: «el Intendente te lo guarda», y te lo da al
      cobrar.

**Marca de élite**

- [ ] Con una Raíz de marca, habla con el Intendente de Prontera sin
      contrato: ofrece «[Elite] La flor del laberinto», pide 1 Raiz de marca
      y dice cuántas llevas. Sin ninguna, no da el contrato.
- [ ] Acéptalo: se gasta la Raíz y aparece «Marca de elite» (una Flora) en
      `prt_maze03`, bastante más dura que una marca normal.
- [ ] Abátela: 2 Raiz de marca y el relato «Abatí la marca de élite: La flor
      del laberinto»; se cobra con el Intendente (zeny y un Yggdrasil Berry).
- [ ] El tablero no lista los contratos de élite.

**Coleccionista** (`prontera 157,187`; el de verdad en `payon 180,104`)

- [ ] «Colgar un trofeo» con una Raíz de marca: «Defensa contra la raza
      Planta: 0% -> 1%». «Ver mi pared» lo dice.
- [ ] Sal y vuelve a entrar, y muere y reaparece: la defensa sigue (un Poring
      te quita algo menos; difícil de ver con 1 %, mejor con
      `collector_mark` a 10 para la prueba).
- [ ] Con el tope (`collector_cap`) alcanzado, no deja colgar más de esa raza.

**Talismán de némesis**

- [ ] Deja que un monstruo te mate en un campo (con herida de `wounds`) y
      vence a tu némesis: «Recibes … un talisman con tu nombre grabado: +12% de
      dano contra su raza y algo de la herida que te dejo». Con la Lupa no hace
      falta: llega identificado. Sus afijos: ATK y MATK +12 % contra su raza y
      el atributo de la herida.
- [ ] El talismán no se acepta como prueba en el Intendente, pero sí en el
      Coleccionista (+2 %).

**Engarce** (Herrero de Afijos, `prontera 155,187`)

- [ ] «Engarzar un trofeo de caza» con una Raíz de marca y una pieza
      identificada: elige ATK contra Planta; la pieza gana «ATK +5% contra la
      raza Planta» y la Raíz se gasta. Con un talismán, +8 %.
- [ ] Los trofeos no salen como pieza en «Pasar todos», «Quitar» ni
      «Volver a sortear».

## 5. El rumor de un alijo (`tavern-rumors` 0.4.0, `world-atlas` 0.2.2)

Todo sin probar. El detalle está en «El rumor de un alijo» del
[README de `tavern-rumors`](./tavern-rumors/README.md#el-rumor-de-un-alijo).
Desde la 0.4.0 el alijo va a **tierras lejanas** (D45), pero el ajuste
`find_nearby` viene **encendido** para las pruebas y lo deja en los campos
de Prontera: los pasos de abajo valen tal cual. Esta prueba confirma que
la mecánica funciona (rumor, pista, colocar el alijo, persistir). Al final,
el paso F prueba el modo lejano.

**Preparación**

- `tavern-rumors` 0.2.0, `dungeon-chest` 0.7.1, `world-atlas` y `adventure`
  activos. `tavern-rumors` → `find_rounds` en 3 (por defecto).
- Un personaje de nivel 1–39 (el precio depende de la banda), sin rumor
  pendiente y con **menos de 600 zeny** al empezar (`@zeny` con un número
  negativo para bajar). Ten a mano un papel para apuntar el campo y el punto
  que te dé el Tabernero.
- Tabernero: `@warp prt_in 177 22`; está detrás de la barra, en `180,23`.

**A. Carga**

- [ ] `ragnarok-stack logs map 200` tras recargar los mods: sin errores de
      `tavern-finds.txt` ni de `tavern-rumors.txt`, y sin
      `Duplicate unique name` de `Alijo#tr` ni `tavern_finds`.

**B. Comprar el rumor**

- [ ] **Sin zeny bastante:** «Preguntar por algo escondido» dice el precio,
      **600 zeny**. «Pagar» → «Con eso no llega…», y el zeny no cambia.
      «Mejor no» vuelve al menú sin cobrar.
- [ ] `@zeny 5000`. Pregunta otra vez y paga: el zeny baja exactamente 600 y
      dice «Se habla de un alijo en Campo de Prontera NN (por Prontera), a
      pocos pasos de (x, y).». **Apunta el campo y el punto.**
- [ ] **Repetir gratis:** pregunta otra vez. «Lo que te conté sigue en pie:
      …» con el mismo campo y el mismo punto, y el zeny no cambia.
- [ ] `@diario`: hay una nota «El Tabernero me habló de un alijo en …».
- [ ] El resto del menú sigue igual: «Preguntar por el tiempo» cobra una
      ronda (200) y «Sentarme a contar lo vivido» sigue apareciendo.

**C. Buscar y abrir**

- [ ] Ve a ese campo **andando o con la Kafra**, no con `@warp` directo al
      punto: así se ve si la pista basta para orientarse. En el campo, `/where`
      da tu celda. A 8 celdas o menos del punto (en cada eje) hay un cofre
      llamado «Alijo». Anota cuánto tardaste en encontrarlo desde que
      entraste en el campo.
- [ ] Háblale: «Bajo unas piedras, donde decía el rumor…». «Dejarlo» cierra
      sin dar nada y el alijo sigue ahí.
- [ ] Ábrelo: «Dentro hay un arma / una pieza de armadura… sin identificar.
      Una Lupa dirá qué es y qué guarda.». La pieza está en el inventario,
      sin identificar; con la Lupa, sus afijos son de Tier 1 o 2 (los de
      `prt_fild11` son de Tier 2).
- [ ] Al cerrar el diálogo, el alijo **desaparece** y el chat dice «Nuevo
      relato: Encontré el alijo del rumor en Campo de Prontera NN.».
      `@relatos` lo lista sin contar; `@diario`, la nota del hallazgo.
- [ ] Vuelve a la taberna: «Preguntar por algo escondido» ofrece un rumor
      **nuevo** y vuelve a cobrar 600.
- [ ] «Sentarme a contar lo vivido»: entre los relatos contados está el del
      alijo, y sube la EXP.

**D. Persistir**

- [ ] Compra otro rumor y **no vayas todavía**. Sal al menú de personajes y
      vuelve a entrar: el Tabernero repite el mismo campo y punto.
- [ ] Reinicia el servidor (o la aplicación) y vuelve a entrar: el Tabernero
      lo repite igual. Ve al campo: el alijo está en su sitio y se abre.
- [ ] Si el campo coincide con uno de un alijo ya abierto antes, el relato
      **no** se repite (una vez por campo). Si no coincide, no pasa nada:
      anótalo como no comprobado.

**E. Casos límite (si da tiempo)**

- [ ] **Mochila llena:** con un rumor pendiente, carga peso hasta el límite
      (cualquier objeto pesado con `@item`) y abre el alijo: «Dentro hay algo
      pesado y no puedes cargarlo…», no da nada y el alijo sigue ahí. Suelta
      peso y ábrelo.
- [ ] **No es tuyo:** con un rumor pendiente y su alijo ya colocado (has
      entrado en su campo y no lo has abierto), entra con **otro personaje**
      y háblale: «Un fardo
      atado con un nudo que no conoces…», sin botín. El alijo sigue para su
      dueño.
- [ ] **Nivel más alto:** con un personaje de nivel 60–89, el rumor cuesta
      2100 zeny (3 rondas de 700). El botín sigue siendo del Tier del campo.

**F. Lejos, y junto a una cadena** (0.4.0, D45)

- [ ] Abre (o descarta comprando otro) el alijo pendiente. Settings → Mods
      → `tavern-rumors` → apaga **«Alijos cerca»** y aplica.
- [ ] Compra un rumor: el Tabernero habla de «tierras que pocos pisan» y
      nombra uno de estos cinco: Montañas Mjolnir 12 (por Aldebaran), Campo
      de Lutie 01 (por Aldebaran), Campo de Comodo 01, Campo de Umbala 01 o
      Campo de Mosk 02 (los tres por Alberta). Son los únicos campos de
      otra región en el atlas, todos de Tier 2.
- [ ] Reinicia el servidor (prueba que la mapflag de los campos lejanos se
      repone) y ve allí (aquí sí vale `@warp` al campo, no al punto): el
      alijo aparece y su pieza es de Tier 2.
- [ ] Con ese alijo pendiente, toma una cadena con el Trotamundos
      (`@rumor puerta`): las dos conviven. El Tabernero repite el alijo y el
      Trotamundos la cadena; terminar una no toca la otra.
- [ ] Vuelve a encender «Alijos cerca» al terminar.

**Qué observar** (anótalo en «Qué se vio»):

- ¿Cuánto tardaste en encontrar el alijo con la pista? ¿8 celdas es poco o
  demasiado?
- ¿Te dio ganas de salir de la ciudad, o se sintió como un recado?
- La pieza del alijo, comparada con la de un cofre de mazmorra de Tier
  parecido: ¿hace que la mazmorra sobre?
- ¿El precio pesa a nivel 1–39?

## 6. La primera cadena de rumores (`tavern-rumors` 0.3.0, `adventure` 0.5.0)

Todo sin probar. Es «La puerta tapiada»: el detalle está en «Las cadenas de
rumores» del
[README de `tavern-rumors`](./tavern-rumors/README.md#las-cadenas-de-rumores)
y el diseño en [`RUMORES.md`](./RUMORES.md). Es la prueba de que la mecánica
entera funciona con un solo caso: si algo falla aquí, fallará en todas las
cadenas.

**Preparación**

- La aplicación **reiniciada** tras instalar (trae `System/`).
- Un personaje de nivel bajo que aguante `prt_sewb4` (Tier 1: Thief Bug
  Male, Drainliar), con pociones. Lápiz y papel para los puntos.
- `@rumor` en el chat: «Cadena en curso: ninguna» y `puerta: personaje 0
  … mundo 0`. Si sale `mundo 1`, `@rumor puerta reset`.

**A. Carga**

- [ ] `ragnarok-stack logs map 200`: sin errores de `tavern-chains.txt` ni
      de `tavern-chains-data.txt`, sin `npc_parsename … too long` y sin
      `Duplicate unique name`. El `item_db` de `tavern-rumors` carga 3
      entradas (dos rastros y el ungüento de la sección 7).
- [ ] El **Viejo Trotamundos** se ve en la taberna (`@warp prt_in 177 22`;
      está en `175,27`). Anota si cae dentro de una pared.
- [ ] El **Capitán de la Guardia** se ve en Izlude (`129,121`, junto al
      Cronista).

**B. El disparador**

- [ ] Habla con el Trotamundos sin nada contado: «Siéntate y cuéntale tus
      viajes…», sin ofrecer nada.
- [ ] Si el personaje **nunca** pisó `prt_sewb4`: ve hasta allí (las
      Cloacas desde `prt_fild05`, o `@warp prt_sewb4`), vuelve y cuenta los
      relatos con el Cronista o el Tabernero. `@rumor` dice ahora
      «Relatos leídos: 0 de N» con N mayor que 0.
- [ ] Si ya lo había pisado antes (su relato no se repite): `@rumor puerta`.
- [ ] Habla con el Trotamundos: «Te oí contar lo tuyo.» y el rumor de la
      puerta tapiada. «Ahora no» lo deja en espera; vuelve a hablarle y lo
      ofrece otra vez.
- [ ] «Ir a buscarlo»: dice `Cloacas de Prontera 4` (o el nombre del atlas)
      y un punto. **Apunta el punto.** `@diario` tiene la nota «Rumor: La
      puerta tapiada…». Hablarle otra vez repite la pista.

**C. El rastro**

- [ ] En `prt_sewb4`, a 8 celdas o menos del punto, unos **Restos de un
      guardia** (sprite de esqueleto, 10016). Anota si no se ven: el sprite
      no existe en el cliente.
- [ ] Háblales: el texto del esqueleto; «Tomarlo» da la **Llave Oxidada**,
      dice adónde llevarla (el Capitán, en Izlude) y los restos desaparecen.
      El chat: «Nuevo relato: Encontré Llave Oxidada en …».
- [ ] La llave: no se puede soltar ni guardar en el almacén. Su
      descripción es la de la llave (el icono es de un trozo de madera, a
      propósito por ahora).

**D. El análisis**

- [ ] El Capitán de Izlude, **sin** la llave en otro personaje o antes de
      tenerla: «¿Buscas algo?…».
- [ ] Con la llave: cuenta de dónde es, y dice volver a la puerta con la
      celda. `@diario`: «Capitán de la Guardia leyó Llave Oxidada…».
- [ ] El Trotamundos, ahora, dice volver a la puerta.

**E. La puerta y el guardián**

- [ ] De vuelta en `prt_sewb4`, donde estaban los restos, una **Puerta
      Tapiada** (sprite 10371). Anota si no se ve.
- [ ] «Abrir la puerta»: la puerta desaparece y sale el **Carcelero de la
      Cloaca** junto a ella, con nombre, bastante más duro que un Thief Bug
      Male normal. El chat: «Algo se acerca: Carcelero de la Cloaca.».
- [ ] Sal del mapa sin matarlo y vuelve: el Carcelero sigue ahí (o vuelve a
      salir), y **no** hay dos.
- [ ] Mátalo: «Has vencido a Carcelero de la Cloaca.», el texto del
      pasadizo, la llave desaparece y dos relatos, «Vencí a …» y «Seguí el
      rumor de «La puerta tapiada» hasta el final».
- [ ] Un **Pasadizo a la Entrada** (portal) donde estaba la puerta.
      Pisarlo lleva a la entrada de las Cloacas (`prt_sewb1 131,247`).
- [ ] Cuenta los relatos: el Hito pesa (medio nivel de los de tu banda).

**F. Persistir y el mundo**

- [ ] Reinicia el servidor: el pasadizo sigue en `prt_sewb4`.
- [ ] `@rumor`: `puerta: personaje 3 … mundo 1`.
- [ ] Con **otro personaje**, `@rumor puerta` y habla con el Trotamundos:
      «Lo de «La puerta tapiada» ya lo resolvió <el primero>…», sin cadena.
      Ese personaje también ve y usa el pasadizo.
- [ ] A mitad de una cadena (repítela con `@rumor puerta reset` y luego
      `@rumor puerta`), sal del juego en la etapa de la puerta y vuelve a
      entrar: la puerta sigue en su sitio.
- [ ] «Olvidar este rumor» con el Trotamundos: quita la llave, la cadena
      vuelve a esperar y el rastro o la puerta ya no salen.

**Qué observar** (en «Qué se vio»): si la pista de 8 celdas basta en una
mazmorra, si el viaje a Izlude se siente como parte de la historia o como un
recado, si el guardián es un reto justo para Tier 1 y si el pasadizo se usa.

## 7. La segunda cadena: «La madre de la manada» (`tavern-rumors` 0.4.0)

Todo sin probar. Prueba lo que la primera no tenía: el **talismán** como
disparador, el final en **otro mapa** y la consecuencia **servicio**. Detalle
en «Las cadenas de rumores» del
[README de `tavern-rumors`](./tavern-rumors/README.md#las-cadenas-de-rumores).
Haz antes la sección 6: si la mecánica común falla allí, fallará aquí.

**Preparación**

- Un personaje que aguante `prt_maze03` (Tier 2; la loba es un Wolf de
  nivel 45 con el 400 % de HP), con pociones y zeny (1500 para el
  ungüento).
- Un **Colmillo del Némesis** (51202): `@nemesisgm 1013` (un Wolf némesis a
  tu lado) y véncelo; o, para ir rápido, `@item 51202 1` (un talismán sin
  firmar sirve igual para la cadena).
- `@rumor`: `manada: personaje 0 … mundo 0`. Si no, `@rumor manada reset`.

**A. Carga**

- [ ] El **Cazador Viejo** se ve en Prontera (`145,187`, al lado de los
      vendedores del tablero). Anota si no se ve: el sprite `4_M_EINOLD`.
- [ ] En `prt_fild01 139,366` (junto a la salida del Laberinto) **no** hay
      nadie todavía.

**B. El talismán**

- [ ] Con el Colmillo **puesto**, habla con el Trotamundos: te pide que te
      lo quites y no ofrece nada más que lo de siempre.
- [ ] Quítatelo y habla otra vez: te lo pide. «Guardarlo»: sigue en la
      mochila y no hay cadena.
- [ ] «Dárselo»: el Colmillo desaparece, «Lo gira despacio entre los
      dedos.» y el rumor del Laberinto (sin «Te oí contar lo tuyo.»). «Ahora
      no»: `@rumor` dice `manada: personaje 1`; hablarle otra vez lo ofrece
      **sin** pedir otro talismán.
- [ ] «Ir a buscarlo»: `Laberinto de Prontera 2` y un punto. Apúntalo.

**C. Rastro y análisis**

- [ ] En `prt_maze02`, cerca del punto, unos **Huesos roídos** (sprite
      471). Anota si no se ven o si caen en una sala sin salida.
- [ ] «Tomarlo»: el **Hueso Marcado**, el relato del rastro, y te manda al
      Cazador Viejo de Prontera.
- [ ] El Cazador Viejo lee el hueso y da **otra** celda, en
      `Laberinto de Prontera 3`. Apúntala. `@diario`: «… Tengo que ir a
      Laberinto de Prontera 3.».

**D. La madriguera y la loba**

- [ ] En `prt_maze03`, en esa celda, una **Madriguera** (sprite 10026).
      En `prt_maze02` ya no queda nada.
- [ ] «Dejar el hueso como cebo»: sale la **Madre de la Manada** junto a
      ella, con nombre; el chat: «Algo se acerca: Madre de la Manada.».
- [ ] Sal del mapa sin matarla y vuelve: sigue ahí (o vuelve a salir), y
      no hay dos.
- [ ] Mátala: el hueso desaparece, el texto «Sin su madre, la manada se
      dispersa…» y los dos relatos.

**E. El cazador que se instala**

- [ ] En `prt_fild01 139,366` está el **Cazador del Laberinto**. Dice quién
      acabó con la loba.
- [ ] «Ver qué vendes»: el **Ungüento del Cazador** a 1500 y flechas,
      flechas de fuego, trampas y pociones naranjas a su precio de siempre.
      El ungüento tiene su descripción en la ventana (icono de poción).
- [ ] Úsalo y pega a un Wolf: más daño que antes (alrededor de un 10 %).
      Muere: el efecto se va. Usa dos seguidos: no se suma.
- [ ] «Contar una historia de caza»: una de cuatro, al azar. No cuenta tus
      relatos.
- [ ] Reinicia el servidor: el cazador sigue. Con **otro personaje** también
      se ve, y el Trotamundos no le pide su Colmillo (dice que ya lo
      resolvió el primero si lo pone en espera con `@rumor manada`).
- [ ] `@rumor manada reset`: el cazador desaparece.

**Qué observar:** si entregar el talismán se siente como una elección (frente
a colgarlo o engarzarlo), si el Laberinto hace difícil encontrar el rastro
con la pista de 8 celdas, si la loba es justa para Tier 2 y si el ungüento
vale lo que cuesta.

## Fuera de esta sesión

Necesitan algo que no cabe en una sesión de una persona:

- **Prueba de dos jugadores** (H2 en [`ROADMAP.md`](./ROADMAP.md)): el
  crédito en grupo de `expedition-board` y la regla de grupo en general; la
  fogata compartida de `campfire` (Cómodo, descansar y cocinar en la del
  compañero); el relato de grupo de `refuges` («Restauré el …» para el
  compañero en el mismo mapa); los relatos de grupo de `adventure` 0.2
  (cofre, marca, MVP y refugio).
- **El veneno flojo de `clima`** (activo unos 12 s de cada 20): no es una
  prueba, es una decisión de balance pendiente; se ajusta en Settings
  (`refresh_seconds` por debajo de `status_seconds`).
- **El personaje que sigue congelado tras cambiar de mapa** (visto el
  2026-10-23): se reproduce con `rotest`; ver «Estado» de
  [`clima`](./clima/README.md#estado).

## Al terminar

- [ ] `ragnarok-stack logs map 2000` **antes de cerrar o reiniciar el
      juego** (al reiniciar el servidor se pierde el log): sin errores de
      nuestros mods, sin `event queue is full` ni `experience key refused`,
      nada de `buildin_rand`, `duplicate`, `hideonnpc` ni `unloadnpc` (las
      fogatas) ni de `setnpcdisplay`, `npcshopadditem`, `getitem3` o
      `getitem4` (refugios, cofres, Herrero y alijos), ni
      `tavern-rumors: no passable cell` o `could not place the find`, ni `F_Adv_Note`,
      `F_Adv_Cured` o `F_ModSetting` en un error. En Windows el binario está
      en `%LOCALAPPDATA%\Programs\Ragnarok Offline\resources\payload\bin\ragnarok-stack.exe`.
- [ ] Devuelve `trait_minutes` a 30 (estaba a 1 para los rasgos del 2026-10-26),
      `trophy_hours` a 12 y cualquier otro ajuste que cambiaras.
- [ ] Pasa los resultados a «Estado» de cada README y borra de aquí los pasos
      hechos.

## Resultados

| Paso | Bien / Falla | Qué se vio |
|---|---|---|
| Instalar y log | | |
| 1. Iconos (0.5.2) | | |
| 2. MVP | | |
| 2. Ajustes | | |
| 2. Cambio de clase | | |
| 3. Logros | | |
| 3. Objetos del bioma | | |
| 4. Trofeo de marca | | |
| 4. Marca de élite | | |
| 4. Coleccionista | | |
| 4. Talismán de némesis | | |
| 4. Engarce | | |
| 5A. Carga del alijo | | |
| 5B. Comprar y repetir | | |
| 5C. Buscar y abrir | | |
| 5D. Persistir | | |
| 5E. Casos límite | | |
| 5F. Lejos y con una cadena | | |
| 5. Impresiones | | |
| 6A. Carga de la cadena | | |
| 6B. Disparador | | |
| 6C. Rastro | | |
| 6D. Análisis | | |
| 6E. Puerta y guardián | | |
| 6F. Persistir y el mundo | | |
| 6. Impresiones | | |
| 7A. Carga | | |
| 7B. Talismán | | |
| 7C. Rastro y análisis | | |
| 7D. Madriguera y loba | | |
| 7E. El cazador | | |
| 7. Impresiones | | |
| Log final | | |
