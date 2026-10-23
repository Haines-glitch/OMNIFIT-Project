import React, { useState, useEffect } from 'react';
import LoginService from '../Login/LoginService';

const TrainerSettingsModule = ({ theme = 'dark' }) => {
    const currentUser = LoginService.getCurrentUser();
    const trainerEmail = currentUser?.email || 'vikram.rathore@omnifit.com';
    const trainerName = currentUser?.name || currentUser?.full_name || 'Vikram Rathore';

    const defaultSettings = {
        // 1. Session Availability
        maxDailySessions: 6,
        defaultSessionDuration: '60 Mins',
        instantBookingNotice: '24 Hours Prior',
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        acceptingNewAthletes: true,

        // 2. Telemetry & Workflow Alerts
        notifyWorkoutCompleted: true,
        notifyPendingApproval: true,
        notifyAppointmentRequest: true,
        notifyEmailDispatch: true,

        // 3. Specializations
        specialties: ['Hypertrophy & Progressive Overload', 'Strength & Conditioning', 'Fat Loss & Body Composition']
    };

    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem('omnifit_trainer_settings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch {
            return defaultSettings;
        }
    });

    const [isSaving, setIsSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const allSpecialties = [
        'Hypertrophy & Progressive Overload',
        'Strength & Conditioning',
        'Fat Loss & Body Composition',
        'Athletic Mobility & Agility',
        'Powerlifting Foundations',
        'Endurance & VO2 Max'
    ];

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const toggleWorkingDay = (day) => {
        setSettings(prev => {
            const exists = prev.workingDays.includes(day);
            const updated = exists ? prev.workingDays.filter(d => d !== day) : [...prev.workingDays, day];
            return { ...prev, workingDays: updated };
        });
    };

    const toggleSpecialty = (spec) => {
        setSettings(prev => {
            const exists = prev.specialties.includes(spec);
            const updated = exists ? prev.specialties.filter(s => s !== spec) : [...prev.specialties, spec];
            return { ...prev, specialties: updated };
        });
    };

    const handleSave = (e) => {
        e?.preventDefault();
        setIsSaving(true);
        try {
            localStorage.setItem('omnifit_trainer_settings', JSON.stringify(settings));
        } catch (err) {
            console.warn('Could not save to localStorage', err);
        }

        setTimeout(() => {
            setIsSaving(false);
            setToastMessage('Trainer workspace settings synchronized & saved successfully!');
            setTimeout(() => setToastMessage(''), 4000);
        }, 500);
    };

    const handleReset = () => {
        setSettings(defaultSettings);
        try {
            localStorage.setItem('omnifit_trainer_settings', JSON.stringify(defaultSettings));
        } catch {}
        setToastMessage('Settings restored to OMNIFIT defaults.');
        setTimeout(() => setToastMessage(''), 3500);
    };

    return (
        <div className="space-y-6 animate-fade-in font-sans text-white">
            {/* Header Control Hub */}
            <div className="p-6 sm:p-8 bg-[#121217] border border-[#22222a] rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#E50914]/12 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/15 border border-[#E50914]/40 shadow-[0_0_12px_rgba(229,9,20,0.25)]">
                            <span className="w-2 h-2 rounded-full bg-[#FF1E28] animate-pulse shadow-[0_0_8px_#FF1E28]"></span>
                            <span className="text-[10px] font-black text-[#FF1E28] uppercase tracking-widest">
                                TRAINER WORKSPACE CONFIGURATION
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            Coaching Policies & Portal Settings
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                            Manage session availability, member alerts, email notifications, and active specializations for <strong className="text-white">{trainerName}</strong>.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-4 py-2.5 rounded-xl bg-[#181820] hover:bg-[#22222d] border border-[#2a2a38] text-zinc-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
                        >
                            <i className="bi bi-arrow-counterclockwise me-1.5"></i>
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B80710] hover:from-[#FF1E28] hover:to-[#E50914] text-white font-black text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(229,9,20,0.35)] transition-all cursor-pointer disabled:opacity-60"
                        >
                            {isSaving ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check2-circle text-sm"></i>
                                    <span>Save All Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Toast / Notification Banner (Green Theme!) */}
            {toastMessage && (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 font-bold flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.25)] animate-fade-in">
                    <div className="flex items-center gap-3">
                        <i className="bi bi-check-circle-fill text-emerald-400 text-lg"></i>
                        <span className="text-xs">{toastMessage}</span>
                    </div>
                    <button
                        onClick={() => setToastMessage('')}
                        className="text-emerald-400 hover:text-emerald-200 text-xs cursor-pointer"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            )}

            {/* Main Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Coaching Availability & Booking Limits */}
                <div className="p-6 bg-[#121217] border border-[#22222a] rounded-3xl shadow-xl space-y-5">
                    <div className="flex items-center gap-3 pb-3 border-b border-[#1f1f28]">
                        <div className="w-10 h-10 rounded-2xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF1E28] flex items-center justify-center text-lg">
                            <i className="bi bi-calendar-check-fill"></i>
                        </div>
                        <div>
                            <h4 className="text-base font-extrabold text-white tracking-tight">Coaching Session Limits</h4>
                            <p className="text-xs text-zinc-400 font-medium">Daily capacities and appointment scheduling rules</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                                    Max 1-on-1 Sessions Per Day
                                </label>
                                <span className="text-xs font-black text-[#FF1E28] bg-[#E50914]/15 px-2.5 py-0.5 rounded-full border border-[#E50914]/30">
                                    {settings.maxDailySessions} Sessions
                                </span>
                            </div>
                            <input
                                type="range"
                                min="2"
                                max="12"
                                value={settings.maxDailySessions}
                                onChange={(e) => handleChange('maxDailySessions', parseInt(e.target.value))}
                                className="w-full accent-[#E50914] cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-zinc-500 font-bold pt-1">
                                <span>2 Sessions (Light)</span>
                                <span>6 Sessions (Standard)</span>
                                <span>12 Sessions (Intense)</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                                    Session Duration
                                </label>
                                <select
                                    value={settings.defaultSessionDuration}
                                    onChange={(e) => handleChange('defaultSessionDuration', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181820] border border-[#2a2a38] text-white text-xs font-semibold focus:border-[#E50914] outline-none"
                                >
                                    <option value="45 Mins">45 Minutes</option>
                                    <option value="60 Mins">60 Minutes (Recommended)</option>
                                    <option value="90 Mins">90 Minutes</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                                    Advance Notice
                                </label>
                                <select
                                    value={settings.instantBookingNotice}
                                    onChange={(e) => handleChange('instantBookingNotice', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181820] border border-[#2a2a38] text-white text-xs font-semibold focus:border-[#E50914] outline-none"
                                >
                                    <option value="12 Hours Prior">12 Hours Prior</option>
                                    <option value="24 Hours Prior">24 Hours Prior</option>
                                    <option value="48 Hours Prior">48 Hours Prior</option>
                                </select>
                            </div>
                        </div>

                        {/* Working Days */}
                        <div className="pt-2">
                            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
                                Available Working Days
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {allDays.map((day) => {
                                    const isSelected = settings.workingDays.includes(day);
                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleWorkingDay(day)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'bg-[#E50914] text-white shadow-[0_0_10px_rgba(229,9,20,0.35)]'
                                                    : 'bg-[#181820] text-zinc-400 hover:text-white border border-[#2a2a38]'
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Accepting New Athletes */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#181820] border border-[#262634] mt-2">
                            <div>
                                <span className="text-xs font-extrabold text-white block">Accept New Member Assignments</span>
                                <span className="text-[11px] text-zinc-400">Allows Admin to assign new gym athletes to your roster</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.acceptingNewAthletes}
                                onChange={() => handleToggle('acceptingNewAthletes')}
                                className="w-5 h-5 accent-[#E50914] cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Athlete Telemetry & Notification Channels */}
                <div className="p-6 bg-[#121217] border border-[#22222a] rounded-3xl shadow-xl space-y-5">
                    <div className="flex items-center gap-3 pb-3 border-b border-[#1f1f28]">
                        <div className="w-10 h-10 rounded-2xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF1E28] flex items-center justify-center text-lg">
                            <i className="bi bi-bell-fill"></i>
                        </div>
                        <div>
                            <h4 className="text-base font-extrabold text-white tracking-tight">Athlete Alerts & Dispatch</h4>
                            <p className="text-xs text-zinc-400 font-medium">Real-time notifications for athlete progress and requests</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#181820] border border-[#262634]">
                            <div>
                                <span className="text-xs font-bold text-white block">Workout Routine Completion</span>
                                <span className="text-[11px] text-zinc-400">Notify when an assigned member logs all prescribed sets</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.notifyWorkoutCompleted}
                                onChange={() => handleToggle('notifyWorkoutCompleted')}
                                className="w-4 h-4 accent-[#E50914] cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#181820] border border-[#262634]">
                            <div>
                                <span className="text-xs font-bold text-white block">Member Registration Approval</span>
                                <span className="text-[11px] text-zinc-400">Notify when newly registered members await your review</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.notifyPendingApproval}
                                onChange={() => handleToggle('notifyPendingApproval')}
                                className="w-4 h-4 accent-[#E50914] cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#181820] border border-[#262634]">
                            <div>
                                <span className="text-xs font-bold text-white block">1-on-1 Coaching Session Requests</span>
                                <span className="text-[11px] text-zinc-400">Receive alert when an athlete requests a coaching slot</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.notifyAppointmentRequest}
                                onChange={() => handleToggle('notifyAppointmentRequest')}
                                className="w-4 h-4 accent-[#E50914] cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#181820] border border-[#262634]">
                            <div>
                                <span className="text-xs font-bold text-white block">SMTP Email Dispatch</span>
                                <span className="text-[11px] text-zinc-400">Send confirmation notices to <strong className="text-white">{trainerEmail}</strong></span>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.notifyEmailDispatch}
                                onChange={() => handleToggle('notifyEmailDispatch')}
                                className="w-4 h-4 accent-[#E50914] cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Training Specializations */}
                <div className="p-6 bg-[#121217] border border-[#22222a] rounded-3xl shadow-xl space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-[#1f1f28]">
                        <div className="w-10 h-10 rounded-2xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF1E28] flex items-center justify-center text-lg">
                            <i className="bi bi-award-fill"></i>
                        </div>
                        <div>
                            <h4 className="text-base font-extrabold text-white tracking-tight">Coaching Disciplines & Specializations</h4>
                            <p className="text-xs text-zinc-400 font-medium">Select disciplines displayed on your coach profile</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs text-zinc-400">Athletes can match with you based on these focus disciplines:</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {allSpecialties.map((spec) => {
                                const active = settings.specialties.includes(spec);
                                return (
                                    <button
                                        key={spec}
                                        type="button"
                                        onClick={() => toggleSpecialty(spec)}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                            active
                                                ? 'bg-[#E50914]/15 text-[#FF1E28] border border-[#E50914]/50 shadow-[0_0_10px_rgba(229,9,20,0.2)]'
                                                : 'bg-[#181820] text-zinc-400 hover:text-white border border-[#262634]'
                                        }`}
                                    >
                                        <i className={`bi ${active ? 'bi-check2' : 'bi-plus'}`}></i>
                                        <span>{spec}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 4. Trainer Account & Security Reference */}
                <div className="p-6 bg-[#121217] border border-[#22222a] rounded-3xl shadow-xl space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-[#1f1f28]">
                        <div className="w-10 h-10 rounded-2xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF1E28] flex items-center justify-center text-lg">
                            <i className="bi bi-shield-lock-fill"></i>
                        </div>
                        <div>
                            <h4 className="text-base font-extrabold text-white tracking-tight">Trainer Account & Security</h4>
                            <p className="text-xs text-zinc-400 font-medium">Credentials and authentication status</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-3.5 rounded-2xl bg-[#181820] border border-[#262634] flex items-center justify-between text-xs">
                            <span className="text-zinc-400">Active Coach Email:</span>
                            <span className="font-bold text-white">{trainerEmail}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#181820] border border-[#262634] flex items-center justify-between text-xs">
                            <span className="text-zinc-400">Certification Status:</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/40">
                                VERIFIED NASM MASTER
                            </span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#181820] border border-[#262634] flex items-center justify-between text-xs">
                            <span className="text-zinc-400">Security / Password:</span>
                            <span className="text-zinc-300 font-medium">Managed in Profile Tab</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerSettingsModule;
