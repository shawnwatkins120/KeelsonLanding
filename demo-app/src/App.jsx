import React, { useState } from "react";
import {
  Anchor, LayoutDashboard, FilePlus2, FileText, ShieldCheck, Camera, Mic,
  Sparkles, Check, AlertTriangle, Download, ChevronRight, ChevronLeft,
  Lock, Clock, PenLine, Menu, X, Gauge, CircleCheck, Server, MapPin, Printer
} from "lucide-react";

// ---------------------------------------------------------------------------
// Keelson — AI-assisted documentation for private ship-repair contractors.
// Demo build. Shares the landing page's defense-tech vibe.
// Features: capture -> live AI draft (with offline fallback) -> inline edit
// -> verify -> QA sign-off -> export. Placeholder name; rename freely.
// ---------------------------------------------------------------------------

const SAMPLE_CONTEXT = {
  ship: "HULL-072",
  availability: "AVAIL 26-3",
  workItem: "SWLIN 233-11-002",
  location: "MMR2 tank top, Fr 142–148",
  trade: "Structural / Coatings",
};

const SAMPLE_PHOTOS = [
  { id: 1, cap: "Tank top corrosion, Fr 144 / MMR2", tag: "0731 · GPS-tagged" },
  { id: 2, cap: 'UT reading 0.281" min, Fr 145', tag: "0734 · GPS-tagged" },
  { id: 3, cap: "Coating failure & pitting, Fr 146", tag: "0736 · GPS-tagged" },
  { id: 4, cap: "Active water intrusion staining, Fr 143", tag: "0739 · GPS-tagged" },
];

const SAMPLE_NOTES =
  "found heavy scale and pitting under the deck plates we pulled in MMR2, tank " +
  "top looks bad around frame 144-146. took UT shots, getting like .280 in a few " +
  "spots, nominal is .375. theres active water intrusion staining, coating totally " +
  "gone. recommend scale back to bare metal, get UT mapped proper, probably crop " +
  "and renew the worst section. gonna be growth work for sure";

const FALLBACK = {
  cfr: {
    reportNumber: "CFR-26-3-0147",
    summary: "Accelerated plate wastage — MMR2 tank top, Fr 142–148",
    severity: "Major",
    sections: [
      { key: "condition", label: "Condition Found", sources: [1, 2, 3],
        content:
          "Upon removal of deck plating in Main Machinery Room 2, accelerated corrosion and through-scale pitting were identified across the tank top structure between frames 142 and 148. Ultrasonic thickness (UT) readings recorded a minimum of 0.281\" against a nominal of 0.375\", representing wastage below the allowable minimum in multiple locations. Protective coating is fully degraded across the affected area." },
      { key: "cause", label: "Probable Cause", sources: [4],
        content:
          "Prolonged moisture entrapment beneath the deck plating, evidenced by active water-intrusion staining, combined with total coating system failure. The concealed location prevented detection during routine inspection cycles, allowing corrosion to progress unchecked." },
      { key: "action", label: "Recommended Corrective Action", sources: [1, 3],
        content:
          "Abrasive-blast the affected tank top to bare metal (SSPC-SP 10) and perform a full UT thickness map of frames 140–150 to define the wastage boundary. Crop and renew plating where readings fall below minimum allowable, then re-preserve per the applicable coatings specification. Recommend customer review for growth-work authorization prior to proceeding." },
      { key: "impact", label: "Estimated Impact (Growth Work)", sources: [],
        content:
          "Estimated 180–240 labor hours (structural + coatings), pending UT mapping results. Material: approx. 6–9 sq ft of A36 plate plus consumables. Schedule risk: 3–4 days; recommend parallel scheduling against existing tank work to protect the availability end date." },
      { key: "references", label: "References & OQE", sources: [2],
        content:
          "Inspection method: UT thickness gauging (calibrated gauge, cert. on file). NSTM Ch. 100 (Hull Structure) and Ch. 631 (Preservation) applicable. OQE package to include UT reading log, calibration certificate, and the four photographs referenced herein with frame-station annotation." },
    ],
  },
  oqe: {
    reportNumber: "OQE-26-3-0091",
    summary: "QA inspection package — coating renewal, MMR2 tank top",
    severity: "Moderate",
    sections: [
      { key: "scope", label: "Inspection Scope", sources: [1],
        content: "Verification of surface preparation and coating application for the MMR2 tank top renewal, frames 142–148, against the contract coatings specification." },
      { key: "checks", label: "Verification Checkpoints", sources: [2, 3],
        content: "Surface profile confirmed at 2.5–3.5 mils (SSPC-SP 10 achieved). Ambient/dew-point readings within spec at each application. Wet-film and dry-film thickness recorded across the grid; all readings within tolerance." },
      { key: "results", label: "Results & Disposition", sources: [],
        content: "All checkpoints PASS. No rework required. Coating system accepted pending 24-hour cure verification." },
      { key: "references", label: "References & OQE", sources: [],
        content: "OQE package: DFT log, environmental readings log, gauge calibration certificate, inspector qualification record, and annotated photographs." },
    ],
  },
  daily: {
    reportNumber: "DPR-26-3-0731",
    summary: "Daily production report — MMR2 tank work",
    severity: "Minor",
    sections: [
      { key: "completed", label: "Work Completed Today", sources: [1],
        content: "Deck plating removed in MMR2 (Fr 142–148). Tank top inspected; corrosion condition documented and submitted as CFR-26-3-0147. UT readings captured across affected area." },
      { key: "next", label: "Planned — Next Shift", sources: [],
        content: "Stage blasting equipment pending growth-work authorization. Complete UT thickness map, frames 140–150." },
      { key: "issues", label: "Issues / Delays", sources: [4],
        content: "Discovered growth work (tank top wastage) may impact tank-work sequence. CFR submitted for disposition; awaiting authorization to proceed." },
    ],
  },
  tip: {
    reportNumber: "TIP-26-3-0058",
    summary: "Test & Inspection Plan — MMR2 tank top renewal",
    severity: "Moderate",
    sections: [
      { key: "scope", label: "Scope of Test & Inspection", sources: [1],
        content: "Defines the required inspections, tests, and witness points for the MMR2 tank top crop-and-renew, frames 142–148, from surface preparation through final preservation." },
      { key: "points", label: "Inspection / Test Points", sources: [2],
        content: "(G) UT thickness map verification, frames 140–150. (H) Surface prep to SSPC-SP 10 — hold point prior to coating. (V) Weld visual and MT on renewed plate seams. (G) Dry-film thickness check at each coat. Witness key: G = Government, V = Vendor QA, H = Hold point." },
      { key: "criteria", label: "Acceptance Criteria", sources: [],
        content: "Renewed plate at or above 0.375\" nominal. Surface profile 2.5–3.5 mils. Welds per applicable NSTM and contract weld spec with zero rejectable indications. Coating dry-film thickness within manufacturer range." },
      { key: "references", label: "References & OQE", sources: [],
        content: "NSTM Ch. 074 (Welding), Ch. 100 (Hull Structure), Ch. 631 (Preservation); contract weld and coatings specifications. OQE: UT logs, MT reports, DFT logs, witness-point sign-offs, calibration certificates." },
    ],
  },
};

