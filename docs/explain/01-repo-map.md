# 01. Hartă rapidă a repo-ului

## Structură de bază (foldere principale)
- `/` (rădăcină) – conține toate paginile HTML generate din Webflow și configurările Firebase.
  - `index.html`, `mediu-invatare.html`, `teste-examen.html`, `teste-examen-chestionare.html`, `teste-mediu-invatare.html`, `codul-rutier.html`, `capitole-legislatie.html`, `setari.html`, `planul-meu.html`, `contact.html`, plus paginile de autentificare și politici.
- `/css/` – stilurile generate de Webflow (`normalize.css`, `webflow.css`, `webarcs-ultra-awesome-site.webflow.css`) și stylesheet pentru dropdown (`sp-dropdown.css`).
- `/js/` – scripturi custom:
  - Gard de autentificare: `auth-guard-head.js`, `auth-guard-footer.js`.
  - Autentificare: `login-handler.js`, `signup-handler.js`.
  - Firebase bootstrap: `firebase-config.js`.
  - UI: `theme.js`, `sp-dropdown.js`, `single-active-lock.js`, `plyr.polyfilled-3.7.8.min.js`, `webflow.js`, `webfontloader-1.6.26.js`.
- `/images/`, `/fonts/` – resurse statice (SVG, PNG, fonturi).
- `/docs/` – documentația existentă + acest ghid nou în `/docs/explain/`.
- `/scripts/` – utilitare Node/Python pentru întreținere (optimizare imagini, validări).
- `/node_modules/`, `package.json`, `package-lock.json` – dependențe front-end (jsdom/optimizări, nu afectează runtime-ul live).
- `firebase.json`, `firestore.rules`, `storage.rules`, `database.rules.json`, `firestore.indexes.json` – configurări Firebase.
- `/documents/` – materiale statice (PDF/imagini suplimentare).

## Fișiere cheie pentru comportament
- **Tema:** `js/theme.js` (setează `data-theme` pe `<html>` și sincronizează checkbox-urile `.theme-checkbox`).
- **Dropdown-uri:** `js/sp-dropdown.js` (atribut `data-sp-dropdown` + clase `.w-dropdown-toggle` și `.w-dropdown-list`).
- **Gard auth:** `js/auth-guard-head.js` + `js/auth-guard-footer.js` (preload, snapshot în `sp_auth_snapshot_v1`, redirecționare către `/verifica-email`).
- **Autentificare:** `js/login-handler.js`, `js/signup-handler.js` (formularele din `login.html` și `sign-up.html`).
- **Blocare tab-uri multiple:** `js/single-active-lock.js` (cheie `chapterLocks` în RTDB).
- **Pagini de teste/lecții:** logica specifică este inline în HTML (Webflow embeds) sau încărcată extern (ex.: `teste-mediu-invatare.html` încarcă un script extern `y71.js`).

## Unde să cauți conținutul fiecărei pagini
- `/pages/` în acest ghid conține câte un fișier explicativ pentru fiecare HTML (vezi [02-pages-index.md](02-pages-index.md)).
- HTML-urile din rădăcină includ atât markup, cât și scripturi inline pentru logici specifice (progres, timere, loaders).
- Funcționalitățile comune (temă, autentificare, dropdown) sunt centralizate în `/js/` și descrise în [features/](features/).
