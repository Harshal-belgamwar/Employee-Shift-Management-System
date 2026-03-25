import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = {
    employee: [
        { path: "/employee/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/employee/my-shifts", label: "My Shifts", icon: "📅" },
        { path: "/employee/availability", label: "Availability", icon: "🕐" },
        { path: "/employee/leave-requests", label: "Leave Requests", icon: "✉️" },
        { path: "/employee/shift-swap", label: "Shift Swap", icon: "🔄" },
    ],
    manager: [
        { path: "/manager/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/manager/schedule", label: "Generate Schedule", icon: "⚙️" },
        { path: "/manager/approvals", label: "Approvals", icon: "✅" },
        { path: "/manager/team", label: "Team View", icon: "👥" },
    ],
    admin: [
        { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/admin/users", label: "User Management", icon: "👤" },
        { path: "/admin/settings", label: "System Settings", icon: "⚙️" },
    ],
};

const roleLabels = {
    employee: "Employee",
    manager: "Manager",
    admin: "Administrator",
};

export default function Sidebar({ role = "employee", collapsed, onToggle }) {
    const navigate = useNavigate();
    const items = navItems[role] || navItems.employee;

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-all duration-300 ease-in-out`}
            style={{
                width: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)",
                background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
                borderRight: "1px solid var(--color-border)",
            }}
        >
            {/* Logo Area */}
            <div
                className="flex items-center gap-3 px-5 cursor-pointer"
                style={{
                    height: "var(--navbar-height)",
                    borderBottom: "1px solid var(--color-border)",
                }}
                onClick={onToggle}
            >
                <div
                    className="flex items-center justify-center rounded-xl font-bold text-white text-lg flex-shrink-0"
                    style={{
                        width: 36,
                        height: 36,
                        background: "var(--gradient-primary)",
                        boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                    }}
                >
                    S
                </div>
                {!collapsed && (
                    <div className="animate-fade-in">
                        <div className="text-sm font-bold text-white tracking-tight">ShiftPlanner</div>
                        <div className="text-[11px] text-slate-400">{roleLabels[role]} Panel</div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <div className="px-3 mb-2">
                    {!collapsed && (
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-2">
                            Navigation
                        </span>
                    )}
                </div>
                <ul className="space-y-1 px-3">
                    {items.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                        ? "text-white"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`
                                }
                                style={({ isActive }) =>
                                    isActive
                                        ? {
                                            background: "var(--gradient-primary)",
                                            boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
                                        }
                                        : {}
                                }
                            >
                                <span className="text-lg flex-shrink-0">{item.icon}</span>
                                {!collapsed && <span>{item.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Role Switcher (for demo) */}
                {!collapsed && (
                    <div className="px-5 mt-6">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                            Switch Role
                        </span>
                        <div className="flex gap-1 mt-2">
                            {Object.keys(navItems).map((r) => (
                                <NavLink
                                    key={r}
                                    to={`/${r}/dashboard`}
                                    className="text-[11px] px-2 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors capitalize"
                                >
                                    {r}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Logout */}
            <div
                className="px-3 pb-4"
                style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}
            >
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                    <span className="text-lg">🚪</span>
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
