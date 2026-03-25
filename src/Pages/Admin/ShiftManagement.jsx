import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";
import AddEmployee from "./Shift/AddEmployee";

export default function ShiftManagement() {
    const navigate = useNavigate();
    const [shifts, setShifts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editShift, setEditShift] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [showAddEmployee, setShowAddEmployee] = useState(false);
    const [selectedShiftName, setSelectedShiftName] = useState("");

    const [form, setForm] = useState({
        shiftName: "",
        start_time: "",
        end_time: "",
        slots: "",
    });

    const fetchShifts = async () => {
        try {
            const res = await api.get("/admin/shifts");
            setShifts(res.data);
        } catch (err) {
            toast.error("Failed to load shifts");
        }
    };

    useEffect(() => {
        fetchShifts();
    }, []);

    const openAddEmployee = (shiftName) => {
        setSelectedShiftName(shiftName);
        setShowAddEmployee(true);
    };

    const openAdd = () => {
        setEditShift(null);
        setForm({ shiftName: "", start_time: "", end_time: "", slots: "" });
        setShowModal(true);
    };

    const openEdit = (shift) => {
        setEditShift(shift);
        setForm({
            shiftName: shift.shiftName,
            start_time: shift.start_time,
            end_time: shift.end_time,
            slots: shift.slots,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditShift(null);
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editShift) {
                await api.put(`/admin/shifts/${editShift.shiftName}`, form);
                toast.success("Shift updated");
            } else {
                await api.post("/admin/shifts", form);
                toast.success("Shift created");
            }
            closeModal();
            fetchShifts();
        } catch (err) {
            toast.error("Operation failed");
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/admin/shifts/${deleteTarget}`);
            toast.success("Shift deleted");
            setDeleteTarget(null);
            fetchShifts();
        } catch (err) {
            toast.error("Failed to delete shift");
        }
    };

    const handleReset = () => {
        if (editShift) {
            setForm({
                shiftName: editShift.shiftName,
                start_time: editShift.start_time,
                end_time: editShift.end_time,
                slots: editShift.slots,
            });
        } else {
            setForm({ shiftName: "", start_time: "", end_time: "", slots: "" });
        }
    };

    const fmt = (t) => {
        if (!t) return "—";
        const [hStr, m] = t.split(":");
        let h = parseInt(hStr, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        return `${h}:${m} ${ampm}`;
    };

    const totalSlots = shifts.reduce((acc, s) => acc + (Number(s.slots) || 0), 0);

    const pageStyle = {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        minHeight: "100vh",
        padding: "40px 24px",
    };

    const stats = [
        { label: "Total Shifts", value: shifts.length, hint: "Configured shifts", bg: "#7c3aed", hintColor: "#c4b5fd" },
        { label: "Total Slots", value: totalSlots, hint: "Across all shifts", bg: "#0891b2", hintColor: "#a5f3fc" },
        { label: "Active Today", value: shifts.length, hint: "Running now", bg: "#d97706", hintColor: "#fde68a" },
    ];

    return (
        <div style={pageStyle}>
            <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Back Button */}
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 7,
                            background: "rgba(255,255,255,0.07)", color: "#a5b4fc",
                            border: "1px solid rgba(165,180,252,0.2)",
                            borderRadius: 10, padding: "7px 14px",
                            fontSize: 13, fontWeight: 500, cursor: "pointer",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.13)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                    >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                            <path d="M9.5 3L5 7.5L9.5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back
                    </button>
                </div>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <h1 style={{ color: "#ffffff", fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", margin: 0 }}>
                            Shift Management
                        </h1>
                        <p style={{ color: "#a5b4fc", fontSize: 13, marginTop: 5, marginBottom: 0 }}>
                            Configure shifts, timings and capacity
                        </p>
                    </div>
                    <button
                        onClick={openAdd}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            background: "linear-gradient(135deg, #818cf8, #6366f1)",
                            color: "#fff", border: "none", padding: "10px 20px",
                            borderRadius: 12, fontSize: 13, fontWeight: 600,
                            cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.5)",
                        }}
                    >
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                        Add Shift
                    </button>
                </div>

                {/* Stat Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                    {stats.map((s) => (
                        <div key={s.label} style={{ background: s.bg, borderRadius: 16, padding: "20px 22px" }}>
                            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", margin: "0 0 8px" }}>
                                {s.label}
                            </p>
                            <p style={{ color: "#fff", fontSize: 32, fontWeight: 700, letterSpacing: "-1px", lineHeight: 1, margin: 0 }}>
                                {s.value}
                            </p>
                            <p style={{ color: s.hintColor, fontSize: 12, margin: "6px 0 0" }}>
                                {s.hint}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div style={{
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 20, overflow: "hidden", backdropFilter: "blur(10px)",
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
                                {["Shift Name", "Start", "End", "Slots", "Actions"].map((h, i) => (
                                    <th key={h} style={{
                                        padding: "13px 20px", textAlign: i === 4 ? "right" : "left",
                                        fontSize: 10.5, fontWeight: 700, letterSpacing: "0.8px",
                                        textTransform: "uppercase", color: "#818cf8",
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {shifts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: "60px 20px", textAlign: "center", color: "#64748b", fontSize: 14 }}>
                                        No shifts configured yet
                                    </td>
                                </tr>
                            ) : (
                                shifts.map((shift, idx) => (
                                    <tr
                                        key={shift.shiftName}
                                        style={{ borderBottom: idx < shifts.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "background 0.15s" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <td style={{ padding: "15px 20px", fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>
                                            {shift.shiftName}
                                        </td>
                                        <td style={{ padding: "15px 20px" }}>
                                            <span style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, padding: "4px 11px", fontSize: 12, fontWeight: 600 }}>
                                                {fmt(shift.start_time)}
                                            </span>
                                        </td>
                                        <td style={{ padding: "15px 20px" }}>
                                            <span style={{ background: "rgba(6,182,212,0.15)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.25)", borderRadius: 8, padding: "4px 11px", fontSize: 12, fontWeight: 600 }}>
                                                {fmt(shift.end_time)}
                                            </span>
                                        </td>
                                        <td style={{ padding: "15px 20px" }}>
                                            <span style={{ background: "rgba(52,211,153,0.15)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 8, padding: "4px 11px", fontSize: 12, fontWeight: 600 }}>
                                                {shift.slots} slots
                                            </span>
                                        </td>
                                        <td style={{ padding: "15px 20px", textAlign: "right" }}>
                                            <div style={{ display: "inline-flex", gap: 8 }}>
                                                <button
                                                    onClick={() => openAddEmployee(shift.shiftName)}
                                                    style={{
                                                        background: "rgba(52,211,153,0.12)",
                                                        color: "#6ee7b7",
                                                        border: "1px solid rgba(52,211,153,0.25)",
                                                        borderRadius: 8,
                                                        padding: "6px 14px",
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(52,211,153,0.22)"}
                                                    onMouseLeave={e => e.currentTarget.style.background = "rgba(52,211,153,0.12)"}
                                                >
                                                    Add Employee
                                                </button>
                                                <button
                                                    onClick={() => openEdit(shift)}
                                                    style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.35)", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.35)"}
                                                    onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.2)"}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(shift.shiftName)}
                                                    style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.3)"}
                                                    onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {
                showAddEmployee && (
                    <AddEmployee onClose={() => setShowAddEmployee(false)} shiftName={selectedShiftName} />
                )
            }

            {/* Add / Edit Modal */}
            {showModal && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                    onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
                >
                    <div style={{ background: "#1e1b4b", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 22, padding: 28, width: 400, boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
                        <h2 style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>
                            {editShift ? "Edit Shift" : "Add Shift"}
                        </h2>
                        <p style={{ color: "#818cf8", fontSize: 13, margin: "0 0 24px" }}>
                            {editShift ? "Update the details for this shift" : "Fill in the details to configure a new shift"}
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                { label: "Shift Name", name: "shiftName", type: "text", placeholder: "e.g. Morning Shift" },
                                { label: "Start Time", name: "start_time", type: "time", placeholder: "" },
                                { label: "End Time", name: "end_time", type: "time", placeholder: "" },
                                { label: "Capacity (Slots)", name: "slots", type: "number", placeholder: "e.g. 20" },
                            ].map((f) => (
                                <div key={f.name}>
                                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "#818cf8", marginBottom: 7 }}>
                                        {f.label}
                                    </label>
                                    <input
                                        type={f.type}
                                        name={f.name}
                                        value={form[f.name]}
                                        onChange={handleChange}
                                        placeholder={f.placeholder}
                                        min={f.name === "slots" ? 1 : undefined}
                                        required
                                        style={{
                                            width: "100%", background: "rgba(255,255,255,0.06)",
                                            border: "1px solid rgba(99,102,241,0.25)",
                                            borderRadius: 10, padding: "10px 14px",
                                            fontSize: 14, color: "#f1f5f9",
                                            outline: "none", boxSizing: "border-box",
                                            colorScheme: "dark",
                                        }}
                                        onFocus={e => { e.target.style.borderColor = "#818cf8"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.2)"; }}
                                        onBlur={e => { e.target.style.borderColor = "rgba(99,102,241,0.25)"; e.target.style.boxShadow = "none"; }}
                                    />
                                </div>
                            ))}

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
                                <button type="button" onClick={handleReset}
                                    style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                                    Reset
                                </button>
                                <button type="button" onClick={closeModal}
                                    style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                                    Cancel
                                </button>
                                <button type="submit"
                                    style={{ background: "linear-gradient(135deg, #818cf8, #6366f1)", color: "#fff", border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}>
                                    Save Shift
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteTarget && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
                    onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}
                >
                    <div style={{ background: "#1e1b4b", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 22, padding: 32, width: 380, boxShadow: "0 24px 60px rgba(0,0,0,0.6)", textAlign: "center" }}>

                        {/* Icon */}
                        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 11v6M14 11v6" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </div>

                        <h2 style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>
                            Delete Shift
                        </h2>
                        <p style={{ color: "#94a3b8", fontSize: 14, margin: "0 0 6px", lineHeight: 1.6 }}>
                            Are you sure you want to delete
                        </p>
                        <p style={{ color: "#fca5a5", fontSize: 15, fontWeight: 600, margin: "0 0 24px" }}>
                            "{deleteTarget}"?
                        </p>
                        <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 28px" }}>
                            This action cannot be undone.
                        </p>

                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            <button
                                onClick={() => setDeleteTarget(null)}
                                style={{ flex: 1, background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                style={{ flex: 1, background: "linear-gradient(135deg, #ef4444)", color: "#fff", border: "none", borderRadius: 12, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(239,68,68,0.4)" }}
                                onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}