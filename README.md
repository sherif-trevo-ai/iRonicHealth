# iRonic Health — Official Website

**Health System Integration Technology**
Egypt's first AI-powered health insurance orchestration platform.

🌐 **Live site:** https://sherif-trevo-ai.github.io/iRonicHealth/
📊 **Interactive demo:** https://sherif-trevo-ai.github.io/iRonicHealth/dashboard.html

---

## Project Overview

iRonic Health is a B2B SaaS platform that orchestrates Egypt's fragmented health insurance ecosystem using AI. The platform serves insurers, TPAs, corporates, providers, and members through a unified API-first layer.

| Metric | Base Case | Upside |
|--------|-----------|--------|
| Year 1 ARR | $475K | $500K |
| Year 2 ARR | $2.45M | $3.5M |
| Year 3 ARR | $7.35M | $12M |
| Breakeven | Month 18 | — |
| SAM | $80–150M | — |

---

## Project Structure

```
iRonicHealth/
├── index.html              # Homepage (EN)
├── platform.html           # Platform & product (EN)
├── ecosystem.html          # Ecosystem diagram (EN)
├── dashboard.html          # Interactive demo dashboard (EN)
├── market.html             # Market opportunity (EN)
├── pricing.html            # Revenue model (EN)
├── investors.html          # Investor brief (EN)
├── team.html               # Team page (EN)
├── contact.html            # Contact & demo request (EN)
│
├── ar/                     # Arabic versions (RTL, fully mirrored)
│   ├── index.html
│   ├── platform.html
│   ├── ecosystem.html
│   ├── dashboard.html
│   ├── market.html
│   ├── pricing.html
│   ├── investors.html
│   ├── team.html
│   └── contact.html
│
├── css/
│   ├── style.css           # Main stylesheet — brand-locked
│   └── arabic-theme.css    # RTL layout + Arabic typography
│
├── js/
│   ├── components.js       # Nav + footer injection (bilingual EN/AR)
│   ├── main.js             # Scroll reveal, mobile nav, interactions
│   └── consent.js          # PDPL cookie consent + consent-gated GA4
│
├── assets/
│   ├── logos/              # Brand logo files (SVG)
│   ├── og-image.jpg        # 1200×630 social sharing card
│   └── og-image.png        # PNG version of social card
│
├── netlify.toml            # Security headers, cache rules, redirects
├── sitemap.xml             # SEO sitemap — 18 URLs (EN + AR)
├── robots.txt              # SEO robots config
└── README.md
```

---

## Brand System

| Token | Value | Usage |
|-------|-------|-------|
| Navy | `#1A1A2E` | Page background, sidebar, section headings |
| Blue | `#1B5FA6` | Primary CTA, links, highlights |
| Gold | `#B8963E` | Accent, badges, dividers |
| Dark | `#2D2D2D` | Body text |
| White | `#FFFFFF` | Cards, light backgrounds |
| EN Font | Ubuntu (Google Fonts) | All English content |
| AR Heading Font | Kufam (Google Fonts) | Arabic headings & display |
| AR Body Font | Cairo (Google Fonts) | Arabic body & tables |

---

## Pages & Status

| Page | EN | AR | Notes |
|------|----|----|-------|
| Homepage | ✅ | ✅ | Hero, dashboard preview, stats |
| Platform | ✅ | ✅ | Product modules, AI features |
| Ecosystem | ✅ | ✅ | Integration diagram |
| Dashboard | ✅ | ✅ | Interactive demo — CFO/CMO/TPA/Provider/Member views |
| Market | ✅ | ✅ | SAM, TAM, competitive landscape |
| Revenue | ✅ | ✅ | PMPM pricing, unit economics |
| Investors | ✅ | ✅ | Financial projections, thesis |
| Team | ✅ | ✅ | Founders section |
| Contact | ✅ | ✅ | Demo request form |

---

## Key Technical Features

- **Bilingual (EN/AR):** Full RTL support via `arabic-theme.css` and `dir="rtl"` on all Arabic pages
- **Single nav/footer system:** `js/components.js` auto-detects language from URL path and injects the correct nav/footer
- **PDPL-compliant analytics:** `js/consent.js` gates GA4 behind explicit user consent — no tracking fires before acceptance
- **SEO-ready:** `sitemap.xml`, `robots.txt`, `og:image` (1200×630 JPG), JSON-LD Organization + WebSite schema on all pages
- **Accessibility:** WCAG 2.4.1 skip-to-content link on all 18 pages (EN + AR)
- **Security headers:** X-Frame-Options, X-Content-Type-Options, HSTS, Permissions-Policy via `netlify.toml`
- **Interactive dashboard:** 5-role demo (CFO, CMO, TPA Ops, Provider, Member) with animated charts, real-time activity feed, and live-looking claims data — clearly marked as Demo environment

---

## Deployment

### Current host: GitHub Pages
The site is live at `https://sherif-trevo-ai.github.io/iRonicHealth/`

### Recommended: Migrate to Netlify

Netlify activates the security headers and cache rules already configured in `netlify.toml`.

**Option A — Drag & Drop (fastest)**
1. Go to [netlify.com](https://netlify.com) → log in
2. Drag the entire repo folder onto the Netlify dashboard
3. Site is live instantly at a `.netlify.app` URL
4. Rename to `ironichealth.netlify.app` in Site Settings → Site name

**Option B — GitHub integration (recommended for ongoing updates)**
1. Netlify → **Add new site** → **Import an existing project** → GitHub
2. Select repo: `sherif-trevo-ai/iRonicHealth`
3. Build settings:
   - **Build command:** *(leave empty)*
   - **Publish directory:** `.`
4. Click **Deploy site**
5. Every push to `main` auto-deploys in ~30 seconds

**After deploying to Netlify:**
- Set custom domain: `ironichealth.com` → Netlify → Domain settings
- Update `og:image` and `sitemap.xml` URLs from GitHub Pages URL to new domain

### Making Updates

```bash
# Edit files locally, then:
git add .
git commit -m "Describe your change"
git push
```

GitHub Pages redeploys in ~60 seconds. Netlify redeploys in ~30 seconds.

---

## Analytics Setup

GA4 is scaffolded but inactive until configured:

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Copy your Measurement ID (format: `G-XXXXXXXXXX`)
3. Open `js/consent.js` → replace line 12:
   ```js
   var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // ← paste your ID here
   ```
4. Commit and push

Analytics only activates **after** a user clicks "Accept" on the PDPL consent banner.

---

## Compliance Notes

- AI outputs are positioned as **decision support only**, not autonomous clinical decisions (PDPL Law 151/2020)
- Platform is classified as **SaaS Decision-Support Software** — no FRA insurance licence required
- Cookie consent banner is self-hosted, consent-gated, and PDPL-compliant
- All data references on the live site use the **Base Case** financial scenario

---

## Contact

For business inquiries: [ironichealth.com/contact.html](https://ironichealth.com/contact.html)
or email **info@ironicigmi.com**

---

*iRonic Health is the healthtech vertical of **Ironic Group** — a registered Egyptian company.*
