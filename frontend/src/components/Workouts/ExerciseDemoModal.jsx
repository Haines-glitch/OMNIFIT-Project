import React, { useState, useEffect, useRef } from 'react';

// Exercise kinematic patterns detector
export const detectExercisePattern = (name = '') => {
    const n = (name || '').toLowerCase();
    if (n.includes('incline') && (n.includes('press') || n.includes('bench'))) return 'incline_bench_press';
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

// Biomechanical metadata database
const EXERCISE_METADATA = {
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
            'Bouncing the barbell or dumbbells violently off the ribcage.',
            'Flaring elbows out to 90 degrees, shifting shear stress to rotator cuffs.',
            'Allowing wrists to bend backward under heavy load.'
        ]
    },
    incline_bench_press: {
        pattern: 'Incline Push (Clavicular Bias)',
        primaryMuscles: ['Pectoralis Major (Upper Clavicular Head)', 'Anterior Deltoids'],
        secondaryMuscles: ['Triceps Brachii', 'Upper Traps'],
        breathing: 'Inhale on controlled descent to upper chest; Exhale as you drive vertically.',
        tempo: '3 - 0 - 1 (3s negative, 1s drive)',
        cues: [
            'Set bench between 30 and 45 degrees to isolate the upper pectoral shelf.',
            'Lower weights until dumbbells align with upper sternum.',
            'Keep core engaged and avoid excessive lower back hyperextension.'
        ],
        mistakes: [
            'Bench angle too high (>45°), turning the movement into a shoulder press.',
            'Shortening range of motion without full clavicular stretch.',
            'Allowing dumbbells to clank together at the peak.'
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
            'Craning the neck downward toward the floor instead of neutral spine.',
            'Partial reps without chest reaching 1 inch from floor.'
        ]
    },
    chest_fly: {
        pattern: 'Transverse Adduction Isolation',
        primaryMuscles: ['Pectoralis Major (Sternal & Sternal Fibers)'],
        secondaryMuscles: ['Anterior Deltoids', 'Biceps Short Head'],
        breathing: 'Inhale through wide arc stretch; Exhale as hands converge together.',
        tempo: '3 - 1 - 1 (Deep stretch pause)',
        cues: [
            'Maintain a slight, fixed 15-degree bend in elbows throughout the arc.',
            'Think of hugging a massive tree barrel at peak contraction.',
            'Focus on squeezing inner chest fibers together at the finish line.'
        ],
        mistakes: [
            'Turning the fly into a press by excessively bending and extending elbows.',
            'Over-stretching beyond shoulder socket mobility at the rear.',
            'Using momentum or swinging torso to move the cables.'
        ]
    },
    squat: {
        pattern: 'Quad-Dominant Compound Squat',
        primaryMuscles: ['Quadriceps Femoris', 'Gluteus Maximus'],
        secondaryMuscles: ['Hamstrings', 'Spinal Erectors', 'Adductor Magnus'],
        breathing: 'Deep diaphragmatic inhale & brace at top; Exhale past the sticking point on ascent.',
        tempo: '3 - 1 - 1 (3s deep descent, 1s hole pause, explosive drive)',
        cues: [
            'Drive knees outward tracking inline with second and third toes.',
            'Break at hips and knees simultaneously, sinking below parallel crease.',
            'Drive through midfoot and heels while keeping chest proudly upright.'
        ],
        mistakes: [
            'Knees caving inward (valgus collapse) under heavy loading.',
            'Heels lifting off the ground or shifting weight completely to toes.',
            'Lumbar rounding (butt wink) at maximum depth.'
        ]
    },
    deadlift: {
        pattern: 'Posterior Chain Hip Hinge',
        primaryMuscles: ['Hamstrings (Biceps Femoris)', 'Gluteus Maximus', 'Erector Spinae'],
        secondaryMuscles: ['Latissimus Dorsi', 'Trapezius', 'Forearm Flexors'],
        breathing: 'Inhale & brace core at lockout; Exhale as hips snap through to finish.',
        tempo: '3 - 1 - 1 (Controlled stretch, explosive hinge)',
        cues: [
            'Push hips backwards toward rear wall with minimal knee flexion.',
            'Keep the barbell glued tightly against shins and thighs.',
            'Pack lats down and back to keep spine locked in neutral alignment.'
        ],
        mistakes: [
            'Rounding upper or lower back when initiating the hinge.',
            'Squatting the weight down instead of hinging the hips backward.',
            'Hyperextending spine backward at the top lockout.'
        ]
    },
    lat_pulldown: {
        pattern: 'Vertical Pull / Lat Hypertrophy',
        primaryMuscles: ['Latissimus Dorsi', 'Teres Major'],
        secondaryMuscles: ['Rhomboids', 'Biceps Brachii', 'Posterior Deltoids'],
        breathing: 'Exhale as you drive elbows down to ribs; Inhale on controlled ascent.',
        tempo: '1 - 1 - 3 (1s pull, 1s peak squeeze, 3s negative stretch)',
        cues: [
            'Initiate the pull by depressing scapulae down before bending elbows.',
            'Pull elbows down and slightly back into your side pant pockets.',
            'Let lats fully stretch at the top without shrugging shoulders to ears.'
        ],
        mistakes: [
            'Swinging torso backwards 45 degrees to use momentum.',
            'Pulling bar down behind neck, compromising cervical spine.',
            'Pulling primarily with forearms and wrists instead of back muscles.'
        ]
    },
    bicep_curl: {
        pattern: 'Elbow Flexion Isolation',
        primaryMuscles: ['Biceps Brachii (Long & Short Heads)'],
        secondaryMuscles: ['Brachialis', 'Brachioradialis'],
        breathing: 'Exhale during upward curl contraction; Inhale on 3-second lowering.',
        tempo: '1 - 1 - 3 (Peak contraction focus)',
        cues: [
            'Pin elbows firmly at ribs without drifting forward.',
            'Supinate wrist (turn pinky slightly outward) at top for peak contraction.',
            'Keep torso completely motionless—zero hip swing or lumbar arch.'
        ],
        mistakes: [
            'Swinging hips or using lower back momentum to initiate reps.',
            'Flaring elbows out to sides during curling stroke.',
            'Dropping the weight quickly on negative eccentric phase.'
        ]
    },
    tricep_dip: {
        pattern: 'Elbow Extension Overload',
        primaryMuscles: ['Triceps Brachii (Lateral, Long & Medial Heads)'],
        secondaryMuscles: ['Anterior Deltoids', 'Pectoralis Major (Lower)'],
        breathing: 'Inhale lowering to 90 degrees elbow bend; Exhale driving to lockout.',
        tempo: '2 - 0 - 1 (Controlled depth, solid lockout)',
        cues: [
            'Keep torso upright to isolate triceps; lean slightly forward for chest.',
            'Lower until upper arms are parallel with the floor (90 degrees).',
            'Squeeze triceps hard at top lockout without shrugging shoulders.'
        ],
        mistakes: [
            'Descending excessively deep, risking anterior shoulder impingement.',
            'Flaring elbows wide instead of keeping them tracking back.',
            'Failing to achieve complete elbow lockout at the top.'
        ]
    },
    overhead_press: {
        pattern: 'Vertical Overhead Press',
        primaryMuscles: ['Anterior & Lateral Deltoids'],
        secondaryMuscles: ['Triceps Brachii', 'Upper Traps', 'Core Stabilizers'],
        breathing: 'Inhale & brace core at clavicle; Exhale as bar presses past forehead.',
        tempo: '2 - 0 - 1 (Explosive vertical drive)',
        cues: [
            'Squeeze glutes, quads, and abs tight to establish a rigid foundation.',
            'Pull chin back slightly to allow bar to travel straight vertically.',
            'Lock out overhead with bar directly aligned over midfoot and ears.'
        ],
        mistakes: [
            'Excessively leaning back and hyperextending lumbar spine.',
            'Pressing bar forward in an arc around the face instead of vertical path.',
            'Bending knees to push-press when strict press is prescribed.'
        ]
    },
    lateral_raise: {
        pattern: 'Deltoid Abduction Isolation',
        primaryMuscles: ['Lateral Deltoids (Side Cap)'],
        secondaryMuscles: ['Anterior & Posterior Deltoids', 'Supraspinatus'],
        breathing: 'Exhale raising arms to shoulder level; Inhale controlling the 2s descent.',
        tempo: '1 - 1 - 2 (Pause at shoulder height)',
        cues: [
            'Lead the lift with elbows rather than wrists or hands.',
            'Keep slight 10-degree forward lean in hips to target side delt fibers.',
            'Stop when arms reach parallel with floor—avoid lifting above shoulders.'
        ],
        mistakes: [
            'Using heavy weights that cause jerking or shrugging upper traps.',
            'Leading with hands so thumbs point up, shifting work to front delts.',
            'Dropping weights fast without resisting the eccentric pull.'
        ]
    },
    core: {
        pattern: 'Anti-Extension & Core Bracing',
        primaryMuscles: ['Rectus Abdominis', 'Transverse Abdominis'],
        secondaryMuscles: ['Obliques', 'Serratus Anterior', 'Hip Flexors'],
        breathing: 'Inhale as torso elongates; Exhale sharply as you crunch/brace core.',
        tempo: '2 - 2 - 2 (Maximum tension & isometric pause)',
        cues: [
            'Maintain a posterior pelvic tilt—never let lower back sag or arch.',
            'Draw navel towards spine to recruit deep transverse abdominal wall.',
            'Initiate movement from the core rather than pulling with arms or neck.'
        ],
        mistakes: [
            'Sagging through lower back causing painful lumbar shear.',
            'Using momentum or swinging legs without pelvic control.',
            'Holding breath and creating dangerous intra-thoracic spikes.'
        ]
    },
    sprint: {
        pattern: 'Cardiovascular Anaerobic Output',
        primaryMuscles: ['Full Kinetic Chain', 'Cardiorespiratory System'],
        secondaryMuscles: ['Quadriceps', 'Calves', 'Gluteals', 'Hamstrings'],
        breathing: 'Rhythmic diaphragmatic breathing: 2 strides in, 2 strides out.',
        tempo: 'Maximum Dynamic Cadence',
        cues: [
            'Maintain a tall athletic posture with slight whole-body forward lean.',
            'Drive knees up and strike the ground directly beneath hips with midfoot.',
            'Pump arms smoothly from cheek to hip pocket with relaxed shoulders.'
        ],
        mistakes: [
            'Over-striding and heel-striking ahead of center of gravity.',
            'Hunching shoulders or clenching fists, wasting valuable energy.',
            'Holding breath during high-cadence bursts.'
        ]
    }
};

