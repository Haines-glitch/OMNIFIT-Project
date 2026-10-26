import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

// Exercise movement detector
export const detectExercisePattern = (name = '') => {
    const n = (name || '').toLowerCase();
    if (n.includes('incline') && (n.includes('press') || n.includes('bench') || n.includes('dumbbell'))) return 'incline_bench_press';
    if (n.includes('bench') || (n.includes('press') && (n.includes('flat') || n.includes('chest')))) return 'bench_press';
    if (n.includes('pushup') || n.includes('push-up')) return 'pushup';
    if (n.includes('fly')) return 'chest_fly';
    if (n.includes('squat') || n.includes('leg press') || n.includes('lunge') || n.includes('split squat')) return 'squat';
    if (n.includes('deadlift') || n.includes('rdl') || n.includes('swing')) return 'deadlift';
    if (n.includes('pulldown') || n.includes('pull-up') || n.includes('pullup') || n.includes('row')) return 'lat_pulldown';
    if (n.includes('curl')) return 'bicep_curl';
    if (n.includes('dip') || n.includes('extension') || n.includes('pushdown')) return 'tricep_dip';
    if (n.includes('lateral raise') || n.includes('rear delt') || n.includes('shrug')) return 'lateral_raise';
    if (n.includes('overhead') || n.includes('military') || n.includes('shoulder press') || n.includes('thruster')) return 'overhead_press';
    if (n.includes('ab wheel') || n.includes('plank') || n.includes('rollout') || n.includes('raise') || n.includes('crunch') || n.includes('woodchopper') || n.includes('bird-dog')) return 'core';
    if (n.includes('sprint') || n.includes('treadmill') || n.includes('bike') || n.includes('burpee') || n.includes('wave') || n.includes('rope')) return 'sprint';
    return 'bench_press';
};

