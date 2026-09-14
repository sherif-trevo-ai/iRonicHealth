export const C = { blue:"#4179AD", dark:"#2D5580", navy:"#1E3048", gold:"#CAB164", off:"#FAFAF8", ink:"#1E3048",
  block:"#DC2626", warn:"#D97706", ok:"#16A34A", line:"#E2EAF3", mute:"#6B7684", soft:"#EEF4FA", goldSoft:"#FAF6EC" };

export const SPECIALTIES = { endocrinology:{ar:"الغدد الصماء والسكري",en:"Endocrinology & Diabetes",dx:[
  {icd:"E11",ar:"سكري نوع ٢",en:"Type 2 diabetes mellitus"},
  {icd:"E14",ar:"سكري غير محدد",en:"Unspecified diabetes",flag:{ar:"كود غير محدد — عرضة للرفض",en:"Unspecified code — denial risk"}},
  {icd:"E03.9",ar:"قصور الغدة الدرقية",en:"Hypothyroidism"},
]}};

export const PROTOCOLS = [
  {id:"T2DM-1",icd:"E11",ar:"سكري نوع ٢ — الخط الأول",en:"Type 2 Diabetes — First Line",
   basis:{ar:"الميتفورمين هو العلاج الأول (EDA 2024)",en:"Metformin is first-line therapy (EDA 2024)"},meds:["MET"],labs:["A1C","CRE"],fu:90},
  {id:"T2DM-1R",icd:"E11",ar:"سكري نوع ٢ — قصور كلوي",en:"Type 2 Diabetes — Renal Impairment",
   basis:{ar:"الليناجليبتين لا يحتاج تعديلًا كلويًا (EDA 2024)",en:"Linagliptin requires no renal dose adjustment (EDA 2024)"},meds:["LIN"],labs:["A1C","CRE"],fu:90},
  {id:"HYPO-1",icd:"E03.9",ar:"قصور الغدة الدرقية — بدء العلاج",en:"Hypothyroidism — Initiating Therapy",
   basis:{ar:"ليفوثيروكسين حسب العمر وتاريخ القلب (EDA 2024)",en:"Levothyroxine dosed by age and cardiac history (EDA 2024)"},meds:["LEV"],labs:["TSH"],fu:28},
];

