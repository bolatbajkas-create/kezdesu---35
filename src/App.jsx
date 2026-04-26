import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════
   ТЕМА — АШЫҚ ҚЫЗЫЛ + АЛТЫН
══════════════════════════════════════ */
const RED1  = "#6B0A0A";   // қою қызыл
const RED2  = "#9B1C1C";   // орта қызыл
const RED3  = "#C53030";   // ашық қызыл
const GOLD  = "#D4A017";
const GOLD2 = "#F0D060";
const CREAM = "#FFF8EE";

const TG_LINK    = "https://t.me/baibolcombot";
const WA_LINK    = "https://wa.me/77761996564";
const ADMIN_PHONE = "+77761996564";

/* ── Қазақша ою-өрнек SVG ── */
const OYU_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
  <!-- Сыртқы рамка -->
  <rect x="2" y="2" width="116" height="116" fill="none" stroke="#D4A017" stroke-width="0.6" opacity="0.2"/>
  <!-- Диагональ крест -->
  <line x1="0" y1="0" x2="120" y2="120" stroke="#D4A017" stroke-width="0.5" opacity="0.12"/>
  <line x1="120" y1="0" x2="0" y2="120" stroke="#D4A017" stroke-width="0.5" opacity="0.12"/>
  <!-- Қошқар мүйіз (ram horn) — бұрыштарда -->
  <path d="M0,0 Q15,0 15,15 Q15,5 5,5 Z" fill="#D4A017" opacity="0.18"/>
  <path d="M120,0 Q105,0 105,15 Q105,5 115,5 Z" fill="#D4A017" opacity="0.18"/>
  <path d="M0,120 Q15,120 15,105 Q15,115 5,115 Z" fill="#D4A017" opacity="0.18"/>
  <path d="M120,120 Q105,120 105,105 Q105,115 115,115 Z" fill="#D4A017" opacity="0.18"/>
  <!-- Ортасы -->
  <rect x="50" y="50" width="20" height="20" fill="none" stroke="#D4A017" stroke-width="0.8" opacity="0.2" transform="rotate(45 60 60)"/>
  <circle cx="60" cy="60" r="4" fill="#D4A017" opacity="0.15"/>
  <!-- Жұлдызша -->
  <path d="M60,48 L62,56 L70,56 L64,62 L66,70 L60,65 L54,70 L56,62 L50,56 L58,56 Z" fill="#D4A017" opacity="0.13"/>
  <!-- Кіші нүктелер -->
  <circle cx="20" cy="20" r="2" fill="#D4A017" opacity="0.2"/>
  <circle cx="100" cy="20" r="2" fill="#D4A017" opacity="0.2"/>
  <circle cx="20" cy="100" r="2" fill="#D4A017" opacity="0.2"/>
  <circle cx="100" cy="100" r="2" fill="#D4A017" opacity="0.2"/>
  <circle cx="60" cy="10" r="1.5" fill="#D4A017" opacity="0.2"/>
  <circle cx="60" cy="110" r="1.5" fill="#D4A017" opacity="0.2"/>
  <circle cx="10" cy="60" r="1.5" fill="#D4A017" opacity="0.2"/>
  <circle cx="110" cy="60" r="1.5" fill="#D4A017" opacity="0.2"/>
</svg>`);
const OYU_BG = `url("data:image/svg+xml,${OYU_SVG}")`;

/* ── Дастархан деректері ── */
const MAX_SEATS = 10;
const TABLES = [
  { name:"«Алтын ұя»",      desc:"Бұл дастарханда – мектепті жүрегінде сақтаған, алғашқы ұстазын, алғашқы достарын ешқашан ұмытпаған түлектер отыр. Бұл – бәріміздің бастау алған қасиетті ордамыздың белгісі." },
  { name:"«Адал дос»",      desc:"Бұл жерде – жылдар өтсе де арасы үзілмеген, қуанышта да, қиындықта да бірге болған шынайы достар жиналған. Достықтары – уақытқа бағынбайтын ең қымбат байлық." },
  { name:"«Қоңырау»",       desc:"Бұл дастарханда – мектептегі сыңғырлаған қоңырау үнін сағынышпен еске алатын, әр үзіліс пен әр сабақтың қызығын бірге бөліскен сыныптастар отыр." },
  { name:"«Қызбел Барысы»", desc:"Бұл үстелде – қайсарлығы мен табандылығы арқылы өмірде өз орнын тапқан, мектептің намысын қорғап, белсенділігімен ерекшеленген түлектер отыр." },
  { name:"«Ханымдар»",      desc:"Бұл дастархан – мектептің көркі болған, нәзіктігімен, ақылымен, жылулығымен бәріміздің жүрегімізде із қалдырған аруларға арналған." },
  { name:"«Жан құрбы»",    desc:"Бұл жерде – сырластығы үзілмеген, қуанышта да, мұңда да бір-біріне тірек болған жан құрбылар жиналған. Жылдар өтсе де олардың арасындағы сенім мен жылылық сол қалпында сақталған." },
];
const STORAGE_KEY = "dastarkhan_v1";
function loadGuests() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}
function saveGuests(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ── Жоғарғы/төменгі ою жолағы SVG ── */
const BORDER_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="24">
  <rect width="200" height="24" fill="#6B0A0A"/>
  <!-- Негізгі сызық -->
  <line x1="0" y1="12" x2="200" y2="12" stroke="#D4A017" stroke-width="1.5"/>
  <!-- Ромб мотив -->
  <g fill="#D4A017">
    <polygon points="20,12 26,6 32,12 26,18" opacity="0.9"/>
    <polygon points="60,12 66,6 72,12 66,18" opacity="0.9"/>
    <polygon points="100,12 106,6 112,12 106,18" opacity="0.9"/>
    <polygon points="140,12 146,6 152,12 146,18" opacity="0.9"/>
    <polygon points="180,12 186,6 192,12 186,18" opacity="0.9"/>
  </g>
  <!-- Кіші нүктелер -->
  <g fill="#F0D060" opacity="0.7">
    <circle cx="40" cy="12" r="2"/>
    <circle cx="80" cy="12" r="2"/>
    <circle cx="120" cy="12" r="2"/>
    <circle cx="160" cy="12" r="2"/>
  </g>
  <!-- Жоғарғы/төменгі сызықтар -->
  <line x1="0" y1="3" x2="200" y2="3" stroke="#D4A017" stroke-width="0.5" opacity="0.5"/>
  <line x1="0" y1="21" x2="200" y2="21" stroke="#D4A017" stroke-width="0.5" opacity="0.5"/>
</svg>`);

/* ── BASE STYLES ── */
const card = {
  background: "rgba(0,0,0,0.25)",
  border: `1px solid rgba(212,160,23,0.35)`,
  borderRadius: 16,
  padding: "22px 24px",
  backdropFilter: "blur(6px)",
};

