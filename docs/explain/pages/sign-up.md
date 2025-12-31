# sign-up.html – Creare cont

## Ce face pagina
- Creează un cont nou cu email + parolă sau Google.
- Verifică lungimea parolei și acceptarea termenilor (dacă sunt bifați în formular).
- Salvează profil minim în Firestore și setează persistentă Auth.
- Redirecționează spre pagina principală și cere verificarea emailului.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. jQuery + `webflow.js` + Lottie.
3. Firebase SDK + Chart.js.
4. `js/firebase-config.js`.
5. `js/auth-guard-footer.js`.
6. `js/single-active-lock.js`.
7. `js/plyr.polyfilled-3.7.8.min.js`.
8. `js/theme.js`.
9. `js/signup-handler.js` – logica de creare cont.

## Evenimente declanșatoare
- `Webflow.push`/`DOMContentLoaded` pornește handlerul.
- Submit formular (email/parolă) → `createUserWithEmailAndPassword`.
- Click pe butonul Google → `signInWithPopup/Redirect`.
- Schimbare checkbox termen/abonare → validări locale.

## Chei localStorage
- `sp_auth_snapshot_v1` – snapshot auth.
- `sp-theme` – tema.
- Chei opționale de debug: `sp_debug`, `sp_signup_debug`, `sp_login_debug`.
- `sp_auth_hint_verify_email_v1` (sessionStorage) – setată pentru a afișa mesaje pe `/verifica-email`.
- `sp_signup_google_consent_v1` – folosit intern pentru Google consent.

## Cum vorbește cu Firebase
- **Auth:** creează utilizator, setează persistentă LOCAL (fallback SESSION), Google OAuth cu fallback redirect pe iOS/Safari.
- **Firestore:** scrie profilul în `users/{uid}` (email, timestamps, plan „free”, termeni acceptați).

## Dacă se strică X, unde te uiți
- Eroare „email in use / domeniu neautorizat”: verifică setările Firebase Authentication.
- Mesajele nu apar: vezi elementele `[data-error]` și `.w-form-fail` în formular.
- Google nu merge pe mobil: fallback redirect este deja activ; verifică pop-up blocker.

## Legături utile
- [features/auth-and-routing.md](../features/auth-and-routing.md)
- [features/theme.md](../features/theme.md)
