import { C } from "../data/clinical.js";
import { UI, L } from "../data/i18n.js";
import { fitness, alternatives } from "../engine/rules.js";
import { Badge } from "./Atoms.jsx";

function CoverChip({c,lang}){
  const t = UI[lang];
  const label = c==="covered" ? t.covered : c==="not_covered" ? t.notCovered : t.coveredPA;
  const tone = c==="covered" ? "g" : c==="not_covered" ? "b" : "w";
  return <Badge tone={tone}>{label}</Badge>;
}

export default function DrugIntelligenceDrawer({intel,setIntel,st,P,lang,addMed,meds}){
  if(!intel) return null;
  const t = UI[lang];
  const fit = fitness(intel,st,P);
  const alts = alternatives(intel,st,P);
  const inPlan = meds.some(m=>m.id===intel.id);

  return (
    <div onClick={()=>setIntel(null)} style={{position:"fixed",inset:0,background:"rgba(30,48,72,.45)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:50}}>
      <div onClick={e=>e.stopPropagation()} className="pop" style={{width:"100%",maxWidth:560,maxHeight:"88vh",overflowY:"auto",background:"#fff",borderTopLeftRadius:16,borderTopRightRadius:16}}>
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.line}`,display:"flex",justifyContent:"space-between",position:"sticky",top:0,background:"#fff"}}>
          <div>
            <div className="k" style={{fontSize:16,fontWeight:700}}>{L(lang,intel)} <span style={{fontSize:12,color:C.mute,fontWeight:400}}>{lang==="ar"?intel.en:""}</span></div>
            <div className="m" style={{fontSize:11,color:C.mute}}>ATC {intel.atc} · {L(lang,intel.clsAr?{ar:intel.clsAr,en:intel.clsEn}:null)}</div>
          </div>
          <button onClick={()=>setIntel(null)} style={{fontSize:13,color:C.mute,background:"none",border:"none",cursor:"pointer"}}>{t.close}</button>
        </div>

        <div style={{padding:16}}>
          <div style={{borderRadius:6,padding:10,marginBottom:12,background:fit.bad.length?"#FEECEC":fit.cau.length?"#FEF6E7":"#E9F9EE"}}>
            <div style={{fontSize:13,fontWeight:700,color:fit.bad.length?C.block:fit.cau.length?C.warn:C.ok}}>
              {fit.bad.length?t.notSuitable:fit.cau.length?t.suitableCaution:t.suitable}
            </div>
            {[...fit.bad,...fit.cau].map((x,i)=><div key={i} style={{fontSize:13,marginTop:4}}>• {L(lang,x)}</div>)}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14,fontSize:12}}>
            <div style={{borderRadius:6,padding:8,background:"#F2F4F6"}}>
              <div style={{color:C.mute,fontSize:11}}>{t.covered==="Covered"?"Coverage":"التغطية"}</div>
              <div style={{marginTop:4}}><CoverChip c={intel.cover} lang={lang}/></div>
            </div>
            <div style={{borderRadius:6,padding:8,background:"#F2F4F6"}}>
              <div style={{color:C.mute,fontSize:11}}>{lang==="ar"?"تكلفة الشهر":"Monthly cost"}</div>
              <div className="m" style={{marginTop:4,fontWeight:700}}>{intel.price.toLocaleString()} {t.perMonth.split("/")[0]}</div>
            </div>
          </div>

          <div className="k" style={{fontSize:14,fontWeight:700,marginBottom:8}}>{t.tradeNamesTitle}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
            {(intel.trade||[]).map(tr=>
              <div key={tr.n} style={{borderRadius:6,padding:"6px 10px",fontSize:12,border:`1px solid ${C.line}`,display:"flex",gap:6,alignItems:"center"}}>
                <b>{tr.n}</b><span style={{color:C.mute}}>{tr.mfr}</span>
                {tr.og && <Badge tone="w">{t.original}</Badge>}
                {tr.lowConf && <span style={{color:C.warn,fontSize:11}}>{t.lowConf}</span>}
              </div>)}
          </div>

          <div className="k" style={{fontSize:14,fontWeight:700,marginBottom:4}}>{t.alternativesTitle}</div>
          <p style={{fontSize:11,color:C.mute,marginBottom:8}}>{t.alternativesNote}</p>
          {alts.slice(0,5).map(a=>(
            <div key={a.id} style={{borderRadius:6,padding:10,marginBottom:6,border:`1px solid ${a.fit.bad.length?"#F3D5D2":C.line}`,
                display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,opacity:a.fit.bad.length?0.65:1}}>
              <div style={{minWidth:0}}>
                <div style={{fontSize:13}}>
                  {a.fit.bad.length?"✕":a.fit.cau.length?"!":"✓"} {L(lang,a)}
                  <span style={{fontSize:11,color:C.mute}}> · {a.same ? t.sameClass : L(lang,{ar:a.clsAr,en:a.clsEn})}</span>
                </div>
                <div style={{fontSize:11,marginTop:2,color:a.fit.bad.length?C.block:C.mute}}>
                  {L(lang,a.fit.bad[0]) || L(lang,a.fit.cau[0]) || t.noContraindication}
                </div>
                <div style={{fontSize:11,marginTop:2,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <CoverChip c={a.cover} lang={lang}/>
                  <span className="m" style={{color:C.mute}}>{a.price.toLocaleString()} {t.perMonth}</span>
                  {a.price!==intel.price &&
                    <span className="m" style={{color:a.price<intel.price?C.ok:C.block}}>
                      {a.price<intel.price?"−":"+"}{Math.abs(a.price-intel.price).toLocaleString()}
                    </span>}
                </div>
              </div>
              <button onClick={()=>addMed(a)} disabled={a.fit.bad.length>0} style={{borderRadius:6,padding:"6px 10px",fontSize:11,cursor:"pointer",flexShrink:0,
                border:"none",background:a.fit.bad.length?"#E7EAEE":C.soft,color:a.fit.bad.length?C.mute:C.dark}}>
                {t.replace}
              </button>
            </div>
          ))}

          <button onClick={()=>{ if(!inPlan) addMed(intel); else setIntel(null); }} disabled={fit.bad.length>0 && !inPlan}
            style={{width:"100%",borderRadius:6,padding:10,fontSize:13,marginTop:10,cursor:"pointer",border:"none",fontWeight:600,
              background:inPlan?"#E7EAEE":fit.bad.length?"#E7EAEE":C.blue, color:inPlan||fit.bad.length?C.mute:"#fff"}}>
            {inPlan ? (lang==="ar"?"مضاف بالفعل — إغلاق":"Already added — close") : fit.bad.length ? t.cannotAdd : t.addToPlan}
          </button>
        </div>
      </div>
    </div>
  );
}
