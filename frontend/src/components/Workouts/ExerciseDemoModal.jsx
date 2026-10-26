import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

// Exercise kinematic patterns detector
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

// Biomechanical metadata database with Open-Source 3-Phase standards (inspired by workout-guide & exercises-dataset)
const EXERCISE_METADATA = {
    incline_bench_press: {
        pattern: 'Incline Push (Clavicular Bias)',
        primaryMuscles: ['Pectoralis Major (Upper Clavicular Head)', 'Anterior Deltoids'],
        secondaryMuscles: ['Triceps Brachii', 'Upper Traps'],
        breathing: 'Inhale on controlled descent to upper chest; Exhale as you drive vertically.',
        tempo: '3 - 0 - 1 (3s negative, 1s drive)',
        cues: [
            'Set bench between 30° and 45° to isolate the upper pectoral shelf.',
            'Lower dumbbells along a natural arc until they hover just above upper chest.',
            'Drive vertically upward toward ceiling while keeping scapulae retracted.'
        ],
        mistakes: [
            'Bench angle set too steep (>45°), turning the movement into a shoulder press.',
            'Flaring elbows out horizontally at 90°, risking rotator cuff impingement.',
            'Allowing dumbbells to violently clank together at the concentric peak.'
        ],
        phases: [
            {
                title: 'Phase 1: Setup & Starting Stance',
                action: 'Sit deep on the incline seat, plant heels into the floor, retract shoulder blades, and hold dumbbells above upper chest with palms forward.'
            },
            {
                title: 'Phase 2: Controlled Eccentric Negative',
                action: 'Inhale deeply while lowering the dumbbells in a 3-second controlled tempo, tucking elbows at 45° until a full stretch across the clavicular pectorals is felt.'
            },
            {
                title: 'Phase 3: Concentric Drive & Peak Squeeze',
                action: 'Exhale forcefully while driving dumbbells vertically upward to lockout, contracting upper chest firmly at peak for 1 second.'
            }
        ]
    },
    bench_press: {
        pattern: 'Horizontal Push',
        primaryMuscles: ['Pectoralis Major (Sternal Head)', 'Anterior Deltoids'],
        secondaryMuscles: ['Triceps Brachii', 'Serratus Anterior'],
        breathing: 'Inhale on 2s descent to lower sternum; Exhale on explosive drive up.',
        tempo: '2 - 1 - 1 (2s down, 1s pause, 1s push)',
        cues: [
            'Retract and pin scapulae firmly into the bench surface.',
            'Keep elbows tucked at a 45 to 60-degree angle from your torso.',
            'Maintain a firm midfoot plant into the floor for kinetic leg drive.'
        ],
        mistakes: [
            'Bouncing the weight violently off the ribcage.',
            'Flaring elbows out to 90 degrees, shifting shear stress to rotator cuffs.',
            'Allowing wrists to bend backward under heavy load.'
        ],
        phases: [
            {
                title: 'Phase 1: Setup & Scapular Lock',
                action: 'Lie flat with eyes under the bar, arch thoracic spine slightly, squeeze shoulder blades together, and grip bar with knuckles turned up.'
            },
            {
                title: 'Phase 2: Controlled Descent',
                action: 'Inhale and lower the bar smoothly to the sternum, keeping forearms vertical and elbows tucked.'
            },
            {
                title: 'Phase 3: Leg Drive & Press',
                action: 'Drive through heels, exhale, and press vertically to arms extended, locking out with chest flexed.'
            }
        ]
    },
    pushup: {
        pattern: 'Bodyweight Horizontal Press',
        primaryMuscles: ['Pectoralis Major', 'Core / Transverse Abdominis'],
        secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoids'],
        breathing: 'Inhale as chest nears the floor; Exhale strongly pressing back up.',
        tempo: '2 - 0 - 1 (Controlled tempo)',
        cues: [
            'Maintain a rigid straight hollow-body line from heels to crown.',
            'Tuck elbows at 45 degrees rather than flaring sideways.',
            'Squeeze glutes and abs to lock pelvic stability throughout.'
        ],
        mistakes: [
            'Sagging lumbar spine or hips dropping before the chest.',
            'Crane-necking forward to touch chin before chest.',
            'Partial range of motion without full elbow lockout.'
        ],
        phases: [
            {
                title: 'Phase 1: High Plank Setup',
                action: 'Hands placed shoulder-width apart, fingers splayed, core braced, glutes squeezed tight in a straight plank.'
            },
            {
                title: 'Phase 2: Negative Descent',
                action: 'Inhale and lower entire body as one unit until chest hovers 1 inch off the floor.'
            },
            {
                title: 'Phase 3: Pushup Lockout',
                action: 'Exhale and press floor away, extending elbows fully and pushing through palms.'
            }
        ]
    },
    chest_fly: {
        pattern: 'Pectoral Adduction Isolation',
        primaryMuscles: ['Pectoralis Major (Sternal & Clavicular)'],
        secondaryMuscles: ['Anterior Deltoids', 'Biceps Short Head'],
        breathing: 'Inhale wide into the stretch; Exhale hugging arms back together.',
        tempo: '3 - 1 - 1 (Slow stretch focus)',
        cues: [
            'Maintain a slight, fixed bend in elbows (~15 degrees) throughout.',
            'Open arms wide in a hugging arc until chest fibers stretch.',
            'Squeeze inner pectorals together at the top without banging weights.'
        ],
        mistakes: [
            'Bending elbows excessively, turning the fly into a standard bench press.',
            'Over-stretching below bench level, hyperextending shoulders.',
            'Losing core engagement and arching excessively.'
        ],
        phases: [
            {
                title: 'Phase 1: Starting Arc',
                action: 'Dumbbells held directly over chest with palms facing each other and elbows softly bent.'
            },
            {
                title: 'Phase 2: Wide Lateral Arc',
                action: 'Inhale and lower arms wide in a controlled hug arc until elbows reach chest depth.'
            },
            {
                title: 'Phase 3: Peak Squeeze',
                action: 'Exhale and squeeze chest to draw dumbbells back together in an arc, flexing at peak.'
            }
        ]
    },
    squat: {
        pattern: 'Bilateral Knee-Dominant Compound',
        primaryMuscles: ['Quadriceps Femoris', 'Gluteus Maximus'],
        secondaryMuscles: ['Hamstrings', 'Adductors', 'Erector Spinae'],
        breathing: 'Deep diaphragmatic inhale into core at top; Exhale driving out of hole.',
        tempo: '3 - 1 - 1 (Controlled descent, explosive ascent)',
        cues: [
            'Initiate by breaking hips back and knees out in line with toes.',
            'Hit at least parallel depth (hip crease below top of kneecap).',
            'Keep chest proud and midfoot planted throughout the ascent.'
        ],
        mistakes: [
            'Knee valgus (knees caving inward under concentric load).',
            'Heels lifting off floor due to poor ankle dorsiflexion.',
            'Excessive forward torso collapse (good-morning squat).'
        ],
        phases: [
            {
                title: 'Phase 1: Athletic Stance',
                action: 'Feet shoulder-width apart, toes turned slightly out, barbell resting firmly across upper traps.'
            },
            {
                title: 'Phase 2: Decent into Hole',
                action: 'Inhale, brace 360° into abdomen, hinge hips and knees simultaneously to break parallel.'
            },
            {
                title: 'Phase 3: Triple Extension',
                action: 'Drive feet into floor, extend knees and hips together, exhaling forcefully to stand tall.'
            }
        ]
    },
    deadlift: {
        pattern: 'Hip-Hinge Posterior Chain Compound',
        primaryMuscles: ['Gluteus Maximus', 'Hamstrings', 'Erector Spinae'],
        secondaryMuscles: ['Latissimus Dorsi', 'Trapezius', 'Forearm Flexors'],
        breathing: 'Belly breath and brace core at floor; Exhale through pursed lips at lockout.',
        tempo: '1 - 0 - 2 (Explosive pull, controlled return)',
        cues: [
            'Keep barbell in direct vertical contact with shins and thighs.',
            'Engage lats by "protecting armpits" to lock spine neutral.',
            'Drive floor away with heels rather than pulling with arms.'
        ],
        mistakes: [
            'Rounding the lumbar spine (cat back) when breaking off floor.',
            'Hyperextending lower back at lockout instead of squeezing glutes.',
            'Allowing bar to drift forward away from the body line.'
        ],
        phases: [
            {
                title: 'Phase 1: Shin Contact Setup',
                action: 'Bar over midfoot, shins touching bar, hips hinged back, chest open, lats tightly locked.'
            },
            {
                title: 'Phase 2: Leg Press Off Floor',
                action: 'Inhale, push floor away with midfoot, keeping bar glued to legs until crossing knees.'
            },
            {
                title: 'Phase 3: Glute Lockout',
                action: 'Drive hips forward into bar, stand tall with shoulders packed, and exhale.'
            }
        ]
    },
    lat_pulldown: {
        pattern: 'Vertical Pulling Isolation',
        primaryMuscles: ['Latissimus Dorsi', 'Teres Major'],
        secondaryMuscles: ['Biceps Brachii', 'Brachialis', 'Rhomboids'],
        breathing: 'Inhale as bar ascends; Exhale driving elbows down to ribcage.',
        tempo: '2 - 1 - 2 (Pronounced contraction pause)',
        cues: [
            'Lead the pull with elbows driving down and back toward back pockets.',
            'Pull bar to upper sternum while maintaining slight backward torso lean.',
            'Allow full scapular elevation and lat stretch at top.'
        ],
        mistakes: [
            'Swinging torso excessively to use momentum instead of back strength.',
            'Pulling bar behind the neck, causing cervical and rotator strain.',
            'Internally rotating shoulders and pulling with forearms.'
        ],
        phases: [
            {
                title: 'Phase 1: Grip & Thigh Anchor',
                action: 'Grip bar slightly wider than shoulders, thighs firmly anchored under pads, arms fully stretched.'
            },
            {
                title: 'Phase 2: Elbow Drive',
                action: 'Exhale, pull shoulder blades down, and drive elbows down toward ribs until bar reaches chin.'
            },
            {
                title: 'Phase 3: Resisted Release',
                action: 'Inhale and control bar upward over 2 seconds to allow full lat elongation.'
            }
        ]
    },
    bicep_curl: {
        pattern: 'Elbow Flexion Isolation',
        primaryMuscles: ['Biceps Brachii (Short & Long Heads)'],
        secondaryMuscles: ['Brachialis', 'Brachioradialis'],
        breathing: 'Exhale curling weight upward; Inhale on slow negative lowering.',
        tempo: '2 - 1 - 3 (3-second negative eccentric)',
        cues: [
            'Keep elbows pinned like hinges directly at your sides.',
            'Supinate wrist (rotate pinky outward) at peak contraction.',
            'Avoid swinging hips or leaning back to cheat the load.'
        ],
        mistakes: [
            'Drifting elbows forward, recruiting front deltoids instead of biceps.',
            'Dropping the weight quickly without controlling the eccentric phase.',
            'Excessive body English or swinging torso.'
        ],
        phases: [
            {
                title: 'Phase 1: Starting Hang',
                action: 'Arms hanging naturally at sides, dumbbells facing in, core tight and shoulders relaxed back.'
            },
            {
                title: 'Phase 2: Supination & Curl',
                action: 'Exhale and curl forearms up, rotating wrists so palms face upward near the top.'
            },
            {
                title: 'Phase 3: Peak Contraction & Negative',
                action: 'Squeeze bicep firmly for 1s, then take 3 seconds to lower smoothly back to start.'
            }
        ]
    },
    tricep_dip: {
        pattern: 'Vertical Compound Press',
        primaryMuscles: ['Triceps Brachii (Lateral & Medial Heads)'],
        secondaryMuscles: ['Anterior Deltoids', 'Lower Pectorals'],
        breathing: 'Inhale lowering body down; Exhale pressing back up to lockout.',
        tempo: '2 - 0 - 1 (Smooth cadence)',
        cues: [
            'Keep torso upright for pure triceps bias; slight forward lean shifts to chest.',
            'Lower until elbows reach roughly a 90-degree angle.',
            'Press through palms and achieve full terminal elbow extension.'
        ],
        mistakes: [
            'Descending too deep (>90°), putting dangerous shear on shoulder capsules.',
            'Flaring elbows out sideways instead of tracking backwards.',
            'Shrugging shoulders into ears instead of depressing scapulae.'
        ],
        phases: [
            {
                title: 'Phase 1: Parallel Bar Support',
                action: 'Arms locked out on parallel bars, shoulders pressed down away from ears, legs crossed.'
            },
            {
                title: 'Phase 2: Controlled Dip',
                action: 'Inhale and bend elbows backwards until forearms form a 90-degree angle.'
            },
            {
                title: 'Phase 3: Triceps Drive',
                action: 'Exhale and press straight down through palms, locking out triceps at the top.'
            }
        ]
    },
    overhead_press: {
        pattern: 'Vertical Overhead Press',
        primaryMuscles: ['Anterior & Lateral Deltoids'],
        secondaryMuscles: ['Triceps Brachii', 'Upper Traps', 'Core'],
        breathing: 'Inhale and brace at collarbone; Exhale driving bar overhead to lockout.',
        tempo: '2 - 0 - 1 (Strong vertical drive)',
        cues: [
            'Squeeze glutes and brace core to prevent lumbar hyperextension.',
            'Move head slightly back as bar passes nose, then push head "through window".',
            'Lock out bar directly over the crown of head and midfoot.'
        ],
        mistakes: [
            'Arching lower back backward into an improvised standing incline press.',
            'Pressing bar forward in an arc instead of a straight vertical line.',
            'Bending knees to turn strict press into a push press.'
        ],
        phases: [
            {
                title: 'Phase 1: Front Rack Stance',
                action: 'Bar resting on clavicles, elbows slightly in front of bar, feet hip-width, glutes clamped tight.'
            },
            {
                title: 'Phase 2: Vertical Trajectory',
                action: 'Exhale and push bar vertically, tilting head back slightly to clear chin.'
            },
            {
                title: 'Phase 3: Overhead Window Lockout',
                action: 'Push head forward through the arms, locking bar directly above spine and midfoot.'
            }
        ]
    },
    lateral_raise: {
        pattern: 'Lateral Deltoid Abduction',
        primaryMuscles: ['Lateral Deltoids'],
        secondaryMuscles: ['Anterior Deltoids', 'Supraspinatus', 'Traps'],
        breathing: 'Exhale raising dumbbells out to sides; Inhale lowering with control.',
        tempo: '2 - 1 - 2 (Deliberate tempo)',
        cues: [
            'Lead with elbows, pouring weight like water from a pitcher at top.',
            'Raise arms only until parallel to floor (shoulder height).',
            'Maintain a slight forward torso tilt and soft elbow bend.'
        ],
        mistakes: [
            'Swinging torso or using momentum to toss dumbbells upward.',
            'Raising weights higher than shoulder level, activating upper traps instead.',
            'Straightening arms completely, stressing elbow tendons.'
        ],
        phases: [
            {
                title: 'Phase 1: Side Thigh Position',
                action: 'Dumbbells resting lightly at side of thighs with palms facing inwards, knees softly bent.'
            },
            {
                title: 'Phase 2: Lateral Sweep',
                action: 'Exhale and sweep arms outward and upward leading with elbows until parallel to floor.'
            },
            {
                title: 'Phase 3: Isometric Pause',
                action: 'Hold side deltoids contracted for 1 second, then lower slowly over 2 seconds.'
            }
        ]
    },
    core: {
        pattern: 'Anterior Core Anti-Extension',
        primaryMuscles: ['Rectus Abdominis', 'Transverse Abdominis'],
        secondaryMuscles: ['Internal & External Obliques', 'Lats'],
        breathing: 'Inhale extending out; Forceful abdominal exhale pulling back to center.',
        tempo: '3 - 1 - 2 (Maximum tension cadence)',
        cues: [
            'Maintain a posterior pelvic tilt (tuck tailbone under).',
            'Roll forward from hips while keeping core rock-solid like a steel bridge.',
            'Pull back using abdominal contraction rather than hip flexors.'
        ],
        mistakes: [
            'Sagging lower back into hyperextension during extension.',
            'Leading the return motion with hips instead of abs.',
            'Extending beyond core capacity and collapsing onto floor.'
        ],
        phases: [
            {
                title: 'Phase 1: Kneeling Plank Base',
                action: 'Knees on mat, holding wheel directly under shoulders, pelvis tucked under.'
            },
            {
                title: 'Phase 2: Outward Rollout',
                action: 'Inhale and roll wheel forward in a controlled line, keeping abs braced tight.'
            },
            {
                title: 'Phase 3: Core Contraction Return',
                action: 'Exhale forcefully and pull navel to spine, drawing wheel back under shoulders.'
            }
        ]
    },
    sprint: {
        pattern: 'Cardiovascular High-Velocity Gait',
        primaryMuscles: ['Gluteus Maximus', 'Quadriceps', 'Hamstrings', 'Calves'],
        secondaryMuscles: ['Cardiovascular System', 'Core Stabilizers'],
        breathing: 'Steady rhythmic 2-in, 2-out athletic breathing pattern.',
        tempo: 'High frequency interval turnover',
        cues: [
            'Drive knees high with toes dorsiflexed upward.',
            'Pump arms dynamically cheek-to-pocket with 90-degree elbow bend.',
            'Land lightly on midfoot directly beneath center of mass.'
        ],
        mistakes: [
            'Overstriding with heel-striking out in front of hips.',
            'Flailing arms across body midline instead of front-to-back.',
            'Tensing neck and shoulders unnecessarily.'
        ],
        phases: [
            {
                title: 'Phase 1: Knee Drive & Triple Flexion',
                action: 'Lead knee punches high to hip level, ankle flexed up, opposite arm driving forward.'
            },
            {
                title: 'Phase 2: Midfoot Ground Contact',
                action: 'Foot strikes ground directly below center of gravity, absorbing force elastically.'
            },
            {
                title: 'Phase 3: Explosive Push-Off',
                action: 'Drive through ball of foot with hip extension to propel body into next stride cycle.'
            }
        ]
    }
};

