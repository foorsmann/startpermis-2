# resetare-parola.html – Resetare parolă

## Ce face pagina
- Procesează link-ul de resetare trimis pe email (parametru `oobCode`).
- Permite introducerea unei parole noi și confirmarea acesteia.
- Afișează mesaje clare de succes sau eroare.

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
   - Citește `oobCode`/`mode` din URL și validează resetarea prin Firebase Auth.
   - Permite setarea noii parole dacă link-ul este valid.
   - Gestionează erori comune (link expirat/invalid).

## Evenimente declanșatoare
- Scriptul inline pornește după `DOMContentLoaded`/`Webflow.push`.
- Submite formularul de resetare → apelează `confirmPasswordReset` din Firebase.

## Chei localStorage
- `sp_auth_snapshot_v1` – snapshot auth.
- `sp-theme` – tema.

## Cum vorbește cu Firebase
- **Auth:** validează codul și setează noua parolă prin API-urile Firebase.
- Nu scrie în Firestore.

## Dacă se strică X
- Link invalid: asigură-te că URL-ul conține `mode=resetPassword` și `oobCode`.
- Butonul nu răspunde: verifică erorile din consolă și starea SDK-urilor Firebase.

## Legături utile
- [features/auth-and-routing.md](../features/auth-and-routing.md)
