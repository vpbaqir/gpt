(() => {
const $=id=>document.getElementById(id), grid=$("toolGrid");
if(!grid)return;
const tools=[
{id:"json-formatter",name:"JSON formatter",desc:"Validate, pretty-print or minify JSON.",cat:"Data & Dev",icon:"{}",tone:"violet",kind:"jsonformat"},
{id:"url-encoder",name:"URL encoder / decoder",desc:"Safely encode or decode URL text.",cat:"Text",icon:"↗",tone:"blue",kind:"urlcodec"},
{id:"base64-converter",name:"Base64 converter",desc:"Encode or decode UTF-8 text as Base64.",cat:"Text",icon:"64",tone:"rose",kind:"base64"},
{id:"csv-json",name:"CSV to JSON",desc:"Convert quoted CSV rows into structured JSON.",cat:"Data & Dev",icon:"⇢",tone:"green",kind:"csvjson"},
{id:"json-csv",name:"JSON to CSV",desc:"Turn JSON objects into spreadsheet-ready CSV.",cat:"Data & Dev",icon:"⇠",tone:"amber",kind:"jsoncsv"},
{id:"markdown-outline",name:"Markdown outline",desc:"Build a nested outline from Markdown headings.",cat:"Text",icon:"≡",tone:"violet",kind:"mdoutline"},
{id:"slug-generator",name:"Slug generator",desc:"Turn a title into a clean URL-friendly slug.",cat:"Text",icon:"—",tone:"green",kind:"slug"},
{id:"line-sorter",name:"Line sorter",desc:"Sort, reverse or deduplicate lines of text.",cat:"Text",icon:"↕",tone:"blue",kind:"linesort"},
{id:"word-frequency",name:"Word frequency",desc:"Count repeated English words and rank them.",cat:"Text",icon:"Aa",tone:"amber",kind:"wordfreq"},
{id:"line-numbers",name:"Line numbers",desc:"Add line numbers before code or plain text.",cat:"Text",icon:"1:",tone:"slate",kind:"linenumbers"}
];
const key="toolbox-saved-v1";
function saved(){try{const x=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(x)?x:[]}catch{return[]}}
function node(tag,cls,txt){const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n}
function makeCard(t){
const a=node("article","tool-card");a.dataset.extraCard=t.id;
const top=node("div","card-top"),icon=node("span","tool-icon "+t.tone,t.icon),fav=node("button","favorite",saved().includes(t.id)?"♥":"♡");
fav.type="button";fav.dataset.extraFav=t.id;fav.setAttribute("aria-label","Save "+t.name);top.append(icon,fav);
const open=node("button","extra-card-open");open.type="button";open.dataset.extraOpen=t.id;open.setAttribute("aria-label","Open "+t.name);
const h=node("h3","",t.name),p=node("p","",t.desc),bottom=node("div","card-bottom"),tag=node("span","tag",t.cat),arrow=node("span","card-arrow","↗");
bottom.append(tag,arrow);open.append(h,p,bottom);a.append(top,open);return a;
}
function renderExtras(){
const category=document.querySelector("[data-filter].active")?.dataset.filter||document.querySelector("[data-category].active")?.dataset.category||"All";
const query=($("toolSearch").value||"").trim().toLowerCase(),s=saved(),byName=$("sortToggle").textContent.includes("Name");
const matches=tools.filter(t=>(category==="All"||category==="Saved"||t.cat===category)&&(category!=="Saved"||s.includes(t.id))&&(!query||(t.name+" "+t.desc+" "+t.cat).toLowerCase().includes(query)));
if(byName)matches.sort((a,b)=>a.name.localeCompare(b.name));
const old=[...grid.querySelectorAll("[data-extra-card]")],oldIds=old.map(x=>x.dataset.extraCard).join("|"),newIds=matches.map(x=>x.id).join("|");
if(oldIds!==newIds){old.forEach(x=>x.remove());matches.forEach(t=>grid.append(makeCard(t)))}
const count=[...grid.children].filter(x=>!x.hasAttribute("data-extra-card")).length+matches.length;
$("toolCount").textContent=count+" tools";$("emptyState").classList.toggle("hidden",count>0);grid.classList.toggle("hidden",count===0);
}
window.ToolboxAddonTools=tools;window.ToolboxAddonRender=renderExtras;
})();
