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

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        getAdminDashboardData().then(res => setData(res));
    }, []);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const currentUser = LoginService.getCurrentUser();

    const adminInfo = {
        name: currentUser?.name || 'Sarah Jenkins',
        role: currentUser?.role || 'ADMIN',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
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
            case 'members':
            case 'trainers':
                return (
                    <DataTable
                        title="Registered Club Accounts"
                        columns={[
                            { key: 'member', label: 'Account Name' },
                            { key: 'plan', label: 'Role / Plan' },
                            { key: 'amount', label: 'Subscription Fee' },
                            { key: 'date', label: 'Created Date' },
                        ]}
                        data={recentPaymentsData}
                    />
                );
            case 'attendance':
                return <AttendanceModule />;
            case 'payments':
            case 'membership':
                return <PaymentModule />;
            case 'workout':
                return <WorkoutModule role="ADMIN" />;
            case 'diet':
                return <DietModule role="ADMIN" />;
            case 'reports':
                return <ReportModule />;
            case 'settings':
                return (
                    <div
                        className="p-4"
                        style={{
                            background: '#1E293B',
                            border: '1px solid #334155',
                            borderRadius: '16px',
                        }}
                    >
                        <h4 className="fw-bold mb-3" style={{ color: '#F8FAFC' }}>
                            <i className="bi bi-sliders me-2" style={{ color: '#10B981' }}></i>Global Ecosystem Settings
                        </h4>
                        <p className="small mb-0" style={{ color: '#94A3B8' }}>Configure facial recognition AI terminals, PostgreSQL sync, and DRF API limits.</p>
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <div className="vstack gap-4">
                        {/* Header Banner */}
                        <div
                            className="p-4"
                            style={{
                                background: '#1E293B',
                                border: '1px solid #334155',
                                borderRadius: '16px',
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="small fw-semibold text-uppercase tracking-wider d-block mb-1" style={{ color: '#94A3B8' }}>
                                        SYSTEM EXECUTIVE OVERVIEW
                                    </span>
                                    <h2 className="fw-bold mb-1" style={{ color: '#F8FAFC' }}>OMNIFIT Master Admin Portal</h2>
                                    <p className="small mb-0" style={{ color: '#94A3B8' }}>Full Control over 1,248 Members, 34 Certified Trainers, & Facial Access Terminals</p>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        className="btn fw-bold px-4 py-2 d-flex align-items-center gap-2"
                                        onClick={() => setActiveTab('reports')}
                                        style={{
                                            background: '#10B981',
                                            color: '#0F172A',
                                            border: 'none',
                                            borderRadius: '10px',
                                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                                            transition: 'all 0.2s ease-in-out',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#059669';
                                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(16, 185, 129, 0.35)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#10B981';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.25)';
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
                                <StatCard title="Total Club Members" value="1,248" subtext="Active Accounts" icon="bi-people-fill" trend="+14%" />
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <StatCard title="Total Certified Trainers" value="34 Trainers" subtext="Full-time Staff" icon="bi-person-badge-fill" />
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <StatCard title="Monthly Revenue" value="$48,920" subtext="+18% vs Last Month" icon="bi-currency-dollar" trend="+18%" />
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <StatCard title="Today's Facial Check-Ins" value="342 Passes" subtext="Contactless verified" icon="bi-camera-fill" />
                            </div>
                        </div>

                        {/* Revenue Chart */}
                        <div
                            className="p-4"
                            style={{
                                background: '#1E293B',
                                border: '1px solid #334155',
                                borderRadius: '16px',
                            }}
                        >
                            <h5 className="fw-bold mb-3" style={{ color: '#F8FAFC' }}>
                                <i className="bi bi-graph-up me-2" style={{ color: '#10B981' }}></i>Monthly Revenue Engine ($ USD)
                            </h5>
                            <div style={{ height: '260px' }}>
                                <RevenueGrowthChart />
                            </div>
                        </div>

                        {/* Recent Payments Table */}
                        <DataTable
                            title="Recent Membership Payments & Billing Transactions"
                            columns={paymentColumns}
                            data={recentPaymentsData}
                            onExportPDF={() => alert('Exporting Master Financial PDF...')}
                            onExportExcel={() => alert('Exporting Master Financial Excel...')}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="min-vh-100 d-flex" style={{ background: '#0F172A', color: '#F8FAFC' }}>
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                role="ADMIN"
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
                    isCollapsed={isCollapsed}
                />
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;

