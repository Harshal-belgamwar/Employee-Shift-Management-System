import { useEffect, useState } from "react";
import Modal from "../../Components/Modal";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const statusConfig = {
    approved: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/25",
        dot: "bg-emerald-400",
    },
    pending: {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/25",
        dot: "bg-amber-400",
    },
    rejected: {
        bg: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500/25",
        dot: "bg-red-400",
    },
};

export default function LeaveRequests() {
    const [requests, setRequests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const username = sessionStorage.getItem("username");
            const res = await api.get(`/employee/leave-request/${username}`);
            console.log(res.data);
            if (res.data.length === 0) {
                
                return;
            }

            const formatted = res.data.map((item, index) => ({
                id: index + 1,
                employeeName: item.username,
                startDate: item.start_date.split("T")[0],
                endDate: item.end_date.split("T")[0],
                reason: item.reason,
                appliedOn: item.requested_at.split("T")[0],
                status: item.status?.toLowerCase(),
            }));

            setRequests(formatted);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const username = sessionStorage.getItem("username");
            await api.post(`/employee/leave-request/${username}`, {
                start_date: form.startDate,
                end_date: form.endDate,
                reason: form.reason,
            });
            toast.success("Leave request submitted");
            setShowModal(false);
            setForm({ startDate: "", endDate: "", reason: "" });
            fetchRequests();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit");
        }
    };

    return (
        <div className="px-6 py-8 max-w-6xl mx-auto">

            {/* Back button */}
            <button
                onClick={() => navigate("/employee/dashboard")}
                className="inline-flex items-center gap-2 text-indigo-300 bg-white/5 hover:bg-white/10 border border-indigo-400/20 rounded-xl px-4 py-2 text-[13px] font-medium mb-7 transition-colors cursor-pointer"
            >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Dashboard
            </button>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">
                        Leave Requests
                    </h1>
                    <p className="text-sm text-slate-500">
                        Submit and track your leave requests
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                    New Request
                </button>
            </div>

            {/* Status cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {["pending", "approved", "rejected"].map((status) => {
                    const count = requests.filter((r) => r.status === status).length;
                    const cfg = statusConfig[status];
                    return (
                        <div key={status} className={`flex items-center gap-4 px-5 py-4 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg} border ${cfg.border}`}>
                                <span className={`text-lg font-bold ${cfg.text}`}>{count}</span>
                            </div>
                            <div>
                                <p className={`text-base font-bold ${cfg.text}`}>{count}</p>
                                <p className="text-[12px] text-slate-500 capitalize">{status}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Table */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06]">
                    <h2 className="text-[14px] font-semibold text-slate-300">All Requests</h2>
                    <p className="text-[12px] text-slate-600 mt-0.5">{requests.length} total requests</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                {["Employee", "From", "To", "Reason", "Applied On", "Status"].map((h) => (
                                    <th key={h} className="px-5 py-3 text-left text-[10.5px] font-bold uppercase tracking-[0.7px] text-slate-500">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-14 text-sm text-slate-600">
                                        No leave requests found
                                    </td>
                                </tr>
                            ) : (
                                requests.map((r) => {
                                    const cfg = statusConfig[r.status] || statusConfig.pending;
                                    return (
                                        <tr key={r.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors">
                                            <td className="px-5 py-4 text-[13.5px] font-semibold text-slate-200">{r.employeeName}</td>
                                            <td className="px-5 py-4 text-[13px] text-slate-400">{r.startDate}</td>
                                            <td className="px-5 py-4 text-[13px] text-slate-400">{r.endDate}</td>
                                            <td className="px-5 py-4 text-[13px] text-slate-400 max-w-[200px] truncate">{r.reason}</td>
                                            <td className="px-5 py-4 text-[13px] text-slate-500">{r.appliedOn}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-lg border capitalize ${cfg.bg} ${cfg.text} ${cfg.border}`}>
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

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Submit Leave Request">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10.5px] font-bold uppercase tracking-[0.5px] text-indigo-400">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                required
                                className="bg-white/5 border border-indigo-500/25 text-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10.5px] font-bold uppercase tracking-[0.5px] text-indigo-400">
                                End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                required
                                className="bg-white/5 border border-indigo-500/25 text-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10.5px] font-bold uppercase tracking-[0.5px] text-indigo-400">
                            Reason
                        </label>
                        <textarea
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Briefly describe your reason..."
                            required
                            className="bg-white/5 border border-indigo-500/25 text-slate-200 placeholder-slate-600 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                        />
                    </div>

                    <div className="h-px bg-white/5 my-1" />

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2.5 text-sm font-semibold text-slate-400 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-slate-200 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors cursor-pointer"
                        >
                            Submit Request
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}