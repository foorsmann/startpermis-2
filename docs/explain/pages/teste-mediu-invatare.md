# teste-mediu-invatare.html – Întrebări pe capitol (mediu de învățare)

## Ce face pagina
- Afișează întrebările unui capitol selectat și permite răspuns pas cu pas.
- Include mod „refă doar greșitele” și card cu explicații (accordion).
- Se bazează pe un loader extern care randează logica principală.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. jQuery + `webflow.js` + Lottie.
3. Firebase SDK + Chart.js.
4. `js/firebase-config.js`.
5. `js/auth-guard-footer.js`.
6. `js/single-active-lock.js`.
7. `js/plyr.polyfilled-3.7.8.min.js`.
8. `js/theme.js`.
9. Script inline „AutoTest” care:
   - Adaugă patch-uri de accesibilitate (aria pe acordeon, alias-uri de clase pentru opțiuni/întrebări).
   - Sanitizează inserțiile HTML în zonele de text întrebări/opțiuni.
10. Loader extern: script `https://cdn.jsdelivr.net/gh/foorsmann/TEST-G@main/y71.js` (cu fallback pe același URL) care:
    - Citește capitolul din query param `chapter`.
    - Încarcă întrebările și gestionează fluxul de răspunsuri/progres (folosind Firestore).
    - Poate folosi preferințele locale (sunete, haptics) dacă sunt setate.
11. `<noscript>` afișează mesaj dacă JS e dezactivat.

## Evenimente declanșatoare
- Loaderul extern pornește după ce este încărcat (atribut `defer`).
- Patch-urile de accesibilitate rulează la `DOMContentLoaded`.

## Chei localStorage
- `sp_auth_snapshot_v1`, `sp-theme` – chei globale.
- Preferințe din setări pot fi citite de loader (`sp_ui_sounds_v1`, `sp_ui_haptics_v1`, `sp_ui_correct_anim_v1`, `sp_theme_v1`), dar nu există chei noi definite aici.

## Cum vorbește cu Firebase
- **Auth:** prin gard; loaderul extern folosește Auth pentru a salva progresul utilizatorului.
- **Firestore:** loaderul extern citește întrebările capitolului și scrie în `answers_mediu` / `progress_mediu` (în funcție de implementarea sa).
- **RTDB:** lock nu este configurat pe această pagină.

## Dacă se strică X, unde te uiți
- Întrebările nu apar: verifică dacă scriptul `y71.js` s-a încărcat (rețea/CDN) și parametru `chapter` din URL.
- Accesibilitatea nu se aplică: vezi patch-urile din blocul „AutoTest” (alias-uri și sanitize).
- Gard auth blochează pagina: verifică starea login-ului și lista de excepții din garduri.

## Legături utile
- [features/quizzes-learning-flow.md](../features/quizzes-learning-flow.md)
- [features/auth-and-routing.md](../features/auth-and-routing.md)
