import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../utils/api";

export default function Update({ user, closeModal }) {
    const [form, setForm] = useState({ username: "", role: "", status: "" });
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const roles = ["Admin", "Manager", "Employee"];
    const statuses = ["Active", "Inactive", "OnLeave"];

    const statusColors = {
        Active: { dot: "#22c55e", label: "Active" },
        Inactive: { dot: "#ef4444", label: "Inactive" },
        OnLeave: { dot: "#f59e0b", label: "On Leave" },
    };

    const roleIcons = {
        Admin: "⬡",
        Manager: "◈",
        Employee: "◉",
    };

    useEffect(() => {
        if (user) {
            setForm({ username: user.username || "", role: user.role || "", status: user.status || "" });
            setTimeout(() => setVisible(true), 10);
        }
    }, [user]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/admin/users/${user.username}`, form);
            toast.success("User updated successfully!");
            handleClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        if (user) setForm({ username: user.username, role: user.role, status: user.status });
    };

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => closeModal(), 300);
    };

    if (!user) return null;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

                .um-overlay {
                    font-family: 'DM Sans', sans-serif;
                    position: fixed; inset: 0; z-index: 50;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(5, 5, 15, 0.75);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    opacity: 0; transition: opacity 0.3s ease;
                }
                .um-overlay.visible { opacity: 1; }

                .um-card {
                    position: relative;
                    width: 100%; max-width: 440px; margin: 1rem;
                    background: linear-gradient(145deg, #1a1a2e 0%, #16162a 60%, #1a1a2e 100%);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 24px;
                    padding: 0;
                    box-shadow:
                        0 0 0 1px rgba(139,92,246,0.15),
                        0 32px 64px rgba(0,0,0,0.6),
                        0 0 80px rgba(139,92,246,0.08);
                    transform: translateY(24px) scale(0.97);
                    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease;
                    opacity: 0;
                    overflow: hidden;
                }
                .um-overlay.visible .um-card {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }

                /* Glowing top accent */
                .um-card::before {
                    content: '';
                    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
                    width: 60%; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.8), transparent);
                }

                .um-header {
                    padding: 28px 28px 20px;
                    display: flex; align-items: flex-start; justify-content: space-between;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }

                .um-title-block {}
                .um-eyebrow {
                    font-family: 'Syne', sans-serif;
                    font-size: 10px; font-weight: 700; letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: rgba(139,92,246,0.8);
                    margin-bottom: 4px;
                }
                .um-title {
                    font-family: 'Syne', sans-serif;
                    font-size: 22px; font-weight: 800;
                    color: #f0f0ff;
                    letter-spacing: -0.02em;
                    line-height: 1.1;
                }

                .um-close {
                    width: 32px; height: 32px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 50%;
                    color: rgba(255,255,255,0.5);
                    font-size: 14px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    flex-shrink: 0; margin-top: 2px;
                }
                .um-close:hover {
                    background: rgba(239,68,68,0.15);
                    border-color: rgba(239,68,68,0.4);
                    color: #ef4444;
                    transform: rotate(90deg);
                }

                .um-body { padding: 24px 28px 28px; display: flex; flex-direction: column; gap: 18px; }

                .um-field { display: flex; flex-direction: column; gap: 8px; }

                .um-label {
                    font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
                    text-transform: uppercase; color: rgba(255,255,255,0.35);
                }

                .um-input-wrap { position: relative; }

                .um-input, .um-select {
                    width: 100%; box-sizing: border-box;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    padding: 13px 16px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 15px; font-weight: 400;
                    color: #e8e8f8;
                    outline: none;
                    transition: all 0.2s ease;
                    -webkit-appearance: none; appearance: none;
                }
                .um-input::placeholder { color: rgba(255,255,255,0.2); }
                .um-input:focus, .um-select:focus {
                    background: rgba(139,92,246,0.08);
                    border-color: rgba(139,92,246,0.5);
                    box-shadow: 0 0 0 3px rgba(139,92,246,0.12);
                }

                /* Custom select arrow */
                .um-select-wrap { position: relative; }
                .um-select-wrap::after {
                    content: '';
                    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
                    width: 0; height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 5px solid rgba(255,255,255,0.3);
                    pointer-events: none;
                }
                .um-select { cursor: pointer; padding-right: 38px; }
                .um-select option { background: #1a1a2e; color: #e8e8f8; }

                /* Status badge preview */
                .um-status-preview {
                    position: absolute; right: 38px; top: 50%; transform: translateY(-50%);
                    display: flex; align-items: center; gap: 6px;
                    pointer-events: none; opacity: 0; transition: opacity 0.2s;
                }
                .um-status-preview.show { opacity: 1; }
                .um-status-dot {
                    width: 7px; height: 7px; border-radius: 50%;
                    box-shadow: 0 0 6px currentColor;
                }

                /* Actions */
                .um-actions {
                    display: flex; align-items: center; gap: 10px;
                    padding-top: 4px;
                }
                .um-spacer { flex: 1; }

                .um-btn {
                    font-family: 'Syne', sans-serif;
                    font-size: 13px; font-weight: 600; letter-spacing: 0.04em;
                    padding: 10px 18px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                    display: flex; align-items: center; gap: 6px;
                }
                .um-btn-ghost {
                    background: transparent;
                    color: rgba(255,255,255,0.3);
                    border: 1px solid rgba(255,255,255,0.08);
                }
                .um-btn-ghost:hover {
                    color: rgba(255,255,255,0.6);
                    border-color: rgba(255,255,255,0.2);
                    background: rgba(255,255,255,0.04);
                }
                .um-btn-reset {
                    background: rgba(255,255,255,0.05);
                    color: rgba(255,255,255,0.4);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .um-btn-reset:hover {
                    background: rgba(255,255,255,0.08);
                    color: rgba(255,255,255,0.65);
                }
                .um-btn-primary {
                    background: linear-gradient(135deg, #7c3aed, #6d28d9);
                    color: #fff;
                    box-shadow: 0 4px 16px rgba(109,40,217,0.35), 0 1px 0 rgba(255,255,255,0.1) inset;
                    padding: 10px 24px;
                }
                .um-btn-primary:hover:not(:disabled) {
                    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                    box-shadow: 0 6px 20px rgba(109,40,217,0.5);
                    transform: translateY(-1px);
                }
                .um-btn-primary:active:not(:disabled) { transform: translateY(0); }
                .um-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

                /* Loading spinner */
                .um-spinner {
                    width: 13px; height: 13px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: um-spin 0.6s linear infinite;
                }
                @keyframes um-spin { to { transform: rotate(360deg); } }

                /* Divider */
                .um-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
                    margin: 0 -28px;
                }
            `}</style>

            <div className={`um-overlay${visible ? " visible" : ""}`} onClick={(e) => e.target === e.currentTarget && handleClose()}>
                <div className="um-card" role="dialog" aria-modal="true">
                    {/* Header */}
                    <div className="um-header">
                        <div className="um-title-block">
                            <div className="um-eyebrow">User Management</div>
                            <div className="um-title">Edit Profile</div>
                        </div>
                        <button className="um-close" onClick={handleClose} aria-label="Close">✕</button>
                    </div>

                    {/* Form body */}
                    <form onSubmit={handleSubmit}>
                        <div className="um-body">

                            {/* Username */}
                            <div className="um-field">
                                <label className="um-label">Username</label>
                                <div className="um-input-wrap">
                                    <input
                                        className="um-input"
                                        type="text"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        placeholder="Enter username"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div className="um-field">
                                <label className="um-label">Role</label>
                                <div className="um-select-wrap">
                                    <select
                                        className="um-select"
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select role</option>
                                        {roles.map((r) => (
                                            <option key={r} value={r}>
                                                {roleIcons[r]}  {r}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="um-field">
                                <label className="um-label">Status</label>
                                <div className="um-select-wrap">
                                    <select
                                        className="um-select"
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        style={{ paddingRight: form.status ? "80px" : "38px" }}
                                        required
                                    >
                                        <option value="">Select status</option>
                                        {statuses.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    {form.status && statusColors[form.status] && (
                                        <div className="um-status-preview show">
                                            <div
                                                className="um-status-dot"
                                                style={{ background: statusColors[form.status].dot, color: statusColors[form.status].dot }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="um-divider" />

                            {/* Actions */}
                            <div className="um-actions">
                                <button type="button" className="um-btn um-btn-reset" onClick={handleReset}>
                                    ↺ Reset
                                </button>
                                <div className="um-spacer" />
                                <button type="button" className="um-btn um-btn-ghost" onClick={handleClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="um-btn um-btn-primary" disabled={loading}>
                                    {loading ? <><div className="um-spinner" /> Saving…</> : <>Save Changes</>}
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}