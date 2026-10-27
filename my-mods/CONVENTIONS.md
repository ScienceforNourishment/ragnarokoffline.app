# Convenciones de `my-mods/`

Reglas comunes para que los mods convivan: rangos de IDs, nombres, eventos
públicos, la regla de grupo y las restricciones técnicas que condicionan el
diseño. El contexto general está en [`README.md`](./README.md). Al crear un mod
nuevo, regístralo aquí antes de escribir código.

## Era

La partida es **Renewal** ([`DECISIONS.md`](./DECISIONS.md), D1). Todo se
diseña, se balancea y se prueba en Renewal. Ningún mod de `my-mods/` tiene ya
carpeta `pre-renewal/` (la de `clima` se quitó el 2026-10-17). `"era": "any"`
en `mod.json` es correcto mientras el mod funcione igual en las dos; un mod con
datos que solo valen en Renewal (objetos, monstruos) declara
`"era": "renewal"`, como `clima`.

## Rangos de IDs de objetos

Los IDs custom van de 50000 en adelante. Los asignados hasta hoy quedaron
pegados, sin margen; desde ahora cada mod nuevo recibe un **bloque de 100**.

| Rango | Mod | Uso |
|---|---|---|
| 50824–50833 | `clima` | objetos de protección |
| 50834–50837 | `survival` | cantimploras |
| 50838–50839 | — | libres |
| 50840–50843 | `temperature` | ropa |
| 50844–50999 | `clima`, `survival`, `temperature` | ampliaciones de estos tres; anotar aquí cada ID que se use |
| 51000–51099 | `adventure` | (planeado) |
| 51100–51199 | `campfire` | 51100–51102 leña, kit y venda; 51110–51115 platos (recetas en `registry/tools/campfire/recipes.csv`) |
| 51200–51299 | `nemesis` | talismanes: 51200–51209 (51200 + raza del monstruo; accesorios con afijos, D40) |
| 51300–51399 | `refuges` | sin objetos en 0.1; reservado para materiales propios de oficios (D33) |
| 51400–51499 | `tavern-rumors` | objetos de rastro de las cadenas (0.3.0): 51400 Llave Oxidada; la lista, en `registry/tools/tavern-rumors/chains.csv` |
| 51500–51599 | `remnants` | (planeado) objetos con lore |
| 51600–51699 | `expedition-board` | trofeos de marca: 51600–51609 (51600 + raza, accesorios, D40) |
| 51700–51799 | `dungeon-chest` | (planeado) botín propio |
| 55000–56999 | `arpg-equipments` (registro) | **no usar**: referencia externa |

`survival` también **redefine** objetos stock (bebidas 11506–11562, pociones
501–506). Un mod que toque los mismos IDs debe ir después en el orden de carga
y conservar sus efectos (ver «Comportamiento del cargador» en el README).
Antes de activar un mod del registro, revisa que sus IDs no caigan en estos
rangos.

## Rangos de IDs de logros

Los logros propios (ventana Alt+K, `docs/mods/CUSTOM_ACHIEVEMENTS.md`) van
de 900000 en adelante, un **bloque de 1000** por mod. Nunca reutilizar un
id: los personajes guardan el progreso del anterior.

| Rango | Mod | Uso |
|---|---|---|
| 900000–900999 | `examples/mods/custom-achievement` | **no usar**: el ejemplo de la app |
| 901000–901999 | `adventure` | relatos Mayores e Hitos (D39); la lista, en su README |

## Nombres

Cada mod tiene un **prefijo** corto para todo lo que otros podrían ver:

