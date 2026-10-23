import React, { useState } from 'react';

const defaultNotifications = [
    {
        id: 1,
        category: 'AI Alerts',
        tag: 'AI Alert',
        title: 'Trajectory Deviation Detected',
        message: 'Michael Scott missed 4 consecutive sessions. Churn risk elevated to High.',
        timestamp: '12m ago',
        isRead: false,
        icon: 'bi-cpu-fill',
        accent: 'amber',
        actionType: 'review',
        actionLabel: 'Review Profile'
    },
    {
        id: 2,
        category: 'Appointments',
        tag: 'Appointment',
        title: 'New 1-on-1 Session Requested',
        message: 'Sarah Jenkins requested "Strength & Conditioning" for Tomorrow at 10:00 AM.',
        timestamp: '45m ago',
        isRead: false,
        icon: 'bi-calendar-event-fill',
        accent: 'mint',
        actionType: 'appointment',
        actionAcceptLabel: 'Accept',
        actionDeclineLabel: 'Decline'
    },
    {
        id: 3,
        category: 'Member Updates',
        tag: 'Milestone',
        title: 'Workout Routine Completed',
        message: 'John Doe achieved a new progressive overload record on "Hypertrophy Push Day".',
        timestamp: '2h ago',
        isRead: false,
        icon: 'bi-trophy-fill',
        accent: 'crimson',
    },
    {
        id: 4,
        category: 'Member Updates',
        tag: 'Attendance',
        title: 'Face Scan Check-In Verified',
        message: 'Sarah Jenkins checked in at Entryway Terminal 1.',
        timestamp: '5h ago',
        isRead: true,
        icon: 'bi-person-bounding-box',
        accent: 'slate',
    }
];

