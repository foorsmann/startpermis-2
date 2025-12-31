# Tema (mod lumina/întuneric)

## Ce face
- Permite schimbarea rapidă între temă luminoasă și întunecată.
- Păstrează preferința în browser pentru sesiuni viitoare.
- Se aliniază cu preferința de sistem dacă nu există o alegere salvată.

## Unde trăiește (fișiere + selectori)
- Logica: `js/theme.js`.
- Atribut de stare: `data-theme` pe elementul `<html>`.
- Checkbox-urile de control: `.theme-checkbox` (sincronizate automat cu tema curentă).

## Cum curge datele (simplificat)
1. La încărcare, `theme.js` citește `localStorage['sp-theme']` (sau preferința de sistem) și setează `data-theme` (`light` sau `dark`).
2. Bifează/debifează toate `.theme-checkbox` ca să reflecte starea actuală.
3. Când utilizatorul schimbă checkbox-ul, scriptul setează `data-theme`, salvează în `localStorage['sp-theme']` și emite evenimentul `themechange`.
4. Dacă sistemul își schimbă preferința și nu există o alegere salvată, scriptul actualizează tema automat.

## Chei locale folosite
- `sp-theme` (localStorage) – tema aleasă.  
  Notă: `setari.html` citește și `sp_theme_v1` pentru compatibilitate veche, dar tema nouă folosește `sp-theme`.

## Bune de știut / edge cases
- Dacă nu există suport `matchMedia`, tema default este luminoasă.
- Checkbox-urile se sincronizează între ele; nu e nevoie de cod suplimentar per pagină.
- Dacă vezi culori amestecate, verifică dacă elementul respectă `data-theme` în CSS.

## Unde te uiți dacă se strică
- `js/theme.js` pentru logica principală.
- CSS din Webflow care depinde de `[data-theme="dark"]`/`[data-theme="light"]`.
- `localStorage` pentru cheia `sp-theme` (poate fi ștearsă pentru reset).
