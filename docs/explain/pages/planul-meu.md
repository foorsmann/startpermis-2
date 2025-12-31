# planul-meu.html – Pagina contului (planul meu)

## Ce face pagina
- Prezintă informații despre abonament/planul curent și link-uri către setări sau module.
- Este în principal statică (markup Webflow), folosind doar gardul de autentificare și tema.

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
- Gardul de auth ascultă `onAuthStateChanged`.
- Tema se aplică la `DOMContentLoaded`.

## Chei localStorage
- `sp_auth_snapshot_v1` – snapshot auth.
- `sp-theme` – tema.

## Cum vorbește cu Firebase
- Doar verifică starea de autentificare; nu are citiri/scrieri de date specifice în pagină.

## Dacă se strică X, unde te uiți
- Pagina nu se arată: verifică clasa `sp-auth-preload` și gardurile auth.
- Tema nepotrivită: verifică `js/theme.js` și cheia `sp-theme`.

## Legături utile
- [features/auth-and-routing.md](../features/auth-and-routing.md)
- [features/theme.md](../features/theme.md)
