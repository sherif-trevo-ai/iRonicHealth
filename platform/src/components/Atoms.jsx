import { C } from "../data/clinical.js";
import { UI, L, toLocaleDigits } from "../data/i18n.js";

export const Box = ({children,style}) => (
  <div style={{borderRadius:8,border:`1px solid ${C.line}`,background:"#fff",...style}}>{children}</div>
);

export const Chip = ({children,tone="n",onClick,active}) => {
  const m = {n:[C.mute,"#F2F4F6"],b:[C.block,"#FEECEC"],w:[C.warn,"#FEF6E7"],g:[C.ok,"#E9F9EE"],p:[C.dark,C.soft]}[tone];
  return (
    <button onClick={onClick} style={{borderRadius:6,padding:"4px 10px",fontSize:12,
      border:`1px solid ${active?C.blue:"transparent"}`,color:active?"#fff":m[0],background:active?C.blue:m[1],cursor:"pointer"}}>
      {children}
    </button>
  );
};

export const Badge = ({children,tone="n"}) => {
  const m = {n:[C.mute,"#F2F4F6"],b:[C.block,"#FEECEC"],w:[C.warn,"#FEF6E7"],g:[C.ok,"#E9F9EE"]}[tone];
  return <span style={{borderRadius:6,padding:"2px 8px",fontSize:11,color:m[0],background:m[1]}}>{children}</span>;
};

export const H = ({n,lang,children}) => (
  <div className="k" style={{fontSize:14,fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
    <span className="m" style={{width:20,height:20,display:"grid",placeItems:"center",borderRadius:6,background:C.soft,color:C.dark,fontSize:11}}>
      {toLocaleDigits(n,lang)}
    </span>
    {children}
  </div>
);

export const RuleFlag = ({f,lang}) => (
  <div className="pop" style={{borderRadius:6,padding:10,marginBottom:6,background:f.sev==="block"?"#FEECEC":"#FEF6E7",
      borderInlineStart:`3px solid ${f.sev==="block"?C.block:C.warn}`}}>
    <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
      <span className="m" style={{fontSize:11,fontWeight:700,color:f.sev==="block"?C.block:C.warn}}>{f.id}</span>
      {f.cross && <Badge>{UI[lang].crossDomain}</Badge>}
    </div>
    <div style={{fontSize:13,lineHeight:1.5}}>{L(lang,f.t)}</div>
    {f.alt && <div style={{fontSize:11,marginTop:6,borderRadius:4,padding:"3px 8px",background:"#fff",color:C.dark}}>{UI[lang].alt} {L(lang,f.alt)}</div>}
  </div>
);

export function TopHeader({lang,setLang,view,setView,pendingCount}){
  const t = UI[lang];
  return (
    <div style={{padding:"10px 16px",background:C.blue,color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <img src="/assets/h-badge.png" alt="iRonic Health" style={{width:30,height:37,display:"block"}}/>
        <div>
          <div className="k" style={{fontSize:14,fontWeight:700}}>{t.brand}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.78)"}}>{t.tagline}</div>
        </div>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <div style={{display:"flex",borderRadius:6,overflow:"hidden",border:"1px solid rgba(255,255,255,.4)"}}>
          {["ar","en"].map(l=>
            <button key={l} onClick={()=>setLang(l)} style={{padding:"5px 10px",fontSize:11,cursor:"pointer",border:"none",
              background:lang===l?"#fff":"transparent",color:lang===l?C.blue:"#fff",fontWeight:lang===l?700:400}}>{l.toUpperCase()}</button>)}
        </div>
        <button onClick={()=>setView("physician")} style={{borderRadius:6,padding:"6px 14px",fontSize:12,cursor:"pointer",
          border:`1px solid ${view==="physician"?C.gold:"rgba(255,255,255,.4)"}`,background:view==="physician"?C.gold:"transparent",color:view==="physician"?C.navy:"#fff"}}>{t.navPhysician}</button>
        <button onClick={()=>setView("tpa")} style={{borderRadius:6,padding:"6px 14px",fontSize:12,cursor:"pointer",position:"relative",
          border:`1px solid ${view==="tpa"?C.gold:"rgba(255,255,255,.4)"}`,background:view==="tpa"?C.gold:"transparent",color:view==="tpa"?C.navy:"#fff"}}>
          {t.navTPA} {pendingCount>0 && <span style={{background:C.block,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10,marginInlineStart:6}}>{pendingCount}</span>}
        </button>
      </div>
    </div>
  );
}
