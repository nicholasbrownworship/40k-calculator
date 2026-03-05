# ☠ Warhammer 40,000 Combat Calculator

A fully offline, single-file combat calculator for **Warhammer 40,000 10th Edition**. No build tools, no dependencies, no install — just open `index.html` in a browser or host it via GitHub Pages.

![40K Calculator Preview](preview.png)

---

## Features

### Attacker Profile
- Model count × attacks per model (fixed or dice: D3, D6, 2D3, 2D6, and more)
- WS/BS skill (2+ through 6+)
- Strength, AP, and damage (fixed or variable dice)
- **Blast** — enforces minimum attack counts at 6+ and 11+ model units
- **Torrent** — auto-hits, bypasses hit roll entirely
- **Sustained Hits 1** — critical hits (6+) generate bonus hits
- **Lethal Hits** — critical hits auto-wound, skipping the wound roll
- **Devastating Wounds** — critical wounds deal mortal wounds equal to damage, bypassing saves
- **Twin-linked** — re-roll wound rolls of 1
- **Anti-Infantry 4+** — critical wounds on 4+ against Infantry keyword targets
- **Melta** (half range) — adds average D6 bonus damage
- **Heavy** — +1 to hit if unit didn't move
- **Hazardous** — calculates average self-inflicted mortal wounds
- Hit re-rolls: 1s only, or all misses
- Wound re-rolls: 1s only, or all wounds
- ±1 to Hit and ±1 to Wound modifiers

### Defender Profile
- Toughness, wounds per model, model count
- Armour save (2+ through No Save) with AP interaction
- Invulnerable save (3++ through 6++) — auto-selects best save
- Feel No Pain (4+++, 5+++, 6+++)
- **Cover** — +1 to armour save
- **Transhuman** — wounds only on 4+ regardless of Strength
- **Stealth / Smoke** — −1 to incoming hit rolls
- Mortal wound negation (4+, 5+, 6+)
- Keyword flags: Infantry, Monster/Vehicle, Fly, Character

### Output
- Total attacks, average hits, wounds, unsaved wounds, damage, and **models slain**
- Visual step-by-step probability pipeline
- Full breakdown table: effective hit %, wound threshold, save used, FNP, mortal wounds, etc.

---

## Usage

### Option A — Local
1. Clone or download this repo
2. Open `index.html` in any modern browser
3. No internet required after the first load (Google Fonts cached)

### Option B — GitHub Pages
1. Fork this repo
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your calculator will be live at `https://yourusername.github.io/repo-name/`

---

## How the Maths Works

All values are **averages** based on the standard 40K attack sequence:

```
Attacks → To Hit → To Wound → Saving Throw → Feel No Pain → Damage
```

| Step | Formula |
|---|---|
| Hit chance | `(7 − WS/BS) / 6`, modified by re-rolls and ±1 |
| Wound chance | Strength vs Toughness table, modified by re-rolls and ±1 |
| Save chance | Best of `(armour + AP)` or invuln; `(7 − threshold) / 6` |
| FNP | `(7 − FNP value) / 6` applied after failed saves |
| Damage | `unsaved wounds × avg damage per wound` |
| Models slain | `total damage / wounds per model` (capped at defending model count) |

Special rules (Lethal Hits, Devastating Wounds, etc.) are layered on top using the fraction of critical results `(1/6)`.

---

## Notes

- All results are **statistical averages** — real games will vary
- Dedicated wound tracking (e.g. partial wounds on multi-wound models) is approximated
- Stratagems and faction-specific rules are not included
- Compatible with 10th Edition core rules as of publication

---

## Contributing

PRs welcome! Ideas for future features:
- [ ] Multiple weapon profiles / unit comparisons
- [ ] Probability distribution charts (bell curves)
- [ ] Psychic / Mortal wound-only attacks
- [ ] Save-against-specific stratagems
- [ ] Mobile-optimised layout improvements

---

## License

MIT — free to use, modify, and share.

---

*This is a fan-made tool. Warhammer 40,000 is a trademark of Games Workshop Ltd.*
