import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../utils/api";


const inputClass =
    "w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-[15px] text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition";

const labelClass = "block text-sm font-semibold text-slate-600 mb-2";

export default function AddUser() {
    const navigate = useNavigate();
    const initialstate = {
        username: "",
        password: "",
        role: "",
        email: "",
    }

    const [form, setForm] = useState(initialstate);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log("Submitting:", form);
            await api.post("/auth/signup", form);
            toast.success("User added successfully!");
            setForm(initialstate);

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to add user");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm(initialstate);
        setShowPassword(false);
    };

    const roles = ["Admin", "Manager", "Employee"];

    return (
        <div
            className="min-h-screen bg-[#f8f7fc]"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
            <div className="max-w-xl mx-auto px-6 py-12 flex flex-col gap-7">

                {/* Page Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-300/40">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                Add New User
                            </h1>
                            <p className="text-sm text-slate-400 mt-0.5">
                                Create login credentials for a team member
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col gap-5"
                >
                    {/* Username */}
                    <div>
                        <label className={labelClass}>
                            Username <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="e.g. vikramkumar"
                                required
                                className={`${inputClass} pl-11`}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelClass}>
                            Email <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="vikram@company.com"
                                required
                                className={`${inputClass} pl-11`}
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className={labelClass}>
                            Role <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </span>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                required
                                className={`${inputClass} pl-11 cursor-pointer`}
                            >
                                <option value="" disabled>Select a role</option>
                                {roles.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        {/* Role badges */}
                        {form.role && (
                            <div className="mt-3 flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border
                                    ${form.role === "Admin" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                        form.role === "Manager" ? "bg-blue-50 text-blue-600 border-blue-200" :
                                            "bg-emerald-50 text-emerald-600 border-emerald-200"}`}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {form.role === "Admin" ? "Full system access" :
                                        form.role === "Manager" ? "Team-level access" :
                                            "Employee-level access"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className={labelClass}>
                            Password <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Min. 8 characters"
                                minLength={8}
                                required
                                className={`${inputClass} pl-11 pr-12`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                            >
                                {showPassword ? (
                                    <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Password strength bar */}
                        {form.password.length > 0 && (
                            <div className="mt-2.5">
                                <div className="flex gap-1 mb-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${form.password.length >= i * 3
                                                ? form.password.length < 6
                                                    ? "bg-red-400"
                                                    : form.password.length < 10
                                                        ? "bg-amber-400"
                                                        : "bg-emerald-400"
                                                : "bg-slate-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-xs font-medium ${form.password.length < 6 ? "text-red-400" :
                                    form.password.length < 10 ? "text-amber-500" :
                                        "text-emerald-500"
                                    }`}>
                                    {form.password.length < 6 ? "Weak" :
                                        form.password.length < 10 ? "Moderate" :
                                            "Strong"}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100 my-1" />

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 transition active:scale-[0.98]"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-7 py-3 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 active:scale-[0.98] disabled:opacity-60 transition shadow-md shadow-purple-300/40"
                        >
                            {loading ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>

                {/* Footer note */}
                <p className="text-center text-[12px] text-slate-400">
                    The user will be prompted to change their password on first login.
                </p>

            </div>
        </div>
    );
}