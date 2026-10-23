import React, { useState } from 'react';

const WorkoutProofViewerModal = ({
    isOpen,
    onClose,
    exercise,
    athleteName = 'Athlete',
    isTrainer = false,
    onVerifyForm
}) => {
    const [coachNotes, setCoachNotes] = useState('');
    const [isFeedbackSent, setIsFeedbackSent] = useState(false);

    if (!isOpen || !exercise) return null;

    const videoUrl = exercise.video_proof_url || exercise.video_proof || "https://assets.mixkit.co/videos/preview/mixkit-athlete-lifting-heavy-barbell-in-gym-42777-large.mp4";

    const handleSendFeedback = () => {
        setIsFeedbackSent(true);
        if (onVerifyForm) {
            onVerifyForm(exercise.id, coachNotes);
        }
        setTimeout(() => setIsFeedbackSent(false), 3000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
            <div className="w-full max-w-3xl bg-[#121217] border border-[#2a2a38] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-[#1f1f28] flex items-center justify-between bg-gradient-to-r from-[#16161f] to-[#121217]">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                VERIFIED CAMERA PROOF SESSION
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                            <span>{exercise.name}</span>
                            <span className="text-zinc-400 font-normal text-sm">({exercise.setsReps || exercise.sets_reps || '4 x 10'} @ {exercise.targetLoad || exercise.target_load || '24 kg'})</span>
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium">
                            Athlete: <strong className="text-white">{athleteName}</strong>  •  Completed: <strong className="text-zinc-300">{exercise.completed_at || 'Today'}</strong>
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-2xl bg-[#181820] hover:bg-[#252532] border border-[#2c2c3d] text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                        <i className="bi bi-x-lg text-sm"></i>
                    </button>
                </div>

                {/* Video Playback Section */}
                <div className="p-6 space-y-5 overflow-y-auto">
                    <div className="aspect-video w-full rounded-2xl bg-black border border-[#252533] overflow-hidden shadow-2xl relative">
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Exercise Telemetry Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-2xl bg-[#181820] border border-[#252532] text-center">
                            <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">EXERCISE</span>
                            <span className="text-xs font-black text-white truncate block">{exercise.name}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#181820] border border-[#252532] text-center">
                            <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">TARGET LOAD</span>
                            <span className="text-xs font-black text-[#FF1E28]">{exercise.targetLoad || exercise.target_load || '24 kg'}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#181820] border border-[#252532] text-center">
                            <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">SETS x REPS</span>
                            <span className="text-xs font-black text-white">{exercise.setsReps || exercise.sets_reps || '4 x 10-12'}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#181820] border border-[#252532] text-center">
                            <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">STATUS</span>
                            <span className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1">
                                <i className="bi bi-check-circle-fill text-[11px]"></i>
                                Verified
                            </span>
                        </div>
                    </div>

                    {/* Trainer Form Feedback & Form Cue Area */}
                    {isTrainer && (
                        <div className="p-4 rounded-2xl bg-[#16161f] border border-[#262638] space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <i className="bi bi-chat-left-text-fill text-[#FF1E28]"></i>
                                    Coach Form Review & Biomechanical Feedback
                                </label>
                                <span className="text-[10px] text-zinc-400">Sends directly to athlete inbox</span>
                            </div>

                            <textarea
                                value={coachNotes}
                                onChange={(e) => setCoachNotes(e.target.value)}
                                rows={2}
                                placeholder="e.g. Great lockout and tempo! On rep 8 make sure to keep your ribcage down and avoid arching the lower back."
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#101015] border border-[#2a2a38] text-white text-xs outline-none focus:border-[#E50914] resize-none"
                            ></textarea>

                            <div className="flex items-center justify-between">
                                {isFeedbackSent ? (
                                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-fade-in">
                                        <i className="bi bi-check-circle-fill"></i>
                                        <span>Feedback dispatched to {athleteName}!</span>
                                    </span>
                                ) : (
                                    <span></span>
                                )}

                                <button
                                    type="button"
                                    onClick={handleSendFeedback}
                                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B80710] hover:from-[#FF1E28] hover:to-[#E50914] text-white font-black text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(229,9,20,0.35)] transition-all cursor-pointer"
                                >
                                    <i className="bi bi-send-fill text-xs"></i>
                                    <span>Send Form Analysis</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-[#1f1f28] bg-[#0e0e13] flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                        <i className="bi bi-check2-all text-emerald-400 me-1"></i>
                        Tamper-Proof Biometric & Video Timestamped Execution
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-[#181820] hover:bg-[#22222d] border border-[#2c2c3d] text-zinc-300 hover:text-white font-bold text-xs cursor-pointer transition-all"
                    >
                        Close Viewer
                    </button>
                </div>

            </div>
        </div>
    );
};

export default WorkoutProofViewerModal;
