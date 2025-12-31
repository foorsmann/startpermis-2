# codul-rutier.html – Listă capitole legislație

## Ce face pagina
- Afișează lista de capitole din „Codul rutier” și butoane către lecțiile detaliate.
- Include navbar cu login/profil și un buton „Înapoi sus”.
- Folosește animații Lottie pentru elemente decorative.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. Lottie (bodymovin) pentru animații din pagină.
3. Patch inline pentru navbar (arată/ascunde `.auth-btn` și `.user-logged-in-menu` în funcție de Auth).
4. Patch inline pentru top button `.top-btn` (rol „button”, aria-label, vizibil după scroll).
5. jQuery + `webflow.js` + Lottie Webflow runtime.
6. Firebase SDK + Chart.js.
7. `js/firebase-config.js`.
8. `js/auth-guard-footer.js`.
9. `js/single-active-lock.js` (disponibil, dar nu folosește lock aici).
10. `js/plyr.polyfilled-3.7.8.min.js`.
11. `js/theme.js`.
12. `js/sp-dropdown.js` pentru meniuri custom.
13. Script inline suplimentar pentru ajustări de UI (ex.: nav height).

## Evenimente declanșatoare
- `DOMContentLoaded`/`Webflow.push` pentru patch-ul de navbar.
- Scroll pentru butonul „Înapoi sus”.
- Auth guard reacționează la `onAuthStateChanged`.

## Chei localStorage
- `authIntent` – setată când se apasă pe `.auth-btn` pentru a ști că userul voia să se logheze.
- `sp_auth_snapshot_v1` – snapshot auth.
- `sp-theme` – tema.

## Cum vorbește cu Firebase
- Doar prin gardul de autentificare (nu are citiri/scrieri de date specifice).

## Dacă se strică X
- Navbar nu arată emailul: verifică patch-ul inline (căută blocul `DOMContentLoaded` cu `.auth-btn`) și Auth disponibil.
- Dropdown nu se deschide: verifică `js/sp-dropdown.js` și structura `[data-sp-dropdown]`.
- Buton „sus” nu apare: verifică existența `.top-btn` în markup.

## Legături utile
- [features/dropdowns-and-menus.md](../features/dropdowns-and-menus.md)
- [features/theme.md](../features/theme.md)
- [features/auth-and-routing.md](../features/auth-and-routing.md)
