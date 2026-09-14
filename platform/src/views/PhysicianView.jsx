import { useState, useEffect, useRef } from "react";
import { C, SPECIALTIES, PROTOCOLS, DRUGS, LABS, IMAGING, COMPLAINTS, CHRONIC, ALLERGY, PATIENTS, COVER_LABEL, COVER_TONE } from "../data/clinical.js";
import { UI, L } from "../data/i18n.js";
import { evaluate, fitness } from "../engine/rules.js";
import { Box, Chip, Badge, H, RuleFlag } from "../components/Atoms.jsx";
import DrugIntelligenceDrawer from "../components/DrugIntelligenceDrawer.jsx";

export default function PhysicianView({lang,onSubmitRequest}){
  const t = UI[lang];
  const [pIdx,setPIdx] = useState(0);
  const P0 = PATIENTS[pIdx];
  const P = {...P0, initials:L(lang,P0.initials), sex:L(lang,P0.sex),
    current:P0.current.map(c=>({...c, ar:L(lang,c)})) };

  const [step,setStep] = useState(0);
  const [t_,setT] = useState(0);
  const [complaint,setComplaint] = useState([]);
  const [chronicList,setChronicList] = useState(P0.chronicKeys);
  const [allergyList,setAllergyList] = useState(P0.allergyKeys);
  const [vitals,setVitals] = useState({bp:"",hr:"",rbs:""});
  const [dx,setDx] = useState([]);
  const [meds,setMeds] = useState([]);
  const [labs,setLabs] = useState([]);
  const [imaging,setImaging] = useState([]);
  const [fu,setFu] = useState(90);
  const [sent,setSent] = useState(false);
  const [intel,setIntel] = useState(null);
  const tick = useRef(null);

  useEffect(()=>{
    if(!sent){ tick.current = setInterval(()=>setT(x=>x+1),1000); return ()=>clearInterval(tick.current); }
  },[sent]);

  useEffect(()=>{
    setChronicList(PATIENTS[pIdx].chronicKeys); setAllergyList(PATIENTS[pIdx].allergyKeys);
    setMeds([]); setDx([]); setLabs([]); setImaging([]); setSent(false); setT(0); setStep(0);
  },[pIdx]);

  const st = {meds,labs,imaging,chronicList,allergyList,vitals,lang};
  const flags = evaluate(st,P);
  const blocking = flags.filter(f=>f.sev==="block");
  const warns = flags.filter(f=>f.sev==="warn");
  const testCost = labs.reduce((a,l)=>a+l.price,0) + imaging.reduce((a,i)=>a+i.price,0);
  const drugCost = meds.reduce((a,m)=>a+m.price,0);

  const addMed = d => { setMeds(m => m.some(x=>x.id===d.id) ? m : [...m,{...d,strength:d.strengths[0],qty:d.dose*d.freq*d.dur,sub:!d.bio}]); setIntel(null); };
  const upd = (id,k,v) => setMeds(m => m.map(x => x.id===id ? {...x,[k]:v, ...(k!=="qty" ? {qty:(k==="dose"?v:x.dose)*(k==="freq"?v:x.freq)*(k==="dur"?v:x.dur)} : {})} : x));
  const tog = (arr,set,item) => set(arr.includes(item) ? arr.filter(x=>x!==item) : [...arr,item]);
  const togMed = (arr,set,item,key="id") => set(arr.some(x=>(x[key]??x)===(item[key]??item)) ? arr.filter(x=>(x[key]??x)!==(item[key]??item)) : [...arr,item]);
  const apply = p => {
    p.meds.forEach(id => addMed(DRUGS.find(d=>d.id===id)));
    p.labs.forEach(id => { const l = LABS.find(x=>x.id===id); setLabs(pr => pr.some(x=>x.id===id) ? pr : [...pr,l]); });
    setFu(p.fu);
  };

  const send = () => {
    const decision = blocking.length ? "cmo_pending" : warns.length ? "auto_modified" : "auto_approved";
    onSubmitRequest({
      id: "REQ-"+Math.floor(80000+Math.random()*9999),
      patient: `${P.initials} · ${P.age}`,
      facility: lang==="ar" ? "عيادة تجريبية — الديمو المباشر" : "Demo Clinic — Live Interactive",
      physician: t.patientLabel,
      dx: dx.map(d=>`${L(lang,d)} (${d.icd})`).join("، ") || "—",
      plan: meds.map(m=>`${m.brand?m.brand+" ":""}${L(lang,m)} ${m.strength}`).join(" + ") || "—",
      submittedMin: 0, cost: testCost+drugCost, flags,
      fraudScore: Math.min(8+blocking.length*12, 60),
      status: decision,
      decidedSec: decision!=="cmo_pending" ? 2+Math.floor(Math.random()*3) : undefined,
    });
    setSent(true);
  };

  const bmi = (P.weight/Math.pow(P.height/100,2)).toFixed(1);

  return (
    <div>
      <div style={{padding:"10px 16px",background:"#fff",borderBottom:`1px solid ${C.line}`,display:"flex",flexWrap:"wrap",gap:16,alignItems:"center",fontSize:12}}>
        <select value={pIdx} onChange={e=>setPIdx(+e.target.value)} style={{borderRadius:6,padding:"4px 8px",border:`1px solid ${C.line}`,fontSize:12}}>
          {PATIENTS.map((p,i)=><option key={i} value={i}>{L(lang,p.initials)} — {L(lang,p.sex)} — {p.age}</option>)}
        </select>
        <span style={{color:C.ok}}>{t.coverageOk}</span>
        <span style={{color:C.warn}}>eGFR <b className="m">{P.eGFR}</b></span>
        <span style={{color:C.warn}}>HbA1c <b className="m">{P.hba1cVal}%</b> — {P.hba1cDays}d</span>
        <span style={{color:C.mute}}>BMI <b className="m">{bmi}</b></span>
        <span className="m" style={{marginInlineStart:"auto",color:t_>90?C.block:C.mute}}>{t_}s</span>
      </div>

      <div style={{padding:"8px 16px",background:"#fff",borderBottom:`1px solid ${C.line}`,display:"flex",gap:6,overflowX:"auto"}}>
        {t.steps.map((x,i)=>
          <button key={i} onClick={()=>setStep(i)} style={{borderRadius:6,padding:"5px 10px",fontSize:12,whiteSpace:"nowrap",cursor:"pointer",
            border:`1px solid ${step===i?C.blue:C.line}`,background:step===i?C.blue:"#fff",color:step===i?"#fff":C.mute}}>{x}</button>)}
      </div>

      <div style={{padding:16,display:"flex",gap:16,flexWrap:"wrap",alignItems:"flex-start"}}>
        <div style={{flex:1,minWidth:320}}>

          {step===0 && <Box style={{padding:16}}><H n={1} lang={lang}>{t.complaintTitle}</H>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {COMPLAINTS.map((c,i)=><Chip key={i} active={complaint.includes(i)} onClick={()=>tog(complaint,setComplaint,i)}>{L(lang,c)}</Chip>)}
            </div></Box>}

          {step===1 && <Box style={{padding:16}}><H n={2} lang={lang}>{t.historyTitle}</H>
            <div style={{fontSize:12,color:C.mute,marginBottom:6}}>{t.chronicLabel}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
              {CHRONIC.map((c,i)=><Chip key={i} active={chronicList.includes(i)} onClick={()=>tog(chronicList,setChronicList,i)}>{L(lang,c)}</Chip>)}
            </div>
            <div style={{fontSize:12,color:C.block,marginBottom:6}}>{t.allergyLabel}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
              {ALLERGY.map((a,i)=><Chip key={i} tone="b" active={allergyList.includes(i)} onClick={()=>tog(allergyList,setAllergyList,i)}>{L(lang,a)}</Chip>)}
            </div>
            <div style={{fontSize:12,color:C.mute,marginBottom:6}}>{t.currentMedsLabel}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {P.current.length ? P.current.map((m,i)=><Chip key={i} tone="p">{m.ar}</Chip>) : <span style={{fontSize:12,color:C.mute}}>{t.noneLabel}</span>}
            </div></Box>}

          {step===2 && <Box style={{padding:16}}><H n={3} lang={lang}>{t.examTitle}</H>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {[["bp",t.bp,"120/80"],["hr",t.hr,"76"],["rbs",t.rbs,"210"]].map(([k,l,ph])=>
                <div key={k}><div style={{fontSize:11,color:C.mute,marginBottom:4}}>{l}</div>
                  <input value={vitals[k]} onChange={e=>setVitals({...vitals,[k]:e.target.value})} placeholder={ph} className="m"
                    style={{width:"100%",borderRadius:6,padding:"6px 8px",fontSize:13,border:`1px solid ${!vitals.bp&&k==="bp"?C.warn:C.line}`}}/></div>)}
            </div></Box>}

          {step===3 && <Box style={{padding:16}}><H n={4} lang={lang}>{t.dxTitle}</H>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {SPECIALTIES.endocrinology.dx.map(d=>{
                const on = dx.some(x=>x.icd===d.icd);
                return <button key={d.icd} onClick={()=>togMed(dx,setDx,d,"icd")} style={{textAlign:lang==="ar"?"right":"left",borderRadius:6,padding:"8px 12px",fontSize:13,cursor:"pointer",
                    border:`1px solid ${on?C.blue:C.line}`,background:on?C.soft:"#fff"}}>
                  <span>{L(lang,d)}</span> <span className="m" style={{fontSize:11,color:C.blue}}>{d.icd}</span>
                  {d.flag && <div style={{fontSize:11,color:C.warn}}>{L(lang,d.flag)}</div>}
                </button>;
              })}
            </div></Box>}

          {step===4 && <div>
            <Box style={{padding:16,marginBottom:14}}><H n={5} lang={lang}>{t.protocolTitle}</H>
              {dx.length===0 && <p style={{fontSize:13,color:C.mute}}>{t.chooseDxFirst}</p>}
              {PROTOCOLS.filter(p=>dx.some(d=>d.icd===p.icd)).map(p=>
                <div key={p.id} style={{borderRadius:6,padding:10,marginBottom:8,border:`1px solid ${C.line}`,display:"flex",justifyContent:"space-between",gap:8,alignItems:"flex-start"}}>
                  <div><div style={{fontSize:13,fontWeight:600}}>{L(lang,p)}</div><div style={{fontSize:11,color:C.mute,marginTop:2}}>{L(lang,p.basis)}</div></div>
                  <button onClick={()=>apply(p)} style={{borderRadius:6,padding:"5px 12px",fontSize:11,background:C.blue,color:"#fff",border:"none",cursor:"pointer",flexShrink:0}}>{t.applyProtocol}</button>
                </div>)}
            </Box>
            <Box style={{padding:16}}>
              <div className="k" style={{fontSize:14,fontWeight:700,marginBottom:4}}>{t.medsTitle}</div>
              <p style={{fontSize:11,color:C.mute,marginBottom:10}}>{t.clickForIntel}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                {DRUGS.map(d=>{
                  const fit = fitness(d,st,P);
                  return <button key={d.id} onClick={()=>setIntel(d)} style={{borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",
                      border:`1px solid ${fit.bad.length?C.block:fit.cau.length?C.warn:C.line}`,
                      background:fit.bad.length?"#FEECEC":fit.cau.length?"#FEF6E7":"#fff",
                      color:fit.bad.length?C.block:fit.cau.length?C.warn:C.ink}}>
                    {fit.bad.length?"✕":fit.cau.length?"!":"✓"} {L(lang,d)}
                  </button>;
                })}
              </div>
              {meds.map(m=>{
                const mism = Math.abs(m.dose*m.freq*m.dur-m.qty) > 1;
                return <div key={m.id} style={{borderRadius:6,padding:10,marginBottom:8,border:`1px solid ${mism?C.block:C.line}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                    <div><div style={{fontSize:13,fontWeight:600}}>{L(lang,m)} <span style={{color:C.mute,fontWeight:400}}>{lang==="ar"?m.en:""}</span></div>
                      <div className="m" style={{fontSize:11,color:C.mute}}>ATC {m.atc} · {L(lang,m.route)}</div></div>
                    <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                      <Badge tone={COVER_TONE(m.cover)}>{COVER_LABEL(m.cover,t)}</Badge>
                      <button onClick={()=>setMeds(meds.filter(x=>x.id!==m.id))} style={{fontSize:11,color:C.mute,background:"none",border:"none",cursor:"pointer"}}>{t.delete}</button>
                    </div></div>
                  <div style={{marginTop:8,background:"#F2F4F6",borderRadius:6,padding:8}}>
                    <div style={{fontSize:11,color:C.mute,marginBottom:6}}>{t.tradeName}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {(m.trade||[]).map(tr=>
                        <button key={tr.n} onClick={()=>upd(m.id,"brand",tr.n)} style={{borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer",display:"flex",gap:4,alignItems:"center",
                            border:`1px solid ${m.brand===tr.n?C.blue:C.line}`,background:m.brand===tr.n?C.soft:"#fff",opacity:tr.lowConf?0.7:1}}>
                          {tr.n}<span style={{color:C.mute,fontSize:10}}>· {tr.mfr}</span>
                          {tr.og && <span style={{background:C.gold,color:C.navy,borderRadius:3,padding:"0 4px",fontSize:9}}>{t.original}</span>}
                        </button>)}
                    </div></div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginTop:8,fontSize:11}}>
                    {[["dose",t.dose],["freq",t.perDay],["dur",t.days]].map(([k,l])=>
                      <div key={k}><div style={{color:C.mute}}>{l}</div>
                        <input type="number" min="1" value={m[k]} onChange={e=>upd(m.id,k,+e.target.value)} className="m"
                          style={{width:"100%",borderRadius:4,padding:"3px 6px",border:`1px solid ${C.line}`}}/></div>)}
                    <div><div style={{color:C.mute}}>{t.qty}</div>
                      <input type="number" value={m.qty} onChange={e=>upd(m.id,"qty",+e.target.value)} className="m"
                        style={{width:"100%",borderRadius:4,padding:"3px 6px",border:`1px solid ${mism?C.block:C.line}`}}/></div>
                  </div></div>;
              })}
            </Box></div>}

          {step===5 && <Box style={{padding:16}}><H n={6} lang={lang}>{t.labsTitle}</H>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
              {LABS.map(l=><Chip key={l.id} active={labs.some(x=>x.id===l.id)} onClick={()=>togMed(labs,setLabs,l)}>{L(lang,l)}</Chip>)}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {IMAGING.map(i=><Chip key={i.id} active={imaging.some(x=>x.id===i.id)} onClick={()=>togMed(imaging,setImaging,i)}>{L(lang,i)}</Chip>)}
            </div></Box>}

          {step===6 && <Box style={{padding:16}}><H n={7} lang={lang}>{t.fuTitle}</H>
            <div style={{fontSize:11,color:C.mute,marginBottom:6}}>{t.followUpAfter}</div>
            <select value={fu} onChange={e=>setFu(+e.target.value)} style={{borderRadius:6,padding:"6px 10px",fontSize:13,border:`1px solid ${C.line}`}}>
              {[14,28,60,90].map(d=><option key={d} value={d}>{d} {t.dayUnit}</option>)}
            </select></Box>}

          {step===7 && <div>
            <Box style={{padding:16,marginBottom:14}}><H n={8} lang={lang}>{t.reportTitle}</H>
              <div style={{fontSize:13,lineHeight:1.9,border:`1px solid ${C.line}`,borderRadius:6,padding:12}}>
                <b>{t.dxLine}</b> {dx.map(d=>`${L(lang,d)} (${d.icd})`).join("، ")||"—"}<br/>
                <b>{t.medsLine}</b> {meds.length?meds.map(m=>`${m.brand?m.brand+" — ":""}${L(lang,m)} ${m.strength} — ${m.dose}×${m.freq}×${m.dur}${lang==="ar"?"ي":"d"} (${m.qty} ${L(lang,m.unit)})`).join(" · "):"—"}<br/>
                <b>{t.labsLine}</b> {[...labs,...imaging].map(x=>L(lang,x)).join("، ")||"—"}<br/>
                <b>{t.fuLine}</b> {fu} {t.dayUnit}
              </div>
              {blocking.length>0 && <div style={{borderRadius:6,padding:10,marginTop:12,fontSize:13,background:"#FEECEC",color:C.block}}>
                {blocking.length} {t.blockingWarn}</div>}
              {!sent ?
                <button onClick={send} disabled={!dx.length||!meds.length} style={{width:"100%",borderRadius:6,padding:12,fontSize:14,marginTop:12,cursor:"pointer",
                    border:"none",background:!dx.length||!meds.length?"#C9D0D8":C.blue,color:"#fff",fontWeight:600}}>{t.sendBtn}</button>
                : <div style={{marginTop:12,borderRadius:6,padding:12,background:C.soft}}>
                    <div style={{color:C.ok,fontWeight:700,fontSize:13}}>{t.sentTitle}</div>
                    <p style={{fontSize:12,color:C.mute,marginTop:4}}>{t.sentSub}</p>
                  </div>}
            </Box></div>}

          <div style={{display:"flex",gap:8,marginTop:16}}>
            <button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0} style={{borderRadius:6,padding:"8px 16px",fontSize:13,cursor:"pointer",
              border:`1px solid ${C.line}`,background:"#fff",opacity:step===0?0.4:1}}>{t.prev}</button>
            <button onClick={()=>setStep(Math.min(7,step+1))} disabled={step===7} style={{borderRadius:6,padding:"8px 16px",fontSize:13,cursor:"pointer",
              border:"none",background:C.blue,color:"#fff",opacity:step===7?0.4:1}}>{t.next}</button>
          </div>
        </div>

        <div style={{width:300,flexGrow:1,minWidth:260}}>
          <Box style={{padding:14,position:"sticky",top:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div className="k" style={{fontSize:14,fontWeight:700}}>{t.ruleEngine}</div>
              <div style={{display:"flex",gap:4}}>
                {blocking.length>0 && <Badge tone="b">{blocking.length}</Badge>}
                {warns.length>0 && <Badge tone="w">{warns.length}</Badge>}
              </div></div>
            {flags.length===0 && <div style={{borderRadius:6,padding:10,fontSize:13,background:"#E9F9EE",color:C.ok}}>{t.noAlerts}</div>}
            {flags.map((f,i)=><RuleFlag key={f.id+i} f={f} lang={lang}/>)}
            <div style={{fontSize:10,color:C.mute,marginTop:10,paddingTop:10,borderTop:`1px solid ${C.line}`}}>{t.ruleFooter}</div>
          </Box>
        </div>
      </div>

      <DrugIntelligenceDrawer intel={intel} setIntel={setIntel} st={st} P={P} lang={lang} addMed={addMed} meds={meds}/>
    </div>
  );
}
