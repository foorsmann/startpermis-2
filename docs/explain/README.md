# Ghid „explicat ca pentru începători”

Aceste fișiere îți arată, pe scurt și în română, cum este construit proiectul **Start Permis** și cum funcționează fiecare pagină și funcționalitate. Gândește-te la ele ca la un tur ghidat, cu termeni simpli și exemple.

## Cum folosești documentația
- Începe cu [00-architecture-overview.md](00-architecture-overview.md) pentru imaginea de ansamblu.
- Continuă cu [01-repo-map.md](01-repo-map.md) ca să știi „unde stă ce”.
- Pentru o listă rapidă a tuturor paginilor, vezi [02-pages-index.md](02-pages-index.md), apoi intră pe fișierul dedicat din `pages/`.
- Pentru detalii pe funcționalități (temă, autentificare, meniuri, setări, teste), vezi dosarul [features/](features/).
- Dacă vezi comportamente repetate în codul HTML, verifică [03-duplicate-inline-code-audit.md](03-duplicate-inline-code-audit.md).

## Cuprins rapid
- [00-architecture-overview.md](00-architecture-overview.md) – Ce este proiectul și cum rulează.
- [01-repo-map.md](01-repo-map.md) – Hartă pe dosare și fișiere importante.
- [02-pages-index.md](02-pages-index.md) – Index cu toate paginile și link-urile spre explicații dedicate.
- [pages/](pages/) – Câte un fișier pe fiecare pagină (ex.: `/pages/login.md`).
- [features/](features/) – Explicații pe teme, autentificare, meniuri, setări și fluxurile de teste/lecții.
- [03-duplicate-inline-code-audit.md](03-duplicate-inline-code-audit.md) – Snippete inline repetate și riscuri.

## Mic dicționar (glosar)
- **browser** – aplicația în care deschizi site-ul (Chrome, Safari).
- **buton CTA** – buton de acțiune („Începe”, „Login”).
- **click/tap** – apăsare pe mouse sau pe ecran.
- **Firebase** – serviciul din cloud folosit pentru logare și stocare date.
- **Firestore** – baza de date din Firebase (colecții și documente).
- **localStorage** – sertarul local din browser care ține mici informații.
- **RTDB** – Realtime Database din Firebase (mesaje în timp real între tab-uri).
- **SDK** – pachet de cod deja făcut (ex.: SDK-ul Firebase).
- **Webflow** – platforma prin care a fost generat HTML/CSS-ul site-ului.
- **Webflow.push** – coadă de inițializare pe care codul o folosește ca să pornească după ce HTML-ul e gata.
- **w-** – prefix de clasă standard din Webflow (ex.: `.w-button`).
