# survival

Mod único que combina las necesidades de hambre y sed para personajes de
Ragnarok Offline. Es independiente de `clima`; esa integración es opcional y
solo se activa cuando ambos mods están habilitados.

## Qué incluye

- Hambre y sed de **0 a 100**, guardadas por personaje entre sesiones.
- Cada necesidad baja **1 punto cada 15 segundos mientras el personaje está
  conectado**. Este intervalo rápido es de prueba y no es una opción de
  Settings.
- Si el mod `clima` también está activo, Calor intenso puede añadir 1 punto
  extra de pérdida de sed por tick y Frío extremo 1 punto extra de pérdida de
  hambre. En esas exposiciones se pierden 2 puntos cada 15 segundos; al terminar
  el evento o salir del mapa, vuelve la pérdida normal.
- Los alimentos restauran hambre. Las 14 bebidas y las pociones con ID
  501–506 restauran sed, pero no hambre. Las pociones recuperan 5/10/15/20/10/5
  puntos respectivamente (Red, Orange, Yellow, White, Blue y Green).
- Dos medidores en pantalla: sed debajo de hambre.
- Cuando una necesidad llega a 0, aplica una penalización del 20% a la
  velocidad de movimiento y STR, AGI, VIT, INT, DEX y LUK. Si ambas llegan a 0,
  una penalización combinada reduce esos atributos y la velocidad un 40%.
  Recuperar una necesidad devuelve la penalización a 20%; recuperarlas ambas la
  retira.

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
`npc/survival.txt` mantiene los valores, los temporizadores de ambas
necesidades y un único controlador de penalización. Lee los indicadores
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
5. Al llegar una necesidad a 0, prueba su penalización. Si las dos llegan a 0,
   ambas se acumulan; consume el alimento o bebida correspondiente para retirar
   solo el efecto recuperado.

Prueba con un personaje de prueba. Los cambios de `npc/` y `db/` requieren que
el servidor vuelva a cargar el mod; los cambios de `client/` requieren
reiniciar la aplicación.

## Ajustar la velocidad de prueba

En `npc/survival.txt`, ajusta las llamadas a `addtimer` de
`survival_mgr::OnHungerTick` para cambiar el ritmo del hambre y las de
`survival_mgr::OnThirstTick` para cambiar el ritmo de la sed. Ambos intervalos
están en milisegundos; por ejemplo, `60000` equivale a un punto por minuto.
El temporizador `OnPenaltyTick` es independiente y no debe cambiarse para
ajustar el ritmo de descenso.

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

- **Ritmo de descenso:** cambia el intervalo de los temporizadores en
  `npc/survival.txt`; las llamadas repetidas a cada tick deben conservar el
  mismo intervalo. Si `clima` está activo, revisa también su pérdida extra por
  exposición para mantener los ritmos integrados.
- **Máximo de hambre/sed:** el máximo actual es 100 y aparece en los clamps de
  objetos, en las actualizaciones iniciales y en el contrato que valida cada
  medidor (`client/index.js` y `client/thirst.js`). Si cambia, actualiza todos
  esos puntos; no basta con cambiar solo la barra.
- **Penalización:** `survival_mgr::OnPenaltyTick` restaura la penalización
  anterior del sistema, calcula el 20% de cada necesidad agotada y aplica el
  total en una sola llamada a `bonus_script`. rAthena no apila dos bonus
  scripts duplicados: la llamada única es necesaria para que hambre y sed
  acumulen el 20% cada una (40% si ambas llegan a cero) sin que un efecto
  reemplace al otro. Conserva los acumuladores `@hm_penalty_*` y
  `@thirst_penalty_*`, los cálculos combinados de atributos y velocidad, y la
  retirada/actualización de los efectos al recuperarse o cerrar sesión.
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
