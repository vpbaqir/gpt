import {formatJson,convertUrl,convertBase64,csvToJson,jsonToCsv,markdownOutline} from "./toolbox-utils.mjs";
import {slugify,sortLines,wordFrequency,addLineNumbers} from "./toolbox-utils-extra.mjs";
const checks=[];
function test(name,fn){checks.push([name,fn])}
function equal(a,b){if(JSON.stringify(a)!==JSON.stringify(b))throw new Error("Expected "+JSON.stringify(b)+" but got "+JSON.stringify(a))}
function throws(fn,part){let err;try{fn()}catch(e){err=e}if(!err||!String(err.message).includes(part))throw new Error("Expected an error containing: "+part)}
test("JSON pretty and compact",()=>{equal(formatJson('{"a":1}',"pretty"),'{\n  "a": 1\n}');equal(formatJson('{"a":1}',"minify"),'{"a":1}');throws(()=>formatJson("{","pretty"),"JSON")});
test("URL round-trip",()=>{const s="hello world & مرحبا";equal(convertUrl(convertUrl(s,"encode-component"),"decode-component"),s)});
test("UTF-8 Base64 round-trip",()=>{const s="Toolbox — مرحبا 🌙";equal(convertBase64(convertBase64(s,"encode"),"decode"),s)});
test("CSV quoted commas and quotes",()=>{equal(csvToJson('name,note\r\n"Ada, Lovelace","said ""hello"""'),[{name:"Ada, Lovelace",note:'said "hello"'}])});
test("CSV rejects duplicate headers",()=>throws(()=>csvToJson("name,name\nA,B"),"unique"));
test("JSON to CSV escapes cells",()=>equal(jsonToCsv('[{"name":"A, B","score":2},{"name":"C","active":true}]'),'name,score,active\r\n"A, B",2,\r\nC,,true'));
test("Markdown heading outline",()=>{const x=markdownOutline("# Start\nParagraph\n### Deep");equal(x.count,2);if(!x.text.includes("Deep (line 3)"))throw new Error("Heading line missing")});
test("Slug output is clean",()=>{equal(slugify("  Hello, World!  "),"hello-world");equal(slugify("!!!"),"")});
test("Line sorting and uniqueness",()=>{equal(sortLines("item 10\nitem 2","ascending"),"item 2\nitem 10");equal(sortLines("a\nb\na","unique"),"a\nb")});
test("Word frequency counts repeated words",()=>{const x=wordFrequency("Toolbox tools, tools for everyone.");equal([x.total,x.distinct],[5,4]);if(!x.text.includes("tools\t2"))throw new Error("Frequency count missing")});
test("Line numbering",()=>equal(addLineNumbers("alpha\nbeta"),"1: alpha\n2: beta"));
let failed=0;
for(const [name,fn] of checks){try{fn();console.log("PASS",name)}catch(e){failed++;console.error("FAIL",name,e.message)}}
if(failed)throw new Error(failed+" Toolbox utility test(s) failed.");
console.log("Passed "+checks.length+" Toolbox utility tests.");
