#!/usr/bin/env node
// Turns the loot CSVs into two generated files of my-mods/dungeon-chest:
//   npc/dungeon-loot-data.txt   the server variables ($@dc_*) the chest's
//                               equipment roll (npc/dungeon-loot.txt) and the
//                               Affix Smith (npc/affix-smith.txt) read
//   data/luafiles514/lua files/datainfo/addrandomoptionnametable.lub
//                               the client's names of the affixes
//
//   node build_loot.cjs [rathena-db-dir]           write both
//   node build_loot.cjs [rathena-db-dir] --check   fail if either is out of date
//
// loot.csv          item, tier (1-6), jobs ("*" or item_db Jobs joined with
//                   "|"), note. The equipment a chest of that Tier can give.
// costumes.csv      item, note. The costumes a chest can give instead.
// affixes.csv       id, rarity (1-4), min, max, kind (0 flat, 1 percent,
//                   2 fixed), type (0 any, 5 weapons, 4 armor), cap, group,
//                   name. The affix pool, from affix-forge.
// affix_names.csv   id, name: what the client and the Smith call each option,
//                   in Spanish. ASCII only: a kRO client reads the table in
//                   its own codepage (docs/MODDING.md, signboards). %d is the
//                   value and %% a percent sign.
// loot_tiers.csv    tier, level (scales the values as a monster of that
//                   level would in affix-forge), gear_pct (equipment instead
//                   of food), class_pct (try the opener's class first),
//                   costume_pct (a costume instead of anything else),
//                   biome_item_pct (one of the biome's items, below,
//                   instead of equipment or food; D38), count_weights and rarity_weights (four numbers joined
//                   with "|"), note.
// loot_biomes.csv   biome (of world-atlas), pct, options (affix ids joined
//                   with "|"), items, note: the first affix of a chest in that
//                   biome is one of these, pct % of the time. items: the
//                   clima and temperature items (joined with "|", or empty)
//                   a chest there gives biome_item_pct % of the time; each
//                   must be in one of those mods' item_db (ITEM_MODS). The
//                   chest skips the ones of a mod that is not loaded.
//
// The loot data was imported once from the reference mods with
// import_reference.cjs; these CSVs are ours now. With rAthena's Renewal
// tables (default vendor/rathena/db/re) every item must be equipment there.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..', '..');
const DEFAULT_DB = path.join(ROOT, 'vendor', 'rathena', 'db', 're');
const MOD = path.join(ROOT, 'my-mods', 'dungeon-chest');
const OUT = path.join(MOD, 'npc', 'dungeon-loot-data.txt');
const LUB = path.join(MOD, 'data', 'luafiles514', 'lua files', 'datainfo', 'addrandomoptionnametable.lub');
// The other mods' item tables whose items loot_biomes.csv may name.
const ITEM_MODS = [
  path.join(ROOT, 'my-mods', 'clima', 'renewal', 'db', 'item_db.yml'),
  path.join(ROOT, 'my-mods', 'temperature', 'db', 'item_db.yml'),
];

// The item_db job names whose EAJ_ constant exists in the pinned rAthena
// (script_constants.hpp), spelled as the constant: EAJ_ + upper case.
const JOBS = ['Novice', 'SuperNovice', 'Swordman', 'Knight', 'Crusader', 'Mage', 'Wizard', 'Sage', 'Archer',
  'Hunter', 'BardDancer', 'Acolyte', 'Priest', 'Monk', 'Merchant', 'Blacksmith', 'Alchemist', 'Thief',
  'Assassin', 'Rogue', 'Taekwon', 'StarGladiator', 'SoulLinker', 'Gunslinger', 'Rebellion', 'Ninja',
  'KagerouOboro', 'Summoner', 'Spirit_Handler'];

function rows(file, header) {
  const lines = fs.readFileSync(path.join(__dirname, file), 'utf8').split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.shift() !== header) throw new Error(`${file}: header must be "${header}"`);
  const n = header.split(',').length;
  return lines.map((line, i) => {
    const c = line.split(',');
    return { c: c.slice(0, n - 1).concat([c.slice(n - 1).join(',')]), where: `${file} line ${i + 2}` };
  });
}

