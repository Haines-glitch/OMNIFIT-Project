import React from 'react';
import { WeightProgressChart, WeeklyCaloriesChart } from '../Charts/DashboardCharts';

const ProgressModule = () => {
    return (
        <div className="vstack gap-4 animate-fade-in">
            {/* Overview Stat Cards */}
            <div className="row g-3">
                <div className="col-md-3">
                    <div className="glass-card p-3 text-center">
                        <span className="text-muted small">CURRENT WEIGHT</span>
                        <h3 className="fw-bold text-white mb-0">78.5 kg</h3>
                        <span className="text-accent small"><i className="bi bi-arrow-down me-1"></i>-2.5 kg this month</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="glass-card p-3 text-center">
                        <span className="text-muted small">CURRENT BMI</span>
                        <h3 className="fw-bold text-white mb-0">23.7</h3>
                        <span className="text-info small">Optimal Health</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="glass-card p-3 text-center">
                        <span className="text-muted small">BODY FAT %</span>
                        <h3 className="fw-bold text-white mb-0">14.2%</h3>
                        <span className="text-accent small"><i className="bi bi-arrow-down me-1"></i>-1.8% drop</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="glass-card p-3 text-center">
                        <span className="text-muted small">WORKOUT HOURS</span>
                        <h3 className="fw-bold text-white mb-0">34.5 hrs</h3>
                        <span className="text-warning small">This Month</span>
                    </div>
                </div>
            </div>

            {/* Progress Charts Grid */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="glass-card p-4">
                        <h5 className="fw-bold text-white mb-3"><i className="bi bi-graph-up-arrow text-accent me-2"></i>Body Weight Progress (6 Weeks)</h5>
                        <div style={{ height: '240px' }}>
                            <WeightProgressChart />
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="glass-card p-4">
                        <h5 className="fw-bold text-white mb-3"><i className="bi bi-fire text-accent me-2"></i>Weekly Calories Burned Engine</h5>
                        <div style={{ height: '240px' }}>
                            <WeeklyCaloriesChart />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressModule;
