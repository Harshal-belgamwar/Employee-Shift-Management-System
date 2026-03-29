import { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const tabs = ["PENDING", "APPROVED", "REJECTED"];


const tabConfig = {
    PENDING: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", dot: "#F59E0B" },
    APPROVED: { color: "#10B981", bg: "rgba(16,185,129,0.12)", dot: "#10B981" },
    REJECTED: { color: "#EF4444", bg: "rgba(239,68,68,0.12)", dot: "#EF4444" },
};

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getDays(from, to) {
    const diff = (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24) + 1;
    return `${diff}d`;
}

function Avatar({ name }) {
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const colors = ["#6366F1", "#EC4899", "#14B8A6", "#F97316", "#8B5CF6", "#0EA5E9"];
    const color = colors[name.charCodeAt(0) % colors.length];
    return (
        <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: color, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, flexShrink: 0,
            letterSpacing: "0.03em",
        }}>
            {initials}
        </div>
    );
}

export default function ViewLeaveRequest() {
    const [activeTab, setActiveTab] = useState("PENDING");
    const [allRequests, setAllRequests] = useState([]);
    const [animating, setAnimating] = useState(false);
    const [filteredRequests, setFilteredRequests] = useState([]);

    const navigate = useNavigate();

    const [userdata, setUserData] = useState({
        username: "",
        role: ""
    })

    const fetchUser = async () => {
        try {
            const resp = await api.get("/auth/me");
            console.log(resp.data);
            setUserData(resp.data);

        } catch (error) {
            toast.error(error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    const fetchRequests = async (username, role) => {
        try {
            if (role === "admin") {
                const res = await api.get("/admin/get-all-request");

                const sorted = res.data.sort(
                    (a, b) => new Date(b.requested_at) - new Date(a.requested_at)
                );
                console.log(sorted);
                setAllRequests(sorted);

            } else {

                const res = await api.get(`/admin/get-all-request/${username}`);

                const sorted = res.data.sort(
                    (a, b) => new Date(b.requested_at) - new Date(a.requested_at)
                );
                console.log(sorted);
                setAllRequests(sorted);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (userdata?.username && userdata?.role) {
            const role = (userdata.role || "").substring(5).trim().toLowerCase();
            fetchRequests(userdata.username, role);
        }
    }, [userdata]);

    useEffect(() => {
        setAnimating(true);
        const t = setTimeout(() => setAnimating(false), 150);
        return () => clearTimeout(t);
    }, [activeTab]);

    const handleFilter = () => {
        const filtered = allRequests.filter(
            (req) => req.status?.toUpperCase() === activeTab
        );
        setFilteredRequests(filtered);
    }


    useEffect(() => {
        handleFilter();
    }, [activeTab, allRequests]);

    const handleAction = async (req, action) => {
        try {

            if (action === "APPROVED") {
                const res = await api.put("/admin/leave-request/approve", req);
                toast.success(res.data.message);
            } else if (action === "REJECTED") {
                const res = await api.put("/admin/leave-request/reject", req);
                toast.success(res.data.message);
            }
            handleFilter();
            fetchRequests();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update leave request");
        }
    };


    // const handleAction = async (id, action) => {
    //     setAllRequests(prev => prev.filter(r => r.id !== id));
    // };

    const cfg = tabConfig[activeTab];

    return (
        <>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

                .lr-root * { box-sizing: border-box; }
                .lr-root {
                    font-family: 'Sora', sans-serif;
                    background: #0F1117;
                    min-height: 100vh;
                    padding: 36px 32px;
                    color: #E2E8F0;
                }

                .lr-header {
                    margin-bottom: 32px;
                }
                .lr-eyebrow {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #6366F1;
                    margin-bottom: 8px;
                }
                .lr-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #F8FAFC;
                    letter-spacing: -0.02em;
                    line-height: 1.1;
                }
                .lr-title span {
                    background: linear-gradient(135deg, #818CF8, #6366F1);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .lr-tabs {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 24px;
                }
                .lr-tab {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 9px 18px;
                    border-radius: 8px;
                    border: 1px solid transparent;
                    background: #1A1D27;
                    color: #64748B;
                    font-family: 'Sora', sans-serif;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    cursor: pointer;
                    transition: all 0.18s ease;
                }
                .lr-tab:hover { background: #1E2235; color: #94A3B8; }
                .lr-tab.active {
                    background: var(--tab-bg);
                    border-color: var(--tab-color);
                    color: var(--tab-color);
                }
                .lr-tab-dot {
                    width: 7px; height: 7px;
                    border-radius: 50%;
                    background: currentColor;
                    opacity: 0.75;
                }
                .lr-tab-count {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px;
                    opacity: 0.7;
                }

                .lr-card {
                    background: #141720;
                    border: 1px solid #1E2235;
                    border-radius: 16px;
                    overflow: hidden;
                }

                .lr-table { width: 100%; border-collapse: collapse; }
                .lr-thead { background: #0F1117; }
                .lr-th {
                    padding: 14px 20px;
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #475569;
                    text-align: left;
                    border-bottom: 1px solid #1E2235;
                }

                .lr-row {
                    border-bottom: 1px solid #1A1D27;
                    transition: background 0.14s;
                    opacity: 1;
                    transition: opacity 0.18s;
                }
                .lr-row.fading { opacity: 0; }
                .lr-row:last-child { border-bottom: none; }
                .lr-row:hover { background: rgba(99,102,241,0.04); }

                .lr-td { padding: 16px 20px; vertical-align: middle; }

                .lr-employee {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .lr-name {
                    font-size: 13.5px;
                    font-weight: 600;
                    color: #E2E8F0;
                }

                .lr-date-range {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .lr-date {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 12px;
                    color: #94A3B8;
                }
                .lr-date-sep { color: #334155; font-size: 11px; }
                .lr-days {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px;
                    font-weight: 500;
                    padding: 2px 7px;
                    border-radius: 4px;
                    background: #1A1D27;
                    color: #64748B;
                    margin-left: 2px;
                }

                .lr-reason {
                    font-size: 13px;
                    color: #64748B;
                    max-width: 220px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .lr-actions { display: flex; gap: 8px; }

                .lr-btn {
                    display: flex; align-items: center; gap: 5px;
                    padding: 7px 14px;
                    border-radius: 7px;
                    border: 1px solid transparent;
                    font-family: 'Sora', sans-serif;
                    font-size: 11.5px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.15s;
                    letter-spacing: 0.03em;
                }
                .lr-btn-approve {
                    background: rgba(16,185,129,0.1);
                    border-color: rgba(16,185,129,0.35);
                    color: #34D399;
                }
                .lr-btn-approve:hover {
                    background: rgba(16,185,129,0.2);
                    border-color: #10B981;
                    transform: translateY(-1px);
                }
                .lr-btn-reject {
                    background: rgba(239,68,68,0.08);
                    border-color: rgba(239,68,68,0.3);
                    color: #F87171;
                }
                .lr-btn-reject:hover {
                    background: rgba(239,68,68,0.18);
                    border-color: #EF4444;
                    transform: translateY(-1px);
                }

                .lr-empty {
                    text-align: center;
                    padding: 60px 20px;
                    color: #334155;
                }
                .lr-empty-icon { font-size: 36px; margin-bottom: 12px; }
                .lr-empty-text { font-size: 14px; font-weight: 500; }

                .lr-status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 3px 10px;
                    border-radius: 20px;
                    letter-spacing: 0.06em;
                }
            `}</style>

            <div className="lr-root">
                <button
                    // onClick={() => navigate("/admin/dashboard")}
                    onClick={() => navigate(-1)}
                    className="inline-flex w-fit items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#1E2235] bg-[#1A1D27] text-[#64748B] text-xs font-semibold tracking-wide transition-all duration-200 hover:bg-[#1E2235] hover:text-[#94A3B8] hover:border-[#2D3348] hover:-translate-x-0.5"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                </button>
                <div className="lr-header mt-10">
                    <div className="lr-eyebrow">HR Management</div>
                    <div className="lr-title">Leave <span>Requests</span></div>
                </div>

                <div className="lr-tabs">
                    {tabs.map((tab) => {
                        const c = tabConfig[tab];
                        const count = allRequests.filter(
                            r => r.status?.toUpperCase() === tab
                        ).length;

                        return (
                            <button
                                key={tab}
                                className={`lr-tab${activeTab === tab ? " active" : ""}`}
                                style={{
                                    "--tab-color": c.color,
                                    "--tab-bg": c.bg,
                                }}
                                onClick={() => setActiveTab(tab)}
                            >
                                <span className="lr-tab-dot" />
                                {tab}
                                <span className="lr-tab-count">{count}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="lr-card">
                    <table className="lr-table">
                        <thead className="lr-thead">
                            <tr>
                                <th className="lr-th">Employee</th>
                                <th className="lr-th">Duration</th>
                                <th className="lr-th">Reason</th>
                                {activeTab !== "PENDING" && <th className="lr-th">Status</th>}
                                {activeTab === "PENDING" && <th className="lr-th">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="5">
                                        <div className="lr-empty">
                                            <div className="lr-empty-icon">📭</div>
                                            <div className="lr-empty-text">No {activeTab.toLowerCase()} requests</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((req, index) => (
                                    <tr key={index} className={`lr-row${animating ? " fading" : ""}`}>
                                        <td className="lr-td">
                                            <div className="lr-employee">
                                                <Avatar name={req.username} />
                                                <span className="lr-name">{req.username}</span>
                                            </div>
                                        </td>
                                        <td className="lr-td">
                                            <div className="lr-date-range">
                                                <span className="lr-date">{formatDate(req.start_date)}</span>
                                                <span className="lr-date-sep">→</span>
                                                <span className="lr-date">{formatDate(req.end_date)}</span>
                                                <span className="lr-days">{getDays(req.start_date, req.end_date)}</span>
                                            </div>
                                        </td>
                                        <td className="lr-td">
                                            <span className="lr-reason">{req.reason}</span>
                                        </td>

                                        {activeTab !== "PENDING" && (
                                            <td className="lr-td">
                                                <span
                                                    className="lr-status-badge"
                                                    style={{
                                                        background: cfg.bg,
                                                        color: cfg.color,
                                                    }}
                                                >
                                                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
                                                    {activeTab}
                                                </span>
                                            </td>
                                        )}

                                        {activeTab === "PENDING" && (
                                            <td className="lr-td">
                                                <div className="lr-actions">
                                                    <button className="lr-btn lr-btn-approve" onClick={() => handleAction(req, "APPROVED")}>
                                                        ✓ Approve
                                                    </button>
                                                    <button className="lr-btn lr-btn-reject" onClick={() => handleAction(req, "REJECTED")}>
                                                        ✕ Reject
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}