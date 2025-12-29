const SP_META_MAP = {
  "/": {
    title: "Start Permis - Toate Modulele",
    description:
      "Învață pentru examenul auto cu module complete, exerciții interactive și monitorizarea progresului în timp real."
  },
  "/index.html": {
    title: "Start Permis - Toate Modulele",
    description:
      "Învață pentru examenul auto cu module complete, exerciții interactive și monitorizarea progresului în timp real."
  },
  "/codul-rutier.html": {
    title: "Codul Rutier Actualizat 2025",
    description:
      "Parcurge legislația rutieră actualizată, articole explicate și exemple pentru pregătirea examenului auto."
  },
  "/mediu-invatare.html": {
    title: "Mediu de Învățare - Start Permis",
    description:
      "Exersează în ritmul tău cu lecții scurte, exemple vizuale și feedback imediat pentru fiecare capitol."
  },
  "/teste-examen.html": {
    title: "Teste Examen Auto DRPCIV",
    description:
      "Simulează examenul auto cu teste cronometrate, grilă actualizată și explicații pentru răspunsuri."
  },
  "/teste-examen-chestionare.html": {
    title: "Chestionare Auto - Antrenament Rapid",
    description:
      "Antrenamente scurte cu chestionare auto, rezultate imediate și recomandări pentru capitolele de reluat."
  },
  "/teste-mediu-invatare.html": {
    title: "Teste Mediu de Învățare",
    description:
      "Verifică-ți progresul cu teste tematice și vezi ce capitole necesită mai multă atenție."
  },
  "/planul-meu.html": {
    title: "Planul Meu - Progres Personalizat",
    description:
      "Monitorizează-ți progresul, stabilește obiective zilnice și urmărește recomandările personalizate."
  },
  "/setari.html": {
    title: "Setări Cont Start Permis",
    description:
      "Administrează datele contului, preferințele de notificare, temele și setările de confidențialitate."
  },
  "/contact.html": {
    title: "Contact Start Permis",
    description:
      "Ai întrebări despre platformă sau abonament? Trimite-ne un mesaj și îți răspundem rapid."
  },
  "/start-permis-blog.html": {
    title: "Blog Start Permis",
    description:
      "Sfaturi pentru examenul auto, noutăți legislative și ghiduri practice pentru viitori șoferi."
  },
  "/capitole-legislatie.html": {
    title: "Capitole Legislație Rutieră",
    description:
      "Accesează rapid fiecare capitol de legislație rutieră și urmărește progresul în timp real."
  },
  "/politica-de-cookie-uri.html": {
    title: "Politica de Cookie-uri - Start Permis",
    description:
      "Află cum folosim cookie-urile pentru a îmbunătăți experiența și pentru analize de performanță."
  },
  "/politica-de-confidentialitate.html": {
    title: "Politica de Confidențialitate - Start Permis",
    description:
      "Citește cum protejăm datele personale, ce informații colectăm și cum le folosim în platformă."
  },
  "/termeni-si-conditii.html": {
    title: "Termeni și Condiții - Start Permis",
    description:
      "Detalii despre utilizarea platformei, responsabilități, plăți și drepturile utilizatorilor."
  },
  "/login.html": {
    title: "Autentificare - Start Permis",
    description:
      "Intră în contul tău Start Permis pentru a continua învățarea și a-ți urmări progresul."
  },
  "/sign-up.html": {
    title: "Creează Cont - Start Permis",
    description:
      "Înregistrează-te pentru acces la cursuri, teste și monitorizarea progresului pentru examenul auto."
  },
  "/auth.html": {
    title: "Autentificare Rapidă",
    description:
      "Accesează-ți contul și reia progresul de unde ai rămas în platforma Start Permis."
  },
  "/confirmare-email.html": {
    title: "Confirmare Email - Start Permis",
    description:
      "Finalizează validarea adresei tale de email pentru a activa complet contul Start Permis."
  },
  "/verifica-email.html": {
    title: "Verifică Email-ul",
    description:
      "Verifică-ți email-ul pentru a continua procesul de înregistrare sau resetare a parolei."
  },
  "/resetare-parola.html": {
    title: "Resetare Parolă",
    description:
      "Resetează parola contului Start Permis și revino în platformă în siguranță."
  },
  "/401.html": {
    title: "Acces Restricționat",
    description:
      "Nu ai încă acces la această resursă. Autentifică-te sau verifică drepturile tale."
  },
  "/404.html": {
    title: "Pagina Nu a Fost Găsită",
    description:
      "Link-ul accesat nu există. Revino la pagina principală Start Permis pentru a continua."
  },
  "/old-home.html": {
    title: "Start Permis - Versiune Anterioară",
    description:
      "Descoperă versiunea anterioară a paginii principale și resursele asociate."
  },
  "/teste-examen-chestionare.html": {
    title: "Chestionare Examen Auto",
    description:
      "Rezolvă chestionare pentru examenul auto și urmărește scorul obținut la fiecare încercare."
  }
};

