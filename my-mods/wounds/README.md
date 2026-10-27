# wounds: heridas y maldiciones con nombre

Prototipo en `my-mods/`.

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.7.0 (la de `mod.json`): las notas del diario van con `F_Adv_Note` de `adventure` 0.3 en vez de `doevent "TravelJournal::OnLog"`, así que no se pierden en un diálogo (con `adventure` 0.2 o anterior, `F_Wounds_Log` daría error: actualiza los dos juntos). Y para los **rasgos** de `adventure` 0.3. Con `adv_trait_tough` (Curtido por las heridas) cada herida resta un punto menos (mínimo 1, también las de %), después de la venda. Cada cura de verdad (posada, templo, némesis) llama a `F_Adv_Cured(id)`, que cuenta las curas distintas para ese rasgo; `@herida 0` (GM) no cuenta, porque `F_Wounds_Remove` acepta un segundo argumento `0`. Sin `adventure` no cambia nada. Sin probar en el juego. La 0.6.1: lee el clima activo con `F_Clima_Now` de `clima` (0.4.0 o posterior) en vez de las matrices internas de `Clima#clima`; mismo resultado. Y dos valores de prueba pasan a Settings (ver «Ajustes»); por defecto, igual que antes. La 0.6.0: dos enganches para [`campfire`](../campfire/README.md), sin efecto si no está. **Venda** (D29): `F_Wounds_Ease(id)` marca una herida (no una maldición) como vendada en `wd_eased$`, y su castigo queda a la mitad (mínimo 1) hasta curarla; `@heridas` la marca «(vendada)». **Descansado:** si `@cf_ward` es 1 y `@cf_rest_until` no ha pasado, la primera muerte fuera de una ciudad no deja herida y gasta `@cf_ward`. La 0.5.0: anota qué monstruo dejó cada herida (`wd_src$`, solo las de un monstruo) y expone `F_Wounds_CureFrom(clase)`, que quita todas las que dejó esa clase; la usa [`nemesis`](../nemesis/README.md) al vencerlo. Sin `nemesis` no cambia nada. Las heridas recibidas con una versión anterior no tienen origen y no se curan así. La 0.4.1: la primera vez que el personaje recibe cada herida o maldición publica un relato Medio en [`adventure`](../adventure/README.md) con `F_Adv_Experience` (clave `wound:<id>`, Tier del mapa), si `adventure` está activo; sin él no cambia nada. La 0.4.0: presión ([`BALANCE.md`](../BALANCE.md#tope-de-presión), D18). Publica `@pr_wounds` (número de heridas activas) y, si la presión total de todos los mods pasa de 6, reduce el efecto de cada herida en proporción (`× 6 / total`, mínimo 1 punto). La 0.3.1: El arreglo de `rand(1)` de la 0.3.0 no bastó: lo protegía `if (.@free == 1 || rand(.@free) == 0)`, pero en rAthena `||` evalúa los dos lados y `rand(1)` se seguía llamando. La 0.3.1 lo separa en dos `if`. La 0.3.0: el `addtimer` por personaje (`OnTick`) pasa a un solo reloj del NPC con `attachrid` (error `event queue is full`). Además arregla dos fallos que impedían recibir la herida al morir con la 0.2.2. El primero: `getnpcid("Clima#clima")` se llamaba sin el tipo y rAthena pide `getnpcid(0, "<nombre>")`. El segundo: `rand(1)` falla en rAthena («range (0) is too small») y cortaba el sorteo cuando quedaba una sola candidata libre. La 0.2.1 **tumbaba el map-server** al morir a manos de un monstruo: llamaba `getunitdata(gid, UDT_CLASS)`, pero `getunitdata` recibe un array donde escribe, y rAthena intentó escribir en la constante (crash en `pc_setregistry`, desde `buildin_getunitdata`). La 0.2.2 llena un array y lee `UMOB_CLASS`, y comprueba con `getunittype(...) == BL_MOB` que el asesino es un monstruo, en vez de adivinarlo por el tamaño del GID. La 0.2.0 usaba el resultado de `explode` como número de partes, pero en rAthena `explode` no devuelve nada (`.@n` quedaba vacío; log: `op_2: invalid data for operator C_GE`, `Data: nothing`). Por eso `@heridas` no listaba nada, morir no daba heridas, el Posadero decía «no se cura con una cama» y el Sacerdote solo ofrecía «Nada por ahora». La 0.2.1 cuenta con `getarraysize`. La 0.1.0 no cargó por un `switch` con cadenas
- **Probado en el juego (0.2.0, 2026-10-17):** el archivo carga; Posadero y Sacerdote aparecen en Prontera; `@heridas` sin heridas responde; `@herida 1` anota la herida
- **Probado en el juego (0.2.1, 2026-10-17):** la herida se guarda entre sesiones; `@heridas` la lista; *Cicatriz del lobo* resta AGI (unos 8) y se recupera al curarla; el Posadero y el Sacerdote curan y cobran zeny. Morir en `ice_dun02` tumbó el servidor (arreglado en 0.2.2)
- **Probado en el juego (0.2.2, 2026-10-17):** morir en `ice_dun02` ya no tumba el servidor; `killerrid` funciona (log: `killerrid 110028467 clase 1775 raza 0 nombre Snowier`, candidatas `5|2` de la raza informe). No dio herida por los dos fallos arreglados en 0.3.0
- **Probado en el juego (0.3.0, 2026-10-17):** la penalización sigue tras un diálogo largo (el reloj nuevo funciona); morir **no** quita una herida que ya tienes. Morir en `ice_dun02` (Snowier y Solid Snowier, raza informe) seguía sin dar herida por el `rand(1)` (arreglado en 0.3.1)
- **Probado en el juego (0.3.1, 2026-10-17):** morir en `ice_dun02` a manos de un monstruo da una de las heridas de su raza
- **Probado en el juego (0.3.1, 2026-10-17):** con 3 heridas, morir no da una cuarta; las notas del diario salen al recibir una herida y al curarla (posada y templo); morir en `prt_fild11` con un evento de clima activo, a manos de un Elusive Goblin, dio herida; el log muestra `candidatas 8|4|2 clima 2`: la herida del clima (Veneno latente, por Lluvia tóxica) entra en el sorteo
- **Probado en el juego (0.4.1, 2026-10-23),** con [`SESION-DE-PRUEBA.md`](../SESION-DE-PRUEBA.md): la herida por bioma (`@die` en `prt_fild08`, sin asesino; log `candidatas 5|2 clima 0`); el relato «Primera vez con …» de `adventure` justo después de «Has quedado marcado»; el Posadero cura sin contar los relatos (D26); el tope (dos heridas cuentan 2 en `@presion`, y la *Cicatriz del lobo* resta menos AGI con el tope)
- **Probado en el juego (0.6.1, 2026-10-23):** la herida de la marca: si la marca de `expedition-board` te mata, siempre deja *Marca de la presa* (log `marca 9`), y la marca no se vuelve tu némesis. El Posadero y el Sacerdote de Geffen, Payon, Morocc, Alberta y Aldebaran se ven y responden
- **Probado en el juego (0.5.0, 2026-10-23):** con «Probarlo» de [`nemesis`](../nemesis/README.md#probarlo): el origen de cada herida (`wd_src$`) y `F_Wounds_CureFrom`, que cierra las heridas del némesis vencido
- **Probado en el juego (0.7.0, 2026-10-24),** con «Probarlo» de [`campfire`](../campfire/README.md#probarlo): la venda deja la herida «(vendada)» y resta la mitad hasta curarla, no se ofrece para una herida ya vendada ni para una maldición, y una herida curada y vuelta a recibir sale sin vendar. Con Descansado, la primera muerte fuera de una ciudad no deja herida («Ibas descansado…») y la segunda sí
- **Probado en el juego (0.7.0, 2026-10-26):** las notas con `F_Adv_Note` (la herida y la cura salen en la pestaña Diario de `adventure`, como mucho tras el siguiente cambio de mapa); con 3 heridas distintas curadas en el Posadero o el Sacerdote, el rasgo **Curtido por las heridas** de `adventure`, y luego una herida de atributo resta un punto menos
- **Actualizado:** 2026-10-26

Morir fuera de una ciudad puede dejar una secuela con nombre ("Cicatriz del
lobo", "Maldición sombría") que debilita al personaje hasta que se cura en una
posada o en el templo. Una herida **debilita, no impide jugar**: solo resta un
atributo o HP/SP máximos; nunca bloquea movimiento, combate ni el acceso a una
ciudad.

## Qué hace

- **Origen: morir fuera de una ciudad** (`OnPCDieEvent`; 100 % de las veces,
  valor de prueba). Máximo de **3 a la vez**; no repite una que ya tiene.
- **Qué herida (0.2.0), por prioridad:**
  1. **Tu propia marca** de `expedition-board` te mató → *Marca de la presa*
     (siempre esa).
  2. **Quién te mató** (`killerrid`): la raza del monstruo da dos candidatas.
  3. Si no se sabe quién (trampa, estado, jugador): el **bioma** del mapa
     (`F_Atlas_Biome`); sin atlas, una genérica.
  4. Si hay un **evento de `clima`** activo en ese mapa y deja herida, esa
     herida se suma a las candidatas y se sortea entre todas.
- **Ciudades:** sin heridas al morir en las siete principales (usa
  `F_Atlas_IsSafe` si el atlas está, y además su propia lista `.safe_maps$`).
- **Se guardan** en la variable permanente `wd_list$` ("1|5") y siguen al
  volver a entrar.
- **Registro:** al recibir o curar una herida deja una nota en el diario de `adventure`
  (si está activo).

| id | Nombre | Tipo | Efecto | Bioma |
|---|---|---|---|---|
| 1 | Cicatriz del lobo | herida | AGI | bosque, pradera |
| 2 | Veneno latente | herida | VIT | selva, pantano |
| 3 | Insolación | herida | INT | desierto, volcán, costa |
| 4 | Manos entumecidas | herida | DEX | nieve, montaña |
| 5 | Costillas rotas | herida | HP máx −10 % | genérica, selva, pantano, desierto, volcán, nieve, montaña |
| 6 | Mente nublada | **maldición** | SP máx −10 % | cueva, ruinas |
| 7 | Maldición sombría | **maldición** | LUK | cueva, ruinas |
| 8 | Brazo magullado | herida | STR | genérica, bosque, pradera, costa |
| 9 | Marca de la presa | herida | Flee y Hit | solo la marca propia de expedition-board |
| 10 | Frío en los huesos | herida | AGI y DEX | clima: Ventisca, Frío extremo |

Los atributos bajan `2 + nivel base / 10` puntos (máximo 14).

### Qué da cada origen

| Mató / clima activo | Candidatas |
|---|---|
| Raza informe | 5 Costillas rotas, 2 Veneno latente |
| No-muerto, demonio | 7 Maldición sombría, 6 Mente nublada |
| Bruto | 1 Cicatriz del lobo, 5 Costillas rotas |
| Planta, insecto | 2 Veneno latente, 8 Brazo magullado |
| Pez | 3 Insolación, 5 Costillas rotas |
| Humanoide | 8 Brazo magullado, 4 Manos entumecidas |
| Ángel | 6 Mente nublada, 3 Insolación |
| Dragón | 5 Costillas rotas, 8 Brazo magullado |
| Clima: lluvia tóxica / vapores | suma 2 Veneno latente |
| Clima: ventisca / frío extremo | suma 10 Frío en los huesos |
| Clima: neblina densa | suma 6 Mente nublada |
| Clima: tierra maldita | suma 7 Maldición sombría |
| Clima: calor intenso | suma 3 Insolación |
| Clima: terreno fangoso / polen / hojas | no suman |

En el código: `.race$[]` y `.clima_wound[]` en `OnInit` de `wounds_mgr`.

## Curación (siete ciudades)

Cada ciudad tiene los dos NPC a unas celdas del tablero de `expedition-board`:

| NPC | Cura | Precio |
|---|---|---|
| **Posadero** | todas las *heridas* de una vez (no las maldiciones) y recupera HP/SP | `150 + nivel × 10` zeny **por herida** |
| **Sacerdote del Templo** | **una** a elegir, herida o maldición | herida `100 + nivel × 6`; maldición `300 + nivel × 15` |

Las maldiciones solo las cura el templo.

## Cómo conviven con `survival`

Las heridas usan su **propio** `bonus_script` (texto distinto del de
`survival`), así que se suman a los de hambre y sed en vez de reemplazarse.
Desde `survival` 1.2.0 los dos castigan ejes distintos (`survival` ya no
resta atributos), y los dos respetan el **tope de presión**: `wounds` lee
`@pr_survival`, `@pr_temp` y `@pr_clima`, publica `@pr_wounds` y, con más
de 6 en total, multiplica el efecto de cada herida por `6 / total` (mínimo
1). `.pr_cap` en `OnInit` debe valer lo mismo en los tres mods. Se renueva cada 4 s con **un
solo reloj del NPC** para todos los personajes (`OnTimer4000` de `wounds_mgr`),
que entra en cada uno con `attachrid` y solo hace algo si tiene heridas. No usa
`addtimer` por personaje: esas cadenas morían durante los diálogos (ver
[`CONVENTIONS.md`](../CONVENTIONS.md#temporizadores)).

## Ajustes

En Settings → Mods → `wounds`; cambian al pulsar **Apply**. Son valores de
prueba.

| Ajuste | Por defecto | Qué cambia |
|---|---:|---|
| `death_chance` | 100 | % de que una muerte fuera de una ciudad deje herida |
| `price_pct` | 100 | escala lo que cobran el Posadero y el Sacerdote (mínimo 10) |

El rasgo **Curtido por las heridas** de `adventure` (`adv_trait_tough`) resta
un punto a cada herida; cuántas curas distintas pide es un ajuste de
`adventure` (`tough_cures`).

## Comandos

- `@heridas`: lista las heridas del personaje.
- `@herida <id>` (GM): se la da; `@herida 0` las quita todas. Para pruebas.
  Una herida dada así no tiene origen: `nemesis` no la cura.

## Para otros mods

`F_Wounds_CureFrom(clase)`, con el personaje adjunto, quita todas las heridas
y maldiciones que dejó un monstruo de esa clase y devuelve cuántas. Comprueba
antes `getnpcid(0, "wounds_mgr")`. Las demás `F_Wounds_*` también son
globales; `wd_src$` (`id:clase|…`) es interna.

`F_Wounds_Ease(id)` (0.6.0) venda una herida, que penaliza la mitad hasta
curarla, y devuelve 1 si lo hizo; `F_Wounds_IsEased(id)` dice si ya lo está.
La usa `campfire`. `wd_eased$` (`id|…`) es interna.

Descansado de `campfire`: `wounds` lee `@cf_ward` y `@cf_rest_until` en
`OnPCDieEvent` y pone `@cf_ward` a 0 al gastarlo.

## Qué falta (en este orden)

1. **Probar en el juego** cada origen (ver abajo) y confirmar los puntos sin
   verificar.
2. Que las heridas se vean mejor en el cliente (un icono o ventana); hoy solo
   hay `@heridas`, mensajes y el diario.
3. Ajustes (`chance`, máximo, precios) como opciones del mod si hace falta.
4. Apagar el diagnóstico (`.debug = 0` en `OnInit`) cuando todo esté probado.

### Próximos cambios propuestos (revisión 2026-10-17)

Sin implementar. El porqué está en [`BALANCE.md`](../BALANCE.md) y
[`ADVENTURE.md`](../ADVENTURE.md).

- **Probabilidad:** con el 100 % actual, morir equivale a herida. Bajarla
  (valor por decidir) y añadir **casi morir** (bajar del 10 % de HP fuera de la
  ciudad) como origen.
- **Venda:** objeto que estabiliza una herida (la cura a medias). Mejor junto
  a una fogata de `campfire`.
- **Dos jugadores:** un Acólito o Priest del grupo puede curar maldiciones sin
  ir al templo.
- **Curanderos en interiores:** el Posadero en la posada de cada ciudad y el
  Sacerdote en su iglesia, no junto al tablero. Comprobar coordenadas en el
  juego.
- **Descansado:** dormir en la posada protege de la primera herida de la
  siguiente expedición.
- **Contar los relatos:** dormir con el Posadero llama a
  `doevent "Adventure::OnRest"`, que cobra la EXP pendiente de `adventure`
  (dependencia suave).
- **Lo que no te mata:** curar una herida por primera vez da un rasgo pequeño
  frente a su origen; curar 3 distintas da `adv_trait_tough` (las heridas
  restan 1 punto menos).
- **Experiencia:** la primera vez que se recibe cada herida, `wound:<id>`
  (Media), con `doevent "Adventure::OnExperience"`.
- **Némesis:** vencer a tu némesis cura su cicatriz.

## Suposiciones que hay que comprobar en el juego

- Los sprites `4_M_MERCAT1` (posadero) y `4_M_JOB_WIZARD` (sacerdote) existen
  en roBrowser; un sprite mal escrito deja el NPC invisible sin error. Cambia
  el sprite por uno de sacerdote/posadero si no convencen.
- Las celdas de los NPC (tablero + 4 y + 6 en x) son transitables; solo las de
  Prontera se miraron por analogía. No hay verificación contra los `.gat`.
- `bonus_script ..., 5, 1032` (flag 1024 sustituye el idéntico + 8 quita al
  cerrar sesión) es el mismo patrón que `survival` y `refine-matk`.
- **`killerrid`**: documentado en `OnPCDieEvent` (doc/script_commands.txt del rAthena fijado). Antes se tomó de memoria (no estaba el código
  en este checkout). Con `.debug = 1` cada muerte escribe una línea
  `[wddebug]` con `killerrid`, clase y raza. Si `killerrid` sale siempre 0 o la
  clase/raza no cuadra, el origen "quién mató" no funciona y cae en el bioma;
  no rompe nada.
- **Clima**: lee el evento activo del mapa con `F_Clima_Now` (`clima` 0.4.0 o
  posterior). Los ids de combinación son los de `clima`: si los reordena, hay
  que actualizar `.clima_wound[]`.
- **expedition-board**: lee `$@eb_mark[char_id]`, la variable de servidor que ese
  mod documenta.
- `@herida` usa `bindatcmd` con nivel de grupo mínimo 1: ajusta si tu cuenta de
  pruebas no lo alcanza.

## Cómo probarlo

Tras cambiar `npc/` hay que recargar los mods o reiniciar el servidor. Con el
mod cargado, `ragnarok-stack logs map 100` no debe mostrar errores de
`wounds.txt` (un error de sintaxis detiene la carga del archivo completo).
Usa un personaje GM (`tester`).

**Base (0.1.0)**
1. `@herida 1`: AGI baja en ~4 s; `@heridas` la lista; `@herida 0` las quita
   (el efecto desaparece en ~5 s).
2. `@die` en un campo: aparece una herida y una nota en el diario (Alt+J).
   `@die` en Prontera: nada.
3. Posadero (Prontera 164,193): cura las heridas, deja las maldiciones, cobra
   zeny. Sacerdote (166,193): menú con las heridas y su precio.
4. Cierra sesión con una herida y vuelve: sigue activa.
5. Con tres heridas, otra muerte no suma una cuarta.

**Quién te mató (0.2.0)**
6. `@die` en un campo, o deja que un monstruo te mate. Mira
   `ragnarok-stack logs map 200 | grep wddebug`: debe decir `killerrid` con un
   número grande, la clase y la raza del monstruo. La herida recibida debe estar
   en la fila de esa raza de la tabla. La nota del diario dice "a manos de: <monstruo>".
7. Muere por algo que no es un monstruo (p. ej. un veneno sin asesino): el log
   dice "no es un monstruo o no se conoce" y la herida sale por bioma.

**Clima**
8. Espera a que `clima` inicie un evento en un campo (los logs `[clima] Evento
   ... iniciado en <mapa>`), entra y muere ahí. El log `[wddebug] candidatas`
   debe mostrar `clima <id>` distinto de 0 y esa herida debe poder salir
   (repite varias veces, es un sorteo). Sin evento activo, `clima 0`.

**Marca de expedition-board**
9. Acepta una marca en el tablero, ve a su mapa y deja que **ella** te mate: el
   log debe decir `marca 9` y recibes *Marca de la presa* siempre. Si te mata
   otro monstruo, no.

**Sin dependencias**
10. Desactiva `world-atlas`, `clima` y `adventure` y repite 1 a 3: sin
    errores de script (el bioma cae en genérica, el clima en 0, el diario se omite).

## Instalación

Copia la carpeta `wounds/` a los mods. Al actualizar, reemplaza la carpeta
completa. No hay dependencias de carga (`world-atlas` y `adventure` son
suaves).
