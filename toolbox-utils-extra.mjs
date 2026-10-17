export function slugify(input) { return String(input).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'); }

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