export const DRUGS = [
 {id:"MET",ar:"ميتفورمين",en:"Metformin",atc:"A10BA02",cls:"biguanide",clsAr:"بيجوانيد",clsEn:"Biguanide",
  strengths:["500 mg","850 mg","1000 mg"],route:{ar:"فموي",en:"Oral"},dose:1,freq:2,dur:30,unit:{ar:"قرص",en:"tab"},food:{ar:"مع الأكل",en:"With food"},
  cover:"covered",price:95,indic:["E11","E14"],renal:{min:30,band:{ar:"الحد الأقصى ١جم عند ٣٠-٤٥؛ ممنوع تحت ٣٠",en:"Max 1 g/day at eGFR 30-45; contraindicated below 30"}},
  riskX:["Alcohol","Pacritinib"],riskD:["Cimetidine","Iodinated contrast","Ranolazine"],
  monitor:{ar:["HbA1c","وظائف الكلى سنويًا"],en:["HbA1c","Renal function annually"]},
  trade:[{n:"Glucophage",mfr:"Merck",og:true},{n:"Metformin-Evapharma XR",mfr:"Evapharma"},{n:"Kelvamet",mfr:"BIOMED"}]},
 {id:"LIN",ar:"ليناجليبتين",en:"Linagliptin",atc:"A10BH05",cls:"dpp4",clsAr:"مثبط DPP-4",clsEn:"DPP-4 inhibitor",
  strengths:["5 mg"],route:{ar:"فموي",en:"Oral"},dose:1,freq:1,dur:30,unit:{ar:"قرص",en:"tab"},food:{ar:"مع أو بدون أكل",en:"With or without food"},
  cover:"covered",price:480,indic:["E11","E14"],renal:{min:0,band:{ar:"لا يحتاج تعديلًا كلويًا في أي مستوى",en:"No renal adjustment at any level"}},
  riskX:[],riskD:["Insulin","Sulfonylureas"],monitor:{ar:["HbA1c"],en:["HbA1c"]},
  trade:[{n:"Empainamed",mfr:"Amcomed",lowConf:true}]},
 {id:"SIT",ar:"سيتاجليبتين",en:"Sitagliptin",atc:"A10BH01",cls:"dpp4",clsAr:"مثبط DPP-4",clsEn:"DPP-4 inhibitor",
  strengths:["50 mg","100 mg"],route:{ar:"فموي",en:"Oral"},dose:1,freq:1,dur:30,unit:{ar:"قرص",en:"tab"},food:{ar:"مع أو بدون أكل",en:"With or without food"},
  cover:"covered",price:390,indic:["E11","E14"],renal:{min:0,adjust:45,band:{ar:"٥٠مج عند ٣٠-٤٥ · ٢٥مج تحت ٣٠",en:"50 mg at eGFR 30-45 · 25 mg below 30"}},
  riskX:[],riskD:["Insulin","Sulfonylureas"],monitor:{ar:["HbA1c","وظائف الكلى دوريًا"],en:["HbA1c","Renal function periodically"]},
  trade:[{n:"Janvia",mfr:"MSD",og:true},{n:"Zucat",mfr:"Viatris"},{n:"Cosecta",mfr:"GIFTO"}]},
 {id:"GLC",ar:"جليكلازيد",en:"Gliclazide",atc:"A10BB09",cls:"sulfonylurea",clsAr:"سلفونيل يوريا",clsEn:"Sulfonylurea",
  strengths:["30 mg MR","60 mg MR","80 mg"],route:{ar:"فموي",en:"Oral"},dose:1,freq:1,dur:30,unit:{ar:"قرص",en:"tab"},food:{ar:"مع الإفطار",en:"With breakfast"},
  cover:"covered",price:65,indic:["E11","E14"],renal:{min:30,band:{ar:"ممنوع في القصور الكلوي الشديد",en:"Contraindicated in severe renal impairment"}},
  riskX:["Aminolevulinic Acid","Mitiglinide"],riskD:["Fluoroquinolones","Miconazole","Insulin"],
  monitor:{ar:["HbA1c","وظائف كلى وكبد دوريًا"],en:["HbA1c","Renal & hepatic function periodically"]},ci:{g6pd:true,sulfa:true},
  trade:[{n:"Diamicron MR",mfr:"Servier",og:true},{n:"Diamac",mfr:"MUP"},{n:"Glicla MR",mfr:"EIPICO"}]},
 {id:"GLM",ar:"جليمابيريد",en:"Glimepiride",atc:"A10BB12",cls:"sulfonylurea",clsAr:"سلفونيل يوريا",clsEn:"Sulfonylurea",
  strengths:["1 mg","2 mg","3 mg","4 mg"],route:{ar:"فموي",en:"Oral"},dose:1,freq:1,dur:30,unit:{ar:"قرص",en:"tab"},food:{ar:"مع الإفطار",en:"With breakfast"},
  cover:"covered",price:70,indic:["E11","E14"],renal:{min:15,band:{ar:"جرعة ابتدائية ١مج؛ يُنظر في بديل تحت ١٥",en:"Initial 1 mg; consider alternative below eGFR 15"}},
  riskX:["Aminolevulinic Acid","Mitiglinide"],riskD:["Colesevelam","Insulin"],
  monitor:{ar:["HbA1c","وظائف كلى وكبد"],en:["HbA1c","Renal & hepatic function"]},ci:{g6pd:true,sulfa:true},
  trade:[{n:"Amaryl",mfr:"Sanofi",og:true},{n:"Glimepiride-EGPI",mfr:"EGPI"},{n:"Corrida",mfr:"Medizen"}]},
 {id:"SEM",ar:"سيماجلوتيد",en:"Semaglutide",atc:"A10BJ06",cls:"glp1",clsAr:"مُنبِّه GLP-1",clsEn:"GLP-1 agonist",
  strengths:["3 mg","7 mg","14 mg"],route:{ar:"فموي",en:"Oral"},dose:1,freq:1,dur:30,unit:{ar:"قرص",en:"tab"},food:{ar:"على معدة فارغة",en:"Empty stomach"},
  cover:"pa",price:4200,indic:["E11"],bio:true,renal:{min:0,band:{ar:"غير موصى به في الفشل الكلوي النهائي",en:"Not recommended in ESRD"}},
  riskX:["Other GLP-1 agonists","Tirzepatide"],riskD:["Insulin","Sulfonylureas"],
  monitor:{ar:["HbA1c","علامات التهاب البنكرياس"],en:["HbA1c","Signs of pancreatitis"]},ci:{mtc:true},
  trade:[{n:"Ozempic",mfr:"Novo Nordisk",og:true,note:{ar:"سكري",en:"Diabetes"}},{n:"Wegovy",mfr:"Novo Nordisk",og:true,note:{ar:"إنقاص وزن",en:"Weight loss"}}]},
 {id:"LIR",ar:"ليراجلوتيد",en:"Liraglutide",atc:"A10BJ02",cls:"glp1",clsAr:"مُنبِّه GLP-1",clsEn:"GLP-1 agonist",
  strengths:["6 mg/mL"],route:{ar:"تحت الجلد",en:"Subcutaneous"},dose:1,freq:1,dur:30,unit:{ar:"قلم",en:"pen"},food:{ar:"أي وقت",en:"Any time"},
  cover:"pa",price:3800,indic:["E11"],bio:true,renal:{min:30,band:{ar:"غير موصى به تحت تصفية ٣٠",en:"Not recommended below CrCl 30"}},
  riskX:["Other GLP-1 agonists"],riskD:["Insulin","Sulfonylureas"],
  monitor:{ar:["HbA1c","النبض"],en:["HbA1c","Heart rate"]},ci:{mtc:true},
  trade:[{n:"Victoza",mfr:"Novo Nordisk",og:true,note:{ar:"سكري",en:"Diabetes"}},{n:"Saxenda",mfr:"Novo Nordisk",og:true,note:{ar:"إنقاص وزن",en:"Weight loss"}}]},
 {id:"PIO",ar:"بيوجليتازون",en:"Pioglitazone",atc:"A10BG03",cls:"tzd",clsAr:"ثيازوليدينديون",clsEn:"Thiazolidinedione",
  strengths:["15 mg","30 mg","45 mg"],route:{ar:"فموي",en:"Oral"},dose:1,freq:1,dur:30,unit:{ar:"قرص",en:"tab"},food:{ar:"مع أو بدون أكل",en:"With or without food"},
  cover:"not_covered",price:210,indic:["E11"],renal:{min:0,band:{ar:"غير موصى به مع الغسيل",en:"Not recommended on dialysis"}},
  riskX:[],riskD:["Gemfibrozil","Insulin"],monitor:{ar:["إنزيمات الكبد","علامات هبوط القلب"],en:["Liver enzymes","Signs of heart failure"]},ci:{hf:true},
  trade:[{n:"Actos",mfr:"Takeda (imported)",og:true},{n:"Actozone",mfr:"Amoun"}]},
 {id:"GLA",ar:"إنسولين جلارجين",en:"Insulin Glargine",atc:"A10AE04",cls:"insulin",clsAr:"أنسولين طويل المفعول",clsEn:"Long-acting insulin",
  strengths:["100 IU/mL"],route:{ar:"تحت الجلد",en:"Subcutaneous"},dose:10,freq:1,dur:30,unit:{ar:"وحدة",en:"unit"},food:{ar:"نفس الوقت يوميًا",en:"Same time daily"},
  cover:"covered",price:850,indic:["E11","E10"],renal:{min:0,band:{ar:"يُفرَّد حسب الحالة",en:"Individualized"}},
  riskX:["Rosiglitazone"],riskD:["Sulfonylureas","GLP-1 agonists"],monitor:{ar:["سكر الدم","HbA1c"],en:["Blood glucose","HbA1c"]},
  trade:[{n:"Lantus",mfr:"Sanofi",og:true}]},
 {id:"LEV",ar:"ليفوثيروكسين",en:"Levothyroxine",atc:"H03AA01",cls:"thyroid",clsAr:"هرمون درقي",clsEn:"Thyroid hormone",
  strengths:["25 mcg","50 mcg","100 mcg"],route:{ar:"فموي",en:"Oral"},dose:1,freq:1,dur:30,unit:{ar:"قرص",en:"tab"},food:{ar:"على معدة فارغة",en:"Empty stomach"},
  cover:"covered",price:55,indic:["E03.9"],renal:{min:0,band:{ar:"لا يحتاج تعديلًا",en:"No adjustment needed"}},riskX:[],riskD:[],
  monitor:{ar:["TSH"],en:["TSH"]},
  trade:[{n:"Euthyrox",mfr:"Merck",og:true},{n:"Equithera",mfr:"MPI"}]},
];

