import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import LoginService from '../Login/LoginService';

const Sidebar = ({ activeTab, setActiveTab, role, isCollapsed, toggleSidebar, theme = 'light' }) => {
    const navigate = useNavigate();
    const isLight = theme === 'light';

    const memberNavItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
        { id: 'workout', label: 'My Workouts', icon: 'bi-lightning-charge-fill' },
        { id: 'diet', label: 'AI Diet Plan', icon: 'bi-egg-fried' },
        { id: 'appointments', label: 'Book Appointment', icon: 'bi-clock-history' },
        { id: 'attendance', label: 'Attendance Logs', icon: 'bi-calendar-check-fill' },
        { id: 'notifications', label: 'Notifications', icon: 'bi-bell-fill' },
        { id: 'progress', label: 'Progress Analytics', icon: 'bi-graph-up-arrow' },
        { id: 'profile', label: 'Profile', icon: 'bi-person-badge-fill' },
        { id: 'settings', label: 'Settings', icon: 'bi-gear-fill' },
    ];

    const trainerNavItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
        { id: 'members', label: 'Members', icon: 'bi-people-fill' },
        { id: 'workout', label: 'Workout Plans', icon: 'bi-journal-code' },
        { id: 'diet', label: 'Diet Plans', icon: 'bi-cup-hot-fill' },
        { id: 'appointments', label: 'Appointments', icon: 'bi-calendar-event-fill' },
        { id: 'attendance', label: 'Attendance', icon: 'bi-person-check-fill' },
        { id: 'notifications', label: 'Notifications', icon: 'bi-bell-fill' },
        { id: 'reports', label: 'Reports', icon: 'bi-bar-chart-line-fill' },
        { id: 'profile', label: 'Profile', icon: 'bi-person-badge-fill' },
        { id: 'settings', label: 'Settings', icon: 'bi-gear-fill' },
    ];

    const adminNavItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
        { id: 'members', label: 'Members', icon: 'bi-people-fill' },
        { id: 'trainers', label: 'Trainers', icon: 'bi-person-badge' },
        { id: 'membership', label: 'Membership Plans', icon: 'bi-card-checklist' },
        { id: 'attendance', label: 'Attendance', icon: 'bi-calendar-check-fill' },
        { id: 'notifications', label: 'Notifications', icon: 'bi-bell-fill' },
        { id: 'payments', label: 'Payments', icon: 'bi-currency-dollar' },
        { id: 'workout', label: 'Workout Categories', icon: 'bi-lightning-fill' },
        { id: 'diet', label: 'Diet Categories', icon: 'bi-egg-fill' },
        { id: 'reports', label: 'Reports & Analytics', icon: 'bi-pie-chart-fill' },
        { id: 'settings', label: 'Settings', icon: 'bi-sliders' },
    ];

    const items = role === 'ADMIN' ? adminNavItems : role === 'TRAINER' ? trainerNavItems : memberNavItems;

    const handleLogout = () => {
        logoutUser();
        LoginService.logout();
        navigate('/');
    };

    if (isLight) {
        return (
            <aside
                className="h-screen fixed top-0 left-0 z-30 p-4 flex flex-col bg-white border-r border-slate-200 shadow-sm transition-all duration-300"
                style={{ width: isCollapsed ? '80px' : '260px' }}
            >
                <div className="flex-shrink-0">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-500/20 text-[#10B981] flex items-center justify-center font-bold text-lg">
                                <i className="bi bi-lightning-charge-fill"></i>
                            </div>
                            {!isCollapsed && (
                                <span className="font-extrabold text-xl tracking-wider text-slate-900">OMNIFIT</span>
                            )}
                        </div>
                        <button
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                            onClick={toggleSidebar}
                            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'} text-lg`}></i>
                        </button>
                    </div>

                    {!isCollapsed && (
                        <div className="px-3 py-2 mb-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ACTIVE ROLE</span>
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-500/30">
                                {role || 'MEMBER'}
                            </span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar">
                    {items.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full text-left rounded-xl px-3.5 py-2.5 flex items-center gap-3 transition-all duration-200 text-xs font-semibold ${isActive
                                    ? 'bg-emerald-50 text-[#10B981] font-bold border border-emerald-500/30'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                                    }`}
                            >
                                <i className={`bi ${item.icon} text-base ${isActive ? 'text-[#10B981]' : ''}`}></i>
                                {!isCollapsed && <span className="truncate">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {!isCollapsed && (
                    <div className="mb-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-orange-50 border border-orange-200 text-orange-500 flex items-center justify-center text-xs">
                                    <i className="bi bi-fire"></i>
                                </span>
                                <span className="text-[11px] font-bold text-slate-800">Current Streak</span>
                            </div>
                            <span className="text-[10px] font-black text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-500/30">12 Days</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-1">
                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black ${
                                        idx < 5 
                                            ? 'bg-[#10B981] text-white shadow-xs' 
                                            : idx === 5 
                                            ? 'bg-emerald-100 text-[#10B981] border border-emerald-300'
                                            : 'bg-slate-200 text-slate-400'
                                    }`}>
                                        {idx < 5 ? '✓' : ''}
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400">{day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex-shrink-0 pt-2 border-t border-slate-100">
                    <button
                        data-testid="logout-btn"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-200"
                    >
                        <i className="bi bi-box-arrow-right text-base"></i>
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>
        );
    }

    return (
        <aside
            className="h-screen fixed top-0 left-0 z-30 p-4 flex flex-col bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800/80 shadow-2xl shadow-black/80 transition-all duration-300"
            style={{ width: isCollapsed ? '80px' : '260px' }}
        >
            <div className="flex-shrink-0">
                {/* Brand & Toggle */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-[#00F29D]/15 border border-[#00F29D]/40 text-[#00F29D] flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(0,242,157,0.2)]">
                            <i className="bi bi-lightning-charge-fill"></i>
                        </div>
                        {!isCollapsed && (
                            <span className="font-black text-xl tracking-wider text-white">OMNIFIT</span>
                        )}
                    </div>
                    <button
                        className="text-slate-400 hover:text-[#00F29D] p-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
                        onClick={toggleSidebar}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'} text-lg`}></i>
                    </button>
                </div>

                {/* User Role Badge */}
                {!isCollapsed && (
                    <div className="px-3.5 py-2 mb-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-inner">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">ACTIVE ROLE:</span>
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/40 shadow-[0_0_10px_rgba(0,242,157,0.2)] tracking-wider">
                            {role || 'TRAINER'}
                        </span>
                    </div>
                )}
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1 custom-scrollbar">
                {items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full text-left rounded-xl px-3.5 py-2.5 flex items-center gap-3 transition-all duration-200 text-xs ${isActive
                                ? 'bg-[#00F29D]/15 text-[#00F29D] font-bold border border-[#00F29D]/40 shadow-[0_0_12px_rgba(0,242,157,0.25)]'
                                : 'text-slate-400 hover:bg-slate-900/90 hover:text-white border border-transparent hover:border-slate-800'
                                }`}
                        >
                            <i className={`bi ${item.icon} text-base ${isActive ? 'text-[#00F29D]' : 'text-slate-400'}`}></i>
                            {!isCollapsed && <span className="truncate tracking-wide">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Streak Widget (Only when expanded) */}
            {!isCollapsed && (
                <div className="mx-1 mb-3 p-3 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-orange-500/15 border border-orange-500/40 text-orange-400 flex items-center justify-center text-xs shadow-[0_0_8px_rgba(249,115,22,0.3)]">
                                <i className="bi bi-fire"></i>
                            </span>
                            <span className="text-[11px] font-black text-white tracking-wide">Current Streak</span>
                        </div>
                        <span className="text-[10px] font-black text-[#00F29D] bg-[#00F29D]/10 px-2 py-0.5 rounded-full border border-[#00F29D]/30 shadow-[0_0_8px_rgba(0,242,157,0.2)]">12 Days</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1">
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black transition-all ${
                                    idx < 5 
                                        ? 'bg-[#00F29D] text-slate-950 shadow-[0_0_10px_rgba(0,242,157,0.5)]' 
                                        : idx === 5 
                                        ? 'bg-[#00F29D]/20 text-[#00F29D] border border-[#00F29D]/50'
                                        : 'bg-slate-800/80 text-slate-500'
                                }`}>
                                    {idx < 5 ? '✓' : ''}
                                </div>
                                <span className="text-[9px] font-bold text-slate-400">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Logout Action */}
            <div className="flex-shrink-0 pt-2 border-t border-slate-800/80">
                <button
                    data-testid="logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all shadow-md"
                >
                    <i className="bi bi-box-arrow-right text-base"></i>
                    {!isCollapsed && <span className="tracking-wide">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

