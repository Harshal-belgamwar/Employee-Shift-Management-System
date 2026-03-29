import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

// Purple-anchored palette — each shift gets a tint of the master purple ramp
const SHIFT_PALETTE = [
    { accent: "#A78BFA", light: "rgba(167,139,250,0.15)", border: "rgba(167,139,250,0.35)", text: "#C4B5FD" },
    { accent: "#818CF8", light: "rgba(129,140,248,0.15)", border: "rgba(129,140,248,0.35)", text: "#A5B4FC" },
    { accent: "#C084FC", light: "rgba(192,132,252,0.15)", border: "rgba(192,132,252,0.35)", text: "#D8B4FE" },
    { accent: "#E879F9", light: "rgba(232,121,249,0.15)", border: "rgba(232,121,249,0.35)", text: "#F0ABFC" },
];

function getShiftIcon(name = "") {
    const n = name.toLowerCase();
    if (n.includes("morning")) return "🌅";
    if (n.includes("evening")) return "🌆";
    if (n.includes("night")) return "🌙";
    return "🕐";
}

function Avatar({ name }) {
    const initials = (name || "?").slice(0, 2).toUpperCase();
    const tints = [
        ["rgba(167,139,250,0.2)", "#C4B5FD"],
        ["rgba(129,140,248,0.2)", "#A5B4FC"],
        ["rgba(192,132,252,0.2)", "#D8B4FE"],
        ["rgba(232,121,249,0.2)", "#F0ABFC"],
    ];
    const [bg, fg] = tints[(name?.charCodeAt(0) || 0) % tints.length];
    return (
        <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: bg, color: fg, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700,
            border: `1.5px solid ${fg}55`,
        }}>
            {initials}
        </div>
    );
}