/**
 * 2D Canvas Kinematics Canvas Engine (Leap Fitness Style)
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
            drawExerciseKinematics(ctx, width, height, pattern, rawPhase, phaseDerivative);

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
            height={340}
            className="w-full h-auto rounded-2xl border border-[#2a2a3c] shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-[#0b0c10]"
        />
    );
};

/**
 * Procedural Kinematic Engine for Leap Fitness Style Avatar
 */
function drawExerciseKinematics(ctx, w, h, pattern, p, pDeriv) {
    ctx.save();

    const mannequinSkin = '#E2E8F0'; // Sleek athletic silver/slate silhouette
    const muscleGlowColor = '#FF1E28'; // Iron District Neon Crimson
    const barColor = '#94A3B8';
    const plateColor = '#DC2626';

    const drawHead = (x, y, r = 18, angle = 0) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.fillStyle = mannequinSkin;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 1.25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sleek cyber visor slit
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(r * 0.25, -r * 0.4, r * 0.55, 6, 2);
        ctx.fill();

        ctx.restore();
    };

    const drawLimb = (x1, y1, x2, y2, r1 = 14, r2 = 10, isGlow = false, glowIntensity = 0.5) => {
        ctx.save();

        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1) {
            ctx.restore();
            return;
        }

        const angle = Math.atan2(dy, dx);
        ctx.translate(x1, y1);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(0, -r1);
        ctx.lineTo(len, -r2);
        ctx.arc(len, 0, r2, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(0, r1);
        ctx.arc(0, 0, r1, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();

        ctx.fillStyle = mannequinSkin;
        ctx.fill();

        if (isGlow) {
            ctx.shadowColor = muscleGlowColor;
            ctx.shadowBlur = 18 * glowIntensity;
            ctx.fillStyle = `rgba(239, 68, 68, ${0.4 * glowIntensity})`;
            ctx.fill();
            ctx.strokeStyle = '#FF1E28';
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }

        ctx.restore();
    };

    const drawMuscleGlow = (cx, cy, rx, ry, intensity = 0.8, color = muscleGlowColor) => {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 24 * intensity;

        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, rx);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.4, color);
        grad.addColorStop(1, 'rgba(255, 30, 40, 0)');
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    };

    const drawBarbell = (x, y, length = 180, isVertical = false) => {
        ctx.save();
        ctx.strokeStyle = barColor;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';

        if (isVertical) {
            ctx.beginPath();
            ctx.moveTo(x, y - length / 2);
            ctx.lineTo(x, y + length / 2);
            ctx.stroke();

            ctx.fillStyle = plateColor;
            ctx.fillRect(x - 8, y - length / 2, 16, 12);
            ctx.fillRect(x - 8, y + length / 2 - 12, 16, 12);
        } else {
            ctx.beginPath();
            ctx.moveTo(x - length / 2, y);
            ctx.lineTo(x + length / 2, y);
            ctx.stroke();

            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x - 30, y);
            ctx.lineTo(x + 30, y);
            ctx.stroke();

            ctx.fillStyle = plateColor;
            ctx.fillRect(x - length / 2 + 10, y - 22, 12, 44);
            ctx.fillRect(x - length / 2 + 24, y - 18, 8, 36);
            ctx.fillRect(x + length / 2 - 22, y - 22, 12, 44);
            ctx.fillRect(x + length / 2 - 32, y - 18, 8, 36);
        }

        ctx.restore();
    };

    const drawDumbbell = (x, y, angle = 0) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(12, 0);
        ctx.stroke();

        ctx.fillStyle = '#DC2626';
        ctx.shadowColor = '#FF1E28';
        ctx.shadowBlur = 8;
        ctx.fillRect(-18, -12, 6, 24);
        ctx.fillRect(12, -12, 6, 24);

        ctx.restore();
    };

    // -----------------------------------------------------------------------------------
    // KINEMATICS RENDERERS BY PATTERN
    // -----------------------------------------------------------------------------------

    if (pattern === 'incline_bench_press') {
        // -------------------------------------------------------------
        // TRUE 35° INCLINE DUMBBELL BENCH PRESS
        // -------------------------------------------------------------
        ctx.translate(w / 2 - 10, h / 2 + 15);

        // Gym Floor Line
        ctx.strokeStyle = '#272738';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-180, 115);
        ctx.lineTo(180, 115);
        ctx.stroke();

        // Heavy Floor Base
        ctx.fillStyle = '#14141e';
        ctx.fillRect(-120, 108, 240, 8);

        // Vertical Support Post under seat
        ctx.fillStyle = '#1e1e2c';
        ctx.fillRect(25, 45, 14, 65);

        // Angular Structural Strut under backrest
        ctx.strokeStyle = '#1e1e2c';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-70, 110);
        ctx.lineTo(-30, 20);
        ctx.stroke();

        // Horizontal / Slightly Tilted Seat Pad
        ctx.fillStyle = '#1c1c28';
        ctx.strokeStyle = '#38384f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(10, 36, 55, 14, 4);
        ctx.fill();
        ctx.stroke();

        // 35° Incline Backrest Pad (Angled UPWARDS to the top-left)
        ctx.save();
        ctx.translate(12, 36);
        const inclineAngle = -0.62; // ~-35.5 degrees UPWARD
        ctx.rotate(inclineAngle);

        ctx.fillStyle = '#1c1c28';
        ctx.strokeStyle = '#E50914';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(0, -6, 150, 14, 4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Athlete Pelvis firmly in seat
        const hipX = 18;
        const hipY = 32;

        // Legs planted firmly on the gym floor
        drawLimb(hipX, hipY, 68, 42, 22, 18); // Thigh
        drawLimb(68, 42, 72, 108, 18, 14); // Shin down to floor
        ctx.fillStyle = '#64748B';
        ctx.fillRect(65, 104, 34, 10); // Athletic Shoe on floor

        // Torso supported along 35° incline backrest (Hips (18, 32) -> Shoulders (-68, -25))
        const shoulderX = -68;
        const shoulderY = -25;
        const chestContraction = 1 - p;

        drawLimb(hipX, hipY, shoulderX, shoulderY, 26, 22, true, chestContraction);

        // Head resting high on the elevated headrest
        drawHead(-92, -42, 18, -0.4);

        // CLAVICULAR UPPER CHEST Radial Glow
        const clavicleX = -42;
        const clavicleY = -12;
        drawMuscleGlow(clavicleX, clavicleY, 26, 18, 0.4 + chestContraction * 0.7, '#FF1E28');

        // Vertical Incline Dumbbell Pressing Motion
        // Bottom (p=1): Hands near upper chest. Top (p=0): Arms drive vertically up to ceiling!
        const handX = -42 + (1 - p) * 6;
        const handY = -12 - (1 - p) * 75;

        const elbowX = -58 + p * 12;
        const elbowY = -8 + p * 28;

        drawLimb(shoulderX, shoulderY, elbowX, elbowY, 17, 14, true, chestContraction);
        drawLimb(elbowX, elbowY, handX, handY, 14, 11, true, chestContraction * 0.8);

        // Red Hex Dumbbells
        drawDumbbell(handX, handY, -0.2);

    } else if (pattern === 'bench_press' || pattern === 'chest_fly') {
        const isFly = pattern === 'chest_fly';
        ctx.translate(w / 2 - 20, h / 2 + 30);

        // Flat Horizontal Bench Pad
        ctx.fillStyle = '#1e1e2d';
        ctx.strokeStyle = '#38384f';
        ctx.lineWidth = 2;
        ctx.roundRect(-160, 20, 260, 16, 6);
        ctx.fill();
        ctx.stroke();

        // Bench Stand
        ctx.fillStyle = '#14141e';
        ctx.fillRect(-80, 36, 16, 120);
        ctx.fillRect(60, 36, 16, 120);

        // Head
        drawHead(-120, -10, 18, -Math.PI / 2);

        // Torso / Sternal Arch
        ctx.save();
        const chestContraction = 1 - p;
        ctx.fillStyle = mannequinSkin;
        ctx.beginPath();
        ctx.moveTo(-100, 20);
        ctx.quadraticCurveTo(-50, -10, 0, 20);
        ctx.lineTo(0, 20);
        ctx.lineTo(-100, 20);
        ctx.fill();

        // Pectoral Muscle Glow
        drawMuscleGlow(-50, 4, 32, 18, 0.4 + chestContraction * 0.6, muscleGlowColor);
        ctx.restore();

        // Legs on floor
        drawLimb(0, 20, 45, 60, 18, 14);
        drawLimb(45, 60, 50, 110, 14, 10);
        ctx.fillStyle = '#64748B';
        ctx.fillRect(45, 105, 30, 10);

        // Arm Kinematics
        const barY = -75 + p * 60;
        const elbowX = -50 - (1 - p) * 10;
        const elbowY = -10 + p * 30;
        const handX = -50;
        const handY = barY;

        drawLimb(-70, 0, elbowX, elbowY, 16, 14, true, chestContraction);
        drawLimb(elbowX, elbowY, handX, handY, 14, 10, true, chestContraction * 0.8);

        if (isFly) {
            drawDumbbell(handX, handY, 0);
        } else {
            drawBarbell(handX, handY, 150);
        }

    } else if (pattern === 'pushup') {
        ctx.translate(w / 2 - 20, h / 2 + 50);

        ctx.fillStyle = '#1c1c28';
        ctx.fillRect(-170, 60, 340, 8);

        const chestContraction = 1 - p;
        const bodyY = -15 + p * 45;

        ctx.fillStyle = '#64748B';
        ctx.fillRect(-145, 50, 15, 12);

        drawLimb(-135, 50, -60, bodyY + 15, 18, 16);
        drawLimb(-60, bodyY + 15, 30, bodyY - 10, 24, 20, true, chestContraction);

        drawMuscleGlow(10, bodyY, 26, 16, 0.4 + chestContraction * 0.6, muscleGlowColor);
        drawHead(55, bodyY - 20, 18, 0.2);

        const elbowX = 35 + p * 20;
        const elbowY = bodyY + 15 + p * 15;
        drawLimb(25, bodyY - 5, elbowX, elbowY, 16, 14, true, chestContraction);
        drawLimb(elbowX, elbowY, 30, 58, 14, 12);

    } else if (pattern === 'squat') {
        ctx.translate(w / 2, h / 2 - 20);

        ctx.strokeStyle = '#272738';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-160, 160);
        ctx.lineTo(160, 160);
        ctx.stroke();

        const hipY = 20 + p * 75;
        const hipX = -p * 35;
        const kneeY = 90 + p * 30;
        const kneeX = 25 + p * 20;
        const footX = 20;
        const footY = 160;

        const torsoAngle = p * 0.45;
        const quadContraction = 1 - p * 0.4;

        drawLimb(hipX, hipY, kneeX, kneeY, 24, 18, true, quadContraction);
        drawLimb(kneeX, kneeY, footX, footY, 18, 12);
        ctx.fillStyle = '#475569';
        ctx.fillRect(footX - 15, footY - 8, 45, 12);

        ctx.save();
        ctx.translate(hipX, hipY);
        ctx.rotate(-torsoAngle);

        drawMuscleGlow(hipX + 5, hipY + 15, 24, 20, 0.4 + quadContraction * 0.6, muscleGlowColor);
        drawLimb(0, 0, -10, -90, 24, 20);
        drawHead(-15, -115, 18, -torsoAngle * 0.5);
        drawBarbell(-12, -90, 180);
        drawLimb(-15, -80, 10, -85, 12, 10);
        drawLimb(10, -85, -10, -90, 10, 8);
        ctx.restore();

    } else if (pattern === 'lat_pulldown') {
        ctx.translate(w / 2, h / 2 - 30);

        ctx.fillStyle = '#1e1e2d';
        ctx.fillRect(-30, 90, 60, 14);
        ctx.fillRect(-6, -140, 12, 240);
        ctx.fillRect(-60, -140, 120, 12);

        const latContraction = p;
        const barY = -120 + p * 85;

        drawLimb(0, 90, 0, 0, 24, 22, true, latContraction * 0.8);
        drawHead(0, -25, 18, 0);

        drawMuscleGlow(-25, 25, 20, 35, 0.3 + latContraction * 0.7, muscleGlowColor);
        drawMuscleGlow(25, 25, 20, 35, 0.3 + latContraction * 0.7, muscleGlowColor);

        drawLimb(-15, 90, -35, 140, 18, 14);
        drawLimb(15, 90, 35, 140, 18, 14);

        const leftElbowX = -55 - (1 - p) * 15;
        const leftElbowY = -10 + p * 40;
        drawLimb(-15, -5, leftElbowX, leftElbowY, 14, 12, true, latContraction);
        drawLimb(leftElbowX, leftElbowY, -80, barY, 12, 10);

        const rightElbowX = 55 + (1 - p) * 15;
        const rightElbowY = -10 + p * 40;
        drawLimb(15, -5, rightElbowX, rightElbowY, 14, 12, true, latContraction);
        drawLimb(rightElbowX, rightElbowY, 80, barY, 12, 10);

        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -130);
        ctx.lineTo(0, barY);
        ctx.stroke();

        drawBarbell(0, barY, 190);

    } else if (pattern === 'bicep_curl') {
        ctx.translate(w / 2, h / 2 - 10);

        ctx.strokeStyle = '#272738';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-140, 150);
        ctx.lineTo(140, 150);
        ctx.stroke();

        drawLimb(-15, 50, -20, 150, 20, 14);
        drawLimb(15, 50, 20, 150, 20, 14);

        drawLimb(0, 50, 0, -50, 24, 20);
        drawHead(0, -75, 18, 0);

        const bicepContraction = p;
        const elbowX = 25;
        const elbowY = -35;
        const armAngle = Math.PI / 2 - p * (Math.PI * 0.7);
        const handX = elbowX + Math.cos(armAngle) * 55;
        const handY = elbowY + Math.sin(armAngle) * 55;

        drawMuscleGlow(elbowX - 2, elbowY + 8, 16, 20, 0.3 + bicepContraction * 0.7, muscleGlowColor);
        drawLimb(-20, -45, -24, 20, 14, 10);
        drawLimb(15, -45, elbowX, elbowY, 16, 14);
        drawLimb(elbowX, elbowY, handX, handY, 14, 10, true, bicepContraction);

        drawDumbbell(handX, handY, armAngle);

    } else if (pattern === 'tricep_dip') {
        ctx.translate(w / 2, h / 2 - 10);

        ctx.fillStyle = '#1e1e2d';
        ctx.strokeStyle = '#38384f';
        ctx.lineWidth = 3;
        ctx.fillRect(-65, -10, 130, 8);
        ctx.fillRect(-50, -10, 12, 160);
        ctx.fillRect(40, -10, 12, 160);

        const tricepContraction = 1 - p;
        const torsoY = -25 + p * 50;

        drawHead(0, torsoY - 55, 18, 0);
        drawLimb(0, torsoY + 45, 0, torsoY - 30, 24, 20);
        drawLimb(-10, torsoY + 45, -20, torsoY + 110, 18, 14);
        drawLimb(-20, torsoY + 110, 10, torsoY + 130, 14, 10);

        drawMuscleGlow(-28, torsoY - 10, 14, 24, 0.3 + tricepContraction * 0.7, muscleGlowColor);
        drawMuscleGlow(28, torsoY - 10, 14, 24, 0.3 + tricepContraction * 0.7, muscleGlowColor);

        const elbowX = 35 + p * 15;
        const elbowY = torsoY - 20 + p * 30;
        drawLimb(15, torsoY - 30, elbowX, elbowY, 16, 14, true, tricepContraction);
        drawLimb(elbowX, elbowY, 40, -6, 14, 12);

    } else if (pattern === 'deadlift') {
        ctx.translate(w / 2, h / 2 - 15);

        ctx.strokeStyle = '#272738';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-160, 150);
        ctx.lineTo(160, 150);
        ctx.stroke();

        const hingeAngle = p * 1.1;
        const hipX = -p * 45;
        const hipY = 30 + p * 15;
        const barY = 30 + p * 105;
        const posteriorContraction = 1 - p * 0.3;

        drawLimb(hipX, hipY, 15, 95, 22, 16, true, posteriorContraction);
        drawLimb(15, 95, 15, 150, 18, 14);

        drawMuscleGlow(hipX - 5, hipY + 15, 22, 28, 0.3 + posteriorContraction * 0.7, muscleGlowColor);

        ctx.save();
        ctx.translate(hipX, hipY);
        ctx.rotate(-hingeAngle);

        drawLimb(0, 0, 0, -85, 24, 20, true, posteriorContraction * 0.8);
        drawHead(0, -110, 18, 0);
        ctx.restore();

        drawLimb(hipX + Math.sin(hingeAngle) * 70, hipY - Math.cos(hingeAngle) * 70, 20, barY, 14, 10);
        drawBarbell(20, barY, 170);

    } else if (pattern === 'overhead_press' || pattern === 'lateral_raise') {
        const isLateral = pattern === 'lateral_raise';
        ctx.translate(w / 2, h / 2 - 15);

        ctx.strokeStyle = '#272738';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-140, 150);
        ctx.lineTo(140, 150);
        ctx.stroke();

        drawLimb(-15, 50, -20, 150, 20, 14);
        drawLimb(15, 50, 20, 150, 20, 14);

        drawLimb(0, 50, 0, -50, 24, 20);
        drawHead(0, -75, 18, 0);

        const deltoidContraction = p;

        drawMuscleGlow(-26, -45, 16, 16, 0.4 + deltoidContraction * 0.6, muscleGlowColor);
        drawMuscleGlow(26, -45, 16, 16, 0.4 + deltoidContraction * 0.6, muscleGlowColor);

        if (isLateral) {
            const armAngle = (1 - p) * 1.35;
            const leftHandX = -20 - Math.sin(armAngle) * 75;
            const leftHandY = -45 + Math.cos(armAngle) * 75;
            const rightHandX = 20 + Math.sin(armAngle) * 75;
            const rightHandY = -45 + Math.cos(armAngle) * 75;

            drawLimb(-20, -45, leftHandX, leftHandY, 14, 10, true, deltoidContraction);
            drawLimb(20, -45, rightHandX, rightHandY, 14, 10, true, deltoidContraction);

            drawDumbbell(leftHandX, leftHandY, -0.2);
            drawDumbbell(rightHandX, rightHandY, 0.2);
        } else {
            const barY = -45 - p * 75;
            const elbowX = 35 - p * 15;
            const elbowY = -25 - p * 30;

            drawLimb(20, -45, elbowX, elbowY, 14, 12, true, deltoidContraction);
            drawLimb(elbowX, elbowY, 20, barY, 12, 10);

            drawLimb(-20, -45, -elbowX, elbowY, 14, 12, true, deltoidContraction);
            drawLimb(-elbowX, elbowY, -20, barY, 12, 10);

            drawBarbell(0, barY, 170);
        }

    } else if (pattern === 'core') {
        ctx.translate(w / 2 - 20, h / 2 + 30);

        ctx.fillStyle = '#1c1c28';
        ctx.fillRect(-170, 60, 320, 8);

        const coreContraction = 1 - p * 0.5;
        const wheelX = 30 + p * 80;

        ctx.fillStyle = '#334155';
        ctx.fillRect(-120, 50, 40, 10);

        drawLimb(-110, 50, -150, 50, 16, 12);
        drawLimb(-100, 50, -70 + p * 40, 35 - p * 15, 20, 16);

        const hipX = -70 + p * 40;
        const hipY = 35 - p * 15;
        const shoulderX = hipX + 70;
        const shoulderY = hipY - (1 - p) * 20;

        drawMuscleGlow(hipX + 35, hipY - 5, 28, 16, 0.4 + coreContraction * 0.6, muscleGlowColor);

        drawLimb(hipX, hipY, shoulderX, shoulderY, 22, 18, true, coreContraction);
        drawHead(shoulderX + 15, shoulderY - 12, 16, 0.3);

        drawLimb(shoulderX, shoulderY, wheelX, 48, 14, 10);

        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(wheelX, 48, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

    } else if (pattern === 'sprint') {
        ctx.translate(w / 2, h / 2 - 10);

        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-160, 140);
        ctx.lineTo(160, 140);
        ctx.stroke();

        drawHead(10, -80, 18, 0.2);
        drawLimb(0, 40, 10, -55, 24, 20, true, 0.8);
        drawMuscleGlow(5, -10, 22, 35, 0.7, muscleGlowColor);
    }

    ctx.restore();
}

/**
 * Exercise Demo Modal (Leap Fitness Animated Mannequin + Open-Source Biomechanical Phases)
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
                className="relative w-full max-w-4xl max-h-[88vh] bg-[#0f0f17] border border-[#272738] rounded-2xl sm:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col text-white overflow-hidden"
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
                                <span className="text-[#FF1E28] font-extrabold">{metadata.primaryMuscles[0].split('(')[0]}</span>
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
                                        {phaseData.isConcentric ? 'CONCENTRIC' : 'ECCENTRIC'}
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
                                        <span className="text-[9px] font-black text-white mt-0.5 tracking-tight">
                                            {phaseData.breathState}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-300 font-medium leading-snug">
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
