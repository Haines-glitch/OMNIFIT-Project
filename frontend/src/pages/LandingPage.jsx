import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login');
    };

    const scrollToPrograms = () => {
        const element = document.getElementById('programs-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="iron-landing-page">

            {/* TOP NAVIGATION BAR */}
            <header className="iron-navbar">
                <div className="iron-nav-container">
                    {/* Brand */}
                    <div className="iron-brand" onClick={() => navigate('/')}>
                        <div className="iron-brand-icon">
                            <i className="bi bi-shield-shaded"></i>
                        </div>
                        <div className="iron-brand-text">
                            <span className="iron-title">OMNIFIT</span>
                            <span className="iron-subtitle">IRON DISTRICT</span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="iron-nav-links">
                        <a href="#hero" className="active">HOME</a>
                        <a href="#about">ABOUT</a>
                        <a href="#programs-section">TRAINING</a>
                        <a href="#coaches">COACHES</a>
                        <a href="#membership">PRICING</a>
                        <a href="#contact">CONTACT</a>
                    </nav>

                    {/* Auth Actions */}
                    <div className="iron-nav-actions">
                        <button
                            className="btn-iron-login"
                            onClick={() => navigate('/login')}
                        >
                            LOGIN
                        </button>
                        <button
                            className="btn-iron-primary"
                            onClick={() => navigate('/register')}
                        >
                            <span>START TRAINING</span>
                            <i className="bi bi-arrow-up-right"></i>
                        </button>
                    </div>
                </div>
            </header>

            {/* SECTION 1: HERO SECTION - "BUILT DIFFERENT" */}
            <section id="hero" className="iron-hero-section">
                <div className="hero-backdrop">
                    <img
                        src="/images/iron_district_hero.jpg"
                        alt="Iron District Elite Training"
                        className="hero-backdrop-img"
                    />
                    <div className="hero-gradient-overlay"></div>
                </div>

                <div className="iron-hero-container">
                    <div className="hero-left-column">
                        <h1 className="hero-massive-headline">
                            BUILT<br />
                            DIFFERENT<span className="dot-red">.</span>
                        </h1>

                        <div className="hero-red-brush"></div>

                        <div className="hero-subheaders">
                            <span className="sub-line sub-white">DISCIPLINE TODAY.</span>
                            <span className="sub-line sub-red">DOMINATE TOMORROW.</span>
                        </div>

                        <div className="hero-cta-group">
                            <button className="btn-iron-primary btn-hero-primary" onClick={handleGetStarted}>
                                <span>START TRAINING</span>
                                <i className="bi bi-arrow-up-right"></i>
                            </button>
                            <button className="btn-iron-video" onClick={scrollToPrograms}>
                                <div className="video-play-circle">
                                    <i className="bi bi-play-fill"></i>
                                </div>
                                <span>EXPLORE PROGRAMS</span>
                            </button>
                        </div>
                    </div>

                    {/* Hero Right Stat Column */}
                    <div className="hero-right-stats">
                        <div className="stat-brick">
                            <div className="stat-icon-red">
                                <i className="bi bi-hdd-rack-fill"></i>
                            </div>
                            <div className="stat-data">
                                <span className="stat-num">500+</span>
                                <span className="stat-lbl">ACTIVE MEMBERS</span>
                            </div>
                        </div>

                        <div className="stat-brick">
                            <div className="stat-icon-red">
                                <i className="bi bi-fire"></i>
                            </div>
                            <div className="stat-data">
                                <span className="stat-num">15+</span>
                                <span className="stat-lbl">EXPERT COACHES</span>
                            </div>
                        </div>

                        <div className="stat-brick">
                            <div className="stat-icon-red">
                                <i className="bi bi-trophy-fill"></i>
                            </div>
                            <div className="stat-data">
                                <span className="stat-num">10K+</span>
                                <span className="stat-lbl">TRANSFORMATIONS</span>
                            </div>
                        </div>

                        <div className="stat-brick">
                            <div className="stat-icon-red">
                                <i className="bi bi-lightning-charge-fill"></i>
                            </div>
                            <div className="stat-data">
                                <span className="stat-num">100%</span>
                                <span className="stat-lbl">DEDICATION</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: TRAINING PROGRAMS - "STRONGER EVERYDAY." */}
            <section id="programs-section" className="iron-programs-section">
                <div className="programs-container">
                    {/* Header Info */}
                    <div className="programs-header-grid">
                        <div className="programs-title-block">
                            <span className="section-eyebrow">TRAINING</span>
                            <h2 className="section-huge-title">
                                STRONGER<br />
                                EVERYDAY<span className="dot-red">.</span>
                            </h2>
                            <p className="programs-description">
                                World-class equipment, elite coaching, and an uncompromising AI community that pushes you to conquer your limits.
                            </p>
                            <button className="btn-iron-outline" onClick={handleGetStarted}>
                                <span>EXPLORE ALL PROTOCOLS</span>
                                <i className="bi bi-arrow-up-right"></i>
                            </button>
                        </div>

                        {/* 3x Program Cards Grid */}
                        <div className="programs-cards-grid">
                            {/* Card 1: Strength */}
                            <div className="iron-program-card" onClick={handleGetStarted}>
                                <div className="card-badge-red">
                                    <i className="bi bi-cone-striped"></i>
                                </div>
                                <div className="card-image-box">
                                    <img
                                        src="/images/program_strength.jpg"
                                        alt="Strength Training Program"
                                        className="card-bg-photo"
                                    />
                                    <div className="card-overlay-gradient"></div>
                                </div>
                                <div className="card-content-bottom">
                                    <h3 className="card-title">STRENGTH</h3>
                                    <p className="card-tagline">Build raw muscle. Lift heavy. Get results.</p>
                                    <div className="card-action-arrow">
                                        <i className="bi bi-arrow-up-right"></i>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Conditioning */}
                            <div className="iron-program-card" onClick={handleGetStarted}>
                                <div className="card-badge-red">
                                    <i className="bi bi-heart-pulse-fill"></i>
                                </div>
                                <div className="card-image-box">
                                    <img
                                        src="/images/program_conditioning.jpg"
                                        alt="Conditioning Endurance Program"
                                        className="card-bg-photo"
                                    />
                                    <div className="card-overlay-gradient"></div>
                                </div>
                                <div className="card-content-bottom">
                                    <h3 className="card-title">CONDITIONING</h3>
                                    <p className="card-tagline">Increase aerobic output. Push your limits.</p>
                                    <div className="card-action-arrow">
                                        <i className="bi bi-arrow-up-right"></i>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Personal Training */}
                            <div className="iron-program-card" onClick={handleGetStarted}>
                                <div className="card-badge-red">
                                    <i className="bi bi-person-fill"></i>
                                </div>
                                <div className="card-image-box">
                                    <img
                                        src="/images/program_coaching.jpg"
                                        alt="Personal Coaching Program"
                                        className="card-bg-photo"
                                    />
                                    <div className="card-overlay-gradient"></div>
                                </div>
                                <div className="card-content-bottom">
                                    <h3 className="card-title">PERSONAL COACHING</h3>
                                    <p className="card-tagline">1-on-1 NASM master coaching. 100% focused on you.</p>
                                    <div className="card-action-arrow">
                                        <i className="bi bi-arrow-up-right"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: CALL TO ACTION - "YOUR STRONGEST VERSION STARTS HERE" */}
            <section className="iron-cta-section">
                <div className="cta-backdrop">
                    <img
                        src="/images/iron_district_footer.jpg"
                        alt="Be Your Own Standard"
                        className="cta-backdrop-img"
                    />
                    <div className="cta-dark-wash"></div>
                </div>

                <div className="iron-cta-container">
                    <div className="cta-left-copy">
                        <h2 className="cta-giant-headline">
                            YOUR<br />
                            <span className="text-red">STRONGEST</span><br />
                            VERSION
                        </h2>
                        <div className="cta-brush-italic">
                            STARTS HERE.
                        </div>

                        <div className="cta-action-row">
                            <button className="btn-iron-primary btn-cta-primary" onClick={handleGetStarted}>
                                <span>JOIN NOW</span>
                                <i className="bi bi-arrow-up-right"></i>
                            </button>

                            <div className="members-social-proof">
                                <div className="avatar-stack">
                                    <span className="mini-av av-1"></span>
                                    <span className="mini-av av-2"></span>
                                    <span className="mini-av av-3"></span>
                                    <span className="mini-av av-4"></span>
                                </div>
                                <div className="proof-text">
                                    <span className="proof-title">JOIN 500+ ATHLETES</span>
                                    <span className="proof-sub">AND START YOUR JOURNEY</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="iron-footer">
                <div className="footer-top-strip">
                    <div className="footer-brand">
                        <i className="bi bi-shield-shaded text-crimson"></i>
                        <span className="footer-brand-name">OMNIFIT IRON DISTRICT</span>
                    </div>
                    <div className="footer-motto">
                        DISCIPLINE TODAY • DOMINATE TOMORROW
                    </div>
                    <div className="footer-links">
                        <a href="#terms">TERMS</a>
                        <a href="#privacy">PRIVACY</a>
                        <a href="#contact">SUPPORT</a>
                    </div>
                </div>
                <div className="footer-bottom-copy">
                    © 2026 OMNIFIT IRON DISTRICT. ALL RIGHTS RESERVED.
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;
