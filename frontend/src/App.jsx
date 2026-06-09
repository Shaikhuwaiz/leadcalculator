import { useEffect, useState } from "react";
import WeatherScene from "./components/WeatherScene";
import { getLeadtimeStartYMD, getTodayChicagoYMD } from "./utils/dateUtils";
import { addBusinessDaysFromYMD } from "./data/addBusinessDays";
import { formatChicagoDate } from "./utils/chicagoDate";
import { holidays } from "./data/holidays";
import Select from "react-select";
import columnsRaw from "./utils/columns.js";

function NotesList({ items, storageKey, onOpen, onDelete }) {
  items = items || JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (!items || items.length === 0) return <div style={{ color: "#64748b", padding: 12, fontSize: 13 }}>No saved notes</div>;

  const accents = ["#0ea5e9", "#38bdf8", "#60a5fa", "#22c55e", "#f97316", "#a855f7", "#f472b6", "#eab308"];
  return items.map((note, index) => {
    const accent = accents[index % accents.length];
    return (
      <div key={note.id} style={{ background: "rgba(2,6,23,0.25)", borderRadius: 12, padding: 12, marginBottom: 10, border: `1px solid ${accent}33`, boxShadow: "0 8px 18px rgba(0,0,0,0.25)", display: "flex", gap: 10 }}>
        <div style={{ width: 4, background: accent, borderRadius: 999 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: accent }}>{note.title || "Untitled"}</div>
          <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 6, minHeight: 38, wordBreak: "break-word", overflow: "hidden" }}>{note.content ? (note.content.length > 140 ? note.content.slice(0, 140) + "..." : note.content) : <em>No content</em>}</div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 10 }}>{new Date(note.createdAt).toLocaleString()}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 8 }}>
          <button onClick={() => onOpen(note)} style={{ background: accent + "22", border: "1px solid " + accent, color: accent, cursor: "pointer", fontWeight: 700, borderRadius: 8, padding: "6px 10px" }}>Open</button>
          <button onClick={() => { if (confirm(`Delete note "${note.title || 'Untitled'}"?`)) onDelete(note.id); }} style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", fontWeight: 700 }}>Delete</button>
        </div>
      </div>
    );
  });
}

const DOMESTIC_PROGRAMS = [
  { code: "Domestic", business_days: 8 },
  { code: "USA", business_days: 10 },
  { code: "Apparel DTG", business_days: 30 },
  { code: "PMDTG (Vulcan)", business_days: 30 },
  { code: "PMGDTG (Tape)", business_days: 8 },
  { code: "Domestic Blank", business_days: 3 },
  { code: "USA Blank", business_days: 8 },
  { code: "Apparel Blank", business_days: 3 },
  { code: "PMBelt Blank", business_days: 3 },
];

