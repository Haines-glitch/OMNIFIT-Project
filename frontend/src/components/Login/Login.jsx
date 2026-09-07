import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginService from './LoginService';
import Toast from '../Toast/Toast';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('member');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Toast Notification State
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    // Active Session State
    const [currentUser, setCurrentUser] = useState(() => LoginService.getCurrentUser());

    // Forgot Password Modal State
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');

    useEffect(() => {
        if (LoginService.isAuthenticated()) {
            setCurrentUser(LoginService.getCurrentUser());
        }
    }, []);

    // Quick Demo Auto-fill Helper
    const fillDemoCredentials = (demoRole) => {
        setRole(demoRole);
        if (demoRole === 'trainer') {
            setEmail('trainer@omnifit.com');
            setPassword('TrainerPass123!');
        } else if (demoRole === 'admin') {
            setEmail('admin@omnifit.com');
            setPassword('AdminPass123!');
        } else {
            setEmail('member@omnifit.com');
            setPassword('MemberPass123!');
        }
        setToast({
            show: true,
            message: `Selected ${demoRole.toUpperCase()} demo credentials`,
            type: 'info'
        });
    };

    // Form Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setToast({ show: true, message: 'Please enter both Email and Password.', type: 'warning' });
            return;
        }

        setIsLoading(true);

        try {
            const result = await LoginService.login({ email, password, role });

            if (result.success) {
                const user = LoginService.getCurrentUser();
                setCurrentUser(user);
                setToast({
                    show: true,
                    message: `Authentication successful! Accessing ${role.toUpperCase()} Dashboard...`,
                    type: 'success'
                });

                setTimeout(() => {
                    if (role === 'admin') {
                        navigate('/admin-dashboard');
                    } else if (role === 'trainer') {
                        navigate('/trainer-dashboard');
                    } else {
                        navigate('/member-dashboard');
                    }
                }, 800);
            }
        } catch (err) {
            setToast({
                show: true,
                message: err.response?.data?.message || 'Invalid email, password, or role mismatch.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
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
        if (!forgotEmail) {
            setToast({ show: true, message: 'Please enter your account email.', type: 'warning' });
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
                                >
                                    LOGOUT SESSION
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* LOGIN FORM */
                        <>
                            {/* TITLE & SUBTITLE */}
                            <h1 className="login-card-title">LOGIN</h1>
                            <p className="login-card-subtitle">Enter the performance zone</p>

                            {/* DEMO ROLE SELECTION PILLS */}
                            <div className="role-selector-pills mb-4">
                                <button
                                    type="button"
                                    className={`role-pill ${role === 'member' ? 'active' : ''}`}
                                    onClick={() => fillDemoCredentials('member')}
                                >
                                    <i className="bi bi-person-fill me-1"></i> Member
                                </button>
                                <button
                                    type="button"
                                    className={`role-pill ${role === 'trainer' ? 'active' : ''}`}
                                    onClick={() => fillDemoCredentials('trainer')}
                                >
                                    <i className="bi bi-lightning-charge-fill me-1"></i> Trainer
                                </button>
                                <button
                                    type="button"
                                    className={`role-pill ${role === 'admin' ? 'active' : ''}`}
                                    onClick={() => fillDemoCredentials('admin')}
                                >
                                    <i className="bi bi-shield-lock-fill me-1"></i> Admin
                                </button>
                            </div>

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
                                    onClick={() => setToast({ show: true, message: 'Google OAuth authentication is active for demo.', type: 'info' })}
                                >
                                    <svg className="google-svg me-2" width="18" height="18" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                    </svg>
                                    GOOGLE
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
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 p-3 shadow-lg">
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">Reset Access Code</h5>
                                <button type="button" className="btn-close" onClick={() => setShowForgotModal(false)}></button>
                            </div>
                            <form onSubmit={handleForgotSubmit}>
                                <div className="modal-body">
                                    <p className="text-muted small">
                                        Enter your registered email address below to receive password reset instructions.
                                    </p>
                                    <input
                                        type="email"
                                        className="form-control bg-light text-dark border"
                                        placeholder="Enter your email"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-light" onClick={() => setShowForgotModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-dark fw-bold">
                                        Send Link
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

export default Login;

