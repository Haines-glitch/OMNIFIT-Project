import React from 'react';
import Navbar from '../components/Navbar/Navbar';

const TrainerDashboard = () => {
    return (
        <div className="min-vh-100 bg-black text-white">
            <Navbar title="Trainer Command Hub" />

            <div className="container-fluid px-4 pb-5">

                {/* Banner */}
                <div className="glass-panel p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold text-white mb-1">
                                Trainer Portal <span className="badge bg-warning text-dark ms-2 fs-6">AI Co-Pilot Enabled</span>
                            </h2>
                            <p className="text-muted mb-0">Monitor client progress, push neural workout routines, and review diet compliance.</p>
                        </div>
                        <button className="btn btn-emerald"><i className="bi bi-plus-lg me-1"></i>Create AI Plan</button>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small">ASSIGNED CLIENTS</span>
                                <h3 className="fw-bold text-white mb-0">18 Members</h3>
                            </div>
                            <i className="bi bi-person-hearts text-white fs-2"></i>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small">TODAY'S SESSIONS</span>
                                <h3 className="fw-bold text-white mb-0">6 Active</h3>
                            </div>
                            <i className="bi bi-clock-history text-warning fs-2"></i>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small">AVG COMPLIANCE</span>
                                <h3 className="fw-bold text-info mb-0">94.2%</h3>
                            </div>
                            <i className="bi bi-patch-check-fill text-info fs-2"></i>
                        </div>
                    </div>
                </div>

                {/* Assigned Clients */}
                <div className="row g-4">
                    <div className="col-lg-7">
                        <div className="glass-panel p-4">
                            <h5 className="fw-bold mb-3"><i className="bi bi-people-fill text-white me-2"></i>Assigned Clients Roster</h5>

                            <div className="list-group list-group-flush">
                                <div className="list-group-item bg-transparent text-white border-secondary p-3 d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" className="rounded-circle" width="42" height="42" alt="Client" />
                                        <div>
                                            <h6 className="fw-bold mb-0">John Doe</h6>
                                            <span className="text-muted small">Goal: Hypertrophy & Fat Loss</span>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <span className="badge bg-white text-dark mb-1 d-block">92% Diet Adherence</span>
                                        <button className="btn btn-outline-light btn-sm">Assign Workout</button>
                                    </div>
                                </div>

                                <div className="list-group-item bg-transparent text-white border-secondary p-3 d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" className="rounded-circle" width="42" height="42" alt="Client" />
                                        <div>
                                            <h6 className="fw-bold mb-0">Emily Blunt</h6>
                                            <span className="text-muted small">Goal: Endurance & AI Cardio</span>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <span className="badge bg-info mb-1 d-block">98% Attendance</span>
                                        <button className="btn btn-outline-light btn-sm">Assign Workout</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Plan Recommendation Engine */}
                    <div className="col-lg-5">
                        <div className="glass-panel p-4">
                            <h5 className="fw-bold mb-3"><i className="bi bi-robot text-white me-2"></i>AI Diet & Workout Recommender</h5>
                            <div className="p-3 bg-dark rounded-3 mb-3 border border-secondary">
                                <div className="fw-bold text-white mb-1"><i className="bi bi-lightning-fill me-1"></i>Suggested for John Doe:</div>
                                <p className="small text-muted mb-2">Based on biometric scanning, increase protein to 180g and add High-Intensity Resistance Training (HIRT).</p>
                                <button className="btn btn-emerald btn-sm w-100">Approve & Push to Client App</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TrainerDashboard;