const inputSt = {
  width: "100%",
  background: "rgba(0,0,0,0.3)",
  border: `1px solid rgba(212,160,23,0.4)`,
  borderRadius: 8,
  padding: "11px 14px",
  color: CREAM,
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

/* ── PLACEHOLDERS ── */
function Photo({ width="100%", height=200, radius=10 }) {
  return <div style={{ width, height, borderRadius:radius, flexShrink:0, background:"rgba(255,255,255,0.06)", border:"1px dashed rgba(212,160,23,0.3)" }} />;
}
function Video({ height=220 }) {
  return <div style={{ width:"100%", height, borderRadius:10, background:"rgba(255,255,255,0.06)", border:"1px dashed rgba(212,160,23,0.3)" }} />;
}

/* ── BASE PATH (GitHub Pages үшін) ── */
const B = import.meta.env.BASE_URL; // '/kezdesu---35/' немесе '/'

/* ── COUNTDOWN ── */
const TARGET = new Date("2026-07-01T15:00:00");
function useCountdown() {
  const [t, setT] = useState({});
  useEffect(() => {
    const tick = () => {
      const diff = TARGET - new Date();
      if (diff <= 0) { setT({d:0,h:0,m:0,s:0}); return; }
      setT({ d:Math.floor(diff/86400000), h:Math.floor(diff/3600000%24), m:Math.floor(diff/60000%60), s:Math.floor(diff/1000%60) });
    };
    tick(); const id = setInterval(tick,1000); return ()=>clearInterval(id);
  },[]);
  return t;
}

/* ── UI ── */
function OrnBorder() {
  return <div style={{ height:24, backgroundImage:`url("data:image/svg+xml,${BORDER_SVG}")`, backgroundRepeat:"repeat-x", backgroundSize:"200px 24px" }} />;
}

function Divider() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"16px 0" }}>
      <div style={{ flex:1, height:1, background:`linear-gradient(90deg,transparent,${GOLD})` }}/>
      <span style={{ color:GOLD, fontSize:18 }}>✦</span>
      <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${GOLD},transparent)` }}/>
    </div>
  );
}

function SectionTitle({ children, light }) {
  return (
    <div style={{ textAlign:"center", marginBottom:20 }}>
      <div style={{ color:GOLD, fontSize:11, letterSpacing:4 }}>✦ ✦ ✦</div>
      <h2 style={{ fontSize:22, fontFamily:"Georgia,serif", color: light ? GOLD2 : CREAM, margin:"6px 0 8px" }}>{children}</h2>
      <div style={{ width:60, height:2, background:`linear-gradient(90deg,transparent,${GOLD},transparent)`, margin:"0 auto" }}/>
    </div>
  );
}

function TimerBox({ value, label }) {
  return (
    <div style={{ background:"rgba(0,0,0,0.35)", border:`2px solid ${GOLD}`, borderRadius:12, padding:"12px 16px", minWidth:70, textAlign:"center", boxShadow:`0 0 12px rgba(212,160,23,0.2)` }}>
      <div style={{ fontSize:36, fontWeight:700, color:GOLD2, fontFamily:"Georgia,serif", lineHeight:1 }}>{String(value??0).padStart(2,"0")}</div>
      <div style={{ fontSize:10, color:GOLD, marginTop:4, letterSpacing:2 }}>{label}</div>
    </div>
  );
}

function BotButtons({ big }) {
  const p = big ? "13px 22px" : "9px 16px";
  const f = big ? 15 : 13;
  return (
    <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
      <a href={TG_LINK} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:7, background:"#229ED9", color:"#fff", textDecoration:"none", borderRadius:10, padding:p, fontWeight:700, fontSize:f }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/></svg>
        @baibolcombot
      </a>
      <a href={WA_LINK} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:7, background:"#25D366", color:"#fff", textDecoration:"none", borderRadius:10, padding:p, fontWeight:700, fontSize:f }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
      </a>
    </div>
  );
}

/* ── DATA ── */

const PHOTOS_OKUSHYLYK = [
  "170520161307.jpg",
  "IMG-20160504-WA0128.jpg",
  "IMG-20160504-WA0131.jpg",
  "IMG-20160504-WA0153.jpg",
  "IMG-20160504-WA0133.jpg",
  "IMG-20160504-WA0142.jpg",
  "IMG-20160504-WA0144.jpg",
].map(f => encodeURI(`${B}Оқушылық өмір/${f}`));

const PHOTOS_25 = [
  "20160713_173335.jpg","20160713_205128.jpg","20160713_205137.jpg",
  "20160714_111804.jpg","20160714_111925.jpg","20160714_130353.jpg",
  "20160714_130440.jpg","20160714_130456.jpg","20160714_130948.jpg",
  "20160714_131943.jpg","20160714_132149.jpg","20160714_132200.jpg",
  "IMG-20160711-WA0098.jpg","IMG-20160711-WA0190.jpg",
  "DSC_0001.JPG","DSC_0002.JPG","DSC_0003.JPG","DSC_0004.JPG",
  "DSC_0005.JPG","DSC_0006.JPG","DSC_0007.JPG","DSC_0008.JPG",
].map(f => encodeURI(`${B}25 жыл/${f}`));


/* ── Ән ойнатқыш ── */
const SONG_URL = `${B}ernar-ajjdar-zholyan-andajj-zhasy.mp3`;
function SongPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(SONG_URL);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ color:"rgba(255,220,160,0.6)", fontSize:11, marginBottom:8 }}>🎵 Ернар Айдар · «Жолыққан қандай жақсы»</div>
      <button onClick={toggle} style={{
        background: playing ? `linear-gradient(135deg,#b8860b,${GOLD})` : `linear-gradient(135deg,${GOLD},${GOLD2})`,
        color: RED1, border:"none", borderRadius:30, padding:"11px 28px",
        fontWeight:700, fontSize:14, cursor:"pointer",
        boxShadow:`0 0 18px rgba(212,160,23,0.4)`, transition:"all 0.2s",
      }}>
        {playing ? "⏸ Тоқтату" : "▶ Минусовканы тыңда"}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════
   1-БЕТ: БАСТЫ БЕТ
