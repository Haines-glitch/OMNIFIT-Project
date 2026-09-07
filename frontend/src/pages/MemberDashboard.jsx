import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import ProfileModule from '../components/Modules/ProfileModule';
import WorkoutModule from '../components/Modules/WorkoutModule';
import DietModule from '../components/Modules/DietModule';
import AttendanceModule from '../components/Modules/AttendanceModule';
import AppointmentModule from '../components/Modules/AppointmentModule';
import PaymentModule from '../components/Modules/PaymentModule';
import ProgressModule from '../components/Modules/ProgressModule';
import NotificationModule from '../components/Modules/NotificationModule';
import ReportModule from '../components/Modules/ReportModule';
import FeedbackModule from '../components/Modules/FeedbackModule';
import { getMemberDashboardData } from '../services/dashboardService';
import LoginService from '../components/Login/LoginService';

const MemberDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [data, setData] = useState(null);
    const [exerciseSearch, setExerciseSearch] = useState('');
    const [unreadCount, setUnreadCount] = useState(3);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'AI Alert',
            title: 'Macro Target Adjusted',
            desc: 'Protein target increased to 160g based on recent progressive overload tracking.',
            time: '15m ago',
            read: false,
            badgeBg: 'bg-[#00F29D]/15 text-[#00F29D] border-[#00F29D]/40',
            icon: 'bi-cpu-fill text-[#00F29D]'
        },
        {
            id: 2,
            type: 'Appointment',
            title: '1-on-1 Session Confirmed',
            desc: 'Session with Marcus Vance confirmed for Today at 10:00 AM.',
            time: '1h ago',
            read: false,
            badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
            icon: 'bi-calendar-check-fill text-emerald-400'
        },
        {
            id: 3,
            type: 'Attendance',
            title: 'Face Scan Check-In Verified',
            desc: 'Contactless facial check-in verified at Terminal 1.',
            time: 'Yesterday',
            read: false,
            badgeBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40',
            icon: 'bi-person-check-fill text-cyan-400'
        }
    ]);

    const [exerciseRows, setExerciseRows] = useState([
        { id: 1, name: 'Incline Dumbbell Press', setsReps: '4 x 10-12', targetLoad: '24 kg', status: 'Completed', notes: 'Form crisp, solid chest pump' },
        { id: 2, name: 'Barbell Overhead Press', setsReps: '3 x 8-10', targetLoad: '40 kg', status: 'Pending', notes: '' },
        { id: 3, name: 'Cable Lateral Raises', setsReps: '4 x 15', targetLoad: '10 kg', status: 'Pending', notes: '' },
    ]);

    useEffect(() => {
        getMemberDashboardData().then(res => setData(res));
    }, []);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const [currentUser, setCurrentUser] = useState(() => LoginService.getCurrentUser());

    const memberInfo = {
        ...(data?.member || {}),
        ...currentUser,
        name: currentUser?.name || data?.member?.name || 'Sarah Jenkins',
        email: currentUser?.email || data?.member?.email || 'sarah.jenkins@omnifit.com',
        phone: currentUser?.phone || data?.member?.phone || '+91 98765 43210',
        role: currentUser?.role || 'MEMBER',
        membershipPlan: data?.member?.membershipPlan || 'PREMIUM ATHLETE TIER',
        trainerName: data?.member?.trainerName || 'Marcus Vance',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    const handleSaveUser = (updatedUser) => {
        setCurrentUser(updatedUser);
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const toggleExerciseStatus = (id) => {
        setExerciseRows(exerciseRows.map(row => {
            if (row.id === id) {
                return { ...row, status: row.status === 'Completed' ? 'Pending' : 'Completed' };
            }
            return row;
        }));
    };

    const filteredExercises = exerciseRows.filter(row =>
        row.name.toLowerCase().includes(exerciseSearch.toLowerCase())
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileModule user={memberInfo} onSaveUser={handleSaveUser} role="MEMBER" theme="dark" />;
            case 'workout':
                return <WorkoutModule role="MEMBER" theme="dark" />;
            case 'diet':
                return <DietModule role="MEMBER" theme="dark" />;
            case 'attendance':
                return <AttendanceModule theme="dark" />;
            case 'appointments':
                return <AppointmentModule role="MEMBER" theme="dark" />;
            case 'membership':
            case 'payments':
                return <PaymentModule theme="dark" />;
            case 'progress':
                return <ProgressModule theme="dark" />;
            case 'feedback':
                return <FeedbackModule theme="dark" />;
            case 'notifications':
                return <NotificationModule theme="dark" />;
            case 'reports':
                return <ReportModule theme="dark" />;
            case 'settings':
                return (
                    <div className="p-6 sm:p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl shadow-black/40 space-y-6">
                        <h4 className="text-lg font-extrabold text-white flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#00F29D]/15 border border-[#00F29D]/40 text-[#00F29D] flex items-center justify-center">
                                <i className="bi bi-sliders text-sm"></i>
                            </div>
                            Account & Athlete Preferences
                        </h4>
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                                <div>
                                    <span className="text-sm font-bold text-white block">Dark Mode Aesthetic</span>
                                    <span className="text-xs text-slate-400">Locked to Matte Obsidian & Neon Mint Theme</span>
                                </div>
                                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/30">ACTIVE</span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                                <div>
                                    <span className="text-sm font-bold text-white block">AI Macro & Performance Alerts</span>
                                    <span className="text-xs text-slate-400">Receive instant push alerts for calorie targets and workout logs</span>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#00F29D] cursor-pointer" />
                            </div>
                        </div>
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <div className="space-y-6 animate-fade-in font-sans antialiased">
                        {/* 3. Member Command Center Hero Card */}
                        <div className="relative overflow-hidden p-6 sm:p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl shadow-black/40">
                            {/* Ambient background glow */}
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#00F29D]/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                                <div className="space-y-3">
                                    {/* Top Tag Pill Badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F29D]/15 border border-[#00F29D]/40 shadow-[0_0_12px_rgba(0,242,157,0.2)]">
                                        <span className="w-2 h-2 rounded-full bg-[#00F29D] animate-pulse shadow-[0_0_8px_#00F29D]"></span>
                                        <span className="text-[10px] font-black text-[#00F29D] uppercase tracking-widest">
                                            PREMIUM ATHLETE TIER
                                        </span>
                                    </div>

                                    {/* Main Title */}
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                                        Athlete Command Center
                                    </h1>

                                    {/* Subtitle */}
                                    <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-2xl">
                                        Target: <span className="text-white font-semibold">Hypertrophy & Fat Loss</span> • Next Session with <span className="text-[#00F29D] font-bold">Marcus Vance</span> Today at 10:00 AM
                                    </p>
                                </div>

                                {/* Right Action Buttons */}
                                <div className="flex flex-wrap items-center gap-3 shrink-0">
                                    <button
                                        onClick={() => setActiveTab('workout')}
                                        className="px-5 py-3 bg-[#00F29D] hover:bg-[#00D88C] text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-[#00F29D]/20 hover:shadow-[#00F29D]/40 hover:-translate-y-0.5 transition-all cursor-pointer"
                                    >
                                        <i className="bi bi-plus-lg text-sm font-black"></i>
                                        Log Today's Workout
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('diet')}
                                        className="px-5 py-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
                                    >
                                        <i className="bi bi-egg-fried text-[#00F29D] text-sm"></i>
                                        View AI Diet Plan
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 4. 4x KPI Metric Cards (Grid Layout) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {/* KPI 1: Daily Calorie Target */}
                            <div className="p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl shadow-black/40 hover:border-slate-700/80 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                                        DAILY NUTRITION GOAL
                                    </span>
                                    <div className="w-10 h-10 rounded-xl border border-[#00F29D]/40 bg-[#00F29D]/10 flex items-center justify-center text-[#00F29D] shadow-[0_0_12px_rgba(0,242,157,0.15)] group-hover:scale-110 transition-transform">
                                        <i className="bi bi-fire text-lg"></i>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                        2,200 <span className="text-xs font-semibold text-slate-400">kcal</span>
                                    </h3>
                                    <div className="flex items-center justify-between pt-2 text-xs">
                                        <span className="text-slate-400 font-medium">1,650 kcal Consumed</span>
                                        <span className="px-2 py-0.5 rounded-full bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/30 font-bold text-[10px]">
                                            75% Met
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* KPI 2: Today's Workout */}
                            <div className="p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl shadow-black/40 hover:border-slate-700/80 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                                        ACTIVE ROUTINE
                                    </span>
                                    <div className="w-10 h-10 rounded-xl border border-[#00F29D]/40 bg-[#00F29D]/10 flex items-center justify-center text-[#00F29D] shadow-[0_0_12px_rgba(0,242,157,0.15)] group-hover:scale-110 transition-transform">
                                        <i className="bi bi-lightning-charge-fill text-lg"></i>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                                        Push Hypertrophy
                                    </h3>
                                    <div className="flex items-center justify-between pt-2 text-xs">
                                        <span className="text-slate-400 font-medium">5 Exercises • 45 Mins</span>
                                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold text-[10px]">
                                            Today
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* KPI 3: Gym Attendance */}
                            <div className="p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl shadow-black/40 hover:border-slate-700/80 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                                        MONTHLY ATTENDANCE
                                    </span>
                                    <div className="w-10 h-10 rounded-xl border border-[#00F29D]/40 bg-[#00F29D]/10 flex items-center justify-center text-[#00F29D] shadow-[0_0_12px_rgba(0,242,157,0.15)] group-hover:scale-110 transition-transform">
                                        <i className="bi bi-person-check-fill text-lg"></i>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                        95%
                                    </h3>
                                    <div className="flex items-center justify-between pt-2 text-xs">
                                        <span className="text-slate-400 font-medium">19 / 20 Days Checked-In</span>
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                                            Optimal
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* KPI 4: Goal Trajectory */}
                            <div className="p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl shadow-black/40 hover:border-slate-700/80 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                                        CURRENT PROGRESS
                                    </span>
                                    <div className="w-10 h-10 rounded-xl border border-[#00F29D]/40 bg-[#00F29D]/10 flex items-center justify-center text-[#00F29D] shadow-[0_0_12px_rgba(0,242,157,0.15)] group-hover:scale-110 transition-transform">
                                        <i className="bi bi-graph-up-arrow text-lg"></i>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                        68.5 <span className="text-xs font-semibold text-slate-400">kg</span>
                                    </h3>
                                    <div className="flex items-center justify-between pt-2 text-xs">
                                        <span className="text-slate-400 font-medium">-2.5 kg from Starting</span>
                                        <span className="px-2 py-0.5 rounded-full bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/30 font-bold text-[10px]">
                                            On Track
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5. Bottom Main Section (Two-Column Split) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left Panel (65% width / lg:col-span-8) */}
                            <div className="lg:col-span-8 space-y-4">
                                <div className="p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl shadow-black/40 space-y-6">
                                    {/* Panel Header & Search Bar */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#00F29D] shadow-[0_0_10px_#00F29D]"></div>
                                            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                                                Today's Prescribed Routine & Macro Matrix
                                            </h3>
                                        </div>

                                        {/* Search Filter Bar */}
                                        <div className="relative">
                                            <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                                            <input
                                                type="text"
                                                placeholder="Search exercises..."
                                                value={exerciseSearch}
                                                onChange={(e) => setExerciseSearch(e.target.value)}
                                                className="w-full sm:w-56 pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-[#00F29D] transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Exercise DataTable */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-800/80 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <th className="pb-3 px-3">EXERCISE NAME</th>
                                                    <th className="pb-3 px-3">SETS x REPS</th>
                                                    <th className="pb-3 px-3">TARGET LOAD</th>
                                                    <th className="pb-3 px-3">STATUS</th>
                                                    <th className="pb-3 px-3 text-right">ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800/50 text-xs">
                                                {filteredExercises.map((row) => {
                                                    const isDone = row.status === 'Completed';
                                                    return (
                                                        <tr key={row.id} className="hover:bg-slate-950/50 transition-colors">
                                                            <td className="py-4 px-3 font-bold text-white flex items-center gap-2.5">
                                                                <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-[#00F29D] shadow-[0_0_8px_#00F29D]' : 'bg-amber-400'}`}></div>
                                                                <span>{row.name}</span>
                                                            </td>
                                                            <td className="py-4 px-3 text-slate-300 font-semibold">{row.setsReps}</td>
                                                            <td className="py-4 px-3 text-[#00F29D] font-bold">{row.targetLoad}</td>
                                                            <td className="py-4 px-3">
                                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isDone
                                                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                                                    }`}>
                                                                    {row.status}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-3 text-right">
                                                                <button
                                                                    onClick={() => toggleExerciseStatus(row.id)}
                                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isDone
                                                                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                                            : 'bg-[#00F29D] hover:bg-[#00D88C] text-slate-950 shadow-md shadow-[#00F29D]/20'
                                                                        }`}
                                                                >
                                                                    {isDone ? 'View Notes' : 'Start Set'}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel (35% width / lg:col-span-4) — Activity & Notifications */}
                            <div className="lg:col-span-4 space-y-4">
                                <div className="p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl shadow-black/40 space-y-5">
                                    {/* Notifications Header */}
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                                        <div className="flex items-center gap-2.5">
                                            <h3 className="text-base font-extrabold text-white tracking-tight">
                                                Live Updates
                                            </h3>
                                            {unreadCount > 0 && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/30 shadow-[0_0_8px_rgba(0,242,157,0.2)]">
                                                    {unreadCount} New
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={markAllRead}
                                            className="text-[11px] font-semibold text-slate-400 hover:text-[#00F29D] transition-colors"
                                        >
                                            Mark all as read
                                        </button>
                                    </div>

                                    {/* Feed Items */}
                                    <div className="space-y-3">
                                        {notifications.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`p-4 rounded-xl border transition-all ${item.read
                                                        ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                                                        : 'bg-slate-950/80 border-slate-800 border-l-2 border-l-[#00F29D]'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                                                        <i className={`bi ${item.icon} text-sm`}></i>
                                                    </div>

                                                    <div className="space-y-1 flex-grow">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border uppercase tracking-wider ${item.badgeBg}`}>
                                                                {item.type}
                                                            </span>
                                                            <span className="text-[10px] text-slate-500">{item.time}</span>
                                                        </div>
                                                        <h5 className="text-xs font-bold text-white tracking-tight">
                                                            {item.title}
                                                        </h5>
                                                        <p className="text-[11px] text-slate-400 leading-snug">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#0B111E] text-slate-100 font-sans antialiased flex">
            {/* 1. Collapsible Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                role="MEMBER"
                theme="dark"
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Layout Workspace */}
            <main
                className="flex-grow min-w-0 px-4 sm:px-6 lg:px-8 pb-10 transition-all duration-300"
                style={{
                    marginLeft: isCollapsed ? '80px' : '260px',
                }}
            >
                {/* 2. Top Navigation Bar */}
                <Navbar
                    title="Athlete Performance Hub"
                    user={memberInfo}
                    theme="dark"
                    isCollapsed={isCollapsed}
                />

                {/* Main Content Render */}
                {renderContent()}
            </main>
        </div>
    );
};

export default MemberDashboard;
