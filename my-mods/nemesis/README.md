# nemesis

El monstruo que te mata fuera de una ciudad **no te olvida**. La próxima vez
que entres en ese mapa te espera, con nombre y más fuerte, cerca de donde
caíste. Si vuelve a matarte, crece. Vencerlo te da un talismán con tu nombre, un
relato de [`adventure`](../adventure/README.md) y cierra las heridas que te
dejó ([`wounds`](../wounds/README.md)).

Es el némesis ligero de D17 ([`DECISIONS.md`](../DECISIONS.md)); el diseño de
partida está en «Mods nuevos propuestos» de [`PLAN.md`](../PLAN.md).

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.3.0 (la de `mod.json`), del 2026-10-24: los trofeos pasan a ser **talismanes** (D40, ver «Talismanes»): uno por némesis vencido (antes, uno por rango), un accesorio firmado con **afijos de su historia**. Se cuelgan con el Coleccionista de `expedition-board` 0.8.0 y se engarzan con el Herrero de `dungeon-chest` 0.7.0. Los trofeos que ya tengas en la mochila pasan a ser accesorios sin afijos (siguen valiendo para colgarlos o engarzarlos). Sin probar en el juego; comprobado sin el juego: llaves y cabeceras, y que los ids de opción (ATK 97+raza, MATK 107+raza y los atributos) son los que dice el `item_randomopt_db.yml` del rAthena fijado.
- La 0.2.0: las notas del diario van con `F_Adv_Note` de `adventure` 0.3 (no se pierden en la cola; con un `adventure` anterior darían error, así que actualiza los dos juntos). El rango máximo y el refuerzo por rango pasan a **Settings** (`max_rank`, `rank_hp`, `rank_atk`; ver «Ajustes»), con los mismos valores por defecto. Sin probar en el juego. La 0.1.0 fue la primera
- **Probado:** solo comprobaciones estáticas: llaves equilibradas, cabeceras
  con tabuladores, subrutinas definidas, IDs sin duplicar (51200–51209 libres
  en `my-mods/`, `mods/` y el registro). Los comandos de script se comprobaron
  contra la documentación de una copia local de rAthena, no contra el fork
  fijado (`vendor/rathena` no está en esta máquina)
- **Probado en el juego (0.1.0, 2026-10-23):** «Probarlo», sin fallos según
  el autor, con `wounds` 0.5.0; el log de la sesión no tiene errores del mod.
  No hay detalle paso por paso: si alguna suposición de abajo no se miró
  (sobre todo el paso 8, fuera del atlas), sigue abierta. Con
  `expedition-board`, la marca de un contrato que te mata no se vuelve tu
  némesis (2026-10-23)
- **Probado en el juego (0.3.0, 2026-10-26):** el paso 8 de «Probarlo»: en
  un mapa fuera del atlas, el némesis reaparece al salir y volver a entrar
  (`setmapflag ... mf_loadevent` en tiempo de ejecución funciona). El
  talismán de la 0.3.0 sigue sin probar
- **Suposiciones de la 0.1.0** (cubiertas por «Probarlo»):
  - que `setmapflag <mapa>, mf_loadevent` en tiempo de ejecución hace que
    `OnPCLoadMapEvent` corra en mapas que no la tenían (mapas fuera del atlas);
  - que `getnameditem` firma un objeto de tipo Etc y el cliente lo muestra con
    el nombre del personaje;
  - que los sprites de los trofeos (nombres de recurso de objetos stock: 깨진갑옷조각,
    스켈본, 날카로운송곳니…) se ven;
  - que `unitkill` de un némesis retirado no da trofeo (su evento corre sin
    jugador y lo ignora).
- **Problemas abiertos:** las notas del diario usan `doevent
  "TravelJournal::OnLog"`, que pasa por la cola de 2 huecos (igual que
  `wounds`)
- **Actualizado:** 2026-10-26

## Ajustes

En Settings → Mods → `nemesis`; cambian al pulsar **Apply** (reinicia el
servidor). Los marcados «de prueba» son los valores de las sesiones de prueba.

