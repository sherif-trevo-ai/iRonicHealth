# iRonic Health — Official Website

**Health System Integration Technology**  
Egypt's first AI-powered health insurance orchestration platform.

---

## Project Structure

```
ironic-health/
├── index.html          # Main homepage (EN)
├── css/
│   └── style.css       # All styles — brand-locked
├── js/
│   └── main.js         # Scroll reveal, mobile nav, interactions
├── assets/             # Place logo files and images here
│   ├── logo-color.svg
│   ├── logo-white.svg
│   └── og-image.jpg    # 1200x630 for social sharing
└── README.md
```

---

## Brand System

| Token | Value |
|-------|-------|
| Primary Blue | `#4179AD` |
| Dark Blue | `#2d5a8a` |
| Gold Lustre | `#CAB164` |
| Dark Gold | `#a8914a` |
| EN Font | Ubuntu (Google Fonts) |
| AR Font | Kufam (Google Fonts) |

---

## Deploy to Netlify (Recommended)

### Option A — Drag & Drop (Fastest)

1. Go to [netlify.com](https://netlify.com) and log in
2. Drag the entire `ironic-health/` folder onto the Netlify dashboard
3. Your site is live instantly at a `.netlify.app` URL
4. Rename it to `ironichealth.netlify.app` in Site Settings → Site name

### Option B — GitHub + Netlify (Recommended for ongoing updates)

Follow the steps below to connect GitHub for automatic deployments.

---

## GitHub Setup — Step by Step

### 1. Create the Repository

```bash
# In your terminal, navigate to this folder
cd ironic-health

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit — iRonic Health homepage v2"
```

### 2. Create GitHub Repo

1. Go to [github.com](https://github.com) → click **New repository**
2. Name it: `iRonicHealth` (or `ironic-health-website`)
3. Set to **Public** (required for free Netlify)
4. Do NOT initialize with README (you already have one)
5. Click **Create repository**

### 3. Push to GitHub

Copy the commands GitHub shows you, or use:

```bash
git remote add origin https://github.com/YOUR_USERNAME/iRonicHealth.git
git branch -M main
git push -u origin main
```

### 4. Connect Netlify to GitHub

1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**
2. Choose **GitHub**
3. Authorize Netlify and select your `iRonicHealth` repo
4. Build settings:
   - **Build command:** *(leave empty — pure HTML/CSS/JS)*
   - **Publish directory:** `.` (root)
5. Click **Deploy site**

### 5. Set Custom Domain (Optional)

In Netlify → **Domain settings** → **Add custom domain**  
Point your DNS to Netlify's nameservers.

---

## Making Updates

After the initial setup, every push to GitHub auto-deploys:

```bash
# Make your changes to index.html, css/style.css, etc.
git add .
git commit -m "Update hero section copy"
git push
```

Netlify detects the push and redeploys in ~30 seconds.

---

## Pages Roadmap

| Page | Status | File |
|------|--------|------|
| Homepage (EN) | ✅ Done | `index.html` |
| Homepage (AR) | 🔜 Next | `ar/index.html` |
| Product | 🔜 | `product.html` |
| For Insurers | 🔜 | `insurers.html` |
| Investors | 🔜 | `investors.html` |
| About | 🔜 | `about.html` |

---

## Contact

- **Chairman & CEO:** م. شريف شوقي — chairman@ironicgmi.com — +20 155 555 6697  
- **Founder & CMO:** د. إسلام الميداني — islam@ironicigmi.com — +20 150 828 1948  
- **HQ:** Nile City Towers, North Tower, Corniche El Nile, Cairo, Egypt

---

## Compliance Notes

- AI outputs are positioned as **decision support**, not autonomous decisions (PDPL 151/2020)
- Positioned as **SaaS platform** — not licensed as insurer or TPA
- FRA-compliant messaging throughout

---

*iRonic Health is the healthtech vertical of Ironic Group — a registered Egyptian company.*
