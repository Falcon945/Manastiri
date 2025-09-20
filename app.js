// app.js
const $ = s => document.querySelector(s);
const app = $("#app");

/* ============ Tema (umesto PHP $theme) ============ */
function setTheme(theme = "green") {
  const allowed = ["green", "gold", "bordo"];
  document.body.dataset.theme = allowed.includes(theme) ? theme : "green";
}

/* ============ Header/Footer partials ============ */
async function loadPartials() {
  const [hdr, ftr] = await Promise.all([
    fetch("inc/header.html").then(r => { if(!r.ok) throw new Error("inc/header.html "+r.status); return r.text(); }),
    fetch("inc/footer.html").then(r => { if(!r.ok) throw new Error("inc/footer.html "+r.status); return r.text(); }),
  ]);
  $("#site-header").innerHTML = hdr;
  $("#site-footer").innerHTML = ftr;
}

/* ============ Routing ============ */
const routes = {
  "": "pages/home.html",
  "manastiri": "pages/manastiri.html",
  "izvori": "pages/izvori.html",
};
function parseHash(){ return location.hash.replace(/^#\//,"").split("/").filter(Boolean); }

/* Učitaj stranicu u #app i izvrši <script> tagove (radi i za type="module") */
async function loadPage(path){
  const r = await fetch(path);
  if(!r.ok) throw new Error(path+" "+r.status);
  app.innerHTML = await r.text();

  const scripts = app.querySelectorAll("script");
  for (const old of scripts) {
    const s = document.createElement("script");
    if (old.type) s.type = old.type;
    if (old.src) s.src = old.src; else s.textContent = old.textContent;
    for (const {name, value} of [...old.attributes]) {
      if (name !== "src" && name !== "type") s.setAttribute(name, value);
    }
    old.replaceWith(s);
  }
}

/* ============ Detalj manastira (#/manastir/<slug>) ============ */
async function renderManastirDetail(slug){
  setTheme("gold");

  const res = await fetch("data/manastiri.json?_=" + Date.now());
  if (!res.ok) throw new Error("data/manastiri.json "+res.status);
  const data = await res.json();

  const m = (data||[]).find(x => (x.slug||"").toLowerCase() === slug.toLowerCase());
  if(!m){
    app.innerHTML = `
      <h1 class="text-2xl font-bold accent-text mb-4">Manastir nije pronađen</h1>
      <p class="text-gray-600 mb-4">Traženi zapis ne postoji ili je uklonjen.</p>
      <p><a class="accent-text hover:underline" href="#/manastiri">← Nazad na listu</a></p>`;
    return;
  }

  const hero = (m.hero && m.hero.trim() !== "") ? m.hero : "pictures/hero-fallback.jpg";

  app.innerHTML = `
    <article class="max-w-4xl mx-auto">
      <img src="${hero}" alt="${m.naziv||''}" class="w-full h-56 md:h-72 object-cover rounded-xl shadow mb-6">
      <h1 class="text-3xl font-bold accent-text mb-2">${m.naziv||''}</h1>
      <p class="text-gray-500 mb-6">
        ${m.mesto||''}${m.region?` • <span class="text-gray-400">${m.region}</span>`:''}
      </p>
      <div class="bg-white rounded-xl shadow p-6 leading-relaxed">
        ${(m.sadrzaj || m.opis || '').replaceAll('<','&lt;')}
      </div>
      <p class="mt-8">
        <a class="accent-text hover:underline" href="#/manastiri">← Nazad na listu</a>
      </p>
    </article>`;
}

/* ============ Lista manastira (inicijalizacija strane) ============ */
async function initManastiriPage(){
  // tema
  setTheme("gold");

  // elementi koje očekujemo na strani
  const q           = $("#q");
  const resetBtn    = $("#resetBtn");
  const list        = $("#list");
  const counter     = $("#counter");
  const pagerTop    = $("#pagerTop");
  const pagerBottom = $("#pagerBottom");
  const perPage     = 10;

  if (!q || !list || !counter) {
    console.warn("[manastiri] Nisu pronađeni potrebni elementi u DOM-u.");
    return;
  }

  let all = [], filtered = [], page = 1;

  const showError = (msg) => {
    list.innerHTML = `<div class="bg-red-50 text-red-800 border border-red-200 rounded p-4">⚠ ${msg}</div>`;
    counter.textContent = "";
    if (pagerTop) pagerTop.innerHTML = "";
    if (pagerBottom) pagerBottom.innerHTML = "";
  };

  // Učitaj JSON sa “cache-bust” parametrom
  try {
    const r = await fetch("data/manastiri.json?_=" + Date.now());
    if (!r.ok) throw new Error(`HTTP ${r.status} pri čitanju data/manastiri.json`);
    const data = await r.json();
    if (!Array.isArray(data)) throw new Error("JSON je učitan, ali nije niz (Array).");
    all = data;
  } catch (e) {
    console.error(e);
    showError(
      e.message.includes("JSON")
        ? "Greška u formatu manastiri.json (proveri zareze i navodnike)."
        : "Ne mogu da učitam data/manastiri.json (putanja/server)."
    );
    return;
  }

  function apply() {
    const needle = (q.value||"").trim().toLowerCase();
    filtered = all.filter(m => {
      const hay = `${m.naziv||""} ${m.mesto||""} ${m.region||""}`.toLowerCase();
      return !needle || hay.includes(needle);
    });
    resetBtn?.classList.toggle("hidden", needle === "");
    page = 1;
    render();
  }

  function render() {
    const total  = filtered.length;
    const pages  = Math.max(1, Math.ceil(total / perPage));
    const offset = (page - 1) * perPage;
    const items  = filtered.slice(offset, offset + perPage);

    counter.textContent =
      `Prikazano ${total ? offset+1 : 0}–${Math.min(offset+items.length,total)} od ${total} manastira` +
      (q.value ? ` za upit „${q.value}”` : "");

    list.innerHTML = items.map((m, i) => {
      const hasSlug = (m.slug||"").trim() !== "";
      return `
      <div class="bg-white rounded-xl shadow p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="${m.ikon||'https://via.placeholder.com/48'}" alt="${m.naziv||''}"
                 class="w-12 h-12 rounded object-cover">
            <div>
              <div class="font-semibold text-lg">${m.naziv||''}</div>
              <div class="text-sm text-gray-500">
                ${m.mesto||''}${m.region?` • <span class="text-gray-400">${m.region}</span>`:''}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            ${hasSlug ? `
              <a href="#/manastir/${m.slug}"
                 class="inline-flex items-center px-3 py-1.5 rounded-md border accent-border text-[13px] font-medium
                        accent-text hover:accent-bg hover:text-white transition">
                Detaljnije
              </a>` : ``}
            <button class="accent-text font-semibold hover:underline hover:opacity-80 transition-opacity"
                    data-toggle="desc-${offset + i}">
              VIŠE —
            </button>
          </div>
        </div>
        <div id="desc-${offset + i}" class="mt-3 hidden">
          <p class="text-gray-700 leading-relaxed">${m.opis||''}</p>
          <div class="mt-2">
            <a class="text-gray-500 hover:underline text-sm" href="#/izvori">Svi izvori →</a>
          </div>
        </div>
      </div>`;
    }).join("");

    const makePager = (el) => {
      if (!el) return;
      el.innerHTML = "";
      for (let p=1; p<=pages; p++) {
        const a = document.createElement("a");
        a.href = "javascript:void(0)";
        a.className = `px-3 py-1 rounded border ${p===page?'accent-bg text-white':'hover:underline'}`;
        a.textContent = p;
        a.onclick = () => { page = p; render(); };
        el.appendChild(a);
      }
    };
    makePager(pagerTop);
    makePager(pagerBottom);

    // toggle opisa
    list.querySelectorAll("[data-toggle]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-toggle");
        const box = document.getElementById(id);
        if (!box) return;
        box.classList.toggle("hidden");
        btn.textContent = box.classList.contains("hidden") ? "VIŠE —" : "MANJE —";
      });
    });
  }

  q?.addEventListener("input", apply);
  resetBtn?.addEventListener("click", () => { q.value = ""; apply(); });

  apply();
}

/* ============ Router ============ */
async function route(){
  try{
    const parts = parseHash(); // npr ["manastir","studenica"]

    // detaljna strana
    if (parts[0] === "manastir" && parts[1]) {
      await renderManastirDetail(parts[1]);
      return;
    }

    // tema po ruti
    if (parts[0] === "manastiri") setTheme("gold");
    else if (parts[0] === "izvori") setTheme("bordo");
    else setTheme("green");

    // učitaj HTML
    await loadPage(routes[parts[0] || ""]);

    // pokreni inicijalizaciju specifične strane
    if ((parts[0] || "") === "manastiri") {
      await initManastiriPage();
    }
  }catch(e){
    console.error(e);
    app.innerHTML = `<pre style="background:#300;color:#fff;padding:12px">Greška: ${e?.message || e}</pre>`;
  }
}

window.addEventListener("hashchange", route);

/* ============ Init ============ */
(async function(){
  await loadPartials();
  await route();
})();
