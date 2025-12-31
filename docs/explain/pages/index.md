# index.html – Toate modulele (dashboard)

## Ce face pagina
- Este hub-ul principal după login: arată progresul la trei module (Legislație, Mediu de învățare, Simulări/Chestionare).
- Fiecare card de modul are o bară segmentată și buton care își schimbă textul (Începe/Continuă/Finalizat) în funcție de progres.
- Include navbar cu login/profil, meniuri custom și buton „Înapoi sus”.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. Lottie (bodymovin) pentru animații decorative.
3. Patch inline pentru navbar (auth vs. profil) și intent de login.
4. Patch inline pentru butonul `.top-btn`.
5. jQuery + `webflow.js` + Lottie runtime.
6. Firebase SDK + Chart.js.
7. `js/firebase-config.js`.
8. `js/auth-guard-footer.js`.
9. `js/single-active-lock.js`.
10. `js/plyr.polyfilled-3.7.8.min.js`.
11. `js/theme.js`.
12. `js/sp-dropdown.js`.
13. Script inline „scroll smooth” pentru rotița mouse-ului.
14. Script inline principal (Webflow.push) care:
    - Normalizează titlurile cardurilor (`.module-card-title`) pe două linii dacă e nevoie.
    - Anima barele segmentate (`.seg-track .seg`) și etichetele de procent (`.seg-label`).
    - Construcție mapă `modules` pe baza atributului `data-module`.
    - Se conectează la Firestore și atașează 3 listener-e live:
      - `users/{uid}/progress_legislatie`
      - `users/{uid}/answers_mediu`
      - `users/{uid}/answers_chestionare`
    - Calculează progresul procentual pentru fiecare modul și actualizează UI-ul în timp real.
    - Curăță listener-ele la schimbare de user/logout.
15. Script inline final care măsoară înălțimea navbarului și o expune ca variabilă CSS `--sp-nav-h`.

## Evenimente declanșatoare
- `Webflow.push` la încărcare pentru animarea cardurilor.
- `onAuthStateChanged` din Firebase pentru atașarea/detașarea listenerelor.
- `ResizeObserver` pentru recalcularea graficelor și a înălțimii nav-ului.
- Scroll pentru butonul „sus”.

## Chei localStorage
- `authIntent` – setată la click pe butonul de login.
- `sp_auth_snapshot_v1` – folosită de gardul de auth.
- `sp-theme` – tema.

## Cum vorbește cu Firebase
- **Auth:** decide dacă să randeze progres real sau 0% și curăță listener-ele la logout.
- **Firestore:** citește `legislatie_chapters`/`legislatie_pages` pentru a calcula numărul total de pagini, apoi ascultă subcolecțiile de progres/răspunsuri ale userului pentru a actualiza barele.

## Dacă se strică X
- Progresul rămâne 0: verifică permisiunile Firestore și consola pentru `permission-denied`.
- Butonul modulului nu își schimbă textul: verifică atributul `data-module` pe card și scriptul inline.
- Scroll-ul devine ciudat: vezi scriptul „wheel smooth” (poți opri `preventDefault` pentru test).

## Legături utile
- [features/quizzes-learning-flow.md](../features/quizzes-learning-flow.md)
- [features/dropdowns-and-menus.md](../features/dropdowns-and-menus.md)
- [features/auth-and-routing.md](../features/auth-and-routing.md)
- [features/theme.md](../features/theme.md)
