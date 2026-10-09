# Affix Forge: full option list

Generated from the pool in `npc/affix_drops.txt` (214 options). "Base" is the raw roll range. The Lv1 and Lv100 columns are the final value range after monster-level scaling and the cap, at the default `value_mult` of 100.

Kind: flat = scales x(1 + 2% per level), percent = x(1 + 1% per level), fixed = never scales. Group: options sharing a non-zero group never roll on the same item (1-9 always, 10+ only with "One affix per stat" on).

## Tier 1: Common (18 options)

| ID | Option | Item | Kind | Base | Lv1 | Lv100 | Cap | Group |
|---|---|---|---|---|---|---|---|---|
| 3 | STR +X | any | flat | 2-4 | 2-4 | 6-12 | - | - |
| 4 | AGI +X | any | flat | 2-4 | 2-4 | 6-12 | - | - |
| 5 | VIT +X | any | flat | 2-4 | 2-4 | 6-12 | - | - |
| 6 | INT +X | any | flat | 2-4 | 2-4 | 6-12 | - | - |
| 7 | DEX +X | any | flat | 2-4 | 2-4 | 6-12 | - | - |
| 8 | LUK +X | any | flat | 2-4 | 2-4 | 6-12 | - | - |
| 17 | ATK +X | any | flat | 5-10 | 5-10 | 15-30 | - | 12 |
| 19 | MATK +X | any | flat | 5-10 | 5-10 | 15-30 | - | 13 |
| 1 | MaxHP +X | any | flat | 30-60 | 30-61 | 90-180 | - | 10 |
| 2 | MaxSP +X | any | flat | 10-25 | 10-25 | 30-75 | - | 11 |
| 22 | Flee Rate +X | any | flat | 3-6 | 3-6 | 9-18 | - | - |
| 20 | DEF +X | any | flat | 10-20 | 10-20 | 30-60 | - | - |
| 21 | MDEF +X | any | flat | 10-20 | 10-20 | 30-60 | - | - |
| 18 | Hit Rate +X | any | flat | 3-7 | 3-7 | 9-21 | - | - |
| 24 | Critical Rate +X | any | flat | 2-4 | 2-4 | 6-12 | - | - |
| 23 | Perfect Dodge +X | any | flat | 2-4 | 2-4 | 6-12 | - | - |
| 11 | HP Recovery Speed +X% | any | percent | 10-30 | 10-30 | 20-60 | 100 | - |
| 12 | SP Recovery Speed +X% | any | percent | 10-30 | 10-30 | 20-60 | 100 | - |

## Tier 2: Uncommon (73 options)

