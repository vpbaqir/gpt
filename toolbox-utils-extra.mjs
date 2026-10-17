export function slugify(input) { return String(input).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

export function sortLines(input, mode) {
  const lines = String(input).split(/\r?\n/);
  if (mode === "ascending") lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  else if (mode === "descending") lines.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" }));
  else if (mode === "reverse") lines.reverse();
  else if (mode === "unique") return [...new Set(lines)].join("\n");
  else throw new Error("Choose a line sorting action.");
  return lines.join("\n");
}

export function wordFrequency(input) {
  const words = String(input).toLowerCase().match(/[a-z0-9']+/g) || [];
  if (!words.length) throw new Error("Enter some words first.");
  const counts = new Map();
  for (const word of words) counts.set(word, (counts.get(word) || 0) + 1);
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 100);
  return { total: words.length, distinct: counts.size, text: rows.map(([word, count]) => word + "\t" + count).join("\n") };
}

export function addLineNumbers(input) {
  return String(input).split("\n").map((line, index) => (index + 1) + ": " + line).join("\n");
}

export function regexMatches(pattern, input, flags = "") {
  const requested = String(flags).trim();
  if (!/^[dgimsuvy]*$/.test(requested)) throw new Error("Use valid JavaScript regex flags only.");
  if (new Set(requested).size !== requested.length) throw new Error("Do not repeat a regex flag.");
  const re = new RegExp(pattern, requested.includes("g") ? requested : requested + "g");
  const matches = [];
  let truncated = false;
  for (const match of String(input).matchAll(re)) {
    if (matches.length >= 1000) { truncated = true; break; }
    matches.push({ match: match[0], index: match.index, captures: match.slice(1) });
  }
  return { count: matches.length, truncated, text: matches.length ? JSON.stringify(matches, null, 2) : "No matches found." };
}

export function convertTimestamp(input, mode) {
  const raw = String(input).trim();
  if (!raw) throw new Error("Enter a timestamp or date first.");
  if (mode === "timestamp-to-date") {
    const n = Number(raw);
    if (!Number.isFinite(n)) throw new Error("Enter a numeric Unix timestamp.");
    const date = new Date(Math.abs(n) < 100000000000 ? n * 1000 : n);
    if (Number.isNaN(date.getTime())) throw new Error("Timestamp is outside the supported date range.");
    return date.toISOString() + "\nUnix seconds: " + Math.floor(date.getTime() / 1000) + "\nUnix milliseconds: " + date.getTime();
  }
  const ms = Date.parse(raw);
  if (!Number.isFinite(ms)) throw new Error("Enter a valid date, preferably ISO format.");
  return mode === "date-to-milliseconds" ? String(ms) : String(Math.floor(ms / 1000));
}

const unitFactors = {
  length: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 },
  mass: { mg: 0.000001, g: 0.001, kg: 1, oz: 0.028349523125, lb: 0.45359237 },
  volume: { ml: 0.001, l: 1, cup: 0.2365882365, usgal: 3.785411784 }
};
export function convertUnit(input, category, from, to) {
  const value = Number(input);
  if (!String(input).trim() || !Number.isFinite(value)) throw new Error("Enter a valid number.");
  if (category === "temperature") {
    let c;
    if (from === "C") c = value;
    else if (from === "F") c = (value - 32) * 5 / 9;
    else if (from === "K") c = value - 273.15;
    else throw new Error("Choose a valid starting temperature unit.");
    if (to === "C") return Number(c.toPrecision(12));
    if (to === "F") return Number((c * 9 / 5 + 32).toPrecision(12));
    if (to === "K") return Number((c + 273.15).toPrecision(12));
    throw new Error("Choose a valid target temperature unit.");
  }
  const factors = unitFactors[category];
  if (!factors || !(from in factors) || !(to in factors)) throw new Error("Choose compatible units from the same category.");
  return Number((value * factors[from] / factors[to]).toPrecision(12));
}
