import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";

const statusConfig = {
    Pending: {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/25",
        dot: "bg-amber-400",
    },
    Approved: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/25",
        dot: "bg-emerald-400",
    },
    Rejected: {
        bg: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500/25",
        dot: "bg-red-400",
    },
};

export default function ShiftRequestHistory() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchRequests() {
            try {
                const username = sessionStorage.getItem("username");
                const res = await api.get(`/employee/shift-request/${username}`);
                setRequests(res.data);
            } catch (err) {
                toast.error("Failed to load requests");
            } finally {
                setLoading(false);
            }
        }
        fetchRequests();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <p className="text-indigo-400 text-sm animate-pulse">Loading requests…</p>
            </div>
        );
    }

    const counts = {
        Pending: requests.filter((r) => r.status === "Pending").length,
        Approved: requests.filter((r) => r.status === "Approved").length,
        Rejected: requests.filter((r) => r.status === "Rejected").length,
    };

    const stats = [
        { label: "Total", value: requests.length, bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/25" },
        { label: "Pending", value: counts.Pending, bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/25" },
        { label: "Approved", value: counts.Approved, bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/25" },
        { label: "Rejected", value: counts.Rejected, bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/25" },
    ];

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">

            {/* Back button */}
            <button
                onClick={() => navigate("/employee/dashboard")}
                className="inline-flex items-center gap-2 text-indigo-300 bg-white/5 hover:bg-white/10 border border-indigo-400/20 rounded-xl px-4 py-2 text-[13px] font-medium mb-7 transition-colors cursor-pointer"
            >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
            </button>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">
                    Shift Change Requests
                </h1>
                <p className="text-sm text-slate-500">
                    Track the status of your submitted shift change requests
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {stats.map((s) => (
                    <div key={s.label} className={`flex flex-col px-5 py-4 rounded-2xl border ${s.bg} ${s.border}`}>
                        <p className={`text-2xl font-bold tracking-tight ${s.text}`}>{s.value}</p>
                        <p className="text-[12px] text-slate-500 mt-1 capitalize">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">

                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <div>
                        <h2 className="text-[14px] font-semibold text-slate-300">All Requests</h2>
                        <p className="text-[12px] text-slate-600 mt-0.5">{requests.length} total requests</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                {["Shift", "Date", "Reason", "Requested At", "Status"].map((h) => (
                                    <th
                                        key={h}
                                        className="px-5 py-3 text-left text-[10.5px] font-bold uppercase tracking-[0.7px] text-slate-500"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-600">
                                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-slate-600">No shift requests found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                requests.map((r, i) => {
                                    const cfg = statusConfig[r.status] || statusConfig.Pending;
                                    return (
                                        <tr
                                            key={i}
                                            className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors"
                                        >
                                            <td className="px-5 py-4 text-[13.5px] font-semibold text-slate-200">
                                                {r.preferredShift}
                                            </td>
                                            <td className="px-5 py-4 text-[13px] text-slate-400">
                                                {new Date(r.shiftChangeDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-4 text-[13px] text-slate-400 max-w-[200px] truncate">
                                                {r.reason}
                                            </td>
                                            <td className="px-5 py-4 text-[13px] text-slate-500">
                                                {new Date(r.requestedAt).toLocaleString()}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-lg border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                    {r.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}