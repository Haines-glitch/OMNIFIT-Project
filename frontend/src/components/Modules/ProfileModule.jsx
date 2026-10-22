import React, { useState, useEffect, useRef } from 'react';
import LoginService from '../Login/LoginService';
import { validateName, validateEmail, validateDateOfBirth, validateNumericRange } from '../../utils/validation';
import { DEFAULT_AVATAR } from '../../utils/defaultAvatar';

const ProfileModule = ({ user, onSaveUser, role, theme = 'light' }) => {
    const isLight = theme === 'light';
    const [isEditing, setIsEditing] = useState(false);
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const fileInputRef = useRef(null);

    const defaultAvatar = DEFAULT_AVATAR;

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
        setTempData({
            ...profileData,
            height: String(profileData.height || '').replace(/[^0-9.]/g, ''),
            weight: String(profileData.weight || '').replace(/[^0-9.]/g, ''),
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setTempData({ ...profileData });
        setIsEditing(false);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        // 1. Logical Name Validation
        const nameVal = validateName(tempData.name, 'Full Name');
        if (!nameVal.valid) {
            setSavedMessage({ type: 'warning', text: nameVal.message });
            setTimeout(() => setSavedMessage(null), 5000);
            return;
        }

        // 2. Logical Email Validation
        const emailVal = validateEmail(tempData.email);
        if (!emailVal.valid) {
            setSavedMessage({ type: 'warning', text: 'Invalid email format provided. Please fix it.' });
            setTimeout(() => setSavedMessage(null), 5000);
            return;
        }

        // 3. Logical Contact Number Validation
        if (tempData.phone) {
            const rawDigits = tempData.phone.replace(/\D/g, '');
            if (rawDigits.length < 10) {
                setSavedMessage({ type: 'warning', text: 'Please enter a valid 10-digit mobile contact number.' });
                setTimeout(() => setSavedMessage(null), 5000);
                return;
            }
        }

        // 4. Logical Date of Birth Validation
        if (tempData.dob) {
            const dobVal = validateDateOfBirth(tempData.dob);
            if (!dobVal.valid) {
                setSavedMessage({ type: 'warning', text: dobVal.message });
                setTimeout(() => setSavedMessage(null), 5000);
                return;
            }
        }

        // 5. Logical Height Validation
        const cleanHeight = String(tempData.height || '').replace(/[^0-9.]/g, '');
        if (cleanHeight) {
            const heightVal = validateNumericRange(cleanHeight, 'Height', 50, 260, 'cm');
            if (!heightVal.valid) {
                setSavedMessage({ type: 'warning', text: heightVal.message });
                setTimeout(() => setSavedMessage(null), 5000);
                return;
            }
        }

        // 6. Logical Weight Validation
        const cleanWeight = String(tempData.weight || '').replace(/[^0-9.]/g, '');
        if (cleanWeight) {
            const weightVal = validateNumericRange(cleanWeight, 'Weight', 20, 350, 'kg');
            if (!weightVal.valid) {
                setSavedMessage({ type: 'warning', text: weightVal.message });
                setTimeout(() => setSavedMessage(null), 5000);
                return;
            }
        }

        // 7. Logical Emergency Contact Validation
        if (tempData.emergencyContact && tempData.emergencyContact.trim()) {
            if (tempData.emergencyContact.trim().length < 3) {
                setSavedMessage({ type: 'warning', text: 'Emergency contact details must be at least 3 characters.' });
                setTimeout(() => setSavedMessage(null), 5000);
                return;
            }
        }

        const calculatedBmi = (cleanHeight && cleanWeight && Number(cleanHeight) > 0)
            ? Number((Number(cleanWeight) / Math.pow(Number(cleanHeight) / 100, 2)).toFixed(1))
            : profileData.bmi;

        const updatedProfile = {
            ...tempData,
            height: cleanHeight ? `${cleanHeight} cm` : '',
            weight: cleanWeight ? `${cleanWeight} kg` : '',
            bmi: calculatedBmi
        };

        setProfileData(updatedProfile);

        const updatedUser = await LoginService.updateCurrentUser({
            name: tempData.name.trim(),
            email: tempData.email.trim(),
            phone: tempData.phone.trim(),
            gender: tempData.gender,
            dob: tempData.dob,
            height: updatedProfile.height,
            weight: updatedProfile.weight,
            fitnessGoal: tempData.fitnessGoal,
            medicalHistory: tempData.medicalHistory,
            emergencyContact: tempData.emergencyContact,
            avatar: tempData.avatar
        });

        if (onSaveUser) {
            onSaveUser(updatedUser);
        }

        setIsEditing(false);
        setSavedMessage({ type: 'success', text: 'Profile updated successfully! All changes saved to active session & database.' });
        setTimeout(() => setSavedMessage(null), 5000);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (!passwordData.currentPassword || !passwordData.currentPassword.trim()) {
            setPasswordMessage({ type: 'warning', text: 'Please enter your current password.' });
            return;
        }
        if (!passwordData.newPassword) {
            setPasswordMessage({ type: 'warning', text: 'Please enter a new password.' });
            return;
        }
        if (passwordData.newPassword.length < 8) {
            setPasswordMessage({ type: 'warning', text: 'New password must be at least 8 characters long.' });
            return;
        }
        if (passwordData.newPassword === passwordData.currentPassword) {
            setPasswordMessage({ type: 'warning', text: 'New password cannot be identical to your current password.' });
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;
                setProfileData(prev => ({ ...prev, avatar: base64String }));
                setTempData(prev => ({ ...prev, avatar: base64String }));
                // Persist immediately to active session & storage
                const updated = await LoginService.updateCurrentUser({ avatar: base64String });
                if (onSaveUser) {
                    onSaveUser(updated);
                }
                setSavedMessage({ type: 'success', text: 'Profile picture updated successfully!' });
                setTimeout(() => setSavedMessage(null), 4000);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = async (e) => {
        e.stopPropagation();
        setProfileData(prev => ({ ...prev, avatar: defaultAvatar }));
        setTempData(prev => ({ ...prev, avatar: defaultAvatar }));
        const updated = await LoginService.updateCurrentUser({ avatar: defaultAvatar });
        if (onSaveUser) {
            onSaveUser(updated);
        }
        setSavedMessage({ type: 'success', text: 'Profile picture removed. Reverted to default avatar.' });
        setTimeout(() => setSavedMessage(null), 4000);
    };

    return (
        <div className="space-y-6 animate-fade-in font-sans antialiased">
            {/* System Status Banner */}
            {savedMessage && (
                <div className={`p-4 rounded-2xl font-bold text-xs flex items-center justify-between shadow-lg transition-all ${
                    (savedMessage.type === 'warning' || savedMessage.type === 'danger')
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-500 shadow-amber-500/10'
                        : 'bg-[#00F29D]/15 border border-[#00F29D]/40 text-[#00F29D] shadow-[#00F29D]/10'
                }`}>
                    <div className="flex items-center gap-2.5">
                        <i className={`bi text-base ${
                            (savedMessage.type === 'warning' || savedMessage.type === 'danger')
                                ? 'bi-exclamation-triangle-fill'
                                : 'bi-check-circle-fill'
                        }`}></i>
                        <span>{typeof savedMessage === 'object' ? savedMessage.text : savedMessage}</span>
                    </div>
                    <button
                        onClick={() => setSavedMessage(null)}
                        className="opacity-75 hover:opacity-100 transition-opacity"
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
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick} title="Click to upload/change photo">
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#00F29D] p-1 shadow-[0_0_25px_rgba(0,242,157,0.35)] transition-transform duration-300 group-hover:scale-105 bg-slate-100">
                                    <img
                                        src={profileData.avatar || defaultAvatar}
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
                                    <i className="bi bi-check-lg"></i>
                                </span>
                            </div>

                            {/* Avatar Controls: Upload / Remove */}
                            <div className="flex items-center gap-1.5 pt-1">
                                <button
                                    type="button"
                                    onClick={handleAvatarClick}
                                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all flex items-center gap-1 cursor-pointer"
                                    title="Upload photo from device"
                                >
                                    <i className="bi bi-upload text-[10px]"></i>
                                    <span>Upload</span>
                                </button>
                                {profileData.avatar && profileData.avatar !== defaultAvatar && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveAvatar}
                                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
                                        title="Remove custom photo and revert to default silhouette"
                                    >
                                        <i className="bi bi-trash3 text-[10px]"></i>
                                        <span>Remove</span>
                                    </button>
                                )}
                            </div>
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
                                        maxLength="10"
                                        placeholder="9876543210"
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/[^0-9]/g, '');
                                            const formatted = raw ? `+91 ${raw}` : '';
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
                                    max={new Date().toISOString().split('T')[0]}
                                    value={tempData.dob}
                                    onChange={(e) => setTempData({ ...tempData, dob: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs outline-none focus:border-[#00F29D] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Height (cm)</label>
                                <input
                                    type="number"
                                    min="50"
                                    max="260"
                                    value={String(tempData.height || '').replace(/[^0-9.]/g, '')}
                                    placeholder="e.g. 182"
                                    onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
                                    onChange={(e) => setTempData({ ...tempData, height: e.target.value.replace(/[^0-9.]/g, '') })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs outline-none focus:border-[#00F29D] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Current Weight (kg)</label>
                                <input
                                    type="number"
                                    min="20"
                                    max="350"
                                    step="0.1"
                                    value={String(tempData.weight || '').replace(/[^0-9.]/g, '')}
                                    placeholder="e.g. 78.5"
                                    onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
                                    onChange={(e) => setTempData({ ...tempData, weight: e.target.value.replace(/[^0-9.]/g, '') })}
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
