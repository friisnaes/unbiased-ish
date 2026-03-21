# Signal over Støj

**Perspektiver på geopolitik** — Et sammenligningsværktøj for nyhedsdækning.

> Denne side prøver ikke at være neutral.  
> Den prøver at gøre vinkler synlige.

---

## Arkitektur

```
signal-over-stoej/
├── src/                    # React frontend (Vite + TypeScript + Tailwind)
│   ├── components/         # Reusable UI components
│   ├── pages/              # Route pages
│   ├── hooks/              # Data loading hooks
│   ├── utils/              # Formatting utilities
│   ├── types/              # TypeScript models
│   └── data/               # Source profiles config
├── scripts/                # Ingestion pipeline (runs in GitHub Actions)
│   ├── adapters.ts         # Source feed adapters
│   ├── ingest.ts           # Main ingestion script
│   ├── cluster.ts          # Story clustering & divergence
│   └── validate-links.ts   # URL validation
├── public/data/            # Generated JSON data (committed to repo)
└── .github/workflows/      # CI/CD pipelines
```

## Deployment til GitHub Pages

### 1. Opret repository

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin git@github.com:DIT-BRUGERNAVN/signal-over-stoej.git
git push -u origin main
```

### 2. Aktivér GitHub Pages

1. Gå til **Settings → Pages** i dit repository
2. Under **Source**, vælg **GitHub Actions**

### 3. Konfigurér feeds (valgfrit)

Åbn `scripts/adapters.ts` og justér feed-URL'er:

- **BBC** og **Al Jazeera** har offentlige RSS-feeds der virker direkte
- **Kyiv Independent** har et offentligt RSS-feed
- **Reuters** og **AP** har ikke offentlige feeds — Google News RSS bruges som proxy (se kommentarer i koden)

Hvis du har adgang til betalte/enterprise API'er, erstat `feedUrl` i source-konfigurationen.

### 4. Test lokalt

```bash
npm install
npm run pipeline    # Kør indsamling + clustering
npm run dev         # Start Vite dev server
```

### 5. Deploy

Push til `main` — GitHub Actions bygger og deployer automatisk.

Ingestion kører automatisk hvert 15. minut via scheduled workflow.

---

## Kommandoer

| Kommando | Beskrivelse |
|---|---|
| `npm run dev` | Start lokal udvikling |
| `npm run build` | Byg statisk site |
| `npm run ingest` | Kør indsamlingspipeline |
| `npm run cluster` | Gruppér artikler i historier |
| `npm run pipeline` | Kør fuld pipeline (ingest + cluster) |
| `npm run validate-links` | Validér artikel-URLs |

---

## Juridisk

- Overskrifter og uddrag tilhører de respektive udgivere
- Denne side linker til original journalistik
- Kildetilgængelighed afhænger af offentlige feeds/API'er
- Kildelinsebeskrivelser er redaktionel vejledning, ikke objektiv sandhed
- Denne side er et sammenligningsværktøj, ikke en erstatning for original journalistik

---

## Teknologi

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Routing**: HashRouter (GitHub Pages-kompatibelt)
- **Data**: Statiske JSON-filer i `/public/data`
- **Ingestion**: Node.js scripts med `rss-parser`
- **CI/CD**: GitHub Actions (scheduled + push)
- **Hosting**: GitHub Pages (statisk)
