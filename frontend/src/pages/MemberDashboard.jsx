import React from 'react';
import Navbar from '../components/Navbar/Navbar';

const MemberDashboard = () => {
    return (
        <div className="min-vh-100 bg-black text-white">
            <Navbar title="My Member Hub" />

            <div className="container-fluid px-4 pb-5">

                {/* Hero Welcome Banner */}
                <div className="glass-panel p-4 mb-4 position-relative overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <span className="badge bg-white text-dark fw-bold mb-2">PLATINUM VIP MEMBER</span>
                            <h2 className="fw-bold text-white mb-1">Welcome back, Athlete!</h2>
                            <p className="text-muted mb-0">Your AI Trainer generated today's optimized workout plan.</p>
                        </div>
                        <div className="text-end d-none d-md-block">
                            <div className="fw-bold text-white fs-4"><i className="bi bi-fire me-1 text-warning"></i> 14 Day Streak</div>
                            <span className="text-muted small">840 Active Calories Burned</span>
                        </div>
                    </div>
                </div>

                {/* Biometrics Summary Row */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <div className="glass-panel p-3 text-center">
                            <span className="text-muted small">TARGET CALORIES</span>
                            <h3 className="fw-bold text-white mb-0">2,450 kcal</h3>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>1,820 consumed today</span>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="glass-panel p-3 text-center">
                            <span className="text-muted small">BMI SCORE</span>
                            <h3 className="fw-bold text-white mb-0">22.4</h3>
                            <span className="text-light" style={{ fontSize: '0.75rem' }}>Normal Range</span>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="glass-panel p-3 text-center">
                            <span className="text-muted small">FACIAL CHECK-IN</span>
                            <h3 className="fw-bold text-info mb-0">ACTIVE</h3>
                            <span className="text-info" style={{ fontSize: '0.75rem' }}>Verified at 08:30 AM</span>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="glass-panel p-3 text-center">
                            <span className="text-muted small">MEMBERSHIP EXPIRY</span>
                            <h3 className="fw-bold text-warning mb-0">120 Days</h3>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Auto-Renew Enabled</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="row g-4">

                    {/* AI Recommended Daily Workout Routine */}
                    <div className="col-lg-7">
                        <div className="glass-panel p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">
                                    <i className="bi bi-cpu-fill text-white me-2"></i>Today's AI Recommended Workout
                                </h5>
                                <span className="badge bg-dark text-white border border-light">Hypertrophy Phase 2</span>
                            </div>

                            <div className="vstack gap-3">
                                <div className="p-3 bg-dark rounded-3 d-flex justify-content-between align-items-center border border-secondary">
                                    <div>
                                        <h6 className="fw-bold mb-1 text-white">1. Barbell Incline Bench Press</h6>
                                        <span className="text-muted small">4 Sets x 10 Reps • 75kg Target</span>
                                    </div>
                                    <span className="badge bg-white text-dark">Completed</span>
                                </div>

                                <div className="p-3 bg-dark rounded-3 d-flex justify-content-between align-items-center border border-secondary">
                                    <div>
                                        <h6 className="fw-bold mb-1 text-white">2. Dumbbell Flyes with Cable Crossover</h6>
                                        <span className="text-muted small">3 Sets x 12 Reps • 18kg Target</span>
                                    </div>
                                    <button className="btn btn-emerald btn-sm">Start Set</button>
                                </div>

                                <div className="p-3 bg-dark rounded-3 d-flex justify-content-between align-items-center border border-secondary">
                                    <div>
                                        <h6 className="fw-bold mb-1 text-white">3. High-Intensity Interval Cardio (AI Tracked)</h6>
                                        <span className="text-muted small">15 Mins • 140 BPM Heart Rate Target</span>
                                    </div>
                                    <button className="btn btn-outline-light btn-sm">Queue Workout</button>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Personalized Diet & Macros */}
                    <div className="col-lg-5">
                        <div className="glass-panel p-4 mb-4">
                            <h5 className="fw-bold mb-3"><i className="bi bi-egg-fried text-white me-2"></i>Personalized AI Diet Plan</h5>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between small mb-1">
                                    <span>Protein Intake (160g / 180g)</span>
                                    <span className="text-white">88%</span>
                                </div>
                                <div className="progress bg-dark" style={{ height: '8px' }}>
                                    <div className="progress-bar bg-white" style={{ width: '88%' }}></div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between small mb-1">
                                    <span>Carbohydrates (210g / 250g)</span>
                                    <span className="text-info">84%</span>
                                </div>
                                <div className="progress bg-dark" style={{ height: '8px' }}>
                                    <div className="progress-bar bg-info" style={{ width: '84%' }}></div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between small mb-1">
                                    <span>Healthy Fats (55g / 65g)</span>
                                    <span className="text-warning">85%</span>
                                </div>
                                <div className="progress bg-dark" style={{ height: '8px' }}>
                                    <div className="progress-bar bg-warning" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-4">
                            <h5 className="fw-bold mb-2"><i className="bi bi-credit-card-fill text-white me-2"></i>Membership & Digital ID</h5>
                            <p className="text-muted small">Digital NFC & Facial Pass is enabled for all health club facilities.</p>
                            <button className="btn btn-outline-light w-100 btn-sm text-white border-white">View Digital Membership Pass</button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default MemberDashboard;