const CONSENT_KEY = "sp_consent_v1";
const ANIMATIONS_PATH = "./webflow.js";
const AUTH_SNAPSHOT_KEY = "sp_auth_snapshot_v1";

const ready = (cb) =>
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", cb, { once: true })
    : cb();

function primeGlobalStubs() {
  if (!window.Webflow) window.Webflow = [];
  if (!window.firebase) {
    const stubAuth = {
      currentUser: null,
      onAuthStateChanged: () => () => {},
      signOut: async () => {}
    };
    const stubFirestore = {
      settings: () => {},
      collection: () => ({
        get: async () => ({ size: 0, forEach: () => {} }),
        onSnapshot: () => () => {},
        doc: () => ({ get: async () => ({ exists: false }), set: async () => {}, update: async () => {} })
      }),
      FieldValue: { serverTimestamp: () => ({}) }
    };
    const stubDatabase = {
      ref: () => ({
        child: () => stubDatabase.ref(),
        set: async () => {},
        on: () => {},
        once: async () => ({ exists: () => false })
      })
    };
    window.firebase = {
      apps: [],
      initializeApp: () => {},
      firestore: () => stubFirestore,
      auth: () => stubAuth,
      database: () => stubDatabase
    };
  }
}

function injectFocusStyles() {
  if (document.getElementById("sp-focus-styles")) return;
  const style = document.createElement("style");
  style.id = "sp-focus-styles";
  style.textContent = `
:root {
  --sp-focus-color: #4f46e5;
  --sp-focus-ring: 0 0 0 3px rgba(79, 70, 229, 0.35);
}
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[role="button"]:focus-visible,
.w-nav-button:focus-visible,
.w-slider-arrow-left:focus-visible,
.w-slider-arrow-right:focus-visible,
.w-dropdown-toggle:focus-visible {
  outline: 2px solid var(--sp-focus-color);
  outline-offset: 2px;
  box-shadow: var(--sp-focus-ring);
}
#sp-consent-banner button:focus-visible {
  outline-color: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.35);
}
#sp-consent-banner {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  max-width: 760px;
  width: calc(100% - 2rem);
  background: #111827;
  color: #e5e7eb;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
  z-index: 9999;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
#sp-consent-banner h3 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  line-height: 1.4;
}
#sp-consent-banner p {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  line-height: 1.5;
}
#sp-consent-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
#sp-consent-actions button {
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 8px;
  font-weight: 600;
  padding: 0.55rem 0.95rem;
  transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
}
#sp-consent-accept {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
#sp-consent-reject {
  background: #1f2937;
  color: #e5e7eb;
  border-color: #374151;
}
#sp-consent-actions button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}
@media (max-width: 640px) {
  #sp-consent-actions { flex-direction: column; align-items: stretch; }
  #sp-consent-actions button { width: 100%; }
}
`;
  document.head.appendChild(style);
}

function softenAuthPreload() {
  if (document.getElementById("sp-auth-preload-override")) return;
  const style = document.createElement("style");
  style.id = "sp-auth-preload-override";
  style.textContent = `
  html:not(.wf-design-mode).sp-auth-preload body{
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: none !important;
  }`;
  document.head.appendChild(style);
}

function releaseAuthPreload() {
  document.documentElement.classList.remove("sp-auth-preload");
}

function seedAnonAuthSnapshot() {
  try {
    if (!localStorage.getItem(AUTH_SNAPSHOT_KEY)) {
      localStorage.setItem(
        AUTH_SNAPSHOT_KEY,
        JSON.stringify({ a: 0, ev: 0, t: Date.now() })
      );
    }
  } catch (e) {
    console.warn("Nu am putut seta snapshot-ul anonim pentru auth.", e);
  }
}

function lazyLoadImages() {
  const images = document.querySelectorAll("img:not([loading])");
  images.forEach((img) => {
    if (img.dataset.critical === "true") return;
    img.loading = "lazy";
    img.decoding = "async";
  });
}

function enhanceAriaLabels() {
  const selectors = [
    "button",
    "[role='button']",
    ".w-nav-button",
    ".w-dropdown-toggle",
    ".w-slider-arrow-left",
    ".w-slider-arrow-right",
    "input[type='button']",
    "input[type='submit']",
    "a.w-button"
  ];
  const interactive = document.querySelectorAll(selectors.join(","));
  interactive.forEach((el) => {
    if (!el.getAttribute("aria-label")) {
      const label = (el.getAttribute("title") || el.innerText || el.textContent || "").trim();
      if (label) {
        el.setAttribute("aria-label", label);
      }
    }
    if (el.tabIndex < 0) {
      el.tabIndex = 0;
    }
  });
}

