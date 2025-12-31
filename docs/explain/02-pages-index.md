# 02. Indexul paginilor

Mai jos sunt toate paginile HTML din proiect, cu scopul lor și link spre explicația dedicată din `pages/`.

- [index.html](pages/index.md) – „Toate Modulele”: hub cu progres pentru legislație, mediu de învățare și simulări (Firestore live, grafice). Scripturi: auth guard, Firebase config, `theme.js`, `sp-dropdown.js`, loader progres inline.
- [mediu-invatare.html](pages/mediu-invatare.md) – listă de capitole de învățare, randate din Firestore cu bare verzi/roșii și loader. Scripturi: auth guard, Firebase config, `theme.js`, `sp-dropdown.js`, randare progres inline.
- [capitole-legislatie.html](pages/capitole-legislatie.md) – pagină de lecție pentru un capitol, cu video/imagine, acordeon text, progres și lock de sesiune RTDB. Scripturi: auth guard, Firebase config, `single-active-lock.js`, logica lecției inline.
- [codul-rutier.html](pages/codul-rutier.md) – listă generală de capitole de legislație și navigare către lecții. Scripturi: auth guard, Firebase config, `sp-dropdown.js`, patch-uri nav/back-to-top inline.
- [teste-mediu-invatare.html](pages/teste-mediu-invatare.md) – ecran de întrebări pe capitol (mediu de învățare), cu loader extern `y71.js` și patch-uri de accesibilitate. Scripturi: auth guard, Firebase config, loader extern.
- [teste-examen.html](pages/teste-examen.md) – hub pentru simulări și chestionare, cu dropdown-uri, patch-uri nav și autentificare intent. Scripturi: auth guard, Firebase config, `sp-dropdown.js`, cod inline pentru nav și accesibilitate.
- [teste-examen-chestionare.html](pages/teste-examen-chestionare.md) – simulare de chestionar cu timer, salvare în localStorage, Firestore pentru întrebări, ecrane final/întrebări greșite. Scripturi: auth guard, Firebase config, logica completă inline.
- [planul-meu.html](pages/planul-meu.md) – pagină cont/plan (interfață statică în Webflow, cu auth guard și tema). Scripturi: auth guard, Firebase config, `theme.js`.
- [setari.html](pages/setari.md) – setări cont: email, parolă, preferințe UI (tema, sunete), ștergere cont, cooldown-uri. Scripturi: auth guard, Firebase config, `sp-dropdown.js`, logica setărilor inline.
- [contact.html](pages/contact.md) – formular contact + carduri info, cu patch nav/back-to-top și auth intent. Scripturi: auth guard, Firebase config, `sp-dropdown.js`.
- [login.html](pages/login.md) – formă de autentificare clasică + Google, gestionată de `js/login-handler.js`.
- [sign-up.html](pages/sign-up.md) – creare cont, validare parolă, acceptare termeni, gestionată de `js/signup-handler.js`.
- [resetare-parola.html](pages/resetare-parola.md) – flux de resetare parolă via link Firebase, cu feedback UI. Scripturi inline + auth guard.
- [verifica-email.html](pages/verifica-email.md) – ecran pentru re-trimitere email de verificare și buton de refresh status. Scripturi inline + auth guard.
- [confirmare-email.html](pages/confirmare-email.md) – pagina care consumă link-ul `verifyEmail` și confirmă contul, cu feedback text. Script inline + auth guard.
- [auth.html](pages/auth.md) – router scurt: redirecționează link-urile Firebase (verify/reset) către paginile dedicate.
- [401.html](pages/401.md) – mesaj „protected page” atunci când gardul blochează accesul.
- [404.html](pages/404.md) – pagina standard „Not Found”.
- [politica-de-confidentialitate.html](pages/politica-de-confidentialitate.md) – text legal + patch nav/back-to-top.
- [politica-de-cookie-uri.html](pages/politica-de-cookie-uri.md) – text legal + patch nav/back-to-top.
- [termeni-si-conditii.html](pages/termeni-si-conditii.md) – termeni de utilizare + patch nav/back-to-top.
- [start-permis-blog.html](pages/start-permis-blog.md) – listă/intro blog (statică, cu auth guard).
- [auth.html](pages/auth.md) – redirector pentru acțiuni Firebase (inclus deja mai sus).
