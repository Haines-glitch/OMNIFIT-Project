import React, { useState } from 'react';

const NotificationModule = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'Workout', title: 'Chest & Triceps Hypertrophy Scheduled', time: '10 mins ago', isRead: false, icon: 'bi-lightning-fill', color: 'text-accent' },
        { id: 2, type: 'Appointment', title: 'Trainer Marcus approved your 1-on-1 Session', time: '1 hour ago', isRead: false, icon: 'bi-calendar-check-fill', color: 'text-info' },
        { id: 3, type: 'Diet', title: 'Daily Protein Goal (180g) 88% Achieved', time: '3 hours ago', isRead: true, icon: 'bi-egg-fried', color: 'text-warning' },
        { id: 4, type: 'Announcement', title: 'New AI Sauna Recovery Pods installed in Club', time: '1 day ago', isRead: true, icon: 'bi-megaphone-fill', color: 'text-primary' },
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    return (
        <div className="vstack gap-4 animate-fade-in">
            <div className="glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="fw-bold text-white mb-1"><i className="bi bi-bell-fill text-accent me-2"></i>Notifications & AI Reminders</h4>
                        <p className="text-muted small mb-0">Stay updated on your workouts, diet, and appointments</p>
                    </div>
                    <button className="btn btn-outline-light btn-sm" onClick={markAllRead}>Mark All as Read</button>
                </div>

                <div className="vstack gap-3">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`p-3 rounded-3 border d-flex justify-content-between align-items-center ${n.isRead ? 'bg-dark border-secondary opacity-75' : 'glass-card border-accent'
                                }`}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div className={`p-2.5 bg-dark rounded-circle border border-secondary ${n.color}`}>
                                    <i className={`bi ${n.icon} fs-5`}></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold text-white mb-0">{n.title}</h6>
                                    <span className="text-muted small">{n.type} • {n.time}</span>
                                </div>
                            </div>

                            {!n.isRead && <span className="badge bg-accent text-dark fw-bold">NEW</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationModule;
