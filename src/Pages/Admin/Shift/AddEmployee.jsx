import React, { useState } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";

export default function AddEmployee({ onClose, shiftName }) {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        setLoading(true);
        try {
            await api.post(`/admin/users/${username}/shift/${shiftName}`);
            toast.success(`${username} added successfully to ${shiftName}`);
            setUsername("");
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add employee");
        } finally {
            setLoading(false);
        }
    };

    const overlayStyle = {
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    };

    const cardStyle = {
        background: "#1e1b4b",
        border: "1px solid rgba(99,102,241,0.25)",
        borderRadius: 22,
        padding: 32,
        width: 390,
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        position: "relative",
    };

    return (
        <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={cardStyle}>

                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute", top: 16, right: 16,
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8, width: 30, height: 30,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#94a3b8", fontSize: 14, lineHeight: 1,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; e.currentTarget.style.color = "#fca5a5"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#94a3b8"; }}
                >
                    ✕
                </button>

                {/* Icon */}
                <div style={{
                    width: 50, height: 50, borderRadius: "50%",
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="#818cf8" strokeWidth="1.8" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M19 8v4M21 10h-4" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </div>

                {/* Title + shift name shown once */}
                <h2 style={{ color: "#f1f5f9", fontSize: 17, fontWeight: 700, textAlign: "center", margin: "0 0 4px" }}>
                    Assign Employee
                </h2>
                <p style={{ color: "#818cf8", fontSize: 13, textAlign: "center", margin: "0 0 26px" }}>
                    to shift&nbsp;<span style={{ color: "#a5b4fc", fontWeight: 600 }}>"{shiftName}"</span>
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <label style={{
                        display: "block", fontSize: 11, fontWeight: 700,
                        letterSpacing: "0.5px", textTransform: "uppercase",
                        color: "#818cf8", marginBottom: 8,
                    }}>
                        Username
                    </label>
                    <input
                        type="text"
                        placeholder="Enter employee username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                            width: "100%", boxSizing: "border-box",
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(99,102,241,0.25)",
                            borderRadius: 10, padding: "11px 14px",
                            fontSize: 14, color: "#f1f5f9",
                            outline: "none", marginBottom: 22,
                        }}
                        onFocus={e => { e.target.style.borderColor = "#818cf8"; e.target.style.boxShadow = "0 0 0 2px rgba(99,102,241,0.15)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(99,102,241,0.25)"; e.target.style.boxShadow = "none"; }}
                    />

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1, background: "rgba(255,255,255,0.06)",
                                color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 12, padding: "10px 0",
                                fontSize: 13, fontWeight: 600, cursor: "pointer",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.11)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                flex: 1,
                                background: loading ? "rgba(99,102,241,0.35)" : "linear-gradient(135deg, #818cf8, #6366f1)",
                                color: "#fff", border: "none",
                                borderRadius: 12, padding: "10px 0",
                                fontSize: 13, fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                boxShadow: loading ? "none" : "0 2px 8px rgba(99,102,241,0.3)",
                                transition: "opacity 0.15s",
                            }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.88"; }}
                            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                        >
                            {loading ? "Assigning…" : "Assign"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}