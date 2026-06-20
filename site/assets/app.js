/* ============================================================
   Android Interview Prep — shared app logic
   Навигация, mind-map, поиск, прогресс (localStorage), TOC, тема
   ============================================================ */

const GROUPS = {
  reference:   { title: "Справочник инженера",    color: "#9aa7b4" },
  foundations: { title: "Язык и проектирование", color: "#3ddc84" },
  platform:    { title: "Платформа Android",      color: "#58a6ff" },
  core:        { title: "Конкурентность и алгоритмы", color: "#f0a020" },
  ui:          { title: "UI / Compose",            color: "#d2a8ff" },
  data:        { title: "Данные и сеть",           color: "#2dd4bf" },
  quality:     { title: "Безопасность и качество", color: "#f85149" },
  design:      { title: "Дизайн и софт-скиллы",    color: "#ec6cb9" },
};

const TOPICS = [
  { id:"terminology",   n:"00", file:"00-terminology.html",      icon:"📖", group:"reference", title:"Терминология инженера",
    short:"Мини-словарь слов, которые часто звучат на собесе: контракт, инвариант, coupling/cohesion, идемпотентность, race condition и др. — с формулировками «как сказать на интервью».", subs:["Контракт","Coupling","Идемпотентность"] },
  { id:"oop-solid",     n:"01", file:"01-oop-solid.html",        icon:"🧱", group:"foundations", title:"ООП и SOLID",
    short:"ООП (объектно-ориентированное программирование), SOLID (пять принципов проектирования) и GoF-паттерны («Банда четырёх») в Android.", subs:["SOLID","Паттерны","Композиция"] },
  { id:"kotlin",        n:"02", file:"02-kotlin.html",           icon:"🟣", group:"foundations", title:"Язык Kotlin",
    short:"Null-safety (безопасность от null), sealed/data-классы (закрытые и дата-классы), дженерики, делегаты и inline (встраивание).", subs:["Null-safety","Дженерики","Делегаты"] },
  { id:"components",    n:"03", file:"03-android-components.html",icon:"📱", group:"platform", title:"Android-компоненты + IPC",
    short:"Activity (экран), Service (служба), BroadcastReceiver (приёмник событий), ContentProvider (поставщик данных), Binder и AIDL (Android Interface Definition Language, язык описания интерфейса Android) для IPC (межпроцессного взаимодействия).", subs:["Lifecycle","Service","Binder/AIDL"] },
  { id:"algorithms",    n:"04", file:"04-algorithms.html",       icon:"🧮", group:"core", title:"Алгоритмы и структуры",
    short:"ArrayList (динамический массив), HashMap (хэш-таблица), concurrent-коллекции (потокобезопасные), Big-O (асимптотическая сложность) и задачи.", subs:["HashMap","Concurrent","Big-O"] },
  { id:"concurrency",   n:"05", file:"05-concurrency.html",      icon:"🧵", group:"core", title:"Многопоточность",
    short:"Threads (потоки), CAS (compare-and-swap, «сравнить и заменить»), корутины, structured concurrency (структурированная конкурентность) и delay (задержка).", subs:["CAS","Корутины","Flow"] },
  { id:"compose",       n:"06", file:"06-compose.html",          icon:"🎨", group:"ui", title:"Jetpack Compose",
    short:"remember (запоминание состояния), slot table (таблица слотов), рекомпозиция, side effects (побочные эффекты) и stable (стабильность).", subs:["Slot-table","Recompose","SubcomposeLayout"] },
  { id:"architecture",  n:"07", file:"07-architecture-di.html",  icon:"🏛️", group:"foundations", title:"Архитектура и DI",
    short:"MVVM/MVI (Model-View-ViewModel и Model-View-Intent — паттерны представления), Clean Architecture (чистая архитектура), multi-module (многомодульность), Hilt/Dagger для DI (dependency injection, внедрения зависимостей) и Navigation (навигация).", subs:["MVVM/MVI","Clean","Hilt"] },
  { id:"storage",       n:"08", file:"08-data-storage.html",     icon:"💾", group:"data", title:"Хранение данных",
    short:"DataStore (хранилище ключ-значение), encrypted storage (зашифрованное хранилище), Room/SQLite (локальная база данных) и Keystore (хранилище ключей).", subs:["DataStore","Room","Encrypted"] },
  { id:"network",       n:"09", file:"09-network.html",          icon:"🌐", group:"data", title:"Сеть",
    short:"HTTP (протокол передачи гипертекста), TLS/HTTPS (Transport Layer Security и защищённый HTTP — шифрованное соединение), OkHttp, Retrofit и обработка ошибок.", subs:["TLS/HTTPS","OkHttp","Pinning"] },
  { id:"security",      n:"10", file:"10-security.html",         icon:"🔐", group:"quality", title:"Безопасность",
    short:"Шифрование, Keystore (хранилище ключей), биометрия, Frida (инструмент динамического анализа) и защита приложения.", subs:["Keystore","Биометрия","Frida"] },
  { id:"profiling",     n:"11", file:"11-profiling.html",        icon:"⚡", group:"quality", title:"Профилирование",
    short:"Profiler (профилировщик), LeakCanary (поиск утечек), Baseline Profiles (профили базовой оптимизации), cold start (холодный старт) и R8 (оптимизатор).", subs:["Утечки","Startup","R8"] },
  { id:"testing",       n:"12", file:"12-testing.html",          icon:"🧪", group:"quality", title:"Тестирование",
    short:"JUnit (фреймворк тестирования), MockK (моки), тесты корутин, Espresso и Compose UI-тесты (проверка пользовательского интерфейса).", subs:["MockK","runTest","Espresso"] },
  { id:"system-design", n:"13", file:"13-system-design.html",    icon:"🗺️", group:"design", title:"Системный дизайн",
    short:"Фреймворк ответа, offline-first (сначала локальные данные), синхронизация и кейсы: лента, чат.", subs:["Offline-first","Кэш","Sync"] },
  { id:"behavioral",    n:"14", file:"14-behavioral.html",       icon:"💬", group:"design", title:"Поведенческое интервью",
    short:"STAR (Situation, Task, Action, Result — ситуация, задача, действие, результат), истории, процесс найма и вопросы компании.", subs:["STAR","Истории","Процесс"] },
];

