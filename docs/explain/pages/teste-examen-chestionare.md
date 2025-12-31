# teste-examen-chestionare.html – Simulare chestionar

## Ce face pagina
- Rulează un chestionar cronometrat (stil examen) cu întrebări din Firestore.
- Permite să sari peste întrebări, să reiei doar cele greșite și să vezi un ecran final cu rezultate.
- Ține minte progresul local ca să poți continua dacă închizi tab-ul.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. jQuery + `webflow.js` + Lottie.
3. Firebase SDK + Chart.js.
4. `js/firebase-config.js`.
5. `js/auth-guard-footer.js`.
6. `js/single-active-lock.js` (nu setează lock aici, dar e disponibil).
7. `js/plyr.polyfilled-3.7.8.min.js`.
8. `js/theme.js`.
9. Scripturi inline (două blocuri mari) care:
   - Citește `Numar Chestionar` din pagina/URL și ia întrebările din Firestore (`simulare_chestionare_pages`, ordonate după `Index`).
   - Construiește listele de întrebări, opțiuni și butoane (Next, Skip, Final).
   - Pornește timerul (26 minute) și îl salvează în localStorage.
   - Permite mod „întrebări greșite” și resetarea testului.
   - Calculează scorul, barele finale (verde/roșu) și afișează mesaje accesibile (aria-live).

## Evenimente declanșatoare
- `DOMContentLoaded`/`Webflow.push` pornește logica.
- Click pe opțiuni `.option-card-exam`, butoane de navigare, și butonul de „reset”.
- Timerul rulează cu `setInterval` și reacționează la pauză/resume (de ex. când schimbi ecranul).
- `onAuthStateChanged` poate influența salvarea progresului (cheile includ `uid`).

## Chei localStorage
- Prefix `exam_chestionar_v4` + user (`uid` sau `guest`) + număr chestionar:
  - `exam_chestionar_v4:answers:<user>:<nr>` – răspunsurile alese.
  - `exam_chestionar_v4:progress:<user>:<nr>` – corecte/greșite, index curent.
  - `exam_chestionar_v4:timer:<user>:<nr>` – starea timerului (start, timp rămas, pauză).
  - `exam_chestionar_v4:ui:<user>:<nr>` – ecran curent (întrebări/final) și mod „greșite”.
- `sp_auth_snapshot_v1`, `sp-theme` – chei globale.

## Cum vorbește cu Firebase
- **Auth:** folosește `firebase.auth()` pentru a obține `uid` (altfel folosește `guest`).
- **Firestore:** citește întrebările din `simulare_chestionare_pages` și poate salva răspunsuri/progres în subcolecțiile userului (`answers_chestionare`).
- **RTDB:** nu folosește lock aici.

## Dacă se strică X, unde te uiți
- Timerul sare sau se resetează: verifică cheile `exam_chestionar_v4:*` în localStorage și sincronizarea ceasului.
- Întrebările nu se încarcă: verifică colecția `simulare_chestionare_pages` și permisiunile Firestore.
- UI nu trece la ecranul final: verifică condițiile `getLeftQuestions()` și logica de final din scriptul inline.

## Legături utile
- [features/quizzes-learning-flow.md](../features/quizzes-learning-flow.md)
- [features/auth-and-routing.md](../features/auth-and-routing.md)
- [features/theme.md](../features/theme.md)
