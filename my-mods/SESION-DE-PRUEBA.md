# Sesión de prueba

Guion de lo que **queda por probar en el juego**, sacado de la sección «Estado»
de cada README (revisado el 2026-10-23, tras la segunda parte de la sesión de
ese día). Lo ya probado no está aquí: está en el «Estado» de cada mod, y los
guiones anteriores siguen en el historial de git.

Calcula unos 90 minutos. `campfire` va antes que `refuges` porque los dos dan
Descansado, que evita la herida de la siguiente muerte. Si este guion y un
README no coinciden, manda el README. Apunta lo que no coincida en la tabla
del final y, al terminar, pasa los resultados a «Estado» y borra los pasos
hechos.

## Antes de entrar

La instalación ya está limpia (2026-10-23): `travel-journal` y
`world-atlas-test` desinstalados, `affix-forge` y `arpg-equipments` apagados,
y `campfire` 0.2.0, `refuges` 0.1.0 y `dungeon-chest` 0.4.1 instalados. La
carga de las 21:38 de ese día no tiene errores de ningún mod de `my-mods/`
(el único error, `Companion Recruiter`, es del Population Engine).

- [ ] Si cambiaste algún mod desde entonces, reemplaza su carpeta entera,
      recarga los mods y mira `ragnarok-stack logs map 200`: sin errores de
      nuestros mods ni `Duplicate unique name`.

**Rates (D8):** `quest_exp_rate` ya está a 1x, pero `base_exp_rate`,
`job_exp_rate` y los drops siguen a **50x** en Settings. Para estas pruebas da
igual; para medir el balance de H1 tienen que estar a 1x.

**Personaje:** `tester` / `tester123`, con comandos de GM. No uses la cuenta
`ragnarok`.

**Lo que vas a necesitar:**

| Objeto | ID | Para qué |
|---|---:|---|
| Leña, Kit de Acampada, Venda | 51100, 51101, 51102 | `campfire` (también se compran en el Proveedor) |
| Grasshopper's Leg ×3, Meat ×2 | 940, 517 | cocinar la Brocheta y la Carne Asada |
| Stem ×20, Animal Skin ×10, Fluff ×20 y 3000 zeny | 905, 919, 914 | la etapa 1 del Refugio de la Abadía |

| Comando | Qué hace |
|---|---|
| `@cofre [mapa]` | te lleva junto al cofre del mapa (GM); `aqui`, `cerrar`, `mover` |
| `@presion` | presión de cada sistema, total y si actúa el tope |
| `@temperatura` | estado de temperatura y su desglose |
| `@heridas` | heridas actuales |
| `@relatos` | expedición en curso y relatos sin contar |
| `@fogata` | Descansado que te queda y si estás junto a una fogata |
| `@refugios` | cada refugio y hasta qué etapa está restaurado |
| `@refugio <id> <0-3>` | pone un refugio en esa etapa (GM); `monk` o `f11` |
| `@zeny <n>` | da zeny (GM) |
| `@herida <id>` | da una herida (GM); `@herida 0` las quita |
| `@item <id> <n>` | da objetos (GM) |

## 1. `@cofre` y los cofres de Izlude (`dungeon-chest` 0.4.1)

- [ ] `@cofre prt_sewb1`: te deja en una celda libre al sur del cofre y dice
      sus coordenadas y si está abierto.
- [ ] `@cofre aqui`: el cofre aparece delante de ti. `@cofre cerrar` tras
      abrirlo deja abrirlo otra vez; `@cofre mover` lo manda lejos.
- [ ] `@cofre prontera`: «no tiene cofre».

Los dos retos de Izlude son mapas muy grandes: no los busques, usa `@cofre`
(o `@cofre aqui` si un muro lo tapa) y ábrelo.

| Mapa | Cofre | Debe dar | ✓ |
|---|---|---|---|
| `iz_d04_i` | `Cofre T5` | equipo o Lutie Lady's Pancake | |
| `iz_d05_i` | `Cofre T6` | equipo o Shiny Marinade Beef | |

Si `@warp` no entra a un mapa de instancia (`*_i`), apúntalo y sigue.

## 2. Frío extremo y los iconos (`clima`, `survival`, `temperature`)

Pregunta antes al Pronosticador (`prontera 168,193`, «Otras tierras») cuándo
llega Frío extremo a `mjolnir_12`.

- [ ] **Frío extremo en `mjolnir_12`** sin Abrigo Polar: el hambre baja
      **2** puntos cada 15 s en vez de 1, y vuelve a 1 al salir del mapa o
      acabar el evento.

**Iconos** (`temperature` **0.4.1**: reemplaza la carpeta entera y recarga
los mods). Sin ropa de abrigo ni fresca:

- [ ] `@warp xmas_fild01`: el icono de frío sale entre 4 y 8 s después de
      llegar (no antes, a propósito) y sigue puesto mientras estés allí.
      Vuelve a Prontera: se apaga unos 5 s después.
- [ ] `@warp moc_fild11`: lo mismo con el icono de calor (Overheat).
- [ ] De `xmas_fild01` ve con `@warp` a otro mapa frío (`mjolnir_12` con
      Frío extremo): el icono puede apagarse un momento y vuelve en 8 s o
      menos.
