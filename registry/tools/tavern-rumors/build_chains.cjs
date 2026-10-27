#!/usr/bin/env node
// Turns chains.csv and wares.csv into the rumor chains of tavern-rumors (RUMORES.md):
//   my-mods/tavern-rumors/npc/tavern-chains-data.txt  the data NPC, the analysts and the services
//   my-mods/tavern-rumors/db/item_db.yml              the trace items and the wares
//   my-mods/tavern-rumors/System/itemInfo.lua         what the client shows for them
//
//   node build_chains.cjs           write the files
//   node build_chains.cjs --check   fail if a file on disk is out of date
//
// CSV with a header row; a field with commas goes in double quotes ("" is a
// quote). In the text fields, | starts a new line; in reward_tales, || starts
// another tale. The mod ships the generated files, never this script or the CSVs.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..', '..');
const CSV = path.join(__dirname, 'chains.csv');
const WARES_CSV = path.join(__dirname, 'wares.csv');
const MOD = path.join(ROOT, 'my-mods', 'tavern-rumors');
const OUT_NPC = path.join(MOD, 'npc', 'tavern-chains-data.txt');
const OUT_DB = path.join(MOD, 'db', 'item_db.yml');
const OUT_LUA = path.join(MOD, 'System', 'itemInfo.lua');

const COLUMNS = ['id', 'title', 'trigger', 'map', 'final_map', 'rumor', 'trace_name', 'trace_sprite', 'trace_text',
  'item', 'item_name', 'item_icon', 'item_desc', 'analyst_map', 'analyst_x', 'analyst_y', 'analyst_name',
  'analyst_sprite', 'analyst_text', 'door_name', 'door_sprite', 'door_text', 'door_action', 'door_open',
  'guard_mob', 'guard_name', 'guard_hp', 'guard_atk', 'reward', 'reward_map', 'reward_x', 'reward_y',
  'reward_name', 'reward_sprite', 'reward_text', 'reward_shop', 'reward_tales'];
// Only these may be empty, and only for the reward that does not use them.
const OPTIONAL = ['reward_sprite', 'reward_shop', 'reward_tales'];
const WARE_COLUMNS = ['id', 'aegis', 'name', 'icon', 'weight', 'seconds', 'bonus', 'desc'];
// What a finished chain leaves in the world:
//   pasadizo  a warp at the door to reward_map,reward_x,reward_y
//   servicio  an NPC at reward_map,reward_x,reward_y with a shop and tales
const REWARDS = ['pasadizo', 'servicio'];
// tavern-rumors' item range (CONVENTIONS.md): traces, then wares.
const TRACE_MIN = 51400;
const TRACE_MAX = 51449;
const WARE_MIN = 51450;
const WARE_MAX = 51499;
// nemesis' talismans (51200 + race), the other trigger (D43).
const TALISMAN_MIN = 51200;
const TALISMAN_MAX = 51209;

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

function parse(text, columns = COLUMNS, name = 'chains.csv') {
  const rows = splitCsv(text);
  if (rows[0].map((f) => f.trim()).join(',') !== columns.join(',')) {
    throw new Error(`${name} header must be: ${columns.join(',')}`);
  }
  return rows.slice(1).map((f, i) => {
    if (f.length !== columns.length) throw new Error(`${name} row ${i + 2}: expected ${columns.length} fields, got ${f.length}`);
    const r = Object.fromEntries(columns.map((c, k) => [c, f[k].trim()]));
    r.row = i + 2;
    return r;
  });
}

/** "51450:1500|1750" -> [[51450, 1500], [1750, -1]]; -1 is the item's own price. */
function shopEntries(s) {
  return s.split('|').map((e) => e.trim()).filter(Boolean).map((e) => {
    const [id, price] = e.split(':');
    return [id, price === undefined ? '-1' : price];
  });
}

const tales = (s) => s.split('||').map((t) => t.trim()).filter(Boolean);
const talisman = (r) => (/^talisman:(\d+)$/.exec(r.trigger) || [])[1];

