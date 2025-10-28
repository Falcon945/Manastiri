// app.js
const $ = s => document.querySelector(s);
const app = $("#app");

/* ===========================================================
   GLOBAL FUNKCIJE - JEZIK / TEMA (shared desktop + mobile)
   =========================================================== */

// helper: vrati <select> koji Google ubaci
function getTranslateSelect() {
  return document.querySelector('#google_translate_element select');
}

// menjaj jezik (langCode = 'en', 'ru' ... / 'sr' = vrati original)
function setLanguage(langCode) {
  const select = getTranslateSelect();

  if (!select) {
    // Google ubacuje <select> asinhrono -> probaj opet posle 200ms
    setTimeout(() => setLanguage(langCode), 200);
    return;
  }

  // povratak na srpski = reset prevoda
  if (langCode === 'sr') {
    // počisti google translate kolačiće
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    // full reload da vrati originalni tekst
    location.reload();
    return;
  }

  // postavi izabrani jezik i triggeruj promenu
  select.value = langCode;
  select.dispatchEvent(new Event("change"));
}

// tema/paleta (custom | light | dark)
const PALETTE_KEY = "manastiri-palette";
function applyPalette(paletteName) {
  const valid = ["custom", "light", "dark"];
  const finalPalette = valid.includes(paletteName) ? paletteName : "custom";

  const root = document.documentElement; // <html>

  // set na <html data-palette="...">
  root.setAttribute("data-palette", finalPalette);
  // zapamti izbor
  localStorage.setItem(PALETTE_KEY, finalPalette);

  // update label desktop
  const labelDesktop = document.getElementById("currentThemeLabel");
  if (labelDesktop) {
    labelDesktop.textContent = finalPalette;
  }

  // update label mobile
  const labelMobile = document.getElementById("currentThemeLabelMobile");
  if (labelMobile) {
    labelMobile.textContent = finalPalette;
  }
}

/* ===========================================================
   HEADER UI (DESKTOP DROPDOWNI)
   =========================================================== */

function initHeaderUI() {
  // --- LANGUAGE DROPDOWN (desktop) ---
  const dropdownButton = document.getElementById('lang-dropdown-button');
  const dropdownMenu   = document.getElementById('lang-dropdown-menu');
  const currentLabel   = document.getElementById('lang-current-label');
  const wrapper        = document.getElementById('lang-dropdown-wrapper');

  if (dropdownButton && dropdownMenu) {
    // otvori/zatvori meni jezika
    dropdownButton.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('hidden');
    });
  }

  // klik na neku opciju jezika
  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', () => {
      const chosenLang  = option.getAttribute('data-lang');   // npr "en"
      const chosenLabel = option.getAttribute('data-label');  // npr "EN"

      if (currentLabel) {
        currentLabel.textContent = chosenLabel;
      }

      dropdownMenu?.classList.add('hidden');

      // prebaci stvarno jezik
      setLanguage(chosenLang);
    });
  });

  // klik van dropdowna => zatvori meni jezika
  document.addEventListener('click', (e) => {
    if (wrapper && !wrapper.contains(e.target)) {
      dropdownMenu?.classList.add('hidden');
    }
  });


  // --- THEME / PALETTE DROPDOWN (desktop) ---
  const paletteBtn        = document.getElementById("themeBtn");
  const paletteDropdown   = document.getElementById("themeDropdown");

  // prvo postavi paletu iz localStorage
  const saved = localStorage.getItem(PALETTE_KEY) || "custom";
  applyPalette(saved);

  if (paletteBtn && paletteDropdown) {
    // otvori/zatvori dropdown sa paletama
    paletteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      paletteDropdown.classList.toggle("hidden");
      // obezbedi flex kolonu ako je prikazano
      if (!paletteDropdown.classList.contains("hidden")) {
        paletteDropdown.style.display = "flex";
      } else {
        paletteDropdown.style.display = "none";
      }
    });

    // klik na neku temu/paletu
    paletteDropdown.querySelectorAll("button[data-palette]").forEach(btn => {
      btn.addEventListener("click", () => {
        const chosen = btn.getAttribute("data-palette");
        applyPalette(chosen);

        // zatvori dropdown
        paletteDropdown.classList.add("hidden");
        paletteDropdown.style.display = "none";
      });
    });

    // klik van dropdowna -> zatvori
    document.addEventListener("click", (e) => {
      if (!paletteDropdown.contains(e.target) && e.target !== paletteBtn) {
        paletteDropdown.classList.add("hidden");
        paletteDropdown.style.display = "none";
      }
    });
  }
}

