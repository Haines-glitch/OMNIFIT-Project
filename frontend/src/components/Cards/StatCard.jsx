import React from 'react';

const StatCard = ({ title, value, subtext, icon, trend, theme = 'dark' }) => {
    const isPositive = trend && (trend.startsWith('+') || trend.includes('up'));
    const isLight = theme === 'light';

    if (isLight) {
        return (
            <div className="p-4 h-100 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-500/40">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
                        <h2 className="text-2xl font-extrabold mt-1 mb-0 text-slate-900 tracking-tight">{value}</h2>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-500/20 text-[#10B981] flex items-center justify-center text-lg">
                        <i className={`bi ${icon}`}></i>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">{subtext}</span>
                    {trend && (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${isPositive ? 'bg-emerald-50 text-[#10B981] border-emerald-500/30' : 'bg-red-50 text-red-500 border-red-500/30'
                            }`}>
                            {trend}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="group p-5 h-full relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 hover:border-[#00F29D]/50 rounded-2xl shadow-xl shadow-black/40 transition-all duration-300 hover:-translate-y-1">
            {/* Subtle top glow line on hover */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00F29D]/0 to-transparent group-hover:via-[#00F29D]/80 transition-all duration-500"></div>

            <div className="flex justify-between items-start mb-3">
                <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{title}</span>
                    <h2 className="text-2xl font-black text-white tracking-tight group-hover:text-[#00F29D] transition-colors">{value}</h2>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#00F29D]/10 border border-[#00F29D]/30 text-[#00F29D] flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,242,157,0.15)] group-hover:scale-110 transition-transform">
                    <i className={`bi ${icon}`}></i>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 font-medium">{subtext}</span>
                {trend && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${isPositive
                            ? 'bg-[#00F29D]/15 text-[#00F29D] border-[#00F29D]/40 shadow-[0_0_10px_rgba(0,242,157,0.2)]'
                            : 'bg-red-500/15 text-red-400 border-red-500/30'
                        }`}>
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
};

export default StatCard;

