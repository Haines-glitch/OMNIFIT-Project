import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import StatCard from '../components/Cards/StatCard';
import DataTable from '../components/Tables/DataTable';
import WorkoutModule from '../components/Modules/WorkoutModule';
import DietModule from '../components/Modules/DietModule';
import AppointmentModule from '../components/Modules/AppointmentModule';
import AttendanceModule from '../components/Modules/AttendanceModule';
import ReportModule from '../components/Modules/ReportModule';
import ProfileModule from '../components/Modules/ProfileModule';
import TrainerSettingsModule from '../components/Modules/TrainerSettingsModule';
import NotificationCenter from '../components/Notifications/NotificationCenter';
import { getTrainerDashboardData } from '../services/dashboardService';
import LoginService from '../components/Login/LoginService';

const TrainerDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [data, setData] = useState(null);

    const [currentUser, setCurrentUser] = useState(() => LoginService.getCurrentUser());

    useEffect(() => {
        getTrainerDashboardData().then(res => setData(res));
        LoginService.fetchCurrentUser().then(u => {
            if (u) setCurrentUser(u);
        });
    }, []);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const trainerInfo = {
        ...(data?.trainer || {}),
        ...currentUser,
        name: currentUser?.name || currentUser?.full_name || data?.trainer?.name || 'Marcus Vance',
        role: currentUser?.role || 'TRAINER',
        specialization: data?.trainer?.specialization || 'NASM Master Trainer',
        avatar: currentUser?.avatar || data?.trainer?.avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=80',
    };

    const memberColumns = [
        { key: 'name', label: 'MEMBER NAME' },
        { key: 'plan', label: 'MEMBERSHIP PLAN' },
        { key: 'goal', label: 'FITNESS GOAL' },
        { key: 'attendance', label: 'ATTENDANCE %' },
        {
            key: 'actions',
            label: 'QUICK MANAGEMENT',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1 bg-[#00F29D] hover:bg-[#00D88C] text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-[#00F29D]/20 hover:shadow-[#00F29D]/40 transition-all flex items-center gap-1.5"
                        onClick={() => setActiveTab('workout')}
                    >
                        <i className="bi bi-journal-plus text-xs"></i>
                        Assign Routine
                    </button>
                    <button
                        className="px-3 py-1 bg-slate-950/90 hover:bg-slate-800 border border-slate-800 hover:border-[#00F29D]/40 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
                        onClick={() => setActiveTab('diet')}
                    >
                        <i className="bi bi-cup-hot text-xs text-[#00F29D]"></i>
                        Assign Diet
                    </button>
                </div>
            )
        }
    ];

    const recentMembersData = [
        { name: 'Sarah Jenkins', plan: 'Gold Fitness', goal: 'Endurance & Cardio', attendance: '95%' },
        { name: 'Michael Scott', plan: 'Silver Basic', goal: 'Weight Management', attendance: '95%' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'members':
                return (
                    <DataTable
                        title="Assigned Health Club Members"
                        columns={memberColumns}
                        data={recentMembersData}
                        theme="light"
                    />
                );
            case 'workout':
                return <WorkoutModule role="TRAINER" theme="light" />;
            case 'diet':
                return <DietModule role="TRAINER" theme="light" />;
            case 'appointments':
                return <AppointmentModule role="TRAINER" theme="light" />;
            case 'attendance':
                return <AttendanceModule theme="light" />;
            case 'notifications':
                return (
                    <NotificationCenter
                        variant="panel"
                        onNavigateTab={setActiveTab}
                    />
                );
            case 'reports':
                return <ReportModule theme="light" />;
            case 'profile':
                return <ProfileModule user={trainerInfo} role="TRAINER" theme="light" />;
            case 'settings':
                return <TrainerSettingsModule theme="light" />;
            case 'dashboard':
            default:
                return (
                    <div className="space-y-6">
                        {/* Command Center Hero */}
                        <div className="relative overflow-hidden p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all">
                            {/* Ambient background glow effect */}
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                <div>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-[#10B981] border border-emerald-500/30 tracking-wider uppercase mb-3">
                                        <i className="bi bi-patch-check-fill text-xs"></i>
                                        NASM MASTER CERTIFIED
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
                                        Trainer Command Center
                                    </h2>
                                    <p className="text-xs sm:text-sm font-medium text-slate-600">
                                        Managing 42 Active Athletes • 6 Sessions Scheduled Today
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        className="px-5 py-2.5 bg-[#10B981] hover:bg-[#0D9668] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                                        onClick={() => setActiveTab('workout')}
                                    >
                                        <i className="bi bi-plus-circle-fill text-sm"></i>
                                        + Assign New Routine
                                    </button>
                                    <button
                                        className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                                        onClick={() => setActiveTab('appointments')}
                                    >
                                        <i className="bi bi-calendar-check-fill text-sm text-[#10B981]"></i>
                                        Review Appointments
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 4x KPI Stat Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <StatCard
                                title="Total Assigned Clients"
                                value="42 Members"
                                subtext="Active Athletes"
                                icon="bi-people-fill"
                                trend="+4"
                                theme="light"
                            />
                            <StatCard
                                title="Today's Sessions"
                                value="6 Sessions"
                                subtext="1 Completed"
                                icon="bi-calendar-event-fill"
                                theme="light"
                            />
                            <StatCard
                                title="Pending Appointments"
                                value="3 Requests"
                                subtext="Requires Approval"
                                icon="bi-clock-history"
                                theme="light"
                            />
                            <StatCard
                                title="Trainer Rating"
                                value="4.95 / 5.0"
                                subtext="Based on 120 Reviews"
                                icon="bi-star-fill"
                                theme="light"
                            />
                        </div>

                        {/* Dashboard Main Grid: Recent Table (2-col) + Live Activity & Alerts (1-col) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            <div className="lg:col-span-2">
                                <DataTable
                                    title="Recent Client Health Progress"
                                    columns={memberColumns}
                                    data={recentMembersData}
                                    theme="light"
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <NotificationCenter
                                    variant="panel"
                                    onNavigateTab={setActiveTab}
                                />
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                role="TRAINER"
                theme="light"
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
            />

            <main
                className="flex-grow min-w-0 px-6 pb-12 transition-all duration-300"
                style={{
                    marginLeft: isCollapsed ? '80px' : '260px',
                }}
            >
                <Navbar
                    title="Trainer Management Hub"
                    user={trainerInfo}
                    theme="light"
                    isCollapsed={isCollapsed}
                    onNavigateTab={setActiveTab}
                />
                {renderContent()}
            </main>
        </div>
    );
};

export default TrainerDashboard;

