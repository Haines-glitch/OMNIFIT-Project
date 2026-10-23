import React, { useState } from 'react';

const NotificationModule = ({ theme = 'dark' }) => {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'Workout', title: 'Chest & Triceps Hypertrophy Scheduled', time: '10 mins ago', isRead: false, icon: 'bi-lightning-fill', accent: 'crimson', desc: 'Coach prescribed today\'s 4-exercise routine with target overload.' },
        { id: 2, type: 'Appointment', title: '1-on-1 Coaching Session Confirmed', time: '1 hour ago', isRead: false, icon: 'bi-calendar-check-fill', accent: 'green', desc: 'Session confirmed with Coach Marcus Vance for today @ 10:00 AM.' },
        { id: 3, type: 'Diet', title: 'Daily Protein Target (180g) 88% Achieved', time: '3 hours ago', isRead: true, icon: 'bi-egg-fried', accent: 'amber', desc: 'Caloric surplus and protein target synchronized with progressive overload.' },
        { id: 4, type: 'Facility', title: 'Facial Check-In Verified at Terminal 1', time: 'Yesterday', isRead: true, icon: 'bi-person-check-fill', accent: 'slate', desc: 'Contactless access granted at Iron District Main Gate.' },
    ]);

    const [statusToast, setStatusToast] = useState('');

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        setStatusToast('All notifications marked as read');
        setTimeout(() => setStatusToast(''), 3000);
    };

    const toggleRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="space-y-6 animate-fade-in font-sans text-white">
            {/* Header Banner */}
            <div className="p-6 bg-[#121217] border border-[#22222a] rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E28] shadow-[0_0_8px_#FF1E28]"></span>
                        <h3 className="text-xl font-black text-white tracking-tight">Athlete Notifications & Telemetry Feed</h3>
                    </div>
                    <p className="text-xs text-zinc-400 font-medium">Real-time alerts, coach appointment notices, and workout updates</p>
                </div>

                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#E50914]/15 text-[#FF1E28] border border-[#E50914]/40 shadow-[0_0_10px_rgba(229,9,20,0.2)]">
                            {unreadCount} Unread
                        </span>
                    )}
                    <button
                        onClick={markAllRead}
                        className="px-4 py-2 rounded-xl bg-[#181820] hover:bg-[#20202d] border border-[#2a2a38] text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                        Mark All Read
                    </button>
                </div>
            </div>

            {/* Success Toast */}
            {statusToast && (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 font-bold flex items-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <i className="bi bi-check-circle-fill text-emerald-400 text-lg"></i>
                    <span>{statusToast}</span>
                </div>
            )}

            {/* Notifications Feed */}
            <div className="space-y-3">
                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 shadow-lg ${
                            !n.isRead
                                ? 'bg-[#121217] border-[#22222a] border-l-4 border-l-[#E50914]'
                                : 'bg-[#121217]/60 border-[#1f1f28] opacity-75 hover:opacity-100 hover:bg-[#121217]'
                        }`}
                    >
                        <div className="flex items-start gap-3.5">
                            <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${
                                n.accent === 'crimson'
                                    ? 'bg-[#E50914]/15 border-[#E50914]/40 text-[#FF1E28]'
                                    : n.accent === 'green'
                                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                    : n.accent === 'amber'
                                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                                    : 'bg-[#181820] border-[#262634] text-zinc-400'
                            }`}>
                                <i className={`bi ${n.icon} text-base`}></i>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#181820] border border-[#2a2a38] text-zinc-300">
                                        {n.type}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 font-medium">{n.time}</span>
                                    {!n.isRead && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E28] shadow-[0_0_6px_#FF1E28]"></span>
                                    )}
                                </div>
                                <h5 className="text-sm font-bold text-white tracking-tight">{n.title}</h5>
                                <p className="text-xs text-zinc-400 leading-snug">{n.desc}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleRead(n.id)}
                            className="text-xs text-zinc-500 hover:text-white px-3 py-1.5 rounded-xl hover:bg-[#181820] transition-all cursor-pointer whitespace-nowrap"
                        >
                            {n.isRead ? 'Mark Unread' : 'Mark Read'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationModule;
