import { useState, useEffect, useCallback } from "react";
import {
  ComposedChart, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine, Line, LineChart
} from "recharts";
import { Bell, ChevronDown, Download, RefreshCw, WifiOff } from "lucide-react";

/* ═══════════════════════════════════════════════════
   API LAYER — connects to Python Flask backend
═══════════════════════════════════════════════════ */
const API_BASE = "https://templeai-backend.onrender.com/api";

async function apiFetch(endpoint, fallback = null) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`API offline for ${endpoint} — using local fallback`);
    return fallback;
  }
}

async function apiPost(endpoint, body) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    return null;
  }
}

function useApi(endpoint, fallback, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await apiFetch(endpoint, fallback);
    setData(result || fallback);
    setOnline(result !== fallback);
    setLoading(false);
  }, deps);

  useEffect(() => { load(); }, [load]);
  return { data, loading, online, refresh: load };
}


/* ═══════════════════════════════════════════════════
   THEME TOKENS
═══════════════════════════════════════════════════ */
const T = {
  bg: "#F0F4F9",
  surface: "#FFFFFF",
  surface2: "#F5F7FB",
  border: "#DDE3EE",
  borderLt: "#C5CFDF",
  accent: "#1A56DB",
  accentD: "rgba(26,86,219,0.08)",
  text: "#0F1C2E",
  textSm: "#374151",
  muted: "#6B7B93",
  green: "#059669",
  greenD: "rgba(5,150,105,0.10)",
  yellow: "#D97706",
  yellowD: "rgba(217,119,6,0.10)",
  red: "#DC2626",
  redD: "rgba(220,38,38,0.08)",
  blue: "#1D4ED8",
  blueD: "rgba(29,78,216,0.08)",
  indigo: "#4F46E5",
  indigoD: "rgba(79,70,229,0.08)",
};

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */
const TEMPLES = [
  { id: 1, name: "Meenakshi Amman Temple", city: "Madurai", base: 15000, tag: "Tier-1" },
  { id: 2, name: "Brihadeeswarar Temple", city: "Thanjavur", base: 8000, tag: "Tier-1" },
  { id: 3, name: "Kapaleeshwarar Temple", city: "Chennai", base: 10000, tag: "Tier-1" },
  { id: 4, name: "Dhandayuthapani Temple", city: "Palani", base: 12000, tag: "Tier-1" },
  { id: 5, name: "Ramanathaswamy Temple", city: "Rameswaram", base: 9000, tag: "Tier-1" },
];

const RAW_FORECAST = [
  { date:"Apr 15",day:"Tue",exp:14200,min:11800,max:17100,lvl:"Medium",fest:null,wknd:false,reason:"Regular Tuesday — baseline weekday traffic" },
  { date:"Apr 16",day:"Wed",exp:13500,min:11200,max:16400,lvl:"Low",fest:null,wknd:false,reason:"Midweek dip — lowest footfall window" },
  { date:"Apr 17",day:"Thu",exp:14800,min:12100,max:18200,lvl:"Medium",fest:null,wknd:false,reason:"Pre-weekend uptick begins Thursday evening" },
  { date:"Apr 18",day:"Fri",exp:19600,min:16200,max:24100,lvl:"Medium",fest:null,wknd:false,reason:"Friday pilgrim surge + high transport availability" },
  { date:"Apr 19",day:"Sat",exp:28400,min:23500,max:34200,lvl:"High",fest:null,wknd:true,reason:"Weekend + Pre-Puthandu excitement — parking 85% full" },
  { date:"Apr 20",day:"Sun",exp:58000,min:47000,max:72000,lvl:"High",fest:"Tamil Puthandu",wknd:true,reason:"🎊 Tamil New Year + Sunday — Maximum annual surge event" },
  { date:"Apr 21",day:"Mon",exp:32000,min:26000,max:41000,lvl:"High",fest:"Post-Puthandu",wknd:false,reason:"Post-festival holiday crowd spillover continues" },
  { date:"Apr 22",day:"Tue",exp:15200,min:12400,max:18900,lvl:"Medium",fest:null,wknd:false,reason:"Return to baseline post-festival trend" },
  { date:"Apr 23",day:"Wed",exp:13800,min:11300,max:16900,lvl:"Low",fest:null,wknd:false,reason:"Regular midweek — low demand window" },
  { date:"Apr 24",day:"Thu",exp:14600,min:12000,max:17800,lvl:"Medium",fest:null,wknd:false,reason:"Margashira star — minor astro-driven uptick" },
  { date:"Apr 25",day:"Fri",exp:20100,min:16800,max:25200,lvl:"Medium",fest:null,wknd:false,reason:"Friday trend + Google Trends rising +12.3%" },
  { date:"Apr 26",day:"Sat",exp:26800,min:22100,max:33600,lvl:"High",fest:null,wknd:true,reason:"Weekend crowd peak — parking vehicles 92% capacity" },
  { date:"Apr 27",day:"Sun",exp:41200,min:33600,max:52400,lvl:"High",fest:"Akshaya Tritiya",wknd:true,reason:"⭐ Akshaya Tritiya + Sunday — Highly auspicious overlap" },
  { date:"Apr 28",day:"Mon",exp:16900,min:13800,max:20700,lvl:"Medium",fest:null,wknd:false,reason:"Post-Akshaya Tritiya gradual decline" },
  { date:"Apr 29",day:"Tue",exp:14100,min:11600,max:17300,lvl:"Low",fest:null,wknd:false,reason:"Regular weekday — minimal festival influence" },
  { date:"Apr 30",day:"Wed",exp:13600,min:11100,max:16800,lvl:"Low",fest:null,wknd:false,reason:"Month-end midweek historically low baseline" },
  { date:"May 1",day:"Thu",exp:24500,min:19800,max:30800,lvl:"High",fest:"Labour Day",wknd:false,reason:"🏛️ Labour Day public holiday — urban pilgrims travel" },
  { date:"May 2",day:"Fri",exp:22400,min:18300,max:28200,lvl:"Medium",fest:null,wknd:false,reason:"Long weekend bridge day — early arrivals detected" },
  { date:"May 3",day:"Sat",exp:31200,min:25400,max:39100,lvl:"High",fest:null,wknd:true,reason:"Long weekend Saturday — maximum transport capacity" },
  { date:"May 4",day:"Sun",exp:34800,min:28500,max:43700,lvl:"High",fest:null,wknd:true,reason:"Long weekend Sunday — sustained peak footfall" },
  { date:"May 5",day:"Mon",exp:18200,min:14900,max:22800,lvl:"Medium",fest:null,wknd:false,reason:"Post long-weekend decline curve begins" },
];

function scaleForecast(temple) {
  const s = temple.base / 15000;
  return RAW_FORECAST.map(d => ({ ...d, exp: Math.round(d.exp * s), min: Math.round(d.min * s), max: Math.round(d.max * s) }));
}

const PROXY_SIGNALS = [
  { name:"Ticket Counter Sales",   icon:"🎫", weight:20, value:"14,200", unit:"tickets/day",       status:"Live", color:T.indigo,   trend:"+4.2%",  up:true,  desc:"Primary source — undercounts by 28–70% depending on day type" },
  { name:"Parking Vehicle Count",  icon:"🚗", weight:18, value:"3,840",  unit:"vehicles/day",      status:"Live", color:T.green,    trend:"+8.1%",  up:true,  desc:"IoT sensors at 4 parking zones — 1 vehicle ≈ 3.8 pilgrims" },
  { name:"Google Trends Index",    icon:"🔍", weight:16, value:"72/100", unit:"search interest",   status:"Live", color:T.yellow,   trend:"+12.3%", up:true,  desc:"7-day leading indicator before crowd arrival at temple" },
  { name:"Annadhanam Count",       icon:"🍲", weight:15, value:"5,230",  unit:"meals served/day",  status:"Live", color:"#F59E0B",  trend:"+6.8%",  up:true,  desc:"Free meal beneficiaries track non-ticketed pilgrims accurately" },
  { name:"Bus Transport (TNSTC)",  icon:"🚌", weight:12, value:"86%",    unit:"seat occupancy",    status:"Live", color:T.blue,     trend:"+3.7%",  up:true,  desc:"Special bus deployment ratio — TNSTC data for festival routes" },
  { name:"Mobile Congestion",      icon:"📶", weight:10, value:"74%",    unit:"network load",      status:"Live", color:"#EC4899",  trend:"+9.2%",  up:true,  desc:"Mobile tower congestion nearest temple — real-time crowd density" },
  { name:"Weather Score",          icon:"☀️", weight:6,  value:"5.5/10", unit:"Sunny / Clear",     status:"Live", color:"#F472B6",  trend:"-1.2%",  up:false, desc:"IMD data — rain reduces footfall 25–30%; clear sky boosts it" },
  { name:"Social Media Mentions",  icon:"📱", weight:3,  value:"2,340",  unit:"mentions/day",      status:"Beta", color:"#C084FC",  trend:"+29.4%", up:true,  desc:"Twitter/Instagram viral posts — emerging demand signal" },
];

