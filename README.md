# ☠ Warhammer 40,000 Combat Calculator

A fully offline-capable, single-file combat calculator for **Warhammer 40,000 10th Edition**. No build tools, no install — open `index.html` in any browser, or host via GitHub Pages.

**Live unit search powered by [Wahapedia](https://wahapedia.ru)** — search any unit and auto-populate attacker weapons and defender stats.

---

## Features

### Unit Search
- Search any unit from the full Wahapedia database (all factions, 10th Edition)
- **Attacker:** select a unit → choose a weapon profile → stats auto-fill including Attacks, WS/BS, Strength, AP, Damage, and all weapon keywords
- **Defender:** select a unit → Toughness, Wounds, Armour Save, and Invulnerable Save auto-fill
- Graceful fallback to manual entry if offline

### Attacker Profile
- Model count × attacks per model (fixed or dice: D3, D6, 2D3, 2D6, and variants)
- WS/BS skill (2+ through 6+)
- Strength, AP, and damage (fixed or variable dice)
- **Crits on 5+** — armies like Orks (Waaagh!), Necrons (stratagem), and Leagues of Votann can trigger Critical Hits on 5+ rather than 6+, affecting Lethal Hits, Sustained Hits, and Devastating Wounds
- **Blast** — enforces minimum attack counts at 6+ and 11+ model units
- **Torrent** — auto-hits, bypasses the hit roll entirely
- **Sustained Hits 1 / Sustained Hits 2** — Critical Hits generate extra hits
- **Lethal Hits** — Critical Hits auto-wound
- **Devastating Wounds** — Critical Wounds deal mortal wounds equal to Damage, bypassing saves
- **Twin-linked** — re-roll wound rolls of 1
- **Anti-Infantry 4+** — Critical Wounds on 4+ vs Infantry keyword targets
- **Melta** (half range) — adds average D6 bonus damage
- **Heavy** — +1 to hit if unit didn't move
- **Hazardous** — calculates average self-inflicted mortal wounds on the attacker
- Hit re-rolls: 1s only, or all misses
- Wound re-rolls: 1s only, or all wounds
- ±1 to Hit and ±1 to Wound modifiers

### Defender Profile
- Toughness, wounds per model, model count
- Armour save with AP interaction; auto-selects best of armour vs invulnerable
- Invulnerable save (3++ through 6++)
- Feel No Pain (4+++, 5+++, 6+++)
- Cover (+1 to armour save)
- Stealth / Smoke (−1 to hit)
- −1 to Wound (defensive ability)
- Mortal wound negation (4+, 5+, 6+)
- Keyword flags: Infantry, Monster/Vehicle

### Output
- Average total attacks, hits, wounds, unsaved wounds, damage, and **models slain**
- Visual step-by-step probability pipeline
- Full breakdown table with every modifier shown

---

## Usage

### Option A — Local
1. Download `index.html`
2. Open it in any modern browser — no server needed

### Option B — GitHub Pages
1. Fork this repo
2. Go to **Settings → Pages → Source: main / root**
3. Live at `https://yourusername.github.io/repo-name/`

---

## How It Works

### Unit Search
The calculator fetches three CSV files from Wahapedia's public data export on page load:
- `Datasheets.csv` — unit names and faction IDs
- `Datasheets_models.csv` — T, W, Sv, invuln per model
- `Datasheets_weapons.csv` — weapon profiles with all stats and keywords
- `Factions.csv` — faction name lookup

Fetching is routed through [corsproxy.io](https://corsproxy.io) to bypass browser CORS restrictions. Results are cached for the session.

### Combat Maths
```
Attacks → To Hit → To Wound → Saving Throw → Feel No Pain → Damage
```

| Step | Formula |
|---|---|
| Hit chance | `(7 − WS/BS) / 6`, adjusted for re-rolls and modifiers |
| Wound chance | Strength vs Toughness table, adjusted for re-rolls and modifiers |
| Save chance | Best of `(armour + AP)` or invuln; `(7 − threshold) / 6` |
| FNP | `(7 − FNP value) / 6`, applied after failed saves |
| Damage | `unsaved wounds × avg damage per wound` |
| Models slain | `total damage / wounds per model` (capped at defending model count) |

Critical effects (Lethal Hits, Sustained Hits, Devastating Wounds) layer on top using the critical fraction: `1/6` for crits-on-6, `2/6` for crits-on-5.

---

## Notes
- All results are **statistical averages** — real dice vary
- Multi-wound model spill-over is approximated
- Stratagems and faction-specific aura abilities beyond the listed modifiers are not automated
- Data sourced from Wahapedia; not affiliated with Games Workshop

---

## Contributing

PRs welcome! Ideas for future features:
- [ ] Side-by-side weapon comparison
- [ ] Probability distribution bell curves
- [ ] Save the calculator state to a URL/share link
- [ ] Multiple unit profiles in one session

---

## License

MIT

---

*Warhammer 40,000 is a trademark of Games Workshop Ltd. Data sourced from Wahapedia.*
