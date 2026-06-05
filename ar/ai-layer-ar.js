/**
 * iRonic Health — طبقة تحليل المطالبات بالذكاء الاصطناعي
 * النسخة العربية · ar/ai-layer.js
 * ─────────────────────────────────────────────────────────
 * أضِف قبل </body> في ar/dashboard.html:
 *   <script src="ai-layer.js"></script>
 * ─────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── الألوان ─────────────────────────────────────────── */
  const BLUE  = '#4179AD';
  const NAVY  = '#0a1628';
  const GOLD  = '#CAB164';
  const GREEN = '#1d9e75';
  const AMBER = '#d97706';
  const RED   = '#dc2626';

  /* ── مراحل التحليل ───────────────────────────────────── */
  const PHASES = [
    'استقبال بيانات المطالبة...',
    'مطابقة رموز ICD / CPT...',
    'فحص ٢٥ نمط احتيال مصري...',
    'تحليل السجل التاريخي للمزود...',
    'حساب درجة المخاطرة...',
    'إصدار توصية الذكاء الاصطناعي...',
  ];

  /* ── بيانات تحليل المطالبات (مُعدَّة مسبقًا) ────────── */
  const ANALYSES = {

    'CLM-88842': {
      provider: 'مستشفى النيل',
      type: 'استشفاء داخلي',
      amount: '19,220 ج.م.',
      fraud_score: 91,
      risk_level: 'high',
      decision: 'auto_reject',
      confidence: 94,
      archetypes: ['فوترة وهمية', 'تضخيم تكاليف الإجراءات'],
      risks: [
        'إجراءات طبية بُوِّلت دون سجلات دخول مؤكَّدة في قاعدة البيانات.',
        'تكلفة المطالبة أعلى بنسبة ٧٨٪ من المعيار المرجعي لهذا التشخيص.',
        'مستشفى النيل: ثالث مطالبة مشبوهة خلال الربع الجاري — تنبيه نمط محتيال.',
        'درجة جودة المزود ٦٢/١٠٠ — تحت المراقبة المكثفة حاليًا.',
      ],
      clean: [],
      rec: 'رفض تلقائي والإحالة للتحقيق — فوترة وهمية مؤكَّدة مع تضخيم في التكاليف. بدء تدقيق على المزود.',
      summary: 'مطالبة عالية الخطورة تحمل مؤشرات فوترة وهمية وتضخيم تكاليف. لا توجد سجلات دخول مؤكَّدة للإجراءات المُدرَجة. تم الرفض التلقائي وإحالة الملف للتحقيق.',
    },

    'CLM-88841': {
      provider: 'القاهرة الجديد الطبي',
      type: 'استشارة خارجية',
      amount: '5,890 ج.م.',
      fraud_score: 12,
      risk_level: 'low',
      decision: 'auto_approve',
      confidence: 97,
      archetypes: [],
      risks: [],
      clean: [
        'رمز الإجراء متوافق مع تشخيص ICD-10 — تطابق سريري مؤكَّد.',
        'درجة جودة المزود ٩٣/١٠٠ — لا سجل احتيال خلال الـ ٢٤ شهرًا الماضية.',
      ],
      rec: 'اعتماد تلقائي — اجتازت المطالبة جميع فحوصات السريرية والفوترة والأهلية بثقة عالية.',
      summary: 'استشارة خارجية نظيفة في مرفق طبي عالي التقييم. جميع المؤشرات ضمن النطاق المتوقع. لا أنماط احتيال مكتشفة.',
    },

    'CLM-88840': {
      provider: 'مستشفى المعادي',
      type: 'استشفاء داخلي',
      amount: '89,900 ج.م.',
      fraud_score: 45,
      risk_level: 'medium',
      decision: 'cmo_review',
      confidence: 87,
      archetypes: ['انحراف عن المعيار التكلفي', 'إقامة مطوَّلة محتملة'],
      risks: [
        'تكلفة المطالبة أعلى بنسبة ٦١٪ من المعيار المرجعي لهذا التشخيص (متوقع ~55K ج.م.).',
        'مدة الإقامة (8 أيام) تتجاوز المدة المثلى المحسوبة بالذكاء الاصطناعي بـ 3.1 يوم.',
        'لم يُرفَق تقرير السريري للطبيب المعالج رغم ارتفاع التكلفة.',
      ],
      clean: [
        'درجة جودة مستشفى المعادي ٨٦/١٠٠ — مزود موثوق بشكل عام.',
        'تشخيص الدخول مناسب سريريًا للإقامة الداخلية.',
      ],
      rec: 'إحالة للمدير الطبي — التكلفة أعلى بـ٦١٪ من المعيار. مطلوب تقرير المعالج ومستندات الإقامة الموسَّعة قبل الاعتماد.',
      summary: 'مطالبة متوسطة الخطورة تتضمن انحرافًا عن المعيار التكلفي وإقامة أطول من المتوقع. المبرر السريري مطلوب قبل الاعتماد.',
    },

    'CLM-88839': {
      provider: 'النهضة الطبي',
      type: 'استشفاء داخلي',
      amount: '11,160 ج.م.',
      fraud_score: 8,
      risk_level: 'low',
      decision: 'auto_approve',
      confidence: 96,
      archetypes: [],
      risks: [],
      clean: [
        'تكلفة المطالبة ضمن نطاق ١٠٪ من المعيار المرجعي لهذا التشخيص.',
        'سلسلة الإحالة صحيحة — إجراء مناسب سريريًا وفق الوثيقة.',
      ],
      rec: 'اعتماد تلقائي — المطالبة مستوفية لجميع المعايير السريرية والمالية والأهلية.',
      summary: 'مطالبة نظيفة من مزود متوافق مع المعيار. لا مؤشرات مخاطرة مكتشفة.',
    },

    'CLM-88837': {
      provider: 'الشفاء الطبي',
      type: 'جراحة',
      amount: '14,725 ج.م.',
      fraud_score: 67,
      risk_level: 'medium',
      decision: 'cmo_review',
      confidence: 89,
      archetypes: ['تصعيد رمز التشفير', 'عدم تطابق تشخيص-إجراء'],
      risks: [
        'الإجراء المُقدَّم (جراحة) لا يتوافق مع رمز التشخيص الرئيسي — تصعيد تشفير محتمل.',
        'تكلفة ١٤,٧٢٥ ج.م. أعلى بنسبة ٤٣٪ من المتوسط لهذا الإجراء في نفس المنطقة.',
        'سجل المزود يُظهر ٣ حالات تصعيد تشفير مماثلة هذا الشهر.',
      ],
      clean: [
        'أهلية المريض مؤكَّدة — الوثيقة سارية بلا انقطاع.',
      ],
      rec: 'إحالة للمدير الطبي — تعارض بين رمز التشخيص والإجراء المُقدَّم مع انحراف تكلفي. مطلوب توضيح من الطبيب الجراح.',
      summary: 'مطالبة جراحية متوسطة الخطورة مع عدم تطابق سريري بين التشخيص والإجراء وانحراف في التكلفة. إحالة للمدير الطبي لإجراء مراجعة سريرية قبل الاعتماد.',
    },

    'CLM-88836': {
      provider: 'مستشفى دار الفؤاد',
      type: 'استشفاء داخلي',
      amount: '131,000 ج.م.',
      fraud_score: 22,
      risk_level: 'low',
      decision: 'auto_approve',
      confidence: 95,
      archetypes: [],
      risks: [],
      clean: [
        'التكلفة ضمن النطاق المتوقع لقسطرة قلبية — تطابق مع بيانات ٨٤٧ مطالبة مرجعية.',
        'درجة جودة دار الفؤاد ٩٦/١٠٠ — صفر سجل احتيال خلال ١٨ شهرًا.',
      ],
      rec: 'اعتماد تلقائي — مطالبة الإجراء القلبي مستوفية لجميع معايير التحقق السريري والمالي.',
      summary: 'مطالبة قسطرة قلبية نظيفة من مزود عالي التقييم. التكلفة متوافقة مع المعيار المرجعي. لا مؤشرات احتيال.',
    },
  };

  /* ── حقن CSS ─────────────────────────────────────────── */
  document.head.insertAdjacentHTML('beforeend', `<style>
    .irh-claim-row { cursor:pointer; transition:background .15s; }
    .irh-claim-row:hover { background:#EEF5FF !important; }

    #irhOverlay {
      position:fixed; inset:0; background:rgba(10,22,40,.45);
      z-index:1000; opacity:0; pointer-events:none;
      transition:opacity .25s; backdrop-filter:blur(2px);
    }
    #irhOverlay.on { opacity:1; pointer-events:all; }

    #irhPanel {
      position:fixed; top:0; left:0; bottom:0;
      width:520px; max-width:92vw;
      background:#fff; z-index:1001;
      box-shadow:8px 0 48px rgba(0,0,0,.18);
      transform:translateX(-100%);
      transition:transform .32s cubic-bezier(.4,0,.2,1);
      display:flex; flex-direction:column; overflow:hidden;
      font-family:'Cairo',system-ui,sans-serif;
      direction:rtl;
    }
    #irhPanel.on { transform:translateX(0); }

    .irh-hdr {
      background:${NAVY}; padding:18px 22px;
      display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
    }
    .irh-hdr-l { display:flex; align-items:center; gap:10px; }
    .irh-logo-sq {
      width:32px; height:32px; border-radius:8px; overflow:hidden;
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
    }
    .irh-logo-sq img { width:100%; height:100%; object-fit:contain; }
    .irh-hdr-title { font-size:13px; font-weight:700; color:#fff; font-family:'Cairo',sans-serif; }
    .irh-hdr-sub { font-size:11px; color:rgba(255,255,255,.45); margin-top:1px; font-family:'Cairo',sans-serif; }
    .irh-x {
      background:rgba(255,255,255,.1); border:none; color:#fff;
      width:30px; height:30px; border-radius:7px; cursor:pointer;
      font-size:15px; display:flex; align-items:center; justify-content:center;
      transition:background .15s; flex-shrink:0;
    }
    .irh-x:hover { background:rgba(255,255,255,.2); }
    .irh-body { flex:1; overflow-y:auto; padding:20px; }
    .irh-meta {
      background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px;
      padding:12px 16px; margin-bottom:18px;
      display:grid; grid-template-columns:1fr 1fr; gap:8px;
    }
    .irh-meta label { font-size:9px; font-weight:700; text-transform:uppercase;
      letter-spacing:.08em; color:#94a3b8; display:block; margin-bottom:1px;
      font-family:'Cairo',sans-serif; }
    .irh-meta span { font-size:13px; font-weight:600; color:#1e293b;
      font-family:'Cairo',sans-serif; }
    .irh-gauge-wrap { text-align:center; margin-bottom:18px; }
    .irh-lbl { font-size:9px; font-weight:700; text-transform:uppercase;
      letter-spacing:.09em; display:block; margin-bottom:8px; font-family:'Cairo',sans-serif; }
    .irh-card { border-radius:10px; padding:13px 15px; margin-bottom:12px; }
    .irh-card.risk  { background:#FFF5F5; border:1px solid #FECACA; }
    .irh-card.clean { background:#F0FDF4; border:1px solid #BBF7D0; }
    .irh-card.info  { background:#f8fafc; border:1px solid #e2e8f0; }
    .irh-row { display:flex; gap:8px; align-items:flex-start;
      font-size:13px; line-height:1.7; color:#1e293b; margin-bottom:6px;
      font-family:'Cairo',sans-serif; }
    .irh-row:last-child { margin-bottom:0; }
    .irh-row .ico { flex-shrink:0; margin-top:1px; }
    .irh-badges { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
    .irh-badge { background:#FEF3C7; color:#92400E; border:1px solid #FDE68A;
      border-radius:6px; padding:3px 11px; font-size:11px; font-weight:700;
      font-family:'Cairo',sans-serif; }
    .irh-footer { border-top:1px solid #e2e8f0; padding:14px 20px;
      background:#fff; flex-shrink:0; direction:rtl; }
    .irh-note { width:100%; border:1px solid #e2e8f0; border-radius:8px;
      padding:8px 12px; font-size:13px; font-family:'Cairo',sans-serif;
      color:#1e293b; outline:none; resize:none; margin-bottom:10px;
      direction:rtl; transition:border-color .15s; }
    .irh-note:focus { border-color:${BLUE}; }
    .irh-btns { display:flex; gap:8px; }
    .irh-btn { flex:1; padding:10px; border-radius:8px;
      font-size:13px; font-weight:700; cursor:pointer;
      border:none; font-family:'Cairo',sans-serif; transition:all .15s; }
    .irh-btn.sec { background:#f1f5f9; color:#64748b; }
    .irh-btn.sec:hover { background:#e2e8f0; }
    .irh-btn.app { background:${GREEN}; color:#fff; }
    .irh-btn.app:hover { background:#178a64; }
    .irh-btn.rej { background:${RED}; color:#fff; }
    .irh-btn.rej:hover { background:#b91c1c; }
    .irh-btn.pri { background:${BLUE}; color:#fff; }
    .irh-btn.pri:hover { background:#2d5f8a; }
    .irh-spin-wrap { text-align:center; padding:40px 20px; }
    .irh-orb { width:72px; height:72px; border-radius:50%;
      border:2px solid rgba(65,121,173,.25); background:rgba(65,121,173,.07);
      display:flex; align-items:center; justify-content:center;
      margin:0 auto 20px; animation:irhP 1.6s ease-in-out infinite; }
    .irh-orb-dot { width:28px; height:28px; border-radius:50%;
      background:${BLUE}; }
    @keyframes irhP { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:.85} }
    .irh-phase-txt { font-size:14px; font-weight:700; color:${BLUE};
      min-height:22px; margin-bottom:16px; font-family:'Cairo',sans-serif; }
    .irh-prog-bg { background:#e2e8f0; border-radius:4px; height:4px;
      overflow:hidden; margin-bottom:20px; }
    .irh-prog-fill { height:100%; border-radius:4px;
      background:linear-gradient(90deg,${BLUE},${GOLD}); transition:width .3s ease; }
    .irh-plist { text-align:right; }
    .irh-pitem { display:flex; align-items:center; justify-content:flex-end; gap:10px;
      padding:6px 0; font-size:12.5px; color:#94a3b8;
      border-bottom:1px solid #f1f5f9; font-family:'Cairo',sans-serif; }
    .irh-pitem.done { color:#1e293b; }
    .irh-pitem.cur  { color:${BLUE}; font-weight:700; }
    .irh-pdot { width:20px; height:20px; border-radius:50%; flex-shrink:0;
      background:#e2e8f0; border:1px solid #e2e8f0;
      display:flex; align-items:center; justify-content:center; font-size:10px; }
    .irh-pdot.done { background:${GREEN}; border-color:${GREEN}; color:#fff; }
    .irh-pdot.cur  { background:${BLUE}; border-color:${BLUE}; color:#fff; }
    .irh-audit-row { display:flex; justify-content:space-between; align-items:center;
      padding:7px 0; border-bottom:1px solid #f1f5f9; font-size:12px; }
    .irh-audit-row:last-child { border:none; }
    .irh-audit-k { color:#94a3b8; font-family:'Cairo',sans-serif; }
    .irh-audit-v { color:#1e293b; font-weight:700; font-family:monospace; font-size:11px; direction:ltr; }

    /* Sidebar AI button */
    #irhAiBtn {
      display:flex; align-items:center; gap:10px;
      background:rgba(202,177,100,.08); border:1px solid rgba(202,177,100,.22);
      border-radius:10px; padding:10px 14px; margin:12px 16px 4px;
      cursor:pointer; text-decoration:none; transition:background .15s;
      direction:rtl;
    }
    #irhAiBtn:hover { background:rgba(202,177,100,.15); }
  </style>`);

  /* ── إنشاء الطبقة الشفافة والنافذة الجانبية ─────────── */
  document.body.insertAdjacentHTML('beforeend', `
    <div id="irhOverlay"></div>
    <div id="irhPanel">
      <div class="irh-hdr">
        <button class="irh-x" id="irhX">✕</button>
        <div class="irh-hdr-l">
          <div>
            <div class="irh-hdr-title">تحليل المطالبة بالذكاء الاصطناعي</div>
            <div class="irh-hdr-sub" id="irhSubtitle">—</div>
          </div>
          <div class="irh-logo-sq">
            <img src="../assets/H_Badge_icon_Gold_with_white_H.svg" alt="iRonic Health">
          </div>
        </div>
      </div>
      <div class="irh-body" id="irhBody"></div>
      <div class="irh-footer" id="irhFoot" style="display:none"></div>
    </div>
  `);

  /* ── الحالة ──────────────────────────────────────────── */
  let cur = null, analysis = null, phaseTimer = null;

  /* ── فتح / إغلاق النافذة ────────────────────────────── */
  function openPanel(claimId) {
    cur = { id: claimId, ...(ANALYSES[claimId] || {}) };
    document.getElementById('irhSubtitle').textContent = claimId;
    document.getElementById('irhOverlay').classList.add('on');
    document.getElementById('irhPanel').classList.add('on');
    document.getElementById('irhFoot').style.display = 'none';
    showAnalyzing();
  }
  function closePanel() {
    document.getElementById('irhOverlay').classList.remove('on');
    document.getElementById('irhPanel').classList.remove('on');
    if (phaseTimer) clearInterval(phaseTimer);
    cur = null; analysis = null;
  }

  /* ── مساعدات الألوان ─────────────────────────────────── */
  function col(s)   { return s < 30 ? GREEN : s < 70 ? AMBER : RED; }
  function colBg(s) { return s < 30 ? '#F0FDF4' : s < 70 ? '#FFFBEB' : '#FFF5F5'; }

  /* ── مقياس الدرجة (SVG) ──────────────────────────────── */
  function gauge(score) {
    const R=70, cx=88, cy=88, len=Math.PI*R;
    const a = Math.PI*(1-score/100);
    const nx = cx+R*Math.cos(a), ny = cy-R*Math.sin(a);
    const off = len*(1-score/100), c = col(score);
    return `<svg viewBox="0 0 176 108" width="200" height="124" style="display:block;margin:0 auto">
      <path d="M${cx-R} ${cy} A${R} ${R} 0 0 1 ${cx+R} ${cy}"
        fill="none" stroke="#E2E8F0" stroke-width="13" stroke-linecap="round"/>
      <path d="M${cx-R} ${cy} A${R} ${R} 0 0 1 ${cx+R} ${cy}"
        fill="none" stroke="${c}" stroke-width="13" stroke-linecap="round"
        stroke-dasharray="${len}" stroke-dashoffset="${off}"/>
      <circle cx="${nx}" cy="${ny}" r="8" fill="${c}"/>
      <circle cx="${nx}" cy="${ny}" r="3.5" fill="#fff"/>
      <text x="${cx}" y="${cy+2}" text-anchor="middle" fill="${c}"
        font-size="42" font-weight="700" font-family="monospace">${score}</text>
      <text x="${cx}" y="${cy+17}" text-anchor="middle" fill="#94a3b8"
        font-size="9" font-family="Cairo">/ ١٠٠</text>
      <text x="${cx-R-4}" y="${cy+14}" text-anchor="middle" fill="#CBD5E1" font-size="8">0</text>
      <text x="${cx+R+4}" y="${cy+14}" text-anchor="middle" fill="#CBD5E1" font-size="8">100</text>
    </svg>`;
  }

  /* ── شاشة التحليل ────────────────────────────────────── */
  function showAnalyzing() {
    document.getElementById('irhBody').innerHTML = `
      <div class="irh-spin-wrap">
        <div class="irh-orb"><div class="irh-orb-dot"></div></div>
        <div style="font-size:18px;font-weight:800;color:#0a1628;margin-bottom:6px;font-family:'Cairo',sans-serif;">جاري التحليل...</div>
        <div class="irh-phase-txt" id="irhPTxt">${PHASES[0]}</div>
        <div class="irh-prog-bg"><div class="irh-prog-fill" id="irhPBar" style="width:0%"></div></div>
        <div class="irh-plist">${PHASES.map((p,i)=>`
          <div class="irh-pitem${i===0?' cur':''}" id="irhP${i}">
            <span>${p}</span>
            <div class="irh-pdot${i===0?' cur':''}" id="irhPD${i}">●</div>
          </div>`).join('')}
        </div>
      </div>`;

    let p = 0;
    phaseTimer = setInterval(() => {
      p = Math.min(p+1, PHASES.length-1);
      document.getElementById('irhPTxt').textContent = PHASES[p];
      document.getElementById('irhPBar').style.width = `${(p/(PHASES.length-1))*85}%`;
      for (let i=0; i<PHASES.length; i++) {
        const row=document.getElementById(`irhP${i}`);
        const dot=document.getElementById(`irhPD${i}`);
        if (!row) continue;
        row.className = `irh-pitem${i<p?' done':i===p?' cur':''}`;
        dot.className = `irh-pdot${i<p?' done':i===p?' cur':''}`;
        dot.textContent = i<p ? '✓' : '●';
      }
    }, 720);

    setTimeout(() => {
      clearInterval(phaseTimer);
      document.getElementById('irhPBar').style.width = '100%';
      const a = ANALYSES[cur.id] || fallback(cur);
      analysis = a;
      setTimeout(() => showResults(a), 400);
    }, 4400);
  }

  function fallback(claim) {
    const s = parseInt(claim.score) || 50;
    return {
      fraud_score:s, confidence:82,
      risk_level: s<30?'low':s<70?'medium':'high',
      decision:   s<30?'auto_approve':s<70?'cmo_review':'auto_reject',
      archetypes: s>50?['شذوذ في الفوترة']:[],
      risks: s>50?['انحراف التكلفة عن المعيار المرجعي لهذا نوع المطالبة.']:[],
      clean: s<70?['المزود ضمن الشبكة المعتمدة.']:[],
      rec: s>70?'رفض تلقائي والتحقيق.':s>30?'إحالة للمدير الطبي.':'اعتماد تلقائي.',
      summary: 'اكتمل تحليل الذكاء الاصطناعي. راجع عوامل الخطر والمؤشرات أدناه.',
    };
  }

  /* ── شاشة النتائج ────────────────────────────────────── */
  function showResults(a) {
    analysis = a;
    const c = col(a.fraud_score), bg = colBg(a.fraud_score);
    const decLabel = a.decision==='auto_approve' ? '✓ اعتماد تلقائي'
                   : a.decision==='cmo_review'   ? '⚠ مراجعة المدير الطبي مطلوبة'
                   :                               '✕ رفض تلقائي';

    document.getElementById('irhBody').innerHTML = `
      <div class="irh-meta">
        <div><label>المزود</label><span>${cur.provider||'—'}</span></div>
        <div><label>المبلغ</label><span>${cur.amount||'—'}</span></div>
        <div><label>النوع</label><span>${cur.type||'—'}</span></div>
        <div><label>دقة التحليل</label><span>${a.confidence}٪</span></div>
      </div>
      <div class="irh-gauge-wrap">${gauge(a.fraud_score)}</div>
      <div style="text-align:center;margin-bottom:18px">
        <div style="display:inline-block;background:${bg};color:${c};
          border:1px solid ${c}30;border-radius:8px;padding:7px 20px;
          font-size:14px;font-weight:700;font-family:'Cairo',sans-serif;">${decLabel}</div>
      </div>
      <div class="irh-card info">
        <span class="irh-lbl" style="color:#64748b">ملخص التحليل</span>
        <div style="font-size:13.5px;line-height:1.85;color:#1e293b;font-family:'Cairo',sans-serif">${a.summary}</div>
      </div>
      ${a.archetypes?.length ? `
        <span class="irh-lbl" style="color:#92400E;margin-bottom:8px;display:block">أنماط الاحتيال المكتشفة</span>
        <div class="irh-badges">${a.archetypes.map(x=>`<span class="irh-badge">${x}</span>`).join('')}</div>` : ''}
      ${a.risks?.length ? `
        <div class="irh-card risk">
          <span class="irh-lbl" style="color:${RED}">عوامل الخطر</span>
          ${a.risks.map(r=>`<div class="irh-row"><i class="ico" style="color:${RED}">⚠</i><span>${r}</span></div>`).join('')}
        </div>` : ''}
      ${a.clean?.length ? `
        <div class="irh-card clean">
          <span class="irh-lbl" style="color:${GREEN}">مؤشرات النظافة</span>
          ${a.clean.map(r=>`<div class="irh-row"><i class="ico" style="color:${GREEN}">✓</i><span>${r}</span></div>`).join('')}
        </div>` : ''}
      <div class="irh-card" style="border-color:${c}25;background:${bg}">
        <span class="irh-lbl" style="color:${c}">توصية الذكاء الاصطناعي للمدير الطبي</span>
        <div style="font-size:13.5px;line-height:1.85;font-family:'Cairo',sans-serif">${a.rec}</div>
      </div>`;

    const foot = document.getElementById('irhFoot');
    foot.style.display = 'block';
    if (a.decision === 'cmo_review') {
      foot.innerHTML = `
        <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;display:block;margin-bottom:8px;font-family:'Cairo',sans-serif">قرار المدير الطبي</span>
        <textarea class="irh-note" id="irhNote" rows="2" placeholder="أضف ملاحظتك السريرية (اختياري)..."></textarea>
        <div class="irh-btns">
          <button class="irh-btn sec" id="irhBtnClose">إغلاق</button>
          <button class="irh-btn rej" id="irhBtnRej">✕ رفض</button>
          <button class="irh-btn app" id="irhBtnApp">✓ اعتماد</button>
        </div>`;
      document.getElementById('irhBtnClose').onclick = closePanel;
      document.getElementById('irhBtnApp').onclick = () => showAudit('approved');
      document.getElementById('irhBtnRej').onclick = () => showAudit('rejected');
    } else {
      foot.innerHTML = `
        <div class="irh-btns">
          <button class="irh-btn sec" id="irhBtnClose">إغلاق</button>
          <button class="irh-btn pri" id="irhBtnAudit">عرض سجل FRA ←</button>
        </div>`;
      document.getElementById('irhBtnClose').onclick = closePanel;
      document.getElementById('irhBtnAudit').onclick = () => showAudit(a.decision);
    }
  }

  /* ── شاشة سجل المراجعة ───────────────────────────────── */
  function showAudit(finalDec) {
    const a = analysis;
    const ok  = finalDec === 'approved' || finalDec === 'auto_approve';
    const c   = ok ? GREEN : RED;
    const icon = ok ? '✓' : '✕';
    const auditRef = 'FRA-' + Math.random().toString(36).substr(2,9).toUpperCase();
    const ts = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
    const note = document.getElementById('irhNote')?.value || '';

    document.getElementById('irhBody').innerHTML = `
      <div style="text-align:center;padding:24px 0 16px">
        <div style="width:60px;height:60px;border-radius:50%;background:${c}12;
          border:2px solid ${c};display:flex;align-items:center;justify-content:center;
          font-size:24px;color:${c};margin:0 auto 12px;">${icon}</div>
        <div style="font-size:20px;font-weight:800;color:${c};font-family:'Cairo',sans-serif">
          ${ok ? 'تمت الموافقة على المطالبة' : 'تم رفض المطالبة'}
        </div>
        <div style="font-size:11.5px;color:#94a3b8;margin-top:4px;font-family:'Cairo',sans-serif">
          سجل مراجعة مُولَّد تلقائيًا بواسطة الهيئة المالية للرقابة
        </div>
      </div>
      <div class="irh-card info" style="margin:0 0 14px">
        <div style="font-size:10px;font-weight:700;color:${BLUE};letter-spacing:.1em;
          text-transform:uppercase;margin-bottom:14px;font-family:monospace">
          FRA AUDIT TRAIL — ${auditRef}
        </div>
        ${[
          ['رقم المطالبة',       cur.id],
          ['مرجع سجل FRA',      auditRef],
          ['المزود',             cur.provider||'—'],
          ['المبلغ',             cur.amount||'—'],
          ['درجة مخاطرة AI',     `${a.fraud_score} / 100`],
          ['قرار الذكاء الاصطناعي', a.decision==='auto_approve'?'قبول تلقائي':a.decision==='cmo_review'?'مراجعة CMO':'رفض تلقائي'],
          ['القرار النهائي',     ok?'مقبولة ✓':'مرفوضة ✕'],
          ['الطابع الزمني',      ts],
          ['التوقيع التشفيري',   'RSA-4096 · موقَّع ✓'],
          ...(note ? [['ملاحظة المدير الطبي', note]] : []),
        ].map(([k,v])=>`<div class="irh-audit-row">
          <span class="irh-audit-k">${k}</span>
          <span class="irh-audit-v">${v}</span>
        </div>`).join('')}
      </div>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;
        padding:12px;text-align:center;font-size:11.5px;color:#94a3b8;
        line-height:1.8;font-family:'Cairo',sans-serif">
        تم تسجيل هذا القرار في سجل مراجعة غير قابل للتعديل<br>
        القرار ٢٢٩/٢٠٢٥ (FRA) · قانون PDPL ١٥١/٢٠٢٠
      </div>`;

    document.getElementById('irhFoot').innerHTML = `
      <div class="irh-btns">
        <button class="irh-btn sec" id="irhBtnDone">إغلاق</button>
        <button class="irh-btn pri" onclick="window.print()">تصدير تقرير FRA</button>
      </div>`;
    document.getElementById('irhBtnDone').onclick = closePanel;
  }

  /* ── إضافة حدث النقر لصفوف المطالبات ───────────────── */
  function attachHandlers() {
    document.querySelectorAll('table').forEach(tbl => {
      tbl.querySelectorAll('tbody tr, tr').forEach(row => {
        const match = row.textContent.match(/CLM-\d{5,}/);
        if (!match || row.dataset.irhDone) return;
        row.dataset.irhDone = '1';
        row.classList.add('irh-claim-row');
        row.title = 'انقر لعرض تحليل الذكاء الاصطناعي';
        row.addEventListener('click', () => openPanel(match[0]));
      });
    });
  }

  /* ── زر تجربة الذكاء الاصطناعي في الشريط الجانبي ────── */
  (function addSidebarBtn() {
    function inject() {
      const sb = document.querySelector('.sb-logo, .sb > div:first-child');
      if (!sb || document.getElementById('irhAiBtn')) return;
      const btn = document.createElement('a');
      btn.id = 'irhAiBtn';
      btn.href = '../ai-experience.html';
      btn.innerHTML = `
        <div style="flex:1;text-align:right">
          <div style="font-size:12px;font-weight:700;color:#CAB164;line-height:1.2;font-family:'Cairo',sans-serif">تجربة الذكاء الاصطناعي ⚡</div>
          <div style="font-size:10px;color:rgba(202,177,100,.55);margin-top:1px;font-family:'Cairo',sans-serif">كشف الاحتيال · مباشر</div>
        </div>
        <span style="font-size:10px;color:rgba(202,177,100,.4)">←</span>`;
      sb.parentNode.insertBefore(btn, sb.nextSibling);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', inject);
    } else {
      setTimeout(inject, 700);
    }
  })();

  /* ── أحداث الإغلاق ───────────────────────────────────── */
  document.getElementById('irhX').addEventListener('click', closePanel);
  document.getElementById('irhOverlay').addEventListener('click', closePanel);

  /* ── تشغيل ───────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHandlers);
  } else {
    setTimeout(attachHandlers, 600);
  }

})();
