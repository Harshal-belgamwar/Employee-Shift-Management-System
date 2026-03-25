import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const verifyUsername = (e) => {
        e.preventDefault();

        setLoading(true);

        // simulate API
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1000);
    };

    const updatePassword = (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            toast.success("Password Updated Successfully");
        }, 1500);
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                        Forgot Password
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Recover your account password
                    </p>
                </div>

                {step === 1 && (
                    <form onSubmit={verifyUsername} className="space-y-5">

                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-[15px] text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 transition"
                        >
                            {loading ? "Verifying..." : "Verify Username"}
                        </button>

                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={updatePassword} className="space-y-5">

                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">
                                New Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                required
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-[15px] text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                required
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-[15px] text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 transition"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>

                    </form>
                )}

                <p className="text-center text-sm text-slate-500 mt-6">
                    Remember your password?{" "}
                    <span className="text-purple-600 cursor-pointer hover:underline" onClick={handleBackToLogin}>
                        Back to Login
                    </span>
                </p>

            </div>
        </div>
    );
}