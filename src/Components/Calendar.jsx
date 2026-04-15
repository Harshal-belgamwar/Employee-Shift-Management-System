import { useState, useMemo } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const typeColors = {
    Morning: "#f59e0b",
    Afternoon: "#6366f1",
    Night: "#8b5cf6",
};

export default function Calendar({ shifts = [], userData }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // 🔥 MODAL STATE
    const [openModal, setOpenModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [form, setForm] = useState({
        shiftName: "",
        startTime: "",
        endTime: "",
    });

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



    const today = new Date();

    const isToday = (day) =>
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day;

    const cells = [];
    for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);



    //  OPEN MODAL
    const handleView = async (day) => {
        try {
            const date = new Date(year, month, day);

            const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            setSelectedDate(formatted);
            setOpenModal(true);

            const response = await api.get(
                `/employee/shift-assign/${userData.username}/${formatted}`
            );
            console.log(response.data);
            setForm(response.data);
        } catch (err) {
            console.log(err);
            toast.error(
                err?.response?.data?.message || "Failed to fetch shift"
            );
        }
    };


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
                            <div className="flex flex-col">
                                {/* DATE */}
                                <span className="text-xs text-slate-400">
                                    {day}
                                </span>

                                {/* VIEW BUTTON */}
                                <button
                                    onClick={() => handleView(day)}
                                    className="mt-1 text-[10px] text-indigo-400 underline"
                                >
                                    View
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ================= MODAL ================= */}
            {/* ================= MODAL ================= */}
            {openModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.55)" }}>
                    <div
                        style={{
                            width: 340,
                            background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
                            borderRadius: 20,
                            boxShadow: "0 0 0 1px rgba(99,102,241,0.18), 0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.08)",
                            padding: "28px 24px 24px",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Decorative top accent bar */}
                        <div style={{
                            position: "absolute",
                            top: 0, left: 0, right: 0,
                            height: 3,
                            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
                            borderRadius: "20px 20px 0 0",
                        }} />

                        {/* Decorative glow blob */}
                        <div style={{
                            position: "absolute",
                            top: -40, right: -40,
                            width: 140, height: 140,
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
                            pointerEvents: "none",
                        }} />

                        {/* CLOSE */}
                        <button
                            onClick={() => setOpenModal(false)}
                            style={{
                                position: "absolute",
                                top: 14, right: 14,
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "#94a3b8",
                                borderRadius: 8,
                                width: 28, height: 28,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer",
                                fontSize: 13,
                                lineHeight: 1,
                                transition: "background 0.2s, color 0.2s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#f87171"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#94a3b8"; }}
                        >
                            ✕
                        </button>

                        {/* TITLE */}
                        <h3 style={{
                            color: "#f1f5f9",
                            fontWeight: 700,
                            fontSize: 16,
                            letterSpacing: "0.01em",
                            marginBottom: 6,
                        }}>
                            Shift Details
                        </h3>

                        {/* DATE BADGE */}
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: "rgba(99,102,241,0.12)",
                            border: "1px solid rgba(99,102,241,0.25)",
                            borderRadius: 8,
                            padding: "3px 10px",
                            marginBottom: 20,
                        }}>
                            <span style={{ fontSize: 11, color: "#a5b4fc", letterSpacing: "0.05em", fontWeight: 500 }}>
                                📅 {selectedDate}
                            </span>
                        </div>

                        {/* CONTENT */}
                        <div style={{ maxHeight: 260, overflowY: "auto" }}>
                            {form && form.shiftName ? (
                                <div style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: 12,
                                    padding: "14px 16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                }}>
                                    {/* Shift type dot + name */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{
                                            width: 8, height: 8, borderRadius: "50%",
                                            background: typeColors[form.shiftName] || "#6366f1",
                                            flexShrink: 0,
                                            boxShadow: `0 0 6px ${typeColors[form.shiftName] || "#6366f1"}`,
                                        }} />
                                        <span style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14 }}>
                                            {form.shiftName}
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

                                    {/* Times */}
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                            <span style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Start</span>
                                            <span style={{ fontSize: 14, color: "#a5b4fc", fontWeight: 500 }}>{form.startTime}</span>
                                        </div>
                                        <div style={{ color: "#334155", alignSelf: "center", fontSize: 18 }}>→</div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end" }}>
                                            <span style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>End</span>
                                            <span style={{ fontSize: 14, color: "#a5b4fc", fontWeight: 500 }}>{form.endTime}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "28px 0",
                                    gap: 8,
                                }}>
                                    <span style={{ fontSize: 28, opacity: 0.3 }}>🗓️</span>
                                    <span style={{ color: "#475569", fontSize: 13 }}>No shifts assigned</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}