function setMetaTag(name, content, isProperty = false) {
  if (!content) return;
  const selector = isProperty ? `meta[property=\"${name}\"]` : `meta[name=\"${name}\"]`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(isProperty ? "property" : "name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  let path = pathname.split("?")[0].split("#")[0];
  if (path.endsWith("/")) path = path.slice(0, -1) || "/";
  if (path.endsWith("/index.html")) path = path.replace(/\\/index\\.html$/, "/");
  return path || "/";
}

function applySeoMetadata() {
  const normalized = normalizePath(window.location.pathname);
  const meta = SP_META_MAP[normalized] || SP_META_MAP[window.location.pathname];
  if (!meta) return;
  if (meta.title) document.title = meta.title;
  setMetaTag("description", meta.description);
  setMetaTag("og:title", meta.title, true);
  setMetaTag("og:description", meta.description, true);
  setMetaTag("twitter:title", meta.title);
  setMetaTag("twitter:description", meta.description);
}

async function loadScript(src) {
  if (document.querySelector(`script[src=\"${src}\"]`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function waitForFirebase() {
  if (window.firebase?.apps?.length) return window.firebase;
  return new Promise((resolve) => {
    const started = Date.now();
    const interval = setInterval(() => {
      if (window.firebase?.apps?.length) {
        clearInterval(interval);
        resolve(window.firebase);
      } else if (Date.now() - started > 8000) {
        clearInterval(interval);
        resolve(window.firebase || null);
      }
    }, 200);
  });
}

async function enableAnalytics() {
  const fb = await waitForFirebase();
  if (!fb) return;
  try {
    if (typeof fb.analytics !== "function") {
      await loadScript("https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics-compat.js");
    }
    if (typeof fb.analytics === "function") fb.analytics();
  } catch (error) {
    console.warn("[consent] Nu am putut porni Analytics:", error);
  }
}

async function enablePerformance() {
  const fb = await waitForFirebase();
  if (!fb) return;
  try {
    if (typeof fb.performance !== "function") {
      await loadScript("https://www.gstatic.com/firebasejs/10.10.0/firebase-performance-compat.js");
    }
    if (typeof fb.performance === "function") fb.performance();
  } catch (error) {
    console.warn("[consent] Nu am putut porni Performance:", error);
  }
}

function getStoredConsent() {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY) || "{}");
  } catch (e) {
    return null;
  }
}

function persistConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...value, ts: Date.now() }));
  } catch (e) {
    console.warn("Nu am putut salva preferințele de consimțământ.", e);
  }
}

function applyConsentPreferences() {
  const consent = getStoredConsent();
  if (!consent) return;
  if (consent.analytics) enableAnalytics();
  if (consent.performance) enablePerformance();
}

function renderConsentBanner() {
  if (getStoredConsent()) {
    applyConsentPreferences();
    return;
  }
  const banner = document.createElement("section");
  banner.id = "sp-consent-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-live", "polite");
  banner.innerHTML = `
    <h3>Permisiuni pentru Analytics & Performance</h3>
    <p>Folosim cookie-uri opționale pentru a măsura performanța și a îmbunătăți experiența. Poți accepta sau refuza oricând.</p>
    <div id="sp-consent-actions">
      <button id="sp-consent-accept">Accept tot</button>
      <button id="sp-consent-reject">Doar necesar</button>
    </div>
  `;
  const acceptBtn = banner.querySelector("#sp-consent-accept");
  const rejectBtn = banner.querySelector("#sp-consent-reject");
  acceptBtn.addEventListener("click", () => {
    persistConsent({ analytics: true, performance: true });
    banner.remove();
    applyConsentPreferences();
  });
  rejectBtn.addEventListener("click", () => {
    persistConsent({ analytics: false, performance: false });
    banner.remove();
  });
  document.body.appendChild(banner);
}

function scheduleAnimations() {
  const triggerLoad = () => import(ANIMATIONS_PATH).catch((err) => {
    console.warn("Nu am putut încărca pachetul de animații:", err);
  });
  if (document.readyState === "complete") {
    triggerLoad();
  } else {
    window.addEventListener("DOMContentLoaded", triggerLoad, { once: true });
  }
}

function initEnhancements() {
  primeGlobalStubs();
  injectFocusStyles();
  softenAuthPreload();
  seedAnonAuthSnapshot();
  applySeoMetadata();
  lazyLoadImages();
  enhanceAriaLabels();
  scheduleAnimations();
  renderConsentBanner();
  releaseAuthPreload();
}

ready(initEnhancements);
