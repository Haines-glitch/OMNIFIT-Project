import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    Brain,
    Cpu,
    Bell,
    ShieldAlert,
    Users,
    UserCheck,
    Check,
    RotateCcw,
    Sliders,
    Sparkles,
    ShieldCheck,
    Smartphone,
    Mail,
    Monitor,
    ChevronDown,
    Zap
} from 'lucide-react';

const TrainerSettingsModule = ({ theme = 'light' }) => {
    // ----------------------------------------------------
    // INITIAL DEFAULT STATES
    // ----------------------------------------------------
    const defaultSettings = {
        // 1. Appointment & Scheduling Preferences (tbl_appointment)
        autoApproveVIP: true,
        defaultSessionDuration: '60 mins',
        sessionBufferTime: '15 mins',
        maxDailySessions: 6,
        instantBookingNotice: '24 hours prior',

        // 2. AI Engine & Automation Preferences (tbl_workout_plan, tbl_diet_plan)
        autoGenerateAITemplates: true,
        dynamicProgressiveOverload: true,
        strictAllergenShield: true,
        allergenShieldAction: 'Strict Replacement',

        // 3. Notifications & Early Warning Alerts (tbl_notification)
        trajectoryDeviationAlerts: true,
        attendanceDropoffWarnings: true,
        faceScanCheckinNotifs: false,
        deliveryInApp: true,
        deliveryEmail: true,
        deliverySMS: false,
        emailAddress: 'abhilash.kk@omnifit.com',
        phoneNo: '+91 98765 43210',

        // 4. Profile Visibility & Client Allocation (tbl_trainer)
        acceptingNewMembers: true,
        activeClientsCount: 42,
        maxClientCapacity: 50,
        trainingFocus: ['Hypertrophy', 'Fat Loss', 'Strength & Conditioning', 'Athletic Performance']
    };

    const [settings, setSettings] = useState(defaultSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Toggle helper
    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Change helper
    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    // Training Focus Pill Toggle helper
    const handleFocusToggle = (tag) => {
        setSettings(prev => {
            const current = prev.trainingFocus;
            if (current.includes(tag)) {
                return { ...prev, trainingFocus: current.filter(t => t !== tag) };
            } else {
                return { ...prev, trainingFocus: [...current, tag] };
            }
        });
    };

    // Save Action
    const handleSave = () => {
        if (settings.maxClientCapacity < 10 || settings.maxClientCapacity > 100) {
            showToast('Max client capacity must be between 10 and 100.');
            return;
        }
        if (settings.maxClientCapacity < settings.activeClientsCount) {
            showToast(`Capacity cannot be lower than current active athlete count (${settings.activeClientsCount}).`);
            return;
        }

        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            showToast('Settings saved & synchronized with OMNIFIT Ecosystem DB!');
        }, 600);
    };

    // Reset Action
    const handleReset = () => {
        setSettings(defaultSettings);
        showToast('Settings restored to OMNIFIT defaults.');
    };

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage('');
        }, 3500);
    };

    const allFocusOptions = [
        'Hypertrophy',
        'Fat Loss',
        'Strength & Conditioning',
        'Athletic Performance',
        'Mobility & Rehab',
        'Powerlifting',
        'Endurance'
    ];

    return (
        <div className="space-y-8 pb-24 text-white font-sans">
            {/* Header Banner */}
            <div className="relative overflow-hidden p-6 sm:p-8 bg-[#111928] border border-slate-800/80 rounded-2xl shadow-xl shadow-black/50">
                <div className="absolute -right-16 -top-16 w-72 h-72 bg-[#00F29D]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/40 shadow-[0_0_12px_rgba(0,242,157,0.2)] tracking-wider uppercase flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                TRAINER CONTROL HUB
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                            <Sliders className="w-7 h-7 text-[#00F29D]" />
                            Trainer Portal Settings
                        </h2>
                        <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                            Configure booking policies, AI engine automation rules, threshold warnings, and roster capacity.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                            Reset Defaults
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-5 py-2.5 bg-[#00F29D] hover:bg-[#00D88C] active:scale-95 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-[#00F29D]/20 hover:shadow-[#00F29D]/40 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Check className="w-4 h-4 stroke-[3]" />
                            )}
                            {isSaving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-[#111928] border border-[#00F29D]/60 text-white rounded-2xl shadow-2xl shadow-[#00F29D]/20 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-1 bg-[#00F29D]/20 rounded-lg text-[#00F29D]">
                        <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                    <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
                </div>
            )}

            {/* SECTION 1: APPOINTMENT & SCHEDULING PREFERENCES */}
            <div className="bg-[#111928] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/40 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[#00F29D]">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white tracking-wide">
                                Appointment & Session Settings
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">
                                Controls for 1-on-1 member session approvals, slot durations, and buffer times (tbl_appointment)
                            </p>
                        </div>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-950 border border-slate-800 text-slate-400">
                        <Clock className="w-3 h-3 text-[#00F29D]" />
                        SCHEDULING LOGIC
                    </span>
                </div>

                {/* Preserved Setting: Auto-approve VIP Platinum Members */}
                <div className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-xl flex items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                                Auto-approve appointments for VIP Platinum Members
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/30">
                                PRESERVED
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Automatically accept 1-on-1 session requests from members on the VIP Platinum tier.
                        </p>
                    </div>
                    {/* Custom iOS Toggle Switch */}
                    <button
                        type="button"
                        onClick={() => handleToggle('autoApproveVIP')}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.autoApproveVIP
                            ? 'bg-[#00F29D] shadow-[0_0_12px_rgba(0,242,157,0.4)]'
                            : 'bg-slate-800 border-slate-700'
                            }`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-md ring-0 transition duration-200 ease-in-out ${settings.autoApproveVIP ? 'translate-x-5 bg-slate-950' : 'translate-x-0 bg-slate-400'
                                }`}
                        />
                    </button>
                </div>

                {/* Grid for Duration, Buffer, Max Daily, Booking Notice */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Default Session Duration */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#00F29D]" />
                            Default Session Duration
                        </label>
                        <div className="relative">
                            <select
                                value={settings.defaultSessionDuration}
                                onChange={(e) => handleChange('defaultSessionDuration', e.target.value)}
                                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white appearance-none focus:outline-none focus:border-[#00F29D] focus:ring-1 focus:ring-[#00F29D] cursor-pointer"
                            >
                                <option value="30 mins">30 mins</option>
                                <option value="45 mins">45 mins</option>
                                <option value="60 mins">60 mins [Default]</option>
                                <option value="90 mins">90 mins</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                    </div>

                    {/* Session Buffer Time */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-[#00F29D]" />
                            Session Buffer Time
                        </label>
                        <div className="relative">
                            <select
                                value={settings.sessionBufferTime}
                                onChange={(e) => handleChange('sessionBufferTime', e.target.value)}
                                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white appearance-none focus:outline-none focus:border-[#00F29D] focus:ring-1 focus:ring-[#00F29D] cursor-pointer"
                            >
                                <option value="0 mins">0 mins</option>
                                <option value="10 mins">10 mins</option>
                                <option value="15 mins">15 mins [Default]</option>
                                <option value="30 mins">30 mins</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                    </div>

                    {/* Max Daily Sessions */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#00F29D]" />
                            Max Daily Sessions
                        </label>
                        <div className="flex items-center bg-slate-950/90 border border-slate-800 rounded-xl px-2 py-1">
                            <button
                                type="button"
                                onClick={() => handleChange('maxDailySessions', Math.max(1, settings.maxDailySessions - 1))}
                                className="px-3 py-1.5 text-slate-400 hover:text-white font-bold hover:bg-slate-800 rounded-lg transition-all"
                            >
                                -
                            </button>
                            <span className="flex-1 text-center text-xs font-extrabold text-white">
                                {settings.maxDailySessions} Sessions
                            </span>
                            <button
                                type="button"
                                onClick={() => handleChange('maxDailySessions', Math.min(20, settings.maxDailySessions + 1))}
                                className="px-3 py-1.5 text-slate-400 hover:text-white font-bold hover:bg-slate-800 rounded-lg transition-all"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Instant Booking Notice */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#00F29D]" />
                            Instant Booking Notice
                        </label>
                        <div className="relative">
                            <select
                                value={settings.instantBookingNotice}
                                onChange={(e) => handleChange('instantBookingNotice', e.target.value)}
                                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white appearance-none focus:outline-none focus:border-[#00F29D] focus:ring-1 focus:ring-[#00F29D] cursor-pointer"
                            >
                                <option value="2 hours prior">2 hours prior</option>
                                <option value="12 hours prior">12 hours prior</option>
                                <option value="24 hours prior">24 hours prior [Default]</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: AI ENGINE & AUTOMATION PREFERENCES */}
            <div className="bg-[#111928] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/40 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[#00F29D]">
                            <Brain className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white tracking-wide">
                                AI Engine & Automation Configuration
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">
                                Automated template calculations, progressive overload logic, and allergen screening (tbl_workout_plan, tbl_diet_plan)
                            </p>
                        </div>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-950 border border-slate-800 text-slate-400">
                        <Cpu className="w-3 h-3 text-[#00F29D]" />
                        NEURAL ENGINE V4.2
                    </span>
                </div>

                <div className="space-y-4">
                    {/* Auto-Generate AI Base Templates */}
                    <div className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-xl flex items-center justify-between gap-4">
                        <div>
                            <span className="text-sm font-bold text-white block">
                                Auto-Generate AI Base Templates for New Clients
                            </span>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Instantly calculate baseline macros and exercises when a new member is assigned to your roster.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleToggle('autoGenerateAITemplates')}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.autoGenerateAITemplates
                                ? 'bg-[#00F29D] shadow-[0_0_12px_rgba(0,242,157,0.4)]'
                                : 'bg-slate-800 border-slate-700'
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-md ring-0 transition duration-200 ease-in-out ${settings.autoGenerateAITemplates ? 'translate-x-5 bg-slate-950' : 'translate-x-0 bg-slate-400'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Dynamic Progressive Overload Recommendations */}
                    <div className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-xl flex items-center justify-between gap-4">
                        <div>
                            <span className="text-sm font-bold text-white block">
                                Dynamic Progressive Overload Recommendations
                            </span>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Allow the recommendation engine to suggest weight and rep increases based on logged set completions.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleToggle('dynamicProgressiveOverload')}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.dynamicProgressiveOverload
                                ? 'bg-[#00F29D] shadow-[0_0_12px_rgba(0,242,157,0.4)]'
                                : 'bg-slate-800 border-slate-700'
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-md ring-0 transition duration-200 ease-in-out ${settings.dynamicProgressiveOverload ? 'translate-x-5 bg-slate-950' : 'translate-x-0 bg-slate-400'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Strict Allergen Shield with Dropdown */}
                    <div className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-xl space-y-3">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <span className="text-sm font-bold text-white block">
                                    Strict Allergen Shield Protection
                                </span>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Enforce automated dietary screening against registered member allergies.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleToggle('strictAllergenShield')}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.strictAllergenShield
                                    ? 'bg-[#00F29D] shadow-[0_0_12px_rgba(0,242,157,0.4)]'
                                    : 'bg-slate-800 border-slate-700'
                                    }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-md ring-0 transition duration-200 ease-in-out ${settings.strictAllergenShield ? 'translate-x-5 bg-slate-950' : 'translate-x-0 bg-slate-400'
                                        }`}
                                />
                            </button>
                        </div>

                        {settings.strictAllergenShield && (
                            <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <label className="text-xs font-semibold text-slate-400">
                                    Allergen Conflict Handling Rule:
                                </label>
                                <div className="relative w-full sm:w-72">
                                    <select
                                        value={settings.allergenShieldAction}
                                        onChange={(e) => handleChange('allergenShieldAction', e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white appearance-none focus:outline-none focus:border-[#00F29D]"
                                    >
                                        <option value="Strict Replacement">Strict Replacement [Default]</option>
                                        <option value="Notify & Recommend Alternatives">Notify & Recommend Alternatives</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SECTION 3: NOTIFICATIONS & EARLY WARNING ALERTS */}
            <div className="bg-[#111928] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/40 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[#00F29D]">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white tracking-wide">
                                Alert Triggers & Notification Rules
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">
                                Member drop-off thresholds, trajectory deviations, and multi-channel delivery options (tbl_notification)
                            </p>
                        </div>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-950 border border-slate-800 text-slate-400">
                        <Bell className="w-3 h-3 text-[#00F29D]" />
                        REAL-TIME ALERTS
                    </span>
                </div>

                <div className="space-y-4">
                    {/* Trajectory Deviation Alerts */}
                    <div className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-xl flex items-center justify-between gap-4">
                        <div>
                            <span className="text-sm font-bold text-white block">
                                Member Trajectory Deviation Alerts
                            </span>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Receive instant notifications when a member falls behind target weight or attendance goals by more than 15%.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleToggle('trajectoryDeviationAlerts')}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.trajectoryDeviationAlerts
                                ? 'bg-[#00F29D] shadow-[0_0_12px_rgba(0,242,157,0.4)]'
                                : 'bg-slate-800 border-slate-700'
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-md ring-0 transition duration-200 ease-in-out ${settings.trajectoryDeviationAlerts ? 'translate-x-5 bg-slate-950' : 'translate-x-0 bg-slate-400'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Attendance Drop-off Warnings */}
                    <div className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-xl flex items-center justify-between gap-4">
                        <div>
                            <span className="text-sm font-bold text-white block">
                                Attendance Drop-off Warnings
                            </span>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Alert me when an assigned athlete misses 3 or more consecutive scheduled workouts.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleToggle('attendanceDropoffWarnings')}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.attendanceDropoffWarnings
                                ? 'bg-[#00F29D] shadow-[0_0_12px_rgba(0,242,157,0.4)]'
                                : 'bg-slate-800 border-slate-700'
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-md ring-0 transition duration-200 ease-in-out ${settings.attendanceDropoffWarnings ? 'translate-x-5 bg-slate-950' : 'translate-x-0 bg-slate-400'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Face Scan Check-in Notifications */}
                    <div className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-xl flex items-center justify-between gap-4">
                        <div>
                            <span className="text-sm font-bold text-white block">
                                Face Scan Check-in Notifications
                            </span>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Receive a silent ping when assigned athletes check in at the entryway terminal.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleToggle('faceScanCheckinNotifs')}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.faceScanCheckinNotifs
                                ? 'bg-[#00F29D] shadow-[0_0_12px_rgba(0,242,157,0.4)]'
                                : 'bg-slate-800 border-slate-700'
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-md ring-0 transition duration-200 ease-in-out ${settings.faceScanCheckinNotifs ? 'translate-x-5 bg-slate-950' : 'translate-x-0 bg-slate-400'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Delivery Channels */}
                    <div className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-xl space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                            Active Delivery Channels:
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* In-App Dashboard */}
                            <label
                                onClick={() => handleToggle('deliveryInApp')}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${settings.deliveryInApp
                                    ? 'bg-[#00F29D]/10 border-[#00F29D]/50 text-white'
                                    : 'bg-slate-900/80 border-slate-800 text-slate-400'
                                    }`}
                            >
                                <Monitor className={`w-4 h-4 ${settings.deliveryInApp ? 'text-[#00F29D]' : 'text-slate-500'}`} />
                                <div className="text-xs font-semibold">
                                    [In-App Dashboard]
                                </div>
                            </label>

                            {/* Email Notification */}
                            <label
                                onClick={() => handleToggle('deliveryEmail')}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${settings.deliveryEmail
                                    ? 'bg-[#00F29D]/10 border-[#00F29D]/50 text-white'
                                    : 'bg-slate-900/80 border-slate-800 text-slate-400'
                                    }`}
                            >
                                <Mail className={`w-4 h-4 ${settings.deliveryEmail ? 'text-[#00F29D]' : 'text-slate-500'}`} />
                                <div className="text-xs font-semibold truncate">
                                    [Email: {settings.emailAddress}]
                                </div>
                            </label>

                            {/* SMS Alerts */}
                            <label
                                onClick={() => handleToggle('deliverySMS')}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${settings.deliverySMS
                                    ? 'bg-[#00F29D]/10 border-[#00F29D]/50 text-white'
                                    : 'bg-slate-900/80 border-slate-800 text-slate-400'
                                    }`}
                            >
                                <Smartphone className={`w-4 h-4 ${settings.deliverySMS ? 'text-[#00F29D]' : 'text-slate-500'}`} />
                                <div className="text-xs font-semibold truncate">
                                    [SMS: {settings.phoneNo}]
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 4: PROFILE VISIBILITY & CLIENT ALLOCATION */}
            <div className="bg-[#111928] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/40 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[#00F29D]">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white tracking-wide">
                                Roster & Capacity Settings
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">
                                Client allocation status, capacity thresholds, and specialization focus tags (tbl_trainer)
                            </p>
                        </div>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-950 border border-slate-800 text-slate-400">
                        <Users className="w-3 h-3 text-[#00F29D]" />
                        CAPACITY MANAGEMENT
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Client Intake Status & Capacity Bar */}
                    <div className="space-y-4 bg-slate-950/60 border border-slate-800/90 p-5 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-sm font-bold text-white block">
                                    Client Intake Status
                                </span>
                                <span className="text-xs text-slate-400">
                                    Controls visible availability for new member auto-assignment
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleToggle('acceptingNewMembers')}
                                className={`px-3 py-1 rounded-full text-xs font-black transition-all flex items-center gap-1.5 ${settings.acceptingNewMembers
                                    ? 'bg-[#00F29D]/20 text-[#00F29D] border border-[#00F29D]/50 shadow-[0_0_12px_rgba(0,242,157,0.3)]'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                                    }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${settings.acceptingNewMembers ? 'bg-[#00F29D] animate-ping' : 'bg-red-400'}`}></span>
                                {settings.acceptingNewMembers ? 'Accepting New Members' : 'Roster Full'}
                            </button>
                        </div>

                        {/* Capacity Metric */}
                        <div className="pt-3 border-t border-slate-800/80 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-slate-400">Current Athlete Allocation</span>
                                <span className="font-extrabold text-white">
                                    {settings.activeClientsCount} / {settings.maxClientCapacity} Active Athletes ({Math.round((settings.activeClientsCount / settings.maxClientCapacity) * 100)}%)
                                </span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
                                <div
                                    className="bg-gradient-to-r from-[#00F29D] to-emerald-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,242,157,0.5)]"
                                    style={{ width: `${Math.min(100, (settings.activeClientsCount / settings.maxClientCapacity) * 100)}%` }}
                                ></div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                                <span>Adjust Capacity Limit:</span>
                                <input
                                    type="number"
                                    min="10"
                                    max="100"
                                    value={settings.maxClientCapacity}
                                    onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
                                    onChange={(e) => {
                                        const clean = e.target.value.replace(/[^0-9]/g, '');
                                        handleChange('maxClientCapacity', clean ? parseInt(clean, 10) : '');
                                    }}
                                    className="w-20 bg-slate-900 border border-slate-800 text-center font-bold text-white rounded-lg py-1 text-xs focus:border-[#00F29D]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Primary Training Focus Pills */}
                    <div className="space-y-3 bg-slate-950/60 border border-slate-800/90 p-5 rounded-xl">
                        <div>
                            <span className="text-sm font-bold text-white block">
                                Primary Training Focus Tags
                            </span>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Select training domains displayed on your public trainer profile and used for member matching algorithms.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {allFocusOptions.map((tag) => {
                                const isSelected = settings.trainingFocus.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleFocusToggle(tag)}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                                            ? 'bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/50 shadow-[0_0_10px_rgba(0,242,157,0.25)]'
                                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                            }`}
                                    >
                                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* STICKY / FIXED FOOTER ACTION BAR */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B111E]/90 backdrop-blur-xl border-t border-slate-800/80 px-6 py-4 transition-all">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#00F29D] animate-pulse"></span>
                        Unsaved changes will be applied instantly to your active trainer portal session.
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset to Defaults
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#00F29D] hover:bg-[#00D88C] active:scale-95 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#00F29D]/20 hover:shadow-[#00F29D]/40 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Check className="w-4 h-4 stroke-[3]" />
                            )}
                            {isSaving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerSettingsModule;
