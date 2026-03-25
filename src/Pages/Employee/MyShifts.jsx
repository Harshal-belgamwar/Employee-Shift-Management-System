import { useState } from "react";
import ShiftCard from "../../Components/ShiftCard";
import Calendar from "../../Components/Calendar";
import { shifts } from "../../utils/mockData";

export default function MyShifts() {
    const [view, setView] = useState("list"); // "list" | "calendar"
    const [filter, setFilter] = useState("all");

    const myShifts = shifts.filter((s) => s.employeeId === 2);
    const filteredShifts = filter === "all" ? myShifts : myShifts.filter((s) => s.status === filter);

    return (
        <div>
            <div className="page-header">
                <h1>My Shifts</h1>
                <p>View and track all your assigned shifts</p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* View toggle */}
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
                    {["list", "calendar"].map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize"
                            style={
                                view === v
                                    ? { background: "var(--gradient-primary)", color: "white" }
                                    : { color: "var(--color-text-secondary)" }
                            }
                        >
                            {v === "list" ? "📋 List" : "📅 Calendar"}
                        </button>
                    ))}
                </div>

                {/* Status filter */}
                <div className="flex gap-2">
                    {["all", "confirmed", "pending"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                            style={
                                filter === f
                                    ? { background: "var(--color-accent)", color: "white" }
                                    : { background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }
                            }
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {view === "list" ? (
                <div className="space-y-3">
                    {filteredShifts.length > 0 ? (
                        filteredShifts.map((s, i) => (
                            <div key={s.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}>
                                <ShiftCard shift={s} />
                            </div>
                        ))
                    ) : (
                        <div className="section-card text-center py-12">
                            <span className="text-4xl mb-3 block">📭</span>
                            <p className="text-slate-400">No shifts found for this filter</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="section-card">
                    <Calendar shifts={myShifts} />
                </div>
            )}
        </div>
    );
}
