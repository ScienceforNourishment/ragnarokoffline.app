# tavern-rumors

La **taberna** de Prontera. Por una ronda, el Tabernero cuenta lo que se dice
de un tema: qué tiempo hace donde vas, qué le duele al monstruo de tu contrato
o dónde te espera tu némesis. Y es un lugar de descanso: sentarse junto al
fuego cuenta los relatos de [`adventure`](../adventure/README.md) y cierra la
expedición, como el Cronista.

Es el quinto de «Mods nuevos propuestos» en [`PLAN.md`](../PLAN.md) y el
«Rumor» con el que empieza el bucle de H2 ([`ROADMAP.md`](../ROADMAP.md)). No
añade datos propios: solo publica los de otros mods.

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.1.0 (la de `mod.json`), la primera. Solo Prontera (D19)
- **Decidido con el autor (2026-10-23):** una ronda por tema, cobrada solo
  si hay algo que contar; los rumores se eligen en un menú por tema, no al
  azar; solo la taberna de Prontera hasta cerrar la porción vertical
- **Probado:** solo comprobaciones estáticas: llaves y comillas equilibradas,
  cabeceras con tabuladores, `mod.json` válido. Comprobados contra el
  rAthena fijado (`402dd11`): que `select` oculta una opción vacía, que
  `getmonsterinfo` da `MOB_ELEMENT`, `MOB_ELEMENTLV` y `MOB_SIZE`, que
  `strnpcinfo(4)` es el mapa del NPC, y la tabla de elementos de Renewal
  (`db/re/attr_fix.yml`)
- **Probado en el juego (0.1.0, 2026-10-23):** «Probarlo» completo, sin
  fallos según el autor, y el log de la sesión sin errores del mod. El
  Tabernero se ve en `prt_in 180,23` (sprite `4_M_MANAGER`) y se le habla
  desde fuera de la barra. Hubo un fallo en la primera prueba: «Preguntar por
  el tiempo», sin contrato ni némesis, **se colgó** con la ventana abierta.
  `F_Tavern_Gossip` pregunta por `prt_fild00`, que no tiene clima, y
  `F_Clima_Now` de `clima` 0.4.0 fallaba con un mapa así (log:
  `getelementofarray: index out of range (-1)`). Se arregló en `clima` 0.4.1
  y la repetición fue bien
- **Actualizado:** 2026-10-23

## Instalar

Settings → Mods → **Add mod from folder…** → `my-mods/tavern-rumors`, y
recarga los mods del servidor. No trae `client/` ni `System/`: no hace falta
reiniciar la aplicación. Es Renewal (`"era": "renewal"`), porque la tabla de
elementos es la de Renewal (D1).

## Qué hace

El **Tabernero** está en la taberna de Prontera (`prt_in 180,23`, detrás de
la barra, junto al Bartender de siempre). Su menú:

| Opción | Qué dice | Cobra |
|---|---|---|
| Preguntar por el tiempo | el tiempo en el mapa de tu contrato y en el de tu némesis: lo que hay ahora, cuánto dura, lo que viene y qué protege. Si no tienes ninguno de los dos, lo que se comenta de los campos de Prontera: hasta tres eventos en curso o, si no hay, el próximo que llega | una ronda |
| Preguntar por mi contrato | dónde anda tu marca o cuántos te faltan de tu cacería, y qué le duele al monstruo | una ronda |
| Preguntar por mi némesis | dónde te espera y cerca de qué celda, cuánto ha crecido y qué le duele | una ronda |
| Sentarme a contar lo vivido | cuenta los relatos y cierra la expedición (`Adventure::OnRest`) | gratis (D26) |

**Una ronda por tema.** Antes de cobrar, el Tabernero prepara el rumor; si no
hay nada que contar (sin contrato, sin némesis, sin `clima`), lo dice gratis.
Si lo hay, pregunta si pides la ronda. Precio, con `round_price` (por
defecto 200) en la banda 1:

| Nivel base | 1–39 | 40–59 | 60–89 | 90–119 | 120–149 | 150+ |
|---|---:|---:|---:|---:|---:|---:|
| Ronda (zeny) | 200 | 400 | 700 | 1000 | 1500 | 2000 |

