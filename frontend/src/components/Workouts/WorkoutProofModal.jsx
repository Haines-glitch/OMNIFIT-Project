import React, { useState, useRef, useEffect } from 'react';

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

    // Sample high-quality gym overload clip for demonstration
    const DEMO_GYM_CLIP = "https://assets.mixkit.co/videos/preview/mixkit-athlete-lifting-heavy-barbell-in-gym-42777-large.mp4";

    // Handle camera stream start/cleanup
    useEffect(() => {
        if (isOpen && mode === 'camera' && recordingStatus === 'idle') {
            startCamera();
        } else if (!isOpen || mode !== 'camera' || recordingStatus !== 'idle') {
            stopCameraStream();
        }

        return () => {
            stopCameraStream();
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, [isOpen, mode, recordingStatus]);

    const startCamera = async () => {
        setCameraError(null);
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Webcam recording is not supported in this browser environment.");
            }
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: true
            }).catch(async () => {
                // Try without audio if microphone is blocked or not available
                return await navigator.mediaDevices.getUserMedia({ video: true });
            });

            setStream(mediaStream);
            if (videoLiveRef.current) {
                videoLiveRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.warn("Camera access failed or unavailable:", err);
            setCameraError(err.message || "Camera access was denied or no webcam hardware detected.");
        }
    };

    const stopCameraStream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    // Live Recording Controls
    const startRecording = () => {
        if (!stream) {
            setCameraError("Camera stream not active. Please enable webcam or use demo clip.");
            return;
        }

        chunksRef.current = [];
        try {
            const options = { mimeType: 'video/webm;codecs=vp8,opus' };
            let recorder;
            if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
                recorder = new MediaRecorder(stream, options);
            } else if (MediaRecorder.isTypeSupported('video/webm')) {
                recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            } else if (MediaRecorder.isTypeSupported('video/mp4')) {
                recorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });
            } else {
                recorder = new MediaRecorder(stream);
            }

            recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
                const url = URL.createObjectURL(blob);
                setRecordedBlob(blob);
                setRecordedUrl(url);
                setRecordingStatus('preview');
                stopCameraStream();
            };

            recorder.start(100);
            setMediaRecorder(recorder);
            setRecordingStatus('recording');
            setRecordingTime(0);

            timerIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Failed to start MediaRecorder:", err);
            setCameraError("Could not initialize video recording: " + err.message);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
    };

    const resetRecording = () => {
        if (recordedUrl) URL.revokeObjectURL(recordedUrl);
        setRecordedBlob(null);
        setRecordedUrl(null);
        setRecordingStatus('idle');
        setRecordingTime(0);
        setUseDemoClip(false);
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
            payload = new File([recordedBlob], `workout_proof_${exercise.id}_${Date.now()}.webm`, {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
            <div className="w-full max-w-2xl bg-[#121217] border border-[#2a2a38] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-[#1f1f28] flex items-center justify-between relative bg-gradient-to-r from-[#16161f] to-[#121217]">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#E50914]/15 border border-[#E50914]/40">
                            <span className="w-2 h-2 rounded-full bg-[#FF1E28] animate-pulse"></span>
                            <span className="text-[10px] font-black text-[#FF1E28] uppercase tracking-widest">
                                VERIFIED WORKOUT EXECUTION
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                            <span>Proof of Workout:</span>
                            <span className="text-[#FF1E28]">{exercise.name}</span>
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium">
                            Target: <strong className="text-white">{exercise.setsReps || exercise.sets_reps || '4 x 10'}</strong> @ <strong className="text-white">{exercise.targetLoad || exercise.target_load || '20 kg'}</strong>
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="w-10 h-10 rounded-2xl bg-[#181820] hover:bg-[#252532] border border-[#2c2c3d] text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                        <i className="bi bi-x-lg text-sm"></i>
                    </button>
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex border-b border-[#1f1f28] bg-[#0e0e13] p-2 gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setMode('camera');
                            resetRecording();
                        }}
                        disabled={recordingStatus === 'recording' || isUploading}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            mode === 'camera'
                                ? 'bg-gradient-to-r from-[#E50914] to-[#B80710] text-white shadow-[0_0_12px_rgba(229,9,20,0.35)]'
                                : 'text-zinc-400 hover:text-white hover:bg-[#181820]'
                        }`}
                    >
                        <i className="bi bi-camera-video-fill text-sm"></i>
                        <span>Live Camera Session</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setMode('upload');
                            stopCameraStream();
                        }}
                        disabled={recordingStatus === 'recording' || isUploading}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            mode === 'upload'
                                ? 'bg-gradient-to-r from-[#E50914] to-[#B80710] text-white shadow-[0_0_12px_rgba(229,9,20,0.35)]'
                                : 'text-zinc-400 hover:text-white hover:bg-[#181820]'
                        }`}
                    >
                        <i className="bi bi-cloud-arrow-up-fill text-sm"></i>
                        <span>Upload Video File</span>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-4">
                    {/* CAMERA MODE */}
                    {mode === 'camera' && (
                        <div className="space-y-4">
                            {/* Live Viewport or Recorded Preview */}
                            <div className="relative aspect-video rounded-2xl bg-black border border-[#262634] overflow-hidden flex items-center justify-center shadow-inner">
                                {recordingStatus === 'preview' ? (
                                    <video
                                        ref={recordedVideoRef}
                                        src={recordedUrl}
                                        controls
                                        autoPlay
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <>
                                        <video
                                            ref={videoLiveRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className={`w-full h-full object-cover ${recordingStatus === 'recording' ? 'scale-100' : ''}`}
                                        />

                                        {/* Camera Error Notice with Demo Fallback */}
                                        {cameraError && (
                                            <div className="absolute inset-0 bg-black/90 p-6 flex flex-col items-center justify-center text-center space-y-3 z-20">
                                                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center text-xl">
                                                    <i className="bi bi-camera-video-off-fill"></i>
                                                </div>
                                                <div className="max-w-sm space-y-1">
                                                    <h5 className="text-sm font-black text-white">Camera Feed Unavailable</h5>
                                                    <p className="text-xs text-zinc-400 leading-relaxed">{cameraError}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleSelectDemoClip}
                                                    className="px-4 py-2 rounded-xl bg-[#181820] hover:bg-[#22222d] border border-[#FF1E28]/40 text-[#FF1E28] hover:text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-md transition-all"
                                                >
                                                    <i className="bi bi-play-circle-fill"></i>
                                                    <span>Load Gym Overload Demo Clip</span>
                                                </button>
                                            </div>
                                        )}

                                        {/* Recording Indicator & Timer Overlay */}
                                        {recordingStatus === 'recording' && (
                                            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-red-500/50 backdrop-blur-md">
                                                <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E28] animate-ping"></span>
                                                <span className="text-xs font-black text-white uppercase tracking-wider">
                                                    REC {formatTimer(recordingTime)}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Camera Action Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                {recordingStatus === 'idle' && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={startRecording}
                                            disabled={!!cameraError}
                                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B80710] hover:from-[#FF1E28] hover:to-[#E50914] text-white font-black text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(229,9,20,0.35)] transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            <i className="bi bi-record-circle-fill text-sm"></i>
                                            <span>Start Live Recording</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSelectDemoClip}
                                            className="px-4 py-2.5 rounded-xl bg-[#181820] hover:bg-[#22222e] border border-[#2a2a38] text-zinc-300 hover:text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
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
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(229,9,20,0.5)] transition-all cursor-pointer animate-pulse"
                                    >
                                        <i className="bi bi-stop-circle-fill text-base"></i>
                                        <span>Stop & Finalize Workout Recording ({formatTimer(recordingTime)})</span>
                                    </button>
                                )}

                                {recordingStatus === 'preview' && (
                                    <div className="flex items-center justify-between w-full">
                                        <button
                                            type="button"
                                            onClick={resetRecording}
                                            disabled={isUploading}
                                            className="px-4 py-2.5 rounded-xl bg-[#181820] hover:bg-[#22222d] border border-[#2a2a38] text-zinc-400 hover:text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
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
                        <div className="space-y-4">
                            {!filePreviewUrl ? (
                                <label className="block border-2 border-dashed border-[#2a2a38] hover:border-[#E50914]/60 rounded-2xl p-8 text-center cursor-pointer transition-all bg-[#101015] group">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <div className="w-14 h-14 rounded-2xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF1E28] flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <i className="bi bi-cloud-arrow-up-fill"></i>
                                    </div>
                                    <h5 className="text-sm font-extrabold text-white mb-1">
                                        Click to Upload or Drag Workout Video Here
                                    </h5>
                                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                                        Accepts MP4, WebM, MOV, or phone camera recording files (Recommended: Under 100MB).
                                    </p>
                                </label>
                            ) : (
                                <div className="space-y-3">
                                    <div className="aspect-video rounded-2xl bg-black border border-[#262634] overflow-hidden flex items-center justify-center shadow-inner">
                                        <video
                                            src={filePreviewUrl}
                                            controls
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
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

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleSelectDemoClip}
                                    className="px-4 py-2 rounded-xl bg-[#181820] hover:bg-[#22222e] border border-[#2a2a38] text-zinc-300 hover:text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
                                >
                                    <i className="bi bi-film"></i>
                                    <span>Use Sample Gym Overload Clip</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-5 border-t border-[#1f1f28] bg-[#0e0e13] flex items-center justify-between">
                    <p className="text-[11px] text-zinc-400">
                        <i className="bi bi-shield-lock-fill text-[#FF1E28] me-1"></i>
                        Uploaded video will be instantly accessible to Coach <strong className="text-white">Vikram Rathore</strong> for form validation.
                    </p>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isUploading}
                            className="px-4 py-2.5 rounded-xl bg-[#181820] hover:bg-[#20202a] border border-[#2c2c3d] text-zinc-300 hover:text-white font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleConfirmUpload}
                            disabled={isUploading || (mode === 'camera' && recordingStatus !== 'preview') || (mode === 'upload' && !filePreviewUrl)}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                    <span>Uploading & Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check2-circle text-base"></i>
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
