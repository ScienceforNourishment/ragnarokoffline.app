#!/usr/bin/env node
// Suggests a danger tier for maps, with the criterion dungeon-chest documents:
// spawn-weighted average level of the normal Renewal spawns, excluding MVPs and
// the seasonal spawns. Reads the repo's monster index.
//
//   node tier_of.cjs <map> [<map> ...]
//   node tier_of.cjs --unlisted      every spawned map not yet in atlas.csv

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..', '..');
const INDEX = path.join(ROOT, 'mods', 'navigation-server-monsters', 'mob-index.tsv');
const CSV = path.join(__dirname, 'atlas.csv');
const SEASONAL = /Golden Poring|Delightful Lude|Raccoon|Pumpkin/;

const tierOf = (v) => (v < 40 ? 1 : v < 60 ? 2 : v < 90 ? 3 : v < 120 ? 4 : v < 150 ? 5 : 6);

const lines = fs.readFileSync(INDEX, 'utf8').split('\n').map((l) => l.split('\t'));
const mobs = {};
const byAegis = {};
for (const f of lines) {
  if (f[0] === 'mob' && f[1] === 'renewal') {
    mobs[f[2]] = { level: +f[4], mvp: f[9] === '1', name: f[10] };
    byAegis[f[3]] = f[2];
  }
}
const maps = {};
for (const f of lines) {
  if (f[0] !== 'spawn') continue;
  const mob = mobs[f[2]] || mobs[byAegis[f[2]]];
  if (!mob || mob.mvp || SEASONAL.test(mob.name)) continue;
  const m = (maps[f[1]] ??= { count: 0, sum: 0 });
  m.count += +f[3];
  m.sum += +f[3] * (+f[4] || mob.level);
}

let wanted = process.argv.slice(2);
if (wanted[0] === '--unlisted') {
  const listed = new Set(fs.readFileSync(CSV, 'utf8').split('\n').slice(1).map((l) => l.split(',')[0]));
  wanted = Object.keys(maps).filter((m) => !listed.has(m)).sort();
}
for (const map of wanted) {
  const m = maps[map];
  console.log(m ? `${map}\ttier ${tierOf(m.sum / m.count)}\tavg level ${(m.sum / m.count).toFixed(1)}\t${m.count} spawns` : `${map}\tno normal spawns in the index`);
}