| Mod | Variables de personaje | Temporales y globales | Funciones | NPC |
|---|---|---|---|---|
| `world-atlas` | — | `$@wa_ready` | `F_Atlas_*` | `WorldAtlas`, `atlas_cmd` |
| `survival` | `hm_*`, `thirst_*` (nombres heredados, no cambiar) | `@hm_penalty_*`, `@thirst_penalty_*`, `@sv_*` | `F_Survival_*` | `survival_mgr` |
| `clima` | — | publica `@clima_*` | `F_Clima_*` | `Clima#clima`, `Pronosticador#clima_prt` |
| `temperature` | — | `@tp_*` | `F_Temperature_*` | `temp_mgr` |
| `wounds` | `wd_*` | — | `F_Wounds_*` | `wounds_mgr` |
| `nemesis` | `nm_*` | `$@nm_gid[]`, `$@nm_owner[]`, `$@nm_sym$` | `F_Nemesis_*` | `nemesis_mgr` |
| `expedition-board` | `eb_*` (también `eb_trt[]`, `eb_tr_*`, `eb_def[]` de los trofeos) | `$@eb_*` | `F_Expedition_*` | `ExpeditionCtrl`, `ExpeditionData`, `ExpeditionTrophies`, `Coleccionista#eb_*` |
| `dungeon-chest` | — | `$@dc_*` (datos del botín); `@dc_ro_*` (afijos sorteados), `@dc_sm_*` (Herrero) | `F_DungeonChest_*` | `Cofre T<n>#dcp_<mapa>`, `dungeon_loot`, `Herrero de Afijos#dc` |
| `tavern-rumors` | `tr_hm$`, `tr_hx`, `tr_hy`, `tr_px`, `tr_py` (el rumor de un alijo, 0.2.0); `tr_ci$`, `tr_cs`, `tr_cx`, `tr_cy`, `tr_cpx`, `tr_cpy` (la cadena en curso, 0.3.0) | `@tr_l$[]`; `$@tr_hn$[char_id]` (el alijo de cada personaje); `$@tr_cn$[]`, `$@tr_cst[]`, `$@tr_cg[]`, `$@tr_cgo[]`, `$@tr_wn$[]` (las cadenas); mod store: global `w.<cadena>.*` (on, x, y, by), de personaje `c.<cadena>` (1 en espera, 2 en curso, 3 hecha) y `told` (hasta dónde leyó `adv_told$`) | `F_Tavern_*`, `F_Chain_*` | `Tabernero#tr_*`, `tavern_data`, `tavern_finds`, `Alijo#tr`, `tavern_chains`, `tavern_chains_mgr`, `Viejo Trotamundos#trc_*`, `<analista>#trc_<cadena>`, plantillas `Rastro#trc`, `Puerta#trc`, `Pasadizo#trc` |
| `campfire` | — | `@cf_*`; `$@cf_*` (las fogatas) | `F_Campfire_*` | `campfire_mgr`, `campfire_recipes`, `Fogata#cf` (plantilla; sus copias se llaman `Fogata`), `Proveedor de Campamento#cf` |
| `refuges` | — | — (estado en el mod store global, `r.<id>.*`) | `F_Refuge_*` | `refuges_mgr`, `refuges_data`, plantillas `Refugio#rf`, `Caravanero#rf`, `Caravana#rf` (copias `#rf_<id>`, `#rf_<id>_c`, `#rf_<ciudad>`), `Intendente del Refugio#rf_<id>_s` |
| `adventure` | `adv_trait_*`, `adv_t_*`, `adv_cured` (rasgos) | `@adv_*` (entrada, colas `@adv_q*` y `@adv_n*`, con `@adv_qm$` para el grupo); `@tj_*` (entrada del diario, heredada de `travel-journal`) | `F_Adv_*` | `Adventure`, `TravelJournal`, `Cronista#adv_*` |

Un mod nuevo elige un prefijo de 2 a 4 letras, comprueba que nadie lo use
(`grep -rn "<prefijo>_" my-mods mods registry/mods`) y lo añade a esta tabla.

## Datos compartidos entre mods

El mod store está aislado por mod. Lo que otro mod deba leer va en
**variables de personaje** con el prefijo del que las escribe:

