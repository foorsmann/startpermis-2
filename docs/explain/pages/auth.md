# auth.html – Redirector pentru acțiuni Firebase

## Ce face pagina
- Primește link-urile speciale trimise de Firebase (cu parametru `mode`).
- Redirecționează imediat:
  - `mode=verifyEmail` → `/confirmare-email` (păstrează query string-ul).
  - `mode=resetPassword` → `/resetare-parola` (păstrează query string-ul).
- Dacă nu există parametri, scoate starea de preload și arată un fallback simplu.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow.
2. `js/auth-guard-head.js` – ascunde până află starea (pagina este publică, dar snapshot-ul e actualizat).
3. CSS/JS Webflow standard.
4. Firebase SDK + Chart.js.
5. `js/firebase-config.js`.
6. `js/auth-guard-footer.js`.
7. `js/single-active-lock.js`.
8. `js/plyr.polyfilled-3.7.8.min.js`.
9. `js/theme.js`.
10. Script inline scurt care citește `mode` și face `location.replace(...)` către pagina potrivită.

## Evenimente declanșatoare
- Redirecția se întâmplă imediat la evaluarea scriptului inline (nu așteaptă DOMContentLoaded).
- Gardul auth reacționează la `onAuthStateChanged`.

## Chei localStorage
- `sp_auth_snapshot_v1` – actualizată de gard.
- `sp-theme` – tema site-ului.

## Interacțiuni Firebase
- Doar pentru auth state (gard). Nu citește date.

## Dacă se strică X
- Linkurile Firebase nu mai funcționează: verifică logica de mapping din scriptul inline (căută `mode === 'verifyEmail'`).
- Rămâne ecran alb: vezi gardurile auth sau erori de rețea la Firebase.

## Legături utile
- [features/auth-and-routing.md](../features/auth-and-routing.md)
