#!/usr/bin/env node
import fs from "fs";
import path from "path";

const BASE = "https://wahapedia.ru/wh40k10ed";
const OUT_DIR = "data";

const FILES = [
  { name: "datasheets", url: `${BASE}/Datasheets.csv`, out: `${OUT_DIR}/datasheets.json`,
    headers: ["id","name","faction_id","source_id","legend","role","loadout","transport","virtual","leader_head","leader_footer","damaged_w","damaged_description","link"] },

  { name: "models", url: `${BASE}/Datasheets_models.csv`, out: `${OUT_DIR}/models.json`,
    headers: ["datasheet_id","line","name","M","T","Sv","inv_sv","inv_sv_descr","W","Ld","OC","base_size","base_size_descr"] },

  // IMPORTANT: your index.html expects weapons.json and uses fields: datasheet_id, name, range, type, A, BS_WS, S, AP, D, description
  // Wahapedia sometimes uses *wargear* naming; we still output to weapons.json for your app.
  { name: "weapons", url: `${BASE}/Datasheets_wargear.csv`, out: `${OUT_DIR}/weapons.json`,
    headers: ["datasheet_id","line","line_in_wargear","dice","name","description","range","type","A","BS_WS","S","AP","D"] },

  { name: "factions", url: `${BASE}/Factions.csv`, out: `${OUT_DIR}/factions.json`,
    headers: ["id","name","link"] },
];

function stripBom(s) {
  return s.replace(/^\uFEFF/, "");
}

// Heuristic: Some exports include a header row; some don’t.
// This supports both without you having to babysit it.
function parsePipe(raw, fallbackHeaders) {
  raw = stripBom(raw);
  const lines = raw.split(/\r?\n/).filter(l => l.trim().length);
  if (!lines.length) return [];

  const first = lines[0].split("|").map(s => s.trim());
  const looksLikeHeader =
    first.includes("id") ||
    (first.includes("name") && (first.includes("faction_id") || first.includes("datasheet_id")));

  const headers = looksLikeHeader ? first : fallbackHeaders;
  const startIdx = looksLikeHeader ? 1 : 0;

  const out = [];
  for (let i = startIdx; i < lines.length; i++) {
    const cols = lines[i].split("|");
    const row = {};
    for (let c = 0; c < headers.length; c++) row[headers[c]] = (cols[c] ?? "").trim();
    // drop fully empty rows
    if (Object.values(row).some(v => v && v.length)) out.push(row);
  }
  return out;
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "40k-calculator/1.0 (local script)",
      "Accept": "text/plain,*/*",
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  const text = await res.text();

  // Block page / HTML detection
  const head = text.slice(0, 500).toLowerCase();
  if (head.includes("<!doctype") || head.includes("<html") || head.includes("cloudflare")) {
    throw new Error(`Got HTML/block page instead of CSV from ${url}`);
  }
  if (!text.includes("|")) {
    throw new Error(`Response doesn't look pipe-delimited from ${url}`);
  }
  return text;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const f of FILES) {
    process.stdout.write(`Fetching ${f.name}… `);
    const raw = await fetchText(f.url);
    const rows = parsePipe(raw, f.headers);

    // sanity check for datasheets
    if (f.name === "datasheets") {
      const sample = rows.find(r => r.id && r.name);
      if (!sample) throw new Error("Parsed datasheets but found no {id,name}. Headers may need updating.");
    }

    fs.writeFileSync(f.out, JSON.stringify(rows), "utf8");
    console.log(`${rows.length} rows -> ${f.out}`);
  }

  console.log("Done. Commit the data/ folder.");
}

main().catch(err => {
  console.error("FAILED:", err.message);
  process.exit(1);
});