function int(where, v, what, min, max) {
  if (!/^-?\d+$/.test(v) || +v < min || +v > max) throw new Error(`${where}: ${what} "${v}" must be ${min}..${max}`);
  return +v;
}

function weights(where, v, what) {
  const p = v.split('|');
  if (p.length !== 4) throw new Error(`${where}: ${what} needs four numbers joined with "|"`);
  const w = p.map((x) => int(where, x, what, 0, 10000));
  if (!w.some((x) => x > 0)) throw new Error(`${where}: ${what} are all 0`);
  return w;
}

function parse(equip) {
  const biomes = new Set(rows('../world-atlas/atlas.csv', 'map,kind,biome,tier,temp,anchor,water,rest,name,note').map((r) => r.c[2]));

  const affixes = rows('affixes.csv', 'id,rarity,min,max,kind,type,cap,group,name').map(({ c, where }) => {
    const a = {
      id: int(where, c[0], 'id', 1, 9999), rarity: int(where, c[1], 'rarity', 1, 4), min: int(where, c[2], 'min', 0, 100000),
      max: int(where, c[3], 'max', 0, 100000), kind: int(where, c[4], 'kind', 0, 2), type: +c[5], cap: int(where, c[6], 'cap', 0, 100000),
      group: int(where, c[7], 'group', 0, 999),
    };
    if (![0, 4, 5].includes(a.type)) throw new Error(`${where}: type must be 0, 4 or 5`);
    if (a.min > a.max) throw new Error(`${where}: min > max`);
    return a;
  });
  const ids = new Set();
  for (const a of affixes) {
    if (ids.has(a.id)) throw new Error(`affixes.csv: option ${a.id} twice`);
    ids.add(a.id);
  }
  for (let r = 1; r <= 4; r++)
    if (affixes.filter((a) => a.rarity === r).length > 400) throw new Error(`affixes.csv: more than 400 options of rarity ${r}`);

  const names = rows('affix_names.csv', 'id,name').map(({ c, where }) => {
    if (!/^[\x20-\x7e]+$/.test(c[1]) || c[1].includes('"')) throw new Error(`${where}: the name must be ASCII without "`);
    return { id: int(where, c[0], 'id', 1, 9999), name: c[1] };
  });
  const named = new Set(names.map((n) => n.id));
  if (named.size !== names.length) throw new Error('affix_names.csv: an id twice');
  for (const a of affixes) if (!named.has(a.id)) throw new Error(`affix_names.csv: no name for option ${a.id}`);

  const loot = rows('loot.csv', 'item,tier,jobs,note').map(({ c, where }) => {
    const item = int(where, c[0], 'item', 1, 9999999);
    if (equip && !equip.has(item)) throw new Error(`${where}: item ${item} is not equipment in rAthena's tables`);
    if (c[2] !== '*') for (const j of c[2].split('|')) if (!JOBS.includes(j)) throw new Error(`${where}: unknown job "${j}"`);
    return { item, tier: int(where, c[1], 'tier', 1, 6), jobs: c[2] };
  });
  const seen = new Set();
  for (const l of loot) {
    if (seen.has(l.item)) throw new Error(`loot.csv: item ${l.item} twice`);
    seen.add(l.item);
  }
  loot.sort((a, b) => a.tier - b.tier || a.item - b.item);

  const costumes = rows('costumes.csv', 'item,note').map(({ c, where }) => {
    const item = int(where, c[0], 'item', 1, 9999999);
    if (equip && !equip.has(item)) throw new Error(`${where}: item ${item} is not equipment in rAthena's tables`);
    if (seen.has(item)) throw new Error(`${where}: item ${item} is also in loot.csv`);
    return item;
  });

  const tiers = rows('loot_tiers.csv', 'tier,level,gear_pct,class_pct,costume_pct,biome_item_pct,count_weights,rarity_weights,note').map(({ c, where }) => ({
    tier: int(where, c[0], 'tier', 1, 6), level: int(where, c[1], 'level', 1, 300), gear: int(where, c[2], 'gear_pct', 0, 100),
    cls: int(where, c[3], 'class_pct', 0, 100), cos: int(where, c[4], 'costume_pct', 0, 100), bip: int(where, c[5], 'biome_item_pct', 0, 100),
    cw: weights(where, c[6], 'count_weights'), rw: weights(where, c[7], 'rarity_weights'),
  }));
  for (let t = 1; t <= 6; t++) if (tiers.filter((x) => x.tier === t).length !== 1) throw new Error(`loot_tiers.csv: Tier ${t} needs exactly one row`);

  const modItems = new Set();
  for (const f of ITEM_MODS) for (const m of fs.readFileSync(f, 'utf8').matchAll(/^  - Id: (\d+)/gm)) modItems.add(+m[1]);
  const bio = rows('loot_biomes.csv', 'biome,pct,options,items,note').map(({ c, where }) => {
    if (!biomes.has(c[0])) throw new Error(`${where}: biome "${c[0]}" is not in the atlas`);
    for (const o of c[2].split('|')) if (!ids.has(+o)) throw new Error(`${where}: option ${o} is not in affixes.csv`);
    const items = c[3] === '' ? [] : c[3].split('|').map((v) => int(where, v, 'item', 1, 9999999));
    for (const i of items) if (!modItems.has(i)) throw new Error(`${where}: item ${i} is not in the item_db of clima or temperature`);
    return { biome: c[0], pct: int(where, c[1], 'pct', 0, 100), options: c[2], items: items.join('|') };
  });
  return { affixes, names, loot, costumes, tiers: tiers.sort((a, b) => a.tier - b.tier), bio };
}

