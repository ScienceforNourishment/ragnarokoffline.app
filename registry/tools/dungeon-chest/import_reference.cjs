#!/usr/bin/env node
// ONE-TIME import of the chest loot from the two reference mods into CSVs of
// our own (D30 style). After it ran, loot.csv and affixes.csv are edited by
// hand and this script is not needed; it refuses to overwrite them without
// --force.
//
//   node import_reference.cjs <rathena-db-re-dir> [--force]
//
// loot.csv     the equipment of arpg-equipments' six chests (its item group
//              ADVENTURER_RETURNS_SUPPORT_BOX, subgroups 2-7), MIT, by Iguera.
//              Costumes and non-equipment are left out. Our Tier is the band
//              of the item's EquipLevelMin (the dungeon-chest bands), but
//              never lower than its arpg chest suggests (FLOOR below), so an
//              unlevelled endgame piece does not land in Tier 1. jobs is "*"
//              or the item_db Jobs that may equip it, joined with "|".
// affixes.csv  the 214-option pool of affix-forge (npc/affix_drops.txt), MIT,
//              by rhwski: id, rarity 1-4, base range, kind, item type, cap and
//              exclusion group, with the option's English name for people.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..', '..');
const GROUPS = path.join(ROOT, 'my-mods', 'arpg-equipments', 'db', 'item_group_db.yml');
const POOL = path.join(ROOT, 'my-mods', 'affix-forge', 'npc', 'affix_drops.txt');
const NAMES = path.join(ROOT, 'my-mods', 'affix-forge', 'data', 'luafiles514', 'lua files', 'datainfo', 'addrandomoptionnametable.lub');
const LOOT = path.join(__dirname, 'loot.csv');
const AFFIXES = path.join(__dirname, 'affixes.csv');

// arpg chest (subgroup - 1) -> lowest Tier of ours it may land in.
const FLOOR = { 1: 1, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
const band = (lv) => (lv < 40 ? 1 : lv < 60 ? 2 : lv < 90 ? 3 : lv < 120 ? 4 : lv < 150 ? 5 : 6);

function equipDb(dbDir) {
  const out = new Map();
  const text = fs.readFileSync(path.join(dbDir, 'item_db_equip.yml'), 'utf8');
  for (const b of text.split(/\n  - Id: /).slice(1)) {
    const get = (k) => (b.match(new RegExp(`\\n    ${k}: (.*)`)) || [])[1];
    const block = (k) => ((b.match(new RegExp(`\\n    ${k}:\\n((?:      .*\\n)+)`)) || [])[1] || '')
      .split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => l.split(':').map((s) => s.trim()));
    out.set(get('AegisName'), {
      id: +b.match(/^(\d+)/)[1],
      name: get('Name'),
      type: get('Type'),
      lv: +(get('EquipLevelMin') || 1),
      locs: block('Locations').map(([k]) => k),
      jobs: block('Jobs'),
    });
  }
  return out;
}

function jobsOf(jobs, every) {
  if (!jobs.length) return '*';
  const on = new Set();
  const all = jobs.find(([k]) => k === 'All');
  if (all && all[1] === 'true') every.forEach((j) => on.add(j));
  for (const [k, v] of jobs) {
    if (k === 'All') continue;
    if (v === 'true') on.add(k);
    else on.delete(k);
  }
  if (all && all[1] === 'true' && jobs.length === 1) return '*';
  return [...on].sort().join('|');
}

// --costumes: only write costumes.csv, the costumes (Costume_* locations) the
// first import left out, for the 5 % costume roll of the chests.
function costumes(dbDir) {
  const out = path.join(__dirname, 'costumes.csv');
  if (fs.existsSync(out)) throw new Error('costumes.csv already exists; it is ours now');
  const db = equipDb(dbDir);
  const rows = [];
  for (const m of fs.readFileSync(GROUPS, 'utf8').matchAll(/Item: (\S+)/g)) {
    const it = db.get(m[1]);
    if (it && it.locs.some((l) => l.startsWith('Costume')) && !rows.some((r) => r.id === it.id))
      rows.push({ id: it.id, note: `${it.name} (${it.locs.join('+')})` });
  }
  rows.sort((a, b) => a.id - b.id);
  fs.writeFileSync(out, 'item,note\n' + rows.map((r) => `${r.id},${r.note.replace(/,/g, ';')}`).join('\n') + '\n');
  console.log(`costumes.csv: ${rows.length} costumes`);
}

function main() {
  const args = process.argv.slice(2);
  const dbDir = args.find((a) => !a.startsWith('--'));
  if (!dbDir) throw new Error('usage: import_reference.cjs <rathena-db-re-dir> [--force | --costumes]');
  if (args.includes('--costumes')) return costumes(dbDir);
  if (!args.includes('--force') && (fs.existsSync(LOOT) || fs.existsSync(AFFIXES)))
    throw new Error('loot.csv or affixes.csv already exists; they are ours now (use --force to redo the import)');
  const db = equipDb(dbDir);
  // Every job name the item tables use: "All: true" expands to these.
  const every = new Set();
  for (const it of db.values()) for (const [k] of it.jobs) if (k !== 'All') every.add(k);

  // Lowest arpg chest of each item.
  const chest = new Map();
  let sub = null;
  for (const line of fs.readFileSync(GROUPS, 'utf8').split(/\r?\n/)) {
    let m = line.match(/SubGroup: (\d+)/);
    if (m) { sub = +m[1] - 1; continue; }
    m = line.match(/Item: (\S+)/);
    if (m && sub) chest.set(m[1], Math.min(chest.get(m[1]) || 99, sub));
  }
  const rows = [];
  let skipped = 0;
  for (const [aegis, c] of chest) {
    const it = db.get(aegis);
    if (!it || !['Weapon', 'Armor', 'Shadowgear'].includes(it.type) || it.locs.some((l) => l.startsWith('Costume'))) {
      skipped++;
      continue;
    }
    rows.push({ id: it.id, tier: Math.max(band(it.lv), FLOOR[c]), jobs: jobsOf(it.jobs, every), note: `${it.name} (Nv ${it.lv}; arpg T${c})` });
  }
  rows.sort((a, b) => a.tier - b.tier || a.id - b.id);
  fs.writeFileSync(LOOT, 'item,tier,jobs,note\n' + rows.map((r) => `${r.id},${r.tier},${r.jobs},${r.note.replace(/,/g, ';')}`).join('\n') + '\n');

  const names = new Map();
  for (const m of fs.readFileSync(NAMES, 'utf8').matchAll(/\[(\d+)\]\s*=\s*"([^"]*)"/g)) names.set(+m[1], m[2]);
  const pool = [];
  for (const m of fs.readFileSync(POOL, 'utf8').matchAll(/callsub L_Add, ([\d, ]+);/g)) {
    const [id, tier, min, max, kind, type, cap, group] = m[1].split(',').map((s) => +s.trim());
    pool.push(`${id},${tier},${min},${max},${kind},${type},${cap},${group},${(names.get(id) || '').replace(/,/g, ';')}`);
  }
  fs.writeFileSync(AFFIXES, 'id,rarity,min,max,kind,type,cap,group,name\n' + pool.join('\n') + '\n');

  const per = {};
  rows.forEach((r) => { per[r.tier] = (per[r.tier] || 0) + 1; });
  console.log(`loot.csv: ${rows.length} items (${skipped} left out) by Tier ${JSON.stringify(per)}; affixes.csv: ${pool.length} options`);
}

main();
