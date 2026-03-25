import StatCard from "../../Components/StatCard";
import Navbar from "../../Components/Navbar";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function AdminDashboard() {

    const [data, setData] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/admin/total-count");
                if (res.data != null) {
                    setData(res.data);
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to load dashboard data");
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8">

            <div className="flex flex-col w-full h-[5vh]">
                <Navbar pageTitle="Admin Dashboard" />
            </div>

            {/* Stats */}
            <div className="stats-grid mt-[7vh] p-3">
                <StatCard label="Total Users" value={data.totalUsersCount} />
                <StatCard label="Active Users" value={data.activeUsersCount} />
                <StatCard label="Designations" value={data.designationCount} />
                <StatCard label="Total Shifts" value={data.shiftsCount} />
            </div>

            {/* User Distribution */}
            <div className="section-card mt-6 animate-fade-in-up mx-3" style={{ animationDelay: "300ms", opacity: 0 }}>

                <div className="section-card-header mb-5">
                    <h3 className="text-lg font-semibold text-white">
                        👥 User Distribution
                    </h3>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {[
                        { role: "Employees", count: data.employeesCount, color: "#6366f1" },
                        { role: "Managers", count: data.managerCount, color: "#10b981" },
                        { role: "Administrators", count: data.adminCount, color: "#f59e0b" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="text-center p-6 rounded-xl transition hover:scale-[1.02]"
                            style={{
                                background: `${item.color}12`,
                                border: `1px solid ${item.color}25`,
                            }}
                        >
                            <p className="text-3xl font-bold" style={{ color: item.color }}>
                                {item.count ?? "—"}
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                                {item.role}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full">

                {/* Quick Actions */}
                <div className="section-card animate-fade-in-up" style={{ animationDelay: "200ms", opacity: 0 }}>

                    <div className="section-card-header mb-4">
                        <h3 className="text-lg font-semibold text-white tracking-tight">
                            ⚡ Quick Actions
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Perform common administrative tasks quickly
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {[
                            { icon: "🛡️", label: "User Management", desc: "Create,View users and update roles or passwords", gradient: "var(--gradient-danger)", path: "/users" },
                            { icon: "👥", label: "Employee Management", desc: "Create,View employees and update Employee details", gradient: "var(--gradient-success)", path: "/employee-management" },
                            { icon: "📅", label: "Shift Management", desc: "Create,View shifts and update Shift details", gradient: "var(--gradient-warning)", path: "/admin/shift-management" },
                            { icon: "📩", label: "Leave Requests", desc: "Review employee leave requests", gradient: "var(--gradient-danger)", path: "/view-leave-requests" },
                            { icon: "📊", label: "Shift Change requests", desc: "approve or reject shift change requests", gradient: "var(--gradient-success)", path: "/shift-change-requests" },
                            // { icon: "🔔", label: "Notifications", desc: "View alerts and updates", gradient: "var(--gradient-warning)", path: "/admin/notifications" },
                            { icon: "⚙️", label: "Generate Schedule", desc: "Generate schedule for employees", gradient: "var(--gradient-info)", path: "/scheduler" },
                        ].map((action, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(action.path)}
                                className="p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] group"
                                style={{
                                    background: "rgba(30, 41, 59, 0.5)",
                                    border: "1px solid var(--color-border)",
                                }}
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-3"
                                    style={{ background: action.gradient }}
                                >
                                    {action.icon}
                                </div>
                                <p className="text-sm font-semibold text-white">{action.label}</p>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{action.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}