const NotificationCenter = ({
    variant = 'panel', // 'panel' | 'dropdown'
    onClose,
    onNavigateTab,
    theme = 'dark'
}) => {
    const [notifications, setNotifications] = useState(defaultNotifications);
    const [activeFilter, setActiveFilter] = useState('All');
    const [statusMessage, setStatusMessage] = useState(null);

    const filters = ['All', 'AI Alerts', 'Appointments', 'Member Updates'];
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filteredNotifications = notifications.filter(n => {
        if (activeFilter === 'All') return true;
        return n.category === activeFilter;
    });

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        showToast('All notifications marked as read');
    };

    const handleToggleRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, isRead: !n.isRead } : n
        ));
    };

    const handleAction = (id, type, label) => {
        setNotifications(notifications.map(n => {
            if (n.id === id) {
                return {
                    ...n,
                    isRead: true,
                    statusText: label === 'Accept' ? 'Accepted' : label === 'Decline' ? 'Declined' : 'Reviewed'
                };
            }
            return n;
        }));

        if (label === 'Review Profile' && onNavigateTab) {
            onNavigateTab('profile');
        }

        showToast(`${label} action processed successfully`);
    };

    const showToast = (msg) => {
        setStatusMessage(msg);
        setTimeout(() => setStatusMessage(null), 3500);
    };

    const getIconStyles = (accent) => {
        switch (accent) {
            case 'amber':
                return 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]';
            case 'mint':
                return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]';
            case 'crimson':
                return 'bg-[#E50914]/15 border-[#E50914]/40 text-[#FF1E28] shadow-[0_0_12px_rgba(229,9,20,0.25)]';
            case 'slate':
            default:
                return 'bg-[#181820] border-[#262634] text-zinc-400';
        }
    };

    const getTagStyles = (accent) => {
        switch (accent) {
            case 'amber':
                return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
            case 'mint':
                return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
            case 'crimson':
                return 'bg-[#E50914]/15 border-[#E50914]/30 text-[#FF1E28]';
            case 'slate':
            default:
                return 'bg-[#181820] border-[#262634] text-zinc-400';
        }
    };

    const isDropdown = variant === 'dropdown';

    return (
        <div className={`
            bg-[#121217] border border-[#22222a] rounded-3xl shadow-2xl transition-all duration-300 font-sans text-white
            ${isDropdown ? 'w-80 sm:w-96 max-h-[85vh] flex flex-col p-4 shadow-black/80' : 'w-full p-6'}
        `}>
            {/* Header Area */}
            <div className={`${isDropdown ? 'pb-3 border-b border-[#1f1f28]' : 'mb-6 pb-4 border-b border-[#1f1f28]'}`}>
                <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E28] shadow-[0_0_10px_#FF1E28]"></span>
                        <h5 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                            {isDropdown ? 'Notifications' : 'Trainer Activity & Notifications'}
                        </h5>
                        {unreadCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E50914]/15 text-[#FF1E28] border border-[#E50914]/40 shadow-[0_0_10px_rgba(229,9,20,0.25)]">
                                {unreadCount} New
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-[11px] font-bold text-zinc-400 hover:text-[#FF1E28] transition-colors cursor-pointer"
                            >
                                Mark all read
                            </button>
                        )}
                        {isDropdown && onClose && (
                            <button
                                onClick={onClose}
                                className="text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-[#181820] transition-all cursor-pointer"
                            >
                                <i className="bi bi-x-lg text-xs"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Pill Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                activeFilter === filter
                                    ? 'bg-gradient-to-r from-[#E50914] to-[#B80710] text-white shadow-[0_0_12px_rgba(229,9,20,0.35)]'
                                    : 'bg-[#181820] text-zinc-400 hover:text-white border border-[#262634]'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Status Toast Message (Green Theme for Success!) */}
            {statusMessage && (
                <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fade-in shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                    <i className="bi bi-check-circle-fill text-emerald-400"></i>
                    <span>{statusMessage}</span>
                </div>
            )}

            {/* Notification Feed Items */}
            <div className={`space-y-3 overflow-y-auto pr-1 ${isDropdown ? 'max-h-[380px]' : ''}`}>
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((item) => (
                        <div
                            key={item.id}
                            className={`
                                relative p-4 rounded-2xl border transition-all duration-200 group
                                ${!item.isRead
                                    ? 'bg-[#181820] border-[#2e2e40] border-l-4 border-l-[#E50914] shadow-lg'
                                    : 'bg-[#14141a]/60 border-[#1f1f28] opacity-75 hover:opacity-100 hover:bg-[#181820]'}
                            `}
                        >
                            <div className="flex items-start gap-3.5">
                                {/* Icon container */}
                                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${getIconStyles(item.accent)}`}>
                                    <i className={`bi ${item.icon} text-sm`}></i>
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${getTagStyles(item.accent)}`}>
                                                {item.tag}
                                            </span>
                                            {!item.isRead && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E28] shadow-[0_0_6px_#FF1E28]"></span>
                                            )}
                                        </div>
                                        <span className="text-[11px] font-medium text-zinc-500">{item.timestamp}</span>
                                    </div>

                                    <h6
                                        className="text-xs font-bold text-white leading-snug mb-1 cursor-pointer hover:text-[#FF1E28] transition-colors"
                                        onClick={() => handleToggleRead(item.id)}
                                    >
                                        {item.title}
                                    </h6>

                                    <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                                        {item.message}
                                    </p>

                                    {/* Action Status if processed */}
                                    {item.statusText && (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-500/40">
                                            <i className="bi bi-check2 text-emerald-400"></i>
                                            <span>Status: {item.statusText}</span>
                                        </div>
                                    )}

                                    {/* Quick Actions if unprocessed */}
                                    {!item.statusText && (
                                        <div className="flex items-center gap-2 pt-1">
                                            {item.actionType === 'review' && (
                                                <button
                                                    onClick={() => handleAction(item.id, 'review', item.actionLabel)}
                                                    className="px-3 py-1.5 bg-[#181820] hover:bg-[#20202d] text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    <i className="bi bi-box-arrow-up-right text-[10px]"></i>
                                                    <span>{item.actionLabel}</span>
                                                </button>
                                            )}

                                            {item.actionType === 'appointment' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(item.id, 'appointment', item.actionAcceptLabel)}
                                                        className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs rounded-xl shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
                                                    >
                                                        <i className="bi bi-check-lg"></i>
                                                        <span>{item.actionAcceptLabel}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(item.id, 'appointment', item.actionDeclineLabel)}
                                                        className="px-3.5 py-1.5 bg-[#181820] hover:bg-rose-950/40 text-zinc-400 hover:text-rose-300 border border-[#262634] hover:border-rose-500/40 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <i className="bi bi-x-lg text-[10px]"></i>
                                                        <span>{item.actionDeclineLabel}</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-10 text-center text-zinc-500 text-xs">
                        <i className="bi bi-bell-slash text-2xl block mb-2 opacity-50"></i>
                        No notifications found in this category.
                    </div>
                )}
            </div>

            {/* Dropdown Footer Link */}
            {isDropdown && (
                <div className="mt-3 pt-3 border-t border-[#1f1f28] text-center">
                    <button
                        onClick={() => {
                            if (onNavigateTab) onNavigateTab('notifications');
                            if (onClose) onClose();
                        }}
                        className="text-xs font-extrabold text-zinc-400 hover:text-[#FF1E28] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                        <span>Open Notifications Center</span>
                        <i className="bi bi-arrow-right text-xs"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