const LS_KEY = "aip-progress-v1";
const THEME_KEY = "aip-theme";
const THEME_MEDIA = "(prefers-color-scheme: dark)";
let watchingSystemTheme = false;

/* ---------- progress ---------- */
function getProgress(){ try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch(e){ return {}; } }
function isDone(id){ return !!getProgress()[id]; }
function setDone(id, val){
  const p = getProgress();
  if (val) p[id] = 1; else delete p[id];
  try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch(e){}
}
function progressCount(){ return Object.keys(getProgress()).length; }

/* ---------- theme ---------- */
function getStoredTheme(){
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "dark" || t === "light" ? t : null;
  } catch(e){
    return null;
  }
}
function systemTheme(){
  return window.matchMedia && window.matchMedia(THEME_MEDIA).matches ? "dark" : "light";
}
function preferredTheme(){ return getStoredTheme() || systemTheme(); }
function currentTheme(){ return document.documentElement.getAttribute("data-theme") || preferredTheme(); }
function applyTheme(t){
  document.documentElement.setAttribute("data-theme", t);
  document.querySelectorAll(".theme-ic").forEach(el => el.textContent = t === "dark" ? "🌙" : "☀️");
}
function applyStoredTheme(){
  applyTheme(preferredTheme());
}
function syncSystemTheme(){
  if (!getStoredTheme()) applyTheme(systemTheme());
}
function watchSystemTheme(){
  if (watchingSystemTheme || !window.matchMedia) return;
  const media = window.matchMedia(THEME_MEDIA);
  if (media.addEventListener) media.addEventListener("change", syncSystemTheme);
  else media.addListener(syncSystemTheme);
  watchingSystemTheme = true;
}
function toggleTheme(){
  const next = currentTheme() === "dark" ? "light" : "dark";
  try { localStorage.setItem(THEME_KEY, next); } catch(e){}
  applyTheme(next);
}

