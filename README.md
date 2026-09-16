# iRonic Health — Website (v1.0)

Public website for **iRonic Health**, an AI-powered health-insurance orchestration platform being built for Egypt's private health-insurance market.

- **Live site:** https://ironichealth.com (GitHub Pages, custom domain via `CNAME`, DNS/HTTPS on Cloudflare)
- **Status:** company in formation (Egypt). Decision-support SaaS — not an insurer or TPA.
- **Founders:** Sherif Almeidany (Co-Founder & CEO) · Dr. Islam Almeidany (Co-Founder & Medical Director). The co-founders are brothers.
- **Contact:** info@ironichealth.com · investor@ironichealth.com · sherif@ironichealth.com · islam@ironichealth.com (Cloudflare Email Routing)

> All performance figures, financial projections and dashboard data on this site are illustrative targets or fictional sample data — not actual results. No partnerships or customers have been signed. The interactive platform lives in a separate private repository and is not part of this site.

## Structure

```
/                    English pages (index, platform, ecosystem, dashboard, ai-experience,
                     market, investors, pricing, team, contact)
/ar/                 Arabic pages (same file names, RTL)
/css/style.css       Shared styles
/css/arabic-theme.css  Arabic/RTL overrides
/js/components.js    Shared nav + footer (EN/AR), page-to-page language switch
/js/disclosure.js    Site-wide disclosure bar + language link (all pages)
/js/main.js          Scroll reveal, counters, ROI calculator (EN home)
/js/consent.js       Cookie/consent banner
/ai-layer.js, /ar/ai-layer.js   Dashboard demo layer (sample data)
/ai-api.js           Client for the demo analysis endpoint
/assets/             Logos, icons, OG image
CNAME · robots.txt · sitemap.xml · LICENSE
```

The English site is at the root; Arabic mirrors each page under `/ar/` with the same file name, so the language switch maps `page.html` ↔ `ar/page.html`.

## Brand tokens

| Token | Value |
|---|---|
| Primary Blue | `#4179AD` |
| Dark Blue | `#2d5a8a` |
| Gold Lustre | `#CAB164` |
| Dark Gold | `#a8914a` |
| EN font | Ubuntu |
| AR fonts | Kufam / Cairo |

## Deploy

Pushes to `main` publish automatically via GitHub Pages. There is no build step (plain HTML/CSS/JS).

## Content rules

- Every figure about iRonic Health is labelled as a target or sample data, never as a result.
- Real companies are not named as partners, customers or integrations. Demo data uses fictional names.
- EN and AR pages must carry the same facts.

## Release

`v1.0-deposit` — reviewed release prepared for deposit as a software work (ITIDA). Earlier drafts (`v1/`, `v2/`) were removed from the tree and remain in git history.

## License

Proprietary — © 2026 Sherif Almeidany and Dr. Islam Almeidany. All rights reserved. See `LICENSE`.