const Scheduler = () => {
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState([]);
    const [remainingSlots, setRemainingSlots] = useState({});
    const [selectedShift, setSelectedShift] = useState("");
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [userdata, setUserData] = useState({
        username: "",
        role: ""
    })

    const fetchUser = async () => {
        try {
            const resp = await api.get("/auth/me");
            const data = resp.data;
            if (data.role) {
                data.role = data.role.substring(5).toLowerCase();
            }
            setUserData(data);

        } catch (error) {
            toast.error(error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    const handleGenerate = async () => {
        try {
            setLoading(true);
            const response = await api.get("/admin/schedule-generate");

            console.log(response.data);
            const data = response.data;

            if (!data.scheduleAssignDTOList || data.scheduleAssignDTOList.length === 0) {
                toast.error("No preference submitted by employees");
                return;
            }
            console.log(data.scheduleAssignDTOList);

            const sorted = [...data.scheduleAssignDTOList].sort((a, b) =>
                a.shiftname.localeCompare(b.shiftname)
            );
            setSchedule(sorted);
            setScheduleData(data);
            setRemainingSlots(data.remainingSlots);
            if (sorted?.length > 0) setSelectedShift(sorted[0].shiftname);
        } catch (error) {
            console.error("Error generating schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setSchedule([]);
        setRemainingSlots({});
        setSelectedShift("");
    };

    const handleApprove = async () => {

        try {
            setLoading(true);
            const response = await api.post(`/admin/schedule-generate/approve/${userdata.username}`, scheduleData);
            const data = response.data;
            toast.success("Schedule approved successfully ✅");

            // OPTIONAL: clear UI after approval
            setSchedule([]);
            setRemainingSlots({});
            setSelectedShift("");

        } catch (error) {
            console.error("Error approving schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    const shifts = [...new Set(schedule.map((item) => item.shiftname))];
    const filteredEmployees = schedule.filter((item) => item.shiftname === selectedShift);
    const activeIndex = shifts.indexOf(selectedShift);
    const pal = SHIFT_PALETTE[activeIndex % SHIFT_PALETTE.length] || SHIFT_PALETTE[0];
    const totalAssigned = schedule.length;
    const totalRemaining = Object.values(remainingSlots).reduce((s, v) => s + v, 0);


    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

                .sch-root {
                    min-height: 100vh;
                    background: #0C0A1A;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding: 36px 24px 60px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    position: relative;
                    overflow-x: hidden;
                }

                .sch-root::before {
                    content: '';
                    position: fixed;
                    top: -200px; right: -200px;
                    width: 700px; height: 700px;
                    background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%);
                    pointer-events: none;
                }

                .sch-root::after {
                    content: '';
                    position: fixed;
                    bottom: -200px; left: -200px;
                    width: 600px; height: 600px;
                    background: radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 65%);
                    pointer-events: none;
                }

                .sch-wrap { width: 100%; max-width: 1160px; position: relative; z-index: 1; }

                /* ── Top bar ── */
                .sch-topbar {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
                }

                .sch-brand { display: flex; align-items: center; gap: 14px; }

                .sch-brand-icon {
                    width: 48px; height: 48px; border-radius: 14px;
                    background: linear-gradient(135deg, #7C3AED, #A78BFA);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 22px;
                    box-shadow: 0 0 24px rgba(139,92,246,0.4);
                }

                .sch-brand h1 {
                    font-size: 22px; font-weight: 700;
                    color: #EDE9FE;
                    margin: 0; letter-spacing: -0.4px;
                }

                .sch-brand p { font-size: 13px; color: #6D6A8A; margin: 0; }

                .sch-date-badge {
                    background: #1A1630;
                    border: 1px solid #2E2A4A;
                    border-radius: 10px; padding: 9px 16px;
                    font-size: 13px; color: #9D9ABF; font-weight: 500;
                }

                /* ── Stat cards ── */
                .sch-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 14px; margin-bottom: 20px;
                }

                .sch-stat {
                    background: #13102A;
                    border: 1px solid #2E2A4A;
                    border-radius: 14px; padding: 18px 20px;
                    display: flex; align-items: center; gap: 14px;
                    transition: border-color 0.2s;
                }

                .sch-stat:hover { border-color: rgba(167,139,250,0.4); }

                .sch-stat-icon {
                    width: 44px; height: 44px; border-radius: 11px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 20px; flex-shrink: 0;
                }

                .sch-stat-label {
                    font-size: 11px; color: #6D6A8A; font-weight: 600;
                    text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 3px;
                }

                .sch-stat-value {
                    font-size: 26px; font-weight: 700;
                    color: #EDE9FE;
                    letter-spacing: -0.6px; line-height: 1;
                }

                /* ── Main panel ── */
                .sch-main {
                    background: #13102A;
                    border: 1px solid #2E2A4A;
                    border-radius: 18px; overflow: hidden;
                }

                .sch-main-header {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    padding: 22px 28px;
                    border-bottom: 1px solid #1F1B38;
                    flex-wrap: wrap; gap: 14px;
                    background: #100E24;
                }

                .sch-main-header h2 {
                    font-size: 17px; font-weight: 700;
                    color: #DDD6FE; margin: 0;
                }

                .sch-tabs { display: flex; gap: 8px; flex-wrap: wrap; }

                .sch-tab {
                    display: flex; align-items: center; gap: 7px;
                    padding: 8px 16px; border-radius: 10px;
                    border: 1px solid #2E2A4A;
                    background: #1A1630;
                    font-size: 13px; font-weight: 600;
                    color: #6D6A8A;
                    cursor: pointer;
                    transition: all 0.15s;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .sch-tab:hover {
                    border-color: rgba(167,139,250,0.4);
                    color: #A78BFA;
                    background: rgba(167,139,250,0.08);
                }

                .sch-tab.active {
                    border-color: var(--tab-accent);
                    background: var(--tab-light);
                    color: var(--tab-text);
                }

                /* ── Ribbon ── */
                .sch-ribbon {
                    display: flex; align-items: center; gap: 12px;
                    padding: 13px 28px;
                    background: #0F0D22;
                    border-bottom: 1px solid #1F1B38;
                    flex-wrap: wrap;
                }

                .sch-ribbon-label { font-size: 13px; color: #6D6A8A; font-weight: 500; }
                .sch-ribbon-shift { font-size: 13px; font-weight: 700; color: #DDD6FE; }

                .sch-ribbon-pill {
                    display: flex; align-items: center; gap: 5px;
                    border-radius: 20px; padding: 4px 12px;
                    font-size: 12px; font-weight: 700;
                    border: 1px solid;
                }

                /* ── Employee list ── */
                .sch-list {
                    padding: 16px 28px 20px;
                    display: flex; flex-direction: column; gap: 10px;
                }

                .sch-employee-card {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    padding: 14px 18px;
                    border: 1px solid #1F1B38;
                    border-radius: 12px;
                    background: #100E24;
                    transition: border-color 0.15s, background 0.15s;
                    gap: 12px;
                }

                .sch-employee-card:hover {
                    border-color: rgba(167,139,250,0.3);
                    background: rgba(167,139,250,0.04);
                }

                .sch-emp-left { display: flex; align-items: center; gap: 13px; }

                .sch-emp-name {
                    font-size: 14px; font-weight: 600;
                    color: #DDD6FE; margin-bottom: 2px;
                }

                .sch-emp-date { font-size: 12px; color: #5C5878; }

                .sch-emp-badge {
                    font-size: 12px; font-weight: 600;
                    padding: 4px 12px; border-radius: 20px;
                    white-space: nowrap; border: 1px solid;
                }

                /* ── Empty state ── */
                .sch-empty {
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    min-height: 460px; gap: 20px; padding: 48px;
                }

                .sch-empty-ring {
                    position: relative;
                    width: 100px; height: 100px;
                }

                .sch-empty-ring .ring {
                    position: absolute; inset: 0;
                    border-radius: 50%;
                    border: 2px solid rgba(139,92,246,0.25);
                    animation: pulse-r 2.8s ease-in-out infinite;
                }

                .sch-empty-ring .ring:nth-child(2) {
                    inset: -16px;
                    animation-delay: 0.5s;
                    border-color: rgba(139,92,246,0.12);
                }

                .sch-empty-ring .center {
                    position: absolute; inset: 18px;
                    background: rgba(139,92,246,0.2);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 28px;
                    border: 1px solid rgba(167,139,250,0.3);
                }

                @keyframes pulse-r {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.06); opacity: 1; }
                }

                .sch-empty h3 {
                    font-size: 20px; font-weight: 700;
                    color: #DDD6FE; margin: 0;
                }

                .sch-empty p {
                    font-size: 14px; color: #5C5878;
                    text-align: center; max-width: 290px;
                    line-height: 1.6; margin: 0;
                }

                /* ── Generate button ── */
                .sch-btn-generate {
                    display: flex; align-items: center; gap: 9px;
                    background: linear-gradient(135deg, #7C3AED, #A78BFA);
                    color: #fff; border: none;
                    padding: 14px 32px; border-radius: 12px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 14px; font-weight: 700; cursor: pointer;
                    transition: opacity 0.15s, transform 0.15s;
                    box-shadow: 0 8px 24px rgba(124,58,237,0.4);
                }

                .sch-btn-generate:hover { opacity: 0.9; transform: translateY(-2px); }
                .sch-btn-generate:active { transform: none; }
                .sch-btn-generate:disabled { opacity: 0.5; pointer-events: none; }

                .sch-spinner {
                    width: 15px; height: 15px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff; border-radius: 50%;
                    animation: spin 0.65s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                /* ── Footer ── */
                .sch-footer {
                    display: flex; align-items: center;
                    justify-content: flex-end; gap: 12px;
                    padding: 20px 28px;
                    border-top: 1px solid #1F1B38;
                    background: #100E24;
                }

                .sch-btn-approve {
                    display: flex; align-items: center; gap: 7px;
                    background: rgba(167,139,250,0.12);
                    color: #C4B5FD;
                    border: 1px solid rgba(167,139,250,0.35);
                    padding: 11px 24px; border-radius: 10px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 14px; font-weight: 700; cursor: pointer;
                    transition: all 0.15s;
                }

                .sch-btn-approve:hover {
                    background: rgba(167,139,250,0.22);
                    border-color: rgba(167,139,250,0.6);
                    box-shadow: 0 0 20px rgba(167,139,250,0.15);
                }

                .sch-btn-reject {
                    display: flex; align-items: center; gap: 7px;
                    background: rgba(248,113,113,0.08);
                    color: #FCA5A5;
                    border: 1px solid rgba(248,113,113,0.25);
                    padding: 11px 24px; border-radius: 10px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 14px; font-weight: 700; cursor: pointer;
                    transition: all 0.15s;
                }

                .sch-btn-reject:hover {
                    background: rgba(248,113,113,0.16);
                    border-color: rgba(248,113,113,0.45);
                }

                .sch-no-employees {
                    text-align: center; padding: 40px;
                    color: #5C5878; font-size: 14px;
                }

                .sch-back-btn {
                    display: inline-flex; align-items: center; gap: 7px;
                    background: transparent;
                    border: 1px solid #2E2A4A;
                    color: #9D9ABF;
                    padding: 8px 15px; border-radius: 9px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 13px; font-weight: 600;
                    cursor: pointer;
                    transition: all 0.15s;
                    margin-bottom: 18px;
                }

                .sch-back-btn:hover {
                    background: rgba(167,139,250,0.08);
                    border-color: rgba(167,139,250,0.4);
                    color: #C4B5FD;
                }

                .sch-back-arrow {
                    display: inline-block;
                    transition: transform 0.15s;
                }

                .sch-back-btn:hover .sch-back-arrow {
                    transform: translateX(-3px);
                }
            `}</style>

            <div className="sch-root">
                <div className="sch-wrap">



                    {/* Back button */}
                    <button className="sch-back-btn" onClick={() => navigate(-1)}>
                        <span className="sch-back-arrow">←</span>
                        Back to Dashboard
                    </button>

                    {/* Top bar */}
                    <div className="sch-topbar">
                        <div className="sch-brand">
                            <div className="sch-brand-icon">👥</div>
                            <div>
                                <h1>Shift Management</h1>
                                <p>Schedule administration dashboard</p>
                            </div>
                        </div>
                        <div className="sch-date-badge">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long", month: "long", day: "numeric", year: "numeric",
                            })}
                        </div>
                    </div>

                    {/* Stat cards */}
                    {schedule.length > 0 && (
                        <div className="sch-stats">
                            <div className="sch-stat">
                                <div className="sch-stat-icon" style={{ background: "rgba(129,140,248,0.15)" }}>📋</div>
                                <div>
                                    <div className="sch-stat-label">Total Shifts</div>
                                    <div className="sch-stat-value">{shifts.length}</div>
                                </div>
                            </div>
                            <div className="sch-stat">
                                <div className="sch-stat-icon" style={{ background: "rgba(167,139,250,0.15)" }}>✅</div>
                                <div>
                                    <div className="sch-stat-label">Assigned</div>
                                    <div className="sch-stat-value">{totalAssigned}</div>
                                </div>
                            </div>
                            <div className="sch-stat">
                                <div className="sch-stat-icon" style={{ background: "rgba(192,132,252,0.15)" }}>⏳</div>
                                <div>
                                    <div className="sch-stat-label">Remaining Slots</div>
                                    <div className="sch-stat-value">{totalRemaining}</div>
                                </div>
                            </div>
                            <div className="sch-stat">
                                <div className="sch-stat-icon" style={{ background: "rgba(232,121,249,0.15)" }}>👤</div>
                                <div>
                                    <div className="sch-stat-label">In Selected Shift</div>
                                    <div className="sch-stat-value">{filteredEmployees.length}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main panel */}
                    <div className="sch-main">
                        {schedule.length === 0 ? (
                            <div className="sch-empty">
                                <div className="sch-empty-ring">
                                    <div className="ring" />
                                    <div className="ring" />
                                    <div className="center">📅</div>
                                </div>
                                <h3>No schedule generated</h3>
                                <p>Auto-assign employees to available shifts by generating a schedule</p>
                                <button
                                    className="sch-btn-generate"
                                    onClick={handleGenerate}
                                    disabled={loading}
                                >
                                    {loading
                                        ? <><div className="sch-spinner" /> Generating…</>
                                        : <>⚡ Generate Schedule</>
                                    }
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="sch-main-header">
                                    <h2>Shift assignments</h2>
                                    <div className="sch-tabs">
                                        {shifts.map((shift, idx) => {
                                            const p = SHIFT_PALETTE[idx % SHIFT_PALETTE.length];
                                            const isActive = shift === selectedShift;
                                            const count = schedule.filter(s => s.shiftname === shift).length;
                                            return (
                                                <button
                                                    key={shift}
                                                    className={`sch-tab${isActive ? " active" : ""}`}
                                                    style={{
                                                        "--tab-accent": p.accent,
                                                        "--tab-light": p.light,
                                                        "--tab-text": p.text,
                                                    }}
                                                    onClick={() => setSelectedShift(shift)}
                                                >
                                                    <span style={{ fontSize: 14 }}>{getShiftIcon(shift)}</span>
                                                    {shift}
                                                    <span style={{
                                                        background: isActive ? p.border : "rgba(255,255,255,0.06)",
                                                        color: isActive ? p.text : "#5C5878",
                                                        borderRadius: 20, padding: "1px 8px",
                                                        fontSize: 11, fontWeight: 700,
                                                    }}>{count}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="sch-ribbon">
                                    <span className="sch-ribbon-label">Open slots for</span>
                                    <span className="sch-ribbon-shift">{selectedShift}</span>
                                    <div className="sch-ribbon-pill" style={{
                                        background: pal.light,
                                        borderColor: pal.border,
                                        color: pal.text,
                                    }}>
                                        {remainingSlots[selectedShift] ?? 0} remaining
                                    </div>
                                </div>

                                <div className="sch-list">
                                    {filteredEmployees.length === 0 ? (
                                        <div className="sch-no-employees">No employees assigned to this shift.</div>
                                    ) : filteredEmployees.map((item) => (
                                        <div key={item.preferenceRequestId} className="sch-employee-card">
                                            <div className="sch-emp-left">
                                                <Avatar name={item.username} />
                                                <div>
                                                    <div className="sch-emp-name">{item.username}</div>
                                                    <div className="sch-emp-date">
                                                        {new Date(item.assignmentDate).toLocaleString(undefined, {
                                                            weekday: "short", month: "short", day: "numeric",
                                                            hour: "2-digit", minute: "2-digit",
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 hover:scale-105 active:scale-95"
                                                style={{
                                                    background: pal.light,
                                                    borderColor: pal.border,
                                                    color: pal.text,
                                                    boxShadow: `0 0 12px ${pal.accent}55, 0 0 24px ${pal.accent}22`,
                                                }}
                                            >
                                                {getShiftIcon(selectedShift)} {selectedShift}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="sch-footer">
                                    <button
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                                        style={{
                                            background: "rgba(248,113,113,0.08)",
                                            color: "#FCA5A5",
                                            borderColor: "rgba(248,113,113,0.3)",
                                            boxShadow: "0 0 14px rgba(248,113,113,0.2), 0 0 28px rgba(248,113,113,0.08)",
                                        }}
                                        onClick={handleReject}
                                    >
                                        ✕ Reject
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                                        style={{
                                            background: "rgba(167,139,250,0.15)",
                                            color: "#C4B5FD",
                                            borderColor: "rgba(167,139,250,0.4)",
                                            boxShadow: "0 0 14px rgba(167,139,250,0.3), 0 0 32px rgba(167,139,250,0.12)",
                                        }}
                                        onClick={handleApprove}
                                    >
                                        ✓ Approve Schedule
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};

export default Scheduler;