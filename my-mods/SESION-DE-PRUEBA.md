# Sesión de prueba larga

Guion para probar en el juego, en una sola sesión, lo hecho el 2026-10-17:

1. **`world-atlas` 0.2.0**: la región de Prontera e Izlude completa, con
   interiores seguros.
2. **Rebalanceo de presión**: escalones de `survival` 1.2.0, Bien alimentado
   e Hidratado, y el tope de presión común en `survival`, `temperature` 0.3.0,
   `wounds` 0.4.0 y `clima` 0.3.0.
3. **Pronóstico del clima** (`clima` 0.4.0) y **cofres generados desde el
   atlas** (`dungeon-chest` 0.3.0, con 4 retos nuevos).
4. **`adventure` 0.1**: expediciones, relatos, el Cronista y el diario con la
   pestaña Relatos; y el relato de herida de `wounds` 0.4.1. Es la Parte 3,
   con un personaje nuevo.

Los pasos están ordenados para moverse poco: primero lo que se mira desde
Prontera, luego los campos y al final `adventure`. Calcula entre 90 y 120
minutos; si falta tiempo, la Parte 3 se puede hacer sola (lee antes «Antes de
entrar»). Cada paso dice qué
hacer y qué debe pasar; apunta lo que no coincida en la tabla del final. El
detalle de cada mod está en su README («Probarlo» o «Probarlo en una sesión
larga»); si este guion y un README no coinciden, manda el README.

Al terminar, pasa los resultados a la sección «Estado» del README de cada mod
y borra o archiva la tabla de resultados.

## Antes de entrar

**Mods activos:** `world-atlas`, `world-atlas-test`, `survival`,
`temperature`, `wounds`, `clima`, `adventure` y `dungeon-chest`. Los demás del modpack de
pruebas ([`MODPACK.md`](./MODPACK.md)) pueden seguir activos, **salvo
`travel-journal`**: `adventure` lo sustituye y los dos definen el mismo NPC
(`TravelJournal`) y el mismo comando (`@diario`).

**Instalación:**

- [ ] Reemplaza la carpeta instalada de cada uno de esos mods (no copies
      encima: quedarían scripts viejos cargándose).
- [ ] `adventure` es nuevo: **Settings → Mods → Add mod from folder…** y elige
      `my-mods/adventure`. En el mismo Apply, **desactiva `travel-journal`**.
      Las entradas del diario viejo no pasan al nuevo; es lo esperado.
- [ ] Recarga los mods del servidor **y reinicia la aplicación**: cambió
      `survival/client/` (los medidores) y `adventure` trae su propio
      `client/` (la ventana del diario), y eso solo se carga al arrancar.
- [ ] `ragnarok-stack logs map 200`: sin errores de `world-atlas.txt`,
      `survival.txt`, `temperature.txt`, `wounds.txt`, `clima.txt`,
      `dungeon-chests.txt`, `adventure.txt` ni `adventure-maps.txt`. Ni
      `Duplicate NPC name` con `TravelJournal` (señal de que `travel-journal`
      sigue activo). Un error
      de sintaxis hace que rAthena se salte el archivo entero; que el mod
      aparezca activo no basta.

**Personaje:** `tester` / `tester123`. Tiene comandos de GM y el cliente lo
dibuja con su clase. No uses la cuenta `ragnarok`.

**Lo que vas a necesitar** (con `@item <id> <cantidad>`):

| Objeto | ID | Para qué |
|---|---:|---|
| Apple | 512 | +10 de hambre |
| Mastela Fruit | 522 | +40 de hambre, para saltar escalones |
| Milk | 519 | +10 de sed |
| Yellow Potion | 503 | +15 de sed |
| Cantimplora vacía | 50837 | comprobar el agua de `izlu2dun` |
| Abrigo Polar (de `clima`) | 50833 | abrigo +2 |

**Comandos de la sesión:**

| Comando | Qué hace |
|---|---|
| `@presion` | presión de cada sistema, total y si actúa el tope; escalón de hambre y sed |
| `@temperatura` | estado de temperatura y su desglose |
| `@heridas` / `@herida <id>` | listar heridas / darse una (GM) |
| `@set hm_hunger <n>`, `@set thirst_value <n>` | poner hambre o sed a mano; el medidor se pone al día en 15 s como mucho |
| `@warp <mapa> <x> <y>` | moverse |
| `/where` | coordenadas propias |
| `@diario` o Alt+J | ventana del diario (pestañas Diario y Relatos) |
| `@relatos` | la expedición en curso y los relatos sin contar, en el chat |
| `@die` | morir (GM), para las heridas y los relatos de herida |
| `@blvl <n>` | subir `n` niveles de base (GM), para el factor de Tier |

