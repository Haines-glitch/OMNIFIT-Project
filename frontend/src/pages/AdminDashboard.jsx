import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import StatCard from '../components/Cards/StatCard';
import DataTable from '../components/Tables/DataTable';
import { RevenueGrowthChart } from '../components/Charts/DashboardCharts';
import AttendanceModule from '../components/Modules/AttendanceModule';
import PaymentModule from '../components/Modules/PaymentModule';
import ReportModule from '../components/Modules/ReportModule';
import WorkoutModule from '../components/Modules/WorkoutModule';
import DietModule from '../components/Modules/DietModule';
import ProfileModule from '../components/Modules/ProfileModule';
import { getAdminDashboardData } from '../services/dashboardService';
import LoginService from '../components/Login/LoginService';
import TrainerManagementModule from '../components/Modules/TrainerManagementModule';
import { DEFAULT_AVATAR } from '../utils/defaultAvatar';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [data, setData] = useState(null);

    const [currentUser, setCurrentUser] = useState(() => LoginService.getCurrentUser());

    useEffect(() => {
        getAdminDashboardData().then(res => setData(res));
        LoginService.fetchCurrentUser().then(u => {
            if (u) setCurrentUser(u);
        });
    }, []);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const adminInfo = {
        ...currentUser,
        name: currentUser?.name || currentUser?.full_name || 'Sarah Jenkins',
        email: currentUser?.email || 'sarah.jenkins@omnifit.com',
        phone: currentUser?.phone || '+91 98765 43210',
        role: currentUser?.role || 'ADMIN',
        avatar: currentUser?.avatar || DEFAULT_AVATAR,
    };

    const handleSaveUser = (updatedUser) => {
        setCurrentUser(updatedUser);
    };

    const paymentColumns = [
        { key: 'id', label: 'Transaction ID' },
        { key: 'member', label: 'Member Name' },
        { key: 'plan', label: 'Membership Plan' },
        { key: 'amount', label: 'Amount ($)' },
        { key: 'date', label: 'Date' },
        {
            key: 'status',
            label: 'Status',
            render: (val) => (
                <span
                    className="badge rounded-pill fw-semibold px-2.5 py-1"
                    style={{
                        background: val === 'Paid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: val === 'Paid' ? '#10B981' : '#F59E0B',
                        border: `1px solid ${val === 'Paid' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                    }}
                >
                    {val}
                </span>
            )
        }
    ];

    const recentPaymentsData = data?.recentPayments || [];
    const trainersData = data?.trainers || [];

    const renderContent = () => {
        switch (activeTab) {
            case 'trainers':
                return <TrainerManagementModule theme="dark" />;
            case 'members':
                const membersData = data?.members || [];
                return (
                    <DataTable
                        title="Registered Member Accounts"
                        columns={[
                            {
                                key: 'member',
                                label: 'Account Name',
                                render: (val, row) => (
                                    <div className="d-flex align-items-center gap-2.5">
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white text-xs flex-shrink-0"
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                background: 'linear-gradient(135deg, #E50914, #800000)',
                                                border: '1px solid rgba(229, 9, 20, 0.4)'
                                            }}
                                        >
                                            {(val || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="fw-semibold text-white text-sm text-truncate">{val}</div>
                                            {row.email && <div className="text-zinc-400 text-xs text-truncate">{row.email}</div>}
                                        </div>
                                    </div>
                                )
                            },
                            { key: 'plan', label: 'Role / Plan' },
                            { key: 'amount', label: 'Subscription Fee' },
                            {
                                key: 'status',
                                label: 'Status',
                                render: (val) => (
                                    <span
                                        className="badge rounded-pill fw-semibold px-2.5 py-1"
                                        style={{
                                            background: (val === 'Active') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                            color: (val === 'Active') ? '#10B981' : '#F59E0B',
                                            border: `1px solid ${(val === 'Active') ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                                        }}
                                    >
                                        {val || 'Active'}
                                    </span>
                                )
                            },
                            { key: 'assigned_trainer', label: 'Assigned Trainer' },
                            { key: 'date', label: 'Created Date' },
                        ]}
                        data={membersData}
                        theme="dark"
                    />
                );
            case 'attendance':
                return <AttendanceModule theme="dark" />;
            case 'payments':
            case 'membership':
                return <PaymentModule theme="dark" />;
            case 'workout':
                return <WorkoutModule role="ADMIN" theme="dark" />;
            case 'diet':
                return <DietModule role="ADMIN" theme="dark" />;
            case 'reports':
                return <ReportModule theme="dark" />;
            case 'profile':
                return <ProfileModule user={adminInfo} onSaveUser={handleSaveUser} role="ADMIN" theme="dark" />;
            case 'settings':
                return (
                    <div
                        className="p-6 shadow-xl"
                        style={{
                            background: '#121217',
                            border: '1px solid #1f1f28',
                            borderRadius: '16px',
                        }}
                    >
                        <h4 className="fw-bold mb-3 text-white">
                            <i className="bi bi-sliders me-2 text-[#FF1E28]"></i>Global Ecosystem Settings
                        </h4>
                        <p className="small mb-0 text-zinc-400">Configure facial recognition AI terminals, PostgreSQL sync, and DRF API limits.</p>
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <div className="vstack gap-4">
                        {/* Header Banner */}
                        <div
                            className="p-4 p-md-5 shadow-xl position-relative overflow-hidden"
                            style={{
                                background: '#121217',
                                border: '1px solid #1f1f28',
                                borderRadius: '16px',
                            }}
                        >
                            <div className="position-absolute" style={{ right: '-50px', top: '-50px', width: '220px', height: '220px', background: 'rgba(229, 9, 20, 0.12)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }}></div>
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 position-relative z-1">
                                <div>
                                    <span className="small fw-extrabold text-uppercase tracking-wider d-inline-block px-2.5 py-1 rounded-pill mb-2" style={{ background: 'rgba(229, 9, 20, 0.15)', color: '#FF1E28', border: '1px solid rgba(229, 9, 20, 0.3)' }}>
                                        SYSTEM EXECUTIVE OVERVIEW
                                    </span>
                                    <h2 className="fw-black mb-1 text-white">OMNIFIT Master Admin Portal</h2>
                                    <p className="small mb-0 text-zinc-400">Full Control over {data?.stats?.totalMembers ?? (data?.members?.length ?? 0)} Members, {data?.stats?.totalTrainers ?? 0} Certified Trainers, & Facial Access Terminals</p>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        className="btn fw-bold px-4 py-2.5 d-flex align-items-center gap-2 cursor-pointer"
                                        onClick={() => setActiveTab('reports')}
                                        style={{
                                            background: '#E50914',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '12px',
                                            boxShadow: '0 0 15px rgba(229, 9, 20, 0.35)',
                                            transition: 'all 0.2s ease-in-out',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#FF1E28';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#E50914';
                                        }}
                                    >
                                        <i className="bi bi-file-earmark-arrow-down fs-5"></i>
                                        Generate Master PDF
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stat Cards Row */}
                        <div className="row g-3">
                            <div className="col-md-3 col-sm-6">
                                <StatCard
                                    title="Total Club Members"
                                    value={data?.stats?.totalMembers != null ? data.stats.totalMembers.toLocaleString() : "0"}
                                    subtext="Active Accounts"
                                    icon="bi-people-fill"
                                    trend="+0%"
                                    theme="dark"
                                />
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <StatCard
                                    title="Total Certified Trainers"
                                    value={data?.stats?.totalTrainers != null ? `${data.stats.totalTrainers} Trainers` : "0 Trainers"}
                                    subtext="Full-time Staff"
                                    icon="bi-person-badge-fill"
                                    theme="dark"
                                />
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <StatCard
                                    title="Monthly Revenue"
                                    value={data?.stats?.monthlyRevenue || "$0"}
                                    subtext="Financial Tracking"
                                    icon="bi-currency-dollar"
                                    trend="+0%"
                                    theme="dark"
                                />
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <StatCard
                                    title="Today's Facial Check-Ins"
                                    value={data?.stats?.todayAttendance != null ? `${data.stats.todayAttendance} Passes` : "0 Passes"}
                                    subtext="Contactless verified"
                                    icon="bi-camera-fill"
                                    theme="dark"
                                />
                            </div>
                        </div>

                        {/* Revenue Chart */}
                        <div
                            className="p-4 shadow-xl"
                            style={{
                                background: '#121217',
                                border: '1px solid #1f1f28',
                                borderRadius: '16px',
                            }}
                        >
                            <h5 className="fw-bold mb-3 text-white">
                                <i className="bi bi-graph-up me-2 text-[#FF1E28]"></i>Monthly Revenue Engine ($ USD)
                            </h5>
                            <div style={{ height: '260px' }}>
                                <RevenueGrowthChart theme="dark" />
                            </div>
                        </div>

                        {/* Certified Trainers & Active Staff Table */}
                        <DataTable
                            title="Certified Trainers & Active Staff"
                            columns={[
                                {
                                    key: 'name',
                                    label: 'Trainer / Staff Name',
                                    render: (val, row) => (
                                        <div className="d-flex align-items-center gap-2.5">
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white text-xs flex-shrink-0"
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    background: 'linear-gradient(135deg, #E50914, #800000)',
                                                    border: '1px solid rgba(229, 9, 20, 0.4)'
                                                }}
                                            >
                                                {(val || 'T').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="fw-semibold text-white text-sm text-truncate">{val}</div>
                                                {row.email && <div className="text-zinc-400 text-xs text-truncate">{row.email}</div>}
                                            </div>
                                        </div>
                                    )
                                },
                                { key: 'specialization', label: 'Specialization' },
                                { key: 'experience', label: 'Experience' },
                                {
                                    key: 'status',
                                    label: 'Status',
                                    render: (val) => (
                                        <span
                                            className="badge rounded-pill fw-semibold px-2.5 py-1"
                                            style={{
                                                background: 'rgba(16, 185, 129, 0.15)',
                                                color: '#10B981',
                                                border: '1px solid rgba(16, 185, 129, 0.25)',
                                            }}
                                        >
                                            {val || 'Active'}
                                        </span>
                                    )
                                },
                                {
                                    key: 'action',
                                    label: 'Quick Action',
                                    render: (_, row) => (
                                        <button
                                            className="btn btn-sm text-xs fw-semibold px-3 py-1 text-white cursor-pointer"
                                            style={{
                                                background: '#E50914',
                                                borderRadius: '8px',
                                                border: 'none',
                                                transition: 'all 0.2s'
                                            }}
                                            onClick={() => setActiveTab('trainers')}
                                        >
                                            <i className="bi bi-person-badge me-1"></i>Open Roster
                                        </button>
                                    )
                                }
                            ]}
                            data={trainersData}
                            theme="dark"
                        />

                        {/* Recent Payments Table */}
                        {recentPaymentsData.length > 0 && (
                            <DataTable
                                title="Recent Membership Payments & Billing Transactions"
                                columns={paymentColumns}
                                data={recentPaymentsData}
                                onExportPDF={() => alert('Exporting Master Financial PDF...')}
                                onExportExcel={() => alert('Exporting Master Financial Excel...')}
                                theme="dark"
                            />
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="min-vh-100 d-flex bg-[#08080a] text-white">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                role="ADMIN"
                theme="dark"
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
            />

            <main
                className="flex-grow-1 px-4 pb-5"
                style={{
                    marginLeft: isCollapsed ? '80px' : '260px',
                    transition: 'margin-left 0.3s ease'
                }}
            >
                <Navbar
                    title="Ecosystem Master Admin"
                    user={adminInfo}
                    theme="dark"
                    isCollapsed={isCollapsed}
                />
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;

