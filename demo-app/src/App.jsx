import React, { useState } from "react";
import {
  Anchor, LayoutDashboard, FilePlus2, FileText, ShieldCheck, Camera, Mic,
  Sparkles, Check, AlertTriangle, Download, ChevronRight, ChevronLeft,
  Lock, Clock, PenLine, Menu, X, Gauge, CircleCheck, Server, MapPin, Printer
} from "lucide-react";
import { cn } from "./lib/cn";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { SectionLabel } from "./components/SectionLabel";
import { Stat } from "./components/Stat";
import { Field, Textarea } from "./components/Field";
import { Pill, severityTone } from "./components/Pill";

// ---------------------------------------------------------------------------
// Keelson — AI-assisted documentation for private ship-repair contractors.
// Demo build. Shares the landing page's Minimalist Modern design system
// (electric-blue accent, Fraunces/Inter/JetBrains Mono, light workspace +
// dark sidebar). Capture -> live AI draft (offline fallback) -> inline edit
// -> verify -> QA sign-off -> export.
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

const typeLabel = (t) => REPORT_TYPES.find((r) => r.id === t)?.title || "Report";
const effContent = (edits, key, fallback) => (edits && edits[key] != null ? edits[key] : fallback);
const nowStamp = () => {
  const d = new Date();
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" }) +
    " · " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

function PhotoCard({ p, small }) {
  return (
    <div className={cn("shrink-0 rounded-lg overflow-hidden border border-border bg-card shadow-sm", small ? "w-28" : "w-40")}>
      <div className={cn("relative flex items-center justify-center bg-[linear-gradient(135deg,#EEF2F7,#D9E0EA)]", small ? "h-20" : "h-28")}>
        <Camera className="text-accent/50" size={small ? 18 : 24} />
        <span className="absolute top-1 left-1 font-mono text-[9px] text-white bg-fg/60 px-1 rounded">#{p.id}</span>
      </div>
      <div className="p-1.5">
        <p className="text-[10px] leading-tight text-fg font-medium line-clamp-2">{p.cap}</p>
        <p className="font-mono text-[9px] text-muted-fg mt-0.5">{p.tag}</p>
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
  const [edits, setEdits] = useState({});
  const [signOff, setSignOff] = useState(null);
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
          model: "claude-sonnet-5",
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
    <div className="min-h-screen bg-bg text-fg flex">
      {/* SIDEBAR (inverted dark) */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-fg text-white">
        <Brand />
        <nav className="flex-1 px-3 space-y-1 mt-2">
          {nav.map((n) => {
            const active = view === n.id;
            return (
              <button key={n.id} onClick={() => go(n.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  active ? "bg-white/10 text-white font-medium" : "text-white/55 hover:bg-white/5 hover:text-white"
                )}>
                <span className={cn(active ? "text-accent-2" : "text-white/45")}><n.icon size={18} /></span>
                {n.label}
              </button>
            );
          })}
        </nav>
        <DataResidency />
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 inset-x-0 z-20 bg-fg text-white flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-md flex items-center justify-center text-white bg-[linear-gradient(135deg,var(--accent),var(--accent-2))]"><Anchor size={16} /></span>
          <span className="font-display text-lg">Keelson</span>
        </div>
        <button onClick={() => setMobileNav((v) => !v)} aria-label="Menu">{mobileNav ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {mobileNav && (
        <div className="md:hidden fixed top-14 inset-x-0 z-20 bg-fg text-white px-3 py-2 space-y-1 shadow-lg">
          {nav.map((n) => (
            <button key={n.id} onClick={() => go(n.id)}
              className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm", view === n.id ? "bg-white/10 text-white" : "text-white/70")}>
              <n.icon size={18} /> {n.label}
            </button>
          ))}
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <header className="hidden md:flex items-center justify-between px-8 h-16 bg-card border-b border-border">
          <div>
            <p className="font-mono text-xs text-muted-fg uppercase tracking-widest">{ctx.availability}</p>
            <h1 className="font-display text-lg text-fg -mt-0.5">{ctx.ship}</h1>
          </div>
          <span className="flex items-center gap-2 text-xs font-medium text-accent bg-accent/[0.08] border border-accent/25 px-3 py-1.5 rounded-full">
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
    <div className="px-5 py-5 flex items-center gap-2.5 border-b border-white/10">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-accent bg-[linear-gradient(135deg,var(--accent),var(--accent-2))]">
        <Anchor size={20} />
      </div>
      <div className="leading-none">
        <p className="text-white font-display text-lg">Keelson</p>
        <p className="font-mono text-[10px] text-white/45 mt-1">ship-repair docs</p>
      </div>
    </div>
  );
}

function DataResidency() {
  return (
    <div className="m-3 p-3 rounded-lg bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 text-accent-2 text-xs font-semibold"><Server size={14} /> Your infrastructure</div>
      <p className="text-[11px] text-white/55 mt-1 leading-snug">Runs in your tenant. No data leaves your environment. CUI / ITAR handling.</p>
    </div>
  );
}

function Dashboard({ onNew, onOpen }) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="blueprint absolute -inset-x-8 -top-8 h-40 opacity-70 pointer-events-none"
          style={{ maskImage: "radial-gradient(ellipse 60% 100% at 0% 0%, #000, transparent 72%)", WebkitMaskImage: "radial-gradient(ellipse 60% 100% at 0% 0%, #000, transparent 72%)" }} />
        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <SectionLabel>This availability</SectionLabel>
            <h2 className="font-display text-[28px] text-fg mt-3">Documentation status</h2>
            <p className="text-muted-fg text-sm mt-1">Where the current maintenance period stands.</p>
          </div>
          <Button onClick={onNew} className="shrink-0"><FilePlus2 size={17} /> New report</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={FileText} value="38" label="Documents this availability" delay={0} />
        <Stat icon={Clock} value="29 hrs" label="Est. QA hours saved" accent delay={60} />
        <Stat icon={AlertTriangle} value="3" label="Growth-work CFRs open" delay={120} />
        <Stat icon={CircleCheck} value="91%" label="OQE first-pass accepted" delay={180} />
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-fg text-sm">Recent documents</h3>
          <span className="text-xs text-muted-fg font-mono">{SAMPLE_CONTEXT.ship}</span>
        </div>
        <ul className="divide-y divide-border">
          {LIBRARY.slice(0, 4).map((d) => (
            <li key={d.reportNumber}>
              <button onClick={() => onOpen(d)} className="w-full text-left px-5 py-3.5 flex items-center gap-3 hover:bg-muted transition-colors">
                <Pill tone={severityTone(d.severity)}>{d.severity}</Pill>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-fg truncate">{d.summary}</span>
                  <span className="block font-mono text-xs text-muted-fg">{d.reportNumber} · {typeLabel(d.type)}</span>
                </span>
                <span className="text-xs text-muted-fg hidden sm:block">{d.date}</span>
                <ChevronRight size={16} className="text-muted-fg/60" />
              </button>
            </li>
          ))}
        </ul>
      </Card>
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
          <h2 className="font-display text-2xl text-fg mb-1">What are you documenting?</h2>
          <p className="text-muted-fg text-sm mb-4">Pick the document. The format follows what your customer expects to receive.</p>
          {REPORT_TYPES.map((t) => (
            <Card as="button" hover key={t.id} onClick={() => { setReportType(t.id); setStep(2); }}
              className="p-4 flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 text-accent-fg shadow-accent bg-[linear-gradient(135deg,var(--accent),var(--accent-2))]">
                <t.icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-fg">{t.title}</p>
                  {t.hot && <Pill tone="accent">most common</Pill>}
                </div>
                <p className="text-sm text-muted-fg mt-0.5">{t.desc}</p>
              </div>
              <ChevronRight className="text-muted-fg/50 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </Card>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-semibold text-fg text-sm mb-3 flex items-center gap-2"><MapPin size={15} className="text-accent" /> Job context</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[["ship", "Ship / Hull"], ["availability", "Availability"], ["workItem", "Work item"], ["location", "Location"], ["trade", "Trade"]].map(([k, label]) => (
                <Field key={k} label={label} value={ctx[k]} onChange={(e) => setCtx({ ...ctx, [k]: e.target.value })} />
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-fg text-sm flex items-center gap-2"><Camera size={15} className="text-accent" /> Photo evidence</h3>
              <span className="text-xs text-muted-fg font-mono">{SAMPLE_PHOTOS.length} from the deck</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {SAMPLE_PHOTOS.map((p) => <PhotoCard key={p.id} p={p} />)}
              <div className="shrink-0 w-40 h-[152px] rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-fg text-xs gap-1">
                <Camera size={20} /> Add photo
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-fg text-sm flex items-center gap-2"><PenLine size={15} className="text-accent" /> Field notes</h3>
              <span className="inline-flex items-center gap-1.5 text-xs text-accent bg-accent/[0.08] border border-accent/25 px-2 py-1 rounded-md"><Mic size={12} /> Dictated on deck</span>
            </div>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
            <p className="text-[11px] text-muted-fg mt-2">Rough is fine — Keelson turns this into the formatted report. Nothing is fabricated; every line traces to your notes and photos.</p>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}><ChevronLeft size={16} /> Back</Button>
            <Button onClick={generate}><Sparkles size={17} /> Generate {typeLabel(reportType).split(" ")[0]} report</Button>
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
              <span className={cn(
                "w-6 h-6 rounded-full font-mono text-xs flex items-center justify-center",
                done ? "text-accent-fg bg-[linear-gradient(135deg,var(--accent),var(--accent-2))]"
                     : active ? "bg-fg text-white" : "bg-muted text-muted-fg"
              )}>
                {done ? <Check size={13} /> : n}
              </span>
              <span className={cn("text-sm", active ? "font-semibold text-fg" : "text-muted-fg")}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-border min-w-4" />}
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
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-accent-fg shadow-accent bg-[linear-gradient(135deg,var(--accent),var(--accent-2))]">
        <Sparkles className="animate-pulse" size={26} />
      </div>
      <p className="font-display text-xl text-fg">Building your report</p>
      <p className="text-sm text-muted-fg mt-1 font-mono">{msgs[i]}</p>
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
          <Pill tone={offline ? "neutral" : "accent"}><Sparkles size={12} /> {offline ? "Sample mode (offline)" : "Live AI"}</Pill>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-fg font-mono"><Clock size={12} /> {genSeconds}s · ~45 min by hand</span>
          {!signed && <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-fg font-mono"><PenLine size={12} /> click any line to edit</span>}
        </div>
        <button onClick={onAnother} className="text-sm text-muted-fg hover:text-fg">+ Another report</button>
      </div>

      <DocumentChrome
        result={result} reportType={reportType} ctx={ctx}
        verified={verified} setVerified={setVerified}
        edits={edits} onEdit={(k, v) => setEdits((e) => ({ ...e, [k]: v }))}
        signOff={signOff} editable={!signed}
      />

      {showSign && (
        <Card className="p-5 space-y-3 border-accent/30">
          <h4 className="font-semibold text-fg text-sm flex items-center gap-2"><PenLine size={15} className="text-accent" /> QA sign-off</h4>
          <Field label="Inspector name & stamp" mono={false} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. R. Alvarez — QA-117" />
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={attested} onChange={(e) => setAttested(e.target.checked)} className="mt-1 accent-accent" />
            <span className="text-sm text-fg">I have reviewed each section against the source evidence and attest this objective quality evidence is accurate and complete.</span>
          </label>
          <div className="flex items-center gap-2 pt-1">
            <Button size="sm" onClick={confirmSign} disabled={!name.trim() || !attested}><Check size={15} /> Sign &amp; lock</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowSign(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <Card className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2 text-sm">
          {signed
            ? <><CircleCheck size={18} className="text-success" /> <span className="text-fg">Signed by <span className="font-medium">{signOff.name}</span> · <span className="font-mono text-xs">{signOff.date}</span></span></>
            : allVerified
              ? <><CircleCheck size={18} className="text-success" /> <span className="text-fg">All sections verified — ready for QA sign-off.</span></>
              : <><AlertTriangle size={18} className="text-warning" /> <span className="text-fg"><span className="font-mono">{verifiedCount}/{totalSections}</span> sections verified. Check each against the evidence.</span></>}
        </div>
        <div className="flex items-center gap-2">
          {!signed && (
            <Button size="sm" onClick={() => setShowSign(true)} disabled={!allVerified}><PenLine size={15} /> QA sign-off</Button>
          )}
          <Button size="sm" variant={signed ? "primary" : "outline"} onClick={onExport}><Download size={15} /> Export</Button>
        </div>
      </Card>
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
        className="w-full text-sm text-fg bg-card border border-accent rounded-md p-2 leading-relaxed resize-y outline-none ring-2 ring-accent/20" />
    );
  }
  return (
    <p onClick={() => setEditing(true)} title="Click to edit"
      className="text-sm text-slate-700 leading-relaxed cursor-text rounded -mx-1 px-1 hover:bg-muted transition-colors">
      {value}
    </p>
  );
}

// The generated document renders as clean white "paper" within the app.
function DocumentChrome({ result, reportType, ctx, verified, setVerified, editable, edits, onEdit, signOff }) {
  return (
    <div className="bg-card text-fg rounded-xl overflow-hidden border border-border shadow-lg">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest">{typeLabel(reportType)}</p>
            <p className="font-display text-xl leading-tight mt-1 text-fg">{result.summary}</p>
          </div>
          <Pill tone={severityTone(result.severity)}>{result.severity}</Pill>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mt-4 pt-3 border-t border-border">
          {[["Report", result.reportNumber], ["Hull", ctx.ship], ["Avail", (ctx.availability || "").split(" · ")[0]], ["Loc", ctx.location]].map(([k, v]) => (
            <div key={k}>
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted-fg">{k}</p>
              <p className="font-mono text-xs text-fg truncate">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-border">
        {result.sections.map((s) => {
          const isVer = !!(verified && verified[s.key]);
          const content = effContent(edits, s.key, s.content);
          return (
            <div key={s.key} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wide text-muted-fg">{s.label}</h4>
                {editable && (
                  <button onClick={() => setVerified((v) => ({ ...v, [s.key]: !v[s.key] }))}
                    className={cn(
                      "shrink-0 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors",
                      isVer ? "text-success bg-success/10 border-success/25" : "text-warning bg-warning/10 border-warning/25 hover:bg-warning/20"
                    )}>
                    {isVer ? <><Check size={12} /> Verified</> : "Verify"}
                  </button>
                )}
              </div>
              {editable && onEdit
                ? <EditableText value={content} onSave={(v) => onEdit(s.key, v)} />
                : <p className="text-sm text-slate-700 leading-relaxed">{content}</p>}
              {s.sources && s.sources.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] text-muted-fg">Evidence:</span>
                  {s.sources.map((idx) => {
                    const ph = SAMPLE_PHOTOS.find((p) => p.id === idx);
                    return (
                      <span key={idx} className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-fg bg-muted border border-border px-1.5 py-0.5 rounded">
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
        <div className="px-5 py-4 bg-success/[0.07] border-t border-success/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-success text-white flex items-center justify-center shrink-0"><Check size={18} /></div>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-wider text-success">Quality Assurance Sign-off</p>
            <p className="text-sm font-semibold text-fg truncate">{signOff.name}</p>
            <p className="font-mono text-[11px] text-muted-fg">{signOff.date} · OQE attested accurate &amp; complete</p>
          </div>
        </div>
      ) : (
        <div className="px-5 py-3 bg-muted border-t border-border flex items-center gap-2 font-mono text-[11px] text-muted-fg">
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
        <SectionLabel>Archive</SectionLabel>
        <h2 className="font-display text-[28px] text-fg mt-3">Documents</h2>
        <p className="text-muted-fg text-sm mt-1">Every report generated this availability, with full evidence trail.</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {[["all", "All"], ["cfr", "Condition Found"], ["oqe", "OQE Packages"], ["daily", "Daily Reports"], ["tip", "Test Plans"]].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)}
            className={cn(
              "text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
              filter === id ? "text-accent-fg border-transparent bg-[linear-gradient(90deg,var(--accent),var(--accent-2))]" : "bg-card text-muted-fg border-border hover:border-accent/40"
            )}>
            {label}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {shown.map((d) => (
          <Card as="button" hover key={d.reportNumber} onClick={() => onOpen(d)} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Pill tone={severityTone(d.severity)}>{d.severity}</Pill>
              <span className="text-[11px] text-muted-fg">{d.date}</span>
            </div>
            <p className="font-semibold text-fg text-sm leading-snug">{d.summary}</p>
            <p className="font-mono text-xs text-muted-fg mt-1">{d.reportNumber} · {typeLabel(d.type)}</p>
            <div className="mt-3 flex items-center gap-1.5">
              {d.status === "Verified" ? <CircleCheck size={14} className="text-success" /> : <Clock size={14} className="text-warning" />}
              <span className="text-xs text-muted-fg">{d.status}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DocViewer({ doc, onClose }) {
  return (
    <div className="fixed inset-0 z-30 bg-fg/50 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
      <div className="bg-bg w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-border shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-card px-4 py-3 flex items-center justify-between border-b border-border">
          <span className="font-mono text-xs text-muted-fg">{doc.reportNumber}</span>
          <button onClick={onClose} className="p-1 text-muted-fg hover:text-fg"><X size={20} /></button>
        </div>
        <div className="p-4">
          <DocumentChrome doc={doc} result={doc} reportType={doc.type} ctx={SAMPLE_CONTEXT} verified={{}} setVerified={() => {}} editable={false} edits={{}} onEdit={null} signOff={null} />
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
    <div className="fixed inset-0 z-40 bg-fg/60 overflow-y-auto">
      <div className="no-print sticky top-0 flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-fg">Export · {result.reportNumber}</span>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {[["working", "Working copy"], ["submission", "Submission (agency-ready)"]].map(([id, label]) => (
              <button key={id} onClick={() => setFormat(id)}
                className={cn("text-xs px-3 py-1.5 transition-colors", format === id ? "text-accent-fg bg-[linear-gradient(90deg,var(--accent),var(--accent-2))]" : "text-muted-fg hover:text-fg")}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => window.print()}><Printer size={15} /> Print / Save as PDF</Button>
          <Button size="sm" variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>

      <div className="print-page bg-white text-slate-900 max-w-3xl mx-auto my-6 p-10 rounded-sm shadow-2xl">
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">{typeLabel(reportType)}</p>
            <h1 className="font-display text-2xl text-slate-900 mt-1 leading-tight">{result.summary}</h1>
          </div>
          <div className="text-right">
            <p className="font-display text-lg text-slate-900">Keelson</p>
            <p className="font-mono text-[10px] text-slate-500">{result.reportNumber}</p>
          </div>
        </div>

        {submission && (
          <div className={cn("mt-4 rounded-md px-3 py-2 font-mono text-[11px] flex items-center gap-2 border", signOff ? "bg-accent/[0.06] text-accent border-accent/20" : "bg-warning/10 text-warning border-warning/25")}>
            <ShieldCheck size={13} /> {signOff
              ? "Submission package — formatted for your customer's maintenance database. Required fields mapped."
              : "Submission format selected — complete QA sign-off before this package is submission-ready."}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-slate-300">
          {[["Hull", ctx.ship], ["Availability", (ctx.availability || "").split(" · ")[0]], ["Work item", ctx.workItem], ["Location", ctx.location]].map(([k, v]) => (
            <div key={k}>
              <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400">{k}</p>
              <p className="font-mono text-xs text-slate-800">{v}</p>
            </div>
          ))}
        </div>

        <div className="py-2">
          {result.sections.map((s, i) => (
            <div key={s.key} className="py-3 border-b border-slate-200">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wide text-slate-600 mb-1">{i + 1}. {s.label}</h2>
              <p className="text-sm text-slate-800 leading-relaxed">{effContent(edits, s.key, s.content)}</p>
              {s.sources && s.sources.length > 0 && (
                <p className="font-mono text-[10px] text-slate-500 mt-1.5">Evidence: {s.sources.map((idx) => `#${idx}`).join(", ")}</p>
              )}
            </div>
          ))}
        </div>

        {signOff ? (
          <div className="mt-5 pt-4 border-t-2 border-slate-900 flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Quality Assurance Sign-off</p>
              <p className="text-base font-semibold text-slate-900 mt-1" style={{ fontFamily: "cursive" }}>{signOff.name}</p>
              <p className="font-mono text-[11px] text-slate-500">{signOff.date}</p>
            </div>
            <p className="font-mono text-[10px] text-slate-500 max-w-[16rem] text-right">OQE reviewed against source evidence and attested accurate &amp; complete.</p>
          </div>
        ) : (
          <p className="mt-5 pt-4 border-t border-slate-300 font-mono text-[10px] text-slate-400">DRAFT — pending QA verification &amp; sign-off. Not for submission.</p>
        )}

        <p className="font-mono text-[9px] text-slate-400 mt-6 text-center">Generated with Keelson · runs in your environment · controlled information never leaves your boundary</p>
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
        <SectionLabel>Security &amp; deployment</SectionLabel>
        <h2 className="font-display text-[28px] text-fg mt-3">Built for controlled information</h2>
        <p className="text-muted-fg text-sm mt-1">The answer to the first question every contracts office asks.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {rows.map((r) => (
          <Card key={r.t} className="p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-accent-fg shadow-accent bg-[linear-gradient(135deg,var(--accent),var(--accent-2))]"><r.icon size={19} /></div>
            <p className="font-semibold text-fg">{r.t}</p>
            <p className="text-sm text-muted-fg mt-1 leading-relaxed">{r.d}</p>
          </Card>
        ))}
      </div>
      <Card className="p-5 text-sm leading-relaxed text-fg">
        <p className="font-semibold mb-1 flex items-center gap-2 font-display text-base"><Lock size={16} className="text-accent" /> Why this matters here</p>
        <span className="text-muted-fg">Ship-repair documentation touches CUI. A tool that ships your data to someone else's cloud is a non-starter with a contracts office. Keelson is designed to live where your data already lives — so adoption doesn't require a security exception.</span>
      </Card>
    </div>
  );
}