**Primero comprueba `@set`:** en un campo, `@set hm_hunger 60` y espera
15 s; el medidor debe marcar 60. Si `tester` no puede usar `@set`, los pasos
de escalones se hacen dejando correr el reloj (1 punto cada 15 s: de 100 a 0
en 25 minutos) mientras haces los pasos del atlas.

## Parte 1. En Prontera

### 1.1 Al entrar

- [✓] Con hambre y sed por encima de 70: los mensajes «Estás bien
      alimentado…» y «Estás hidratado…».
- [✓] Los dos medidores en verde y azul, sin `!`.
- [✓] `@presion`: total 0.

### 1.2 Datos del atlas, desde `AtlasTest`

El NPC está en `prontera 150,180`. Escribe el nombre del mapa sin moverte.

| Mapa | Debe dar | ✓ |
|---|---|---|
| `prontera` | `has=1 safe=1 kind=city` |✓|
| `prt_in` | `kind=interior safe=1 tier=0 biome=ciudad`, nombre «Interiores de Prontera» |✓|
| `iz_int` | `kind=interior safe=1 tier=0 anchor=izlude` |✓|
| `prt_fild00` | `kind=field safe=0 tier=1 biome=pradera` |✓|
| `izlu2dun` | `kind=field tier=1 biome=costa water=1 anchor=izlude` |✓|
| `prt_maze01` | `biome=bosque` (antes `cueva`) |✓|
| `prt_mz03_i` | `kind=dungeon tier=6` |✓|
| `izlude_a` | `has=0 safe=0` (copia de canal, fuera a propósito) |✓|
| `ice_dun02` | `tier=4` (fila antigua, sin cambios) |✓|

### 1.3 Interiores seguros

- [✓] `@warp prt_in 244 135` (la posada). Espera 1 minuto: hambre y sed **no
      bajan**.
- [✓] `@temperatura` dice «en la ciudad estás a gusto». Ponte el Abrigo
      Polar: sigue sin estado de frío ni calor.
- [✓] Repite el minuto de espera en `prt_church`, `izlude_in` e `iz_ac01`.
- [Master Tailor no coincide, no se ve un NPC con ese nombre cerca (Estara oculto?) ] Coordenadas de servicios (con `/where` junto a cada uno): Inn Employee
      de `prt_in` en 244,135 y 61,141; Bartender en 180,20; Master Tailor de
      `izlude_in` en 123,175. Si alguna no coincide, corrige la columna `note`
      del atlas.

### 1.4 Castigo que sigue en la ciudad

- [✓] Sal a `prt_fild08`, `@set hm_hunger 0`, espera el mensaje «Estás
      famélico…» y vuelve a `prt_in`.
- [ATK no veo que baje ni afuera ni adentro, poniéndome famélico. HP max si baja y se mantiene en prontera ] El hambre no sigue bajando (está en 0), pero el castigo **sigue**:
      HP máx y ATK más bajos en la ventana de estado (Alt+A) y el `!` rojo en el
      medidor.
- [Funciona a expecion del ATK que nunca se penaliza] Come una Mastela Fruit: un solo mensaje, «Ya no estás hambriento,
      aunque aún tienes hambre» (llega a 40), y HP máx y ATK vuelven en unos
      5 s.

### 1.5 Pronóstico del clima

Espera al menos 30 s tras arrancar el servidor (antes no hay pronóstico).

- [✓] El Pronosticador está en `prontera 168,193`, a la derecha del
      Sacerdote. Su menú lista los campos de Prontera con su nombre del atlas
      («Campo de Prontera 01»…), más «Toda la región» y «Otras tierras».
- [✓] «Toda la región»: una línea por campo, con el evento de ahora, sus
      minutos y el de después.
- [✓] Elige `prt_fild08`: «Ahora» con minutos y «Te protege: …», y
      «Después» con un evento y unos minutos. **Apunta cuál** para 2.7.
- [✓] «Otras tierras»: salen `moc_fild11`, `xmas_fild01` y los demás mapas
      con clima de fuera de la región.

## Parte 2. En los campos

### 2.1 Escalones de hambre, en `prt_fild08`

Quítate el Abrigo Polar. Pon cada valor con `@set hm_hunger <n>` y mira el
chat, el medidor y `@presion`:

