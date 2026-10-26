import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { PREBUILT_CATEGORIES } from '../../data/routineBlueprints';

const ICON_OPTIONS = [
    { value: 'bi-fire', label: 'Fire / Hypertrophy', icon: 'bi-fire', color: '#FF1E28' },
    { value: 'bi-lightning-charge-fill', label: 'Lightning / Power', icon: 'bi-lightning-charge-fill', color: '#3B82F6' },
    { value: 'bi-shield-shaded', label: 'Shield / Deltoid', icon: 'bi-shield-shaded', color: '#F59E0B' },
    { value: 'bi-gem', label: 'Diamond / Strength', icon: 'bi-gem', color: '#10B981' },
    { value: 'bi-activity', label: 'Activity / Kinetic', icon: 'bi-activity', color: '#EC4899' },
    { value: 'bi-stopwatch-fill', label: 'Stopwatch / HIIT', icon: 'bi-stopwatch-fill', color: '#EF4444' },
    { value: 'bi-universal-access', label: 'Mobility / Core', icon: 'bi-universal-access', color: '#8B5CF6' },
    { value: 'bi-trophy-fill', label: 'Trophy / Athlete', icon: 'bi-trophy-fill', color: '#FBBF24' },
    { value: 'bi-heart-pulse-fill', label: 'Heart Pulse / Cardio', icon: 'bi-heart-pulse-fill', color: '#E11D48' },
    { value: 'bi-bullseye', label: 'Bullseye / Focus', icon: 'bi-bullseye', color: '#06B6D4' }
];

