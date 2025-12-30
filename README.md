# Start Permis

Platforma educationala pentru scoli auto din Romania.

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
│   ├── single-active-lock.js # Lock pentru continut
│   └── theme.js              # Dark/Light mode
├── images/                   # Imagini si assets
├── fonts/                    # Fonturi custom
├── documents/                # Animatii Lottie (JSON)
├── .github/workflows/        # CI/CD GitHub Actions
├── firebase.json             # Configurare Firebase Hosting
├── firestore.rules           # Reguli Firestore
├── database.rules.json       # Reguli Realtime Database
├── storage.rules             # Reguli Firebase Storage
└── firestore.indexes.json    # Indexuri Firestore
```

## Pagini

| Pagina | Descriere |
|--------|-----------|
| `index.html` | Dashboard principal - toate modulele |
| `login.html` | Autentificare |
| `sign-up.html` | Inregistrare |
| `mediu-invatare.html` | Mediu de invatare |
| `teste-examen.html` | Teste pentru examen |
| `codul-rutier.html` | Codul rutier |
| `setari.html` | Setari utilizator |
| `contact.html` | Formular contact |

## Firebase Services

- **Authentication**: Google Sign-in
- **Firestore**: Date utilizatori, progres, continut
- **Realtime Database**: Chapter locks, email verification
- **Hosting**: Deployment static
- **Storage**: Fisiere utilizatori (pregatit)

## Comenzi Utile

```bash
# Servire locala cu emulatoare Firebase
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

- **PR Preview**: Orice PR primeste un URL de preview
- **Production**: Push pe `main` deployaza automat

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

Configurate in `firebase.json`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## Caching

- **Imagini/Fonturi**: 1 an (immutable)
- **CSS/JS**: 1 saptamana
- **HTML**: No cache (always fresh)

## Fonturi

- **Google Fonts**: `Montserrat` (400–700), `Kanit` (200–700), `Inter` (400/600/700) incarcate prin `WebFont.load` doar cu variantele utilizate.
- **Fonturi locale**: `Gismo Trial Semirectangular` (2 versiuni), `Gismo YYY Semirectangular`, `Ooogismo Trial Semirectangular`, `Globet FFP` (Regular/Bold), `BinariaDisplayStencil`, `MazzardSoftM` (Light/Light Italic), `TT Octosquares Trial Condensed` (700/900).
- **Politica**: adauga noi fonturi doar daca exista un stil care le foloseste; sterge definitiile si fisierele neutilizate dupa exporturi Webflow pentru a evita request-uri 404 si asset-uri inutile.

## URLs Production

- https://scaoalauto.web.app
- https://scaoalauto.firebaseapp.com