| Valor | Mensaje | Efecto | `@presion` (necesidades) | ✓ |
|---|---|---|---|---|
| 75 | «Estás bien alimentado…» | más regeneración de HP | 0 | |
| 60 | «Ya no estás bien alimentado» | ninguno | 0 | |
| 45 | «Empiezas a tener hambre» | ninguno; medidor verde | 1 | |
| 25 | «Estás hambriento…» | sentado (`/sit`), el HP **no** sube; medidor naranja con `!` | 2 | |
| 0 | «Estás famélico…» | HP máx y ATK −10 %; medidor rojo; el `!` dice «Famélico» | 3 | |

Luego hacia arriba, comiendo desde 0: una Apple (llega a 10) dice «Ya no estás
famélico, pero sigues hambriento»; una Mastela Fruit más (50) dice «Ya no
tienes hambre». Solo debe salir el mensaje del escalón al que llegas.

### 2.2 Escalones de sed

Igual con `@set thirst_value <n>`, bebiendo Milk o Yellow Potion para subir:

- [ ] 25 (Sediento): sentado, el SP no sube.
- [ ] 0 (Deshidratado): un hechizo con tiempo de lanzamiento (Fire Bolt de un
      Mage) tarda más, y la ASPD baja en la ventana de estado.
- [ ] Con hambre **y** sed en 0: «Sin comida ni agua, apenas puedes andar», y
      caminas visiblemente más despacio.

### 2.3 Bien alimentado e Hidratado

- [ ] `@set hm_hunger 80`, `@set thirst_value 80`. Gasta HP y SP, siéntate y
      cuenta lo que sube por tick.
- [ ] Repite con los dos en 60. Con 80 debe subir un 20 % más.

### 2.4 Tope de presión, en `xmas_fild01`

- [ ] `@set hm_hunger 0`, `@set thirst_value 0` (necesidades 3).
- [ ] `@warp xmas_fild01`, sin Abrigo Polar ni Capa de Piel: estado Helado
      (`@temperatura`; temperatura 2 en `@presion`).
- [ ] `@herida 1` y `@herida 5` (heridas 2).
- [ ] `@presion`: total **7** y «cada castigo se reduce al 85 %». Si hay un
      evento de `clima` sin protección, clima 1, total 8 y 75 %.
- [ ] El −10 % de Famélico pasa a −8 %; el AGI que restan Helado y la
      *Cicatriz del lobo* baja algo menos que sin el tope.
- [ ] Ponte el Abrigo Polar: la temperatura pasa a 0 o 1, el total baja de 6 y
      el mensaje del tope desaparece.
- [ ] Vuelve a Prontera y cúrate las heridas con el Posadero o el Sacerdote,
      junto al tablero. Come y bebe hasta 100.

### 2.5 Campos nuevos del atlas

- [ ] `@warp prt_fild00`, `@warp prt_monk` y `@warp izlu2dun`: en los tres
      vuelven a bajar hambre y sed, y `@temperatura` da un estado (Cómodo sin
      ropa).
- [ ] En `izlu2dun`, junto a la orilla, usa la Cantimplora vacía: debe
      llenarse. Si dice que no hay agua, `water=1` está mal en el atlas.
- [ ] Diario (Alt+J): la primera visita a `prt_fild00` sale como relato,
      «✨ Primera vez en Campo de Prontera 00.», con el nombre del atlas y no
      el código del mapa. (Con `adventure`, la primera visita a un campo es
      un relato ✨; solo las ciudades e interiores salen con 🧭.)

Mientras haces las Partes 1 y 2, `adventure` ya está anotando relatos con
`tester`: es normal ver «Nuevo relato: …» en el chat. No los cuentes con el
Cronista todavía; la Parte 3 se hace con un personaje nuevo.

### 2.6 Diálogo largo

- [ ] En un campo, habla con un NPC y deja el diálogo abierto un minuto.
      Ciérralo: hambre y sed siguen bajando y los mensajes de escalón siguen
      saliendo. `@presion` sigue respondiendo.

### 2.7 El pronóstico se cumple, y los cofres nuevos

- [ ] Ve a `prt_fild08` antes de que acabe el evento de ahora y espera:
      al terminar y pasar el minuto de pausa, el evento que empieza es el que
      apuntaste en 1.5 (lo dice el anuncio del mapa y el log
      `[clima] Evento … iniciado`). Vuelve al Pronosticador: «Ahora» es ese
      evento y «Después» ya trae otro.
- [ ] `@warp prt_prison`: hay un `Cofre T5`, en una celda al azar, que da Lutie Lady's
      Pancake. Lo mismo en `prt_mz03_i` con `Cofre T6` (Shiny Marinade
      Beef). En el log no sale `could not find a passable cell` para
      `prt_prison`, `prt_mz03_i`, `iz_d04_i` ni `iz_d05_i`.

## Parte 3. `adventure`, con un personaje nuevo

