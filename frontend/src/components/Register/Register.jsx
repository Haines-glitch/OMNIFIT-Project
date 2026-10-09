import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginService from '../Login/LoginService';
import Toast from '../Toast/Toast';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();

    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('Male');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [fitnessGoal, setFitnessGoal] = useState('Strength Training');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Toast Notification State
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    // Active Session State
    const [currentUser, setCurrentUser] = useState(() => LoginService.getCurrentUser());

    useEffect(() => {
        if (LoginService.isAuthenticated()) {
            setCurrentUser(LoginService.getCurrentUser());
        }
    }, []);

    // Form Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validations
        if (!fullName.trim()) {
            setToast({ show: true, message: 'Please enter your Full Name.', type: 'warning' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setToast({ show: true, message: 'Please enter your Email address.', type: 'warning' });
            return;
        }
        if (!emailRegex.test(email.trim())) {
            setToast({ show: true, message: 'Please enter a valid Email address format.', type: 'warning' });
            return;
        }

        if (phone.trim()) {
            const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
            if (!phoneRegex.test(phone.trim()) || phone.trim().length < 7) {
                setToast({ show: true, message: 'Please enter a valid Phone number.', type: 'warning' });
                return;
            }
        }

        if (!password) {
            setToast({ show: true, message: 'Please enter a Password.', type: 'warning' });
            return;
        }

        if (password.length < 8) {
            setToast({ show: true, message: 'Password must be at least 8 characters long.', type: 'warning' });
            return;
        }

        if (password !== confirmPassword) {
            setToast({ show: true, message: 'Passwords do not match.', type: 'error' });
            return;
        }

        if (!agreeTerms) {
            setToast({ show: true, message: 'You must agree to the Terms of Service and Privacy Policy.', type: 'warning' });
            return;
        }

        setIsLoading(true);

        try {
            const userData = {
                full_name: fullName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                date_of_birth: dateOfBirth,
                gender,
                age,
                height,
                weight,
                fitness_goal: fitnessGoal,
                password
            };

            const result = await LoginService.register(userData);

            if (result.success) {
                setToast({
                    show: true,
                    message: "Registration successful. Please login.",
                    type: 'success'
                });

                // Redirect newly registered member to /login
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.email?.[0]
                || err.response?.data?.password?.[0]
                || err.response?.data?.message
                || 'Registration failed. Please check your details and try again.';
            setToast({
                show: true,
                message: errorMsg,
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
            message: 'Session terminated. You can now register a new account.',
            type: 'info'
        });
    };

    return (
        <div className="simple-register-container">

            {/* Toast Banner */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />

            {/* TOP NAVBAR HEADER */}
            <header className="simple-register-navbar">
                <div className="register-navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
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
                    {currentUser && (
                        <div className="navbar-avatar">
                            <img
                                src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                                alt="User Avatar"
                            />
                        </div>
                    )}
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="simple-register-main">
                <div className="simple-register-card">

                    {/* TOP ACCENT BADGE */}
                    <div className="top-bolt-badge">
                        <i className="bi bi-person-plus-fill"></i>
                    </div>

                    {currentUser ? (
                        /* ACTIVE SESSION CARD */
                        <div className="active-session-box text-center">
                            <h1 className="register-card-title">SESSION ACTIVE</h1>
                            <p className="register-card-subtitle">You are logged in to OMNIFIT Ecosystem</p>

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
                                    onClick={() => navigate('/')}
                                >
                                    RETURN TO HOMEPAGE <i className="bi bi-arrow-right ms-2"></i>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-danger rounded-pill py-2 fw-bold"
                                    onClick={handleLogout}
                                >
                                    LOGOUT TO REGISTER NEW ACCOUNT
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* REGISTER FORM */
                        <>
                            {/* TITLE & SUBTITLE */}
                            <h1 className="register-card-title">CREATE MEMBER ACCOUNT</h1>
                            <p className="register-card-subtitle">Join the OMNIFIT high-performance health club ecosystem</p>

                            {/* REGISTER FORM */}
                            <form onSubmit={handleSubmit} noValidate>

                                {/* FULL NAME */}
                                <div className="form-group mb-3 text-start">
                                    <label className="form-label-custom">FULL NAME *</label>
                                    <div className="custom-input-box">
                                        <span className="input-icon">
                                            <i className="bi bi-person"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="custom-input"
                                            placeholder="John Doe"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
                                            required
                                            autoComplete="name"
                                            data-testid="register-fullname-input"
                                        />
                                    </div>
                                </div>

                                {/* IDENTITY (EMAIL) */}
                                <div className="form-group mb-3 text-start">
                                    <label className="form-label-custom">EMAIL ADDRESS *</label>
                                    <div className="custom-input-box">
                                        <span className="input-icon">@</span>
                                        <input
                                            type="email"
                                            className="custom-input"
                                            placeholder="athlete@omnifit.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoComplete="email"
                                            data-testid="register-email-input"
                                        />
                                    </div>
                                </div>

                                {/* PHONE NUMBER */}
                                <div className="form-group mb-3 text-start">
                                    <label className="form-label-custom">PHONE NUMBER</label>
                                    <div className="custom-input-box">
                                        <span className="input-icon">
                                            <i className="bi bi-telephone"></i>
                                        </span>
                                        <input
                                            type="tel"
                                            className="custom-input"
                                            placeholder="+1 (555) 000-0000"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            autoComplete="tel"
                                        />
                                    </div>
                                </div>

                                {/* DATE OF BIRTH & GENDER ROW */}
                                <div className="row g-2 mb-3">
                                    <div className="col-md-6 text-start">
                                        <label className="form-label-custom">DATE OF BIRTH</label>
                                        <div className="custom-input-box">
                                            <input
                                                type="date"
                                                className="custom-input px-3"
                                                value={dateOfBirth}
                                                onChange={(e) => setDateOfBirth(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-start">
                                        <label className="form-label-custom">GENDER</label>
                                        <div className="custom-input-box">
                                            <select
                                                className="custom-input px-3 bg-transparent text-slate-800"
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* AGE, HEIGHT, WEIGHT ROW */}
                                <div className="row g-2 mb-3">
                                    <div className="col-md-4 text-start">
                                        <label className="form-label-custom">AGE</label>
                                        <div className="custom-input-box">
                                            <input
                                                type="number"
                                                className="custom-input px-3"
                                                placeholder="25"
                                                value={age}
                                                onChange={(e) => setAge(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-start">
                                        <label className="form-label-custom">HEIGHT (CM)</label>
                                        <div className="custom-input-box">
                                            <input
                                                type="number"
                                                className="custom-input px-3"
                                                placeholder="175"
                                                value={height}
                                                onChange={(e) => setHeight(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-start">
                                        <label className="form-label-custom">WEIGHT (KG)</label>
                                        <div className="custom-input-box">
                                            <input
                                                type="number"
                                                className="custom-input px-3"
                                                placeholder="70"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* FITNESS GOAL */}
                                <div className="form-group mb-3 text-start">
                                    <label className="form-label-custom">FITNESS GOAL</label>
                                    <div className="custom-input-box">
                                        <span className="input-icon">
                                            <i className="bi bi-trophy"></i>
                                        </span>
                                        <select
                                            className="custom-input bg-transparent"
                                            value={fitnessGoal}
                                            onChange={(e) => setFitnessGoal(e.target.value)}
                                        >
                                            <option value="Weight Loss">Weight Loss</option>
                                            <option value="Strength Training">Strength Training</option>
                                            <option value="Hypertrophy & Muscle Gain">Hypertrophy & Muscle Gain</option>
                                            <option value="Cardio & Endurance">Cardio & Endurance</option>
                                            <option value="General Health">General Health</option>
                                        </select>
                                    </div>
                                </div>

                                {/* ACCESS CODE (PASSWORD) */}
                                <div className="form-group mb-3 text-start">
                                    <label className="form-label-custom">PASSWORD *</label>
                                    <div className="custom-input-box">
                                        <span className="input-icon">
                                            <i className="bi bi-lock"></i>
                                        </span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="custom-input"
                                            placeholder="Min. 8 characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            autoComplete="new-password"
                                            data-testid="register-password-input"
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

                                {/* CONFIRM PASSWORD */}
                                <div className="form-group mb-3 text-start">
                                    <label className="form-label-custom">CONFIRM PASSWORD *</label>
                                    <div className="custom-input-box">
                                        <span className="input-icon">
                                            <i className="bi bi-shield-lock"></i>
                                        </span>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className="custom-input"
                                            placeholder="Re-enter password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            autoComplete="new-password"
                                            data-testid="register-confirm-password-input"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>                                 {/* TERMS & CONDITIONS CHECKBOX */}
                                <div className="terms-checkbox-box">
                                    <input
                                        type="checkbox"
                                        id="termsCheck"
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                        data-testid="register-terms-checkbox"
                                    />
                                    <label htmlFor="termsCheck" className="terms-label">
                                        I agree to the <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> & <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
                                    </label>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <button
                                    type="submit"
                                    className="btn-initialize-session"
                                    disabled={isLoading}
                                    data-testid="register-submit-button"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            CREATING ACCOUNT...
                                        </>
                                    ) : (
                                        <>
                                            REGISTER <i className="bi bi-arrow-right ms-2"></i>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* GOOGLE SIGN UP BUTTON */}
                            <div className="mt-3">
                                <button
                                    type="button"
                                    className="btn-google-login"
                                    onClick={() => setToast({ show: true, message: 'Google OAuth registration active for demo.', type: 'info' })}
                                >
                                    <svg className="google-svg me-2" width="18" height="18" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                    </svg>
                                    SIGN UP WITH GOOGLE
                                </button>
                            </div>

                            {/* LOG IN FOOTER LINK */}
                            <div className="register-card-footer mt-4">
                                <span>Already have an account? </span>
                                <a
                                    href="/login"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/login');
                                    }}
                                    className="login-link"
                                >
                                    Log In
                                </a>
                            </div>
                        </>
                    )}

                </div>
            </main>

            {/* PAGE FOOTER */}
            <footer className="simple-register-footer">
                <h4 className="footer-brand">OMNIFIT AI</h4>
                <p className="footer-copyright">
                    © 2024 OMNIFIT AI. ENGINEERED FOR PERFORMANCE.
                </p>
                <div className="footer-links">
                    <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a>
                    <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a>
                    <a href="#support" onClick={(e) => e.preventDefault()}>Support</a>
                </div>
            </footer>

        </div>
    );
};

export default Register;
