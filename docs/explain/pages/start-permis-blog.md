# start-permis-blog.html – Pagina blog

## Ce face pagina
- Prezintă conținutul secțiunii de blog (listă sau intro), generat din Webflow.
- Păstrează gardul de autentificare și tema, dar nu are logică dinamică suplimentară.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. jQuery + `webflow.js` + Lottie.
3. Firebase SDK + Chart.js.
4. `js/firebase-config.js`.
5. `js/auth-guard-footer.js`.
6. `js/single-active-lock.js`.
7. `js/plyr.polyfilled-3.7.8.min.js`.
8. `js/theme.js`.

## Evenimente declanșatoare
- Gardul auth pe `onAuthStateChanged`.
- Tema la `DOMContentLoaded`.

## Chei localStorage
- `sp_auth_snapshot_v1` – snapshot auth.
- `sp-theme` – tema.

## Cum vorbește cu Firebase
- Doar verifică starea Auth; nu scrie/citește date specifice blogului.

## Dacă se strică X
- Pagina nu apare: verifică `sp-auth-preload` și gardurile.
- Tema greșită: verifică `js/theme.js` și localStorage.

## Legături utile
- [features/auth-and-routing.md](../features/auth-and-routing.md)
