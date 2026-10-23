import React, { useState, useRef, useEffect, useCallback } from 'react';

const WorkoutProofModal = ({
    isOpen,
    onClose,
    exercise,
    onUploadProof,
    onSubmitProof,
    isUploading
}) => {
    const [mode, setMode] = useState('camera'); // 'camera' | 'upload'
    const [stream, setStream] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordingStatus, setRecordingStatus] = useState('idle'); // 'idle' | 'recording' | 'preview'
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [recordedUrl, setRecordedUrl] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [cameraError, setCameraError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState(null);
    const [useDemoClip, setUseDemoClip] = useState(false);

    const videoLiveRef = useRef(null);
    const recordedVideoRef = useRef(null);
    const timerIntervalRef = useRef(null);
    const chunksRef = useRef([]);
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    // Sample high-quality gym overload clip for demonstration
    const DEMO_GYM_CLIP = "https://assets.mixkit.co/videos/preview/mixkit-athlete-lifting-heavy-barbell-in-gym-42777-large.mp4";

    const stopCameraStream = useCallback(() => {
        if (streamRef.current) {
            try {
                streamRef.current.getTracks().forEach(track => {
                    try { track.stop(); } catch (e) { /* ignore */ }
                });
            } catch (err) {
                console.warn("Error stopping media tracks:", err);
            }
            streamRef.current = null;
        }
        setStream(null);
    }, []);

    const startCamera = useCallback(async () => {
        setCameraError(null);
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Webcam recording is not supported in this browser environment.");
            }

            // Stop any previous tracks before initiating new stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => {
                    try { t.stop(); } catch (e) {}
                });
                streamRef.current = null;
            }

            let mediaStream;
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
                    audio: true
                });
            } catch (audioErr) {
                // If microphone is blocked or missing, fall back gracefully to video only
                console.warn("Microphone access unavailable or denied, falling back to video only:", audioErr);
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
                });
            }

            streamRef.current = mediaStream;
            setStream(mediaStream);

            if (videoLiveRef.current) {
                videoLiveRef.current.srcObject = mediaStream;
                videoLiveRef.current.play().catch(e => console.warn("Live video autoPlay warning:", e));
            }
        } catch (err) {
            console.warn("Camera access failed or unavailable:", err);
            setCameraError(err.message || "Camera access was denied or no webcam hardware detected.");
            streamRef.current = null;
            setStream(null);
        }
    }, []);

    // Camera stream lifecycle: Start when modal is open and on camera mode, stop on close or switch to upload
    useEffect(() => {
        if (!isOpen || mode !== 'camera') {
            stopCameraStream();
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        } else if (isOpen && mode === 'camera' && recordingStatus !== 'preview') {
            const hasLiveTrack = streamRef.current &&
                streamRef.current.active &&
                streamRef.current.getVideoTracks().some(t => t.readyState === 'live');

            if (!hasLiveTrack) {
                startCamera();
            }
        }
    }, [isOpen, mode, recordingStatus, startCamera, stopCameraStream]);

    // Ensure videoLiveRef element is bound and playing live feed whenever rendered
    useEffect(() => {
        if (videoLiveRef.current && stream && recordingStatus !== 'preview') {
            if (videoLiveRef.current.srcObject !== stream) {
                videoLiveRef.current.srcObject = stream;
            }
            videoLiveRef.current.play().catch(e => console.warn("Live video play error:", e));
        }
    }, [stream, recordingStatus, mode]);

    // Unmount cleanup
    useEffect(() => {
        return () => {
            stopCameraStream();
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        };
    }, [stopCameraStream]);

    // Live Recording Controls
    const startRecording = () => {
        const activeStream = streamRef.current || stream;
        if (!activeStream || !activeStream.active || activeStream.getVideoTracks().length === 0) {
            setCameraError("Camera stream not active. Please grant webcam permissions or use sample clip.");
            return;
        }

        chunksRef.current = [];
        try {
            const supportedTypes = [
                'video/webm;codecs=vp9,opus',
                'video/webm;codecs=vp8,opus',
                'video/webm',
                'video/mp4;codecs=avc1,mp4a.40.2',
                'video/mp4'
            ];
            let selectedMimeType = '';
            for (const type of supportedTypes) {
                if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
                    selectedMimeType = type;
                    break;
                }
            }

            const options = selectedMimeType ? { mimeType: selectedMimeType } : {};
            const recorder = new MediaRecorder(activeStream, options);

            recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const finalMime = recorder.mimeType || selectedMimeType || 'video/webm';
                const blob = new Blob(chunksRef.current, { type: finalMime });
                const url = URL.createObjectURL(blob);
                setRecordedBlob(blob);
                setRecordedUrl(url);
                setRecordingStatus('preview');
                // Release active camera tracks once recording is finished and in preview
                stopCameraStream();
            };

            recorder.onerror = (e) => {
                console.error("MediaRecorder error:", e);
                setCameraError("Recording error: " + (e.error?.message || "Unknown error"));
            };

            recorder.start(100);
            mediaRecorderRef.current = recorder;
            setMediaRecorder(recorder);
            setRecordingStatus('recording');
            setRecordingTime(0);

            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Failed to start MediaRecorder:", err);
            setCameraError("Could not initialize video recording: " + err.message);
        }
    };

    const stopRecording = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }

        const recorder = mediaRecorderRef.current || mediaRecorder;
        if (recorder && recorder.state !== 'inactive') {
            try {
                recorder.requestData();
            } catch (e) {
                // Request any final data
            }
            recorder.stop();
        }
    };

    const resetRecording = () => {
        if (recordedUrl && recordedUrl !== DEMO_GYM_CLIP) {
            URL.revokeObjectURL(recordedUrl);
        }
        setRecordedBlob(null);
        setRecordedUrl(null);
        setRecordingStatus('idle');
        setRecordingTime(0);
        setUseDemoClip(false);
        // Re-open camera feed for new recording
        startCamera();
    };

    const handleClose = () => {
        stopCameraStream();
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        if (recordedUrl && recordedUrl !== DEMO_GYM_CLIP) {
            URL.revokeObjectURL(recordedUrl);
        }
        if (filePreviewUrl && filePreviewUrl !== DEMO_GYM_CLIP) {
            URL.revokeObjectURL(filePreviewUrl);
        }
        setRecordedBlob(null);
        setRecordedUrl(null);
        setSelectedFile(null);
        setFilePreviewUrl(null);
        setUseDemoClip(false);
        setRecordingStatus('idle');
        setRecordingTime(0);
        setCameraError(null);
        onClose();
    };

    // File Upload handling
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setFilePreviewUrl(url);
            setUseDemoClip(false);
        }
    };

    const handleSelectDemoClip = () => {
        stopCameraStream();
        setUseDemoClip(true);
        setSelectedFile(null);
        setRecordedBlob(null);
        setFilePreviewUrl(DEMO_GYM_CLIP);
        setRecordedUrl(DEMO_GYM_CLIP);
        setRecordingStatus('preview');
    };

    // Confirm & Submit
    const handleConfirmUpload = () => {
        const callback = onSubmitProof || onUploadProof;
        if (!callback) return;

        let payload = DEMO_GYM_CLIP;
        if (useDemoClip) {
            payload = DEMO_GYM_CLIP;
        } else if (mode === 'camera' && recordedBlob) {
            const ext = recordedBlob.type?.includes('mp4') ? 'mp4' : 'webm';
            payload = new File([recordedBlob], `workout_proof_${exercise.id}_${Date.now()}.${ext}`, {
                type: recordedBlob.type || 'video/webm'
            });
        } else if (mode === 'upload' && selectedFile) {
            payload = selectedFile;
        } else if (mode === 'camera' && recordedUrl) {
            payload = recordedUrl;
        } else if (mode === 'upload' && filePreviewUrl) {
            payload = filePreviewUrl;
        }

        // Support both callback(id, payload) and callback(payload)
        callback(exercise.id, payload);
    };

    if (!isOpen || !exercise) return null;

    const formatTimer = (sec) => {
        const mins = Math.floor(sec / 60);
        const rem = sec % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${rem < 10 ? '0' : ''}${rem}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
            <div className="w-full max-w-xl sm:max-w-2xl bg-[#121217] border border-[#2a2a38] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
                
                {/* Header */}
                <div className="px-5 py-3 border-b border-[#1f1f28] flex items-center justify-between relative bg-gradient-to-r from-[#16161f] to-[#121217]">
                    <div className="space-y-0.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E50914]/15 border border-[#E50914]/40">
                            <span className="w-2 h-2 rounded-full bg-[#FF1E28] animate-pulse"></span>
                            <span className="text-[9px] font-black text-[#FF1E28] uppercase tracking-widest">
                                VERIFIED WORKOUT EXECUTION
                            </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                            <span>Proof of Workout:</span>
                            <span className="text-[#FF1E28]">{exercise.name}</span>
                        </h3>
                        <p className="text-[11px] text-zinc-400 font-medium">
                            Target: <strong className="text-white">{exercise.setsReps || exercise.sets_reps || '4 x 10'}</strong> @ <strong className="text-white">{exercise.targetLoad || exercise.target_load || '20 kg'}</strong>
                        </p>
                    </div>

                    <button
                        onClick={handleClose}
                        disabled={isUploading}
                        className="w-9 h-9 rounded-xl bg-[#181820] hover:bg-[#252532] border border-[#2c2c3d] text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                        <i className="bi bi-x-lg text-xs"></i>
                    </button>
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex border-b border-[#1f1f28] bg-[#0e0e13] p-1.5 gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setMode('camera');
                            resetRecording();
                        }}
                        disabled={recordingStatus === 'recording' || isUploading}
                        className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            mode === 'camera'
                                ? 'bg-gradient-to-r from-[#E50914] to-[#B80710] text-white shadow-[0_0_12px_rgba(229,9,20,0.35)]'
                                : 'text-zinc-400 hover:text-white hover:bg-[#181820]'
                        }`}
                    >
                        <i className="bi bi-camera-video-fill text-xs"></i>
                        <span>Live Camera Session</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setMode('upload');
                            stopCameraStream();
                        }}
                        disabled={recordingStatus === 'recording' || isUploading}
                        className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            mode === 'upload'
                                ? 'bg-gradient-to-r from-[#E50914] to-[#B80710] text-white shadow-[0_0_12px_rgba(229,9,20,0.35)]'
                                : 'text-zinc-400 hover:text-white hover:bg-[#181820]'
                        }`}
                    >
                        <i className="bi bi-cloud-arrow-up-fill text-xs"></i>
                        <span>Upload Video File</span>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
                    {/* CAMERA MODE */}
                    {mode === 'camera' && (
                        <div className="space-y-3">
                            {/* Live Viewport or Recorded Preview with Constrained Max-Height */}
                            <div className="relative aspect-video max-h-[34vh] sm:max-h-[270px] w-auto mx-auto rounded-2xl bg-black border border-[#262634] overflow-hidden flex items-center justify-center shadow-inner">
                                {recordingStatus === 'preview' ? (
                                    <video
                                        ref={recordedVideoRef}
                                        src={recordedUrl}
                                        controls
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <>
                                        <video
                                            ref={videoLiveRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className={`w-full h-full object-contain bg-black ${recordingStatus === 'recording' ? 'ring-2 ring-[#FF1E28]' : ''}`}
                                        />

                                        {/* Camera Error Notice with Demo Fallback */}
                                        {cameraError && (
                                            <div className="absolute inset-0 bg-black/90 p-4 flex flex-col items-center justify-center text-center space-y-2 z-20">
                                                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center text-lg">
                                                    <i className="bi bi-camera-video-off-fill"></i>
                                                </div>
                                                <div className="max-w-sm space-y-0.5">
                                                    <h5 className="text-xs font-black text-white">Camera Feed Unavailable</h5>
                                                    <p className="text-[11px] text-zinc-400 leading-snug">{cameraError}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleSelectDemoClip}
                                                    className="px-3.5 py-1.5 rounded-xl bg-[#181820] hover:bg-[#22222d] border border-[#FF1E28]/40 text-[#FF1E28] hover:text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                                                >
                                                    <i className="bi bi-play-circle-fill"></i>
                                                    <span>Load Gym Overload Demo Clip</span>
                                                </button>
                                            </div>
                                        )}

                                        {/* Recording Indicator & Timer Overlay */}
                                        {recordingStatus === 'recording' && (
                                            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-black/85 border border-red-500/50 backdrop-blur-md">
                                                <span className="w-2 h-2 rounded-full bg-[#FF1E28] animate-ping"></span>
                                                <span className="text-[11px] font-black text-white uppercase tracking-wider">
                                                    REC {formatTimer(recordingTime)}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Camera Action Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                                {recordingStatus === 'idle' && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={startRecording}
                                            disabled={!!cameraError}
                                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B80710] hover:from-[#FF1E28] hover:to-[#E50914] text-white font-black text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(229,9,20,0.35)] transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            <i className="bi bi-record-circle-fill text-sm"></i>
                                            <span>Start Live Recording</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSelectDemoClip}
                                            className="px-3.5 py-2 rounded-xl bg-[#181820] hover:bg-[#22222e] border border-[#2a2a38] text-zinc-300 hover:text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
                                        >
                                            <i className="bi bi-film"></i>
                                            <span>Use Sample Overload Clip</span>
                                        </button>
                                    </>
                                )}

                                {recordingStatus === 'recording' && (
                                    <button
                                        type="button"
                                        onClick={stopRecording}
                                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(229,9,20,0.5)] transition-all cursor-pointer animate-pulse"
                                    >
                                        <i className="bi bi-stop-circle-fill text-sm"></i>
                                        <span>Stop & Finalize Workout Recording ({formatTimer(recordingTime)})</span>
                                    </button>
                                )}

                                {recordingStatus === 'preview' && (
                                    <div className="flex items-center justify-between w-full">
                                        <button
                                            type="button"
                                            onClick={resetRecording}
                                            disabled={isUploading}
                                            className="px-3.5 py-2 rounded-xl bg-[#181820] hover:bg-[#22222d] border border-[#2a2a38] text-zinc-400 hover:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                                        >
                                            <i className="bi bi-arrow-counterclockwise"></i>
                                            <span>Discard & Re-Record</span>
                                        </button>

                                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                            <i className="bi bi-check-circle-fill"></i>
                                            <span>Clip Ready for Submission</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* FILE UPLOAD MODE */}
                    {mode === 'upload' && (
                        <div className="space-y-3">
                            {!filePreviewUrl ? (
                                <label className="block border-2 border-dashed border-[#2a2a38] hover:border-[#E50914]/60 rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#101015] group">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <div className="w-12 h-12 rounded-xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF1E28] flex items-center justify-center text-xl mx-auto mb-2 group-hover:scale-110 transition-transform">
                                        <i className="bi bi-cloud-arrow-up-fill"></i>
                                    </div>
                                    <h5 className="text-xs sm:text-sm font-extrabold text-white mb-0.5">
                                        Click to Upload or Drag Workout Video Here
                                    </h5>
                                    <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
                                        Accepts MP4, WebM, MOV, or phone camera recording files (Recommended: Under 100MB).
                                    </p>
                                </label>
                            ) : (
                                <div className="space-y-2.5">
                                    <div className="aspect-video max-h-[34vh] sm:max-h-[270px] w-auto mx-auto rounded-2xl bg-black border border-[#262634] overflow-hidden flex items-center justify-center shadow-inner">
                                        <video
                                            src={filePreviewUrl}
                                            controls
                                            playsInline
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between text-xs px-1">
                                        <span className="text-zinc-300 font-semibold truncate max-w-xs">
                                            {selectedFile?.name || 'Workout_Proof_Clip.mp4'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setFilePreviewUrl(null);
                                            }}
                                            className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                                        >
                                            Remove & Select Another
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="pt-1 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleSelectDemoClip}
                                    className="px-3.5 py-1.5 rounded-xl bg-[#181820] hover:bg-[#22222e] border border-[#2a2a38] text-zinc-300 hover:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                                >
                                    <i className="bi bi-film"></i>
                                    <span>Use Sample Gym Overload Clip</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-3 border-t border-[#1f1f28] bg-[#0e0e13] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[11px] text-zinc-400 flex items-center">
                        <i className="bi bi-shield-lock-fill text-[#FF1E28] me-1"></i>
                        Instantly accessible to Coach <strong className="text-white ms-1">Vikram Rathore</strong> for form validation.
                    </p>

                    <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isUploading}
                            className="px-4 py-2 rounded-xl bg-[#181820] hover:bg-[#20202a] border border-[#2c2c3d] text-zinc-300 hover:text-white font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleConfirmUpload}
                            disabled={isUploading || (mode === 'camera' && recordingStatus !== 'preview') || (mode === 'upload' && !filePreviewUrl)}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(16,185,129,0.35)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                    <span>Uploading & Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check2-circle text-sm"></i>
                                    <span>Submit Proof & Complete Exercise</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WorkoutProofModal;