const REPORT_TYPES = [
  { id: "cfr", title: "Condition Found Report", desc: "Document growth work discovered during the availability.", icon: AlertTriangle, hot: true },
  { id: "oqe", title: "QA / OQE Inspection Package", desc: "Assemble objective quality evidence for sign-off.", icon: ShieldCheck },
  { id: "daily", title: "Daily Production Report", desc: "Turn the day's notes into the required progress report.", icon: FileText },
  { id: "tip", title: "Test / Inspection Plan (TIP)", desc: "Generate the test, inspection, and witness-point plan for a job.", icon: Gauge },
];

const LIBRARY = [
  { ...FALLBACK.cfr, type: "cfr", date: "Today · 07:41", status: "Pending QA" },
  { ...FALLBACK.oqe, type: "oqe", date: "Yesterday", status: "Verified" },
  { ...FALLBACK.daily, type: "daily", date: "Yesterday", status: "Submitted" },
  { ...FALLBACK.tip, type: "tip", date: "Yesterday", status: "Verified" },
  { reportNumber: "CFR-26-3-0131", summary: "Cracked weld — shell seam, Fr 88", type: "cfr", date: "2 days ago", status: "Verified", severity: "Major", sections: FALLBACK.cfr.sections },
  { reportNumber: "DPR-26-3-0729", summary: "Daily production — shaft alley", type: "daily", date: "3 days ago", status: "Submitted", severity: "Minor", sections: FALLBACK.daily.sections },
];

const sevColor = (s) =>
  s === "Major" ? "text-red-300 bg-slate-800 border-red-900"
  : s === "Moderate" ? "text-amber-300 bg-slate-800 border-amber-900"
  : "text-slate-400 bg-slate-800 border-slate-700";

const sevColorDoc = (s) =>
  s === "Major" ? "text-red-700 bg-red-100 border-red-200"
  : s === "Moderate" ? "text-amber-700 bg-amber-100 border-amber-200"
  : "text-slate-600 bg-slate-100 border-slate-200";