/* ===========================================================
   MOBILE UI (BURGER + MOBILE DROPDOWNI)
   =========================================================== */

function initMobileUI() {
  // burger dugme i panel
  const burger      = document.getElementById("mobileMenuToggle");
  const mobileMenu  = document.getElementById("mobileMenu");

  if (burger && mobileMenu) {
    // otvori/zatvori panel
    burger.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle("hidden");
    });

    // klik van panela zatvara
    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) {
        mobileMenu.classList.add("hidden");
      }
    });
  }

  // MOBILE LANGUAGE DROPDOWN
  const langBtnMobile    = document.getElementById("lang-dropdown-button-mobile");
  const langMenuMobile   = document.getElementById("lang-dropdown-menu-mobile");
  const langLabelMobile  = document.getElementById("lang-current-label-mobile");

  if (langBtnMobile && langMenuMobile) {
    // otvori/zatvori dropdown jezika u mobilnom meniju
    langBtnMobile.addEventListener("click", (e) => {
      e.stopPropagation();
      langMenuMobile.classList.toggle("hidden");
    });

    // klik na opciju jezika
    langMenuMobile.querySelectorAll(".lang-option").forEach(opt => {
      opt.addEventListener("click", () => {
        const chosenLang  = opt.getAttribute("data-lang");
        const chosenLabel = opt.getAttribute("data-label");

        if (langLabelMobile) {
          langLabelMobile.textContent = chosenLabel;
        }

        // globalni prevod
        setLanguage(chosenLang);

        // zatvori dropdown listu jezika
        langMenuMobile.classList.add("hidden");
        // po želji: i panel u celosti
        // mobileMenu.classList.add("hidden");
      });
    });

    // klik van dropdowna jezika u mobilnom -> zatvori
    document.addEventListener("click", (e) => {
      if (
        !langMenuMobile.contains(e.target) &&
        !langBtnMobile.contains(e.target)
      ) {
        langMenuMobile.classList.add("hidden");
      }
    });
  }

  // MOBILE THEME DROPDOWN
  const themeBtnMobile        = document.getElementById("themeBtnMobile");
  const themeDropdownMobile   = document.getElementById("themeDropdownMobile");
  const themeLabelMobile      = document.getElementById("currentThemeLabelMobile");

  if (themeBtnMobile && themeDropdownMobile) {
    // otvori/zatvori dropdown tema
    themeBtnMobile.addEventListener("click", (e) => {
      e.stopPropagation();
      themeDropdownMobile.classList.toggle("hidden");
    });

    // klik na konkretnu paletu
    themeDropdownMobile.querySelectorAll("button[data-palette]").forEach(btn => {
      btn.addEventListener("click", () => {
        const chosen = btn.getAttribute("data-palette");

        applyPalette(chosen); // globalno postavljanje teme

        if (themeLabelMobile) {
          themeLabelMobile.textContent = chosen;
        }
        const themeLabelDesktop = document.getElementById("currentThemeLabel");
        if (themeLabelDesktop) {
          themeLabelDesktop.textContent = chosen;
        }

        // zatvori dropdown
        themeDropdownMobile.classList.add("hidden");
      });
    });

    // klik van dropdowna teme -> zatvori
    document.addEventListener("click", (e) => {
      if (
        !themeDropdownMobile.contains(e.target) &&
        !themeBtnMobile.contains(e.target)
      ) {
        themeDropdownMobile.classList.add("hidden");
      }
    });
  }
}

/* ===========================================================
   SCROLL TO TOP BUTTON COLOR (akcenat po ruti)
   =========================================================== */

function updateScrollBtnColor(theme) {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  let color;
  switch (theme) {
    case "gold":  color = "#d4af37"; break; // zlatna
    case "bordo": color = "#800020"; break; // bordo
    case "green": color = "#2f6e2f"; break; // tamnozelena
    default:      color = "#444"; break;    // fallback
  }

  btn.style.background = color;
  btn.style.color = "#fff";
}

