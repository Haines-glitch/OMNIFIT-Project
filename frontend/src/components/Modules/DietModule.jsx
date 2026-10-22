import React, { useState } from 'react';
import { validateText, validateNumericRange } from '../../utils/validation';

const initialMeals = [
    {
        id: 'breakfast',
        name: 'Breakfast',
        time: '08:00 AM',
        icon: 'bi-sun-fill',
        iconColor: '#F59E0B',
        badgeBg: '#FEF3C7',
        badgeColor: '#B45309',
        totalCalories: 580,
        totalProtein: 42,
        items: [
            { id: 101, name: 'Egg Whites & Whole Eggs', portion: '4 Egg Whites + 2 Whole Eggs (Scrambled/Boiled)', calories: 210, protein: 24, type: 'High Protein', icon: '🥚' },
            { id: 102, name: 'Rolled Oats with Almond Milk', portion: '80g Oats + 200ml Milk + 1 tsp Honey', calories: 260, protein: 12, type: 'Complex Carbs', icon: '🥣' },
            { id: 103, name: 'Banana & Mixed Berries', portion: '1 Medium Banana + 50g Blueberries', calories: 110, protein: 2, type: 'Vitamins & Fiber', icon: '🍌' },
            { id: 104, name: 'Green Tea / Black Coffee', portion: '1 Cup (Unsweetened)', calories: 0, protein: 0, type: 'Antioxidants', icon: '☕' },
        ]
    },
    {
        id: 'lunch',
        name: 'Lunch',
        time: '01:00 PM',
        icon: 'bi-brightness-high-fill',
        iconColor: '#10B981',
        badgeBg: '#D1FAE5',
        badgeColor: '#047857',
        totalCalories: 680,
        totalProtein: 54,
        items: [
            { id: 201, name: 'Grilled Chicken Breast / Paneer', portion: '200g Chicken Breast (or 180g Cottage Cheese)', calories: 330, protein: 44, type: 'Lean Protein', icon: '🍗' },
            { id: 202, name: 'Steamed Brown Rice', portion: '150g Cooked Brown Rice / 2 Whole Wheat Rotis', calories: 210, protein: 5, type: 'Complex Carbs', icon: '🍚' },
            { id: 203, name: 'Steamed Greens & Vegetables', portion: '100g Broccoli, Carrots & Zucchini', calories: 80, protein: 4, type: 'Micronutrients', icon: '🥦' },
            { id: 204, name: 'Fresh Garden Green Salad', portion: 'Cucumber, Tomatoes & Lettuce with Lemon Dressing', calories: 60, protein: 1, type: 'Fiber', icon: '🥗' },
        ]
    },
    {
        id: 'snack',
        name: 'Evening Snack',
        time: '05:00 PM',
        icon: 'bi-cup-hot-fill',
        iconColor: '#6366F1',
        badgeBg: '#E0E7FF',
        badgeColor: '#4338CA',
        totalCalories: 340,
        totalProtein: 32,
        items: [
            { id: 301, name: 'Whey Protein Isolate Shake', portion: '1 Scoop (30g) in Cold Water', calories: 130, protein: 26, type: 'Fast Protein', icon: '🥤' },
            { id: 302, name: 'Roasted Almonds & Walnuts', portion: '15g Raw Mixed Nuts', calories: 110, protein: 4, type: 'Healthy Fats', icon: '🥜' },
            { id: 303, name: 'Fresh Apple / Fruit Bowl', portion: '1 Medium Crisp Apple', calories: 100, protein: 2, type: 'Fiber & Energy', icon: '🍎' },
        ]
    },
    {
        id: 'dinner',
        name: 'Dinner',
        time: '08:30 PM',
        icon: 'bi-moon-stars-fill',
        iconColor: '#3B82F6',
        badgeBg: '#DBEAFE',
        badgeColor: '#1D4ED8',
        totalCalories: 620,
        totalProtein: 45,
        items: [
            { id: 401, name: 'Baked Salmon Filet / Tofu', portion: '180g Salmon Filet or Grilled Tofu', calories: 280, protein: 35, type: 'Omega-3 & Protein', icon: '🐟' },
            { id: 402, name: 'Quinoa & Herb Salad', portion: '100g Cooked Quinoa with Parsley & Olive Oil', calories: 180, protein: 6, type: 'Superfood', icon: '🌾' },
            { id: 403, name: 'Hot Asparagus & Vegetable Soup', portion: '1 Bowl Warm Clear Soup', calories: 90, protein: 4, type: 'Low Calorie', icon: '🥣' },
            { id: 404, name: 'Mixed Greens with Olive Oil', portion: 'Spinach & Arugula Salad', calories: 70, protein: 0, type: 'Digestive Fiber', icon: '🥗' },
        ]
    }
];

