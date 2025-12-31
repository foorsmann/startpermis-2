# 03. Audit de cod inline duplicat

Acest fișier notează bucățile de JavaScript inline care apar identic în mai multe pagini. Nu schimbă produsul, dar e util să știi unde sunt și ce riscuri aduc dacă se modifică.

## Loader de fonturi Google (22 pagini)
- **Snippet:** `WebFont.load({ google: { families: [...] } });`
- **Unde:** toate paginile (`401.html`, `404.html`, `auth.html`, `capitole-legislatie.html`, `codul-rutier.html`, `confirmare-email.html`, `contact.html`, `index.html`, `login.html`, `mediu-invatare.html`, `planul-meu.html`, `politica-de-confidentialitate.html`, `politica-de-cookie-uri.html`, `resetare-parola.html`, `setari.html`, `sign-up.html`, `start-permis-blog.html`, `termeni-si-conditii.html`, `teste-examen-chestionare.html`, `teste-examen.html`, `teste-mediu-invatare.html`, `verifica-email.html`).
- **Face:** descarcă fonturile Kanit, Montserrat, Inter înainte de afișare.
- **Risc:** dacă se schimbă familia de font într-un singur loc, restul paginilor rămân vechi; de aceea e bine de extras într-un fișier JS comun dacă va fi nevoie de modificări.

## Detector „w-mod-js”/touch (22 pagini)
- **Snippet:** funcția auto-invocată care adaugă clasele `w-mod-js` și `w-mod-touch` pe `<html>`.
- **Unde:** aceleași 22 pagini de mai sus.
- **Face:** marchează pagina pentru comportamente Webflow (stiluri condiționale pentru touch/non-touch).
- **Risc:** foarte mic; doar redundanță. Dacă se elimină accidental dintr-o pagină, pot lipsi anumite efecte CSS acolo.

## Patch pentru butoanele de autentificare din navbar (4 pagini)
- **Snippet:** `document.addEventListener('DOMContentLoaded', function () { const authBtns = [...document.querySelectorAll('.auth-btn')]; ... });`
- **Unde:** `codul-rutier.html`, `contact.html`, `index.html`, `teste-examen.html`.
- **Face:** ascunde/arată butoanele „Login” vs. meniul de utilizator și conectează dropdown-ul profilului.
- **Risc:** dacă modifici clasele navbar pe o pagină, comportamentul poate rămâne inconsistent pe celelalte (inclusiv focus/aria pentru dropdown).

## Buton „înapoi sus” (back-to-top) (9 pagini)
- **Snippet:** funcție auto-invocată cu `var btn = document.querySelector('.top-btn'); ...` care setează rol/aria și arată butonul după primul ecran scroll.
- **Unde:** `codul-rutier.html`, `contact.html`, `index.html`, `mediu-invatare.html`, `politica-de-confidentialitate.html`, `politica-de-cookie-uri.html`, `setari.html`, `termeni-si-conditii.html`, `teste-examen.html`.
- **Face:** activează butonul flotant „sus”, cu accesibilitate (aria-label, tabindex) și animație.
- **Risc:** codul este duplicat inline; schimbările trebuie propagate manual în toate paginile pentru a păstra aceeași experiență.

## Recomandare generală
Pe viitor, aceste snippete pot fi mutate într-un fișier JS comun și încărcate global (după `webflow.js`), pentru a reduce riscul de diferențe între pagini.
