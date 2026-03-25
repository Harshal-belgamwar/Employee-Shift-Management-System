import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../../utils/api";

function EyeOpenIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function EyeClosedIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
    );
}

const getStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
};

const strengthConfig = [
    { label: "Too short", width: "w-1/4", bar: "bg-red-400", text: "text-red-400" },
    { label: "Weak", width: "w-1/4", bar: "bg-orange-400", text: "text-orange-400" },
    { label: "Fair", width: "w-2/4", bar: "bg-amber-400", text: "text-amber-500" },
    { label: "Good", width: "w-3/4", bar: "bg-emerald-400", text: "text-emerald-500" },
    { label: "Strong", width: "w-full", bar: "bg-blue-500", text: "text-blue-500" },
];

export default function ChangePassword({ user, closeModal }) {
    const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) closeModal();
    }, [user, closeModal]);

    const strength = getStrength(form.newPassword);
    const match = form.confirmPassword.length > 0 && form.newPassword === form.confirmPassword;
    const mismatch = form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword;

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const confirmBorderClass = match
        ? "border-emerald-400 focus:border-emerald-400 focus:ring-emerald-100"
        : mismatch
            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-blue-100";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mismatch) { toast.error("Passwords do not match!"); return; }
        if (form.newPassword.length < 8) { toast.error("Password must be at least 8 characters."); return; }
        setLoading(true);
        try {
            await api.put(`/admin/users/${user.username}/change-password`, form);
            toast.success("Password updated successfully!");
            closeModal();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

                {/* Header band */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 pt-6 pb-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 text-white">
                                <ShieldIcon />
                            </div>
                            <div>
                                <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase">
                                    Security
                                </p>
                                <h2 className="text-white text-xl font-bold leading-tight">
                                    Change Password
                                </h2>
                            </div>
                        </div>
                        <button
                            onClick={closeModal}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors duration-150"
                        >
                            <XIcon />
                        </button>
                    </div>
                </div>

                {/* Username chip — overlaps header */}
                <div className="-mt-4 px-6">
                    <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs text-slate-500 font-medium">Editing</span>
                        <span className="text-xs text-slate-800 font-bold">{user?.username}</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 flex flex-col gap-5">

                    {/* New Password */}
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-slate-400">
                            <LockIcon />
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                required
                                minLength={8}
                                autoComplete="new-password"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-150"
                            >
                                {showNew ? <EyeClosedIcon /> : <EyeOpenIcon />}
                            </button>
                        </div>

                        {/* Strength meter */}
                        {form.newPassword.length > 0 && (
                            <div className="flex flex-col gap-1">
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-500 ${strengthConfig[strength].width} ${strengthConfig[strength].bar}`} />
                                </div>
                                <span className={`text-xs font-semibold ${strengthConfig[strength].text}`}>
                                    {strengthConfig[strength].label}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-slate-400">
                            <LockIcon />
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter new password"
                                required
                                autoComplete="new-password"
                                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 transition-all duration-200 ${confirmBorderClass}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-150"
                            >
                                {showConfirm ? <EyeClosedIcon /> : <EyeOpenIcon />}
                            </button>
                        </div>

                        {/* Match feedback */}
                        <div className="h-4">
                            {match && (
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                                    <CheckIcon /> Passwords match
                                </span>
                            )}
                            {mismatch && (
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
                                    <XIcon /> Passwords do not match
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-100" />

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2.5 text-sm font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-all duration-150"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !match || strength < 1}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-all duration-150"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Updating…
                                </>
                            ) : (
                                <>
                                    <ShieldIcon />
                                    Update Password
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}