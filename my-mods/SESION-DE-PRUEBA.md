# Sesión de prueba

Guion de lo que **queda por probar en el juego**, sacado de la sección «Estado»
de cada README (revisado el 2026-10-23). Lo ya probado no está aquí: está en
el «Estado» de cada mod, y el guion de la sesión larga del 2026-10-17 al
2026-10-23 sigue en el historial de git.

Calcula unos 60 minutos. Los pasos van de lo más rápido a lo que pide
esperar un evento de clima. Si este guion y un README no coinciden, manda el
README. Apunta lo que no coincida en la tabla del final y, al terminar, pasa
los resultados a «Estado» y borra los pasos hechos.

## Antes de entrar

**Limpia la instalación** (Settings → Mods), según el `enabled.txt` del
2026-10-23:

- [ ] **Desinstala** `travel-journal` y `world-atlas-test`: ya no existen en
      `my-mods/`. `adventure` trae el diario y `world-atlas` trae `@atlas`.
- [ ] **Apaga** `affix-forge` y `arpg-equipments`: son referencia y no deben
      cargar. `arpg-equipments` deja errores en el log (`Reset Girl`,
      `F_SNPC_Off`). Enciéndelo solo un momento si necesitas quitarle a
      `tester` los objetos 55001.
- [ ] Comprueba que tienes instaladas `world-atlas` 0.2.1, `clima` 0.4.1,
      `wounds` 0.5.0, `nemesis` 0.1.0 y `tavern-rumors` 0.1.0 (reemplaza la
      carpeta entera, no copies encima).
- [ ] Recarga los mods. `ragnarok-stack logs map 200`: sin errores de
      ningún mod de `my-mods/` y sin `Duplicate unique name`.

**Rates (D8):** `quest_exp_rate` ya está a 1x, pero `base_exp_rate`,
`job_exp_rate` y los drops siguen a **50x** en Settings. Para estas pruebas da
igual; para medir el balance de H1 tienen que estar a 1x.

**Personaje:** `tester` / `tester123`, con comandos de GM. No uses la cuenta
`ragnarok`.

**Lo que vas a necesitar:**

| Objeto | ID | Para qué |
|---|---:|---|
| Cantimplora vacía | 50837 | el agua medida del atlas |
| Abrigo Polar (de `clima`) | 50833 | quitarse y ponerse el frío |

| Comando | Qué hace |
|---|---|
| `@atlas [mapa]` | lo que dice el atlas de un mapa (GM); sin mapa, el actual |
| `@mapinfo 2` | los NPC del mapa con sus coordenadas (para los cofres) |
| `@presion` | presión de cada sistema, total y si actúa el tope |
| `@temperatura` | estado de temperatura y su desglose |
| `@heridas` | heridas actuales |
| `@relatos` | expedición en curso y relatos sin contar |

## 1. `@atlas` y el agua (`world-atlas` 0.2.1, `survival`)

- [ ] `@atlas prontera`: `has=1 safe=1 kind=city`. `@atlas` sin mapa da el
      del mapa donde estás.
- [ ] `@atlas izlu2dun` dice `water=0`; `@atlas prt_fild00`, `water=1`.
- [ ] `@warp prt_fild00 267 240` y usa la Cantimplora vacía: «Llenas la
      cantimplora con agua fresca.» En `izlu2dun` debe decir que no hay agua.

## 2. Los cofres nuevos (`dungeon-chest` 0.3.0)

En cada mapa, `@mapinfo 2`, busca el cofre en la lista y
`@warp <mapa> <x> <y>` a su lado. Ábrelo.

| Mapa | Cofre | Debe dar | ✓ |
|---|---|---|---|
| `prt_prison` | `Cofre T5` | Lutie Lady's Pancake | |
| `prt_mz03_i` | `Cofre T6` | Shiny Marinade Beef | |
| `iz_d04_i` | `Cofre T5` | Lutie Lady's Pancake | |
| `iz_d05_i` | `Cofre T6` | Shiny Marinade Beef | |

Si `@warp` no entra a un mapa de instancia (`*_i`), apúntalo y sigue.

## 3. Ronda por las siete ciudades

Junto al tablero de cada ciudad hay una fila de NPC, de izquierda a derecha:
Cronista (`adventure`), tablero e Intendente (`expedition-board`), Posadero y
Sacerdote (`wounds`). Solo se probaron los de Prontera e Izlude.