Las bandas son las de `adventure` y `dungeon-chest`. Es un valor de prueba: la
economía está abierta ([`DECISIONS.md`](../DECISIONS.md#abiertas)).

**Qué le duele a un monstruo.** Sale de su elemento y nivel de elemento
(`getmonsterinfo`) y de la tabla de Renewal de rAthena. Dice su elemento y
tamaño, los elementos que más daño le hacen (si alguno pasa del 100 %), los
que no le hacen nada y los que hacen un 50 % o menos. Un monstruo neutro no
tiene elemento que le duela más; un fantasma de nivel 4 no recibe daño de los
ataques neutros, y lo dice.

### La tabla de elementos (generada)

`npc/tavern-elements.txt` **se genera**; no se edita a mano:

```
node registry/tools/tavern-rumors/build_elements.cjs [ruta/a/attr_fix.yml]
node registry/tools/tavern-rumors/build_elements.cjs [ruta] --check
```

Por defecto lee `vendor/rathena/db/re/attr_fix.yml`. Rehazla cuando se mueva
el pin de rAthena.

## Con otros mods

Todas son dependencias suaves: sin el mod, su tema dice que no se sabe nada y
no cobra. No hay `requires.mods`.

| Mod | Qué lee | Cómo |
|---|---|---|
| `clima` | el tiempo de cada mapa | `F_Clima_*`, tras `getnpcid(0, "Clima#clima")` |
| `expedition-board` | tu contrato | `eb_qid`, `eb_state`, `eb_prog` y `ExpeditionData` |
| `nemesis` | tu némesis | `nm_mob`, `nm_map$`, `nm_x`, `nm_y`, `nm_rank` y `F_Nemesis_Name` |
| `world-atlas` | el nombre de los lugares y la ciudad de la taberna | `F_Atlas_Name`, `F_Atlas_Anchor` |
| `adventure` | contar los relatos | `doevent "Adventure::OnRest"` |

Las variables de `expedition-board` y `nemesis` son suyas: este mod solo las
lee. Si cambian de nombre, hay que tocar aquí. El Tabernero no ve cuántos
relatos llevas (el mod store de `adventure` es solo suyo); lo dice
`adventure` en el chat al contarlos.

**El Cronista sigue.** La taberna es otro sitio donde contar, no lo
sustituye; si el Cronista se retira se decide aparte
([`ADVENTURE.md`](../ADVENTURE.md#el-diario-dentro-de-adventure)).

## Otra ciudad

Para abrir otra taberna (H3): duplica al Tabernero en un interior de esa
ciudad que esté en el atlas con su `anchor`, y añade sus campos a
`F_Tavern_Fields`. La ciudad sale del atlas, por el mapa donde está el NPC.

## Probarlo

Con `world-atlas`, `clima`, `expedition-board`, `nemesis` y `adventure`
activos, y zeny en el personaje.

1. **Carga:** `ragnarok-stack logs map 100` sin errores de
   `tavern-rumors.txt` ni `tavern-elements.txt`.
2. **Está:** `@warp prt_in 177 22`. El Tabernero se ve detrás de la barra,
   en `180,23`, y responde con el precio de la ronda (200 a nivel 1–39).
3. **Gratis cuando no hay nada:** sin contrato, «Preguntar por mi contrato»
   dice que mires el tablero y no cobra. Lo mismo el némesis.
4. **El tiempo, sin destino:** «Preguntar por el tiempo» pide la ronda; tras
   pagar, nombra eventos de los campos de Prontera. Compáralo con el
   Pronosticador (`prontera 168,193`): mismos eventos y minutos.
5. **No alcanza:** con menos zeny que la ronda, dice que no llega y no cobra.
6. **Contrato:** acepta en el tablero «Rastro en el campo sur» y pregunta.
   Debe nombrar la marca, `Campo de Prontera 08` y su elemento. Pregunta por
   el tiempo: ahora habla de `prt_fild08`.
7. **Némesis:** con un némesis (muere fuera de la ciudad), pregunta. Debe
   dar el lugar y la celda de `@nemesis`, y su elemento.
8. **Contar:** con relatos sin contar, «Sentarme a contar lo vivido». Al
   cerrar el diálogo, el chat dice «Cuentas N relatos.», sube la EXP, el
   diario escribe el resumen de la expedición y `@relatos` dice que no estás
   de expedición.
9. **Sin `adventure`:** la opción de contar no aparece.

Anota el resultado en «Estado».