══════════════════════════════════════ */
function Page1({ timer }) {
  const [lbSrc, setLbSrc] = useState(null);
  return (
    <div>
      {lbSrc && (
        <div onClick={()=>setLbSrc(null)} style={{ position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,0.93)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"zoom-out" }}>
          <img src={lbSrc} alt="" style={{ maxWidth:"95vw",maxHeight:"90vh",borderRadius:10,objectFit:"contain" }}/>
        </div>
      )}

      {/* HERO — фон суреті */}
      <div style={{
        position:"relative", borderRadius:20, overflow:"hidden",
        marginBottom:24,
        background:`linear-gradient(180deg, rgba(60,0,0,0.3) 0%, rgba(20,0,0,0.7) 100%)`,
      }}>
        {/* Табиғат фоны */}
        <img src={`${B}озен.jpg`} alt=""
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.45, zIndex:0 }}
          onError={e=>{e.target.style.display="none"}}
        />
        {/* Ою-өрнек overlay */}
        <div style={{ position:"absolute", inset:0, backgroundImage:OYU_BG, opacity:0.25, zIndex:1 }}/>

        <div style={{ position:"relative", zIndex:2, padding:"36px 20px 32px", textAlign:"center" }}>

          {/* Қоңырау */}
          <div className="bell fade-in" style={{ fontSize:56, marginBottom:12, display:"inline-block" }}>🔔</div>

          {/* Армандастар */}
          <h1 className="fade-in-2" style={{
            fontFamily:"Georgia,serif",
            fontSize:"clamp(24px,6vw,48px)",
            color:CREAM, margin:"0 0 10px", lineHeight:1.2,
            textShadow:"0 2px 20px rgba(0,0,0,0.8)",
          }}>
            Армандастар, құрдастар!
          </h1>

          {/* 35 жыл — үлкен анимация */}
          <div className="fade-in-3" style={{ margin:"8px 0 6px" }}>
            <span className="text-35" style={{
              fontFamily:"Georgia,serif",
              fontSize:"clamp(72px,18vw,130px)",
              fontWeight:900,
              background:`linear-gradient(135deg, ${GOLD2} 0%, #fff 40%, ${GOLD} 60%, ${GOLD2} 100%)`,
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
              lineHeight:1,
              display:"inline-block",
            }}>35</span>
            <div style={{ color:GOLD2, fontFamily:"Georgia,serif", fontSize:"clamp(20px,5vw,34px)", marginTop:-4 }}>жылдық кездесу</div>
          </div>

          {/* Алтын сызық */}
          <div className="gold-line fade-in-4" style={{ marginTop:16, marginBottom:16 }}/>

          {/* Таймер */}
          <div className="fade-in-4">
            <div style={{ color:GOLD, fontSize:11, letterSpacing:3, marginBottom:10, textTransform:"uppercase" }}>Кездесуге дейін қалды</div>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:20 }}>
              <TimerBox value={timer.d} label="КҮН"/>
              <TimerBox value={timer.h} label="САҒАТ"/>
              <TimerBox value={timer.m} label="МИНУТ"/>
              <TimerBox value={timer.s} label="СЕКУНД"/>
            </div>
          </div>
        </div>

        {/* Алтын жиек */}
        <div style={{ position:"absolute", inset:0, border:`2px solid rgba(212,160,23,0.4)`, borderRadius:20, pointerEvents:"none", zIndex:3 }}/>
      </div>

      {/* Мектеп туралы ресми ақпарат */}
      <div style={{
        ...card, marginBottom:20, position:"relative", overflow:"hidden",
        background:"rgba(0,0,0,0.4)",
        border:`2px solid rgba(212,160,23,0.4)`,
        textAlign:"center",
      }}>
        <img src={encodeURI(`${B}Кызбел/Тау.jpg`)} alt=""
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.25, zIndex:0 }}
          onError={e=>{e.target.style.display="none"}}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ height:3, background:`linear-gradient(90deg,transparent,${GOLD},transparent)`, marginBottom:18, borderRadius:2 }}/>
          <div style={{ fontSize:40, marginBottom:12 }}>🏫</div>
          <div style={{ color:GOLD, fontSize:10, letterSpacing:4, textTransform:"uppercase", marginBottom:10 }}>Ресми атауы</div>
          <div style={{ color:"rgba(255,230,180,0.7)", fontSize:12, marginBottom:6 }}>
            ҚОСТАНАЙ ОБЛЫСЫ ӘКІМДІГІ БІЛІМ БАСҚАРМАСЫНЫҢ
          </div>
          <div style={{
            color:GOLD2,
            fontFamily:"Georgia,serif",
            fontWeight:700,
            fontSize:"clamp(14px,3.5vw,18px)",
            lineHeight:1.5,
            margin:"0 auto 6px",
            maxWidth:560,
          }}>
            «ЖАНГЕЛДИН АУДАНЫ БІЛІМ БӨЛІМІНІҢ МІРЖАҚЫП ДУЛАТОВ АТЫНДАҒЫ ЖАЛПЫ БІЛІМ БЕРЕТІН МЕКТЕБІ»
          </div>
          <div style={{ color:GOLD, fontSize:13, letterSpacing:2, marginBottom:12 }}>КММ</div>
          <div style={{ color:"rgba(255,230,180,0.6)", fontSize:12, marginBottom:12 }}>
            📅 Ашылған күні: <span style={{ color:GOLD2, fontWeight:600 }}>01.01.1967</span>
          </div>
          <div style={{ height:3, background:`linear-gradient(90deg,transparent,${GOLD},transparent)`, borderRadius:2 }}/>
        </div>
      </div>

      {/* Міржақып Дулатұлы — БАСТЫ БЕТТЕ */}
      <div style={{
        ...card, marginBottom:20,
        background:"rgba(0,0,0,0.4)",
        border:`2px solid rgba(212,160,23,0.4)`,
      }}>
        {/* Жоғарғы алтын жолақ */}
        <div style={{ height:3, background:`linear-gradient(90deg,transparent,${GOLD},transparent)`, marginBottom:20, borderRadius:2 }}/>

        <div style={{ display:"flex", gap:20, alignItems:"flex-start", flexWrap:"wrap" }}>

          {/* Дулатұлы суреті — НАҚТЫ СУРЕТ */}
          <div style={{ flexShrink:0, textAlign:"center" }}>
            <div style={{
              padding:5,
              background:`linear-gradient(145deg,${GOLD},${GOLD2},${GOLD})`,
              borderRadius:16,
              display:"inline-block",
            }}>
              <img
                src={encodeURI(`${B}Кызбел/М.Дулат.jpg`)}
                alt="Міржақып Дулатұлы"
                style={{ width:150, height:190, objectFit:"cover", objectPosition:"top", borderRadius:12, display:"block" }}
                onError={e=>{e.target.style.display="none"; e.target.nextSibling.style.display="flex";}}
              />
              <div style={{ width:150, height:190, borderRadius:12, background:"rgba(0,0,0,0.4)", display:"none", alignItems:"center", justifyContent:"center", fontSize:52 }}>📖</div>
            </div>
            <div style={{ color:GOLD2, fontFamily:"Georgia,serif", fontSize:14, marginTop:8, fontWeight:600 }}>М. Дулатұлы</div>
            <div style={{ color:GOLD, fontSize:11, letterSpacing:1 }}>1885 – 1935</div>
          </div>

          {/* Мәтін */}
          <div style={{ flex:1, minWidth:190 }}>
            <div style={{ color:GOLD, fontSize:11, letterSpacing:4, textTransform:"uppercase", marginBottom:6 }}>Ұлы тұлға</div>
            <div style={{ color:GOLD2, fontFamily:"Georgia,serif", fontWeight:700, fontSize:18, marginBottom:10 }}>
              Міржақып Дулатұлы
            </div>
            <div style={{ color:"rgba(255,230,180,0.7)", fontSize:12, marginBottom:10 }}>
              Ақын · Жазушы · Публицист · Алаш қайраткері
            </div>
            <p style={{ color:"rgba(255,230,180,0.85)", lineHeight:1.8, fontSize:13, marginBottom:10 }}>
              1885 жылы Қостанай облысында дүниеге келген. Қазақ халқының ұлт-азаттық қозғалысының белді өкілі. «Қазақ» газетінің редакторы.
            </p>
            <p style={{ color:"rgba(255,230,180,0.85)", lineHeight:1.8, fontSize:13, marginBottom:14 }}>
              «Оян, қазақ!» (1909) — халықты оянуға шақырған тарихи туынды. «Бақытсыз Жамал» — алғашқы қазақ романы.
            </p>
            <div style={{ background:"rgba(0,0,0,0.35)", borderLeft:`3px solid ${GOLD}`, padding:"10px 14px", borderRadius:"0 8px 8px 0" }}>
              <div style={{ color:GOLD2, fontStyle:"italic", fontSize:14, fontFamily:"Georgia,serif", lineHeight:1.7 }}>
                «Көзіңді аш, оян қазақ, көтер басты!»
              </div>
            </div>
          </div>
        </div>

        <div style={{ height:3, background:`linear-gradient(90deg,transparent,${GOLD},transparent)`, marginTop:20, borderRadius:2 }}/>
      </div>


    </div>
  );
}

