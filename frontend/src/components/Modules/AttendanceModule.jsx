import React, { useState } from 'react';
import DataTable from '../Tables/DataTable';
import { AttendanceDoughnutChart } from '../Charts/DashboardCharts';

const AttendanceModule = () => {
    const [facialActive, setFacialActive] = useState(true);
    const [checkInMsg, setCheckInMsg] = useState('');

    const attendanceData = [
        { date: '2026-08-05', checkIn: '08:30 AM', checkOut: '10:15 AM', status: 'Present', confidence: '99.8%' },
        { date: '2026-08-04', checkIn: '08:45 AM', checkOut: '10:30 AM', status: 'Present', confidence: '99.5%' },
        { date: '2026-08-03', checkIn: '-', checkOut: '-', status: 'Absent', confidence: 'N/A' },
        { date: '2026-08-02', checkIn: '08:30 AM', checkOut: '10:15 AM', status: 'Present', confidence: '99.9%' },
        { date: '2026-08-01', checkIn: '-', checkOut: '-', status: 'Absent', confidence: 'N/A' },
    ];

    const columns = [
        { key: 'date', label: 'Date' },
        { key: 'checkIn', label: 'Check In Time' },
        { key: 'checkOut', label: 'Check Out Time' },
        {
            key: 'status',
            label: 'Status',
            render: (val) => (
                <span className={`badge ${val === 'Present' ? 'bg-success' : 'bg-danger'}`}>
                    {val}
                </span>
            )
        },
        { key: 'confidence', label: 'Facial AI Score' },
    ];

    const triggerFacialCheckIn = () => {
        setCheckInMsg('Facial scan verified! Attendance logged at ' + new Date().toLocaleTimeString());
        setTimeout(() => setCheckInMsg(''), 5000);
    };

    return (
        <div className="vstack gap-4 animate-fade-in">
            {checkInMsg && (
                <div className="alert alert-success bg-accent text-dark fw-bold rounded-3 p-3">
                    <i className="bi bi-camera-video-fill me-2"></i>{checkInMsg}
                </div>
            )}

            {/* Facial Recognition AI Card */}
            <div className="glass-card p-4">
                <div className="row align-items-center g-4">
                    <div className="col-lg-8">
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <span className="badge bg-accent text-dark fw-bold">FACIAL RECOGNITION AI ACTIVE</span>
                            <span className="badge bg-dark border border-secondary text-info">99.8% Match Accuracy</span>
                        </div>
                        <h4 className="fw-bold text-white mb-2">Automated Contactless Gym Access</h4>
                        <p className="text-muted small mb-3">
                            Step in front of the terminal camera at the club entrance to automatically log your attendance and unlock smart lockers.
                        </p>
                        <button className="btn btn-accent" onClick={triggerFacialCheckIn}>
                            <i className="bi bi-camera-fill me-2"></i>Simulate Instant Facial Check-In
                        </button>
                    </div>

                    <div className="col-lg-4 text-center">
                        <div style={{ height: '160px' }}>
                            <AttendanceDoughnutChart percent={94.5} />
                        </div>
                        <span className="text-muted small">Overall Attendance: <strong className="text-accent">94.5%</strong></span>
                    </div>
                </div>
            </div>

            {/* Attendance History Table */}
            <DataTable
                title="Attendance Records & Access Log"
                columns={columns}
                data={attendanceData}
                onExportPDF={() => alert('Exporting Attendance PDF Report...')}
                onExportExcel={() => alert('Exporting Attendance Excel Sheet...')}
            />
        </div>
    );
};

export default AttendanceModule;
