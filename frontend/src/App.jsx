import { useEffect, useState } from "react";
import WeatherScene from "./components/WeatherScene";
import { getLeadtimeStartYMD, getTodayChicagoYMD } from "./utils/dateUtils";
import { addBusinessDaysFromYMD } from "./data/addBusinessDays";
import { formatChicagoDate } from "./utils/chicagoDate";
import { holidays } from "./data/holidays";
import Select from "react-select";
import columnsRaw from "./utils/columns.js";
import policyCalculator from "./utils/policycalculator";
import seedUpdates from "./utils/update";

const EDITOR_PIN = "7860";
const BLOCKED_UPDATE_CONTENTS = new Set(["dsds", "sdsdsdsdsd"]);

const sanitizeUpdates = (value) => {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => {
    if (!item || typeof item !== "object") return false;
    const content = String(item.content || "").trim();
    const normalizedContent = content.toLowerCase();
    const dateValue = String(item.date || "").trim();
    if (!content) return false;
    if (BLOCKED_UPDATE_CONTENTS.has(normalizedContent)) return false;
    if (dateValue === "8/6/2026, 3:13 PM") return false;
    return true;
  });
};

const mergeUpdates = (storedValue) => {
  const seedEntries = sanitizeUpdates(seedUpdates || []);
  const storedEntries = sanitizeUpdates(storedValue);
  const merged = [...storedEntries, ...seedEntries];
  const seen = new Set();
  const deduped = [];

  for (const item of merged) {
    const key = `${String(item.date || "").trim()}::${String(item.content || "").trim()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped;
};

const DOMESTIC_PROGRAMS = [
  { code: "Domestic", business_days: 8 },
  { code: "USA", business_days: 14 },
  { code: "STAFF", business_days: 15 },
  { code: "Apparel DTG", business_days: 30 },
  { code: "PMBELT (Vulcan)", business_days: 30 },
  { code: "PMBELT (Tape)", business_days: 8 },
  { code: "Domestic Blank", business_days: 3 },
  { code: "USA Blank", business_days: 8 },
  { code: "Apparel Blank", business_days: 3 },
  { code: "PMBELT Blank", business_days: 3 },
];

const DOMESTIC_CODES = new Set(DOMESTIC_PROGRAMS.map((p) => p.code));

const getChicagoUpdateStamp = (inputDateTime = null) => {
  const parsedDate = inputDateTime ? new Date(inputDateTime) : new Date();
  const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(safeDate);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(safeDate);

  return `${formattedDate}, ${formattedTime}`;
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [selectedPolicyType, setSelectedPolicyType] = useState("DOMESTIC");
  const [updates, setUpdates] = useState(() => {
    try {
      const stored = localStorage.getItem("leadtime_updates");
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = mergeUpdates(parsed);
        if (JSON.stringify(merged) !== stored) {
          localStorage.setItem("leadtime_updates", JSON.stringify(merged));
        }
        return merged;
      }
    } catch {}
    return mergeUpdates([]);
  });
  const [updateContent, setUpdateContent] = useState("");
  const [updateDateTime, setUpdateDateTime] = useState(() => {
    const now = new Date();
    const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    return localTime;
  });
  const [updateMessage, setUpdateMessage] = useState("");
  const [pinValue, setPinValue] = useState("");
  const [isPinUnlocked, setIsPinUnlocked] = useState(false);
  const [pinError, setPinError] = useState("");

  const policyOptions = policyCalculator.map((item) => ({ value: item.type, label: item.type }));
  // extras_texts removed (unused state)

  useEffect(() => {
    try {
      localStorage.setItem("leadtime_updates", JSON.stringify(sanitizeUpdates(updates)));
    } catch {}
  }, [updates]);

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
  let selectedProgramLabel = "Select a leadtime type";
  const selectedProgram = allPrograms.find((item) => item.code === selected);
  if (selectedProgram) {
    const resultYmd = addBusinessDaysFromYMD(leadtimeStartYmd, Number(selectedProgram.business_days || 0), holidays);
    selectedDate = formatChicagoDate(resultYmd);
    selectedProgramLabel = `${selectedProgram.code} • ${selectedProgram.business_days || 0} business days`;
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

  // Normalize holidays for display: accept either array of strings (YYYY-MM-DD)
  // or objects { date, name } so the Holiday tab doesn't show "Invalid Date".
  const holidayNameMap = {
    '2026-01-01': "New Year's Day",
    '2026-01-02': "New Year Holiday",
    '2026-05-25': 'Memorial Day',
    '2026-07-03': 'Independence Day',
    '2026-07-06': 'Independence Day',
    '2026-09-07': 'Labor Day',
    '2026-11-26': 'Thanksgiving Day',
    '2026-11-27': 'Thanksgiving Day',
    '2026-11-28': 'Thanksgiving Day',
    '2026-12-24': 'Christmas Day',
    '2026-12-25': 'Christmas Day',
    '2026-12-26': 'Christmas Day',
    '2026-12-31': "New Year's Eve",
  };

  const holidayList = (holidays || []).map((h) => {
    if (typeof h === "string") return { date: h, name: holidayNameMap[h] || "Holiday" };
    if (h && typeof h === "object" && h.date) return { date: h.date, name: h.name || holidayNameMap[h.date] || "Holiday" };
    const s = String(h);
    return { date: s, name: holidayNameMap[s] || "Holiday" };
  });

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

  const tickerItems = (updates || []).slice(0, 1).map((item) => `${item.date} — ${String(item.content || "").replace(/\s+/g, " ").trim()}`);
  const isTickerVisible = activeTab === "updates" && tickerItems.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "hidden" }}>
      <div
        style={{
          background: "linear-gradient(90deg, rgba(2,132,199,0.95), rgba(56,189,248,0.9))",
          color: "#0f172a",
          padding: "8px 12px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontSize: 13,
          fontWeight: 700,
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          opacity: isTickerVisible ? 1 : 0,
          pointerEvents: "none",
          maxHeight: isTickerVisible ? 40 : 0,
          transition: "opacity 0.2s ease, max-height 0.2s ease",
          willChange: "transform",
        }}
      >
        <div style={{ display: "inline-block", paddingLeft: "100%", animation: "ticker-scroll 60s linear infinite" }}>
          {tickerItems.concat(tickerItems).map((text, index) => (
            <span key={`${text}-${index}`} style={{ marginRight: 48 }}>{text}</span>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "30px 20px 150px 20px" }}>
        <nav style={{ display: "flex", gap: 8, background: "rgba(30,41,59,0.6)", padding: 6, borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 9999 }}>
          {[
            { id: "home", label: "Home" },
            { id: "policy_calculator", label: "Policy" },
            { id: "updates", label: "Updates" },
            { id: "extras", label: "Extras" },
            { id: "holiday", label: "Holiday" },
            { id: "notes", label: "Notes" }
          ].map((tab) => (
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
                <div style={{ position: "relative" }}>
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
                    isDisabled={loading}
                  />
                  {loading ? (
                    <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 8, color: "#38bdf8", fontSize: 13, fontWeight: 600, pointerEvents: "none" }}>
                      <div role="status" aria-label="Loading" style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(56,189,248,0.3)", borderTopColor: "#38bdf8", animation: "spin 0.8s linear infinite" }} />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="dashboard-card leadtime-card">
                <div style={{ fontSize: 14, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                  Leadtime Result
                </div>
                <div className="leadtime-date" style={{ color: selectedDate === "TBD" ? "#94a3b8" : "#38bdf8", maxWidth: "100%" }}>
                  {selectedDate}
                </div>
                <div style={{ fontSize: 13, color: "#cbd5e1", marginTop: 8, overflowWrap: "anywhere", wordBreak: "break-word" }}>
                  {selectedProgramLabel}
                </div>
              </div>
            </div>

            <div className="weather-panel">
              <WeatherScene />
            </div>
          </div>
        )}

        {activeTab === "policy_calculator" && (
          <div className="dashboard-grid" style={{ position: "relative", zIndex: 10 }}>
            <div className="dashboard-left">
              <div className="dashboard-card dropdown-card">
                <div style={{ fontSize: 20, color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  Type: <strong style={{ color: "white" }}>{selectedPolicyType}</strong>
                </div>
                <Select
                  options={policyOptions}
                  value={policyOptions.find((o) => o.value === selectedPolicyType)}
                  onChange={(opt) => setSelectedPolicyType(opt?.value || "DOMESTIC")}
                  placeholder="Select Type..."
                  menuPlacement="auto"
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  isSearchable={false}
                />
              </div>

              <div className="dashboard-card policy-result-card">
                <div style={{ fontSize: 14, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                  Backorder Policy
                </div>
                <div className="policy-result-text">
                  {policyCalculator.find((item) => item.type === selectedPolicyType)?.policy || "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "updates" && (
          <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: 20, paddingLeft: "20px", paddingRight: "20px" }}>
            <h2 style={{ fontSize: 28, marginBottom: 10, color: "white" }}>Updates Log</h2>
            <p style={{ color: "#94a3b8", marginBottom: 10 }}>Recent announcements and policy updates.</p>

            <div style={{ background: "rgba(30,41,59,0.4)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(56,189,248,0.2)", width: "100%", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" }}>
              <div style={{ padding: 16, borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ fontSize: 13, color: "#38bdf8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Live Updates</div>
              </div>

              {/* Header row */}
              <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", borderBottom: "2px solid rgba(56,189,248,0.3)" }}>
                <div style={{ padding: 16, background: 'rgba(56,189,248,0.1)', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', fontSize: 13, borderRight: '1px solid rgba(56,189,248,0.2)' }}>Date</div>
                <div style={{ padding: 16, background: 'rgba(56,189,248,0.1)', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', fontSize: 13 }}>Update</div>
              </div>

              {/* Rows */}
              <div>
                {updates && updates.length > 0 ? (
                  updates.map((item, idx) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "220px 1fr auto", borderBottom: idx < updates.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div style={{ padding: 16, color: '#38bdf8', fontWeight: 700, borderRight: '1px solid rgba(255,255,255,0.05)', fontFamily: "monospace", fontSize: 14, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                        {item.date}
                      </div>
                      <div style={{ padding: 16, color: '#e2e8f0', lineHeight: 1.6, fontSize: 14, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {item.content}
                      </div>
                      <div style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setUpdates((current) => {
                              const next = sanitizeUpdates(current.filter((_, i) => i !== idx));
                              try {
                                localStorage.setItem('leadtime_updates', JSON.stringify(next));
                              } catch {}
                              return next;
                            });
                          }}
                          style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', color: '#fda4af', borderRadius: 999, padding: '6px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>No updates available</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "holiday" && (
          <div style={{ maxWidth: "100%", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", paddingLeft: "20px", paddingRight: "20px" }}>
            <h2 style={{ fontSize: 28, marginBottom: 10, color: "white" }}>Holidays Calendar</h2>
            <p style={{ color: "#94a3b8", marginBottom: 30, maxWidth: "800px", textAlign: "center" }}>The following holidays are observed and excluded from business day leadtime calculations.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, justifyContent: "center", width: "100%", maxWidth: "1000px" }}>
              {holidayList.map((holiday) => {
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
          <div style={{ maxWidth: "900px", margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20, paddingLeft: "20px", paddingRight: "20px" }}>
            <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 18 }}>
              <div style={{ fontSize: 28, marginBottom: 6, color: 'white' }}>Notes</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>Add updates here. They will appear in the Updates tab with the current Chicago date and time.</div>

              {!isPinUnlocked ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (pinValue === EDITOR_PIN) {
                      setIsPinUnlocked(true);
                      setPinError('');
                      setPinValue('');
                    } else {
                      setPinError('Incorrect PIN. Please try again.');
                    }
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320 }}
                >
                  <div style={{ fontSize: 12, color: '#fda4af', marginBottom: 6 }}>Authentication required to edit updates.</div>
                  <label style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600 }}>Enter PIN to edit updates</label>
                  <input
                    type="password"
                    value={pinValue}
                    onChange={(e) => {
                      setPinValue(e.target.value);
                      if (pinError) setPinError('');
                    }}
                    placeholder="PIN"
                    style={{ borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.75)', color: 'white', padding: '10px 12px' }}
                  />
                  <button type="submit" style={{ alignSelf: 'flex-start', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: 999, padding: '8px 14px', fontWeight: 700, cursor: 'pointer' }}>
                    Unlock
                  </button>
                  {pinError ? <div style={{ fontSize: 12, color: '#fda4af' }}>{pinError}</div> : null}
                  <div style={{ fontSize: 12, color: '#64748b' }}></div>
                </form>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 12, color: '#86efac' }}>Unlocked for editing</div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPinUnlocked(false);
                        setPinValue('');
                        setPinError('');
                      }}
                      style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1', borderRadius: 999, padding: '6px 10px', cursor: 'pointer' }}
                    >
                      Lock
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const trimmedContent = updateContent.trim();
                      if (!trimmedContent) {
                        setUpdateMessage('Please enter update content.');
                        return;
                      }

                      const stamp = getChicagoUpdateStamp(updateDateTime);
                      const nextUpdates = [{ date: stamp, content: trimmedContent }, ...sanitizeUpdates(updates)];
                      setUpdates(nextUpdates);
                      setUpdateContent('');
                      setUpdateDateTime(() => {
                        const now = new Date();
                        const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                        return localTime;
                      });
                      setUpdateMessage('Update added successfully.');
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                  >
                    <label style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600 }}>Update date & time</label>
                    <input
                      type="datetime-local"
                      value={updateDateTime}
                      onChange={(e) => setUpdateDateTime(e.target.value)}
                      style={{ borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.75)', color: 'white', padding: '10px 12px' }}
                    />
                    <textarea
                      value={updateContent}
                      onChange={(e) => {
                        setUpdateContent(e.target.value);
                        if (updateMessage) setUpdateMessage('');
                      }}
                      placeholder="Type the update content here..."
                      rows={5}
                      style={{ borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.75)', color: 'white', padding: '10px 12px', resize: 'vertical' }}
                    />
                    <button type="submit" style={{ alignSelf: 'flex-start', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: 999, padding: '8px 14px', fontWeight: 700, cursor: 'pointer' }}>
                      Save Update
                    </button>
                  </form>
                </>
              )}
              {updateMessage ? <div style={{ marginTop: 10, fontSize: 12, color: updateMessage.includes('success') ? '#86efac' : '#fda4af' }}>{updateMessage}</div> : null}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