/* ══════════════════════════════════════
   2-БЕТ: КЕЗДЕСУЛЕР & ЕСКЕ АЛУ
══════════════════════════════════════ */
function Page2() {
  const [lbSrc, setLbSrc] = useState(null);
  const lb = src => setLbSrc(src);

  const Gallery = ({ photos, count=4 }) => (
    photos.length > 0
      ? <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))", gap:6, marginTop:10 }}>
          {photos.map((s,i)=>(
            <img key={i} src={s} alt="" onClick={()=>lb(s)}
              style={{ width:"100%", height:95, objectFit:"cover", borderRadius:7, cursor:"zoom-in", display:"block" }}
              onError={e=>{e.target.style.display="none"}}/>
          ))}
        </div>
      : <div style={{ display:"grid", gridTemplateColumns:`repeat(${count},1fr)`, gap:7, marginTop:10 }}>
          {Array(count).fill(null).map((_,i)=><Photo key={i} height={90}/>)}
        </div>
  );

  return (
    <div>
      {lbSrc && (
        <div onClick={()=>setLbSrc(null)} style={{ position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,0.93)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"zoom-out" }}>
          <img src={lbSrc} alt="" style={{ maxWidth:"95vw",maxHeight:"90vh",borderRadius:10,objectFit:"contain" }}/>
        </div>
      )}

      <SectionTitle>Кездесулер тарихы</SectionTitle>

      {/* Оқушылық өмір */}
      <div style={{ ...card, borderLeft:`4px solid ${GOLD}`, marginBottom:16, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, background:`linear-gradient(135deg,${GOLD},${GOLD2})`, color:RED1, padding:"4px 14px", borderBottomLeftRadius:12, fontWeight:700, fontSize:13 }}>1981–1991</div>
        <h3 style={{ fontFamily:"Georgia,serif", fontSize:22, color:GOLD, margin:"0 0 4px" }}>Оқушылық өмір</h3>
        <p style={{ color:"rgba(255,230,180,0.7)", fontSize:13, lineHeight:1.7, fontStyle:"italic", margin:"0 0 12px" }}>
          Мектеп партасы, оқу, дос-жарандармен өткізген жастық шақ. Сол алтын жылдардың суреттері...
        </p>
        <Gallery photos={PHOTOS_OKUSHYLYK}/>
      </div>

      {/* 20 жыл */}
      <div style={{ ...card, borderLeft:`4px solid ${GOLD}`, marginBottom:16, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, background:`linear-gradient(135deg,${GOLD},${GOLD2})`, color:RED1, padding:"4px 14px", borderBottomLeftRadius:12, fontWeight:700, fontSize:13 }}>2011</div>
        <h3 style={{ fontFamily:"Georgia,serif", fontSize:22, color:GOLD, margin:"0 0 8px" }}>20 жыл</h3>
        <p style={{ color:"rgba(255,230,180,0.8)", fontSize:14, lineHeight:1.7, margin:"0 0 10px" }}>Жиырма жыл — өмірдің ортасы. Отбасы, мансап, арман. Жүректе — әрқашан да бір едік.</p>
        <div style={{ marginTop:10 }}>
          <iframe title="vid-20" src="https://www.youtube.com/embed/gkW4EExVELY"
            style={{ width:"100%", height:220, border:"none", borderRadius:10, display:"block" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
        </div>
      </div>

      {/* 25 жыл */}
      <div style={{ ...card, borderLeft:`4px solid ${GOLD}`, marginBottom:16, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, background:`linear-gradient(135deg,${GOLD},${GOLD2})`, color:RED1, padding:"4px 14px", borderBottomLeftRadius:12, fontWeight:700, fontSize:13 }}>2016</div>
        <h3 style={{ fontFamily:"Georgia,serif", fontSize:22, color:GOLD, margin:"0 0 8px" }}>25 жыл — Күміс мерей</h3>
        <p style={{ color:"rgba(255,230,180,0.8)", fontSize:14, lineHeight:1.7, margin:"0 0 10px" }}>Ширек ғасыр өтті. Балаларымыз өсті, бірақ жүректеріміз сол бұрынғыдай жас қалды.</p>
        <div style={{ marginTop:10 }}>
          <iframe title="vid-25" src="https://www.youtube.com/embed/hAROIp6yHSc"
            style={{ width:"100%", height:220, border:"none", borderRadius:10, display:"block" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
        </div>
      </div>

      <Divider/>

      {/* Еске алу */}
      <div style={{ ...card }}>
        <SectionTitle>Еске алу 🕯</SectionTitle>
        <p style={{ color:"rgba(255,230,180,0.8)", fontSize:14, lineHeight:1.8, textAlign:"center", fontStyle:"italic", marginBottom:16 }}>
          Бізбен бірге оқыған, бірге өскен, бірақ ерте кеткен жандарды ізгілікпен еске аламыз.
        </p>
        <div style={{ borderRadius:12, overflow:"hidden", marginTop:8 }}>
          <video controls style={{ width:"100%", borderRadius:12, display:"block", background:"#000" }}>
            <source src={`${B}0404.mp4`} type="video/mp4"/>
          </video>
        </div>
      </div>
    </div>
  );
}

/* ── Бас мешіт сілтемесі ── */
function MosqueVideo() {
  return (
    <a href="https://go.2gis.com/ubsuN" target="_blank" rel="noreferrer" style={{
      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
      width:"100%", background:`linear-gradient(135deg,rgba(212,160,23,0.18),rgba(212,160,23,0.08))`,
      border:`1px solid rgba(212,160,23,0.45)`, color:GOLD2, borderRadius:10,
      padding:"10px 16px", fontWeight:600, fontSize:13, textDecoration:"none",
      boxSizing:"border-box",
    }}>
      🕌 Астана Бас мешіті — 2GIS картасы
    </a>
  );
}

/* ══════════════════════════════════════
   3-БЕТ: 35 ЖЫЛДЫҚ БАҒДАРЛАМА
══════════════════════════════════════ */
function Page3() {
  const dayBox = c => ({ background:`rgba(${c},0.15)`, border:`1px solid rgba(${c},0.45)`, borderRadius:20, padding:"22px 24px", marginBottom:20 });

  const EventCard = ({ icon, time, text, blue }) => (
    <div className={blue ? "event-card-blue" : "event-card"}>
      <div style={{ fontSize:28, width:42, textAlign:"center", flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ color: blue ? "#a8d4f8" : GOLD2, fontWeight:700, fontSize:14, marginBottom:2 }}>{time}</div>
        <div style={{ color:"#fff", fontSize:16, fontWeight:500 }}>{text}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:42 }}>🎉</div>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:28, color:CREAM, margin:"8px 0 4px" }}>35 жылдық кездесу</h2>
        <div style={{ color:GOLD, fontSize:14 }}>01.07.2026 жыл</div>
      </div>

      {/* 1-күн */}
      <div style={dayBox("212,160,23")}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <div style={{ background:`linear-gradient(135deg,${GOLD},${GOLD2})`, color:RED1, borderRadius:20, padding:"7px 18px", fontWeight:700, fontSize:15, boxShadow:`0 4px 12px rgba(212,160,23,0.4)` }}>1-күн</div>
          <div style={{ color:GOLD2, fontWeight:600, fontSize:15 }}>01.07.2026ж · «Кездесу»</div>
        </div>
        <EventCard icon="🕌" time="15:00"       text="Бас мешіт" />
        <EventCard icon="🏕" time="17:00"       text="«Нұра» демалыс орны" />
        <EventCard icon="🍽" time="18:00"       text="Банкет" />
        <EventCard icon="🌙" time="22:00"       text="Кешкі фотосессия" />
        <div style={{ marginTop:14, background:"rgba(0,0,0,0.2)", border:`1px solid rgba(212,160,23,0.3)`, borderRadius:12, padding:"12px 18px", color:"rgba(255,230,180,0.85)", fontSize:14 }}>
          🌟 Бірінші күн — қуанышты кездесу, жылы тілектер!
        </div>
      </div>

      {/* 2-күн */}
      <div style={dayBox("100,180,255")}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <div style={{ background:"linear-gradient(135deg,#2196f3,#5aaaf0)", color:"#fff", borderRadius:20, padding:"7px 18px", fontWeight:700, fontSize:15, boxShadow:"0 4px 12px rgba(33,150,243,0.4)" }}>2-күн</div>
          <div style={{ color:"#a8d4f8", fontWeight:600, fontSize:15 }}>02.07.2026ж · «Серуен»</div>
        </div>
        <EventCard blue icon="🌲" time="06:00 – 09:00" text="Тимбилдинг — табиғат қойнауында серуендеу" />
        <EventCard blue icon="🍳" time="09:00 – 10:00" text="Таңғы ас" />
        <EventCard blue icon="🎯" time="10:00 – 13:00" text="Ойын-сауық, жарыстар" />
        <EventCard blue icon="🍽️" time="13:00 – 15:00" text="Фуршет — бірлескен тағам, ән-жыр" />
        <EventCard blue icon="🏛️" time="16:00 – 19:00" text="Астанаға туристік саяхат" />
        <div style={{ marginTop:14, background:"rgba(0,0,0,0.2)", border:"1px solid rgba(100,180,255,0.3)", borderRadius:12, padding:"12px 18px", color:"rgba(200,230,255,0.85)", fontSize:14 }}>
          👋 Қоштасу — келесі кездесуге дейін!
        </div>
      </div>

      {/* Шақыру билеті */}
      <div style={{ ...card, marginBottom:20 }}>
        <div style={{ maxWidth:460, margin:"0 auto 0", backgroundImage:`url(${B}meshit.jpg)`, backgroundSize:"cover", backgroundPosition:"top center", border:`2px solid ${GOLD}`, borderRadius:18, overflow:"hidden", boxShadow:`0 0 30px rgba(212,160,23,0.3)` }}>
          <div style={{ height:6, background:`linear-gradient(90deg,${GOLD},${GOLD2},${GOLD})` }}/>
          <div style={{ padding:"24px 28px", display:"flex", flexDirection:"column", minHeight:400 }}>
            <a href={`${B}baibolat_music.mp4`} target="_blank" rel="noreferrer" style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              width:"100%", background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
              color:RED1, borderRadius:10, padding:"13px 16px",
              fontWeight:700, fontSize:15, textDecoration:"none",
              boxSizing:"border-box", boxShadow:`0 4px 16px rgba(212,160,23,0.4)`,
            }}>
              ▶ Билетті қарау
            </a>
          </div>
          <div style={{ height:6, background:`linear-gradient(90deg,${GOLD},${GOLD2},${GOLD})` }}/>
        </div>
        <div style={{ maxWidth:460, margin:"10px auto 0", background:`linear-gradient(135deg,rgba(212,160,23,0.22),rgba(212,160,23,0.10))`, border:`1px solid rgba(212,160,23,0.4)`, borderRadius:14, padding:"4px" }}>
          <MosqueVideo/>
        </div>
      </div>

      {/* Жету жолдары */}
      <div style={{ ...card }}>
        <SectionTitle>Жету жолдары</SectionTitle>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10 }}>
          {[
            { icon:"🚋", t:"Туристік саяхат", d:"Жеңіл рельсті транспорт" },
            { icon:"🚐", t:"Трансфер",        d:"Косшы, «Нұра»" },
            { icon:"🚗", t:"Жеке көлік",      d:"Косшы, «Нұра»" },
          ].map((it,i)=>(
            <div key={i} style={{ background:"rgba(0,0,0,0.25)", border:`1px solid rgba(212,160,23,0.2)`, borderRadius:12, padding:"14px 10px", textAlign:"center" }}>
              <div style={{ fontSize:26 }}>{it.icon}</div>
              <div style={{ color:CREAM, fontWeight:600, fontSize:13, margin:"6px 0 3px" }}>{it.t}</div>
              <div style={{ color:"rgba(255,220,160,0.7)", fontSize:11 }}>{it.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Дастархандар аккордеон ── */
function DastarkhanAccordion() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ ...card, marginBottom:20 }}>
      <div onClick={()=>setOpen(o=>!o)} style={{ cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", userSelect:"none" }}>
        <span style={{ color:GOLD, fontSize:18, lineHeight:1, visibility:"hidden" }}>{open?"▲":"▼"}</span>
        <div className="fade-in-2" style={{ color:GOLD2, fontFamily:"Georgia,serif", fontWeight:700, fontSize:19, letterSpacing:2, textAlign:"center", flex:1 }}>Дастархандар</div>
        <span style={{ color:GOLD, fontSize:18, lineHeight:1 }}>{open?"▲":"▼"}</span>
      </div>
      {open && (
        <div style={{ marginTop:16 }}>
          {TABLES.map((item, i) => (
            <div key={i} style={{ marginBottom:14, paddingBottom:14,
              borderBottom: i < TABLES.length-1 ? `1px solid rgba(212,160,23,0.2)` : "none" }}>
              <div style={{ color:GOLD2, fontFamily:"Georgia,serif", fontWeight:700, fontSize:15, marginBottom:4 }}>
                {i+1}. {item.name}
              </div>
              <div style={{ color:"rgba(255,230,180,0.8)", fontSize:13, fontStyle:"italic", lineHeight:1.7 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Жазылғандар тізімі ── */
function GuestList({ guests }) {
  const hasAny = TABLES.some(t => (guests[t.name] || []).length > 0);
  if (!hasAny) return null;
  return (
    <div style={{ ...card, marginBottom:20 }}>
      <SectionTitle>Жазылғандар тізімі 📋</SectionTitle>
      {TABLES.map((t, i) => {
        const people = guests[t.name] || [];
        if (people.length === 0) return null;
        const isFull = people.length >= MAX_SEATS;
        return (
          <div key={i} style={{ marginBottom:14, paddingBottom:14,
            borderBottom: i < TABLES.length-1 ? `1px solid rgba(212,160,23,0.15)` : "none" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ color:GOLD2, fontFamily:"Georgia,serif", fontWeight:700, fontSize:14 }}>
                {t.name}
              </div>
              <div style={{
                fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:10,
                background: isFull ? "rgba(200,50,50,0.3)" : "rgba(212,160,23,0.15)",
                color: isFull ? "#ff9999" : GOLD,
                border:`1px solid ${isFull ? "rgba(200,50,50,0.5)" : "rgba(212,160,23,0.35)"}`,
              }}>
                {people.length}/{MAX_SEATS}
              </div>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {people.map((p, j) => (
                <span key={j} style={{ background:"rgba(212,160,23,0.12)", border:`1px solid rgba(212,160,23,0.3)`, borderRadius:14, padding:"3px 11px", fontSize:12, color:CREAM }}>
                  {j+1}. {p}
                </span>
              ))}
            </div>
            {isFull && (
              <div style={{ marginTop:6, fontSize:12, color:"#ff9999", fontStyle:"italic" }}>⛔ Орын толды</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── НҰРА 2GIS суреттері ── */
const PHOTOS_NURA = [
  "Бассейн.jpg","Hotel.webp","XXXL (2).webp",
  "30258560091373452_49f5.jpg","30258560109008963_e3c5.jpg",
  "6a07494a-819a-4094-a556-4e447c94b3d3.jpg",
  "96682800-b0e8-49e7-bbda-50bf603ff23f.jpg",
  "9c84bc5c-2fa1-4058-a501-2da85fd4028d.jpg",
  "c758e2b4-8c89-4671-a775-847166a5b17f.jpg",
  "1c27a159-deff-48a5-9a7d-9a48c0181128.jpg",
  "1dbe452c-7940-4f0d-9acd-5e229f4e93df.jpg",
].map(f => encodeURI(`${B}Нұра демалыс орны/${f}`));

/* ══════════════════════════════════════
   4-БЕТ: НҰРА & БАЙЛАНЫС
══════════════════════════════════════ */
function Page4() {
  const [lbSrc, setLbSrc] = useState(null);
  const [name, setName] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [guests, setGuests] = useState(() => loadGuests());
  const [done, setDone] = useState(false);
  const [warning, setWarning] = useState("");

  const submit = () => {
    if (!name.trim() || !selectedTable) return;
    const seats = guests[selectedTable] || [];
    if (seats.length >= MAX_SEATS) {
      const alts = TABLES
        .filter(t => t.name !== selectedTable && (guests[t.name] || []).length < MAX_SEATS)
        .slice(0, 2).map(t => t.name).join(", ");
      setWarning(
        `«${selectedTable}» дастарханында орын қалмады. ` +
        (alts ? `${alts} дастарханына жазылуды ұсынамыз.` : "Барлық дастарханда орын толды.")
      );
      return;
    }
    setWarning("");
    const updated = { ...guests, [selectedTable]: [...seats, name.trim()] };
    setGuests(updated);
    saveGuests(updated);
    setName("");
    setSelectedTable("");
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <div>
      {lbSrc && (
        <div onClick={()=>setLbSrc(null)} style={{ position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,0.95)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"zoom-out" }}>
          <img src={lbSrc} alt="" style={{ maxWidth:"95vw",maxHeight:"90vh",borderRadius:10,objectFit:"contain" }}/>
        </div>
      )}

      {/* Нұра */}
      <SectionTitle>Нұра демалыс базасы</SectionTitle>

      {/* Басты сурет */}
      <div style={{ borderRadius:16, overflow:"hidden", marginBottom:16, border:`2px solid rgba(212,160,23,0.4)` }}>
        <img
          src={encodeURI(`${B}Нұра демалыс орны/Бассейн.jpg`)}
          alt="Нұра демалыс орны"
          style={{ width:"100%", height:220, objectFit:"cover", display:"block" }}
          onError={e=>{
            e.target.src="https://i4.photo.2gis.com/images/branch/0/30258560109038361_e96f.jpg";
            e.target.onerror=null;
          }}
        />
      </div>

      <div style={{ ...card, marginBottom:16 }}>
        <h3 style={{ color:GOLD, fontSize:18, margin:"0 0 12px" }}>Орын туралы</h3>
        <p style={{ color:"rgba(255,230,180,0.85)", lineHeight:1.8, fontSize:14, marginBottom:14 }}>
          «Нұра» — Косшы қаласындағы табиғат қойнауындағы сәнді демалыс орны.
          Жасыл орман, таза ауа, заманауи инфрақұрылым. 35 жылдық кездесуімізге өте лайықты мекен!
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:9 }}>
          {[
            { icon:"🍽", t:"Дастархан залы" },
            { icon:"🌳", t:"Орман, серуен" },
            { icon:"🎵", t:"Сахна, би" },
            { icon:"🏕", t:"Бунгало үйлер" },
            { icon:"🔥", t:"Мангал" },
            { icon:"🅿",  t:"Тегін паркинг" },
          ].map((f,i)=>(
            <div key={i} style={{ background:"rgba(0,0,0,0.25)", border:`1px solid rgba(212,160,23,0.2)`, borderRadius:10, padding:"12px 8px", textAlign:"center" }}>
              <div style={{ fontSize:24 }}>{f.icon}</div>
              <div style={{ color:CREAM, fontSize:12, marginTop:5, fontWeight:600 }}>{f.t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Карта */}
      <div style={{ ...card, marginBottom:16, textAlign:"center" }}>
        <h3 style={{ color:GOLD, fontSize:17, margin:"0 0 16px" }}>Мекенжай</h3>
        <a href="https://maps.app.goo.gl/pRZRtJ5Z4C6S8EBh6" target="_blank" rel="noreferrer"
          style={{ display:"inline-block", background:`linear-gradient(135deg,${GOLD},${GOLD2})`, color:RED1, textDecoration:"none", borderRadius:8, padding:"13px 28px", fontWeight:700, fontSize:15 }}>
          🗺 Маршрутты ашу
        </a>
      </div>

      <DastarkhanAccordion />

      <Divider/>

      {/* Кері байланыс — RSVP */}
      <div style={{ ...card, marginBottom:20 }}>
        <SectionTitle>Дастарханға жазылу</SectionTitle>
        {done ? (
          <div style={{ textAlign:"center", padding:"24px 0" }}>
            <div style={{ fontSize:48 }}>🎉</div>
            <p style={{ color:GOLD, fontSize:18, fontFamily:"Georgia,serif", margin:"10px 0 4px" }}>Рахмет!</p>
            <p style={{ color:"rgba(255,220,160,0.8)", fontSize:14 }}>Тізімге қосылдыңыз. Кездесуде көріскенше!</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <input
              value={name}
              onChange={e=>{ setName(e.target.value); setWarning(""); }}
              placeholder="Есіміңді жаз"
              style={inputSt}
            />
            <select
              value={selectedTable}
              onChange={e=>{ setSelectedTable(e.target.value); setWarning(""); }}
              style={{ ...inputSt, cursor:"pointer" }}
            >
              <option value="">— Дастарханды таңда —</option>
              {TABLES.map((t, i) => {
                const count = (guests[t.name] || []).length;
                const isFull = count >= MAX_SEATS;
                return (
                  <option key={i} value={t.name} disabled={isFull}>
                    {t.name} — {count}/{MAX_SEATS}{isFull ? " (толды)" : ""}
                  </option>
                );
              })}
            </select>
            {warning && (
              <div style={{ background:"rgba(180,40,40,0.2)", border:"1px solid rgba(200,80,80,0.5)", borderRadius:9, padding:"11px 14px", color:"#ffb3b3", fontSize:13, lineHeight:1.7 }}>
                ⚠️ {warning}
              </div>
            )}
            <button
              onClick={submit}
              disabled={!name.trim() || !selectedTable}
              style={{
                background: (!name.trim() || !selectedTable)
                  ? "rgba(212,160,23,0.25)"
                  : `linear-gradient(135deg,${GOLD},${GOLD2})`,
                color: RED1, border:"none", borderRadius:9, padding:"12px 24px",
                fontWeight:700, fontSize:15,
                cursor: (!name.trim() || !selectedTable) ? "not-allowed" : "pointer",
                width:"100%", transition:"all 0.2s",
              }}
            >
              Тізімге жазылу ✓
            </button>
          </div>
        )}
      </div>

      <GuestList guests={guests} />

      {/* Ұйымдастырушылар алқасы */}
      <div style={{ ...card, marginBottom:20 }}>
        <SectionTitle>Ұйымдастырушылар алқасы 👥</SectionTitle>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:`linear-gradient(135deg,${GOLD},${GOLD2})` }}>
                <th style={{ color:RED1, padding:"10px 12px", textAlign:"left", fontWeight:700, borderRadius:"8px 0 0 0" }}>Қызмет түрі</th>
                <th style={{ color:RED1, padding:"10px 12px", textAlign:"left", fontWeight:700 }}>Жауапты</th>
                <th style={{ color:RED1, padding:"10px 12px", textAlign:"left", fontWeight:700, borderRadius:"0 8px 0 0" }}>Телефон</th>
              </tr>
            </thead>
            <tbody>
              {[
                { role:"Атқарушы",          name:"Айдар",              phone:"—" },
                { role:"Үйлестіруші",       name:"Болат",              phone:"—" },
                { role:"Банкет, фуршет",    name:"Асылхан, Ғабдолла",  phone:"—" },
                { role:"Логистика",         name:"Рамазан, Қанағат",   phone:"—" },
                { role:"Спорт",             name:"Болатбек, Елтай, Ақылжан", phone:"—" },
                { role:"Мобилограф",        name:"Мақсұтбек",          phone:"—" },
                { role:"Қонақ үй",          name:"Қуаныш",             phone:"—" },
                { role:"Дастархан",         name:"келіншектер",         phone:"—" },
                { role:"Дизайн",            name:"қыздар",             phone:"—" },
              ].map((r,i)=>(
                <tr key={i} style={{ background: i%2===0 ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.15)", borderBottom:"1px solid rgba(212,160,23,0.1)" }}>
                  <td style={{ padding:"10px 12px", color:GOLD2, fontWeight:600 }}>{r.role}</td>
                  <td style={{ padding:"10px 12px", color:CREAM }}>{r.name}</td>
                  <td style={{ padding:"10px 12px" }}>
                    {r.phone !== "—"
                      ? <a href={`tel:${r.phone}`} style={{ color:GOLD, textDecoration:"none", fontWeight:600 }}>📞 {r.phone}</a>
                      : <span style={{ color:"rgba(255,220,160,0.4)" }}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Админ карточка */}
      <div style={{ ...card, textAlign:"center" }}>
        <div style={{ display:"inline-block", padding:5, background:`linear-gradient(145deg,${GOLD},${GOLD2})`, borderRadius:18, boxShadow:`0 0 28px rgba(212,160,23,0.4)`, marginBottom:14, position:"relative" }}>
          <img src={`${B}admin.jpg`} alt="Мадияр Болат"
            style={{ width:160, height:190, objectFit:"cover", borderRadius:14, display:"block" }}
            onError={e=>{e.target.style.display="none"}}/>
          {/* Бұрыш декорлары */}
          {[{top:-7,left:-7},{top:-7,right:-7},{bottom:-7,left:-7},{bottom:-7,right:-7}].map((p,i)=>(
            <div key={i} style={{ position:"absolute", ...p, width:14, height:14, background:GOLD2, borderRadius:"50%", boxShadow:`0 0 6px ${GOLD}` }}/>
          ))}
        </div>
        <div style={{ color:"rgba(255,220,160,0.6)", fontSize:11, letterSpacing:4, textTransform:"uppercase", marginBottom:4 }}>Сайт әкімшісі</div>
        <div style={{ fontFamily:"Georgia,serif", fontSize:22, background:`linear-gradient(135deg,${CREAM},${GOLD2})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          Мадияр Болат
        </div>
        <div style={{ width:60, height:2, background:`linear-gradient(90deg,transparent,${GOLD},transparent)`, margin:"10px auto 16px" }}/>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <a href={TG_LINK} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:6, background:"#229ED9", color:"#fff", textDecoration:"none", borderRadius:10, padding:"9px 16px", fontWeight:700, fontSize:13 }}>✈️ @baibolcombot</a>
          <a href={WA_LINK} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:6, background:"#25D366", color:"#fff", textDecoration:"none", borderRadius:10, padding:"9px 16px", fontWeight:700, fontSize:13 }}>💬 WhatsApp</a>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   НЕГІЗГІ APP
══════════════════════════════════════ */
const PAGES = [
  { id:1, label:"Басты бет",    icon:"🏠" },
  { id:2, label:"Естеліктер",   icon:"📅" },
  { id:3, label:"Бағдарлама",   icon:"📋" },
  { id:4, label:"Нұра демалыс базасы", icon:"🏕" },
];

export default function App() {
  const [page, setPage] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const timer = useCountdown();

  const goPage = (p) => { setPage(p); setAnimKey(k=>k+1); window.scrollTo({top:0,behavior:"smooth"}); };

  const content = {
    1: <Page1 timer={timer}/>,
    2: <Page2/>,
    3: <Page3/>,
    4: <Page4/>,
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:`linear-gradient(160deg,${RED1} 0%,${RED2} 40%,${RED3} 70%,${RED1} 100%)`,
      backgroundImage:`${OYU_BG}, linear-gradient(160deg,${RED1} 0%,${RED2} 40%,${RED3} 70%,${RED1} 100%)`,
      fontFamily:"'Segoe UI',sans-serif",
      color:CREAM,
    }}>
      {/* ЖОГ АРҒЫ ОЮ ЖОЛАҒЫ */}
      <OrnBorder/>

      {/* NAV */}
      <div style={{ background:"rgba(50,0,0,0.92)", backdropFilter:"blur(10px)", borderBottom:`1px solid rgba(212,160,23,0.3)`, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:800, margin:"0 auto", padding:"0 12px", display:"flex", alignItems:"center", gap:6, height:52, overflowX:"auto", scrollbarWidth:"none" }}>
          {PAGES.map(p=>(
            <button key={p.id} onClick={()=>goPage(p.id)} style={{
              background: page===p.id ? `linear-gradient(135deg,${GOLD},${GOLD2})` : "transparent",
              color: page===p.id ? RED1 : "rgba(255,220,160,0.7)",
              border:`1px solid ${page===p.id ? "transparent" : "rgba(212,160,23,0.25)"}`,
              borderRadius:7, padding:"5px 11px", fontSize:12, fontWeight:700,
              cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.2s", flexShrink:0,
            }}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>
        {/* Бет нүктелері */}
        <div style={{ display:"flex", justifyContent:"center", gap:8, paddingBottom:6 }}>
          {PAGES.map(p=>(
            <div key={p.id} onClick={()=>goPage(p.id)} style={{
              width: page===p.id ? 24 : 8,
              height:8, borderRadius:4,
              background: page===p.id ? GOLD : "rgba(212,160,23,0.3)",
              cursor:"pointer", transition:"all 0.3s",
            }}/>
          ))}
        </div>
      </div>

      {/* МАЗМҰН */}
      <div key={animKey} className="page-enter" style={{ maxWidth:780, margin:"0 auto", padding:"28px 16px 100px" }}>
        {content[page]}
      </div>

      {/* ЖАБЫСҚАН ТӨМЕНГІ ПАНЕЛЬ */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:200,
        background:"rgba(50,0,0,0.97)", backdropFilter:"blur(12px)",
        borderTop:`1px solid rgba(212,160,23,0.3)`,
        padding:"8px 16px",
        display:"flex", gap:8, justifyContent:"center", alignItems:"center", flexWrap:"wrap",
      }}>
        <a href={`tel:${ADMIN_PHONE}`} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(212,160,23,0.15)", border:`1px solid rgba(212,160,23,0.35)`, color:GOLD, textDecoration:"none", borderRadius:9, padding:"9px 13px", fontWeight:700, fontSize:12 }}>
          📞 {ADMIN_PHONE}
        </a>
        <a href={TG_LINK} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(34,158,217,0.2)", border:"1px solid rgba(34,158,217,0.45)", color:"#5bc8f5", textDecoration:"none", borderRadius:9, padding:"9px 13px", fontWeight:700, fontSize:12 }}>
          ✈️ Telegram
        </a>
        <a href={WA_LINK} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(37,211,102,0.15)", border:"1px solid rgba(37,211,102,0.4)", color:"#4ade80", textDecoration:"none", borderRadius:9, padding:"9px 13px", fontWeight:700, fontSize:12 }}>
          💬 WhatsApp
        </a>
      </div>


      {/* ТӨМЕНГІ ОЮ ЖОЛАҒЫ */}
      <div style={{ position:"fixed", bottom:58, left:0, right:0, zIndex:199 }}>
        <OrnBorder/>
      </div>

      {/* 🤖 ЖАБЫСҚАН BOT БАТЫРМАСЫ */}
      <a
        href={TG_LINK}
        target="_blank"
        rel="noreferrer"
        title="@baibolcombot — ботпен сөйлесу"
        style={{
          position:"fixed", bottom:72, right:16, zIndex:300,
          width:54, height:54,
          background:"#229ED9",
          borderRadius:"50%",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 4px 16px rgba(34,158,217,0.5)",
          textDecoration:"none",
          transition:"transform 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.transform="scale(1.12)"}
        onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
        </svg>
      </a>
    </div>
  );
}
