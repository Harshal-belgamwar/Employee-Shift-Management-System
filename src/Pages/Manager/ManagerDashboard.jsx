import StatCard from "../../Components/StatCard";
import ShiftCard from "../../Components/ShiftCard";
import { shifts, employees, leaveRequests, swapRequests } from "../../utils/mockData";

export default function ManagerDashboard() {
    const activeEmployees = employees.filter((e) => e.status === "active").length;
    const pendingLeaves = leaveRequests.filter((r) => r.status === "pending").length;
    const pendingSwaps = swapRequests.filter((r) => r.status === "pending").length;
    const totalPending = pendingLeaves + pendingSwaps;

    // Utilization rate mock
    const utilizationRate = 87;

    return (
        <div>
            <div className="page-header">
                <h1>Manager Dashboard</h1>
                <p>Team overview and scheduling management</p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <StatCard icon="👥" label="Active Employees" value={activeEmployees} trend="2" trendUp={true} color="indigo" delay={0} />
                <StatCard icon="📅" label="Shifts Today" value={shifts.filter((s) => s.date === "2026-02-25").length} color="blue" delay={50} />
                <StatCard icon="✉️" label="Pending Requests" value={totalPending} trend="3" trendUp={false} color="amber" delay={100} />
                <StatCard icon="📊" label="Utilization Rate" value={`${utilizationRate}%`} trend="5%" trendUp={true} color="green" delay={150} />
            </div>

            <div className="content-grid content-grid-2">
                {/* Utilization bar chart (visual mock) */}
                <div className="section-card animate-fade-in-up" style={{ animationDelay: "200ms", opacity: 0 }}>
                    <div className="section-card-header">
                        <h3>📊 Department Utilization</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { dept: "Engineering", pct: 92, color: "#6366f1" },
                            { dept: "Operations", pct: 78, color: "#f59e0b" },
                            { dept: "Support", pct: 85, color: "#10b981" },
                            { dept: "HR", pct: 60, color: "#3b82f6" },
                        ].map((d, i) => (
                            <div key={d.dept}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-300">{d.dept}</span>
                                    <span className="font-semibold text-white">{d.pct}%</span>
                                </div>
                                <div className="w-full h-2.5 rounded-full" style={{ background: "rgba(51,65,85,0.5)" }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                        style={{
                                            width: `${d.pct}%`,
                                            background: `linear-gradient(90deg, ${d.color}, ${d.color}aa)`,
                                            boxShadow: `0 0 10px ${d.color}40`,
                                            animationDelay: `${i * 100 + 400}ms`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="section-card animate-fade-in-up" style={{ animationDelay: "250ms", opacity: 0 }}>
                    <div className="section-card-header">
                        <h3>🔔 Recent Activity</h3>
                    </div>
                    <div className="space-y-3">
                        {[
                            { icon: "✉️", text: "Priya Sharma requested casual leave", time: "2h ago", type: "warning" },
                            { icon: "✉️", text: "Neha Gupta requested vacation leave", time: "5h ago", type: "warning" },
                            { icon: "✅", text: "Kavya Nair's shift swap approved", time: "1d ago", type: "success" },
                            { icon: "📅", text: "Weekly schedule published for Engineering", time: "2d ago", type: "info" },
                            { icon: "👤", text: "New employee Deepak Reddy added", time: "3d ago", type: "info" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
                                <span className="text-base flex-shrink-0">{item.icon}</span>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-300">{item.text}</p>
                                    <span className="text-xs text-slate-500">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Today's Shifts */}
            <div className="section-card mt-6 animate-fade-in-up" style={{ animationDelay: "300ms", opacity: 0 }}>
                <div className="section-card-header">
                    <h3>📅 Today's Shifts</h3>
                    <span className="text-xs text-slate-400">Feb 25, 2026</span>
                </div>
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {shifts
                        .filter((s) => s.date === "2026-02-25")
                        .map((s) => (
                            <ShiftCard key={s.id} shift={s} showEmployee />
                        ))}
                </div>
            </div>
        </div>
    );
}
