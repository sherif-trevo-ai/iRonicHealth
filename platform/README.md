# iRonic Health — Physician & TPA Platform (Interactive Prototype)

React 18 + Vite. Bilingual (EN/AR). Deterministic clinical rules engine built
on the Egyptian National Drug Formulary — Endocrine System Drugs 2024
(Egyptian Drug Authority, EDREX:GL.CAP.Care.030).

**Status:** Demo / pilot-prep prototype. Synthetic patient data throughout —
no real PHI. See "Data & compliance" below before connecting any real patient
data source.

## Local development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
```

## Project structure

```
src/
  data/
    clinical.js   # drugs, protocols, diagnoses, labs, imaging, mock patients
    i18n.js       # bilingual UI dictionary (37 keys, ar/en parity enforced)
  engine/
    rules.js      # evaluate() · fitness() · alternatives() — the rules engine
  components/
    Atoms.jsx                    # Box, Chip, Badge, H, RuleFlag, TopHeader
    DrugIntelligenceDrawer.jsx   # per-drug fitness + trade names + ranked alternatives
  views/
    PhysicianView.jsx   # 8-step point-of-care flow
    TPAView.jsx          # approval queue, decided list, prescriber patterns
  App.jsx        # shared state linking both views (submit -> appears in TPA queue live)
```

## Deploying to Vercel (this repo, as a sub-project)

This folder lives inside the main `iRonicHealth` repo alongside the static
marketing site. To deploy it as its own Vercel project without touching the
marketing site's GitHub Pages deployment:

1. In Vercel → **New Project** → import this same GitHub repo
   (`sherif-trevo-ai/iRonicHealth`).
2. Under **Root Directory**, set it to `platform`.
3. Framework preset: Vite (auto-detected via `vercel.json`).
4. Deploy. Vercel will run `npm install && npm run build` inside `/platform`
   only — it will not touch or interfere with the root-level static site or
   its GitHub Pages deployment.

Every push to the repo that touches files under `/platform` will trigger a
new Vercel deployment with its own preview URL, independent from the main
site.

## Data & compliance — read before connecting real data

- All patient, physician, and request data in this codebase is **synthetic**.
- The live site (iRonicHealth v2) publicly commits to
  **"PDPL 151/2020 — Egypt-resident, encrypted"** data hosting for patient
  health data. Vercel does not have an Egypt region. This project is
  therefore appropriate for **frontend hosting and demos only**.
- Before any real patient data touches this system: the database and audit
  log must live on Egypt-resident or PDPL-compliant regional infrastructure,
  separate from this Vercel deployment. The frontend layer here can remain
  on Vercel even after that — only the data-holding layer needs to move.
- Offline-first behaviour (required for unreliable clinic connectivity) is
  **not yet implemented** in this prototype — flagged as a pre-pilot
  requirement, not a demo requirement.

## What's deliberately not built yet

- Only 10 of the 26 catalogued endocrine drugs are wired into the physician
  UI (the other 16 — remaining insulins, acarbose, antithyroid agents — exist
  in the fuller data catalog delivered earlier in the project but are not yet
  imported here).
- Only 3 of the target 15-20 treatment protocols are defined.
- No backend, no persistence, no real authentication — all state is
  in-memory and resets on page reload.
