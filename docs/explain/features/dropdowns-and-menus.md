# Meniuri, dropdown-uri și navigare

## Ce fac
- Oferă meniuri personalizate care nu depind de comportamentul default Webflow.
- Adaugă accesibilitate (aria, escape pentru închidere, click în afara listei).
- Controlează butoanele „Login” vs. meniul de utilizator din navbar.
- Include butonul „Înapoi sus” pe paginile lungi.

## Unde trăiesc (fișiere + selectori)
- Motor dropdown: `js/sp-dropdown.js` (atribut `data-sp-dropdown`, `.w-dropdown-toggle` și `.w-dropdown-list`).
- Patch nav/auth (inline): prezent în `codul-rutier.html`, `contact.html`, `index.html`, `teste-examen.html`.
- Buton back-to-top: snippet inline prezent pe 9 pagini (vezi auditul de duplicate).
- Profil dropdown: elemente `.user-logged-in-menu`, `.auth-btn`, `.client-email-wrapper`, `.ms-email-tooltip`.

## Cum curge datele
1. La `DOMContentLoaded`, `sp-dropdown.js` caută toate `[data-sp-dropdown]`, setează `aria-expanded=false` și dezactivează atributele Webflow care ar face hover-delay.
2. Un click pe toggle deschide/închide dropdown-ul, închizându-le pe celelalte deja deschise.
3. Document click sau tasta Escape închid toate dropdown-urile.
4. Funcții expuse global (`window.SPDropdown`) pot fi chemate de alte scripturi pentru a forța închiderea (ex.: la logout).
5. Patch-ul de nav din paginile menționate afișează butoanele „Login” când nu e user și meniul cu email mascat când există user (folosește starea Firebase).
6. Butonul back-to-top devine vizibil după primul ecran de scroll și are `aria-label`/`tabindex` pentru tastatură.

## Chei locale folosite
- `authIntent` (localStorage) – setată când userul apasă „Login” din navbar; folosită după redirect pentru a decide ce UI să arate.

## Probleme comune / edge cases
- Dacă lipsesc clasele `.w-dropdown-toggle` sau `.w-dropdown-list` în interiorul unui `[data-sp-dropdown]`, consola va raporta un warning și dropdown-ul nu funcționează.
- Dacă Webflow runtime schimbă structura meniului, patch-ul inline pentru nav trebuie sincronizat (vezi auditul de duplicate).
- Butonul back-to-top nu se vede dacă `.top-btn` lipsește din markup.

## Unde te uiți dacă se strică
- Dropdown care nu se deschide/închide: `js/sp-dropdown.js` și markup-ul `[data-sp-dropdown]`.
- Navbar care nu arată emailul: snippet inline din pagină + disponibilitatea Firebase Auth.
- Back-to-top care nu apare: verifică existența `.top-btn` și scriptul inline aferent (vezi paginile listate în audit).