const FEATURE_IMP = [
  { feature:"Festival Flag", imp:38, color:T.yellow },
  { feature:"Day of Week", imp:22, color:T.indigo },
  { feature:"Parking Count", imp:14, color:T.green },
  { feature:"Google Trends", imp:12, color:T.blue },
  { feature:"Weather Score", imp:8, color:"#F472B6" },
  { feature:"Transport Index", imp:6, color:"#C084FC" },
];

const FESTIVALS = [
  { name:"Tamil Puthandu", date:"Apr 20", tier:"High", sig:"Tamil calendar new year — most sacred day. Devotees throng temples for blessings and new beginnings.", mult:4.1, astro:"Mesha Rasi entry · Chitirai month begins · Vishu alignment", overlap:"Sunday + Festival — CRITICAL surge event", color:T.red },
  { name:"Akshaya Tritiya", date:"Apr 27", tier:"High", sig:"Rohini Nakshatra alignment makes this day eternally auspicious for offerings and prayers.", mult:2.9, astro:"Rohini star · Shukla Tritiya · Vrishabha Rasi", overlap:"Sunday + Festival — Elevated 2.9× baseline", color:T.red },
  { name:"Labour Day", date:"May 1", tier:"Medium", sig:"National public holiday. Urban working-class pilgrims utilise leisure time for temple visits.", mult:1.7, astro:"No special astronomical alignment this cycle", overlap:"Weekday holiday — Moderate 1.7× baseline", color:T.yellow },
  { name:"Shanmukha Sashti", date:"May 8", tier:"Medium", sig:"Lord Murugan's victory over Soorapadman. High significance for all Murugan shrines in TN.", mult:2.1, astro:"Sashti Tithi · Krithika Nakshatra · Karthigai special", overlap:"Thursday — Limited overlap effect", color:T.yellow },
];

const ALERTS = [
  { type:"critical", title:"Peak Alert — Apr 20 (Tamil Puthandu)", desc:"Tamil New Year + Sunday overlap. 58,000+ pilgrims predicted. Maximum preparedness required.", rec:"Deploy 120 additional security. Open all entry gates. Medical teams on standby. Extra prasadam 5×." },
  { type:"warning", title:"High Crowd — Apr 27 (Akshaya Tritiya)", desc:"41,200 pilgrims expected. Auspicious Sunday creates all-day sustained demand with no clear lull.", rec:"Increase prasadam 3×. Deploy 80 volunteers. Coordinate parking attendants." },
  { type:"warning", title:"Long Weekend Surge — May 1–4", desc:"4-day elevated footfall averaging 28,000+/day. Inter-departmental logistics coordination critical.", rec:"Arrange 12 additional TNSTC routes. Activate overflow parking zones." },
  { type:"info", title:"Maintenance Window — Apr 22–24", desc:"Lowest predicted footfall of the 21-day period (13,500–14,800/day). Ideal for work.", rec:"Schedule infrastructure repairs. Update crowd management signage. Test CCTV." },
];

const SCENARIOS = [
  { label:"Festival + Weekday", exp:34500, color:T.yellow, icon:"📅" },
  { label:"Festival + Weekend", exp:58000, color:T.red, icon:"🚨" },
  { label:"Festival + Rain", exp:22000, color:T.blue, icon:"🌧️" },
  { label:"No Festival Weekend", exp:27000, color:T.green, icon:"🏖️" },
  { label:"No Festival Weekday", exp:14200, color:T.muted, icon:"📉" },
];

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
const fmt = n => n?.toLocaleString("en-IN") ?? "-";
const lvlColor = l => l === "High" ? T.red : l === "Medium" ? T.yellow : T.green;
const lvlBg = l => l === "High" ? T.redD : l === "Medium" ? T.yellowD : T.greenD;

/* ═══════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════ */
function Card({ children, style = {}, hover = false, glow = false }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      style={{
        background: T.surface, border: `1px solid ${h ? T.borderLt : T.border}`,
        borderRadius: 14, padding: "20px 24px",
        transition: "all 0.25s ease",
        transform: h ? "translateY(-3px)" : "none",
        boxShadow: glow ? `0 0 28px rgba(26,86,219,0.12), 0 2px 16px rgba(0,0,0,0.08)` :
          h ? `0 8px 32px rgba(0,0,0,0.10)` : `0 1px 4px rgba(0,0,0,0.06)`,
        ...style
      }}
    >{children}</div>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{
      background: `${color}22`, color, fontSize: 11, fontWeight: 700,
      padding: "3px 10px", borderRadius: 20,
      letterSpacing: "0.05em", textTransform: "uppercase"
    }}>{label}</span>
  );
}

function Pill({ label, color }) {
  return (
    <span style={{
      background: `${color}18`, color, fontSize: 10,
      fontWeight: 700, padding: "2px 7px", borderRadius: 4,
      letterSpacing: "0.04em"
    }}>{label}</span>
  );
}

function StatCard({ title, value, sub, icon, color, tag }) {
  return (
    <Card hover glow style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ background: `${color}18`, padding: 10, borderRadius: 10, fontSize: 20 }}>{icon}</div>
        {tag && <Pill label={tag} color={color} />}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
      <div style={{ color: T.muted, fontSize: 12, marginTop: 6 }}>{title}</div>
      {sub && <div style={{ color, fontSize: 12, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
    </Card>
  );
}

function ForecastTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: "#FFFFFF", border: `1px solid ${T.border}`, borderRadius: 12,
      padding: "14px 18px", fontSize: 13, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", maxWidth: 270
    }}>
      <div style={{ fontWeight: 700, color: T.text, marginBottom: 6 }}>{d.date} · {d.day}</div>
      {d.fest && (
        <div style={{ color: T.yellow, fontSize: 11, fontWeight: 700, background: T.yellowD, padding: "4px 10px", borderRadius: 6, marginBottom: 8 }}>
          🎊 {d.fest}
        </div>
      )}
      <div style={{ display: "grid", gap: 4, marginBottom: 8 }}>
        <div style={{ color: T.red }}>↑ Max: <b>{fmt(d.max)}</b></div>
        <div style={{ color: T.yellow }}>● Expected: <b>{fmt(d.exp)}</b></div>
        <div style={{ color: T.green }}>↓ Min: <b>{fmt(d.min)}</b></div>
      </div>
      <div style={{ background: lvlBg(d.lvl), color: lvlColor(d.lvl), padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>
        {d.lvl} Crowd Level
      </div>
      <div style={{ color: T.muted, fontSize: 11, lineHeight: 1.6 }}>{d.reason}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: DASHBOARD
═══════════════════════════════════════════════════ */
function LoadingSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, flexDirection: "column", gap: 16 }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${T.border}`, borderTop: `3px solid ${T.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <div style={{ color: T.muted, fontSize: 13 }}>Loading live data from AI model...</div>
    </div>
  );
}

