# Affix Forge

A mod for [Ragnarok Offline](https://github.com/Flux159/ragnarokoffline.app) that adds an affix system to the gear you already have.

- **Affix drops.** Equipment that monsters can drop also comes in a version with **1-4 random affixes** (bonus attributes), picked from **214 options in four rarity tiers**. No new items, no chests: the rolls happen on the monster's own drops.
- **The Affix Smith** (Prontera, 164,176) moves all or just one affix from one item to another, removes a chosen affix, or rerolls an item's affixes, for zeny **you set**.

It works on stock items in renewal and pre-renewal, adds no custom map, and needs Ragnarok Offline 1.4.3 or newer.

## Install

1. Copy the `affix-forge` folder to `%APPDATA%\Ragnarok Offline\state\mods`, or use **Settings → Mods → Add mod from folder**.
2. Switch it on in Settings → Mods and press **Apply**.
3. Restart the game client once (it caches files by name; this loads the affix names).

## How the drops work

Whenever you kill a monster, each weapon, armor or shadow gear piece in **its drop list** gets an extra roll at its normal drop rate (times the "Modded drop chance" setting). A win gives you a copy of that item with 1-4 distinct affixes.

How many affixes an item gets is weighted, by default 50% for 1, 30% for 2, 15% for 3 and 5% for 4 (setting "Attribute count weights", four numbers like `50,30,15,5`; a 0 switches that count off).

Each affix is rolled in two steps: a **rarity tier** by weight, then a random option from that tier that fits the item (weapon-only and armor-only options respect the item type).

| Tier | Default weight | What is in it |
|---|---|---|
| 1 Common | 55 | STR/AGI/..., ATK, MATK, flat HP/SP, DEF/MDEF, HIT, FLEE, CRIT, recovery speed |
| 2 Uncommon | 28 | HP/SP %, ATK/MATK %, ASPD, cast time and delay, SP cost, healing, element/race/size resistances, damage reduction from monster elements |
| 3 Rare | 14 | Damage vs race/element/size, magic damage by element, crit damage, unbreakable gear |
| 4 Epic | 3 | Boss damage, Ignore DEF/MDEF, bonus EXP, weapon and armor element conversion |

Values scale with the monster's level (switchable), every option has a ceiling, and a **value multiplier** setting scales them all. With **One affix per stat** on (the default) an item never gets, for example, both MaxHP and MaxHP %.

**Ground drop mode** (off by default): instead of going into your inventory identified, the item drops on the ground **where the monster died**, **unidentified**. Identify it after picking it up to see the affixes.

**Pillar of light** (a separate option, only used with ground drop mode): the drop gets a colored pillar like a card drop: blue for 1 affix, yellow for 2, purple for 3-4. With ground drop off there is never a pillar. If dropped items don't show up in your client, turn the pillar off.

**Autoloot:** in ground drop mode, if your `@autoloot` would have picked up the stock drop (its rate is within your autoloot rate and its type is allowed, or it is on your `@autolootitem` list), the affixed item goes straight into your inventory, still unidentified, instead of onto the ground.

The stock drop of the same item still happens as before; the affix version is a separate roll.

**Why the plain item still drops:** the affixes are stored on the item when the server creates it, and the stock drop is created and placed (or autolooted) before any script runs. The kill event is the first point a script can act, and by then the plain item already exists. No script command can add options to an existing item, or reliably find and remove one lying on the ground, so the mod can't turn the stock drop into an affixed one. It rolls a separate affixed copy instead. Making the affixed item replace the plain one needs a change in the rAthena fork itself, for example a hook that adds random options as the drop is created.

## The Affix Smith

Stand in front of him in Prontera at **164,176**. He only touches **unequipped** equipment. Every service shows a preview of what will be taken and what you get before anything is spent.

| Service | What happens |
|---|---|
| **Move ALL affixes** | Choose an item with affixes (it is **used up**) and any other equipment or costume. The target gets the source's affixes exactly as they were, replacing its own. |
| **Move ONE affix** | Choose an item (it is **used up**), choose one of its affixes, then the item to put it on. It takes a free slot; if the target already has that affix its value is replaced; if it has five already, you choose which to give up. |
| **Remove an affix** | Choose an item and one affix. It is removed; the item stays. |
| **Reroll** | Choose an item. It keeps the same *number* of affixes, each rolled anew from the same pool and weights as the drops. Values scale with the item's required level. |

The target always keeps its refine, cards, enchants, grade and bound state.

### Costs

Each service costs **zeny only**, one price per service in Settings → Mods. Set a price to 0 to make that service free. Only "Move ALL" and "Move ONE" use up a second item, the one you take the affixes from.

## Settings

| Setting | Default |
|---|---|
| Modded drop chance (% of the monster's drop rate; 0 = no drops) | 100 |
| Attribute count weights (1,2,3,4 affixes) | 50,30,15,5 |
| Scale values with monster level | on |
| One affix per stat | on |
| Drop on the ground, unidentified | off |
| Ground drop: show the pillar of light (only with the option above) | on |
| Rarity weight, tiers 1 / 2 / 3 / 4 | 55 / 28 / 14 / 3 |
| Value multiplier (%) | 100 |
| Move all affixes: price (zeny) | 100000 |
| Move one affix: price (zeny) | 60000 |
| Remove an affix: price (zeny) | 30000 |
| Reroll: price (zeny) | 50000 |

Press **Apply** after changing settings; the server restarts.

## How it differs from ARPG Equipments Mod

[ARPG Equipments Mod](https://github.com/igueradx/ARPG-Equipments-Mod) by Iguera was the inspiration. Both give gear random options, but they work differently:

| | ARPG Equipments Mod | Affix Forge |
|---|---|---|
| How you get affixed gear | Six tiered **Equipment Chests** drop by monster level; opening one gives a piece of gear | **Monsters drop the gear itself** with affixes, from their own drop list; no chests |
| Rolls | 4 options, one from each of four fixed categories (basic, offensive, defensive, utility), small ranges | **1-4** affixes (you choose the range) from **214 options in four rarity tiers**, weights and a value multiplier adjustable, scaled by monster level |
| Duplicates | Fixed category slots | Never the same affix twice; optional **one affix per stat** |
| Seeing the drop | Items go to your inventory | Inventory, **or** on the ground unidentified with a pillar of light |
| Crafting | A hub map with a Dismantler, Bonus Stats Extractor (Option Scrolls) and Crafter, paid in Equipment Essence | **The Affix Smith** in Prontera: move all, move one, remove, reroll, paid in zeny **you configure** |
| New content | Custom map, custom items (chests, essences, scrolls) | **None**: no new items, no map; works on stock items |
| Drop rates | Per-chest rates, with an in-game customizer NPC | Drop chance as a percentage of each monster's own rate |

They are different designs, not drop-in replacements, and I have not tested running both together. If you do, expect two sets of random-option gear in your inventory and two separate crafting systems.

## Option list and balancing

[OPTIONS.md](OPTIONS.md) lists all 214 options with their tier, base range, final range at monster level 1 and 100, cap and exclusion group, plus notes on how to balance rarity, values and the number of affixes.

## Editing the option pool

Open `npc/affix_drops.txt`. Every option is one row in `OnInit`:

```
callsub L_Add, <option id>, <tier 1-4>, <min>, <max>, <kind>, <item type>, <cap>, <group>;
```

Change a row's tier, range or cap, delete a row to remove an option, or copy one to add any option from rAthena's `item_randomopt_db.yml`. The column meanings are in the comment above the rows. The Smith's reroll reads the same pool, so one edit covers both. Names shown in game come from `data/luafiles514/lua files/datainfo/addrandomoptionnametable.lub`, which already names every option id.

## Affixes in pre-renewal

In pre-renewal the server ships **no scripts for random options** (its option list only imports the renewal file), so an affix is shown on the item but does **nothing for your stats**. `pre-renewal/db/item_randomopt_db.yml` gives the 214 options Affix Forge uses their scripts (copied unchanged from rAthena's renewal list, classic bonuses only), so the affixes count in pre-renewal on every equipped piece, **costumes included**, as they already do in renewal.

There is no settings switch for this (a mod can declare at most 20 settings and Affix Forge uses all of them). To turn it off, delete `pre-renewal/db/item_randomopt_db.yml` from the installed mod folder and restart the server. If you add options of your own to the pool (see below), add their rows to that file too, copied from rAthena's `db/re/item_randomopt_db.yml`.

## Code-only switches

Two flags at the top of `OnInit` in `npc/affix_drops.txt` (not in the settings menu): `.showmsg = 1` shows the "dropped with N attributes" chat messages (off by default), and `.debug = 1` writes ground drop details to the server log.

## Changelog

**1.3.0**
- Rarer high-affix drops: how many affixes an item gets is now weighted, 50% for 1, 30% for 2, 15% for 3 and 5% for 4 (before, 25% each). New setting "Attribute count weights", e.g. `50,30,15,5`. It replaces the minimum/maximum settings: a 0 switches a count off.
- The Affix Smith charges zeny only. The four material settings are removed.
- The mod is back under the app's 20-settings limit (15 settings).

**1.2.0**
- Pre-renewal: the 214 options now have their stat scripts, so affixes count towards your stats there (items and costumes). Before, the server had no option scripts in pre-renewal and affixes did nothing.

**1.1.0**
- Ground drops now appear where the monster died instead of at the player's feet.
- The pillar of light is its own option and only applies with ground drop on.
- The "dropped with N attributes" chat messages are off by default (flag in the script).
- Added [OPTIONS.md](OPTIONS.md), the full option table with balancing notes.

**1.0.0**
- First release.

## Known limits

- The Smith moves affixes without checking the one-affix-per-stat rule, so a moved affix can create a pair like MaxHP and MaxHP % on one item.
- Drops are an extra roll; the stock drop of the same item is unaffected.
- The Affix Smith is newer than the drops and has had less play-testing. Please report problems.

## Credits and licenses

- Code: MIT, see `LICENSE`.
- Concept inspired by [ARPG Equipments Mod](https://github.com/igueradx/ARPG-Equipments-Mod) (MIT, Copyright 2026 Igor / Iguera). The drop and option-pool code is original. The Smith reads an item's random options and recreates the item the same way that mod's Bonus Stat Crafter does, so its MIT notice is reproduced in `LICENSE`.
- Option names in `addrandomoptionnametable.lub` come from the [ROenglishRE](https://github.com/llchrisll/ROenglishRE) translation by zackdreaver and llchrisll, which may be used and modified freely.
- Built for Ragnarok Offline by Flux159 and runs on rAthena.
