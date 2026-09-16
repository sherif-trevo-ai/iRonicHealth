/* ── Lang Switcher Global Toggle (called via onclick) ── */
window.iRonicLangToggle = function (e) {
  e.stopPropagation();
  var ls  = document.getElementById('lang-switcher');
  if (!ls) return;
  var btn = ls.querySelector('.lang-btn');
  var open = ls.classList.toggle('open');
  if (btn) btn.setAttribute('aria-expanded', String(open));
};
document.addEventListener('click', function () {
  var ls  = document.getElementById('lang-switcher');
  if (ls)  ls.classList.remove('open');
  var btn = document.querySelector('.lang-btn');
  if (btn) btn.setAttribute('aria-expanded', 'false');
});

/**
 * iRonic Health — Global Components
 * ─────────────────────────────────
 * ONE FILE controls all navbars + footers across every EN & AR page.
 * To update nav or footer: edit this file only, push once — done.
 *
 * How it works:
 *   1. Detects language from URL (/ar/ = Arabic, else English)
 *   2. Injects the correct navbar + mobile nav into #nav-placeholder
 *   3. Injects the correct footer into #footer-placeholder
 *   4. Wires up mobile toggle + lang switcher interactions
 *
 * Each page needs exactly these two placeholder divs:
 *   <div id="nav-placeholder"></div>      ← replaces your old <header> + mobile-nav
 *   <div id="footer-placeholder"></div>   ← replaces your old <footer>
 *
 * Script tag for ROOT pages  (index.html, platform.html …):  <script src="js/components.js"></script>
 * Script tag for AR/ pages   (ar/index.html, ar/platform.html …): <script src="../js/components.js"></script>
 */