| Ajuste | Por defecto | Qué cambia |
|---|---:|---|
| `max_rank` | 3 | de prueba: hasta qué rango sube |
| `rank_hp` | 50 | de prueba: % de HP extra por rango sobre el 1 |
| `rank_atk` | 20 | de prueba: % de ATK extra por rango sobre el 1 |
| `talisman_base` | 10 | de prueba: % de daño del talismán contra su raza, antes del rango |
| `talisman_rank` | 2 | de prueba: % más por rango (12, 14 y 16 % con los valores por defecto) |

## Instalar

1. Activa `nemesis`. Funciona solo; con `world-atlas`, `wounds` y `adventure`
   activos hace más (ver «Con otros mods»).
2. Para que vencerlo cure heridas hace falta `wounds` **0.5.0** o posterior.
3. Reinicia la aplicación: trae `System/itemInfo.lua` (los talismanes).
4. Comprueba en `ragnarok-stack logs map 100` que `nemesis.txt` cargó sin
   errores.

## Qué hace

**Nace.** Al morir fuera de una ciudad a manos de un monstruo, ese monstruo
pasa a ser tu némesis: «Wolf el Verdugo». Se guarda la clase, el mapa y la
celda donde caíste. No nace si:

- ya tienes un némesis (**uno a la vez**; el primero se queda hasta vencerlo);
- te mató un MVP, la marca de tu contrato de `expedition-board` o el némesis
  de otro jugador;
- moriste en una ciudad (lista del atlas, o la propia sin él) o en una
  instancia (`1@…`).

**Te espera.** Al entrar en ese mapa aparece cerca de donde caíste (a 3–15
celdas; si no hay sitio, en cualquier punto del mapa) y avisa por el chat. Uno
solo por personaje: si ya está en pie, no aparece otro. Si se reinicia el
servidor, vuelve a aparecer la próxima vez que entres.

**Crece.** Si te vuelve a matar sube de rango, se retira y reaparece más fuerte
la próxima vez:

| Rango | Nombre | HP | ATK |
|---|---|---|---|
| 1 | «<monstruo> el Verdugo» | ×1,5 en Tier 1 | ×1,0 |
| 2 | «<monstruo> el Implacable» | ×2,25 | ×1,2 |
| 3 | «<monstruo> el Eterno» | ×3 | ×1,4 |

El Tier del mapa (atlas) multiplica además, como las marcas de
`expedition-board`: +50 % de HP y +15 % de ATK por Tier sobre el 1. En Tier 6
y rango 3: HP ×8 y ATK ×2,45. Los nombres caben en 23 caracteres (límite de
rAthena); si no, se acorta el del monstruo.