/* ---------- helpers ---------- */
function rel(path){
  // на index файлы в pages/, на странице темы — рядом
  const onPage = location.pathname.replace(/\\/g,"/").includes("/pages/");
  if (path === "index") return onPage ? "../index.html" : "index.html";
  if (path === "plan")  return onPage ? "../../ПЛАН_ПОДГОТОВКИ.md" : "../ПЛАН_ПОДГОТОВКИ.md";
  return onPage ? path : ("pages/" + path); // path = file inside pages/
}
function esc(s){ return (s||"").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }

/* ---------- topbar ---------- */
function buildTopbar(){
  const done = progressCount(), total = TOPICS.length;
  const bar = document.createElement("header");
  bar.className = "topbar";
  bar.innerHTML = `
    <button class="icon-btn menu-toggle" aria-label="Меню" onclick="document.body.classList.toggle('nav-open')">☰</button>
    <a class="brand" href="${rel('index')}">
      <span class="logo">A</span>
      <span>Android-собес<small>подготовка · Middle+ / Senior</small></span>
    </a>
    <div class="search">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input id="search" type="search" placeholder="Поиск по темам…" autocomplete="off">
    </div>
    <div class="spacer"></div>
    <button class="icon-btn" aria-label="Тема" onclick="toggleTheme()"><span class="theme-ic">${currentTheme()==='dark'?'🌙':'☀️'}</span></button>
  `;
  document.body.prepend(bar);
  const s = bar.querySelector("#search");
  s.addEventListener("input", () => doSearch(s.value.trim().toLowerCase()));
}

function doSearch(q){
  const grid = document.querySelector(".topic-grid");
  if (grid){
    grid.querySelectorAll(".topic-card").forEach(c => {
      c.style.display = !q || c.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  }
  document.querySelectorAll("#sidebar .nav-link").forEach(l => {
    const hit = !q || l.dataset.search.includes(q);
    l.style.display = hit ? "" : "none";
  });
  document.querySelectorAll("#sidebar .nav-group-title").forEach(t => {
    let n = t.nextElementSibling, any = false;
    while (n && n.classList.contains("nav-link")){ if (n.style.display !== "none") any = true; n = n.nextElementSibling; }
    t.style.display = any ? "" : "none";
  });
}

/* ---------- sidebar ---------- */
function buildSidebar(activeId){
  const aside = document.getElementById("sidebar");
  if (!aside) return;
  const done = progressCount(), total = TOPICS.length;
  const pct = Math.round(done/total*100);
  let html = `
    <div class="nav-progress">
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="lbl"><span>Прогресс</span><span>${done}/${total}</span></div>
    </div>`;
  let lastGroup = null;
  TOPICS.forEach(t => {
    if (t.group !== lastGroup){
      html += `<div class="nav-group-title">${GROUPS[t.group].title}</div>`;
      lastGroup = t.group;
    }
    const active = t.id === activeId ? " active" : "";
    const doneCls = isDone(t.id) ? " done" : "";
    html += `<a class="nav-link${active}${doneCls}" data-id="${t.id}" data-search="${esc((t.title+' '+t.short+' '+t.subs.join(' ')).toLowerCase())}" href="${rel(t.file)}">
      <span class="ni"><span>${t.icon}</span></span><span>${esc(t.title)}</span></a>`;
  });
  aside.innerHTML = html;
}

/* ---------- TOC + scrollspy ---------- */
function buildTOC(){
  const toc = document.getElementById("toc");
  const content = document.getElementById("content");
  if (!toc || !content) return;
  const heads = [...content.querySelectorAll(".section > h2, .section > h3")];
  if (!heads.length){ toc.style.display = "none"; return; }
  let html = `<div class="toc-title">На странице</div>`;
  heads.forEach((h, i) => {
    if (!h.id) h.id = "h-" + i;
    const lvl = h.tagName === "H3" ? " h3" : "";
    html += `<a class="${lvl.trim()}" href="#${h.id}">${esc(h.textContent)}</a>`;
  });
  toc.innerHTML = html;
  const links = [...toc.querySelectorAll("a")];
  const map = new Map(heads.map((h,i)=>[h.id, links[i]]));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting){
        links.forEach(l=>l.classList.remove("active"));
        const a = map.get(en.target.id); if (a) a.classList.add("active");
      }
    });
  }, { rootMargin: "-80px 0px -70% 0px", threshold: 0 });
  heads.forEach(h => obs.observe(h));
}

