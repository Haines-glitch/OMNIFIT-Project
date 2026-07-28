import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-vh-100 bg-black text-white d-flex align-items-center justify-content-center p-4">
            <div className="glass-panel text-center p-5 max-w-md animate-fade-in" style={{ maxWidth: '480px' }}>
                <div className="text-danger mb-3" style={{ fontSize: '4rem' }}>
                    <i className="bi bi-shield-lock-fill"></i>
                </div>
                <h2 className="fw-bold text-white mb-2">Access Restricted</h2>
                <p className="text-muted small mb-4">
                    You do not have the required security permissions or role to view this OMNIFIT module.
                </p>
                <button onClick={() => navigate('/')} className="btn btn-emerald w-100">
                    <i className="bi bi-arrow-left me-2"></i>Return to Login
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