Un personaje nuevo no tiene relatos y es de nivel 1, así que todo lo que pasa
es fácil de leer. Crea uno en la cuenta `tester` (otra ranura; cualquier
clase). Los textos entre comillas son los exactos del chat o de la ventana.

**Qué es cada cosa:** una **expedición** empieza al pisar un campo o una
mazmorra del atlas y **solo** termina al contar con el **Cronista**. Lo que
vives por primera vez (un mapa, un bioma, un Tier, una herida) queda como
**relato sin contar**; su EXP se calcula al ganarlo y se cobra al contar.
Volver a la ciudad sin contar no cierra nada.

### 3.1 Al entrar

- [ ] Entra con el personaje nuevo, en su mapa de inicio (Izlude o su sala de
      inicio). Diario (Alt+J), pestaña **Diario**: «🧭 Primera vez en …» con
      el nombre de ese mapa. La pestaña **Relatos** dice «No estás de
      expedición» y «Nada sin contar».
- [ ] `@relatos` dice «No estas de expedicion.» y «0 relatos sin contar. Se
      cuentan al Cronista.»
- [ ] Ve a Izlude (o `@warp izlude`): el **Cronista** está a la izquierda
      del tablero de expediciones, en `izlude 126,121` (en Prontera, en
      `158,193`). Se ve con sprite de bardo y se puede hablar con él. Si no
      se ve o está en una celda bloqueada, apunta `/where` de un sitio libre
      al lado.
- [ ] Habla con él: «Escribo lo que cuentan los viajeros. Vuelve cuando hayas
      vivido algo que merezca contarse.»

### 3.2 Salir de expedición

- [ ] Sal de Izlude por la salida oeste hasta `prt_fild08` (o
      `@warp prt_fild08`). En el chat, en este orden:
      «Empieza la expedicion 1.»,
      «Nuevo relato: Primera vez en Campo de Prontera 08.»,
      «Nuevo relato: Primera vez en la pradera.» y
      «Nuevo relato: Primer paso en tierras de Tier 1.»
- [ ] El chat **no** dice cuánta EXP vale cada uno (D27).
- [ ] Pestaña **Relatos**: «Expedición 1», el tiempo fuera (se refresca cada
      30 s), los tres relatos con «Tier 1» y una línea «3 relatos sin contar,
      unos +… % de nivel». A nivel 1 los números son pequeños y se redondean
      mucho: apunta el % que salga.
- [ ] Pestaña **Diario**: los tres relatos con ✨, el más reciente arriba.
- [ ] Ve a otro campo nuevo, `prt_fild07`: un solo relato nuevo (el mapa); el
      bioma y el Tier ya los tienes.

### 3.3 Volver sin contar

- [ ] Vuelve a Izlude **sin hablar con el Cronista**. `@relatos`: sigue la
      «Expedicion 1». Espera un minuto y repite: el tiempo fuera **no** ha
      subido (en la ciudad no cuenta).
- [ ] Sal otra vez a `prt_fild08`: **no** sale «Empieza la expedicion…» ni
      ningún relato (ya lo conocías). Es la misma expedición.

### 3.4 Morir

- [ ] En `prt_fild08`, `@die`. En el chat, «Has quedado marcado: …» (de
      `wounds`) y justo después «Nuevo relato: Primera vez con …» con el
      nombre de esa herida.
- [ ] Diario: «💀 Caíste en Campo de Prontera 08.» y el relato ✨ de la
      herida. (Si el diario lo tiene, también la nota 📝 de `wounds`, que
      llega por `TravelJournal::OnLog`.)
- [ ] Reapareces en la ciudad: `@relatos` sigue en la «Expedicion 1», ahora
      con «1 caida». Morir no cierra la expedición ni quita relatos.
- [ ] Opcional: cura la herida con el Posadero (junto al tablero). El diario
      anota «📝 Descanse en una posada y se curaron mis heridas». El Posadero
      **no** cuenta los relatos (D26): `@relatos` los sigue listando.

### 3.5 Salir del juego en mitad de la expedición

- [ ] Sal a un campo, apunta el tiempo fuera de `@relatos`, sal del juego,
      espera un par de minutos y vuelve a entrar con el mismo personaje.
- [ ] `@relatos`: la misma expedición, los mismos relatos, y el tiempo fuera
      es el de antes más lo poco que llevas desde que entraste (el tiempo
      desconectado no cuenta).

### 3.6 Contar con el Cronista