/* ===========================================================
   AKCENT TEMA PO RUTI (zelena / zlatna / bordo)
   =========================================================== */
function setTheme(theme = "green") {
  const allowed = ["green", "gold", "bordo"];
  document.body.dataset.theme = allowed.includes(theme) ? theme : "green";
  updateScrollBtnColor(theme);
}

/* ===========================================================
   HEADER / FOOTER partials (dinamički include)
   =========================================================== */
async function loadPartials() {
  const [hdr, ftr] = await Promise.all([
    fetch("inc/header.html").then(r => {
      if(!r.ok) throw new Error("inc/header.html "+r.status);
      return r.text();
    }),
    fetch("inc/footer.html").then(r => {
      if(!r.ok) throw new Error("inc/footer.html "+r.status);
      return r.text();
    }),
  ]);

  $("#site-header").innerHTML = hdr;
  $("#site-footer").innerHTML = ftr;
}

/* ===========================================================
   ROUTING definicije
   =========================================================== */

const routes = {
  "": "pages/home.html",
  "manastiri": "pages/manastiri.html",
  "izvori": "pages/izvori.html",
  "Istorijat": "pages/Istorijat.html",
};

function parseHash(){
  return location.hash
    .replace(/^#\//,"")
    .split("/")
    .filter(Boolean);
}

/* ===========================================================
   Load page HTML u #app i izvrši <script> tagove iz nje
   =========================================================== */
async function loadPage(path){
  const r = await fetch(path);
  if(!r.ok) throw new Error(path+" "+r.status);
  app.innerHTML = await r.text();

  // re-run script tagove iz ubačenog HTML-a
  const scripts = app.querySelectorAll("script");
  for (const old of scripts) {
    const s = document.createElement("script");
    if (old.type) s.type = old.type;
    if (old.src) {
      s.src = old.src;
    } else {
      s.textContent = old.textContent;
    }
    for (const {name, value} of [...old.attributes]) {
      if (name !== "src" && name !== "type") {
        s.setAttribute(name, value);
      }
    }
    old.replaceWith(s);
  }
}

/* ===========================================================
   Detaljna strana manastira (#/manastir/<slug>)
   =========================================================== */
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

/* ===========================================================
   Lista manastira (stranica /manastiri)
   =========================================================== */
async function initManastiriPage(){
  // zlatna tema
  setTheme("gold");

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

  // učitaj JSON
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
    const needle = (q.value || "").trim().toLowerCase();

    filtered = all.filter(m => {
      const hay = `
        ${m.naziv || ""} 
        ${m.mesto || ""} 
        ${m.region || ""} 
        ${m.opis || ""} 
        ${m.status || ""}
      `.toLowerCase();

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

    // paginacija
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

/* ===========================================================
   ROUTER
   =========================================================== */
async function route(){
  try{
    const parts = parseHash(); // npr ["manastir","studenica"]

    // detaljna strana
    if (parts[0] === "manastir" && parts[1]) {
      await renderManastirDetail(parts[1]);
      return;
    }

    // postavi akcent-temu po ruti
    if (parts[0] === "manastiri") {
      setTheme("gold");
    } else if (parts[0] === "izvori") {
      setTheme("bordo");
    } else if (parts[0] === "Istorijat") {
      setTheme("bordo"); // može kasnije posebna
    } else {
      setTheme("green");
    }

    // učitaj HTML rute
    await loadPage(routes[parts[0] || ""]);

    // dodatna inicijalizacija samo za /manastiri
    if ((parts[0] || "") === "manastiri") {
      await initManastiriPage();
    }
  }catch(e){
    console.error(e);
    app.innerHTML = `<pre style="background:#300;color:#fff;padding:12px">Greška: ${e?.message || e}</pre>`;
  }
}

window.addEventListener("hashchange", route);

/* ===========================================================
   INIT SEKVENCA
   =========================================================== */
(async function(){
  // 1. ubaci header/footer u DOM
  await loadPartials();

  // 2. sada kad header postoji -> init desktop i mobile
  initHeaderUI();
  initMobileUI();

  // 3. prva ruta
  await route();
})();