// setarray in chunks, so no script line grows too long.
function arr(name, values, quote) {
  const out = [];
  for (let i = 0; i < values.length; i += 40) {
    const v = values.slice(i, i + 40).map((x) => (quote ? `"${x}"` : x));
    out.push(`\tsetarray ${name}[${i}], ${v.join(', ')};`);
  }
  return out.join('\n');
}

function render({ affixes, names, loot, costumes, tiers, bio }) {
  const from = [0];
  const to = [0];
  for (let t = 1; t <= 6; t++) {
    const i = loot.findIndex((l) => l.tier === t);
    from[t] = i < 0 ? 0 : i;
    to[t] = i < 0 ? 0 : i + loot.filter((l) => l.tier === t).length;
  }
  const byTier = (f) => [0].concat(tiers.map(f));
  const four = (f) => [0, 0, 0, 0].concat(tiers.flatMap(f));
  const ari = [];
  const arc = [0];
  for (let r = 1; r <= 4; r++) {
    const list = affixes.map((a, i) => (a.rarity === r ? i : -1)).filter((i) => i >= 0);
    arc[r] = list.length;
    list.forEach((i, k) => ari.push(`\t$@dc_ari[${(r - 1) * 400 + k}] = ${i};`));
  }
  const used = [...new Set(loot.flatMap((l) => (l.jobs === '*' ? [] : l.jobs.split('|'))))].sort();
  return `// GENERATED by registry/tools/dungeon-chest/build_loot.cjs from loot.csv,
// costumes.csv, affixes.csv, affix_names.csv, loot_tiers.csv and
// loot_biomes.csv. Edit the CSVs and rebuild; changes here are lost.
//
// ${loot.length} pieces of equipment, ${costumes.length} costumes, ${affixes.length} affixes. Read by
// dungeon-loot.txt and affix-smith.txt:
//   $@dc_item[] $@dc_job$[]      the equipment, by Tier; Tier t is [$@dc_from[t], $@dc_to[t])
//   $@dc_cos[] ($@dc_cosn)       the costumes
//   $@dc_lv[t] $@dc_gear[t] $@dc_cls[t] $@dc_cosp[t] $@dc_bip[t]  loot_tiers.csv
//   $@dc_cw[t*4+k] $@dc_rw[t*4+r]        count and rarity weights (k, r from 0)
//   $@dc_a*[] ($@dc_an)          the affixes; $@dc_aix[option id] = index + 1
//   $@dc_ari[(r-1)*400+k]        the k-th affix of rarity r; $@dc_arc[r] how many
//   $@dc_nm$[option id]          its name, as the client shows it
//   $@dc_bio$[] $@dc_bpct[] $@dc_bopt$[] $@dc_bitem$[]  loot_biomes.csv
//   $@dc_jk$[] $@dc_jv[]         item_db job name and its EAJ_ constant

-	script	dungeon_loot	-1,{
OnInit:
	$@dc_ready = 0;
${arr('$@dc_item', loot.map((l) => l.item))}
${arr('$@dc_job$', loot.map((l) => l.jobs), true)}
${arr('$@dc_from', from)}
${arr('$@dc_to', to)}
	$@dc_cosn = ${costumes.length};
${arr('$@dc_cos', costumes)}
${arr('$@dc_lv', byTier((t) => t.level))}
${arr('$@dc_gear', byTier((t) => t.gear))}
${arr('$@dc_cls', byTier((t) => t.cls))}
${arr('$@dc_cosp', byTier((t) => t.cos))}
${arr('$@dc_bip', byTier((t) => t.bip))}
${arr('$@dc_cw', four((t) => t.cw))}
${arr('$@dc_rw', four((t) => t.rw))}
	$@dc_an = ${affixes.length};
${arr('$@dc_aid', affixes.map((a) => a.id))}
${arr('$@dc_amin', affixes.map((a) => a.min))}
${arr('$@dc_amax', affixes.map((a) => a.max))}
${arr('$@dc_akind', affixes.map((a) => a.kind))}
${arr('$@dc_atype', affixes.map((a) => a.type))}
${arr('$@dc_acap', affixes.map((a) => a.cap))}
${arr('$@dc_agrp', affixes.map((a) => a.group))}
${affixes.map((a, i) => `\t$@dc_aix[${a.id}] = ${i + 1};`).join('\n')}
${ari.join('\n')}
${arr('$@dc_arc', arc)}
${names.map((n) => `\t$@dc_nm$[${n.id}] = "${n.name}";`).join('\n')}
	$@dc_bn = ${bio.length};
${arr('$@dc_bio$', bio.map((b) => b.biome), true)}
${arr('$@dc_bpct', bio.map((b) => b.pct))}
${arr('$@dc_bopt$', bio.map((b) => b.options), true)}
${arr('$@dc_bitem$', bio.map((b) => b.items), true)}
	$@dc_jn = ${used.length};
${arr('$@dc_jk$', used, true)}
${arr('$@dc_jv', used.map((j) => `EAJ_${j.toUpperCase()}`))}
	$@dc_ready = 1;
	end;
}
`;
}

