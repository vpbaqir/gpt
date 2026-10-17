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
