# teste-examen.html – Hub simulări și chestionare

## Ce face pagina
- Prezintă opțiuni de testare: simulări, chestionare, butoane către mediu de învățare.
- Include meniuri dropdown custom și buton „Înapoi sus”.
- Pregătește intenția de autentificare pentru link-uri care cer login.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. Lottie (bodymovin) + patch inline pentru navbar (auth intent) și pentru top button.
3. jQuery + `webflow.js` + Lottie runtime.
4. Firebase SDK + Chart.js.
5. `js/firebase-config.js`.
6. `js/auth-guard-footer.js`.
7. `js/single-active-lock.js`.
8. `js/plyr.polyfilled-3.7.8.min.js`.
9. `js/theme.js`.
10. `js/sp-dropdown.js` – dropdown-uri pentru profil și filtre.
11. Script inline suplimentar (similar cu navbar patch) pentru accesibilitate și nav height.

## Evenimente declanșatoare
- Click pe elementele dropdown `[data-sp-dropdown]`.
- Scroll pentru butonul „sus”.
- `onAuthStateChanged` prin gardul auth.

## Chei localStorage
- `authIntent` – setată când utilizatorul apasă pe buton de login.
- `sp_auth_snapshot_v1` – snapshot auth.
- `sp-theme` – tema.

## Cum vorbește cu Firebase
- Doar prin gardul de autentificare; listarea testelor este statică în HTML.

## Dacă se strică X, unde te uiți
- Dropdown nu funcționează: verifică `js/sp-dropdown.js` și structura `[data-sp-dropdown]`.
- Butonul „sus” nu apare: confirmă `.top-btn` în pagină.
- Redirecționări neașteptate: vezi gardurile auth și lista de pagini publice/excepții.

## Legături utile
- [features/quizzes-learning-flow.md](../features/quizzes-learning-flow.md)
- [features/dropdowns-and-menus.md](../features/dropdowns-and-menus.md)
- [features/auth-and-routing.md](../features/auth-and-routing.md)