| Variable | La escribe | La leen | Qué es |
|---|---|---|---|
| `@clima_exposure_map$`, `@clima_thirst_extra_loss`, `@clima_hunger_extra_loss` | `clima` | `survival`, `temperature` | exposición a un clima sin protección |
| `@pr_survival`, `@pr_temp`, `@pr_wounds`, `@pr_clima` | `survival`, `temperature`, `wounds`, `clima` (cada uno la suya) | `survival`, `temperature`, `wounds` | presión, para el tope común ([`BALANCE.md`](./BALANCE.md#tope-de-presión)) |
| `@pr_clima_map$` | `clima` | quien lee `@pr_clima` | mapa del evento; `@pr_clima` solo cuenta si es el mapa actual |
| `adv_trait_*` | `adventure` (desde 0.3) | `temperature` (`cold`, `heat`), `wounds` (`tough`), `survival` (`forager`) | rasgos permanentes; 1 si el personaje lo tiene |
| `adv_told$[]`, `adv_told_n` | `adventure` (desde 0.5.0) | `tavern-rumors` (cadenas) | las claves de los relatos contados, en un anillo de 64 (ver el README de `adventure`, «Reaccionar a lo contado») |
| `$@eb_mark[char_id]` | `expedition-board` | `wounds` | GID de la marca viva de ese personaje |
| `$@eb_markowner[gid]` | `expedition-board` | `nemesis` | dueño de esa marca; su marca no se vuelve némesis |
| `@cf_rest_until`, `@cf_ward` | `campfire` | `wounds` (gasta `@cf_ward`) | Descansado: hasta cuándo dura y si la próxima muerte fuera de una ciudad no deja herida |
| `$@cf_live` | `campfire` | `temperature` | fogatas encendidas; solo si no es 0 se llama a `F_Campfire_Near` |
| `$@nm_owner[gid]` | `nemesis` | `nemesis` (otros, si lo necesitan) | dueño de ese némesis vivo; 0 si no lo es |

`@pr_*` es la excepción al prefijo por mod: es un espacio común y cada mod
escribe solo su propia clave. Un mod que castiga y respeta el tope lleva su
propia copia de `S_CapScale` (la de `survival`, `temperature` o `wounds`)
y un `.pr_cap` de 6 en su `OnInit`: multiplica sus porcentajes y puntos de
castigo por lo que devuelve y divide entre 100. No hay controlador único (D18).

## Eventos públicos

Los que otros mods pueden llamar con `doevent`, con el jugador adjunto. Todos
son dependencias suaves: si el mod no está, `doevent` deja una advertencia en el
log y el llamador sigue.

| Evento | Mod | Entrada | Qué hace |
|---|---|---|---|
| `TravelJournal::OnLog` | `adventure` (antes `travel-journal`) | `@tj_type$`, `@tj_text$` | escribe una entrada en el diario; mejor `F_Adv_Note` (abajo), que no se pierde en la cola |
| `Adventure::OnExperience` | `adventure` | `@adv_key$`, `@adv_size`, `@adv_tier`, `@adv_text$`, `@adv_party` (0.2) | registra una experiencia; mejor `F_Adv_Experience` (abajo) |
| `Adventure::OnRest` | `adventure` | — | cuenta los relatos y cierra la expedición |

**`F_Adv_Experience(key$, tamaño, tier, texto${, grupo})`** es la forma preferida de
publicar una experiencia: se llama con `callfunc` tras comprobar
`getnpcid(0, "Adventure")`, y no se pierde si la cola del personaje está llena.
Con `grupo` a 1 (desde `adventure` 0.2) la ganan también los del grupo en el
mismo mapa; desde un diálogo, llamarla tras `close2`
(ver el [README de `adventure`](./adventure/README.md#para-otros-mods)). Las
demás funciones `F_Adv_*` son internas: usan el mod store, que es del mod del
NPC que corre el script.

**`F_Adv_Note(tipo$, texto$)`** (desde `adventure` 0.3.0), con el personaje
adjunto: una entrada en el diario. Se encola como `F_Adv_Experience` y no se
pierde si la cola de 2 huecos está llena. Comprobar antes
`getnpcid(0, "Adventure")`. La usan `wounds`, `nemesis` y `expedition-board`.

**`F_Adv_Cured(id)`** (desde `adventure` 0.3.0), con el personaje adjunto:
cuenta una cura de esa herida para el rasgo Curtido por las heridas. Solo
escribe variables de personaje, así que sirve desde cualquier mod y en un
diálogo. Comprobar antes `getnpcid(0, "Adventure")`. La usa `wounds`.

**`F_Wounds_CureFrom(clase)`** (desde `wounds` 0.5.0), con el personaje
adjunto: quita las heridas y maldiciones que dejó un monstruo de esa clase y
devuelve cuántas. Comprobar antes `getnpcid(0, "wounds_mgr")`. La usa
`nemesis`.

**`F_Wounds_Ease(id)`** (desde `wounds` 0.6.0), con el personaje adjunto:
venda una herida (no una maldición), que penaliza la mitad hasta curarla
(D29); devuelve 1 si la vendó. `F_Wounds_IsEased(id)` dice si ya lo está. La
usa `campfire`.

**`F_Campfire_Near()`** (desde `campfire` 0.1.0), con el personaje adjunto:
1 + el índice de la fogata encendida a 3 celdas o menos, o 0. Llamarla solo
con `$@cf_live` distinto de 0. La usa `temperature`.

**`F_Campfire_Rest()`** (desde `campfire` 0.2.0), con el personaje adjunto:
le da Descansado y devuelve sus minutos, sin escribir en el diálogo.
Comprobar antes `getnpcid(0, "campfire_mgr")`. La usa `refuges`.

Las funciones `F_Atlas_*` se llaman con `callfunc` y funcionan sin personaje
adjunto si se les pasa el mapa.

Las funciones `F_Clima_*` (desde `clima` 0.4.0) leen el clima y su
pronóstico; tampoco necesitan personaje. Los ids de combinación son los de
`clima` (1 Lluvia tóxica … 10 Frío extremo) y 0 es «ninguno»:

| Función | Devuelve |
|---|---|
| `F_Clima_Now(mapa$)` | la combinación activa en el mapa |
| `F_Clima_EndsIn(mapa$)` | segundos que le quedan, 0 sin evento |
| `F_Clima_Next(mapa$)` | la combinación del próximo evento, ya sorteada; 0 si aún no se sabe |
| `F_Clima_NextIn(mapa$)` | segundos hasta que puede empezar el próximo; -1 si el mapa no tiene clima |
| `F_Clima_Chance(mapa$)` | probabilidad (%) de que una revisión empiece un evento |
| `F_Clima_Name(id)`, `F_Clima_Gear(id)` | nombre de la combinación y el objeto que protege de ella |

## Regla común de grupo

Para que «en grupo» signifique lo mismo en todos los mods (base:
`expedition-board` 0.6.0):

- Solo cuenta dentro de un **grupo (party)** de rAthena; fuera de uno, cada
  uno lo suyo.
- Recibe crédito el miembro **conectado y en el mismo mapa** en el momento del
  hecho. No hay crédito diferido.
- El progreso y la recompensa son **individuales**: cada uno cobra lo suyo, no
  se reparte.
- Los compañeros de `companion-party-overhaul` cuentan como miembros del
  grupo; cada mod debe comprobar que no rompe con ellos.

## Temporizadores

Mientras el personaje está ocupado con un NPC, sus eventos esperan en una cola
de **2 huecos** y el resto se descarta
([`ARCHITECTURE.md`](./ARCHITECTURE.md#1-la-cola-de-eventos-del-personaje-2-huecos)).
Una cadena de `addtimer` que se vuelve a programar dentro de su evento muere
si ese evento se descarta, y un diálogo de unos segundos basta para eso (D22).
En orden de preferencia:

1. Ningún temporizador: reaccionar a eventos (`OnPCLoadMapEvent` con la
   mapflag `loadevent`, `OnNPCKillEvent`, `OnPCDieEvent`) y calcular el tiempo
   con `gettimetick(2)`.
2. **Un reloj del NPC por mod**, de 4 s o más: `initnpctimer` en `OnInit` y una
   etiqueta `OnTimerN` que vuelve a llamar a `initnpctimer` **lo primero** (un
   error de script más abajo no lo para) y recorre una lista de jugadores con
   `attachrid` … `detachrid`. `attachrid` entra aunque el personaje esté en un
   diálogo y no pasa por la cola. La lista guarda account ids (`getcharid(3)`):
   se rellena en `OnPCLoginEvent`, se vacía en `OnPCLogoutEvent` y suelta a
   quien `attachrid` ya no encuentra. Los bots del Population Engine no entran,
   porque no disparan `OnPCLoginEvent`. Se recorre de atrás adelante para poder
   quitar mientras tanto. Copia `S_Join`, `S_Leave` y `S_Drop` de `wounds` o
   `temperature`. Un ritmo más lento que el reloj se lleva con una hora
   prevista en una variable temporal (`@sv_need_at` en `survival`).
3. Nada de `addtimer` por personaje para algo que se repite.
4. Una entrada del diario o un aviso a otro mod desde el propio mod: con
   `callsub`, no con `doevent`. `doevent` desde un script en marcha **siempre**
   pasa por la cola, y tras un `detachrid` no se vacía hasta que termine otro
   script de ese personaje.
5. Nada de diálogos (`mes`), `sleep` ni `sleep2` en `OnPCLoginEvent`.

## Muertes de monstruos

`OnNPCKillEvent` corre con **cada** monstruo que muere a manos de un personaje,
incluidos los bots del Population Engine (hasta 1500 si la población está
encendida). La primera línea debe descartar rápido lo que no le interesa: un
contador global que vale 0 cuando nadie lo necesita, como `$@eb_hunters` en
`expedition-board`. Ver
[`ARCHITECTURE.md`](./ARCHITECTURE.md#2-los-bots-y-onnpckillevent).

## Mod store

64 KiB por personaje y por mod. Claves cortas, sin guardar dos veces lo mismo,
y un tope para todo lo que crece con el juego (entradas de diario,
experiencias). `adventure` comparte el límite con el diario que absorbe
([`ARCHITECTURE.md`](./ARCHITECTURE.md#3-la-capacidad-del-mod-store)).

## Plugins de cliente

- **Un solo `registerPass` por mod**, que junte todo lo suyo, con un
  interruptor en las opciones del mod.
- Nada de crear objetos ni tocar el DOM dentro de `uniforms()` o `render()`,
  que corren en cada fotograma.
- Las ventanas actualizan solo lo que cambió, no todo su HTML en cada tick.
- Probar en el equipo más débil donde se vaya a jugar (Steam Deck, móvil).

Detalle en [`ARCHITECTURE.md`](./ARCHITECTURE.md#4-el-cliente).

## Datos y scripts de build

Los datos que una persona edita (mapas, contratos, hitos, recetas) van en un
CSV en `registry/tools/<mod>/` con un script de **Node** (en esta máquina no
hay Python) que genera los archivos del mod. El mod entrega solo lo generado;
nada lee un archivo en tiempo de ejecución.

## Pruebas

- Cada README tiene una sección «Qué probar» o «Probarlo», y dice qué se probó
  en el juego y qué no.
- Cada mod debería tener un escenario de `scripts/rotest` repetible.
- La carga se confirma en `ragnarok-stack logs map 100`, no por la presencia
  del archivo en la configuración.

## Restricciones técnicas

Lo que rAthena y la app permiten o no, y qué consecuencia tiene para el diseño.

| Hallazgo | Consecuencia |
|---|---|
| Los rates son ajustes de la app. `conf/` solo permite `char_conf.txt`, `groups.yml` y `atcommands.yml`. | Un mod no puede cambiar los rates; van en el modpack ([`MODPACK.md`](./MODPACK.md)). Settings acepta rates menores a 1x escritos en la casilla. |
| `bonus_script` no apila duplicados del **mismo texto**; textos distintos sí se suman. | Cada mod tiene su propio `bonus_script`; el tope de presión se coordina con `@pr_*`. |
| `getexp` se multiplica por `quest_exp_rate` (verificado). | La EXP de experiencias se regula aparte de la de monstruos. |
| `skill "<Aegis>", <nv>, SKILL_PERM_GRANT` ignora el árbol de la clase y sobrevive a reset y cambio de clase (verificado en el código; sin probar en el juego). | Una experiencia puede enseñar una skill. |
| `OnPCLoadMapEvent` solo corre en mapas con la mapflag `loadevent`. | Detectar cambios de mapa sin temporizador. |
| `OnPCDieEvent` trae `killerrid` (verificado). | Heridas por asesino y némesis. |
| Las variables de personaje se leen desde cualquier NPC; el mod store no. | Datos compartidos con variables de personaje. |
| Las funciones de NPC (`callfunc`) son globales entre mods. | El atlas se consulta sin dependencia de carga. `callfunc` de una función inexistente falla: hace falta un valor de reserva. |
| Mod store (`modstore_*`) con alcance global, cuenta y personaje; 64 KiB por personaje y mod. | Para estado propio (experiencias vistas, reputación, refugios). |
| `db/` acepta las tablas con plantilla en `db/import-tmpl` de rAthena, entre ellas `mob_db.yml`, `skill_db.yml` y las `exp_*`. | El rebalanceo de monstruos y MVPs por región (D3) vive en mods, generado desde datos. |
| Lua engancha `skill()`, `item()` (`on_attack`, `on_hit_taken`, `on_use`), `status()` (estados propios con `tick`, stacks y `persist`) y `player()`. | Sigue sin haber durabilidad por objeto ni IA de monstruos vía Lua. Guía: `docs/mods/CUSTOM_SKILLS.md`. |
| `bonus_script` descarta un icono `>= EFST_MAX` (rAthena 8aea17a). Los iconos propios de mod (20000–22999) solo los lleva un `status()` de Lua. | Un icono nuevo para frío, heridas o hambre pasa por Lua, no por el script. |
| El prefijo de comandos es un ajuste del jugador (`@`, `!`, `.`, `-`) y no se lee con `getbattleflag`. `bindatcmd` funciona con cualquiera. | Nunca escribir `@` a mano en un texto: en el handler, `charat(.@atcmd_command$, 0)` es el prefijo tecleado. `.@` no cruza un `callsub`. `atcommand "@x"` desde script falla con otro prefijo. |
| Mapas custom necesitan `.gat/.gnd/.rsw` (hay editor en la app). | Los pasadizos empiezan reutilizando mapas existentes. |
| Un sprite de NPC mal escrito queda invisible sin error. | Validar cada sprite nuevo en el juego. |
| Los cambios de `db/` y `npc/` piden recargar mods; los de `client/` y `System/`, reiniciar la app. | Considerarlo al probar. |
| La app no tiene modpacks ni perfiles de mods. | El modpack es un documento ([`MODPACK.md`](./MODPACK.md)). |
| La cola de eventos del personaje tiene 2 huecos (`MAX_EVENTQUEUE`); los temporizadores por personaje son 32 (`MAX_EVENTTIMER`). | Ver «Temporizadores». |
| `explode` no devuelve nada: llena el array. | Contar con `getarraysize` después. Usar su resultado deja la variable vacía (`op_2: invalid data`, `Data: nothing`). |
| `getunitdata <GID>,<array>` llena un array con índices `UMOB_*`; no devuelve un campo. | Pasarle una constante como segundo argumento **tumba el map-server** (crash en `pc_setregistry`). Comprobar antes `getunittype(gid) == BL_MOB`. |
| `rand(1)` falla («range (0) is too small») y corta el comando. | Con una sola opción, no sortear. |
| `\|\|` y `&&` **no cortan** la evaluación: los dos lados se calculan siempre (`C_LOR`/`C_LAND` en `script.cpp`). | `if (.@n == 1 \|\| rand(.@n) == 0)` sigue llamando a `rand(1)`. Lo que no debe ejecutarse va en un `if` aparte. |
| `getnpcid` pide el tipo: `getnpcid(0, "<nombre>")`. | Sin él, el aviso `Expected number` y el resultado no sirve. |
| `"weather"` en `mod.json` es fijo durante la partida. El servidor puede encender el clima con `specialeffect2 EF_*`, pero roBrowser no procesa `ZC_REMOVE_EFFECT` y no se puede apagar. | Clima eventual: [`ARCHITECTURE.md`](./ARCHITECTURE.md#clima-eventual). |
| El día y noche de rAthena es binario y se configura en `battle_conf`. | Día y noche con un plugin: [`ARCHITECTURE.md`](./ARCHITECTURE.md#día-y-noche). |
| Los bots del Population Engine no disparan `OnPCLoginEvent` ni `OnPCLoadMapEvent`, pero sí `OnNPCKillEvent`. | Ver «Muertes de monstruos». |