| ID | Option | Item | Kind | Base | Lv1 | Lv100 | Cap | Group |
|---|---|---|---|---|---|---|---|---|
| 9 | MaxHP +X% | any | percent | 4-6 | 4-6 | 8-12 | 30 | 10 |
| 10 | MaxSP +X% | any | percent | 4-6 | 4-6 | 8-12 | 30 | 11 |
| 13 | Physical Attack +X% | any | percent | 4-6 | 4-6 | 8-12 | 25 | 12 |
| 14 | Magic Attack +X% | any | percent | 4-6 | 4-6 | 8-12 | 25 | 13 |
| 166 | Long-Range Physical Damage +X% | any | percent | 4-6 | 4-6 | 8-12 | 25 | - |
| 219 | Melee Physical Damage +X% | any | percent | 4-6 | 4-6 | 8-12 | 25 | - |
| 167 | Long-Range Damage Taken -X% | any | percent | 4-8 | 4-8 | 8-16 | 30 | - |
| 220 | Melee Damage Taken -X% | any | percent | 4-8 | 4-8 | 8-16 | 30 | - |
| 15 | Attack Speed (ASPD) +X | any | fixed | 1-2 | 1-2 | 1-2 | 5 | 14 |
| 16 | Attack Speed (ASPD) +X% | any | percent | 3-5 | 3-5 | 6-10 | 15 | 14 |
| 170 | Variable Cast Time -X% | any | percent | 3-5 | 3-5 | 6-10 | 30 | - |
| 171 | After-cast Delay -X% | any | percent | 3-5 | 3-5 | 6-10 | 30 | - |
| 172 | SP Consumption -X% | any | percent | 3-6 | 3-6 | 6-12 | 30 | - |
| 168 | Healing Skill Power +X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 169 | Received Healing +X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 165 | Critical Damage Taken -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 25 | Neutral Property Resistance +X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 26 | Water Property Resistance +X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 27 | Earth Property Resistance +X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 28 | Fire Property Resistance +X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 29 | Wind Property Resistance +X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 30 | Poison Property Resistance +X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 31 | Holy Property Resistance +X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 32 | Dark Property Resistance +X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 33 | Ghost Property Resistance +X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 34 | Undead Property Resistance +X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 36 | Physical Damage from Neutral Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 38 | Physical Damage from Water Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 40 | Physical Damage from Earth Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 42 | Physical Damage from Fire Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 44 | Physical Damage from Wind Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 46 | Physical Damage from Poison Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 48 | Physical Damage from Holy Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 50 | Physical Damage from Dark Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 52 | Physical Damage from Ghost Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 54 | Physical Damage from Undead Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 56 | Magic Damage from Neutral Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 58 | Magic Damage from Water Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 60 | Magic Damage from Earth Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 62 | Magic Damage from Fire Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 64 | Magic Damage from Wind Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 66 | Magic Damage from Poison Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 68 | Magic Damage from Holy Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 70 | Magic Damage from Dark Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 72 | Magic Damage from Ghost Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 74 | Magic Damage from Undead Monsters -X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 87 | Resistance vs Formless +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 88 | Resistance vs Undead +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 89 | Resistance vs Brute +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 90 | Resistance vs Plant +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 91 | Resistance vs Insect +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 92 | Resistance vs Fish +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 93 | Resistance vs Demon +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 94 | Resistance vs Demi-Human +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 95 | Resistance vs Angel +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 96 | Resistance vs Dragon +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 194 | Physical Damage from Formless -X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 195 | Physical Damage from Undead -X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 196 | Physical Damage from Brute -X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 197 | Physical Damage from Plant -X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 198 | Physical Damage from Insect -X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 199 | Physical Damage from Fish -X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 200 | Physical Damage from Demon -X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 201 | Physical Damage from Demi-Human -X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 202 | Physical Damage from Angel -X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 203 | Physical Damage from Dragon -X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 149 | Damage from Normal Monsters -X% | any | percent | 3-6 | 3-6 | 6-12 | 30 | - |
| 160 | Physical Damage from Small Monsters -X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 190 | Magic Damage from Small Monsters -X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 161 | Physical Damage from Medium Monsters -X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 191 | Magic Damage from Medium Monsters -X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 162 | Physical Damage from Large Monsters -X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |
| 192 | Magic Damage from Large Monsters -X% | any | percent | 3-7 | 3-7 | 6-14 | 30 | - |

## Tier 3: Rare (64 options)

| ID | Option | Item | Kind | Base | Lv1 | Lv100 | Cap | Group |
|---|---|---|---|---|---|---|---|---|
| 164 | Critical Damage +X% | any | percent | 5-10 | 5-10 | 10-20 | 40 | - |
| 193 | All Property Resistance +X% | any | percent | 2-4 | 2-4 | 4-8 | 15 | - |
| 218 | Reflected Damage Taken -X% | any | percent | 5-15 | 5-15 | 10-30 | 50 | - |
| 150 | Damage from Boss Monsters -X% | any | percent | 3-6 | 3-6 | 6-12 | 30 | - |
| 37 | Physical Damage vs Neutral Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 39 | Physical Damage vs Water Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 41 | Physical Damage vs Earth Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 43 | Physical Damage vs Fire Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 45 | Physical Damage vs Wind Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 47 | Physical Damage vs Poison Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 49 | Physical Damage vs Holy Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 51 | Physical Damage vs Dark Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 53 | Physical Damage vs Ghost Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 55 | Physical Damage vs Undead Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 57 | Magic Damage vs Neutral Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 59 | Magic Damage vs Water Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 61 | Magic Damage vs Earth Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 63 | Magic Damage vs Fire Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 65 | Magic Damage vs Wind Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 67 | Magic Damage vs Poison Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 69 | Magic Damage vs Holy Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 71 | Magic Damage vs Dark Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 73 | Magic Damage vs Ghost Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 75 | Magic Damage vs Undead Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 97 | Physical Damage vs Formless +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 98 | Physical Damage vs Undead +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 99 | Physical Damage vs Brute +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 100 | Physical Damage vs Plant +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 101 | Physical Damage vs Insect +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 102 | Physical Damage vs Fish +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 103 | Physical Damage vs Demon +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 104 | Physical Damage vs Demi-Human +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 105 | Physical Damage vs Angel +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 106 | Physical Damage vs Dragon +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 107 | Magic Damage vs Formless +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 108 | Magic Damage vs Undead +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 109 | Magic Damage vs Brute +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 110 | Magic Damage vs Plant +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 111 | Magic Damage vs Insect +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 112 | Magic Damage vs Fish +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 113 | Magic Damage vs Demon +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 114 | Magic Damage vs Demi-Human +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 115 | Magic Damage vs Angel +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 116 | Magic Damage vs Dragon +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 147 | Damage vs Normal Monsters +X% | any | percent | 3-6 | 3-6 | 6-12 | 30 | - |
| 151 | Magic Damage vs Normal Monsters +X% | any | percent | 3-6 | 3-6 | 6-12 | 30 | - |
| 157 | Physical Damage vs Small Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 187 | Magic Damage vs Small Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 158 | Physical Damage vs Medium Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 188 | Magic Damage vs Medium Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 159 | Physical Damage vs Large Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 189 | Magic Damage vs Large Monsters +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 221 | Neutral Magic Skill Damage +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 222 | Water Magic Skill Damage +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 223 | Earth Magic Skill Damage +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 224 | Fire Magic Skill Damage +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 225 | Wind Magic Skill Damage +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 226 | Poison Magic Skill Damage +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 227 | Holy Magic Skill Damage +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 228 | Dark Magic Skill Damage +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 229 | Ghost Magic Skill Damage +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 230 | Undead Magic Skill Damage +X% | any | percent | 3-7 | 3-7 | 6-14 | 35 | - |
| 185 | Weapon cannot be broken | weapon | fixed | - | - | - | - | - |
| 186 | Armor cannot be broken | armor | fixed | - | - | - | - | - |

