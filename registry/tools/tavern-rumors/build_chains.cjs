#!/usr/bin/env node
// Turns chains.csv into the rumor chains of tavern-rumors (RUMORES.md):
//   my-mods/tavern-rumors/npc/tavern-chains-data.txt  the data NPC and the analysts
//   my-mods/tavern-rumors/db/item_db.yml              the trace items
//   my-mods/tavern-rumors/System/itemInfo.lua         what the client shows for them
//
//   node build_chains.cjs           write the files
//   node build_chains.cjs --check   fail if a file on disk is out of date
//
// CSV with a header row; a field with commas goes in double quotes ("" is a
// quote). In the text fields, | starts a new line. The mod ships the generated
// files, never this script or the CSV.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..', '..');
const CSV = path.join(__dirname, 'chains.csv');
const MOD = path.join(ROOT, 'my-mods', 'tavern-rumors');
const OUT_NPC = path.join(MOD, 'npc', 'tavern-chains-data.txt');
const OUT_DB = path.join(MOD, 'db', 'item_db.yml');
const OUT_LUA = path.join(MOD, 'System', 'itemInfo.lua');

const COLUMNS = ['id', 'title', 'trigger', 'map', 'rumor', 'trace_name', 'trace_sprite', 'trace_text',
  'item', 'item_name', 'item_icon', 'item_desc', 'analyst_map', 'analyst_x', 'analyst_y', 'analyst_name',
  'analyst_sprite', 'analyst_text', 'door_name', 'door_sprite', 'door_text', 'guard_mob', 'guard_name',
  'guard_hp', 'guard_atk', 'reward', 'reward_map', 'reward_x', 'reward_y', 'reward_name', 'reward_text'];
// What a finished chain leaves in the world. Only the passage exists so far.
const REWARDS = ['pasadizo'];
// tavern-rumors' item range (CONVENTIONS.md).
const ITEM_MIN = 51400;
const ITEM_MAX = 51499;

/** Splits CSV text into rows of fields, honouring double quotes. */
function splitCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f.trim() !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== '')) rows.push(row);
  return rows;
}

function parse(text) {
  const rows = splitCsv(text);
  if (rows[0].map((f) => f.trim()).join(',') !== COLUMNS.join(',')) {
    throw new Error(`chains.csv header must be: ${COLUMNS.join(',')}`);
  }
  return rows.slice(1).map((f, i) => {
    if (f.length !== COLUMNS.length) throw new Error(`row ${i + 2}: expected ${COLUMNS.length} fields, got ${f.length}`);
    const r = Object.fromEntries(COLUMNS.map((c, k) => [c, f[k].trim()]));
    r.row = i + 2;
    return r;
  });
}

function validate(rows) {
  const errors = [];
  const ids = new Set();
  const items = new Set();
  const int = (v) => /^\d+$/.test(v);
  for (const r of rows) {
    const at = `row ${r.row} (id ${r.id})`;
    // An id is saved in the character (tr_ci$) and the store: never rename one.
    if (!/^[a-z0-9_]{1,16}$/.test(r.id)) errors.push(`${at}: id must be 1-16 of a-z, 0-9, _`);
    if (ids.has(r.id)) errors.push(`${at}: duplicate id`);
    ids.add(r.id);
    if (!/^told:[a-z0-9_]+\.[a-z0-9_.]+$/.test(r.trigger)) errors.push(`${at}: trigger must be told:<relato key in the store form, e.g. map.prt_sewb4>`);
    for (const c of ['map', 'analyst_map', 'reward_map']) if (!/^[a-z0-9_@]+$/.test(r[c])) errors.push(`${at}: ${c} must be a map name`);
    for (const c of ['analyst_x', 'analyst_y', 'reward_x', 'reward_y', 'trace_sprite', 'door_sprite', 'guard_mob', 'guard_hp', 'guard_atk', 'item']) {
      if (!int(r[c])) errors.push(`${at}: ${c} must be a whole number`);
    }
    if (!/^([A-Z0-9_]+|\d+)$/.test(r.analyst_sprite)) errors.push(`${at}: analyst_sprite must be a sprite constant or number`);
    if (+r.item < ITEM_MIN || +r.item > ITEM_MAX) errors.push(`${at}: item must be in ${ITEM_MIN}-${ITEM_MAX}`);
    if (items.has(r.item)) errors.push(`${at}: item ${r.item} used twice`);
    items.add(r.item);
    if (+r.guard_hp < 100 || +r.guard_hp > 2000 || +r.guard_atk < 100 || +r.guard_atk > 500) errors.push(`${at}: guard_hp 100-2000 and guard_atk 100-500 (% of the monster)`);
    // A monster's name is NAME_LENGTH (24) bytes with the terminator; an NPC's, 50.
    if (Buffer.byteLength(r.guard_name) > 23) errors.push(`${at}: guard_name is over 23 bytes (accents count 2)`);
    for (const c of ['analyst_name', 'trace_name', 'door_name', 'reward_name']) if (Buffer.byteLength(r[c]) > 40) errors.push(`${at}: ${c} is over 40 bytes`);
    if (!REWARDS.includes(r.reward)) errors.push(`${at}: reward must be ${REWARDS.join('|')}`);
    for (const c of COLUMNS) if (r[c] === '') errors.push(`${at}: ${c} is empty`);
    // # separates the hidden part of an NPC name.
    for (const c of ['analyst_name', 'trace_name', 'door_name', 'reward_name', 'guard_name']) if (r[c].includes('#')) errors.push(`${at}: ${c} cannot contain #`);
  }
  return errors;
}

const str = (s) => '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';

