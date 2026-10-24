#!/usr/bin/env node
// Turns refuges.csv and stages.csv into my-mods/refuges/npc/refuges-places.txt:
// the data every refuge NPC reads, and the NPCs placed on each map.
//
//   node build_refuges.cjs [rathena-db-dir]           write the script
//   node build_refuges.cjs [rathena-db-dir] --check   fail if it is out of date
//
// refuges.csv columns: id (letters and digits, no "_"), map, x, y (the fire),
// name (once restored), city, city_x, city_y (the city's caravan NPC), note
// (for people only). The map must be a field of world-atlas, and the city a
// city of it.
// stages.csv columns: refuge, stage (1 fire and rest, 2 the quartermaster's
// shop, 3 the caravan; all three for every refuge), name, zeny, items
// ("id:amount" joined with "|"), text (what the stage builds).
//
// When rAthena's Renewal tables are there the items are checked to exist, and
// with its map cache every cell an NPC stands on or a caravan lands on must be
// walkable. The directory defaults to vendor/rathena/db/re, so pass another
// one when there is no vendor checkout. The mod ships the generated script,
// never this file.

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..', '..', '..');
const REFUGES = path.join(__dirname, 'refuges.csv');
const STAGES = path.join(__dirname, 'stages.csv');
const ATLAS = path.join(ROOT, 'registry', 'tools', 'world-atlas', 'atlas.csv');
const DEFAULT_DB = path.join(ROOT, 'vendor', 'rathena', 'db', 're');
const OUT = path.join(ROOT, 'my-mods', 'refuges', 'npc', 'refuges-places.txt');

// What every quartermaster sells; refuges-core.txt adds the campfire and
// survival items when those mods are on. Test prices, a little over the city's.
const SHOP = '501:60,512:20,517:60,519:30';
const RUIN_SPRITE = 10026; // JT_4_WOODPILE

function rows(file, header) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter((l) => l.trim() !== '');
  const head = lines.shift();
  if (head !== header) throw new Error(`${path.basename(file)}: unexpected header "${head}"`);
  const n = header.split(',').length;
  return lines.map((line, i) => {
    const cells = line.split(',');
    // The last column is free text and may hold commas.
    const out = cells.slice(0, n - 1);
    out.push(cells.slice(n - 1).join(','));
    return { cells: out, where: `${path.basename(file)} line ${i + 2}` };
  });
}

function text(where, value, what) {
  if (value === '' || value.includes('"')) throw new Error(`${where}: ${what} is empty or has a "`);
  return value;
}

// A name that ends up as a select() option: ":" splits the options.
function option(where, value, what) {
  if (value.includes(':')) throw new Error(`${where}: ${what} has a ":", which splits a menu`);
  return text(where, value, what);
}

function num(where, value, what, min) {
  if (!/^\d+$/.test(value) || +value < min) throw new Error(`${where}: ${what} "${value}" is not a number of at least ${min}`);
  return +value;
}

function atlas() {
  const kinds = new Map();
  for (const { cells } of rows(ATLAS, 'map,kind,biome,tier,temp,anchor,water,rest,name,note')) kinds.set(cells[0], cells[1]);
  return kinds;
}

function parse(refugeText, stageText, kinds, stock) {
  const refuges = [];
  const byId = new Map();
  for (const { cells, where } of refugeText) {
    const [id, map, x, y, name, city, cx, cy] = cells;
    if (!/^[a-z0-9]+$/.test(id)) throw new Error(`${where}: id "${id}" must be lower-case letters and digits`);
    if (byId.has(id)) throw new Error(`${where}: refuge ${id} twice`);
    if (kinds.get(map) !== 'field') throw new Error(`${where}: ${map} is not a field in the atlas`);
    if (kinds.get(city) !== 'city') throw new Error(`${where}: ${city} is not a city in the atlas`);
    const r = {
      id, map, city, name: option(where, name, 'name'),
      x: num(where, x, 'x', 3), y: num(where, y, 'y', 3), cx: num(where, cx, 'city_x', 3), cy: num(where, cy, 'city_y', 3),
      stages: [],
    };
    for (const other of refuges) {
      if (other.city === city && (other.cx !== r.cx || other.cy !== r.cy))
        throw new Error(`${where}: ${city}'s caravan is at ${other.cx},${other.cy} for ${other.id}`);
    }
    refuges.push(r);
    byId.set(id, r);
  }
  for (const { cells, where } of stageText) {
    const [id, stage, name, zeny, items, txt] = cells;
    const r = byId.get(id);
    if (!r) throw new Error(`${where}: no refuge ${id} in refuges.csv`);
    const s = num(where, stage, 'stage', 1);
    if (s !== r.stages.length + 1 || s > 3) throw new Error(`${where}: stage ${s} of ${id} out of order (1, 2, 3)`);
    for (const p of items.split('|')) {
      const m = p.match(/^(\d+):(\d+)$/);
      if (!m || +m[2] < 1) throw new Error(`${where}: "${p}" is not id:amount`);
      if (stock && !stock.has(+m[1])) throw new Error(`${where}: item ${m[1]} is not in rAthena's item tables`);
    }
    r.stages.push({ name: option(where, name, 'name'), zeny: num(where, zeny, 'zeny', 0), items, text: text(where, txt, 'text') });
  }
  for (const r of refuges) if (r.stages.length !== 3) throw new Error(`stages.csv: ${r.id} needs stages 1, 2 and 3`);
  return refuges;
}

