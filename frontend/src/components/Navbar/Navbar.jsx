import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginService from '../Login/LoginService';

const Navbar = ({ title }) => {
    const navigate = useNavigate();
    const user = LoginService.getCurrentUser();
    const role = LoginService.getUserRole();

    const handleLogout = () => {
        LoginService.logout();
        navigate('/');
    };

    const getRoleBadge = () => {
        switch (role) {
            case 'admin':
                return { bg: '#ef4444', color: '#ffffff', label: 'SYSTEM ADMIN' };
            case 'trainer':
                return { bg: '#f59e0b', color: '#000000', label: 'AI TRAINER' };
            default:
                return { bg: '#FFFFFF', color: '#000000', label: 'HEALTH MEMBER' };
        }
    };

    const badge = getRoleBadge();

    return (
        <nav className="navbar navbar-dark sticky-top glass-panel rounded-0 border-top-0 border-start-0 border-end-0 px-4 py-2 mb-4" style={{ background: 'rgba(17, 24, 39, 0.85)' }}>
            <div className="container-fluid d-flex align-items-center justify-content-between">

                {/* Brand */}
                <div className="d-flex align-items-center gap-3">
                    <div
                        className="rounded-3 d-flex align-items-center justify-content-center text-dark fw-bold"
                        style={{ width: '38px', height: '38px', background: 'var(--mono-gradient)' }}
                    >
                        <i className="bi bi-bounding-box-circles fs-5"></i>
                    </div>
                    <div>
                        <h5 className="fw-bold mb-0 text-white me-2 d-inline-block">OMNIFIT</h5>
                        <span className="badge rounded-pill" style={{ backgroundColor: badge.bg, color: badge.color, fontSize: '0.65rem' }}>
                            {badge.label}
                        </span>
                        <span className="text-muted d-none d-md-inline-block ms-3 small">| {title}</span>
                    </div>
                </div>

                {/* User Info & Actions */}
                <div className="d-flex align-items-center gap-3">
                    <div className="d-none d-sm-flex align-items-center gap-2">
                        <img
                            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                            alt="Profile"
                            className="rounded-circle border border-white"
                            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                        />
                        <div>
                            <div className="fw-semibold text-white small leading-tight">{user?.name || 'OMNIFIT User'}</div>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>{user?.email || 'user@omnifit.com'}</div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-3"
                        style={{ borderRadius: '8px' }}
                    >
                        <i className="bi bi-box-arrow-right"></i>
                        <span className="d-none d-sm-inline">Logout</span>
                    </button>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
