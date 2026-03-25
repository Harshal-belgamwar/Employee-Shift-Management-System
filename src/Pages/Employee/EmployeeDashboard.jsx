import StatCard from "../../Components/StatCard";
import ShiftCard from "../../Components/ShiftCard";
import Calendar from "../../Components/Calendar";
import { shifts, notifications } from "../../utils/mockData";
import Navbar from "../../Components/Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile/Profile";
import ChangePassword from "./User/ChangePassword";
import api from "../../utils/api";
import { toast } from "react-toastify";

function ShiftChangeModal({ onClose }) {
    const [form, setForm] = useState({ requestedShift: "", reason: "" });
    const [loading, setLoading] = useState(false);
    const [shifts, setShifts] = useState([]);


    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const fetchShifts = async () => {
        try {
            const response = await api.get(`/employee/shifts`);
            setShifts(response.data);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to fetch shifts");
        }
    };



    useEffect(() => {
        fetchShifts();

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const username = sessionStorage.getItem("username");
            await api.post(`/employee/shift-change-request/${username}`, form);
            toast.success("Shift change request submitted");
            onClose();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-md bg-[#1e1b4b] border border-indigo-500/25 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                <div className="px-6 pt-6 pb-8 bg-gradient-to-br from-indigo-600/30 to-indigo-900/40 border-b border-indigo-500/20">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-indigo-400 text-[10px] font-bold tracking-widest uppercase mb-0.5">Shift</p>
                                <h2 className="text-slate-100 text-lg font-bold leading-tight">Shift Change Request</h2>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6 flex flex-col gap-5">

                    {/* Date */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10.5px] font-bold uppercase tracking-[0.5px] text-indigo-400">
                            Shift Change Date
                        </label>
                        <input
                            type="date"
                            name="shiftChangeDate"
                            value={form.shiftChangeDate}
                            onChange={handleChange}
                            required
                            className="bg-white/5 border border-indigo-500/25 text-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>

                    {/* Shift Dropdown */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10.5px] font-bold uppercase tracking-[0.5px] text-indigo-400">
                            Preferred Shift
                        </label>
                        <select
                            name="preferredShift"
                            value={form.preferredShift}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                            style={{
                                background: "#1e1b4b",
                                border: "1px solid rgba(99,102,241,0.25)",
                                color: form.preferredShift ? "#e2e8f0" : "#475569",
                            }}
                            onFocus={e => e.target.style.borderColor = "#818cf8"}
                            onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.25)"}
                        >
                            <option value="" disabled style={{ background: "#1e1b4b", color: "#475569" }}>
                                Select a shift
                            </option>
                            {shifts.map((shift, i) => (
                                <option key={i} value={shift.shiftName} style={{ background: "#1e1b4b", color: "#e2e8f0" }}>
                                    {shift.shiftName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Reason */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10.5px] font-bold uppercase tracking-[0.5px] text-indigo-400">
                            Reason
                        </label>
                        <textarea
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Briefly describe why you need a shift change..."
                            required
                            className="bg-white/5 border border-indigo-500/25 text-slate-200 placeholder-slate-600 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                        />
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm font-semibold text-slate-400 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-slate-200 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Submitting…
                                </>
                            ) : "Submit Request"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default function EmployeeDashboard() {
    const [openProfile, setOpenProfile] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [openShiftChange, setOpenShiftChange] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const myShifts = shifts.filter((s) => s.employeeId === 2);
    const upcomingShifts = myShifts.slice(0, 3);

    const roleName = sessionStorage.getItem("role");

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const fetchNotifications = async () => {
        const username = sessionStorage.getItem("username");
        try {
            const response = await api.get(`employee/notification/${username}`);

            const filteredNotifications = response.data.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            )
            setNotifications(filteredNotifications);
            console.log(filteredNotifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="space-y-8 flex flex-col p-3">

            <div className="mt-[7vh]">
                <Navbar
                    pageTitle="Employee Dashboard"
                    onOpenProfile={() => setOpenProfile(true)}
                    onOpenPasswordModal={() => setOpenPasswordModal(true)}
                />
            </div>

            {/* Stats
            <div className="stats-grid">
                <StatCard icon="📅" label="Total Shifts" value="12" trend="8%" trendUp={true} color="indigo" delay={0} />
                <StatCard icon="⏰" label="Hours This Week" value="36h" trend="4%" trendUp={true} color="blue" delay={50} />
                <StatCard icon="📋" label="Upcoming Shifts" value="3" color="amber" delay={100} />
                <StatCard icon="✉️" label="Pending Requests" value="1" color="green" delay={150} />
            </div> */}

            {/* Leave & Shift Change buttons */}
            {/* Action Buttons */}
            <div className="flex flex-col gap-5">

                {/* Employee actions */}
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2.5">My Actions</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

                        <button
                            onClick={() => navigate("/employee/leave-requests")}
                            className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-rose-500/8 border border-rose-500/25 hover:bg-rose-500/15 transition-colors cursor-pointer text-left"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-rose-400">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                            <div>
                                <p className="text-[13px] font-semibold text-rose-300 leading-tight">Leave Request</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">Submit time off</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setOpenShiftChange(true)}
                            className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-amber-500/8 border border-amber-500/25 hover:bg-amber-500/15 transition-colors cursor-pointer text-left"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-amber-400">
                                <path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                            <div>
                                <p className="text-[13px] font-semibold text-amber-300 leading-tight">Shift Change</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">Request new shift</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate("/employee/shift-requests")}
                            className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-indigo-500/8 border border-indigo-500/25 hover:bg-indigo-500/15 transition-colors cursor-pointer text-left"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-indigo-400">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                <path d="M9 5a2 2 0 002 2h2a2 2 0 002-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                            <div>
                                <p className="text-[13px] font-semibold text-indigo-300 leading-tight">Request History</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">View past requests</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate("/employee/shift-preference")}
                            className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-emerald-500/8 border border-emerald-500/25 hover:bg-emerald-500/15 transition-colors cursor-pointer text-left"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-emerald-400">
                                <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div>
                                <p className="text-[13px] font-semibold text-emerald-300 leading-tight">Shift Preference</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">Set your preferences</p>
                            </div>
                        </button>

                    </div>
                </div>

                {/* Manager actions */}
                {roleName === "manager" && (
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2.5">Manager Controls</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">

                            {[
                                { label: "Shift Requests", sub: "Review changes", path: "/shift-change-requests", icon: <path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /> },
                                { label: "Add User", sub: "Create account", path: "/users", icon: <path d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 20v-1a6 6 0 0112 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /> },
                                { label: "Add Employee", sub: "Manage team", path: "/employee-management", icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></> },
                                { label: "Leave Requests", sub: "Approve or deny", path: "/view-leave-requests", icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /> },
                                { label: "Generate Schedule", sub: "Auto-assign shifts", path: "/scheduler", icon: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></> },
                            ].map(({ label, sub, path, icon }) => (
                                <button
                                    key={path}
                                    onClick={() => navigate(path)}
                                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/15 transition-colors cursor-pointer text-left"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-slate-400">{icon}</svg>
                                    <div>
                                        <p className="text-[13px] font-semibold text-slate-300 leading-tight">{label}</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>
                                    </div>
                                </button>
                            ))}

                        </div>
                    </div>
                )}

            </div>

            <div className="content-grid content-grid-2">

                <div className="section-card animate-fade-in-up" style={{ animationDelay: "300ms", opacity: 0 }}>
                    <div className="section-card-header">
                        <h3>📅 Shift Calendar</h3>
                    </div>
                    <Calendar shifts={shifts.filter((s) => s.employeeId === 2)} />
                </div>


                {/* ── Notifications ── */}
                <div className="section-card animate-fade-in-up" style={{ animationDelay: "250ms", opacity: 0 }}>
                    <div className="section-card-header">
                        <h3>🗂️ Notifications</h3>
                        <span className="badge badge-info">{notifications.length} total</span>
                    </div>

                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-2">

                            <p className="text-sm text-slate-500 font-medium">No notifications</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2.5 max-h-100 overflow-y-auto pr-1">
                            {notifications.map((n) => (
                                <div
                                    key={n.notificationId}
                                    className="flex items-start gap-3 p-3.5 rounded-xl border border-indigo-500/15 hover:border-indigo-500/35 hover:shadow-[0_0_12px_rgba(99,102,241,0.08)] transition-all duration-200"
                                    style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.07), rgba(139,92,246,0.04))" }}
                                >
                                    {/* Icon */}
                                    <div
                                        className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-sm mt-0.5"
                                        style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.28)" }}
                                    >
                                        📨
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Title + Date on same row */}
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-semibold text-slate-200 leading-snug truncate">
                                                {n.title}
                                            </p>
                                            <p className="text-sm text-slate-500 font-medium whitespace-nowrap shrink-0 mt-0.5">
                                                {formatDateTime(n.date)}
                                            </p>
                                        </div>
                                        {/* Message below title */}
                                        <p className="text-sm text-white mt-1 leading-relaxed">
                                            {n.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>



            {/* Profile modal */}
            {openProfile && (
                <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
                    <div className="bg-slate-900 w-full max-w-4xl rounded-xl p-5 relative">
                        <Profile handleBack={() => setOpenProfile(false)} />
                    </div>
                </div>
            )}

            {/* Change password modal */}
            {openPasswordModal && (
                <ChangePassword closeModal={() => setOpenPasswordModal(false)} />
            )}

            {/* Shift change modal */}
            {openShiftChange && (
                <ShiftChangeModal onClose={() => setOpenShiftChange(false)} />
            )}
        </div>
    );
}