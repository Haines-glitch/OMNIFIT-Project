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
import { DEFAULT_AVATAR } from '../utils/defaultAvatar';

const MemberDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [data, setData] = useState(null);
    const [exerciseSearch, setExerciseSearch] = useState('');
    const [unreadCount, setUnreadCount] = useState(3);
    const [hoveredSleepDay, setHoveredSleepDay] = useState(null);

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
        { id: 2, name: 'Barbell Overhead Press', setsReps: '3 x 8-10', targetLoad: '40 kg', status: 'Pending', notes: 'Focus on vertical bar path' },
        { id: 3, name: 'Cable Lateral Raises', setsReps: '4 x 15', targetLoad: '10 kg', status: 'Pending', notes: 'Control eccentric 2s' },
        { id: 4, name: 'Weighted Tricep Dips', setsReps: '3 x 12', targetLoad: '+15 kg', status: 'Completed', notes: 'Full depth' },
    ]);

    const sleepDays = [
        { day: 'Mon', hours: 7.2, label: '7h 12m' },
        { day: 'Tue', hours: 6.8, label: '6h 48m' },
        { day: 'Wed', hours: 8.1, label: '8h 06m' },
        { day: 'Thu', hours: 7.0, label: '7h 00m' },
        { day: 'Fri', hours: 7.8, label: '7h 48m' },
        { day: 'Sat', hours: 8.6, label: '8h 36m' },
        { day: 'Sun', hours: 7.4, label: '7h 24m' },
    ];

    const upcomingWorkouts = [
        { id: 1, title: 'Upper Body Strength', coach: 'Marcus Vance', time: 'Today • 10:00 AM', tag: 'Hypertrophy', badge: 'bg-[#00F29D]/15 text-[#00F29D] border-[#00F29D]/40' },
        { id: 2, title: 'HIIT Cardio Blast', coach: 'Elena Rostova', time: 'Tomorrow • 08:30 AM', tag: 'Endurance', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40' },
        { id: 3, title: 'Posterior Chain & Core', coach: 'Marcus Vance', time: 'Friday • 09:00 AM', tag: 'Power', badge: 'bg-purple-500/15 text-purple-400 border-purple-500/40' }
    ];

    const [currentUser, setCurrentUser] = useState(() => LoginService.getCurrentUser());

    useEffect(() => {
        getMemberDashboardData().then(res => setData(res));
        LoginService.fetchCurrentUser().then(u => {
            if (u) setCurrentUser(u);
        });
    }, []);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const memberInfo = {
        ...(data?.member || {}),
        ...currentUser,
        name: currentUser?.name || currentUser?.full_name || data?.member?.name || 'Sarah Jenkins',
        email: currentUser?.email || data?.member?.email || 'sarah.jenkins@omnifit.com',
        phone: currentUser?.phone || data?.member?.phone || '+91 98765 43210',
        gender: currentUser?.gender || data?.member?.gender || 'Female',
        dob: currentUser?.dob || data?.member?.dob || '1998-04-12',
        height: currentUser?.height || data?.member?.height || '182 cm',
        weight: currentUser?.weight || data?.member?.weight || '78.5 kg',
        bmi: currentUser?.bmi || data?.member?.bmi || 23.7,
        fitnessGoal: currentUser?.fitnessGoal || data?.member?.fitnessGoal || data?.member?.goal || 'Hypertrophy & Fat Loss',
        emergencyContact: currentUser?.emergencyContact || data?.member?.emergencyContact || 'Sarah Mercer (+91 98765 12345)',
        medicalHistory: currentUser?.medicalHistory || data?.member?.medicalHistory || 'None (Cleared for high-intensity training)',
        role: currentUser?.role || 'MEMBER',
        membershipPlan: currentUser?.membership_plan || data?.member?.membershipPlan || 'PREMIUM ATHLETE TIER',
        trainerName: data?.member?.trainerName || 'Marcus Vance',
        avatar: currentUser?.avatar || data?.member?.avatar || DEFAULT_AVATAR,
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
                    <div className="p-6 sm:p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl space-y-6">
                        <h4 className="text-lg font-black text-white flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#00F29D]/15 border border-[#00F29D]/40 text-[#00F29D] flex items-center justify-center">
                                <i className="bi bi-sliders text-sm"></i>
                            </div>
                            Account & Athlete Preferences
                        </h4>
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                                <div>
                                    <span className="text-sm font-bold text-white block">Kinora Obsidian Glass Theme</span>
                                    <span className="text-xs text-slate-400">High-performance dark glassmorphic interface with neon biometric telemetry</span>
                                </div>
                                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/40 shadow-[0_0_10px_rgba(0,242,157,0.2)]">ACTIVE</span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                                <div>
                                    <span className="text-sm font-bold text-white block">AI Biometric & Performance Telemetry</span>
                                    <span className="text-xs text-slate-400">Instant push telemetry for Apple Health, WHOOP, and gym terminal face check-ins</span>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#00F29D] cursor-pointer" />
                            </div>
                        </div>
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <div className="space-y-6 animate-fade-in font-sans antialiased text-white">
                        {/* 1. KINORA HERO BANNER: "Good morning, {name}" / Fitness Overview */}
                        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-800/80 backdrop-blur-2xl shadow-2xl">
                            {/* Ambient Glow Orbs */}
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#00F29D]/10 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="absolute left-1/3 -bottom-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                                <div className="space-y-3.5 max-w-2xl">
                                    {/* Top Tier Badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F29D]/10 border border-[#00F29D]/30 shadow-[0_0_12px_rgba(0,242,157,0.2)]">
                                        <span className="w-2 h-2 rounded-full bg-[#00F29D] animate-pulse shadow-[0_0_8px_#00F29D]"></span>
                                        <span className="text-[10px] font-black text-[#00F29D] uppercase tracking-widest">
                                            {memberInfo.membershipPlan}
                                        </span>
                                    </div>

                                    {/* Main Title & Kinora Subtext */}
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                                        Good morning, {memberInfo.name.split(' ')[0]} 👋
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                                        <span className="text-white font-bold">Fitness Overview</span> • You're doing great! Keep pushing your limits and stay consistent with your prescribed training matrix.
                                    </p>

                                    {/* 3 Metric Pills from Pinterest Reference */}
                                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800/90 backdrop-blur-md text-xs">
                                            <span className="w-5 h-5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center text-[10px]">
                                                <i className="bi bi-heart-pulse-fill"></i>
                                            </span>
                                            <span className="font-extrabold text-white">72 BPM</span>
                                            <span className="text-slate-400 text-[11px]">Resting</span>
                                        </div>

                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800/90 backdrop-blur-md text-xs">
                                            <span className="w-5 h-5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center text-[10px]">
                                                <i className="bi bi-lightning-charge-fill"></i>
                                            </span>
                                            <span className="font-extrabold text-white">86%</span>
                                            <span className="text-slate-400 text-[11px]">Energy</span>
                                        </div>

                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800/90 backdrop-blur-md text-xs">
                                            <span className="w-5 h-5 rounded-lg bg-[#00F29D]/15 border border-[#00F29D]/30 text-[#00F29D] flex items-center justify-center text-[10px]">
                                                <i className="bi bi-shield-check"></i>
                                            </span>
                                            <span className="font-extrabold text-white">91%</span>
                                            <span className="text-slate-400 text-[11px]">Recovery</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Action Buttons & Visual Avatar/Graphic */}
                                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setActiveTab('workout')}
                                            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00F29D] to-[#00c982] hover:from-[#00F29D] hover:to-[#00F29D] text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,157,0.4)] hover:shadow-[0_0_28px_rgba(0,242,157,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                                        >
                                            <i className="bi bi-plus-lg text-sm font-black"></i>
                                            Log Today's Workout
                                        </button>

                                        <button
                                            onClick={() => setActiveTab('diet')}
                                            className="px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-[#00F29D]/50 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(0,242,157,0.15)]"
                                        >
                                            <i className="bi bi-egg-fried text-[#00F29D] text-sm"></i>
                                            View AI Diet Plan
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 text-[11px] text-slate-400 px-1">
                                        <i className="bi bi-person-badge-fill text-[#00F29D]"></i>
                                        <span>Assigned Coach: <strong className="text-white">{memberInfo.trainerName}</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. 4x KINORA METRIC CARDS (Rings, Donut, Sleep, Heart Rate Wave) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            
                            {/* CARD 1: Activity Progress (Apple-Style Concentric Rings) */}
                            <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-[#00F29D]/40 transition-all shadow-xl group flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                            <i className="bi bi-bullseye text-[#00F29D]"></i>
                                            Activity Progress
                                        </span>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/30">
                                            Today
                                        </span>
                                    </div>

                                    {/* Concentric Rings Visual Container */}
                                    <div className="relative flex items-center justify-center my-2">
                                        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                                            {/* Defs for gradients */}
                                            <defs>
                                                <linearGradient id="ringMoveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#FF3B30" />
                                                    <stop offset="100%" stopColor="#FF6B6B" />
                                                </linearGradient>
                                                <linearGradient id="ringExerciseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#00F29D" />
                                                    <stop offset="100%" stopColor="#00D284" />
                                                </linearGradient>
                                                <linearGradient id="ringStandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#00D2FF" />
                                                    <stop offset="100%" stopColor="#0099FF" />
                                                </linearGradient>
                                            </defs>

                                            {/* Outer Ring: Move (Radius 50, Circ ~314) */}
                                            <circle cx="60" cy="60" r="50" stroke="#261b22" strokeWidth="9" fill="none" />
                                            <circle
                                                cx="60" cy="60" r="50"
                                                stroke="url(#ringMoveGrad)"
                                                strokeWidth="9"
                                                strokeDasharray="314"
                                                strokeDashoffset={314 * (1 - 0.812)}
                                                strokeLinecap="round"
                                                fill="none"
                                                className="transition-all duration-1000 drop-shadow-[0_0_6px_#FF3B30]"
                                            />

                                            {/* Middle Ring: Exercise (Radius 38, Circ ~238) */}
                                            <circle cx="60" cy="60" r="38" stroke="#162c26" strokeWidth="9" fill="none" />
                                            <circle
                                                cx="60" cy="60" r="38"
                                                stroke="url(#ringExerciseGrad)"
                                                strokeWidth="9"
                                                strokeDasharray="238"
                                                strokeDashoffset={238 * (1 - 0.71)}
                                                strokeLinecap="round"
                                                fill="none"
                                                className="transition-all duration-1000 drop-shadow-[0_0_6px_#00F29D]"
                                            />

                                            {/* Inner Ring: Stand (Radius 26, Circ ~163) */}
                                            <circle cx="60" cy="60" r="26" stroke="#142838" strokeWidth="9" fill="none" />
                                            <circle
                                                cx="60" cy="60" r="26"
                                                stroke="url(#ringStandGrad)"
                                                strokeWidth="9"
                                                strokeDasharray="163"
                                                strokeDashoffset={163 * (1 - 0.833)}
                                                strokeLinecap="round"
                                                fill="none"
                                                className="transition-all duration-1000 drop-shadow-[0_0_6px_#00D2FF]"
                                            />
                                        </svg>

                                        {/* Center Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <i className="bi bi-lightning-charge-fill text-[#00F29D] text-lg animate-pulse"></i>
                                        </div>
                                    </div>
                                </div>

                                {/* Ring Legend Breakdown */}
                                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-slate-300">
                                            <span className="w-2 h-2 rounded-full bg-[#FF3B30] shadow-[0_0_6px_#FF3B30]"></span>
                                            Move
                                        </span>
                                        <span className="font-extrabold text-white">812 <span className="text-slate-500 font-normal">/ 1,000 kcal</span></span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-slate-300">
                                            <span className="w-2 h-2 rounded-full bg-[#00F29D] shadow-[0_0_6px_#00F29D]"></span>
                                            Exercise
                                        </span>
                                        <span className="font-extrabold text-white">64 <span className="text-slate-500 font-normal">/ 90 min</span></span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-slate-300">
                                            <span className="w-2 h-2 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]"></span>
                                            Stand
                                        </span>
                                        <span className="font-extrabold text-white">10 <span className="text-slate-500 font-normal">/ 12 hrs</span></span>
                                    </div>
                                </div>
                            </div>

                            {/* CARD 2: Calories & Macros (Donut Gauge & Breakdown) */}
                            <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-amber-500/40 transition-all shadow-xl group flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                            <i className="bi bi-fire text-amber-400"></i>
                                            Calories & Macros
                                        </span>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                            359 Left
                                        </span>
                                    </div>

                                    {/* Semi-circular Donut Gauge */}
                                    <div className="relative flex flex-col items-center justify-center my-1">
                                        <svg className="w-36 h-28" viewBox="0 0 100 60">
                                            <defs>
                                                <linearGradient id="macroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#FFAA00" />
                                                    <stop offset="50%" stopColor="#00F29D" />
                                                    <stop offset="100%" stopColor="#00D2FF" />
                                                </linearGradient>
                                            </defs>
                                            {/* Background Arc */}
                                            <path
                                                d="M 15 55 A 35 35 0 0 1 85 55"
                                                fill="none"
                                                stroke="#1e293b"
                                                strokeWidth="9"
                                                strokeLinecap="round"
                                            />
                                            {/* Value Arc (75% filled) */}
                                            <path
                                                d="M 15 55 A 35 35 0 0 1 85 55"
                                                fill="none"
                                                stroke="url(#macroGrad)"
                                                strokeWidth="9"
                                                strokeDasharray="110"
                                                strokeDashoffset={110 * (1 - 0.75)}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 drop-shadow-[0_0_8px_rgba(255,170,0,0.4)]"
                                            />
                                        </svg>
                                        <div className="text-center -mt-8">
                                            <h3 className="text-2xl font-black text-white tracking-tight">1,841</h3>
                                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block -mt-1">/ 2,200 kcal</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Macros Breakdown Progress Bars */}
                                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px]">
                                    <div>
                                        <div className="flex items-center justify-between text-slate-300 mb-1">
                                            <span>Carbs (39%)</span>
                                            <span className="font-bold text-white">180g <span className="text-slate-500">/ 230g</span></span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                            <div className="h-full rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between text-slate-300 mb-1">
                                            <span>Protein (31%)</span>
                                            <span className="font-bold text-[#00F29D]">143g <span className="text-slate-500">/ 160g</span></span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                            <div className="h-full rounded-full bg-[#00F29D] shadow-[0_0_8px_#00F29D]" style={{ width: '89%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between text-slate-300 mb-1">
                                            <span>Fats (30%)</span>
                                            <span className="font-bold text-cyan-400">61g <span className="text-slate-500">/ 65g</span></span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                            <div className="h-full rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" style={{ width: '93%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CARD 3: Sleep Tracking (Weekly Bar Chart) */}
                            <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all shadow-xl group flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                            <i className="bi bi-moon-stars-fill text-cyan-400"></i>
                                            Sleep Tracking
                                        </span>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                                            Quality: 82
                                        </span>
                                    </div>

                                    <div className="flex items-baseline gap-2 mb-3">
                                        <h3 className="text-2xl font-black text-white tracking-tight">7h 24m</h3>
                                        <span className="text-xs text-[#00F29D] font-bold">+12m vs goal</span>
                                    </div>

                                    {/* Weekly Sleep Bars */}
                                    <div className="h-28 flex items-end justify-between gap-1.5 pt-2 px-1">
                                        {sleepDays.map((item, idx) => {
                                            const heightPct = (item.hours / 9.5) * 100;
                                            const isHovered = hoveredSleepDay === idx;
                                            const isSunday = idx === 6;
                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex-1 flex flex-col items-center gap-2 group/bar relative cursor-pointer"
                                                    onMouseEnter={() => setHoveredSleepDay(idx)}
                                                    onMouseLeave={() => setHoveredSleepDay(null)}
                                                >
                                                    {/* Tooltip on hover */}
                                                    {isHovered && (
                                                        <div className="absolute -top-7 bg-slate-950 border border-slate-700 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-20">
                                                            {item.label}
                                                        </div>
                                                    )}

                                                    <div className="w-full bg-slate-800/60 rounded-full h-20 flex items-end p-0.5">
                                                        <div
                                                            className={`w-full rounded-full transition-all duration-300 ${
                                                                isSunday
                                                                    ? 'bg-gradient-to-t from-[#00F29D] to-cyan-400 shadow-[0_0_10px_rgba(0,242,157,0.5)]'
                                                                    : 'bg-gradient-to-t from-cyan-600 to-cyan-400 opacity-80 group-hover/bar:opacity-100 group-hover/bar:shadow-[0_0_8px_rgba(0,210,255,0.4)]'
                                                            }`}
                                                            style={{ height: `${heightPct}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-[10px] font-bold ${isSunday ? 'text-[#00F29D]' : 'text-slate-400'}`}>
                                                        {item.day}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                                    <span>Optimal REM Stage</span>
                                    <span className="font-bold text-white">1h 54m (26%)</span>
                                </div>
                            </div>

                            {/* CARD 4: Heart Rate (Weekly Wave Curve) */}
                            <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-rose-500/40 transition-all shadow-xl group flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                            <i className="bi bi-activity text-rose-500"></i>
                                            Heart Rate
                                        </span>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                            +5% vs last wk
                                        </span>
                                    </div>

                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-2xl font-black text-white tracking-tight">72 <span className="text-xs font-semibold text-slate-400">Avg BPM</span></h3>
                                        <span className="text-xs text-slate-400">Resting: 61</span>
                                    </div>

                                    {/* Smooth SVG Wave Line Chart */}
                                    <div className="relative w-full h-24 my-1">
                                        <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="hrLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#FF3B30" />
                                                    <stop offset="100%" stopColor="#FF6B6B" />
                                                </linearGradient>
                                                <linearGradient id="hrAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.35" />
                                                    <stop offset="100%" stopColor="#FF3B30" stopOpacity="0.0" />
                                                </linearGradient>
                                            </defs>

                                            {/* Filled Area */}
                                            <path
                                                d="M 0 50 Q 25 15, 50 45 T 100 30 T 150 55 T 200 20 L 200 80 L 0 80 Z"
                                                fill="url(#hrAreaGrad)"
                                            />

                                            {/* Stroke Curve */}
                                            <path
                                                d="M 0 50 Q 25 15, 50 45 T 100 30 T 150 55 T 200 20"
                                                fill="none"
                                                stroke="url(#hrLineGrad)"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                className="drop-shadow-[0_0_8px_#FF3B30]"
                                            />

                                            {/* Pulse Dot Point */}
                                            <circle cx="150" cy="55" r="4" fill="#FF3B30" className="animate-ping opacity-75" />
                                            <circle cx="150" cy="55" r="3.5" fill="#FFFFFF" stroke="#FF3B30" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                                    <span>Min: <strong className="text-white">58 BPM</strong></span>
                                    <span>Max: <strong className="text-white">148 BPM</strong></span>
                                </div>
                            </div>
                        </div>

                        {/* 3. LOWER SECTION: Prescribed Routine & Upcoming Sessions Split Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            
                            {/* Left Panel (8 cols): Today's Prescribed Routine & Macro Matrix */}
                            <div className="lg:col-span-8 space-y-4">
                                <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl space-y-5">
                                    {/* Panel Header & Search Bar */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-[#00F29D] shadow-[0_0_12px_#00F29D]"></div>
                                            <div>
                                                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                                                    Today's Prescribed Routine & Macro Matrix
                                                </h3>
                                                <p className="text-xs text-slate-400 font-medium">Progressive overload tracking synchronized with AI coach</p>
                                            </div>
                                        </div>

                                        {/* Search Filter Bar */}
                                        <div className="relative">
                                            <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                                            <input
                                                type="text"
                                                placeholder="Search exercises..."
                                                value={exerciseSearch}
                                                onChange={(e) => setExerciseSearch(e.target.value)}
                                                className="w-full sm:w-56 pl-9 pr-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-[#00F29D]/60 focus:ring-1 focus:ring-[#00F29D]/30 transition-all"
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
                                            <tbody className="divide-y divide-slate-800/60 text-xs">
                                                {filteredExercises.map((row) => {
                                                    const isDone = row.status === 'Completed';
                                                    return (
                                                        <tr key={row.id} className="hover:bg-slate-800/30 transition-colors group">
                                                            <td className="py-4 px-3 font-bold text-white flex items-center gap-2.5">
                                                                <div className={`w-2.5 h-2.5 rounded-full ${isDone ? 'bg-[#00F29D] shadow-[0_0_8px_#00F29D]' : 'bg-amber-400 shadow-[0_0_8px_#F59E0B]'}`}></div>
                                                                <div>
                                                                    <span>{row.name}</span>
                                                                    {row.notes && (
                                                                        <span className="block text-[10px] text-slate-400 font-normal">{row.notes}</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-3 text-slate-300 font-semibold">{row.setsReps}</td>
                                                            <td className="py-4 px-3 text-[#00F29D] font-black">{row.targetLoad}</td>
                                                            <td className="py-4 px-3">
                                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                    isDone
                                                                        ? 'bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/40 shadow-[0_0_10px_rgba(0,242,157,0.2)]'
                                                                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                                                                }`}>
                                                                    {row.status}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-3 text-right">
                                                                <button
                                                                    onClick={() => toggleExerciseStatus(row.id)}
                                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                                                        isDone
                                                                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                                                                            : 'bg-gradient-to-r from-[#00F29D] to-[#00c982] hover:from-[#00F29D] hover:to-[#00F29D] text-slate-950 font-black shadow-[0_0_12px_rgba(0,242,157,0.3)]'
                                                                    }`}
                                                                >
                                                                    {isDone ? 'Mark Pending' : 'Complete Set'}
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

                            {/* Right Panel (4 cols): Upcoming Workouts & AI Alerts */}
                            <div className="lg:col-span-4 space-y-6">
                                
                                {/* Upcoming Workouts Card */}
                                <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                                        <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                            <i className="bi bi-calendar2-week-fill text-[#00F29D]"></i>
                                            Upcoming Sessions
                                        </h4>
                                        <span className="text-[10px] text-slate-400 font-bold">This Week</span>
                                    </div>

                                    <div className="space-y-3">
                                        {upcomingWorkouts.map((w) => (
                                            <div key={w.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border uppercase tracking-wider ${w.badge}`}>
                                                        {w.tag}
                                                    </span>
                                                    <h5 className="text-xs font-bold text-white tracking-tight">{w.title}</h5>
                                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                        <i className="bi bi-clock text-[9px]"></i> {w.time}
                                                    </span>
                                                </div>
                                                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                                                    <i className="bi bi-chevron-right text-xs"></i>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Live Updates & Notifications */}
                                <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                                        <div className="flex items-center gap-2.5">
                                            <h4 className="text-sm font-black text-white uppercase tracking-wider">
                                                Live Updates
                                            </h4>
                                            {unreadCount > 0 && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/30 shadow-[0_0_8px_rgba(0,242,157,0.2)]">
                                                    {unreadCount} New
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={markAllRead}
                                            className="text-[11px] font-bold text-slate-400 hover:text-[#00F29D] transition-colors cursor-pointer"
                                        >
                                            Mark all read
                                        </button>
                                    </div>

                                    {/* Feed Items */}
                                    <div className="space-y-3">
                                        {notifications.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`p-3.5 rounded-2xl border transition-all ${
                                                    item.read
                                                        ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                                                        : 'bg-slate-950/80 border-slate-800 border-l-2 border-l-[#00F29D]'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
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
        <div className="min-h-screen bg-[#080B11] text-white font-sans antialiased flex selection:bg-[#00F29D] selection:text-slate-950">
            {/* 1. Collapsible Sidebar (Dark Kinora Theme) */}
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
                {/* 2. Top Navigation Bar (Dark Kinora Theme) */}
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
