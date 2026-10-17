import {openExtraTool} from "./extra-tools-workspace.mjs";
const start=()=>{
const grid=document.getElementById("toolGrid"),tools=window.ToolboxAddonTools,render=window.ToolboxAddonRender;
if(!grid||!tools||!render){setTimeout(start,0);return}
const key="toolbox-saved-v1";
grid.addEventListener("click",e=>{
const fav=e.target.closest("[data-extra-fav]");
if(fav){e.preventDefault();e.stopPropagation();let list=[];try{list=JSON.parse(localStorage.getItem(key)||"[]")}catch{}const id=fav.dataset.extraFav,next=list.includes(id)?list.filter(x=>x!==id):list.concat(id);try{localStorage.setItem(key,JSON.stringify(next))}catch{}render();return}
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
