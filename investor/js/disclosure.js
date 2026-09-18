/**
 * iRonic Health — site-wide disclosure bar + page-to-page language switch.
 * Loaded on every EN and AR page (EN: js/disclosure.js · AR: ../js/disclosure.js).
 */
(function () {
  'use strict';
  var path = window.location.pathname;
  var isAr = /\/ar\//.test(path);
  var file = path.split('/').pop() || 'index.html';
  if (file.indexOf('.html') === -1) file = 'index.html';
  var other = isAr ? '../' + file : 'ar/' + file;

  var txt = isAr
    ? 'إفصاح: iRonic Health شركة قيد التأسيس وبرمجيات لدعم القرار (SaaS) — لسنا شركة تأمين أو TPA. المنصة قيد التطوير؛ كل الأرقام والنتائج المعروضة أهداف نموذجية أو بيانات افتراضية، وليست نتائج فعلية. لا توجد شراكات موقَّعة حتى الآن.'
    : 'Disclosure: iRonic Health is a company in formation and a decision-support SaaS — not an insurer or TPA. The platform is in development; all figures and results shown are illustrative targets or sample data, not actual results. No partnerships have been signed yet.';
  var sw = isAr ? 'English' : 'العربية';

  var bar = document.createElement('div');
  bar.id = 'ih-disclosure';
  bar.setAttribute('role', 'note');
  bar.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  bar.style.cssText = 'position:relative;z-index:10000;background:#0b2440;color:#e8eef6;' +
    'font:500 12px/1.5 ' + (isAr ? "'Cairo','Kufam',sans-serif" : "'Ubuntu',sans-serif") + ';' +
    'padding:8px 16px;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;text-align:center;' +
    'border-bottom:1px solid rgba(202,177,100,.4)';
  var span = document.createElement('span');
  span.textContent = txt;
  var a = document.createElement('a');
  a.href = other;
  a.textContent = sw;
  a.setAttribute('lang', isAr ? 'en' : 'ar');
  a.setAttribute('hreflang', isAr ? 'en' : 'ar');
  a.style.cssText = 'color:#CAB164;font-weight:700;text-decoration:underline;white-space:nowrap';
  bar.appendChild(span);
  bar.appendChild(a);

  function mount() {
    if (document.getElementById('ih-disclosure')) return;
    document.body.insertBefore(bar, document.body.firstChild);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
