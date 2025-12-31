# Pagina de setări (setari.html)

## Ce face
- Arată informațiile contului (email, status verificare).
- Permite schimbarea emailului/parolei, trimiterea unui nou email de verificare și resetarea parolei.
- Controlează preferințe UI: temă, sunete, vibrații/haptics, animații de răspuns corect.
- Oferă butoane de logout și ștergere cont (cu curățarea datelor din Firestore).
- Aplică cooldown-uri la trimiterea emailurilor de verificare/resetare ca să evite spam-ul.

## Unde trăiește (fișiere + selectori)
- Pagina: `setari.html`.
- Scripturi comune: auth guard, `firebase-config.js`, `theme.js`, `sp-dropdown.js`.
- Elemente cheie:
  - Toggle-uri: `[data-tg-theme]`, `[data-tg-sounds]`, `[data-tg-haptics]`, `[data-tg-correct-anim]`.
  - Mesaje: `[data-sp-msg]`, `[data-sp-err]`.
  - Acțiuni: `[data-sp-resend-verify]`, `[data-sp-reset-password]`, `[data-sp-change-email]`, `[data-sp-change-password]`, `[data-sp-signout]`, `[data-sp-delete-account]`.
  - Statut email: `[data-sp-email]`, `[data-sp-email-status]`.

## Cum curge datele
1. La inițializare ascunde UI-ul și arată un loader până obține utilizatorul curent din Firebase Auth.
2. Citește preferințele din localStorage și le aplică pe toggle-uri + tema (`sp_theme_v1`, `sp_ui_sounds_v1`, `sp_ui_haptics_v1`, `sp_ui_correct_anim_v1`).
3. Afișează emailul și statusul de verificare; rescrie culoarea statusului (verde/roșu).
4. Acțiuni utilizator:
   - **Trimite din nou verificare:** verifică cooldown (60s), poate salva timestamp și în RTDB (`emailVerification`).
   - **Reset parolă:** trimite email dacă nu există `resetPassword` activ, cu cooldown 60s.
   - **Schimbă email/parolă:** folosește metodele Firebase Auth și scrie emailul nou în `users/{uid}`.
   - **Logout:** `firebase.auth().signOut()`, golește intenția de auth.
   - **Ștergere cont:** șterge subcolecțiile de progres/răspunsuri (`progress_legislatie`, `progress_mediu`, `answers_mediu`, `progress_chestionare`, `answers_chestionare`), apoi contul din Auth.
5. După acțiuni, mesajele de succes/eroare se afișează în `[data-sp-msg]` / `[data-sp-err]` și se pot ascunde automat.

## Chei locale folosite
- `sp_theme_v1` – tema preferată (citită și aplicată imediat).
- `sp_ui_sounds_v1` – sunete on/off.
- `sp_ui_haptics_v1` – vibrații on/off.
- `sp_ui_correct_anim_v1` – animație de răspuns corect on/off.
- `sp_last_verify_sent_at_v1` – timestamp local pentru cooldown trimitere email verificare.
- `sp_last_reset_sent_at_v1` – timestamp local pentru cooldown resetare parolă.
- `authIntent` – resetat la logout.

## Probleme comune / edge cases
- Dacă `requiresRecentLogin` apare la schimbare email/parolă, utilizatorul trebuie să se relogheze (limitat de Firebase).
- Ștergerea contului trebuie să șteargă și datele derivate; dacă regulile Firestore nu permit, operația poate eșua.
- App Check inactiv poate duce la erori de permisiuni; verifică consola pentru `__spAppCheckUnavailable`.

## Unde te uiți dacă se strică
- Scriptul inline din `setari.html` (secțiunea mare după includerea scripturilor).
- Config și reguli: `firebase-config.js`, `firestore.rules`, `database.rules.json`.
- Loguri de rețea în DevTools pentru apelurile către Firestore/Auth.
