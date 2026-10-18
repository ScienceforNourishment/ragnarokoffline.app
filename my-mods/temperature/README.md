# temperature: temperatura del viajero

Requiere `world-atlas`. Prototipo en `my-mods/`.

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.2.1 (la de `mod.json`): el icono va en su propio `bonus_script`, de texto fijo por icono, separado de la penalización. Antes iba dentro de la penalización, y cada `bonus_script` con icono lo apaga al vencer aunque otro con el mismo icono siga activo. Al pasar de Helado a Congelado, o al subir de nivel, el texto cambiaba, el viejo vencía y apagaba el icono del nuevo: la penalización seguía, pero sin icono. La 0.2.0 pasó el `addtimer` por personaje a un solo reloj del NPC (error `event queue is full`)
- **Probado en el juego (0.2.0, 2026-10-17):** el Sastre aparece y vende las cuatro prendas; `@temperatura` da lugar, clima y ropa acordes al mapa y al equipo; los avisos de cambio de estado salen bien; en Prontera dice «a gusto» con o sin ropa. El icono de calor (Overheat) salió con ropa de abrigo en `moc_fild11`, que es lo esperado. El icono de frío falló: una vez se quedó puesto y otra no apareció (arreglado en 0.2.1)
- **Sin probar:** los iconos con la 0.2.1: que el de frío salga en `xmas_fild01` sin ropa, siga al pasar de Helado a Congelado y se apague unos 5 s después de volver a la ciudad
- **Ojo, iconos prestados:** el de frío es `EFST_COLD`, el mismo de Cristalización (`SC_CRYSTALIZE`), y el cliente lo nombra «Crystallization»; el de calor es `EFST_OVERHEAT`, el sobrecalentamiento del Mado Gear del Mechanic, y el cliente enseña esa descripción. Si el estado real llega a la vez (un monstruo que cristaliza, un Mechanic con Mado Gear), los dos comparten icono y el primero que termine lo apaga. Pendiente en [`ROADMAP.md`](../ROADMAP.md#otros-pendientes-de-los-mods-existentes)
- **Actualizado:** 2026-10-17

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
- `survival` y `wounds`: cada uno tiene su propio `bonus_script` (texto
  distinto), así que se suman. Al cambiar de estado, el penalizador anterior
  tarda hasta 5 s en agotarse.
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
- **Presión:** publicar `@pr_temp` (0–3, distancia a Cómodo) y reducir el
  castigo propio si la presión total supera el tope.
- **Rasgos:** leer `adv_trait_cold` y `adv_trait_heat` (la sensación cuenta 1
  menos en ese extremo).
- **Estado En forma:** Cómodo en un mapa extremo cuenta para el bono de
  relatos de `adventure`.
- **Experiencia:** la primera vez Cómodo en un mapa de ±2 gracias a la ropa,
  `temp:extreme` (Media).
- Valores de prueba como `settings` en `mod.json`.
