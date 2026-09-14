import { DRUGS } from "../data/clinical.js";

export function evaluate(st,P){
  const f=[],M=st.meds,cls=k=>M.filter(m=>m.cls===k),onCur=k=>P.current.some(c=>c.cls===k);
  const contrast=st.imaging.some(i=>i.contrast),ch=k=>st.chronicList.includes(k);
  const met=M.find(m=>m.atc==="A10BA02");
  if(met){
    if(P.eGFR<30)f.push({id:"MET-RENAL-01",sev:"block",t:{ar:"الميتفورمين ممنوع عند ترشيح أقل من ٣٠",en:"Metformin contraindicated below eGFR 30"},alt:{ar:"ليناجليبتين",en:"Linagliptin"}});
    else if(P.eGFR<45)f.push({id:"MET-RENAL-02",sev:"warn",t:{ar:`الترشيح ${P.eGFR} — لا يُنصح بالبدء؛ الحد الأقصى ١جم يوميًا`,en:`eGFR ${P.eGFR} — initiation not advised; max 1 g/day`},alt:{ar:"ليناجليبتين",en:"Linagliptin"}});
    if(contrast)f.push({id:"MET-CONTRAST-01",sev:"block",cross:true,t:{ar:"إيقاف الميتفورمين قبل الصبغة وإعادة تقييم الكلى بعد ٤٨ ساعة",en:"Withhold metformin before contrast; reassess renal function after 48h"}});
  }
  if(cls("sulfonylurea").length&&ch(5))f.push({id:"SU-G6PD-01",sev:"block",t:{ar:"نقص G6PD مع السلفونيل يوريا — خطر فقر دم انحلالي",en:"G6PD deficiency with sulfonylurea — haemolytic anaemia risk"},alt:{ar:"ليناجليبتين",en:"Linagliptin"}});
  if(cls("sulfonylurea").length&&st.allergyList.includes(0))f.push({id:"SU-ALLERGY-01",sev:"block",t:{ar:"حساسية السلفا — مضاد استطباب للسلفونيل يوريا",en:"Sulfa allergy — contraindicates sulfonylureas"}});
  if(cls("sulfonylurea").length&&onCur("sulfonylurea"))f.push({id:"SU-DUP-01",sev:"block",cross:true,t:{ar:"المريض على سلفونيل يوريا بالفعل — ازدواج داخل الفئة",en:"Patient already on a sulfonylurea — in-class duplication"}});
  if(cls("glp1").length>1)f.push({id:"GLP1-DUPLICATE-01",sev:"block",t:{ar:"لا يجوز الجمع بين مُنبِّهين لـ GLP-1 — Risk X",en:"Two GLP-1 agonists cannot be combined — Risk X"}});
  if(cls("dpp4").length>1)f.push({id:"DPP4-DUPLICATE-01",sev:"block",t:{ar:"ازدواج بين مثبطي DPP-4",en:"Duplication between two DPP-4 inhibitors"}});
  if(M.find(m=>m.atc==="A10BG03")&&ch(3))f.push({id:"PIO-HF-01",sev:"block",t:{ar:"البيوجليتازون ممنوع مع هبوط القلب",en:"Pioglitazone contraindicated with heart failure"}});
  if(cls("insulin").length&&(M.length>1||onCur("sulfonylurea")))f.push({id:"INS-TRANSFER-01",sev:"warn",t:{ar:"إضافة أنسولين لعلاج قائم — يُنظر في خفض ابتدائي ٢٠٪",en:"Adding insulin to existing therapy — consider initial 20% dose reduction"}});
  M.forEach(m=>{const e=m.dose*m.freq*m.dur;if(Math.abs(e-m.qty)>1)f.push({id:"QTY-RECONCILE-01",sev:"block",t:{ar:`${m.ar}: الكمية ${m.qty} ≠ ${e}`,en:`${m.en}: quantity ${m.qty} ≠ ${e}`}});});
  M.filter(m=>m.cover==="not_covered").forEach(m=>f.push({id:"FORMULARY-01",sev:"warn",t:{ar:`${m.ar} خارج قائمة التغطية — التكلفة على المريض بالكامل`,en:`${m.en} is outside the formulary — full cost to patient`}}));
  if(M.length&&P.hba1cDays>180&&!st.labs.some(l=>l.id==="A1C"))f.push({id:"HBA1C-MISSING-01",sev:"warn",t:{ar:`آخر HbA1c من ${P.hba1cDays} يومًا ولم يُطلب`,en:`Last HbA1c ${P.hba1cDays} days ago and not ordered`},alt:{ar:"أضف HbA1c لتأمين المطالبة",en:"Add HbA1c to support the claim"}});
  if(!st.vitals.bp)f.push({id:"OBJ-MISSING-01",sev:"warn",t:{ar:"لم تُسجَّل أي علامة حيوية — الضرورة الطبية بلا سند",en:"No vital signs recorded — medical necessity unsupported"}});
  return f;
}

export function fitness(d,st,P){
  const bad=[],cau=[];
  if(d.renal.min&&P.eGFR<d.renal.min)bad.push({ar:`ممنوع عند ترشيح ${P.eGFR} — الحد ${d.renal.min}`,en:`Contraindicated at eGFR ${P.eGFR} — threshold ${d.renal.min}`});
  else if(d.renal.adjust&&P.eGFR<d.renal.adjust)cau.push(d.renal.band);
  else if(d.renal.min&&P.eGFR<d.renal.min+15)cau.push(d.renal.band);
  if(d.ci?.g6pd&&st.chronicList.includes(5))bad.push({ar:"نقص G6PD — خطر فقر دم انحلالي",en:"G6PD deficiency — haemolytic anaemia risk"});
  if(d.ci?.sulfa&&st.allergyList.includes(0))bad.push({ar:"حساسية السلفا — مضاد استطباب",en:"Sulfa allergy — contraindicated"});
  if(d.ci?.hf&&st.chronicList.includes(3))bad.push({ar:"هبوط القلب — مضاد استطباب",en:"Heart failure — contraindicated"});
  if(P.current.some(c=>c.cls===d.cls))cau.push({ar:"المريض على دواء من نفس الفئة بالفعل",en:"Patient already on a drug from this class"});
  return {bad,cau,ok:bad.length===0};
}

/**
 * RESTORED — dropped from the single-file HTML merge on 2026-08-20 to save size.
 * Ranks every other drug indicated for the same diagnosis against THIS patient:
 *   1. Suitable (no contraindication) before unsuitable
 *   2. Fewer cautions before more cautions
 *   3. Lower price before higher price
 * This is what lets the physician see "cheaper isn't always ranked first" —
 * the platform ranks by clinical fit, then cost, never cost alone.
 */
export function alternatives(d,st,P){
  return DRUGS.filter(x=>x.id!==d.id && x.indic.some(i=>d.indic.includes(i)))
    .map(x=>({...x, fit:fitness(x,st,P), same:x.cls===d.cls}))
    .sort((a,b)=>
      (b.fit.ok - a.fit.ok) ||
      (a.fit.cau.length - b.fit.cau.length) ||
      (a.price - b.price)
    );
}
