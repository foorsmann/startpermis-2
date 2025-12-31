# setari.html – Setări cont și preferințe

## Ce face pagina
- Arată emailul și statusul de verificare.
- Permite schimbarea emailului/parolei, trimiterea unui nou email de confirmare, resetarea parolei, logout și ștergerea contului.
- Controlează preferințe UI (temă, sunete, vibrații, animații răspuns).
- Aplică cooldown pentru emailurile de verificare/resetare ca să prevină spamul.

## Scripturi care rulează (ordine)
1. Loader fonturi + detector Webflow + auth guard (head).
2. Lottie (bodymovin) + patch inline pentru nav/auth intent și buton „sus”.
3. jQuery + `webflow.js` + Lottie runtime.
4. Firebase SDK + Chart.js.
5. `js/firebase-config.js`.
6. `js/auth-guard-footer.js`.
7. `js/single-active-lock.js`.
8. `js/plyr.polyfilled-3.7.8.min.js`.
9. `js/theme.js`.
10. `js/sp-dropdown.js`.
11. Script inline mare (după scripturi) care:
    - Ascunde UI-ul până când Auth este gata, apoi populează emailul și statusul.
    - Leagă butoane pentru resend verify, reset parolă, change email/parolă, logout, delete account.
    - Aplică preferințe locale pe toggle-uri și le salvează în localStorage + Firestore (`users/{uid}`).
    - Șterge subcolecțiile de progres/răspunsuri și contul la „delete”.

## Evenimente declanșatoare
- Click pe `[data-sp-resend-verify]`, `[data-sp-reset-password]`, `[data-sp-change-email]`, `[data-sp-change-password]`, `[data-sp-signout]`, `[data-sp-delete-account]`.
- Schimbare toggle-uri de temă/sunete/haptics/animație.
- `onAuthStateChanged` pentru încărcarea userului.

## Chei localStorage
- `sp_theme_v1` – tema preferată (aplicată imediat).
- `sp_ui_sounds_v1`, `sp_ui_haptics_v1`, `sp_ui_correct_anim_v1` – preferințe UI.
- `sp_last_verify_sent_at_v1` – timestamp local pentru cooldown email de verificare.
- `sp_last_reset_sent_at_v1` – cooldown reset parolă.
- `authIntent` – resetat la logout.
- `sp_auth_snapshot_v1`, `sp-theme` – chei comune pentru gard și temă.

## Cum vorbește cu Firebase
- **Auth:** schimbă email/parolă, trimite emailuri de verificare/resetare, face logout și delete user.
- **Firestore:** citește și scrie profilul în `users/{uid}`, șterge subcolecțiile de progres/răspunsuri la delete.
- **RTDB (opțional):** poate scrie timpi de cooldown (cai `emailVerification`, `sessionLocks`, `chapterLocks`) dacă regulile permit.

## Dacă se strică X, unde te uiți
- Eroare `requires-recent-login`: userul trebuie să se relogheze înainte de schimbarea datelor sensibile.
- Setările nu se salvează: verifică `localStorage` pentru cheile de mai sus și permisiunile Firestore.
- Ștergerea contului nu curăță datele: vezi funcția `deleteCollectionAll` din scriptul inline și regulile Firestore.

## Legături utile
- [features/settings-page.md](../features/settings-page.md)
- [features/auth-and-routing.md](../features/auth-and-routing.md)
- [features/theme.md](../features/theme.md)
