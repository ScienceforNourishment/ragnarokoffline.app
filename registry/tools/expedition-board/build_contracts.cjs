#!/usr/bin/env node
// Turns contracts.csv into my-mods/expedition-board/npc/expedition-contracts.txt.
//
//   node build_contracts.cjs           write the script
//   node build_contracts.cjs --check   fail if the script on disk is out of date
//
// The mod ships the generated script, never this file or the CSV.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..', '..');
const CSV = path.join(__dirname, 'contracts.csv');
const OUT = path.join(ROOT, 'my-mods', 'expedition-board', 'npc', 'expedition-contracts.txt');
// The monsters the pinned rAthena spawns; used to check that a hunt's monster
// really lives on its map. Skipped (with a warning) when the file is missing.
const MOB_INDEX = path.join(ROOT, 'mods', 'navigation-server-monsters', 'mob-index.tsv');

// The seven boards, by the map the board stands on (the board script places one on each).
const CITIES = ['prontera', 'izlude', 'geffen', 'payon', 'morocc', 'alberta', 'aldebaran'];
const CITY_NAMES = { prontera: 'Prontera', izlude: 'Izlude', geffen: 'Geffen', payon: 'Payon', morocc: 'Morocc', alberta: 'Alberta', aldebaran: 'Aldebaran' };
// expedition: a marked monster waits at a point. hunt: kill `count` of a species in a zone.
const TYPES = { expedition: 1, hunt: 2 };
const COLUMNS = ['id', 'city', 'type', 'name', 'mob', 'map', 'x', 'y', 'count', 'zeny', 'item', 'amt', 'place', 'blurb'];

function parse(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines[0].trim() !== COLUMNS.join(',')) {
    throw new Error(`contracts.csv header must be: ${COLUMNS.join(',')}`);
  }
  return lines.slice(1).map((line, i) => {
    const f = line.split(',');
    if (f.length !== COLUMNS.length) throw new Error(`line ${i + 2}: expected ${COLUMNS.length} columns, got ${f.length} (no commas inside a field)`);
    const r = Object.fromEntries(COLUMNS.map((c, k) => [c, f[k].trim()]));
    r.line = i + 2;
    return r;
  });
}

/** Map -> Set of monster ids that spawn there (Renewal), or null without the index. */
function loadSpawns() {
  if (!fs.existsSync(MOB_INDEX)) return null;
  const rows = fs.readFileSync(MOB_INDEX, 'utf8').split('\n').map((l) => l.replace(/\r$/, '').split('\t'));
  const byAegis = {};
  for (const f of rows) if (f[0] === 'mob' && f[1] === 'renewal') byAegis[f[3]] = f[2];
  const spawns = {};
  for (const f of rows) {
    if (f[0] !== 'spawn') continue;
    (spawns[f[1]] ??= new Set()).add(/^\d+$/.test(f[2]) ? f[2] : byAegis[f[2]]);
  }
  return spawns;
}

