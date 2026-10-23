import React from 'react';

const StatCard = ({ title, value, subtext, icon, trend, theme = 'dark' }) => {
    const isPositive = trend && (trend.startsWith('+') || trend.includes('up'));

    return (
        <div className="group p-5 h-full relative overflow-hidden bg-[#121217]/90 backdrop-blur-xl border border-[#1f1f2a] hover:border-red-500/50 rounded-2xl shadow-xl shadow-black/50 transition-all duration-300 hover:-translate-y-1">
            {/* Subtle top glow line on hover */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/90 transition-all duration-500"></div>

            <div className="flex justify-between items-start mb-3">
                <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">{title}</span>
                    <h2 className="text-2xl font-black text-white tracking-tight group-hover:text-[#FF1E28] transition-colors">{value}</h2>
                </div>
                <div className="w-11 h-11 rounded-xl bg-red-600/15 border border-red-500/30 text-[#FF1E28] flex items-center justify-center text-xl shadow-[0_0_15px_rgba(229,9,20,0.2)] group-hover:scale-110 transition-transform">
                    <i className={`bi ${icon}`}></i>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#1f1f28]">
                <span className="text-xs text-zinc-400 font-medium">{subtext}</span>
                {trend && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${isPositive
                        ? 'bg-red-500/15 text-[#FF1E28] border-red-500/40 shadow-[0_0_8px_rgba(229,9,20,0.2)]'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}>
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
};

export default StatCard;

