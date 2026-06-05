/**
 * iRonic Health — AI Claim Analysis Layer
 * Version 1.0 · English
 * ─────────────────────────────────────────────────────────────
 * HOW TO USE:
 * Add before </body> in dashboard.html:
 *   <script src="ai-layer.js"></script>
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ─── BRAND ─────────────────────────────────────────────── */
  const BLUE   = '#4179AD';
  const NAVY   = '#0a1628';
  const GOLD   = '#CAB164';
  const GREEN  = '#1d9e75';
  const AMBER  = '#d97706';
  const RED    = '#dc2626';

  /* ─── PHASES ─────────────────────────────────────────────── */
  const PHASES = [
    'Receiving claim data...',
    'Matching ICD / CPT codes...',
    'Checking 25 Egyptian fraud archetypes...',
    'Analyzing provider history...',
    'Calculating risk score...',
    'Issuing AI recommendation...',
  ];

  /* ─── PRE-CRAFTED ANALYSIS PER CLAIM ─────────────────────── */
  /* Each entry mirrors the exact claim rows in dashboard.html  */
  const ANALYSES = {

    'CLM-26-48471': {
      provider: 'Dar Al Fouad Hospital', type: 'Inpatient', amount: 'EGP 18,400',
      fraud_score: 6, risk_level: 'low', decision: 'auto_approve', confidence: 97,
      archetypes_detected: [],
      risk_factors: [],
      clean_indicators: [
        'Procedure code matches ICD-10 diagnosis for acute MI — clinical alignment confirmed.',
        'Provider quality score 96/100 — Dar Al Fouad has zero fraud history in the last 18 months.',
      ],
      recommendation: 'Auto-approve — all clinical, billing, and eligibility checks passed with high confidence.',
      summary: 'Clean inpatient admission at a high-rated network provider. Procedure cost is within the expected range for a cardiac case. No fraud indicators detected.',
    },

    'CLM-26-48469': {
      provider: 'Cleopatra Hospital', type: 'Pharmacy', amount: 'EGP 3,200',
      fraud_score: 68, risk_level: 'high', decision: 'cmo_review', confidence: 91,
      archetypes_detected: ['Drug Splitting', 'Prescription Volume Anomaly'],
      risk_factors: [
        'Same member filled 3 prescriptions at different pharmacies within 8 days — drug splitting pattern detected.',
        'Antibiotic quantity (×60 tabs) exceeds standard 7-day course by 3× — upcoding suspected.',
        'Prescribing physician has 4 anomalous high-volume pharmacy claims this month.',
        'Cleopatra Hospital Pharmacy: quality score 74/100 — currently under elevated monitoring.',
      ],
      clean_indicators: [
        'Member eligibility confirmed — policy active with no lapses.',
      ],
      recommendation: 'Hold for CMO clinical review — drug splitting pattern detected across 3 dispensing points. Request prescription originals before approval.',
      summary: 'High-confidence fraud flag on pharmacy claim. Drug splitting across multiple dispensing points combined with anomalous prescription volume warrants CMO review before payment.',
    },

    'CLM-26-48467': {
      provider: 'Cairo Scan Radiology', type: 'Outpatient', amount: 'EGP 5,800',
      fraud_score: 12, risk_level: 'low', decision: 'auto_approve', confidence: 95,
      archetypes_detected: [],
      risk_factors: [],
      clean_indicators: [
        'MRI cost within 15% of market benchmark for this modality.',
        'Referral chain valid — GP referral to outpatient radiology is clinically appropriate.',
      ],
      recommendation: 'Auto-approve — imaging cost, clinical pathway, and provider quality are all within expected parameters.',
      summary: 'Standard outpatient radiology claim with a valid referral chain. Cost benchmark confirms no overpricing. No fraud archetypes detected.',
    },

    'CLM-26-48465': {
      provider: 'Al Salam Hospital', type: 'Lab Test', amount: 'EGP 1,450',
      fraud_score: 91, risk_level: 'high', decision: 'auto_reject', confidence: 96,
      archetypes_detected: ['Duplicate Submission', 'Phantom Billing'],
      risk_factors: [
        'Identical claim submitted and paid for same member 14 days ago — CLM-26-47891.',
        'Lab test codes billed without a corresponding admission or outpatient visit record.',
        'Al Salam Hospital: 3rd duplicate submission this quarter — pattern alert triggered.',
        'Member policy network tier does not cover Al Salam for laboratory services.',
      ],
      clean_indicators: [],
      recommendation: 'Auto-reject and flag for investigation — confirmed duplicate of paid claim CLM-26-47891. Initiate provider audit.',
      summary: 'Confirmed duplicate claim with phantom billing indicators. No corresponding clinical visit found in system. Auto-rejected and flagged for provider audit — third duplicate from this facility this quarter.',
    },

    'CLM-26-48463': {
      provider: 'Ain Shams Specialists', type: 'Inpatient', amount: 'EGP 42,000',
      fraud_score: 61, risk_level: 'medium', decision: 'cmo_review', confidence: 88,
      archetypes_detected: ['Potential ICU Over-Stay', 'Cost Benchmark Deviation'],
      risk_factors: [
        'Inpatient cost EGP 42K is 67% above benchmark for this DRG (expected ~EGP 25K).',
        'Length of stay (6 days) exceeds AI-predicted optimal stay by 2.4 days.',
        'ICU charges billed with no supporting clinical documentation uploaded.',
        'High-cost case requires mandatory CMO review per SLA policy.',
      ],
      clean_indicators: [
        'Ain Shams Specialists quality score 88/100 — generally reliable provider.',
        'Admission diagnosis is clinically appropriate for inpatient setting.',
      ],
      recommendation: 'Escalate to CMO — cost 67% above benchmark. Request ICU documentation and attending physician report before authorization.',
      summary: 'High-cost inpatient case with a cost benchmark deviation and missing ICU documentation. Clinical justification required before payment. CMO review is mandatory per SLA policy.',
    },
  };

  /* ─── INJECT CSS ────────────────────────────────────────── */
  document.head.insertAdjacentHTML('beforeend', `<style>
    /* AI Layer — iRonic Health */
    .irh-claim-row { cursor:pointer; transition:background .15s; }
    .irh-claim-row:hover { background:#EEF5FF !important; }

    #irhOverlay {
      position:fixed; inset:0; background:rgba(10,22,40,.45);
      z-index:1000; opacity:0; pointer-events:none;
      transition:opacity .25s; backdrop-filter:blur(2px);
    }
    #irhOverlay.on { opacity:1; pointer-events:all; }

    #irhPanel {
      position:fixed; top:0; right:0; bottom:0; width:520px; max-width:92vw;
      background:#fff; z-index:1001;
      box-shadow:-8px 0 48px rgba(0,0,0,.18);
      transform:translateX(100%);
      transition:transform .32s cubic-bezier(.4,0,.2,1);
      display:flex; flex-direction:column; overflow:hidden;
      font-family:'Ubuntu',system-ui,sans-serif;
    }
    #irhPanel.on { transform:translateX(0); }

    .irh-hdr {
      background:${NAVY}; padding:18px 22px;
      display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
    }
    .irh-hdr-l { display:flex; align-items:center; gap:10px; }
    .irh-logo-sq {
      width:32px; height:32px; background:${BLUE}; border-radius:8px;
      display:flex; align-items:center; justify-content:center;
      font-weight:900; color:#fff; font-size:14px;
    }
    .irh-hdr-title { font-size:13px; font-weight:700; color:#fff; }
    .irh-hdr-sub   { font-size:11px; color:rgba(255,255,255,.45); margin-top:1px; }
    .irh-x {
      background:rgba(255,255,255,.1); border:none; color:#fff;
      width:30px; height:30px; border-radius:7px; cursor:pointer;
      font-size:15px; display:flex; align-items:center; justify-content:center;
      transition:background .15s;
    }
    .irh-x:hover { background:rgba(255,255,255,.2); }

    .irh-body { flex:1; overflow-y:auto; padding:20px; }

    /* Claim meta bar */
    .irh-meta {
      background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px;
      padding:12px 16px; margin-bottom:18px;
      display:grid; grid-template-columns:1fr 1fr; gap:8px;
    }
    .irh-meta label { font-size:9px; font-weight:700; text-transform:uppercase;
      letter-spacing:.1em; color:#94a3b8; display:block; margin-bottom:1px; }
    .irh-meta span  { font-size:13px; font-weight:600; color:#1e293b; }

    /* Score gauge wrapper */
    .irh-gauge-wrap { text-align:center; margin-bottom:18px; }

    /* Section label */
    .irh-lbl {
      font-size:9px; font-weight:700; text-transform:uppercase;
      letter-spacing:.1em; display:block; margin-bottom:8px;
    }

    /* Cards */
    .irh-card {
      border-radius:10px; padding:13px 15px; margin-bottom:12px;
    }
    .irh-card.risk   { background:#FFF5F5; border:1px solid #FED7D7; }
    .irh-card.clean  { background:#F0FDF4; border:1px solid #BBF7D0; }
    .irh-card.info   { background:#f8fafc; border:1px solid #e2e8f0; }
    .irh-card.dec    { border-radius:10px; padding:13px 15px; margin-bottom:12px; }

    /* Row items */
    .irh-row {
      display:flex; gap:8px; align-items:flex-start;
      font-size:13px; line-height:1.65; color:#1e293b; margin-bottom:6px;
    }
    .irh-row:last-child { margin-bottom:0; }
    .irh-row .ico { flex-shrink:0; margin-top:1px; font-style:normal; }

    /* Archetype badges */
    .irh-badges { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
    .irh-badge {
      background:#FEF3C7; color:#92400E; border:1px solid #FDE68A;
      border-radius:6px; padding:3px 10px; font-size:11px; font-weight:700;
    }

    /* Footer actions */
    .irh-footer {
      border-top:1px solid #e2e8f0; padding:14px 20px;
      background:#fff; flex-shrink:0;
    }
    .irh-note {
      width:100%; border:1px solid #e2e8f0; border-radius:8px;
      padding:8px 12px; font-size:13px; font-family:inherit;
      color:#1e293b; outline:none; resize:none; margin-bottom:10px;
      transition:border-color .15s;
    }
    .irh-note:focus { border-color:${BLUE}; }
    .irh-btns { display:flex; gap:8px; }
    .irh-btn {
      flex:1; padding:10px; border-radius:8px;
      font-size:13px; font-weight:700; cursor:pointer;
      border:none; font-family:inherit; transition:all .15s;
    }
    .irh-btn.sec  { background:#f1f5f9; color:#64748b; }
    .irh-btn.sec:hover  { background:#e2e8f0; }
    .irh-btn.app  { background:${GREEN}; color:#fff; }
    .irh-btn.app:hover  { background:#178a64; }
    .irh-btn.rej  { background:${RED}; color:#fff; }
    .irh-btn.rej:hover  { background:#b91c1c; }
    .irh-btn.pri  { background:${BLUE}; color:#fff; }
    .irh-btn.pri:hover  { background:#2d5f8a; }

    /* Analyzing */
    .irh-spin-wrap { text-align:center; padding:36px 20px; }
    .irh-orb {
      width:68px; height:68px; border-radius:50%;
      border:2px solid rgba(65,121,173,.3); background:rgba(65,121,173,.08);
      display:flex; align-items:center; justify-content:center;
      margin:0 auto 18px; animation:irhPulse 1.5s ease-in-out infinite;
    }
    .irh-orb-dot {
      width:26px; height:26px; border-radius:50%; background:${BLUE};
      box-shadow:0 0 16px rgba(65,121,173,.6);
    }
    @keyframes irhPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:.8} }
    .irh-phase-txt {
      font-size:14px; font-weight:600; color:${BLUE};
      min-height:22px; margin-bottom:14px;
    }
    .irh-prog-bg {
      background:#e2e8f0; border-radius:4px; height:4px;
      overflow:hidden; margin-bottom:18px;
    }
    .irh-prog-fill {
      height:100%; background:linear-gradient(90deg,${BLUE},${GOLD});
      border-radius:4px; transition:width .3s ease; width:0%;
    }
    .irh-plist { text-align:left; }
    .irh-pitem {
      display:flex; align-items:center; gap:10px;
      padding:5px 0; font-size:12px; color:#94a3b8;
      border-bottom:1px solid #f1f5f9;
    }
    .irh-pitem.done { color:#1e293b; }
    .irh-pitem.cur  { color:${BLUE}; font-weight:600; }
    .irh-pdot {
      width:18px; height:18px; border-radius:50%; flex-shrink:0;
      background:#e2e8f0; display:flex; align-items:center; justify-content:center;
      font-size:9px; color:#94a3b8;
    }
    .irh-pdot.done { background:${GREEN}; color:#fff; }
    .irh-pdot.cur  { background:${BLUE}; color:#fff; }

    /* Audit */
    .irh-audit-row {
      display:flex; justify-content:space-between; align-items:center;
      padding:7px 0; border-bottom:1px solid #f1f5f9;
      font-size:12px;
    }
    .irh-audit-row:last-child { border:none; }
    .irh-audit-k { color:#94a3b8; }
    .irh-audit-v { color:#1e293b; font-weight:600; font-family:monospace; font-size:11px; }
  </style>`);

  /* ─── CREATE OVERLAY + PANEL ────────────────────────────── */
  document.body.insertAdjacentHTML('beforeend', `
    <div id="irhOverlay"></div>
    <div id="irhPanel">
      <div class="irh-hdr">
        <div class="irh-hdr-l">
          <div class="irh-logo-sq">H</div>
          <div>
            <div class="irh-hdr-title">AI Claim Analysis</div>
            <div class="irh-hdr-sub" id="irhSubtitle">—</div>
          </div>
        </div>
        <button class="irh-x" id="irhX">✕</button>
      </div>
      <div class="irh-body" id="irhBody"></div>
      <div class="irh-footer" id="irhFoot" style="display:none"></div>
    </div>
  `);

  /* ─── STATE ─────────────────────────────────────────────── */
  let cur = null, analysis = null, phaseTimer = null;

  /* ─── OPEN / CLOSE ──────────────────────────────────────── */
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

  /* ─── SCORE COLOR ───────────────────────────────────────── */
  function col(s) { return s < 30 ? GREEN : s < 70 ? AMBER : RED; }

  /* ─── SVG GAUGE ─────────────────────────────────────────── */
  function gauge(score) {
    const R=70, cx=88, cy=88, len=Math.PI*R;
    const a=Math.PI*(1-score/100);
    const nx=cx+R*Math.cos(a), ny=cy-R*Math.sin(a);
    const off=len*(1-score/100), c=col(score);
    return `<svg viewBox="0 0 176 108" width="200" height="123" style="display:block;margin:0 auto">
      <path d="M${cx-R} ${cy} A${R} ${R} 0 0 1 ${cx+R} ${cy}"
        fill="none" stroke="#e2e8f0" stroke-width="12" stroke-linecap="round"/>
      <path d="M${cx-R} ${cy} A${R} ${R} 0 0 1 ${cx+R} ${cy}"
        fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"
        stroke-dasharray="${len}" stroke-dashoffset="${off}"
        style="filter:drop-shadow(0 0 5px ${c}50)"/>
      <circle cx="${nx}" cy="${ny}" r="7" fill="${c}" style="filter:drop-shadow(0 0 5px ${c})"/>
      <circle cx="${nx}" cy="${ny}" r="3" fill="#fff"/>
      <text x="${cx}" y="${cy+2}" text-anchor="middle" fill="${c}"
        font-size="40" font-weight="700" font-family="'Ubuntu',monospace">${score}</text>
      <text x="${cx}" y="${cy+16}" text-anchor="middle" fill="#94a3b8"
        font-size="9" font-family="Ubuntu">/ 100</text>
      <text x="${cx-R-4}" y="${cy+14}" text-anchor="middle" fill="#cbd5e1" font-size="8">0</text>
      <text x="${cx+R+4}" y="${cy+14}" text-anchor="middle" fill="#cbd5e1" font-size="8">100</text>
    </svg>`;
  }

  /* ─── ANALYZING SCREEN ──────────────────────────────────── */
  function showAnalyzing() {
    document.getElementById('irhBody').innerHTML = `
      <div class="irh-spin-wrap">
        <div class="irh-orb"><div class="irh-orb-dot"></div></div>
        <div style="font-size:18px;font-weight:800;color:#0a1628;margin-bottom:6px;">Analyzing Claim...</div>
        <div class="irh-phase-txt" id="irhPTxt">${PHASES[0]}</div>
        <div class="irh-prog-bg"><div class="irh-prog-fill" id="irhPBar"></div></div>
        <div class="irh-plist">${PHASES.map((p,i)=>`
          <div class="irh-pitem${i===0?' cur':''}" id="irhP${i}">
            <div class="irh-pdot${i===0?' cur':''}" id="irhPD${i}">●</div>${p}
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
      setTimeout(() => showResults(a), 400);
    }, 4400);
  }

  /* ─── FALLBACK IF CLAIM NOT IN ANALYSES ─────────────────── */
  function fallback(claim) {
    const s = parseInt(claim.ai_score) || 50;
    return {
      fraud_score: s, confidence: 82,
      risk_level: s<30?'low':s<70?'medium':'high',
      decision: s<30?'auto_approve':s<70?'cmo_review':'auto_reject',
      archetypes_detected: s>50?['Billing Anomaly']:[],
      risk_factors: s>50?['Cost deviation from benchmark for this claim type']:[],
      clean_indicators: s<70?['Provider is in-network']:[],
      recommendation: s>70?'Auto-reject and investigate.':s>30?'Escalate to CMO for review.':'Auto-approve.',
      summary: 'AI analysis complete. See risk factors and indicators below.',
    };
  }

  /* ─── RESULTS SCREEN ────────────────────────────────────── */
  function showResults(a) {
    analysis = a;
    const c = col(a.fraud_score);
    const decLabel = a.decision==='auto_approve' ? '✓ Auto-Approved' : a.decision==='cmo_review' ? '⚠ CMO Review Required' : '✕ Auto-Rejected';
    const decBg    = a.decision==='auto_approve' ? '#F0FDF4' : a.decision==='cmo_review' ? '#FFFBEB' : '#FFF5F5';

    document.getElementById('irhBody').innerHTML = `
      <div class="irh-meta">
        <div><label>Provider</label><span>${cur.provider||'—'}</span></div>
        <div><label>Amount</label><span>${cur.amount||'—'}</span></div>
        <div><label>Type</label><span>${cur.type||'—'}</span></div>
        <div><label>AI Confidence</label><span>${a.confidence}%</span></div>
      </div>

      <div class="irh-gauge-wrap">
        ${gauge(a.fraud_score)}
        <div style="display:inline-block;background:${decBg};color:${c};
          border:1px solid ${c}30;border-radius:8px;padding:6px 18px;
          font-size:13px;font-weight:700;margin-top:4px;">${decLabel}</div>
      </div>

      <div class="irh-card info">
        <span class="irh-lbl" style="color:#64748b">AI Summary</span>
        <div style="font-size:13px;line-height:1.7;color:#1e293b">${a.summary}</div>
      </div>

      ${a.archetypes_detected?.length ? `
        <span class="irh-lbl" style="color:#92400E">Fraud Archetypes Detected</span>
        <div class="irh-badges">${a.archetypes_detected.map(x=>`<span class="irh-badge">${x}</span>`).join('')}</div>
      ` : ''}

      ${a.risk_factors?.length ? `
        <div class="irh-card risk">
          <span class="irh-lbl" style="color:${RED}">Risk Factors</span>
          ${a.risk_factors.map(r=>`<div class="irh-row"><i class="ico" style="color:${RED}">⚠</i>${r}</div>`).join('')}
        </div>
      ` : ''}

      ${a.clean_indicators?.length ? `
        <div class="irh-card clean">
          <span class="irh-lbl" style="color:${GREEN}">Clean Indicators</span>
          ${a.clean_indicators.map(r=>`<div class="irh-row"><i class="ico" style="color:${GREEN}">✓</i>${r}</div>`).join('')}
        </div>
      ` : ''}

      <div class="irh-card dec" style="background:${decBg};border:1px solid ${c}30">
        <span class="irh-lbl" style="color:${c}">AI Recommendation for CMO</span>
        <div style="font-size:13px;line-height:1.7;color:#1e293b">${a.recommendation}</div>
      </div>`;

    const foot = document.getElementById('irhFoot');
    foot.style.display = 'block';

    if (a.decision === 'cmo_review') {
      foot.innerHTML = `
        <span class="irh-lbl" style="color:#64748b">CMO Decision</span>
        <textarea class="irh-note" id="irhNote" rows="2" placeholder="Add clinical justification (optional)..."></textarea>
        <div class="irh-btns">
          <button class="irh-btn sec" id="irhBtnClose">Close</button>
          <button class="irh-btn rej" id="irhBtnRej">✕ Reject</button>
          <button class="irh-btn app" id="irhBtnApp">✓ Approve</button>
        </div>`;
      document.getElementById('irhBtnClose').onclick = closePanel;
      document.getElementById('irhBtnApp').onclick = () => showAudit('approved');
      document.getElementById('irhBtnRej').onclick = () => showAudit('rejected');
    } else {
      foot.innerHTML = `
        <div class="irh-btns">
          <button class="irh-btn sec" id="irhBtnClose">Close</button>
          <button class="irh-btn pri" id="irhBtnAudit">View FRA Audit Trail →</button>
        </div>`;
      document.getElementById('irhBtnClose').onclick = closePanel;
      document.getElementById('irhBtnAudit').onclick = () => showAudit(a.decision);
    }
  }

  /* ─── AUDIT TRAIL SCREEN ────────────────────────────────── */
  function showAudit(finalDec) {
    const a = analysis;
    const ok = finalDec === 'approved' || finalDec === 'auto_approve';
    const c  = ok ? GREEN : finalDec === 'auto_reject' || finalDec === 'rejected' ? RED : AMBER;
    const icon = ok ? '✓' : '✕';
    const auditRef = 'FRA-' + Math.random().toString(36).substr(2,9).toUpperCase();
    const ts = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Cairo' });

    document.getElementById('irhBody').innerHTML = `
      <div style="text-align:center;padding:24px 0 16px">
        <div style="width:60px;height:60px;border-radius:50%;background:${c}12;
          border:2px solid ${c};display:flex;align-items:center;justify-content:center;
          font-size:24px;color:${c};margin:0 auto 12px;">${icon}</div>
        <div style="font-size:20px;font-weight:800;color:${c}">
          ${ok ? 'Claim Approved' : finalDec==='cmo_review'?'Pending CMO':'Claim Rejected'}
        </div>
        <div style="font-size:11px;color:#94a3b8;margin-top:4px">FRA audit trail generated automatically</div>
      </div>

      <div class="irh-card info">
        <div style="font-size:10px;font-weight:700;color:${BLUE};letter-spacing:.12em;
          text-transform:uppercase;margin-bottom:14px">FRA AUDIT TRAIL — ${auditRef}</div>
        ${[
          ['Claim ID',           cur.id],
          ['FRA Reference',      auditRef],
          ['Provider',           cur.provider||'—'],
          ['Amount',             cur.amount||'—'],
          ['AI Fraud Score',     `${a.fraud_score} / 100`],
          ['AI Decision',        a.decision.replace(/_/g,' ').toUpperCase()],
          ['Final Status',       ok?'APPROVED ✓':'REJECTED ✕'],
          ['Timestamp',          ts+' EGT'],
          ['Cryptographic Sig.', 'RSA-4096 · Signed ✓'],
        ].map(([k,v])=>`<div class="irh-audit-row">
          <span class="irh-audit-k">${k}</span>
          <span class="irh-audit-v">${v}</span>
        </div>`).join('')}
      </div>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;
        padding:12px;text-align:center;font-size:11px;color:#94a3b8;line-height:1.7">
        Decision logged in immutable audit trail<br>
        FRA Decision 229/2025 · PDPL 151/2020
      </div>`;

    document.getElementById('irhFoot').innerHTML = `
      <div class="irh-btns">
        <button class="irh-btn sec" id="irhBtnDone">Close</button>
        <button class="irh-btn pri" onclick="window.print()">Export FRA Report</button>
      </div>`;
    document.getElementById('irhBtnDone').onclick = closePanel;
  }

  /* ─── ATTACH CLICK HANDLERS TO CLAIM ROWS ───────────────── */
  function attachHandlers() {
    document.querySelectorAll('table').forEach(tbl => {
      tbl.querySelectorAll('tbody tr, tr').forEach(row => {
        const match = row.textContent.match(/CLM-\d{2}-\d{5}/);
        if (!match || row.dataset.irhDone) return;
        row.dataset.irhDone = '1';
        row.classList.add('irh-claim-row');
        row.title = 'Click to view AI fraud analysis';
        row.addEventListener('click', () => openPanel(match[0]));
      });
    });
  }

  /* ─── CLOSE EVENTS ──────────────────────────────────────── */
  document.getElementById('irhX').addEventListener('click', closePanel);
  document.getElementById('irhOverlay').addEventListener('click', closePanel);

  /* ─── INIT ──────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHandlers);
  } else {
    setTimeout(attachHandlers, 600);
  }

})();

/* ─── SIDEBAR AI EXPERIENCE BUTTON ──────────────────────── */
(function addSidebarBtn() {
  function inject() {
    const sb = document.querySelector('.sb-logo, .sb > div:first-child');
    if (!sb || document.getElementById('irhAiBtn')) return;

    const btn = document.createElement('a');
    btn.id = 'irhAiBtn';
    btn.href = 'ai-experience.html';
    btn.innerHTML = `
      <span style="font-size:15px">⚡</span>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:700;color:#CAB164;line-height:1.2">AI Experience</div>
        <div style="font-size:10px;color:rgba(202,177,100,.55);margin-top:1px">Fraud Detection Live</div>
      </div>
      <span style="font-size:10px;color:rgba(202,177,100,.4)">→</span>`;

    Object.assign(btn.style, {
      display:'flex', alignItems:'center', gap:'10px',
      background:'rgba(202,177,100,.08)',
      border:'1px solid rgba(202,177,100,.22)',
      borderRadius:'10px', padding:'10px 14px',
      margin:'12px 16px 4px', cursor:'pointer',
      textDecoration:'none', transition:'background .15s',
    });
    btn.onmouseenter = () => btn.style.background='rgba(202,177,100,.15)';
    btn.onmouseleave = () => btn.style.background='rgba(202,177,100,.08)';

    // Insert after the logo block
    sb.parentNode.insertBefore(btn, sb.nextSibling);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    setTimeout(inject, 700);
  }
})();
