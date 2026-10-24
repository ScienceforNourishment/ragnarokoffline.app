# Sesión de prueba

Guion de lo que **queda por probar en el juego**, sacado de la sección «Estado»
de cada README (revisado el 2026-10-24). Lo ya probado no está aquí: está en el
«Estado» de cada mod, y los guiones anteriores siguen en el historial de git.

Si este guion y un README no coinciden, manda el README. Marca cada caso al
hacerlo, apunta lo que no coincida en la tabla del final y, al terminar, pasa
los resultados a «Estado» y borra los pasos hechos.

## Antes de entrar

Instalado el 2026-10-24: las versiones nuevas de `adventure` 0.3.0,
`dungeon-chest` 0.5.0, `expedition-board` 0.7.0, `clima` 0.5.0,
`survival` 1.3.0, `wounds` 0.7.0, `nemesis` 0.2.0 y `campfire` 0.2.0.
Faltan dos arreglos de hoy:

| Mod | Versión | Qué arregla |
|---|---|---|
| `temperature` | 0.5.1 | el icono de calor que no salía en `moc_fild11` |
| `refuges` | 0.1.2 | el refugio que no abría diálogo |

- [ ] Reemplaza la carpeta entera de esos dos mods (copiar encima no quita
      archivos viejos), recarga los mods y mira `ragnarok-stack logs map 200`:
      sin errores de nuestros mods ni `Duplicate unique name`. El único error
      esperado es `Companion Recruiter`, del Population Engine.

**Rates (D8):** `quest_exp_rate` ya está a 1x, pero `base_exp_rate`,
`job_exp_rate` y los drops siguen a **50x** en Settings. Para estas pruebas da
igual; para medir el balance de H1 tienen que estar a 1x.

**Personaje:** `tester` / `tester123`, con comandos de GM. No uses la cuenta
`ragnarok`: el cliente la dibuja siempre como GM.

**Lo que vas a necesitar:** Stem ×20, Animal Skin ×10, Fluff ×20 (905, 919,
914) y 3000 zeny para la etapa 1 del Refugio de la Abadía.

| Comando | Qué hace |
|---|---|
| `@temperatura` | estado de temperatura y su desglose |
| `@presion` | presión de cada sistema, total y si actúa el tope |
| `@relatos` | expedición en curso y relatos sin contar |
| `@fogata` | Descansado que te queda y si estás junto a una fogata |
| `@refugios` | cada refugio y hasta qué etapa está restaurado |
| `@refugio <id> <0-3>` | pone un refugio en esa etapa (GM); `monk` o `f11` |
| `@cofre [mapa]` | te lleva junto al cofre del mapa (GM); `aqui`, `cerrar`, `mover` |
| `@heridas` | heridas actuales |
| `@herida <id>` | da una herida (GM); `@herida 0` las quita |
| `@zeny <n>`, `@item <id> <n>` | dan zeny y objetos (GM) |

## 1. Icono de calor (`temperature` 0.5.1)

Con la 0.5.0, el icono de frío salía bien y el de calor no salió en
`moc_fild11`: el cliente perdía el paquete del icono mientras cargaba el mapa.
Ahora el icono espera a que el cliente avise que terminó de cargar
(`OnPCLoadMapEvent`). Ese aviso solo llega en los mapas del atlas, porque
`adventure` les pone `loadevent`, así que `adventure` tiene que estar activo.
Sin ropa de abrigo ni fresca:

- [ ] En Prontera, `@warp moc_fild11`: `@temperatura` dice Acalorado (2) o
      Sofocado (3), y el icono de calor sale entre 4 y 8 s después de que el
      mapa se vea. Si sigue sin salir, apunta `@temperatura` y cuánto tardó
      en cargar el mapa.
- [ ] Vuelve a Prontera y luego a `xmas_fild01`: el icono de frío sale igual
      que antes, y se apaga unos 5 s después de volver a Prontera.
