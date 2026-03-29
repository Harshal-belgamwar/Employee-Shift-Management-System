import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const name = form.username.trim();
        const pass = form.password.trim();
        try {
            const res = await api.post("/auth/login", { username: name, password: pass });
            const role = res.data.role;
            const roleName = role.substring(5).toLowerCase();
            sessionStorage.setItem("token", res.data.token);
            sessionStorage.setItem("role", roleName);
            sessionStorage.setItem("username", res.data.username);
            toast.success("Login successfully!", { autoClose: 2000 });

            if (roleName === "employee" || roleName === "manager") {
                navigate("/employee/dashboard");
            } else if (roleName === "admin") {
                navigate("/admin/dashboard");
            }
        } catch (err) {
            console.error("Login failed:", err);
            toast.error(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigate("/forget-password");
    };

    const features = [
        {
            label: "Smart Scheduling",
            desc: "AI-powered shift planning that adapts to your team's needs",
            icon: (
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            label: "Shift Change",
            desc: "Request and approve shift changes with manager validation",
            icon: (
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            ),
        },
        {
            label: "Easy Approvals",
            desc: "One-tap approvals with full audit trail and notifications",
            icon: (
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div
            className="min-h-screen flex bg-[#f8f7fc]"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
            {/* ── LEFT PANEL ── */}
            <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-center items-center p-16 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#f3f0ff] via-[#ede8ff] to-[#f0ebff]" />
                {/* Blobs */}
                <div className="absolute top-0 left-0 w-[420px] h-[420px] rounded-full bg-purple-300/25 blur-3xl -translate-x-1/2 -translate-y-1/3" />
                <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-violet-300/20 blur-3xl translate-x-1/4 translate-y-1/4" />
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.3]"
                    style={{
                        backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />
                {/* Divider */}
                <div className="absolute right-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-purple-200 to-transparent" />

                <div className="relative z-10 w-full max-w-sm">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-14">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-300/40">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-slate-800 text-lg font-bold tracking-tight">ShiftPlanner</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-[40px] font-extrabold text-slate-900 leading-[1.15] mb-4">
                        Scheduling<br />
                        that <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-violet-600">works</span><br />
                        for everyone
                    </h1>
                    <p className="text-[14.5px] text-slate-400 mb-14 leading-relaxed">
                        Enterprise-grade shift management built for modern operations teams.
                    </p>

                    {/* Feature pills */}
                    <div className="space-y-3">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-purple-100 rounded-2xl px-4 py-3.5 shadow-sm"
                            >
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 flex items-center justify-center text-purple-500 shrink-0">
                                    {f.icon}
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-slate-700 leading-none mb-0.5">{f.label}</p>
                                    <p className="text-[12px] text-slate-400 leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-16 bg-white">
                <div className="w-full max-w-[400px]">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow shadow-purple-300/30">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-slate-800 text-[15px] font-bold">ShiftPlanner</span>
                    </div>



                    {/* Form card */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">
                                    Username
                                </label>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </span>

                                    <input
                                        type="text"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        placeholder="Enter your username"
                                        required
                                        className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-[15px] text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-slate-600">
                                        Password
                                    </label>

                                    <button
                                        onClick={handleForgotPassword}
                                        type="button"
                                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-12 py-3 text-[15px] text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {/* Eye Icon */}
                                    </button>
                                </div>
                            </div>

                            {/* Remember */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="accent-purple-600 w-4 h-4"
                                />
                                <span className="text-sm text-slate-600">
                                    Remember me for 30 days
                                </span>
                            </label>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 active:scale-[0.98] disabled:opacity-60 transition shadow-md"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>

                        </form>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-[12px] text-slate-400 mt-6">
                        Having trouble?{" "}
                        <button className="text-purple-500 hover:text-purple-600 font-medium transition">
                            Contact your system admin
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}