const DOMESTIC_CODES = new Set(DOMESTIC_PROGRAMS.map((p) => p.code));

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [notes, setNotes] = useState(() => localStorage.getItem("leadtime_notes") || "");
  // extras_texts removed (unused state)

  useEffect(() => {
    const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/+$/g, "");
    fetch(`${apiBase}/api/leadtime`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const sheetPrograms = data.filter((item) => !DOMESTIC_CODES.has(item.code));
  const allPrograms = loading ? [] : [...DOMESTIC_PROGRAMS, ...sheetPrograms];
  const options = allPrograms.map((item) => ({ value: item.code, label: item.code }));

  const todayLabel = formatChicagoDate(getTodayChicagoYMD());
  const leadtimeStartYmd = getLeadtimeStartYMD(holidays);

  let selectedDate = "TBD";
  const selectedProgram = allPrograms.find((item) => item.code === selected);
  if (selectedProgram) {
    const resultYmd = addBusinessDaysFromYMD(leadtimeStartYmd, Number(selectedProgram.business_days || 0), holidays);
    selectedDate = formatChicagoDate(resultYmd);
  }

  const customSelectStyles = {
    container: (base) => ({
      ...base,
      width: "100%",
    }),
    control: (base) => ({
      ...base,
      backgroundColor: "#1e293b",
      borderColor: "#334155",
      borderRadius: "12px",
      height: "58px",
      minHeight: "58px",
      color: "white",
      boxShadow: "none",
      fontSize: "15px",
      width: "100%",
    }),
    valueContainer: (base) => ({
      ...base,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      display: "flex",
      flexWrap: "nowrap",
      padding: "2px 8px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
      fontFamily: "Inter, sans-serif",
      fontSize: "15px",
      fontWeight: "500",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: "100%",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    menu: (base) => ({ ...base, backgroundColor: "#1e293b", borderRadius: "12px", overflow: "hidden" }),
    menuList: (base) => ({ ...base, paddingTop: 0, paddingBottom: 0, maxHeight: "280px", overflowY: "auto" }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? "#38bdf8" : "#1e293b", color: "white", padding: "14px", fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: "500" }),
    placeholder: (base) => ({ ...base, color: "#94a3b8", fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: "600" }),
    input: (base) => ({ ...base, color: "white" }),
  };

  const [notesList, setNotesList] = useState(() => JSON.parse(localStorage.getItem("leadtime_notes_named_array") || "[]"));
  const [openViewerNote, setOpenViewerNote] = useState(null);
  const [scratchpadVisible, setScratchpadVisible] = useState(true);

  // Parse columns raw into 3 arrays, collapsing duplicate lines (case/punctuation variants)
  const parsedColumns = (function parseColumns(raw) {
    if (!raw) return [[], [], []];
    const parts = raw
      .split(/column\s*\d+\s*=/i)
      .slice(1)
      .map((p) => p.split("\n").map((l) => l.trim()).filter(Boolean));

    const normalizeForCompare = (s) =>
      s
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const deduped = parts.map((lines) => {
      const out = [];
      let prevNorm = null;
      for (const line of lines) {
        const n = normalizeForCompare(line);
        if (prevNorm && n === prevNorm) continue;
        out.push(line);
        prevNorm = n;
      }
      return out;
    });

    while (deduped.length < 3) deduped.push([]);
    return deduped.slice(0, 3);
  })(columnsRaw || "");

  // NotesList is declared at top-level to avoid creating components during render

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "hidden" }}>
      <div style={{ flex: 1, overflow: "auto", padding: "30px 20px 150px 20px" }}>
        <nav style={{ display: "flex", gap: 8, background: "rgba(30,41,59,0.6)", padding: 6, borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 9999 }}>
          {[{ id: "home", label: "Home" }, { id: "extras", label: "Extras" }, { id: "holiday", label: "Holiday" }, { id: "notes", label: "Notes" }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: activeTab === tab.id ? "#38bdf8" : "transparent", color: activeTab === tab.id ? "#0f172a" : "#cbd5e1", border: "none", padding: "10px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{tab.label}</button>
          ))}
        </nav>

        {activeTab === "home" && (
          <div className="dashboard-grid" style={{ position: "relative", zIndex: 10 }}>
            <div className="dashboard-left">
              <div className="dashboard-card dropdown-card">
                <div style={{ fontSize: 20, color: "#cbd5e1" }}>
                  Date: <strong style={{ color: "white" }}>{todayLabel}</strong>
                </div>
                <Select
                  options={options}
                  value={options.find((o) => o.value === selected)}
                  onChange={(opt) => setSelected(opt?.value || "")}
                  placeholder={loading ? "Loading..." : "Select Leadtime Type..."}
                  menuPlacement="auto"
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  isSearchable={false}
                />
              </div>

              <div className="dashboard-card leadtime-card">
                <div style={{ fontSize: 14, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                  Leadtime Result
                </div>
                <div className="leadtime-date" style={{ color: selectedDate === "TBD" ? "#94a3b8" : "#38bdf8" }}>
                  {selectedDate}
                </div>
              </div>
            </div>

            <div className="weather-panel">
              <WeatherScene />
            </div>
          </div>
        )}

        {activeTab === "holiday" && (
          <div style={{ maxWidth: "100%", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", paddingLeft: "20px", paddingRight: "20px" }}>
            <h2 style={{ fontSize: 28, marginBottom: 10, color: "white" }}>Holidays Calendar</h2>
            <p style={{ color: "#94a3b8", marginBottom: 30, maxWidth: "800px", textAlign: "center" }}>The following holidays are observed and excluded from business day leadtime calculations.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, justifyContent: "center", width: "100%", maxWidth: "1000px" }}>
              {holidays.map((holiday) => {
                const dateObj = new Date(holiday.date);
                const formattedDate = dateObj.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
                const todayStr = getTodayChicagoYMD();
                const isCurrentOrFuture = holiday.date >= todayStr;
                return (
                  <div key={holiday.date} style={{ background: "rgba(30,41,59,0.5)", border: isCurrentOrFuture ? "1px solid rgba(56,189,248,0.4)" : "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 20, position: "relative" }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#38bdf8", marginBottom: 6 }}>{holiday.name}</div>
                    {isCurrentOrFuture && <span style={{ position: "absolute", top: 12, right: 12, background: "#38bdf8", color: "#0f172a", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase" }}>Upcoming</span>}
                    <div style={{ fontSize: 14, color: isCurrentOrFuture ? "#38bdf8" : "#94a3b8", fontWeight: 600, marginBottom: 6 }}>{holiday.date}</div>
                    <div style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>{formattedDate}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "extras" && (
          <div style={{ maxWidth: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 24, paddingLeft: "20px", paddingRight: "20px" }}>
            <h2 style={{ fontSize: 28, marginBottom: 10, color: "white" }}>Extras</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, width: "100%" }}>
              <div style={{ padding: 18, borderRadius: 12, background: "rgba(2,6,23,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 8, fontWeight: 600, textTransform: "uppercase" }}>Order Entry</div>
                <div style={{ fontSize: 16, color: "white", fontWeight: 700 }}>OE {formatChicagoDate(getTodayChicagoYMD()).slice(0,5)} AWS</div>
                <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 8, fontWeight: 600, textTransform: "uppercase" }}>Vulcan</div>
                <div style={{ fontSize: 16, color: "white", fontWeight: 700 }}>OE DTG {formatChicagoDate(getTodayChicagoYMD()).slice(0,5)} AWS</div>
              </div>

              <div style={{ padding: 18, borderRadius: 12, background: "rgba(2,6,23,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 8, fontWeight: 600, textTransform: "uppercase" }}>Prebook Dates</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 15, color: "white", fontWeight: 700 }}>+30: {formatChicagoDate(addBusinessDaysFromYMD(getTodayChicagoYMD(), 30, holidays))}</div>
                  <div style={{ fontSize: 15, color: "white", fontWeight: 700 }}>+60: {formatChicagoDate(addBusinessDaysFromYMD(getTodayChicagoYMD(), 60, holidays))}</div>
                  <div style={{ fontSize: 15, color: "white", fontWeight: 700 }}>+90: {formatChicagoDate(addBusinessDaysFromYMD(getTodayChicagoYMD(), 90, holidays))}</div>
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(30,41,59,0.4)", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(56,189,248,0.2)", width: "100%" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", borderBottom: "2px solid rgba(56,189,248,0.3)" }}>
                {['Column 1','Column 2','Column 3'].map((t,i)=> (
                  <div key={i} style={{ padding: 16, background: 'rgba(56,189,248,0.1)', fontWeight:700, color:'#38bdf8', textTransform:'uppercase', fontSize:13, borderRight: i<2 ? '1px solid rgba(56,189,248,0.2)': 'none' }}>{t}</div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {parsedColumns.map((col, colIndex) => (
                  <div key={colIndex} style={{ borderRight: colIndex<2 ? '1px solid rgba(255,255,255,0.05)' : 'none', maxHeight: "400px", overflowY: "auto" }}>
                    {col && col.length>0 ? col.map((line, li) => {
                      if (colIndex === 1) {
                        const m = line.match(/^([A-Za-z0-9-]+)\s*(.*)$/);
                        const code = m ? m[1] : null;
                        const desc = m ? m[2] : line;
                        return (
                          <div key={li} style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <div style={{ color: '#38bdf8', fontWeight: 700, minWidth: 80 }}>{code}</div>
                            <div style={{ color: '#cbd5e1', lineHeight: 1.4 }}>{desc}</div>
                          </div>
                        );
                      }
                      return <div key={li} style={{ padding: '10px 12px', color:'#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{line}</div>;
                    }) : <div style={{ padding:12, color:'#64748b' }}>No data</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div style={{ maxWidth: "100%", margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20, paddingLeft: "20px", paddingRight: "20px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontSize: 28, marginBottom: 6, color: 'white' }}>Scratchpad Notes</h2>
                </div>
                <button onClick={() => setScratchpadVisible(v => !v)} style={{ background: scratchpadVisible ? 'rgba(56,189,248,0.15)' : 'rgba(34,197,94,0.18)', border: `1px solid ${scratchpadVisible ? 'rgba(56,189,248,0.4)' : 'rgba(34,197,94,0.5)'}`, color: scratchpadVisible ? '#38bdf8' : '#86efac', borderRadius: 999, padding: '10px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>{scratchpadVisible ? 'Hide Scratchpad' : '+ Create note'}</button>
              </div>

              {scratchpadVisible && (
                <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding:18 }}>
<textarea
  value={notes}
  onChange={(e) => {
    setNotes(e.target.value);
    localStorage.setItem('leadtime_notes', e.target.value);
  }}
  draggable={false}
  style={{
    width: '95%',
    minHeight: 200,
    background: 'rgba(15,23,42,0.7)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 18,
    color: 'white',
    resize: 'none',
    overflowY: 'auto',
    overflowX: 'hidden',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    outline: 'none',
    cursor: 'text'
  }}
/>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, flexWrap: 'wrap', gap: 10 }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>Auto-saved to Browser Storage</span>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button onClick={() => { if (confirm('Are you sure you want to clear your notes?')) { setNotes(''); setOpenViewerNote(null); localStorage.removeItem('leadtime_notes'); } }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '8px 16px', borderRadius: 8 }}>Clear Notes</button>
                      <button onClick={() => { const titlePrompt = prompt('Save note as (enter a title):', ''); if (!titlePrompt) return; const key = 'leadtime_notes_named_array'; const existing = JSON.parse(localStorage.getItem(key) || '[]'); const note = { id: Date.now().toString(), title: titlePrompt, content: notes || '', createdAt: Date.now(), updatedAt: Date.now() }; const updated = [note, ...existing]; localStorage.setItem(key, JSON.stringify(updated)); setNotesList(updated); setNotes(''); alert(`Saved note "${titlePrompt}".`); }} style={{ background: 'linear-gradient(90deg,#06b6d4,#3b82f6)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: 8 }}>Save Note</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: "100%" }}>
              <div style={{ color: '#94a3b8', fontSize: 13 }}>Saved Notes</div>
              <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: 12, padding: 8, maxHeight: '400px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.04)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`.savedNotesList::-webkit-scrollbar { display: none; }`}</style>
                <NotesList items={notesList} storageKey={'leadtime_notes_named_array'} onOpen={(n)=>setOpenViewerNote(n)} onDelete={(id)=>{ const key='leadtime_notes_named_array'; const existing = JSON.parse(localStorage.getItem(key) || '[]'); const updated = existing.filter((x)=>x.id !== id); localStorage.setItem(key, JSON.stringify(updated)); setNotesList(updated); setNotes('');
setScratchpadVisible(false); if (openViewerNote && openViewerNote.id === id) setOpenViewerNote(null); }} />
              </div>
            </div>
          </div>
        )}

        {openViewerNote && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,6,23,0.6)', zIndex: 20000, padding: "20px" }} onClick={()=>setOpenViewerNote(null)}>
            <div onClick={(e)=>e.stopPropagation()} style={{ width: '100%', maxWidth: '720px', maxHeight: '80vh', overflowY: 'auto', background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{openViewerNote.title}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{new Date(openViewerNote.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <button onClick={()=>setOpenViewerNote(null)} style={{ background: 'transparent', border: 'none', color: '#60a5fa' }}>Close</button>
                </div>
              </div>
              <div style={{ marginTop: 12, whiteSpace: 'pre-wrap', color: '#e6eef8' }}>{openViewerNote.content || <em>No content</em>}</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
