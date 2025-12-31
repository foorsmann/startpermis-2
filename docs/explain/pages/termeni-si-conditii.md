# termeni-si-conditii.html – Termeni de utilizare

## Ce face pagina
- Prezintă termenii și condițiile platformei.
- Include buton „Înapoi sus” pentru navigare pe pagină lungă.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. Patch inline pentru butonul `.top-btn`.
3. jQuery + `webflow.js` + Lottie.
4. Firebase SDK + Chart.js.
5. `js/firebase-config.js`.
6. `js/auth-guard-footer.js`.
7. `js/single-active-lock.js`.
8. `js/plyr.polyfilled-3.7.8.min.js`.
9. `js/theme.js`.

## Evenimente declanșatoare
- Scroll pentru butonul „sus”.
- `onAuthStateChanged` pentru gard.

## Chei localStorage
- `sp_auth_snapshot_v1` – snapshot auth.
- `sp-theme` – tema.

## Cum vorbește cu Firebase
- Doar pentru autentificare (gard). Nu citește/scrie date.

## Dacă se strică X
- Butonul „sus” nu funcționează: verifică scriptul inline și clasa `.top-btn`.
- Pagina albă: verifică gardul auth.

## Legături utile
- [features/dropdowns-and-menus.md](../features/dropdowns-and-menus.md)
- [features/auth-and-routing.md](../features/auth-and-routing.md)
- [features/theme.md](../features/theme.md)
