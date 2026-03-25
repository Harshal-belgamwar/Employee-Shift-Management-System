import { employees, shifts } from "../../utils/mockData";

const statusStyles = {
    active: { bg: "rgba(16, 185, 129, 0.12)", color: "#34d399" },
    on_leave: { bg: "rgba(245, 158, 11, 0.12)", color: "#fbbf24" },
    inactive: { bg: "rgba(239, 68, 68, 0.12)", color: "#f87171" },
};

export default function TeamView() {
    // Build coverage data (shifts per time slot per day)
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const timeSlots = ["Morning", "Afternoon", "Night"];

    // Mock coverage heatmap data
    const coverage = days.map((day) =>
        timeSlots.map(() => Math.floor(Math.random() * 5) + 1)
    );

    const getHeatColor = (val) => {
        if (val >= 4) return "rgba(16, 185, 129, 0.25)";
        if (val >= 3) return "rgba(59, 130, 246, 0.2)";
        if (val >= 2) return "rgba(245, 158, 11, 0.2)";
        return "rgba(239, 68, 68, 0.2)";
    };

    const getHeatTextColor = (val) => {
        if (val >= 4) return "#34d399";
        if (val >= 3) return "#60a5fa";
        if (val >= 2) return "#fbbf24";
        return "#f87171";
    };

    return (
        <div>
            <div className="page-header">
                <h1>Team View</h1>
                <p>Team roster and shift coverage overview</p>
            </div>

            {/* Team Roster */}
            <div className="section-card mb-6 animate-fade-in-up" style={{ opacity: 0 }}>
                <div className="section-card-header">
                    <h3>👥 Team Roster</h3>
                    <span className="text-xs text-slate-400">{employees.length} members</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Shifts This Period</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => {
                                const empShifts = shifts.filter((s) => s.employeeId === emp.id).length;
                                const status = statusStyles[emp.status] || statusStyles.active;
                                return (
                                    <tr key={emp.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                    style={{ background: "var(--gradient-primary)" }}
                                                >
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-white">{emp.name}</span>
                                            </div>
                                        </td>
                                        <td>{emp.email}</td>
                                        <td>
                                            <span className="capitalize">{emp.role}</span>
                                        </td>
                                        <td>{emp.department}</td>
                                        <td className="font-medium text-white">{empShifts}</td>
                                        <td>
                                            <span
                                                className="badge capitalize"
                                                style={{ background: status.bg, color: status.color }}
                                            >
                                                {emp.status.replace("_", " ")}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Coverage Heatmap */}
            <div className="section-card animate-fade-in-up" style={{ animationDelay: "100ms", opacity: 0 }}>
                <div className="section-card-header">
                    <h3>🗓️ Coverage Heatmap</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded" style={{ background: "rgba(239,68,68,0.3)" }} /> Low
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded" style={{ background: "rgba(245,158,11,0.3)" }} /> Medium
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded" style={{ background: "rgba(16,185,129,0.3)" }} /> High
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Slot</th>
                                {days.map((d) => (
                                    <th key={d} className="text-center">{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map((slot, si) => (
                                <tr key={slot}>
                                    <td className="font-medium text-white">{slot}</td>
                                    {days.map((day, di) => {
                                        const val = coverage[di][si];
                                        return (
                                            <td key={day} className="text-center">
                                                <div
                                                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold"
                                                    style={{
                                                        background: getHeatColor(val),
                                                        color: getHeatTextColor(val),
                                                    }}
                                                >
                                                    {val}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
