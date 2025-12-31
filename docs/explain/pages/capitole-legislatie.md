# capitole-legislatie.html – Lecție de legislație (pagini)

## Ce face pagina (în termeni simpli)
- Deschide un capitol de legislație (text + imagine/video) și permite navigarea pagină cu pagină.
- Arată progresul capitolului și ecran final cu butoane „Next/Reset”.
- Blochează accesul simultan la același capitol din mai multe tab-uri.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. jQuery + `webflow.js` + Lottie.
3. Firebase SDK (app, auth, firestore, database, app-check) + Chart.js.
4. `js/firebase-config.js`.
5. `js/auth-guard-footer.js`.
6. `js/single-active-lock.js` – creează lock în RTDB (`chapterLocks`) pentru capitolul curent.
7. `js/plyr.polyfilled-3.7.8.min.js` – pentru video player.
8. `js/theme.js`.
9. Script inline mare (Webflow.push) care:
   - Citește `chapterId` din query string.
   - Cere utilizatorul curent (Auth) și forțează login dacă nu există.
   - Încarcă capitolul și paginile din Firestore (`legislatie_pages` + `legislatie_chapters`).
   - Randează titlul, textul, imaginea/video, acordeonul de text și butoanele Next/Prev.
   - Calculează progresul și îl afișează în header și în ecranul final.
   - Gestionează alertele de reset și stările de loader.

## Evenimente declanșatoare
- `DOMContentLoaded` + `Webflow.push` pentru bootstrap.
- Click pe `.next-btn` / `.prev-btn` / `.reset-chapter-btn` / `.next-chapter-btn`.
- Observă `onAuthStateChanged` pentru a opri/continua randarea dacă userul se schimbă.
- RTDB lock se setează când userul este valid.

## Chei localStorage
- `sp_auth_snapshot_v1` – folosit de gard.
- `sp-theme` – preferința de temă.
- Nu salvează progresul local; datele stau în Firestore.

## Cum vorbește cu Firebase
- **Auth:** cere userul curent și redirecționează la `/login` dacă nu este conectat.
- **Firestore:** citește detalii capitol/pagini și poate marca progresul.
- **RTDB:** `chapterLocks/{uid}/legislatie:<chapterId>` pentru blocare tab duplicat.

## Dacă se strică X, unde te uiți
- Nu se încarcă lecția: verifică parametru `chapterId` în URL și console errors din scriptul inline.
- Video nu pornește: verifică `plyr` și sursele video din Firestore.
- Redirecționare la login loop: gardurile auth și regulile Firestore (permission denied).

## Legături utile
- [features/quizzes-learning-flow.md](../features/quizzes-learning-flow.md)
- [features/auth-and-routing.md](../features/auth-and-routing.md)
- [features/dropdowns-and-menus.md](../features/dropdowns-and-menus.md)
