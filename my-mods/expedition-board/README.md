# Contratos de expediciones

Prototipo de tableros en las ciudades principales. Cada tablero publica
contratos de esa ciudad: al aceptar uno aparece una **marca** (un monstruo
con nombre propio) en un punto concreto de un mapa cercano. Hay que ir a
acabar con ella y **volver al tablero que emitió el contrato** para cobrar.

Esto es la primera versión jugable. No hay registro de misiones en el
cliente, ni temporizadores, ni contratos encadenados.

## Qué hace ahora

- Un tablero (`4_BOARD3`) en Prontera, Izlude, Geffen, Payon, Morocc,
  Alberta y Aldebaran. El nombre flotante es `Expedicion` (límite de 24
  caracteres de rAthena); el diálogo usa el título completo.
- Un contrato por ciudad, repetible.
- Un solo contrato activo por personaje. Hay que entregarlo o abandonarlo
  antes de tomar otro.
- El estado se guarda en el personaje (`eb_qid`, `eb_state`, `eb_gid`) y
  sobrevive un relog y un cambio de era.
- La marca se invoca al aceptar, con el evento de muerte de *ese* spawn, no
  de cualquier monstruo de la misma especie. Un Poring normal en el campo
  sur no completa el contrato de Prontera.
- Si el servidor se reinicia mientras el contrato sigue activo, la marca se
  vuelve a colocar al entrar con ese personaje.
- La entrega solo se acepta en la ciudad que publicó el contrato. Cualquier
  tablero puede mostrar el estado y dejar abandonarlo.

No hay objetos ni monstruos custom: se reutilizan especies y recompensas
que ya existen en ambas eras.

## Contratos actuales

Las coordenadas son un punto de prueba, no un diseño de encuentro
definitivo. Si la celda no es transitable, el script busca una cercana.

| Ciudad | Contrato | Marca | Mapa | Recompensa de prueba |
|---|---|---|---|---|
| Prontera | Rastro en el campo sur | Wolf (1013) | `prt_fild08` 180, 240 | 2 000 zeny y 10 Red Potion |
| Izlude | Amenaza en Byalan | Hydra (1068) | `iz_dun00` 120, 90 | 3 000 zeny y 10 Orange Potion |
| Geffen | Goblin marcado | Goblin (1122) | `gef_fild07` 180, 150 | 4 000 zeny y 10 Yellow Potion |
| Payon | Sauce inquieto | Willow (1010) | `pay_fild08` 80, 100 | 2 500 zeny y 10 Red Potion |
| Morocc | Lobo del desierto | Desert Wolf (1106) | `moc_fild11` 180, 200 | 5 000 zeny y 5 White Potion |
| Alberta | Cangrejo del camino | Vadon (1109) | `pay_fild03` 140, 160 | 3 500 zeny y 10 Orange Potion |
| Aldebaran | Araña del paso | Argos (1100) | `mjolnir_12` 170, 170 | 4 500 zeny y 5 White Potion |

En Izlude y Morocc las plazas cambiaron entre Pre-Renewal y Renewal; si un
tablero queda en una celda rara, hay que ajustar su `map,x,y` en el script.

## Qué no hace (aún)

Contratos de varios objetivos, límites de tiempo, dificultad por nivel,
botín ligado a otros mods (`dungeon-chest`, `clima`, `survival`), marcas
visibles en el minimapa, ni un NPC distinto para entregar. Esas piezas
pueden entrar después sin cambiar la identidad del mod.

Este mod no depende de `bounty-hunt`. Aquel marca un bicho cualquiera para
grindear un drop; este publica un punto concreto al que hay que ir.

## Probarlo

1. Copia `expedition-board` a la carpeta de mods de la aplicación, o
   agrégala desde **Settings → Mods → Add mod from folder**.
2. Actívalo y aplica los cambios para recargar los scripts del servidor.
3. En Prontera, habla con el tablero al oeste de la fuente (`79, 194`).
   Acepta el contrato del campo sur.
4. Ve a `prt_fild08` cerca de `180, 240` y mata al lobo llamado
   **Marca de expedición**. El chat debe avisar que el objetivo cayó.
5. Vuelve al tablero de Prontera y entrega. Comprueba zeny y pociones.
6. Relog con un contrato a medias: el tablero debe recordarlo. Si el
   servidor se reinició, la marca debe volver a aparecer al entrar.

Si la marca no aparece, mira el log del map-server: un error de sintaxis
puede detener todo el archivo, y `debugmes` nombra el mapa si no encontró
una celda transitable.

## Variables

| Variable | Alcance | Uso |
|---|---|---|
| `eb_qid` | personaje, permanente | id del contrato activo (1–7) |
| `eb_state` | personaje, permanente | 0 libre, 1 cazando, 2 listo para entregar |
| `eb_gid` | personaje, permanente | GID de la marca; solo vale mientras el proceso del map-server no se haya reiniciado |

## Estructura

```text
expedition-board/
├── mod.json
├── README.md
└── npc/
    └── expedition-board.txt
```

## Problema conocido: error de sintaxis en el log

Observado el 2026-10-17 al leer `ragnarok-stack logs map`, **sin investigar
todavía**:

```text
script error on npc/mods/expedition-board/expedition-board.txt line 25
    parse_simpleexpr: unmatched ')'
```

La línea 25 es `if (abs(.@dx) != .@r && abs(.@dy) != .@r)`, en la función que
busca una celda libre cerca del punto de la marca. La copia instalada es
idéntica a la del repo. Un error de sintaxis puede detener la carga del archivo
entero, así que el tablero podría no estar funcionando aunque el mod aparezca
activo. La causa no está confirmada; `abs(...)` es solo una sospecha.
Antes de confiar en el mod, hay que revisar esa línea y volver a leer el log.