const CreateBlueprintModal = ({
    isOpen = false,
    onClose = () => {},
    onSave = () => {},
    initialExercises = []
}) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Chest Day');
    const [difficulty, setDifficulty] = useState('Intermediate');
    const [estimatedDuration, setEstimatedDuration] = useState('45-55 mins');
    const [calorieBurn, setCalorieBurn] = useState('400-500 kcal');
    const [targetMuscles, setTargetMuscles] = useState('');
    const [description, setDescription] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('bi-fire');
    const [errorMsg, setErrorMsg] = useState(null);

    const [exercises, setExercises] = useState(() => {
        if (initialExercises && initialExercises.length > 0) {
            return initialExercises.map((ex, idx) => ({
                id: Date.now() + idx,
                name: ex.name || '',
                sets: ex.sets || 4,
                reps: ex.reps || '10-12',
                targetLoad: ex.targetLoad || '20 kg',
                notes: ex.notes || ''
            }));
        }
        return [
            { id: 1, name: '', sets: 4, reps: '10-12', targetLoad: '20 kg', notes: '' }
        ];
    });

    const addExercise = () => {
        setExercises(prev => [
            ...prev,
            { id: Date.now() + Math.floor(Math.random() * 1000), name: '', sets: 4, reps: '10-12', targetLoad: '20 kg', notes: '' }
        ]);
    };

    const removeExercise = (id) => {
        if (exercises.length <= 1) return;
        setExercises(prev => prev.filter(e => e.id !== id));
    };

    const updateExercise = (id, field, value) => {
        setExercises(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const handleImportFromBuilder = () => {
        if (initialExercises && initialExercises.length > 0) {
            setExercises(initialExercises.map((ex, idx) => ({
                id: Date.now() + idx,
                name: ex.name || '',
                sets: ex.sets || 4,
                reps: ex.reps || '10-12',
                targetLoad: ex.targetLoad || '20 kg',
                notes: ex.notes || ''
            })));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!title.trim()) {
            setErrorMsg('Please enter a routine blueprint title.');
            return;
        }

        const validExercises = exercises.filter(ex => ex.name.trim().length > 0);
        if (validExercises.length === 0) {
            setErrorMsg('Please specify at least one valid exercise for this routine blueprint.');
            return;
        }

        const selectedIconObj = ICON_OPTIONS.find(o => o.value === selectedIcon) || ICON_OPTIONS[0];

        const newBlueprint = {
            id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            category: category || 'Custom',
            title: title.trim(),
            shortTitle: title.trim(),
            badge: `${difficulty} Protocol`,
            difficulty,
            targetMuscles: targetMuscles.trim() || 'Custom kinetic chain',
            description: description.trim() || 'Custom trainer-engineered routine blueprint.',
            estimatedDuration: estimatedDuration.trim() || '45 mins',
            calorieBurn: calorieBurn.trim() || '400 kcal',
            icon: selectedIconObj.icon,
            color: selectedIconObj.color,
            isCustom: true,
            exercises: validExercises.map((ex, idx) => ({
                id: 1000 + idx,
                name: ex.name.trim(),
                sets: Number(ex.sets) || 4,
                reps: ex.reps || '10',
                targetLoad: ex.targetLoad || '20 kg',
                notes: ex.notes || ''
            }))
        };

        onSave(newBlueprint);
        onClose();
    };

    // Lock body scroll and attach Escape key listener
    useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const availableCategories = PREBUILT_CATEGORIES.filter(c => c !== 'All Blueprints');

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#101017] border border-[#272738] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col text-white scrollbar-none"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#20202e] bg-[#14141e]/80 sticky top-0 z-20 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#990000] text-white flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.4)]">
                            <i className="bi bi-journal-plus text-lg"></i>
                        </div>
                        <div>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-600/20 text-[#FF1E28] border border-red-500/30">
                                TRAINER WORKOUT BLUEPRINT
                            </span>
                            <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                                Create New Routine Blueprint
                            </h3>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl bg-[#1b1b26] hover:bg-[#262638] text-zinc-400 hover:text-white border border-[#2c2c3e] flex items-center justify-center transition-all cursor-pointer"
                    >
                        <i className="bi bi-x-lg text-sm"></i>
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
                    {errorMsg && (
                        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center gap-2">
                            <i className="bi bi-exclamation-triangle-fill text-amber-400"></i>
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5">
                                Blueprint Title *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Arm Hypertrophy & Forearm Overload"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2a2a3e] text-white text-xs font-semibold focus:border-[#E50914] outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5">
                                Routine Category *
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2a2a3e] text-white text-xs font-semibold focus:border-[#E50914] outline-none"
                            >
                                {availableCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                                <option value="Arm Day">Arm Day</option>
                                <option value="Functional Fitness">Functional Fitness</option>
                                <option value="Powerlifting">Powerlifting</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5">
                                Target Intensity Level
                            </label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2a2a3e] text-white text-xs font-semibold focus:border-[#E50914] outline-none"
                            >
                                <option value="Beginner">Beginner (Foundational)</option>
                                <option value="Intermediate">Intermediate (Hypertrophy / Overload)</option>
                                <option value="Advanced">Advanced (High Intensity / Failure)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5">
                                Blueprint Icon
                            </label>
                            <select
                                value={selectedIcon}
                                onChange={(e) => setSelectedIcon(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2a2a3e] text-white text-xs font-semibold focus:border-[#E50914] outline-none"
                            >
                                {ICON_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5">
                                Estimated Duration
                            </label>
                            <input
                                type="text"
                                value={estimatedDuration}
                                onChange={(e) => setEstimatedDuration(e.target.value)}
                                placeholder="45-55 mins"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2a2a3e] text-white text-xs font-semibold focus:border-[#E50914] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5">
                                Estimated Calorie Burn
                            </label>
                            <input
                                type="text"
                                value={calorieBurn}
                                onChange={(e) => setCalorieBurn(e.target.value)}
                                placeholder="380-450 kcal"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2a2a3e] text-white text-xs font-semibold focus:border-[#E50914] outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5">
                                Target Muscle Groups
                            </label>
                            <input
                                type="text"
                                value={targetMuscles}
                                onChange={(e) => setTargetMuscles(e.target.value)}
                                placeholder="e.g. Biceps Brachii, Triceps Brachii, Brachialis"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2a2a3e] text-white text-xs font-semibold focus:border-[#E50914] outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5">
                                Routine Description & Overview
                            </label>
                            <textarea
                                rows={2}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief summary of the movement volume, target fatigue, and progression protocol..."
                                className="w-full px-3.5 py-2 rounded-xl bg-[#181822] border border-[#2a2a3e] text-white text-xs font-semibold focus:border-[#E50914] outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Coupled Exercises Section */}
                    <div className="space-y-3 pt-3 border-t border-[#1f1f2e]">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                                    <i className="bi bi-collection-play-fill text-[#FF1E28]"></i>
                                    Coupled Exercises ({exercises.length})
                                </span>
                                <span className="text-[10px] text-zinc-400">
                                    These movements will automatically populate whenever this blueprint is loaded.
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {initialExercises && initialExercises.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleImportFromBuilder}
                                        className="px-2.5 py-1 rounded-lg bg-[#181824] hover:bg-[#222232] text-zinc-300 text-[11px] font-bold border border-[#2a2a3c] transition-all cursor-pointer flex items-center gap-1"
                                        title="Import current exercises from builder"
                                    >
                                        <i className="bi bi-box-arrow-in-down text-blue-400"></i>
                                        <span>Import from Builder</span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={addExercise}
                                    className="px-3 py-1 rounded-lg bg-[#E50914] hover:bg-[#FF1E28] text-white text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                                >
                                    <i className="bi bi-plus-lg"></i>
                                    <span>Add Exercise</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                            {exercises.map((ex, idx) => (
                                <div
                                    key={ex.id || idx}
                                    className="p-3 rounded-xl bg-[#161622] border border-[#252536] space-y-2"
                                >
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <div className="col-span-1 text-center font-black text-xs text-[#FF1E28]">
                                            #{idx + 1}
                                        </div>

                                        <div className="col-span-5">
                                            <input
                                                type="text"
                                                value={ex.name}
                                                onChange={(e) => updateExercise(ex.id, 'name', e.target.value)}
                                                placeholder="Exercise Name (e.g. Incline DB Curls)"
                                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#101018] border border-[#28283a] text-white text-xs outline-none focus:border-[#E50914]"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={ex.sets}
                                                onChange={(e) => updateExercise(ex.id, 'sets', parseInt(e.target.value) || 1)}
                                                placeholder="Sets"
                                                className="w-full px-2 py-1.5 rounded-lg bg-[#101018] border border-[#28283a] text-white text-xs text-center outline-none focus:border-[#E50914]"
                                                title="Sets"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <input
                                                type="text"
                                                value={ex.reps}
                                                onChange={(e) => updateExercise(ex.id, 'reps', e.target.value)}
                                                placeholder="Reps (10-12)"
                                                className="w-full px-2 py-1.5 rounded-lg bg-[#101018] border border-[#28283a] text-white text-xs text-center outline-none focus:border-[#E50914]"
                                                title="Reps"
                                            />
                                        </div>

                                        <div className="col-span-2 flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                onClick={() => removeExercise(ex.id)}
                                                disabled={exercises.length <= 1}
                                                className="w-7 h-7 rounded-lg bg-[#20181d] hover:bg-rose-950 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 border border-[#2f2229]"
                                                title="Remove exercise"
                                            >
                                                <i className="bi bi-trash text-xs"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 gap-2">
                                        <div className="col-span-4">
                                            <input
                                                type="text"
                                                value={ex.targetLoad}
                                                onChange={(e) => updateExercise(ex.id, 'targetLoad', e.target.value)}
                                                placeholder="Target Load (e.g. 18 kg)"
                                                className="w-full px-2 py-1 rounded-md bg-[#101018] border border-[#28283a] text-[11px] text-[#FF1E28] outline-none focus:border-[#E50914]"
                                            />
                                        </div>

                                        <div className="col-span-8">
                                            <input
                                                type="text"
                                                value={ex.notes || ''}
                                                onChange={(e) => updateExercise(ex.id, 'notes', e.target.value)}
                                                placeholder="Biomechanical cue (e.g. Supinate wrist at peak, 3s negative)"
                                                className="w-full px-2 py-1 rounded-md bg-[#101018] border border-[#28283a] text-[11px] text-zinc-300 outline-none focus:border-[#E50914]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1f1f2e]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-[#181822] hover:bg-[#222232] text-zinc-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B80710] hover:from-[#FF1E28] hover:to-[#E50914] text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(229,9,20,0.35)]"
                        >
                            <i className="bi bi-check2-circle text-sm"></i>
                            <span>Save Blueprint to Library</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default CreateBlueprintModal;