function validate(rows, wares) {
  const errors = [];
  const ids = new Set();
  const items = new Set();
  const int = (v) => /^\d+$/.test(v);
  const wareIds = new Set();
  for (const w of wares) {
    const at = `wares.csv row ${w.row} (id ${w.id})`;
    if (!int(w.id) || +w.id < WARE_MIN || +w.id > WARE_MAX) errors.push(`${at}: id must be in ${WARE_MIN}-${WARE_MAX}`);
    if (wareIds.has(w.id)) errors.push(`${at}: duplicate id`);
    wareIds.add(w.id);
    if (!/^[A-Za-z0-9_]{1,50}$/.test(w.aegis)) errors.push(`${at}: aegis must be letters, digits and _`);
    if (!int(w.weight) || !int(w.seconds) || +w.seconds < 1) errors.push(`${at}: weight and seconds must be whole numbers, seconds > 0`);
    // The bonus goes inside bonus_script "{ ... }": a quote or brace would end it.
    if (/["{}]/.test(w.bonus)) errors.push(`${at}: bonus cannot contain " { or }`);
    for (const c of WARE_COLUMNS) if (w[c] === '') errors.push(`${at}: ${c} is empty`);
  }
  for (const r of rows) {
    const at = `row ${r.row} (id ${r.id})`;
    // An id is saved in the character (tr_ci$) and the store: never rename one.
    // 12 at most so that the shop name trs_<id> fits in an NPC name.
    if (!/^[a-z0-9_]{1,12}$/.test(r.id)) errors.push(`${at}: id must be 1-12 of a-z, 0-9, _`);
    if (ids.has(r.id)) errors.push(`${at}: duplicate id`);
    ids.add(r.id);
    const tal = talisman(r);
    if (!/^told:[a-z0-9_]+\.[a-z0-9_.]+$/.test(r.trigger) && !tal) {
      errors.push(`${at}: trigger must be told:<relato key in the store form, e.g. map.prt_sewb4> or talisman:<item>`);
    }
    if (tal && (+tal < TALISMAN_MIN || +tal > TALISMAN_MAX)) errors.push(`${at}: talisman must be a nemesis talisman, ${TALISMAN_MIN}-${TALISMAN_MAX}`);
    for (const c of ['map', 'final_map', 'analyst_map', 'reward_map']) if (!/^[a-z0-9_@]+$/.test(r[c])) errors.push(`${at}: ${c} must be a map name`);
    for (const c of ['analyst_x', 'analyst_y', 'reward_x', 'reward_y', 'trace_sprite', 'door_sprite', 'guard_mob', 'guard_hp', 'guard_atk', 'item']) {
      if (!int(r[c])) errors.push(`${at}: ${c} must be a whole number`);
    }
    if (!/^([A-Z0-9_]+|\d+)$/.test(r.analyst_sprite)) errors.push(`${at}: analyst_sprite must be a sprite constant or number`);
    if (+r.item < TRACE_MIN || +r.item > TRACE_MAX) errors.push(`${at}: item must be in ${TRACE_MIN}-${TRACE_MAX}`);
    if (items.has(r.item)) errors.push(`${at}: item ${r.item} used twice`);
    items.add(r.item);
    if (+r.guard_hp < 100 || +r.guard_hp > 2000 || +r.guard_atk < 100 || +r.guard_atk > 500) errors.push(`${at}: guard_hp 100-2000 and guard_atk 100-500 (% of the monster)`);
    // A monster's name is NAME_LENGTH (24) bytes with the terminator; an NPC's, 50.
    if (Buffer.byteLength(r.guard_name) > 23) errors.push(`${at}: guard_name is over 23 bytes (accents count 2)`);
    for (const c of ['analyst_name', 'trace_name', 'door_name', 'reward_name']) if (Buffer.byteLength(r[c]) > 40) errors.push(`${at}: ${c} is over 40 bytes`);
    // A menu option ends at :, so the action cannot hold one.
    if (r.door_action.includes(':')) errors.push(`${at}: door_action cannot contain :`);
    if (!REWARDS.includes(r.reward)) errors.push(`${at}: reward must be ${REWARDS.join('|')}`);
    for (const c of COLUMNS) if (r[c] === '' && !OPTIONAL.includes(c)) errors.push(`${at}: ${c} is empty`);
    // # separates the hidden part of an NPC name.
    for (const c of ['analyst_name', 'trace_name', 'door_name', 'reward_name', 'guard_name']) if (r[c].includes('#')) errors.push(`${at}: ${c} cannot contain #`);
    if (r.reward === 'pasadizo') {
      for (const c of OPTIONAL) if (r[c] !== '') errors.push(`${at}: ${c} is only for reward servicio`);
    } else if (r.reward === 'servicio') {
      if (!/^([A-Z0-9_]+|\d+)$/.test(r.reward_sprite)) errors.push(`${at}: reward_sprite must be a sprite constant or number`);
      const shop = shopEntries(r.reward_shop);
      if (!shop.length) errors.push(`${at}: reward_shop needs at least one item`);
      for (const [id, price] of shop) {
        if (!int(id)) errors.push(`${at}: reward_shop item ${id} must be a number`);
        // An item of ours must be a ware; anything else is the stock rAthena item.
        else if (+id >= TRACE_MIN && +id <= WARE_MAX && !wareIds.has(id)) errors.push(`${at}: reward_shop item ${id} is not in wares.csv`);
        // A ware has no price of its own in the item_db.
        else if (wareIds.has(id) && price === '-1') errors.push(`${at}: reward_shop needs a price for ${id} (id:price)`);
        if (price !== '-1' && !int(price)) errors.push(`${at}: reward_shop price of ${id} must be a whole number or absent`);
      }
    }
  }
  return errors;
}

const str = (s) => '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
const serviceNpc = (r) => `${r.reward_name}#trw_${r.id}`;

function renderNpc(rows) {
  const set = (arr, i, v) => `\t${arr}[${i}] = ${v};`;
  const lines = [];
  let tale = 0;
  rows.forEach((r, i) => {
    lines.push(`\t// ${r.id}: ${r.title}`);
    lines.push(set('.id$', i, str(r.id)));
    lines.push(set('.title$', i, str(r.title)));
    lines.push(set('.trig$', i, str(r.trigger)));
    lines.push(set('.tal', i, talisman(r) || 0));
    lines.push(set('.map$', i, str(r.map)));
    lines.push(set('.fin$', i, str(r.final_map)));
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
    lines.push(set('.door_act$', i, str(r.door_action)));
    lines.push(set('.door_open$', i, str(r.door_open)));
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
    lines.push(set('.rw_npc$', i, str(r.reward === 'servicio' ? serviceNpc(r) : '')));
    // Tales: .tl$[] holds every chain's, from .tl_a[i], .tl_n[i] of them.
    const t = r.reward === 'servicio' ? tales(r.reward_tales) : [];
    lines.push(set('.tl_a', i, tale));
    lines.push(set('.tl_n', i, t.length));
    for (const x of t) lines.push(set('.tl$', tale++, str(x)));
  });
  const analysts = rows.map((r, i) =>
    `${r.analyst_map},${r.analyst_x},${r.analyst_y},4\tscript\t${r.analyst_name}#trc_${r.id}\t${r.analyst_sprite},{\n` +
    `\tcallfunc "F_Chain_Analyst", ${i};\n\tend;\n}`);
  const services = rows.map((r, i) => [r, i]).filter(([r]) => r.reward === 'servicio').map(([r, i]) =>
    `${r.reward_map},${r.reward_x},${r.reward_y},4\tscript\t${serviceNpc(r)}\t${r.reward_sprite},{\n` +
    `\tcallfunc "F_Chain_Service", ${i};\n\tend;\n}\n` +
    `-\tshop\ttrs_${r.id}\t-1,${shopEntries(r.reward_shop).map(([id, p]) => `${id}:${p}`).join(',')}`);
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
${services.length ? `
// The services a chain leaves in the world. Hidden until the world has it
// (tavern_chains_mgr::OnReady and F_Chain_Reward show them).
${services.join('\n\n')}
` : ''}`;
}

function renderDb(rows, wares) {
  const q = (s) => "'" + s.replace(/'/g, "''") + "'";
  const traces = rows.map((r) => `  - Id: ${r.item}
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
      NoAuction: true`);
  // bonus_script flag 1025: removed on death (1), and using another while one
  // runs restarts its duration instead of stacking (BSF_FORCE_REPLACE, 1024).
  const sold = wares.map((w) => `  - Id: ${w.id}
    AegisName: ${w.aegis}
    Name: ${q(w.name)}
    Type: Usable
    Weight: ${w.weight}
    Script: |
      bonus_script "{ ${w.bonus} }",${w.seconds},1025;`);
  return `# GENERATED by registry/tools/tavern-rumors/build_chains.cjs from chains.csv and wares.csv.
# 51400-51449: the trace items of the rumor chains. They cannot leave the
# character: the chain checks that its owner carries it.
# 51450-51499: what the services of finished chains sell (CONVENTIONS.md).
Header:
  Type: ITEM_DB
  Version: 3

Body:
${traces.concat(sold).join('\n')}
`;
}

function renderLua(rows, wares) {
  const l = (s) => '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  const entry = (id, name, icon, desc, tail) => {
    const lines = desc.split('|').concat(tail).map((x) => `\t\t\t${l(x.trim())},`).join('\n');
    return `\t[${id}] = {
\t\tunidentifiedDisplayName = ${l(name)},
\t\tunidentifiedResourceName = ${l(icon)},
\t\tunidentifiedDescriptionName = { ${l(name)} },
\t\tidentifiedDisplayName = ${l(name)},
\t\tidentifiedResourceName = ${l(icon)},
\t\tidentifiedDescriptionName = {
${lines}
\t\t},
\t\tslotCount = 0,
\t\tClassNum = 0,
\t},`;
  };
  const weight = (w) => `Peso: ${(+w / 10).toString().replace('.', ',')}`;
  const items = rows.map((r) => entry(r.item, r.item_name, r.item_icon, r.item_desc,
    ['', 'Rastro de un rumor. No se puede soltar, vender ni guardar.', weight(10)]))
    .concat(wares.map((w) => entry(w.id, w.name, w.icon, w.desc, ['', weight(w.weight)])));
  return `-- GENERATED by registry/tools/tavern-rumors/build_chains.cjs from chains.csv and wares.csv.
-- The trace items of the rumor chains and what their services sell.
tbl = {
${items.join('\n')}
}
`;
}

function main() {
  const rows = parse(fs.readFileSync(CSV, 'utf8'));
  const wares = parse(fs.readFileSync(WARES_CSV, 'utf8'), WARE_COLUMNS, 'wares.csv');
  const errors = validate(rows, wares);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  const outputs = [[OUT_NPC, renderNpc(rows)], [OUT_DB, renderDb(rows, wares)], [OUT_LUA, renderLua(rows, wares)]];
  if (process.argv.includes('--check')) {
    const stale = outputs.filter(([file, text]) => !fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text);
    if (stale.length) {
      console.error(`out of date, run build_chains.cjs: ${stale.map(([f]) => path.basename(f)).join(', ')}`);
      process.exit(1);
    }
    console.log(`up to date (${rows.length} chains, ${wares.length} wares)`);
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