(function () {
  'use strict';

  /* ─── Language Detection ─────────────────────────────────────────────── */
  const isArabic = window.location.pathname.includes('/ar/');
  /* Same page in the other language (EN at root, AR under /ar/) */
  var curFile = (window.location.pathname.split('/').pop() || 'index.html');
  if (curFile.indexOf('.html') === -1) curFile = 'index.html';
  const toAR = 'ar/' + curFile;
  const toEN = '../' + curFile;

  /* ══════════════════════════════════════════════════════════════════════
     ENGLISH NAVBAR
  ══════════════════════════════════════════════════════════════════════ */
  const navEN = `
<header class="nav" id="nav" role="banner">
      <a href="index.html" class="nav-logo" aria-label="iRonic Health Home">
    <img src="assets/logos/H_Badge_Metro_Blue_T.svg" alt="" class="nav-logo-badge-img">
    <div class="nav-logo-text">
      <span class="logo-wordmark">iRonic <strong>Health</strong></span>
      <span class="logo-tagline">Health System Integration Technology</span>
    </div>
  </a>
  <nav class="nav-center" aria-label="Main navigation">
    <a href="platform.html">Platform</a>
    <a href="ecosystem.html">Ecosystem</a>
    <a href="dashboard.html">Dashboard</a>
    <a href="market.html">Market</a>
    <a href="investors.html">Investors</a>
    <a href="pricing.html">Pricing</a>
    <a href="team.html">Team</a>
  </nav>
  <div class="nav-right">
    <div class="lang-switcher" id="lang-switcher">
      <button class="lang-btn" aria-haspopup="listbox" aria-expanded="false" onclick="iRonicLangToggle(event)">
        🌐 EN <span class="lang-caret">▾</span>
      </button>
      <div class="lang-dropdown" role="listbox">
        <span class="lang-opt lang-active">🇬🇧 English</span>
        <a href="${toAR}" class="lang-opt" lang="ar" hreflang="ar">🇪🇬 العربية</a>
      </div>
    </div>
    <a href="contact.html" class="btn-demo">Request Demo →</a>
  </div>
  <button class="nav-mobile-toggle" aria-label="Open menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</header>
<div class="mobile-nav" role="dialog" aria-label="Mobile navigation" aria-hidden="true">
  <a href="index.html#problem">Problem</a>
  <a href="platform.html">Platform</a>
  <a href="ecosystem.html">Ecosystem</a>
  <a href="dashboard.html">Dashboard</a>
  <a href="market.html">Market</a>
  <a href="investors.html">Investors</a>
  <a href="pricing.html">Pricing</a>
  <a href="team.html">Team</a>
  <a href="contact.html">Contact</a>
  <a href="contact.html" class="mobile-demo-btn">Request Demo →</a>
  <a href="${toAR}" class="mobile-lang-btn" lang="ar" hreflang="ar" style="font-size:.8rem;opacity:.75;letter-spacing:.01em">🇪🇬 العربية</a>
</div>`;

  /* ══════════════════════════════════════════════════════════════════════
     ARABIC NAVBAR
  ══════════════════════════════════════════════════════════════════════ */
  const navAR = `
<header class="nav" id="nav" role="banner">
          <a href="index.html" class="nav-logo" aria-label="iRonic Health الرئيسية">
    <img src="../assets/logos/H_Badge_Metro_Blue_T.svg" alt="" class="nav-logo-badge-img" style="transform:scaleX(-1)">
    <div class="nav-logo-text" style="text-align:right">
      <span class="logo-wordmark" style="font-family:'Kufam',sans-serif;font-weight:400">أيرونيك <strong style="font-weight:700">هيلث</strong></span>
      <span class="logo-tagline" style="font-family:'Kufam',sans-serif">تكنولوجيا ربط المنظومة الصحية</span>
    </div>
  </a>
  <nav class="nav-center" aria-label="التنقل الرئيسي">
    <a href="platform.html">المنصة</a>
    <a href="ecosystem.html">النظام البيئي</a>
    <a href="dashboard.html">لوحة التحكم</a>
    <a href="market.html">السوق</a>
    <a href="investors.html">المستثمرون</a>
    <a href="pricing.html">الأسعار</a>
    <a href="team.html">الفريق</a>
  </nav>
  <div class="nav-right">
    <div class="lang-switcher" id="lang-switcher" style="direction:ltr">
      <button class="lang-btn" aria-haspopup="listbox" aria-expanded="false" onclick="iRonicLangToggle(event)">
        🌐 AR <span class="lang-caret">▾</span>
      </button>
      <div class="lang-dropdown" role="listbox" style="right:0;left:auto">
        <a href="${toEN}" class="lang-opt" style="direction:ltr" lang="en" hreflang="en">🇬🇧 English</a>
        <span class="lang-opt lang-active" style="direction:rtl">🇪🇬 العربية</span>
      </div>
    </div>
    <a href="contact.html" class="btn-demo">طلب عرض تجريبي ←</a>
  </div>
  <button class="nav-mobile-toggle" aria-label="فتح القائمة" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</header>
<div class="mobile-nav" role="dialog" aria-label="التنقل المحمول" aria-hidden="true">
  <a href="index.html#problem">المشكلة</a>
  <a href="platform.html">المنصة</a>
  <a href="ecosystem.html">النظام البيئي</a>
  <a href="dashboard.html">لوحة التحكم</a>
  <a href="market.html">السوق</a>
  <a href="investors.html">المستثمرون</a>
  <a href="pricing.html">الأسعار</a>
  <a href="team.html">الفريق</a>
  <a href="contact.html">تواصل معنا</a>
  <a href="contact.html" class="mobile-demo-btn">طلب عرض تجريبي ←</a>
  <a href="${toEN}" class="mobile-lang-btn" lang="en" hreflang="en" style="font-size:.8rem;opacity:.75">🇬🇧 English</a>
</div>`;

  /* ══════════════════════════════════════════════════════════════════════
     ENGLISH FOOTER
  ══════════════════════════════════════════════════════════════════════ */
  const footerEN = `
<footer class="footer" role="contentinfo">
  <div class="footer-top">
    <div class="footer-brand">
      <a href="index.html" class="footer-logo-link" aria-label="iRonic Health">
        <img src="assets/logos/iRonic_Health_EN_Double_Gold_T.svg" alt="iRonic Health" class="footer-logo-img" style="height:52px;width:auto" onerror="this.style.display='none'">
      </a>
      <p class="footer-brand-desc">AI-powered health insurance orchestration platform built for Egypt. Company in formation · decision-support SaaS — not an insurer or TPA. Figures on this site are illustrative targets, not actual results.</p>
    </div>
    <div class="footer-links-grid">
      <div class="footer-col">
        <div class="footer-col-title">Company</div>
        <a href="team.html">Team</a>
        <a href="pricing.html">Pricing</a>
        <a href="contact.html">Contact</a>
        <a href="ecosystem.html">Ecosystem</a>
        <a href="market.html">Market</a>
        <a href="investors.html">Investors</a>
        <a href="${toAR}" lang="ar">🇪🇬 العربية</a>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">Platform</div>
        <a href="platform.html#mod-1">Fraud Detection AI</a>
        <a href="platform.html#mod-2">Health Score</a>
        <a href="platform.html#mod-3">Claim Predictor</a>
        <a href="platform.html#mod-4">Hospital Routing</a>
        <a href="platform.html#mod-7">Dashboard</a>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">Contact</div>
        <a href="mailto:info@ironichealth.com">info@ironichealth.com</a>
        <a href="mailto:investor@ironichealth.com">investor@ironichealth.com</a>
        <a class="phone-dir" href="tel:+447308892741">+44 7308 892741</a>
        <span class="footer-address-txt">Cairo, Egypt</span>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-copy">© 2026 Sherif Almeidany &amp; Dr. Islam Almeidany · iRonic Health (company in formation) · All rights reserved</div>
    <div class="footer-legal">
      <a href="mailto:info@ironichealth.com?subject=Privacy%20request">Privacy requests (PDPL 151/2020)</a>
      <a href="team.html#entity">Legal &amp; regulatory status</a>
    </div>
  </div>
</footer>`;

  /* ══════════════════════════════════════════════════════════════════════
     ARABIC FOOTER
  ══════════════════════════════════════════════════════════════════════ */
  const footerAR = `
<footer class="footer" role="contentinfo" style="font-family:'Cairo',sans-serif">
  <div class="footer-top">
    <div class="footer-brand">
      <a href="index.html" class="footer-logo-link" aria-label="iRonic Health">
        <img src="../assets/iRonic_Health_H_White_version.svg" alt="iRonic Health" class="footer-logo-img" onerror="this.style.display='none'" style="max-height:44px;width:auto">
      </a>
      <p class="footer-brand-desc" style="font-family:'Cairo',sans-serif">منصة لربط المنظومة الصحية بالذكاء الاصطناعي، مصمَّمة للسوق المصري. شركة قيد التأسيس · برمجيات لدعم القرار — لسنا شركة تأمين أو TPA. الأرقام المعروضة أهداف نموذجية وليست نتائج فعلية.</p>
    </div>
    <div class="footer-links-grid" style="font-family:'Cairo',sans-serif">
      <div class="footer-col">
        <div class="footer-col-title">الشركة</div>
        <a href="team.html">الفريق</a>
        <a href="pricing.html">الأسعار</a>
        <a href="contact.html">تواصل معنا</a>
        <a href="ecosystem.html">النظام البيئي</a>
        <a href="market.html">السوق</a>
        <a href="investors.html">المستثمرون</a>
        <a href="${toEN}" lang="en">🇬🇧 English</a>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">المنصة</div>
        <a href="platform.html">كشف الاحتيال AI</a>
        <a href="platform.html">النقاط الصحية</a>
        <a href="platform.html">توقع المطالبات</a>
        <a href="platform.html">توجيه المستشفيات</a>
        <a href="dashboard.html">لوحة التحكم</a>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">تواصل</div>
        <a href="mailto:info@ironichealth.com">info@ironichealth.com</a>
        <a href="mailto:investor@ironichealth.com">investor@ironichealth.com</a>
        <a href="tel:+447308892741" dir="ltr" class="phone-dir">+44 7308 892741</a>
        <span class="footer-address-txt" style="font-family:'Cairo',sans-serif">القاهرة، مصر</span>
      </div>
    </div>
  </div>
  <div class="footer-bottom" style="font-family:'Cairo',sans-serif">
    <div class="footer-copy">© 2026 شريف الميداني ود. إسلام الميداني · iRonic Health (شركة قيد التأسيس) · جميع الحقوق محفوظة</div>
    <div class="footer-legal">
      <a href="mailto:info@ironichealth.com?subject=Privacy%20request">طلبات الخصوصية (PDPL 151/2020)</a>
      <a href="contact.html">تواصل معنا</a>
    </div>
  </div>
</footer>`;

  /* ══════════════════════════════════════════════════════════════════════
     INJECT COMPONENTS INTO PAGE
  ══════════════════════════════════════════════════════════════════════ */
  var navEl = document.getElementById('nav-placeholder');
  var ftEl  = document.getElementById('footer-placeholder');

  if (navEl)  navEl.outerHTML  = isArabic ? navAR    : navEN;
  if (ftEl)   ftEl.outerHTML   = isArabic ? footerAR : footerEN;

  /* ══════════════════════════════════════════════════════════════════════
     MOBILE NAV TOGGLE
     (runs after injection so the DOM elements exist)
  ══════════════════════════════════════════════════════════════════════ */


  function initMobileNav() {
    var toggle    = document.querySelector('.nav-mobile-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════════════
     LANGUAGE SWITCHER DROPDOWN
  ══════════════════════════════════════════════════════════════════════ */
  function initLangSwitcher() {
    var switcher = document.getElementById('lang-switcher');
    if (!switcher) return;
    var btn      = switcher.querySelector('.lang-btn');
    var dropdown = switcher.querySelector('.lang-dropdown');
    if (!btn || !dropdown) return;

    // Use inline style — bypasses all CSS class conflicts
    dropdown.style.display = 'none';

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdown.style.display === 'block';
      dropdown.style.display = isOpen ? 'none' : 'block';
      btn.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', function () {
      dropdown.style.display = 'none';
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  /* ══════════════════════════════════════════════════════════════════════
     NAV SCROLL EFFECT (adds .scrolled class for styling)
  ══════════════════════════════════════════════════════════════════════ */
  function initNavScroll() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ─── Run Everything ─────────────────────────────────────────────────── */
  initMobileNav();
  initNavScroll();

})();
