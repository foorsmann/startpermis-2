# contact.html – Pagina de contact

## Ce face pagina
- Oferă formular de contact și informații de suport (email, social, locație).
- Include meniul de utilizator și buton „Înapoi sus”.
- Încarcă reCAPTCHA (script Google) pentru protecția formularului.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. Lottie (bodymovin) pentru animații.
3. Patch inline pentru navbar (login/profil) și auth intent.
4. Patch inline pentru butonul `.top-btn`.
5. jQuery + `webflow.js` + Lottie runtime.
6. Firebase SDK + Chart.js.
7. `js/firebase-config.js`.
8. `js/auth-guard-footer.js`.
9. `js/single-active-lock.js`.
10. `js/plyr.polyfilled-3.7.8.min.js`.
11. `js/theme.js`.
12. `js/sp-dropdown.js`.
13. Script inline final (după dropdown) pentru eventuale ajustări.
14. `https://www.google.com/recaptcha/api.js` (protejează formularul Webflow).

## Evenimente declanșatoare
- `DOMContentLoaded`/`Webflow.push` pentru patch-ul de navbar și butonul „sus”.
- Scroll pentru a afișa `.top-btn`.
- Interacțiunile formularului sunt gestionate de Webflow + reCAPTCHA.

## Chei localStorage
- `authIntent` – salvat când userul apasă pe login din navbar.
- `sp_auth_snapshot_v1` – snapshot auth.
- `sp-theme` – tema.

## Cum vorbește cu Firebase
- Doar gardul de auth; formularul de contact este nativ Webflow + reCAPTCHA (fără Firestore).

## Dacă se strică X
- Formularul nu se trimite: verifică reCAPTCHA (poate fi blocată de extensii).
- Meniul profilului nu apare: verifică patch-ul inline și starea Auth.
- Butonul „sus” lipsă: confirmă existența `.top-btn` în markup.

## Legături utile
- [features/dropdowns-and-menus.md](../features/dropdowns-and-menus.md)
- [features/auth-and-routing.md](../features/auth-and-routing.md)
- [features/theme.md](../features/theme.md)