/* ---------- prev/next + mark done ---------- */
function buildPageFooter(activeId){
  const page = document.querySelector(".page");
  if (!page) return;
  const idx = TOPICS.findIndex(t => t.id === activeId);
  if (idx < 0) return;
  const t = TOPICS[idx], prev = TOPICS[idx-1], next = TOPICS[idx+1];

  const btn = document.createElement("button");
  const on = isDone(activeId);
  btn.className = "mark-done" + (on ? " on" : "");
  btn.innerHTML = `<span class="box"></span><span>${on ? "Тема пройдена" : "Отметить тему пройденной"}</span>`;
  btn.onclick = () => {
    const now = !btn.classList.contains("on");
    setDone(activeId, now);
    btn.classList.toggle("on", now);
    btn.querySelector("span:last-child").textContent = now ? "Тема пройдена" : "Отметить тему пройденной";
    buildSidebar(activeId);
  };
  page.appendChild(btn);

  const foot = document.createElement("footer");
  foot.className = "page-foot";
  foot.innerHTML =
    (prev ? `<a href="${rel(prev.file)}"><span>← Назад</span><b>${esc(prev.title)}</b></a>` : `<a href="${rel('index')}"><span>←</span><b>На главную</b></a>`) +
    (next ? `<a class="next" href="${rel(next.file)}"><span>Далее →</span><b>${esc(next.title)}</b></a>` : `<a class="next" href="${rel('index')}"><span>→</span><b>К списку тем</b></a>`);
  page.appendChild(foot);
}

/* ---------- breadcrumb ---------- */
function buildBreadcrumb(activeId){
  const el = document.querySelector(".breadcrumb");
  if (!el) return;
  const t = TOPICS.find(x => x.id === activeId);
  el.innerHTML = `<a href="${rel('index')}">Главная</a> <span>›</span> <span>${GROUPS[t.group].title}</span> <span>›</span> <span style="color:var(--text-dim)">${esc(t.title)}</span>`;
}

