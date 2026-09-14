import { useState, useEffect } from "react";
import { C } from "../data/clinical.js";
import { UI, L } from "../data/i18n.js";
import { Box, Badge, RuleFlag } from "../components/Atoms.jsx";

const SEED_REQUESTS = [
  {id:"REQ-88209",patient:"Y.M. · 35",facility:"Network Hospital — Cairo",physician:"Dr. (Lic. 184320)",
   dx:{ar:"قصور الغدة الدرقية (E03.9)",en:"Hypothyroidism (E03.9)"},plan:{ar:"ليفوثيروكسين ٥٠ ميكروجرام",en:"Levothyroxine 50 mcg"},submittedMin:14,cost:55,flags:[],fraudScore:2,status:"auto_approved",decidedSec:3},
  {id:"REQ-88210",patient:"R.K. · 52",facility:"Network Hospital — Tanta",physician:"Dr. (Lic. 331205)",
   dx:{ar:"سكري نوع ٢ (E11)",en:"Type 2 Diabetes (E11)"},plan:{ar:"ميتفورمين ١جم يوميًا",en:"Metformin 1g daily"},submittedMin:19,cost:95,
   flags:[{id:"HBA1C-MISSING-01",sev:"warn",t:{ar:"لا يوجد HbA1c خلال آخر ٦ شهور ولم يُطلب",en:"No HbA1c in last 6 months and not ordered"}}],fraudScore:5,status:"auto_modified",decidedSec:4},
  {id:"REQ-88215",patient:"N.H. · 41",facility:"Al Safa Clinics — Giza",physician:"Dr. (Lic. 104419)",
   dx:{ar:"سكري نوع ٢ (E11)",en:"Type 2 Diabetes (E11)"},plan:{ar:"سيماجلوتيد ٧مج + ليراجلوتيد ٦مج/مل",en:"Semaglutide 7mg + Liraglutide 6mg/mL"},submittedMin:1,cost:8000,
   flags:[{id:"GLP1-DUPLICATE-01",sev:"block",t:{ar:"لا يجوز الجمع بين مُنبِّهين لمستقبلات GLP-1 — Risk X",en:"Two GLP-1 agonists cannot be combined — Risk X"}}],fraudScore:34,status:"cmo_pending"},
];

const RULE_FREQ = [{id:"HBA1C-MISSING-01",n:41},{id:"QTY-RECONCILE-01",n:29},{id:"MET-RENAL-02",n:18},
 {id:"SU-G6PD-01",n:11},{id:"MET-CONTRAST-01",n:7},{id:"GLP1-DUPLICATE-01",n:4}];

const PRESCRIBERS = [{code:"184320",facility:"Network Hospital — Cairo",n:62,exceptionPct:8,topFlag:"HBA1C-MISSING-01"},
 {code:"299102",facility:"Network Hospital — Alexandria",n:44,exceptionPct:14,topFlag:"MET-CONTRAST-01"},
 {code:"104419",facility:"Al Safa Clinics — Giza",n:37,exceptionPct:22,topFlag:"GLP1-DUPLICATE-01"}];

export { SEED_REQUESTS };

