# 00. Prezentare generală (arhitectură)

## Ce este proiectul (în 5–10 puncte)
- Platformă educațională pentru pregătirea permisului auto (lecții, chestionare, simulări).
- Site generat în Webflow, cu HTML/CSS stocat în repo și scripturi proprii în `/js`.
- Autentificare și date salvate prin Firebase (Auth, Firestore, RTDB, App Check).
- Paginile „interne” sunt protejate de un gard de autentificare (head + footer).
- Temă luminoasă/întunecată controlată din `js/theme.js` și salvată în localStorage.
- Meniuri/dropdown-uri custom prin `js/sp-dropdown.js` (nu se bazează pe runtime-ul Webflow).
- Fluxuri principale: învățare pe capitole, teste de mediu, simulări de examen, setări cont.
- Prefetch/real-time pentru progresul utilizatorului (grafice, bare de progres).
- Prevenire folosire simultană a aceleiași lecții în mai multe tab-uri via RTDB (single-active-lock).
- Interfață cu animații Lottie și stiluri Webflow deja incluse.

## Imagine de ansamblu: pagini, scripturi, Firebase, Webflow
- **Paginile publice**: 401/404, login, sign-up, resetări și verificări de email, politici și blog.
- **Paginile protejate**: index (module), codul rutier, capitole legislație, mediu de învățare, teste (mediu + examen), planul meu, setări, contact.
- **Scripturi de bază**:  
  - `js/auth-guard-head.js` + `js/auth-guard-footer.js` – ascund pagina până știe dacă userul e logat/validat.  
  - `js/firebase-config.js` – pornește Firebase + App Check și expune `window.db`.  
  - `js/theme.js` – citește/salvează tema în localStorage `sp-theme`.  
  - `js/sp-dropdown.js` – meniu/dropdown accesibil, închidere pe click în afară/Escape.  
  - `js/single-active-lock.js` – folosește RTDB pentru a evita aceeași lecție în mai multe tab-uri.  
  - `js/login-handler.js`, `js/signup-handler.js` – logare/creare cont (Auth + Firestore).  
  - `webflow.js` – runtime-ul generat de Webflow (animații, interacțiuni).
- **Firebase**:
  - Auth: login, Google OAuth, verificare email, resetare parolă, stări cache-uite în `sp_auth_snapshot_v1`.
  - Firestore: colecții `users`, `legislatie_chapters`, `legislatie_pages`, `mediu_invatare_chapters`, `mediu_invatare_pages`, `simulare_chestionare_pages`, plus subcolecții de progres/ răspunsuri (`answers_*`, `progress_*`).
  - RTDB: căi `chapterLocks` și `sessionLocks` pentru blocarea accesului din mai multe tab-uri și (opțional) timpi de cooldown.
  - App Check: ReCaptcha v3 activat prin `firebase-config.js`.
- **Webflow**:
  - Majoritatea claselor au prefix `w-` sau „module/section/card” și conțin Code Embeds pentru spinner, back-to-top etc.
  - Anumite componente (dropdown, top-btn, accordioane) primesc patch-uri JS pentru accesibilitate.

## Lifecycle simplificat (ce rulează și în ce ordine)
1. Browserul încarcă HTML + CSS + scripturile head (font loader, detectare touch, auth guard head).
2. Auth guard (head) se uită în localStorage (`sp_auth_snapshot_v1`) și poate redirecționa anonimii spre login sau utilizatorii neverificați spre `/verifica-email`.
3. După ce DOM-ul este gata, Webflow și scripturile custom (`theme.js`, dropdown, etc.) se inițializează.
4. La finalul paginii se încarcă SDK-urile Firebase + `firebase-config.js` (inițializează app, Firestore, App Check).
5. Auth guard (footer) ascultă starea reală a utilizatorului din Firebase Auth și actualizează `sp_auth_snapshot_v1`, apoi arată sau redirecționează pagina.
6. Scripturile specifice paginii pornesc:
   - Dashboard/progrese: se conectează la Firestore și atașează listeners live.
   - Paginile de teste: încarcă întrebări din Firestore sau din loaderul extern, restaurează din localStorage, pornesc timere.
   - Setări: citește/scrie preferințe în localStorage și colecția `users`.
7. Evenimente runtime (click-uri, schimbare temă, scroll, schimbare stare auth) actualizează UI-ul și, unde este cazul, scriu în Firestore/RTDB/localStorage.
