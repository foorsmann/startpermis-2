# mediu-invatare.html – Listă capitole „Mediu de învățare”

## Ce face pagina
- Afișează toate capitolele de exersare tip „mediu de învățare”, fiecare cu bară verde/roșie și procent.
- Animează încărcarea și ascunde UI-ul până când datele sunt gata.
- Permite click pe un card pentru a deschide pagina de întrebări a capitolului (`/teste-mediu-invatare?chapter=...`).
- Gestionează meniul utilizatorului (email mascat, tooltip, logout fără refresh).

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. Lottie (bodymovin) + patch inline pentru nav/auth intent + tooltip email + logout fără reload.
3. jQuery + `webflow.js` + Lottie runtime.
4. Firebase SDK + Chart.js.
5. `js/firebase-config.js`.
6. `js/auth-guard-footer.js`.
7. `js/single-active-lock.js`.
8. `js/plyr.polyfilled-3.7.8.min.js`.
9. `js/theme.js`.
10. `js/sp-dropdown.js`.
11. Script inline mare (Webflow.push) care:
    - Ascunde UI-ul și arată loaderul `.lesson-loader`.
    - Așteaptă Firebase Auth, detectează userul curent și pornește un watcher care reacționează la login/logout.
    - Ia capitolele din `mediu_invatare_chapters` (Firestore, ordonate după `Index`).
    - Prefetch pentru răspunsuri și progres din `users/{uid}/answers_mediu` și `users/{uid}/progress_mediu`.
    - Prefetch număr de întrebări per capitol din `mediu_invatare_pages`.
    - Construiește cardurile dinamic (`.invatare-chapter-page-card`) cu bare de progres, procent și click handler.
    - Animează barele și procentele la primul render; rehidratează la `pageshow`.

## Evenimente declanșatoare
- `onAuthStateChanged` – la logout resetează barele la 0 fără reload; la login reface randarea.
- `ResizeObserver` pentru recalcularea barelor când se schimbă dimensiunea.
- `pageshow` (navigare back/forward) rehidratează progresul.

## Chei localStorage
- `authIntent` – setată când utilizatorul apasă pe buton de login din navbar.
- `sp_auth_snapshot_v1` – snapshot auth.
- `sp-theme` – tema.
- Nu salvează progres local (doar în Firestore).

## Cum vorbește cu Firebase
- **Auth:** detectează userul și pornește randarea; dacă nu există user, arată UI-ul „neautentificat” dar cu bare 0.
- **Firestore:** citește capitole, întrebări și răspunsurile/progresul userului din subcolecțiile `answers_mediu` și `progress_mediu`.

## Dacă se strică X, unde te uiți
- Lista goală sau mesaj de eroare: verifică permisiunile Firestore și consola pentru erori din `renderProgress`.
- Logout nu actualizează UI-ul: vezi funcțiile `showLoggedOutUI`/`showLoggedInUI` din scriptul inline.
- Cardurile nu se animă: verifică dacă `.lesson-loader` rămâne afișat (guard anti-flicker).

## Legături utile
- [features/quizzes-learning-flow.md](../features/quizzes-learning-flow.md)
- [features/dropdowns-and-menus.md](../features/dropdowns-and-menus.md)
- [features/auth-and-routing.md](../features/auth-and-routing.md)
