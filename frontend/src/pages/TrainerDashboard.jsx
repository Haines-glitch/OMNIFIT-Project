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
import { DEFAULT_AVATAR } from '../utils/defaultAvatar';

const TrainerDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [data, setData] = useState(null);
    const [pendingMembers, setPendingMembers] = useState([]);
    const [approvalAlert, setApprovalAlert] = useState(null);
    const [isApproving, setIsApproving] = useState({});

    const [activeMembersList, setActiveMembersList] = useState([
        { name: 'Sarah Jenkins', email: 'sarah.jenkins@omnifit.com', plan: 'Gold Fitness', goal: 'Endurance & Cardio', attendance: '95%' },
        { name: 'Michael Scott', email: 'michael.scott@omnifit.com', plan: 'Silver Basic', goal: 'Weight Management', attendance: '95%' },
        { name: 'Alex Mercer', email: 'alex.mercer@omnifit.com', plan: 'Pro Athlete Tier', goal: 'Hypertrophy & Fat Loss', attendance: '92%' }
    ]);

    const [currentUser, setCurrentUser] = useState(() => LoginService.getCurrentUser());

    const loadPendingMembers = async () => {
        try {
            const list = await LoginService.getPendingMembers();
            setPendingMembers(list || []);
        } catch (e) {
            console.warn('Error loading pending members:', e);
        }
    };

    useEffect(() => {
        getTrainerDashboardData().then(res => setData(res));
        LoginService.fetchCurrentUser().then(u => {
            if (u) setCurrentUser(u);
        });
        loadPendingMembers();
    }, []);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const trainerInfo = {
        ...(data?.trainer || {}),
        ...currentUser,
        name: currentUser?.name || currentUser?.full_name || data?.trainer?.name || 'Marcus Vance',
        email: currentUser?.email || data?.trainer?.email || 'marcus.vance@omnifit.com',
        phone: currentUser?.phone || data?.trainer?.phone || '+91 98765 43210',
        gender: currentUser?.gender || 'Male',
        dob: currentUser?.dob || '1992-06-15',
        role: currentUser?.role || 'TRAINER',
        specialization: currentUser?.specialization || data?.trainer?.specialization || 'NASM Master Trainer',
        avatar: currentUser?.avatar || data?.trainer?.avatar || DEFAULT_AVATAR,
    };

    const handleApprove = async (member) => {
        const emailKey = (member.email || '').toLowerCase().trim();
        setIsApproving(prev => ({ ...prev, [emailKey]: true }));
        try {
            const res = await LoginService.approveMember(member, trainerInfo.name);
            const isEmailSuccess = res.email_sent === true;
            setApprovalAlert({
                type: isEmailSuccess ? 'success' : (res.email_error ? 'warning' : 'success'),
                message: res.message || `Athlete ${res.name} approved! ${isEmailSuccess ? `Verification email sent via SMTP to ${res.email}.` : (res.email_error ? `SMTP notice: ${res.email_error}` : `Email dispatched to ${res.email}`)}`,
                email: res.email,
                name: res.name
            });

            // Remove from pending members list
            setPendingMembers(prev => prev.filter(m => (m.email || '').toLowerCase().trim() !== emailKey));

            // Add to active members table
            setActiveMembersList(prev => [
                {
                    name: res.name,
                    email: res.email,
                    plan: member.membership_plan || 'Platinum VIP',
                    goal: member.fitness_goal || 'Hypertrophy & Fat Loss',
                    attendance: '100% (New)'
                },
                ...prev
            ]);
        } catch (err) {
            console.error('Approval error:', err);
            setApprovalAlert({
                type: 'error',
                message: 'Failed to approve member. Please retry.'
            });
        } finally {
            setIsApproving(prev => ({ ...prev, [emailKey]: false }));
            setTimeout(() => setApprovalAlert(null), 6000);
        }
    };

    const memberColumns = [
        { key: 'name', label: 'MEMBER NAME' },
        { key: 'email', label: 'EMAIL' },
        { key: 'plan', label: 'MEMBERSHIP PLAN' },
        { key: 'goal', label: 'FITNESS GOAL' },
        { key: 'attendance', label: 'ATTENDANCE %' },
        {
            key: 'actions',
            label: 'QUICK MANAGEMENT',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1 bg-[#10B981] hover:bg-[#0D9668] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        onClick={() => setActiveTab('workout')}
                    >
                        <i className="bi bi-journal-plus text-xs"></i>
                        Assign Routine
                    </button>
                    <button
                        className="px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        onClick={() => setActiveTab('diet')}
                    >
                        <i className="bi bi-cup-hot text-xs text-[#10B981]"></i>
                        Assign Diet
                    </button>
                </div>
            )
        }
    ];

    const handleSaveUser = (updatedUser) => {
        setCurrentUser(updatedUser);
    };

    // Render Pending Approvals Card Widget
    const renderPendingApprovalsSection = () => {
        return (
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4" data-testid="pending-approvals-panel">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-lg">
                            <i className="bi bi-person-check-fill"></i>
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                Pending Athlete Registrations
                                {pendingMembers.length > 0 && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                        {pendingMembers.length} Awaiting Approval
                                    </span>
                                )}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                Review new athlete registrations. Approving an account grants facility access and sends the confirmation email.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={loadPendingMembers}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                        title="Refresh pending athletes list"
                    >
                        <i className="bi bi-arrow-clockwise"></i>
                        <span>Refresh</span>
                    </button>
                </div>

                {/* Email Sent Toast Alert Banner */}
                {approvalAlert && (
                    <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all animate-fade-in ${
                        approvalAlert.type === 'success'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : approvalAlert.type === 'warning'
                            ? 'bg-amber-50 border-amber-300 text-amber-900'
                            : 'bg-rose-50 border-rose-300 text-rose-900'
                    }`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            approvalAlert.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                            approvalAlert.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                            <i className={`text-sm ${
                                approvalAlert.type === 'success' ? 'bi bi-envelope-check-fill' :
                                approvalAlert.type === 'warning' ? 'bi bi-exclamation-triangle-fill' : 'bi bi-x-circle-fill'
                            }`}></i>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-xs font-bold block">
                                {approvalAlert.type === 'success' ? 'Approval & Email Dispatched' :
                                 approvalAlert.type === 'warning' ? 'Athlete Approved (SMTP Notice)' : 'Approval Error'}
                            </span>
                            <span className="text-xs text-slate-700 leading-snug">{approvalAlert.message}</span>
                        </div>
                    </div>
                )}

                {/* Pending Members List */}
                {pendingMembers.length === 0 ? (
                    <div className="py-8 text-center rounded-xl bg-slate-50 border border-slate-200 border-dashed">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center mx-auto mb-2 text-xl">
                            <i className="bi bi-check2-circle"></i>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">All Registrations Approved</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            No athletes are currently awaiting approval. When a new member registers, they will appear here for verification.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingMembers.map((member) => {
                            const emailKey = (member.email || '').toLowerCase().trim();
                            const loading = isApproving[emailKey];
                            return (
                                <div
                                    key={member.id || member.email}
                                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-300 transition-all flex flex-col justify-between gap-3 shadow-xs"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-black flex items-center justify-center text-sm shrink-0">
                                            {(member.name || member.full_name || 'A').charAt(0).toUpperCase()}
                                        </div>

                                        <div className="space-y-1 min-w-0 flex-grow">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                                                    {member.name || member.full_name}
                                                </h4>
                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-300 shrink-0">
                                                    PENDING
                                                </span>
                                            </div>

                                            <div className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                                                <i className="bi bi-envelope text-[11px] text-slate-400"></i>
                                                <span className="truncate">{member.email}</span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-600">
                                                <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">
                                                    {member.fitness_goal || 'Hypertrophy'}
                                                </span>
                                                <span className="text-slate-400">•</span>
                                                <span>Joined {member.created_at || member.join_date || 'Today'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                            <i className="bi bi-send text-emerald-600"></i> Sends approval email
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => handleApprove(member)}
                                            disabled={loading}
                                            className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#0D9668] text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                                            data-testid={`approve-member-${member.email}`}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                                    <span>Approving...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check-lg text-sm"></i>
                                                    <span>Approve & Send Email</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'members':
                return (
                    <div className="space-y-6">
                        {renderPendingApprovalsSection()}

                        <DataTable
                            title="Active Assigned Health Club Members"
                            columns={memberColumns}
                            data={activeMembersList}
                            theme="light"
                        />
                    </div>
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
                return <ProfileModule user={trainerInfo} onSaveUser={handleSaveUser} role="TRAINER" theme="light" />;
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
                                        Managing {activeMembersList.length + 39} Active Athletes • {pendingMembers.length} Registration(s) Awaiting Review
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        className="px-5 py-2.5 bg-[#10B981] hover:bg-[#0D9668] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                                        onClick={() => setActiveTab('members')}
                                    >
                                        <i className="bi bi-person-check-fill text-sm"></i>
                                        Review Member Approvals ({pendingMembers.length})
                                    </button>
                                    <button
                                        className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                                        onClick={() => setActiveTab('workout')}
                                    >
                                        <i className="bi bi-plus-circle-fill text-sm text-[#10B981]"></i>
                                        + Assign New Routine
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 4x KPI Stat Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <StatCard
                                title="Active Assigned Athletes"
                                value={`${activeMembersList.length + 39} Members`}
                                subtext="Verified Athletes"
                                icon="bi-people-fill"
                                trend="+4"
                                theme="light"
                            />
                            <StatCard
                                title="Pending Approvals"
                                value={`${pendingMembers.length} Athletes`}
                                subtext="Requires Clearance"
                                icon="bi-clock-history"
                                trend={pendingMembers.length > 0 ? `+${pendingMembers.length}` : '0'}
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
                                title="Trainer Rating"
                                value="4.95 / 5.0"
                                subtext="Based on 120 Reviews"
                                icon="bi-star-fill"
                                theme="light"
                            />
                        </div>

                        {/* Pending Registrations Section */}
                        {renderPendingApprovalsSection()}

                        {/* Dashboard Main Grid: Recent Table (2-col) + Live Activity & Alerts (1-col) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            <div className="lg:col-span-2">
                                <DataTable
                                    title="Recent Active Client Roster"
                                    columns={memberColumns}
                                    data={activeMembersList}
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
