import React, { useState } from 'react';
import NotificationCenter from '../Notifications/NotificationCenter';

const Navbar = ({ title, user, isCollapsed, theme = 'light', onNavigateTab, searchPlaceholder }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const isLight = theme === 'light';

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const placeholderText = searchPlaceholder || (user?.role === 'MEMBER' ? "Search routines, meal plans, metrics..." : "Search workouts, members, ...");

    if (isLight) {
        return (
            <header className="sticky top-0 z-20 px-6 py-4 mb-6 flex items-center justify-between bg-white border-b border-slate-200 shadow-sm transition-all duration-300 rounded-b-2xl">
                <div className="flex items-center gap-6">
                    <div>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{title || 'Dashboard'}</h4>
                        <span className="text-xs text-slate-500 font-medium">OMNIFIT AI Health Club Ecosystem</span>
                    </div>

                    <div className="hidden md:flex items-center rounded-full px-4 py-2 bg-slate-50 border border-slate-200 w-72">
                        <i className="bi bi-search text-slate-400 mr-2 text-sm"></i>
                        <input
                            type="text"
                            className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 w-full"
                            placeholder={placeholderText}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={toggleNotifications}
                            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer"
                        >
                            <i className="bi bi-bell-fill text-sm"></i>
                        </button>
                        <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white"></span>

                        {showNotifications && (
                            <div className="absolute right-0 top-12 z-50">
                                <NotificationCenter
                                    variant="dropdown"
                                    onClose={() => setShowNotifications(false)}
                                    onNavigateTab={onNavigateTab}
                                    theme={theme}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-[#10B981] text-slate-950 flex items-center justify-center font-bold text-xs">
                                <i className="bi bi-person-fill"></i>
                            </div>
                        )}
                        <div className="hidden sm:block text-left">
                            <div className="text-xs font-bold text-slate-900 leading-snug">{user?.name || user?.full_name || "User"}</div>
                            <span className="text-[10px] font-extrabold tracking-wider text-[#10B981] uppercase block">{user?.role || "MEMBER"}</span>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-20 px-6 py-4 mb-6 flex items-center justify-between bg-slate-900/85 backdrop-blur-xl border-b border-slate-800/80 shadow-xl shadow-black/30 transition-all duration-300 rounded-b-2xl">
            {/* Title & Search Bar */}
            <div className="flex items-center gap-6">
                <div>
                    <h4 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                        {title || 'Dashboard'}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium tracking-wide">OMNIFIT AI Health Club Ecosystem</span>
                </div>

                <div className="hidden md:flex items-center rounded-full px-4 py-2 bg-slate-950/80 border border-slate-800 focus-within:border-[#00F29D]/60 focus-within:ring-1 focus-within:ring-[#00F29D]/40 transition-all w-72">
                    <i className="bi bi-search text-slate-400 mr-2.5 text-xs"></i>
                    <input
                        type="text"
                        className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
                        placeholder={placeholderText}
                    />
                </div>
            </div>

            {/* Right Controls & Profile */}
            <div className="flex items-center gap-4">
                {/* Quick Action Notification */}
                <div className="relative">
                    <button
                        onClick={toggleNotifications}
                        className="w-10 h-10 rounded-full bg-slate-950/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#00F29D] hover:border-[#00F29D]/40 transition-all shadow-md cursor-pointer"
                    >
                        <i className="bi bi-bell-fill text-sm"></i>
                    </button>
                    <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#00F29D] border-2 border-slate-900 shadow-[0_0_8px_#00F29D]"></span>

                    {showNotifications && (
                        <div className="absolute right-0 top-12 z-50">
                            <NotificationCenter
                                variant="dropdown"
                                onClose={() => setShowNotifications(false)}
                                onNavigateTab={onNavigateTab}
                                theme={theme}
                            />
                        </div>
                    )}
                </div>

                {/* User Profile Chip */}
                <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 hover:border-[#00F29D]/40 transition-all shadow-md">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-[#00F29D]/50 shadow-[0_0_10px_rgba(0,242,157,0.3)]" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-[#00F29D] text-slate-950 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(0,242,157,0.4)]">
                            <i className="bi bi-person-fill"></i>
                        </div>
                    )}
                    <div className="hidden sm:block text-left">
                        <div className="text-xs font-bold text-white leading-snug">{user?.name || user?.full_name || "User"}</div>
                        <span className="text-[10px] font-black tracking-widest text-[#00F29D] uppercase block">{user?.role || "MEMBER"}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

