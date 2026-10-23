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

    const recentPaymentsData = data?.recentPayments || [
        { id: 'TXN-9841', member: 'Alex Mercer', amount: '$199.00', plan: 'Platinum VIP', status: 'Paid', date: '2026-08-05' },
        { id: 'TXN-9842', member: 'Sarah Jenkins', amount: '$129.00', plan: 'Gold Fitness', status: 'Paid', date: '2026-08-05' },
        { id: 'TXN-9843', member: 'Michael Scott', amount: '$89.00', plan: 'Silver Basic', status: 'Pending', date: '2026-08-04' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'trainers':
                return <TrainerManagementModule theme="dark" />;
            case 'members':
                return (
                    <DataTable
                        title="Registered Member Accounts"
                        columns={[
                            { key: 'member', label: 'Account Name' },
                            { key: 'plan', label: 'Role / Plan' },
                            { key: 'amount', label: 'Subscription Fee' },
                            { key: 'date', label: 'Created Date' },
                        ]}
                        data={recentPaymentsData}
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
                                    <p className="small mb-0 text-zinc-400">Full Control over 1,248 Members, 34 Certified Trainers, & Facial Access Terminals</p>
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
                                <StatCard title="Total Club Members" value="1,248" subtext="Active Accounts" icon="bi-people-fill" trend="+14%" theme="dark" />
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <StatCard title="Total Certified Trainers" value="34 Trainers" subtext="Full-time Staff" icon="bi-person-badge-fill" theme="dark" />
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <StatCard title="Monthly Revenue" value="$48,920" subtext="+18% vs Last Month" icon="bi-currency-dollar" trend="+18%" theme="dark" />
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <StatCard title="Today's Facial Check-Ins" value="342 Passes" subtext="Contactless verified" icon="bi-camera-fill" theme="dark" />
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

                        {/* Recent Payments Table */}
                        <DataTable
                            title="Recent Membership Payments & Billing Transactions"
                            columns={paymentColumns}
                            data={recentPaymentsData}
                            onExportPDF={() => alert('Exporting Master Financial PDF...')}
                            onExportExcel={() => alert('Exporting Master Financial Excel...')}
                            theme="dark"
                        />
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

