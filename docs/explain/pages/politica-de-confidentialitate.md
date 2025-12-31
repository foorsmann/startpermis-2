# politica-de-confidentialitate.html – Politică de confidențialitate

## Ce face pagina
- Afișează textul complet al politicii de confidențialitate.
- Include buton „Înapoi sus” pentru navigare ușoară pe pagină lungă.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. Patch inline pentru butonul `.top-btn` (aria, vizibilitate după scroll).
3. jQuery + `webflow.js` + Lottie.
4. Firebase SDK + Chart.js.
5. `js/firebase-config.js`.
6. `js/auth-guard-footer.js`.
7. `js/single-active-lock.js`.
8. `js/plyr.polyfilled-3.7.8.min.js`.
9. `js/theme.js`.

## Evenimente declanșatoare
- Scroll pentru a afișa/ascunde butonul „sus”.
- Gardul auth ascultă `onAuthStateChanged`.

## Chei localStorage
- `sp_auth_snapshot_v1` – snapshot auth.
- `sp-theme` – tema.

## Cum vorbește cu Firebase
- Doar verifică starea Auth prin gard; nu există citiri/scrieri de date.

## Dacă se strică X
- Butonul „sus” nu apare: verifică existența `.top-btn` și scriptul inline.
- Pagina albă: verifică gardul de auth și consola.

## Legături utile
- [features/dropdowns-and-menus.md](../features/dropdowns-and-menus.md)
- [features/auth-and-routing.md](../features/auth-and-routing.md)
- [features/theme.md](../features/theme.md)
