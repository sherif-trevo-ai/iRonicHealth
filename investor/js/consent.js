/* ════════════════════════════════════════════════════════════
   iRonic Health — Cookie Consent + Consent-Gated Analytics
   PDPL 151/2020 compliant: NO tracking loads until user accepts.
   ────────────────────────────────────────────────────────────
   SETUP: Replace GA_MEASUREMENT_ID below with your real GA4 ID
   (looks like G-XXXXXXXXXX). Until you do, analytics stays off
   and only the consent banner shows — which is safe.
   ════════════════════════════════════════════════════════════ */
(function () {
  var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // ← REPLACE with your GA4 ID
  var STORAGE_KEY = 'ironic_consent_v1';
  var isAR = (document.documentElement.lang || '').toLowerCase().indexOf('ar') === 0;

  var T = isAR ? {
    msg: 'نستخدم ملفات تعريف الارتباط لتحليل أداء الموقع وتحسين تجربتك، وفقًا لقانون حماية البيانات الشخصية المصري (151/2020).',
    accept: 'موافق',
    decline: 'رفض',
    dir: 'rtl'
  } : {
    msg: 'We use cookies to analyse site performance and improve your experience, in line with Egypt\u2019s PDPL (Law 151/2020).',
    accept: 'Accept',
    decline: 'Decline',
    dir: 'ltr'
  };

  function loadGA() {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf('XXXX') !== -1) return; // guard: not configured
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  function setConsent(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
    var b = document.getElementById('ir-consent');
    if (b) b.parentNode.removeChild(b);
    if (v === 'granted') loadGA();
  }

  function render() {
    var prior;
    try { prior = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (prior === 'granted') { loadGA(); return; }
    if (prior === 'denied') return;

    var wrap = document.createElement('div');
    wrap.id = 'ir-consent';
    wrap.setAttribute('dir', T.dir);
    wrap.innerHTML =
      '<div class="irc-inner">' +
        '<span class="irc-msg">' + T.msg + '</span>' +
        '<div class="irc-btns">' +
          '<button class="irc-decline">' + T.decline + '</button>' +
          '<button class="irc-accept">' + T.accept + '</button>' +
        '</div>' +
      '</div>';

    var css = document.createElement('style');
    css.textContent =
      '#ir-consent{position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#1A1A2E;border-top:2px solid #B8963E;' +
      'box-shadow:0 -4px 24px rgba(0,0,0,.25);animation:ircUp .35s ease}' +
      '@keyframes ircUp{from{transform:translateY(100%)}to{transform:translateY(0)}}' +
      '.irc-inner{max-width:1100px;margin:0 auto;padding:14px 22px;display:flex;align-items:center;gap:18px;flex-wrap:wrap;justify-content:space-between}' +
      '.irc-msg{color:rgba(255,255,255,.82);font-size:.84rem;line-height:1.5;flex:1;min-width:260px;font-family:' + (isAR ? "'Cairo'" : "'Ubuntu'") + ',sans-serif}' +
      '.irc-btns{display:flex;gap:10px;flex-shrink:0}' +
      '.irc-decline,.irc-accept{padding:8px 20px;border-radius:8px;font-size:.82rem;font-weight:700;cursor:pointer;border:none;font-family:' + (isAR ? "'Cairo'" : "'Ubuntu'") + ',sans-serif}' +
      '.irc-decline{background:transparent;color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.2)}' +
      '.irc-decline:hover{color:#fff;border-color:rgba(255,255,255,.4)}' +
      '.irc-accept{background:#B8963E;color:#1A1A2E}' +
      '.irc-accept:hover{background:#d4aa4a}';
    document.head.appendChild(css);
    document.body.appendChild(wrap);

    wrap.querySelector('.irc-accept').addEventListener('click', function () { setConsent('granted'); });
    wrap.querySelector('.irc-decline').addEventListener('click', function () { setConsent('denied'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
