# campfire

**Fogatas** en el campo. La leña o un kit encienden una fogata visible donde
estás; junto a ella se descansa, se cocinan los drops de los monstruos en
platos con buff y se venda una herida. Junto al fuego, la temperatura vuelve
a Cómoda.

Es el tercero de «Mods nuevos propuestos» en [`PLAN.md`](../PLAN.md) y entra
en H2 ([`ROADMAP.md`](../ROADMAP.md)). Da dos de los estados positivos de
[`BALANCE.md`](../BALANCE.md#lo-positivo): **Descansado** y **Comida
cocinada**. Una fogata en el campo **no** cuenta los relatos de `adventure`
(D10); eso queda para la fogata de un refugio restaurado (`refuges`).

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 0.2.0 (la de `mod.json`). La 0.2.0 (2026-10-23) saca
  Descansado a la función pública `F_Campfire_Rest`, para la fogata de
  `refuges`, y pasa cuatro valores de prueba a Settings (ver «Ajustes»); con
  los valores por defecto hace lo mismo que la 0.1.0
- **Decidido con el autor (2026-10-23):** la fogata es un NPC en el mapa
  (D28); la venda alivia una herida a la mitad hasta la posada o el templo,
  no la cura (D29); se cocina con drops estándar, recetas en un CSV (D30)
- **Probado:** solo comprobaciones estáticas: llaves y comillas
  equilibradas, cabeceras con tabuladores, etiquetas de `callsub` que
  existen, `mod.json` válido. Las recetas se generan sin errores y sus
  ingredientes existen en las tablas Renewal del rAthena fijado. Comprobado
  contra el rAthena fijado (`402dd11`): `duplicate` (devuelve el nombre
  único, corre el `OnInit` del duplicado y comparte las variables `.` con el
  original), `unloadnpc` (un NPC no puede descargarse a sí mismo),
  `npc_unload` no cierra el diálogo de quien esté hablando, un NPC flotante
  tiene sprite `JT_FAKENPC`, `JT_4_BONFIRE` = 10252, los objetos
  `DelayConsume` no se gastan solos, un diálogo abierto desde un objeto se
  corta al terminar su script, `getnpctimer(1)` dice si el reloj corre, y
  existen `distance`, `min`, `max`, `hideonnpc`, `SC_STRFOOD`…`SC_LUKFOOD`
- **Probado en el juego (0.2.0, 2026-10-24),** todo «Probarlo» salvo lo de
  dos jugadores:
  - **Proveedor y objetos:** el Proveedor está en `prontera 151,187` y vende
    Leña (300), Kit (900) y Venda (400); los objetos y los platos tienen
    icono y descripción en español; la Leña en Prontera dice «Aquí no hace
    falta una fogata» y no se gasta.
  - **Encender y apagarse** (`prt_fild08`): la fogata se ve (`4_BONFIRE`
    existe en el cliente), gasta una Leña y da el relato «Encendí mi primera
    fogata»; otra Leña a 1–2 celdas no se gasta; `@fogata` dice los minutos;
    encender otra con el Kit hace desaparecer la primera; «Apagar la fogata»
    la quita.
  - **Cocinar:** «(listo)» solo en lo que se puede hacer y los ingredientes
    que faltan en lo demás; la Brocheta gasta las 3 patas y da el relato
    «Cociné junto al fuego por primera vez»; Brocheta FUE +2 y hambre +25,
    Carne Asada VIT +2 y hambre +60.
  - **Vendar:** sin Venda pide una; con ella la Cicatriz del lobo sale
    «(vendada)» y resta la mitad de AGI; no se vuelve a ofrecer, ni una
    maldición; curada y vuelta a recibir, sale sin vendar.
  - **Temperatura** (`xmas_fild01`): junto a la fogata, Cómodo, «Estas
    junto a una fogata», presión de temperatura 0 y sin icono de frío; a 4
    celdas o más vuelve el frío en 4 s o menos.
  - **Descansado:** 20 minutos; la primera muerte en el campo sale sin
    herida y la segunda sí la deja.
- **Probado en el juego (0.2.0, 2026-10-26),** con «Probarlo» de
  [`refuges`](../refuges/README.md#probarlo): `F_Campfire_Rest` desde la
  hoguera de un refugio da Descansado 20 minutos y `@fogata` lo dice
- **Sin probar:** la fogata compartida (Cómodo, descansar y cocinar en la
  del compañero), que necesita dos jugadores; los ajustes de Settings
- **Actualizado:** 2026-10-26

## Instalar

Settings → Mods → **Add mod from folder…** → `my-mods/campfire`, recarga los
mods del servidor y **reinicia la aplicación** (trae `System/itemInfo.lua`).
Funciona solo, pero rinde con los demás: `world-atlas` (dónde no se puede
encender), `survival` (los platos sacian), `temperature` (Cómodo junto al
fuego, desde su 0.4.0) y `wounds` (venda y Descansado, desde su 0.6.0). Todas
son dependencias suaves.

## Qué hace

### Encender

| Objeto | ID | Precio | Fogata |
|---|---|---:|---|
| Leña | 51100 | 300 | 10 min |
| Kit de Acampada | 51101 | 900 | 30 min |
| Venda | 51102 | 400 | (se usa desde la fogata) |

Los vende el **Proveedor de Campamento**, en Prontera (`151,187`), junto al
Sastre de `temperature` y las cantimploras de `survival`. Precios y
duraciones son valores de prueba.

Al usar la leña o el kit aparece una **Fogata** (sprite `4_BONFIRE`) en tu
celda. El objeto solo se gasta si la fogata llega a encenderse. No se
enciende:

- en una ciudad o un interior (el atlas manda; sin él, las siete ciudades);
- a 2 celdas o menos de otra fogata encendida;
- con 64 fogatas ya encendidas en todo el mundo.

Cada personaje tiene **una** fogata: encender otra apaga la anterior. La
primera vez que enciendes una, y la primera vez que cocinas, publican un
relato Menor en `adventure` (`camp:first`, `cook:first`).

### Junto al fuego

A **3 celdas o menos** de una fogata encendida, `temperature` te deja en
**Cómodo**, sin el bono de «bien abrigado» (ese premia la ropa). Vale para
cualquiera, también para el compañero de grupo: la fogata es de todos (D28).

### Hablar con la fogata

| Opción | Qué hace |
|---|---|
| Descansar junto al fuego | **Descansado** durante 20 min: +30 % de regeneración natural de HP y SP, y la primera muerte fuera de una ciudad no deja herida en `wounds`. Dura aunque mueras; se pierde al salir del juego, y descansar otra vez lo renueva |
| Cocinar | lista las recetas, marca «(listo)» las que puedes hacer, enseña los ingredientes y cocina un plato cada vez |
| Vendar una herida | con una Venda, una herida (no una maldición) queda **a la mitad** hasta curarla en la posada o el templo (D29) |
| Apagar la fogata | solo quien la encendió |

`@fogata` dice cuánto Descansado te queda y si estás junto a una fogata.

### Platos

Cada plato da un estado de comida de rAthena durante **20 min** (uno más
fuerte del mismo atributo reemplaza al más débil, como en RO) y sacia si
`survival` está. Se venden a la tienda por poco: cocinar no es una fuente de
zeny (D24).

| Plato | ID | Ingredientes | Efecto | Hambre / sed |
|---|---|---|---|---|
| Brocheta de Saltamontes | 51110 | 3 Grasshopper's Leg (Rocker) | FUE +2 | +25 |
| Manzana Asada con Miel | 51111 | 2 Apple, 1 Honey | AGI +2 | +30 |
| Carne Asada | 51112 | 2 Meat | VIT +2 | +60 |
| Sopa de Setas | 51113 | 3 Mushroom Spore, 1 Red Herb | INT +2 | +30 / +15 |
| Guiso de Raíces | 51114 | 2 Carrot, 1 Potato | DES +2 | +40 |
| Compota de Frutos Rojos | 51115 | 2 Strawberry, 1 Grape | SUE +2 | +20 / +15 |

Todos los ingredientes los sueltan monstruos de Tier 1–2 de la región de
Prontera e Izlude (D19). Los valores son de prueba.

**Cambiar una receta:** se edita
[`registry/tools/campfire/recipes.csv`](../../registry/tools/campfire/recipes.csv)
y se regenera:

```
node registry/tools/campfire/build_recipes.cjs [carpeta db/re de rAthena]
```

Genera `npc/campfire-recipes.txt` (no se edita a mano). Comprueba que el plato
esté en `db/item_db.yml` del mod y, si encuentra las tablas de rAthena (por
defecto `vendor/rathena/db/re`), que existan los ingredientes. `--check`
falla si el archivo generado no está al día. Un plato nuevo necesita además
su entrada en `db/item_db.yml` y en `System/itemInfo.lua`, dentro del rango
51110–51199.

## Ajustes

En Settings → Mods → `campfire`; cambian al pulsar **Apply**. Son valores de
prueba.

| Ajuste | Por defecto | Qué cambia |
|---|---:|---|
| `firewood_minutes` | 10 | minutos que arde la fogata de la Leña |
| `kit_minutes` | 30 | minutos que arde la del Kit de Acampada |
| `rest_minutes` | 20 | duración de Descansado, también en la fogata de un refugio |
| `rest_regen` | 30 | % extra de regeneración natural de HP y SP con Descansado |

Las descripciones de los objetos (`System/itemInfo.lua`) siguen diciendo 10 y
30 minutos.

## Cómo funciona

- **Sin temporizadores por personaje.** Las fogatas viven en variables de
  servidor `$@cf_*` (ver la cabecera de `npc/campfire.txt`). `campfire_mgr`
  tiene un reloj de 5 s que solo corre mientras hay fogatas: oculta las que
  se apagan (`hideonnpc`) y las descarga (`unloadnpc`) un minuto después.
  No se descargan en el acto porque rAthena no cierra el diálogo de quien
  esté hablando con ellas.
- **La fogata es un duplicado** de la plantilla flotante `Fogata#cf`, creado
  con `duplicate` y el sprite 10252 (`4_BONFIRE`). La plantilla no tiene
  `OnInit` (cada duplicado lo correría) ni guarda nada en sus variables (los
  duplicados las comparten).
- **Descansado** es un `bonus_script` propio (flag 1032: se quita al salir
  del juego, y uno nuevo renueva al anterior), más `@cf_rest_until` y
  `@cf_ward`, que lee `wounds`. No se quita al morir: así dura lo mismo que
  `@cf_rest_until`, sin depender del orden en que rAthena corre el
  `OnPCDieEvent` de cada mod.
- **Los objetos para encender** son `DelayConsume`: rAthena no los gasta al
  usarlos, y `F_Campfire_Light` los quita solo si la fogata se enciende.
- Un servidor reiniciado o una recarga de scripts apagan todas las fogatas.

## Para otros mods

- **`F_Campfire_Near()`**, con el personaje adjunto: 1 + el índice de la
  fogata encendida a 3 celdas o menos, o 0. Llamarla solo si `$@cf_live` es
  distinto de 0: vale 0 sin `campfire` y cuando no arde ninguna, y así no se
  llama a una función que no existe. La usa `temperature`.
- **`F_Campfire_Rest()`** (desde 0.2.0), con el personaje adjunto: le da
  Descansado y devuelve sus minutos. No escribe nada en el diálogo. Llamarla
  tras comprobar `getnpcid(0, "campfire_mgr")`. La usa `refuges`.
- **`@cf_rest_until`** (hasta cuándo dura Descansado, `gettimetick(2)`) y
  **`@cf_ward`** (1 si la próxima muerte no debe dejar herida). Los lee
  `wounds`, que pone `@cf_ward` a 0 al gastarlo.

## Probarlo

Con `world-atlas`, `survival`, `temperature` 0.4.0 y `wounds` 0.6.0
activos, y la aplicación reiniciada.

1. **Carga:** `ragnarok-stack logs map 100` sin errores de `campfire.txt`
   ni de `campfire-recipes.txt`.
2. **Proveedor:** en Prontera `151,187` hay un vendedor con Leña, Kit y
   Venda, con sus iconos y descripciones.
3. **Ciudad:** usar la Leña en Prontera dice «Aquí no hace falta una fogata»
   y no la gasta.
4. **Encender:** en `prt_fild08`, usar la Leña. Aparece una fogata en tu
   celda, se gasta una Leña y sale el relato «Encendí mi primera fogata».
   Usar otra a tu lado: «Ya arde una fogata aquí al lado», sin gastarla.
5. **Temperatura:** en `xmas_fild01` sin ropa, `@temperatura` dice Helado o
   Congelado; encender una fogata y quedarse al lado: «Junto al fuego entras
   en calor» y `@temperatura` dice Cómodo. Alejarse 4 celdas: vuelve el frío.
6. **Descansar:** hablar con la fogata → Descansar. `@fogata` dice
   Descansado y la protección. Con una herida o sin ella, morir con `@die`
   en un campo: «Ibas descansado: esta vez sales sin herida». La segunda
   muerte ya deja herida.
7. **Cocinar:** con 3 Grasshopper's Leg (`@item 940 3`), la receta sale
   «(listo)»; cocinarla gasta las patas y da la Brocheta. Comerla: el icono
   de comida de FUE y hambre +25.
8. **Vendar:** con una herida (`@herida 1`) y una Venda, Vendar → Cicatriz
   del lobo. `@heridas` la muestra «(vendada)» y resta la mitad de AGI.
   Curarla en la posada quita la marca.
9. **Apagarse:** con la Leña (10 min) o «Apagar la fogata»: la fogata
   desaparece en 5 s o menos; hablar con ella justo antes dice «Solo quedan
   brasas». En el log, nada de `unloadnpc` ni `hideonnpc`.
10. **Compañero:** con un segundo personaje en el grupo, junto a la fogata
    del primero: Cómodo, y puede descansar y cocinar en ella.
