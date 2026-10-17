(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const HISTORY_KEY = "gpt-mobile-history-v1";
  const THEME_KEY = "gpt-mobile-theme-v1";
  const ui = {
    sidebar:$("sidebar"),scrim:$("scrim"),chatScroll:$("chatScroll"),welcome:$("welcome"),
    messages:$("messages"),typing:$("typingRow"),form:$("composerForm"),input:$("promptInput"),
    send:$("sendButton"),list:$("conversationList"),toast:$("toast")
  };
  let conversations = readHistory();
  let activeId = conversations[0]?.id || null;
  let toastTimer;
  let busy = false;

  function readHistory(){
    try {
      const data = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      return Array.isArray(data) ? data.filter(x => x && typeof x.id === "string" && Array.isArray(x.messages)).slice(0,40) : [];
    } catch { return []; }
  }
  function persist(){
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(conversations.slice(0,40))); }
    catch { showToast("Browser storage is full. Clear some conversations."); }
  }
  function makeId(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
  function active(){ return conversations.find(c => c.id === activeId) || null; }
  function showToast(message){
    ui.toast.textContent = message;
    ui.toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ui.toast.classList.remove("visible"), 2400);
  }
  function safeText(value){ return String(value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ""); }
  function makeMessage(role, content, demo = false){
    const article = document.createElement("article");
    article.className = "message " + role;
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = role === "assistant" ? "g" : "B";
    avatar.setAttribute("aria-hidden","true");
    const body = document.createElement("div");
    body.className = "message-content";
    if(role === "assistant"){
      const label = document.createElement("div");
      label.className = "message-label";
      label.textContent = "GPT";
      body.append(label);
    }
    const text = document.createElement("div");
    text.textContent = safeText(content);
    body.append(text);
    if(demo){
      const note = document.createElement("div");
      note.className = "demo-note";
      note.textContent = "Demo mode: this reply is generated locally by the interface. Connect a secure server-side AI endpoint to enable real model responses.";
      body.append(note);
    }
    article.append(avatar, body);
    return article;
  }
  function render(){
    ui.list.replaceChildren();
    conversations.slice().sort((a,b) => b.updatedAt - a.updatedAt).forEach(c => {
      const button = document.createElement("button");
      button.className = "conversation-item" + (c.id === activeId ? " active" : "");
      button.type = "button";
      const icon = document.createElement("span");
      icon.className = "history-icon";
      icon.textContent = "◌";
      const title = document.createElement("span");
      title.className = "history-title";
      title.textContent = c.title || "New conversation";
      button.append(icon,title);
      button.addEventListener("click", () => { activeId = c.id; render(); closeSidebar(); });
      ui.list.append(button);
    });
    ui.messages.replaceChildren();
    const conversation = active();
    if(conversation){
      ui.welcome.classList.add("hidden");
      conversation.messages.forEach(m => ui.messages.append(makeMessage(m.role,m.content,m.demo)));
    } else {
      ui.welcome.classList.remove("hidden");
    }
    requestAnimationFrame(() => { ui.chatScroll.scrollTop = ui.chatScroll.scrollHeight; });
  }
  function createConversation(){
    const c = {id:makeId(),title:"New conversation",updatedAt:Date.now(),messages:[]};
    conversations.unshift(c);
    activeId = c.id;
    persist();
    render();
    ui.input.focus();
  }
  function openSidebar(){ ui.sidebar.classList.add("open"); ui.scrim.classList.add("visible"); }
  function closeSidebar(){ ui.sidebar.classList.remove("open"); ui.scrim.classList.remove("visible"); }
  function resizeInput(){ ui.input.style.height = "auto"; ui.input.style.height = Math.min(ui.input.scrollHeight,160) + "px"; }
  function updateSend(){ ui.send.disabled = busy || !ui.input.value.trim(); }
  function makeDemoReply(prompt){
    const lower = prompt.toLowerCase();
    if(/\b(hi|hello|hey|salam|assalamu alaikum)\b/.test(lower)){
      return "Hello! What would you like to explore today? I can help explain a topic, brainstorm an idea, organise a plan, or improve a piece of writing.";
    }
    if(/simple|explain|understand|learn|what is/.test(lower)){
      return "Let’s make it easier to understand.\n\n1. Start with the main idea. Describe it in one sentence.\n2. Break it into smaller parts. Learn one part at a time.\n3. Find a familiar example. Connect the idea to something you already know.\n4. Explain it in your own words. If you can teach it simply, you are making progress.\n\nTell me the exact topic and your preferred level, and I can shape a clearer explanation. (This preview is a local demo, not an AI-generated answer.)";
    }
    if(/plan|schedule|routine|study/.test(lower)){
      return "A practical starting plan:\n\n• Choose one clear outcome.\n• Split it into tasks that take 15–30 minutes.\n• Start with the most important task while your attention is fresh.\n• Add short breaks and a realistic finish time.\n• Review what worked and adjust tomorrow.\n\nShare your goal and available time for a more useful plan. (This preview is a local demo, not an AI-generated answer.)";
    }
    if(/write|message|email|caption|rewrite/.test(lower)){
      return "I can help you shape the message. A useful structure is: state the purpose first, give the necessary context, then end with a clear request or next step.\n\nPaste your draft and tell me the audience and tone you want. (This preview is a local demo, not an AI-generated answer.)";
    }
    if(/idea|brainstorm|create|project|app/.test(lower)){
      return "Let’s turn the idea into something buildable:\n\n• Who is it for?\n• What one frustrating problem does it solve?\n• What is the smallest useful first version?\n• What would make the experience feel clear and enjoyable on a phone?\n• How will you know it works?\n\nDescribe the idea in a sentence and we can shape the first version. (This preview is a local demo, not an AI-generated answer.)";
    }
    return "I’ve saved your message in this browser. To answer it with a real AI model, connect a secure backend endpoint in app.js; never place a provider API key in frontend code.\n\nFor now, try one of the starter prompts or tell me whether you want help learning, planning, writing, or building something. (This is a local demo response.)";
  }
  async function sendMessage(raw){
    const content = safeText(raw.trim());
    if(!content || busy) return;
    if(!active()) createConversation();
    const c = active();
    c.messages.push({role:"user",content,at:Date.now()});
    if(c.messages.length === 1) c.title = content.length > 32 ? content.slice(0,32).trimEnd() + "…" : content;
    c.updatedAt = Date.now();
    persist();
    ui.input.value = "";
    resizeInput();
    busy = true;
    updateSend();
    render();
    ui.typing.classList.remove("hidden");
    requestAnimationFrame(() => { ui.chatScroll.scrollTop = ui.chatScroll.scrollHeight; });
    // A deterministic local preview keeps the empty app usable without credentials.
    // Replace this block with fetch('/api/chat', ...) once a secured backend is configured.
    await new Promise(resolve => setTimeout(resolve, 650));
    const reply = makeDemoReply(content);
    c.messages.push({role:"assistant",content:reply,demo:true,at:Date.now()});
    c.updatedAt = Date.now();
    busy = false;
    ui.typing.classList.add("hidden");
    persist();
    render();
    updateSend();
  }

  $("newChat").addEventListener("click", () => { createConversation(); closeSidebar(); });
  $("openSidebar").addEventListener("click",openSidebar);
  $("closeSidebar").addEventListener("click",closeSidebar);
  ui.scrim.addEventListener("click",closeSidebar);
  ui.form.addEventListener("submit",e => { e.preventDefault(); sendMessage(ui.input.value); });
  ui.input.addEventListener("input",() => { resizeInput(); updateSend(); });
  ui.input.addEventListener("keydown",e => {
    if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); if(!ui.send.disabled) ui.form.requestSubmit(); }
  });
  document.querySelectorAll(".suggestion").forEach(button => button.addEventListener("click",() => {
    ui.input.value = button.dataset.prompt || "";
    resizeInput(); updateSend(); ui.input.focus();
    if(window.matchMedia("(max-width:700px)").matches) ui.input.scrollIntoView({behavior:"smooth",block:"end"});
  }));
  $("themeToggle").addEventListener("click",() => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    $("themeIcon").textContent = next === "dark" ? "☀" : "☾";
    try { localStorage.setItem(THEME_KEY,next); } catch {}
  });
  $("shareButton").addEventListener("click",async () => {
    const c = active();
    if(!c || !c.messages.length){ showToast("Start a conversation before sharing."); return; }
    const transcript = c.messages.map(m => (m.role === "user" ? "You: " : "GPT demo: ") + m.content).join("\n\n");
    try {
      if(navigator.share) await navigator.share({title:c.title,text:transcript});
      else if(navigator.clipboard?.writeText){ await navigator.clipboard.writeText(transcript); showToast("Conversation copied."); }
      else showToast("Sharing is not available in this browser.");
    } catch(err) { if(err?.name !== "AbortError") showToast("Could not share this conversation."); }
  });
  $("attachButton").addEventListener("click",() => showToast("Attachments are not enabled in this demo."));
  $("clearHistory").addEventListener("click",() => {
    if(!conversations.length){ showToast("There is no history to clear."); return; }
    if(window.confirm("Clear all conversations saved in this browser?")){
      conversations = []; activeId = null; persist(); render(); showToast("Local conversation history cleared.");
    }
  });
  $("profileButton").addEventListener("click",() => showToast("Personal workspace — demo mode."));
  document.addEventListener("keydown",e => {
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k"){ e.preventDefault(); createConversation(); }
    if(e.key === "Escape") closeSidebar();
  });
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if(savedTheme === "dark" || savedTheme === "light"){
      document.documentElement.dataset.theme = savedTheme;
      $("themeIcon").textContent = savedTheme === "dark" ? "☀" : "☾";
    } else if(window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.dataset.theme = "dark"; $("themeIcon").textContent = "☀";
    }
  } catch {}
  render(); updateSend();
  if("serviceWorker" in navigator && location.protocol.startsWith("http")){
    window.addEventListener("load",() => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }
})();