function readMapCache(dbDir) {
  const maps = new Map();
  for (const file of [path.join(dbDir, '..', 'map_cache.dat'), path.join(dbDir, 'map_cache.dat')]) {
    if (!fs.existsSync(file)) continue;
    const d = fs.readFileSync(file);
    const count = d.readUInt16LE(4);
    let off = 8;
    for (let i = 0; i < count; i++) {
      const name = d.toString('latin1', off, off + 12).split('\0')[0];
      const xs = d.readInt16LE(off + 12);
      const ys = d.readInt16LE(off + 14);
      const len = d.readInt32LE(off + 16);
      off += 20;
      maps.set(name, { xs, ys, data: d.subarray(off, off + len) });
      off += len;
    }
  }
  return maps;
}

function checkCells(refuges, cache) {
  const cells = (name) => {
    const m = cache.get(name);
    if (!m) throw new Error(`map ${name} is not in the map cache`);
    if (!m.cells) m.cells = zlib.inflateSync(m.data);
    return m;
  };
  const walk = (map, x, y, what) => {
    const m = cells(map);
    const c = x < m.xs && y < m.ys ? m.cells[x + y * m.xs] : 1;
    if (c !== 0 && c !== 3) throw new Error(`${what}: ${map} ${x},${y} is not walkable`);
  };
  for (const r of refuges) {
    walk(r.map, r.x, r.y, `${r.id} fire`);
    walk(r.map, r.x + 2, r.y, `${r.id} quartermaster`);
    walk(r.map, r.x - 2, r.y, `${r.id} caravan`);
    walk(r.map, r.x, r.y - 2, `${r.id} caravan arrival`);
    walk(r.city, r.cx, r.cy, `${r.city} caravan`);
    walk(r.city, r.cx, r.cy - 2, `${r.city} caravan arrival`);
  }
}

function render(refuges) {
  const list = (f) => refuges.map(f).join(', ');
  const stages = refuges.flatMap((r) => r.stages);
  const slist = (f) => stages.map(f).join(', ');
  const q = (s) => `"${s}"`;
  const places = [];
  for (const r of refuges) {
    places.push(`${r.map},${r.x},${r.y},4\tduplicate(Refugio#rf)\tRefugio en ruinas#rf_${r.id}\t${RUIN_SPRITE}`);
    places.push(`${r.map},${r.x + 2},${r.y},4\tshop\tIntendente del Refugio#rf_${r.id}_s\t4_M_02,${SHOP}`);
    places.push(`${r.map},${r.x - 2},${r.y},4\tduplicate(Caravanero#rf)\tCaravanero#rf_${r.id}_c\t1_M_MERCHANT`);
  }
  const cities = [...new Map(refuges.map((r) => [r.city, r])).values()];
  for (const r of cities)
    places.push(`${r.city},${r.cx},${r.cy},4\tduplicate(Caravana#rf)\tCaravana de los Refugios#rf_${r.city}\t1_M_MERCHANT`);
  return `// GENERATED by registry/tools/refuges/build_refuges.cjs from refuges.csv and
// stages.csv. Edit the CSVs and rebuild; changes here are lost.
//
// refuges_data is read with getvariableofnpc. A refuge's stage s (1 to 3) is
// at index refuge * 3 + s - 1 of the .s_* arrays; .s_items$ is a list of
// "item id:amount" joined with "|". Its OnInit tells refuges_mgr to show each
// refuge as its stage says.

-	script	refuges_data	-1,{
OnInit:
	.n = ${refuges.length};
	setarray .id$[0], ${list((r) => q(r.id))};
	setarray .map$[0], ${list((r) => q(r.map))};
	setarray .x[0], ${list((r) => r.x)};
	setarray .y[0], ${list((r) => r.y)};
	setarray .name$[0], ${list((r) => q(r.name))};
	setarray .city$[0], ${list((r) => q(r.city))};
	setarray .cx[0], ${list((r) => r.cx)};
	setarray .cy[0], ${list((r) => r.cy)};
	setarray .s_name$[0], ${slist((s) => q(s.name))};
	setarray .s_zeny[0], ${slist((s) => s.zeny)};
	setarray .s_items$[0], ${slist((s) => q(s.items))};
	setarray .s_text$[0], ${slist((s) => q(s.text))};
	donpcevent "refuges_mgr::OnReady";
	end;
}

${places.join('\n')}
`;
}

function main() {
  const args = process.argv.slice(2);
  const dbDir = args.find((a) => !a.startsWith('--')) || DEFAULT_DB;
  let stock = null;
  const tables = ['item_db_usable.yml', 'item_db_etc.yml'].map((f) => path.join(dbDir, f));
  if (tables.every((f) => fs.existsSync(f))) {
    stock = new Set();
    for (const f of tables) for (const m of fs.readFileSync(f, 'utf8').matchAll(/^  - Id: (\d+)/gm)) stock.add(+m[1]);
  } else {
    console.warn(`no rAthena item tables in ${dbDir}; items not checked`);
  }
  const refuges = parse(
    rows(REFUGES, 'id,map,x,y,name,city,city_x,city_y,note'),
    rows(STAGES, 'refuge,stage,name,zeny,items,text'),
    atlas(),
    stock,
  );
  const cache = readMapCache(dbDir);
  if (cache.size) checkCells(refuges, cache);
  else console.warn(`no map cache next to ${dbDir}; cells not checked`);
  const out = render(refuges);
  if (args.includes('--check')) {
    const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
    if (current !== out) {
      console.error('refuges-places.txt is out of date; run build_refuges.cjs');
      process.exit(1);
    }
    console.log(`up to date (${refuges.length} refuges)`);
    return;
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, out);
  console.log(`wrote ${path.relative(process.cwd(), OUT)} (${refuges.length} refuges)`);
}

if (require.main === module) main();
module.exports = { parse, render };