/* ---------- mind map (index) ---------- */
function buildMindmap(){
  const host = document.getElementById("mindmap");
  if (!host) return;
  const W = 1180, H = 760, cx = W/2, cy = H/2;
  const rx = 452, ry = 286;
  const n = TOPICS.length;
  let nodes = "", links = "";
  TOPICS.forEach((t, i) => {
    const ang = (-90 + i*(360/n)) * Math.PI/180;
    const x = cx + rx*Math.cos(ang);
    const y = cy + ry*Math.sin(ang);
    const color = GROUPS[t.group].color;
    const cw = 168, ch = 50;
    // edge from center toward node
    const ex = cx + 92*Math.cos(ang), ey = cy + 60*Math.sin(ang);
    links += `<path d="M${ex},${ey} Q${(ex+x)/2},${(ey+y)/2} ${x},${y}" stroke="${color}" stroke-opacity=".34" stroke-width="2" fill="none"/>`;
    const rxp = x - cw/2, ryp = y - ch/2;
    nodes += `
      <a href="${rel(t.file)}" class="mm-node">
        <title>${esc(t.title)} — ${esc(t.subs.join(', '))}</title>
        <g class="mm-chip">
          <rect x="${rxp}" y="${ryp}" width="${cw}" height="${ch}" rx="13"
                fill="${color}" fill-opacity=".15" stroke="${color}" stroke-opacity=".7" stroke-width="1.5"/>
          <circle cx="${rxp+20}" cy="${y}" r="11" fill="${color}" fill-opacity=".9"/>
          <text x="${rxp+20}" y="${y+4}" text-anchor="middle" font-size="12" font-weight="800" fill="#04140a">${t.n}</text>
          <text class="mm-label" x="${rxp+38}" y="${y-2}" font-size="13">${esc(clip(t.title,18))}</text>
          <text class="mm-sub" x="${rxp+38}" y="${y+13}" font-size="10.5">${esc(clip(t.subs.join(' · '),26))}</text>
        </g>
      </a>`;
  });
  const centerR = 74;
  const svg = `
  <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mind-map тем подготовки">
    <defs>
      <radialGradient id="mmCore" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#5bf0a0"/><stop offset="100%" stop-color="#27b56a"/>
      </radialGradient>
    </defs>
    ${links}
    ${nodes}
    <circle cx="${cx}" cy="${cy}" r="${centerR}" fill="url(#mmCore)" stroke="#3ddc84" stroke-width="2"/>
    <text class="mm-center" x="${cx}" y="${cy-6}" text-anchor="middle" font-size="17">Android</text>
    <text class="mm-center" x="${cx}" y="${cy+14}" text-anchor="middle" font-size="14">собес</text>
    <text x="${cx}" y="${cy+34}" text-anchor="middle" font-size="11" fill="#04140a" opacity=".75">${TOPICS.length} разделов</text>
  </svg>`;
  host.innerHTML = svg;

  // legend
  const legend = document.getElementById("mm-legend");
  if (legend){
    legend.innerHTML = Object.values(GROUPS).map(g =>
      `<span><i style="background:${g.color}"></i>${g.title}</span>`).join("");
  }
}
function clip(s, n){ return s.length > n ? s.slice(0, n-1) + "…" : s; }

/* ---------- index topic grid + restore states ---------- */
function buildTopicGrid(){
  const grid = document.getElementById("topic-grid");
  if (!grid) return;
  grid.innerHTML = TOPICS.map(t => {
    const c = GROUPS[t.group].color;
    const done = isDone(t.id) ? " done" : "";
    const tags = t.subs.map(s => `<span class="tag">${esc(s)}</span>`).join("");
    return `<a class="topic-card${done}" data-id="${t.id}" style="--c:${c}" href="${rel(t.file)}">
      <div class="tc-top">
        <span class="tc-ic">${t.icon}</span>
        <div><div class="tc-n">${t.n === "00" ? "" : "ТЕМА " + t.n + " · "}${esc(GROUPS[t.group].title)}</div><h3>${esc(t.title)}</h3></div>
      </div>
      <p>${esc(t.short)}</p>
      <div class="tc-foot"><div class="tc-tags">${tags}</div><span class="tc-done">✓ пройдено</span></div>
    </a>`;
  }).join("");
}
function decorateIndex(){
  buildTopicGrid();
  const done = progressCount(), total = TOPICS.length;
  const el = document.getElementById("stat-progress");
  if (el) el.textContent = done + "/" + total;
}

/* ---------- syntax + diagrams ---------- */
function highlightCode(){
  if (window.hljs){
    document.querySelectorAll("pre code").forEach(b => { try { hljs.highlightElement(b); } catch(e){} });
  }
}
function renderMermaid(){
  if (window.mermaid){
    try {
      mermaid.initialize({ startOnLoad:false, securityLevel:"loose",
        theme: currentTheme()==="dark" ? "dark" : "default",
        themeVariables: { fontFamily: "Inter, sans-serif" } });
      const render = mermaid.run({ querySelector: ".mermaid" });
      if (render && typeof render.catch === "function") render.catch(() => {});
    } catch(e){}
  }
}

/* ---------- init ---------- */
function init(){
  applyStoredTheme();
  watchSystemTheme();
  buildTopbar();
  const page = document.body.dataset.page;
  if (page && page !== "home"){
    buildSidebar(page);
    buildBreadcrumb(page);
    buildTOC();
    buildPageFooter(page);
  } else {
    buildMindmap();
    decorateIndex();
  }
  highlightCode();
  renderMermaid();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