**Se vence.** Quien lo mata es el dueño, o un compañero de su grupo conectado
y en el mismo mapa ([regla de grupo](../CONVENTIONS.md#regla-común-de-grupo)).
El dueño recibe:

- Un **talismán firmado**, según la raza del monstruo (ver «Talismanes»). Si
  no cabe, queda pendiente y se entrega al entrar en el juego o con
  `@nemesis`.
- La **cura** de todas las heridas y maldiciones que le dejó esa clase de
  monstruo (`wounds` 0.5.0, `F_Wounds_CureFrom`).
- Un **relato** de `adventure`, clave `nemesis:<clase>`: Mayor, o Hito si era
  de rango 3. Una vez por clase de monstruo.
- Notas en el diario al nacer, al crecer y al vencerlo.

Después queda libre: la próxima muerte fuera de la ciudad crea otro.

### Talismanes (51200–51209)

Desde la 0.3.0 (D40), al estilo de las runas de Shadow of Mordor: cada némesis
deja un talismán distinto. Es un accesorio firmado con tu nombre (`getitem3`
con `card0` 254, como `getnameditem`) y con afijos que cuentan su historia:

- **ATK y MATK contra su raza**: `talisman_base` + `talisman_rank` × rango,
  12, 14 o 16 %. Un trofeo de marca de `expedition-board` da 10 %.
- **Lo que te quitó su herida**: la primera herida de `wounds` que te dejó esa
  clase de monstruo (`wd_src$`, leída antes de que su caída la cure) da el
  atributo que restaba: +1 + rango a FUE, AGI, VIT, INT, DES o SUE, 2 × rango %
  de HP o SP máx., o 3 × rango de FLEE (*Marca de la presa*). Sin herida, sin
  este afijo.

Además se puede **colgar** con el Coleccionista de `expedition-board` (+2 % de
defensa permanente contra su raza) o **engarzar** con el Herrero de Afijos de
`dungeon-chest` (+8 %); las dos cosas lo gastan. No sirve de prueba para una
marca de élite.

| ID | Raza | Talismán |
|---|---|---|
| 51200 | informe | Esquirla del Némesis |
| 51201 | no-muerto | Hueso del Némesis |
| 51202 | bruto | Colmillo del Némesis |
| 51203 | planta | Raíz del Némesis |
| 51204 | insecto | Antena del Némesis |
| 51205 | pez | Cola del Némesis |
| 51206 | demonio | Cuerno del Némesis |
| 51207 | humanoide | Trenza del Némesis |
| 51208 | ángel | Pluma del Némesis |
| 51209 | dragón | Escama del Némesis |

En el juego van sin tildes, como el resto de textos de los scripts.

## Con otros mods

Todas son dependencias suaves; sin ellas el mod sigue funcionando.

| Mod | Para qué |
|---|---|
| `world-atlas` | qué mapas son ciudad, el nombre del lugar y el Tier (refuerzo y relato) |
| `wounds` 0.5.0 | `F_Wounds_CureFrom`: cura las heridas que dejó ese monstruo |
| `adventure` | el relato `nemesis:<clase>` (`F_Adv_Experience`) y las notas del diario |
| `expedition-board` | su marca no se vuelve némesis (lee `$@eb_markowner`) |

No tiene temporizadores ni `OnNPCKillEvent`: aparece con `OnPCLoadMapEvent` y
se vence con el evento de su propio `monster`. El mod pone la mapflag
`loadevent` a su mapa con `setmapflag` al nacer el némesis y al entrar el
personaje (tras un reinicio se pierde).

## Comandos

- `@nemesis`: quién te espera, de qué rango y dónde; entrega un talismán
  pendiente.
- `@nemesisgm <clase> [rango]` (GM): hace némesis a esa clase **aquí mismo** y
  lo pone a tu lado. `@nemesisgm 0` lo quita. Para pruebas.

## Probarlo

Con `world-atlas`, `wounds` 0.5.0 y `adventure` activos, un personaje con
algo de vida y el log del map-server abierto.

1. **Carga:** `ragnarok-stack logs map 100` sin errores de `nemesis.txt`.
   `@nemesis` responde «No tienes némesis».
2. **Nace:** muere en `prt_fild08` ante un monstruo normal. El chat dice «…
   desde ahora es <nombre> el Verdugo» y `@nemesis` lo nombra. Si `wounds` te
   dio herida, apunta cuál (`@heridas`).
3. **Te espera:** vuelve a `prt_fild08`. Aparece cerca de donde caíste, con
   su nombre, y aguanta más que uno normal.
4. **Uno a la vez:** muere ante **otro** monstruo. No nace un segundo.
5. **Crece:** déjate matar por tu némesis. Dice que se hace más fuerte; al
   salir y volver a entrar aparece como «el Implacable».
6. **Se vence:** mátalo. Recibes un talismán con tu nombre (desde la 0.3.0; con +14 % contra su raza si era de rango 2 y, si te dejó una herida, el atributo que te quitaba), la herida que te
   dejó se cierra (`@heridas`), aparece el relato en la pestaña Relatos del
   diario y `@nemesis` dice que no tienes.
7. **Peso:** con el inventario lleno (o `@nemesisgm` y peso al 90 %), vencerlo
   deja el talismán pendiente; `@nemesis` lo entrega al hacer sitio.
8. **Fuera del atlas:** en un mapa que no esté en el atlas (sin `loadevent`),
   `@nemesisgm <clase de un monstruo que te gane>` y déjate matar: se
   retira al subir de rango. Vuelve a entrar en ese mapa: debe reaparecer.
9. **Excepciones:** morir ante un MVP o ante la marca de tu contrato no crea
   némesis.

Anota el resultado en «Estado».
