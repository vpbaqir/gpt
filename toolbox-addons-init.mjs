import {openExtraTool} from "./extra-tools-workspace.mjs";
const style=document.createElement("style");style.textContent=".extra-card-open{display:flex;flex:1;flex-direction:column;align-items:stretch;width:100%;min-width:0;padding:0;border:0;background:transparent;color:inherit;text-align:left}.extra-card-open:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:8px}button.favorite[data-extra-fav]{padding:0;border:0;background:transparent;color:inherit;font:inherit;cursor:pointer}";document.head.append(style);
const start=()=>{
const grid=document.getElementById("toolGrid"),tools=window.ToolboxAddonTools,render=window.ToolboxAddonRender;
if(!grid||!tools||!render){setTimeout(start,0);return}
const key="toolbox-saved-v1";
grid.addEventListener("click",e=>{
const fav=e.target.closest("[data-extra-fav]");
if(fav){e.preventDefault();e.stopPropagation();let list=[];try{list=JSON.parse(localStorage.getItem(key)||"[]")}catch{}const id=fav.dataset.extraFav,next=list.includes(id)?list.filter(x=>x!==id):list.concat(id);try{localStorage.setItem(key,JSON.stringify(next))}catch{}render();grid.querySelectorAll("[data-extra-fav]").forEach(b=>b.textContent=next.includes(b.dataset.extraFav)?"♥":"♡");return}
const open=e.target.closest("[data-extra-open]");
if(open){e.preventDefault();const t=tools.find(x=>x.id===open.dataset.extraOpen);if(t)openExtraTool(t)}
});
new MutationObserver(render).observe(grid,{childList:true});
document.getElementById("toolSearch").addEventListener("input",render);
document.querySelectorAll("[data-filter],[data-category]").forEach(b=>b.addEventListener("click",()=>setTimeout(render,0)));
document.getElementById("sortToggle").addEventListener("click",()=>setTimeout(render,0));
render();
};
start();
