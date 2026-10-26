export const PREBUILT_ROUTINES = [
    {
        id: 'chest-triceps',
        category: 'Chest Day',
        title: '🔥 Chest & Triceps Hypertrophy',
        shortTitle: 'Chest & Triceps',
        badge: 'Push Protocol',
        difficulty: 'Intermediate',
        targetMuscles: 'Pectoralis Major, Anterior Deltoids, Triceps Brachii',
        description: 'Progressive incline overload, sternal isolation flyes, and tricep lockouts designed for maximum hypertrophy.',
        estimatedDuration: '45-55 mins',
        calorieBurn: '380-450 kcal',
        icon: 'bi-fire',
        color: '#FF1E28',
        exercises: [
            { id: 101, name: 'Incline Dumbbell Bench Press', sets: 4, reps: '10-12', targetLoad: '26 kg', notes: '30-degree bench angle, 3-second negative eccentric stretch at bottom.' },
            { id: 102, name: 'Flat Barbell Bench Press', sets: 4, reps: '8-10', targetLoad: '70 kg', notes: 'Retract scapulae, touch lower sternum, explosive drive.' },
            { id: 103, name: 'High-to-Low Cable Chest Flyes', sets: 3, reps: '15', targetLoad: '14 kg', notes: 'Maintain constant cable tension, 1-second peak contraction squeeze.' },
            { id: 104, name: 'Weighted Tricep Dips', sets: 3, reps: '12', targetLoad: '+15 kg', notes: 'Keep torso upright to bias triceps, complete lockout at top.' },
            { id: 105, name: 'Overhead Rope Tricep Extensions', sets: 4, reps: '12-15', targetLoad: '22 kg', notes: 'Flare rope outward at full extension for lateral head recruitment.' }
        ]
    },
    {
        id: 'back-biceps',
        category: 'Back Day',
        title: '⚡ Back & Biceps Overload',
        shortTitle: 'Back & Biceps',
        badge: 'Pull Protocol',
        difficulty: 'Intermediate',
        targetMuscles: 'Latissimus Dorsi, Rhomboids, Trapezius, Biceps Brachii',
        description: 'Comprehensive vertical and horizontal pull volume to maximize lat width, rhomboid density, and bicep thickness.',
        estimatedDuration: '50-60 mins',
        calorieBurn: '420-500 kcal',
        icon: 'bi-lightning-charge-fill',
        color: '#3B82F6',
        exercises: [
            { id: 201, name: 'Wide-Grip Lat Pulldowns', sets: 4, reps: '10-12', targetLoad: '55 kg', notes: 'Lead with elbows toward hip pockets, control the ascent stretch.' },
            { id: 202, name: 'Barbell Bent-Over Rows', sets: 4, reps: '8-10', targetLoad: '65 kg', notes: 'Hinge hips at 45 degrees, pull barbell directly into lower abdomen.' },
            { id: 203, name: 'Seated Cable Row (Neutral Grip)', sets: 3, reps: '12', targetLoad: '50 kg', notes: 'Full forward protraction stretch, pinch shoulder blades on squeeze.' },
            { id: 204, name: 'Incline Dumbbell Hammer Curls', sets: 4, reps: '12', targetLoad: '14 kg', notes: 'Elbows pinned back, emphasize brachialis and forearm thickness.' },
            { id: 205, name: 'EZ-Bar Spider Preacher Curls', sets: 3, reps: '10-12', targetLoad: '25 kg', notes: 'Strict vertical arm angle, zero swinging, squeeze at peak.' }
        ]
    },
    {
        id: 'legs-power',
        category: 'Leg Day',
        title: '🦵 Quads, Hamstrings & Calves Power',
        shortTitle: 'Leg Day Power',
        badge: 'Lower Body',
        difficulty: 'Advanced',
        targetMuscles: 'Quadriceps, Hamstrings, Gluteus Maximus, Gastrocnemius',
        description: 'Heavy compound lower body protocol building explosive posterior chain force, quad teardrops, and unilateral stability.',
        estimatedDuration: '55-65 mins',
        calorieBurn: '550-650 kcal',
        icon: 'bi-gem',
        color: '#10B981',
        exercises: [
            { id: 301, name: 'Barbell Back Squats', sets: 4, reps: '8-10', targetLoad: '85 kg', notes: 'Depth below parallel crease, explode through midfoot, brace core.' },
            { id: 302, name: 'Romanian Deadlifts (Barbell RDL)', sets: 4, reps: '10', targetLoad: '75 kg', notes: 'Hips push back, soft knee bend, deep stretch across hamstrings.' },
            { id: 303, name: 'Bulgarian Dumbbell Split Squats', sets: 3, reps: '10/leg', targetLoad: '18 kg DBs', notes: 'Elevated rear foot, slight forward torso angle for glute focus.' },
            { id: 304, name: 'Incline Leg Press (45 Degree)', sets: 4, reps: '12', targetLoad: '160 kg', notes: 'Keep lower back glued to pad, continuous tension without knee lock.' },
            { id: 305, name: 'Standing Machine Calf Raises', sets: 4, reps: '15-20', targetLoad: '55 kg', notes: 'Full 2-second isometric pause at bottom stretch, explosive raise.' }
        ]
    },
    {
        id: 'shoulders-traps',
        category: 'Shoulder Day',
        title: '🛡 Shoulders & Traps Boulder Builder',
        shortTitle: 'Shoulders & Traps',
        badge: 'Deltoid Focus',
        difficulty: 'Intermediate',
        targetMuscles: 'Anterior, Lateral & Posterior Deltoids, Upper Traps',
        description: 'Complete 3D deltoid capping through heavy vertical pressing, drop-set lateral raises, and external rotator stability.',
        estimatedDuration: '45-50 mins',
        calorieBurn: '360-420 kcal',
        icon: 'bi-shield-shaded',
        color: '#F59E0B',
        exercises: [
            { id: 401, name: 'Standing Overhead Military Press', sets: 4, reps: '8-10', targetLoad: '45 kg', notes: 'Tight glutes and abs, bar path clears chin into vertical lockout.' },
            { id: 402, name: 'Dumbbell Lateral Raises (Strict)', sets: 4, reps: '15', targetLoad: '12 kg', notes: 'Lead with elbows, slight pinky tilt, 2-second controlled descent.' },
            { id: 403, name: 'Face Pulls with External Rotation', sets: 4, reps: '15', targetLoad: '22 kg', notes: 'Pull rope ends to ears, rotate wrists back to finish posture.' },
            { id: 404, name: 'Incline Dumbbell Rear Delt Flyes', sets: 3, reps: '15', targetLoad: '10 kg', notes: 'Prone on 30-degree incline, strict posterior delt isolation.' },
            { id: 405, name: 'Heavy Barbell Shrugs', sets: 3, reps: '12', targetLoad: '90 kg', notes: 'Direct vertical elevation, 1-second pause at top, zero rolling.' }
        ]
    },
    {
        id: 'fullbody-athletic',
        category: 'Full Body',
        title: '💥 Athletic Conditioning & Power Endurance',
        shortTitle: 'Full Body Athletic',
        badge: 'Conditioning',
        difficulty: 'Advanced',
        targetMuscles: 'Full Body Kinetic Chain, Core Stabilizers, Cardiovascular',
        description: 'High-metabolic compound circuit blending ballistic power, plyometrics, and rotational core stability.',
        estimatedDuration: '40-50 mins',
        calorieBurn: '480-580 kcal',
        icon: 'bi-activity',
        color: '#EC4899',
        exercises: [
            { id: 501, name: 'Kettlebell Russian Swings', sets: 4, reps: '15', targetLoad: '24 kg', notes: 'Violent hip snap, glute lock at top, float kettlebell to chest.' },
            { id: 502, name: 'Barbell Thrusters', sets: 4, reps: '10', targetLoad: '40 kg', notes: 'Continuous motion from full front squat directly into overhead press.' },
            { id: 503, name: 'Dumbbell Renegade Rows into Push-ups', sets: 3, reps: '10', targetLoad: '16 kg DBs', notes: 'Wide feet base, eliminate pelvic sway during alternating rows.' },
            { id: 504, name: 'Plyometric Box Jumps', sets: 3, reps: '12', targetLoad: '24-30 in', notes: 'Absorb landing quietly in athletic squat, step down smoothly.' },
            { id: 505, name: 'Hanging Knee-to-Elbow Flexions', sets: 3, reps: '12-15', targetLoad: 'Bodyweight', notes: 'Zero momentum swing, pull knees to upper lats on each rep.' }
        ]
    },
    {
        id: 'hiit-metcon',
        category: 'HIIT',
        title: '⏱ High-Intensity MetCon & VO2 Max Burn',
        shortTitle: 'HIIT Shred',
        badge: 'Aerobic & Anaerobic',
        difficulty: 'Intermediate',
        targetMuscles: 'Cardiorespiratory System, Fast-Twitch Fibers, Core',
        description: 'Sprint intervals and anaerobic power output calibrated for maximum EPOC caloric burn and cardiovascular threshold.',
        estimatedDuration: '30-40 mins',
        calorieBurn: '450-550 kcal',
        icon: 'bi-stopwatch-fill',
        color: '#EF4444',
        exercises: [
            { id: 601, name: 'Curved Manual Treadmill Sprints', sets: 6, reps: '30s on / 30s off', targetLoad: 'Max Sprint', notes: 'Target 95% max heart rate, upright sprint mechanics.' },
            { id: 602, name: 'Assault AirBike Calorie Intervals', sets: 5, reps: '15 calories', targetLoad: 'High Cadence', notes: 'Full effort pedal and handle push-pull within 45 seconds.' },
            { id: 603, name: 'Battle Rope Double Slam & Alternating Waves', sets: 4, reps: '40 seconds', targetLoad: 'Heavy 2-inch Ropes', notes: 'Quarter squat stance, explosive ground slams.' },
            { id: 604, name: 'Dumbbell Burpee Box Jump Overs', sets: 3, reps: '10', targetLoad: '10 kg DBs', notes: 'Chest to floor, clean jump landing on both feet.' },
            { id: 605, name: 'Weighted Isometric Plank Hold', sets: 3, reps: '60 seconds', targetLoad: '+15 kg Plate', notes: 'Hollow body position, posterior pelvic tilt.' }
        ]
    },
    {
        id: 'core-mobility',
        category: 'Core',
        title: '🧘 Core Fortification & Spinal Mobility',
        shortTitle: 'Core & Mobility',
        badge: 'Postural Reset',
        difficulty: 'Beginner',
        targetMuscles: 'Transverse Abdominis, Obliques, Erectors, Hip Rotators',
        description: 'Lumbar stabilization, thoracic rotation, and hip mobility designed to prevent injury and support heavy loading.',
        estimatedDuration: '30-35 mins',
        calorieBurn: '200-260 kcal',
        icon: 'bi-universal-access',
        color: '#8B5CF6',
        exercises: [
            { id: 701, name: 'Ab Wheel Rollouts', sets: 4, reps: '10-12', targetLoad: 'Bodyweight', notes: 'Posterior pelvic tilt, extend to flat torso without lumbar arching.' },
            { id: 702, name: 'Standing Cable Diagonal Woodchoppers', sets: 3, reps: '12/side', targetLoad: '18 kg', notes: 'Torso rotation driven by hips, arms straight through arc.' },
            { id: 703, name: 'Hanging Straight-Leg Raises', sets: 3, reps: '10-12', targetLoad: 'Bodyweight', notes: 'Flex lats, bring toes to bar height without swinging.' },
            { id: 704, name: 'Deep Cossack Squats with Kettlebell', sets: 3, reps: '10/side', targetLoad: '12 kg KB', notes: 'Sink into heel on loaded side, keep opposite leg extended.' },
            { id: 705, name: 'Bird-Dog Spinal Stabilization Holds', sets: 3, reps: '8/side', targetLoad: 'Bodyweight', notes: 'Neutral spine, reach opposite fingertips and heel apart.' }
        ]
    }
];

export const PREBUILT_CATEGORIES = [
    'All Blueprints',
    'Chest Day',
    'Back Day',
    'Leg Day',
    'Shoulder Day',
    'Full Body',
    'HIIT',
    'Core'
];
