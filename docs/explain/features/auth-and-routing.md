# Autentificare și rutare protejată

## Ce face
- Ascunde paginile protejate până află dacă utilizatorul este logat și are email verificat.
- Redirecționează automat spre login sau spre pagina de verificare email, după caz.
- Ține un „snapshot” cache în localStorage ca să reducă flicker-ul.
- Gestionează login/sign-up/resetare parolă + Google OAuth.

## Unde trăiește (fișiere + selectori)
- Gard de auth (head): `js/auth-guard-head.js` – rulează înainte de randare.
- Gard de auth (footer): `js/auth-guard-footer.js` – rulează după ce Firebase este disponibil.
- Pagini formulare: `login.html` (`js/login-handler.js`), `sign-up.html` (`js/signup-handler.js`), `resetare-parola.html`, `verifica-email.html`, `confirmare-email.html`.
- Redirector acțiuni Firebase: `auth.html` (mută `mode=verifyEmail` spre `/confirmare-email` și `mode=resetPassword` spre `/resetare-parola`).
- Clase/markere: `.sp-auth-preload` pe `<html>` ascunde corpul până la verdict.

## Cum curge datele (pas cu pas)
1. **Head guard:** normalizează URL-ul, ignoră paginile publice, citește `localStorage['sp_auth_snapshot_v1']`:
   - Dacă snapshot-ul spune „logat, dar email neverificat” și e proaspăt, redirecționează la `/verifica-email`.
   - Dacă snapshot-ul spune „anonim” sau „verificat”, lasă pagina să continue.
   - Dacă nu are snapshot proaspăt, pune clasa `sp-auth-preload` pe `<html>` ca să ascundă conținutul.
2. **Footer guard:** așteaptă `firebase.auth()`, ascultă `onAuthStateChanged`:
   - Salvează snapshot nou în `sp_auth_snapshot_v1` (cu TTL-uri diferite pentru anonimi vs. verificați).
   - Dacă userul e neverificat și pagina nu e în lista de excepții, redirecționează la `/verifica-email` (salvează și `sessionStorage['sp_return_after_verify']`).
   - Dacă auth nu răspunde în ~12s, arată pagina ca fallback.
3. **Login/Sign-up:** formularele din `login.html` și `sign-up.html` folosesc Firebase Auth (email+parolă, Google):
   - Scriu/actualizează documentul utilizatorului în Firestore (`users/{uid}`) cu profil minim și termeni acceptați.
   - Setează persistentă LOCAL (fallback SESSION).
   - Semnalează necesitatea verificării emailului prin `sessionStorage['sp_auth_hint_verify_email_v1']`.
4. **Resetare parolă:** `resetare-parola.html` citește `oobCode` din URL, validează și permite setarea unei parole noi.
5. **Verificare email:**  
   - `verifica-email.html` trimite/resetează emailul de verificare, afișează starea curentă, folosește Firestore doar pentru afișare profil.  
   - `confirmare-email.html` aplică `oobCode`, marchează reușita și trimite un „ping” local prin `localStorage['sp_email_verified_at']`.

## Chei locale folosite
- `sp_auth_snapshot_v1` (localStorage) – stare auth cache (anonim/logat, verificat sau nu).
- `sp_return_after_verify` (sessionStorage) – URL-ul de revenire după confirmarea emailului.
- `sp_email_verified_at` (localStorage) – ping local când link-ul de confirmare a reușit.
- `authIntent` (localStorage) – setat de butoane de login din navbar ca să continue fluxul corect după redirect.

## Bune de știut / edge cases
- Listele de excepții (pagini publice) sunt hard-codate în garduri; dacă adaugi o pagină publică nouă, trebuie adăugată în ambele fișiere.
- TTL snapshot diferă: 24h pentru anonimi/verificați, 10 minute pentru neverificați (ca să împingă userul spre verificare).
- Google OAuth are fallback „redirect” pe iOS/Safari și în aplicații in-app.
- Dacă App Check nu pornește (mesaj `__spAppCheckUnavailable`), autentificarea continuă dar cu protecție redusă.

## Unde te uiți dacă se strică
- Pentru blocaje/redirecturi greșite: `js/auth-guard-head.js` și `js/auth-guard-footer.js`.
- Pentru probleme de login/sign-up: `js/login-handler.js`, `js/signup-handler.js` și form markup din paginile respective.
- Pentru fluxuri email (verify/reset): `verifica-email.html`, `confirmare-email.html`, `resetare-parola.html`, `auth.html`.
- Pentru probleme de permisiuni: regulile din `firestore.rules` și `database.rules.json`.
