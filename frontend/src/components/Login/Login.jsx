import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginService from './LoginService';
import Toast from '../Toast/Toast';
import './Login.css';
import { validateEmail } from '../../utils/validation';

const Login = () => {
    const navigate = useNavigate();

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Toast Notification State
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    // Active Session State
    const [currentUser, setCurrentUser] = useState(() => LoginService.getCurrentUser());

    // Pending Trainer Approval State
    const [pendingApprovalData, setPendingApprovalData] = useState(null);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);

    // Forgot Password Modal State
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');

    // Google Sign-In State
    const [showGoogleModal, setShowGoogleModal] = useState(false);
    const [customGoogleEmail, setCustomGoogleEmail] = useState('');

    useEffect(() => {
        if (LoginService.isAuthenticated()) {
            setCurrentUser(LoginService.getCurrentUser());
        }

        // Check if redirected from registration as pending approval
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get('registered') === 'pending') {
                const regEmail = params.get('email') || '';
                setPendingApprovalData({
                    email: regEmail,
                    name: regEmail.split('@')[0] || 'Athlete',
                    trainer: 'Marcus Vance'
                });
                setToast({
                    show: true,
                    message: 'Registration received! Your account is currently awaiting trainer approval.',
                    type: 'warning'
                });
            }
        } catch (e) {
            console.warn('URL param parse error:', e);
        }
    }, []);

    // Form Submit Handler (Unified Single Sign-On)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setToast({ show: true, message: 'Please enter both Email and Password.', type: 'warning' });
            return;
        }

        const emailVal = validateEmail(email);
        if (!emailVal.valid) {
            setToast({ show: true, message: 'Please enter a valid Email address format.', type: 'warning' });
            return;
        }

        setIsLoading(true);

        try {
            const result = await LoginService.login({ email: email.trim(), password });

            if (result.success) {
                const user = LoginService.getCurrentUser() || result.data?.user;
                setCurrentUser(user);
                
                // Direct the user according to their authoritative credentials/role
                const actualRole = (user?.role || '').toLowerCase();
                const destination = user?.redirect_url || result.data?.redirect_url || (
                    actualRole === 'admin' ? '/admin-dashboard' :
                    actualRole === 'trainer' ? '/trainer-dashboard' :
                    '/member-dashboard'
                );

                const roleBadge = actualRole === 'admin' ? 'Administrator' : actualRole === 'trainer' ? 'Coach' : 'Athlete';

                setToast({
                    show: true,
                    message: `Authentication verified! Welcome, ${user?.name || 'User'} (${roleBadge}).`,
                    type: 'success'
                });

                setTimeout(() => {
                    navigate(destination);
                }, 600);
            } else if (result.isPendingApproval) {
                setPendingApprovalData({
                    email: result.email || email,
                    name: result.name || (email ? email.split('@')[0] : 'Athlete'),
                    trainer: 'Marcus Vance'
                });
                setToast({
                    show: true,
                    message: 'Your athlete account is awaiting verification by your assigned trainer.',
                    type: 'warning'
                });
            } else {
                setToast({
                    show: true,
                    message: result.error || 'Invalid email or password.',
                    type: 'error'
                });
            }
        } catch (err) {
            setToast({
                show: true,
                message: err.response?.data?.message || err.response?.data?.detail || 'Invalid email or password. Please verify your credentials.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Check Approval Status Handler
    const handleCheckStatus = async () => {
        if (!pendingApprovalData?.email) return;
        setIsCheckingStatus(true);
        try {
            const res = await LoginService.checkApprovalStatus(pendingApprovalData.email);
            if (res.is_approved) {
                setToast({
                    show: true,
                    message: '🎉 Athlete account approved by your coach! Accessing performance zone...',
                    type: 'success'
                });
                await LoginService.loginWithGoogle({
                    email: pendingApprovalData.email,
                    name: pendingApprovalData.name,
                    role: 'member'
                });
                setTimeout(() => {
                    navigate('/member-dashboard');
                }, 1000);
            } else {
                setToast({
                    show: true,
                    message: '⏳ Account is still under review by Coach Marcus Vance. Please check back shortly.',
                    type: 'warning'
                });
            }
        } catch (e) {
            setToast({ show: true, message: 'Status check failed. Please try again.', type: 'error' });
        } finally {
            setIsCheckingStatus(false);
        }
    };

    // Logout Handler
    const handleLogout = () => {
        LoginService.logout();
        setCurrentUser(null);
        setToast({
            show: true,
            message: 'Session terminated. You have been logged out.',
            type: 'info'
        });
    };

    // Forgot Password Submit
    const handleForgotSubmit = (e) => {
        e.preventDefault();
        if (!forgotEmail || !forgotEmail.trim()) {
            setToast({ show: true, message: 'Please enter your account email.', type: 'warning' });
            return;
        }
        const emailVal = validateEmail(forgotEmail);
        if (!emailVal.valid) {
            setToast({ show: true, message: 'Please enter a valid Email address format.', type: 'warning' });
            return;
        }
        setToast({
            show: true,
            message: `Password reset instructions sent to ${forgotEmail}`,
            type: 'success'
        });
        setShowForgotModal(false);
        setForgotEmail('');
    };

    // Google Sign-In Handler
    const handleGoogleSignIn = async (selectedEmail, selectedName) => {
        setIsLoading(true);
        setShowGoogleModal(false);
        try {
            const userEmail = selectedEmail || email || 'sarah.jenkins@omnifit.com';
            const userName = selectedName || (userEmail.split('@')[0]);
            const res = await LoginService.loginWithGoogle({
                email: userEmail,
                name: userName
            });
            if (res.success) {
                const authedUser = LoginService.getCurrentUser() || res.data?.user;
                const targetRole = (authedUser?.role || '').toLowerCase();
                const destination = authedUser?.redirect_url || (
                    targetRole === 'admin' ? '/admin-dashboard' :
                    targetRole === 'trainer' ? '/trainer-dashboard' :
                    '/member-dashboard'
                );

                setToast({
                    show: true,
                    message: `Google Authentication Verified! Welcome, ${authedUser?.name || 'User'}.`,
                    type: 'success'
                });
                setTimeout(() => {
                    navigate(destination);
                }, 600);
            } else if (res.isPendingApproval) {
                setPendingApprovalData({
                    email: userEmail,
                    name: res.name || userName,
                    trainer: 'Marcus Vance'
                });
                setToast({
                    show: true,
                    message: 'Your Google-linked athlete account is awaiting approval by your assigned trainer.',
                    type: 'warning'
                });
            } else {
                setToast({
                    show: true,
                    message: res.error || 'Google authentication failed.',
                    type: 'error'
                });
            }
        } catch (err) {
            setToast({ show: true, message: 'Google Authentication failed. Please retry.', type: 'danger' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="simple-login-container">

            {/* Toast Banner */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />

            {/* TOP NAVBAR HEADER */}
            <header className="simple-login-navbar">
                <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <div className="brand-bolt-icon">
                        <i className="bi bi-lightning-fill"></i>
                    </div>
                    <span className="brand-name">OMNIFIT</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <button
                        className="btn btn-sm btn-outline-dark rounded-pill px-3 fw-bold"
                        onClick={() => navigate('/')}
                        data-testid="login-home-btn"
                    >
                        <i className="bi bi-house-door-fill me-1"></i> HOME
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="simple-login-main">
                <div className="simple-login-card">

                    {/* TOP ACCENT BADGE */}
                    <div className="top-bolt-badge">
                        <i className="bi bi-lightning-fill"></i>
                    </div>

                    {currentUser ? (
                        /* ACTIVE SESSION CARD */
                        <div className="active-session-box text-center">
                            <h1 className="login-card-title">SESSION ACTIVE</h1>
                            <p className="login-card-subtitle">You are logged in to OMNIFIT Ecosystem</p>

                            <div className="p-3 my-3 bg-light rounded-4 border text-start">
                                <div className="d-flex align-items-center mb-2">
                                    <span className="badge bg-dark text-uppercase px-3 py-2 me-2">
                                        {currentUser.role || 'MEMBER'}
                                    </span>
                                    <span className="text-success fw-bold small">
                                        ● ONLINE
                                    </span>
                                </div>
                                <div className="fw-bold fs-6 text-dark">{currentUser.name || 'OMNIFIT User'}</div>
                                <div className="text-muted small">{currentUser.email}</div>
                            </div>

                            <div className="d-grid gap-2 mt-4">
                                <button
                                    type="button"
                                    className="btn-initialize-session mb-2"
                                    data-testid="goto-dashboard-btn"
                                    onClick={() => {
                                        const userRole = (currentUser?.role || 'member').toLowerCase();
                                        if (userRole === 'admin') navigate('/admin-dashboard');
                                        else if (userRole === 'trainer') navigate('/trainer-dashboard');
                                        else navigate('/member-dashboard');
                                    }}
                                >
                                    GO TO DASHBOARD <i className="bi bi-speedometer2 ms-2"></i>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-danger rounded-pill py-2 fw-bold"
                                    onClick={handleLogout}
                                    data-testid="logout-btn"
                                >
                                    LOGOUT SESSION
                                </button>
                            </div>
                        </div>
                    ) : pendingApprovalData ? (
                        /* PENDING TRAINER APPROVAL SCREEN */
                        <div className="pending-approval-view animate-fade-in text-center py-2" data-testid="pending-approval-screen">
                            {/* Animated Clock / Verification Icon */}
                            <div className="mx-auto mb-3 w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                <i className="bi bi-clock-history animate-pulse"></i>
                            </div>

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                                Awaiting Trainer Approval
                            </div>

                            <h1 className="login-card-title mb-1 text-2xl font-black text-white">ACCOUNT UNDER REVIEW</h1>
                            <p className="login-card-subtitle text-xs text-slate-400 mb-4">
                                Welcome, <strong className="text-white">{pendingApprovalData.name || 'Athlete'}</strong>! Your registration is currently awaiting verification by your assigned coach before you can access the OMNIFIT Performance Zone.
                            </p>

                            {/* Verification Summary Card */}
                            <div className="p-3.5 mb-3 rounded-2xl bg-[#121212] border border-slate-800 text-start space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-semibold">Registered Email:</span>
                                    <span className="text-white font-bold">{pendingApprovalData.email}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-semibold">Assigned Trainer:</span>
                                    <span className="text-[#00F29D] font-bold">Marcus Vance</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-semibold">Clearance Status:</span>
                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black">
                                        ⏳ Pending Trainer Approval
                                    </span>
                                </div>
                            </div>

                            {/* Email Dispatch Notice */}
                            <div className="p-3 mb-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 text-start">
                                <div className="w-8 h-8 rounded-lg bg-[#00F29D]/15 border border-[#00F29D]/30 text-[#00F29D] flex items-center justify-center shrink-0 text-base mt-0.5">
                                    <i className="bi bi-envelope-check-fill"></i>
                                </div>
                                <div className="text-[11px] text-slate-300 leading-snug">
                                    <strong className="text-white block font-bold">Automated Email Notification</strong>
                                    You will receive a confirmation email at <strong>{pendingApprovalData.email}</strong> the moment your trainer approves your account.
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={handleCheckStatus}
                                    disabled={isCheckingStatus}
                                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00F29D] to-[#00c982] hover:from-[#00F29D] hover:to-[#00F29D] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,242,157,0.3)] transition-all cursor-pointer"
                                    data-testid="check-approval-btn"
                                >
                                    {isCheckingStatus ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                            Checking Approval Status...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-arrow-repeat text-sm font-black"></i>
                                            Check Approval Status
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPendingApprovalData(null)}
                                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                                    data-testid="back-to-login-btn"
                                >
                                    ← Back to Login Screen
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* LOGIN FORM */
                        <>
                            {/* TITLE & SUBTITLE */}
                            <h1 className="login-card-title">LOGIN</h1>
                            <p className="login-card-subtitle">Enter the performance zone</p>



                            {/* LOGIN FORM */}
                            <form onSubmit={handleSubmit} noValidate>

                                {/* IDENTITY (EMAIL) */}
                                <div className="form-group mb-3 text-start">
                                    <label className="form-label-custom">IDENTITY</label>
                                    <div className="custom-input-box">
                                        <span className="input-icon">@</span>
                                        <input
                                            type="text"
                                            className="custom-input"
                                            placeholder="Name or Email Address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoComplete="username"
                                            data-testid="login-email-input"
                                        />
                                    </div>
                                </div>

                                {/* ACCESS CODE (PASSWORD) */}
                                <div className="form-group mb-4 text-start">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <label className="form-label-custom mb-0">ACCESS CODE</label>
                                        <button
                                            type="button"
                                            className="forgot-link-btn"
                                            onClick={() => setShowForgotModal(true)}
                                        >
                                            FORGOT?
                                        </button>
                                    </div>
                                    <div className="custom-input-box">
                                        <span className="input-icon">
                                            <i className="bi bi-lock"></i>
                                        </span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="custom-input"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            autoComplete="current-password"
                                            data-testid="login-password-input"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <button
                                    type="submit"
                                    className="btn-initialize-session"
                                    disabled={isLoading}
                                    data-testid="login-submit-button"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            LOGGING IN...
                                        </>
                                    ) : (
                                        <>
                                            LOG IN <i className="bi bi-arrow-right ms-2"></i>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* GOOGLE LOGIN BUTTON */}
                            <div className="mt-3">
                                <button
                                    type="button"
                                    className="btn-google-login"
                                    onClick={() => setShowGoogleModal(true)}
                                >
                                    <svg className="google-svg me-2" width="18" height="18" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                    </svg>
                                    CONTINUE WITH GOOGLE
                                </button>
                            </div>

                            {/* SIGN UP FOOTER LINK */}
                            <div className="login-card-footer mt-4">
                                <span>New to OMNIFIT? </span>
                                <a
                                    href="/register"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/register');
                                    }}
                                    className="signup-link"
                                >
                                    Sign Up
                                </a>
                            </div>
                        </>
                    )}

                </div>
            </main>

            {/* PAGE FOOTER */}
            <footer className="simple-login-footer">
                <h4 className="footer-brand">OMNIFIT AI</h4>
                <p className="footer-copyright">
                    © 2024 OMNIFIT AI. ENGINEERED FOR PERFORMANCE.
                </p>
                <div className="footer-links">
                    <a href="#privacy">Privacy</a>
                    <a href="#terms">Terms</a>
                    <a href="#support">Support</a>
                </div>
            </footer>

            {/* FORGOT PASSWORD MODAL */}
            {showForgotModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 p-3 shadow-2xl bg-dark-900 text-white" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="modal-header border-0 pb-1">
                                <h5 className="modal-title fw-bold text-white">Reset Access Code</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowForgotModal(false)}></button>
                            </div>
                            <form onSubmit={handleForgotSubmit}>
                                <div className="modal-body">
                                    <p className="text-secondary small">
                                        Enter your registered email address below to receive password reset instructions.
                                    </p>
                                    <input
                                        type="email"
                                        className="form-control bg-dark text-white border-secondary"
                                        style={{ background: '#1E1E1E', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
                                        placeholder="Enter your email"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowForgotModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-danger btn-sm fw-bold" style={{ background: 'var(--iron-red)' }}>
                                        Send Link
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* GOOGLE SIGN-IN MODAL */}
            {showGoogleModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px' }}>
                        <div className="modal-content rounded-3 border-0 shadow-2xl p-4 text-start" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}>
                            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                                <div className="d-flex align-items-center gap-2">
                                    <svg width="22" height="22" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                    </svg>
                                    <span className="fw-bold fs-6">Sign in with Google</span>
                                </div>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowGoogleModal(false)}></button>
                            </div>

                            <p className="small text-secondary mb-3">
                                Choose a Google account to continue to <strong>OMNIFIT</strong>
                            </p>

                            {/* Saved Accounts List */}
                            <div className="d-flex flex-col gap-2 mb-3">
                                {/* Option 1: Jagan */}
                                <button
                                    type="button"
                                    onClick={() => handleGoogleSignIn('jagan@gmail.com', 'Jagan')}
                                    className="d-flex align-items-center gap-3 p-2.5 rounded-3 border text-start w-100 transition-all hover-opacity"
                                    style={{ background: '#222', borderColor: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}
                                >
                                    <div className="w-8 h-8 rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold text-sm">
                                        J
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <div className="text-white fw-bold small">Jagan</div>
                                        <div className="text-secondary small text-truncate">jagan@gmail.com</div>
                                    </div>
                                    <i className="bi bi-chevron-right text-secondary small"></i>
                                </button>

                                {/* Option 2: Current Typed Email if different */}
                                {email && email.toLowerCase() !== 'jagan@gmail.com' && (
                                    <button
                                        type="button"
                                        onClick={() => handleGoogleSignIn(email, email.split('@')[0])}
                                        className="d-flex align-items-center gap-3 p-2.5 rounded-3 border text-start w-100 transition-all"
                                        style={{ background: '#222', borderColor: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}
                                    >
                                        <div className="w-8 h-8 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold text-sm">
                                            {email.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <div className="text-white fw-bold small">{email.split('@')[0]}</div>
                                            <div className="text-secondary small text-truncate">{email}</div>
                                        </div>
                                        <i className="bi bi-chevron-right text-secondary small"></i>
                                    </button>
                                )}

                                {/* Option 3: Athlete Demo */}
                                <button
                                    type="button"
                                    onClick={() => handleGoogleSignIn('alex.mercer@gmail.com', 'Alex Mercer')}
                                    className="d-flex align-items-center gap-3 p-2.5 rounded-3 border text-start w-100 transition-all"
                                    style={{ background: '#222', borderColor: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}
                                >
                                    <div className="w-8 h-8 rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold text-sm">
                                        A
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <div className="text-white fw-bold small">Alex Mercer</div>
                                        <div className="text-secondary small text-truncate">alex.mercer@gmail.com</div>
                                    </div>
                                    <i className="bi bi-chevron-right text-secondary small"></i>
                                </button>
                            </div>

                            {/* Custom Email Input */}
                            <div className="pt-2 border-top border-secondary border-opacity-25">
                                <label className="text-secondary small mb-1 block">Or use another Gmail address:</label>
                                <div className="input-group input-group-sm mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        style={{ background: '#1c1c1c', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
                                        placeholder="user@gmail.com"
                                        value={customGoogleEmail}
                                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-danger fw-bold"
                                        style={{ background: 'var(--iron-red)' }}
                                        onClick={() => {
                                            if (!customGoogleEmail) return;
                                            handleGoogleSignIn(customGoogleEmail);
                                        }}
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm w-100"
                                    onClick={() => setShowGoogleModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Login;