const DietModule = ({ role, theme = 'light' }) => {
    const isLight = theme === 'light';

    const [meals, setMeals] = useState(initialMeals);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedMealId, setSelectedMealId] = useState('breakfast');
    const [modalError, setModalError] = useState('');
    const [newItem, setNewItem] = useState({
        name: '',
        portion: '',
        calories: '',
        protein: '',
        type: 'Protein',
        icon: '🥗'
    });

    const [supplements, setSupplements] = useState('Whey Isolate (30g Post-Workout), Creatine Monohydrate (5g), Multivitamin');
    const [trainerNotes, setTrainerNotes] = useState('Maintain high protein intake post-workout for optimal muscle recovery & fat loss.');

    // Calculate total daily macros dynamically
    const totalDailyCalories = meals.reduce((sum, m) => sum + m.items.reduce((iSum, i) => iSum + Number(i.calories || 0), 0), 0);
    const totalDailyProtein = meals.reduce((sum, m) => sum + m.items.reduce((iSum, i) => iSum + Number(i.protein || 0), 0), 0);

    const handleOpenAddModal = (mealId) => {
        setSelectedMealId(mealId);
        setModalError('');
        setNewItem({
            name: '',
            portion: '',
            calories: '',
            protein: '',
            type: 'Protein',
            icon: '🥗'
        });
        setShowAddModal(true);
    };

    const handleAddFoodItem = (e) => {
        e.preventDefault();
        setModalError('');

        // 1. Food Name Validation
        const nameVal = validateText(newItem.name, 'Food Item Name', 2, 80);
        if (!nameVal.valid) {
            setModalError(nameVal.message);
            return;
        }

        // 2. Portion Validation
        const portionVal = validateText(newItem.portion, 'Portion Size', 2, 100);
        if (!portionVal.valid) {
            setModalError(portionVal.message);
            return;
        }

        // 3. Calories Validation (if provided)
        if (newItem.calories !== '' && newItem.calories !== undefined) {
            const calVal = validateNumericRange(newItem.calories, 'Calories', 0, 5000, 'kcal');
            if (!calVal.valid) {
                setModalError(calVal.message);
                return;
            }
        }

        // 4. Protein Validation (if provided)
        if (newItem.protein !== '' && newItem.protein !== undefined) {
            const protVal = validateNumericRange(newItem.protein, 'Protein', 0, 500, 'g');
            if (!protVal.valid) {
                setModalError(protVal.message);
                return;
            }
        }

        const itemToAdd = {
            id: Date.now(),
            name: newItem.name.trim(),
            portion: newItem.portion.trim(),
            calories: Number(newItem.calories) || 0,
            protein: Number(newItem.protein) || 0,
            type: newItem.type || 'Custom Food',
            icon: newItem.icon || '🥗'
        };

        setMeals(prevMeals =>
            prevMeals.map(meal => {
                if (meal.id === selectedMealId) {
                    const updatedItems = [...meal.items, itemToAdd];
                    const updatedCal = updatedItems.reduce((acc, i) => acc + Number(i.calories || 0), 0);
                    const updatedProt = updatedItems.reduce((acc, i) => acc + Number(i.protein || 0), 0);
                    return {
                        ...meal,
                        items: updatedItems,
                        totalCalories: updatedCal,
                        totalProtein: updatedProt
                    };
                }
                return meal;
            })
        );

        setShowAddModal(false);
    };

    const handleDeleteFoodItem = (mealId, itemId) => {
        setMeals(prevMeals =>
            prevMeals.map(meal => {
                if (meal.id === mealId) {
                    const updatedItems = meal.items.filter(i => i.id !== itemId);
                    const updatedCal = updatedItems.reduce((acc, i) => acc + Number(i.calories || 0), 0);
                    const updatedProt = updatedItems.reduce((acc, i) => acc + Number(i.protein || 0), 0);
                    return {
                        ...meal,
                        items: updatedItems,
                        totalCalories: updatedCal,
                        totalProtein: updatedProt
                    };
                }
                return meal;
            })
        );
    };

    // Styling constants
    const cardStyle = isLight
        ? { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }
        : { background: '#1E293B', border: '1px solid #334155', borderRadius: '16px' };

    const subCardStyle = isLight
        ? { background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px' }
        : { background: '#0F172A', border: '1px solid #334155', borderRadius: '12px' };

    const foodItemStyle = isLight
        ? { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px' }
        : { background: '#1E293B', border: '1px solid #334155', borderRadius: '10px' };

    const textPrimary = isLight ? '#0F172A' : '#F8FAFC';
    const textSecondary = isLight ? '#64748B' : '#94A3B8';

    return (
        <div className="vstack gap-4 animate-fade-in">
            {/* Macro Engine Card */}
            <div className="p-4" style={cardStyle}>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                    <div>
                        <h4 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: textPrimary }}>
                            <i className="bi bi-egg-fried" style={{ color: '#10B981' }}></i>
                            Nutritional & Macro Engine
                        </h4>
                        <p className="small mb-0" style={{ color: textSecondary }}>
                            Daily Intake: <strong>{totalDailyCalories} kcal</strong> / Target: 2,500 kcal
                        </p>
                    </div>
                    <span className="badge px-3 py-2 fw-bold" style={{ background: '#ECFDF5', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px' }}>
                        <i className="bi bi-fire me-1"></i> HIGH PROTEIN SURPLUS
                    </span>
                </div>

                {/* Stat Grid */}
                <div className="row g-3">
                    <div className="col-md-3 col-sm-6">
                        <div className="p-3 text-center" style={subCardStyle}>
                            <span className="small d-block fw-semibold" style={{ color: textSecondary }}>TOTAL PROTEIN</span>
                            <h3 className="fw-bold mb-0" style={{ color: '#10B981' }}>{totalDailyProtein}g</h3>
                            <span className="small" style={{ color: textSecondary }}>Goal: 180g</span>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <div className="p-3 text-center" style={subCardStyle}>
                            <span className="small d-block fw-semibold" style={{ color: textSecondary }}>CARBOHYDRATES</span>
                            <h3 className="fw-bold mb-0" style={{ color: '#3B82F6' }}>250g</h3>
                            <span className="small" style={{ color: textSecondary }}>Complex Carbs</span>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <div className="p-3 text-center" style={subCardStyle}>
                            <span className="small d-block fw-semibold" style={{ color: textSecondary }}>HEALTHY FATS</span>
                            <h3 className="fw-bold mb-0" style={{ color: '#F59E0B' }}>65g</h3>
                            <span className="small" style={{ color: textSecondary }}>Omega 3 & 6</span>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <div className="p-3 text-center" style={subCardStyle}>
                            <span className="small d-block fw-semibold" style={{ color: textSecondary }}>WATER INTAKE</span>
                            <h3 className="fw-bold mb-0" style={{ color: '#6366F1' }}>3.2 L</h3>
                            <span className="small" style={{ color: textSecondary }}>Target: 4.0 Liters</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Meals List & Sidebar */}
            <div className="row g-4">
                {/* Main Meals Section */}
                <div className="col-lg-8">
                    <div className="p-4" style={cardStyle}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: textPrimary }}>
                                <i className="bi bi-clock-history" style={{ color: '#10B981' }}></i>
                                Daily Meal Schedule & Food Items
                            </h5>
                            <span className="badge bg-emerald-500 text-white px-3 py-1.5 rounded-pill small">
                                {meals.length} Scheduled Meals
                            </span>
                        </div>

                        {/* Meal Cards */}
                        <div className="vstack gap-4">
                            {meals.map((meal) => {
                                const currentMealCalories = meal.items.reduce((sum, item) => sum + Number(item.calories || 0), 0);
                                const currentMealProtein = meal.items.reduce((sum, item) => sum + Number(item.protein || 0), 0);

                                return (
                                    <div key={meal.id} className="p-4" style={subCardStyle}>
                                        {/* Meal Header */}
                                        <div className="d-flex flex-wrap align-items-center justify-content-between pb-3 mb-3" style={{ borderBottom: `1px solid ${isLight ? '#E2E8F0' : '#334155'}` }}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', background: meal.badgeBg, color: meal.badgeColor }}>
                                                    <i className={`bi ${meal.icon} fs-5`}></i>
                                                </div>
                                                <div>
                                                    <h5 className="fw-bold mb-0" style={{ color: textPrimary }}>
                                                        {meal.name} <span className="small fw-normal text-muted">({meal.time})</span>
                                                    </h5>
                                                    <span className="small" style={{ color: textSecondary }}>
                                                        {meal.items.length} Food Item{meal.items.length !== 1 ? 's' : ''} Included
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
                                                <span className="badge fw-bold px-3 py-2" style={{ background: '#ECFDF5', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                                    {currentMealProtein}g Protein
                                                </span>
                                                <span className="badge fw-bold px-3 py-2" style={{ background: isLight ? '#E2E8F0' : '#334155', color: textPrimary }}>
                                                    {currentMealCalories} kcal
                                                </span>
                                                <button
                                                    className="btn btn-sm text-emerald-500 fw-bold d-flex align-items-center gap-1 border-0 ms-2"
                                                    style={{ background: isLight ? '#ECFDF5' : '#064E3B', borderRadius: '8px' }}
                                                    onClick={() => handleOpenAddModal(meal.id)}
                                                >
                                                    <i className="bi bi-plus-lg"></i> Add Food Item
                                                </button>
                                            </div>
                                        </div>

                                        {/* Food Items List */}
                                        <div className="vstack gap-2">
                                            {meal.items.map((item) => (
                                                <div key={item.id} className="p-3 d-flex align-items-center justify-content-between transition-all" style={foodItemStyle}>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <span className="fs-4">{item.icon || '🥗'}</span>
                                                        <div>
                                                            <div className="fw-bold d-flex align-items-center gap-2" style={{ color: textPrimary }}>
                                                                {item.name}
                                                                <span className="badge bg-light text-dark border small py-0.5 px-2" style={{ fontSize: '0.7rem' }}>
                                                                    {item.type}
                                                                </span>
                                                            </div>
                                                            <span className="small" style={{ color: textSecondary }}>
                                                                Portion: <strong>{item.portion}</strong>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="text-end">
                                                            <span className="fw-bold d-block small" style={{ color: '#10B981' }}>+{item.protein}g Protein</span>
                                                            <span className="small" style={{ color: textSecondary }}>{item.calories} kcal</span>
                                                        </div>
                                                        <button
                                                            className="btn btn-link text-danger p-1 border-0"
                                                            title="Remove food item"
                                                            onClick={() => handleDeleteFoodItem(meal.id, item.id)}
                                                        >
                                                            <i className="bi bi-trash-fill"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {meal.items.length === 0 && (
                                                <div className="text-center py-3 text-muted small">
                                                    No food items added to {meal.name} yet. Click <strong>+ Add Food Item</strong> to include foods!
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Supplements & Guidance */}
                <div className="col-lg-4">
                    {/* Supplements */}
                    <div className="p-4 mb-4" style={cardStyle}>
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: textPrimary }}>
                            <i className="bi bi-capsule" style={{ color: '#10B981' }}></i>
                            Daily Supplements
                        </h5>
                        <div className="p-3" style={subCardStyle}>
                            <p className="small mb-0 leading-relaxed" style={{ color: textPrimary }}>
                                {supplements}
                            </p>
                        </div>
                    </div>

                    {/* Trainer Notes */}
                    <div className="p-4 mb-4" style={cardStyle}>
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: textPrimary }}>
                            <i className="bi bi-chat-square-quote-fill" style={{ color: '#10B981' }}></i>
                            Trainer Guidance & Advice
                        </h5>
                        <div className="p-3" style={subCardStyle}>
                            <p className="small mb-0 leading-relaxed" style={{ color: textSecondary }}>
                                "{trainerNotes}"
                            </p>
                        </div>
                    </div>

                    {/* Quick Nutrition Tips */}
                    <div className="p-4" style={cardStyle}>
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: textPrimary }}>
                            <i className="bi bi-lightbulb-fill text-warning"></i>
                            Nutrition Rules
                        </h5>
                        <ul className="list-unstyled small vstack gap-2 mb-0" style={{ color: textSecondary }}>
                            <li className="d-flex align-items-start gap-2">
                                <i className="bi bi-check-circle-fill text-emerald-500 mt-1"></i>
                                Consume 30g protein within 45 mins post-workout.
                            </li>
                            <li className="d-flex align-items-start gap-2">
                                <i className="bi bi-check-circle-fill text-emerald-500 mt-1"></i>
                                Drink at least 1 liter of water for every 20kg of body weight.
                            </li>
                            <li className="d-flex align-items-start gap-2">
                                <i className="bi bi-check-circle-fill text-emerald-500 mt-1"></i>
                                Avoid complex carbs 2 hours before sleep.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Modal to Add New Food Item */}
            {showAddModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ background: isLight ? '#FFFFFF' : '#1E293B', color: textPrimary, borderRadius: '16px' }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    <i className="bi bi-plus-circle-fill text-emerald-500 me-2"></i>
                                    Add Food Item to {meals.find(m => m.id === selectedMealId)?.name}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <form onSubmit={handleAddFoodItem}>
                                <div className="modal-body vstack gap-3 pt-3">
                                    {modalError && (
                                        <div className="alert alert-warning py-2 px-3 small d-flex align-items-center gap-2 mb-0 rounded-3">
                                            <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                                            <span>{modalError}</span>
                                        </div>
                                    )}
                                    <div>
                                        <label className="form-label small fw-semibold">Food Item Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            style={{ background: isLight ? '#F8FAFC' : '#0F172A', color: textPrimary, border: `1px solid ${isLight ? '#CBD5E1' : '#334155'}` }}
                                            placeholder="e.g. Scrambled Eggs / Protein Smoothie"
                                            value={newItem.name}
                                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label small fw-semibold">Portion Size / Ingredients *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            style={{ background: isLight ? '#F8FAFC' : '#0F172A', color: textPrimary, border: `1px solid ${isLight ? '#CBD5E1' : '#334155'}` }}
                                            placeholder="e.g. 2 whole eggs + 1 slice toast"
                                            value={newItem.portion}
                                            onChange={(e) => setNewItem({ ...newItem, portion: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="row g-2">
                                        <div className="col-6">
                                            <label className="form-label small fw-semibold">Calories (kcal)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                style={{ background: isLight ? '#F8FAFC' : '#0F172A', color: textPrimary, border: `1px solid ${isLight ? '#CBD5E1' : '#334155'}` }}
                                                placeholder="e.g. 210"
                                                value={newItem.calories}
                                                min="0"
                                                max="5000"
                                                onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
                                                onChange={(e) => setNewItem({ ...newItem, calories: e.target.value.replace(/[^0-9]/g, '') })}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-semibold">Protein (g)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                style={{ background: isLight ? '#F8FAFC' : '#0F172A', color: textPrimary, border: `1px solid ${isLight ? '#CBD5E1' : '#334155'}` }}
                                                placeholder="e.g. 24"
                                                value={newItem.protein}
                                                min="0"
                                                max="500"
                                                onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
                                                onChange={(e) => setNewItem({ ...newItem, protein: e.target.value.replace(/[^0-9]/g, '') })}
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-2">
                                        <div className="col-6">
                                            <label className="form-label small fw-semibold">Category / Type</label>
                                            <select
                                                className="form-select"
                                                style={{ background: isLight ? '#F8FAFC' : '#0F172A', color: textPrimary, border: `1px solid ${isLight ? '#CBD5E1' : '#334155'}` }}
                                                value={newItem.type}
                                                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                                            >
                                                <option value="High Protein">High Protein</option>
                                                <option value="Complex Carbs">Complex Carbs</option>
                                                <option value="Healthy Fats">Healthy Fats</option>
                                                <option value="Vitamins & Fiber">Vitamins & Fiber</option>
                                                <option value="Antioxidants">Antioxidants</option>
                                                <option value="Custom">Custom</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-semibold">Icon Emoji</label>
                                            <select
                                                className="form-select"
                                                style={{ background: isLight ? '#F8FAFC' : '#0F172A', color: textPrimary, border: `1px solid ${isLight ? '#CBD5E1' : '#334155'}` }}
                                                value={newItem.icon}
                                                onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                                            >
                                                <option value="🥗">🥗 Salad / Greens</option>
                                                <option value="🥚">🥚 Eggs</option>
                                                <option value="🍗">🍗 Poultry / Meat</option>
                                                <option value="🐟">🐟 Fish / Seafood</option>
                                                <option value="🥣">🥣 Oats / Soup</option>
                                                <option value="🍚">🍚 Rice / Grains</option>
                                                <option value="🥛">🥛 Dairy / Milk</option>
                                                <option value="🥤">🥤 Protein Shake</option>
                                                <option value="🍌">🍌 Fruit</option>
                                                <option value="🥜">🥜 Nuts / Seeds</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn text-white fw-bold px-4" style={{ background: '#10B981' }}>
                                        <i className="bi bi-check-circle-fill me-1"></i> Add Food Item
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DietModule;
