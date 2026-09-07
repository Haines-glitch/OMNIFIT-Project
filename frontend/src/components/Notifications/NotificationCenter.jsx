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
        accent: 'cyan',
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
    onNavigateTab
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

        showToast(`${label} action processed for notification`);
    };

    const showToast = (msg) => {
        setStatusMessage(msg);
        setTimeout(() => setStatusMessage(null), 3000);
    };

    const getIconStyles = (accent) => {
        switch (accent) {
            case 'amber':
                return 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]';
            case 'mint':
                return 'bg-[#00F29D]/15 border-[#00F29D]/40 text-[#00F29D] shadow-[0_0_12px_rgba(0,242,157,0.25)]';
            case 'cyan':
                return 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]';
            case 'slate':
            default:
                return 'bg-slate-800/80 border-slate-700/60 text-slate-400';
        }
    };

    const getTagStyles = (accent) => {
        switch (accent) {
            case 'amber':
                return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
            case 'mint':
                return 'bg-[#00F29D]/15 border-[#00F29D]/30 text-[#00F29D]';
            case 'cyan':
                return 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400';
            case 'slate':
            default:
                return 'bg-slate-800 border-slate-700 text-slate-400';
        }
    };

    const isDropdown = variant === 'dropdown';

    return (
        <div className={`
            bg-slate-900/95 backdrop-blur-2xl border border-slate-800/90 rounded-2xl shadow-2xl shadow-black/60 transition-all duration-300
            ${isDropdown ? 'w-80 sm:w-96 max-h-[85vh] flex flex-col' : 'w-full p-6'}
        `}>
            {/* Header Area */}
            <div className={`${isDropdown ? 'p-4 border-b border-slate-800/80' : 'mb-6'}`}>
                <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00F29D] shadow-[0_0_10px_#00F29D]"></span>
                        <h5 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                            {isDropdown ? 'Notifications' : 'Activity & Notifications'}
                        </h5>
                        {unreadCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/40 shadow-[0_0_8px_rgba(0,242,157,0.3)]">
                                {unreadCount} New
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-[11px] font-bold text-slate-400 hover:text-[#00F29D] transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                        {isDropdown && onClose && (
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
                            >
                                <i className="bi bi-x-lg text-xs"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Pill Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${activeFilter === filter
                                    ? 'bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/40 shadow-[0_0_10px_rgba(0,242,157,0.2)]'
                                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Status Toast Message */}
            {statusMessage && (
                <div className="mx-4 my-2 px-3 py-1.5 bg-[#00F29D]/15 border border-[#00F29D]/40 rounded-xl text-xs text-[#00F29D] font-bold flex items-center gap-2 animate-fade-in">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>{statusMessage}</span>
                </div>
            )}

            {/* Notification Feed Items */}
            <div className={`
                space-y-3 overflow-y-auto pr-1
                ${isDropdown ? 'p-4 flex-1 max-h-[380px]' : ''}
            `}>
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((item) => (
                        <div
                            key={item.id}
                            className={`
                                relative p-4 rounded-xl border transition-all duration-200 group
                                ${!item.isRead
                                    ? 'bg-slate-900/90 border-slate-800 border-l-2 border-l-[#00F29D] shadow-md shadow-black/30'
                                    : 'bg-slate-950/40 border-slate-800/60 opacity-85 hover:opacity-100 hover:bg-slate-900/60'}
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
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${getTagStyles(item.accent)}`}>
                                                {item.tag}
                                            </span>
                                            {!item.isRead && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#00F29D] shadow-[0_0_6px_#00F29D]"></span>
                                            )}
                                        </div>
                                        <span className="text-[11px] font-medium text-slate-500">{item.timestamp}</span>
                                    </div>

                                    <h6
                                        className="text-xs font-bold text-white leading-snug mb-1 cursor-pointer hover:text-[#00F29D] transition-colors"
                                        onClick={() => handleToggleRead(item.id)}
                                    >
                                        {item.title}
                                    </h6>

                                    <p className="text-xs text-slate-300 leading-relaxed mb-2">
                                        {item.message}
                                    </p>

                                    {/* Action Status if processed */}
                                    {item.statusText && (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                            <i className="bi bi-check2 text-[#00F29D]"></i>
                                            Status: {item.statusText}
                                        </div>
                                    )}

                                    {/* Quick Actions if unprocessed */}
                                    {!item.statusText && (
                                        <div className="flex items-center gap-2 pt-1">
                                            {item.actionType === 'review' && (
                                                <button
                                                    onClick={() => handleAction(item.id, 'review', item.actionLabel)}
                                                    className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                                                >
                                                    <i className="bi bi-box-arrow-up-right text-[10px]"></i>
                                                    {item.actionLabel}
                                                </button>
                                            )}

                                            {item.actionType === 'appointment' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(item.id, 'appointment', item.actionAcceptLabel)}
                                                        className="px-3.5 py-1 bg-[#00F29D] hover:bg-[#00D88C] text-slate-950 font-bold text-xs rounded-lg shadow-sm shadow-[#00F29D]/20 transition-all flex items-center gap-1"
                                                    >
                                                        <i className="bi bi-check-lg"></i>
                                                        {item.actionAcceptLabel}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(item.id, 'appointment', item.actionDeclineLabel)}
                                                        className="px-3.5 py-1 bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-semibold rounded-lg transition-all flex items-center gap-1"
                                                    >
                                                        <i className="bi bi-x-lg text-[10px]"></i>
                                                        {item.actionDeclineLabel}
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
                    <div className="py-8 text-center text-slate-500 text-xs">
                        <i className="bi bi-bell-slash text-2xl block mb-2 opacity-50"></i>
                        No notifications found for selected filter.
                    </div>
                )}
            </div>

            {/* Footer Area */}
            <div className={`${isDropdown ? 'p-3 border-t border-slate-800/80 text-center' : 'mt-4 pt-3 border-t border-slate-800/60'}`}>
                <button
                    onClick={() => {
                        if (onNavigateTab) onNavigateTab('notifications');
                        if (onClose) onClose();
                    }}
                    className="text-xs font-extrabold text-slate-400 hover:text-[#00F29D] transition-colors inline-flex items-center gap-1.5"
                >
                    <span>View All Notifications Archive</span>
                    <i className="bi bi-arrow-right text-xs"></i>
                </button>
            </div>
        </div>
    );
};

export default NotificationCenter;
