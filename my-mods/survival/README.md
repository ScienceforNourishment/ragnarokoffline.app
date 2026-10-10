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
- Los alimentos restauran hambre. Las 14 bebidas modificadas restauran sed,
  pero no hambre.
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
14 bebidas recuperen solo sed.
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
   hambre y las bebidas restauran sed, sin recuperar hambre. Con `clima`
   activado, compara el ritmo normal con Calor intenso en `prt_fild09` y Frío
   extremo en `prt_fild10`.
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