// Accurate, professional exercise guide database
const EXERCISE_METADATA = {
    squat: {
        pattern: 'Leg Strength & Hypertrophy',
        primaryMuscles: ['Quadriceps', 'Glutes'],
        secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
        breathing: 'Inhale as you lower your hips. Exhale as you drive back up.',
        tempo: '3 - 1 - 1 (Controlled descent, explosive drive)',
        cues: [
            'Stand tall with feet shoulder-width apart, barbell resting level across upper traps.',
            'Push hips back and bend knees until your thighs are parallel to the floor.',
            'Drive through your midfoot to stand upright, keeping your chest proud.'
        ],
        mistakes: [
            'Do not let your knees cave inward on the way up.',
            'Avoid bending forward excessively at the waist.',
            'Keep your heels glued firmly to the floor throughout.'
        ],
        phases: [
            {
                title: 'Phase 1: Setup & Stance',
                action: 'Grip the bar slightly wider than shoulders, pull shoulder blades together, and lock eyes forward.'
            },
            {
                title: 'Phase 2: Controlled Descent',
                action: 'Inhale and descend in 3 seconds, keeping weight balanced over midfoot until reaching parallel depth.'
            },
            {
                title: 'Phase 3: Explosive Drive',
                action: 'Exhale forcefully and push the floor away, locking out hips and knees at the top.'
            }
        ]
    },
    bench_press: {
        pattern: 'Chest & Triceps Power',
        primaryMuscles: ['Pectorals (Chest)', 'Triceps'],
        secondaryMuscles: ['Anterior Deltoids', 'Core'],
        breathing: 'Inhale lowering bar to chest. Exhale pressing up to lockout.',
        tempo: '2 - 1 - 1 (2s down, 1s pause, 1s push)',
        cues: [
            'Lie flat with eyes directly under the bar and feet planted firmly on the floor.',
            'Lower the bar in a controlled path to your lower sternum with elbows at 45°.',
            'Press the bar vertically back to arms extended, squeezing your chest at the top.'
        ],
        mistakes: [
            'Do not bounce the barbell off your ribcage.',
            'Avoid flaring your elbows out to 90 degrees.',
            'Keep your wrists straight; do not let them bend backward.'
        ],
        phases: [
            {
                title: 'Phase 1: Starting Setup',
                action: 'Squeeze shoulder blades into the bench, arch lower back naturally, and grip bar firmly.'
            },
            {
                title: 'Phase 2: Lowering to Sternum',
                action: 'Inhale deeply as you lower the bar under control until it touches mid-chest.'
            },
            {
                title: 'Phase 3: Vertical Drive',
                action: 'Drive through your legs and press bar upward to full arm extension, exhaling at the top.'
            }
        ]
    },
    incline_bench_press: {
        pattern: 'Upper Chest & Shoulders',
        primaryMuscles: ['Upper Chest (Clavicular)', 'Front Deltoids'],
        secondaryMuscles: ['Triceps', 'Upper Traps'],
        breathing: 'Inhale lowering dumbbells to chest. Exhale pressing up.',
        tempo: '3 - 0 - 1 (3s negative, 1s drive)',
        cues: [
            'Sit on a 30° to 45° incline bench with dumbbells held at shoulder level.',
            'Lower dumbbells in a smooth arc until level with your upper chest.',
            'Press vertically upward toward the ceiling, contracting your upper chest at peak.'
        ],
        mistakes: [
            'Avoid setting the bench angle too steep (>45°).',
            'Do not bang the dumbbells together at the top of the rep.',
            'Avoid lifting your hips off the seat during the press.'
        ],
        phases: [
            {
                title: 'Phase 1: Incline Seat Setup',
                action: 'Sit back against the incline pad, plant heels flat, and hold dumbbells above upper chest.'
            },
            {
                title: 'Phase 2: Controlled Stretch',
                action: 'Inhale for 3 seconds while lowering weights, feeling a full stretch across the upper chest.'
            },
            {
                title: 'Phase 3: Upward Lockout',
                action: 'Exhale and drive dumbbells vertically to straight arms, flexing upper chest at peak.'
            }
        ]
    },
    pushup: {
        pattern: 'Upper Body & Core',
        primaryMuscles: ['Chest', 'Triceps'],
        secondaryMuscles: ['Core', 'Shoulders'],
        breathing: 'Inhale lowering down. Exhale pressing back up.',
        tempo: '2 - 0 - 1 (Controlled cadence)',
        cues: [
            'Start in a high plank with hands shoulder-width and body in a rigid straight line.',
            'Lower your chest until it hovers 1 inch above the floor, elbows tucked at 45°.',
            'Press firmly through your palms to return to full arm extension.'
        ],
        mistakes: [
            'Do not let your hips sag toward the floor.',
            'Avoid flaring your elbows wide to the sides.',
            'Do not drop your head forward before your chest.'
        ],
        phases: [
            {
                title: 'Phase 1: High Plank Base',
                action: 'Squeeze glutes and abs tight, hands stacked directly under shoulders.'
            },
            {
                title: 'Phase 2: Controlled Descent',
                action: 'Inhale and lower entire body as one unit until chest hovers above the floor.'
            },
            {
                title: 'Phase 3: Floor Press',
                action: 'Exhale and push through palms, locking out arms while maintaining a rigid core.'
            }
        ]
    },
    chest_fly: {
        pattern: 'Chest Isolation',
        primaryMuscles: ['Pectorals (Inner & Outer)'],
        secondaryMuscles: ['Front Shoulders', 'Biceps'],
        breathing: 'Inhale opening arms wide. Exhale hugging weights together.',
        tempo: '3 - 1 - 1 (Deep stretch cadence)',
        cues: [
            'Maintain a slight, fixed bend in your elbows throughout the entire movement.',
            'Open arms wide in a hugging arc until you feel a deep chest stretch.',
            'Squeeze your chest muscles together at the peak without banging the weights.'
        ],
        mistakes: [
            'Avoid bending elbows excessively and turning the fly into a press.',
            'Do not drop weights below bench level, which strains shoulders.',
            'Avoid bouncing out of the stretched position.'
        ],
        phases: [
            {
                title: 'Phase 1: Starting Arc',
                action: 'Hold weights directly over chest with palms facing each other, elbows soft.'
            },
            {
                title: 'Phase 2: Wide Lateral Arc',
                action: 'Inhale and lower arms outward in a wide hugging motion to full chest stretch.'
            },
            {
                title: 'Phase 3: Peak Contraction',
                action: 'Exhale and squeeze chest to bring weights back together, holding 1s at top.'
            }
        ]
    },
    deadlift: {
        pattern: 'Posterior Chain & Glutes',
        primaryMuscles: ['Glutes', 'Hamstrings'],
        secondaryMuscles: ['Lower Back', 'Lats', 'Traps'],
        breathing: 'Inhale and brace core at bottom. Exhale at standing lockout.',
        tempo: '1 - 0 - 2 (Strong pull, controlled return)',
        cues: [
            'Stand with midfoot directly under the barbell, feet hip-width apart.',
            'Hinge at hips, keep your back flat, and grip the bar just outside your knees.',
            'Push the floor away through your heels to stand tall, locking out your glutes.'
        ],
        mistakes: [
            'Never round your lower back when pulling off the floor.',
            'Avoid letting the barbell drift away from your shins.',
            'Do not hyperextend your lower back backward at lockout.'
        ],
        phases: [
            {
                title: 'Phase 1: Setup & Grip',
                action: 'Shins touching the bar, chest proud, lats engaged to pull slack out of the bar.'
            },
            {
                title: 'Phase 2: Leg Drive Off Floor',
                action: 'Push the floor away with midfoot, keeping bar glued to legs until crossing knees.'
            },
            {
                title: 'Phase 3: Glute Lockout',
                action: 'Drive hips through to stand tall with shoulders packed, exhaling at the top.'
            }
        ]
    },
    lat_pulldown: {
        pattern: 'Back Width & Lats',
        primaryMuscles: ['Latissimus Dorsi (Back)'],
        secondaryMuscles: ['Biceps', 'Rhomboids', 'Rear Shoulders'],
        breathing: 'Exhale pulling bar down to chest. Inhale letting bar rise.',
        tempo: '2 - 1 - 2 (Pause on squeeze)',
        cues: [
            'Grip the bar slightly wider than shoulders, thighs firmly anchored under pads.',
            'Pull the bar smoothly down to your upper chest, leading with your elbows.',
            'Control the bar back up over 2 seconds to feel a complete stretch in your back.'
        ],
        mistakes: [
            'Do not swing your torso backward to use momentum.',
            'Never pull the bar behind your neck.',
            'Avoid rolling shoulders forward at the bottom.'
        ],
        phases: [
            {
                title: 'Phase 1: Overhead Grip',
                action: 'Thighs locked under pads, arms fully stretched overhead, torso upright with slight lean.'
            },
            {
                title: 'Phase 2: Elbow Drive Down',
                action: 'Exhale, pull shoulder blades down, and drive elbows toward ribs until bar hits chest.'
            },
            {
                title: 'Phase 3: Controlled Ascent',
                action: 'Inhale and allow bar to rise smoothly over 2 seconds, stretching lats fully.'
            }
        ]
    },
    bicep_curl: {
        pattern: 'Bicep Peak Hypertrophy',
        primaryMuscles: ['Biceps'],
        secondaryMuscles: ['Forearms', 'Brachialis'],
        breathing: 'Exhale curling weights up. Inhale lowering slowly.',
        tempo: '2 - 1 - 3 (3-second negative)',
        cues: [
            'Stand upright with dumbbells at your sides, elbows pinned to your ribs.',
            'Curl forearms upward, rotating wrists so palms face up near the top.',
            'Squeeze biceps firmly for 1 second, then lower slowly over 3 seconds.'
        ],
        mistakes: [
            'Do not swing your body or use momentum to heave weights up.',
            'Keep elbows pinned; do not drift them forward.',
            'Do not drop weights rapidly without controlling the descent.'
        ],
        phases: [
            {
                title: 'Phase 1: Starting Hang',
                action: 'Arms hanging naturally at sides, shoulders relaxed back, core braced.'
            },
            {
                title: 'Phase 2: Supinating Curl',
                action: 'Exhale and curl dumbbells upward, rotating wrists so palms face shoulders at top.'
            },
            {
                title: 'Phase 3: 3-Second Negative',
                action: 'Squeeze bicep at peak for 1 second, then take 3 full seconds to lower to start.'
            }
        ]
    },
    tricep_dip: {
        pattern: 'Triceps & Dip Power',
        primaryMuscles: ['Triceps'],
        secondaryMuscles: ['Lower Chest', 'Front Deltoids'],
        breathing: 'Inhale lowering down. Exhale pressing to lockout.',
        tempo: '2 - 0 - 1 (Smooth cadence)',
        cues: [
            'Grip parallel bars with arms locked and shoulders pressed down away from ears.',
            'Lower your body under control until elbows form a 90-degree angle.',
            'Press through your palms to return to full elbow extension.'
        ],
        mistakes: [
            'Do not drop below a 90° elbow bend, which stresses shoulder joints.',
            'Avoid flaring your elbows out to the sides.',
            'Do not shrug your shoulders into your neck.'
        ],
        phases: [
            {
                title: 'Phase 1: Top Lockout',
                action: 'Arms straight on parallel bars, shoulders packed down, legs crossed behind.'
            },
            {
                title: 'Phase 2: 90-Degree Dip',
                action: 'Inhale and bend elbows backward until forearms form a clean 90° angle.'
            },
            {
                title: 'Phase 3: Triceps Press',
                action: 'Exhale and push firmly through palms to return to locked-out arms.'
            }
        ]
    },
    overhead_press: {
        pattern: 'Shoulder Strength & Deltoids',
        primaryMuscles: ['Deltoids (Shoulders)'],
        secondaryMuscles: ['Triceps', 'Upper Traps', 'Core'],
        breathing: 'Inhale at collarbone. Exhale pressing overhead.',
        tempo: '2 - 0 - 1 (Vertical drive)',
        cues: [
            'Stand tall with feet hip-width, barbell resting across your collarbone.',
            'Press the bar straight up overhead, tilting your head back slightly to clear your chin.',
            'Lock out arms directly over head and spine, keeping glutes and abs tight.'
        ],
        mistakes: [
            'Do not arch your lower back backward during the press.',
            'Avoid pressing the bar forward in an arc instead of straight up.',
            'Do not bend your knees to cheat the lift with a push press.'
        ],
        phases: [
            {
                title: 'Phase 1: Front Rack Setup',
                action: 'Bar resting on upper chest, forearms vertical, glutes clamped tight.'
            },
            {
                title: 'Phase 2: Vertical Press',
                action: 'Exhale and drive bar straight upward, clearing your face as you push.'
            },
            {
                title: 'Phase 3: Overhead Lockout',
                action: 'Push head forward through the window of your arms, locking bar over crown.'
            }
        ]
    },
    lateral_raise: {
        pattern: 'Side Deltoid Capping',
        primaryMuscles: ['Lateral Deltoids (Side Shoulders)'],
        secondaryMuscles: ['Front Deltoids', 'Traps'],
        breathing: 'Exhale raising arms to sides. Inhale lowering slowly.',
        tempo: '2 - 1 - 2 (Smooth control)',
        cues: [
            'Hold dumbbells at your sides with a slight forward torso lean and soft elbows.',
            'Raise arms outward and upward leading with your elbows until parallel to the floor.',
            'Lower weights under control over 2 seconds; avoid swinging.'
        ],
        mistakes: [
            'Do not use momentum or rock your hips to swing weights up.',
            'Do not raise weights above shoulder level, which transfers load to traps.',
            'Avoid locking elbows completely straight.'
        ],
        phases: [
            {
                title: 'Phase 1: Starting Hang',
                action: 'Dumbbells at sides of thighs with palms facing inwards, knees softly bent.'
            },
            {
                title: 'Phase 2: Lateral Sweep',
                action: 'Exhale and sweep arms out to the sides until parallel to the floor.'
            },
            {
                title: 'Phase 3: Controlled Lowering',
                action: 'Pause 1 second at shoulder height, then take 2 seconds to lower smoothly.'
            }
        ]
    },
    core: {
        pattern: 'Core Stability & Abs',
        primaryMuscles: ['Abdominals (Core)'],
        secondaryMuscles: ['Obliques', 'Lower Back'],
        breathing: 'Inhale extending outward. Exhale forcefully pulling back.',
        tempo: '3 - 1 - 2 (Continuous tension)',
        cues: [
            'Start kneeling with hands on wheel or in plank position under shoulders.',
            'Roll forward from hips while keeping your spine and core rock-solid.',
            'Pull back by contracting your abdominal wall rather than using your hips.'
        ],
        mistakes: [
            'Never let your lower back sag into an arch during extension.',
            'Do not lead the return movement with your hips.',
            'Do not extend further than your core strength can support.'
        ],
        phases: [
            {
                title: 'Phase 1: High Plank / Rollout Base',
                action: 'Tuck pelvis under, brace abs like taking a punch, hands under shoulders.'
            },
            {
                title: 'Phase 2: Extension',
                action: 'Inhale and extend body forward in a controlled line, keeping abs rigid.'
            },
            {
                title: 'Phase 3: Abdominal Crunch Return',
                action: 'Exhale and pull navel toward spine, returning smoothly to starting position.'
            }
        ]
    },
    sprint: {
        pattern: 'Conditioning & Cardio',
        primaryMuscles: ['Quads', 'Hamstrings', 'Calves'],
        secondaryMuscles: ['Cardiovascular System', 'Core'],
        breathing: 'Maintain steady, rhythmic athletic breathing.',
        tempo: 'High-frequency cadence',
        cues: [
            'Drive knees high with toes flexed upward toward your shins.',
            'Pump arms rhythmically from cheek to hip pocket with 90° elbows.',
            'Land lightly on the balls of your feet directly beneath your hips.'
        ],
        mistakes: [
            'Do not overstride with your heels striking far out in front.',
            'Avoid swinging arms across your chest midline.',
            'Do not tense your shoulders or neck.'
        ],
        phases: [
            {
                title: 'Phase 1: High Knee Punch',
                action: 'Drive lead knee to hip level with ankle flexed up, opposite arm forward.'
            },
            {
                title: 'Phase 2: Midfoot Strike',
                action: 'Ball of foot strikes floor directly beneath center of mass.'
            },
            {
                title: 'Phase 3: Explosive Push-Off',
                action: 'Drive through foot to propel body forward into next turnover stride.'
            }
        ]
    }
};

