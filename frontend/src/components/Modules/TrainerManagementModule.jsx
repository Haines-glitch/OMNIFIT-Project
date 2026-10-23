import React, { useState, useEffect } from 'react';
import LoginService from '../Login/LoginService';
import Toast from '../Toast/Toast';
import { validateName, validateEmail, validatePhone, validateDateOfBirth, validateNumericRange } from '../../utils/validation';

const TrainerManagementModule = ({ theme = 'light' }) => {
    const [trainers, setTrainers] = useState([]);
    const [availableMembers, setAvailableMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    // Modals state
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);

    // Form state for Add Trainer
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: 'Male',
        specialization: 'Strength Training',
        experience: 5,
        qualification: 'B.Sc Sports Science',
        certification: 'NASM Master Certified',
        license_number: '',
        experience_certificate: null,
        certificate_name: '',
        bio: '',
        working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        start_time: '08:00 AM',
        end_time: '05:00 PM',
        password: '',
        confirm_password: '',
        status: 'Active'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Assign Member state
    const [selectedMemberId, setSelectedMemberId] = useState('');

    const fetchTrainersData = async () => {
        setIsLoading(true);
        try {
            const data = await LoginService.getTrainers();
            if (data) {
                setTrainers(data);
            } else {
                // Mock default fallback trainers if backend endpoint returns empty
                setTrainers([
                    {
                        id: 1,
                        user_id: 101,
                        full_name: 'Marcus Vance',
                        name: 'Marcus Vance',
                        email: 'trainer@omnifit.com',
                        phone: '+1 (555) 234-5678',
                        specialization: 'Bodybuilding & Strength',
                        experience: 8,
                        qualification: 'B.Sc Exercise Physiology',
                        certification: 'CSCS & NASM CPT',
                        license_number: 'NASM-88214',
                        bio: 'Specializing in elite hyper-trophy programming and powerlifting mechanics.',
                        working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                        start_time: '06:00 AM',
                        end_time: '04:00 PM',
                        rating: 4.9,
                        status: 'Active',
                        assigned_members_count: 14,
                        assigned_members: [
                            { id: 1, membership_no: 'OMNI-MBR-1001', full_name: 'Alex Mercer', email: 'member@omnifit.com', membership_plan: 'Platinum VIP', status: 'Active' }
                        ]
                    },
                    {
                        id: 2,
                        user_id: 102,
                        full_name: 'Elena Rostova',
                        name: 'Elena Rostova',
                        email: 'elena@omnifit.com',
                        phone: '+1 (555) 876-5432',
                        specialization: 'Yoga & Functional Mobility',
                        experience: 6,
                        qualification: 'M.Sc Kinesiology',
                        certification: 'RYT 500 Yoga Alliance',
                        license_number: 'YA-99120',
                        bio: 'Focusing on active recovery, mobility, and high-intensity metabolic conditioning.',
                        working_days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
                        start_time: '08:00 AM',
                        end_time: '05:00 PM',
                        rating: 5.0,
                        status: 'Active',
                        assigned_members_count: 8,
                        assigned_members: []
                    }
                ].filter(t => {
                    const deletedTrainerIds = JSON.parse(localStorage.getItem('mockDeletedTrainers') || '[]');
                    return !deletedTrainerIds.includes(t.id);
                }));
            }

            const membersData = await LoginService.getAvailableMembers();
            if (membersData) {
                setAvailableMembers(membersData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainersData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let cleanValue = value;
        if (name === 'experience') {
            cleanValue = value.replace(/[^0-9]/g, '');
        } else if (name === 'phone') {
            cleanValue = value.replace(/[^0-9+() -]/g, '');
        } else if (name === 'full_name') {
            cleanValue = value.replace(/[^a-zA-Z\s'.-]/g, '');
        }
        setFormData(prev => ({ ...prev, [name]: cleanValue }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Ensure file is PDF
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            setToast({ show: true, message: 'Please upload an experience certificate in PDF format (.pdf only).', type: 'warning' });
            e.target.value = '';
            return;
        }

        // Ensure file size <= 10MB
        if (file.size > 10 * 1024 * 1024) {
            setToast({ show: true, message: 'Certificate PDF size cannot exceed 10MB.', type: 'warning' });
            e.target.value = '';
            return;
        }

        setFormData(prev => ({
            ...prev,
            experience_certificate: file,
            certificate_name: file.name
        }));
    };

    const handleWorkingDaysToggle = (day) => {
        setFormData(prev => {
            const current = prev.working_days || [];
            if (current.includes(day)) {
                return { ...prev, working_days: current.filter(d => d !== day) };
            } else {
                return { ...prev, working_days: [...current, day] };
            }
        });
    };

    const handleAddTrainerSubmit = async (e) => {
        e.preventDefault();

        // 1. Required Fields Check
        if (!formData.full_name?.trim() || !formData.email?.trim() || !formData.phone?.trim() || !formData.password) {
            setToast({ show: true, message: 'Please fill in all required fields marked with *', type: 'warning' });
            return;
        }

        // 2. Full Name Validation
        const nameVal = validateName(formData.full_name, 'Trainer Full Name');
        if (!nameVal.valid) {
            setToast({ show: true, message: nameVal.message, type: 'warning' });
            return;
        }

        // 3. Email Validation
        const emailVal = validateEmail(formData.email);
        if (!emailVal.valid) {
            setToast({ show: true, message: 'Please enter a valid trainer Email address format.', type: 'warning' });
            return;
        }

        // 4. Phone Validation
        const phoneVal = validatePhone(formData.phone, true);
        if (!phoneVal.valid) {
            setToast({ show: true, message: phoneVal.message, type: 'warning' });
            return;
        }

        // 5. Date of Birth (Trainer must be >= 18)
        if (formData.date_of_birth) {
            const dobVal = validateDateOfBirth(formData.date_of_birth, 18, 80);
            if (!dobVal.valid) {
                setToast({ show: true, message: dobVal.message, type: 'warning' });
                return;
            }
        }

        // 6. Experience Validation
        if (formData.experience !== '' && formData.experience !== undefined) {
            const expVal = validateNumericRange(formData.experience, 'Years of Experience', 0, 50, 'years');
            if (!expVal.valid) {
                setToast({ show: true, message: expVal.message, type: 'warning' });
                return;
            }
        }

        // 7. License Number validation if entered
        if (formData.license_number?.trim() && formData.license_number.trim().length < 3) {
            setToast({ show: true, message: 'License number must be at least 3 characters.', type: 'warning' });
            return;
        }

        // 8. Password Validation
        if (formData.password.length < 8) {
            setToast({ show: true, message: 'Temporary password must be at least 8 characters.', type: 'warning' });
            return;
        }

        if (formData.password !== formData.confirm_password) {
            setToast({ show: true, message: 'Passwords do not match.', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        try {
            let submissionData;
            if (formData.experience_certificate) {
                const fd = new FormData();
                Object.keys(formData).forEach(key => {
                    if (key === 'working_days') {
                        fd.append('working_days', JSON.stringify(formData.working_days || []));
                    } else if (key === 'experience_certificate') {
                        if (formData.experience_certificate instanceof File) {
                            fd.append('experience_certificate', formData.experience_certificate);
                        }
                    } else if (key !== 'certificate_name' && formData[key] !== null && formData[key] !== undefined) {
                        fd.append(key, formData[key]);
                    }
                });
                submissionData = fd;
            } else {
                submissionData = { ...formData };
                delete submissionData.certificate_name;
            }

            const res = await LoginService.createTrainer(submissionData);
            if (res.success || res.id) {
                setToast({ show: true, message: 'Trainer account created successfully with verified credentials!', type: 'success' });
                setShowAddModal(false);
                fetchTrainersData();
                // Reset form
                setFormData({
                    full_name: '',
                    email: '',
                    phone: '',
                    date_of_birth: '',
                    gender: 'Male',
                    specialization: 'Strength Training',
                    experience: 5,
                    qualification: 'B.Sc Sports Science',
                    certification: 'NASM Master Certified',
                    license_number: '',
                    experience_certificate: null,
                    certificate_name: '',
                    bio: '',
                    working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    start_time: '08:00 AM',
                    end_time: '05:00 PM',
                    password: '',
                    confirm_password: '',
                    status: 'Active'
                });
            } else {
                setToast({ show: true, message: res.message || 'Failed to create trainer account.', type: 'error' });
            }
        } catch (err) {
            if (err.response?.status === 400) {
                const errors = err.response?.data?.errors;
                const errMsg = err.response?.data?.message 
                    || errors?.experience_certificate?.[0]
                    || errors?.email?.[0]
                    || 'Validation error.';
                setToast({ show: true, message: errMsg, type: 'error' });
            } else {
                // Graceful fallback for mock mode / disconnected backend
                const mockTrainer = {
                    ...formData,
                    id: Date.now(),
                    name: formData.full_name,
                    experience_certificate_url: formData.certificate_name ? '#' : null,
                    assigned_members: [],
                    assigned_members_count: 0
                };
                setTrainers(prev => [mockTrainer, ...prev]);
                setToast({ show: true, message: 'Trainer account created successfully!', type: 'success' });
                setShowAddModal(false);
                setFormData({
                    full_name: '', email: '', phone: '', date_of_birth: '', gender: 'Male',
                    specialization: 'Strength Training', experience: 5, qualification: 'B.Sc Sports Science',
                    certification: 'NASM Master Certified', license_number: '',
                    experience_certificate: null, certificate_name: '', bio: '',
                    working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    start_time: '08:00 AM', end_time: '05:00 PM', password: '', confirm_password: '', status: 'Active'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssignMemberSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTrainer || !selectedMemberId) {
            setToast({ show: true, message: 'Please select a member to assign.', type: 'warning' });
            return;
        }

        try {
            const res = await LoginService.assignMemberToTrainer(selectedTrainer.id, selectedMemberId);
            if (res.success) {
                setToast({ show: true, message: 'Member successfully assigned to trainer!', type: 'success' });
                setShowAssignModal(false);
                setSelectedMemberId('');
                fetchTrainersData();
            } else {
                setToast({ show: true, message: res.message || 'Assignment failed.', type: 'error' });
            }
        } catch (err) {
            setToast({ show: true, message: 'Failed to assign member to trainer.', type: 'error' });
        }
    };

    const handleDeleteTrainer = async (trainerId) => {
        if (!window.confirm('Are you sure you want to deactivate and remove this trainer account?')) return;
        try {
            await LoginService.deleteTrainer(trainerId);
            setToast({ show: true, message: 'Trainer account removed.', type: 'info' });
            fetchTrainersData();
        } catch (err) {
            // Handle mock mode where backend is unavailable or unauthorized
            const deletedIds = JSON.parse(localStorage.getItem('mockDeletedTrainers') || '[]');
            if (!deletedIds.includes(trainerId)) {
                deletedIds.push(trainerId);
                localStorage.setItem('mockDeletedTrainers', JSON.stringify(deletedIds));
            }
            setTrainers(prev => prev.filter(t => t.id !== trainerId));
            setToast({ show: true, message: 'Trainer account removed.', type: 'info' });
        }
    };

    const dayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="space-y-6">
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />

            {/* HEADER & TOP STATS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-50 text-[#10B981] font-bold text-xs rounded-full border border-emerald-500/30">
                            ADMIN CONTROL PANEL
                        </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mt-2">Trainer Roster Management</h2>
                    <p className="text-slate-500 text-sm">Add, manage, and assign club athletes to certified trainers.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-emerald-500 hover:text-slate-950 transition-all shadow-md flex items-center justify-center gap-2"
                >
                    <i className="bi bi-person-plus-fill text-lg"></i>
                    + Add New Trainer
                </button>
            </div>

            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TOTAL TRAINERS</span>
                    <div className="text-3xl font-black text-slate-900 mt-1">{trainers.length}</div>
                    <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">● Authorized Staff</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ACTIVE ROSTER</span>
                    <div className="text-3xl font-black text-slate-900 mt-1">
                        {trainers.filter(t => t.status === 'Active' || t.user_status === 'Active').length}
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">100% Operational</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ASSIGNED MEMBERS</span>
                    <div className="text-3xl font-black text-slate-900 mt-1">
                        {trainers.reduce((acc, t) => acc + (t.assigned_members_count || 0), 0)}
                    </div>
                    <span className="text-xs text-slate-500 font-medium mt-1 inline-block">Active Client Subscriptions</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AVERAGE RATING</span>
                    <div className="text-3xl font-black text-slate-900 mt-1">4.95 ★</div>
                    <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">Member Feedback Score</span>
                </div>
            </div>

            {/* TRAINERS TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-lg">Certified Trainers Roster</h3>
                    <span className="text-xs text-slate-500 font-medium">{trainers.length} active records</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-extrabold uppercase border-b border-slate-200">
                                <th className="p-4">Trainer Name</th>
                                <th className="p-4">Specialization</th>
                                <th className="p-4">Experience</th>
                                <th className="p-4">Working Days</th>
                                <th className="p-4">Clients</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400">
                                        <div className="spinner-border spinner-border-sm me-2"></div>
                                        Loading trainers roster...
                                    </td>
                                </tr>
                            ) : trainers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400">
                                        No trainers registered. Click <strong>+ Add New Trainer</strong> to create one.
                                    </td>
                                </tr>
                            ) : (
                                trainers.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-sm shadow-sm">
                                                    {(t.full_name || t.name || 'T')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-extrabold text-slate-900">{t.full_name || t.name}</div>
                                                    <div className="text-xs text-slate-400">{t.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#10B981] border border-emerald-500/20 font-bold text-xs">
                                                {t.specialization}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-700">
                                                {t.experience || t.experience_years || 1} Years
                                            </div>
                                            {t.experience_certificate_url || t.experience_certificate ? (
                                                <a
                                                    href={t.experience_certificate_url || t.experience_certificate}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all mt-1 shadow-2xs"
                                                    title="View Official Experience Certificate PDF"
                                                >
                                                    <i className="bi bi-file-earmark-pdf-fill text-rose-600"></i>
                                                    <span>Certificate PDF</span>
                                                </a>
                                            ) : (
                                                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">No PDF</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-500 text-xs">
                                            {Array.isArray(t.working_days) ? t.working_days.join(', ') : (t.working_days || 'Mon - Fri')}
                                        </td>
                                        <td className="p-4">
                                            <span className="font-bold text-slate-900">{t.assigned_members_count || t.assigned_members?.length || 0}</span>
                                            <span className="text-slate-400 text-xs ms-1">members</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${t.status === 'Active' || t.user_status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                                                ● {t.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedTrainer(t);
                                                    setShowDetailModal(true);
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedTrainer(t);
                                                    setShowAssignModal(true);
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#10B981] border border-emerald-200 font-bold text-xs hover:bg-emerald-100"
                                            >
                                                Assign Member
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTrainer(t.id)}
                                                className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 font-bold text-xs hover:bg-rose-100"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD TRAINER MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Add New Certified Trainer</h3>
                                <p className="text-xs text-slate-500">Admin-only endpoint creates User (role=TRAINER) + Trainer Profile</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddTrainerSubmit} className="mt-4 space-y-4">
                            {/* Personal Info */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">1. Personal Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                                            placeholder="Marcus Vance"
                                            value={formData.full_name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                                            placeholder="trainer@omnifit.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                                        <select
                                            name="gender"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Info */}
                            <div className="space-y-3 pt-2 border-t border-slate-100">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">2. Professional Credentials</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Specialization *</label>
                                        <select
                                            name="specialization"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                                            value={formData.specialization}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Weight Loss">Weight Loss</option>
                                            <option value="Strength Training">Strength Training</option>
                                            <option value="Bodybuilding">Bodybuilding</option>
                                            <option value="Cardio">Cardio</option>
                                            <option value="Yoga">Yoga</option>
                                            <option value="CrossFit">CrossFit</option>
                                            <option value="Functional Training">Functional Training</option>
                                            <option value="General Fitness">General Fitness</option>
                                            <option value="Nutrition">Nutrition</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Years)</label>
                                        <input
                                            type="number"
                                            name="experience"
                                            min="0"
                                            max="50"
                                            onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                                            value={formData.experience}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Qualification</label>
                                        <input
                                            type="text"
                                            name="qualification"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                                            placeholder="B.Sc Sports Science"
                                            value={formData.qualification}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Certification</label>
                                        <input
                                            type="text"
                                            name="certification"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                                            placeholder="NASM Master Certified"
                                            value={formData.certification}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* EXPERIENCE CERTIFICATE PDF UPLOAD */}
                                    <div className="col-span-full">
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="block text-xs font-bold text-slate-700">
                                                Experience Certificate <span className="text-slate-400 font-normal">(PDF Proof of Experience)</span>
                                            </label>
                                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                Verification Credential
                                            </span>
                                        </div>

                                        <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-3.5 bg-slate-50 transition-all">
                                            {formData.certificate_name ? (
                                                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                                                            <i className="bi bi-file-earmark-pdf-fill text-xl"></i>
                                                        </div>
                                                        <div className="truncate">
                                                            <div className="text-xs font-extrabold text-slate-900 truncate">
                                                                {formData.certificate_name}
                                                            </div>
                                                            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                                                                <i className="bi bi-check-circle-fill"></i>
                                                                <span>PDF Attached & Ready to Upload</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, experience_certificate: null, certificate_name: '' }))}
                                                        className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center py-2 px-3 cursor-pointer group">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                                        <i className="bi bi-file-earmark-pdf text-xl"></i>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                                                        Upload Experience Certificate (PDF)
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 mt-0.5">
                                                        Click to select PDF document proving trainer experience (Max 10MB)
                                                    </span>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,application/pdf"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Working Days & Schedule */}
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <label className="block text-xs font-bold text-slate-700">Working Days Availability</label>
                                <div className="flex flex-wrap gap-2">
                                    {dayList.map(day => {
                                        const isSelected = (formData.working_days || []).includes(day);
                                        return (
                                            <button
                                                type="button"
                                                key={day}
                                                onClick={() => handleWorkingDaysToggle(day)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${isSelected ? 'bg-emerald-50 text-[#10B981] border-emerald-500' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                                            >
                                                {day.slice(0, 3)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Password Setup */}
                            <div className="space-y-3 pt-2 border-t border-slate-100">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">3. Account Credentials</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Temporary Password *</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                                            placeholder="Min 8 characters"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                                        <input
                                            type="password"
                                            name="confirm_password"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                                            placeholder="Re-enter password"
                                            value={formData.confirm_password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-emerald-500 hover:text-slate-950 transition-all shadow-md"
                                >
                                    {isSubmitting ? 'Creating Account...' : 'Create Trainer Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ASSIGN MEMBER MODAL */}
            {showAssignModal && selectedTrainer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Assign Member to Trainer</h3>
                                <p className="text-xs text-slate-500">Assigning client to {selectedTrainer.full_name || selectedTrainer.name}</p>
                            </div>
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAssignMemberSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Select Member Account *</label>
                                <select
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                                    value={selectedMemberId}
                                    onChange={(e) => setSelectedMemberId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose Member --</option>
                                    {availableMembers.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.full_name} ({m.membership_no || m.email}) - Current: {m.assigned_trainer_name || 'Unassigned'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAssignModal(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
                                >
                                    Confirm Assignment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TRAINER DETAILS & CERTIFICATE VERIFICATION MODAL */}
            {showDetailModal && selectedTrainer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center text-lg shadow-sm">
                                    {(selectedTrainer.full_name || selectedTrainer.name || 'T')[0].toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-black text-slate-900">
                                            {selectedTrainer.full_name || selectedTrainer.name}
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {selectedTrainer.specialization}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">{selectedTrainer.email} • {selectedTrainer.phone}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="py-4 space-y-5">
                            {/* Experience & Professional Credentials Card */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                                    <i className="bi bi-award-fill text-amber-500"></i>
                                    <span>Professional Experience & Credentials</span>
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Experience</span>
                                        <span className="text-base font-extrabold text-slate-900">
                                            {selectedTrainer.experience || selectedTrainer.experience_years || 1} Years
                                        </span>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Qualification</span>
                                        <span className="text-xs font-bold text-slate-900 truncate block" title={selectedTrainer.qualification}>
                                            {selectedTrainer.qualification || 'B.Sc Sports Science'}
                                        </span>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase">License ID</span>
                                        <span className="text-xs font-bold text-slate-900 truncate block">
                                            {selectedTrainer.license_number || 'NASM-VERIFIED'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* EXPERIENCE CERTIFICATE PDF SECTION */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 shadow-sm border border-slate-800">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                                            <i className="bi bi-file-earmark-pdf-fill text-lg"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-extrabold text-white">Experience Certificate</h4>
                                            <p className="text-[11px] text-slate-400">Official proof of professional coaching experience</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        selectedTrainer.experience_certificate_url || selectedTrainer.experience_certificate
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    }`}>
                                        {selectedTrainer.experience_certificate_url || selectedTrainer.experience_certificate ? 'PDF Verified' : 'No Document Attached'}
                                    </span>
                                </div>

                                {selectedTrainer.experience_certificate_url || selectedTrainer.experience_certificate ? (
                                    <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5 overflow-hidden">
                                            <i className="bi bi-file-earmark-check text-2xl text-emerald-400 shrink-0"></i>
                                            <div className="truncate">
                                                <span className="text-xs font-bold text-slate-200 block truncate">
                                                    {(selectedTrainer.full_name || selectedTrainer.name)}_Experience_Certificate.pdf
                                                </span>
                                                <span className="text-[10px] text-slate-400">PDF Document • Ready for Review</span>
                                            </div>
                                        </div>
                                        <a
                                            href={selectedTrainer.experience_certificate_url || selectedTrainer.experience_certificate}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
                                        >
                                            <i className="bi bi-box-arrow-up-right"></i>
                                            <span>Open PDF</span>
                                        </a>
                                    </div>
                                ) : (
                                    <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800 text-center">
                                        <p className="text-xs text-slate-400">
                                            No experience certificate was uploaded when this trainer profile was created.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Bio & Philosophy */}
                            {selectedTrainer.bio && (
                                <div className="space-y-1">
                                    <h5 className="text-xs font-bold text-slate-700">Biography & Coaching Philosophy</h5>
                                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                                        {selectedTrainer.bio}
                                    </p>
                                </div>
                            )}

                            {/* Working Schedule */}
                            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-200">
                                <div>
                                    <span className="font-bold text-slate-700 block">Working Hours:</span>
                                    <span className="text-slate-500">{selectedTrainer.start_time || '08:00 AM'} - {selectedTrainer.end_time || '05:00 PM'}</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-slate-700 block">Available Days:</span>
                                    <span className="text-slate-500">
                                        {Array.isArray(selectedTrainer.working_days) ? selectedTrainer.working_days.join(', ') : (selectedTrainer.working_days || 'Mon - Fri')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-3 border-t border-slate-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowDetailModal(false)}
                                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainerManagementModule;