/**
 * Faceless Mannequin 2D Kinematic Canvas Renderer (Leap Fitness Style)
 */
const FacelessMannequinCanvas = ({ pattern = 'bench_press', speed = 1, isPlaying = true, onPhaseUpdate }) => {
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);
    const timeRef = useRef(0);
    const onPhaseUpdateRef = useRef(onPhaseUpdate);
    onPhaseUpdateRef.current = onPhaseUpdate;
    const lastConcentricRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width;
        let height = canvas.height;

        // Render loop
        let lastTimestamp = performance.now();

        const render = (now) => {
            const delta = (now - lastTimestamp) / 1000;
            lastTimestamp = now;

            if (isPlaying) {
                timeRef.current += delta * speed * 2.2;
            }

            // Normal phase oscillating between 0 and 1
            const rawPhase = (Math.sin(timeRef.current) + 1) / 2; // 0 to 1
            const phaseDerivative = Math.cos(timeRef.current); // >0 eccentric/down, <0 concentric/up
            const isConcentric = phaseDerivative < 0;
            
            // Notify parent only on direction transitions (concentric vs eccentric)
            if (lastConcentricRef.current !== isConcentric) {
                lastConcentricRef.current = isConcentric;
                if (onPhaseUpdateRef.current) {
                    onPhaseUpdateRef.current({
                        isConcentric,
                        breathState: isConcentric ? 'Breathe Out' : 'Breathe In'
                    });
                }
            }

            // Clear background with gym floor texture
            ctx.clearRect(0, 0, width, height);

            // Dark futuristic grid background
            ctx.fillStyle = '#0b0c10';
            ctx.fillRect(0, 0, width, height);

            // Ambient background radial glow
            const bgGlow = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width * 0.55);
            bgGlow.addColorStop(0, 'rgba(229, 9, 20, 0.12)');
            bgGlow.addColorStop(0.5, 'rgba(30, 20, 35, 0.2)');
            bgGlow.addColorStop(1, 'rgba(11, 12, 16, 0)');
            ctx.fillStyle = bgGlow;
            ctx.fillRect(0, 0, width, height);

            // Grid lines
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
            width={580}
            height={380}
            className="w-full h-auto rounded-2xl border border-[#2a2a3c] shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-[#0b0c10]"
        />
    );
};

