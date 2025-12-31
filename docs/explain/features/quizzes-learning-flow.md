# Teste, chestionare și mediu de învățare

## Ce fac
- Oferă două tipuri de exercițiu: „Mediu de învățare” (întrebări pe capitole) și „Examen/Chestionar” (simulare cronometrată).
- Salvează progresul și răspunsurile, astfel încât utilizatorul să continue de unde a rămas.
- Arată rezultate finale și evidențiază întrebările greșite pentru reluare.
- Evită deschiderea aceluiași conținut în mai multe tab-uri (single-active lock).

## Unde trăiesc (pagini + colecții)
- **Hub-uri:**  
  - `index.html` – afișează progresul general (Legislație, Mediu, Simulare) din Firestore.  
  - `teste-examen.html` – listă de simulări/chestionare, cu dropdown-uri și link-uri către chestionare concrete.  
  - `mediu-invatare.html` – listă capitole de învățare cu bare verzi/roșii și procent.
- **Pagini de exerciții:**  
  - `teste-mediu-invatare.html` – întrebări pe capitol (loader extern `y71.js`).  
  - `teste-examen-chestionare.html` – simulare chestionar cu timer localStorage.  
  - `capitole-legislatie.html` – parcurgere lecții cu text/video/quiz-uri secvențiale.
- **Firestore (colecții cheie):** `legislatie_chapters`, `legislatie_pages`, `mediu_invatare_chapters`, `mediu_invatare_pages`, `simulare_chestionare_pages`, subcolecțiile utilizatorului `answers_*`, `progress_*`.
- **RTDB:** `chapterLocks` (prin `single-active-lock.js`) pentru blocarea accesului pe aceeași lecție.

## Cum curge datele (simplu)
1. **Hub-uri de progres (index/mediu):** citesc userul curent din Auth; dacă există, atașează listeners Firestore:
   - `progress_legislatie` + `legislatie_*` pentru procentul de lecții vizualizate.
   - `answers_mediu` / `answers_chestionare` pentru numărul de întrebări rezolvate.
   - Rezultatele se mapează pe carduri cu clase precum `.module-card`, `.liquid-chart`, `.chapter-progress-bar-outer`.
2. **Mediu de învățare (per capitol):**  
   - `teste-mediu-invatare.html` încarcă scriptul extern `y71.js` care citește capitolul din query param `chapter`, randează întrebări, salvează răspunsuri și progres în Firestore sub `answers_mediu` / `progress_mediu`.  
   - Patch-uri de accesibilitate (alias-uri de clase, sanitize text) rulează înainte de loader.
3. **Simulare chestionar:**  
   - `teste-examen-chestionare.html` ia întrebările din `simulare_chestionare_pages` (filtrate după `Numar Chestionar`), le sortează, și pornește un timer de 26 min.  
   - Răspunsurile și progresul se memorează local în `localStorage` (chei `exam_chestionar_v4:*`) și pot fi trimise în Firestore (colecția `answers_chestionare`).  
   - UI permite mod „greșite”, sărit peste întrebări și reinițializare.
4. **Lecții legislație (capitole):**  
   - `capitole-legislatie.html` cere pagina curentă din colecția `legislatie_pages`, arată video/text/poză, marchează progresul și ecranul final, plus „lock” RTDB ca să nu fie deschis același capitol în alt tab.

## Chei locale folosite
- `exam_chestionar_v4:answers:<uid/guest>:<nr>` – răspunsuri curente la chestionar.
- `exam_chestionar_v4:progress:<uid/guest>:<nr>` – progres (corecte/greșite/finale).
- `exam_chestionar_v4:timer:<uid/guest>:<nr>` – starea timerului.
- `exam_chestionar_v4:ui:<uid/guest>:<nr>` – ecran curent (întrebări vs. rezultate, mod „greșite”).
- `sp_ui_*` (din setări) pot fi folosite de loaderul extern pentru sunete/haptics.

## Probleme comune / edge cases
- Dacă Firestore nu este accesibil, hub-urile randază progresul ca 0% și afișează mesaje de eroare.
- Timerul chestionarului se bazează pe timpul local; dacă utilizatorul schimbă ora sistemului sau șterge localStorage, cronometrarea poate fi afectată.
- Loaderul extern din `teste-mediu-invatare.html` depinde de CDN; are fallback pe același URL. În lipsă de rețea, lecția nu se va încărca.
- Single-active-lock necesită RTDB; dacă regulile nu permit scrierea, blocarea multi-tab nu va funcționa.

## Unde te uiți dacă se strică
- Pentru hub-uri: scripturile inline din `index.html` și `mediu-invatare.html`.
- Pentru capitole legislație: inline în `capitole-legislatie.html` și colecțiile `legislatie_*` din Firestore.
- Pentru chestionare simulare: inline din `teste-examen-chestionare.html` + colecția `simulare_chestionare_pages`.
- Pentru mediu pe capitole: loaderul extern `y71.js` (vine din CDN), plus patch-urile inline din `teste-mediu-invatare.html`.
