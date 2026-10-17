(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const THEME_KEY = "nexus-theme-v1";
  const SAVED_KEY = "nexus-saved-v1";
  const IDEAS_KEY = "nexus-ideas-v1";
  const ui = {
    sidebar:$("sidebar"),scrim:$("scrim"),toast:$("toast"),search:$("searchInput"),
    createDialog:$("createDialog"),createForm:$("createForm"),ideaInput:$("ideaInput"),
    detailDialog:$("detailDialog"),detailTitle:$("detailTitle"),detailDescription:$("detailDescription"),
    detailTag:$("detailTag"),creationGrid:$("creationGrid"),emptyState:$("emptyState"),
    breadcrumb:$("breadcrumbCurrent")
  };
  const descriptions = {
    "The idea garden":"A playful space to collect tiny thoughts, connect unexpected ideas, and give the most interesting ones room to grow. Start with one seed of an idea, then explore what it could become.",
    "A tiny universe":"A small interactive reminder that the world is much bigger than today's to-do list. Follow the orbit, notice the details, and let one question lead to another.",
    "Shape playground":"A creative sandbox for mixing shapes, colors, and visual patterns. There are no scores and no wrong answers—just a chance to make something you didn't plan.",
    "The little things":"A collection of small observations that might become big ideas. Save a detail, ask a question, and see what connections appear.",
    "Orbit study planner":"A calmer way to map learning goals into small missions, focused sessions, and visible progress.",
    "A world of sound":"An imagined sound playground where rhythm, texture, and visual movement become one creative experiment."
  };
  let toastTimer;
  let saved = readArray(SAVED_KEY);
  let ideas = readArray(IDEAS_KEY);
  let currentView = "home";
  function readArray(key){try{const v=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(v)?v:[]}catch{return[]}}
  function saveArray(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{showToast("This browser cannot save more data right now.")}}
  function showToast(message){ui.toast.textContent=message;ui.toast.classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>ui.toast.classList.remove("visible"),2400)}
  function openCreate(prefill=""){ui.ideaInput.value=prefill;ui.createDialog.showModal();setTimeout(()=>ui.ideaInput.focus(),50)}
  function openDetail(title,tag="A LITTLE DISCOVERY"){
    ui.detailTitle.textContent=title;
    ui.detailDescription.textContent=descriptions[title]||"Every good project begins as a small experiment. Decide what you want to explore, make the smallest version that feels useful, and let curiosity guide the next step.";
    ui.detailTag.textContent=tag;
    ui.detailDialog.showModal();
  }
  function setView(view){
    currentView=view;
    document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
    const labels={home:"Overview",discover:"Discover",projects:"My creations",saved:"Saved ideas"};
    ui.breadcrumb.textContent=labels[view]||"Overview";
    const cards=[...document.querySelectorAll(".creation-card")];
    cards.forEach(card=>{
      const isSaved=saved.includes(card.dataset.title);
      const isIdea=ideas.includes(card.dataset.title);
      let show=true;
      if(view==="projects") show=isIdea;
      if(view==="saved") show=isSaved;
      card.classList.toggle("hidden",!show);
    });
    if(view==="discover"){ui.search.value="";cards.forEach(c=>c.classList.remove("hidden"))}
    updateEmpty();
    closeSidebar();
    if(view==="discover") $("discoverSection").scrollIntoView({behavior:"smooth",block:"start"});
    else $("pageScroll").scrollTo({top:0,behavior:"smooth"});
  }
  function updateEmpty(){
    const visible=[...document.querySelectorAll(".creation-card")].some(c=>!c.classList.contains("hidden"));
    ui.emptyState.classList.toggle("hidden",visible);
    ui.creationGrid.classList.toggle("hidden",!visible);
  }
  function filterCards(query){
    const q=query.trim().toLowerCase();
    document.querySelectorAll(".creation-card").forEach(card=>{
      const title=card.dataset.title.toLowerCase();
      const content=card.textContent.toLowerCase();
      const show=(!q||title.includes(q)||content.includes(q))&&(currentView!=="projects"||ideas.includes(card.dataset.title))&&(currentView!=="saved"||saved.includes(card.dataset.title));
      card.classList.toggle("hidden",!show);
    });
    updateEmpty();
    if(q) $("discoverSection").scrollIntoView({behavior:"smooth",block:"start"});
  }
  function updateSavedButtons(){
    document.querySelectorAll("[data-save]").forEach(button=>{
      const isSaved=saved.includes(button.dataset.save);
      button.classList.toggle("saved",isSaved);button.textContent=isSaved?"♥":"♡";button.setAttribute("aria-pressed",String(isSaved));
    });
  }
  function addIdea(title){
    const name=title.trim();
    if(!name)return;
    if(ideas.includes(name)){showToast("That idea is already in your creations.");ui.createDialog.close();return}
    ideas.unshift(name);saveArray(IDEAS_KEY,ideas);
    const card=document.createElement("article");
    card.className="creation-card user-creation";card.dataset.category="build";card.dataset.title=name;
    const visual=document.createElement("div");visual.className="creation-visual garden-visual";
    const art=document.createElement("span");art.className="garden-label";art.textContent="YOUR NEXT EXPERIMENT";visual.append(art);
    const meta=document.createElement("div");meta.className="creation-meta";
    const tag=document.createElement("span");tag.className="category-tag tag-green";tag.textContent="YOUR CREATION";
    const time=document.createElement("span");time.className="creation-time";time.textContent="JUST NOW";meta.append(tag,time);
    const heading=document.createElement("h3");heading.textContent=name;
    const p=document.createElement("p");p.textContent="A new idea, ready to take its first step.";
    const open=document.createElement("button");open.className="open-creation";open.dataset.open=name;open.innerHTML='<span>Explore your idea</span><span>↗</span>';
    const save=document.createElement("button");save.className="save-button";save.dataset.save=name;save.setAttribute("aria-label","Save "+name);save.textContent="♡";
    card.append(save,visual,meta,heading,p,open);ui.creationGrid.prepend(card);
    ui.createDialog.close();setView("projects");updateSavedButtons();showToast("Your idea has a place in the universe.");
  }
  function openSidebar(){ui.sidebar.classList.add("open");ui.scrim.classList.add("visible")}
  function closeSidebar(){ui.sidebar.classList.remove("open");ui.scrim.classList.remove("visible")}
  document.querySelectorAll(".nav-item").forEach(button=>button.addEventListener("click",()=>setView(button.dataset.view)));
  $("createButton").addEventListener("click",()=>openCreate());
  $("topCreate").addEventListener("click",()=>openCreate());
  $("heroCreate").addEventListener("click",()=>openCreate());
  $("emptyCreate").addEventListener("click",()=>openCreate());
  $("createForm").addEventListener("submit",e=>{e.preventDefault();addIdea(ui.ideaInput.value)});
  $("dialogClose").addEventListener("click",()=>ui.createDialog.close());
  $("detailClose").addEventListener("click",()=>ui.detailDialog.close());
  $("detailAction").addEventListener("click",()=>{const title=ui.detailTitle.textContent;ui.detailDialog.close();openCreate("A new version of "+title.toLowerCase())});
  $("openSidebar").addEventListener("click",openSidebar);
  ui.scrim.addEventListener("click",closeSidebar);
  $("profileButton").addEventListener("click",()=>showToast("Your personal workspace is ready for new ideas."));
  $("themeToggle").addEventListener("click",()=>{
    const next=document.documentElement.dataset.theme==="dark"?"light":"dark";
    document.documentElement.dataset.theme=next;
    try{localStorage.setItem(THEME_KEY,next)}catch{}
    $("themeToggle").textContent=next==="dark"?"☼":"◐";
  });
  $("searchInput").addEventListener("input",e=>filterCards(e.target.value));
  $("searchInput").addEventListener("keydown",e=>{if(e.key==="Escape"){e.target.value="";filterCards("");e.target.blur()}});
  $("viewAll").addEventListener("click",()=>setView("discover"));
  document.querySelectorAll(".direction-card").forEach(button=>button.addEventListener("click",()=>{
    const kind=button.dataset.kind;
    const presets={build:"An app that makes an everyday task feel delightful",explore:"A question I've always wanted to explore",play:"A tiny experiment with no rules"};
    openCreate(presets[kind]||"");
  }));
  document.addEventListener("click",e=>{
    const saveButton=e.target.closest("[data-save]");
    if(saveButton){
      const title=saveButton.dataset.save;
      saved=saved.includes(title)?saved.filter(x=>x!==title):[title,...saved];
      saveArray(SAVED_KEY,saved);updateSavedButtons();
      showToast(saved.includes(title)?"Saved to your ideas.":"Removed from saved ideas.");
      if(currentView==="saved")setView("saved");
      return;
    }
    const openButton=e.target.closest("[data-open]");
    if(openButton){openDetail(openButton.dataset.open);return}
  });
  document.querySelectorAll(".recent-item").forEach(button=>button.addEventListener("click",()=>openDetail(button.dataset.open,"RECENTLY OPENED")));
  $("emptyState").querySelector("button").addEventListener("click",()=>openCreate());
  document.addEventListener("keydown",e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openCreate()}
    if((e.metaKey||e.ctrlKey)&&e.key==="/"){e.preventDefault();ui.search.focus()}
    if(e.key==="Escape")closeSidebar();
  });
  try{const theme=localStorage.getItem(THEME_KEY);if(theme==="dark"||theme==="light")document.documentElement.dataset.theme=theme;if(theme==="dark")$("themeToggle").textContent="☼"}catch{}
  // Restore creations saved locally. User-entered content is always inserted as text, never HTML.
  ideas.slice(0,12).forEach(name=>{
    if(document.querySelector('[data-title="'+CSS.escape(name)+'"]'))return;
    const card=document.createElement("article");card.className="creation-card user-creation";card.dataset.category="build";card.dataset.title=name;
    const visual=document.createElement("div");visual.className="creation-visual garden-visual";const label=document.createElement("span");label.className="garden-label";label.textContent="YOUR NEXT EXPERIMENT";visual.append(label);
    const meta=document.createElement("div");meta.className="creation-meta";const tag=document.createElement("span");tag.className="category-tag tag-green";tag.textContent="YOUR CREATION";meta.append(tag);
    const heading=document.createElement("h3");heading.textContent=name;const p=document.createElement("p");p.textContent="A new idea, ready to take its first step.";
    const open=document.createElement("button");open.className="open-creation";open.dataset.open=name;open.innerHTML="<span>Explore your idea</span><span>↗</span>";
    const save=document.createElement("button");save.className="save-button";save.dataset.save=name;save.setAttribute("aria-label","Save "+name);save.textContent="♡";card.append(save,visual,meta,heading,p,open);ui.creationGrid.append(card);
  });
  updateSavedButtons();updateEmpty();
  if("serviceWorker" in navigator&&location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();