function renderLub({ names }) {
  const body = names.map((n, i) => `\t[${n.id}] = "${n.name}"${i < names.length - 1 ? ',' : ''}`).join('\n');
  return `-- GENERATED by registry/tools/dungeon-chest/build_loot.cjs from affix_names.csv.
-- Random option names, keyed by the option id the server sends, in Spanish and
-- in ASCII (the client reads this table in its own codepage).
-- Replaces the translation's table, which refers to option names this client
-- does not know and so leaves ids above 192 as UNKNOWN RANDOM OPTION (found
-- by affix-forge, MIT, rhwski). The ids and the English names it was
-- translated from come from the ROenglishRE translation by zackdreaver and
-- llchrisll (https://github.com/llchrisll/ROenglishRE), free to use and modify.

NameTable_VAR = {
${body}
}
`;
}

function main() {
  const args = process.argv.slice(2);
  const dbDir = args.find((a) => !a.startsWith('--')) || DEFAULT_DB;
  let equip = null;
  const file = path.join(dbDir, 'item_db_equip.yml');
  if (fs.existsSync(file)) {
    equip = new Set();
    for (const m of fs.readFileSync(file, 'utf8').matchAll(/^  - Id: (\d+)/gm)) equip.add(+m[1]);
  } else {
    console.warn(`no rAthena item tables in ${dbDir}; items not checked`);
  }
  const data = parse(equip);
  const outs = [[OUT, render(data)], [LUB, renderLub(data)]];
  const what = `${data.loot.length} items, ${data.costumes.length} costumes, ${data.affixes.length} affixes`;
  if (args.includes('--check')) {
    for (const [f, text] of outs) {
      if ((fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '') !== text) {
        console.error(`${path.basename(f)} is out of date; run build_loot.cjs`);
        process.exit(1);
      }
    }
    console.log(`up to date (${what})`);
    return;
  }
  for (const [f, text] of outs) {
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, text);
  }
  console.log(`wrote dungeon-loot-data.txt and addrandomoptionnametable.lub (${what})`);
}

if (require.main === module) main();
module.exports = { parse, render, renderLub };
