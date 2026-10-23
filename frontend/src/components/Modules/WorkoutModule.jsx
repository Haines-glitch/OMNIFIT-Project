import React, { useState, useEffect } from 'react';
import { validateText } from '../../utils/validation';
import { 
    getTrainerAssignedMembers, 
    assignWorkoutRoutine, 
    getMemberTodayWorkout, 
    toggleExerciseStatus 
} from '../../services/dashboardService';
import LoginService from '../Login/LoginService';

const WorkoutModule = ({ 
    role = 'MEMBER', 
    theme = 'dark', 
    initialMemberEmail = null,
    userEmail = null,
    activeRoutine = null,
    onToggleExercise = null
}) => {
    const isTrainerOrAdmin = role === 'TRAINER' || role === 'ADMIN';
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = ['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Cardio', 'Full Body'];

    // Active sub-tab for members: 'assigned' (Today's Assigned Routine) vs 'catalog' (Movement Library)
    const [activeTab, setActiveTab] = useState('assigned');

    // Member assigned workout state
    const [memberRoutine, setMemberRoutine] = useState(activeRoutine || null);
    const [routineExercises, setRoutineExercises] = useState(activeRoutine?.exercises || []);
    const [isLoadingRoutine, setIsLoadingRoutine] = useState(false);

    // Assigned athletes list for trainers
    const [assignedAthletes, setAssignedAthletes] = useState([]);
    const [selectedAthleteEmail, setSelectedAthleteEmail] = useState(initialMemberEmail || '');
    const [routineTitle, setRoutineTitle] = useState('Chest & Triceps Hypertrophy');
    const [routineDifficulty, setRoutineDifficulty] = useState('Intermediate');

    // Exercise items to prescribe
    const [prescribeExercises, setPrescribeExercises] = useState([
        { id: 1, name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', targetLoad: '26 kg', notes: 'Maintain 30-degree incline, solid stretch' },
        { id: 2, name: 'Weighted Tricep Dips', sets: 3, reps: '12', targetLoad: '+15 kg', notes: 'Full depth and vertical chest lock' }
    ]);

    const [formFeedback, setFormFeedback] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Default library workouts
    const [workouts, setWorkouts] = useState([
        { id: 1, name: 'Incline Barbell Bench Press', category: 'Chest', sets: 4, reps: '10', duration: '20 mins', calories: 220, difficulty: 'Intermediate', notes: 'Maintain 30-degree bench angle' },
        { id: 2, name: 'Seated Cable Row', category: 'Back', sets: 4, reps: '12', duration: '18 mins', calories: 190, difficulty: 'Beginner', notes: 'Squeeze shoulder blades at peak' },
        { id: 3, name: 'Overhead Barbell Press', category: 'Shoulders', sets: 3, reps: '8', duration: '15 mins', calories: 170, difficulty: 'Advanced', notes: 'Keep core engaged' },
        { id: 4, name: 'High-Intensity Treadmill Sprints', category: 'Cardio', sets: 5, reps: '30s Sprint', duration: '15 mins', calories: 280, difficulty: 'Intermediate', notes: '140+ BPM target heart rate' },
        { id: 5, name: 'Barbell Back Squats', category: 'Legs', sets: 4, reps: '8-10', duration: '25 mins', calories: 310, difficulty: 'Advanced', notes: 'Below parallel depth' },
        { id: 6, name: 'Hanging Leg Raises', category: 'Core', sets: 4, reps: '15', duration: '12 mins', calories: 140, difficulty: 'Intermediate', notes: 'Control hip flexion' },
    ]);

    // Load assigned routine for member on mount or prop change
    useEffect(() => {
        if (!isTrainerOrAdmin) {
            if (activeRoutine && activeRoutine.exercises && activeRoutine.exercises.length > 0) {
                setMemberRoutine(activeRoutine);
                setRoutineExercises(activeRoutine.exercises);
            } else {
                const targetEmail = userEmail || LoginService.getCurrentUser()?.email;
                setIsLoadingRoutine(true);
                getMemberTodayWorkout(targetEmail).then(res => {
                    if (res) {
                        setMemberRoutine(res);
                        if (res.exercises && res.exercises.length > 0) {
                            setRoutineExercises(res.exercises);
                        }
                    }
                }).catch(err => {
                    console.warn('Error loading member routine:', err);
                }).finally(() => {
                    setIsLoadingRoutine(false);
                });
            }
        }
    }, [isTrainerOrAdmin, userEmail, activeRoutine]);

    // Load assigned athletes if trainer
    useEffect(() => {
        if (isTrainerOrAdmin) {
            getTrainerAssignedMembers().then(res => {
                const list = res?.data || res || [];
                if (list.length > 0) {
                    setAssignedAthletes(list);
                    if (!selectedAthleteEmail) {
                        setSelectedAthleteEmail(list[0].email);
                    }
                }
            }).catch(err => {
                console.warn('Could not load assigned members:', err);
            });
        }
    }, [isTrainerOrAdmin]);

    const addExerciseRow = () => {
        setPrescribeExercises(prev => [
            ...prev,
            { id: Date.now(), name: '', sets: 4, reps: '10', targetLoad: '20 kg', notes: '' }
        ]);
    };

    const removeExerciseRow = (id) => {
        if (prescribeExercises.length <= 1) return;
        setPrescribeExercises(prev => prev.filter(e => e.id !== id));
    };

    const updateExerciseRow = (id, field, value) => {
        setPrescribeExercises(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const handlePrescribeRoutine = async (e) => {
        e.preventDefault();
        setFormFeedback(null);

        if (!selectedAthleteEmail) {
            setFormFeedback({ type: 'warning', message: 'Please select an assigned athlete to prescribe a workout for.' });
            return;
        }

        const titleVal = validateText(routineTitle, 'Routine Title', 3, 80);
        if (!titleVal.valid) {
            setFormFeedback({ type: 'warning', message: titleVal.message });
            return;
        }

        const validExercises = prescribeExercises.filter(ex => ex.name.trim().length > 0);
        if (validExercises.length === 0) {
            setFormFeedback({ type: 'warning', message: 'Please specify at least one valid exercise name.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                email: selectedAthleteEmail,
                title: routineTitle.trim(),
                description: `Trainer prescribed ${routineDifficulty} routine for today.`,
                difficulty: routineDifficulty,
                exercises: validExercises.map(ex => ({
                    name: ex.name.trim(),
                    setsReps: `${ex.sets} x ${ex.reps}`,
                    targetLoad: ex.targetLoad || '20 kg',
                    notes: ex.notes || 'Progressive overload'
                }))
            };

            await assignWorkoutRoutine(payload);
            const targetAthlete = assignedAthletes.find(a => a.email === selectedAthleteEmail);
            const athleteName = targetAthlete?.name || selectedAthleteEmail;

            setFormFeedback({
                type: 'success',
                message: `Workout plan "${routineTitle}" successfully assigned to ${athleteName} for today! They will see this on their dashboard.`
            });

            // Add top exercise to local library view
            setWorkouts(prev => [
                {
                    id: Date.now(),
                    name: validExercises[0].name,
                    category: 'Chest',
                    sets: validExercises[0].sets,
                    reps: validExercises[0].reps,
                    duration: '20 mins',
                    calories: 220,
                    difficulty: routineDifficulty,
                    notes: `Assigned to ${athleteName}: ${validExercises[0].notes || ''}`
                },
                ...prev
            ]);
        } catch (err) {
            setFormFeedback({
                type: 'error',
                message: 'Failed to assign routine to athlete. Please check network connection.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Toggle exercise status for member
    const handleToggleExercise = async (id) => {
        const updated = routineExercises.map(ex => {
            if (ex.id === id) {
                const nextStatus = ex.status === 'Completed' ? 'Pending' : 'Completed';
                return { ...ex, status: nextStatus };
            }
            return ex;
        });
        setRoutineExercises(updated);

        if (onToggleExercise) {
            onToggleExercise(id);
        } else {
            try {
                await toggleExerciseStatus(id);
            } catch (err) {
                console.warn('Exercise toggle failed on server:', err);
            }
        }
    };

    const filteredWorkouts = selectedCategory === 'All'
        ? workouts
        : workouts.filter(w => w.category === selectedCategory);

    // Telemetry calculations for member's assigned routine
    const totalAssigned = routineExercises.length;
    const completedAssigned = routineExercises.filter(e => e.status === 'Completed').length;
    const completionPct = totalAssigned > 0 ? Math.round((completedAssigned / totalAssigned) * 100) : 0;

    return (
        <div className="space-y-6 animate-fade-in font-sans antialiased text-white">
            {/* Top Navigation / Tab Switcher */}
            <div className="p-6 bg-[#121217] border border-[#22222a] rounded-3xl shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E28] shadow-[0_0_8px_#FF1E28]"></span>
                            <h3 className="text-xl font-black text-white tracking-tight">Workout Performance Engine</h3>
                        </div>
                        <p className="text-xs text-zinc-400 font-medium">
                            {isTrainerOrAdmin 
                                ? 'Prescribe personalized daily routines & track athlete overload' 
                                : 'Individualized daily routines prescribed by your personal coach'}
                        </p>
                    </div>

                    {isTrainerOrAdmin ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#E50914]/15 text-[#FF1E28] border border-[#E50914]/40 tracking-wider uppercase shadow-[0_0_10px_rgba(229,9,20,0.2)]">
                            <i className="bi bi-person-check-fill me-1"></i> TRAINER ASSIGNMENT MODE
                        </span>
                    ) : (
                        <div className="flex items-center gap-2 bg-[#181820] p-1.5 rounded-2xl border border-[#262634]">
                            <button
                                onClick={() => setActiveTab('assigned')}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                                    activeTab === 'assigned'
                                        ? 'bg-gradient-to-r from-[#E50914] to-[#B80710] text-white shadow-[0_0_12px_rgba(229,9,20,0.4)]'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                <i className="bi bi-lightning-charge-fill text-[#FF1E28]"></i>
                                <span>Today's Assigned Routine</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    activeTab === 'assigned' ? 'bg-black/40 text-white' : 'bg-zinc-800 text-zinc-400'
                                }`}>
                                    {totalAssigned}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveTab('catalog')}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                                    activeTab === 'catalog'
                                        ? 'bg-gradient-to-r from-[#E50914] to-[#B80710] text-white shadow-[0_0_12px_rgba(229,9,20,0.4)]'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                <i className="bi bi-collection-play-fill text-zinc-400"></i>
                                <span>Movement Library</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Category Pills (Visible when in catalog view or for trainers) */}
                {(isTrainerOrAdmin || activeTab === 'catalog') && (
                    <div className="flex gap-2 overflow-x-auto pt-2 scrollbar-none border-t border-[#1f1f28]">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                                    selectedCategory === cat
                                        ? 'bg-[#E50914] text-white shadow-[0_0_12px_rgba(229,9,20,0.4)]'
                                        : 'bg-[#181820] text-zinc-400 hover:text-white border border-[#262634]'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* MEMBER VIEW: TODAY'S ASSIGNED ROUTINE HERO & CHECKLIST */}
            {!isTrainerOrAdmin && activeTab === 'assigned' && (
                <div className="space-y-6">
                    {isLoadingRoutine ? (
                        <div className="p-12 rounded-3xl bg-[#121217] border border-[#22222a] text-center space-y-3">
                            <span className="spinner-border text-[#FF1E28]" role="status"></span>
                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Synchronizing Assigned Daily Routine...</p>
                        </div>
                    ) : totalAssigned > 0 ? (
                        <>
                            {/* Assigned Routine Hero Header Card */}
                            <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-[#121217] border border-[#22222a] shadow-2xl">
                                <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#E50914]/15 rounded-full blur-3xl pointer-events-none"></div>
                                
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                                    <div className="space-y-3 max-w-2xl">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/15 border border-[#E50914]/40 shadow-[0_0_12px_rgba(229,9,20,0.25)]">
                                            <span className="w-2 h-2 rounded-full bg-[#FF1E28] animate-pulse shadow-[0_0_8px_#FF1E28]"></span>
                                            <span className="text-[10px] font-black text-[#FF1E28] uppercase tracking-widest">
                                                COACH-PRESCRIBED DAILY ROUTINE
                                            </span>
                                        </div>

                                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                            {memberRoutine?.routine_title || memberRoutine?.title || 'Personalized Overload Routine'}
                                        </h2>

                                        <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
                                            {memberRoutine?.description || "Engineered specifically for your target muscle groups and overload targets."}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-3 pt-2">
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181820] border border-[#2a2a38] text-xs">
                                                <i className="bi bi-person-badge text-[#FF1E28]"></i>
                                                <span className="text-zinc-400">Coach:</span>
                                                <span className="font-extrabold text-white">{memberRoutine?.coach || 'Marcus Vance'}</span>
                                            </div>

                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181820] border border-[#2a2a38] text-xs">
                                                <i className="bi bi-speedometer2 text-amber-400"></i>
                                                <span className="text-zinc-400">Difficulty:</span>
                                                <span className="font-extrabold text-amber-300">{memberRoutine?.difficulty || 'Intermediate'}</span>
                                            </div>

                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181820] border border-[#2a2a38] text-xs">
                                                <i className="bi bi-calendar-event text-zinc-400"></i>
                                                <span className="text-zinc-400">Assigned:</span>
                                                <span className="font-extrabold text-white">{memberRoutine?.assigned_date || 'Today'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Completion Meter */}
                                    <div className="p-5 rounded-2xl bg-[#181820] border border-[#262634] lg:w-72 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Today's Progress</span>
                                            <span className="text-xs font-black text-[#FF1E28]">{completionPct}% Done</span>
                                        </div>

                                        <div className="w-full h-2.5 rounded-full bg-[#121217] overflow-hidden p-0.5 border border-[#262634]">
                                            <div 
                                                className="h-full rounded-full bg-gradient-to-r from-[#B80710] to-[#FF1E28] shadow-[0_0_12px_rgba(229,9,20,0.5)] transition-all duration-500" 
                                                style={{ width: `${completionPct}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                                            <span>Completed Sets:</span>
                                            <strong className="text-white">{completedAssigned} of {totalAssigned} Exercises</strong>
                                        </div>

                                        {completionPct === 100 && (
                                            <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[10px] font-black text-center flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                                <i className="bi bi-trophy-fill text-amber-400"></i>
                                                <span>ALL EXERCISES COMPLETED TODAY!</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Assigned Exercise Checklist Cards */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                        <i className="bi bi-list-check text-[#FF1E28]"></i>
                                        Prescribed Exercise Execution Checklist ({totalAssigned})
                                    </h4>
                                    <span className="text-xs text-zinc-400">Click button to complete or revert set</span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {routineExercises.map((ex, idx) => {
                                        const isCompleted = ex.status === 'Completed';
                                        return (
                                            <div 
                                                key={ex.id || idx}
                                                className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl ${
                                                    isCompleted 
                                                        ? 'bg-[#121217]/80 border-emerald-900/40 hover:border-emerald-500/40' 
                                                        : 'bg-[#121217] border-[#22222a] hover:border-[#E50914]/40'
                                                }`}
                                            >
                                                {/* Exercise Title and Coach Instructions */}
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${
                                                        isCompleted 
                                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                                                            : 'bg-[#E50914]/15 text-[#FF1E28] border border-[#E50914]/40'
                                                    }`}>
                                                        {isCompleted ? <i className="bi bi-check2 text-lg"></i> : `0${idx + 1}`}
                                                    </div>

                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h5 className={`text-base font-extrabold tracking-tight ${
                                                                isCompleted ? 'text-zinc-300 line-through' : 'text-white'
                                                            }`}>
                                                                {ex.name}
                                                            </h5>
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                isCompleted 
                                                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40' 
                                                                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                                                            }`}>
                                                                {ex.status}
                                                            </span>
                                                        </div>

                                                        {ex.notes && (
                                                            <p className="text-xs text-zinc-400 flex items-center gap-1.5 pt-0.5">
                                                                <i className="bi bi-chat-quote-fill text-[#FF1E28] text-[11px]"></i>
                                                                <span>Coach Form Cue: <strong className="text-zinc-300">{ex.notes}</strong></span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Target Specs & Interactive Completion Action */}
                                                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#1f1f28]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="px-3.5 py-2 rounded-xl bg-[#181820] border border-[#2a2a38] text-center">
                                                            <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">SETS x REPS</span>
                                                            <span className="text-xs font-black text-white">{ex.setsReps || ex.sets_reps || '4 x 10'}</span>
                                                        </div>

                                                        <div className="px-3.5 py-2 rounded-xl bg-[#181820] border border-[#2a2a38] text-center">
                                                            <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">TARGET LOAD</span>
                                                            <span className="text-xs font-black text-[#FF1E28]">{ex.targetLoad || ex.target_load || '20 kg'}</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleToggleExercise(ex.id)}
                                                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                                                            isCompleted
                                                                ? 'bg-[#181820] hover:bg-zinc-800 text-zinc-300 border border-[#2c2c3d]'
                                                                : 'bg-gradient-to-r from-[#E50914] to-[#B80710] hover:from-[#FF1E28] hover:to-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.35)]'
                                                        }`}
                                                    >
                                                        {isCompleted ? (
                                                            <>
                                                                <i className="bi bi-arrow-counterclockwise text-xs"></i>
                                                                <span>Mark Pending</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-check-circle-fill text-xs font-black"></i>
                                                                <span>Complete Set</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Empty State when no routine is assigned yet */
                        <div className="p-10 rounded-3xl bg-[#121217] border border-[#22222a] text-center space-y-4 shadow-xl">
                            <div className="w-16 h-16 rounded-3xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF1E28] flex items-center justify-center text-2xl mx-auto shadow-[0_0_20px_rgba(229,9,20,0.2)]">
                                <i className="bi bi-journal-x"></i>
                            </div>
                            <div className="max-w-md mx-auto space-y-2">
                                <h4 className="text-lg font-black text-white">No Custom Routine Assigned For Today Yet</h4>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Your personal coach has not yet prescribed today's specialized routine. When they assign your sets, they will instantly appear here with load guidance and form cues.
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveTab('catalog')}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B80710] text-white font-bold text-xs shadow-lg hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] transition-all cursor-pointer"
                            >
                                Browse Movement Library Instead →
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* TRAINER ASSIGNMENT BUILDER: Prescribe Routine to Specific Athlete */}
            {isTrainerOrAdmin && (
                <div className="p-6 bg-[#121217] border border-[#22222a] rounded-3xl shadow-2xl space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1f1f28]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF1E28] flex items-center justify-center text-lg">
                                <i className="bi bi-journal-plus"></i>
                            </div>
                            <div>
                                <h4 className="text-base font-extrabold text-white tracking-tight">
                                    Prescribe Daily Routine to Athlete
                                </h4>
                                <p className="text-xs text-zinc-400 font-medium">
                                    Assigned members will immediately see their own personalized workout plan on their dashboard and workouts tab
                                </p>
                            </div>
                        </div>
                    </div>

                    {formFeedback && (
                        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-bold transition-all ${
                            formFeedback.type === 'success'
                                ? 'bg-red-950/40 border-red-500/40 text-red-200'
                                : formFeedback.type === 'warning'
                                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                        }`}>
                            <i className={`text-base ${
                                formFeedback.type === 'success' ? 'bi bi-check-circle-fill text-[#FF1E28]' : 'bi bi-exclamation-triangle-fill text-amber-400'
                            }`}></i>
                            <span>{formFeedback.message}</span>
                        </div>
                    )}

                    <form onSubmit={handlePrescribeRoutine} className="space-y-4">
                        {/* Target Athlete & Routine Meta */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                                    Select Assigned Athlete *
                                </label>
                                <select
                                    value={selectedAthleteEmail}
                                    onChange={(e) => setSelectedAthleteEmail(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181820] border border-[#2a2a38] text-white text-xs font-semibold focus:border-[#E50914] outline-none"
                                >
                                    {assignedAthletes.length === 0 ? (
                                        <option value="sarah.jenkins@omnifit.com">Sarah Jenkins (sarah.jenkins@omnifit.com)</option>
                                    ) : (
                                        assignedAthletes.map(a => (
                                            <option key={a.id || a.email} value={a.email}>
                                                {a.name} ({a.email}) - {a.plan}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                                    Routine Title for Today *
                                </label>
                                <input
                                    type="text"
                                    value={routineTitle}
                                    onChange={(e) => setRoutineTitle(e.target.value)}
                                    placeholder="e.g. Chest & Triceps Hypertrophy"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181820] border border-[#2a2a38] text-white text-xs font-semibold focus:border-[#E50914] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                                    Target Intensity Level
                                </label>
                                <select
                                    value={routineDifficulty}
                                    onChange={(e) => setRoutineDifficulty(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181820] border border-[#2a2a38] text-white text-xs font-semibold focus:border-[#E50914] outline-none"
                                >
                                    <option value="Beginner">Beginner (Foundational)</option>
                                    <option value="Intermediate">Intermediate (Overload)</option>
                                    <option value="Advanced">Advanced (High Intensity / Failure)</option>
                                </select>
                            </div>
                        </div>

                        {/* Exercise Items List to Prescribe */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                                    Routine Exercises ({prescribeExercises.length})
                                </span>
                                <button
                                    type="button"
                                    onClick={addExerciseRow}
                                    className="px-3 py-1.5 rounded-xl bg-[#181820] hover:bg-[#22222d] border border-[#2a2a38] text-[#FF1E28] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                                >
                                    <i className="bi bi-plus-lg"></i>
                                    <span>Add Exercise</span>
                                </button>
                            </div>

                            {prescribeExercises.map((ex, index) => (
                                <div key={ex.id} className="p-4 rounded-2xl bg-[#181820] border border-[#252532] grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                    <div className="md:col-span-1 text-center font-black text-xs text-[#FF1E28]">
                                        #{index + 1}
                                    </div>
                                    <div className="md:col-span-4">
                                        <input
                                            type="text"
                                            value={ex.name}
                                            onChange={(e) => updateExerciseRow(ex.id, 'name', e.target.value)}
                                            placeholder="Exercise Name (e.g. Incline DB Press)"
                                            className="w-full px-3 py-1.5 rounded-lg bg-[#121217] border border-[#2a2a38] text-white text-xs outline-none focus:border-[#E50914]"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex items-center gap-1">
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={ex.sets}
                                            onChange={(e) => updateExerciseRow(ex.id, 'sets', parseInt(e.target.value) || 1)}
                                            className="w-12 px-2 py-1.5 rounded-lg bg-[#121217] border border-[#2a2a38] text-white text-xs text-center outline-none focus:border-[#E50914]"
                                        />
                                        <span className="text-zinc-500 text-xs">x</span>
                                        <input
                                            type="text"
                                            value={ex.reps}
                                            onChange={(e) => updateExerciseRow(ex.id, 'reps', e.target.value)}
                                            placeholder="10-12"
                                            className="w-16 px-2 py-1.5 rounded-lg bg-[#121217] border border-[#2a2a38] text-white text-xs text-center outline-none focus:border-[#E50914]"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            value={ex.targetLoad}
                                            onChange={(e) => updateExerciseRow(ex.id, 'targetLoad', e.target.value)}
                                            placeholder="24 kg"
                                            className="w-full px-3 py-1.5 rounded-lg bg-[#121217] border border-[#2a2a38] text-white text-xs outline-none focus:border-[#E50914]"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex items-center justify-end pt-3 md:pt-0">
                                        <button
                                            type="button"
                                            onClick={() => removeExerciseRow(ex.id)}
                                            disabled={prescribeExercises.length <= 1}
                                            className="w-8 h-8 rounded-lg bg-[#1f1a20] hover:bg-rose-950/60 text-zinc-500 hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
                                            title="Delete exercise"
                                        >
                                            <i className="bi bi-trash text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit Action */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B80710] hover:from-[#FF1E28] hover:to-[#E50914] text-white font-black text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(229,9,20,0.35)] transition-all cursor-pointer disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                        <span>Prescribing Routine...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-send-check text-sm font-black"></i>
                                        <span>Assign Routine to Athlete for Today</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Exercise Catalog Grid (When in catalog tab or for trainers/admins) */}
            {(isTrainerOrAdmin || activeTab === 'catalog') && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <i className="bi bi-collection text-[#FF1E28]"></i>
                            Omnifit Gym Movement & Exercise Database ({filteredWorkouts.length})
                        </h4>
                        <span className="text-xs text-zinc-400">Filtered by: <strong className="text-white">{selectedCategory}</strong></span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredWorkouts.map((w) => (
                            <div key={w.id} className="p-5 rounded-3xl bg-[#121217] border border-[#22222a] hover:border-[#E50914]/40 transition-all flex flex-col justify-between shadow-lg group">
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#181820] border border-[#262634] text-[#FF1E28]">
                                            {w.category}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#181820] text-zinc-400 border border-[#262634]">
                                            {w.difficulty}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-extrabold text-white tracking-tight group-hover:text-[#FF1E28] transition-colors">
                                        {w.name}
                                    </h4>
                                    <p className="text-xs text-zinc-400 leading-snug">
                                        {w.notes || 'Progressive overload training target.'}
                                    </p>
                                </div>

                                <div className="pt-4 mt-3 border-t border-[#1f1f28] space-y-3">
                                    <div className="flex items-center justify-between text-xs text-zinc-400">
                                        <span><i className="bi bi-stack text-[#FF1E28] me-1"></i>{w.sets} Sets x {w.reps} Reps</span>
                                        <span><i className="bi bi-fire text-amber-400 me-1"></i>{w.calories} kcal</span>
                                    </div>
                                    <button className="w-full py-2 rounded-xl bg-[#181820] hover:bg-[#20202d] border border-[#2c2c3d] hover:border-[#E50914]/50 text-white font-bold text-xs transition-all cursor-pointer">
                                        Start Supplementary Set
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutModule;
