# temperature: temperatura del viajero

Requiere `world-atlas`. Prototipo en `my-mods/`.

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.5.1 (la de `mod.json`), escrita el 2026-10-24. Arregla el icono de calor que no salió en `moc_fild11` (ver «Falla en el juego (0.5.0)», abajo): además de saltarse el primer tick en un mapa nuevo, el icono espera a que el cliente termine de cargar el mapa. `OnPCLoadMapEvent` apunta el mapa en `@tp_loaded$`, y el icono se crea en el primer tick después de eso. Ese evento solo llega en mapas con `loadevent`, que pone `adventure` (`adventure-maps.txt`, los 230 del atlas); en un mapa sin él, o sin `adventure`, sigue la regla de la 0.4.1 (un tick de espera). Sin probar en el juego. La 0.5.0, del 2026-10-23: lee los **rasgos** de `adventure` 0.3: con `adv_trait_cold` (Hecho al frío) Helado y Congelado cuentan un grado menos, y con `adv_trait_heat` (Hecho al calor) lo mismo Acalorado y Sofocado; nunca llevan a Cómodo ni a su bono. El castigo y el bono pasan a **Settings** (`penalty_pct`, `warm_bonus`; ver «Ajustes»), con los mismos valores por defecto. También publica el **relato `temp:extreme` de `adventure`** 0.2 (Media, dependencia suave) la primera vez que estás Cómodo gracias a la ropa en un mapa de temperatura ±2 (no junto a una fogata). `@tp_told` evita llamarlo en cada tick. El aviso puede llegar al cambiar de mapa (el evento espera en la cola del personaje). Sin probar en el juego. La 0.4.1: arregla el icono que no salía al llegar a un mapa frío o caluroso (ver abajo). Apunta en `@tp_map$` el mapa del tick anterior. En el primer tick en un mapa nuevo, o tras entrar al juego, no crea el `bonus_script` del icono: la entrada del mapa anterior (renovada hace 4 s, dura 5) vence y apaga su icono, y el tick siguiente crea una nueva, que sí manda el icono con el cliente ya cargado. El icono tarda entre 4 y 8 s en salir tras llegar; el castigo no espera. Sin probar en el juego. La 0.4.0: junto a una fogata de [`campfire`](../campfire/README.md) (a 3 celdas o menos) la sensación es Cómodo, sin el bono de Bien abrigado; `@temperatura` lo dice y el aviso es «Junto al fuego entras en calor». Solo llama a `F_Campfire_Near` si `$@cf_live` no es 0, así que sin `campfire` no cambia nada. Sin probar en el juego (ver «Probarlo» de `campfire`). La 0.3.0: presión ([`BALANCE.md`](../BALANCE.md#tope-de-presión), D18). Publica `@pr_temp` (0–3, la distancia a Cómodo; 0 en ciudades e interiores) y, si la presión total de todos los mods pasa de 6, reduce sus castigos en proporción (`× 6 / total`, mínimo 1 punto); el bono de Bien abrigado no se reduce. Detalle en «Convivencia con otros mods», abajo. La 0.2.1: el icono va en su propio `bonus_script`, de texto fijo por icono, separado de la penalización. Antes iba dentro de la penalización, y cada `bonus_script` con icono lo apaga al vencer aunque otro con el mismo icono siga activo. Al pasar de Helado a Congelado, o al subir de nivel, el texto cambiaba, el viejo vencía y apagaba el icono del nuevo: la penalización seguía, pero sin icono. La 0.2.0 pasó el `addtimer` por personaje a un solo reloj del NPC (error `event queue is full`)
- **Probado en el juego (0.2.0, 2026-10-17):** el Sastre aparece y vende las cuatro prendas; `@temperatura` da lugar, clima y ropa acordes al mapa y al equipo; los avisos de cambio de estado salen bien; en Prontera dice «a gusto» con o sin ropa. El icono de calor (Overheat) salió con ropa de abrigo en `moc_fild11`, que es lo esperado. El icono de frío falló: una vez se quedó puesto y otra no apareció (arreglado en 0.2.1)
- **Falla en el juego (0.4.0, 2026-10-23): el icono no sale al llegar a un mapa frío o caluroso.** Sin ropa, en `xmas_fild01` (Helado) no salió el de frío, y en `moc_fild11` (Acalorado) no salió el de calor. En `mjolnir_12` sí salió el de frío cuando empezó Frío extremo con el personaje ya en el mapa. **Causa,** leída en el código del rAthena fijado y del cliente: con el flag `BSF_FORCE_REPLACE`, un `bonus_script` con el mismo texto solo alarga su temporizador (`pc_bonus_script_add`, `settick_timer`) y no vuelve a mandar el icono. El icono sale una sola vez, al crearse la entrada (`pc_bonus_script`). Tras un `@warp`, esa primera vez cae mientras el cliente carga el mapa, y roBrowser tira el paquete porque su personaje aún no está en el `EntityManager` (`onEntityStatusChange`). Nunca se repite. El castigo sí se aplica. Arreglado en 0.4.1
- **Por diseño, no es un fallo:** la Ventisca no lleva a Congelado. Solo Frío extremo y Calor intenso suman ±1 a la sensación (`@clima_*_extra_loss` de `clima`); la Ventisca pone su propio `SC_FREEZE` y deja `xmas_fild01` en Helado (−2). El paso del guion que esperaba Congelado estaba mal. Si se quiere que la Ventisca también enfríe, es un cambio de `clima`
- **Probado en el juego (0.5.0, 2026-10-24):** el icono de frío sale entre 4 y 8 s después de llegar a `xmas_fild01`, sigue puesto y se apaga unos 5 s después de volver a Prontera; de `xmas_fild01` a `mjolnir_12` (Frío extremo) vuelve en 8 s o menos; al salir del juego en `xmas_fild01` y volver a entrar, sale en 8 s o menos. Junto a una fogata de `campfire`, Cómodo («Junto al fuego entras en calor»), presión 0 y sin icono; a 4 celdas o más vuelve el frío en 4 s o menos
- **Falla en el juego (0.5.0, 2026-10-24): el icono de calor no salió en `moc_fild11`** (de `xmas_fild01` a Prontera y luego a `moc_fild11`, con Calor intenso activo). El log del map-server no tiene errores; el atlas da +2 al mapa, así que el estado era Acalorado o Sofocado y el castigo se aplicaba. **Causa probable,** por descarte: la espera fija de la 0.4.1 (un tick, 4 a 8 s) no basta si el cliente tarda más en cargar el mapa; roBrowser tira el paquete del icono mientras el personaje no existe (`onEntityStatusChange`, `if (!entity) return`) y rAthena no lo repite. Arreglado en 0.5.1, sin confirmar
- **Sin probar (0.5.1):** el icono de calor en `moc_fild11` tras llegar desde una ciudad o desde `xmas_fild01`; que el de frío siga saliendo igual
- **Ojo, iconos prestados:** el de frío es `EFST_COLD`, el mismo de Cristalización (`SC_CRYSTALIZE`), y el cliente lo nombra «Crystallization»; el de calor es `EFST_OVERHEAT`, el sobrecalentamiento del Mado Gear del Mechanic, y el cliente enseña esa descripción. Si el estado real llega a la vez (un monstruo que cristaliza, un Mechanic con Mado Gear), los dos comparten icono y el primero que termine lo apaga. Pendiente en [`ROADMAP.md`](../ROADMAP.md#otros-pendientes-de-los-mods-existentes)
- **Probado en el juego (0.3.0, 2026-10-23):** el tope en `xmas_fild01`
  (Helado cuenta 2 en `@presion`; con el tope el AGI baja algo menos; con el
  Abrigo Polar pasa a 0–1 y el tope desaparece); sin temperatura en los
  interiores del atlas, con o sin abrigo; Cómodo sin ropa en `prt_fild00`,
  `prt_monk` e `izlu2dun`
- **Probado en el juego (0.4.0, 2026-10-23):** el icono de frío en
  `mjolnir_12` (−1 del lugar y −1 de Frío extremo, Helado) cuando el evento
  empieza con el personaje en el mapa
- **Actualizado:** 2026-10-24

No es una barra que baje: cada 4 segundos se calcula una **sensación** y se
traduce a un estado con nombre. Decisión del jugador: qué ropa llevar según
adónde va.

```
sensación = temperatura del mapa (atlas, -2..2)
          + exposición de clima (Calor intenso +1, Frío extremo -1)
          + abrigo de lo puesto (positivo abriga, negativo refresca)
```

| Sensación | Estado | Efecto (valores de prueba) |
|---|---|---|
| -3 | Congelado | AGI y DEX −(2 + nivel/12, máx 10), HP máx −5 % · icono de frío |
| -2 | Helado | AGI −(1 + nivel/20, máx 6) · icono de frío |
| -1 | Fresco | solo el aviso |
| 0 | Cómodo | si el lugar es extremo y tu ropa lo compensa: **HP y SP máx +3 %** |
| 1 | Cálido | solo el aviso |
| 2 | Acalorado | INT −(1 + nivel/20, máx 6) · icono de calor |
| 3 | Sofocado | INT y VIT −(2 + nivel/12, máx 10), SP máx −5 % · icono de calor |

Nunca impide jugar: solo resta atributos o un poco de HP/SP máximos.
**En las siete ciudades no hay temperatura** (`F_Atlas_IsSafe`). El abrigo
cuenta también donde la temperatura del lugar es 0: una capa de piel en un
campo templado te deja Acalorado.

## Ajustes

En Settings → Mods → `temperature`; cambian al pulsar **Apply** (reinicia el
servidor). Los marcados «de prueba» son los valores de las sesiones de prueba.

| Ajuste | Por defecto | Qué cambia |
|---|---:|---|
| `penalty_pct` | 100 | de prueba: escala los atributos y el HP/SP que restan los estados (mínimo 1 punto) |
| `warm_bonus` | 3 | de prueba: % de HP y SP máx de Bien abrigado |

## Ropa

| Id | Objeto | Slot | Abrigo | Precio |
|---|---|---|---|---|
| 50840 | Capa de Piel | Garment | +2 | 4000 |
| 50841 | Chaleco de Lana | Armor | +1 | 1500 |
| 50842 | Manto de Lino | Garment | −2 | 3000 |
| 50843 | Túnica Fresca | Armor | −1 | 1200 |
| 50833 | Abrigo Polar (de `clima`) | Garment | +2 | — |
| 50832 | Sombrero del Desierto (de `clima`) | Head_Top | −1 | — |

Los dos de `clima` cuentan sin dependencia: si ese mod no está, sus ids nunca
coinciden. Un único **Sastre del Viajero** en Prontera (149,187) los vende; es
el único punto de venta. La tabla de abrigo está en `OnInit` de `temp_mgr`.

## Convivencia con otros mods

- `world-atlas`: `F_Atlas_Temp` y `F_Atlas_IsSafe`. Obligatorio.
- `clima`: lee `@clima_thirst_extra_loss`, `@clima_hunger_extra_loss` y
  `@clima_exposure_map$`. Esas variables solo se activan si el personaje **no**
  está protegido por el objeto de clima, así que el calor/frío de clima no se
  cuenta dos veces.
- `campfire` (opcional): junto a una de sus fogatas, Cómodo. Lee `$@cf_live`
  y, si no es 0, llama a `F_Campfire_Near`. Deja `@tp_fire` a 1.
- `survival` y `wounds`: cada uno tiene su propio `bonus_script` (texto
  distinto), así que se suman. Al cambiar de estado, el penalizador anterior
  tarda hasta 5 s en agotarse.
- **Tope de presión:** lee `@pr_survival`, `@pr_wounds` y `@pr_clima` (este
  solo si `@pr_clima_map$` es el mapa actual) y publica `@pr_temp`. Con más
  de 6 en total, los puntos de atributo y el −5 % de HP o SP máximos se
  multiplican por `6 / total` (mínimo 1 punto). `.pr_cap` en `OnInit` debe
  valer lo mismo que en `survival` y `wounds`. `@presion` (de `survival`)
  muestra el desglose.
- Un único reloj del NPC para todos (`OnTimer4000` de `temp_mgr`, con
  `initnpctimer`), que entra en cada jugador con `attachrid`. No usa `addtimer`
  por personaje: esas cadenas morían durante los diálogos (error «event queue
  is full», ver [`CONVENTIONS.md`](../CONVENTIONS.md#temporizadores)).

## Comandos

- `@temperatura`: estado y desglose (lugar, clima, ropa).

## Qué probar en el juego

1. Carga: `ragnarok-stack logs map 100` sin errores de `temperature.txt`.
2. Comprar en el Sastre; `@temperatura` en Prontera dice «a gusto».
3. En `xmas_fild01` (nieve, −2) sin ropa: Helado + icono de frío; con Capa de
   Piel: Cómodo y bono +3 %. En un desierto (`moc_fild11`, +2) con la Capa:
   Sofocado.
4. Que el icono (`EFST_COLD`, `EFST_OVERHEAT`) se vea en roBrowser; no se ha
   comprobado.
5. Que la celda (149,187) del Sastre sea transitable y el sprite `4_F_01`
   se vea.
6. Los iconos de inventario usan nombres de recurso coreanos reutilizados de
   `clima`; validar que se vean.

## Pendiente

- Consumibles que abriguen o refresquen (té, agua fresca) y descansar junto al
  fuego (`campfire`, en [`PLAN.md`](../PLAN.md#mods-nuevos-propuestos)).
- Valores de balance, la lista de prendas y su arte propio.

### Próximos cambios propuestos (revisión 2026-10-17)

Sin implementar. El porqué está en [`BALANCE.md`](../BALANCE.md) y
[`ADVENTURE.md`](../ADVENTURE.md).

- **Repartir la ropa por ciudades** (identidad de ciudad): capas de piel en
  Payon, túnicas frescas en Morocc, lana en Aldebaran. Hoy el Sastre de
  Prontera es el único punto de venta.
- **Fogata:** junto al fuego de `campfire` la sensación vuelve a Cómodo.
- **Rasgos:** leer `adv_trait_cold` y `adv_trait_heat` (la sensación cuenta 1
  menos en ese extremo).
- **Estado En forma:** Cómodo en un mapa extremo cuenta para el bono de
  relatos de `adventure`.
- **Experiencia:** la primera vez Cómodo en un mapa de ±2 gracias a la ropa,
  `temp:extreme` (Media).
- Valores de prueba como `settings` en `mod.json`: hecho en 0.5.0.
