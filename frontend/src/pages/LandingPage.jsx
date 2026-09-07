import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login');
    };

    const scrollToFeatures = () => {
        const element = document.getElementById('features-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="landing-page-container">

            {/* TOP NAVIGATION BAR */}
            <header className="landing-navbar">
                <div className="landing-nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <div className="nav-bolt-box">
                        <i className="bi bi-lightning-fill"></i>
                    </div>
                    <span className="nav-brand-text">OMNIFIT</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <button
                        className="btn btn-sm btn-outline-dark rounded-pill px-3 fw-bold me-1"
                        onClick={() => navigate('/login')}
                    >
                        LOGIN
                    </button>
                    <button className="btn-nav-get-started" onClick={() => navigate('/register')}>
                        REGISTER
                    </button>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="landing-hero-section">
                <div className="landing-hero-content">

                    {/* MAIN HEADLINE */}
                    <h1 className="hero-headline">
                        INITIALIZE<br />
                        YOUR<br />
                        <span className="gradient-highlight">PERFORMANCE</span>
                    </h1>

                    {/* SUBTITLE */}
                    <p className="hero-description">
                        The digital ecosystem for high-output athletes. Fusing metabolic bio-signals with proprietary AI to engineer your peak physical state.
                    </p>

                    {/* CALL TO ACTIONS */}
                    <div className="hero-actions">
                        <button className="btn-start-protocol" onClick={handleGetStarted}>
                            GET STARTED <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                        <button className="btn-explore-engine" onClick={scrollToFeatures}>
                            EXPLORE ENGINE
                        </button>
                    </div>

                </div>
            </section>

            {/* FEATURES STACK CARDS SECTION */}
            <section id="features-section" className="landing-cards-container">
                <div className="landing-cards-stack">

                    {/* CARD 1: METABOLIC SYNC */}
                    <div className="feature-card white-card">
                        <div className="feature-card-icon-badge">
                            <i className="bi bi-sliders"></i>
                        </div>
                        <h2 className="feature-card-title">METABOLIC SYNC</h2>
                        <p className="feature-card-text">
                            Real-time physiological feedback loops. We track your glucose, VO2 max, and HRV to adjust your output intensity on the fly.
                        </p>
                    </div>

                    {/* CARD 2: AI COACH INTERFACE (DARK GLASS CARD) */}
                    <div className="feature-card dark-terminal-card">
                        <div className="terminal-header-tag">
                            AI COACH INTERFACE
                        </div>
                        <div className="terminal-content-box">
                            <p className="terminal-code-text">
                                "Heart rate recovery is 12% faster than last session. Recommendation: Increase load by 5kg for final set."
                            </p>
                            <div className="terminal-ack-badge">
                                [ACKNOWLEDGED • INCREASING LOAD]
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: ADAPTIVE PLANS */}
                    <div className="feature-card grey-card">
                        <div className="card-image-wrapper">
                            <img
                                src="/images/landing_workout_gear.png"
                                alt="High-tech Gym Gear"
                                className="card-top-image"
                            />
                        </div>
                        <h2 className="feature-card-title mt-3">ADAPTIVE PLANS</h2>
                        <p className="feature-card-text">
                            Plans that evolve as you do. Never plateau with our dynamic resistance algorithms.
                        </p>
                    </div>

                    {/* CARD 4: FULL SPECTRUM ANALYTICS */}
                    <div className="feature-card white-card analytics-card">
                        <div className="analytics-subtitle-tag">
                            THE PULSE DASHBOARD
                        </div>
                        <h2 className="feature-card-title mb-3">FULL SPECTRUM ANALYTICS</h2>

                        <ul className="analytics-checklist mb-4">
                            <li>
                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                Neuromuscular Fatigue Analysis
                            </li>
                            <li>
                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                Sleep-to-Performance Correlation
                            </li>
                            <li>
                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                Precision Nutrition Windows
                            </li>
                        </ul>

                        <div className="card-image-wrapper">
                            <img
                                src="/images/landing_analytics_screen.png"
                                alt="Pulse Analytics Dashboard"
                                className="card-bottom-image"
                            />
                        </div>
                    </div>

                </div>
            </section>

            {/* CALL TO ACTION SECTION (DARK SECTION) */}
            <section className="landing-cta-dark-section">
                <div className="cta-content">
                    <h2 className="cta-headline">
                        BEYOND<br />
                        HUMAN<br />
                        LIMITS.
                    </h2>
                    <p className="cta-description">
                        Join the 0.1% of performers who use OMNIFIT to dominate their field. Engineered for those who refuse to settle.
                    </p>
                    <button className="btn-initialize-now" onClick={handleGetStarted}>
                        INITIALIZE NOW
                    </button>
                </div>
            </section>

            {/* PAGE FOOTER */}
            <footer className="landing-footer">
                <div className="footer-brand-header">
                    <div className="footer-bolt-box me-2">
                        <i className="bi bi-lightning-fill"></i>
                    </div>
                    <span className="footer-brand-title">OMNIFIT AI</span>
                </div>
                <p className="footer-copyright-text">
                    © 2024 OMNIFIT AI. ENGINEERED FOR PERFORMANCE.
                </p>
                <div className="footer-navigation-links">
                    <a href="#privacy">PRIVACY</a>
                    <a href="#terms">TERMS</a>
                    <a href="#support">SUPPORT</a>
                    <a href="#twitter">TWITTER</a>
                    <a href="#instagram">INSTAGRAM</a>
                </div>
                <div className="footer-bottom-accent-bar"></div>
            </footer>

        </div>
    );
};

export default LandingPage;
