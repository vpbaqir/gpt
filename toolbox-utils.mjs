export function formatJson(input, mode = "pretty") {
  if (!String(input).trim()) throw new Error("Paste JSON first.");
  const value = JSON.parse(input);
  return mode === "minify" ? JSON.stringify(value) : JSON.stringify(value, null, 2);
}

export function convertUrl(input, mode) {
  switch (mode) {
    case "encode-component": return encodeURIComponent(input);
    case "decode-component": return decodeURIComponent(input);
    case "encode-uri": return encodeURI(input);
    case "decode-uri": return decodeURI(input);
    default: throw new Error("Choose a URL conversion action.");
  }
}

export function convertBase64(input, mode) {
  if (mode === "encode") {
    const bytes = new TextEncoder().encode(input);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return globalThis.btoa(binary);
  }
  if (mode === "decode") {
    let binary;
    try { binary = globalThis.atob(input.replace(/\s+/g, "")); }
    catch { throw new Error("That is not valid Base64. Check the input and try again."); }
    const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
    try { return new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
    catch { throw new Error("The Base64 data is not valid UTF-8 text."); }
  }
  throw new Error("Choose encode or decode.");
}

function parseCsv(input) {
  if (!String(input).trim()) throw new Error("Paste CSV first.");
  const rows = [];
  let row = [], field = "", quoted = false, afterQuote = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"' && input[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') { quoted = false; afterQuote = true; }
      else field += ch;
      continue;
    }
    if (afterQuote) {
      if (ch === ",") { row.push(field); field = ""; afterQuote = false; }
      else if (ch === "\n" || ch === "\r") {
        row.push(field); rows.push(row); row = []; field = ""; afterQuote = false;
        if (ch === "\r" && input[i + 1] === "\n") i++;
      } else if (ch.trim() === "") { }
      else throw new Error("Unexpected text after a quoted CSV field.");
      continue;
    }
    if (ch === '"') {
      if (field.length) throw new Error("A quoted CSV field must start with a quote.");
      quoted = true;
    } else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      row.push(field); rows.push(row); row = []; field = "";
      if (ch === "\r" && input[i + 1] === "\n") i++;
    } else field += ch;
  }
  if (quoted) throw new Error("A CSV field has an opening quote but no closing quote.");
  if (field.length || row.length || afterQuote) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(cell => cell.trim() !== ""));
}

export function csvToJson(input) {
  const rows = parseCsv(input);
  if (rows.length < 2) throw new Error("CSV needs a header row and at least one data row.");
  const headers = rows[0].map(h => h.trim());
  if (headers.some(h => !h)) throw new Error("Every CSV column needs a non-empty header.");
  if (new Set(headers).size !== headers.length) throw new Error("CSV column headers must be unique.");
  return rows.slice(1).map((row, rowIndex) => {
    if (row.length > headers.length) throw new Error("CSV row " + (rowIndex + 2) + " has more values than the header.");
    return Object.fromEntries(headers.map((header, i) => [header, row[i] ?? ""]));
  });
}
