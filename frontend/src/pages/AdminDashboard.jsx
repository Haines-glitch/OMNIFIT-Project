import React from 'react';
import Navbar from '../components/Navbar/Navbar';

const AdminDashboard = () => {
    return (
        <div className="min-vh-100 bg-black text-white">
            <Navbar title="Ecosystem Control Panel" />

            <div className="container-fluid px-4 pb-5">

                {/* Banner */}
                <div className="glass-panel p-4 mb-4 position-relative overflow-hidden">
                    <div className="position-relative z-2">
                        <h2 className="fw-bold text-white mb-1">
                            Admin Digital Command Center <span className="badge bg-white text-dark ms-2 fs-6">Live AI Engine</span>
                        </h2>
                        <p className="text-muted mb-0">
                            Manage member memberships, automated facial recognition hardware, trainer rosters, and financial ecosystem.
                        </p>
                    </div>
                </div>

                {/* Metric Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block">TOTAL MEMBERS</span>
                                <h3 className="fw-bold text-white mb-0">1,482</h3>
                                <span className="text-light small"><i className="bi bi-arrow-up me-1"></i>+12% this month</span>
                            </div>
                            <div className="p-3 bg-dark rounded-3 text-white fs-3">
                                <i className="bi bi-people-fill"></i>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block">ACTIVE TRAINERS</span>
                                <h3 className="fw-bold text-white mb-0">34</h3>
                                <span className="text-muted small">100% Certified</span>
                            </div>
                            <div className="p-3 bg-dark rounded-3 text-warning fs-3">
                                <i className="bi bi-lightning-charge-fill"></i>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block">MONTHLY REVENUE</span>
                                <h3 className="fw-bold text-white mb-0">$48,250</h3>
                                <span className="text-light small"><i className="bi bi-arrow-up me-1"></i>+18.4%</span>
                            </div>
                            <div className="p-3 bg-dark rounded-3 text-white fs-3">
                                <i className="bi bi-currency-dollar"></i>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block">AI FACIAL SCANS</span>
                                <h3 className="fw-bold text-info mb-0">9,840</h3>
                                <span className="text-info small">0.02s avg check-in</span>
                            </div>
                            <div className="p-3 bg-dark rounded-3 text-info fs-3">
                                <i className="bi bi-person-bounding-box"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="row g-4">

                    {/* Member Management Table */}
                    <div className="col-lg-8">
                        <div className="glass-panel p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0"><i className="bi bi-person-lines-fill text-white me-2"></i>Recent Members Ecosystem</h5>
                                <button className="btn btn-emerald btn-sm">+ Add New Member</button>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                                    <thead>
                                        <tr className="text-muted border-secondary">
                                            <th>Member Name</th>
                                            <th>Plan Type</th>
                                            <th>Assigned Trainer</th>
                                            <th>AI Scan Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="bg-white rounded-circle text-dark fw-bold px-2 py-1 small">JD</div>
                                                    <div>
                                                        <div className="fw-semibold">John Doe</div>
                                                        <div className="text-muted small">john.doe@example.com</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className="badge bg-white text-dark">VIP Platinum</span></td>
                                            <td>Alex Mercer</td>
                                            <td><span className="text-light"><i className="bi bi-check-circle-fill me-1"></i>Verified</span></td>
                                            <td>
                                                <button className="btn btn-outline-light btn-sm me-1"><i className="bi bi-pencil"></i></button>
                                                <button className="btn btn-outline-danger btn-sm"><i className="bi bi-trash"></i></button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="bg-secondary rounded-circle text-white fw-bold px-2 py-1 small">SK</div>
                                                    <div>
                                                        <div className="fw-semibold">Sarah Connor</div>
                                                        <div className="text-muted small">sarah@example.com</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className="badge bg-secondary">Gold Annual</span></td>
                                            <td>Elena Rostova</td>
                                            <td><span className="text-light"><i className="bi bi-check-circle-fill me-1"></i>Verified</span></td>
                                            <td>
                                                <button className="btn btn-outline-light btn-sm me-1"><i className="bi bi-pencil"></i></button>
                                                <button className="btn btn-outline-danger btn-sm"><i className="bi bi-trash"></i></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* AI Hardware & Engine Status */}
                    <div className="col-lg-4">
                        <div className="glass-panel p-4 mb-4">
                            <h5 className="fw-bold mb-3"><i className="bi bi-cpu-fill text-white me-2"></i>AI Engine Diagnostics</h5>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between small mb-1">
                                    <span>Facial Recognition Latency</span>
                                    <span className="text-white">12ms</span>
                                </div>
                                <div className="progress bg-dark" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-white" style={{ width: '92%' }}></div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between small mb-1">
                                    <span>Workout Neural Model Sync</span>
                                    <span className="text-info">Optimal</span>
                                </div>
                                <div className="progress bg-dark" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-info" style={{ width: '98%' }}></div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between small mb-1">
                                    <span>PostgreSQL Database Pool</span>
                                    <span className="text-warning">32 / 100 Connections</span>
                                </div>
                                <div className="progress bg-dark" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-warning" style={{ width: '32%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-4">
                            <h5 className="fw-bold mb-3"><i className="bi bi-shield-check text-white me-2"></i>Recent System Logs</h5>
                            <ul className="list-unstyled mb-0 small">
                                <li className="mb-2 text-muted"><span className="text-white">[11:25 AM]</span> Member #1482 logged in via SimpleJWT</li>
                                <li className="mb-2 text-muted"><span className="text-info">[11:10 AM]</span> Facial recognition scan completed at Gate A</li>
                                <li className="mb-2 text-muted"><span className="text-warning">[10:45 AM]</span> Payment processed for Gold Membership</li>
                            </ul>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
