/**
 * iRonic Health — AI Analysis Helper
 * Include in every page: <script src="ai-api.js"></script>
 * For pages in /ar/ folder:  <script src="../ai-api.js"></script>
 *
 * Usage:
 *   const result = await window.iRonicAnalyze(claimObject, 'en');
 *   const result = await window.iRonicAnalyze(claimObject, 'ar');
 */

(function () {

  /* ── UPDATE THIS after Vercel deploy ─────────────────
     Replace with your actual Vercel project URL:
     e.g. https://ironic-health-api.vercel.app          */
  const VERCEL_URL = 'https://ironic-health-api.vercel.app';

  /* ── Main analysis function ─────────────────────────── */
  window.iRonicAnalyze = async function (claim, language = 'en') {
    const res = await fetch(`${VERCEL_URL}/api/analyze`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ claim, language }),
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  };

  /* ── Health check ───────────────────────────────────── */
  window.iRonicAPIReady = async function () {
    try {
      const res = await fetch(`${VERCEL_URL}/api/analyze`, { method: 'OPTIONS' });
      return res.ok;
    } catch {
      return false;
    }
  };

})();