function validate(rows, spawns) {
  const errors = [];
  const ids = new Set();
  for (const r of rows) {
    const at = `line ${r.line} (id ${r.id})`;
    // An id is saved in the character (eb_qid): never renumber or reuse one.
    if (!/^[1-9]\d{0,3}$/.test(r.id)) errors.push(`${at}: id must be a positive integer`);
    if (ids.has(r.id)) errors.push(`${at}: duplicate id`);
    ids.add(r.id);
    if (!CITIES.includes(r.city)) errors.push(`${at}: city '${r.city}' not in ${CITIES.join('|')}`);
    if (!(r.type in TYPES)) errors.push(`${at}: type '${r.type}' not in ${Object.keys(TYPES).join('|')}`);
    if (!/^[a-z0-9_]+$/.test(r.map)) errors.push(`${at}: map must be lowercase letters, digits and _ only`);
    for (const c of ['mob', 'item', 'amt']) if (!/^[1-9]\d*$/.test(r[c])) errors.push(`${at}: ${c} must be a positive integer`);
    if (!/^\d+$/.test(r.zeny)) errors.push(`${at}: zeny must be a whole number`);
    if (+r.amt > 30000) errors.push(`${at}: amt too large`);
    if (!/^\d+$/.test(r.x) || !/^\d+$/.test(r.y) || !/^\d+$/.test(r.count)) {
      errors.push(`${at}: x, y and count must be whole numbers`);
    } else if (r.type === 'expedition') {
      if (+r.x < 1 || +r.x > 999 || +r.y < 1 || +r.y > 999) errors.push(`${at}: an expedition needs a map cell x,y (1-999)`);
      if (r.count !== '1') errors.push(`${at}: an expedition has count 1 (the mark)`);
    } else if (r.type === 'hunt') {
      if (r.x !== '0' || r.y !== '0') errors.push(`${at}: a hunt has no cell: x and y must be 0`);
      if (+r.count < 2 || +r.count > 200) errors.push(`${at}: a hunt count must be 2-200`);
      // The hunt counts kills of natural spawns, so the monster must live on that map.
      if (spawns && !(spawns[r.map] && spawns[r.map].has(r.mob))) {
        errors.push(`${at}: monster ${r.mob} does not spawn on ${r.map} in the monster index`);
      }
    }
    for (const c of ['name', 'place', 'blurb']) {
      if (r[c] === '') errors.push(`${at}: ${c} is required`);
      // name is a menu entry (':' separates entries); all of them go inside a "..." string.
      if (/["\\:;|^]/.test(r[c])) errors.push(`${at}: ${c} cannot contain " \\ : ; | or ^`);
      // Dialogue goes through the client charset: keep it plain ASCII like the rest of the mod.
      if (/[^\x20-\x7e]/.test(r[c])) errors.push(`${at}: ${c} must be plain ASCII (no accents)`);
    }
    if (r.name.length > 40) errors.push(`${at}: name longer than 40 characters`);
  }
  return errors;
}

function render(rows) {
  const T = '\t';
  const body = rows
    .map((r) => [
      `\t.valid[${r.id}] = 1;`,
      `\t.type[${r.id}] = ${TYPES[r.type]};`,
      `\t.city$[${r.id}] = "${r.city}";`,
      `\t.cityname$[${r.id}] = "${CITY_NAMES[r.city]}";`,
      `\t.name$[${r.id}] = "${r.name}";`,
      `\t.mob[${r.id}] = ${r.mob};`,
      `\t.map$[${r.id}] = "${r.map}";`,
      `\t.x[${r.id}] = ${r.x};`,
      `\t.y[${r.id}] = ${r.y};`,
      `\t.count[${r.id}] = ${r.count};`,
      `\t.zeny[${r.id}] = ${r.zeny};`,
      `\t.item[${r.id}] = ${r.item};`,
      `\t.amt[${r.id}] = ${r.amt};`,
      `\t.place$[${r.id}] = "${r.place}";`,
      `\t.blurb$[${r.id}] = "${r.blurb}";`,
    ].join('\n'))
    .join('\n\n');

  return `// GENERATED by registry/tools/expedition-board/build_contracts.cjs from contracts.csv.
// Edit the CSV and rebuild; changes here are lost.
//
// ${rows.length} contracts. Every array is indexed by the contract id, which a
// character saves in eb_qid, so an id is never renumbered. .valid[id] is 1 for
// an id that exists and .max is the highest id. .type[id] is 1 for an
// expedition (a marked monster at x,y) and 2 for a hunt (.count[id] kills of
// .mob[id] on .map$[id]; x and y are 0).

-${T}script${T}ExpeditionData${T}-1,{
OnInit:
\t.max = ${Math.max(...rows.map((r) => +r.id))};

${body}
\tend;
}
`;
}

function main() {
  const rows = parse(fs.readFileSync(CSV, 'utf8'));
  const spawns = loadSpawns();
  if (!spawns) console.warn(`warning: ${path.relative(ROOT, MOB_INDEX)} not found; hunt monsters were not checked against map spawns`);
  const errors = validate(rows, spawns);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  const out = render(rows);
  if (process.argv.includes('--check')) {
    const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
    if (cur !== out) {
      console.error('expedition-contracts.txt is out of date: run build_contracts.cjs');
      process.exit(1);
    }
    console.log(`ok: ${rows.length} contracts`);
    return;
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, out);
  console.log(`wrote ${path.relative(process.cwd(), OUT)}: ${rows.length} contracts`);
}

main();
