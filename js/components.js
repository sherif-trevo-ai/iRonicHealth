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

  /* ══════════════════════════════════════════════════════════════════════
     ENGLISH NAVBAR
  ══════════════════════════════════════════════════════════════════════ */
  const navEN = `
<header class="nav" id="nav" role="banner">
  <a href="index.html" class="nav-logo" aria-label="iRonic Health Home">
    <div class="nav-logo-icon" aria-hidden="true">
      <div class="slash-group">
        <div class="s-bar"></div>
        <div class="s-dot"></div>
        <div class="s-bar2"></div>
      </div>
      <div class="logo-badge">H</div>
    </div>
    <div class="nav-logo-text">
      <span class="logo-wordmark">iRonic <strong>Health</strong></span>
      <span class="logo-tagline">Health System Integration Technology</span>
    </div>
  </a>
  <nav class="nav-center" aria-label="Main navigation">
    <a href="index.html#problem">Problem</a>
    <a href="platform.html">Platform</a>
    <a href="ecosystem.html">Ecosystem</a>
    <a href="dashboard.html">Dashboard</a>
    <a href="market.html">Market</a>
    <a href="index.html#model">Revenue</a>
    <a href="team.html">Team</a>
    <a href="investors.html">Investors</a>
  </nav>
  <div class="nav-right">
    <div class="lang-switcher" id="lang-switcher">
      <button class="lang-btn" aria-haspopup="listbox" aria-expanded="false">
        🌐 EN <span class="lang-caret">▾</span>
      </button>
      <div class="lang-dropdown" role="listbox">
        <span class="lang-opt lang-active">🇬🇧 English</span>
        <a href="ar/index.html" class="lang-opt">🇪🇬 العربية</a>
        <span class="lang-opt lang-soon">🇩🇪 Deutsch <span class="lang-badge">Soon</span></span>
        <span class="lang-opt lang-soon">🇫🇷 Français <span class="lang-badge">Soon</span></span>
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
  <a href="index.html#model">Revenue</a>
  <a href="team.html">Team</a>
  <a href="investors.html">Investors</a>
  <a href="contact.html" class="mobile-demo-btn">Request Demo →</a>
  <a href="ar/index.html" class="mobile-lang-btn" style="font-size:.8rem;opacity:.75;letter-spacing:.01em">🇪🇬 العربية</a>
</div>`;

  /* ══════════════════════════════════════════════════════════════════════
     ARABIC NAVBAR
  ══════════════════════════════════════════════════════════════════════ */
  const navAR = `
<header class="nav" id="nav" role="banner">
  <a href="../index.html" class="nav-logo" aria-label="iRonic Health الرئيسية">
    <div class="nav-logo-icon" aria-hidden="true">
      <div class="slash-group">
        <div class="s-bar"></div>
        <div class="s-dot"></div>
        <div class="s-bar2"></div>
      </div>
      <div class="logo-badge">H</div>
    </div>
    <div class="nav-logo-text">
      <span class="logo-wordmark">iRonic <strong>Health</strong></span>
      <span class="logo-tagline">تقنية تكامل المنظومة الصحية</span>
    </div>
  </a>
  <nav class="nav-center" aria-label="التنقل الرئيسي">
    <a href="index.html#problem">المشكلة</a>
    <a href="platform.html">المنصة</a>
    <a href="ecosystem.html">النظام البيئي</a>
    <a href="dashboard.html">لوحة التحكم</a>
    <a href="market.html">السوق</a>
    <a href="pricing.html">الإيرادات</a>
    <a href="team.html">الفريق</a>
    <a href="investors.html">المستثمرون</a>
  </nav>
  <div class="nav-right">
    <div class="lang-switcher" id="lang-switcher" style="direction:ltr">
      <button class="lang-btn" aria-haspopup="listbox" aria-expanded="false" style="font-family:'Cairo',sans-serif">
        🌐 AR <span class="lang-caret">▾</span>
      </button>
      <div class="lang-dropdown" role="listbox" style="left:auto;right:0;font-family:'Cairo',sans-serif">
        <a href="../index.html" class="lang-opt" style="direction:ltr">🇬🇧 English</a>
        <span class="lang-opt lang-active" style="direction:rtl">🇪🇬 العربية</span>
        <span class="lang-opt lang-soon" style="direction:ltr">🇩🇪 Deutsch <span class="lang-badge">قريبًا</span></span>
        <span class="lang-opt lang-soon" style="direction:ltr">🇫🇷 Français <span class="lang-badge">قريبًا</span></span>
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
  <a href="pricing.html">الإيرادات</a>
  <a href="team.html">الفريق</a>
  <a href="investors.html">المستثمرون</a>
  <a href="contact.html" class="mobile-demo-btn">طلب عرض تجريبي ←</a>
</div>`;

  /* ══════════════════════════════════════════════════════════════════════
     ENGLISH FOOTER
  ══════════════════════════════════════════════════════════════════════ */
  const footerEN = `
<footer class="footer" role="contentinfo">
  <div class="footer-top">
    <div class="footer-brand">
      <a href="index.html" class="footer-logo-link" aria-label="iRonic Health">
        <img src="assets/iRonic_Health_H_White_version.svg" alt="iRonic Health" class="footer-logo-img" onerror="this.style.display='none'">
      </a>
      <p class="footer-brand-desc">Egypt's first AI-powered health insurance orchestration platform. Connecting 8 parties. Eliminating fraud. Accelerating claims.</p>
      <div class="footer-social">
        <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn" class="fsl">in</a>
        <a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter/X" class="fsl">𝕏</a>
      </div>
    </div>
    <div class="footer-links-grid">
      <div class="footer-col">
        <div class="footer-col-title">Company</div>
        <a href="team.html">Team</a>
        <a href="index.html#problem">Problem</a>
        <a href="ecosystem.html">Ecosystem</a>
        <a href="market.html">Market</a>
        <a href="investors.html">Investors</a>
        <a href="ar/index.html">🇪🇬 العربية</a>
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
        <a href="mailto:info@ironicigmi.com">info@ironicigmi.com</a>
        <a href="mailto:investor@ironicigmi.com">investor@ironicigmi.com</a>
        <a class="phone-dir" href="tel:+447308892741">+44 7308 892741</a>
        <span class="footer-address-txt">Nile City Towers, North Tower<br>Corniche El Nile, Cairo, Egypt</span>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-copy">© 2026 Ironic Group · iRonic Health · All rights reserved</div>
    <div class="footer-legal">
      <a href="#">Privacy (PDPL 151/2020)</a>
      <a href="#">Terms of Service</a>
      <a href="#">FRA Compliance</a>
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
      <p class="footer-brand-desc" style="font-family:'Cairo',sans-serif">أول منصة لربط المنظومة الصحية بالذكاء الاصطناعي في مصر. ترتبط بـ 8 أطراف. تُلغي الاحتيال. تُسرّع المطالبات.</p>
      <div class="footer-social">
        <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn" class="fsl">in</a>
        <a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter/X" class="fsl">𝕏</a>
      </div>
    </div>
    <div class="footer-links-grid" style="font-family:'Cairo',sans-serif">
      <div class="footer-col">
        <div class="footer-col-title">الشركة</div>
        <a href="team.html">الفريق</a>
        <a href="index.html#problem">المشكلة</a>
        <a href="ecosystem.html">النظام البيئي</a>
        <a href="market.html">السوق</a>
        <a href="investors.html">المستثمرون</a>
        <a href="../index.html">🇬🇧 English</a>
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
        <a href="mailto:info@ironicigmi.com">info@ironicigmi.com</a>
        <a href="mailto:investor@ironicigmi.com">investor@ironicigmi.com</a>
        <a href="tel:+447308892741" dir="ltr" class="phone-dir">+44 7308 892741</a>
        <span class="footer-address-txt" style="font-family:'Cairo',sans-serif">أبراج النايل سيتي، البرج الشمالي<br>كورنيش النيل، القاهرة، مصر</span>
      </div>
    </div>
  </div>
  <div class="footer-bottom" style="font-family:'Cairo',sans-serif">
    <div class="footer-copy">© 2026 Ironic Group · iRonic Health · جميع الحقوق محفوظة</div>
    <div class="footer-legal">
      <a href="#">الخصوصية (PDPL 151/2020)</a>
      <a href="#">شروط الخدمة</a>
      <a href="#">امتثال الهيئة المالية</a>
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

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
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
  initLangSwitcher();
  initNavScroll();

})();
