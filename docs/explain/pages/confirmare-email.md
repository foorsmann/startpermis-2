# confirmare-email.html – Confirmă adresa de email

## Ce face pagina
- Procesează link-ul de verificare trimis pe email (`mode=verifyEmail` + `oobCode`).
- Afișează un card cu mesaj de succes sau eroare, fără să ceară acțiuni suplimentare.
- Trimite un „ping” local când confirmarea reușește, ca tab-ul anterior să știe.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. jQuery + `webflow.js` + Lottie.
3. Firebase SDK + Chart.js.
4. `js/firebase-config.js`.
5. `js/auth-guard-footer.js`.
6. `js/single-active-lock.js`.
7. `js/plyr.polyfilled-3.7.8.min.js`.
8. `js/theme.js`.
9. Script inline care:
   - Citește parametrii `mode` și `oobCode`.
   - Dacă `mode` nu este `verifyEmail`, arată mesaj de link invalid.
   - Folosește `firebase.auth().applyActionCode(oobCode)` pentru confirmare.
   - La succes: setează titlu + text pozitiv și scrie timestamp în `localStorage['sp_email_verified_at']`.
   - La eroare: afișează un mesaj prietenos (expirat, invalid, user inexistent etc.).

## Evenimente declanșatoare
- Scriptul inline pornește după `Webflow.push`/`DOMContentLoaded`.
- `applyActionCode` returnează un `Promise` care schimbă UI-ul la rezolvare.

## Chei localStorage
- `sp_email_verified_at` – salvează momentul confirmării pentru ca pagina `/verifica-email` să știe că s-a făcut.
- `sp_auth_snapshot_v1` – actualizat de gard.
- `sp-theme` – tema.

## Cum vorbește cu Firebase
- **Auth:** `applyActionCode` pe codul primit; nu scrie în Firestore.

## Dacă se strică X, unde te uiți
- Mesaj „Firebase Auth nu este încărcat”: verifică dacă SDK-urile sunt blocate de rețea/AdBlock.
- Eroare „link invalid/expirat”: confirmă că URL-ul include `mode=verifyEmail` și `oobCode`.
- UI nu apare: verifică preloaderul `.ev-preload` și consola pentru erori JS.

## Legături utile
- [features/auth-and-routing.md](../features/auth-and-routing.md)
