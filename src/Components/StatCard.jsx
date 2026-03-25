export default function StatCard({ label, value, trend, trendUp, delay = 0 }) {
    return (
        <div
            className="glass-card p-5 animate-fade-in-up"
            style={{ animationDelay: `${delay}ms`, opacity: 0 }}
        >
            <div className="flex items-start justify-between mb-3">
                {trend && (
                    <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-auto ${trendUp ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
                            }`}
                    >
                        {trendUp ? "↑" : "↓"} {trend}
                    </span>
                )}
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
            <div className="text-sm text-slate-400 mt-0.5">{label}</div>
        </div>
    );
}