export const COVER_LABEL = (c,ui)=> c==="covered"?ui.covered : c==="not_covered"?ui.notCovered : ui.coveredPA;
export const COVER_TONE = c => c==="covered"?"g":c==="not_covered"?"b":"w";

export const LABS=[{id:"A1C",ar:"السكر التراكمي HbA1c",en:"HbA1c",loinc:"4548-4",price:280},
 {id:"CRE",ar:"كرياتينين المصل",en:"Serum Creatinine",loinc:"2160-0",price:90},
 {id:"TSH",ar:"هرمون الغدة TSH",en:"TSH",loinc:"3016-3",price:250}];
export const IMAGING=[{id:"CTC",ar:"أشعة مقطعية بصبغة",en:"CT with Contrast",contrast:true,price:3500},
 {id:"FUN",ar:"تصوير قاع العين",en:"Fundus Photography",contrast:false,price:400}];

export const COMPLAINTS=[{ar:"عطش وكثرة تبول",en:"Polyuria & polydipsia"},{ar:"إرهاق عام",en:"General fatigue"},
 {ar:"تنميل بالأطراف",en:"Extremity numbness"},{ar:"زغللة في النظر",en:"Blurred vision"},{ar:"تغيّر الوزن",en:"Weight change"}];
export const CHRONIC=[{ar:"سكري",en:"Diabetes"},{ar:"ضغط مرتفع",en:"Hypertension"},{ar:"قصور كلوي",en:"Renal impairment"},
 {ar:"أمراض قلب",en:"Heart disease"},{ar:"قصور غدة درقية",en:"Hypothyroidism"},{ar:"نقص إنزيم G6PD",en:"G6PD deficiency"}];
export const ALLERGY=[{ar:"سلفا",en:"Sulfa"},{ar:"بنسلين",en:"Penicillin"},{ar:"يود / صبغات",en:"Iodine / contrast"},{ar:"لا يوجد",en:"None"}];

export const PATIENTS = [
  {card:"7B58CWW1234",initials:{ar:"م. ع.",en:"M.A."},sex:{ar:"أنثى",en:"Female"},age:58,eGFR:38,hba1cVal:9.2,hba1cDays:240,weight:82,height:158,
   chronicKeys:[0,2,5],allergyKeys:[0],current:[{ar:"جليكلازيد ٨٠ مج",en:"Gliclazide 80mg",cls:"sulfonylurea"}]},
  {card:"9K21LWZ5590",initials:{ar:"ك. ح.",en:"K.H."},sex:{ar:"ذكر",en:"Male"},age:47,eGFR:88,hba1cVal:7.1,hba1cDays:40,weight:91,height:176,
   chronicKeys:[0],allergyKeys:[3],current:[]},
];
