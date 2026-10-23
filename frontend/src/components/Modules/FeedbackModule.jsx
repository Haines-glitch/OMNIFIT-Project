import React, { useState } from 'react';
import { validateText } from '../../utils/validation';

const FeedbackModule = ({ theme = 'light' }) => {
    const isLight = theme === 'light';
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [category, setCategory] = useState('Trainer Performance');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submittedAlert, setSubmittedAlert] = useState(false);
    const [validationError, setValidationError] = useState('');

    const [feedbacks, setFeedbacks] = useState([
        {
            id: 'FB-104',
            category: 'Trainer Performance',
            subject: 'Great guidance on Bench Press form',
            rating: 5,
            status: 'Reviewed',
            date: '2026-08-08',
            response: 'Thank you Alex! Trainer Marcus Vance has been notified of your review.'
        },
        {
            id: 'FB-103',
            category: 'AI Workout Plan',
            subject: 'Calorie targets auto-adjust smoothly',
            rating: 5,
            status: 'Reviewed',
            date: '2026-08-05',
            response: 'Awesome! The AI Hypertrophy engine continuously recalibrates your goals.'
        },
        {
            id: 'FB-102',
            category: 'Equipment & Tech',
            subject: 'Facial recognition check-in is super fast',
            rating: 4,
            status: 'Resolved',
            date: '2026-07-28',
            response: 'Glad to hear! Terminal 2 camera speed was recently upgraded.'
        }
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError('');

        // 1. Subject validation
        const subVal = validateText(subject, 'Subject / Headline', 3, 100);
        if (!subVal.valid) {
            setValidationError(subVal.message);
            setTimeout(() => setValidationError(''), 5000);
            return;
        }

        // 2. Message validation (at least 10 chars)
        const msgVal = validateText(message, 'Detailed Comments', 10, 1000);
        if (!msgVal.valid) {
            setValidationError(msgVal.message);
            setTimeout(() => setValidationError(''), 5000);
            return;
        }

        const newFeedback = {
            id: `FB-${Math.floor(100 + Math.random() * 900)}`,
            category,
            subject: subject.trim(),
            rating,
            status: 'Under Review',
            date: new Date().toISOString().split('T')[0],
            response: 'Thank you for your feedback! Our management team will review it shortly.'
        };

        setFeedbacks([newFeedback, ...feedbacks]);
        setSubmittedAlert(true);
        setSubject('');
        setMessage('');
        setRating(5);

        setTimeout(() => {
            setSubmittedAlert(false);
        }, 4000);
    };

    return (
        <div className="vstack gap-4">
            {/* Header Banner */}
            <div className="p-4 rounded-4 position-relative overflow-hidden" style={{ background: isLight ? '#FFFFFF' : '#1E293B', border: `1px solid ${isLight ? '#E2E8F0' : '#334155'}`, boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.03)' : 'none' }}>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <span className="small fw-semibold text-uppercase tracking-wider d-block mb-1" style={{ color: '#10B981' }}>
                            MEMBER VOICE & ENGAGEMENT
                        </span>
                        <h3 className="fw-bold mb-1" style={{ color: isLight ? '#0F172A' : '#F8FAFC' }}>
                            Member Feedback & Support Hub
                        </h3>
                        <p className="small mb-0" style={{ color: isLight ? '#64748B' : '#E4E4E7' }}>
                            Share your feedback on assigned trainers, AI recommendations, or club facilities to help us serve you better.
                        </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: '#ECFDF5', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                            <i className="bi bi-shield-check me-1"></i>Direct Admin Link
                        </span>
                    </div>
                </div>
            </div>

            {submittedAlert && (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 font-bold flex items-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                    <i className="bi bi-check-circle-fill text-emerald-400 text-xl"></i>
                    <div>
                        <strong className="text-white block">Feedback Submitted Successfully!</strong>
                        <span className="text-xs text-emerald-300 font-medium">Your review has been logged and sent to the facility management team.</span>
                    </div>
                </div>
            )}

            <div className="row g-4">
                {/* Submit Feedback Form */}
                <div className="col-lg-5">
                    <div className="p-4 rounded-4 h-100" style={{ background: isLight ? '#FFFFFF' : '#1E293B', border: `1px solid ${isLight ? '#E2E8F0' : '#334155'}`, boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.03)' : 'none' }}>
                        <h5 className="fw-bold mb-3" style={{ color: isLight ? '#0F172A' : '#F8FAFC' }}>
                            <i className="bi bi-pencil-square me-2" style={{ color: '#10B981' }}></i>Submit New Feedback
                        </h5>

                        <form onSubmit={handleSubmit} className="vstack gap-3">
                            {validationError && (
                                <div className="alert alert-warning d-flex align-items-center py-2 px-3 rounded-3 small text-dark mb-0">
                                    <i className="bi bi-exclamation-triangle-fill me-2 text-warning"></i>
                                    <span>{validationError}</span>
                                </div>
                            )}
                            <div>
                                <label className="form-label small fw-semibold" style={{ color: isLight ? '#64748B' : '#E4E4E7' }}>Feedback Category</label>
                                <select
                                    className="form-select rounded-3 p-2.5"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={{ background: isLight ? '#F8FAFC' : '#0F172A', border: `1px solid ${isLight ? '#E2E8F0' : '#334155'}`, color: isLight ? '#0F172A' : '#F8FAFC' }}
                                >
                                    <option value="Trainer Performance">Trainer Performance (Marcus Vance)</option>
                                    <option value="AI Workout Plan">AI Workout Plan & Exercises</option>
                                    <option value="AI Diet Plan">AI Diet & Nutrition Macros</option>
                                    <option value="Facility Cleanliness">Facility Cleanliness & Amenities</option>
                                    <option value="Equipment & Tech">Equipment & Contactless Check-In</option>
                                    <option value="General Suggestion">General Suggestion / Support</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label small fw-semibold" style={{ color: isLight ? '#64748B' : '#E4E4E7' }}>Rating</label>
                                <div className="d-flex align-items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            className="btn btn-link p-0 border-0 fs-4 text-decoration-none"
                                            style={{ color: (hoverRating || rating) >= star ? '#F59E0B' : (isLight ? '#CBD5E1' : '#475569'), transition: 'color 0.15s ease' }}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                        >
                                            <i className="bi bi-star-fill"></i>
                                        </button>
                                    ))}
                                    <span className="ms-2 small fw-bold" style={{ color: isLight ? '#0F172A' : '#F8FAFC' }}>
                                        {rating} / 5 Stars
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="form-label small fw-semibold" style={{ color: isLight ? '#64748B' : '#E4E4E7' }}>Subject / Headline</label>
                                <input
                                    type="text"
                                    className="form-control rounded-3 p-2.5"
                                    placeholder="e.g. Excellent guidance during bench press"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                    style={{ background: isLight ? '#F8FAFC' : '#0F172A', border: `1px solid ${isLight ? '#E2E8F0' : '#334155'}`, color: isLight ? '#0F172A' : '#F8FAFC' }}
                                />
                            </div>

                            <div>
                                <label className="form-label small fw-semibold" style={{ color: isLight ? '#64748B' : '#E4E4E7' }}>Detailed Comments</label>
                                <textarea
                                    className="form-control rounded-3 p-2.5"
                                    rows="4"
                                    placeholder="Share your detailed feedback or suggestions here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    style={{ background: isLight ? '#F8FAFC' : '#0F172A', border: `1px solid ${isLight ? '#E2E8F0' : '#334155'}`, color: isLight ? '#0F172A' : '#F8FAFC' }}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn text-white fw-bold py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2 mt-2"
                                style={{ background: '#10B981', border: 'none' }}
                            >
                                <i className="bi bi-send-fill"></i>Submit Member Feedback
                            </button>
                        </form>
                    </div>
                </div>

                {/* Submitted Feedback History */}
                <div className="col-lg-7">
                    <div className="p-4 rounded-4 h-100" style={{ background: isLight ? '#FFFFFF' : '#1E293B', border: `1px solid ${isLight ? '#E2E8F0' : '#334155'}`, boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.03)' : 'none' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0" style={{ color: isLight ? '#0F172A' : '#F8FAFC' }}>
                                <i className="bi bi-clock-history me-2" style={{ color: '#10B981' }}></i>My Submitted Feedbacks
                            </h5>
                            <span className="small text-uppercase fw-semibold" style={{ color: isLight ? '#64748B' : '#CBD5E1' }}>
                                {feedbacks.length} Submissions
                            </span>
                        </div>

                        <div className="vstack gap-3" style={{ maxHeight: '480px', overflowY: 'auto' }}>
                            {feedbacks.map((fb) => (
                                <div key={fb.id} className="p-3 rounded-3" style={{ background: isLight ? '#F8FAFC' : '#0F172A', border: `1px solid ${isLight ? '#E2E8F0' : '#334155'}` }}>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <span className="badge rounded-pill fw-semibold me-2 px-2.5 py-1" style={{ background: '#ECFDF5', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                                                {fb.category}
                                            </span>
                                            <span className="small text-zinc-300 font-medium">{fb.id} • {fb.date}</span>
                                        </div>
                                        <span
                                            className="badge rounded-pill px-2.5 py-1 fw-semibold"
                                            style={{
                                                background: fb.status === 'Reviewed' || fb.status === 'Resolved' ? '#ECFDF5' : '#FFFBEB',
                                                color: fb.status === 'Reviewed' || fb.status === 'Resolved' ? '#10B981' : '#D97706',
                                                border: `1px solid ${fb.status === 'Reviewed' || fb.status === 'Resolved' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(217, 119, 6, 0.3)'}`
                                            }}
                                        >
                                            {fb.status}
                                        </span>
                                    </div>

                                    <h6 className="fw-bold mb-1" style={{ color: isLight ? '#0F172A' : '#F8FAFC' }}>{fb.subject}</h6>

                                    <div className="d-flex align-items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <i
                                                key={i}
                                                className="bi bi-star-fill small"
                                                style={{ color: i < fb.rating ? '#F59E0B' : (isLight ? '#CBD5E1' : '#475569') }}
                                            ></i>
                                        ))}
                                        <span className="small ms-1" style={{ color: isLight ? '#64748B' : '#CBD5E1' }}>({fb.rating}/5)</span>
                                    </div>

                                    {fb.response && (
                                        <div className="p-2.5 rounded-3 mt-2 small" style={{ background: isLight ? '#FFFFFF' : '#1E293B', borderLeft: '3px solid #10B981', color: isLight ? '#475569' : '#CBD5E1', border: isLight ? '1px solid #E2E8F0' : 'none', borderLeftColor: '#10B981' }}>
                                            <strong style={{ color: isLight ? '#0F172A' : '#F8FAFC' }}><i className="bi bi-reply-fill me-1" style={{ color: '#10B981' }}></i>Management Response: </strong>
                                            {fb.response}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModule;
