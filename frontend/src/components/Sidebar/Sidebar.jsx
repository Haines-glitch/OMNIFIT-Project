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

    return (
        <aside
            className="h-screen fixed top-0 left-0 z-30 p-4 flex flex-col bg-[#0c0c10]/95 backdrop-blur-2xl border-r border-[#1f1f28] shadow-2xl shadow-black/80 transition-all duration-300"
            style={{ width: isCollapsed ? '80px' : '260px' }}
        >
            <div className="flex-shrink-0">
                {/* Brand & Toggle */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1f1f28]">
                    <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] to-[#FF1E28] text-white flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(229,9,20,0.45)]">
                            <i className="bi bi-shield-shaded"></i>
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <span className="font-black text-lg tracking-wider text-white leading-none">OMNIFIT</span>
                                <span className="text-[9px] font-black tracking-widest text-[#FF1E28] leading-none mt-1">IRON DISTRICT</span>
                            </div>
                        )}
                    </div>
                    <button
                        className="text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-zinc-800/60 border border-transparent hover:border-zinc-700/50 transition-all"
                        onClick={toggleSidebar}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'} text-lg`}></i>
                    </button>
                </div>

                {/* User Role Badge */}
                {!isCollapsed && (
                    <div className="px-3.5 py-2 mb-4 rounded-xl bg-[#14141a] border border-[#22222d] flex items-center justify-between shadow-inner">
                        <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">ACTIVE ROLE:</span>
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-red-600/15 text-[#FF1E28] border border-red-500/40 shadow-[0_0_10px_rgba(229,9,20,0.2)] tracking-wider">
                            {role || 'MEMBER'}
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
                            className={`w-full text-left rounded-xl px-3.5 py-2.5 flex items-center gap-3 transition-all duration-200 text-xs font-semibold ${isActive
                                ? 'bg-red-600/15 text-[#FF1E28] font-bold border border-red-500/40 shadow-[0_0_12px_rgba(229,9,20,0.25)]'
                                : 'text-zinc-400 hover:bg-zinc-900/90 hover:text-white border border-transparent hover:border-zinc-800'
                                }`}
                        >
                            <i className={`bi ${item.icon} text-base ${isActive ? 'text-[#FF1E28]' : 'text-zinc-400'}`}></i>
                            {!isCollapsed && <span className="truncate tracking-wide">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Streak Widget (Only when expanded) */}
            {!isCollapsed && (
                <div className="mx-1 mb-3 p-3 rounded-2xl bg-gradient-to-br from-[#14141a] to-[#0e0e13] border border-[#22222d] shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-red-500/15 border border-red-500/40 text-[#FF1E28] flex items-center justify-center text-xs shadow-[0_0_8px_rgba(229,9,20,0.3)]">
                                <i className="bi bi-fire"></i>
                            </span>
                            <span className="text-[11px] font-black text-white tracking-wide">Current Streak</span>
                        </div>
                        <span className="text-[10px] font-black text-[#FF1E28] bg-red-600/10 px-2 py-0.5 rounded-full border border-red-500/30 shadow-[0_0_8px_rgba(229,9,20,0.2)]">12 Days</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1">
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black transition-all ${
                                    idx < 5 
                                        ? 'bg-[#E50914] text-white shadow-[0_0_8px_rgba(229,9,20,0.5)]' 
                                        : idx === 5 
                                        ? 'bg-red-950/60 text-[#FF1E28] border border-red-500/50'
                                        : 'bg-zinc-800/80 text-zinc-500'
                                }`}>
                                    {idx < 5 ? '✓' : ''}
                                </div>
                                <span className="text-[9px] font-bold text-zinc-400">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Logout Action */}
            <div className="flex-shrink-0 pt-2 border-t border-[#1f1f28]">
                <button
                    data-testid="logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-red-400 hover:text-white bg-red-600/10 hover:bg-[#E50914] border border-red-500/30 hover:border-transparent transition-all shadow-md cursor-pointer"
                >
                    <i className="bi bi-box-arrow-right text-base"></i>
                    {!isCollapsed && <span className="tracking-wide">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

