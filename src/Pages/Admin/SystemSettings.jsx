import { useState } from "react";
import { shiftTypes } from "../../utils/mockData";

export default function SystemSettings() {
    const [shifts, setShifts] = useState(shiftTypes);
    const [saved, setSaved] = useState(false);

    const [policies, setPolicies] = useState({
        maxHoursPerWeek: 40,
        maxConsecutiveDays: 5,
        minRestHours: 8,
        overtimeMultiplier: 1.5,
        autoApproveSwaps: false,
        notifyBeforeShift: 24,
    });

    const handlePolicyChange = (key, value) => {
        setPolicies({ ...policies, [key]: value });
        setSaved(false);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div>
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1>System Settings</h1>
                        <p>Configure scheduling rules and operational policies</p>
                    </div>
                    <button className="btn-primary" onClick={handleSave}>
                        {saved ? "✓ Settings Saved!" : "💾 Save Settings"}
                    </button>
                </div>
            </div>

            {saved && (
                <div
                    className="mb-6 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in"
                    style={{ background: "rgba(16, 185, 129, 0.1)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.2)" }}
                >
                    ✅ All settings have been saved successfully!
                </div>
            )}

            <div className="content-grid content-grid-2">
                {/* Shift Types */}
                <div className="section-card animate-fade-in-up" style={{ opacity: 0 }}>
                    <div className="section-card-header">
                        <h3>⏰ Shift Configuration</h3>
                    </div>
                    <div className="space-y-3">
                        {shifts.map((shift, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4 rounded-xl"
                                style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid var(--color-border)" }}
                            >
                                <div
                                    className="w-3 h-10 rounded-full flex-shrink-0"
                                    style={{ background: shift.color }}
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-white">{shift.name} Shift</p>
                                    <p className="text-xs text-slate-400">{shift.startTime} – {shift.endTime}</p>
                                </div>
                                <div
                                    className="text-xs font-semibold px-2 py-1 rounded-full"
                                    style={{ background: `${shift.color}20`, color: shift.color }}
                                >
                                    Active
                                </div>
                            </div>
                        ))}
                        <button
                            className="w-full py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                            style={{ border: "1px dashed var(--color-border)" }}
                        >
                            + Add Shift Type
                        </button>
                    </div>
                </div>

                {/* Scheduling Policies */}
                <div className="section-card animate-fade-in-up" style={{ animationDelay: "100ms", opacity: 0 }}>
                    <div className="section-card-header">
                        <h3>📜 Scheduling Policies</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="form-label">Max Hours Per Week</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="20"
                                    max="60"
                                    value={policies.maxHoursPerWeek}
                                    onChange={(e) => handlePolicyChange("maxHoursPerWeek", parseInt(e.target.value))}
                                    className="flex-1 accent-indigo-500"
                                />
                                <span className="text-sm font-semibold text-white w-12 text-right">{policies.maxHoursPerWeek}h</span>
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Max Consecutive Days</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="1"
                                    max="7"
                                    value={policies.maxConsecutiveDays}
                                    onChange={(e) => handlePolicyChange("maxConsecutiveDays", parseInt(e.target.value))}
                                    className="flex-1 accent-indigo-500"
                                />
                                <span className="text-sm font-semibold text-white w-12 text-right">{policies.maxConsecutiveDays}d</span>
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Minimum Rest Between Shifts</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="4"
                                    max="16"
                                    value={policies.minRestHours}
                                    onChange={(e) => handlePolicyChange("minRestHours", parseInt(e.target.value))}
                                    className="flex-1 accent-indigo-500"
                                />
                                <span className="text-sm font-semibold text-white w-12 text-right">{policies.minRestHours}h</span>
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Overtime Multiplier</label>
                            <input
                                type="number"
                                step="0.1"
                                min="1"
                                max="3"
                                value={policies.overtimeMultiplier}
                                onChange={(e) => handlePolicyChange("overtimeMultiplier", parseFloat(e.target.value))}
                                className="input-field"
                                style={{ maxWidth: 120 }}
                            />
                        </div>

                        <div>
                            <label className="form-label">Notify Before Shift (hours)</label>
                            <input
                                type="number"
                                min="1"
                                max="72"
                                value={policies.notifyBeforeShift}
                                onChange={(e) => handlePolicyChange("notifyBeforeShift", parseInt(e.target.value))}
                                className="input-field"
                                style={{ maxWidth: 120 }}
                            />
                        </div>

                        <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "rgba(30,41,59,0.4)", border: "1px solid var(--color-border)" }}>
                            <div>
                                <p className="text-sm font-medium text-white">Auto-approve Shift Swaps</p>
                                <p className="text-xs text-slate-400">Automatically approve swaps when both parties agree</p>
                            </div>
                            <button
                                onClick={() => handlePolicyChange("autoApproveSwaps", !policies.autoApproveSwaps)}
                                className="relative w-11 h-6 rounded-full transition-colors duration-200"
                                style={{
                                    background: policies.autoApproveSwaps ? "var(--color-accent)" : "var(--color-bg-tertiary)",
                                }}
                            >
                                <span
                                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
                                    style={{ transform: policies.autoApproveSwaps ? "translateX(20px)" : "translateX(0)" }}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
