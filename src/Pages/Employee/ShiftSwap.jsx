import { useState } from "react";
import Modal from "../../Components/Modal";
import { swapRequests as mockSwaps, employees, shifts } from "../../utils/mockData";

const statusStyles = {
    approved: { bg: "rgba(16, 185, 129, 0.12)", color: "#34d399" },
    pending: { bg: "rgba(245, 158, 11, 0.12)", color: "#fbbf24" },
    rejected: { bg: "rgba(239, 68, 68, 0.12)", color: "#f87171" },
};

export default function ShiftSwap() {
    const [swaps, setSwaps] = useState(mockSwaps);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ shiftId: "", targetId: "", reason: "" });

    const myShifts = shifts.filter((s) => s.employeeId === 2);
    const otherEmployees = employees.filter((e) => e.id !== 2 && e.role === "employee");

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedShift = myShifts.find((s) => s.id === parseInt(form.shiftId));
        const targetEmp = employees.find((e) => e.id === parseInt(form.targetId));
        const newSwap = {
            id: swaps.length + 1,
            requesterId: 2,
            requesterName: "Priya Sharma",
            targetId: targetEmp.id,
            targetName: targetEmp.name,
            shiftDate: selectedShift?.date || "N/A",
            shiftTime: selectedShift ? `${selectedShift.startTime} - ${selectedShift.endTime}` : "N/A",
            reason: form.reason,
            status: "pending",
        };
        setSwaps([newSwap, ...swaps]);
        setShowModal(false);
        setForm({ shiftId: "", targetId: "", reason: "" });
    };

    return (
        <div>
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Shift Swap</h1>
                        <p>Request to swap your shifts with colleagues</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        + New Swap Request
                    </button>
                </div>
            </div>

            {/* Swap cards */}
            <div className="space-y-4">
                {swaps.map((swap, i) => {
                    const style = statusStyles[swap.status];
                    return (
                        <div
                            key={swap.id}
                            className="glass-card p-5 animate-fade-in-up"
                            style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
                        >
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                {/* From */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                                        style={{ background: "var(--gradient-primary)" }}
                                    >
                                        {swap.requesterName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{swap.requesterName}</p>
                                        <p className="text-xs text-slate-400">Requester</p>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="text-xl text-slate-500">⇄</div>

                                {/* To */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                                        style={{ background: "var(--gradient-success)" }}
                                    >
                                        {swap.targetName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{swap.targetName}</p>
                                        <p className="text-xs text-slate-400">Target</p>
                                    </div>
                                </div>

                                {/* Shift info */}
                                <div className="text-right">
                                    <p className="text-sm text-white">{swap.shiftDate}</p>
                                    <p className="text-xs text-slate-400">{swap.shiftTime}</p>
                                </div>

                                {/* Status */}
                                <span
                                    className="badge capitalize"
                                    style={{ background: style.bg, color: style.color }}
                                >
                                    {swap.status}
                                </span>
                            </div>
                            {swap.reason && (
                                <p className="text-xs text-slate-400 mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                                    💬 {swap.reason}
                                </p>
                            )}
                        </div>
                    );
                })}

                {swaps.length === 0 && (
                    <div className="section-card text-center py-12">
                        <span className="text-4xl mb-3 block">🔄</span>
                        <p className="text-slate-400">No swap requests yet</p>
                    </div>
                )}
            </div>

            {/* New Swap Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Request Shift Swap">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="form-label">Select Your Shift</label>
                        <select
                            name="shiftId"
                            value={form.shiftId}
                            onChange={(e) => setForm({ ...form, shiftId: e.target.value })}
                            className="select-field"
                            required
                        >
                            <option value="">Choose a shift...</option>
                            {myShifts.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.date} | {s.startTime} - {s.endTime} ({s.type})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Swap With</label>
                        <select
                            name="targetId"
                            value={form.targetId}
                            onChange={(e) => setForm({ ...form, targetId: e.target.value })}
                            className="select-field"
                            required
                        >
                            <option value="">Choose an employee...</option>
                            {otherEmployees.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.name} — {e.department}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Reason</label>
                        <textarea
                            name="reason"
                            value={form.reason}
                            onChange={(e) => setForm({ ...form, reason: e.target.value })}
                            className="input-field"
                            placeholder="Why do you want to swap?"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn-primary">Submit Request</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
