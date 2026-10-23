# survival

Mod único que combina las necesidades de hambre y sed para personajes de
Ragnarok Offline. Es independiente de `clima`; esa integración es opcional y
solo se activa cuando ambos mods están habilitados.

## Estado

Única fuente del estado de este mod; los demás documentos enlazan aquí.
Actualízala al cambiar el mod o al probarlo.

- **Versión:** 1.2.0 (la de `mod.json`): rebalanceo de presión
  ([`BALANCE.md`](../BALANCE.md), D18). El −20 % a los seis atributos y a la
  velocidad pasa a **escalones por eje** (ver «Escalones»), con dos estados
  positivos, Bien alimentado e Hidratado; publica `@pr_survival` y respeta el
  tope de presión común; nuevo comando `@presion`. Los medidores avisan desde
  30, no solo en 0. La 1.1.0: los tres temporizadores por personaje (`OnHungerTick`, `OnThirstTick`, `OnPenaltyTick`) pasan a **un solo reloj del NPC** cada 4 s que entra en cada jugador con `attachrid`. Arregla el error `player's event queue is full`: un diálogo de NPC llenaba la cola de 2 huecos del personaje y la cadena descartada moría para toda la sesión. Hambre y sed siguen bajando de media cada 15 s (contados por hora en `@sv_need_at`); cada punto puede llegar hasta 4 s tarde. Quitado el diagnóstico `[qdebug]`
- **Probado en el juego:** con la 1.0.0 se usa en partidas; no hay registro detallado de qué se comprobó. 2026-10-17: el vendedor de cantimploras aparece y vende la cantimplora 3/3 y la vacía
- **Sin probar:** todo con la 1.2.0: los escalones, sus efectos y mensajes,
  el tope y `@presion` (guion en «Probarlo en una sesión larga»). Con la 1.1.0: sobre todo que hambre, sed y penalización sigan después de hablar un rato con un NPC; la integración con `clima` tras su paso a biomas; las zonas seguras leídas del atlas
- **Actualizado:** 2026-10-17

## Qué incluye

- Hambre y sed de **0 a 100**, guardadas por personaje entre sesiones.
- Cada necesidad baja **1 punto cada 15 segundos mientras el personaje está
  conectado**. Este intervalo rápido es de prueba y no es una opción de
  Settings.
- **En las ciudades principales no baja ninguna necesidad**: Prontera, Izlude,
  Geffen, Payon, Morocc, Alberta y Aldebaran (mapas exteriores). El reloj
  sigue corriendo; solo se omite el descuento. Si una
  necesidad ya está en 0, la penalización sigue activa en la ciudad hasta que
  el personaje coma o beba. Para añadir un interior u otro asentamiento, agrega
  su nombre de mapa a `.safe_maps$` en `OnInit` de `npc/survival.txt`.
- Si el mod `clima` también está activo, Calor intenso puede añadir 1 punto
  extra de pérdida de sed por tick y Frío extremo 1 punto extra de pérdida de
  hambre. En esas exposiciones se pierden 2 puntos cada 15 segundos; al terminar
  el evento o salir del mapa, vuelve la pérdida normal.
- Los alimentos restauran hambre. Las 14 bebidas y las pociones con ID
  501–506 restauran sed, pero no hambre. Las pociones recuperan 5/10/15/20/10/5
  puntos respectivamente (Red, Orange, Yellow, White, Blue y Green).
- Dos medidores en pantalla: sed debajo de hambre.
- Cada necesidad pasa por escalones con nombre (ver «Escalones»): arriba de
  70 premia, por debajo de 50 avisa, por debajo de 30 castiga y en 0 castiga
  más. Hambre y sed castigan **ejes distintos** (aguante y ritmo) para que no
  se sumen en los mismos atributos.

## Escalones

Valores de prueba, en `OnInit` de `npc/survival.txt` (`.good`, `.warn`,
`.low` y los efectos).

| Valor | Hambre | Sed | Efecto |
|---|---|---|---|
| 71–100 | **Bien alimentado** | **Hidratado** | regeneración natural de HP (hambre) o de SP (sed) **+20 %** |
| 50–70 | Saciado | Sin sed | nada |
| 30–49 | Con hambre | Con sed | solo el aviso |
| 1–29 | Hambriento | Sediento | sin regeneración natural de HP (hambre) o de SP (sed) |
| 0 | Famélico | Deshidratado | hambre: además HP máx y ATK −10 %. Sed: además tiempo de lanzamiento +10 % y ASPD −10 % |
| las dos en 0 | | | además, velocidad de movimiento −20 % |