- [ ] Sal del juego en `xmas_fild01` y vuelve a entrar: el icono sale en
      8 s o menos.

## 3. Variantes en las cacerías (`expedition-board` 0.6.2)

Reemplaza la carpeta entera y recarga los mods.

- [ ] En Prontera, acepta «Goblins del camino este» y caza en `prt_fild11`:
      **todos** los «Goblin» suman, lleven el arma que lleven, y el aviso
      dice «Caceria: N/12 Goblin».
- [ ] Un Goblin Archer (si sale) **no** suma.
- [ ] `ragnarok-stack logs map 200` tras un rato cazando: sin errores de
      `expedition-board.txt`.

## 4. Fogatas (`campfire` 0.2.0, `temperature` 0.4.1, `wounds` 0.6.1)

Todo sin probar. El detalle de cada caso está en «Probarlo» de
[`campfire/README.md`](./campfire/README.md#probarlo). Ten a mano
`ragnarok-stack logs map 200` por si una fogata no aparece.

**Proveedor y objetos**

- [ ] En Prontera `151,187` está el **Proveedor de Campamento** y vende
      Leña (300), Kit de Acampada (900) y Venda (400). Si cae en una celda
      bloqueada o no se ve, apunta `/where` de un sitio libre al lado.
- [ ] Los tres objetos y los platos tienen icono y descripción en español
      (pasa el ratón por encima en el inventario).
- [ ] Usar la Leña **en Prontera**: «Aquí no hace falta una fogata», y la
      Leña sigue en el inventario.

**Encender y apagarse** (`prt_fild08`)

- [ ] Usa la Leña: aparece una **fogata visible** (sprite `4_BONFIRE`) en tu
      celda, se gasta una Leña y sale «Enciendes una fogata. Arderá unos 10
      minutos.». Si la fogata **no se ve** pero se le puede hablar, el sprite
      no existe en el cliente: apúntalo.
- [ ] Si `tester` no la tenía, el relato «Encendí mi primera fogata»
      (`@relatos`).
- [ ] Usa otra Leña a 1–2 celdas: «Ya arde una fogata aquí al lado», sin
      gastarla.
- [ ] `@fogata` junto a ella: «Estás junto a una fogata: le quedan … min».
- [ ] Muévete 3 celdas y enciende otra con el Kit: la primera **desaparece**
      en 5 s o menos (una fogata por personaje).
- [ ] Habla con la del Kit → «Apagar la fogata»: desaparece en 5 s o menos.
      Si llegas a hablar con ella justo después, «Solo quedan brasas».

**Cocinar** (con una fogata encendida)

- [ ] `@item 940 3`: en «Cocinar», la Brocheta de Saltamontes sale con
      «(listo)» y las demás sin él. Al elegir una que no puedes hacer, dice
      qué ingredientes faltan y vuelve a la lista.
- [ ] Cocina la Brocheta: gasta las 3 patas, da el plato y, la primera vez,
      el relato «Cociné junto al fuego por primera vez».
- [ ] Cómela: icono de comida, FUE +2 en la ventana de estado y «Hambre: …»
      con +25. `@item 517 2`, cocina y come la Carne Asada: VIT +2 y hambre
      +60.

**Vendar**

- [ ] `@herida 1` (Cicatriz del lobo). Mira cuánta AGI te resta.
- [ ] Sin Venda, «Vendar una herida» dice que hace falta una. Con una Venda,
      elige la Cicatriz: se gasta la Venda, `@heridas` dice «(vendada)» y la
      AGI que resta baja a la mitad (en 4 s o menos).
- [ ] Vuelve a «Vendar»: ya no ofrece la Cicatriz. `@herida 6` (maldición):
      tampoco la ofrece.
- [ ] Cúrala en el Posadero y vuelve a `@herida 1`: sale **sin** «(vendada)».
      Quítalas con `@herida 0`.

**Temperatura** (`xmas_fild01`, sin Abrigo Polar ni ropa de abrigo)

- [ ] `@temperatura`: Helado (la Ventisca no lo baja a Congelado). El icono
      de frío sale en 8 s o menos (paso 2).
- [ ] Enciende una fogata y quédate al lado: «Junto al fuego entras en
      calor», `@temperatura` dice Comodo y «Estas junto a una fogata», y
      `@presion` cuenta temperatura 0 (y el icono de frío se apaga, si salía).
- [ ] Aléjate 4 celdas o más: vuelve el frío en 4 s o menos.

**Descansado** (déjalo para el final de este paso)

- [ ] Habla con la fogata → «Descansar junto al fuego»: «Descansado durante
      20 minutos». `@fogata` lo dice, con «la próxima muerte fuera de una
      ciudad no dejará herida».
- [ ] `@die` en el campo: «Ibas descansado: esta vez sales sin herida» y
      `@heridas` vacío.
- [ ] Vuelve al campo y `@die` otra vez (Descansado aún activo): ahora **sí**
      deja herida.

## 5. Refugios (`refuges` 0.1.0, `campfire` 0.2.0, `adventure`)

Todo sin probar. El detalle está en «Probarlo» de
[`refuges/README.md`](./refuges/README.md#probarlo). Si algo no aparece,
`ragnarok-stack logs map 200`.

**En ruinas**

- [ ] `@refugios`: los dos «en ruinas».
- [ ] En `prt_monk 90,238` (entra por `prt_fild03`) hay un **montón de
      leña** llamado «Refugio en ruinas», y nadie a sus lados. Si no se ve
      pero se le puede hablar, el sprite `4_WOODPILE` no existe en el
      cliente: apúntalo.
- [ ] En Prontera `153,187`, la **Caravana de los Refugios** cuenta las
      ruinas de la Abadía y del campo 11 y que ningún refugio tiene
      cobertizo.

**Restaurar la etapa 1** (en la Abadía)

- [ ] `@item 905 10` y «Entregar materiales»: entrega 10 Stem.
      «Siguiente etapa» dice 10 / 20 y lo que llevas.
- [ ] `@item 905 10`, `@item 919 10`, `@item 914 20`, `@zeny 3000` y
      entregar: pide los 3000 zeny, se pagan y sale «Techo y fogata
      terminado» en el mapa. Las ruinas pasan a ser una **hoguera** llamada
      «Refugio de la Abadía» sin salir del mapa.
- [ ] `@relatos`: el relato «Restauré el Refugio de la Abadía».

**Descansar y contar**

- [ ] Con algún relato sin contar, «Descansar junto al fuego»: «Descansado
      durante 20 minutos», «Bajo techo y sin prisa…» y luego «Cuentas N
      relatos». `@relatos` sin expedición en curso; `@fogata` dice
      Descansado.

**Despensa y caravana**

- [ ] `@refugio monk 2`: aparece el **Intendente del Refugio** al este de la
      hoguera, con Red Potion, Apple, Meat, Milk, Leña, Venda y Cantimplora.
- [ ] `@refugio monk 3`: aparece el **Caravanero** al oeste. Viajar a
      Prontera cobra 300 zeny y deja junto a la Caravana. Desde la Caravana,
      el Refugio de la Abadía sale en el menú y lleva junto a la hoguera.
- [ ] Recarga los mods: el refugio sigue restaurado, con su nombre, la
      hoguera, el Intendente y el Caravanero.
- [ ] Deja los dos como estaban: `@refugio monk 0` y `@refugio f11 0`.

## 6. Opcional: `nemesis` fuera del atlas

Si en la prueba de `nemesis` no hiciste su paso 8: en un mapa que no esté en el
atlas, `@nemesisgm <clase de un monstruo que te gane>` y déjate matar; sale y
vuelve a entrar en ese mapa: el némesis debe reaparecer.

## Fuera de esta sesión

Necesitan algo que no cabe en una sesión de una persona:

- **Crédito en grupo** de `expedition-board` (y la regla de grupo en general):
  hace falta un segundo personaje en grupo. Es la «prueba de dos jugadores»
  de H2 en [`ROADMAP.md`](./ROADMAP.md).
- **La fogata compartida** de `campfire` (Cómodo, descansar y cocinar en
  la fogata del compañero): entra en la misma prueba de dos jugadores.
- **El relato de grupo de `refuges`**: el compañero en el mismo mapa gana
  «Restauré el …» al terminar la etapa 1. Misma prueba.
- **El veneno flojo de `clima`** (activo unos 12 s de cada 20): no es una
  prueba, es una decisión de balance pendiente; ver «Estado» de
  [`clima`](./clima/README.md#estado).
- **El personaje que sigue congelado tras cambiar de mapa** (visto el
  2026-10-23): se reproduce con `rotest`, no en esta sesión; ver «Estado» de
  [`clima`](./clima/README.md#estado).

## Al terminar

- [ ] `ragnarok-stack logs map 2000` **antes de cerrar o reiniciar el
      juego** (al reiniciar el servidor se pierde el log): sin errores de
      nuestros mods, sin `event queue is full` ni `experience key refused`,
      nada de `duplicate`, `hideonnpc` ni `unloadnpc` (las fogatas) ni de
      `setnpcdisplay`, `npcshopadditem`, `getitem3` o `getitem4` (refugios,
      cofres y Herrero).
- [ ] Pasa los resultados a «Estado» de cada README y borra de aquí los pasos
      hechos.

## Resultados

| Paso | Bien / Falla | Qué se vio |
|---|---|---|
| 1. `@cofre` | | |
| 1. Cofres de Izlude | | |
| 2. Frío extremo | | |
| 2. Iconos | | |
| 3. Variantes en las cacerías | | |
| 4. Fogatas: proveedor y objetos | | |
| 4. Fogatas: encender y apagarse | | |
| 4. Fogatas: cocinar | | |
| 4. Fogatas: vendar | | |
| 4. Fogatas: temperatura | | |
| 4. Fogatas: Descansado | | |
| 5. Refugios: en ruinas | | |
| 5. Refugios: etapa 1 | | |
| 5. Refugios: descansar y contar | | |
| 5. Refugios: despensa y caravana | | |
| 6. `nemesis` fuera del atlas | | |
| Log final | | |
