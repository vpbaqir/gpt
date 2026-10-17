import {formatJson,convertUrl,convertBase64,csvToJson,jsonToCsv,markdownOutline} from "./toolbox-utils.mjs";
import {slugify,sortLines,wordFrequency,addLineNumbers} from "./toolbox-utils-extra.mjs";
const $=id=>document.getElementById(id);
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
function field(id,labelText,placeholder,multi=true){
const wrap=el("div","field"),label=el("label","",labelText),control=document.createElement(multi?"textarea":"input");
label.htmlFor=id;control.id=id;control.placeholder=placeholder;if(multi){control.rows=8;control.maxLength=500000}else{control.type="text";control.maxLength=2000}
wrap.append(label,control);return{wrap,control};
}
function selectField(options){
const wrap=el("div","field"),label=el("label","","ACTION"),select=document.createElement("select");label.htmlFor="extraMode";select.id="extraMode";
options.forEach(([value,text])=>{const o=el("option","",text);o.value=value;select.append(o)});wrap.append(label,select);return{wrap,control:select};
}
function showResult(area,title,text,filename,summary){
area.replaceChildren();const box=el("div","result-box"),h=el("h3","",title);box.append(h);
if(summary)box.append(el("p","",summary));
const actions=el("div","tool-actions"),copy=el("button","secondary-button","Copy result"),save=el("button","secondary-button","Download file");
copy.type=save.type="button";
copy.onclick=async()=>{try{await navigator.clipboard.writeText(text);$("toast").textContent="Copied to clipboard";$("toast").classList.add("visible");setTimeout(()=>$("toast").classList.remove("visible"),1800)}catch{$("toast").textContent="Clipboard access is unavailable; select the result to copy."; $("toast").classList.add("visible")}};
save.onclick=()=>{const url=URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"})),a=el("a");a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),20000)};
actions.append(copy,save);box.append(actions,el("pre","",text));area.append(box);
}
function showError(area,message){area.replaceChildren();const box=el("div","result-box");box.setAttribute("role","alert");box.append(el("h3","","Check your input"),el("p","",message||"This tool could not finish."));area.append(box)}
function runTool(t,input,mode,area){
try{
const value=input.value;if(!value.trim())throw new Error("Enter some input first.");
let out="",title="Result",file="toolbox-result.txt",summary="";
if(t.kind==="jsonformat"){out=formatJson(value,mode.value);title="JSON validated";file="toolbox.json";summary="Valid JSON · "+out.length+" characters"}
if(t.kind==="urlcodec"){out=convertUrl(value,mode.value);title="URL conversion complete";file="toolbox-url.txt"}
if(t.kind==="base64"){out=convertBase64(value,mode.value);title="Base64 conversion complete";file="toolbox-base64.txt"}
if(t.kind==="csvjson"){const rows=csvToJson(value);out=JSON.stringify(rows,null,2);title="CSV converted to JSON";file="toolbox-data.json";summary=rows.length+" data rows converted"}
if(t.kind==="jsoncsv"){out=jsonToCsv(value);title="JSON converted to CSV";file="toolbox-data.csv"}
if(t.kind==="mdoutline"){const x=markdownOutline(value);out=x.text;title="Markdown outline";file="markdown-outline.txt";summary=x.count+" headings found"}
if(t.kind==="slug"){out=slugify(value);if(!out)throw new Error("Use letters or numbers to create a slug.");title="URL-friendly slug";file="slug.txt"}
if(t.kind==="linesort"){out=sortLines(value,mode.value);title="Lines processed";file="sorted-lines.txt"}
if(t.kind==="wordfreq"){const x=wordFrequency(value);out=x.text;title="Word frequency";file="word-frequency.tsv";summary=x.total+" words · "+x.distinct+" unique · top 100 shown"}
if(t.kind==="linenumbers"){out=addLineNumbers(value);title="Line numbers added";file="numbered-text.txt";summary=value.split(/\r?\n/).length+" lines numbered"}
showResult(area,title,out,file,summary);
}catch(e){showError(area,e.message)}
}
export function openExtraTool(t){
$("homeView").classList.add("hidden");$("toolView").classList.remove("hidden");$("saveTool").classList.add("hidden");
$("workspaceIcon").textContent=t.icon;$("workspaceIcon").className="tool-icon large "+t.tone;$("workspaceCategory").textContent=t.cat.toUpperCase()+" TOOL";$("workspaceTitle").textContent=t.name;$("workspaceDescription").textContent=t.desc;
$("backHome").addEventListener("click",()=>$("saveTool").classList.remove("hidden"),{once:true});
const root=$("workspaceCard");root.replaceChildren();let f,m=null;
if(t.kind==="linesort"){f=field("extraInput","TEXT LINES","Paste lines to sort, reverse or deduplicate…");m=selectField([["ascending","Alphabetical / natural order"],["descending","Reverse alphabetical"],["reverse","Reverse current order"],["unique","Remove duplicate lines"]]);root.append(f.wrap,m.wrap)}
else if(t.kind==="slug"){f=field("extraInput","TITLE OR PHRASE","A title becomes a clean URL slug…",false);root.append(f.wrap)}
else{
const labels={jsonformat:["JSON INPUT","Paste JSON here…"],urlcodec:["TEXT OR URL","Paste text or a URL…"],base64:["TEXT OR BASE64","Paste UTF-8 text or Base64…"],csvjson:["CSV INPUT","Paste CSV with a header row…"],jsoncsv:["JSON INPUT","Paste an array of objects…"],mdoutline:["MARKDOWN INPUT","Paste Markdown with # headings…"],wordfreq:["TEXT TO ANALYSE","Paste English text…"],linenumbers:["TEXT OR CODE","Paste code or plain text…"]};
f=field("extraInput",labels[t.kind][0],labels[t.kind][1]);
if(t.kind==="jsonformat")m=selectField([["pretty","Pretty-print"],["minify","Minify"]]);
if(t.kind==="urlcodec")m=selectField([["encode-component","Encode component"],["decode-component","Decode component"],["encode-uri","Encode full URI"],["decode-uri","Decode full URI"]]);
if(t.kind==="base64")m=selectField([["encode","Text → Base64"],["decode","Base64 → Text"]]);
root.append(f.wrap);if(m)root.append(m.wrap);
}
const note=el("p","status-text","Runs in your browser. Your text is not sent to a Toolbox server."),run=el("button","primary-button","Run tool ↗"),area=el("div","");
run.type="button";run.onclick=()=>runTool(t,f.control,m?.control,area);root.append(note,run,area);window.scrollTo({top:0,behavior:"smooth"});
}