const typeLabel = (t) => REPORT_TYPES.find((r) => r.id === t)?.title || "Report";
const effContent = (edits, key, fallback) => (edits && edits[key] != null ? edits[key] : fallback);
const nowStamp = () => {
  const d = new Date();
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" }) +
    " · " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

function PhotoCard({ p, small }) {
  return (
    <div className={`shrink-0 ${small ? "w-28" : "w-40"} rounded-lg overflow-hidden border border-slate-700 bg-slate-800`}>
      <div className={`${small ? "h-20" : "h-28"} bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 relative flex items-center justify-center`}>
        <Camera className="text-slate-400" size={small ? 18 : 24} />
        <span className="absolute top-1 left-1 ff-mono text-[9px] text-white bg-black/50 px-1 rounded">#{p.id}</span>
      </div>
      <div className="p-1.5">
        <p className="text-[10px] leading-tight text-slate-300 font-medium line-clamp-2">{p.cap}</p>
        <p className="ff-mono text-[9px] text-slate-500 mt-0.5">{p.tag}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("dashboard");
  const [mobileNav, setMobileNav] = useState(false);

  const [step, setStep] = useState(1);
  const [reportType, setReportType] = useState("cfr");
  const [ctx, setCtx] = useState(SAMPLE_CONTEXT);
  const [notes, setNotes] = useState(SAMPLE_NOTES);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [offline, setOffline] = useState(false);
  const [verified, setVerified] = useState({});
  const [genSeconds, setGenSeconds] = useState(null);
  const [edits, setEdits] = useState({});       // inline edits, keyed by section
  const [signOff, setSignOff] = useState(null);  // { name, date }
  const [printing, setPrinting] = useState(false);
  const [viewerDoc, setViewerDoc] = useState(null);

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "new", label: "New Report", icon: FilePlus2 },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "settings", label: "Security", icon: ShieldCheck },
  ];

  function go(v) { setView(v); setMobileNav(false); if (v === "new") resetFlow(); }
  function resetFlow() {
    setStep(1); setResult(null); setVerified({}); setOffline(false);
    setGenSeconds(null); setEdits({}); setSignOff(null);
  }

  async function generate() {
    setGenerating(true);
    const started = Date.now();
    const photoList = SAMPLE_PHOTOS.map((p) => `#${p.id}: ${p.cap}`).join("\n");
    const prompt =
`You are a senior QA documentation specialist for a US private ship-repair contractor performing government maintenance availability work. Convert the rough field evidence below into a formal ${typeLabel(reportType)} in the voice and structure expected as objective quality evidence (OQE).

Ship/Hull: ${ctx.ship}
Availability: ${ctx.availability}
Work item: ${ctx.workItem}
Location: ${ctx.location}
Trade: ${ctx.trade}

Photo evidence:
${photoList}

Raw field notes:
"${notes}"

Return ONLY a JSON object (no markdown, no preamble) with this exact shape:
{"reportNumber":"...","summary":"one short line naming the deficiency","severity":"Major|Moderate|Minor","sections":[{"key":"condition","label":"Condition Found","content":"2-4 sentences","sources":[1,2]},{"key":"cause","label":"Probable Cause","content":"...","sources":[]},{"key":"action","label":"Recommended Corrective Action","content":"...","sources":[]},{"key":"impact","label":"Estimated Impact (Growth Work)","content":"labor hours, materials, schedule risk","sources":[]},{"key":"references","label":"References & OQE","content":"inspection method, applicable standards, OQE contents","sources":[]}]}
Use correct terminology (UT thickness, NSTM, SSPC, growth work). Be specific to the evidence.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("");
      const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (!parsed.sections || !parsed.sections.length) throw new Error("empty");
      setResult(parsed);
      setOffline(false);
    } catch (e) {
      setResult(FALLBACK[reportType]);
      setOffline(true);
    } finally {
      const secs = Math.max(2, Math.round((Date.now() - started) / 1000));
      setGenSeconds(secs);
      setGenerating(false);
      setStep(3);
    }
  }

  const totalSections = result?.sections?.length || 0;
  const verifiedCount = result ? result.sections.filter((s) => verified[s.key]).length : 0;
  const allVerified = totalSections > 0 && verifiedCount === totalSections;

  return (
    <div className="ff-body min-h-screen bg-slate-950 text-slate-200 flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .ff-display{font-family:'Archivo',ui-sans-serif,system-ui,sans-serif}
        .ff-body{font-family:'Inter',ui-sans-serif,system-ui,sans-serif}
        .ff-mono{font-family:'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace}
        .kbp{background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:46px 46px}
        .kglow{box-shadow:0 24px 70px -30px rgba(52,216,196,.30)}
        .tnum{font-variant-numeric:tabular-nums}
        @media (prefers-reduced-motion:reduce){
          .animate-rise-in{animation:none!important}
        }
        @media print {
          body * { visibility: hidden !important; }
          .print-page, .print-page * { visibility: visible !important; }
          .print-page { position: absolute !important; left: 0; top: 0; width: 100%; margin: 0 !important; box-shadow: none !important; border: 0 !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-slate-950 border-r border-slate-800">
        <Brand />
        <nav className="flex-1 px-3 space-y-1">
          {nav.map((n) => (
            <button key={n.id} onClick={() => go(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors border-l-2 ${
                view === n.id ? "bg-slate-900 text-white border-teal-400" : "border-transparent text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}>
              <n.icon size={18} /> {n.label}
            </button>
          ))}
        </nav>
        <DataResidency />
      </aside>

      <div className="md:hidden fixed top-0 inset-x-0 z-20 bg-slate-950 text-white flex items-center justify-between px-4 h-14 border-b border-slate-800">
        <div className="flex items-center gap-2"><Anchor size={18} className="text-teal-400" /><span className="ff-display font-extrabold tracking-tight">Keelson</span></div>
        <button onClick={() => setMobileNav((v) => !v)} aria-label="Menu">{mobileNav ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {mobileNav && (
        <div className="md:hidden fixed top-14 inset-x-0 z-20 bg-slate-900 text-slate-200 px-3 py-2 space-y-1 shadow-lg border-b border-slate-800">
          {nav.map((n) => (
            <button key={n.id} onClick={() => go(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm ${view === n.id ? "bg-slate-800 text-white" : "text-slate-300"}`}>
              <n.icon size={18} /> {n.label}
            </button>
          ))}
        </div>
      )}

      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <header className="hidden md:flex items-center justify-between px-8 h-16 bg-slate-950 border-b border-slate-800">
          <div>
            <p className="ff-mono text-xs text-slate-500 uppercase tracking-widest">{ctx.availability}</p>
            <h1 className="ff-display text-lg font-extrabold tracking-tight text-white -mt-0.5">{ctx.ship}</h1>
          </div>
          <span className="flex items-center gap-2 text-xs font-medium text-teal-300 bg-teal-900 border border-teal-800 px-3 py-1.5 rounded-full">
            <Lock size={13} /> CUI-ready · data stays in your tenant
          </span>
        </header>

        <div key={view} className="p-5 md:p-8 max-w-5xl mx-auto animate-rise-in">
          {view === "dashboard" && <Dashboard onNew={() => go("new")} onOpen={(d) => setViewerDoc(d)} />}
          {view === "new" && (
            <NewReport
              step={step} setStep={setStep}
              reportType={reportType} setReportType={setReportType}
              ctx={ctx} setCtx={setCtx} notes={notes} setNotes={setNotes}
              generating={generating} generate={generate}
              result={result} offline={offline} genSeconds={genSeconds}
              verified={verified} setVerified={setVerified}
              verifiedCount={verifiedCount} totalSections={totalSections} allVerified={allVerified}
              edits={edits} setEdits={setEdits} signOff={signOff} setSignOff={setSignOff}
              onExport={() => setPrinting(true)} resetFlow={resetFlow}
            />
          )}
          {view === "documents" && <Documents onOpen={(d) => setViewerDoc(d)} />}
          {view === "settings" && <Security />}
        </div>
      </main>

      {viewerDoc && <DocViewer doc={viewerDoc} onClose={() => setViewerDoc(null)} />}
      {printing && result && <PrintView result={result} ctx={ctx} edits={edits} signOff={signOff} reportType={reportType} onClose={() => setPrinting(false)} />}
    </div>
  );
}

