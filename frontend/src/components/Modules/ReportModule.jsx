import React, { useState } from 'react';

const ReportModule = () => {
    const [downloadMsg, setDownloadMsg] = useState('');

    const reportTypes = [
        { name: 'Attendance Report', desc: 'Detailed facial check-in logs, total sessions, absent records.', icon: 'bi-calendar-check-fill' },
        { name: 'Workout Performance Report', desc: 'Sets, reps, total weight lifted, cardio metrics, and PRs.', icon: 'bi-lightning-charge-fill' },
        { name: 'Diet & Macro Nutrition Report', desc: 'Caloric intake breakdown, protein goals, water tracking.', icon: 'bi-egg-fried' },
        { name: 'Payment & Invoice Statement', desc: 'Subscription receipts, transactions, payment status.', icon: 'bi-receipt-cutoff' },
        { name: 'Body Biometrics & Progress Report', desc: 'Weight trend, BMI, body fat %, muscle mass gains.', icon: 'bi-graph-up-arrow' },
        { name: 'Membership Certificate', desc: 'Official active membership badge & digital identity pass.', icon: 'bi-shield-check' },
    ];

    const handleDownload = (name, format) => {
        setDownloadMsg(`Generating & Downloading ${name} (${format.toUpperCase()})...`);
        setTimeout(() => setDownloadMsg(''), 4000);
    };

    return (
        <div className="vstack gap-4 animate-fade-in">
            {downloadMsg && (
                <div className="alert alert-success bg-accent text-dark fw-bold rounded-3 p-3">
                    <i className="bi bi-download me-2"></i>{downloadMsg}
                </div>
            )}

            <div className="glass-card p-4">
                <h4 className="fw-bold text-white mb-1"><i className="bi bi-file-earmark-pdf-fill text-accent me-2"></i>Report & Analytics Export Center</h4>
                <p className="text-muted small mb-4">Export official MCA project performance reports in PDF or Excel formats</p>

                <div className="row g-4">
                    {reportTypes.map((rep, idx) => (
                        <div key={idx} className="col-md-6">
                            <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <div className="p-2 bg-dark rounded border border-secondary text-accent">
                                            <i className={`bi ${rep.icon} fs-4`}></i>
                                        </div>
                                        <h5 className="fw-bold text-white mb-0">{rep.name}</h5>
                                    </div>
                                    <p className="text-muted small mb-3">{rep.desc}</p>
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-danger btn-sm w-50" onClick={() => handleDownload(rep.name, 'pdf')}>
                                        <i className="bi bi-file-earmark-pdf me-1"></i>Export PDF
                                    </button>
                                    <button className="btn btn-outline-success btn-sm w-50" onClick={() => handleDownload(rep.name, 'excel')}>
                                        <i className="bi bi-file-earmark-excel me-1"></i>Export Excel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportModule;
