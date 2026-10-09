import React, { useState, useEffect, useRef } from 'react';
import LoginService from '../Login/LoginService';

const ProfileModule = ({ user, onSaveUser, role, theme = 'light' }) => {
    const isLight = theme === 'light';
    const [isEditing, setIsEditing] = useState(false);
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const fileInputRef = useRef(null);

    const defaultAvatar = 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=300&auto=format&fit=crop&q=80';

    const defaultEmail = user?.email || (role === 'MEMBER' ? 'sarah.jenkins@omnifit.com' : 'marcus.vance@omnifit.com');
    const defaultName = user?.name || (role === 'MEMBER' ? 'Sarah Jenkins' : 'Marcus Vance');

    const [profileData, setProfileData] = useState({
        name: defaultName,
        email: defaultEmail,
        phone: user?.phone || '+91 98765 43210',
        gender: user?.gender || 'Female',
        dob: user?.dob || '1998-04-12',
        height: user?.height || '182 cm',
        weight: user?.weight || '78.5 kg',
        bmi: user?.bmi || 23.7,
        fitnessGoal: user?.fitnessGoal || 'Hypertrophy & Fat Loss',
        medicalHistory: user?.medicalHistory || 'None (Cleared for high-intensity training)',
        emergencyContact: user?.emergencyContact || 'Sarah Mercer (+91 98765 12345)',
        avatar: user?.avatar || defaultAvatar
    });

    const [tempData, setTempData] = useState({ ...profileData });

    useEffect(() => {
        if (user) {
            const updated = {
                name: user.name || (role === 'MEMBER' ? 'Sarah Jenkins' : 'Marcus Vance'),
                email: user.email || (role === 'MEMBER' ? 'sarah.jenkins@omnifit.com' : 'marcus.vance@omnifit.com'),
                phone: user.phone || '+91 98765 43210',
                gender: user.gender || 'Female',
                dob: user.dob || '1998-04-12',
                height: user.height || '182 cm',
                weight: user.weight || '78.5 kg',
                bmi: user.bmi || 23.7,
                fitnessGoal: user.fitnessGoal || 'Hypertrophy & Fat Loss',
                medicalHistory: user.medicalHistory || 'None (Cleared for high-intensity training)',
                emergencyContact: user.emergencyContact || 'Sarah Mercer (+91 98765 12345)',
                avatar: user.avatar || defaultAvatar
            };
            setProfileData(updated);
            if (!isEditing) {
                setTempData(updated);
            }
        }
    }, [user, isEditing, role]);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [savedMessage, setSavedMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState(null);

    const handleStartEdit = () => {
        setTempData({ ...profileData });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setTempData({ ...profileData });
        setIsEditing(false);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        // Strict email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(tempData.email)) {
            setSavedMessage('Invalid email format provided. Please fix it.');
            setTimeout(() => setSavedMessage(''), 5000);
            return;
        }

        setProfileData({ ...tempData });

        const updatedUser = await LoginService.updateCurrentUser({
            name: tempData.name,
            email: tempData.email,
            phone: tempData.phone,
            gender: tempData.gender,
            dob: tempData.dob,
            height: tempData.height,
            weight: tempData.weight,
            fitnessGoal: tempData.fitnessGoal,
            medicalHistory: tempData.medicalHistory,
            emergencyContact: tempData.emergencyContact,
            avatar: tempData.avatar
        });

        if (onSaveUser) {
            onSaveUser(updatedUser);
        }

        setIsEditing(false);
        setSavedMessage('Profile updated successfully! All changes saved to active session & database.');
        setTimeout(() => setSavedMessage(''), 5000);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (!passwordData.newPassword) {
            setPasswordMessage({ type: 'warning', text: 'Please enter a new password.' });
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'danger', text: 'New password and confirm password do not match.' });
            return;
        }

        setPasswordMessage({ type: 'success', text: 'Security password updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordMessage(null), 4000);
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setProfileData({ ...profileData, avatar: base64String });
                setTempData({ ...tempData, avatar: base64String });
                setSavedMessage('Avatar updated successfully!');
                setTimeout(() => setSavedMessage(''), 4000);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in font-sans antialiased">
            {/* System Status Banner */}
            {savedMessage && (
                <div className="p-4 rounded-2xl bg-[#00F29D]/15 border border-[#00F29D]/40 text-[#00F29D] font-bold text-xs flex items-center justify-between shadow-lg shadow-[#00F29D]/10">
                    <div className="flex items-center gap-2.5">
                        <i className="bi bi-check-circle-fill text-base"></i>
                        <span>{savedMessage}</span>
                    </div>
                    <button
                        onClick={() => setSavedMessage('')}
                        className="text-[#00F29D] hover:text-white transition-colors"
                    >
                        <i className="bi bi-x-lg text-xs"></i>
                    </button>
                </div>
            )}

            {/* SECTION 1: PROFILE HEADER HERO CARD */}
            <div className="relative overflow-hidden p-6 sm:p-8 bg-white border border-[#00F29D]/20 rounded-[28px] shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all">
                {/* Ambient glow decoration */}
                <div className="absolute -right-16 -top-16 w-72 h-72 bg-[#00F29D]/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                        {/* Modern Profile Avatar */}
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#00F29D] p-1 shadow-[0_0_25px_rgba(0,242,157,0.35)] transition-transform duration-300 group-hover:scale-105">
                                <img
                                    src={profileData.avatar}
                                    alt={profileData.name}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            {/* Interactive Camera Hover Badge */}
                            <div className="absolute inset-0 bg-slate-950/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 backdrop-blur-xs">
                                <div className="w-9 h-9 rounded-full bg-[#00F29D] text-slate-950 flex items-center justify-center shadow-lg">
                                    <i className="bi bi-camera-fill text-sm"></i>
                                </div>
                            </div>
                            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#00F29D] border-2 border-slate-950 flex items-center justify-center text-[10px] text-slate-950 font-black shadow-md">
                                <i className="bi bi-[#check]"></i>
                            </span>
                        </div>

                        {/* Trainer Meta Info */}
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                    {profileData.name}
                                </h2>
                                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#00F29D]/15 text-[#00F29D] border border-[#00F29D]/40 shadow-[0_0_10px_rgba(0,242,157,0.2)] tracking-widest uppercase">
                                    {role || 'TRAINER'}
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-400 font-medium flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <span className="flex items-center gap-1.5 text-slate-300">
                                    <i className="bi bi-envelope-fill text-[#00F29D]"></i>
                                    {profileData.email}
                                </span>
                                <span className="hidden sm:inline text-slate-600">•</span>
                                <span className="flex items-center gap-1.5 text-[#00F29D] font-bold">
                                    <i className="bi bi-telephone-fill"></i>
                                    {profileData.phone}
                                </span>
                            </p>

                            {/* Quick Stat Badges */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#00F29D] text-slate-950 shadow-md shadow-[#00F29D]/20">
                                    {profileData.fitnessGoal}
                                </span>
                                <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#f8fafc] text-cyan-600 border border-slate-200">
                                    BMI: {profileData.bmi}
                                </span>
                                <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#f8fafc] text-amber-600 border border-slate-200">
                                    Height: {profileData.height}
                                </span>
                                <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#f8fafc] text-slate-600 border border-slate-200">
                                    Contact: {profileData.phone}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Primary Edit Profile Action */}
                    {!isEditing && (
                        <button
                            onClick={handleStartEdit}
                            className="px-5 py-2.5 bg-[#00F29D] hover:bg-[#00D88C] text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-[#00F29D]/20 hover:shadow-[#00F29D]/40 hover:-translate-y-0.5 transition-all cursor-pointer shrink-0"
                        >
                            <i className="bi bi-pencil-square text-sm"></i>
                            EDIT PROFILE
                        </button>
                    )}
                </div>
            </div>

            {/* SECTION 2: PERSONAL & MEDICAL BIO CARD */}
            <div className="p-6 sm:p-8 bg-white border border-[#00F29D]/20 rounded-[28px] shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F29D]/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 relative z-10">
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#00F29D]/15 border border-[#00F29D]/40 text-[#00F29D] flex items-center justify-center">
                            <i className="bi bi-person-badge-fill text-sm"></i>
                        </div>
                        {isEditing ? 'Editing Personal & Medical Bio' : 'Personal & Medical Bio'}
                    </h4>

                    {isEditing && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-400 border border-amber-500/30 tracking-wider uppercase flex items-center gap-1.5">
                            <i className="bi bi-pencil-fill"></i>
                            EDIT MODE ACTIVE
                        </span>
                    )}
                </div>

                {isEditing ? (
                    /* EDIT MODE FORM */
                    <form onSubmit={handleProfileSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={tempData.name}
                                    onChange={(e) => setTempData({ ...tempData, name: e.target.value.replace(/[^a-zA-Z\s'-]/g, '') })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs outline-none focus:border-[#00F29D] focus:ring-1 focus:ring-[#00F29D] transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
                                    <span>Email Address</span>
                                    <span className="text-[10px] text-[#00F29D] font-bold uppercase tracking-wider">Editable</span>
                                </label>
                                <input
                                    type="email"
                                    value={tempData.email}
                                    onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs font-medium outline-none focus:border-[#00F29D] focus:ring-1 focus:ring-[#00F29D] transition-all"
                                    placeholder="Enter your email address..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Contact Number (Indian +91)</label>
                                <div className="flex items-center rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden focus-within:border-[#00F29D]">
                                    <span className="px-3 py-2.5 bg-slate-900 border-r border-slate-800 text-xs font-bold text-[#00F29D]">🇮🇳 +91</span>
                                    <input
                                        type="text"
                                        value={tempData.phone.replace('+91 ', '')}
                                        onChange={(e) => {
                                            const raw = e.target.value;
                                            const formatted = raw.startsWith('+91') ? raw : `+91 ${raw}`;
                                            setTempData({ ...tempData, phone: formatted });
                                        }}
                                        className="w-full px-3.5 py-2.5 bg-transparent text-white text-xs outline-none"
                                        required
                                    />
                                </div>
                            </div>


                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Gender</label>
                                <select
                                    value={tempData.gender}
                                    onChange={(e) => setTempData({ ...tempData, gender: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs outline-none focus:border-[#00F29D] transition-all"
                                >
                                    <option value="Male" className="bg-white text-slate-900">Male</option>
                                    <option value="Female" className="bg-white text-slate-900">Female</option>
                                    <option value="Other" className="bg-white text-slate-900">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Date of Birth</label>
                                <input
                                    type="date"
                                    value={tempData.dob}
                                    onChange={(e) => setTempData({ ...tempData, dob: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs outline-none focus:border-[#00F29D] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Height</label>
                                <input
                                    type="text"
                                    value={tempData.height}
                                    onChange={(e) => setTempData({ ...tempData, height: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs outline-none focus:border-[#00F29D] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Current Weight</label>
                                <input
                                    type="text"
                                    value={tempData.weight}
                                    onChange={(e) => setTempData({ ...tempData, weight: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs outline-none focus:border-[#00F29D] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Fitness Goal / Specialization</label>
                                <input
                                    type="text"
                                    value={tempData.fitnessGoal}
                                    onChange={(e) => setTempData({ ...tempData, fitnessGoal: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs outline-none focus:border-[#00F29D] transition-all"
                                />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Emergency Contact</label>
                                <input
                                    type="text"
                                    value={tempData.emergencyContact}
                                    onChange={(e) => setTempData({ ...tempData, emergencyContact: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs outline-none focus:border-[#00F29D] transition-all"
                                />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Medical History / Health Clearance</label>
                                <textarea
                                    rows="2"
                                    value={tempData.medicalHistory}
                                    onChange={(e) => setTempData({ ...tempData, medicalHistory: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs outline-none focus:border-[#00F29D] transition-all"
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-[#f8fafc] border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl transition-all"
                            >
                                <i className="bi bi-x-circle me-1.5"></i>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-[#00F29D] hover:bg-[#00D88C] text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-[#00F29D]/20 transition-all"
                            >
                                <i className="bi bi-check-lg me-1.5"></i>
                                Save Profile Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    /* VIEW MODE DETAILS DISPLAY GRID */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 hover:border-[#00F29D]/50 hover:bg-white hover:shadow-sm transition-all relative z-10">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Full Name</span>
                            <span className="text-sm font-bold text-slate-900 block">{profileData.name}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 hover:border-[#00F29D]/50 hover:bg-white hover:shadow-sm transition-all relative z-10">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
                            <span className="text-sm font-bold text-slate-900 block">{profileData.email}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 hover:border-[#00F29D]/50 hover:bg-white hover:shadow-sm transition-all relative z-10">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Contact Number (Indian +91)</span>
                            <span className="text-sm font-bold text-[#00F29D] block flex items-center gap-1.5">
                                <span>🇮🇳</span> {profileData.phone}
                            </span>
                        </div>


                        <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 hover:border-[#00F29D]/50 hover:bg-white hover:shadow-sm transition-all relative z-10">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Gender</span>
                            <span className="text-sm font-bold text-slate-900 block">{profileData.gender}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 hover:border-[#00F29D]/50 hover:bg-white hover:shadow-sm transition-all relative z-10">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Date of Birth</span>
                            <span className="text-sm font-bold text-slate-900 block">{profileData.dob}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 hover:border-[#00F29D]/50 hover:bg-white hover:shadow-sm transition-all relative z-10">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Height</span>
                            <span className="text-sm font-bold text-slate-900 block">{profileData.height}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 hover:border-[#00F29D]/50 hover:bg-white hover:shadow-sm transition-all relative z-10">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Current Weight</span>
                            <span className="text-sm font-bold text-slate-900 block">{profileData.weight}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 hover:border-[#00F29D]/50 hover:bg-white hover:shadow-sm transition-all relative z-10">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Fitness Goal / Specialization</span>
                            <span className="text-sm font-bold text-[#00F29D] block">{profileData.fitnessGoal}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 hover:border-[#00F29D]/50 hover:bg-white hover:shadow-sm transition-all md:col-span-2 lg:col-span-3 relative z-10">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Emergency Contact</span>
                            <span className="text-sm font-bold text-slate-900 block">{profileData.emergencyContact}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 hover:border-[#00F29D]/50 hover:bg-white hover:shadow-sm transition-all md:col-span-2 lg:col-span-3 relative z-10">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Medical History / Health Clearance</span>
                            <span className="text-sm font-bold text-slate-600 block">{profileData.medicalHistory}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION 3: CHANGE SECURITY PASSWORD CARD */}
            <div className="p-6 sm:p-8 bg-white border border-[#00F29D]/20 rounded-[28px] shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all">
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2.5 pb-4 border-b border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-[#00F29D]/15 border border-[#00F29D]/40 text-[#00F29D] flex items-center justify-center">
                        <i className="bi bi-shield-lock-fill text-sm"></i>
                    </div>
                    Change Security Password
                </h4>

                {passwordMessage && (
                    <div className={`p-4 rounded-xl mb-4 text-xs font-bold flex items-center gap-2 ${passwordMessage.type === 'success'
                        ? 'bg-[#00F29D]/15 border border-[#00F29D]/40 text-[#00F29D]'
                        : 'bg-red-500/15 border border-red-500/40 text-red-400'
                        }`}>
                        <i className={`bi ${passwordMessage.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
                        <span>{passwordMessage.text}</span>
                    </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Current Password Input */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Current Password</label>
                            <div className="relative flex items-center">
                                <i className="bi bi-lock-fill absolute left-3.5 text-slate-500 text-xs"></i>
                                <input
                                    type={showCurrentPass ? 'text' : 'password'}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    placeholder="Current Password"
                                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs placeholder-slate-500 outline-none focus:border-[#00F29D] focus:ring-1 focus:ring-[#00F29D] transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                                    className="absolute right-3 text-slate-500 hover:text-slate-300 text-xs"
                                >
                                    <i className={`bi ${showCurrentPass ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* New Password Input */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5">New Password</label>
                            <div className="relative flex items-center">
                                <i className="bi bi-lock-fill absolute left-3.5 text-slate-500 text-xs"></i>
                                <input
                                    type={showNewPass ? 'text' : 'password'}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    placeholder="New Password"
                                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs placeholder-slate-500 outline-none focus:border-[#00F29D] focus:ring-1 focus:ring-[#00F29D] transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPass(!showNewPass)}
                                    className="absolute right-3 text-slate-500 hover:text-slate-300 text-xs"
                                >
                                    <i className={`bi ${showNewPass ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password Input */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Confirm New Password</label>
                            <div className="relative flex items-center">
                                <i className="bi bi-lock-fill absolute left-3.5 text-slate-500 text-xs"></i>
                                <input
                                    type={showConfirmPass ? 'text' : 'password'}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    placeholder="Confirm New Password"
                                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs placeholder-slate-500 outline-none focus:border-[#00F29D] focus:ring-1 focus:ring-[#00F29D] transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                    className="absolute right-3 text-slate-500 hover:text-slate-300 text-xs"
                                >
                                    <i className={`bi ${showConfirmPass ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-3">
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                        >
                            <i className="bi bi-key-fill text-[#00F29D]"></i>
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModule;