- [ ] Vuelve a la ciudad y apunta tu nivel y el % de EXP (Alt+A).
- [ ] Habla con el Cronista: «Traes N historias en la cara. Sientate y
      cuentamelas.» Elige «Contar lo vivido»: «Lo apunto todo. Quien sabe
      contar lo que vivio, aprende de ello.»
- [ ] La EXP sube aproximadamente lo que decía la pestaña Relatos (base y
      job; al nivel 1 puede subir de nivel).
- [ ] Diario: un resumen 🏕️ del estilo «Expedición 1 · 12 min fuera · Campo
      de Prontera 08 · 5 relatos (+… % de nivel) · 1 caída».
- [ ] Pestaña Relatos: «No estás de expedición» y «Nada sin contar».
- [ ] Habla otra vez con el Cronista: el mensaje de «Vuelve cuando hayas
      vivido algo…».

### 3.7 Una expedición sin nada nuevo

- [ ] Sal a `prt_fild08` (ya conocido): «Empieza la expedicion 2.» y ningún
      relato. Vuelve y habla con el Cronista: «Vienes de fuera, pero sin nada
      nuevo que contar…»; tras contar, «Apuntado: volviste. No es poca
      cosa.» El diario tiene el resumen de la expedición 2 con «0 relatos».

### 3.8 Factor de Tier

Un personaje de nivel alto gana muy poco en las zonas fáciles y más por
encima de su nivel.

- [ ] `@blvl 69` (nivel 70, banda de Tier 3). Sal a un campo nuevo de Tier 1,
      `prt_fild05`: el relato sale, pero la pestaña Relatos dice «unos +0 %»
      (vale un 0,4 % de nivel).
- [ ] Sal a `prt_fild11` (Tier 2, uno por debajo de tu banda): dos relatos,
      el mapa y «Primer paso en tierras de Tier 2». El total sube a unos
      +22 % (0,4 % + 1,6 % + 20 %).
- [ ] Cuenta con el Cronista: la barra de EXP sube más o menos ese 22 %.

## Al terminar

- [ ] `ragnarok-stack logs map 2000`: busca errores de `F_Atlas_*`,
      `survival_mgr`, `temp_mgr`, `wounds_mgr`, `Clima#clima`,
      `Pronosticador#clima_prt`, `dungeon-chest`, `Adventure`, `F_Adv_*` y
      `TravelJournal`; `event queue is full`; y `experience key refused`
      (una clave de relato que el mod store no aceptó).
- [ ] Desactiva `world-atlas-test`.
- [ ] Pasa los resultados a «Estado» en los README de `world-atlas`,
      `survival`, `temperature`, `wounds`, `clima`, `dungeon-chest` y
      `adventure`, y marca lo probado en
      [`ROADMAP.md`](./ROADMAP.md).
- [ ] Si `adventure` funciona, `travel-journal` se puede retirar (D12).

### Si un efecto no se nota

Tres bonos de rAthena no se pudieron comprobar en el código fijado, porque no
había copia de `vendor/rathena` al escribirlos:

| Síntoma | Bono | Qué probar en su lugar |
|---|---|---|
| Con hambre y sed por debajo de 30, una de las dos regeneraciones sigue | `bNoRegen,3` | dos bonos separados: `bNoRegen,1` y `bNoRegen,2` |
| Famélico no baja el ATK | `bAtkRate` negativo | `bBaseAtk` con un valor negativo fijo |
| Con las dos en 0 no caminas más despacio | `bSpeedRate` negativo | `bSpeedAddRate` negativo |

Todos están en `S_Penalty` de `survival/npc/survival.txt`.

## Resultados

Rellénala durante la sesión.

| Paso | Bien / Falla | Qué se vio |
|---|---|---|
| Antes de entrar (carga, `@set`) | | |
| 1.1 Al entrar | | |
| 1.2 Datos del atlas | | |
| 1.3 Interiores seguros y coordenadas | | |
| 1.4 Castigo en la ciudad | | |
| 1.5 Pronóstico del clima | | |
| 2.1 Escalones de hambre | | |
| 2.2 Escalones de sed | | |
| 2.3 Bien alimentado e Hidratado | | |
| 2.4 Tope de presión | | |
| 2.5 Campos nuevos | | |
| 2.6 Diálogo largo | | |
| 2.7 Pronóstico cumplido y cofres nuevos | | |
| 3.1 `adventure`: al entrar, Cronista | | |
| 3.2 Salir de expedición, relatos | | |
| 3.3 Volver sin contar | | |
| 3.4 Morir (herida y relato) | | |
| 3.5 Salir del juego a mitad | | |
| 3.6 Contar con el Cronista | | |
| 3.7 Expedición sin nada nuevo | | |
| 3.8 Factor de Tier | | |
| Log final | | |