/**
 * Procedural Vector Kinematics Engine for Leap Fitness Style Avatar
 * Guarantees:
 * 1. Barbells remain strictly HORIZONTAL (never tilted at weird angles).
 * 2. Muscle glows sit directly ON the anatomical muscles (never on the floor).
 * 3. Proportional, clean athletic silhouette with hands holding equipment.
 */
function drawExerciseKinematics(ctx, w, h, pattern, p, isConcentric) {
    ctx.save();

    const skin = '#E2E8F0'; // Sleek athletic mannequin silver/slate
    const redGlow = '#FF1E28'; // Iron District Neon Crimson
    const gymFloor = '#1c1c28';

    // Helper: Draw Faceless Head with Sleek Athletic Visor
    const drawHead = (x, y, r = 16, angle = 0) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sleek visor slit
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(r * 0.2, -r * 0.35, r * 0.6, 5, 2);
        ctx.fill();
        ctx.restore();
    };

    // Helper: Smooth Anatomical Capsule Limb
    const drawCapsule = (x1, y1, x2, y2, r1 = 12, r2 = 9) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1) return;

        const angle = Math.atan2(dy, dx);
        ctx.save();
        ctx.translate(x1, y1);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(0, -r1);
        ctx.lineTo(len, -r2);
        ctx.arc(len, 0, r2, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(0, r1);
        ctx.arc(0, 0, r1, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();

        ctx.fillStyle = skin;
        ctx.fill();
        ctx.restore();
    };

    // Helper: Target Muscle Radial Crimson Glow Overlay
    const drawTargetGlow = (cx, cy, rx, ry, intensity = 0.8) => {
        ctx.save();
        ctx.shadowColor = redGlow;
        ctx.shadowBlur = 20 * intensity;

        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, rx);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        grad.addColorStop(0.35, redGlow);
        grad.addColorStop(1, 'rgba(255, 30, 40, 0)');
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    };

    // Helper: Level Horizontal Barbell (Always Stays Horizontal!)
    const drawBarbell = (cx, cy, length = 200) => {
        ctx.save();
        // Chrome knurled steel bar
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - length / 2, cy);
        ctx.lineTo(cx + length / 2, cy);
        ctx.stroke();

        // Knurling details
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 35, cy);
        ctx.lineTo(cx + 35, cy);
        ctx.stroke();

        // Red Olympic Bumper Plates (Level on both ends)
        ctx.fillStyle = '#DC2626';
        ctx.shadowColor = redGlow;
        ctx.shadowBlur = 8;
        // Left plates
        ctx.fillRect(cx - length / 2 + 10, cy - 24, 12, 48);
        ctx.fillRect(cx - length / 2 + 24, cy - 20, 8, 40);
        // Right plates
        ctx.fillRect(cx + length / 2 - 22, cy - 24, 12, 48);
        ctx.fillRect(cx + length / 2 - 32, cy - 20, 8, 40);
        ctx.restore();
    };

    // Helper: Dumbbell
    const drawDumbbell = (cx, cy, angle = 0) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Handle
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(12, 0);
        ctx.stroke();

        // Hex heads
        ctx.fillStyle = '#DC2626';
        ctx.shadowColor = redGlow;
        ctx.shadowBlur = 8;
        ctx.fillRect(-18, -12, 6, 24);
        ctx.fillRect(12, -12, 6, 24);
        ctx.restore();
    };

    // Helper: Draw Gym Floor Line
    const drawFloor = (floorY = 280) => {
        ctx.strokeStyle = '#272738';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(40, floorY);
        ctx.lineTo(520, floorY);
        ctx.stroke();

        // Mat strip
        ctx.fillStyle = gymFloor;
        ctx.fillRect(100, floorY, 360, 6);
    };

    // -----------------------------------------------------------------------------------
    // KINEMATICS RENDERERS BY EXERCISE PATTERN
    // -----------------------------------------------------------------------------------

    if (pattern === 'squat') {
        // -------------------------------------------------------------
        // BARBELL BACK SQUAT (Textbook Biomechanics)
        // -------------------------------------------------------------
        const floorY = 275;
        drawFloor(floorY);

        // p: 0 = standing upright, 1 = deep parallel squat
        const s = p;
        const quadContraction = 0.4 + (1 - s) * 0.6; // Contracts as lifter drives up

        // Heels glued firmly to floor at midfoot X = 280
        const footX = 280;
        const footY = floorY;

        // Kinematics:
        // Standing (s=0): Ankle(280, 268), Knee(275, 195), Hip(285, 125), Shoulder(280, 55), Head(278, 28)
        // Parallel Squat (s=1): Knee tracks forward to (235, 218), Hips sink back to (330, 218) [parallel!],
        // Torso has natural 28° forward lean: Shoulder(270, 142), Head(255, 118)
        const kneeX = 275 - s * 40;
        const kneeY = 195 + s * 23;

        const hipX = 285 + s * 45;
        const hipY = 125 + s * 93;

        const shoulderX = 280 - s * 10;
        const shoulderY = 55 + s * 87;

        const headX = 278 - s * 20;
        const headY = 28 + s * 87;

        // Barbell stays 100% HORIZONTAL across traps!
        const barY = shoulderY + 5;
        const barX = shoulderX + 2;

        // 1. Draw Feet & Shoes
        ctx.fillStyle = '#475569';
        ctx.fillRect(footX - 45, footY - 8, 55, 10);

        // 2. Draw Legs: Shin & Thigh
        drawCapsule(footX - 10, footY - 8, kneeX, kneeY, 14, 18); // Shin
        drawCapsule(kneeX, kneeY, hipX, hipY, 20, 24); // Thigh / Quad

        // 3. TARGET MUSCLE GLOW: Quadriceps (Midpoint between Hip and Knee)
        const quadMidX = (hipX + kneeX) / 2;
        const quadMidY = (hipY + kneeY) / 2 - 4;
        drawTargetGlow(quadMidX, quadMidY, 24, 16, quadContraction);

        // Glute Glow at Hips
        drawTargetGlow(hipX + 6, hipY - 6, 18, 18, quadContraction * 0.8);

        // 4. Torso & Head
        drawCapsule(hipX, hipY, shoulderX, shoulderY, 24, 22); // Torso spine
        drawHead(headX, headY, 16, -s * 0.25);

        // 5. Hands Gripping Barbell
        drawCapsule(shoulderX, shoulderY, barX - 18, barY + 14, 13, 10); // Upper arm
        drawCapsule(barX - 18, barY + 14, barX - 12, barY, 11, 9); // Forearm to hand

        // 6. BARBELL (Strictly Level & Horizontal!)
        drawBarbell(barX, barY, 210);

    } else if (pattern === 'bench_press') {
        // -------------------------------------------------------------
        // FLAT BARBELL BENCH PRESS
        // -------------------------------------------------------------
        const floorY = 275;
        drawFloor(floorY);

        // Bench Pad & Supports
        ctx.fillStyle = '#1e1e2d';
        ctx.strokeStyle = '#38384f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(140, 195, 270, 16, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#14141e';
        ctx.fillRect(200, 211, 16, 64);
        ctx.fillRect(350, 211, 16, 64);

        // Lifter lying flat
        const headX = 175;
        const headY = 182;
        const shoulderX = 215;
        const shoulderY = 185;
        const hipX = 330;
        const hipY = 185;

        // Legs on floor
        drawCapsule(hipX, hipY, 370, 225, 20, 16);
        drawCapsule(370, 225, 375, floorY, 16, 12);
        ctx.fillStyle = '#475569';
        ctx.fillRect(370, floorY - 8, 35, 10);

        // Torso
        drawCapsule(shoulderX, shoulderY, hipX, hipY, 24, 22);
        drawHead(headX, headY, 15, -Math.PI / 2);

        // Pectoral Muscle Glow
        const chestContraction = 0.4 + (1 - p) * 0.6;
        drawTargetGlow(245, 178, 26, 16, chestContraction);

        // Vertical Barbell Motion (Level Horizontal)
        // p=1: bar touching chest (y=155); p=0: locked out (y=85)
        const barY = 85 + p * 70;
        const barX = 245;

        // Arms Pressing
        const elbowY = 160 + p * 25;
        drawCapsule(shoulderX, shoulderY, shoulderX - 10, elbowY, 16, 13);
        drawCapsule(shoulderX - 10, elbowY, barX - 15, barY, 13, 10);

        // Barbell
        drawBarbell(barX, barY, 190);

    } else if (pattern === 'incline_bench_press') {
        // -------------------------------------------------------------
        // TRUE 35° INCLINE DUMBBELL BENCH PRESS
        // -------------------------------------------------------------
        const floorY = 275;
        drawFloor(floorY);

        // Bench Frame on Floor
        ctx.fillStyle = '#14141e';
        ctx.fillRect(160, 267, 240, 8);
        ctx.fillRect(305, 225, 14, 45); // Post under seat

        // Incline Strut under backrest
        ctx.strokeStyle = '#1e1e2c';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(200, 270);
        ctx.lineTo(250, 190);
        ctx.stroke();

        // Horizontal Seat Pad
        ctx.fillStyle = '#1c1c28';
        ctx.strokeStyle = '#38384f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(290, 218, 55, 14, 4);
        ctx.fill();
        ctx.stroke();

        // 35° Incline Backrest Pad
        ctx.save();
        ctx.translate(290, 222);
        ctx.rotate(-0.62); // 35.5 degrees UPWARD
        ctx.fillStyle = '#1c1c28';
        ctx.strokeStyle = '#E50914';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(0, -6, 160, 14, 4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Lifter on Incline
        const hipX = 295;
        const hipY = 215;
        const shoulderX = 210;
        const shoulderY = 155;
        const headX = 185;
        const headY = 135;

        // Legs on floor
        drawCapsule(hipX, hipY, 345, 225, 20, 16);
        drawCapsule(345, 225, 350, floorY, 16, 12);
        ctx.fillStyle = '#475569';
        ctx.fillRect(345, floorY - 8, 35, 10);

        // Torso & Head
        drawCapsule(hipX, hipY, shoulderX, shoulderY, 26, 22);
        drawHead(headX, headY, 16, -0.4);

        // Clavicular Upper Chest Glow
        const chestContraction = 0.4 + (1 - p) * 0.6;
        drawTargetGlow(235, 170, 22, 16, chestContraction);

        // Vertical Dumbbell Drive (p=1: handY=145, p=0: handY=70)
        const handY = 70 + p * 75;
        const handX = 235;
        const elbowX = 210 - p * 8;
        const elbowY = 160 + p * 20;

        drawCapsule(shoulderX, shoulderY, elbowX, elbowY, 15, 12);
        drawCapsule(elbowX, elbowY, handX, handY, 13, 10);

        // Red Hex Dumbbells
        drawDumbbell(handX, handY, -0.2);

    } else if (pattern === 'pushup') {
        // -------------------------------------------------------------
        // PUSHUP (Straight Body Plank)
        // -------------------------------------------------------------
        const floorY = 275;
        drawFloor(floorY);

        const bodyY = 215 + p * 45; // Descends smoothly
        const chestContraction = 0.4 + (1 - p) * 0.6;

        // Feet on floor
        ctx.fillStyle = '#475569';
        ctx.fillRect(135, floorY - 8, 25, 10);

        // Straight Body Line from heels to crown
        drawCapsule(150, floorY - 8, 235, bodyY + 15, 18, 16); // Legs
        drawCapsule(235, bodyY + 15, 335, bodyY - 10, 24, 20); // Torso
        drawHead(365, bodyY - 20, 16, 0.2);

        // Chest & Core Glow
        drawTargetGlow(310, bodyY, 24, 16, chestContraction);

        // Arms pushing against floor
        const elbowX = 330 + p * 20;
        const elbowY = bodyY + 15 + p * 15;
        drawCapsule(330, bodyY - 5, elbowX, elbowY, 15, 13);
        drawCapsule(elbowX, elbowY, 340, floorY - 4, 13, 10);

    } else if (pattern === 'lat_pulldown') {
        // -------------------------------------------------------------
        // WIDE-GRIP LAT PULLDOWN
        // -------------------------------------------------------------
        drawFloor(275);

        // Machine Frame & Top Pulley
        ctx.fillStyle = '#1e1e2d';
        ctx.fillRect(250, 195, 60, 14); // Seat
        ctx.fillRect(274, 30, 12, 180); // Center beam
        ctx.fillRect(220, 30, 120, 12); // Top beam

        const latContraction = 0.3 + p * 0.7;
        const barY = 55 + p * 85; // Moves from 55 down to 140

        // Seated Athlete
        drawCapsule(280, 210, 280, 120, 24, 20); // Torso
        drawHead(280, 92, 16, 0);

        // Lat Wings Glow
        drawTargetGlow(258, 145, 18, 30, latContraction);
        drawTargetGlow(302, 145, 18, 30, latContraction);

        // Legs under pad
        drawCapsule(270, 210, 250, 275, 18, 14);
        drawCapsule(290, 210, 310, 275, 18, 14);

        // Arms Pulling Bar
        const leftElbowX = 230 - (1 - p) * 15;
        const leftElbowY = 110 + p * 35;
        drawCapsule(265, 115, leftElbowX, leftElbowY, 14, 12);
        drawCapsule(leftElbowX, leftElbowY, 200, barY, 12, 10);

        const rightElbowX = 330 + (1 - p) * 15;
        const rightElbowY = 110 + p * 35;
        drawCapsule(295, 115, rightElbowX, rightElbowY, 14, 12);
        drawCapsule(rightElbowX, rightElbowY, 360, barY, 12, 10);

        // Cable Line
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(280, 42);
        ctx.lineTo(280, barY);
        ctx.stroke();

        // Wide Pulldown Bar (Level Horizontal)
        drawBarbell(280, barY, 210);

    } else if (pattern === 'deadlift') {
        // -------------------------------------------------------------
        // BARBELL DEADLIFT / RDL (Strict Vertical Bar Path)
        // -------------------------------------------------------------
        const floorY = 275;
        drawFloor(floorY);

        const s = p;
        const gluteContraction = 0.4 + (1 - s) * 0.6;

        // Feet flat on floor
        const footX = 295;
        ctx.fillStyle = '#475569';
        ctx.fillRect(footX - 45, floorY - 8, 55, 10);

        // Lockout (s=0): Hips(295, 140), Shoulders(290, 70), Bar(270, 150)
        // Bottom Hinge (s=1): Hips push back to (340, 155), Shoulders forward to (255, 130), Bar at shins (255, 235)
        const kneeX = 290 - s * 10;
        const kneeY = 210 + s * 10;

        const hipX = 295 + s * 45;
        const hipY = 140 + s * 15;

        const shoulderX = 290 - s * 35;
        const shoulderY = 70 + s * 60;

        const headX = 290 - s * 45;
        const headY = 42 + s * 60;

        const barX = 265;
        const barY = 150 + s * 85; // Strict vertical bar path!

        // Legs
        drawCapsule(footX - 15, floorY - 8, kneeX, kneeY, 14, 16);
        drawCapsule(kneeX, kneeY, hipX, hipY, 20, 24);

        // Hamstring & Glute Glow
        drawTargetGlow(hipX + 5, hipY - 5, 20, 24, gluteContraction);
        drawTargetGlow((hipX + kneeX) / 2 + 5, (hipY + kneeY) / 2, 16, 22, gluteContraction * 0.8);

        // Torso & Head
        drawCapsule(hipX, hipY, shoulderX, shoulderY, 24, 22);
        drawHead(headX, headY, 16, -s * 0.4);

        // Arms hanging straight down to barbell
        drawCapsule(shoulderX, shoulderY, barX, barY, 14, 10);

        // Barbell (Level Horizontal)
        drawBarbell(barX, barY, 190);

    } else if (pattern === 'bicep_curl') {
        // -------------------------------------------------------------
        // STANDING BICEP CURL
        // -------------------------------------------------------------
        drawFloor(275);

        // Standing Legs & Torso
        drawCapsule(260, 275, 260, 145, 20, 16);
        drawCapsule(260, 145, 260, 75, 24, 20);
        drawHead(260, 48, 16, 0);

        // Elbow pinned strictly at side
        const elbowX = 290;
        const elbowY = 145;

        // Forearm curls up (p: 0 = down at 215, 1 = curled at 105)
        const armAngle = Math.PI / 2 - p * (Math.PI * 0.72);
        const handX = elbowX + Math.cos(armAngle) * 55;
        const handY = elbowY + Math.sin(armAngle) * 55;

        const bicepContraction = 0.3 + p * 0.7;

        // Left idle arm
        drawCapsule(230, 85, 225, 175, 14, 10);

        // Right active curling arm
        drawCapsule(275, 85, elbowX, elbowY, 16, 14);
        drawCapsule(elbowX, elbowY, handX, handY, 14, 10);

        // Bicep Muscle Glow Swell
        drawTargetGlow(elbowX - 4, elbowY - 20, 16, 20, bicepContraction);

        // Dumbbell
        drawDumbbell(handX, handY, armAngle);

    } else if (pattern === 'tricep_dip') {
        // -------------------------------------------------------------
        // TRICEP DIP
        // -------------------------------------------------------------
        // Parallel Bars
        ctx.fillStyle = '#1e1e2d';
        ctx.strokeStyle = '#38384f';
        ctx.lineWidth = 3;
        ctx.fillRect(210, 160, 140, 8);
        ctx.fillRect(230, 160, 12, 115);
        ctx.fillRect(320, 160, 12, 115);

        const torsoY = 85 + p * 50; // Descends smoothly
        const tricepContraction = 0.4 + (1 - p) * 0.6;

        // Torso & Head
        drawHead(280, torsoY - 25, 16, 0);
        drawCapsule(280, torsoY + 65, 280, torsoY, 24, 20);

        // Crossed Legs
        drawCapsule(280, torsoY + 65, 265, torsoY + 125, 18, 14);
        drawCapsule(265, torsoY + 125, 290, torsoY + 140, 14, 10);

        // Triceps Glow
        drawTargetGlow(252, torsoY + 18, 14, 22, tricepContraction);
        drawTargetGlow(308, torsoY + 18, 14, 22, tricepContraction);

        // Arms holding bars
        const elbowX = 310 + p * 15;
        const elbowY = torsoY + 10 + p * 25;
        drawCapsule(295, torsoY, elbowX, elbowY, 15, 13);
        drawCapsule(elbowX, elbowY, 320, 164, 13, 11);

    } else if (pattern === 'overhead_press') {
        // -------------------------------------------------------------
        // STANDING OVERHEAD PRESS (Strict Vertical Bar Path)
        // -------------------------------------------------------------
        drawFloor(275);

        // Standing Body
        drawCapsule(270, 275, 270, 145, 20, 16);
        drawCapsule(270, 145, 270, 75, 24, 20);
        drawHead(270, 48, 16, 0);

        const deltoidContraction = 0.4 + (1 - p) * 0.6;

        // Shoulder Glows
        drawTargetGlow(245, 78, 16, 16, deltoidContraction);
        drawTargetGlow(295, 78, 16, 16, deltoidContraction);

        // Barbell presses vertically from chin (y=75) overhead to (y=20)
        const barY = 20 + p * 55;
        const barX = 270;

        const elbowY = barY + 35;
        drawCapsule(250, 75, 240, elbowY, 14, 12);
        drawCapsule(240, elbowY, barX - 25, barY, 12, 10);

        drawCapsule(290, 75, 300, elbowY, 14, 12);
        drawCapsule(300, elbowY, barX + 25, barY, 12, 10);

        // Barbell (Level Horizontal)
        drawBarbell(barX, barY, 190);

    } else if (pattern === 'lateral_raise') {
        // -------------------------------------------------------------
        // LATERAL DELTOID RAISE
        // -------------------------------------------------------------
        drawFloor(275);

        drawCapsule(270, 275, 270, 145, 20, 16);
        drawCapsule(270, 145, 270, 75, 24, 20);
        drawHead(270, 48, 16, 0);

        const deltContraction = 0.3 + p * 0.7;
        drawTargetGlow(245, 78, 16, 16, deltContraction);
        drawTargetGlow(295, 78, 16, 16, deltContraction);

        // Arms raise out to sides
        const armAngle = (1 - p) * 1.35;
        const leftHandX = 250 - Math.sin(armAngle) * 75;
        const leftHandY = 75 + Math.cos(armAngle) * 75;
        const rightHandX = 290 + Math.sin(armAngle) * 75;
        const rightHandY = 75 + Math.cos(armAngle) * 75;

        drawCapsule(250, 75, leftHandX, leftHandY, 14, 10);
        drawCapsule(290, 75, rightHandX, rightHandY, 14, 10);

        drawDumbbell(leftHandX, leftHandY, -0.2);
        drawDumbbell(rightHandX, rightHandY, 0.2);

    } else if (pattern === 'chest_fly') {
        // -------------------------------------------------------------
        // CHEST FLY
        // -------------------------------------------------------------
        drawFloor(275);

        // Bench
        ctx.fillStyle = '#1e1e2d';
        ctx.fillRect(160, 205, 240, 16);

        drawCapsule(230, 195, 340, 195, 24, 20);
        drawHead(195, 190, 16, -Math.PI / 2);

        const chestContraction = 0.4 + (1 - p) * 0.6;
        drawTargetGlow(265, 188, 26, 16, chestContraction);

        // Dumbbells open and close in arc
        const flyAngle = p * 1.1;
        const hand1X = 265 - Math.sin(flyAngle) * 65;
        const hand1Y = 165 - Math.cos(flyAngle) * 35;
        const hand2X = 265 + Math.sin(flyAngle) * 65;
        const hand2Y = 165 - Math.cos(flyAngle) * 35;

        drawCapsule(250, 195, hand1X, hand1Y, 14, 10);
        drawCapsule(280, 195, hand2X, hand2Y, 14, 10);

        drawDumbbell(hand1X, hand1Y, -flyAngle);
        drawDumbbell(hand2X, hand2Y, flyAngle);

    } else if (pattern === 'core') {
        // -------------------------------------------------------------
        // CORE PLANK & ROLLOUT
        // -------------------------------------------------------------
        const floorY = 275;
        drawFloor(floorY);

        const rolloutDist = p * 60;
        const hipX = 200 + rolloutDist * 0.5;
        const hipY = 225 - p * 10;
        const shoulderX = hipX + 80 + rolloutDist * 0.5;
        const shoulderY = hipY - 15;
        const wheelX = shoulderX + 45;

        // Kneeling on mat
        ctx.fillStyle = '#334155';
        ctx.fillRect(140, floorY - 6, 40, 8);

        drawCapsule(150, floorY - 6, hipX, hipY, 18, 14);
        drawCapsule(hipX, hipY, shoulderX, shoulderY, 22, 18);
        drawHead(shoulderX + 15, shoulderY - 10, 15, 0.2);

        // Core Abdominal Glow
        const coreContraction = 0.5 + (1 - p) * 0.5;
        drawTargetGlow((hipX + shoulderX) / 2, (hipY + shoulderY) / 2 + 5, 26, 14, coreContraction);

        drawCapsule(shoulderX, shoulderY, wheelX, floorY - 16, 13, 10);

        // Wheel
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(wheelX, floorY - 16, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

    } else if (pattern === 'sprint') {
        // -------------------------------------------------------------
        // HIGH VELOCITY ATHLETIC RUNNER
        // -------------------------------------------------------------
        drawFloor(275);

        const cycle = p * Math.PI * 2;
        const hipX = 270;
        const hipY = 175 + Math.sin(cycle * 2) * 6; // Bouncing stride

        // Forward inclined running posture
        drawCapsule(hipX, hipY, hipX + 15, hipY - 80, 24, 20);
        drawHead(hipX + 25, hipY - 105, 16, 0.3);

        // Legs alternating
        const leg1KneeX = hipX + Math.sin(cycle) * 45;
        const leg1KneeY = hipY + 45 + Math.cos(cycle) * 25;
        const leg1FootX = leg1KneeX + Math.sin(cycle + 0.4) * 40;
        const leg1FootY = Math.min(275, leg1KneeY + 35);

        const leg2KneeX = hipX - Math.sin(cycle) * 45;
        const leg2KneeY = hipY + 45 - Math.cos(cycle) * 25;
        const leg2FootX = leg2KneeX - Math.sin(cycle + 0.4) * 40;
        const leg2FootY = Math.min(275, leg2KneeY + 35);

        drawCapsule(hipX, hipY, leg1KneeX, leg1KneeY, 18, 14);
        drawCapsule(leg1KneeX, leg1KneeY, leg1FootX, leg1FootY, 14, 10);

        drawCapsule(hipX, hipY, leg2KneeX, leg2KneeY, 18, 14);
        drawCapsule(leg2KneeX, leg2KneeY, leg2FootX, leg2FootY, 14, 10);

        // Quads & Glutes Glow
        drawTargetGlow(hipX, hipY, 20, 24, 0.7);

        // Arms driving cheek-to-pocket
        const arm1HandX = hipX + 15 + Math.cos(cycle) * 35;
        const arm1HandY = hipY - 45 + Math.sin(cycle) * 30;
        drawCapsule(hipX + 15, hipY - 75, arm1HandX, arm1HandY, 13, 9);
    }

    ctx.restore();
}

/**
 * 2D Canvas Kinematics Canvas Engine
 */
const FacelessMannequinCanvas = ({ pattern = 'bench_press', speed = 1, isPlaying = true, onPhaseUpdate }) => {
    const canvasRef = useRef(null);
    const timeRef = useRef(0);
    const animationFrameId = useRef(null);
    const lastConcentricRef = useRef(null);
    const onPhaseUpdateRef = useRef(onPhaseUpdate);

    useEffect(() => {
        onPhaseUpdateRef.current = onPhaseUpdate;
    }, [onPhaseUpdate]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let lastTimestamp = performance.now();

        const render = (now) => {
            const delta = Math.min((now - lastTimestamp) / 1000, 0.1);
            lastTimestamp = now;

            if (isPlaying) {
                timeRef.current += delta * speed * 2.2;
            }

            const rawPhase = (Math.sin(timeRef.current) + 1) / 2;
            const phaseDerivative = Math.cos(timeRef.current);
            const isConcentric = phaseDerivative < 0;

            if (lastConcentricRef.current !== isConcentric) {
                lastConcentricRef.current = isConcentric;
                if (onPhaseUpdateRef.current) {
                    onPhaseUpdateRef.current({
                        isConcentric,
                        breathState: isConcentric ? 'Breathe Out' : 'Breathe In'
                    });
                }
            }

            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            // Dark futuristic gym background
            ctx.fillStyle = '#0b0c10';
            ctx.fillRect(0, 0, width, height);

            // Ambient background radial glow
            const bgGlow = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width * 0.55);
            bgGlow.addColorStop(0, 'rgba(229, 9, 20, 0.12)');
            bgGlow.addColorStop(0.5, 'rgba(30, 20, 35, 0.2)');
            bgGlow.addColorStop(1, 'rgba(11, 12, 16, 0)');
            ctx.fillStyle = bgGlow;
            ctx.fillRect(0, 0, width, height);

            // Futuristic floor grid lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            for (let x = 0; x < width; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw Gym Equipment and Mannequin according to pattern
            drawExerciseKinematics(ctx, width, height, pattern, rawPhase, isConcentric);

            animationFrameId.current = requestAnimationFrame(render);
        };

        animationFrameId.current = requestAnimationFrame(render);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [pattern, speed, isPlaying]);

    return (
        <canvas
            ref={canvasRef}
            width={560}
            height={320}
            className="w-full h-auto rounded-2xl border border-[#2a2a3c] shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-[#0b0c10]"
        />
    );
};

