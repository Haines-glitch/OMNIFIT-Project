import React, { useState } from 'react';
import NotificationCenter from '../Notifications/NotificationCenter';

const Navbar = ({ title, user, isCollapsed, theme = 'light', onNavigateTab, searchPlaceholder }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const isLight = theme === 'light';

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const placeholderText = searchPlaceholder || (user?.role === 'MEMBER' ? "Search routines, meal plans, metrics..." : "Search workouts, members, ...");

    return (
        <header className="sticky top-0 z-20 px-6 py-4 mb-6 flex items-center justify-between bg-[#0c0c10]/90 backdrop-blur-xl border-b border-[#1f1f28] shadow-xl shadow-black/40 transition-all duration-300 rounded-b-2xl">
            {/* Title & Search Bar */}
            <div className="flex items-center gap-6">
                <div>
                    <h4 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                        {title || 'Dashboard'}
                    </h4>
                    <span className="text-xs text-zinc-400 font-medium tracking-wide">OMNIFIT IRON DISTRICT AI ECOSYSTEM</span>
                </div>

                <div className="hidden md:flex items-center rounded-full px-4 py-2 bg-[#14141a] border border-[#22222d] focus-within:border-red-500/60 focus-within:ring-1 focus-within:ring-red-500/40 transition-all w-72">
                    <i className="bi bi-search text-zinc-400 mr-2.5 text-xs"></i>
                    <input
                        type="text"
                        className="bg-transparent border-none outline-none text-xs text-white placeholder-zinc-500 w-full"
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
                        className="w-10 h-10 rounded-full bg-[#14141a] border border-[#22222d] flex items-center justify-center text-zinc-400 hover:text-[#FF1E28] hover:border-red-500/40 transition-all shadow-md cursor-pointer"
                    >
                        <i className="bi bi-bell-fill text-sm"></i>
                    </button>
                    <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#FF1E28] border-2 border-[#0c0c10] shadow-[0_0_8px_#FF1E28]"></span>

                    {showNotifications && (
                        <div className="absolute right-0 top-12 z-50">
                            <NotificationCenter
                                variant="dropdown"
                                onClose={() => setShowNotifications(false)}
                                onNavigateTab={onNavigateTab}
                                theme="dark"
                            />
                        </div>
                    )}
                </div>

                {/* User Profile Chip */}
                <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#14141a] border border-[#22222d] hover:border-red-500/40 transition-all shadow-md">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-red-500/50 shadow-[0_0_10px_rgba(229,9,20,0.3)]" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(229,9,20,0.4)]">
                            <i className="bi bi-person-fill"></i>
                        </div>
                    )}
                    <div className="hidden sm:block text-left">
                        <div className="text-xs font-bold text-white leading-snug">{user?.name || user?.full_name || "User"}</div>
                        <span className="text-[10px] font-black tracking-widest text-[#FF1E28] uppercase block">{user?.role || "MEMBER"}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

