# Balance: presión y alivio

Cómo deben convivir hambre, sed, temperatura, clima y heridas para que
**importen sin ser un impuesto**. Es una guía de diseño; cada mod documenta en
su README lo que hace hoy. Lo que mueve al jugador a afrontar esa presión, la
EXP por experiencias, está en [`ADVENTURE.md`](./ADVENTURE.md).

## El problema de partida

**Estado (2026-10-17):** hechos los escalones por eje de `survival` (1.2.0),
Bien alimentado e Hidratado, `@pr_*` en los cuatro mods, el tope y
`@presion`. Sin probar en el juego; el guion está en el README de
[`survival`](./survival/README.md#probarlo-en-una-sesión-larga). Falta lo
demás de «Lo positivo» y que la presión crezca con el Tier.

Todos los sistemas castigaban y casi ninguno premiaba, y sus castigos se
sumaban sin tope. Con los valores de antes de `survival` 1.2.0, un personaje
que volvía de una mala expedición podía llevar a la vez:

| Fuente | Castigo actual |
|---|---|
| `survival`, hambre y sed a 0 | −40 % en los seis atributos y en la velocidad |
| `temperature`, Sofocado o Congelado | hasta −10 en dos atributos y −5 % de HP o SP máximos |
| `wounds`, 3 heridas | hasta −14 por atributo cada una |
| `clima` | su estado alterado |

Eso no "debilita": deja al personaje inútil, contra la decisión D15
([`DECISIONS.md`](./DECISIONS.md)). Y lo
contrario tampoco sirve: si los castigos son blandos, el jugador cruza todo sin
mirar.

## Principios

1. **La presión crece con el Tier.** En un campo de Tier 1 los sistemas son
   suaves y sirven para aprender. En Tier 4 o 5 son duros: sin prepararte no
   aguantas. Así, ignorar los sistemas solo es posible quedándose en zonas
   fáciles, que es justo donde las experiencias pagan poco
   ([factor de Tier](./ADVENTURE.md#cuánta-exp-da-una-experiencia)). La
   presión y la progresión quedan atadas.
2. **Cada sistema castiga un eje distinto.** Si todos restan los mismos
   atributos, se suman en el mismo lugar y matan el personaje. Repartidos, cada
   uno cambia una forma de jugar.
3. **Escalones con nombre, con aviso antes del castigo.** El primer escalón
   solo avisa; el castigo llega en el segundo. Nunca un número que baja y ya.
4. **Cada castigo tiene su recompensa espejo.** Si el hambre puede castigar,
   estar bien alimentado debe premiar.
5. **Un tope de presión total.** Por mucho que se acumule, el personaje sigue
   pudiendo luchar, caminar y volver.
6. **La maestría reduce, no anula.** Los
   [rasgos](./ADVENTURE.md#rasgos-maestrías-propias-de-los-mods) bajan un
   castigo concreto; no hacen inmune.

## Ejes por sistema (propuesta)

| Sistema | Aviso | Castigo | Extremo | Eje |
|---|---|---|---|---|
| Hambre | Hambriento (< 30) | sin regeneración natural de HP | Famélico (0): −10 % HP máx y ATK | aguante |
| Sed | Sediento (< 30) | sin regeneración natural de SP | Deshidratado (0): +10 % de tiempo de casteo y −ASPD | ritmo |
| Frío | Fresco | AGI (Helado) | AGI, DEX y HP máx (Congelado) | agilidad |
| Calor | Cálido | INT (Acalorado) | INT, VIT y SP máx (Sofocado) | mente |
| Heridas | — | un atributo o HP/SP máx por herida | — | cicatriz concreta |
| Clima | el pronóstico | su estado | — | evento |

La **velocidad de movimiento** solo baja en un extremo (Famélico **y**
Deshidratado a la vez): perder movilidad impide volver, y volver tiene que ser
siempre posible.

`temperature` y `wounds` ya castigan ejes propios. El cambio grande es en
`survival`: dejar el −20 % a los seis atributos y pasar a escalones por eje (hecho en `survival` 1.2.0).

## Tope de presión

Cada mod publica cuánta presión aplica, en puntos, en una variable temporal del
personaje (las `@variables` se leen desde cualquier NPC):

| Variable | Valores |
|---|---|
| `@pr_survival` | 0 bien, 1 aviso, 2 castigo, 3 extremo |
| `@pr_temp` | 0 a 3 (por la distancia a Cómodo) |
| `@pr_wounds` | número de heridas activas |
| `@pr_clima` | 1 si hay un evento sin protección |

Con más de **6 puntos** en total, cada mod reduce su propio castigo en
proporción (`castigo × 6 / total`). Así no hace falta un controlador único: cada
mod sigue con su `bonus_script`, pero todos respetan el tope. Un comando
`@presion` muestra el desglose.

## Lo positivo

Recompensas espejo, de más simple a más trabajo:

| Estado | Condición | Efecto (inicial) | Mod |
|---|---|---|---|
| **Bien alimentado** | hambre > 70 | +regeneración de HP | `survival` |
| **Hidratado** | sed > 70 | +regeneración de SP | `survival` |
| **Bien abrigado** | Cómodo en un mapa extremo gracias a la ropa | HP y SP máx +3 % (ya existe) | `temperature` |
| **En forma** | los tres anteriores a la vez, fuera de la ciudad | **+15 % a los relatos** de esta expedición | `survival` + `temperature` → `adventure` |
| **Descansado** | dormir en la posada o junto a una fogata | regeneración extra los primeros 20 min, y la primera muerte de la expedición no deja herida | `wounds`, `campfire` |
| **Comida cocinada** | cocinar en una fogata | buff temporal con nombre (más que el alimento crudo) | `campfire` |
| **Compañía** | grupo de 2 en el mismo mapa | hambre y sed bajan un 25 % más lento | `survival` |
| **Racha** | experiencias seguidas en una expedición | hasta +50 % de EXP | `adventure` |
| **Lo que no te mata** | curar una herida por primera vez | rasgo pequeño frente a su origen | `wounds` → `adventure` |
| **Pronóstico** | preguntar en la taberna | saber qué clima viene y llevar la protección | `clima`, `tavern-rumors` |

"En forma" es el que más importa: convierte la preparación en EXP. Prepararse
deja de ser evitar un castigo y pasa a ser la forma de ganar más.

## Cómo ajustarlo

Encontrar el punto justo es un problema de datos, no de intuición.

1. **Objetivo por Tier.** Cuánto debería aguantar fuera un jugador antes de
   tener que volver (valores iniciales):

   | Tier | Sin preparar | Preparado |
   |---|---:|---:|
   | 1 | 40 min | sin límite práctico |
   | 2–3 | 25 min | 60 min |
   | 4–5 | 12 min | 40 min |
   | 6 | 8 min | 25 min |

   "Preparado" significa comida, cantimplora, la ropa del bioma y la protección
   del clima de la zona.
2. **Medirlo.** El resumen de expedición de `adventure` registra duración,
   Tier más alto, muertes y presión máxima. Tras unas sesiones, comparar con la
   tabla.
3. **Ajustar con opciones, no con código.** Cada mod expone sus ritmos y
   castigos como `settings` en `mod.json` (el límite ya es de 40 por mod).
   Hecho el 2026-10-23 en todos los mods que castigan; ver «Ajustes» en el
   README de cada uno. Siguen en los scripts los umbrales de `survival` y el
   tope de presión (`.pr_cap`), que debe ser igual en tres mods.
4. **Una variable por vez.** Si una expedición se acorta demasiado, mirar qué
   sistema aportó la presión (`@presion`) antes de tocar nada.

## Qué cambia en cada mod

Resumen; el detalle está en la sección «Próximos cambios» del README de cada
uno.

- `survival`: escalones por eje, Bien alimentado e Hidratado, desgaste según el
  Tier y la temperatura, Compañía, `@pr_survival`.
- `temperature`: `@pr_temp`, rasgos de frío y calor, el estado En forma.
- `wounds`: `@pr_wounds`, Descansado, Lo que no te mata, curarse entre
  compañeros.
- `clima`: `@pr_clima` y el pronóstico.
