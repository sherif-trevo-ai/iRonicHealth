/* iRonic Health v3 — main.js */
'use strict';

/* ─── SCROLL REVEAL ─── */
(function(){
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, {threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ─── ANIMATED COUNTERS ─── */
(function(){
  function animateCounter(el){
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function update(now){
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;
      const display = target < 10 ? current.toFixed(1) : Math.round(current);
      el.textContent = prefix + display + suffix;
      if(progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting && !e.target.dataset.animated){
        e.target.dataset.animated = '1';
        animateCounter(e.target);
      }
    });
  }, {threshold:0.5});
  document.querySelectorAll('.counter').forEach(el => obs.observe(el));
})();

/* ─── FRAUD BAR ANIMATION ─── */
(function(){
  const bars = document.querySelectorAll('.fraud-bar-fill');
  if(!bars.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        bars.forEach((bar,i) => {
          setTimeout(() => { bar.style.width = (bar.dataset.width || 0) + '%'; }, i * 150);
        });
        obs.disconnect();
      }
    });
  }, {threshold:0.5});
  const card = document.querySelector('.dashboard-card');
  if(card) obs.observe(card);
})();

/* ─── MOBILE NAV ─── */
(function(){
  const toggle = document.querySelector('.nav-mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if(!toggle || !mobileNav) return;
  toggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });
})();

/* ─── NAV SCROLL STATE ─── */
(function(){
  const nav = document.querySelector('.nav');
  if(!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, {passive:true});
})();

/* ─── ACTIVE NAV LINK ─── */
(function(){
  const sections = document.querySelectorAll('section[id],div[id]');
  const links = document.querySelectorAll('.nav-center a');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        links.forEach(l => {
          l.classList.remove('active');
          if(l.getAttribute('href') === '#' + e.target.id) l.classList.add('active');
        });
      }
    });
  }, {rootMargin:'-40% 0px -55% 0px'});
  sections.forEach(s => obs.observe(s));
})();

/* ─── ROI CALCULATOR ─── */
(function(){
  const sliders = {
    members: document.getElementById('roi-members'),
    gwp: document.getElementById('roi-gwp'),
    fraud: document.getElementById('roi-fraud'),
  };
  const vals = {
    members: document.getElementById('roi-members-val'),
    gwp: document.getElementById('roi-gwp-val'),
    fraud: document.getElementById('roi-fraud-val'),
  };
  const out = {
    total: document.getElementById('roi-total-savings'),
    fraud: document.getElementById('roi-fraud-savings'),
    ops: document.getElementById('roi-ops-savings'),
    prev: document.getElementById('roi-prev-savings'),
  };
  if(!sliders.members) return;

  function fmt(n){
    if(n >= 1000000) return 'EGP ' + (n/1000000).toFixed(1) + 'M';
    if(n >= 1000) return 'EGP ' + Math.round(n/1000) + 'K';
    return 'EGP ' + Math.round(n);
  }
  function fmtNum(n){ return n.toLocaleString(); }

  function calc(){
    const members = +sliders.members.value;
    const gwp = +sliders.gwp.value * 1000000; // EGP
    const fraudRate = +sliders.fraud.value / 100;

    vals.members.textContent = fmtNum(members);
    vals.gwp.textContent = sliders.gwp.value + 'M EGP';
    vals.fraud.textContent = sliders.fraud.value + '%';

    const fraudLoss = gwp * fraudRate;
    const fraudRecovery = fraudLoss * 0.30;
    const opsSavings = gwp * 0.20;
    const prevSavings = gwp * 0.15;
    const total = fraudRecovery + opsSavings + prevSavings;

    out.fraud.textContent = fmt(fraudRecovery);
    out.ops.textContent = fmt(opsSavings);
    out.prev.textContent = fmt(prevSavings);
    out.total.textContent = fmt(total);
  }

  Object.values(sliders).forEach(s => s.addEventListener('input', calc));
  calc();
})();