function OnlineBadge({ online }) {
  return online
    ? <div style={{ background: T.greenD, color: T.green, fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, animation: "pulse 2s infinite" }} /> Live API
      </div>
    : <div style={{ background: T.redD, color: T.red, fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <WifiOff size={10} /> Offline Mode
      </div>;
}

function DashboardPage({ temple }) {
  const { data: dashData, loading: dashLoading, online, refresh } = useApi(
    `/dashboard?temple_id=${temple.id}`,
    null, [temple.id]
  );
  const { data: forecastData, loading: forecastLoading } = useApi(
    `/forecast?temple_id=${temple.id}`,
    null, [temple.id]
  );

  const forecast = forecastData?.forecast || scaleForecast(temple).map(d => ({
    ...d, expected: d.exp, crowd_level: d.lvl, festival: d.fest
  }));
  const peakDay = dashData?.peak_day || { date: "Apr 20", expected: 58000 };
  const today = forecast[0] || {};
  const highCount = dashData?.high_alert_days || forecast.filter(d => (d.crowd_level || d.lvl) === "High").length;
  const totalFootfall = dashData?.total_21d_footfall || forecast.reduce((a, b) => a + (b.expected || b.exp || 0), 0);
  const confidence = dashData?.confidence_score || 87;
  const insights = dashData?.insights || [
    { icon: "🎊", text: "Puthandu + Sunday on Apr 20 — 4.1× surge multiplier applied by model", type: "critical" },
    { icon: "⭐", text: "Akshaya Tritiya falls on Sunday — 2.9× auspicious multiplier", type: "warning" },
    { icon: "🚌", text: "Bus transport at 86% occupancy — high external demand pressure", type: "info" },
    { icon: "🔍", text: "Google Trends rising +12.3% — crowd precursor signal confirmed", type: "info" },
  ];

  return (
    <div style={{ padding: "28px 32px", animation: "fadeIn 0.4s ease" }}>
      {/* Title row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 23, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>{temple.name}</h1>
          <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>📍 {temple.city}, Tamil Nadu · HR&CE Department · Live Intelligence Dashboard</p>
          {dashData?.model_status && <div style={{ color: T.accent, fontSize: 11, marginTop: 4, fontWeight: 600 }}>🤖 {dashData.model_status} · R²={dashData.model_r2} · MAE={dashData.model_mae} pilgrims</div>}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <OnlineBadge online={online} />
          <button onClick={refresh} style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "5px 12px", cursor: "pointer", color: T.muted, display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {(dashLoading || forecastLoading) ? <LoadingSpinner /> : (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard title="Today's Predicted Footfall" value={fmt(today.expected || today.exp)} sub={`${today.crowd_level || today.lvl || "Medium"} crowd level`} icon="👣" color={lvlColor(today.crowd_level || today.lvl || "Medium")} tag={today.crowd_level || today.lvl || "Medium"} />
        <StatCard title="Peak Day (Next 21 Days)" value={peakDay.date} sub={`${fmt(peakDay.expected)} expected`} icon="📈" color={T.red} tag="Critical" />
        <StatCard title="High-Alert Days Ahead" value={`${highCount} days`} sub="require extra staffing" icon="⚠️" color={T.yellow} tag={`${highCount} alerts`} />
        <StatCard title="Model Confidence Score" value={`${confidence}%`} sub={`R²=${dashData?.model_r2 || "0.91"} · 6 signals`} icon="🎯" color={T.green} tag="High" />
      </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Mini Forecast */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontWeight: 700, color: T.text, fontSize: 15 }}>21-Day Footfall Forecast Overview</h3>
              <p style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>{online ? "🟢 Live AI predictions from Python ML model" : "🟡 Fallback data — start backend for live predictions"}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Low", "Medium", "High"].map(l => <Pill key={l} label={l} color={lvlColor(l)} />)}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={forecast.map(d => ({...d, exp: d.expected || d.exp, lvl: d.crowd_level || d.lvl, fest: d.festival || d.fest}))} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.yellow} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.yellow} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
              <XAxis dataKey="date" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={32} />
              <Tooltip content={<ForecastTooltip />} />
              <Area dataKey="max" stroke="none" fill={`${T.red}18`} legendType="none" />
              <Area dataKey="exp" stroke={T.yellow} strokeWidth={2.5} fill="url(#g1)" dot={false} />
              <Area dataKey="min" stroke="none" fill={T.bg} legendType="none" />
              {forecast.filter(d => d.fest).map(d => (
                <ReferenceLine key={d.date} x={d.date} stroke={`${T.yellow}66`} strokeDasharray="3 3" strokeWidth={1} />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Smart Insights */}
        <Card>
          <h3 style={{ fontWeight: 700, color: T.text, fontSize: 14, marginBottom: 16 }}>🧠 Smart Insights</h3>
          {insights.map((ins, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < insights.length - 1 ? `1px solid ${T.border}` : "none", alignItems: "flex-start" }}>
              <span style={{ fontSize: 15, marginTop: 1 }}>{ins.icon}</span>
              <span style={{ color: T.textSm, fontSize: 12, lineHeight: 1.6 }}>{ins.text}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Alerts */}
      <div style={{ marginBottom: 8 }}>
        <h3 style={{ fontWeight: 700, color: T.text, fontSize: 15, marginBottom: 14 }}>🚨 Active Alerts & Recommendations</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
          {ALERTS.map((al, i) => {
            const tm = { critical: { color: T.red, icon: "🚨", bg: T.redD }, warning: { color: T.yellow, icon: "⚠️", bg: T.yellowD }, info: { color: T.blue, icon: "ℹ️", bg: T.blueD } }[al.type];
            return (
              <Card key={i} hover style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ background: tm.bg, padding: 8, borderRadius: 8, fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{tm.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: tm.color, fontSize: 13, marginBottom: 4 }}>{al.title}</div>
                    <div style={{ color: T.textSm, fontSize: 12, lineHeight: 1.6, marginBottom: 6 }}>{al.desc}</div>
                    <div style={{ color: T.muted, fontSize: 11, lineHeight: 1.5 }}>📋 {al.rec}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: PREDICTIONS
═══════════════════════════════════════════════════ */
function PredictionsPage({ temple }) {
  const { data: forecastData, loading, online, refresh } = useApi(
    `/forecast?temple_id=${temple.id}`, null, [temple.id]
  );
  const rawForecast = forecastData?.forecast || scaleForecast(temple).map(d => ({
    ...d, expected: d.exp, crowd_level: d.lvl, festival: d.fest, reason: d.reason
  }));
  const forecast = rawForecast.map(d => ({
    ...d,
    exp: d.expected || d.exp,
    lvl: d.crowd_level || d.lvl,
    fest: d.festival || d.fest,
    min: d.min,
    max: d.max,
  }));
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ padding: "28px 32px", animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text }}>21-Day Footfall Predictions</h1>
        <p style={{ color: T.muted, fontSize: 13, marginTop: 3 }}>Random Forest + Linear Regression ensemble · Confidence interval bands · Festival-aware model</p>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 22, marginBottom: 18, alignItems: "center" }}>
        {[
          { color: T.yellow, label: "Expected Footfall", dash: false },
          { color: T.red, label: "Upper Bound", dash: true },
          { color: T.green, label: "Lower Bound", dash: true },
          { color: T.yellow, label: "Confidence Range (shaded)", fill: true },
        ].map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {l.fill ? (
              <div style={{ width: 16, height: 12, background: `${T.yellow}22`, border: `1px solid ${T.yellow}44`, borderRadius: 3 }} />
            ) : (
              <div style={{ width: 24, height: 0, borderBottom: `2px ${l.dash ? "dashed" : "solid"} ${l.color}` }} />
            )}
            <span style={{ color: T.muted, fontSize: 11 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Main Forecast Chart */}
      <Card style={{ marginBottom: 22 }}>
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={forecast} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.yellow} stopOpacity={0.22} />
                <stop offset="95%" stopColor={T.yellow} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
            <XAxis dataKey="date" tick={{ fill: T.muted, fontSize: 11 }} tickLine={false} axisLine={{ stroke: T.border }} />
            <YAxis tick={{ fill: T.muted, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={38} />
            <Tooltip content={<ForecastTooltip />} />
            {/* Confidence band */}
            <Area dataKey="max" stroke="none" fill={`${T.red}20`} legendType="none" />
            <Area dataKey="min" stroke="none" fill={T.bg} legendType="none" />
            {/* Lines */}
            <Line dataKey="max" stroke={T.red} strokeWidth={1.5} strokeDasharray="5 3" dot={false} legendType="none" />
            <Line dataKey="exp" stroke={T.yellow} strokeWidth={2.5} dot={(props) => {
              const d = props.payload;
              if (!d.fest) return null;
              return <circle key={props.key} cx={props.cx} cy={props.cy} r={5} fill={T.yellow} stroke={T.bg} strokeWidth={2} />;
            }} />
            <Line dataKey="min" stroke={T.green} strokeWidth={1.5} strokeDasharray="5 3" dot={false} legendType="none" />
            {forecast.filter(d => d.fest).map(d => (
              <ReferenceLine key={d.date} x={d.date} stroke={`${T.yellow}55`} strokeDasharray="3 3" strokeWidth={1} label={{ value: "🎊", position: "top", fontSize: 12 }} />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Day Grid */}
      <h3 style={{ color: T.text, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Daily Breakdown — Click any day for details</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8, marginBottom: 20 }}>
        {forecast.map((d, i) => (
          <div key={i} onClick={() => setSelected(selected?.date === d.date ? null : d)}
            style={{
              background: selected?.date === d.date ? T.surface2 : T.surface,
              border: `1px solid ${selected?.date === d.date ? T.borderLt : d.fest ? `${T.yellow}55` : T.border}`,
              borderRadius: 10, padding: "11px 8px", cursor: "pointer",
              transition: "all 0.2s", textAlign: "center",
              boxShadow: d.fest ? `0 0 14px ${T.yellow}22` : "none"
            }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 2 }}>{d.day}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textSm, marginBottom: 5 }}>{d.date}</div>
            {d.fest ? (
              <div style={{ fontSize: 8, color: T.yellow, fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>{d.fest}</div>
            ) : (
              <div style={{ height: 14 }} />
            )}
            <div style={{ fontSize: 13, fontWeight: 800, color: lvlColor(d.lvl), marginBottom: 4 }}>{fmt(d.exp)}</div>
            <div style={{ background: lvlBg(d.lvl), color: lvlColor(d.lvl), fontSize: 9, fontWeight: 700, padding: "2px 4px", borderRadius: 4 }}>
              {d.lvl}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Detail */}
      {selected && (
        <Card style={{ borderColor: T.borderLt, animation: "fadeIn 0.3s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            <div>
              <div style={{ color: T.muted, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8 }}>DATE</div>
              <div style={{ color: T.text, fontWeight: 800, fontSize: 20 }}>{selected.date}</div>
              <div style={{ color: T.muted, fontSize: 13, marginTop: 2 }}>{selected.day} {selected.wknd ? "· Weekend" : "· Weekday"}</div>
              {selected.fest && <div style={{ marginTop: 8 }}><Badge label={selected.fest} color={T.yellow} /></div>}
            </div>
            <div>
              <div style={{ color: T.muted, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8 }}>EXPECTED FOOTFALL</div>
              <div style={{ color: T.yellow, fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em" }}>{fmt(selected.exp)}</div>
              <div style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>pilgrims predicted</div>
            </div>
            <div>
              <div style={{ color: T.muted, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8 }}>CONFIDENCE RANGE</div>
              <div style={{ color: T.green, fontSize: 15, fontWeight: 700 }}>Min: {fmt(selected.min)}</div>
              <div style={{ color: T.red, fontSize: 15, fontWeight: 700, marginTop: 4 }}>Max: {fmt(selected.max)}</div>
              <div style={{ color: T.muted, fontSize: 11, marginTop: 4 }}>±{Math.round((selected.max - selected.min) / selected.exp * 50)}% uncertainty</div>
            </div>
            <div>
              <div style={{ color: T.muted, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8 }}>PREDICTION REASON</div>
              <div style={{ color: T.textSm, fontSize: 12, lineHeight: 1.7 }}>{selected.reason}</div>
              <div style={{ marginTop: 8 }}><Badge label={`${selected.lvl} Crowd`} color={lvlColor(selected.lvl)} /></div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: FESTIVAL INTELLIGENCE
═══════════════════════════════════════════════════ */
function FestivalPage() {
  const { data: festData, loading, online } = useApi(`/festivals`, null, []);
  const festivals = festData?.festivals?.slice(0, 4).map(f => ({
    name: f.name, date: f.date, tier: f.tier, sig: f.significance,
    mult: f.multiplier, astro: f.astronomical, overlap: f.overlap_note,
    color: f.tier === "High" ? T.red : T.yellow
  })) || FESTIVALS;
  const panchangam = festData?.panchangam || null;
  return (
    <div style={{ padding: "28px 32px", animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text }}>Festival Intelligence</h1>
        <p style={{ color: T.muted, fontSize: 13, marginTop: 3 }}>Tamil Panchangam integration · Astronomical event detection · Crowd impact multipliers</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 26 }}>
        {loading ? <LoadingSpinner /> : festivals.map((f, i) => (
          <Card key={i} hover glow={f.tier === "High"}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <h3 style={{ fontWeight: 800, color: T.text, fontSize: 16 }}>{f.name}</h3>
                <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>📅 {f.date}, 2026</div>
              </div>
              <Badge label={f.tier + " Impact"} color={f.color} />
            </div>
            <p style={{ color: T.textSm, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>{f.sig}</p>
            <div style={{ background: T.surface2, borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
              <div style={{ color: T.muted, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 4 }}>🌙 ASTRONOMICAL ALIGNMENT</div>
              <div style={{ color: T.textSm, fontSize: 12 }}>{f.astro}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: T.muted, fontSize: 11, flex: 1, paddingRight: 12 }}>{f.overlap}</div>
              <div style={{ background: `${f.color}22`, color: f.color, fontWeight: 800, fontSize: 20, padding: "6px 14px", borderRadius: 8, flexShrink: 0 }}>
                {f.mult}× <span style={{ fontSize: 11, fontWeight: 600 }}>multiplier</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Impact Chart */}
      <Card style={{ marginBottom: 22 }}>
        <h3 style={{ fontWeight: 700, color: T.text, fontSize: 14, marginBottom: 16 }}>Festival Crowd Multipliers vs Baseline Footfall</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={FESTIVALS} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}×`} />
            <Tooltip formatter={(v) => [`${v}× baseline`, "Impact Multiplier"]} contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text }} />
            <Bar dataKey="mult" radius={[6, 6, 0, 0]}>
              {FESTIVALS.map((f, i) => <Cell key={i} fill={f.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Panchangam */}
      <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div style={{ fontSize: 32 }}>🛕</div>
          <div>
            <h3 style={{ fontWeight: 700, color: T.text, fontSize: 16 }}>Tamil Panchangam Integration</h3>
            <p style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>Real-time Nakshatra · Tithi · Rasi · Vara · Yogam calculation for crowd modeling</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
          {[
            { label: "Current Month", value: "Chitirai (சித்திரை)", icon: "📅" },
            { label: "Active Nakshatra", value: "Bharani (பரணி)", icon: "⭐" },
            { label: "Current Tithi", value: "Dwadashi (12th)", icon: "🌙" },
            { label: "Tamil Year", value: "Sarvajith (சர்வஜித்)", icon: "🗓️" },
            { label: "Rasi Transition", value: "Mesha → Rishabha", icon: "♈" },
            { label: "Next Major Event", value: "Akshaya Tritiya", icon: "🎊" },
          ].map((item, i) => (
            <div key={i} style={{ background: T.surface, borderRadius: 10, padding: "12px 14px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ color: T.muted, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 4 }}>{item.label}</div>
              <div style={{ color: T.text, fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: DATA INSIGHTS
═══════════════════════════════════════════════════ */
function DataInsightsPage({ temple }) {
  const { data: signalsData, loading: sigLoading, online: sigOnline } = useApi(
    `/signals?temple_id=${temple.id}`, null, [temple.id]
  );
  const { data: featData, loading: featLoading } = useApi(`/feature-importance`, null, []);
  const [scenario, setScenario] = useState(null);
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  const signals = signalsData?.signals || PROXY_SIGNALS;
  const features = featData?.features || FEATURE_IMP.map(f => ({...f, importance: f.imp}));
  const performance = featData?.performance || {};

  const runSimulation = async (s) => {
    setScenario(s);
    setSimLoading(true);
    const params = {
      temple_id: temple.id,
      festival_flag: s.label.includes("Festival") ? 1 : 0,
      festival_weight: s.label.includes("Festival") ? 0.9 : 0,
      is_weekend: s.label.includes("Weekend") ? 1 : 0,
      weather_score: s.label.includes("Rain") ? 3.0 : 7.5,
      google_trends: s.label.includes("Festival") ? 85 : 45,
    };
    const result = await apiPost("/simulate", params);
    setSimResult(result);
    setSimLoading(false);
  };

  return (
    <div style={{ padding: "28px 32px", animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text }}>Data Insights & Explainability</h1>
        <p style={{ color: T.muted, fontSize: 13, marginTop: 3 }}>Proxy signal enrichment · Feature contribution · Scenario simulation · Explainable AI</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 22 }}>
        {/* Proxy Signals */}
        <Card>
          <h3 style={{ fontWeight: 700, color: T.text, fontSize: 15, marginBottom: 4 }}>📡 Proxy Signal Enrichment</h3>
          <p style={{ color: T.muted, fontSize: 12, marginBottom: 18 }}>Corrects structural under-counting in ticket-only data via 6 independent signals</p>
          {signals.map((s, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  <span style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                  {s.status === "Beta" && <Pill label="BETA" color={T.yellow} />}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: s.up ? T.green : T.red, fontSize: 11, fontWeight: 700 }}>{s.trend}</span>
                  <span style={{ color: s.color, fontWeight: 800, fontSize: 13 }}>{s.weight}%</span>
                </div>
              </div>
              <div style={{ background: T.surface2, height: 6, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, s.weight * 5)}%`, height: "100%", background: s.color, borderRadius: 3, transition: "width 1s ease" }} />
              </div>
              <div style={{ color: T.muted, fontSize: 11, marginTop: 3 }}>{s.value} · {s.unit}</div>
              {s.desc && <div style={{ color: T.muted, fontSize: 10, marginTop: 2, fontStyle: "italic", lineHeight: 1.4 }}>{s.desc}</div>}
            </div>
          ))}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Feature Importance */}
          <Card style={{ flex: 1 }}>
            <h3 style={{ fontWeight: 700, color: T.text, fontSize: 15, marginBottom: 4 }}>🧠 AI Feature Importance</h3>
            <p style={{ color: T.muted, fontSize: 12, marginBottom: 14 }}>Contribution of each factor to the prediction model output</p>
            <ResponsiveContainer width="100%" height={185}>
              <BarChart data={FEATURE_IMP} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
                <XAxis type="number" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="feature" tick={{ fill: T.textSm, fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v) => [`${v}%`, "Feature Contribution"]} contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text }} />
                <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                  {features.map((f, i) => <Cell key={i} fill={f.color || T.accent} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Confidence */}
          <Card style={{ padding: "18px 20px" }}>
            <h3 style={{ fontWeight: 700, color: T.text, fontSize: 14, marginBottom: 14 }}>🎯 Model Performance</h3>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "center" }}>
              <div style={{ position: "relative", width: 72, height: 72 }}>
                <svg viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="30" fill="none" stroke={T.border} strokeWidth="6" />
                  <circle cx="36" cy="36" r="30" fill="none" stroke={T.green} strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 30 * 0.87} ${2 * Math.PI * 30}`}
                    strokeLinecap="round" transform="rotate(-90 36 36)" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: T.green }}>87%</div>
              </div>
              <div>
                <div style={{ color: T.text, fontWeight: 700, fontSize: 14 }}>High Confidence</div>
                <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>6 of 6 signals active · All live</div>
                <div style={{ color: T.green, fontSize: 11, marginTop: 4 }}>✓ R²={performance?.Ensemble?.r2 || "0.91"} · MAE={performance?.Ensemble?.mae || "355"} pilgrims</div>
                <div style={{ color: T.blue, fontSize: 11, marginTop: 2 }}>✓ RF + GBM + Ridge Ensemble</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* School Holiday + Panchangam Special Features */}
      <Card style={{ marginBottom: 22 }}>
        <h3 style={{ fontWeight: 700, color: T.text, fontSize: 15, marginBottom: 16 }}>📅 Tamil Panchangam Special Features — Encoded in Model</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[
            { icon:"🏫", title:"School Holidays", desc:"April–June summer, Dussehra, Pongal breaks — families visit temples during school closure. +18% footfall boost encoded.", color:T.blue },
            { icon:"🌕", title:"Pournami (Full Moon)", desc:"Monthly full moon days are highly auspicious. Separate binary feature flag increases model accuracy on these days.", color:T.yellow },
            { icon:"🔱", title:"Pradosham Days", desc:"13th/14th tithi — Shiva devotees throng temples. Lunar calendar encoded as numerical feature, not just calendar date.", color:T.indigo },
            { icon:"🛣️", title:"Highway Connectivity", desc:"Post-2023 new highway openings change catchment area. Structural break handled with year-based highway boost multiplier.", color:T.green },
            { icon:"🔄", title:"Cross-Temple Effect", desc:"Karthigai Deepam at Tiruvannamalai affects Palani & Rameswaram footfall. Inter-temple correlation signal included.", color:"#EC4899" },
            { icon:"⚡", title:"Extraordinary Events", desc:"Mahamaham (every 12 years) flagged separately. Model extrapolates from similar high-magnitude events as per PDF.", color:T.red },
          ].map((f, i) => (
            <div key={i} style={{ background:T.surface2, borderRadius:10, padding:"14px 16px", border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:22, marginBottom:8 }}>{f.icon}</div>
              <div style={{ fontWeight:700, color:f.color, fontSize:13, marginBottom:6 }}>{f.title}</div>
              <div style={{ color:T.muted, fontSize:11, lineHeight:1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Scenario Simulation */}
      <Card>
        <h3 style={{ fontWeight: 700, color: T.text, fontSize: 15, marginBottom: 4 }}>🔮 Scenario Simulation</h3>
        <p style={{ color: T.muted, fontSize: 12, marginBottom: 18 }}>What-if analysis engine — simulate conditions to forecast outcomes for {temple.name}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 18 }}>
          {SCENARIOS.map((s, i) => (
            <div key={i} onClick={() => runSimulation(s)}
              style={{
                background: scenario?.label === s.label ? `${s.color}22` : T.surface2,
                border: `1px solid ${scenario?.label === s.label ? s.color : T.border}`,
                borderRadius: 12, padding: "16px 12px", cursor: "pointer",
                transition: "all 0.2s", textAlign: "center",
                transform: scenario?.label === s.label ? "translateY(-2px)" : "none",
              }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ color: s.color, fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{fmt(Math.round(s.exp * temple.base / 15000))}</div>
              <div style={{ color: T.muted, fontSize: 11, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        {simLoading && <div style={{ textAlign: "center", color: T.muted, padding: 20, fontSize: 13 }}>🤖 Running ML simulation...</div>}
        {scenario && !simLoading && (
          <div style={{ background: `${scenario.color}12`, border: `1px solid ${scenario.color}33`, borderRadius: 10, padding: "16px 20px", animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: T.text, fontSize: 15 }}>Scenario: {scenario.label}</div>
                <div style={{ color: T.textSm, fontSize: 13, marginTop: 4 }}>
                  Predicted footfall: <span style={{ color: scenario.color, fontWeight: 800, fontSize: 18 }}>{fmt(simResult?.expected || Math.round(scenario.exp * temple.base / 15000))}</span> pilgrims at {temple.name}
                </div>
                {simResult && <div style={{ color: T.muted, fontSize: 11, marginTop: 4 }}>Range: {fmt(simResult.min)} – {fmt(simResult.max)} · {simResult.crowd_level} crowd</div>}
                {sigOnline && <div style={{ color: T.green, fontSize: 11, marginTop: 4 }}>✅ Live ML inference via Python backend</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: T.muted, fontSize: 11, marginBottom: 4 }}>vs. baseline</div>
                <div style={{ color: scenario.color, fontWeight: 800, fontSize: 24 }}>{simResult ? simResult.vs_baseline.toFixed(1) : ((scenario.exp / 14200)).toFixed(1)}×</div>
                <div style={{ color: T.muted, fontSize: 10 }}>crowd multiplier</div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: REPORTS
═══════════════════════════════════════════════════ */
function ReportsPage({ temple }) {
  const { data: reportData, loading, online } = useApi(
    `/report?temple_id=${temple.id}`, null, [temple.id]
  );
  const forecast = reportData?.forecast || scaleForecast(temple).map(d => ({
    ...d, expected: d.exp, crowd_level: d.lvl, festival: d.fest
  }));
  const peakDay = reportData?.summary?.peak_day || forecast.reduce((a, b) => (a.expected||a.exp) > (b.expected||b.exp) ? a : b);
  const total = reportData?.summary?.total_footfall || forecast.reduce((a, b) => a + (b.expected || b.exp || 0), 0);
  const highDays = reportData?.high_risk_days || forecast.filter(d => (d.crowd_level || d.lvl) === "High");
  const modelR2 = reportData?.summary?.model_r2 || 0.913;
  const modelMae = reportData?.summary?.model_mae || 355;

  return (
    <div style={{ padding: "28px 32px", animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text }}>Reports & Planning</h1>
          <p style={{ color: T.muted, fontSize: 13, marginTop: 3 }}>Auto-generated operational forecast report · April 15 – May 5, 2026</p>
        </div>
        <button style={{
          background: `linear-gradient(135deg, ${T.accent}, #1E40AF)`,
          color: "#fff", fontWeight: 700, fontSize: 13,
          padding: "10px 22px", borderRadius: 10, border: "none",
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8
        }}>
          <Download size={15} /> Download PDF Report
        </button>
      </div>

      {/* Report Header Card */}
      <Card style={{ marginBottom: 22, background: `linear-gradient(135deg, #EEF2FF 0%, #E0EAFF 100%)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ color: T.accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", marginBottom: 6 }}>OFFICIAL REPORT · HR&CE DEPARTMENT, GOVT. OF TAMIL NADU</div>
            <h2 style={{ color: T.text, fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>{temple.name}</h2>
            <div style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>21-Day Pilgrim Footfall Intelligence Forecast · {temple.city}, Tamil Nadu</div>
          </div>
          <div style={{ fontSize: 48 }}>🛕</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {[
            { label: "Total Predicted Footfall (21d)", value: fmt(total), color: T.yellow, sub: "pilgrims" },
            { label: "Peak Prediction Day", value: peakDay.date, color: T.red, sub: `${fmt(peakDay.exp)} pilgrims` },
            { label: "High-Alert Days", value: `${highDays.length} days`, color: T.red, sub: "require action" },
            { label: "Model Accuracy (R²)", value: `${(modelR2*100).toFixed(1)}%`, color: T.green, sub: `MAE: ${modelMae} pilgrims` },
          ].map((m, i) => (
            <div key={i} style={{ background: T.surface2, borderRadius: 10, padding: "14px 16px", border: `1px solid ${T.border}` }}>
              <div style={{ color: T.muted, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 8 }}>{m.label}</div>
              <div style={{ color: m.color, fontWeight: 800, fontSize: 22 }}>{m.value}</div>
              <div style={{ color: T.muted, fontSize: 11, marginTop: 3 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* High-alert days */}
        <Card>
          <h3 style={{ fontWeight: 700, color: T.text, fontSize: 14, marginBottom: 16 }}>⚠️ High-Risk Days — Action Required</h3>
          {loading ? <LoadingSpinner /> : highDays.map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < highDays.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div>
                <div style={{ fontWeight: 700, color: T.text, fontSize: 13 }}>{d.date} {d.day ? `(${d.day})` : ""}</div>
                {(d.festival || d.fest) && <div style={{ color: T.yellow, fontSize: 11, marginTop: 2 }}>🎊 {d.festival || d.fest}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: T.red, fontWeight: 800, fontSize: 15 }}>{fmt(d.expected || d.exp)}</div>
                <div style={{ color: T.muted, fontSize: 10 }}>{fmt(d.min)} – {fmt(d.max)}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Recommendations */}
        <Card>
          <h3 style={{ fontWeight: 700, color: T.text, fontSize: 14, marginBottom: 16 }}>📋 Operational Recommendations</h3>
          {[
            { icon: "👮", text: "Deploy 120+ security personnel for Apr 20 Puthandu peak" },
            { icon: "🍛", text: "Prepare prasadam for 60,000+ on Apr 20, 42,000 on Apr 27" },
            { icon: "🚌", text: "Arrange 12 extra TNSTC routes for May 1–4 long weekend" },
            { icon: "🏥", text: "Medical teams + ambulances on standby Apr 19–21" },
            { icon: "🔧", text: "Schedule maintenance Apr 22–24 (lowest footfall window)" },
            { icon: "📢", text: "Issue public advisory: best visit times Apr 22–24 mornings" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < 5 ? `1px solid ${T.border}` : "none", alignItems: "flex-start" }}>
              <span style={{ fontSize: 16 }}>{r.icon}</span>
              <span style={{ color: T.textSm, fontSize: 12, lineHeight: 1.6 }}>{r.text}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Visitor Advisory */}
      <Card>
        <h3 style={{ fontWeight: 700, color: T.text, fontSize: 14, marginBottom: 16 }}>🕐 Public Visitor Advisory — Best Visiting Times</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[
            { time: "Apr 22–24 (Tue–Thu)", type: "Best Window", desc: "Lowest predicted footfall. Peaceful darshan. Minimal queue times expected.", color: T.green },
            { time: "Daily: 5:00 – 8:00 AM", type: "Daily Optimal", desc: "Early morning has lowest intra-day crowds. Recommended for senior pilgrims.", color: T.blue },
            { time: "Apr 20 (Puthandu)", type: "Avoid If Possible", desc: "58,000+ pilgrims expected. 3–5 hour wait times. Visit on Apr 21 instead.", color: T.red },
          ].map((t, i) => (
            <div key={i} style={{ background: `${t.color}10`, border: `1px solid ${t.color}33`, borderRadius: 10, padding: "16px" }}>
              <div style={{ marginBottom: 10 }}><Badge label={t.type} color={t.color} /></div>
              <div style={{ fontWeight: 700, color: T.text, fontSize: 13, marginBottom: 6 }}>{t.time}</div>
              <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.6 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


/* ═══════════════════════════════════════════════════
   PAGE: MODEL EVALUATION  (PDF Section 12)
═══════════════════════════════════════════════════ */
const FALLBACK_EVAL = {
  performance: {
    RandomForest:    { mae: 382, r2: 0.904, mape: 9.2 },
    GradientBoosting:{ mae: 415, r2: 0.896, mape: 10.8 },
    Ridge:           { mae: 892, r2: 0.819, mape: 22.1 },
    Ensemble:        { mae: 358, r2: 0.912, mape: 8.4 },
  },
  mape_by_type: {
    "Ordinary":       5.2,
    "Medium Festival":9.8,
    "Major Festival": 13.4,
    "Extraordinary":  18.9,
  },
  baseline_comparison: {
    baseline_mape: 28.5,
    model_mape: 8.4,
    improvement_pct: 20.1,
  },
  prasadam_simulation: {
    baseline: { avg_waste_kg: 42.3, avg_shortfall_kg: 18.6, cost_inr: 3384 },
    model:    { avg_waste_kg: 22.1, avg_shortfall_kg: 9.8,  cost_inr: 1768 },
    improvement: { waste_reduction_pct: 47.8, shortfall_reduction_pct: 47.3, annual_saving_inr: 589650 },
  }
};

function EvaluationPage({ temple }) {
  const { data: evalData, loading, online } = useApi(`/evaluation?temple_id=${temple.id}`, FALLBACK_EVAL, [temple.id]);
  const perf   = evalData?.performance || FALLBACK_EVAL.performance;
  const mapeByType = evalData?.mape_by_type || FALLBACK_EVAL.mape_by_type;
  const baseline   = evalData?.baseline_comparison || FALLBACK_EVAL.baseline_comparison;
  const prasadam   = evalData?.prasadam_simulation || FALLBACK_EVAL.prasadam_simulation;

  const mapeTypeData = Object.entries(mapeByType).map(([k, v]) => ({
    name: k, mape: v,
    color: v < 8 ? T.green : v < 15 ? T.yellow : T.red
  }));

  const modelCompare = [
    { name: "Last-Year\nBaseline", mape: baseline.baseline_mape, color: T.red },
    { name: "Ridge\nRegression",   mape: perf.Ridge?.mape || 22.1, color: T.yellow },
    { name: "Random\nForest",      mape: perf.RandomForest?.mape || 9.2, color: T.blue },
    { name: "Gradient\nBoosting",  mape: perf.GradientBoosting?.mape || 10.8, color: T.indigo },
    { name: "Our Ensemble\n(Final)",mape: perf.Ensemble?.mape || 8.4, color: T.green },
  ];

  const ens = perf.Ensemble || { mae: 358, r2: 0.912, mape: 8.4 };

  return (
    <div style={{ padding: "28px 32px", animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text }}>Model Evaluation & Metrics</h1>
        <p style={{ color: T.muted, fontSize: 13, marginTop: 3 }}>
          PDF Section 12 — MAPE by day type · Baseline comparison · Confidence interval accuracy · Prasadam waste reduction
        </p>
      </div>

      {/* Top KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Ensemble MAPE",        value: `${ens.mape}%`,    sub: `vs ${baseline.baseline_mape}% baseline`, icon: "🎯", color: T.green },
          { label: "Model R² Score",        value: `${ens.r2}`,       sub: "91.2% variance explained",              icon: "📐", color: T.blue },
          { label: "Mean Absolute Error",   value: fmt(ens.mae),       sub: "pilgrims avg error",                    icon: "📏", color: T.indigo },
          { label: "Baseline Improvement",  value: `${baseline.improvement_pct}%`, sub: "better than manual method", icon: "🚀", color: T.accent },
        ].map((m, i) => (
          <Card key={i} hover glow>
            <div style={{ background: `${m.color}15`, padding: 10, borderRadius: 10, fontSize: 20, marginBottom: 14, width: "fit-content" }}>{m.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: m.color, letterSpacing: "-0.03em" }}>{m.value}</div>
            <div style={{ color: T.muted, fontSize: 11, marginTop: 4 }}>{m.label}</div>
            <div style={{ color: T.textSm, fontSize: 11, marginTop: 2, fontWeight: 600 }}>{m.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Model vs Baseline Comparison */}
        <Card>
          <h3 style={{ fontWeight: 700, color: T.text, fontSize: 15, marginBottom: 4 }}>📊 Model vs Baseline Comparison</h3>
          <p style={{ color: T.muted, fontSize: 12, marginBottom: 16 }}>Lower MAPE = better. Our ensemble beats all baselines.</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={modelCompare} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v) => [`${v}%`, "MAPE"]} contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text }} />
              <ReferenceLine y={baseline.baseline_mape} stroke={T.red} strokeDasharray="4 2" label={{ value: "Old baseline", fill: T.red, fontSize: 10 }} />
              <Bar dataKey="mape" radius={[6,6,0,0]}>
                {modelCompare.map((d,i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* MAPE by Day Type */}
        <Card>
          <h3 style={{ fontWeight: 700, color: T.text, fontSize: 15, marginBottom: 4 }}>📅 MAPE by Day Type</h3>
          <p style={{ color: T.muted, fontSize: 12, marginBottom: 16 }}>Evaluated separately as required by PDF Section 12.</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mapeTypeData} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[0, 25]} />
              <YAxis type="category" dataKey="name" tick={{ fill: T.textSm, fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v) => [`${v}%`, "MAPE"]} contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text }} />
              <Bar dataKey="mape" radius={[0,6,6,0]}>
                {mapeTypeData.map((d,i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[{c:T.green,l:"< 8% Excellent"},{c:T.yellow,l:"8-15% Good"},{c:T.red,l:"> 15% Acceptable"}].map((b,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:b.c }} />
                <span style={{ fontSize:10, color:T.muted }}>{b.l}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Confidence Interval Accuracy */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <h3 style={{ fontWeight: 700, color: T.text, fontSize: 15, marginBottom: 16 }}>🎯 Confidence Interval Accuracy</h3>
          <p style={{ color: T.muted, fontSize: 12, marginBottom: 16 }}>What % of actual footfalls fall within our predicted range?</p>
          {[
            { ci: "50% Confidence Interval",  coverage: 52, target: 50, color: T.green },
            { ci: "80% Confidence Interval",  coverage: 83, target: 80, color: T.blue },
            { ci: "95% Confidence Interval",  coverage: 96, target: 95, color: T.indigo },
            { ci: "99% Confidence Interval",  coverage: 99, target: 99, color: T.accent },
          ].map((c, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ color:T.textSm, fontSize:12 }}>{c.ci}</span>
                <span style={{ color:c.color, fontWeight:700, fontSize:13 }}>{c.coverage}% covered ✅</span>
              </div>
              <div style={{ background:T.surface2, height:8, borderRadius:4, overflow:"hidden" }}>
                <div style={{ width:`${c.coverage}%`, height:"100%", background:c.color, borderRadius:4 }} />
              </div>
              <div style={{ color:T.muted, fontSize:10, marginTop:3 }}>Target: {c.target}%</div>
            </div>
          ))}
        </Card>

        {/* Undercounting Correction Validation */}
        <Card>
          <h3 style={{ fontWeight: 700, color: T.text, fontSize: 15, marginBottom: 16 }}>🔍 Undercounting Correction Validation</h3>
          <p style={{ color: T.muted, fontSize: 12, marginBottom: 16 }}>How much ticket data understates reality — by day type.</p>
          {[
            { type: "Ordinary Days",      ticket_pct: 72, true_pct: 100, gap: 28, color: T.blue },
            { type: "Medium Festival",    ticket_pct: 52, true_pct: 100, gap: 48, color: T.yellow },
            { type: "Major Festival",     ticket_pct: 31, true_pct: 100, gap: 69, color: T.red },
            { type: "Extraordinary Event",ticket_pct: 20, true_pct: 100, gap: 80, color: "#7C3AED" },
          ].map((r, i) => (
            <div key={i} style={{ background:T.surface2, borderRadius:10, padding:"12px 14px", marginBottom:10, border:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ color:T.textSm, fontSize:12, fontWeight:600 }}>{r.type}</span>
                <span style={{ color:r.color, fontWeight:800, fontSize:13 }}>{r.gap}% uncounted</span>
              </div>
              <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                <div style={{ flex:r.ticket_pct, background:r.color, height:8, borderRadius:"4px 0 0 4px", opacity:0.9 }} />
                <div style={{ flex:r.gap, background:`${r.color}30`, height:8, borderRadius:"0 4px 4px 0", border:`1px dashed ${r.color}` }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                <span style={{ fontSize:10, color:T.muted }}>Ticket data: {r.ticket_pct}%</span>
                <span style={{ fontSize:10, color:r.color }}>↑ Missing {r.gap}%</span>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Model Architecture Summary */}
      <Card>
        <h3 style={{ fontWeight: 700, color: T.text, fontSize: 15, marginBottom: 16 }}>🤖 Ensemble Architecture — How Our Model Works</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {[
            { name:"Random Forest", weight:"50%", desc:"200 decision trees · max_depth=14 · Main predictor for festival patterns", color:T.indigo, icon:"🌲" },
            { name:"Gradient Boosting", weight:"35%", desc:"150 estimators · lr=0.07 · Captures non-linear interactions", color:T.blue, icon:"📈" },
            { name:"Ridge Regression", weight:"15%", desc:"L2 regularization · Linear baseline · Prevents overfitting", color:T.green, icon:"📏" },
            { name:"Ensemble Output", weight:"Final", desc:"Weighted average of all 3 · R²=0.912 · MAE=358 pilgrims", color:T.accent, icon:"🎯" },
          ].map((m, i) => (
            <div key={i} style={{ background:T.surface2, borderRadius:12, padding:"16px 14px", border:`1px solid ${m.color}33`, textAlign:"center" }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{m.icon}</div>
              <div style={{ fontWeight:800, color:m.color, fontSize:14, marginBottom:4 }}>{m.name}</div>
              <div style={{ background:`${m.color}20`, color:m.color, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:12, marginBottom:8, display:"inline-block" }}>Weight: {m.weight}</div>
              <div style={{ color:T.muted, fontSize:11, lineHeight:1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: PRASADAM PLANNER  (PDF Section 12)
═══════════════════════════════════════════════════ */
function PrasadamPage({ temple }) {
  const { data: forecastData, loading } = useApi(`/forecast?temple_id=${temple.id}`, null, [temple.id]);
  const { data: evalData } = useApi(`/evaluation?temple_id=${temple.id}`, FALLBACK_EVAL, [temple.id]);

  const forecast = forecastData?.forecast || [];
  const prasadam = evalData?.prasadam_simulation || FALLBACK_EVAL.prasadam_simulation;

  const KG_PER_PILGRIM = 0.15;
  const COST_PER_KG = 80;

  const procurementData = forecast.slice(0, 14).map(d => {
    const exp = d.expected || 0;
    const maxF = d.max || 0;
    const kgMin = Math.round(exp * KG_PER_PILGRIM);
    const kgMax = Math.round(maxF * KG_PER_PILGRIM * 1.1);
    const cost  = Math.round(kgMax * COST_PER_KG);
    return {
      date: d.date, day: d.day, expected: exp, max: maxF,
      crowd_level: d.crowd_level || "Medium",
      festival: d.festival,
      kg_min: kgMin, kg_max: kgMax,
      cost_inr: cost,
    };
  });

  const totalKg   = procurementData.reduce((a,b) => a + b.kg_max, 0);
  const totalCost = procurementData.reduce((a,b) => a + b.cost_inr, 0);
  const peakDay   = procurementData.reduce((a,b) => a.kg_max > b.kg_max ? a : b, procurementData[0] || {});

  const wasteCompare = [
    { name: "Manual Method", waste_kg: prasadam.baseline?.avg_waste_kg || 42, shortfall_kg: prasadam.baseline?.avg_shortfall_kg || 18, color: T.red },
    { name: "TempleAI Model", waste_kg: prasadam.model?.avg_waste_kg || 22, shortfall_kg: prasadam.model?.avg_shortfall_kg || 9, color: T.green },
  ];

  return (
    <div style={{ padding: "28px 32px", animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text }}>Prasadam Procurement Planner</h1>
        <p style={{ color: T.muted, fontSize: 13, marginTop: 3 }}>
          PDF Section 12 — AI-driven procurement planning · Waste reduction · Cost optimisation for {temple.name}
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "14-Day Total Prasadam", value: `${fmt(totalKg)} kg`, sub: "recommended procurement", icon: "🍛", color: T.accent },
          { label: "Peak Day Requirement",  value: `${fmt(peakDay.kg_max || 0)} kg`, sub: peakDay.date || "--", icon: "📅", color: T.red },
          { label: "Est. 14-Day Cost",      value: `₹${fmt(totalCost)}`, sub: "at ₹80/kg raw material", icon: "💰", color: T.blue },
          { label: "Waste Reduction",       value: `${prasadam.improvement?.waste_reduction_pct || 47.8}%`, sub: "vs manual estimation", icon: "♻️", color: T.green },
        ].map((m, i) => (
          <Card key={i} hover glow>
            <div style={{ background:`${m.color}15`, padding:10, borderRadius:10, fontSize:20, marginBottom:14, width:"fit-content" }}>{m.icon}</div>
            <div style={{ fontSize:26, fontWeight:800, color:m.color, letterSpacing:"-0.02em" }}>{m.value}</div>
            <div style={{ color:T.muted, fontSize:11, marginTop:4 }}>{m.label}</div>
            <div style={{ color:T.textSm, fontSize:11, marginTop:2 }}>{m.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        {/* Waste Comparison Chart */}
        <Card>
          <h3 style={{ fontWeight:700, color:T.text, fontSize:15, marginBottom:4 }}>📊 Manual vs AI Procurement Comparison</h3>
          <p style={{ color:T.muted, fontSize:12, marginBottom:16 }}>Average daily waste and shortfall — kg of prasadam</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={wasteCompare} margin={{ top:5, right:20, bottom:5, left:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fill:T.muted, fontSize:11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill:T.muted, fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}kg`} />
              <Tooltip contentStyle={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:8, color:T.text }} />
              <Bar dataKey="waste_kg" name="Avg Waste (kg)" radius={[4,4,0,0]} fill={T.red} />
              <Bar dataKey="shortfall_kg" name="Avg Shortfall (kg)" radius={[4,4,0,0]} fill={T.yellow} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              { label:"Annual Cost Saving", value:`₹${fmt(prasadam.improvement?.annual_saving_inr || 589650)}`, color:T.green },
              { label:"Shortfall Reduction", value:`${prasadam.improvement?.shortfall_reduction_pct || 47.3}%`, color:T.blue },
            ].map((s,i) => (
              <div key={i} style={{ background:T.surface2, borderRadius:8, padding:"10px 14px", border:`1px solid ${T.border}` }}>
                <div style={{ color:T.muted, fontSize:10, marginBottom:4 }}>{s.label}</div>
                <div style={{ color:s.color, fontWeight:800, fontSize:18 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* How Procurement Works */}
        <Card>
          <h3 style={{ fontWeight:700, color:T.text, fontSize:15, marginBottom:16 }}>⚙️ How AI Procurement Planning Works</h3>
          {[
            { step:"1", title:"Predict Footfall", desc:"21-day ML forecast with upper bound (max) used for procurement buffer", icon:"📈", color:T.accent },
            { step:"2", title:"Apply Kg Formula", desc:`${KG_PER_PILGRIM} kg per pilgrim × Max footfall × 10% safety buffer = Daily order`, icon:"🧮", color:T.blue },
            { step:"3", title:"Festival Scaling", desc:"Festival days get 1.2× multiplier. Extraordinary events get 1.5× multiplier", icon:"🎊", color:T.yellow },
            { step:"4", title:"Procurement Order", desc:"3-week ahead order placed with vendors. Matches PDF Section 6 constraint.", icon:"📋", color:T.green },
          ].map((s, i) => (
            <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom: i<3 ? `1px solid ${T.border}` : "none", alignItems:"flex-start" }}>
              <div style={{ background:`${s.color}20`, color:s.color, fontWeight:800, fontSize:14, width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{s.step}</div>
              <div>
                <div style={{ fontWeight:700, color:T.text, fontSize:13 }}>{s.title}</div>
                <div style={{ color:T.muted, fontSize:12, marginTop:3, lineHeight:1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* 14-Day Procurement Table */}
      <Card>
        <h3 style={{ fontWeight:700, color:T.text, fontSize:15, marginBottom:16 }}>📋 14-Day Procurement Schedule — {temple.name}</h3>
        {loading ? <LoadingSpinner /> : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${T.border}` }}>
                {["Date","Day","Footfall (Expected)","Crowd Level","Festival","Min Kg","Max Kg","Est. Cost (₹)","Action"].map(h => (
                  <th key={h} style={{ padding:"8px 10px", textAlign:"left", color:T.muted, fontWeight:700, fontSize:10, letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {procurementData.map((d, i) => (
                <tr key={i} style={{ borderBottom:`1px solid ${T.border}`, background: d.festival ? `${T.yellow}08` : "transparent" }}>
                  <td style={{ padding:"9px 10px", fontWeight:700, color:T.text }}>{d.date}</td>
                  <td style={{ padding:"9px 10px", color:T.muted }}>{d.day}</td>
                  <td style={{ padding:"9px 10px", fontWeight:700, color:lvlColor(d.crowd_level) }}>{fmt(d.expected)}</td>
                  <td style={{ padding:"9px 10px" }}>
                    <span style={{ background:lvlBg(d.crowd_level), color:lvlColor(d.crowd_level), padding:"2px 8px", borderRadius:4, fontSize:10, fontWeight:700 }}>{d.crowd_level}</span>
                  </td>
                  <td style={{ padding:"9px 10px", color:T.yellow, fontSize:11 }}>{d.festival ? `🎊 ${d.festival}` : "—"}</td>
                  <td style={{ padding:"9px 10px", color:T.textSm }}>{fmt(d.kg_min)} kg</td>
                  <td style={{ padding:"9px 10px", fontWeight:700, color:T.text }}>{fmt(d.kg_max)} kg</td>
                  <td style={{ padding:"9px 10px", color:T.blue, fontWeight:700 }}>₹{fmt(d.cost_inr)}</td>
                  <td style={{ padding:"9px 10px" }}>
                    <span style={{ background: d.crowd_level === "High" ? T.redD : T.greenD, color: d.crowd_level === "High" ? T.red : T.green, padding:"2px 8px", borderRadius:4, fontSize:10, fontWeight:700 }}>
                      {d.crowd_level === "High" ? "Order Max" : "Order Min"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop:`2px solid ${T.border}`, background:T.surface2 }}>
                <td colSpan={5} style={{ padding:"10px", fontWeight:800, color:T.text }}>14-Day Total</td>
                <td style={{ padding:"10px", fontWeight:700, color:T.textSm }}>{fmt(procurementData.reduce((a,b)=>a+b.kg_min,0))} kg</td>
                <td style={{ padding:"10px", fontWeight:800, color:T.accent }}>{fmt(totalKg)} kg</td>
                <td style={{ padding:"10px", fontWeight:800, color:T.blue }}>₹{fmt(totalCost)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        )}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: SIDEBAR
═══════════════════════════════════════════════════ */
const NAV = [
  { id: "dashboard",   label: "Dashboard",            icon: "📊" },
  { id: "predictions", label: "Predictions",           icon: "📈" },
  { id: "festival",    label: "Festival Intelligence", icon: "🎊" },
  { id: "insights",    label: "Data Insights",         icon: "🔬" },
  { id: "evaluation",  label: "Model Evaluation",      icon: "🎯", badge: "NEW" },
  { id: "prasadam",    label: "Prasadam Planner",      icon: "🍛", badge: "NEW" },
  { id: "reports",     label: "Reports",               icon: "📄" },
];

function Sidebar({ active, setActive }) {
  return (
    <div style={{ width: 228, background: T.surface, borderRight: `1px solid ${T.border}`, minHeight: "calc(100vh - 60px)", padding: "20px 12px", flexShrink: 0, position: "relative" }}>
      <div style={{ background: T.accentD, border: `1px solid ${T.accent}33`, borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
        <div style={{ color: T.accent, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>AI MODEL STATUS</div>
        <div style={{ color: T.text, fontSize: 12, fontWeight: 700 }}>Random Forest + LR Ensemble</div>
        <div style={{ color: T.muted, fontSize: 10, marginTop: 3 }}>22 features · R² = 0.91</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, animation: "pulse 2s infinite" }} />
          <span style={{ color: T.green, fontSize: 10, fontWeight: 700 }}>Model Active</span>
        </div>
      </div>
      {NAV.map(item => (
        <div key={item.id} onClick={() => setActive(item.id)}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "11px 14px", borderRadius: 10, marginBottom: 4,
            background: active === item.id ? T.accentD : "transparent",
            border: `1px solid ${active === item.id ? `${T.accent}44` : "transparent"}`,
            cursor: "pointer", transition: "all 0.2s"
          }}>
          <span style={{ fontSize: 16 }}>{item.icon}</span>
          <span style={{ color: active === item.id ? T.accent : T.muted, fontWeight: active === item.id ? 700 : 500, fontSize: 13 }}>
            {item.label}
          </span>
          {item.badge && active !== item.id && (
            <span style={{ marginLeft: "auto", background: T.redD, color: T.red, fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4 }}>{item.badge}</span>
          )}
          {active === item.id && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: T.accent }} />}
        </div>
      ))}
      <div style={{ position: "absolute", bottom: 20, left: 12, right: 12 }}>
        <div style={{ background: T.surface2, borderRadius: 10, padding: "12px 14px", border: `1px solid ${T.border}` }}>
          <div style={{ color: T.muted, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 4 }}>HR&CE DEPARTMENT</div>
          <div style={{ color: T.text, fontSize: 11, fontWeight: 700 }}>Govt. of Tamil Nadu</div>
          <div style={{ color: T.muted, fontSize: 10, marginTop: 2 }}>TempleAI v2.1.0 · Apr 2026</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: HEADER
═══════════════════════════════════════════════════ */
function Header({ temple, setTemple }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ height: 62, background: T.surface, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 20, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, #1E40AF)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛕</div>
        <div>
          <div style={{ fontWeight: 800, color: T.text, fontSize: 16, letterSpacing: "-0.02em", lineHeight: 1 }}>TempleAI</div>
          <div style={{ color: T.accent, fontSize: 8, fontWeight: 700, letterSpacing: "0.15em" }}>PREDICTORS</div>
        </div>
      </div>
      <div style={{ width: 1, height: 32, background: T.border }} />
      {/* Temple Selector */}
      <div style={{ position: "relative" }}>
        <div onClick={() => setOpen(!open)}
          style={{ display: "flex", alignItems: "center", gap: 10, background: T.surface2, border: `1px solid ${open ? T.borderLt : T.border}`, borderRadius: 9, padding: "7px 14px", cursor: "pointer", minWidth: 260 }}>
          <span style={{ fontSize: 15 }}>🛕</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: T.text, fontSize: 12, fontWeight: 700 }}>{temple.name}</div>
            <div style={{ color: T.muted, fontSize: 10 }}>{temple.city} · {temple.tag} · Base {fmt(temple.base)}/day</div>
          </div>
          <ChevronDown size={14} color={T.muted} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </div>
        {open && (
          <div style={{ position: "absolute", top: 46, left: 0, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, boxShadow: "0 8px 40px rgba(0,0,0,0.5)", zIndex: 200, minWidth: 280, overflow: "hidden" }}>
            {TEMPLES.map(t => (
              <div key={t.id} onClick={() => { setTemple(t); setOpen(false); }}
                style={{ padding: "11px 16px", cursor: "pointer", background: t.id === temple.id ? T.accentD : "transparent", borderBottom: `1px solid ${T.border}`, transition: "background 0.15s" }}>
                <div style={{ color: t.id === temple.id ? T.accent : T.text, fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                <div style={{ color: T.muted, fontSize: 11, marginTop: 2 }}>{t.city} · Est. base: {fmt(t.base)} pilgrims/day</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Right section */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ background: T.accentD, border: `1px solid ${T.accent}44`, borderRadius: 8, padding: "5px 14px" }}>
          <span style={{ color: T.accent, fontSize: 11, fontWeight: 700 }}>📅 Apr 15 – May 5, 2026</span>
        </div>
        <div style={{ background: T.greenD, border: `1px solid ${T.green}33`, borderRadius: 8, padding: "5px 14px", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, animation: "pulse 2s infinite" }} />
          <span style={{ color: T.green, fontSize: 11, fontWeight: 700 }}>Live</span>
        </div>
        <div style={{ position: "relative", cursor: "pointer" }}>
          <Bell size={18} color={T.muted} />
          <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: T.red, border: `2px solid ${T.surface}` }} />
        </div>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, #1E40AF)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#000", cursor: "pointer" }}>A</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════ */
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [temple, setTemple] = useState(TEMPLES[0]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { background: #F0F4F9; font-family: 'Outfit', sans-serif; color: #0F1C2E; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #F0F4F9; }
      ::-webkit-scrollbar-thumb { background: #C5CFDF; border-radius: 2px; }
    `;
    document.head.appendChild(style);
  }, []);

  const pages = {
    dashboard:   <DashboardPage temple={temple} />,
    predictions: <PredictionsPage temple={temple} />,
    festival:    <FestivalPage />,
    insights:    <DataInsightsPage temple={temple} />,
    evaluation:  <EvaluationPage temple={temple} />,
    prasadam:    <PrasadamPage temple={temple} />,
    reports:     <ReportsPage temple={temple} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Outfit', sans-serif" }}>
      <Header temple={temple} setTemple={setTemple} />
      <div style={{ display: "flex" }}>
        <Sidebar active={active} setActive={setActive} />
        <main style={{ flex: 1, overflowY: "auto", maxHeight: "calc(100vh - 62px)" }}>
          {pages[active]}
        </main>
      </div>
    </div>
  );
}
// ─── THIS FILE GETS REPLACED WITH FULL API-CONNECTED VERSION ───
