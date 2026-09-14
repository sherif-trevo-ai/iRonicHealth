import { useState } from "react";
import { C } from "./data/clinical.js";
import { UI } from "./data/i18n.js";
import { TopHeader } from "./components/Atoms.jsx";
import PhysicianView from "./views/PhysicianView.jsx";
import TPAView, { SEED_REQUESTS } from "./views/TPAView.jsx";

export default function App(){
  const [lang,setLang] = useState("ar");
  const [view,setView] = useState("physician");
  const [requests,setRequests] = useState(SEED_REQUESTS);
  const [lastId,setLastId] = useState(null);
  const t = UI[lang];
  const pendingCount = requests.filter(r=>r.status==="cmo_pending").length;

  const onSubmitRequest = req => { setRequests(rs=>[req,...rs]); setLastId(req.id); };

  return (
    <div dir={lang==="ar"?"rtl":"ltr"} className={lang==="ar"?"ar-body":"en-body"} style={{background:C.off,minHeight:"100vh",color:C.ink}}>
      <TopHeader lang={lang} setLang={setLang} view={view} setView={setView} pendingCount={pendingCount}/>
      {view==="physician"
        ? <PhysicianView lang={lang} onSubmitRequest={onSubmitRequest}/>
        : <TPAView lang={lang} requests={requests} setRequests={setRequests} highlightId={lastId}/>}
      <div style={{padding:16,fontSize:11,color:C.mute}}>{t.footer}</div>
    </div>
  );
}
