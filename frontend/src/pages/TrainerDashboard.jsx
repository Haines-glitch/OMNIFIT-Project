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

    const [selectedAthleteForWorkout, setSelectedAthleteForWorkout] = useState(null);
    const [activeMembersList, setActiveMembersList] = useState([]);

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
        getTrainerDashboardData().then(res => {
            if (res) {
                setData(res);
                const assigned = res.data?.assignedMembers || res.assignedMembers;
                if (assigned && assigned.length > 0) {
                    setActiveMembersList(assigned);
                }
            }
        });
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
                    attendance: '100% (New)',
                    currentRoutine: 'No routine assigned yet'
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
        {
            key: 'name',
            label: 'MEMBER NAME',
            render: (val, row) => (
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-600/15 border border-red-500/30 text-[#FF1E28] font-black flex items-center justify-center text-xs shrink-0">
                        {(val || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <span className="font-extrabold text-white block">{val}</span>
                        <span className="text-[10px] text-zinc-400 font-normal">{row.email}</span>
                    </div>
                </div>
            )
        },
        { key: 'plan', label: 'MEMBERSHIP PLAN' },
        { key: 'goal', label: 'FITNESS GOAL' },
        {
            key: 'currentRoutine',
            label: "TODAY'S PRESCRIBED WORKOUT",
            render: (val) => (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#181822] border border-[#2a2a38] text-white">
                    <i className="bi bi-fire text-[#FF1E28]"></i>
                    {val || 'No routine assigned yet'}
                </span>
            )
        },
        { key: 'attendance', label: 'ATTENDANCE %' },
        {
            key: 'actions',
            label: 'QUICK MANAGEMENT',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <button
                        className="px-3.5 py-1.5 bg-[#E50914] hover:bg-[#FF1E28] text-white text-xs font-bold rounded-xl shadow-[0_0_10px_rgba(229,9,20,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
                        onClick={() => {
                            setSelectedAthleteForWorkout(row.email);
                            setActiveTab('workout');
                        }}
                    >
                        <i className="bi bi-journal-plus text-xs"></i>
                        Assign Routine
                    </button>
                    <button
                        className="px-3 py-1.5 bg-[#181822] hover:bg-[#20202d] border border-[#2c2c3d] text-zinc-300 hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        onClick={() => setActiveTab('diet')}
                    >
                        <i className="bi bi-cup-hot text-xs text-[#FF1E28]"></i>
                        Diet
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
            <div className="p-4 sm:p-5 bg-[#121217]/90 backdrop-blur-xl border border-[#1f1f28] rounded-2xl shadow-xl space-y-3.5" data-testid="pending-approvals-panel">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1f1f28]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center text-base">
                            <i className="bi bi-person-check-fill"></i>
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                                Pending Athlete Registrations
                                {pendingMembers.length > 0 && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                                        {pendingMembers.length} Awaiting Approval
                                    </span>
                                )}
                            </h3>
                            <p className="text-xs text-zinc-400 font-medium">
                                Review new athlete registrations. Approving an account grants facility access and sends the confirmation email.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={loadPendingMembers}
                        className="px-3 py-1.5 rounded-lg border border-[#2c2c3d] bg-[#181822] text-zinc-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                        title="Refresh pending athletes list"
                    >
                        <i className="bi bi-arrow-clockwise"></i>
                        <span>Refresh</span>
                    </button>
                </div>

                {/* Email Sent Toast Alert Banner */}
                {approvalAlert && (
                    <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 transition-all animate-fade-in ${
                        approvalAlert.type === 'success'
                            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                            : approvalAlert.type === 'warning'
                            ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                            : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    }`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            approvalAlert.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            approvalAlert.type === 'warning' ? 'bg-amber-600/20 text-amber-400' : 'bg-rose-600/20 text-rose-400'
                        }`}>
                            <i className={`text-sm ${
                                approvalAlert.type === 'success' ? 'bi bi-envelope-check-fill' :
                                approvalAlert.type === 'warning' ? 'bi bi-exclamation-triangle-fill' : 'bi bi-x-circle-fill'
                            }`}></i>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-xs font-bold block text-white">
                                {approvalAlert.type === 'success' ? 'Approval & Email Dispatched' :
                                 approvalAlert.type === 'warning' ? 'Athlete Approved (SMTP Notice)' : 'Approval Error'}
                            </span>
                            <span className="text-xs text-zinc-300 leading-snug">{approvalAlert.message}</span>
                        </div>
                    </div>
                )}

                {/* Pending Members List */}
                {pendingMembers.length === 0 ? (
                    <div className="py-6 text-center rounded-xl bg-[#16161f] border border-[#22222d] border-dashed">
                        <div className="w-10 h-10 rounded-full bg-red-600/15 border border-red-500/30 text-[#FF1E28] flex items-center justify-center mx-auto mb-2 text-lg shadow-[0_0_12px_rgba(229,9,20,0.25)]">
                            <i className="bi bi-check2-circle"></i>
                        </div>
                        <h4 className="text-sm font-bold text-white">All Registrations Approved</h4>
                        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                            No athletes are currently awaiting approval. When a new member registers, they will appear here for verification.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {pendingMembers.map((member) => {
                            const emailKey = (member.email || '').toLowerCase().trim();
                            const loading = isApproving[emailKey];
                            return (
                                <div
                                    key={member.id || member.email}
                                    className="p-3.5 rounded-xl border border-[#22222e] bg-[#16161f] hover:border-red-500/40 transition-all flex flex-col justify-between gap-2.5 shadow-md"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-500/30 text-[#FF1E28] font-black flex items-center justify-center text-xs shrink-0">
                                            {(member.name || member.full_name || 'A').charAt(0).toUpperCase()}
                                        </div>

                                        <div className="space-y-1 min-w-0 flex-grow">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">
                                                    {member.name || member.full_name}
                                                </h4>
                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
                                                    PENDING
                                                </span>
                                            </div>

                                            <div className="text-xs text-zinc-400 flex items-center gap-1.5 truncate">
                                                <i className="bi bi-envelope text-[11px] text-zinc-500"></i>
                                                <span className="truncate">{member.email}</span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-zinc-400">
                                                <span className="px-2 py-0.5 rounded-md bg-[#1f1f2a] font-semibold text-zinc-300">
                                                    {member.fitness_goal || 'Hypertrophy'}
                                                </span>
                                                <span className="text-zinc-600">•</span>
                                                <span>Joined {member.created_at || member.join_date || 'Today'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="pt-2 border-t border-[#22222e] flex items-center justify-between gap-3">
                                        <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                                            <i className="bi bi-send text-[#FF1E28]"></i> Sends approval email
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => handleApprove(member)}
                                            disabled={loading}
                                            className="px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#FF1E28] text-white text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,9,20,0.35)] transition-all cursor-pointer"
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
                            theme="dark"
                        />
                    </div>
                );
            case 'workout':
                return <WorkoutModule role="TRAINER" theme="dark" initialMemberEmail={selectedAthleteForWorkout} />;
            case 'diet':
                return <DietModule role="TRAINER" theme="dark" />;
            case 'appointments':
                return <AppointmentModule role="TRAINER" theme="dark" />;
            case 'attendance':
                return <AttendanceModule theme="dark" />;
            case 'notifications':
                return (
                    <NotificationCenter
                        variant="panel"
                        onNavigateTab={setActiveTab}
                        theme="dark"
                    />
                );
            case 'reports':
                return <ReportModule theme="dark" />;
            case 'profile':
                return <ProfileModule user={trainerInfo} onSaveUser={handleSaveUser} role="TRAINER" theme="dark" />;
            case 'settings':
                return <TrainerSettingsModule theme="dark" />;
            case 'dashboard':
            default:
                return (
                    <div className="space-y-5">
                        {/* Command Center Hero */}
                        <div className="relative overflow-hidden p-4 sm:p-5 bg-[#121217]/90 backdrop-blur-xl border border-[#1f1f28] rounded-2xl shadow-xl transition-all">
                            {/* Ambient background glow effect */}
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 relative z-10">
                                <div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600/15 text-[#FF1E28] border border-red-500/30 tracking-wider uppercase mb-2 shadow-[0_0_10px_rgba(229,9,20,0.2)]">
                                        <i className="bi bi-patch-check-fill text-xs"></i>
                                        NASM MASTER CERTIFIED
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
                                        Trainer Command Center
                                    </h2>
                                    <p className="text-xs text-zinc-400 font-medium">
                                        Managing {activeMembersList.length + 39} Active Athletes • {pendingMembers.length} Registration(s) Awaiting Review
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    <button
                                        className="px-4 py-2 bg-[#E50914] hover:bg-[#FF1E28] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(229,9,20,0.35)] transition-all cursor-pointer"
                                        onClick={() => setActiveTab('members')}
                                    >
                                        <i className="bi bi-person-check-fill text-sm"></i>
                                        Review Member Approvals ({pendingMembers.length})
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-[#181822] hover:bg-[#20202d] border border-[#2c2c3d] text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                                        onClick={() => setActiveTab('workout')}
                                    >
                                        <i className="bi bi-plus-circle-fill text-sm text-[#FF1E28]"></i>
                                        + Assign New Routine
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 4x KPI Stat Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                            <StatCard
                                title="Active Assigned Athletes"
                                value={`${activeMembersList.length + 39} Members`}
                                subtext="Verified Athletes"
                                icon="bi-people-fill"
                                trend="+4"
                                theme="dark"
                            />
                            <StatCard
                                title="Pending Approvals"
                                value={`${pendingMembers.length} Athletes`}
                                subtext="Requires Clearance"
                                icon="bi-clock-history"
                                trend={pendingMembers.length > 0 ? `+${pendingMembers.length}` : '0'}
                                theme="dark"
                            />
                            <StatCard
                                title="Today's Sessions"
                                value="6 Sessions"
                                subtext="1 Completed"
                                icon="bi-calendar-event-fill"
                                theme="dark"
                            />
                            <StatCard
                                title="Trainer Rating"
                                value="4.95 / 5.0"
                                subtext="Based on 120 Reviews"
                                icon="bi-star-fill"
                                theme="dark"
                            />
                        </div>

                        {/* Pending Registrations Section */}
                        {renderPendingApprovalsSection()}

                        {/* Dashboard Main Grid: Recent Table (2-col) + Live Activity & Alerts (1-col) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                            <div className="lg:col-span-2">
                                <DataTable
                                    title="Recent Active Client Roster"
                                    columns={memberColumns}
                                    data={activeMembersList}
                                    theme="dark"
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <NotificationCenter
                                    variant="panel"
                                    onNavigateTab={setActiveTab}
                                    theme="dark"
                                />
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#08080a] text-white flex font-sans antialiased">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                role="TRAINER"
                theme="dark"
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
                    theme="dark"
                    isCollapsed={isCollapsed}
                    onNavigateTab={setActiveTab}
                />
                {renderContent()}
            </main>
        </div>
    );
};

export default TrainerDashboard;