function renderNpc(rows) {
  const set = (arr, i, v) => `\t${arr}[${i}] = ${v};`;
  const lines = [];
  rows.forEach((r, i) => {
    lines.push(`\t// ${r.id}: ${r.title}`);
    lines.push(set('.id$', i, str(r.id)));
    lines.push(set('.title$', i, str(r.title)));
    lines.push(set('.trig$', i, str(r.trigger)));
    lines.push(set('.map$', i, str(r.map)));
    lines.push(set('.rumor$', i, str(r.rumor)));
    lines.push(set('.tr_name$', i, str(r.trace_name)));
    lines.push(set('.tr_spr', i, r.trace_sprite));
    lines.push(set('.tr_text$', i, str(r.trace_text)));
    lines.push(set('.item', i, r.item));
    lines.push(set('.an_map$', i, str(r.analyst_map)));
    lines.push(set('.an_name$', i, str(r.analyst_name)));
    lines.push(set('.an_text$', i, str(r.analyst_text)));
    lines.push(set('.door_name$', i, str(r.door_name)));
    lines.push(set('.door_spr', i, r.door_sprite));
    lines.push(set('.door_text$', i, str(r.door_text)));
    lines.push(set('.gd_mob', i, r.guard_mob));
    lines.push(set('.gd_name$', i, str(r.guard_name)));
    lines.push(set('.gd_hp', i, r.guard_hp));
    lines.push(set('.gd_atk', i, r.guard_atk));
    lines.push(set('.rw$', i, str(r.reward)));
    lines.push(set('.rw_map$', i, str(r.reward_map)));
    lines.push(set('.rw_x', i, r.reward_x));
    lines.push(set('.rw_y', i, r.reward_y));
    lines.push(set('.rw_name$', i, str(r.reward_name)));
    lines.push(set('.rw_text$', i, str(r.reward_text)));
  });
  const analysts = rows.map((r, i) =>
    `${r.analyst_map},${r.analyst_x},${r.analyst_y},4\tscript\t${r.analyst_name}#trc_${r.id}\t${r.analyst_sprite},{\n` +
    `\tcallfunc "F_Chain_Analyst", ${i};\n\tend;\n}`);
  return `// GENERATED by registry/tools/tavern-rumors/build_chains.cjs from chains.csv.
// Edit the CSV and rebuild; changes here are lost.
//
// ${rows.length} rumor chain${rows.length === 1 ? '' : 's'} (RUMORES.md). The engine is tavern-chains.txt.

-\tscript\ttavern_chains\t-1,{
\tend;

OnInit:
\t.n = ${rows.length};
${lines.join('\n')}
\tdonpcevent "tavern_chains_mgr::OnReady";
\tend;
}

// The analysts: who reads each trace, in another city.
${analysts.join('\n\n')}
`;
}

function renderDb(rows) {
  const q = (s) => "'" + s.replace(/'/g, "''") + "'";
  const items = rows.map((r) => `  - Id: ${r.item}
    AegisName: Tr_Trace_${r.id}
    Name: ${q(r.item_name)}
    Type: Etc
    Weight: 10
    Trade:
      NoDrop: true
      NoTrade: true
      NoSell: true
      NoCart: true
      NoStorage: true
      NoGuildStorage: true
      NoMail: true
      NoAuction: true`).join('\n');
  return `# GENERATED by registry/tools/tavern-rumors/build_chains.cjs from chains.csv.
# The trace items of the rumor chains: 51400-51499 (CONVENTIONS.md). They
# cannot leave the character: the chain checks that its owner carries it.
Header:
  Type: ITEM_DB
  Version: 3

Body:
${items}
`;
}

function renderLua(rows) {
  const l = (s) => '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  const items = rows.map((r) => {
    const desc = r.item_desc.split('|').map((x) => `\t\t\t${l(x.trim())},`).join('\n');
    return `\t[${r.item}] = {
\t\tunidentifiedDisplayName = ${l(r.item_name)},
\t\tunidentifiedResourceName = ${l(r.item_icon)},
\t\tunidentifiedDescriptionName = { ${l(r.item_name)} },
\t\tidentifiedDisplayName = ${l(r.item_name)},
\t\tidentifiedResourceName = ${l(r.item_icon)},
\t\tidentifiedDescriptionName = {
${desc}
\t\t\t"",
\t\t\t"Rastro de un rumor. No se puede soltar, vender ni guardar.",
\t\t\t"Peso: 1",
\t\t},
\t\tslotCount = 0,
\t\tClassNum = 0,
\t},`;
  }).join('\n');
  return `-- GENERATED by registry/tools/tavern-rumors/build_chains.cjs from chains.csv.
-- The trace items of the rumor chains.
tbl = {
${items}
}
`;
}

function main() {
  const rows = parse(fs.readFileSync(CSV, 'utf8'));
  const errors = validate(rows);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  const outputs = [[OUT_NPC, renderNpc(rows)], [OUT_DB, renderDb(rows)], [OUT_LUA, renderLua(rows)]];
  if (process.argv.includes('--check')) {
    const stale = outputs.filter(([file, text]) => !fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text);
    if (stale.length) {
      console.error(`out of date, run build_chains.cjs: ${stale.map(([f]) => path.basename(f)).join(', ')}`);
      process.exit(1);
    }
    console.log(`up to date (${rows.length} chains)`);
    return;
  }
  for (const [file, text] of outputs) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
    console.log(`wrote ${path.relative(process.cwd(), file)}`);
  }
}

if (require.main === module) main();
module.exports = { parse, validate, renderNpc, renderDb, renderLua };
