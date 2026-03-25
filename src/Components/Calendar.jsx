import { useState, useMemo } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const typeColors = {
    Morning: "#f59e0b",
    Afternoon: "#6366f1",
    Night: "#8b5cf6",
};

export default function Calendar({ shifts = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // 🔥 MODAL STATE
    const [openModal, setOpenModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const monthLabel = currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    // Group shifts by date
    const shiftsByDate = useMemo(() => {
        const map = {};
        shifts.forEach((s) => {
            const day = parseInt(s.date.split("-")[2], 10);
            const m = parseInt(s.date.split("-")[1], 10) - 1;
            const y = parseInt(s.date.split("-")[0], 10);

            if (y === year && m === month) {
                if (!map[day]) map[day] = [];
                map[day].push(s);
            }
        });
        return map;
    }, [shifts, year, month]);

    const today = new Date();

    const isToday = (day) =>
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day;

    const cells = [];
    for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    // 🔥 OPEN MODAL
    const handleView = (day) => {
        const date = new Date(year, month, day);
        const formatted = date.toISOString().split("T")[0];

        setSelectedDate(formatted);
        setOpenModal(true);
    };

    const selectedShifts = shifts.filter(
        (s) => s.date?.split("T")[0] === selectedDate
    );

    return (
        <div className="relative">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="btn-secondary">
                    ◂
                </button>
                <h3 className="text-base font-semibold text-white">
                    {monthLabel}
                </h3>
                <button onClick={nextMonth} className="btn-secondary">
                    ▸
                </button>
            </div>

            {/* DAYS */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS.map((d) => (
                    <div key={d} className="text-center text-[11px] text-slate-500">
                        {d}
                    </div>
                ))}
            </div>

            {/* GRID */}
            <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => (
                    <div
                        key={i}
                        className={`relative min-h-[70px] rounded-xl p-1.5 ${day ? "hover:bg-white/5 cursor-pointer" : ""
                            }`}
                        style={{
                            background: isToday(day)
                                ? "rgba(99, 102, 241, 0.1)"
                                : day
                                    ? "rgba(30, 41, 59, 0.3)"
                                    : "transparent",
                            border: isToday(day)
                                ? "1px solid rgba(99, 102, 241, 0.3)"
                                : "1px solid transparent",
                        }}
                    >
                        {day && (
                            <>
                                {/* DATE */}
                                <span className="text-xs text-slate-400">
                                    {day}
                                </span>

                                {/* SHIFT PREVIEW */}
                                <div className="mt-1">
                                    {(shiftsByDate[day] || [])
                                        .slice(0, 2)
                                        .map((s, idx) => (
                                            <div
                                                key={idx}
                                                className="text-[9px] truncate"
                                                style={{
                                                    color:
                                                        typeColors[s.type] ||
                                                        "#6366f1",
                                                }}
                                            >
                                                {s.type} {s.startTime}
                                            </div>
                                        ))}
                                </div>

                                {/* VIEW BUTTON */}
                                <button
                                    onClick={() => handleView(day)}
                                    className="mt-1 text-[10px] text-indigo-400 underline"
                                >
                                    View
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* ================= MODAL ================= */}
            {openModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                    <div className="bg-slate-900 w-[320px] rounded-xl p-4 relative shadow-xl">

                        {/* CLOSE */}
                        <button
                            onClick={() => setOpenModal(false)}
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-400"
                        >
                            ✕
                        </button>

                        {/* TITLE */}
                        <h3 className="text-white font-semibold mb-2">
                            Shift Details
                        </h3>

                        {/* DATE */}
                        <p className="text-indigo-400 text-sm mb-3">
                            {selectedDate}
                        </p>

                        {/* CONTENT */}
                        <div className="space-y-2 max-h-[250px] overflow-auto">
                            {selectedShifts.length > 0 ? (
                                selectedShifts.map((s, i) => (
                                    <div
                                        key={i}
                                        className="bg-white/5 p-2 rounded-lg text-sm"
                                    >
                                        <div className="text-white font-medium">
                                            {s.type}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {s.startTime} - {s.endTime}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm">
                                    No shifts assigned
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}