## Tier 4: Epic (59 options)

| ID | Option | Item | Kind | Base | Lv1 | Lv100 | Cap | Group |
|---|---|---|---|---|---|---|---|---|
| 148 | Damage vs Boss Monsters +X% | any | percent | 3-6 | 3-6 | 6-12 | 30 | - |
| 152 | Magic Damage vs Boss Monsters +X% | any | percent | 3-6 | 3-6 | 6-12 | 30 | - |
| 153 | Ignore DEF of Normal Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 154 | Ignore DEF of Boss Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 155 | Ignore MDEF of Normal Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 156 | Ignore MDEF of Boss Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 127 | Ignore DEF of Formless Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 128 | Ignore DEF of Undead Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 129 | Ignore DEF of Brute Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 130 | Ignore DEF of Plant Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 131 | Ignore DEF of Insect Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 132 | Ignore DEF of Fish Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 133 | Ignore DEF of Demon Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 134 | Ignore DEF of Demi-Human Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 135 | Ignore DEF of Angel Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 136 | Ignore DEF of Dragon Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 137 | Ignore MDEF of Formless Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 138 | Ignore MDEF of Undead Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 139 | Ignore MDEF of Brute Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 140 | Ignore MDEF of Plant Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 141 | Ignore MDEF of Insect Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 142 | Ignore MDEF of Fish Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 143 | Ignore MDEF of Demon Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 144 | Ignore MDEF of Demi-Human Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 145 | Ignore MDEF of Angel Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 146 | Ignore MDEF of Dragon Monsters X% | any | percent | 2-5 | 2-5 | 4-10 | 25 | - |
| 231 | All Magic Skill Damage +X% | any | percent | 2-4 | 2-4 | 4-8 | 15 | - |
| 232 | EXP from Formless Monsters +X% | any | percent | 2-5 | 2-5 | 4-10 | 15 | - |
| 233 | EXP from Undead Monsters +X% | any | percent | 2-5 | 2-5 | 4-10 | 15 | - |
| 234 | EXP from Brute Monsters +X% | any | percent | 2-5 | 2-5 | 4-10 | 15 | - |
| 235 | EXP from Plant Monsters +X% | any | percent | 2-5 | 2-5 | 4-10 | 15 | - |
| 236 | EXP from Insect Monsters +X% | any | percent | 2-5 | 2-5 | 4-10 | 15 | - |
| 237 | EXP from Fish Monsters +X% | any | percent | 2-5 | 2-5 | 4-10 | 15 | - |
| 238 | EXP from Demon Monsters +X% | any | percent | 2-5 | 2-5 | 4-10 | 15 | - |
| 239 | EXP from Demi-Human Monsters +X% | any | percent | 2-5 | 2-5 | 4-10 | 15 | - |
| 240 | EXP from Angel Monsters +X% | any | percent | 2-5 | 2-5 | 4-10 | 15 | - |
| 241 | EXP from Dragon Monsters +X% | any | percent | 2-5 | 2-5 | 4-10 | 15 | - |
| 242 | EXP from all Monsters +X% | any | percent | 1-3 | 1-3 | 2-6 | 10 | - |
| 163 | Weapon ignores size penalty | weapon | fixed | - | - | - | - | - |
| 175 | Weapon Element: Neutral | weapon | fixed | - | - | - | - | 1 |
| 176 | Weapon Element: Water | weapon | fixed | - | - | - | - | 1 |
| 177 | Weapon Element: Earth | weapon | fixed | - | - | - | - | 1 |
| 178 | Weapon Element: Fire | weapon | fixed | - | - | - | - | 1 |
| 179 | Weapon Element: Wind | weapon | fixed | - | - | - | - | 1 |
| 180 | Weapon Element: Poison | weapon | fixed | - | - | - | - | 1 |
| 181 | Weapon Element: Holy | weapon | fixed | - | - | - | - | 1 |
| 182 | Weapon Element: Dark | weapon | fixed | - | - | - | - | 1 |
| 183 | Weapon Element: Ghost | weapon | fixed | - | - | - | - | 1 |
| 184 | Weapon Element: Undead | weapon | fixed | - | - | - | - | 1 |
| 76 | Armor Element: Neutral | armor | fixed | - | - | - | - | 2 |
| 77 | Armor Element: Water | armor | fixed | - | - | - | - | 2 |
| 78 | Armor Element: Earth | armor | fixed | - | - | - | - | 2 |
| 79 | Armor Element: Fire | armor | fixed | - | - | - | - | 2 |
| 80 | Armor Element: Wind | armor | fixed | - | - | - | - | 2 |
| 81 | Armor Element: Poison | armor | fixed | - | - | - | - | 2 |
| 82 | Armor Element: Holy | armor | fixed | - | - | - | - | 2 |
| 83 | Armor Element: Dark | armor | fixed | - | - | - | - | 2 |
| 84 | Armor Element: Ghost | armor | fixed | - | - | - | - | 2 |
| 85 | Armor Element: Undead | armor | fixed | - | - | - | - | 2 |

