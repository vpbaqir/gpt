import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const manifest = JSON.parse(await readFile(new URL("../manifest.webmanifest", import.meta.url), "utf8"));
const sw = await readFile(new URL("../sw.js", import.meta.url), "utf8");

const tools = [
  ["json-formatter", "jsonfmt"],
  ["url-codec", "urlcodec"],
  ["base64-codec", "base64"],
  ["csv-to-json", "csvjson"],
  ["json-to-csv", "jsoncsv"],
  ["markdown-outline", "mdoutline"],
  ["slug-generator", "slug"],
  ["line-sorter", "linesort"],
  ["word-frequency", "wordfreq"],
  ["line-numberer", "linenumbers"],
];

test("all ten utility cards are registered with distinct ids", () => {
  for (const [id] of tools) assert.match(app, new RegExp('"' + id + '"'));
  assert.equal(new Set(tools.map(([id]) => id)).size, 10);
});

test("every utility kind has a workspace and processing handler", () => {
  assert.match(app, /function drawUtility\(kind\)/);
  assert.match(app, /function runUtility\(kind\)/);
  for (const [, kind] of tools) {
    assert.ok(app.includes('"' + kind + '"'), "missing kind " + kind);
  }
});

test("Data & Dev is discoverable from navigation and category filters", () => {
  assert.match(html, /data-category="Data &amp; Dev"/);
  assert.match(html, /data-filter="Data &amp; Dev"/);
});

test("input validation and safe output escaping are present", () => {
  assert.match(app, /JSON\.parse\(input\)/);
  assert.match(app, /unclosed quoted field/);
  assert.match(app, /new TextDecoder\("utf-8",\{fatal:true\}\)/);
  assert.match(app, /const escaped=esc\(output\)/);
});

test("PWA metadata and service-worker cache are valid and refreshed", () => {
  assert.equal(manifest.name, "Toolbox — Useful tools, all in one place");
  assert.ok(manifest.start_url);
  assert.match(sw, /toolbox-shell-v2/);
  assert.match(sw, /\.\/app\.js/);
});