/**
 * Procedural Kinematic Kinematics Engine for Leap Fitness Style Avatar
 */
function drawExerciseKinematics(ctx, w, h, pattern, p, pDeriv) {
    ctx.save();

    // Helper colors
    const mannequinSkin = '#E2E8F0'; // Sleek athletic silver/slate silhouette
    const mannequinShadow = '#94A3B8';
    const muscleGlowColor = '#FF1E28'; // Crimson active muscle glow
    const barColor = '#94A3B8';
    const plateColor = '#EF4444';

    // Helper: Draw Faceless Head (smooth oval with neck connection)
    const drawHead = (cx, cy, radius = 18, angle = 0) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Head shadow
        ctx.fillStyle = mannequinShadow;
        ctx.beginPath();
        ctx.ellipse(2, 2, radius * 0.9, radius * 1.15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Main faceless head shape
        const grad = ctx.createLinearGradient(-radius, -radius, radius, radius);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.4, mannequinSkin);
        grad.addColorStop(1, '#94A3B8');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.9, radius * 1.15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sleek athletic jawline contour (faceless)
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
    };

    // Helper: Draw athletic rounded bone segment (limb)
    const drawLimb = (x1, y1, x2, y2, width1 = 14, width2 = 10, isGlowing = false, glowIntensity = 0.5) => {
        ctx.save();
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const dist = Math.hypot(x2 - x1, y2 - y1);

        ctx.translate(x1, y1);
        ctx.rotate(angle);

        // Muscle contraction glow if targeted
        if (isGlowing) {
            ctx.shadowColor = muscleGlowColor;
            ctx.shadowBlur = 18 * glowIntensity;
        }

        ctx.beginPath();
        ctx.moveTo(0, -width1 / 2);
        ctx.lineTo(dist, -width2 / 2);
        ctx.arc(dist, 0, width2 / 2, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(0, width1 / 2);
        ctx.arc(0, 0, width1 / 2, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, -width1 / 2, 0, width1 / 2);
        if (isGlowing) {
            grad.addColorStop(0, `rgba(255, 30, 40, ${0.4 + glowIntensity * 0.5})`);
            grad.addColorStop(0.5, '#FFFFFF');
            grad.addColorStop(1, `rgba(255, 30, 40, ${0.7 + glowIntensity * 0.3})`);
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.strokeStyle = '#FF1E28';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            grad.addColorStop(0, '#FFFFFF');
            grad.addColorStop(0.5, mannequinSkin);
            grad.addColorStop(1, '#64748B');
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }

        ctx.restore();
    };

    // Helper: Muscle polygon glow patch (pectoral, deltoid, quad)
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

    // Helper: Draw Barbell with plates
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

            // Plates
            ctx.fillStyle = plateColor;
            ctx.fillRect(x - 8, y - length / 2, 16, 12);
            ctx.fillRect(x - 8, y + length / 2 - 12, 16, 12);
        } else {
            ctx.beginPath();
            ctx.moveTo(x - length / 2, y);
            ctx.lineTo(x + length / 2, y);
            ctx.stroke();

            // Knurling details
            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x - 30, y);
            ctx.lineTo(x + 30, y);
            ctx.stroke();

            // Red Weight Plates
            ctx.fillStyle = plateColor;
            ctx.shadowColor = '#FF1E28';
            ctx.shadowBlur = 10;
            ctx.fillRect(x - length / 2 + 10, y - 22, 14, 44);
            ctx.fillRect(x + length / 2 - 24, y - 22, 14, 44);

            // Collars
            ctx.fillStyle = '#E2E8F0';
            ctx.fillRect(x - length / 2 + 24, y - 10, 6, 20);
            ctx.fillRect(x + length / 2 - 30, y - 10, 6, 20);
        }
        ctx.restore();
    };

    // Helper: Draw Dumbbells
    const drawDumbbell = (x, y, angle = 0) => {
        ctx.save();
        ctx.translate(x, y);
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
        ctx.shadowColor = '#FF1E28';
        ctx.shadowBlur = 8;
        ctx.fillRect(-18, -12, 6, 24);
        ctx.fillRect(12, -12, 6, 24);

        ctx.restore();
    };

    // -----------------------------------------------------------------------------------
    // KINEMATICS RENDERERS BY PATTERN
    // -----------------------------------------------------------------------------------

    if (pattern === 'bench_press' || pattern === 'incline_bench_press' || pattern === 'chest_fly') {
        const isIncline = pattern === 'incline_bench_press';
        const isFly = pattern === 'chest_fly';
        const benchAngle = isIncline ? -0.45 : 0; // ~26 degrees incline

        ctx.translate(w / 2 - 20, h / 2 + 30);
        ctx.rotate(benchAngle);

        // Bench Pad
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
        // Foot
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

        // Floor Mat
        ctx.fillStyle = '#1c1c28';
        ctx.fillRect(-170, 60, 340, 8);

        // p: 0 = arms extended (top of pushup), 1 = chest hovering floor
        const chestContraction = 1 - p;
        const bodyY = -15 + p * 45; // body descends to floor

        // Toes on floor
        ctx.fillStyle = '#64748B';
        ctx.fillRect(-145, 50, 15, 12);

        // Rigid hollow body from heels to shoulders
        drawLimb(-135, 50, -60, bodyY + 15, 18, 16); // legs
        drawLimb(-60, bodyY + 15, 30, bodyY - 10, 24, 20, true, chestContraction); // torso

        // Pectoral & Core Glow
        drawMuscleGlow(10, bodyY, 26, 16, 0.4 + chestContraction * 0.6, muscleGlowColor);

        // Head
        drawHead(55, bodyY - 20, 18, 0.2);

        // Arms pushing against floor
        const elbowX = 35 + p * 20;
        const elbowY = bodyY + 15 + p * 15;
        drawLimb(25, bodyY - 5, elbowX, elbowY, 16, 14, true, chestContraction);
        drawLimb(elbowX, elbowY, 30, 58, 14, 12);

    } else if (pattern === 'squat') {
        ctx.translate(w / 2, h / 2 - 20);

        // Floor line
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

        // Thigh
        drawLimb(hipX, hipY, kneeX, kneeY, 24, 18, true, quadContraction);
        // Shin
        drawLimb(kneeX, kneeY, footX, footY, 18, 12);
        // Foot
        ctx.fillStyle = '#475569';
        ctx.fillRect(footX - 15, footY - 8, 45, 12);

        // Torso
        ctx.save();
        ctx.translate(hipX, hipY);
        ctx.rotate(-torsoAngle);

        drawMuscleGlow(hipX + 5, hipY + 15, 24, 20, 0.4 + quadContraction * 0.6, muscleGlowColor);

        // Torso Spine
        drawLimb(0, 0, -10, -90, 24, 20);

        // Head
        drawHead(-15, -115, 18, -torsoAngle * 0.5);

        // Barbell across traps
        drawBarbell(-12, -90, 180);

        // Arms holding bar
        drawLimb(-15, -80, 10, -85, 12, 10);
        drawLimb(10, -85, -10, -90, 10, 8);

        ctx.restore();

    } else if (pattern === 'lat_pulldown') {
        ctx.translate(w / 2, h / 2 - 30);

        // Pulldown Lat Machine Frame
        ctx.fillStyle = '#1e1e2d';
        ctx.fillRect(-30, 90, 60, 14);
        ctx.fillRect(-6, -140, 12, 240);
        ctx.fillRect(-60, -140, 120, 12);

        const latContraction = p;
        const barY = -120 + p * 85;

        // Seated Torso
        drawLimb(0, 90, 0, 0, 24, 22, true, latContraction * 0.8);

        // Head
        drawHead(0, -25, 18, 0);

        // Latissimus Dorsi Glowing Wings
        drawMuscleGlow(-25, 25, 20, 35, 0.3 + latContraction * 0.7, muscleGlowColor);
        drawMuscleGlow(25, 25, 20, 35, 0.3 + latContraction * 0.7, muscleGlowColor);

        // Legs
        drawLimb(-15, 90, -35, 140, 18, 14);
        drawLimb(15, 90, 35, 140, 18, 14);

        // Left & Right Arms pulling down
        const leftElbowX = -55 - (1 - p) * 15;
        const leftElbowY = -10 + p * 40;
        const leftHandX = -80;
        const leftHandY = barY;
        drawLimb(-15, -5, leftElbowX, leftElbowY, 14, 12, true, latContraction);
        drawLimb(leftElbowX, leftElbowY, leftHandX, leftHandY, 12, 10);

        const rightElbowX = 55 + (1 - p) * 15;
        const rightElbowY = -10 + p * 40;
        const rightHandX = 80;
        const rightHandY = barY;
        drawLimb(15, -5, rightElbowX, rightElbowY, 14, 12, true, latContraction);
        drawLimb(rightElbowX, rightElbowY, rightHandX, rightHandY, 12, 10);

        // Cable Line
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -130);
        ctx.lineTo(0, barY);
        ctx.stroke();

        // Wide Pulldown Bar
        drawBarbell(0, barY, 190);

    } else if (pattern === 'bicep_curl') {
        ctx.translate(w / 2, h / 2 - 10);

        // Floor
        ctx.strokeStyle = '#272738';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-140, 150);
        ctx.lineTo(140, 150);
        ctx.stroke();

        // Standing Legs
        drawLimb(-15, 50, -20, 150, 20, 14);
        drawLimb(15, 50, 20, 150, 20, 14);

        // Torso
        drawLimb(0, 50, 0, -50, 24, 20);

        // Head
        drawHead(0, -75, 18, 0);

        const bicepContraction = p;
        const elbowX = 25;
        const elbowY = -35;
        const armAngle = Math.PI / 2 - p * (Math.PI * 0.7);
        const handX = elbowX + Math.cos(armAngle) * 55;
        const handY = elbowY + Math.sin(armAngle) * 55;

        // Bicep Muscle Swell & Glow
        drawMuscleGlow(elbowX - 2, elbowY + 8, 16, 20, 0.3 + bicepContraction * 0.7, muscleGlowColor);

        // Left stationary arm
        drawLimb(-20, -45, -24, 20, 14, 10);

        // Right active curling arm
        drawLimb(15, -45, elbowX, elbowY, 16, 14);
        drawLimb(elbowX, elbowY, handX, handY, 14, 10, true, bicepContraction);

        // Dumbbell
        drawDumbbell(handX, handY, armAngle);

    } else if (pattern === 'tricep_dip') {
        ctx.translate(w / 2, h / 2 - 10);

        // Dip Bars
        ctx.fillStyle = '#1e1e2d';
        ctx.strokeStyle = '#38384f';
        ctx.lineWidth = 3;
        ctx.fillRect(-65, -10, 130, 8);
        ctx.fillRect(-50, -10, 12, 160);
        ctx.fillRect(40, -10, 12, 160);

        const tricepContraction = 1 - p;
        const torsoY = -25 + p * 50;

        // Head
        drawHead(0, torsoY - 55, 18, 0);

        // Torso
        drawLimb(0, torsoY + 45, 0, torsoY - 30, 24, 20);

        // Crossed Legs
        drawLimb(-10, torsoY + 45, -20, torsoY + 110, 18, 14);
        drawLimb(-20, torsoY + 110, 10, torsoY + 130, 14, 10);

        // Triceps Glow
        drawMuscleGlow(-28, torsoY - 10, 14, 24, 0.3 + tricepContraction * 0.7, muscleGlowColor);
        drawMuscleGlow(28, torsoY - 10, 14, 24, 0.3 + tricepContraction * 0.7, muscleGlowColor);

        // Arms holding bars
        const elbowX = 35 + p * 15;
        const elbowY = torsoY - 20 + p * 30;
        drawLimb(15, torsoY - 30, elbowX, elbowY, 16, 14, true, tricepContraction);
        drawLimb(elbowX, elbowY, 40, -6, 14, 12);

    } else if (pattern === 'deadlift') {
        ctx.translate(w / 2, h / 2 - 15);

        // Floor
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

        // Legs
        drawLimb(hipX, hipY, 15, 95, 22, 16, true, posteriorContraction);
        drawLimb(15, 95, 15, 150, 18, 14);

        // Hamstring & Glute Glow
        drawMuscleGlow(hipX - 5, hipY + 15, 22, 28, 0.3 + posteriorContraction * 0.7, muscleGlowColor);

        // Hinged Torso
        ctx.save();
        ctx.translate(hipX, hipY);
        ctx.rotate(-hingeAngle);

        drawLimb(0, 0, 0, -85, 24, 20, true, posteriorContraction * 0.8);
        drawHead(0, -110, 18, 0);
        ctx.restore();

        // Arms & Barbell
        drawLimb(hipX + Math.sin(hingeAngle) * 70, hipY - Math.cos(hingeAngle) * 70, 20, barY, 14, 10);
        drawBarbell(20, barY, 170);

    } else if (pattern === 'overhead_press' || pattern === 'lateral_raise') {
        const isLateral = pattern === 'lateral_raise';
        ctx.translate(w / 2, h / 2 - 15);

        // Floor
        ctx.strokeStyle = '#272738';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-140, 150);
        ctx.lineTo(140, 150);
        ctx.stroke();

        // Standing Stance
        drawLimb(-15, 50, -20, 150, 20, 14);
        drawLimb(15, 50, 20, 150, 20, 14);

        // Torso & Head
        drawLimb(0, 50, 0, -50, 24, 20);
        drawHead(0, -75, 18, 0);

        const deltoidContraction = p;

        // Deltoids Glow
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

        // Floor Mat
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

        // Ab Wheel
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

        const legPhase1 = p * Math.PI * 2;
        const knee1X = 20 + Math.sin(legPhase1) * 35;
        const knee1Y = 70 + Math.cos(legPhase1) * 35;
        const foot1X = knee1X + Math.sin(legPhase1 + 0.5) * 40;
        const foot1Y = knee1Y + Math.cos(legPhase1 + 0.5) * 35;

        ctx.save();
        ctx.rotate(0.25);

        drawHead(10, -80, 18, 0.2);
        drawLimb(0, 40, 10, -55, 24, 20, true, 0.8);
        drawMuscleGlow(5, -10, 22, 35, 0.7, muscleGlowColor);

        const armSwing = Math.sin(legPhase1);
        drawLimb(10, -45, -25 * armSwing, -10, 14, 10);
        drawLimb(10, -45, 25 * armSwing, -10, 14, 10);

        drawLimb(0, 40, knee1X, knee1Y, 20, 16, true, 0.9);
        drawLimb(knee1X, knee1Y, foot1X, foot1Y, 16, 12);

        ctx.restore();
    } else {
        drawBarbell(w / 2, h / 2, 180);
    }

    ctx.restore();
}

