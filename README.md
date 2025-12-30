# Start Permis

Platformă educațională pentru școli auto din România.

## Structura Proiectului

```
startpermis/
├── css/                      # Stiluri CSS
│   ├── normalize.css         # Reset CSS
│   ├── webflow.css           # Framework Webflow
│   └── webarcs-ultra-awesome-site.webflow.css  # Stiluri custom
├── js/                       # JavaScript
│   ├── webflow.js            # Bundle Webflow
│   ├── firebase-config.js    # Configurare Firebase
│   ├── auth-guard-head.js    # Auth guard (anti-flicker)
│   ├── auth-guard-footer.js  # Auth guard (verificare)
│   ├── single-active-lock.js # Lock pentru conținut
│   └── theme.js              # Dark/Light mode
├── images/                   # Imagini și assets
├── fonts/                    # Fonturi custom
├── documents/                # Animații Lottie (JSON)
├── .github/workflows/        # CI/CD GitHub Actions
├── firebase.json             # Configurare Firebase Hosting
├── firestore.rules           # Reguli Firestore
├── database.rules.json       # Reguli Realtime Database
├── storage.rules             # Reguli Firebase Storage
└── firestore.indexes.json    # Indexuri Firestore
```

## Pagini

| Pagină | Descriere |
|--------|-----------|
| `index.html` | Dashboard principal - toate modulele |
| `login.html` | Autentificare |
| `sign-up.html` | Înregistrare |
| `mediu-invatare.html` | Mediu de învățare |
| `teste-examen.html` | Teste pentru examen |
| `codul-rutier.html` | Codul rutier |
| `setari.html` | Setări utilizator |
| `contact.html` | Formular contact |

## Firebase Services

- **Authentication**: Google Sign-in
- **Firestore**: Date utilizatori, progres, conținut
- **Realtime Database**: Chapter locks, email verification
- **Hosting**: Deployment static
- **Storage**: Fișiere utilizatori (pregătit)

## Comenzi Utile

```bash
# Servire locală cu emulatoare Firebase
npm run serve

# Deploy doar hosting
npm run deploy

# Deploy toate serviciile (hosting + rules + indexes)
npm run deploy:all

# Deploy doar reguli
npm run deploy:rules
```

## Deployment

### Automatic (GitHub Actions)

- **PR Preview**: Orice PR primește un URL de preview
- **Production**: Push pe `main` deployază automat

### Manual

```bash
firebase deploy --project scaoalauto
```

## Configurare Firebase Console

1. **Authentication** → Sign-in method → Enable Google
2. **Firestore** → Rules → Copy din `firestore.rules`
3. **Realtime Database** → Rules → Copy din `database.rules.json`
4. **Hosting** → Already configured

## Security Headers

Configurate în `firebase.json`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## Caching

- **Imagini/Fonturi**: 1 an (immutable)
- **CSS/JS**: 5 minute (public, must-revalidate)
- **HTML**: No cache (always fresh)

## URLs Production

- https://scaoalauto.web.app
- https://scaoalauto.firebaseapp.com

## Dependențe externe și actualizare

- **Firebase SDK (gstatic)**: app/auth/firestore/database/app-check încărcate din `https://www.gstatic.com`.
- **Google Fonts**: fonturi de pe `fonts.googleapis.com` / `fonts.gstatic.com`.
- **Asset-uri Webflow**: imagini/audio/animații de pe `cdn.prod.website-files.com` și placeholder SVG de pe `d3e54v103j8qbb.cloudfront.net`.
- **Biblioteci self-hosted în `vendor/`** (versiuni fixate): Plyr 3.7.8 (`vendor/plyr`), Lottie-web 5.12.2 (`vendor/lottie`), Chart.js 4.4.2 (`vendor/chart`), jQuery 3.5.1 (`vendor/jquery`), WebFont Loader 1.6.26 (`vendor/webfont`).

Politică de actualizare:
1. Folosește `npm pack <pachet>@<versiune>` pentru a descărca arhiva, apoi înlocuiește fișierele din `vendor/` (CSS/JS).
2. Dacă adaugi/schimbi resurse externe, actualizează și `firebase.json` (CSP) + această listă.
3. Dacă revii la CDN pentru o bibliotecă, fixează o versiune explicită și adaugă `integrity` + `crossorigin="anonymous"` în HTML.