## How to balance it

Everything lives in two places: the pool rows in `npc/affix_drops.txt` and the settings in `mod.json`.

**Settings (no code edit, per player or server in the mod menu)**
- **Rarity weights** (default 55 / 28 / 14 / 3): chance of rolling each tier, per attribute. Lower the Epic weight, or raise Common, to make good affixes rarer. At the defaults about 3% of attributes are Epic; an item with 4 attributes has roughly a 11% chance of containing at least one.
- **Min / max attributes** (default 1-4): the biggest lever on power. Setting max to 2 removes most of the "4 affix" items.
- **Value multiplier** (default 100%): scales every value at once, before the cap.
- **Level scaling**: off = values stay at base for every monster; on = flat x(1+2%/lv), percent x(1+1%/lv). Turn it off or lower value_mult if high-level monsters feel too generous.
- **Drop rate multiplier**: how often a monster's equipment gets an affix roll at all.
- **One affix per stat**: stops MaxHP + MaxHP % style stacking.

**Per option (edit the row)**
- Min / max: the base range. Narrow it to make rolls more consistent.
- Tier: move a strong option down a tier to make it rarer (for example Critical Damage to Tier 4).
- Cap: a hard ceiling after scaling and value_mult. At the defaults no cap is reached by level 100, so caps only matter once you raise value_mult or farm very high-level monsters. Lower a cap to make it bite earlier.
- Kind: 2 (fixed) stops an option scaling with level.
- Group: give related options the same group (non-zero) so they cannot appear together. Use 10 or higher for "soft" groups that follow the One affix per stat setting.
- Delete a row to remove an option entirely; copy a row to add another id from `item_randomopt_db.yml`.

**Known balance points to look at**
- Rarity is independent of monster level, so a level 1 monster can roll an Epic affix (at low values). To tie it to level, shift the tier weights by monster level in `OnNPCKillEvent` (for example subtract from the Epic and Rare weights below level 50).
- Tier 1 flat stats and the Tier 1 recovery options have large ranges and the highest scaling; Tier 1 MaxHP reaches 180 at level 100.
- "Ignore DEF/MDEF" (Tier 4) and the boss damage options are the strongest per point; consider lowering their max or cap first.
- EXP options are a progression boost rather than combat power; the caps (10-15%) keep them mild.
