const statusStyles = {
    confirmed: { bg: "rgba(16, 185, 129, 0.12)", color: "#34d399", label: "Confirmed" },
    pending: { bg: "rgba(245, 158, 11, 0.12)", color: "#fbbf24", label: "Pending" },
    cancelled: { bg: "rgba(239, 68, 68, 0.12)", color: "#f87171", label: "Cancelled" },
};

const typeColors = {
    Morning: "#f59e0b",
    Afternoon: "#6366f1",
    Night: "#8b5cf6",
};

export default function ShiftCard({ shift, showEmployee = false }) {
    const status = statusStyles[shift.status] || statusStyles.pending;
    const typeColor = typeColors[shift.type] || "#6366f1";

    return (
        <div className="glass-card p-4 flex items-center gap-4">
            {/* Time stripe */}
            <div
                className="w-1 self-stretch rounded-full flex-shrink-0"
                style={{ background: typeColor }}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
                {showEmployee && (
                    <p className="text-sm font-semibold text-white truncate">{shift.employeeName}</p>
                )}
                <p className="text-[13px] text-slate-300">
                    {shift.startTime} – {shift.endTime}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: `${typeColor}22`, color: typeColor }}
                    >
                        {shift.type}
                    </span>
                    <span className="text-xs text-slate-500">{shift.department}</span>
                </div>
            </div>

            {/* Date & status */}
            <div className="text-right flex-shrink-0">
                <p className="text-xs text-slate-400">{shift.date}</p>
                <span
                    className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1"
                    style={{ background: status.bg, color: status.color }}
                >
                    {status.label}
                </span>
            </div>
        </div>
    );
}
