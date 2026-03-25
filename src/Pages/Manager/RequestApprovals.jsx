import { useState } from "react";
import { leaveRequests as mockLeaves, swapRequests as mockSwaps } from "../../utils/mockData";

const statusStyles = {
    approved: { bg: "rgba(16, 185, 129, 0.12)", color: "#34d399" },
    pending: { bg: "rgba(245, 158, 11, 0.12)", color: "#fbbf24" },
    rejected: { bg: "rgba(239, 68, 68, 0.12)", color: "#f87171" },
};

export default function RequestApprovals() {
    const [tab, setTab] = useState("leaves");
    const [leaves, setLeaves] = useState(mockLeaves);
    const [swaps, setSwaps] = useState(mockSwaps);

    const handleLeaveAction = (id, action) => {
        setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: action } : l)));
    };

    const handleSwapAction = (id, action) => {
        setSwaps(swaps.map((s) => (s.id === id ? { ...s, status: action } : s)));
    };

    const pendingLeaves = leaves.filter((l) => l.status === "pending");
    const pendingSwaps = swaps.filter((s) => s.status === "pending");

    return (
        <div>
            <div className="page-header">
                <h1>Request Approvals</h1>
                <p>Review and manage employee leave and shift swap requests</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
                <button
                    onClick={() => setTab("leaves")}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={tab === "leaves" ? { background: "var(--gradient-primary)", color: "white" } : { color: "var(--color-text-secondary)" }}
                >
                    ✉️ Leave Requests
                    {pendingLeaves.length > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(245,158,11,0.2)", color: "#fbbf24" }}>
                            {pendingLeaves.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setTab("swaps")}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={tab === "swaps" ? { background: "var(--gradient-primary)", color: "white" } : { color: "var(--color-text-secondary)" }}
                >
                    🔄 Shift Swaps
                    {pendingSwaps.length > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(245,158,11,0.2)", color: "#fbbf24" }}>
                            {pendingSwaps.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Leave Requests */}
            {tab === "leaves" && (
                <div className="space-y-4">
                    {leaves.map((req, i) => {
                        const style = statusStyles[req.status];
                        return (
                            <div
                                key={req.id}
                                className="glass-card p-5 animate-fade-in-up"
                                style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                                            style={{ background: "var(--gradient-primary)" }}
                                        >
                                            {req.employeeName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{req.employeeName}</p>
                                            <p className="text-xs text-slate-400">{req.type}</p>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm text-white">{req.startDate} → {req.endDate}</p>
                                        <p className="text-xs text-slate-500">Applied: {req.appliedOn}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {req.status === "pending" ? (
                                            <>
                                                <button
                                                    className="btn-success"
                                                    style={{ padding: "0.4rem 1rem", fontSize: "0.8125rem" }}
                                                    onClick={() => handleLeaveAction(req.id, "approved")}
                                                >
                                                    ✓ Approve
                                                </button>
                                                <button
                                                    className="btn-danger"
                                                    style={{ padding: "0.4rem 1rem", fontSize: "0.8125rem" }}
                                                    onClick={() => handleLeaveAction(req.id, "rejected")}
                                                >
                                                    ✕ Reject
                                                </button>
                                            </>
                                        ) : (
                                            <span className="badge capitalize" style={{ background: style.bg, color: style.color }}>
                                                {req.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                                    💬 {req.reason}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Shift Swaps */}
            {tab === "swaps" && (
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
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: "var(--gradient-primary)" }}>
                                            {swap.requesterName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{swap.requesterName}</p>
                                            <p className="text-xs text-slate-400">Requester</p>
                                        </div>
                                    </div>

                                    <span className="text-xl text-slate-500">⇄</span>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: "var(--gradient-success)" }}>
                                            {swap.targetName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{swap.targetName}</p>
                                            <p className="text-xs text-slate-400">Target</p>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm text-white">{swap.shiftDate}</p>
                                        <p className="text-xs text-slate-400">{swap.shiftTime}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {swap.status === "pending" ? (
                                            <>
                                                <button className="btn-success" style={{ padding: "0.4rem 1rem", fontSize: "0.8125rem" }} onClick={() => handleSwapAction(swap.id, "approved")}>
                                                    ✓ Approve
                                                </button>
                                                <button className="btn-danger" style={{ padding: "0.4rem 1rem", fontSize: "0.8125rem" }} onClick={() => handleSwapAction(swap.id, "rejected")}>
                                                    ✕ Reject
                                                </button>
                                            </>
                                        ) : (
                                            <span className="badge capitalize" style={{ background: style.bg, color: style.color }}>{swap.status}</span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                                    💬 {swap.reason}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
