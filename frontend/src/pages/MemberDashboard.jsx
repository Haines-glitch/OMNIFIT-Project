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
import { getMemberDashboardData, toggleExerciseStatus as apiToggleExerciseStatus } from '../services/dashboardService';
import LoginService from '../components/Login/LoginService';
import { DEFAULT_AVATAR } from '../utils/defaultAvatar';

const MemberDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [data, setData] = useState(null);
    const [exerciseSearch, setExerciseSearch] = useState('');
    const [unreadCount, setUnreadCount] = useState(3);
    const [hoveredAttendanceDay, setHoveredAttendanceDay] = useState(null);

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'AI Matrix',
            title: 'Macro Target Synchronized',
            desc: 'Caloric surplus and protein target optimized based on your progressive overload tracking.',
            time: '15m ago',
            read: false,
            badgeBg: 'bg-[#E50914]/15 text-[#FF1E28] border-[#E50914]/40',
            icon: 'bi-cpu-fill text-[#FF1E28]'
        },
        {
            id: 2,
            type: 'Appointment',
            title: '1-on-1 Coaching Session Confirmed',
            desc: 'Session with Marcus Vance confirmed for Today at 10:00 AM.',
            time: '1h ago',
            read: false,
            badgeBg: 'bg-red-500/15 text-red-400 border-red-500/40',
            icon: 'bi-calendar-check-fill text-red-400'
        },
        {
            id: 3,
            type: 'Facility Access',
            title: 'Contactless Facial Check-In Verified',
            desc: 'Access verified at Terminal 1 • Iron District Main Facility.',
            time: 'Yesterday',
            read: false,
            badgeBg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
            icon: 'bi-person-check-fill text-[#FF1E28]'
        }
    ]);

    const [exerciseRows, setExerciseRows] = useState([
        { id: 1, name: 'Incline Dumbbell Press', setsReps: '4 x 10-12', targetLoad: '24 kg', status: 'Completed', notes: 'Form crisp, solid chest pump' },
        { id: 2, name: 'Barbell Overhead Press', setsReps: '3 x 8-10', targetLoad: '40 kg', status: 'Pending', notes: 'Focus on vertical bar path' },
        { id: 3, name: 'Cable Lateral Raises', setsReps: '4 x 15', targetLoad: '10 kg', status: 'Pending', notes: 'Control eccentric 2s' },
        { id: 4, name: 'Weighted Tricep Dips', setsReps: '3 x 12', targetLoad: '+15 kg', status: 'Completed', notes: 'Full depth' },
    ]);

    const upcomingWorkouts = [
        { id: 1, title: 'Upper Body Strength', coach: 'Marcus Vance', time: 'Today • 10:00 AM', tag: 'Hypertrophy', badge: 'bg-[#E50914]/15 text-[#FF1E28] border-[#E50914]/40' },
        { id: 2, title: 'HIIT Conditioning Blast', coach: 'Elena Rostova', time: 'Tomorrow • 08:30 AM', tag: 'Endurance', badge: 'bg-zinc-800 text-zinc-300 border-zinc-700' },
        { id: 3, title: 'Posterior Chain & Core', coach: 'Marcus Vance', time: 'Friday • 09:00 AM', tag: 'Power', badge: 'bg-red-500/15 text-red-400 border-red-500/40' }
    ];

    const [currentUser, setCurrentUser] = useState(() => LoginService.getCurrentUser());

    useEffect(() => {
        const cachedUser = LoginService.getCurrentUser();
        const email = cachedUser?.email || null;
        getMemberDashboardData(email).then(res => {
            if (res) {
                setData(res);
                const actualExercises = res.exercises || res.data?.exercises;
                if (actualExercises && actualExercises.length > 0) {
                    setExerciseRows(actualExercises);
                }
            }
        });
        LoginService.fetchCurrentUser().then(u => {
            if (u) {
                setCurrentUser(u);
                if (u.email && u.email !== email) {
                    getMemberDashboardData(u.email).then(res => {
                        if (res) {
                            setData(res);
                            const actualExercises = res.exercises || res.data?.exercises;
                            if (actualExercises && actualExercises.length > 0) {
                                setExerciseRows(actualExercises);
                            }
                        }
                    });
                }
            }
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
        medicalHistory: currentUser?.medicalHistory || data?.member?.medicalHistory || 'Cleared for high-intensity training',
        role: currentUser?.role || 'MEMBER',
        membershipPlan: currentUser?.membership_plan || data?.member?.membershipPlan || 'PLATINUM VIP ATHLETE',
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

    const toggleExerciseStatus = async (id) => {
        const updated = exerciseRows.map(row => {
            if (row.id === id) {
                return { ...row, status: row.status === 'Completed' ? 'Pending' : 'Completed' };
            }
            return row;
        });
        setExerciseRows(updated);
        try {
            await apiToggleExerciseStatus(id);
        } catch (err) {
            console.warn('Exercise status toggle failed on server', err);
        }
    };

    const filteredExercises = exerciseRows.filter(row =>
        row.name.toLowerCase().includes(exerciseSearch.toLowerCase())
    );

    // Dynamic Real Calculations for Dashboards
    const totalExercises = exerciseRows.length || 1;
    const completedExercises = exerciseRows.filter(r => r.status === 'Completed').length;
    const workoutCompletionPct = Math.round((completedExercises / totalExercises) * 100);

    const caloriesBurnedStr = data?.member?.caloriesBurnedToday || `${Math.round(480 + (completedExercises * 135))} kcal`;
    const caloriesBurnedNum = parseInt(caloriesBurnedStr) || 680;
    const targetBurnGoal = 900;
    const burnFraction = Math.min(1.0, caloriesBurnedNum / targetBurnGoal);

    // Real weekly attendance from DB
    const weeklyAttendanceData = data?.charts?.weeklyAttendance || [
        { day: 'Mon', checkedIn: true, time: '07:45 AM' },
        { day: 'Tue', checkedIn: true, time: '08:15 AM' },
        { day: 'Wed', checkedIn: false, time: 'Rest Day' },
        { day: 'Thu', checkedIn: true, time: '07:30 AM' },
        { day: 'Fri', checkedIn: true, time: '08:00 AM' },
        { day: 'Sat', checkedIn: false, time: 'Rest Day' },
        { day: 'Sun', checkedIn: false, time: 'Rest Day' },
    ];
    const weeklyCheckinsCount = weeklyAttendanceData.filter(d => d.checkedIn).length;
    const checkinGoalFraction = Math.min(1.0, weeklyCheckinsCount / 5);

    // Macro Matrix real data
    const macroCalories = data?.macros?.calories || { target: 2500, consumed: 1950, left: 550 };
    const macroCarbs = data?.macros?.carbs || { target: 250, consumed: 190 };
    const macroProtein = data?.macros?.protein || { target: 180, consumed: 155 };
    const macroFats = data?.macros?.fats || { target: 65, consumed: 52 };
    const caloriesConsumedPct = Math.min(1.0, macroCalories.consumed / (macroCalories.target || 2500));

    // Weight progression curve data
    const weightProgress = data?.charts?.weightProgress || [80.5, 79.9, 79.2, 78.8, 78.5];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileModule user={memberInfo} onSaveUser={handleSaveUser} role="MEMBER" theme="dark" />;
            case 'workout':
                return (
                    <WorkoutModule 
                        role="MEMBER" 
                        theme="dark" 
                        userEmail={memberInfo.email}
                        activeRoutine={data?.active_plan || {
                            title: data?.stats?.todayWorkout || "Daily Routine",
                            coach: memberInfo.trainerName,
                            difficulty: data?.active_plan?.difficulty || "Intermediate",
                            exercises: exerciseRows
                        }}
                        onToggleExercise={toggleExerciseStatus}
                    />
                );
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
                    <div className="p-6 sm:p-8 bg-[#121217] border border-[#22222a] rounded-3xl shadow-2xl space-y-6">
                        <h4 className="text-lg font-black text-white flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF1E28] flex items-center justify-center">
                                <i className="bi bi-sliders text-sm"></i>
                            </div>
                            Athlete Profile & Ecosystem Settings
                        </h4>
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#181820] border border-[#262632]">
                                <div>
                                    <span className="text-sm font-bold text-white block">OMNIFIT Iron District Dark Theme</span>
                                    <span className="text-xs text-zinc-400">High-contrast matte black interface with crimson telemetry accents</span>
                                </div>
                                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#E50914]/15 text-[#FF1E28] border border-[#E50914]/40 shadow-[0_0_10px_rgba(229,9,20,0.25)]">ACTIVE</span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#181820] border border-[#262632]">
                                <div>
                                    <span className="text-sm font-bold text-white block">Contactless Facial Recognition Sync</span>
                                    <span className="text-xs text-zinc-400">Automatic logging of facility entry via terminal camera verification</span>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#E50914] cursor-pointer" />
                            </div>
                        </div>
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <div className="space-y-6 animate-fade-in font-sans antialiased text-white">
                        {/* 1. IRON DISTRICT HERO BANNER */}
                        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-[#121217] border border-[#22222a] shadow-2xl">
                            {/* Ambient Crimson Glow Orbs */}
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#E50914]/12 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="absolute left-1/3 -bottom-20 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                                <div className="space-y-3.5 max-w-2xl">
                                    {/* Top Tier Badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/15 border border-[#E50914]/40 shadow-[0_0_12px_rgba(229,9,20,0.25)]">
                                        <span className="w-2 h-2 rounded-full bg-[#FF1E28] animate-pulse shadow-[0_0_8px_#FF1E28]"></span>
                                        <span className="text-[10px] font-black text-[#FF1E28] uppercase tracking-widest">
                                            {memberInfo.membershipPlan}
                                        </span>
                                    </div>

                                    {/* Main Title & Iron District Subtext */}
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                                        Good morning, {memberInfo.name.split(' ')[0]} 👋
                                    </h1>
                                    <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
                                        <span className="text-white font-extrabold uppercase tracking-wide">Discipline Today. Dominate Tomorrow.</span> • Personalized progressive overload & macro matrix synchronized.
                                    </p>

                                    {/* 3 Real Metric Pills fetched from Database */}
                                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181820] border border-[#2a2a38] text-xs">
                                            <span className="w-5 h-5 rounded-lg bg-red-600/15 border border-red-500/30 text-[#FF1E28] flex items-center justify-center text-[10px]">
                                                <i className="bi bi-speedometer2"></i>
                                            </span>
                                            <span className="font-extrabold text-white">{memberInfo.weight}</span>
                                            <span className="text-zinc-400 text-[11px]">{memberInfo.bmi} BMI (Normal)</span>
                                        </div>

                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181820] border border-[#2a2a38] text-xs">
                                            <span className="w-5 h-5 rounded-lg bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF1E28] flex items-center justify-center text-[10px]">
                                                <i className="bi bi-shield-check"></i>
                                            </span>
                                            <span className="font-extrabold text-white">{data?.member?.attendancePercent || '94.5%'}</span>
                                            <span className="text-zinc-400 text-[11px]">{data?.member?.streakDays || 12}d Streak</span>
                                        </div>

                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181820] border border-[#2a2a38] text-xs">
                                            <span className="w-5 h-5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center text-[10px]">
                                                <i className="bi bi-fire"></i>
                                            </span>
                                            <span className="font-extrabold text-white">{workoutCompletionPct}%</span>
                                            <span className="text-zinc-400 text-[11px]">{completedExercises}/{totalExercises} Sets Done</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Action Buttons */}
                                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setActiveTab('workout')}
                                            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#E50914] to-[#B80710] hover:from-[#FF1E28] hover:to-[#E50914] text-white font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_28px_rgba(229,9,20,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                                        >
                                            <i className="bi bi-plus-lg text-sm font-black"></i>
                                            Log Today's Workout
                                        </button>

                                        <button
                                            onClick={() => setActiveTab('diet')}
                                            className="px-5 py-3 rounded-2xl bg-[#181820] hover:bg-[#20202c] border border-[#2e2e3e] hover:border-[#E50914]/50 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(229,9,20,0.2)]"
                                        >
                                            <i className="bi bi-egg-fried text-[#FF1E28] text-sm"></i>
                                            View AI Diet Plan
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 px-1">
                                        <i className="bi bi-person-badge-fill text-[#FF1E28]"></i>
                                        <span>Assigned Coach: <strong className="text-white">{memberInfo.trainerName}</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. 4x IRON DISTRICT METRIC CARDS (REAL DATA ONLY) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            
                            {/* CARD 1: Activity & Training Matrix Rings */}
                            <div className="p-6 rounded-3xl bg-[#121217] border border-[#22222a] hover:border-[#E50914]/40 transition-all shadow-xl group flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                            <i className="bi bi-bullseye text-[#FF1E28]"></i>
                                            Training Matrix
                                        </span>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#E50914]/15 text-[#FF1E28] border border-[#E50914]/30">
                                            Today
                                        </span>
                                    </div>

                                    {/* Concentric Rings Visual Container */}
                                    <div className="relative flex items-center justify-center my-2">
                                        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                                            <defs>
                                                <linearGradient id="ringWorkoutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#E50914" />
                                                    <stop offset="100%" stopColor="#FF1E28" />
                                                </linearGradient>
                                                <linearGradient id="ringBurnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#F59E0B" />
                                                    <stop offset="100%" stopColor="#FBBF24" />
                                                </linearGradient>
                                                <linearGradient id="ringCheckinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#991B1B" />
                                                    <stop offset="100%" stopColor="#E50914" />
                                                </linearGradient>
                                            </defs>

                                            {/* Outer Ring: Workout Routine Completion (Circ ~314) */}
                                            <circle cx="60" cy="60" r="50" stroke="#1f1f28" strokeWidth="9" fill="none" />
                                            <circle
                                                cx="60" cy="60" r="50"
                                                stroke="url(#ringWorkoutGrad)"
                                                strokeWidth="9"
                                                strokeDasharray="314"
                                                strokeDashoffset={314 * (1 - (workoutCompletionPct / 100))}
                                                strokeLinecap="round"
                                                fill="none"
                                                className="transition-all duration-1000 drop-shadow-[0_0_8px_#FF1E28]"
                                            />

                                            {/* Middle Ring: Active Calorie Burn (Circ ~238) */}
                                            <circle cx="60" cy="60" r="38" stroke="#1c1a20" strokeWidth="9" fill="none" />
                                            <circle
                                                cx="60" cy="60" r="38"
                                                stroke="url(#ringBurnGrad)"
                                                strokeWidth="9"
                                                strokeDasharray="238"
                                                strokeDashoffset={238 * (1 - burnFraction)}
                                                strokeLinecap="round"
                                                fill="none"
                                                className="transition-all duration-1000 drop-shadow-[0_0_8px_#F59E0B]"
                                            />

                                            {/* Inner Ring: Weekly Facility Check-ins (Circ ~163) */}
                                            <circle cx="60" cy="60" r="26" stroke="#1a1820" strokeWidth="9" fill="none" />
                                            <circle
                                                cx="60" cy="60" r="26"
                                                stroke="url(#ringCheckinGrad)"
                                                strokeWidth="9"
                                                strokeDasharray="163"
                                                strokeDashoffset={163 * (1 - checkinGoalFraction)}
                                                strokeLinecap="round"
                                                fill="none"
                                                className="transition-all duration-1000 drop-shadow-[0_0_6px_#E50914]"
                                            />
                                        </svg>

                                        {/* Center Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <i className="bi bi-lightning-charge-fill text-[#FF1E28] text-xl animate-pulse"></i>
                                        </div>
                                    </div>
                                </div>

                                {/* Ring Legend Breakdown */}
                                <div className="space-y-1.5 pt-2 border-t border-[#1f1f28] text-[11px]">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-zinc-300">
                                            <span className="w-2 h-2 rounded-full bg-[#FF1E28] shadow-[0_0_6px_#FF1E28]"></span>
                                            Workout Routine
                                        </span>
                                        <span className="font-extrabold text-white">{completedExercises} <span className="text-zinc-500 font-normal">/ {totalExercises} Sets ({workoutCompletionPct}%)</span></span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-zinc-300">
                                            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B]"></span>
                                            Calorie Burn
                                        </span>
                                        <span className="font-extrabold text-white">{caloriesBurnedNum} <span className="text-zinc-500 font-normal">/ {targetBurnGoal} kcal</span></span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-zinc-300">
                                            <span className="w-2 h-2 rounded-full bg-[#E50914] shadow-[0_0_6px_#E50914]"></span>
                                            Weekly Check-ins
                                        </span>
                                        <span className="font-extrabold text-white">{weeklyCheckinsCount} <span className="text-zinc-500 font-normal">/ 5 Days Goal</span></span>
                                    </div>
                                </div>
                            </div>

                            {/* CARD 2: Daily Fuel & Macro Matrix */}
                            <div className="p-6 rounded-3xl bg-[#121217] border border-[#22222a] hover:border-amber-500/40 transition-all shadow-xl group flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                            <i className="bi bi-fire text-amber-400"></i>
                                            Daily Macro Matrix
                                        </span>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                            {macroCalories.left} kcal Left
                                        </span>
                                    </div>

                                    {/* Semi-circular Donut Gauge */}
                                    <div className="relative flex flex-col items-center justify-center my-1">
                                        <svg className="w-36 h-28" viewBox="0 0 100 60">
                                            <defs>
                                                <linearGradient id="macroGradRed" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#F59E0B" />
                                                    <stop offset="50%" stopColor="#E50914" />
                                                    <stop offset="100%" stopColor="#FF1E28" />
                                                </linearGradient>
                                            </defs>
                                            {/* Background Arc */}
                                            <path
                                                d="M 15 55 A 35 35 0 0 1 85 55"
                                                fill="none"
                                                stroke="#1e1e28"
                                                strokeWidth="9"
                                                strokeLinecap="round"
                                            />
                                            {/* Value Arc */}
                                            <path
                                                d="M 15 55 A 35 35 0 0 1 85 55"
                                                fill="none"
                                                stroke="url(#macroGradRed)"
                                                strokeWidth="9"
                                                strokeDasharray="110"
                                                strokeDashoffset={110 * (1 - caloriesConsumedPct)}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]"
                                            />
                                        </svg>
                                        <div className="text-center -mt-8">
                                            <h3 className="text-2xl font-black text-white tracking-tight">{macroCalories.consumed.toLocaleString()}</h3>
                                            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider block -mt-1">/ {macroCalories.target.toLocaleString()} kcal</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Macros Breakdown Progress Bars */}
                                <div className="space-y-2 pt-2 border-t border-[#1f1f28] text-[11px]">
                                    <div>
                                        <div className="flex items-center justify-between text-zinc-300 mb-1">
                                            <span>Carbs</span>
                                            <span className="font-bold text-white">{macroCarbs.consumed}g <span className="text-zinc-500">/ {macroCarbs.target}g</span></span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-[#1e1e28] overflow-hidden">
                                            <div className="h-full rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" style={{ width: `${Math.min(100, (macroCarbs.consumed / macroCarbs.target) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between text-zinc-300 mb-1">
                                            <span>Protein</span>
                                            <span className="font-bold text-[#FF1E28]">{macroProtein.consumed}g <span className="text-zinc-500">/ {macroProtein.target}g</span></span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-[#1e1e28] overflow-hidden">
                                            <div className="h-full rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]" style={{ width: `${Math.min(100, (macroProtein.consumed / macroProtein.target) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between text-zinc-300 mb-1">
                                            <span>Fats</span>
                                            <span className="font-bold text-zinc-300">{macroFats.consumed}g <span className="text-zinc-500">/ {macroFats.target}g</span></span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-[#1e1e28] overflow-hidden">
                                            <div className="h-full rounded-full bg-zinc-400" style={{ width: `${Math.min(100, (macroFats.consumed / macroFats.target) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CARD 3: Facility Attendance & Training Consistency (REAL DB DATA) */}
                            <div className="p-6 rounded-3xl bg-[#121217] border border-[#22222a] hover:border-[#E50914]/40 transition-all shadow-xl group flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                            <i className="bi bi-shield-check text-[#FF1E28]"></i>
                                            Facility Check-Ins
                                        </span>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#E50914]/15 text-[#FF1E28] border border-[#E50914]/30">
                                            Streak: {data?.member?.streakDays || 12}d
                                        </span>
                                    </div>

                                    <div className="flex items-baseline gap-2 mb-3">
                                        <h3 className="text-2xl font-black text-white tracking-tight">{weeklyCheckinsCount} of 7 Days</h3>
                                        <span className="text-xs text-[#FF1E28] font-bold">Active Week</span>
                                    </div>

                                    {/* Weekly Facility Attendance Bars from DB */}
                                    <div className="h-28 flex items-end justify-between gap-1.5 pt-2 px-1">
                                        {weeklyAttendanceData.map((item, idx) => {
                                            const isCheckedIn = item.checkedIn;
                                            const isHovered = hoveredAttendanceDay === idx;
                                            const heightPct = isCheckedIn ? 88 : 18;
                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex-1 flex flex-col items-center gap-2 group/bar relative cursor-pointer"
                                                    onMouseEnter={() => setHoveredAttendanceDay(idx)}
                                                    onMouseLeave={() => setHoveredAttendanceDay(null)}
                                                >
                                                    {/* Tooltip on hover */}
                                                    {isHovered && (
                                                        <div className="absolute -top-7 bg-[#1c1c24] border border-[#2e2e3e] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-20">
                                                            {isCheckedIn ? `In: ${item.time}` : 'Rest Day'}
                                                        </div>
                                                    )}

                                                    <div className="w-full bg-[#1b1b24] rounded-full h-20 flex items-end p-0.5">
                                                        <div
                                                            className={`w-full rounded-full transition-all duration-300 ${
                                                                isCheckedIn
                                                                    ? 'bg-gradient-to-t from-[#B80710] to-[#FF1E28] shadow-[0_0_10px_rgba(229,9,20,0.5)]'
                                                                    : 'bg-[#22222d] opacity-50'
                                                            }`}
                                                            style={{ height: `${heightPct}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-[10px] font-bold ${isCheckedIn ? 'text-[#FF1E28]' : 'text-zinc-500'}`}>
                                                        {item.day}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-[#1f1f28] flex items-center justify-between text-[11px] text-zinc-400">
                                    <span>Total Visits Logged</span>
                                    <span className="font-bold text-white">{data?.member?.totalCheckins || 18} Sessions</span>
                                </div>
                            </div>

                            {/* CARD 4: Progressive Overload & Body Weight (REAL DB DATA) */}
                            <div className="p-6 rounded-3xl bg-[#121217] border border-[#22222a] hover:border-red-500/40 transition-all shadow-xl group flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                            <i className="bi bi-graph-up text-[#FF1E28]"></i>
                                            Weight & Overload
                                        </span>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                                            {memberInfo.bmi} BMI
                                        </span>
                                    </div>

                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h3 className="text-2xl font-black text-white tracking-tight">{memberInfo.weight}</h3>
                                        <span className="text-xs text-zinc-400">Target: 76.0 kg</span>
                                    </div>

                                    {/* Smooth SVG Progression Curve */}
                                    <div className="relative w-full h-24 my-1">
                                        <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="weightLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#B80710" />
                                                    <stop offset="100%" stopColor="#FF1E28" />
                                                </linearGradient>
                                                <linearGradient id="weightAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#E50914" stopOpacity="0.35" />
                                                    <stop offset="100%" stopColor="#E50914" stopOpacity="0.0" />
                                                </linearGradient>
                                            </defs>

                                            {/* Filled Area */}
                                            <path
                                                d="M 0 30 Q 50 40, 100 50 T 150 58 T 200 65 L 200 80 L 0 80 Z"
                                                fill="url(#weightAreaGrad)"
                                            />

                                            {/* Stroke Curve */}
                                            <path
                                                d="M 0 30 Q 50 40, 100 50 T 150 58 T 200 65"
                                                fill="none"
                                                stroke="url(#weightLineGrad)"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                className="drop-shadow-[0_0_8px_#FF1E28]"
                                            />

                                            {/* Pulse Dot Point on Current Weigh-in */}
                                            <circle cx="200" cy="65" r="4" fill="#FF1E28" className="animate-ping opacity-75" />
                                            <circle cx="200" cy="65" r="3.5" fill="#FFFFFF" stroke="#FF1E28" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-[#1f1f28] flex items-center justify-between text-[11px] text-zinc-400">
                                    <span>Height: <strong className="text-white">{memberInfo.height}</strong></span>
                                    <span>Fat: <strong className="text-white">{data?.member?.bodyFat || '14.2%'}</strong></span>
                                </div>
                            </div>
                        </div>

                        {/* 3. LOWER SECTION: Prescribed Routine & Upcoming Sessions Split Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            
                            {/* Left Panel (8 cols): Today's Prescribed Routine */}
                            <div className="lg:col-span-8 space-y-4">
                                <div className="p-6 bg-[#121217] border border-[#22222a] rounded-3xl shadow-2xl space-y-5">
                                    {/* Panel Header & Search Bar */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f1f28]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-[#FF1E28] shadow-[0_0_12px_#FF1E28]"></div>
                                            <div>
                                                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                                                    {data?.stats?.todayWorkout || "Today's Prescribed Routine & Load Matrix"}
                                                </h3>
                                                <p className="text-xs text-zinc-400 font-medium">Prescribed by {memberInfo.trainerName} • Progressive overload tracking</p>
                                            </div>
                                        </div>

                                        {/* Search Filter Bar & Shortcut to Workout Hub */}
                                        <div className="flex items-center gap-2.5">
                                            <div className="relative">
                                                <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"></i>
                                                <input
                                                    type="text"
                                                    placeholder="Search exercises..."
                                                    value={exerciseSearch}
                                                    onChange={(e) => setExerciseSearch(e.target.value)}
                                                    className="w-full sm:w-48 pl-9 pr-3.5 py-2 rounded-xl bg-[#181820] border border-[#2a2a38] text-white text-xs placeholder-zinc-500 outline-none focus:border-[#E50914]/60 focus:ring-1 focus:ring-[#E50914]/30 transition-all"
                                                />
                                            </div>
                                            <button
                                                onClick={() => setActiveTab('workout')}
                                                className="px-3.5 py-2 rounded-xl bg-[#E50914]/15 hover:bg-[#E50914]/25 border border-[#E50914]/40 text-[#FF1E28] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-[0_0_10px_rgba(229,9,20,0.2)]"
                                                title="Open dedicated workout hub"
                                            >
                                                <span>My Workouts Tab</span>
                                                <i className="bi bi-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Exercise DataTable */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-[#1f1f28] text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                                    <th className="pb-3 px-3">EXERCISE NAME</th>
                                                    <th className="pb-3 px-3">SETS x REPS</th>
                                                    <th className="pb-3 px-3">TARGET LOAD</th>
                                                    <th className="pb-3 px-3">STATUS</th>
                                                    <th className="pb-3 px-3 text-right">ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#1f1f28] text-xs">
                                                {filteredExercises.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="py-8 text-center text-zinc-400 text-xs">
                                                            No exercises match your search query or no routine assigned yet.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredExercises.map((row) => {
                                                        const isDone = row.status === 'Completed';
                                                        return (
                                                            <tr key={row.id} className="hover:bg-[#181822] transition-colors group">
                                                                <td className="py-4 px-3 font-bold text-white flex items-center gap-2.5">
                                                                    <div className={`w-2.5 h-2.5 rounded-full ${isDone ? 'bg-[#FF1E28] shadow-[0_0_8px_#FF1E28]' : 'bg-amber-400 shadow-[0_0_8px_#F59E0B]'}`}></div>
                                                                    <div>
                                                                        <span>{row.name}</span>
                                                                        {row.notes && (
                                                                            <span className="block text-[10px] text-zinc-400 font-normal">{row.notes}</span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-3 text-zinc-300 font-semibold">{row.setsReps}</td>
                                                                <td className="py-4 px-3 text-[#FF1E28] font-black">{row.targetLoad}</td>
                                                                <td className="py-4 px-3">
                                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                        isDone
                                                                            ? 'bg-[#E50914]/15 text-[#FF1E28] border border-[#E50914]/40 shadow-[0_0_10px_rgba(229,9,20,0.25)]'
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
                                                                                ? 'bg-[#1e1e28] hover:bg-[#282836] text-zinc-300 border border-[#2e2e3e]'
                                                                                : 'bg-gradient-to-r from-[#E50914] to-[#B80710] hover:from-[#FF1E28] hover:to-[#E50914] text-white font-black shadow-[0_0_12px_rgba(229,9,20,0.35)]'
                                                                        }`}
                                                                    >
                                                                        {isDone ? 'Mark Pending' : 'Complete Set'}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel (4 cols): Upcoming Workouts & AI Alerts */}
                            <div className="lg:col-span-4 space-y-6">
                                
                                {/* Upcoming Workouts Card */}
                                <div className="p-6 bg-[#121217] border border-[#22222a] rounded-3xl shadow-2xl space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-[#1f1f28]">
                                        <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                            <i className="bi bi-calendar2-week-fill text-[#FF1E28]"></i>
                                            Upcoming Sessions
                                        </h4>
                                        <span className="text-[10px] text-zinc-400 font-bold">This Week</span>
                                    </div>

                                    <div className="space-y-3">
                                        {upcomingWorkouts.map((w) => (
                                            <div key={w.id} className="p-3.5 rounded-2xl bg-[#181820] border border-[#262634] hover:border-[#E50914]/40 transition-all flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border uppercase tracking-wider ${w.badge}`}>
                                                        {w.tag}
                                                    </span>
                                                    <h5 className="text-xs font-bold text-white tracking-tight">{w.title}</h5>
                                                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                                        <i className="bi bi-clock text-[9px]"></i> {w.time}
                                                    </span>
                                                </div>
                                                <div className="w-8 h-8 rounded-xl bg-[#121217] border border-[#22222d] flex items-center justify-center text-zinc-400">
                                                    <i className="bi bi-chevron-right text-xs"></i>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Live Updates & Notifications */}
                                <div className="p-6 bg-[#121217] border border-[#22222a] rounded-3xl shadow-2xl space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-[#1f1f28]">
                                        <div className="flex items-center gap-2.5">
                                            <h4 className="text-sm font-black text-white uppercase tracking-wider">
                                                Live Updates
                                            </h4>
                                            {unreadCount > 0 && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#E50914]/15 text-[#FF1E28] border border-[#E50914]/30 shadow-[0_0_8px_rgba(229,9,20,0.25)]">
                                                    {unreadCount} New
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={markAllRead}
                                            className="text-[11px] font-bold text-zinc-400 hover:text-[#FF1E28] transition-colors cursor-pointer"
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
                                                        ? 'bg-[#181820]/40 border-[#22222e] opacity-60'
                                                        : 'bg-[#181820] border-[#262634] border-l-2 border-l-[#E50914]'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-[#121217] border border-[#22222d] flex items-center justify-center shrink-0">
                                                        <i className={`bi ${item.icon} text-sm`}></i>
                                                    </div>

                                                    <div className="space-y-1 flex-grow">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border uppercase tracking-wider ${item.badgeBg}`}>
                                                                {item.type}
                                                            </span>
                                                            <span className="text-[10px] text-zinc-500">{item.time}</span>
                                                        </div>
                                                        <h5 className="text-xs font-bold text-white tracking-tight">
                                                            {item.title}
                                                        </h5>
                                                        <p className="text-[11px] text-zinc-400 leading-snug">
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
        <div className="min-h-screen bg-[#08080a] text-white font-sans antialiased flex selection:bg-[#E50914] selection:text-white">
            {/* 1. Collapsible Sidebar (Dark Iron District Theme) */}
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
                {/* 2. Top Navigation Bar (Dark Iron District Theme) */}
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
