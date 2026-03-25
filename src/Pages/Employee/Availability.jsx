import { useState } from "react";
import { availability as mockAvailability } from "../../utils/mockData";

export default function Availability() {
    const [slots, setSlots] = useState(mockAvailability);
    const [saved, setSaved] = useState(false);

    const toggleSlot = (dayIdx, slotIdx) => {
        const updated = [...slots];
        updated[dayIdx] = {
            ...updated[dayIdx],
            slots: updated[dayIdx].slots.map((s, i) =>
                i === slotIdx ? { ...s, available: !s.available } : s
            ),
        };
        setSlots(updated);
        setSaved(false);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div>
            <div className="page-header">
                <h1>Availability</h1>
                <p>Set your available time slots for upcoming schedule generation</p>
            </div>

            <div className="section-card animate-fade-in-up" style={{ opacity: 0 }}>
                <div className="section-card-header">
                    <h3>📅 Weekly Availability</h3>
                    <button className="btn-primary" onClick={handleSave}>
                        {saved ? "✓ Saved!" : "Save Availability"}
                    </button>
                </div>

                {saved && (
                    <div
                        className="mb-4 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in"
                        style={{ background: "rgba(16, 185, 129, 0.1)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.2)" }}
                    >
                        ✅ Availability saved successfully!
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Morning (9:00 - 17:00)</th>
                                <th>Evening (17:00 - 22:00)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slots.map((day, dayIdx) => (
                                <tr key={day.day}>
                                    <td className="font-medium text-white">{day.day}</td>
                                    {day.slots.map((slot, slotIdx) => (
                                        <td key={slotIdx}>
                                            <button
                                                onClick={() => toggleSlot(dayIdx, slotIdx)}
                                                className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200"
                                                style={
                                                    slot.available
                                                        ? {
                                                            background: "rgba(16, 185, 129, 0.12)",
                                                            color: "#34d399",
                                                            border: "1px solid rgba(16, 185, 129, 0.25)",
                                                        }
                                                        : {
                                                            background: "rgba(239, 68, 68, 0.08)",
                                                            color: "#f87171",
                                                            border: "1px solid rgba(239, 68, 68, 0.15)",
                                                        }
                                                }
                                            >
                                                {slot.available ? "✓ Available" : "✕ Unavailable"}
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 mt-4 pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: "#34d399" }} />
                        <span className="text-xs text-slate-400">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: "#f87171" }} />
                        <span className="text-xs text-slate-400">Unavailable</span>
                    </div>
                    <span className="text-xs text-slate-500 ml-auto">Click a slot to toggle</span>
                </div>
            </div>
        </div>
    );
}
