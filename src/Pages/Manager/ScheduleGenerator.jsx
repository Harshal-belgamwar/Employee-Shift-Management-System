import { useState } from "react";
import Calendar from "../../Components/Calendar";
import ShiftCard from "../../Components/ShiftCard";
import { shifts as mockShifts, employees, departments } from "../../utils/mockData";

export default function ScheduleGenerator() {
    const [period, setPeriod] = useState("weekly");
    const [department, setDepartment] = useState("All");
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [published, setPublished] = useState(false);

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setGenerated(true);
            setPublished(false);
        }, 2000);
    };

    const handlePublish = () => {
        setPublished(true);
    };

    const filteredShifts =
        department === "All"
            ? mockShifts
            : mockShifts.filter((s) => s.department === department);

    return (
        <div>
            <div className="page-header">
                <h1>Schedule Generator</h1>
                <p>Generate and publish shift schedules for your team</p>
            </div>

            {/* Controls */}
            <div className="section-card mb-6 animate-fade-in-up" style={{ opacity: 0 }}>
                <div className="section-card-header">
                    <h3>⚙️ Schedule Configuration</h3>
                </div>

                <div className="form-row mb-4">
                    <div>
                        <label className="form-label">Period</label>
                        <div className="flex gap-2">
                            {["weekly", "monthly"].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all capitalize"
                                    style={
                                        period === p
                                            ? { background: "var(--gradient-primary)", color: "white", boxShadow: "0 4px 14px rgba(99,102,241,0.25)" }
                                            : { background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }
                                    }
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Department</label>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="select-field"
                        >
                            <option value="All">All Departments</option>
                            {departments.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Start Date</label>
                        <input type="date" className="input-field" defaultValue="2026-02-25" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        className="btn-primary"
                        onClick={handleGenerate}
                        disabled={generating}
                        style={{ opacity: generating ? 0.7 : 1 }}
                    >
                        {generating ? (
                            <span className="flex items-center gap-2">
                                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating...
                            </span>
                        ) : (
                            "⚡ Generate Schedule"
                        )}
                    </button>

                    {generated && !published && (
                        <button className="btn-success" onClick={handlePublish}>
                            📢 Publish Schedule
                        </button>
                    )}

                    {published && (
                        <span className="badge badge-success">✓ Published</span>
                    )}
                </div>
            </div>

            {/* Generated Result */}
            {generated && (
                <div className="content-grid content-grid-2">
                    {/* Calendar view */}
                    <div className="section-card animate-fade-in-up" style={{ opacity: 0 }}>
                        <div className="section-card-header">
                            <h3>📅 Schedule Preview</h3>
                            <span className="badge badge-info">{period}</span>
                        </div>
                        <Calendar shifts={filteredShifts} />
                    </div>

                    {/* Shift list */}
                    <div className="section-card animate-fade-in-up" style={{ animationDelay: "100ms", opacity: 0 }}>
                        <div className="section-card-header">
                            <h3>📋 Generated Shifts</h3>
                            <span className="text-xs text-slate-400">{filteredShifts.length} shifts</span>
                        </div>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {filteredShifts.map((s) => (
                                <ShiftCard key={s.id} shift={s} showEmployee />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {!generated && (
                <div className="section-card text-center py-16 animate-fade-in">
                    <span className="text-5xl mb-4 block">⚡</span>
                    <h3 className="text-lg font-semibold text-white mb-2">Ready to Generate</h3>
                    <p className="text-sm text-slate-400 max-w-md mx-auto">
                        Configure your schedule settings above and click Generate to create an optimized shift schedule for your team.
                    </p>
                </div>
            )}
        </div>
    );
}
