# Funciones nuevas de la plataforma, por aprovechar

Lo que trajo upstream entre la 1.6.5 y la 1.7.0 y todavía no usamos, con lo
investigado para decidir. Nada de esto está hecho ni probado: es para revisar.
El resumen de la revisión está en [`UPSTREAM-NOTES.md`](./UPSTREAM-NOTES.md);
lo que se decida pasa a [`DECISIONS.md`](./DECISIONS.md) y el orden a
[`ROADMAP.md`](./ROADMAP.md).

Lo comprobado en el código lo es contra el rAthena fijado (`8aea17a`,
`src/map/skill_lua.cpp` y `script.cpp`); lo que dice «sin probar» no se ha
visto en el juego.

| Función | Para qué mods | Prioridad |
|---|---|---|
| [Iconos de estado propios](#1-iconos-de-estado-propios) | `temperature`, `wounds`, `survival`, `campfire` | **alta**: la que más interesa |
| [Logros propios](#2-logros-propios) | `adventure`, `nemesis`, `refuges` | media |
| [Música desde un script](#3-música-desde-un-script-playbgm) | `campfire`, `refuges`, `tavern-rumors` | baja, fácil |
| [`item()` con `on_use`](#4-item-con-on_use) | `survival` | con la fusión D31 |
| [`F_ClientInfo`](#5-f_clientinfo) | `world-atlas`, `refuges` | cuando haga falta |
| [Mapas y monstruos nuevos](#6-mapas-y-monstruos-nuevos) | `world-atlas`, `dungeon-chest` | H3 |

---

## 1. Iconos de estado propios

### El problema hoy

- `temperature` enciende `EFST_COLD` y `EFST_OVERHEAT` con un `bonus_script`
  aparte, de texto fijo, solo para el icono
  ([`temperature.txt`](./temperature/npc/temperature.txt), `S_Apply`).
  `EFST_COLD` es el icono de **Cristalización**: el cliente lo nombra así al
  pasar el ratón, y si el jugador cristaliza de verdad, uno tapa al otro.
- `wounds` y `survival` no tienen icono. El hambre y la sed se ven en el
  widget del cliente de `survival` (`client/index.js`); las heridas, solo con
  `@heridas` y los mensajes.
- El tooltip de un icono prestado dice lo que dice el cliente, no lo que hace
  nuestro estado.

### Lo que ofrece la plataforma (1.6.9, corregido en 1.7.0)

Un mod puede tener iconos que el cliente nunca ha tenido, con **imagen,
nombre y tooltip propios**, numerados de **20000 a 22999**. El servidor manda
el número tal cual y el cliente lo dibuja con su número de stacks. Guía:
[`docs/mods/CUSTOM_SKILLS.md`](../docs/mods/CUSTOM_SKILLS.md#a-status-icon-of-your-own).

Son tres tablas de cliente con solo nuestras filas (se suman a las del
cliente, no las reemplazan), más la imagen:

```
<mod>/data/luafiles514/lua files/stateicon/
    efstids.lub            el nombre: EFST_TP_FRIO = 20500
    stateiconimginfo.lub   la imagen, un archivo de data/texture/effect/
    stateiconinfo.lub      el tooltip: titulo, tiempo restante, lineas
<mod>/data/texture/effect/
    tp_frio.tga            24x24 (opcional: se puede usar una imagen del cliente)
```

### La restricción: solo desde Lua

**`bonus_script` no sirve** (comprobado): `BUILDIN_FUNC(bonus_script)`
descarta todo icono `>= EFST_MAX`, que está por debajo de 2000. Tampoco hay un
comando de script que ponga un estado de Lua. El icono propio solo lo lleva un
`status()` de Lua, y lo pone `c:apply_status(...)` desde un hook.

Nuestros mods deciden el estado en el NPC script (temporizadores, mapa, ropa,
fogatas), así que hace falta un **puente script → Lua**.

### El puente propuesto

1. **El script escribe** el estado en el char store del mod, solo cuando
   cambia: `modstore_set "char", "icon.feel", .@feel;`. El script y el Lua de
   un mismo mod comparten store ([`docs/MOD_STORE.md`](../docs/MOD_STORE.md#from-a-lua-hook)).
2. **Un hook de Lua lo lee cada segundo** y pone o quita el estado con icono.

Para el punto 2 hace falta algo que corra cada segundo por jugador. `player()`
no tiene `tick` (solo `base_stat` y `cast_dex`). Lo que sí lo tiene es el hook
de **quien ha aprendido una skill**: `skill("<Aegis>", { tick = ... })` corre
cada segundo para cada jugador conectado y vivo que la tenga a nivel > 0
(`skill_lua_tick` y `for_each_learned`; comprobado). Vale también para skills
de serie, así que no hace falta inventar una:

- **`NV_BASIC`** (Habilidad básica): la tiene casi todo el mundo.
- **`SU_BASIC_SKILL`**: el equivalente de los Doram, que no tienen `NV_BASIC`.
- Queda fuera un Novice con Habilidad básica a 0 (el personaje recién
  creado, hasta que pone puntos). Si eso importa, ver la alternativa de abajo.

Varios mods pueden engancharse a `NV_BASIC` a la vez: los hooks de distintos
mods se encadenan por `priority`, no se pisan (`docs/MODDING.md`, «A mod that
registers twice…»).

Alternativa descartada por ahora: una pasiva oculta propia (id 3100–4999)
concedida con `skill "<Aegis>", 1, SKILL_PERM_GRANT` al entrar. Cubre al
Novice, pero se ve en la ventana de skills y gasta un id; solo si el Novice
importa.

### Boceto, para `temperature`

Un estado por nivel, con su icono y su tooltip, en vez de un estado con
stacks: el tooltip puede decir el castigo exacto, y no hay que cuadrar stacks
(sumar con `apply_status` y restar con `remove_status` en el mismo tick puede
parpadear).

```lua
-- temperature/lua/iconos.lua
-- La duracion corta hace de red: si el script deja de escribir (mod apagado,
-- error), el icono se va solo en 3 s.
local ICONOS = {
  [-3] = "TP_CONGELADO", [-2] = "TP_HELADO",
  [2] = "TP_ACALORADO",  [3] = "TP_SOFOCADO",
}
status("TP_CONGELADO", { icon = 20500, duration = 3000 })
status("TP_HELADO",    { icon = 20501, duration = 3000 })
status("TP_ACALORADO", { icon = 20502, duration = 3000 })
status("TP_SOFOCADO",  { icon = 20503, duration = 3000 })

local function sync(c)
  local quiero = ICONOS[store.char(c.caster).get("icon.feel", 0)]
  for _, nombre in pairs(ICONOS) do
    if nombre == quiero then
      c:apply_status(nombre, { duration = 3000 })   -- renueva la duracion
    elseif c.caster:has_status(nombre) then
      c:remove_status(nombre)
    end
  end
end

skill("NV_BASIC",       { tick = sync })
skill("SU_BASIC_SKILL", { tick = sync })
```

```lua
-- data/luafiles514/lua files/stateicon/efstids.lub
EFST_IDs = {
	EFST_TP_CONGELADO = 20500,
	EFST_TP_HELADO = 20501,
	EFST_TP_ACALORADO = 20502,
	EFST_TP_SOFOCADO = 20503,
}
```

```lua
-- data/luafiles514/lua files/stateicon/stateiconinfo.lub
StateIconList = {}
StateIconList[EFST_IDs.EFST_TP_HELADO] = {
	haveTimeLimit = 0,
	descript = {
		{ "Helado", COLOR_TITLE_DEBUFF },
		{ "Necesitas abrigo o un sitio templado." },
		{ "AGI reducida." },
	},
}
```

En el script, `S_Apply` cambia la línea del `bonus_script` con `EFST_COLD` /
`EFST_OVERHEAT` por un `modstore_set` cuando `.@feel` cambia (ya lo detecta
con `@tp_last`). El castigo sigue en sus `bonus_script` de siempre: el icono
es solo el aviso. Moverlo al `bonus(c)` del estado es otro paso (ver fases).

### Qué icono para cada mod

Bloque propuesto para todos nuestros mods: **20500–20599** (el 20000–20099 es
de `transcendent-third-classes`; comprobar la tabla de bloques de
`CUSTOM_SKILLS.md` antes de fijarlo y apuntarlo en `CONVENTIONS.md`).

| Números | Mod | Estados | Tooltip |
|---|---|---|---|
| 20500–20509 | `temperature` | Helado, Congelado, Acalorado, Sofocado; quizá «Bien abrigado» (el +3 % de HP/SP de `feel == 0`) | el castigo del nivel |
| 20510–20529 | `wounds` | uno por tipo de herida, o uno «Herido» con stacks = número de heridas | qué herida y cómo se cura |
| 20530–20539 | `survival` | Hambriento / Famélico, Sediento / Deshidratado | etapa y castigo |
| 20540–20544 | `campfire` | «Junto al fuego» | qué protege |
| 20545–20549 | `clima` | expuesto a la tormenta, si no basta el clima visible | — |

`wounds` es el que más gana: hoy no tiene nada a la vista, y con stacks el
icono dice cuántas heridas llevas.

### Imágenes

- **Primero, sin dibujar nada**: un número nuestro con la imagen de un icono
  del cliente (la de `EFST_COLD` para el frío). Ya se quita el nombre
  «Cristalización» y el choque con el estado real. Hay que sacar el nombre del
  archivo de `stateiconimginfo.lub` del cliente; las imágenes de serie tienen
  nombre coreano, y nuestro `.lub` tiene que escribirlo en **CP949**.
- **Después**, TGA propios de 24x24 en `data/texture/effect/`.
- Textos del tooltip **sin acentos ni eñes**, como en `itemInfo` (el cliente
  lee los `.lub` en su codepage; ver `dungeon-chest/README.md`). Comprobarlo
  con el primero.

### Fases

1. **Prueba de concepto** en `temperature`, con un solo icono (Helado) e
   imagen de serie. Comprobar con `scripts/rotest` (y `shot`):
   - que el `tick` en `NV_BASIC` corre (un `log()` en el hook);
   - que `store.char(c.caster).get` ve lo que escribió el script;
   - que el icono sale con su tooltip, en cliente iRO y kRO;
   - qué pasa al morir (el `tick` no corre muerto y el estado acaba con la
     muerte; tiene que volver al revivir) y al cambiar de mapa.
2. **`temperature` entero**, quitando los `bonus_script` con `EFST_COLD` y
   `EFST_OVERHEAT`.
3. **`wounds`, `survival`, `campfire`**, cada uno con su `lua/` y sus tablas.
4. **Con la fusión D31** y el panel del viajero (ROADMAP, «Frentes
   abiertos»): decidir si el castigo pasa al `bonus(c)` del estado y se
   retiran los `bonus_script` que se renuevan cada 4–5 s. Ganaría un único
   reloj; obliga a rehacer las pruebas de los tres mods.

### A tener en cuenta

- Los mods que lo usen piden **`"requires": { "app": ">=1.7.0" }`**: en la
  1.6.9 un icono propio paraba el login en el 97 % con cliente iRO.
- El cliente dibuja iconos solo del **propio personaje**. Para el grupo no
  sirve.
- El store de cada mod es suyo: el Lua de `temperature` lee el store de
  `temperature`. Con la fusión, un solo store.
- Coste: una lectura del store por jugador, por segundo y por mod. Pequeño,
  pero cuenta para el límite de instrucciones del hook.
- No usar la ruta `_statuses` del store: es la de los estados `persist`.
- Un archivo de Lua con un error se queda fuera **entero**; si los iconos van
  en su propio archivo, un error en ellos no se lleva otra lógica.

---

## 2. Logros propios

Desde la 1.6.7 un mod añade logros a la ventana de logros (**Alt+K**) sin
reemplazar los del cliente. Guía:
[`docs/mods/CUSTOM_ACHIEVEMENTS.md`](../docs/mods/CUSTOM_ACHIEVEMENTS.md);
ejemplo: `examples/mods/custom-achievement`.

- Tres piezas unidas por el id: `db/achievement_db.yml` (servidor),
  `System/achievement_list.lub` (lo que se ve) y un script que lo completa.
- Lo nuestro no lo cuenta rAthena solo, así que va con `Group: None` y
  `achievementcomplete <id>;` desde el script. La ventana **no muestra
  contadores**: el progreso lo llevamos nosotros y completamos al llegar.
- Ids desde **900000**, un bloque de 1000 por mod (`900000 + 1000 × n`),
  apuntado en el README del mod. Nunca reutilizar un id.
- Las pestañas son las del cliente: Aventura (con «Mazmorra»), Batalla, Hazaña…
  No se pueden crear.
- La recompensa se reclama en la ventana y llega por correo.

Ideas, para decidir con `ADVENTURE.md` (que no compitan con la EXP de las
experiencias):

| Mod | Logros |
|---|---|
| `adventure` | primera expedición; N expediciones; N relatos contados; volver de una expedición de X horas |
| `nemesis` | vencer a tu primer némesis; a uno de rango 3 |
| `refuges` | ayudar a restaurar un refugio; verlo en la etapa 3 |
| `dungeon-chest` | abrir el primer cofre de cada Tier |

Hace falta app ≥ 1.6.7.

---

## 3. Música desde un script (`playBGM`)

Desde la 1.6.7 `playBGM` llega al cliente: `playBGM "<pista>";` para el
jugador, `playBGMall` para un mapa o un rectángulo. Suena hasta que cambia de
mapa. Pistas del cliente por nombre (`"08"` es Prontera) o un `.mp3` del mod
en `BGM/`. Detalles en `docs/MODDING.md`, «Playing a track from a script».

- `campfire`: una pista tranquila al sentarse junto a la fogata.
- `refuges`: al restaurar un refugio (`playBGMall` en su rectángulo) o al
  descansar en él.
- `tavern-rumors`: música de taberna dentro.

Decidir: qué pistas del cliente encajan (el navegador de música del editor
de mapas las lista) y cuándo se devuelve la del mapa. Un `.mp3` propio pide
revisar su licencia.

---

## 4. `item()` con `on_use`

`item("<AegisName>", { on_use = function(c) ... end })` corre justo antes del
script del objeto usado, y `c.item` dice cuál. Para `survival` permitiría que
la comida y el agua actúen desde Lua (con `store` para el hambre y la sed).
Solo tiene sentido si la fusión D31 pasa parte de la lógica a Lua; por sí solo,
el `Script` del `item_db.yml` ya basta.

## 5. `F_ClientInfo`

`callfunc("F_ClientInfo", "client" | "fallback" | "client_date" |
"fallback_date")` dice el cliente del host y su GRF de reserva. Sirve para
ofrecer algo solo si está su arte: un NPC con sprite de kRO, o un mapa nuevo
en `world-atlas` que un cliente iRO no tiene. Usarlo cuando aparezca el caso.

## 6. Mapas y monstruos nuevos

La 1.6.6 abrió 105 mapas oficiales (Abyss, Biosphere, zonas seguras del
capítulo 2, templo de Jormungandr…) y 458 monstruos; la 1.6.9 dio botín a 124
de los mapas nuevos que no soltaban nada. Entran en `world-atlas` (Tier de
cada mapa) y en `loot_biomes.csv` de `dungeon-chest` al llegar a H3.
`mods/navigation-server-monsters/mob-index.tsv` ya los incluye.
