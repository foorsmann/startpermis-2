# politica-de-cookie-uri.html – Politica de cookie-uri

## Ce face pagina
- Prezintă politica de cookie-uri a site-ului.
- Include buton „Înapoi sus” pentru navigare rapidă.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. Patch inline pentru `.top-btn`.
3. jQuery + `webflow.js` + Lottie.
4. Firebase SDK + Chart.js.
5. `js/firebase-config.js`.
6. `js/auth-guard-footer.js`.
7. `js/single-active-lock.js`.
8. `js/plyr.polyfilled-3.7.8.min.js`.
9. `js/theme.js`.

## Evenimente declanșatoare
- Scroll pentru butonul „sus”.
- Gard auth pe `onAuthStateChanged`.

## Chei localStorage
- `sp_auth_snapshot_v1` – snapshot auth.
- `sp-theme` – tema.

## Cum vorbește cu Firebase
- Doar verifică Auth prin gard; nu are alte interacțiuni.

## Dacă se strică X
- Butonul „sus” nu apare: verifică markup-ul `.top-btn` și scriptul inline.
- Pagina rămâne ascunsă: verifică gardurile auth.

## Legături utile
- [features/dropdowns-and-menus.md](../features/dropdowns-and-menus.md)
- [features/auth-and-routing.md](../features/auth-and-routing.md)
- [features/theme.md](../features/theme.md)
