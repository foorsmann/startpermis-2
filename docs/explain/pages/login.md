# login.html – Autentificare

## Ce face pagina
- Permite autentificarea cu email + parolă sau Google.
- Afișează mesaje de eroare prietenoase și previne trimiteri multiple (buton cu spinner).
- Setează persistentă pe dispozitiv și creează profil minim în Firestore dacă lipsește.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. jQuery + `webflow.js` + Lottie.
3. Firebase SDK + Chart.js.
4. `js/firebase-config.js`.
5. `js/auth-guard-footer.js`.
6. `js/single-active-lock.js`.
7. `js/plyr.polyfilled-3.7.8.min.js`.
8. `js/theme.js`.
9. `js/login-handler.js` – logica formularului (validări, Auth, Google).

## Evenimente declanșatoare
- `Webflow.push`/`DOMContentLoaded` în `login-handler.js` pornește atunci când DOM-ul este gata.
- `onAuthStateChanged` este folosit intern pentru a seta persistentă și a actualiza snapshot-ul.
- Click pe butonul de „login” sau pe cel de Google declanșează apelurile Firebase.

## Chei localStorage
- `sp_auth_snapshot_v1` – actualizată de gardul auth.
- `sp-theme` – tema.
- Chei opționale de debug folosite de handler: `sp_debug`, `sp_login_debug` (dacă sunt setate la `1`, activează loguri).

## Cum vorbește cu Firebase
- **Auth:** `signInWithEmailAndPassword` sau `signInWithPopup/Redirect` pentru Google (folosește redirect pe iOS/Safari).
- **Firestore:** după login, `users/{uid}` este creat/actualizat (email, lastLogin, plan, counters).
- **Auth persistence:** încearcă `LOCAL`, apoi `SESSION` ca fallback.

## Dacă se strică X, unde te uiți
- Mesaje „domeniu neautorizat”: verifică lista de domenii în Firebase Authentication.
- Spinner blocat: vezi funcția `lock(btn, state)` din `login-handler.js`.
- Google nu pornește pe mobil: redirect fallback este deja activ; verifică dacă ferestrele pop-up nu sunt blocate.

## Legături utile
- [features/auth-and-routing.md](../features/auth-and-routing.md)
- [features/theme.md](../features/theme.md)
