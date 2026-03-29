import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";

function ShiftSelect({ name, value, onChange, shifts, placeholder }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const selected = shifts.find((s) => s.shiftName === value);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelect = (shiftName) => {
        onChange({ target: { name, value: shiftName } });
        setOpen(false);
    };

    const formatTime = (t) => {
        if (!t) return "";
        const [h, m] = t.split(":");
        const date = new Date();
        date.setHours(+h, +m);
        return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-sm text-left flex items-center justify-between transition-all duration-150 outline-none
                    ${open ? "border-violet-500 ring-2 ring-violet-500/30" : "border-slate-700 hover:border-slate-600"}
                    ${selected ? "text-white" : "text-slate-500"}`}
            >
                <span className="flex items-center gap-2 truncate">
                    {selected ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                            <span className="capitalize font-medium">{selected.shiftName}</span>
                            <span className="text-slate-500 text-xs">
                                {formatTime(selected.start_time)} – {formatTime(selected.end_time)}
                            </span>
                        </>
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </span>
                <svg
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute z-50 mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                    {/* Clear option */}
                    <button
                        type="button"
                        onClick={() => handleSelect("")}
                        className="w-full px-4 py-2.5 text-left text-xs text-slate-500 hover:bg-slate-800 transition-colors duration-100 border-b border-slate-800"
                    >
                        — None / Clear
                    </button>

                    {shifts.length === 0 ? (
                        <div className="px-4 py-4 text-xs text-slate-600 text-center">No shifts available</div>
                    ) : (
                        shifts.map((s) => {
                            const isFull = s.slots_available === 0;
                            const fillPct = Math.round(((s.slots_filled) / s.slots) * 100);
                            const isSelected = value === s.shiftName;
                            return (
                                <button
                                    key={s.shift_id}
                                    type="button"
                                    disabled={isFull}
                                    onClick={() => !isFull && handleSelect(s.shiftName)}
                                    className={`w-full px-4 py-3 text-left flex items-start justify-between gap-3 border-b border-slate-800/60 last:border-0 transition-colors duration-100
                                        ${isFull ? "opacity-40 cursor-not-allowed" : "hover:bg-violet-950/40 cursor-pointer"}
                                        ${isSelected ? "bg-violet-950/50" : ""}`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? "bg-violet-400" : "bg-slate-600"}`} />
                                            <span className="text-sm font-semibold text-white capitalize">{s.shiftName}</span>
                                            {isSelected && (
                                                <span className="text-xs text-violet-400 font-medium">✓ selected</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 pl-3.5">
                                            <span className="text-xs text-slate-400">
                                                {formatTime(s.start_time)} – {formatTime(s.end_time)}
                                            </span>
                                        </div>
                                        {/* Slots bar */}
                                        <div className="mt-2 pl-3.5">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-slate-500">{s.slots_filled}/{s.slots} filled</span>
                                                <span className={`text-xs font-semibold ${isFull ? "text-red-400" : "text-emerald-400"}`}>
                                                    {isFull ? "Full" : `${s.slots_available} open`}
                                                </span>
                                            </div>
                                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${isFull ? "bg-red-500" : fillPct > 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                                                    style={{ width: `${fillPct}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}

export default function ShiftPreference() {
    const [preferences, setPreferences] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [shifts, setShifts] = useState([]);

    const navigate = useNavigate();
    const [userdata, setUserData] = useState({
        username: "",
        role: ""
    });

    const username = userdata.username || sessionStorage.getItem("username");

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

    const [form, setForm] = useState({
        username: "",
        preference1: "",
        preference2: ""
    });

    useEffect(() => {
        if (userdata.username) {
            setForm(prev => ({ ...prev, username: userdata.username }));
        }
    }, [userdata.username]);

    const fetchPreferences = async () => {
        if (!username) return;
        try {
            const res = await api.get(`/employee/shift-preference/${username}`);
            setPreferences(res.data);
        } catch (err) {
            toast.error("Failed to load preferences");
        }
    };

    const fetchShifts = async () => {
        try {
            const res = await api.get(`/employee/shifts`);
            setShifts(res.data);
        } catch (err) {
            toast.error("Failed to load shifts");
        }
    };

    useEffect(() => {
        fetchUser();
        fetchShifts();
    }, []);

    useEffect(() => {
        if (username) {
            fetchPreferences();
        }
    }, [username]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/employee/shift-preference", form);
            toast.success("Preference submitted!");
            setShowForm(false);
            setForm({ username, preference1: "", preference2: "" });
            fetchPreferences();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error submitting preference");
        }
    };

    const formatDate = (isoString) => {
        if (!isoString) return "—";
        const d = new Date(isoString);
        return d.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const statusStyles = {
        PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        REJECTED: "bg-red-500/10 text-red-400 border-red-500/30",
    };

    const statusDot = {
        PENDING: "bg-amber-400",
        APPROVED: "bg-emerald-400",
        REJECTED: "bg-red-400",
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-10">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <button
                            onClick={() => navigate("/employee/dashboard")}
                            className="group flex items-center gap-1.5 text-slate-500 hover:text-violet-400 text-xs font-medium mb-3 transition-colors duration-150"
                        >
                            <svg className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </button>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="block w-1 h-5 rounded-full bg-violet-500"></span>
                            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-violet-400">Schedule</p>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Shift Preferences</h1>
                        <p className="text-sm text-slate-400 mt-1">Manage and submit your preferred shift timings</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="group flex items-center gap-2 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 shadow-lg shadow-violet-900/40 mt-1"
                    >
                        <svg className="w-4 h-4 transition-transform duration-150 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Preference
                    </button>
                </div>

                {/* Form Card */}
                {showForm && (
                    <div className="mb-6 rounded-2xl border border-violet-500/30 bg-slate-900/80 overflow-visible shadow-xl shadow-black/30">
                        <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 rounded-t-2xl" />

                        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                            <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-slate-400">New Preference</h2>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                    Preference 1 <span className="text-violet-400">*</span>
                                </label>
                                <ShiftSelect
                                    name="preference1"
                                    value={form.preference1}
                                    onChange={handleChange}
                                    shifts={shifts}
                                    placeholder="Select a shift…"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                    Preference 2{" "}
                                    <span className="text-slate-600 normal-case font-normal tracking-normal">(optional)</span>
                                </label>
                                <ShiftSelect
                                    name="preference2"
                                    value={form.preference2}
                                    onChange={handleChange}
                                    shifts={shifts}
                                    placeholder="Select a backup shift…"
                                />
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-150 shadow-md shadow-violet-900/40"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 text-sm font-medium px-6 py-2.5 rounded-xl border border-slate-700 transition-all duration-150"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preferences Table Card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl shadow-black/20">
                    <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                        <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-slate-400">Preference History</h2>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                            {preferences.length} {preferences.length === 1 ? "entry" : "entries"}
                        </span>
                    </div>

                    {preferences.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-slate-500">No preferences yet</p>
                            <p className="text-xs text-slate-600 mt-1">Click "Add Preference" to get started</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-800">
                                        <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest w-10">#</th>
                                        <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Username</th>
                                        <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Preference 1</th>
                                        <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Preference 2</th>
                                        <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                        <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Submitted At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {preferences.map((p, index) => (
                                        <tr key={index} className="border-b border-slate-800/60 hover:bg-violet-950/30 transition-colors duration-150 group">
                                            <td className="px-5 py-3.5">
                                                <span className="text-xs font-bold text-slate-600 group-hover:text-violet-500 transition-colors duration-150">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/20 flex items-center justify-center shrink-0">
                                                        <span className="text-xs font-bold text-violet-400 uppercase">{p.username?.charAt(0) || "?"}</span>
                                                    </div>
                                                    <span className="text-slate-300 font-medium">{p.username || "—"}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-300">
                                                {p.preference1 ? (
                                                    <span className="inline-flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                                                        <span className="capitalize">{p.preference1}</span>
                                                    </span>
                                                ) : <span className="text-slate-700">—</span>}
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-400">
                                                {p.preference2 ? (
                                                    <span className="inline-flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shrink-0" />
                                                        <span className="capitalize">{p.preference2}</span>
                                                    </span>
                                                ) : <span className="text-slate-700">—</span>}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {p.status ? (
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[p.status] || "bg-slate-700/30 text-slate-400 border-slate-600"}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[p.status] || "bg-slate-400"}`} />
                                                        {p.status}
                                                    </span>
                                                ) : <span className="text-slate-700">—</span>}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-1.5 text-slate-400">
                                                    <svg className="w-3.5 h-3.5 text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs">{formatDate(p.submittedAt)}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <p className="text-center text-xs text-slate-700 mt-6">
                    Preferences are reviewed by your manager during scheduling
                </p>
            </div>
        </div>
    );
}