| Ciudad | `@warp` | Cronista | Tablero | Intendente | Posadero | Sacerdote | ✓ |
|---|---|---|---|---|---|---|---|
| Geffen | `geffen 121 34` | 117,37 | 119,37 | 121,37 | 123,37 | 125,37 | |
| Payon | `payon 190 104` | 186,110 | 188,110 | 190,110 | 192,110 | 194,110 | |
| Morocc | `morocc 162 82` | 158,85 | 160,85 | 162,85 | 164,85 | 166,85 | |
| Alberta | `alberta 192 141` | 188,144 | 190,144 | 192,144 | 194,144 | 196,144 | |
| Aldebaran | `aldebaran 141 122` | 137,125 | 139,125 | 141,125 | 143,125 | 145,125 | |

En cada una: los cinco se ven y responden. Si uno está en una celda
bloqueada o no se ve, apunta `/where` de un sitio libre al lado. **En Payon**
el tablero (188,110) y el Intendente (190,110) caen sobre celdas no
caminables según el mapa: comprueba sobre todo que se les puede hablar.

## 4. La herida de la marca (`wounds` 0.5.0, `expedition-board`)

- [ ] Acepta una marca en el tablero de Prontera («Rastro en el campo sur»),
      ve a su mapa y deja que **la marca** te mate.
- [ ] Recibes siempre *Marca de la presa*, y el log dice `marca 9`
      (`ragnarok-stack logs map 200 | grep wddebug`).
- [ ] La marca no se vuelve tu némesis (`@nemesis`).

## 5. Contratos de Tier 2 (`expedition-board` 0.6.1)

Las cacerías de Tier 2 (ids 15 a 21) salen en el tablero a cualquier nivel.

- [ ] En Prontera, acepta «Goblins del camino este»: 12 Goblins en
      `prt_fild11` (Tier 2).
- [ ] Al cobrarla en el tablero: **3125 zeny**, no los 2500 del CSV (+25 %
      por cada Tier por encima del 1, `F_Expedition_Zeny`).

## 6. Clima con presión y frío (`clima`, `temperature`, `survival`)

Para estos pasos hace falta un evento concreto. Pregunta antes al
Pronosticador (`prontera 168,193`, «Otras tierras») cuándo llega.

- [ ] **Ventisca en `xmas_fild01`**, sin Abrigo Polar ni Capa de Piel:
      - el estado pasa de Helado a **Congelado**, y el icono de frío sigue
        puesto al cambiar;
      - `@presion` cuenta **clima 1** (`@pr_clima`) y suma al total;
      - vuelve a Prontera: el icono de frío se apaga unos 5 s después.
- [ ] **Frío extremo en `mjolnir_12`** sin protección: el hambre baja
      **2** puntos cada 15 s en vez de 1. **Calor intenso en `moc_fild11`**:
      lo mismo con la sed. Al salir del mapa o acabar el evento, vuelve a 1.
- [ ] **Calor en `moc_fild11`** (con o sin evento) y sin ropa fresca: el icono
      de calor (Overheat) sale y se apaga al volver a la ciudad.

## 7. Opcional: `nemesis` fuera del atlas

Si en la prueba de `nemesis` no hiciste su paso 8: en un mapa que no esté en el
atlas, `@nemesisgm <clase de un monstruo que te gane>` y déjate matar; sale y
vuelve a entrar en ese mapa: el némesis debe reaparecer.

## Fuera de esta sesión

Necesitan algo que no cabe en una sesión de una persona:

- **Crédito en grupo** de `expedition-board` (y la regla de grupo en general):
  hace falta un segundo personaje en grupo. Es la «prueba de dos jugadores»
  de H2 en [`ROADMAP.md`](./ROADMAP.md).
- **El veneno flojo de `clima`** (activo unos 12 s de cada 20): no es una
  prueba, es una decisión de balance pendiente; ver «Estado» de
  [`clima`](./clima/README.md#estado).

## Al terminar

- [ ] `ragnarok-stack logs map 2000`: sin errores de nuestros mods, sin
      `event queue is full` ni `experience key refused`.
- [ ] Pasa los resultados a «Estado» de cada README y borra de aquí los pasos
      hechos.

## Resultados

| Paso | Bien / Falla | Qué se vio |
|---|---|---|
| Antes de entrar | | |
| 1. `@atlas` y el agua | | |
| 2. Cofres nuevos | | |
| 3. Siete ciudades | | |
| 4. Herida de la marca | | |
| 5. Contratos de Tier 2 | | |
| 6. Clima con presión y frío | | |
| 7. `nemesis` fuera del atlas | | |
| Log final | | |