function Brand() {
  return (
    <div className="px-5 py-5 flex items-center gap-2.5 border-b border-slate-800">
      <div className="w-9 h-9 rounded-md bg-teal-900 border border-teal-800 flex items-center justify-center">
        <Anchor size={20} className="text-teal-400" />
      </div>
      <div className="leading-none">
        <p className="text-white ff-display font-extrabold tracking-tight text-lg">Keelson</p>
        <p className="ff-mono text-[10px] text-slate-500 mt-1">ship-repair docs</p>
      </div>
    </div>
  );
}

function DataResidency() {
  return (
    <div className="m-3 p-3 rounded-lg bg-slate-900 border border-slate-800">
      <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold"><Server size={14} /> Your infrastructure</div>
      <p className="text-[11px] text-slate-400 mt-1 leading-snug">Runs in your tenant. No data leaves your environment. CUI / ITAR handling.</p>
    </div>
  );
}

function Stat({ icon: Icon, value, label, accent, delay = 0 }) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 animate-rise-in" style={{ animationDelay: `${delay}ms` }}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${accent}`}><Icon size={18} /></div>
      <p className="ff-display text-2xl font-extrabold tracking-tight text-white tnum">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function Dashboard({ onNew, onOpen }) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="kbp absolute -inset-x-8 -top-8 h-40 opacity-70 pointer-events-none"
          style={{ maskImage: "radial-gradient(ellipse 60% 100% at 0% 0%, #000, transparent 72%)", WebkitMaskImage: "radial-gradient(ellipse 60% 100% at 0% 0%, #000, transparent 72%)" }} />
        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="ff-mono text-xs tracking-widest uppercase text-teal-400">This availability</span>
            <h2 className="ff-display text-2xl font-extrabold tracking-tight text-white mt-1">Documentation status</h2>
            <p className="text-slate-400 text-sm mt-1">Where the current maintenance period stands.</p>
          </div>
          <button onClick={onNew} className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors shrink-0">
            <FilePlus2 size={17} /> New report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={FileText} value="38" label="Documents this availability" accent="bg-slate-800 text-slate-300" delay={0} />
        <Stat icon={Clock} value="29 hrs" label="Est. QA hours saved" accent="bg-teal-900 text-teal-300" delay={60} />
        <Stat icon={AlertTriangle} value="3" label="Growth-work CFRs open" accent="bg-amber-900 text-amber-300" delay={120} />
        <Stat icon={CircleCheck} value="91%" label="OQE first-pass accepted" accent="bg-emerald-900 text-emerald-300" delay={180} />
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="ff-display font-bold text-white text-sm">Recent documents</h3>
          <span className="text-xs text-slate-500 ff-mono">{SAMPLE_CONTEXT.ship}</span>
        </div>
        <ul className="divide-y divide-slate-800">
          {LIBRARY.slice(0, 4).map((d) => (
            <li key={d.reportNumber}>
              <button onClick={() => onOpen(d)} className="w-full text-left px-5 py-3.5 flex items-center gap-3 hover:bg-slate-800 transition-colors">
                <span className={`ff-mono text-[10px] px-1.5 py-0.5 rounded border ${sevColor(d.severity)}`}>{d.severity}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-slate-200 truncate">{d.summary}</span>
                  <span className="block ff-mono text-xs text-slate-500">{d.reportNumber} · {typeLabel(d.type)}</span>
                </span>
                <span className="text-xs text-slate-500 hidden sm:block">{d.date}</span>
                <ChevronRight size={16} className="text-slate-600" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NewReport(props) {
  const {
    step, setStep, reportType, setReportType, ctx, setCtx, notes, setNotes,
    generating, generate, result, offline, genSeconds, verified, setVerified,
    verifiedCount, totalSections, allVerified, edits, setEdits, signOff, setSignOff,
    onExport, resetFlow,
  } = props;

  if (generating) return <Generating />;

  return (
    <div>
      <Stepper step={step} />

      {step === 1 && (
        <div className="space-y-3">
          <h2 className="ff-display text-xl font-extrabold tracking-tight text-white mb-1">What are you documenting?</h2>
          <p className="text-slate-400 text-sm mb-4">Pick the document. The format follows what your customer expects to receive.</p>
          {REPORT_TYPES.map((t) => (
            <button key={t.id} onClick={() => { setReportType(t.id); setStep(2); }}
              className="w-full text-left bg-slate-900 rounded-xl border border-slate-800 hover:border-teal-700 transition-all p-4 flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-lg bg-slate-800 group-hover:bg-teal-900 flex items-center justify-center shrink-0 transition-colors">
                <t.icon size={20} className="text-slate-300 group-hover:text-teal-300" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">{t.title}</p>
                  {t.hot && <span className="ff-mono text-[10px] font-medium text-amber-300 bg-amber-900 px-1.5 py-0.5 rounded">most common</span>}
                </div>
                <p className="text-sm text-slate-400 mt-0.5">{t.desc}</p>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-teal-400" />
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <h3 className="ff-display font-bold text-white text-sm mb-3 flex items-center gap-2"><MapPin size={15} className="text-slate-500" /> Job context</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[["ship", "Ship / Hull"], ["availability", "Availability"], ["workItem", "Work item"], ["location", "Location"], ["trade", "Trade"]].map(([k, label]) => (
                <label key={k} className="block">
                  <span className="ff-mono text-[11px] uppercase tracking-wide text-slate-500">{label}</span>
                  <input value={ctx[k]} onChange={(e) => setCtx({ ...ctx, [k]: e.target.value })}
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-sm ff-mono text-slate-200 focus:border-teal-400 outline-none" />
                </label>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="ff-display font-bold text-white text-sm flex items-center gap-2"><Camera size={15} className="text-slate-500" /> Photo evidence</h3>
              <span className="text-xs text-slate-500 ff-mono">{SAMPLE_PHOTOS.length} from the deck</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {SAMPLE_PHOTOS.map((p) => <PhotoCard key={p.id} p={p} />)}
              <div className="shrink-0 w-40 h-[152px] rounded-lg border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 text-xs gap-1">
                <Camera size={20} /> Add photo
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="ff-display font-bold text-white text-sm flex items-center gap-2"><PenLine size={15} className="text-slate-500" /> Field notes</h3>
              <span className="inline-flex items-center gap-1.5 text-xs text-teal-300 bg-teal-900 border border-teal-800 px-2 py-1 rounded-md"><Mic size={12} /> Dictated on deck</span>
            </div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-teal-400 outline-none resize-none" />
            <p className="text-[11px] text-slate-500 mt-2">Rough is fine — Keelson turns this into the formatted report. Nothing is fabricated; every line traces to your notes and photos.</p>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white px-3 py-2"><ChevronLeft size={16} /> Back</button>
            <button onClick={generate} className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
              <Sparkles size={17} /> Generate {typeLabel(reportType).split(" ")[0]} report
            </button>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <ResultView
          result={result} reportType={reportType} ctx={ctx} offline={offline} genSeconds={genSeconds}
          verified={verified} setVerified={setVerified} verifiedCount={verifiedCount}
          totalSections={totalSections} allVerified={allVerified}
          edits={edits} setEdits={setEdits} signOff={signOff} setSignOff={setSignOff}
          onExport={onExport} onAnother={resetFlow}
        />
      )}
    </div>
  );
}

function Stepper({ step }) {
  const steps = ["Document", "Evidence", "Review & sign"];
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((s, i) => {
        const n = i + 1; const active = step === n; const done = step > n;
        return (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full ff-mono text-xs flex items-center justify-center ${
                done ? "bg-teal-400 text-slate-950" : active ? "bg-white text-slate-950" : "bg-slate-800 text-slate-500"}`}>
                {done ? <Check size={13} /> : n}
              </span>
              <span className={`text-sm ${active ? "font-semibold text-white" : "text-slate-500"}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-slate-800 min-w-4" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Generating() {
  const msgs = ["Reading field notes…", "Linking photo evidence…", "Cross-referencing OQE & standards…", "Formatting to spec…"];
  const [i, setI] = useState(0);
  React.useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % msgs.length), 900); return () => clearInterval(t); }, []);
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-xl bg-teal-900 border border-teal-800 flex items-center justify-center mb-5">
        <Sparkles className="text-teal-300 animate-pulse" size={26} />
      </div>
      <p className="ff-display font-bold text-white">Building your report</p>
      <p className="text-sm text-slate-400 mt-1 ff-mono">{msgs[i]}</p>
    </div>
  );
}

function ResultView(props) {
  const {
    result, reportType, ctx, offline, genSeconds, verified, setVerified,
    verifiedCount, totalSections, allVerified, edits, setEdits, signOff, setSignOff,
    onExport, onAnother,
  } = props;

  const [showSign, setShowSign] = useState(false);
  const [name, setName] = useState("");
  const [attested, setAttested] = useState(false);
  const signed = !!signOff;

  function confirmSign() {
    if (!name.trim() || !attested) return;
    setSignOff({ name: name.trim(), date: nowStamp() });
    setShowSign(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md border ${offline ? "text-slate-400 bg-slate-800 border-slate-700" : "text-teal-300 bg-teal-900 border-teal-800"}`}>
            <Sparkles size={12} /> {offline ? "Sample mode (offline)" : "Live AI"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 ff-mono">
            <Clock size={12} /> {genSeconds}s · ~45 min by hand
          </span>
          {!signed && <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 ff-mono"><PenLine size={12} /> click any line to edit</span>}
        </div>
        <button onClick={onAnother} className="text-sm text-slate-400 hover:text-white">+ Another report</button>
      </div>

      <DocumentChrome
        result={result} reportType={reportType} ctx={ctx}
        verified={verified} setVerified={setVerified}
        edits={edits} onEdit={(k, v) => setEdits((e) => ({ ...e, [k]: v }))}
        signOff={signOff} editable={!signed}
      />

      {showSign && (
        <div className="bg-slate-900 rounded-xl border border-teal-800 p-5 space-y-3">
          <h4 className="ff-display font-bold text-white text-sm flex items-center gap-2"><PenLine size={15} className="text-teal-400" /> QA sign-off</h4>
          <label className="block">
            <span className="ff-mono text-[11px] uppercase tracking-wide text-slate-500">Inspector name &amp; stamp</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. R. Alvarez — QA-117"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-teal-400 outline-none" />
          </label>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={attested} onChange={(e) => setAttested(e.target.checked)} className="mt-1 accent-teal-400" />
            <span className="text-sm text-slate-300">I have reviewed each section against the source evidence and attest this objective quality evidence is accurate and complete.</span>
          </label>
          <div className="flex items-center gap-2 pt-1">
            <button onClick={confirmSign} disabled={!name.trim() || !attested}
              className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                name.trim() && attested ? "bg-teal-400 text-slate-950 hover:bg-teal-300" : "bg-slate-800 text-slate-600 cursor-not-allowed"}`}>
              <Check size={15} /> Sign &amp; lock
            </button>
            <button onClick={() => setShowSign(false)} className="text-sm text-slate-400 hover:text-white px-3 py-2">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2 text-sm">
          {signed
            ? <><CircleCheck size={18} className="text-emerald-400" /> <span className="text-slate-300">Signed by <span className="text-white font-medium">{signOff.name}</span> · <span className="ff-mono text-xs">{signOff.date}</span></span></>
            : allVerified
              ? <><CircleCheck size={18} className="text-emerald-400" /> <span className="text-slate-300">All sections verified — ready for QA sign-off.</span></>
              : <><AlertTriangle size={18} className="text-amber-400" /> <span className="text-slate-300"><span className="ff-mono">{verifiedCount}/{totalSections}</span> sections verified. Check each against the evidence.</span></>}
        </div>
        <div className="flex items-center gap-2">
          {!signed && (
            <button disabled={!allVerified} onClick={() => setShowSign(true)}
              className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                allVerified ? "bg-teal-400 text-slate-950 hover:bg-teal-300" : "bg-slate-800 text-slate-600 cursor-not-allowed"}`}>
              <PenLine size={15} /> QA sign-off
            </button>
          )}
          <button onClick={onExport}
            className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
              signed ? "bg-teal-400 text-slate-950 border-teal-400 hover:bg-teal-300 font-semibold" : "border-slate-700 text-slate-300 hover:border-teal-400 hover:text-teal-300"}`}>
            <Download size={15} /> Export
          </button>
        </div>
      </div>
    </div>
  );
}

function EditableText({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  React.useEffect(() => { setVal(value); }, [value]);
  if (editing) {
    return (
      <textarea autoFocus value={val} rows={4}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => { onSave(val); setEditing(false); }}
        className="w-full text-sm text-slate-800 bg-white border border-teal-400 rounded-md p-2 leading-relaxed resize-y outline-none" />
    );
  }
  return (
    <p onClick={() => setEditing(true)} title="Click to edit"
      className="text-sm text-slate-700 leading-relaxed cursor-text rounded -mx-1 px-1 hover:bg-stone-100 transition-colors">
      {value}
    </p>
  );
}

// The generated document renders as light "paper" against the dark UI.
function DocumentChrome({ result, reportType, ctx, verified, setVerified, editable, edits, onEdit, signOff }) {
  return (
    <div className="bg-stone-50 text-slate-900 rounded-xl overflow-hidden kglow">
      <div className="px-5 py-4 border-b border-stone-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="ff-mono text-[10px] text-slate-400 uppercase tracking-widest">{typeLabel(reportType)}</p>
            <p className="ff-display font-extrabold text-lg leading-tight mt-0.5 text-slate-900">{result.summary}</p>
          </div>
          <span className={`ff-mono text-[10px] px-2 py-1 rounded border ${sevColorDoc(result.severity)}`}>{result.severity}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mt-4 pt-3 border-t border-stone-200">
          {[["Report", result.reportNumber], ["Hull", ctx.ship], ["Avail", (ctx.availability || "").split(" · ")[0]], ["Loc", ctx.location]].map(([k, v]) => (
            <div key={k}>
              <p className="ff-mono text-[9px] uppercase tracking-wider text-slate-400">{k}</p>
              <p className="ff-mono text-xs text-slate-700 truncate">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-stone-200">
        {result.sections.map((s) => {
          const isVer = !!(verified && verified[s.key]);
          const content = effContent(edits, s.key, s.content);
          return (
            <div key={s.key} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h4 className="ff-mono text-xs font-bold uppercase tracking-wide text-slate-500">{s.label}</h4>
                {editable && (
                  <button onClick={() => setVerified((v) => ({ ...v, [s.key]: !v[s.key] }))}
                    className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors ${
                      isVer ? "text-emerald-700 bg-emerald-100 border-emerald-300" : "text-amber-700 bg-amber-100 border-amber-300 hover:bg-amber-200"}`}>
                    {isVer ? <><Check size={12} /> Verified</> : "Verify"}
                  </button>
                )}
              </div>
              {editable && onEdit
                ? <EditableText value={content} onSave={(v) => onEdit(s.key, v)} />
                : <p className="text-sm text-slate-700 leading-relaxed">{content}</p>}
              {s.sources && s.sources.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] text-slate-400">Evidence:</span>
                  {s.sources.map((idx) => {
                    const ph = SAMPLE_PHOTOS.find((p) => p.id === idx);
                    return (
                      <span key={idx} className="inline-flex items-center gap-1 ff-mono text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                        <Camera size={10} /> #{idx}{ph ? ` ${ph.cap.split(",")[0]}` : ""}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {signOff ? (
        <div className="px-5 py-4 bg-emerald-50 border-t border-emerald-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0"><Check size={18} /></div>
          <div className="min-w-0">
            <p className="ff-mono text-[10px] uppercase tracking-wider text-emerald-700">Quality Assurance Sign-off</p>
            <p className="text-sm font-semibold text-slate-900 truncate">{signOff.name}</p>
            <p className="ff-mono text-[11px] text-slate-500">{signOff.date} · OQE attested accurate &amp; complete</p>
          </div>
        </div>
      ) : (
        <div className="px-5 py-3 bg-stone-100 border-t border-stone-200 flex items-center gap-2 ff-mono text-[11px] text-slate-500">
          <ShieldCheck size={13} /> Generated as draft OQE · requires QA verification &amp; sign-off before submission
        </div>
      )}
    </div>
  );
}

function Documents({ onOpen }) {
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? LIBRARY : LIBRARY.filter((d) => d.type === filter);
  return (
    <div className="space-y-5">
      <div>
        <span className="ff-mono text-xs tracking-widest uppercase text-teal-400">Archive</span>
        <h2 className="ff-display text-2xl font-extrabold tracking-tight text-white mt-1">Documents</h2>
        <p className="text-slate-400 text-sm mt-1">Every report generated this availability, with full evidence trail.</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {[["all", "All"], ["cfr", "Condition Found"], ["oqe", "OQE Packages"], ["daily", "Daily Reports"], ["tip", "Test Plans"]].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              filter === id ? "bg-teal-400 text-slate-950 border-teal-400" : "bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500"}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {shown.map((d) => (
          <button key={d.reportNumber} onClick={() => onOpen(d)}
            className="text-left bg-slate-900 rounded-xl border border-slate-800 hover:border-teal-700 transition-all p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`ff-mono text-[10px] px-1.5 py-0.5 rounded border ${sevColor(d.severity)}`}>{d.severity}</span>
              <span className="text-[11px] text-slate-500">{d.date}</span>
            </div>
            <p className="font-semibold text-white text-sm leading-snug">{d.summary}</p>
            <p className="ff-mono text-xs text-slate-500 mt-1">{d.reportNumber} · {typeLabel(d.type)}</p>
            <div className="mt-3 flex items-center gap-1.5">
              {d.status === "Verified" ? <CircleCheck size={14} className="text-emerald-400" /> : <Clock size={14} className="text-amber-400" />}
              <span className="text-xs text-slate-400">{d.status}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DocViewer({ doc, onClose }) {
  return (
    <div className="fixed inset-0 z-30 bg-slate-950/75 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
      <div className="bg-slate-900 w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-slate-800" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <span className="ff-mono text-xs text-slate-400">{doc.reportNumber}</span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-4">
          <DocumentChrome result={doc} reportType={doc.type} ctx={SAMPLE_CONTEXT} verified={{}} setVerified={() => {}} editable={false} edits={{}} onEdit={null} signOff={null} />
        </div>
      </div>
    </div>
  );
}

// Full-page, print-ready export of the finished deliverable.
function PrintView({ result, ctx, edits, signOff, reportType, onClose }) {
  const [format, setFormat] = useState(signOff ? "submission" : "working");
  const submission = format === "submission";
  return (
    <div className="fixed inset-0 z-40 bg-slate-950/85 overflow-y-auto">
      <div className="no-print sticky top-0 flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="ff-mono text-xs text-slate-400">Export · {result.reportNumber}</span>
          <div className="flex rounded-lg border border-slate-700 overflow-hidden">
            {[["working", "Working copy"], ["submission", "Submission (NMD-ready)"]].map(([id, label]) => (
              <button key={id} onClick={() => setFormat(id)}
                className={`text-xs px-3 py-1.5 transition-colors ${format === id ? "bg-teal-400 text-slate-950 font-semibold" : "text-slate-300 hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg">
            <Printer size={15} /> Print / Save as PDF
          </button>
          <button onClick={onClose} className="text-sm text-slate-300 hover:text-white px-3 py-2 border border-slate-700 rounded-lg">Close</button>
        </div>
      </div>

      <div className="print-page bg-white text-slate-900 max-w-3xl mx-auto my-6 p-10 rounded-sm shadow-2xl">
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
          <div>
            <p className="ff-mono text-[11px] uppercase tracking-widest text-slate-500">{typeLabel(reportType)}</p>
            <h1 className="ff-display font-extrabold text-2xl text-slate-900 mt-1 leading-tight">{result.summary}</h1>
          </div>
          <div className="text-right">
            <p className="ff-display font-extrabold text-lg text-slate-900">KEELSON</p>
            <p className="ff-mono text-[10px] text-slate-500">{result.reportNumber}</p>
          </div>
        </div>

        {submission && (
          <div className={`mt-4 rounded-md px-3 py-2 ff-mono text-[11px] flex items-center gap-2 ${signOff ? "bg-teal-50 text-teal-800 border border-teal-200" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
            <ShieldCheck size={13} /> {signOff
              ? "Submission package — formatted for the Navy Maintenance Database (NMD). Required fields mapped."
              : "Submission format selected — complete QA sign-off before this package is submission-ready."}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-slate-300">
          {[["Hull", ctx.ship], ["Availability", (ctx.availability || "").split(" · ")[0]], ["Work item", ctx.workItem], ["Location", ctx.location]].map(([k, v]) => (
            <div key={k}>
              <p className="ff-mono text-[9px] uppercase tracking-wider text-slate-400">{k}</p>
              <p className="ff-mono text-xs text-slate-800">{v}</p>
            </div>
          ))}
        </div>

        <div className="py-2">
          {result.sections.map((s, i) => (
            <div key={s.key} className="py-3 border-b border-slate-200">
              <h2 className="ff-mono text-xs font-bold uppercase tracking-wide text-slate-600 mb-1">{i + 1}. {s.label}</h2>
              <p className="text-sm text-slate-800 leading-relaxed">{effContent(edits, s.key, s.content)}</p>
              {s.sources && s.sources.length > 0 && (
                <p className="ff-mono text-[10px] text-slate-500 mt-1.5">
                  Evidence: {s.sources.map((idx) => `#${idx}`).join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>

        {signOff ? (
          <div className="mt-5 pt-4 border-t-2 border-slate-900 flex items-end justify-between">
            <div>
              <p className="ff-mono text-[10px] uppercase tracking-wider text-slate-500">Quality Assurance Sign-off</p>
              <p className="text-base font-semibold text-slate-900 mt-1" style={{ fontFamily: "cursive" }}>{signOff.name}</p>
              <p className="ff-mono text-[11px] text-slate-500">{signOff.date}</p>
            </div>
            <p className="ff-mono text-[10px] text-slate-500 max-w-[16rem] text-right">OQE reviewed against source evidence and attested accurate &amp; complete.</p>
          </div>
        ) : (
          <p className="mt-5 pt-4 border-t border-slate-300 ff-mono text-[10px] text-slate-400">DRAFT — pending QA verification &amp; sign-off. Not for submission.</p>
        )}

        <p className="ff-mono text-[9px] text-slate-400 mt-6 text-center">Generated with Keelson · runs in your environment · controlled information never leaves your boundary</p>
      </div>
    </div>
  );
}

function Security() {
  const rows = [
    { icon: Server, t: "Runs in your tenant", d: "Deployed inside your own cloud or on-prem. Evidence and reports never leave your environment." },
    { icon: Lock, t: "CUI & ITAR handling", d: "Built for controlled unclassified information. Access logging and role-based permissions on every document." },
    { icon: ShieldCheck, t: "Human-verified OQE", d: "Nothing is auto-submitted. Every section requires QA verification against source evidence before sign-off." },
    { icon: Gauge, t: "Full evidence trail", d: "Each report line links back to the photo and field note it came from. Auditable end to end." },
  ];
  return (
    <div className="space-y-5">
      <div>
        <span className="ff-mono text-xs tracking-widest uppercase text-teal-400">Security &amp; deployment</span>
        <h2 className="ff-display text-2xl font-extrabold tracking-tight text-white mt-1">Built for controlled information</h2>
        <p className="text-slate-400 text-sm mt-1">The answer to the first question every contracts office asks.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {rows.map((r) => (
          <div key={r.t} className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <div className="w-10 h-10 rounded-lg bg-teal-900 border border-teal-800 text-teal-300 flex items-center justify-center mb-3"><r.icon size={19} /></div>
            <p className="ff-display font-bold text-white">{r.t}</p>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">{r.d}</p>
          </div>
        ))}
      </div>
      <div className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl p-5 text-sm leading-relaxed">
        <p className="text-white font-semibold mb-1 flex items-center gap-2 ff-display"><Lock size={16} className="text-teal-400" /> Why this matters here</p>
        Ship-repair documentation touches CUI. A tool that ships your data to someone else's cloud is a non-starter with a contracts office. Keelson is designed to live where your data already lives — so adoption doesn't require a security exception.
      </div>
    </div>
  );
}