export default function TPAView({lang,requests,setRequests,highlightId}){
  const t = UI[lang];
  const [tab,setTab] = useState("queue");
  const [openId,setOpenId] = useState(highlightId||null);
  const [rationale,setRationale] = useState("");

  useEffect(()=>{ if(highlightId){ setTab("queue"); setOpenId(highlightId); } },[highlightId]);

  const open = requests.find(r=>r.id===openId);
  const pending = requests.filter(r=>r.status==="cmo_pending")
    .sort((a,b)=>b.flags.filter(f=>f.sev==="block").length-a.flags.filter(f=>f.sev==="block").length || b.cost-a.cost);
  const decided = requests.filter(r=>r.status!=="cmo_pending");
  const autoRate = Math.round((decided.filter(r=>r.status.startsWith("auto")).length/(requests.length||1))*100);
  const avgAuto = Math.round(decided.filter(r=>r.decidedSec).reduce((a,r)=>a+r.decidedSec,0)/(decided.filter(r=>r.decidedSec).length||1))||0;

  const decide = outcome => {
    setRequests(rs => rs.map(r => r.id===openId ? {...r,status:outcome,cmoRationale:rationale||undefined} : r));
    setOpenId(null); setRationale("");
  };

  return (
    <div>
      <div style={{padding:"12px 16px",background:"#fff",borderBottom:`1px solid ${C.line}`,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {[[t.pendingQueue,pending.length,C.block],[t.autoRate,autoRate+"%",C.ok],[t.avgTime,avgAuto+"s",C.blue],[t.demoSrc,t.liveDemo,C.dark]].map(([l,v,c])=>
          <div key={l} style={{borderRadius:6,padding:10,background:C.off}}>
            <div style={{fontSize:11,color:C.mute}}>{l}</div><div className="m" style={{fontSize:16,fontWeight:700,color:c}}>{v}</div>
          </div>)}
      </div>

      <div style={{padding:"8px 16px",background:"#fff",borderBottom:`1px solid ${C.line}`,display:"flex",gap:6}}>
        {[["queue",t.queueTab],["decided",t.decidedTab],["patterns",t.patternsTab]].map(([k,l])=>
          <button key={k} onClick={()=>setTab(k)} style={{borderRadius:6,padding:"5px 12px",fontSize:12,cursor:"pointer",
            border:`1px solid ${tab===k?C.blue:C.line}`,background:tab===k?C.blue:"#fff",color:tab===k?"#fff":C.mute}}>{l}</button>)}
      </div>

      <div style={{padding:16}}>
        {tab==="queue" && <div>
          <p style={{fontSize:12,color:C.mute,marginBottom:10}}>{t.sortNote}</p>
          {pending.length===0 && <Box style={{padding:20,textAlign:"center"}}><span style={{color:C.ok}}>{t.noPending}</span></Box>}
          {pending.map(r=>{
            const blocks = r.flags.filter(f=>f.sev==="block").length;
            return <Box key={r.id} onClick={()=>setOpenId(r.id)} style={{padding:14,marginBottom:10,cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
                <div>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                    <span className="m" style={{fontSize:11,color:C.mute}}>{r.id}</span>
                    <span style={{fontSize:13,fontWeight:600}}>{r.patient}</span><Badge>{L(lang,r.dx)}</Badge></div>
                  <div style={{fontSize:11,color:C.mute,marginTop:4}}>{r.facility} · {r.physician}</div>
                  <div style={{fontSize:13,marginTop:6}}>{L(lang,r.plan)}</div></div>
                <div style={{textAlign:"left",flexShrink:0}}><Badge tone="b">{blocks} {t.blockingBadge}</Badge>
                  <div className="m" style={{fontSize:13,marginTop:4,color:C.dark,fontWeight:700}}>{r.cost.toLocaleString()} EGP</div></div>
              </div></Box>;
          })}</div>}

        {tab==="decided" && <div>
          {decided.map(r=>{
            const label = t.statusMap[r.status];
            const tone = r.status.includes("declined")||r.status==="cmo_pending" ? "b" : r.status.includes("modified") ? "w" : "g";
            return <Box key={r.id} style={{padding:14,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
                <div><div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <span className="m" style={{fontSize:11,color:C.mute}}>{r.id}</span>
                  <span style={{fontSize:13,fontWeight:600}}>{r.patient}</span><Badge tone={tone}>{label}</Badge></div>
                  <div style={{fontSize:11,color:C.mute,marginTop:4}}>{r.facility} · {r.physician}</div>
                  <div style={{fontSize:13,marginTop:6}}>{L(lang,r.plan)}</div>
                  {r.cmoRationale && <div style={{fontSize:12,marginTop:6,color:C.dark}}>{t.noteLine} {r.cmoRationale}</div>}</div>
                <div className="m" style={{fontSize:13,color:C.dark,fontWeight:700}}>{r.cost.toLocaleString()} EGP</div>
              </div></Box>;
          })}</div>}

        {tab==="patterns" && <div>
          <div style={{borderRadius:6,padding:12,marginBottom:14,fontSize:12,background:C.soft,color:C.dark}}>{t.patternsNote}</div>
          <Box style={{padding:0,marginBottom:16,overflow:"hidden"}}>
            <table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
              <thead><tr style={{background:C.off}}>
                {[t.colCode,t.colFacility,t.colReq,t.colExc,t.colTop].map(h=>
                  <th key={h} style={{textAlign:lang==="ar"?"right":"left",padding:"8px 10px",fontSize:11,color:C.mute}}>{h}</th>)}
              </tr></thead>
              <tbody>{PRESCRIBERS.map(p=><tr key={p.code} style={{borderTop:`1px solid ${C.line}`}}>
                <td className="m" style={{padding:"8px 10px"}}>{p.code}</td>
                <td style={{padding:"8px 10px",fontSize:12}}>{p.facility}</td>
                <td className="m" style={{padding:"8px 10px"}}>{p.n}</td>
                <td className="m" style={{padding:"8px 10px",color:p.exceptionPct>18?C.warn:C.ink}}>{p.exceptionPct}%</td>
                <td className="m" style={{padding:"8px 10px",fontSize:11,color:C.mute}}>{p.topFlag}</td></tr>)}</tbody>
            </table></Box>
          <div className="k" style={{fontSize:14,fontWeight:700,marginBottom:8}}>{t.topRules}</div>
          <Box style={{padding:14}}>
            {RULE_FREQ.map(r=><div key={r.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span className="m" style={{width:120,fontSize:11,color:C.mute}}>{r.id}</span>
              <div style={{flex:1,height:8,borderRadius:4,background:"#F2F4F6",overflow:"hidden"}}><div style={{width:(r.n/41*100)+"%",height:"100%",background:C.blue}}/></div>
              <span className="m" style={{fontSize:11,width:22}}>{r.n}</span></div>)}
          </Box>
        </div>}
      </div>

      {open && <div onClick={()=>setOpenId(null)} style={{position:"fixed",inset:0,background:"rgba(30,48,72,.45)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:50}}>
        <div onClick={e=>e.stopPropagation()} className="pop" style={{width:"100%",maxWidth:520,maxHeight:"88vh",overflowY:"auto",background:"#fff",borderTopLeftRadius:16,borderTopRightRadius:16}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.line}`,display:"flex",justifyContent:"space-between"}}>
            <div><div className="k" style={{fontSize:16,fontWeight:700}}>{open.id}</div><div style={{fontSize:11,color:C.mute}}>{open.facility} · {open.physician}</div></div>
            <button onClick={()=>setOpenId(null)} style={{fontSize:13,color:C.mute,background:"none",border:"none",cursor:"pointer"}}>{t.close}</button></div>
          <div style={{padding:16}}>
            <div style={{borderRadius:6,padding:10,marginBottom:12,background:C.soft}}>
              <div style={{fontSize:13,fontWeight:600}}>{open.patient} · {L(lang,open.dx)}</div>
              <div style={{fontSize:13,marginTop:4}}>{L(lang,open.plan)}</div>
              <div className="m" style={{fontSize:11,marginTop:6,color:C.dark}}>{open.cost.toLocaleString()} EGP</div></div>
            <div className="k" style={{fontSize:14,fontWeight:700,marginBottom:8}}>{t.reasonTitle}</div>
            {open.flags.length ? open.flags.map((f,i)=><RuleFlag key={i} f={f} lang={lang}/>) : <p style={{fontSize:13,color:C.mute}}>{t.noRules}</p>}
            <div style={{borderRadius:6,padding:10,margin:"12px 0",background:"#F2F4F6"}}>
              <div style={{fontSize:11,display:"flex",justifyContent:"space-between"}}><span style={{color:C.mute}}>{t.fraudLabel}</span>
                <span className="m" style={{fontWeight:700}}>{open.fraudScore}/100</span></div></div>
            <div style={{fontSize:11,color:C.mute,marginBottom:4}}>{t.decisionNote}</div>
            <textarea value={rationale} onChange={e=>setRationale(e.target.value)} rows={2} placeholder={t.notePlaceholder}
              style={{width:"100%",borderRadius:6,padding:8,fontSize:13,border:`1px solid ${C.line}`,marginBottom:10}}/>
            <div style={{display:"grid",gap:8}}>
              <button onClick={()=>decide("cmo_approved")} style={{borderRadius:6,padding:10,fontSize:13,fontWeight:600,cursor:"pointer",border:"none",background:C.ok,color:"#fff"}}>{t.approveAsIs}</button>
              <button onClick={()=>decide("auto_modified")} style={{borderRadius:6,padding:10,fontSize:13,fontWeight:600,cursor:"pointer",border:`1px solid ${C.warn}`,background:"#fff",color:C.warn}}>{t.approveModify}</button>
              <button onClick={()=>decide("cmo_declined")} disabled={!rationale} style={{borderRadius:6,padding:10,fontSize:13,fontWeight:600,cursor:rationale?"pointer":"default",
                border:`1px solid ${!rationale?C.line:C.block}`,background:"#fff",color:!rationale?C.mute:C.block}}>{t.declineNeedsReason}</button>
            </div></div></div></div>}
    </div>
  );
}
