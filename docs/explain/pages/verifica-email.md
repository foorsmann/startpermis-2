# verifica-email.html – Verifică și retrimite emailul de confirmare

## Ce face pagina
- Afișează statusul verificării emailului pentru userul logat.
- Permite retrimiterea emailului de verificare (cu cooldown).
- Poate detecta automat când userul a dat click pe link (ping din `sp_email_verified_at`).

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
   - Verifică dacă Auth este disponibil; altfel arată mesaj de eroare.
   - Citește `sp_email_verified_at` din localStorage pentru a vedea dacă alt tab a confirmat deja.
   - Trimite email de verificare (`sendEmailVerification`) cu respectarea unui cooldown (`STORAGE_VERIFIED_PING`).
   - Afișează buton de „Actualizează statusul” care reîncarcă starea din Firebase.

## Evenimente declanșatoare
- `DOMContentLoaded`/`Webflow.push` pornește logica.
- Click pe butonul „Trimite din nou” declanșează `sendEmailVerification`.
- `onAuthStateChanged` actualizează UI dacă userul devine verificat.
- Un `storage` event (din alt tab) cu `sp_email_verified_at` poate semnala succesul.

## Chei localStorage
- `sp_email_verified_at` – setată de `/confirmare-email` când link-ul este folosit.
- `sp_auth_snapshot_v1` – snapshot auth.
- `sp-theme` – tema.
- `sp_auth_hint_verify_email_v1` (sessionStorage) – indică faptul că utilizatorul a venit de la un flux care cere verificare.

## Cum vorbește cu Firebase
- **Auth:** citește `currentUser.emailVerified`, trimite `sendEmailVerification`, poate reîncărca userul (`user.reload()`).
- Nu scrie în Firestore.

## Dacă se strică X, unde te uiți
- Butonul de trimitere este dezactivat: verifică cooldown-ul (verifică timestamp-ul din localStorage).
- Statusul nu se schimbă după confirmare: apasă „Actualizează”, verifică `sp_email_verified_at` și conexiunea la Auth.
- Eroare de rețea: mesaj „network-request-failed” – verifică conexiunea și App Check.

## Legături utile
- [features/auth-and-routing.md](../features/auth-and-routing.md)
