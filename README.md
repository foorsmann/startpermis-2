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
- **CSS/JS**: 1 săptămână
- **HTML**: No cache (always fresh)

## Fonturi

- **Google Fonts**: `Montserrat` (400–700), `Kanit` (200–700), `Inter` (400/600/700) încărcate prin `WebFont.load` doar cu variantele utilizate.
- **Fonturi locale**: `Gismo Trial Semirectangular` (2 versiuni), `Gismo YYY Semirectangular`, `Ooogismo Trial Semirectangular`, `Globet FFP` (Regular/Bold), `BinariaDisplayStencil`, `MazzardSoftM` (Light/Light Italic), `TT Octosquares Trial Condensed` (700/900).
- **Politică**: adaugă noi fonturi doar dacă există un stil care le folosește; șterge definițiile și fișierele neutilizate după exporturi Webflow pentru a evita request-uri 404 și asset-uri inutile.

## URLs Production

- https://scaoalauto.web.app
- https://scaoalauto.firebaseapp.com