- Cada cambio de escalón da **un** mensaje, distinto al bajar y al subir
  («Empiezas a tener hambre» frente a «Ya no estás hambriento»). Comer puede
  saltar varios escalones: solo se anuncia aquel al que llegas.
- La velocidad solo baja con las dos a 0: perder movilidad impide volver, y
  volver tiene que ser siempre posible ([`BALANCE.md`](../BALANCE.md#ejes-por-sistema-propuesta)).
- **Tope de presión.** El peor de los dos escalones se publica en
  `@pr_survival` (0 de 50 para arriba, 1 aviso, 2 castigo, 3 en 0). Si la
  suma con `@pr_temp`, `@pr_wounds` y `@pr_clima` pasa de 6, los porcentajes
  de castigo se reducen en proporción (`castigo × 6 / total`); quitar la
  regeneración no se reduce, y el bono de Bien alimentado e Hidratado tampoco.
- `@presion` muestra la presión de cada sistema, el total y si el tope
  actúa, junto con el escalón de hambre y de sed.
- Los efectos siguen activos en la ciudad: una necesidad en 0 pesa hasta que
  el personaje come o bebe (D16 solo pausa el descenso).

## Estructura

```text
survival/
├── mod.json
├── README.md
├── System/
│   └── itemInfo.lua
├── client/
│   ├── index.js
│   └── thirst.js
├── data/
│   └── texture/
│       └── ui/
│           ├── collection/
│           │   ├── canteen_0.bmp
│           │   ├── canteen_1.bmp
│           │   └── canteen_3.bmp
│           └── item/
│               ├── canteen_0.bmp
│               ├── canteen_1.bmp
│               └── canteen_3.bmp
├── db/
│   └── item_db.yml
└── npc/
    ├── canteen_vendor.txt
    └── survival.txt
```

`db/item_db.yml` conserva los efectos de hambre de los alimentos y hace que las
bebidas y pociones ID 501–506 recuperen solo sed.
`npc/survival.txt` mantiene los valores y **un solo reloj** para todos los
personajes (`OnTimer4000` de `survival_mgr`, con `initnpctimer`): cada 4 s
entra en cada jugador conectado con `attachrid`, descuenta hambre y sed si les
toca (`S_Needs`, cada 15 s) y renueva la penalización (`S_Penalty`). No usa
`addtimer` por personaje, porque esas cadenas morían durante los diálogos (ver
[`CONVENTIONS.md`](../CONVENTIONS.md#temporizadores)). Lee los indicadores
`@clima_thirst_extra_loss`, `@clima_hunger_extra_loss` y
`@clima_exposure_map$` que publica `clima`, sin crear temporizadores
adicionales. Con la configuración de prueba actual, Calor intenso está en
`prt_fild09` y añade pérdida de sed; Frío extremo está en `prt_fild10` y añade
pérdida de hambre. Cada evento eleva la pérdida correspondiente de 1 a 2
puntos por tick de 15 segundos. Los nombres de variables existentes
(`hm_hunger`, `hm_initialized`, `thirst_value` y
`thirst_initialized`) se mantienen para conservar el estado de los personajes
al migrar desde los mods anteriores. `client/` dibuja ambos medidores.

## Instalar y probar

1. En **Settings → Mods**, desactiva los antiguos `hunger-mod` y `thirst-mod`.
   No los dejes activos junto con `survival`, porque sus controladores
   duplicarían temporizadores y penalizaciones.
2. Instala la carpeta `survival` desde **Add mod from folder…** (o cópiala a la
   carpeta de mods de la aplicación), actívala y pulsa **Apply**.
3. Cierra y vuelve a abrir la aplicación para cargar el plugin del cliente.
4. Entra con un personaje: deben aparecer ambos medidores. La comida restaura
   hambre y las bebidas y pociones ID 501–506 restauran sed, sin recuperar
   hambre. Con `clima` activado, compara el ritmo normal con Calor intenso en
   `prt_fild09` y Frío extremo en `prt_fild10`.
5. Recorre los escalones con el guion de «Probarlo en una sesión larga».

Prueba con un personaje de prueba. Los cambios de `npc/` y `db/` requieren que
el servidor vuelva a cargar el mod; los cambios de `client/` requieren
reiniciar la aplicación.

## Probarlo en una sesión larga

Guion para la 1.2.0, pensado para la misma sesión que `temperature`,
`wounds` y `clima` (el tope se prueba con los cuatro). Personaje `tester`
(GM). Para no esperar el ritmo de prueba (de 100 a 0 son 25 minutos), pon el
valor a mano con `@set hm_hunger 25` o `@set thirst_value 0` *(verificar
que el grupo de `tester` tiene `@set`)*; el medidor se pone al día en el
siguiente tick, como mucho 15 s después. Hazlo en un campo
(`prt_fild08`), no en la ciudad.

**1. Carga.** `ragnarok-stack logs map 200`: sin errores de `survival.txt`.
Al entrar, con hambre y sed en 100: «Estás bien alimentado» y «Estás
hidratado».

**2. Escalones**, mirando el chat y los medidores en un campo:

| Momento | Debe pasar |
|---|---|
| hambre baja de 71 a 70 | «Ya no estás bien alimentado» |
| baja a 49 | «Empiezas a tener hambre»; `@presion`: necesidades 1 |
| baja a 29 | «Estás hambriento…»; el medidor se pone naranja con `!`; el HP deja de regenerarse sentado (`/sit`); `@presion`: necesidades 2 |
| llega a 0 | «Estás famélico…»; HP máx y ATK bajan un 10 % en la ventana de estado (Alt+A); el medidor en rojo y el `!` dice «Famélico» |
| sed llega a 0 también | «Sin comida ni agua, apenas puedes andar»; caminas más despacio |
| comes desde 0 | un solo mensaje, el del escalón al que llegas: «Ya no estás famélico, pero sigues hambriento» (1–29), «Ya no estás hambriento…» (30–49), «Ya no tienes hambre» (50–70) o «Estás bien alimentado» (71 o más); desde 30, el HP vuelve a regenerarse |

Repite con la sed: Sediento corta la regeneración de SP; Deshidratado alarga
el tiempo de lanzamiento (un Mage con Fire Bolt) y baja la ASPD.

**3. Bien alimentado e Hidratado.** Con las dos por encima de 70, sentado,
compara cuánto HP y SP recuperas por tick con un personaje a 60: debe ser un
20 % más.

**4. Tope.** Con hambre y sed en 0 (necesidades 3), en `xmas_fild01` sin
ropa (temperatura 2, Helado) y con dos heridas (`@herida 1`, `@herida 5`):
`@presion` da 7 y «cada castigo se reduce al 85 %» (8 si hay un evento de
`clima` sin protección: 75 %). El −10 % de Famélico
pasa a −8 % y el AGI de Helado y de la herida baja algo menos. Cúrate una
herida: vuelve a 6 y el tope deja de actuar.

**5. Ciudad.** Con una necesidad en 0, entra en Prontera: no baja más, pero
el castigo sigue hasta comer o beber. En `prt_in` (interior del atlas), lo
mismo.

**6. Diálogo largo.** Habla un minuto con un NPC sin cerrar el diálogo:
hambre y sed siguen bajando después y los mensajes de escalón siguen saliendo.

**Qué apuntar.** Los efectos que no se noten. Tres bonos están sin comprobar
en el rAthena fijado (no hay copia de `vendor/rathena` en este equipo):
`bNoRegen` con la máscara 3 (las dos a la vez), `bAtkRate` negativo y
`bSpeedRate` negativo. Si la velocidad no baja con las dos en 0, prueba
`bSpeedAddRate` en su lugar; si la máscara no corta las dos regeneraciones,
dos `bonus bNoRegen` separados.

## Ajustar la velocidad de prueba

En `OnInit` de `npc/survival.txt`, cambia `.need_every` (segundos entre cada
punto perdido; hambre y sed comparten el ritmo). Por ejemplo, `60` equivale a
un punto por minuto. Como el reloj pasa cada 4 s, cada punto llega con hasta
4 s de retraso, pero el ritmo medio se mantiene. No cambies el `OnTimer4000`
para ajustar el ritmo: es también el que renueva la penalización, que dura 5 s.

## Zonas seguras: dónde no bajan hambre y sed

Dentro de una zona segura, `S_Needs` no descuenta puntos. El reloj sigue
corriendo, por lo que al salir del mapa el ritmo normal se reanuda de
inmediato, sin reiniciar nada. El medidor sigue recibiendo su actualización en
cada tick.

Qué no cambia dentro de una zona segura:

- `S_Penalty` sigue corriendo. Si una necesidad ya está en 0 (o por debajo
  de 30), su castigo continúa hasta que el personaje coma o beba.
- Los objetos siguen restaurando hambre y sed.
- La pérdida extra por exposición de `clima` no aplica allí, porque sus
  eventos ocurren en mapas de campo.

Un mapa es seguro si se cumple **cualquiera** de estas dos cosas:

1. El mod `world-atlas`, si está cargado, lo marca como `city`
   (`F_Atlas_IsSafe`). Hoy son los mapas exteriores de las siete ciudades
   principales (`prontera`, `izlude`, `geffen`, `payon`, `morocc`,
   `alberta` y `aldebaran`) y, desde `world-atlas` 0.2.0, los interiores
   de Prontera e Izlude (`kind` `interior`).
2. Está en la lista `.safe_maps$` de `npc/survival.txt`, con los mismos siete
   mapas. Es la lista de reserva: sin el atlas, o para un mapa que el atlas
   no marca como seguro, solo manda esta lista.

El atlas es una dependencia suave: `survival` no lo exige (no hay
`requires.mods`) y se comporta igual con o sin él. La decisión vive en
`F_Survival_IsSafe(map$)`, al inicio de `npc/survival.txt`. Los interiores
de las demás ciudades todavía no están en ninguna de las dos.

Si añades una ciudad nueva al atlas con `kind` `city`, `survival` la trata
como segura sin tocar su lista. Para un interior u otro mapa suelto, sigue
valiendo la guía siguiente.

### Añadir un mapa a las zonas seguras

1. Averigua el nombre exacto del mapa en el juego, por ejemplo con `@mapinfo`
   o mirando el nombre en el minimapa, o en la ruta de los scripts de
   `vendor/rathena/npc/`. Es el nombre interno (`prt_in`, `payon_in01`), no el
   que muestra el juego.
2. Abre `npc/survival.txt` y busca la línea de `OnInit`:

   ```c
   .safe_maps$ = "|prontera|izlude|geffen|payon|morocc|alberta|aldebaran|";
   ```

3. Agrega el nombre del mapa **entre barras**, sin espacios, y deja la barra
   final. Para añadir `prt_in` y `payon_in01`:

   ```c
   .safe_maps$ = "|prontera|izlude|geffen|payon|morocc|alberta|aldebaran|prt_in|payon_in01|";
   ```

4. Los nombres van en minúsculas y completos. La comprobación busca
   `|nombre|` dentro de la lista, así que `prt` no coincide con `prontera` ni
   con `prt_in`. Una barra olvidada hace que el mapa no se reconozca.
5. Reemplaza la carpeta del mod, recarga los mods del servidor y comprueba en
   el log del map-server que `survival.txt` cargó sin errores.
6. Prueba: entra al mapa con un personaje y comprueba que los medidores no
   bajan en 15 segundos; sal a un campo y comprueba que sí.

Con el mod `world-atlas` cargado, los mapas `city` del atlas ya cuentan como seguros sin estar aquí (ver arriba); esta lista sigue siendo el sitio para interiores y mapas sueltos.

## Mantenimiento: alimentos, bebidas y pociones

Los objetos que modifica el sistema están en `db/item_db.yml`, una tabla
`ITEM_DB` v3 que el cargador combina por ID con las tablas de rAthena. Incluye
solo los objetos que `survival` personaliza; no copies la tabla base completa.
Antes de agregar una entrada o tocar un ID, comprueba su definición original
en la versión de rAthena fijada por el proyecto y conserva sus propiedades y
efectos existentes (`AegisName`, `Name`, `Type`, `Buy`, `Weight`, `Flags`,
`Delay` y el contenido original de `Script`, cuando correspondan).

Comportamiento actual:

| Objeto | IDs | Efecto de supervivencia |
|---|---:|---|
| Alimentos | 68 objetos ya modificados en la tabla | Recuperan hambre según el incremento escrito en su script; no recuperan sed |
| Bebidas | 519, 531–534, 573, 11506–11509, 11521, 11525, 11531, 11534 | Recuperan solo sed: de 5 a 25 puntos, según el objeto |
| Cantimplora | 50834–50836 | Objeto custom con 3 usos (3/3, 2/3, 1/3); recupera 10 de sed por uso. Al agotarse se transforma en Cantimplora vacía (50837) |
| Cantimplora vacía | 50837 | Objeto utilizable; al usarse cerca de agua (ríos, fuentes, estanques) se rellena y se transforma en Cantimplora (3/3) |

Para añadir o cambiar una recuperación:

1. Localiza el bloque por `Id` y confirma `AegisName` y los efectos originales.
   Si el ID ya existe en `survival`, edita ese bloque en lugar de crear otro:
   las entradas repetidas por ID pueden causar resultados inesperados.
2. Conserva `itemheal`, curas de estados y otros efectos originales. Añade
   únicamente el cambio de hambre o sed que pediste; actualmente las bebidas y
   pociones no deben modificar `hm_hunger`.
3. Limita el valor a 100 y envía la actualización al medidor después de
   modificar la variable. Para sed, el patrón es:

   ```c
   set thirst_value, thirst_value + 10;
   if (thirst_value > 100) {
     set thirst_value, 100;
   }
   dispbottom "Sed: " + thirst_value + " / 100.";
   dispbottom "@@event thirst update " + thirst_value;
   ```

   Para hambre, usa `hm_hunger`, el texto `Hambre:` y el evento
   `@@event hunger update <valor>`. El cliente acepta enteros de `0` a `100`;
   valores fuera de ese rango no deben enviarse.
4. Mantén la ganancia de cada objeto explícita en su script. No infieras que un
   objeto es una bebida por su nombre: confirma su identidad y decide qué
   necesidad debe recuperar. Para cambiar una cantidad, actualiza tanto el
   script como este resumen.
5. Comprueba que los IDs de la tabla sean únicos, que la recuperación no pase
   de 100, que no se haya perdido ningún efecto original y que el objeto
   actualice el medidor correcto. Recarga los mods del servidor para probar
   cambios en `db/`.

Si la redefinición de un objeto compite con la de otro mod, revisa el orden de
carga: las tablas se combinan por ID y la definición aplicada después prevalece
en los campos que redefina. Mantén juntos en la entrada los efectos que deban
coexistir.

## Guía: Objetos custom con fases, recarga e imágenes propias

Esta sección resume la arquitectura técnica de la **Cantimplora** (IDs 50834–50837) como referencia y guía para crear nuevos objetos consumibles con usos limitados, interacción con el terreno y arte personalizado.

### 1. Múltiples usos en consumibles (Cadena de IDs)

En rAthena los consumibles de inventario son apilables (*stackable*). Rastrear las cargas de un recipiente mediante variables de jugador (`set canteen_charges, ...`) produce anomalías: la variable queda ligada al personaje y no al objeto físico, mezclando los usos si el jugador lleva varias cantimploras o almacena una en Kafra.

El patrón estándar en Ragnarok Online es una **cadena de estados con IDs consecutivos**:

1. **`50834` (Cantimplora 3/3):** al usarse recupera sed, se consume y otorga `getitem 50835, 1;`.
2. **`50835` (Cantimplora 2/3):** al usarse recupera sed, se consume y otorga `getitem 50836, 1;`.
3. **`50836` (Cantimplora 1/3):** al usarse recupera sed, se consume y otorga `getitem 50837, 1;`.
4. **`50837` (Cantimplora vacía):** versión vacía reutilizable de tipo `Usable` para rellenar en fuentes de agua.

De este modo cada unidad en el inventario mantiene su estado de forma autónoma y puede comerciarse, guardarse o consumirse sin desincronización.

### 2. Detección de agua en el mapa

Para interactuar con cuerpos de agua desde el inventario:

* **Tipo de objeto:** configúralo como `Type: Usable`. Al hacer doble clic sobre un objeto `Usable`, rAthena descuenta 1 unidad del inventario y ejecuta su bloque `Script:`.
* **Comprobación de celdas:** utiliza `checkcell(.@map$, .@x, .@y, cell_chkwater)`.
* **Radio de búsqueda:** en la mayoría de mapas de Ragnarok Online (fuentes de Prontera, estanques de Payon, costas de Alberta o ríos de campos), el agua profunda no es transitable (`cell_chknopass`). El jugador se sitúa en la orilla a varias celdas de distancia del agua. Escanear un radio de **6 celdas** (`-6` a `+6` en X e Y, cubriendo una cuadrícula de 13×13 celdas) alrededor del personaje con `getmapxy(.@map$, .@x, .@y, BL_PC)` permite una recarga cómoda.
* **Patrón de consumo seguro:**
  * Si se detecta agua: reproduce el efecto (`specialeffect2 EF_POTION_HEAL;`), envía el mensaje informativo y entrega el objeto lleno (`getitem 50834, 1;`).
  * Si no hay agua cerca: muestra el mensaje de aviso y devuelve la unidad vacía al inventario (`getitem 50837, 1;`) para evitar que el jugador la pierda.

```yaml
  - Id: 50837
    AegisName: Survival_Canteen_Empty
    Name: Cantimplora vacía
    Type: Usable
    Weight: 40
    Buy: 100
    Flags:
      BuyingStore: true
    Script: |
      getmapxy(.@map$, .@x, .@y, BL_PC);
      .@has_water = 0;
      for (.@dx = -6; .@dx <= 6; .@dx++) {
        for (.@dy = -6; .@dy <= 6; .@dy++) {
          if (checkcell(.@map$, .@x + .@dx, .@y + .@dy, cell_chkwater)) {
            .@has_water = 1;
            break;
          }
        }
        if (.@has_water) {
          break;
        }
      }
      if (.@has_water) {
        specialeffect2 EF_POTION_HEAL;
        dispbottom "Llenas la cantimplora con agua fresca.";
        getitem 50834, 1;
      } else {
        dispbottom "No hay agua cerca para llenar la cantimplora.";
        getitem 50837, 1;
      }
```

### 3. Recursos visuales de cliente (Iconos e Ilustraciones)

El cliente roBrowser carga los gráficos a partir del campo `identifiedResourceName` configurado en `System/itemInfo.lua`:

* **Ilustración grande de descripción:** se busca en `data/texture/ui/collection/<resourceName>.bmp`.
* **Icono pequeño de inventario:** se busca en `data/texture/ui/item/<resourceName>.bmp`.
* *Ruta interna:* el entorno de la aplicación traduce automáticamente el alias `data/texture/ui` a la ruta coreana `data/texture/유저인터페이스`.

#### Reglas para los archivos BMP:
1. **Formato:** deben ser estrictamente **BMP de 24 bits** (`.bmp`). El cliente no carga archivos `.png` para objetos de inventario.
2. **Dimensiones:**
   * **Ilustración (`collection/`):** **75 × 100 píxeles** (proporción 3:4).
   * **Icono (`item/`):** **24 × 24 píxeles**.
3. **Transparencia por color clave (Magenta `#FF00FF`):**
   * El cliente de Ragnarok Online no utiliza canal alfa en las texturas de objetos; la transparencia se define mediante el color magenta puro **RGB (255, 0, 255) / `#FF00FF`**.
   * Todo fondo alrededor de la ilustración debe ser `#FF00FF`. Para evitar halos púrpuras en los bordes:
     * Escala la imagen con canal alfa sobre fondo transparente.
     * Binariza el canal alfa (píxeles con alfa < 50% pasan a `#FF00FF` magenta; píxeles con alfa >= 50% mantienen su color opaco).
     * Guarda en formato BMP de 24 bits sin compresión.

#### Reutilizar arte stock vs arte custom:
* **Para reutilizar arte existente del juego:** copia el nombre exacto en coreano desde la tabla base del cliente (`System/itemInfo.lua`), por ejemplo `이속증가포션` (ID 12017) o `빈포션병` (ID 1093). **Nunca traduzcas literalmente nombres de objetos al coreano**, ya que los nombres de recursos en el GRF son propios.
* **Para usar arte custom:** guarda los archivos BMP con un nombre ASCII simple (por ejemplo `canteen_3.bmp`) en `data/texture/ui/collection/` y `data/texture/ui/item/` dentro de la carpeta del mod, y asigna ese mismo nombre en `itemInfo.lua`:

```lua
tbl = {
	[50834] = {
		unidentifiedDisplayName = "Cantimplora",
		unidentifiedResourceName = "canteen_3",
		identifiedDisplayName = "Cantimplora (3/3)",
		identifiedResourceName = "canteen_3",
		identifiedDescriptionName = {
			"Una cantimplora de viaje bien sellada.",
			"",
			"Contiene ^0055FF3 sorbos^000000 de agua fresca.",
			"Cada uso recupera ^0055FF10 puntos de sed^000000.",
			"",
			"Peso: ^77777710^000000",
		},
		slotCount = 0,
		ClassNum = 0,
	},
}
```

### 4. Ciclo de recarga y pruebas

* **Cambios en `db/item_db.yml`:** recarga los mods del servidor o reinicia el servidor rAthena.
* **Cambios en `System/itemInfo.lua` o `data/texture/`:** reinicia la aplicación de escritorio para que el cargador de assets y el cliente web vinculen los nuevos archivos.

## Cambiar ritmos, límites y penalizaciones

- **Ritmo de descenso:** cambia `.need_every` en `OnInit` de
  `npc/survival.txt` (ver «Ajustar la velocidad de prueba»). Si `clima` está activo, revisa también su pérdida extra por
  exposición para mantener los ritmos integrados.
- **Máximo de hambre/sed:** el máximo actual es 100 y aparece en los clamps de
  objetos, en las actualizaciones iniciales y en el contrato que valida cada
  medidor (`client/index.js` y `client/thirst.js`). Si cambia, actualiza todos
  esos puntos; no basta con cambiar solo la barra.
- **Escalones y efectos:** `S_Stage` decide el escalón con `.good`, `.warn`
  y `.low`; `S_Penalty` arma el efecto de los dos escalones en **una sola**
  llamada a `bonus_script` (5 s, renovada cada 4 s). Los porcentajes son
  `.regen_bonus`, `.starve_rate`, `.dry_cast`, `.dry_aspd` y
  `.both_speed`. Si cambias el umbral de castigo (`.low`), cambia también el
  30 de `client/index.js` y `client/thirst.js`, que colorean el medidor y
  muestran el `!`.
- **Tope de presión:** `.pr_cap` (6) debe valer lo mismo en `survival`,
  `temperature` y `wounds`; la fórmula (`S_CapScale`) está repetida en los
  tres a propósito, porque no hay controlador único (D18).
- **Integración con `clima`:** `survival.txt` lee las variables de exposición
  del mod `clima` y aplica la pérdida extra dentro de los ticks existentes; no
  agregues temporizadores paralelos para esa integración.

## Cambiar la UI de hambre y sed

- `client/index.js` crea el medidor de hambre y carga
  `initThirstMeter(api)` desde `client/thirst.js`, que crea el medidor de sed.
  Los dos son plugins ES del cliente API 1; valida los mensajes de servidor y
  libera los estilos, elementos y listeners mediante `api.cleanup()`.
- El servidor y la UI se conectan con dos canales distintos:
  `@@event hunger update <valor>` y `@@event thirst update <valor>`. Si cambias
  un comando, actualiza a la vez el emisor del servidor y su listener en el
  cliente.
- Para texto, estilos y posición, edita el plugin correspondiente. Los
  selectores tienen prefijos distintos (`hunger-mod-*` y `thirst-mod-*`) para
  evitar colisiones. La sed queda debajo y eleva el medidor de hambre mediante
  `--thirst-mod-meter-offset`; si cambias altura, separación o posición, revisa
  ambos plugins en conjunto.
- El color del relleno, umbral de aviso, mensaje `!`, tooltip, texto accesible
  y etiquetas del medidor se definen en cada plugin. Mantén consistentes el
  estado visual y el nivel que publica el servidor.
- Al modificar `client/`, ejecuta `node --check` en los dos archivos y reinicia
  la aplicación para volver a cargar los plugins. Verifica en el juego la
  posición relativa de las barras, valores 0 y 100, aviso de agotamiento,
  tooltip, desconexión y limpieza al cerrar el plugin.

## Próximos cambios propuestos (revisión 2026-10-17)

Sin implementar. Es el mod que más cambia con el rebalanceo; el porqué está en
[`BALANCE.md`](../BALANCE.md).

- **En forma:** Bien alimentado e Hidratado (hechos en 1.2.0), con Bien
  abrigado de `temperature`, forman **En forma**, que sube los relatos de
  `adventure`.
- **Desgaste según el lugar:** más rápido con el Tier del mapa y con la
  temperatura extrema; casi nulo en Tier 1. Así la presión crece donde la
  recompensa también.
- **Compañía:** en grupo de dos en el mismo mapa, hambre y sed bajan un 25 %
  más lento.
- **Rasgo:** leer `adv_trait_forager` (desgaste −20 %).
- **Ritmo:** el tick de 15 s es de prueba; pasarlo a `settings` en
  `mod.json` junto con los umbrales y castigos.
- **Zonas seguras:** usar solo `F_Atlas_IsSafe` cuando el atlas esté, y añadir
  posadas e interiores al atlas en vez de a `.safe_maps$`.