- [ ] De `xmas_fild01` a `moc_fild11` sin pasar por una ciudad: el de frío se
      apaga y el de calor sale en 8 s o menos tras cargar el mapa.

## 2. Refugios (`refuges` 0.1.2, `campfire`, `adventure`)

Lo de «En ruinas» ya está probado. El detalle de cada caso está en «Probarlo»
de [`refuges/README.md`](./refuges/README.md#probarlo). Si algo no aparece,
`ragnarok-stack logs map 200`.

**Restaurar la etapa 1** (en `prt_monk 90,238`; entra por `prt_fild03`)

- [ ] Habla con el Refugio en ruinas: sale «Muros caídos, un hogar frío…» y,
      tras «siguiente», el menú con «Siguiente etapa (Techo y fogata)»,
      «Entregar materiales» y «Nada».
- [ ] `@item 905 10` y «Entregar materiales»: entrega 10 Stem.
      «Siguiente etapa» dice 10 / 20 y lo que llevas.
- [ ] `@item 905 10`, `@item 919 10`, `@item 914 20`, `@zeny 3000` y
      entregar: pide los 3000 zeny, se pagan y sale «Techo y fogata
      terminado» en el mapa. Las ruinas pasan a ser una **hoguera** llamada
      «Refugio de la Abadía» sin salir del mapa. Si no se ve pero se le puede
      hablar, apúntalo.
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

## 3. Opcional: `nemesis` fuera del atlas

Si en la prueba de `nemesis` no hiciste su paso 8: en un mapa que no esté en el
atlas, `@nemesisgm <clase de un monstruo que te gane>` y déjate matar; sal y
vuelve a entrar en ese mapa: el némesis debe reaparecer.

## 4. `adventure` 0.3 y sus enganches

Todo sin probar. El detalle de cada caso está en «Probar la 0.2» y «Probar la
0.3» del [README de `adventure`](./adventure/README.md#probar-la-02); si no
coincide con esto, manda el README.

- [ ] Settings → Mods: `adventure`, `survival`, `clima`, `temperature`,
      `expedition-board` y `nemesis` muestran sus ajustes nuevos. **Sin
      tocarlos, todo se comporta como antes**, salvo la racha (abajo).
- [ ] Para no esperar media hora a los rasgos de frío y calor, pon
      `adventure` → `trait_minutes` a 1 y pulsa Apply. Devuélvelo a 30 al
      terminar.

Usa un **personaje nuevo**: los relatos y los rasgos son de una sola vez.

**Racha y pestañas**

- [ ] Primera salida a `prt_fild08`: los tres relatos de siempre. La pestaña
      Relatos dice «racha +30 %» en la cabecera y un total de unos **+75 %**
      (con la 0.1 eran ~64 %).
- [ ] Cuenta con el Cronista: la racha desaparece. Tras contar dos
      expediciones, la pestaña **Expediciones** tiene los dos resúmenes 🏕️, el
      más reciente arriba.
- [ ] La pestaña **Rasgos** lista los cuatro, con «0/1 min en la nieve»,
      «0/5 biomas», etc.

**Relatos de otros mods**

- [ ] **Cofre:** `@cofre` en una mazmorra y ábrelo. Al cerrar el diálogo,
      «Nuevo relato: Abrí el cofre de …» y «Mi primer cofre de Tier …». Un
      cofre del mismo Tier en otro mapa: solo el primero.
- [ ] **Marca:** abate la marca de un contrato: «Abatí la marca: …».
- [ ] **Cacería:** complétala: «Completé la cacería: …». Repetir el mismo
      contrato no da relato.
- [ ] **Clima, protegido:** con la protección puesta durante un evento,
      «Mi equipo me protegió del clima: …» (hasta 10 s después).
- [ ] **Clima, sin protección:** quédate en el mapa sin protección desde al
      menos 2 minutos antes del final del evento: al terminar, «Aguanté el
      clima sin protección: …» (puede salir al cambiar de mapa).
- [ ] **Temperatura:** en `xmas_fild01` con Capa de Piel y Chaleco de Lana
      (`@temperatura` en 0): «Comodo en pleno frio gracias a mi ropa» (puede
      salir al cambiar de mapa). Hazlo **antes** de ganar Hecho al frío.

**Relatos propios de `adventure`**

- [ ] **Expedición larga:** más de 30 minutos fuera en total (no hace falta
      en un solo mapa): al cambiar de mapa, «Más de media hora fuera de las
      ciudades». Se puede juntar con el resto de esta parte.
- [ ] **Por los pelos:** vuelve a Prontera con menos del 20 % de HP: «Volví
      por los pelos». Morir y reaparecer en la ciudad **no** lo da.
- [ ] **MVP:** `@monster` un MVP y abátelo: «Abatí a …». Otro de la misma
      especie: nada.

**Notas del diario** (ya no se pierden en un diálogo)

- [ ] Acepta un contrato, déjate matar en un campo y cura la herida: las
      notas («Acepte…», la herida, la cura) salen en la pestaña Diario, como
      mucho tras el siguiente cambio de mapa.

**Rasgos** (con `trait_minutes` a 1)

- [ ] **Hecho al frío:** algo más de un minuto en `xmas_fild01` sin ropa y
      vuelve a Prontera: «Nuevo rasgo: Hecho al frío…», 🎖️ en el diario y
      «Ganado» en la pestaña. De vuelta en `xmas_fild01` sin ropa,
      `@temperatura` da **Fresco** (−1) en vez de Helado (−2), sin icono de
      frío.
- [ ] **Hecho al calor:** lo mismo en `moc_fild11`: Cálido en vez de
      Acalorado.
- [ ] **Buscavidas:** al tener relatos de 5 biomas, «Nuevo rasgo:
      Buscavidas». Hambre y sed bajan un punto cada 18 s en vez de 15
      (`@presion` antes y después de un minuto).
- [ ] **Curtido por las heridas:** cura 3 heridas distintas en el Posadero o
      el Sacerdote (`@herida <id>` para recibirlas). A la tercera, «Nuevo
      rasgo: Curtido por las heridas»; luego una herida de atributo resta un
      punto menos. `@herida 0` no cuenta como cura.

**Ajustes** (opcional; devuélvelos después)

- [ ] `adventure` → `pct_minor` a 8: un mapa nuevo vale el doble en la
      pestaña Relatos. `streak_step` a 0: la cabecera ya no dice «racha».
- [ ] `survival` → `need_seconds` a 5: hambre y sed bajan mucho más deprisa.

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
      nada de `duplicate`, `hideonnpc` ni `unloadnpc` (las fogatas) ni de
      `setnpcdisplay`, `npcshopadditem`, `getitem3` o `getitem4` (refugios,
      cofres y Herrero), ni `F_Adv_Note`, `F_Adv_Cured` o `F_ModSetting` en
      un error.
- [ ] Devuelve `trait_minutes` a 30 y cualquier otro ajuste que cambiaras.
- [ ] Pasa los resultados a «Estado» de cada README y borra de aquí los pasos
      hechos.

## Resultados

| Paso | Bien / Falla | Qué se vio |
|---|---|---|
| Instalar y log | | |
| 1. Icono de calor | | |
| 2. Refugios: etapa 1 | | |
| 2. Refugios: descansar y contar | | |
| 2. Refugios: despensa y caravana | | |
| 3. `nemesis` fuera del atlas | | |
| 4. Ajustes visibles | | |
| 4. Racha y pestañas | | |
| 4. Relato de cofre | | |
| 4. Relatos de marca y cacería | | |
| 4. Relatos de clima | | |
| 4. Relato de temperatura | | |
| 4. Expedición larga | | |
| 4. Por los pelos | | |
| 4. MVP | | |
| 4. Notas del diario | | |
| 4. Rasgos de frío y calor | | |
| 4. Buscavidas | | |
| 4. Curtido por las heridas | | |
| 4. Ajustes | | |
| Log final | | |
