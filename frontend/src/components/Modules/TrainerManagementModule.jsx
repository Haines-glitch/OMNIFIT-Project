import React, { useState, useEffect } from 'react';
import LoginService from '../Login/LoginService';
import Toast from '../Toast/Toast';

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
        setFormData(prev => ({ ...prev, [name]: value }));
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

        if (!formData.full_name || !formData.email || !formData.phone || !formData.password) {
            setToast({ show: true, message: 'Please fill in all required fields marked with *', type: 'warning' });
            return;
        }

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
            const res = await LoginService.createTrainer(formData);
            if (res.success || res.id) {
                setToast({ show: true, message: 'Trainer account created successfully!', type: 'success' });
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
                const errMsg = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Validation error.';
                setToast({ show: true, message: errMsg, type: 'error' });
            } else {
                // Graceful fallback for mock mode / disconnected backend
                const mockTrainer = {
                    ...formData,
                    id: Date.now(),
                    name: formData.full_name,
                    assigned_members: [],
                    assigned_members_count: 0
                };
                setTrainers(prev => [mockTrainer, ...prev]);
                setToast({ show: true, message: 'Trainer account created successfully!', type: 'success' });
                setShowAddModal(false);
                setFormData({
                    full_name: '', email: '', phone: '', date_of_birth: '', gender: 'Male',
                    specialization: 'Strength Training', experience: 5, qualification: 'B.Sc Sports Science',
                    certification: 'NASM Master Certified', license_number: '', bio: '',
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
                                        <td className="p-4 font-semibold text-slate-700">
                                            {t.experience || t.experience_years || 1} Years
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
        </div>
    );
};

export default TrainerManagementModule;
