import React, { useState } from 'react';

const WorkoutModule = ({ role }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = ['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Cardio', 'Yoga'];

    const [workouts, setWorkouts] = useState([
        { id: 1, name: 'Incline Barbell Bench Press', category: 'Chest', sets: 4, reps: 10, duration: '20 mins', calories: 220, difficulty: 'Intermediate', notes: 'Maintain 30-degree bench angle' },
        { id: 2, name: 'Seated Cable Row', category: 'Back', sets: 4, reps: 12, duration: '18 mins', calories: 190, difficulty: 'Beginner', notes: 'Squeeze shoulder blades at peak' },
        { id: 3, name: 'Overhead Barbell Press', category: 'Shoulders', sets: 3, reps: 8, duration: '15 mins', calories: 170, difficulty: 'Advanced', notes: 'Keep core engaged' },
        { id: 4, name: 'High-Intensity Treadmill Sprints', category: 'Cardio', sets: 5, reps: '30s Sprint', duration: '15 mins', calories: 280, difficulty: 'Intermediate', notes: '140+ BPM target heart rate' },
    ]);

    const [newWorkout, setNewWorkout] = useState({
        name: '', category: 'Chest', sets: 4, reps: 10, duration: '15 mins', calories: 150, difficulty: 'Intermediate', notes: ''
    });

    const handleAddWorkout = async (e) => {
        e.preventDefault();
        if (!newWorkout.name) return;

        // Automatically assign to the currently active category tab (defaulting to Chest if 'All' is selected)
        const activeCategory = selectedCategory === 'All' ? 'Chest' : selectedCategory;

        const newExercise = { ...newWorkout, category: activeCategory, id: Date.now() };
        setWorkouts(prev => [...prev, newExercise]);

        try {
            const { default: LoginService } = await import('../Login/LoginService');
            await LoginService.assignRoutine({
                title: `${activeCategory} Routine: ${newWorkout.name}`,
                description: 'Trainer assigned custom exercise.',
                exercises: [{
                    name: newWorkout.name,
                    sets_reps: `${newWorkout.sets} x ${newWorkout.reps}`,
                    target_load: 'Adjust load based on capability',
                    notes: newWorkout.notes || 'No specific notes.'
                }]
            });
        } catch (err) {
            console.warn('Backend sync note: could not assign routine. Local UI updated.');
        }

        setNewWorkout({ name: '', category: 'Chest', sets: 4, reps: 10, duration: '15 mins', calories: 150, difficulty: 'Intermediate', notes: '' });
    };

    const filteredWorkouts = selectedCategory === 'All'
        ? workouts
        : workouts.filter(w => w.category === selectedCategory);

    return (
        <div className="vstack gap-4 animate-fade-in">
            {/* Header & Categories Filter */}
            <div className="glass-card p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
                    <div>
                        <h4 className="fw-bold text-white mb-1"><i className="bi bi-lightning-charge-fill text-accent me-2"></i>Workout Routine Engine</h4>
                        <p className="text-muted small mb-0">AI-engineered hypertrophic & endurance routines</p>
                    </div>
                    {role === 'TRAINER' || role === 'ADMIN' ? (
                        <span className="badge bg-accent text-dark fw-bold px-3 py-2">TRAINER ASSIGNMENT MODE</span>
                    ) : null}
                </div>

                {/* Category Pills */}
                <div className="d-flex gap-2 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`btn btn-sm text-nowrap rounded-pill px-3 ${selectedCategory === cat ? 'btn-accent' : 'btn-outline-secondary text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* If Trainer or Admin: Create Workout Form */}
            {(role === 'TRAINER' || role === 'ADMIN') && (
                <div className="glass-card p-4">
                    <h5 className="fw-bold text-white mb-3"><i className="bi bi-plus-circle-fill text-accent me-2"></i>Assign New Exercise</h5>
                    <form onSubmit={handleAddWorkout} className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label text-muted small fw-bold">Exercise Name *</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="e.g. Barbell Squat"
                                value={newWorkout.name}
                                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label text-muted small fw-bold">Sets</label>
                            <input
                                type="number"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="4"
                                value={newWorkout.sets}
                                onChange={(e) => setNewWorkout({ ...newWorkout, sets: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label text-muted small fw-bold">Reps / Time</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="10"
                                value={newWorkout.reps}
                                onChange={(e) => setNewWorkout({ ...newWorkout, reps: e.target.value })}
                            />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button type="submit" className="btn btn-accent w-100 fw-bold">Add Exercise</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Exercises Grid */}
            <div className="row g-3">
                {filteredWorkouts.map((w) => (
                    <div key={w.id} className="col-md-6 col-lg-4">
                        <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="badge bg-dark border border-secondary text-accent">{w.category}</span>
                                    <span className="badge bg-secondary text-white">{w.difficulty}</span>
                                </div>
                                <h5 className="fw-bold text-white mb-2">{w.name}</h5>
                                <p className="text-muted small mb-3">{w.notes || 'No trainer notes provided.'}</p>
                            </div>

                            <div className="pt-3 border-top border-secondary border-opacity-50">
                                <div className="d-flex justify-content-between small text-muted mb-2">
                                    <span><i className="bi bi-stack me-1"></i>{w.sets} Sets x {w.reps} Reps</span>
                                    <span><i className="bi bi-fire me-1 text-warning"></i>{w.calories} kcal</span>
                                </div>
                                <button className="btn btn-accent btn-sm w-100">Start Exercise Set</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkoutModule;