/**
 * Main Exercise Demo Modal Component
 */
const ExerciseDemoModal = ({
    isOpen = false,
    onClose = () => {},
    exercise = null
}) => {
    const [speed, setSpeed] = useState(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const [phaseData, setPhaseData] = useState({
        phase: 0,
        isConcentric: false,
        breathState: 'Breathe In',
        contractionIntensity: 0.5
    });
    const [repCount, setRepCount] = useState(1);
    const lastCycleConcentric = useRef(false);

    // Get exercise name & detect kinematics pattern
    const exerciseName = exercise?.name || exercise?.title || 'Incline Dumbbell Bench Press';
    const pattern = detectExercisePattern(exerciseName);
    const metadata = EXERCISE_METADATA[pattern] || EXERCISE_METADATA.bench_press;

    // Reset counts on exercise change
    useEffect(() => {
        setRepCount(1);
        setIsPlaying(true);
    }, [exerciseName]);

    // Track completed repetitions
    const handlePhaseUpdate = (info) => {
        setPhaseData(info);
        if (info.isConcentric && !lastCycleConcentric.current) {
            setRepCount(prev => (prev >= 99 ? 1 : prev + 1));
        }
        lastCycleConcentric.current = info.isConcentric;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
            <div 
                className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#101017] border border-[#272738] rounded-3xl shadow-[0_0_60px_rgba(229,9,20,0.25)] flex flex-col text-white scrollbar-none"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Bar */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#20202e] bg-[#14141e]/80 sticky top-0 z-20 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#990000] text-white flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.4)]">
                            <i className="bi bi-person-walking text-lg"></i>
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
                            <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                                {exerciseName}
                            </h3>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl bg-[#1b1b26] hover:bg-[#262638] text-zinc-400 hover:text-white border border-[#2c2c3e] flex items-center justify-center transition-all cursor-pointer"
                        title="Close Demo"
                    >
                        <i className="bi bi-x-lg text-sm"></i>
                    </button>
                </div>

                {/* Main Content Body */}
                <div className="p-4 sm:p-6 space-y-5">
                    {/* Upper Section: Canvas Animation & Interactive HUD */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                        {/* 2D Faceless Mannequin Interactive Canvas (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col items-center relative">
                            {/* Target Muscle Glow Badge Overlay */}
                            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-[#303044] text-[10px] font-bold">
                                <span className="w-2 h-2 rounded-full bg-[#FF1E28] animate-ping"></span>
                                <span className="text-zinc-300">Target Muscle Active:</span>
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
                            <div className="w-full mt-3 p-2.5 rounded-2xl bg-[#151520] border border-[#242436] flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="px-3 py-1.5 rounded-xl bg-[#1e1e2c] hover:bg-[#E50914] text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                                    >
                                        <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill text-[#FF1E28]'}`}></i>
                                        <span>{isPlaying ? 'Pause' : 'Play'}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setRepCount(1)}
                                        className="p-1.5 rounded-xl bg-[#1e1e2c] hover:bg-[#26263a] text-zinc-400 hover:text-white text-xs transition-all cursor-pointer"
                                        title="Reset rep count"
                                    >
                                        <i className="bi bi-arrow-clockwise"></i>
                                    </button>
                                </div>

                                {/* Tempo Speeds */}
                                <div className="flex items-center gap-1 bg-[#0f0f16] p-1 rounded-xl border border-[#202030]">
                                    {[0.5, 1, 1.5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setSpeed(s)}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                                speed === s
                                                    ? 'bg-[#E50914] text-white shadow-[0_0_8px_rgba(229,9,20,0.4)]'
                                                    : 'text-zinc-400 hover:text-white'
                                            }`}
                                        >
                                            {s}x
                                        </button>
                                    ))}
                                </div>

                                <div className="text-right pr-1">
                                    <span className="text-[10px] text-zinc-400 block font-bold uppercase">Cadence</span>
                                    <span className="text-xs font-black text-[#FF1E28]">
                                        {phaseData.isConcentric ? 'CONCENTRIC' : 'ECCENTRIC'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Leap Fitness Breathing & Rep Telemetry Gauge (5 cols) */}
                        <div className="lg:col-span-5 space-y-4">
                            {/* Breathing Guide Card with Expansion Visualizer */}
                            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#181824] to-[#12121b] border border-[#272738] space-y-3 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <i className="bi bi-wind text-cyan-400"></i>
                                        Breathing Rhythm Guide
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#20202e] text-zinc-300">
                                        Synced
                                    </span>
                                </div>

                                {/* Breathing Animation Bubble */}
                                <div className="relative flex flex-col items-center justify-center p-4 rounded-xl bg-[#0c0c14] border border-[#202030] overflow-hidden">
                                    <div
                                        className={`w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-700 ease-in-out shadow-[0_0_20px_rgba(34,211,238,0.25)] ${
                                            phaseData.isConcentric
                                                ? 'scale-90 bg-red-600/15 border-[#FF1E28]'
                                                : 'scale-110 bg-cyan-500/15 border-cyan-400'
                                        }`}
                                    >
                                        <i className={`bi ${phaseData.isConcentric ? 'bi-arrow-up-circle-fill text-[#FF1E28]' : 'bi-arrow-down-circle-fill text-cyan-400'} text-xl`}></i>
                                        <span className="text-xs font-black text-white mt-0.5 tracking-tight">
                                            {phaseData.breathState}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-300 text-center mt-3 font-medium">
                                        {metadata.breathing}
                                    </p>
                                </div>
                            </div>

                            {/* Repetition Counter & Load Tempo */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3.5 rounded-2xl bg-[#151520] border border-[#242436] text-center space-y-1">
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                                        Rep Counter
                                    </span>
                                    <span className="text-2xl font-black text-white">
                                        {repCount} <span className="text-xs text-zinc-500 font-normal">/ loop</span>
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-[#151520] border border-[#242436] text-center space-y-1">
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                                        Prescribed Tempo
                                    </span>
                                    <span className="text-sm font-black text-amber-400 block pt-1">
                                        {metadata.tempo}
                                    </span>
                                </div>
                            </div>

                            {/* Target Muscles Badges */}
                            <div className="p-4 rounded-2xl bg-[#151520] border border-[#242436] space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                                    Muscles Engaged:
                                </span>
                                <div className="space-y-1.5">
                                    <div>
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase block">Primary Drivers:</span>
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                            {metadata.primaryMuscles.map((m, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2.5 py-0.5 rounded-lg bg-red-600/15 border border-red-500/40 text-[#FF1E28] text-[10px] font-black flex items-center gap-1 shadow-[0_0_8px_rgba(229,9,20,0.2)]"
                                                >
                                                    <i className="bi bi-fire text-[9px]"></i>
                                                    {m}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-1">
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase block">Synergists & Stabilizers:</span>
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                            {metadata.secondaryMuscles.map((m, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 rounded-md bg-[#1f1f2e] border border-[#2a2a3e] text-zinc-300 text-[10px] font-semibold"
                                                >
                                                    {m}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lower Section: Execution Form Cues & Common Mistakes to Avoid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#1f1f2e]">
                        {/* Form Execution Cues */}
                        <div className="p-4 rounded-2xl bg-[#14141d] border border-[#242434] space-y-2.5">
                            <h5 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <i className="bi bi-check-circle-fill text-emerald-400"></i>
                                Key Biomechanical Form Cues
                            </h5>
                            <ul className="space-y-2">
                                {metadata.cues.map((cue, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                                        <span className="w-5 h-5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                                            0{idx + 1}
                                        </span>
                                        <span className="leading-snug">{cue}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Common Mistakes to Avoid */}
                        <div className="p-4 rounded-2xl bg-[#14141d] border border-[#242434] space-y-2.5">
                            <h5 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <i className="bi bi-exclamation-triangle-fill text-amber-400"></i>
                                Common Mistakes to Avoid
                            </h5>
                            <ul className="space-y-2">
                                {metadata.mistakes.map((mistake, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                                        <span className="w-5 h-5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                                            ✕
                                        </span>
                                        <span className="leading-snug">{mistake}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer Bar */}
                <div className="p-4 border-t border-[#20202e] bg-[#14141e]/90 flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-medium">
                        Omnifit Biomechanics Engine • Leap Fitness 2D Vector Model
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B80710] hover:from-[#FF1E28] hover:to-[#E50914] text-white text-xs font-black transition-all cursor-pointer shadow-[0_0_12px_rgba(229,9,20,0.3)]"
                    >
                        Got It, Back to Workout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseDemoModal;