/**
 * Exercise Demo Modal (Leap Fitness Style 2D Animated Mannequin + Open-Source Biomechanical Guides)
 */
const ExerciseDemoModal = ({
    isOpen = false,
    onClose = () => {},
    exercise = null
}) => {
    const exerciseName = typeof exercise === 'string' ? exercise : exercise?.name || 'Exercise Movement';
    const pattern = detectExercisePattern(exerciseName);
    const metadata = EXERCISE_METADATA[pattern] || EXERCISE_METADATA.bench_press;

    const [speed, setSpeed] = useState(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const [repCount, setRepCount] = useState(1);
    const [activeTab, setActiveTab] = useState('cues'); // 'cues' | 'mistakes' | 'phases'
    const [phaseData, setPhaseData] = useState({
        isConcentric: false,
        breathState: 'Breathe In'
    });

    const lastCycleConcentric = useRef(false);

    // Lock body scroll and attach Escape key listener
    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Reset rep count on exercise change
    useEffect(() => {
        setRepCount(1);
        setIsPlaying(true);
    }, [exerciseName]);

    const handlePhaseUpdate = (info) => {
        setPhaseData(info);
        if (info.isConcentric && !lastCycleConcentric.current) {
            setRepCount(prev => (prev >= 99 ? 1 : prev + 1));
        }
        lastCycleConcentric.current = info.isConcentric;
    };

    if (!isOpen) return null;

    // Direct Portal to document.body: Guarantee viewport centering without ancestor CSS transform distortion!
    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-4xl max-h-[88vh] bg-[#0f0f17] border border-[#262638] rounded-2xl sm:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col text-white overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 border-b border-[#20202e] bg-[#14141e]/90 shrink-0 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E50914] to-[#990000] text-white flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.4)]">
                            <i className="bi bi-person-walking text-base"></i>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-600/20 text-[#FF1E28] border border-red-500/30">
                                    LEAP FITNESS 2D DEMO
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#1e1e2d] text-zinc-300 border border-[#2a2a3e]">
                                    {metadata.pattern}
                                </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-black text-white tracking-tight mt-0.5">
                                {exerciseName}
                            </h3>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-[#1b1b26] hover:bg-[#262638] text-zinc-400 hover:text-white border border-[#2c2c3e] flex items-center justify-center transition-all cursor-pointer"
                        title="Close Demo (ESC)"
                    >
                        <i className="bi bi-x-lg text-xs"></i>
                    </button>
                </div>

                {/* Main Content Body */}
                <div className="p-4 sm:p-5 overflow-y-auto flex-1 scrollbar-none">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        {/* 2D Faceless Mannequin Interactive Canvas (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col items-center relative">
                            {/* Target Muscle Glow Badge Overlay */}
                            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-2 px-2.5 py-1 rounded-xl bg-black/65 backdrop-blur-md border border-[#303044] text-[10px] font-bold">
                                <span className="w-2 h-2 rounded-full bg-[#FF1E28] animate-ping"></span>
                                <span className="text-zinc-300">Active Focus:</span>
                                <span className="text-[#FF1E28] font-extrabold">{metadata.primaryMuscles[0]}</span>
                            </div>

                            {/* Canvas */}
                            <FacelessMannequinCanvas
                                pattern={pattern}
                                speed={speed}
                                isPlaying={isPlaying}
                                onPhaseUpdate={handlePhaseUpdate}
                            />

                            {/* Playback Controls & Speed Selector Bar */}
                            <div className="w-full mt-2.5 p-2 rounded-xl bg-[#151520] border border-[#242436] flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="px-3 py-1 rounded-lg bg-[#1e1e2c] hover:bg-[#E50914] text-white text-[11px] font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                                    >
                                        <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill text-[#FF1E28]'}`}></i>
                                        <span>{isPlaying ? 'Pause' : 'Play'}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setRepCount(1)}
                                        className="p-1 rounded-lg bg-[#1e1e2c] hover:bg-[#262638] text-zinc-400 hover:text-white text-xs transition-all cursor-pointer"
                                        title="Reset rep count"
                                    >
                                        <i className="bi bi-arrow-clockwise"></i>
                                    </button>

                                    <span className="text-[11px] font-bold text-zinc-400 pl-1">
                                        Rep <strong className="text-white font-black">{repCount}</strong>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Cadence Indicator */}
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider border ${
                                        phaseData.isConcentric 
                                            ? 'bg-red-950/40 border-red-500/40 text-[#FF1E28]' 
                                            : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400'
                                    }`}>
                                        {phaseData.isConcentric ? 'CONCENTRIC (Push)' : 'ECCENTRIC (Lower)'}
                                    </span>

                                    {/* Tempo Speeds */}
                                    <div className="flex items-center gap-1 bg-[#0f0f16] p-0.5 rounded-lg border border-[#202030]">
                                        {[0.5, 1, 1.5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setSpeed(s)}
                                                className={`px-2 py-0.5 rounded text-[9px] font-black transition-all cursor-pointer ${
                                                    speed === s
                                                        ? 'bg-[#E50914] text-white'
                                                        : 'text-zinc-400 hover:text-white'
                                                }`}
                                            >
                                                {s}x
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Biomechanics & Technique HUD (5 cols) */}
                        <div className="lg:col-span-5 space-y-3">
                            {/* Breathing Guide Card with Expansion Visualizer */}
                            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#181824] to-[#12121b] border border-[#272738] space-y-2.5 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <i className="bi bi-wind text-cyan-400"></i>
                                        Breathing Rhythm Guide
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#20202e] text-zinc-300">
                                        Tempo: {metadata.tempo.split(' ')[0]}
                                    </span>
                                </div>

                                {/* Breathing Animation Bubble */}
                                <div className="relative flex items-center gap-3 p-2.5 rounded-xl bg-[#0c0c14] border border-[#202030] overflow-hidden">
                                    <div
                                        className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center shrink-0 transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(34,211,238,0.25)] ${
                                            phaseData.isConcentric
                                                ? 'scale-90 bg-red-600/15 border-[#FF1E28]'
                                                : 'scale-105 bg-cyan-500/15 border-cyan-400'
                                        }`}
                                    >
                                        <i className={`bi ${phaseData.isConcentric ? 'bi-arrow-up-circle-fill text-[#FF1E28]' : 'bi-arrow-down-circle-fill text-cyan-400'} text-base`}></i>
                                        <span className="text-[9px] font-black text-white mt-0.5 tracking-tight whitespace-nowrap">
                                            {phaseData.breathState}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-300 font-medium leading-relaxed">
                                        {metadata.breathing}
                                    </p>
                                </div>
                            </div>

                            {/* Targeted Muscles */}
                            <div className="p-3 rounded-2xl bg-[#14141d] border border-[#222232] space-y-2">
                                <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <i className="bi bi-bezier2 text-[#FF1E28]"></i>
                                    Target Muscle Engagement
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {metadata.primaryMuscles.map((muscle, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-red-600/15 text-[#FF1E28] border border-red-500/30 flex items-center gap-1"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E28]"></span>
                                            {muscle}
                                        </span>
                                    ))}
                                    {metadata.secondaryMuscles.map((muscle, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#1a1a24] text-zinc-300 border border-[#2a2a3a]"
                                        >
                                            {muscle}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Switcher for Form Cues, Mistakes, and 3-Phase Guide */}
                            <div className="rounded-2xl bg-[#14141d] border border-[#242436] p-3 space-y-2.5">
                                <div className="flex items-center gap-1 bg-[#0b0c12] p-1 rounded-xl border border-[#1e1e2c]">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('cues')}
                                        className={`flex-1 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                            activeTab === 'cues'
                                                ? 'bg-[#E50914] text-white shadow-sm'
                                                : 'text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        <i className="bi bi-shield-check"></i> Form Cues
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('mistakes')}
                                        className={`flex-1 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                            activeTab === 'mistakes'
                                                ? 'bg-amber-600 text-white shadow-sm'
                                                : 'text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        <i className="bi bi-exclamation-triangle"></i> Mistakes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('phases')}
                                        className={`flex-1 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                            activeTab === 'phases'
                                                ? 'bg-cyan-600 text-white shadow-sm'
                                                : 'text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        <i className="bi bi-diagram-3"></i> 3-Phase Guide
                                    </button>
                                </div>

                                {/* Active Tab Content */}
                                {activeTab === 'cues' && (
                                    <ul className="space-y-1.5">
                                        {metadata.cues.map((cue, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-[11px] text-zinc-300">
                                                <span className="w-4 h-4 rounded-full bg-red-600/20 text-[#FF1E28] border border-red-500/30 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                                                    {idx + 1}
                                                </span>
                                                <span className="leading-snug">{cue}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {activeTab === 'mistakes' && (
                                    <ul className="space-y-1.5">
                                        {metadata.mistakes.map((mistake, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-[11px] text-zinc-300">
                                                <span className="w-4 h-4 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                                                    ✕
                                                </span>
                                                <span className="leading-snug">{mistake}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {activeTab === 'phases' && (
                                    <div className="space-y-2">
                                        {(metadata.phases || []).map((phase, idx) => (
                                            <div key={idx} className="p-2 rounded-xl bg-[#0d0d14] border border-[#20202e] space-y-0.5">
                                                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-tight flex items-center gap-1">
                                                    <i className="bi bi-check-circle text-[9px]"></i>
                                                    {phase.title}
                                                </span>
                                                <p className="text-[10px] text-zinc-300 leading-tight">
                                                    {phase.action}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bar */}
                <div className="px-4 py-2.5 sm:px-6 sm:py-3 border-t border-[#20202e] bg-[#14141e]/90 flex items-center justify-between shrink-0">
                    <span className="text-[11px] text-zinc-400 font-medium">
                        Omnifit Biomechanics Engine • Leap Fitness 2D Vector Model
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B80710] hover:from-[#FF1E28] hover:to-[#E50914] text-white text-xs font-black transition-all cursor-pointer shadow-[0_0_12px_rgba(229,9,20,0.3)]"
                    >
                        Close Demo
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ExerciseDemoModal;
