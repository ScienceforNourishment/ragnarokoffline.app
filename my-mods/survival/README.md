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
├── client/
│   ├── index.js
│   └── thirst.js
├── db/
│   └── item_db.yml
└── npc/
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
| Pociones | 501–506 | Recuperan solo sed: Red 5, Orange 10, Yellow 15, White 20, Blue 10, Green 5 |

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
